# Security notes: what is implemented, and what is NOT verified

## Implemented (and where it was tested)
- Server-side validation with Zod, unknown fields rejected, name and email both required. Tested (25 API tests, real Zod).
- Duplicate sign-ups handled without leaking whether an email exists; resend throttle; honeypot. Tested.
- Honest failure: email down -> 503, never "success"; database failure -> 500, never "success". Tested with fakes.
- No personal data in logs (tested that emails and message text never appear); no secrets in the browser bundle (only `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` and two empty switches are public).
- Token security: hashed confirmation tokens, HMAC-signed survey/unsubscribe tokens bound to a purpose, constant-time comparison. Tested.
- Rate limiter (memory-bounded, IPs HMAC-hashed). The limiter is tested; its wiring into Express is NOT run here.
- Security headers for the website (CSP, HSTS, frame, nosniff, referrer, permissions) and the API (helmet). The website header list is unit-tested; they have not been observed on a running Next.js server.
- `.env` files ignored by git (only `.env.example` templates are committed).
- Web client: 12-second request timeout, no cookies sent, double-submit lock. Tested.
- CSRF: the API uses no cookies or sessions, so classic CSRF does not apply; cross-site JSON posts need a CORS preflight that the allow-list refuses.

## Known limits
- CSP allows inline scripts (a Next.js requirement for the static site). Nonce-based CSP is the next hardening step.
- Rate limits are per API instance (in memory). Use Redis for several instances.
- Dependencies were NOT audited (`npm audit` needs internet). Run `npm audit` in both apps after installing. Versions use caret ranges, so a fresh install gets the newest compatible patches; commit the `package-lock.json` that `npm install` creates.
- No cookie banner: the site sets no cookies and loads no third-party scripts. If you later add analytics that tracks across sites or sets cookies, add consent first.
- Analytics and error monitoring are disabled integration points only (`apps/web/src/lib/monitoring.ts`).
