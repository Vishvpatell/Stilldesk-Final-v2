import test from "node:test";
import assert from "node:assert/strict";
import { loadEnv, formatEnvProblems } from "../src/config/env";
import { feedbackBody, surveyBody, waitlistBody } from "../src/schemas";

const base = { SITE_URL: "http://localhost:3000", CORS_ORIGINS: "http://localhost:3000", DATABASE_URL: "mongodb://x", TOKEN_SECRET: "t".repeat(40) };

test("env: valid development config without email -> ok but email not configured", () => {
  const r = loadEnv(base);
  assert.ok(r.ok); if (r.ok) { assert.equal(r.env.emailConfigured, false); assert.equal(r.env.apiUrl, "http://localhost:4000"); }
});
test("env: empty strings from a copied .env.example count as missing", () => {
  const r = loadEnv({ ...base, RESEND_API_KEY: "", EMAIL_FROM: "", SUPPORT_EMAIL: "" });
  assert.ok(r.ok); if (r.ok) assert.equal(r.env.emailConfigured, false);
});
test("env: missing required variables are named, never their values", () => {
  const r = loadEnv({ TOKEN_SECRET: "short-secret-value" });
  assert.ok(!r.ok);
  if (!r.ok) {
    const msg = formatEnvProblems(r.problems);
    for (const k of ["SITE_URL", "CORS_ORIGINS", "DATABASE_URL", "TOKEN_SECRET"]) assert.match(msg, new RegExp(k));
    assert.doesNotMatch(msg, /short-secret-value/);
  }
});
test("env: production rules (https, API_URL, no console mailer, key+from together)", () => {
  const prod = { ...base, NODE_ENV: "production" };
  const r1 = loadEnv(prod); assert.ok(!r1.ok);
  const good = { ...prod, SITE_URL: "https://example.test", CORS_ORIGINS: "https://example.test", API_URL: "https://api.example.test", RESEND_API_KEY: "re_x", EMAIL_FROM: "A <a@example.test>" };
  const r2 = loadEnv(good); assert.ok(r2.ok); if (r2.ok) assert.equal(r2.env.emailConfigured, true);
  assert.ok(!loadEnv({ ...good, EMAIL_MODE: "console" }).ok);
  assert.ok(!loadEnv({ ...good, EMAIL_FROM: undefined }).ok);
});
test("waitlist schema: name AND email required, lowercased, unknown fields rejected", () => {
  const ok = { name: "  Asha  Kumar ", email: " ASHA@College.EDU ", consent: true, consentTextVersion: "consent-v1", source: "landing", company_website: "" };
  const r = waitlistBody.parse(ok); assert.equal(r.email, "asha@college.edu"); assert.equal(r.name, "Asha Kumar");
  assert.ok(!waitlistBody.safeParse({ ...ok, name: "" }).success);
  assert.ok(!waitlistBody.safeParse({ ...ok, name: "   " }).success);
  const { name: _n, ...noName } = ok; assert.ok(!waitlistBody.safeParse(noName).success);
  assert.ok(!waitlistBody.safeParse({ ...ok, name: "x".repeat(81) }).success);
  assert.ok(!waitlistBody.safeParse({ ...ok, email: "nope" }).success);
  assert.ok(!waitlistBody.safeParse({ ...ok, email: `${"a".repeat(250)}@b.co` }).success);
  assert.ok(!waitlistBody.safeParse({ ...ok, consent: false }).success);
  assert.ok(!waitlistBody.safeParse({ ...ok, consent: "true" }).success);
  assert.ok(!waitlistBody.safeParse({ ...ok, isAdmin: true }).success);
});
test("feedback schema: message 1..2000, optional email", () => {
  assert.ok(feedbackBody.safeParse({ message: "hi" }).success);
  assert.ok(feedbackBody.safeParse({ message: "hi", contact: "" }).success);
  assert.ok(!feedbackBody.safeParse({ message: "" }).success);
  assert.ok(!feedbackBody.safeParse({ message: "x".repeat(2001) }).success);
  assert.ok(!feedbackBody.safeParse({ message: "hi", contact: "not-an-email" }).success);
});
test("survey schema: only allowed options; phone brand needs Android", () => {
  const t = { token: "t" };
  assert.ok(surveyBody.safeParse({ ...t, answers: { year: "2", distractingApps: ["instagram", "youtube"], platform: "android", phoneBrand: "samsung", betaInterest: "yes" } }).success);
  assert.ok(!surveyBody.safeParse({ ...t, answers: { year: "99" } }).success);
  assert.ok(!surveyBody.safeParse({ ...t, answers: { distractingApps: ["tiktok"] } }).success);
  assert.ok(!surveyBody.safeParse({ ...t, answers: { deleteReason: "x".repeat(301) } }).success);
  assert.ok(!surveyBody.safeParse({ ...t, answers: { platform: "iphone", phoneBrand: "samsung" } }).success);
  assert.ok(!surveyBody.safeParse({ ...t, answers: { admin: true } }).success);
});
