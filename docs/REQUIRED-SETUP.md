# What YOU still need to provide (nothing here can be invented for you)

| Item | Why | Where it goes |
|---|---|---|
| **Production domain** | canonical URLs, sitemap, share links, CORS, email links | `NEXT_PUBLIC_SITE_URL` (web), `SITE_URL` + `CORS_ORIGINS` (api) |
| **API address** | the website talks to it | `NEXT_PUBLIC_API_URL` (web), `API_URL` (api) |
| **MongoDB Atlas database** (free tier is fine) | stores waitlist entries, surveys and feedback | `DATABASE_URL` (api) |
| **Random secret, 32+ characters** | signs survey and unsubscribe links | `TOKEN_SECRET` (api). Make one: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| **Resend account + API key + a verified sending domain** | sends the confirmation and welcome emails | `RESEND_API_KEY`, `EMAIL_FROM` (api) |
| **Support email** | contact and feedback notifications | `SUPPORT_EMAIL` (api) and `SUPPORT_EMAIL` in `apps/web/src/config/site.config.ts` |
| **Legal details** (company name, address, governing law, liability cap, retention periods, privacy email...) | the Privacy/Terms/Data pages show these as marked brackets under a "Draft" notice until filled | `apps/web/src/config/site.config.ts` |
| **Early-bird offer wording and expiry** | emails and pages | `EARLY_BIRD_OFFER` (api), `site.config.ts` (web) |
| **A lawyer's review** of Privacy, Terms and (before Pro is sold) the refund/cancellation policy | the documents are drafts | n/a |
| **Analytics / error-monitoring choice** (optional) | hooks exist but are OFF: `apps/web/src/lib/monitoring.ts` | env + that file |
| **Hosting** for the website and the API | e.g. any Node host for the API; Vercel or similar for the site | platform's secret manager for API variables |

Full variable list with explanations: `.env.example`.

Before launch run `STRICT_PLACEHOLDERS=1 npm run build:web`: it FAILS while any unfinished placeholder is still on a built page.
