import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSecurityHeaders, checkSiteUrl } from "../security-headers.mjs";

const get = (h: { key: string; value: string }[], k: string) => h.find((x) => x.key === k)?.value;

test("production headers: CSP, HSTS, no framing, nosniff, referrer, permissions", () => {
  const h = buildSecurityHeaders({ apiOrigin: "https://api.example.test" });
  const csp = get(h, "Content-Security-Policy")!;
  assert.match(csp, /frame-ancestors 'none'/); assert.match(csp, /object-src 'none'/); assert.match(csp, /connect-src 'self' https:\/\/api\.example\.test/);
  assert.match(csp, /upgrade-insecure-requests/); assert.doesNotMatch(csp, /unsafe-eval/);
  assert.match(get(h, "Strict-Transport-Security")!, /max-age=31536000/);
  assert.equal(get(h, "X-Frame-Options"), "DENY"); assert.equal(get(h, "X-Content-Type-Options"), "nosniff");
  assert.ok(get(h, "Referrer-Policy")); assert.match(get(h, "Permissions-Policy")!, /camera=\(\)/);
});
test("dev headers: no CSP/HSTS (so hot reload works)", () => {
  const h = buildSecurityHeaders({ isDev: true });
  assert.equal(get(h, "Content-Security-Policy"), undefined); assert.equal(get(h, "Strict-Transport-Security"), undefined);
});
test("site URL: required and https in production, never localhost, never invented", () => {
  assert.match(checkSiteUrl(undefined, { production: true })!, /NEXT_PUBLIC_SITE_URL is not set/);
  assert.match(checkSiteUrl("http://localhost:3000", { production: true })!, /localhost/);
  assert.match(checkSiteUrl("http://example.test", { production: true })!, /https/);
  assert.match(checkSiteUrl("not a url", { production: true })!, /not a valid URL/);
  assert.equal(checkSiteUrl("https://example.test", { production: true }), null);
  assert.equal(checkSiteUrl(undefined, { production: false }), null); // dev: fine
});
test("placeholder checker (the audit bug): finds rendered placeholder markers AND raw tokens; STRICT fails", () => {
  const dir = mkdtempSync(join(tmpdir(), "ph-")); mkdirSync(join(dir, "privacy"), { recursive: true });
  writeFileSync(join(dir, "privacy", "page.html"), '<span class="ph" data-placeholder="LEGAL_NAME">[legal name: to be decided]</span> and {{GOVERNING_LAW}}');
  const run = (extra: Record<string, string>) => spawnSync("node", ["scripts/check-placeholders.mjs"], { env: { ...process.env, PLACEHOLDER_SCAN_DIR: dir, ...extra }, encoding: "utf8" });
  const warn = run({}); assert.equal(warn.status, 0); assert.match(warn.stderr, /LEGAL_NAME/); assert.match(warn.stderr, /GOVERNING_LAW/);
  const strict = run({ STRICT_PLACEHOLDERS: "1" }); assert.equal(strict.status, 1);
  const clean = mkdtempSync(join(tmpdir(), "ph-clean-")); writeFileSync(join(clean, "index.html"), "<p>All good</p>");
  assert.equal(run({ PLACEHOLDER_SCAN_DIR: clean, STRICT_PLACEHOLDERS: "1" }).status, 0);
  assert.equal(run({ PLACEHOLDER_SCAN_DIR: join(dir, "missing"), STRICT_PLACEHOLDERS: "1" }).status, 1); // nothing built -> strict fails
  void execFileSync;
});
