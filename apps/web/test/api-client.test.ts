import test from "node:test";
import assert from "node:assert/strict";
import { postJson } from "../src/lib/api";
import { submitWaitlist, validate } from "../src/lib/waitlist";

const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status });

test("not configured: honest 'not-configured', nothing is sent", async () => {
  let called = false;
  const r = await postJson("/x", {}, { baseUrl: "", fetchImpl: (async () => { called = true; return new Response("{}"); }) as typeof fetch });
  assert.deepEqual(r, { ok: false, kind: "not-configured" }); assert.equal(called, false);
});
test("success only when the server says { ok: true }", async () => {
  assert.equal((await postJson("/x", {}, { baseUrl: "http://a", fetchImpl: reply(200, { ok: true }) })).ok, true);
  assert.equal((await postJson("/x", {}, { baseUrl: "http://a", fetchImpl: reply(200, { hello: 1 }) })).ok, false);   // 200 without ok:true is NOT success
  assert.equal((await postJson("/x", {}, { baseUrl: "http://a", fetchImpl: (async () => new Response("<html>", { status: 200 })) as typeof fetch })).ok, false);
});
test("error mapping: 400 validation, 429, 503, 410/400 tokens, 500", async () => {
  const kind = async (s: number, code: string) => (await postJson("/x", {}, { baseUrl: "http://a", fetchImpl: reply(s, { error: { code, fields: { email: "invalid" } } }) }));
  assert.equal((await kind(400, "VALIDATION_ERROR")).ok === false && (await kind(400, "VALIDATION_ERROR")).kind, "validation");
  assert.equal((await kind(429, "RATE_LIMITED")).ok === false && (await kind(429, "RATE_LIMITED")).kind, "rate");
  assert.equal((await kind(503, "UNAVAILABLE")).ok === false && (await kind(503, "UNAVAILABLE")).kind, "unavailable");
  assert.equal((await kind(410, "TOKEN_EXPIRED")).ok === false && (await kind(410, "TOKEN_EXPIRED")).kind, "token-expired");
  assert.equal((await kind(400, "TOKEN_INVALID")).ok === false && (await kind(400, "TOKEN_INVALID")).kind, "token-invalid");
  assert.equal((await kind(500, "INTERNAL")).ok === false && (await kind(500, "INTERNAL")).kind, "server");
});
test("network failure and TIMEOUT (a stalled server can't leave the screen waiting forever)", async () => {
  const down = (async () => { throw new TypeError("fetch failed"); }) as typeof fetch;
  assert.deepEqual(await postJson("/x", {}, { baseUrl: "http://a", fetchImpl: down }), { ok: false, kind: "network" });
  const hang = ((_u: string, init?: RequestInit) => new Promise((_res, rej) => init?.signal?.addEventListener("abort", () => rej(new DOMException("aborted", "AbortError"))))) as typeof fetch;
  const t0 = Date.now();
  const r = await postJson("/x", {}, { baseUrl: "http://a", fetchImpl: hang, timeoutMs: 80 });
  assert.deepEqual(r, { ok: false, kind: "timeout" }); assert.ok(Date.now() - t0 < 1000);
});
test("request: JSON body, no cookies, correct URL", async () => {
  let seen: { url?: string; init?: RequestInit } = {};
  await postJson("/v1/feedback", { a: 1 }, { baseUrl: "http://api", fetchImpl: (async (u: string, i?: RequestInit) => { seen = { url: u, init: i }; return new Response('{"ok":true}'); }) as typeof fetch });
  assert.equal(seen.url, "http://api/v1/feedback"); assert.equal(seen.init?.credentials, "omit"); assert.equal(seen.init?.body, '{"a":1}');
});
test("waitlist form validation: name AND email required", () => {
  const ok = { name: "Asha", email: "a@b.co", consent: true };
  assert.deepEqual(validate(ok), {});
  assert.ok(validate({ ...ok, name: " " }).name); assert.ok(validate({ ...ok, name: "x".repeat(81) }).name);
  assert.ok(validate({ ...ok, email: "a@b" }).email); assert.ok(validate({ ...ok, consent: false }).consent);
});
test("submitWaitlist without an API URL reports not-configured (no fake success)", async () => {
  const r = await submitWaitlist({ name: "A", email: "a@b.co", consent: true, company_website: "" });
  assert.equal(r.ok, false);
});
