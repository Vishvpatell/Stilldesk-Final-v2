# 12. Backend Spec: Waitlist API (Express + MongoDB + Prisma 6.19)

Scope: only what the pre-launch site needs. The full API in the master plan (auth, sync, AI, groups, billing) comes later and is out of scope now.

## Stack
Node.js + TypeScript, Express, **zod** (validation), **helmet**, **CORS allow-list**, rate limiting, structured logging, **Prisma pinned to v6.19** with **MongoDB Atlas** (a replica set is required), **Resend** for email.
Verify the current Prisma/MongoDB support before installing. Use `prisma db push` (migrations are not used with MongoDB).

## Folder layout
```
apps/api/src/
  routes/        waitlist.ts feedback.ts health.ts
  controllers/
  services/      email.ts tokens.ts
  middleware/    validate.ts rateLimit.ts cors.ts errorHandler.ts
  prisma/        client.ts
  config/        env.ts
prisma/schema.prisma
```

## Endpoints

| Method | Path | Purpose | Rate limit (suggested) |
|---|---|---|---|
| GET | `/health` | Uptime check, returns `{ ok: true }` | none |
| POST | `/v1/waitlist` | Join the waitlist | 5 per hour per IP |
| GET | `/v1/waitlist/confirm?token=` | Double opt-in: set `confirmedAt` | 20 per hour per IP |
| POST | `/v1/waitlist/survey` | Save survey answers (token in body) | 10 per hour per IP |
| POST | `/v1/waitlist/unsubscribe` | Unsubscribe (also reachable by GET link that posts) | 20 per hour per IP |
| POST | `/v1/feedback` | Send feedback | 5 per hour per IP |

### POST `/v1/waitlist`
Body:
```json
{ "name": "optional", "email": "a@b.com", "consent": true, "consentTextVersion": "consent-v1", "source": "landing", "company_website": "" }
```
Rules:
1. Validate with zod. `email` valid, lowercased, trimmed, max 254. `name` max 80. `consent` must be `true`.
2. **Honeypot:** if `company_website` is non-empty, return the normal success response and save nothing.
3. Rate limit by IP (use in-memory or Redis counters; do **not** store raw IPs in the database).
4. **Never reveal whether an email exists.** Existing email: if unconfirmed, send a fresh confirmation email; if confirmed, send nothing. Always return the same success body.
5. Create `WaitlistEntry` with a random 32-byte confirm token (store only the **SHA-256 hash**) and an expiry of 7 days.
6. Send the confirmation email (file 11, template 1).
Response: `200 { "ok": true }`.

### GET `/v1/waitlist/confirm?token=...`
Hash the token, find the entry, check expiry. Set `confirmedAt`, clear the token, send the welcome email (template 2). Redirect to `{{SITE_URL}}/waitlist/confirmed` (or `?status=expired|invalid`). Idempotent: confirming twice is fine.

### POST `/v1/waitlist/survey`
Body: `{ "token": "<signed survey token>", "answers": { ... } }`. The survey token is an HMAC-signed value containing the entry id, issued in the welcome email and on the confirmed page. Validate answers with zod against the allowed options in file 05. Store as `survey` on the entry. Idempotent (last write wins).

### POST `/v1/waitlist/unsubscribe`
Body: `{ "token": "<HMAC-signed unsubscribe token>" }`. Set `unsubscribedAt`. Never send marketing emails to unsubscribed entries. Keep only the minimal record needed to suppress future emails.

### POST `/v1/feedback`
Body: `{ "message": "...", "contact": "optional email", "company_website": "" }`. message 1 to 2000 chars. Honeypot as above. Optional notification email to `{{SUPPORT_EMAIL}}`. Never log message text.

### Error format
`{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable", "fields": { "email": "invalid" } } }` with codes: `VALIDATION_ERROR`, `RATE_LIMITED`, `NOT_FOUND`, `TOKEN_EXPIRED`, `TOKEN_INVALID`, `INTERNAL`.

## Prisma schema (starter)
```prisma
generator client { provider = "prisma-client-js" }

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model WaitlistEntry {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  email                 String    @unique
  name                  String?
  source                String?
  consent               Boolean
  consentAt             DateTime
  consentTextVersion    String
  confirmTokenHash      String?
  confirmTokenExpiresAt DateTime?
  confirmedAt           DateTime?
  unsubscribedAt        DateTime?
  survey                Json?
  betaOptIn             Boolean?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([confirmedAt])
  @@index([createdAt])
}

model Feedback {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  message   String
  contact   String?
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```
Note: the master plan's `WaitlistEntry` lists email, source, consent, createdAt, confirmedAt. The extra fields above (name, consent version, token hash, unsubscribe, survey, beta) support double opt-in, the survey and the beta. Add indexes on `email` (unique), `confirmedAt`, `createdAt`.

## Survey answer shape (zod)
```ts
{
  year?: "1" | "2" | "3" | "4plus" | "pg" | "other";
  distractingApps?: string[];          // from the list in file 05
  loseFocusWhen?: string[];
  stopwatchOrTimer?: "stopwatch" | "timer" | "both" | "unsure";
  pricePerMonth?: "nothing" | "under_coffee" | "one_coffee" | "two_coffees" | "more";
  deleteReason?: string;               // max 300
  platform?: "android" | "iphone" | "both";
  phoneBrand?: string;                 // only if android
  betaInterest?: "yes" | "maybe" | "no";
}
```

## Security checklist
- HTTPS only; HSTS via helmet. CORS allow-list = the website origin(s) only.
- zod on every input; reject unknown fields.
- Hash confirmation tokens (SHA-256). Sign survey and unsubscribe tokens with HMAC using `TOKEN_SECRET`.
- No raw IPs, emails or message text in logs. Use structured logs with ids only.
- Rate limit all POST routes. Add a body size limit (for example 10 KB).
- Secrets only in environment variables, never committed. Commit `.env.example` only.
- Return generic responses that do not leak whether an email exists.
- Delete/unsubscribe requests must be honoured promptly.
- Regular database backups with a tested restore.

## Environment variables (`.env.example`)
```
NODE_ENV=development
PORT=4000
SITE_URL=http://localhost:3000
API_URL=http://localhost:4000
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=mongodb+srv://USER:PASS@CLUSTER/stilldesk?retryWrites=true&w=majority
TOKEN_SECRET=change-me-long-random
RESEND_API_KEY=
EMAIL_FROM=Stilldesk <hello@yourdomain>
EMAIL_REPLY_TO=support@yourdomain
SUPPORT_EMAIL=support@yourdomain
```

## Tests to write
- Valid sign-up returns 200 and creates an entry; the confirmation email is attempted.
- Same email twice returns the same 200 and does not create a duplicate.
- Honeypot filled returns 200 and saves nothing.
- Invalid email, missing consent and oversized fields return validation errors.
- Rate limit returns `RATE_LIMITED` after the threshold.
- Confirm: valid, expired and invalid tokens behave correctly; double confirm is harmless.
- Unsubscribe is idempotent and stops later emails.
- Survey rejects values outside the allowed options.
- No endpoint leaks whether an email is registered.

## Hosting notes
- Free API tiers can sleep and answer slowly on the first request. Use a small paid instance before real users arrive.
- Website: a host that supports Next.js (Vercel or similar). API: any Node host. Database: MongoDB Atlas (check the current free tier and backups).
- CI: GitHub Actions runs lint, type-check and tests on every push.
- Monitoring: an uptime check and an error tracker for the API.

## Day-one fallback
If the API is not ready, use a **Google Form** for the waitlist with the same consent text and an early-bird note, and link it from the site as `{{GOOGLE_FORM_URL}}`. Move entries into MongoDB later.
