# Stilldesk API (apps/api): Express + TypeScript + Zod + Prisma (MongoDB) + Resend

Base path `/v1`. JSON in and out. Errors: `{ "error": { "code", "message", "fields"? } }`. Codes: `VALIDATION_ERROR` 400/413, `TOKEN_INVALID` 400, `TOKEN_EXPIRED` 410, `RATE_LIMITED` 429, `NOT_FOUND` 404, `UNAVAILABLE` 503, `INTERNAL` 500. Internal details are never returned.

| Method and path | Purpose | Limit |
|---|---|---|
| `GET /health` | `{ ok, database: up/down, email: configured/console/not_configured }`. Statuses only, no secrets | none |
| `POST /v1/waitlist` | body `{ name, email, consent:true, consentTextVersion, source?, company_website? }`. Always `{ ok:true }` for real, duplicate and bot sign-ups (never reveals if an email exists). 503 if email isn't configured or sending fails | 5 / hour / IP |
| `GET /v1/waitlist/confirm?token=` | confirms, then 302 to `SITE_URL/waitlist/confirmed?status=ok|expired|invalid` (`&survey=` token on success) | 20 / hour |
| `POST /v1/waitlist/survey` | `{ token, answers }`, every answer optional and from fixed lists | 10 / hour |
| `POST /v1/waitlist/unsubscribe` | token in JSON body or `?token=` (one-click header). Idempotent | 20 / hour |
| `POST /v1/feedback` | `{ message 1-2000, contact? (email), company_website? }` | 5 / hour |

How it behaves: body limit 10 KB; unknown fields rejected; honeypot field `company_website`; CORS allow-list from `CORS_ORIGINS`; `helmet` headers; `X-Powered-By` off; logs contain ids and error names only, never emails, names, messages, tokens, query strings or raw IPs; confirmation tokens are random (32 bytes) and only their SHA-256 hash is stored, valid 7 days, single use; survey and unsubscribe links are HMAC-signed with the purpose inside; a re-send for the same unconfirmed email is throttled to once a minute.

Start-up refuses to run (with a message naming the variables, never their values) if `SITE_URL`, `CORS_ORIGINS`, `DATABASE_URL` or `TOKEN_SECRET` is missing or weak. Production additionally requires https URLs and `API_URL`, and refuses `EMAIL_MODE=console`.

Run: `npm run dev:api` (reads `apps/api/.env`). Create the collections once with `npm --prefix apps/api run db:push`.
