import test from "node:test";
import assert from "node:assert/strict";
import { cleanName, escapeHtml, maskEmail } from "../src/lib/text";
import { newToken, sha256, signToken, verifyToken } from "../src/lib/tokens";
import { RateLimiter } from "../src/lib/rate-limit";

const SECRET = "x".repeat(40);

test("tokens: random, 43+ chars, unique; hash is stable sha-256", () => {
  const a = newToken(), b = newToken();
  assert.notEqual(a, b); assert.ok(a.length >= 43);
  assert.equal(sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});
test("signed tokens: verify, wrong purpose, wrong secret, tampering, expiry", () => {
  const t = signToken("survey", "e1", SECRET);
  assert.deepEqual(verifyToken(t, "survey", SECRET), { ok: true, id: "e1" });
  assert.deepEqual(verifyToken(t, "unsub", SECRET), { ok: false, reason: "invalid" }); // a survey token can't unsubscribe
  assert.deepEqual(verifyToken(t, "survey", "y".repeat(40)), { ok: false, reason: "invalid" });
  const [body, sig] = t.split(".");
  assert.equal(verifyToken(`${body}x.${sig}`, "survey", SECRET).ok, false);
  assert.equal(verifyToken("garbage", "survey", SECRET).ok, false);
  assert.equal(verifyToken("a.b.c", "survey", SECRET).ok, false);
  const exp = signToken("survey", "e1", SECRET, { ttlMs: 1000, now: 0 });
  assert.equal(verifyToken(exp, "survey", SECRET, 500).ok, true);
  assert.deepEqual(verifyToken(exp, "survey", SECRET, 5000), { ok: false, reason: "expired" });
});
test("text helpers", () => {
  assert.equal(maskEmail("jane.doe@gmail.com"), "j***@gmail.com");
  assert.equal(cleanName("  A\u0000sha \n  K\u200bumar  "), "Asha Kumar");
  assert.equal(escapeHtml(`<img src=x onerror="a()">&'`), "&lt;img src=x onerror=&quot;a()&quot;&gt;&amp;&#39;");
});
test("rate limiter: blocks after the limit, resets after the window, bounded memory", () => {
  let now = 0;
  const l = new RateLimiter({ limit: 5, windowMs: 3_600_000, now: () => now });
  for (let i = 0; i < 5; i++) assert.equal(l.hit("ip").allowed, true);
  const blocked = l.hit("ip");
  assert.equal(blocked.allowed, false); assert.ok(blocked.retryAfterSec >= 1);
  assert.equal(l.hit("other").allowed, true);
  now = 3_600_001;
  assert.equal(l.hit("ip").allowed, true);
  const small = new RateLimiter({ limit: 1, windowMs: 1000, maxKeys: 3, now: () => now });
  for (let i = 0; i < 50; i++) small.hit(`k${i}`);
  assert.ok((small as unknown as { hits: Map<string, unknown> }).hits.size <= 3);
});
