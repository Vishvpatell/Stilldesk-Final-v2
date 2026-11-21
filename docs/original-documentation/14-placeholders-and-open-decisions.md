# 14. Placeholders and Open Decisions

## A. Placeholder tokens
Keep these in **one config file** (for example `site.config.ts`) and read them everywhere. Replace each before launch. The build must fail (or warn loudly) if any `{{TOKEN}}` is still in the output.

| Token | Meaning | Example / guidance |
|---|---|---|
| `{{DOMAIN}}` | Website domain | stilldesk.app (after the name check) |
| `{{SITE_URL}}` | Full site URL | https://stilldesk.app |
| `{{SUPPORT_EMAIL}}` | Public support address | support@yourdomain |
| `{{PRIVACY_EMAIL}}` | Privacy and data requests address | can be the same as support |
| `{{SUPPORT_RESPONSE_PROMISE}}` | Reply-time promise | Only if you can keep it, e.g. "We aim to reply within 48 hours." Otherwise leave blank. |
| `{{FEEDBACK_REPLY_PROMISE}}` | Optional feedback reply line | e.g. ", and we reply when you leave an email". Else blank. |
| `{{LEGAL_NAME}}` | Legal operator (your name or company) | Required for legal pages |
| `{{LEGAL_ADDRESS}}` | Operator address | Required for legal pages |
| `{{EMAIL_POSTAL_ADDRESS}}` | Postal address in email footers | If your law requires it |
| `{{GOVERNING_LAW}}` | Governing law | e.g. "India" (confirm with a lawyer) |
| `{{JURISDICTION_CLAUSE}}` | Courts clause (optional) | Confirm with a lawyer, or blank |
| `{{LIABILITY_CAP}}` | Liability cap for the free site | A small fixed amount in your currency, confirm with a lawyer |
| `{{EARLY_BIRD_OFFER}}` | Exact offer wording | e.g. "a launch discount on your first Pro purchase" (decide the real number/term first) |
| `{{EARLY_BIRD_EXPIRY}}` | Offer expiry | A real date or "within X days of Pro launch" |
| `{{EARLY_BIRD_CODE}}` | Code sent at launch | Generated per person or shared |
| `{{ANALYTICS_TOOL}}` | Analytics tool | "Umami" (**confirm**; the plan said "Ulama", assumed Umami) |
| `{{COOKIE_STATEMENT}}` | Cookie sentence | e.g. "Our analytics tool does not use cookies." Only if verified. |
| `{{HOSTING_PROVIDER}}` | Website host | e.g. Vercel |
| `{{API_HOST}}` | API host | Node host you choose |
| `{{RETENTION_WAITLIST}}` | How long after launch | e.g. "12 months" |
| `{{RETENTION_UNCONFIRMED}}` | Unconfirmed sign-up retention | e.g. "30 days" |
| `{{RETENTION_FEEDBACK}}` | Feedback retention | e.g. "24 months" |
| `{{RETENTION_LOGS}}` | Server log retention | e.g. "30 days" |
| `{{GRIEVANCE_CONTACT}}` | Grievance/data-protection contact if required | Name + email, or blank |
| `{{VOICE_INPUT_NOTE}}` | How voice input works | Fill in once decided (see C) |
| `{{GOOGLE_FORM_URL}}` | Fallback form link | Create the form first |
| `{{INSTAGRAM_HANDLE}}` | Social handle | After checking availability |
| `{{PLAY_STORE_URL}}` | Store link | Only at launch |
| `{{BETA_LENGTH}}` / `{{BETA_INSTRUCTIONS}}` | Beta details | At beta time |

## B. Decisions still open (from the master plan, sections 17 and 37)

**Must decide before the site goes live**
1. Final name check for **Stilldesk**: Google Play, Google search, your country's trademark database, domain, Instagram handle.
2. Domain and the support/privacy email addresses.
3. Legal operator name, address and governing law.
4. Early-bird offer wording and expiry (do not promise a number you have not decided).
5. Analytics tool (Umami?) and whether it uses cookies.
6. Hosting providers (website, API).

**Can wait (not shown on the site yet)**
7. Pro price points (after the waitlist survey).
8. Web payment provider (Dodo or Paddle) and who sells legally in your tax setup.
9. Production AI model (after the 50-example test).
10. Free blocked-app cap: 3 or 5.
11. Keep or drop the optional Gentle Nudge.
12. Who moderates public rooms and how reports reach you.
13. App package name (for example com.stilldesk.app) and logo/palette finalisation (palette proposed in file 06).

## C. Issues and gaps found while reading the master plan

1. **Voice input vs privacy.** Section 4.2 says "type or speak." If speech-to-text uses Android's recognizer, audio may be processed by Google or another service. The app's privacy policy and the Play Data safety form must say so, and the app will need the microphone permission. The website's FAQ/Data pages currently say only "we will explain before launch." Decide and then update `{{VOICE_INPUT_NOTE}}`.
2. **What the AI receives.** Part A says "send only the text you typed." Part B (which wins) adds **subject names and free hours**. The website text follows Part B.
3. **Waitlist storage.** Part A suggests a Google Form; Part B says your own database + Resend. The site follows Part B with the Google Form as a fallback.
4. **Group size numbers** (free up to 4 friends, Pro up to 20) are from Part A and not overridden, but groups are after launch. The site marks them "Planned."
5. **Free blocked-app cap** (3 vs 5) and the **Gentle Nudge** are unresolved, so the site avoids both.
6. **Anonymous AI endpoint.** Part B allows anonymous use of the AI endpoint with a device token and tight rate limits. Not a website matter, but the app privacy text must describe it.
7. **Prisma 7 and MongoDB.** Pin Prisma to 6.19 and verify before installing. The plan itself says to re-check.
8. **Adults only (18+).** The site, Terms and Privacy Policy all say 18+. If you later target under-18s, this changes the legal pages and Google Play's rules.
9. **iPhone blocking** needs Apple's approval. The site says "iPhone later, no date."
10. **"Verify" items from the master plan** that affect launch but not this site: Google Play policy for Usage Access/overlay disclosure, foreground service type, Play's closed-test requirement for new accounts, and the Data safety form.
11. **A trademark check for "Stilldesk"** is still pending; do not spend on branding or ads until it passes.
12. **Not legal advice.** The privacy policy and terms are drafts for a pre-launch site. Have them reviewed for your country.

## D. Optional extras (add only if the owner provides real content)
- A short **founder note** ("Why I'm building Stilldesk") with the owner's real story and name. Never invent one.
- Real **app screenshots** after the beta build exists.
- A **press/share kit** (logo, lamp, OG image) once the brand is final.
- A **referral** or "invite a friend" link (not in the plan; adds complexity and privacy considerations).
- A Hindi (or other language) version later (English first).
