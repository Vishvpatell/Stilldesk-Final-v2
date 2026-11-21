import test from "node:test";
import assert from "node:assert/strict";
import { createController } from "../src/controllers";
import { WaitlistService } from "../src/services/waitlist-service";
import { confirmationEmail, welcomeEmail } from "../src/services/email-templates";
import { signToken } from "../src/lib/tokens";
import { MemoryLogger, MemoryRepo, RecordingMailer } from "./fakes";

const SECRET = "s".repeat(40);
const good = { name: "Asha Kumar", email: "asha@college.edu", consent: true, consentTextVersion: "consent-v1", source: "landing", company_website: "" };

function setup() {
  const repo = new MemoryRepo(), mailer = new RecordingMailer(), log = new MemoryLogger();
  let now = new Date("2026-11-20T10:00:00Z");
  const service = new WaitlistService(repo, mailer, { siteUrl: "https://site.test", apiUrl: "https://api.test", tokenSecret: SECRET, now: () => now }, log);
  return { repo, mailer, log, ctl: createController(service, { siteUrl: "https://site.test" }), advance: (ms: number) => { now = new Date(now.getTime() + ms); } };
}
const tokenOf = (url: string) => new URL(url).searchParams.get("token")!;

test("valid sign-up: 200, entry stored, confirmation attempted, only the token HASH stored", async () => {
  const { ctl, repo, mailer } = setup();
  const r = await ctl.join(good);
  assert.deepEqual([r.status, r.body], [200, { ok: true }]);
  assert.equal(repo.entries.length, 1); assert.equal(mailer.confirmations.length, 1);
  const tok = tokenOf(mailer.confirmations[0]!.confirmUrl);
  assert.notEqual(repo.entries[0]!.confirmTokenHash, tok); assert.equal(repo.entries[0]!.confirmTokenHash!.length, 64);
});
test("validation errors: invalid email, missing name, missing consent -> 400 with safe field codes", async () => {
  const { ctl, repo } = setup();
  for (const [bad, field] of [[{ ...good, email: "x" }, "email"], [{ ...good, name: "" }, "name"], [{ ...good, consent: false }, "consent"], [{ ...good, name: undefined }, "name"]] as const) {
    const r = await ctl.join(bad);
    assert.equal(r.status, 400);
    const b = r.body as { error: { code: string; fields: Record<string, string> } };
    assert.equal(b.error.code, "VALIDATION_ERROR"); assert.ok(field in b.error.fields);
    assert.ok(!JSON.stringify(b).includes("asha@")); // never echoes input back
  }
  assert.equal(repo.entries.length, 0);
});
test("no leakage: real, duplicate-unconfirmed and confirmed emails all get the identical response", async () => {
  const { ctl, advance, mailer } = setup();
  const first = await ctl.join(good);
  advance(120_000);
  const dup = await ctl.join(good);                       // unconfirmed -> fresh email
  assert.equal(mailer.confirmations.length, 2);
  await ctl.confirm({ token: tokenOf(mailer.confirmations[1]!.confirmUrl) });
  const confirmed = await ctl.join(good);                 // confirmed -> nothing sent
  assert.equal(mailer.confirmations.length, 2);
  assert.deepEqual([first, dup, confirmed].map((r) => JSON.stringify(r)), Array(3).fill(JSON.stringify({ status: 200, body: { ok: true } })));
});
test("duplicates never create a second entry; resend is throttled (no mail-bombing)", async () => {
  const { ctl, repo, mailer, advance } = setup();
  await ctl.join(good); await ctl.join(good); await ctl.join(good);
  assert.equal(repo.entries.length, 1); assert.equal(mailer.confirmations.length, 1); // 2nd/3rd inside 60 s: nothing sent
  advance(61_000); await ctl.join(good);
  assert.equal(mailer.confirmations.length, 2);
  assert.notEqual(tokenOf(mailer.confirmations[0]!.confirmUrl), tokenOf(mailer.confirmations[1]!.confirmUrl)); // token rotated
});
test("honeypot: normal-looking 200, nothing saved, nothing sent (join and feedback)", async () => {
  const { ctl, repo, mailer } = setup();
  const r = await ctl.join({ ...good, company_website: "http://spam.example" });
  assert.deepEqual([r.status, r.body], [200, { ok: true }]);
  const f = await ctl.feedback({ message: "buy pills", company_website: "x" });
  assert.equal(f.status, 200);
  assert.deepEqual([repo.entries.length, repo.feedback.length, mailer.confirmations.length], [0, 0, 0]);
});
test("email provider down: honest 503 (not success); entry kept so a retry works", async () => {
  const { ctl, repo, mailer, log, advance } = setup();
  mailer.failSend = true;
  const r = await ctl.join(good);
  assert.equal(r.status, 503); assert.equal((r.body as { error: { code: string } }).error.code, "UNAVAILABLE");
  assert.equal(repo.entries.length, 1);
  mailer.failSend = false; advance(61_000);
  assert.equal((await ctl.join(good)).status, 200); assert.equal(mailer.confirmations.length, 1);
  assert.ok(!log.lines.join().includes("asha@")); // no email address in logs
});
test("email not configured: 503 for everyone, nothing stored", async () => {
  const { ctl, repo, mailer } = setup();
  mailer.configured = false;
  assert.equal((await ctl.join(good)).status, 503);
  assert.equal(repo.entries.length, 0);
});
test("database down: the error is thrown to the central handler (never a fake success)", async () => {
  const { ctl, repo } = setup();
  repo.failWrites = true;
  await assert.rejects(() => ctl.join(good), /db down/);
});
test("confirm: valid, double-confirm harmless, invalid, expired", async () => {
  const { ctl, repo, mailer, advance } = setup();
  await ctl.join(good);
  const tok = tokenOf(mailer.confirmations[0]!.confirmUrl);
  const ok = await ctl.confirm({ token: tok });
  assert.equal(ok.status, 302); assert.match(ok.redirect!, /^https:\/\/site\.test\/waitlist\/confirmed\?status=ok&survey=/);
  assert.ok(repo.entries[0]!.confirmedAt); assert.equal(repo.entries[0]!.confirmTokenHash, null); assert.equal(mailer.welcomes.length, 1);
  const again = await ctl.confirm({ token: tok });
  assert.match(again.redirect!, /status=invalid/); assert.equal(mailer.welcomes.length, 1); // no second welcome
  assert.match((await ctl.confirm({ token: "nope" })).redirect!, /status=invalid/);
  assert.match((await ctl.confirm({})).redirect!, /status=invalid/);
  const s2 = setup(); await s2.ctl.join({ ...good, email: "b@c.de" }); s2.advance(8 * 86_400_000);
  assert.match((await s2.ctl.confirm({ token: tokenOf(s2.mailer.confirmations[0]!.confirmUrl) })).redirect!, /status=expired/);
  void advance;
});
test("welcome email failure does not undo a real confirmation", async () => {
  const { ctl, repo, mailer } = setup();
  await ctl.join(good); mailer.failSend = true;
  const r = await ctl.confirm({ token: tokenOf(mailer.confirmations[0]!.confirmUrl) });
  assert.match(r.redirect!, /status=ok/); assert.ok(repo.entries[0]!.confirmedAt);
});
test("unsubscribe: idempotent, masked email, wrong-purpose and bad tokens rejected; re-joining restarts double opt-in", async () => {
  const { ctl, repo, mailer, advance } = setup();
  await ctl.join(good); await ctl.confirm({ token: tokenOf(mailer.confirmations[0]!.confirmUrl) });
  const id = repo.entries[0]!.id;
  const unsub = signToken("unsub", id, SECRET);
  const a = await ctl.unsubscribe({ token: unsub }, {});
  assert.deepEqual(a.body, { ok: true, email: "a***@college.edu" });
  const stamp = repo.entries[0]!.unsubscribedAt; assert.ok(stamp);
  advance(5000); await ctl.unsubscribe(undefined, { token: unsub }); // via query string (one-click header)
  assert.equal(repo.entries[0]!.unsubscribedAt, stamp);
  assert.equal((await ctl.unsubscribe({ token: signToken("survey", id, SECRET) }, {})).status, 400);
  assert.equal((await ctl.unsubscribe({ token: "bad" }, {})).status, 400);
  assert.equal((await ctl.unsubscribe({}, {})).status, 400);
  advance(61_000); await ctl.join(good);
  assert.equal(repo.entries[0]!.unsubscribedAt, null); assert.equal(mailer.confirmations.length, 2);
});
test("survey: saved with a valid signed token, last write wins; rejects bad options, bad and expired tokens", async () => {
  const { ctl, repo, mailer, advance } = setup();
  await ctl.join(good); const c = await ctl.confirm({ token: tokenOf(mailer.confirmations[0]!.confirmUrl) });
  const survey = decodeURIComponent(new URL(c.redirect!).searchParams.get("survey")!);
  assert.equal((await ctl.survey({ token: survey, answers: { year: "2", betaInterest: "yes" } })).status, 200);
  assert.equal(repo.entries[0]!.betaOptIn, true);
  await ctl.survey({ token: survey, answers: { year: "3", betaInterest: "no" } });
  assert.deepEqual([repo.entries[0]!.survey?.year, repo.entries[0]!.betaOptIn], ["3", false]);
  assert.equal((await ctl.survey({ token: survey, answers: { year: "99" } })).status, 400);
  assert.equal((await ctl.survey({ token: "x.y", answers: {} })).status, 400);
  advance(200 * 86_400_000);
  const exp = await ctl.survey({ token: survey, answers: {} }); assert.equal(exp.status, 410);
});
test("feedback: stored, owner notified, notification failure tolerated, message never logged", async () => {
  const { ctl, repo, mailer, log } = setup();
  const r = await ctl.feedback({ message: "Please add dark mode for the site SECRET-PHRASE", contact: "me@x.co" });
  assert.equal(r.status, 200); assert.equal(repo.feedback.length, 1); assert.equal(mailer.notes.length, 1);
  assert.ok(!log.lines.join().includes("SECRET-PHRASE"));
  assert.equal((await ctl.feedback({ message: "" })).status, 400);
  repo.failWrites = true; await assert.rejects(() => ctl.feedback({ message: "x" }), /db down/);
});
test("emails: names are HTML-escaped, both HTML and plain-text versions exist, wording follows docs/11", () => {
  const c = confirmationEmail({ name: `<script>alert(1)</script>`, confirmUrl: "https://api.test/c?token=1" }, { domain: "site.test" });
  assert.ok(!c.html.includes("<script>")); assert.ok(c.html.includes("&lt;script&gt;")); assert.match(c.text, /works for 7 days/);
  assert.equal(c.subject, "Confirm your spot on the Stilldesk waitlist");
  const w = welcomeEmail({ name: "A", surveyUrl: "https://s/x", unsubscribeUrl: "https://s/u" }, { domain: "site.test" });
  assert.equal(w.subject, "You're on the Stilldesk list"); assert.match(w.text, /an early-bird offer and a 7-day Pro trial/);
  assert.match(welcomeEmail({ name: "A", surveyUrl: "s", unsubscribeUrl: "u" }, { domain: "d", offer: "OFFER-X" }).text, /early-bird offer \(OFFER-X\)/);
});
