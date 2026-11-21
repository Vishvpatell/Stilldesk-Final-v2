# Stilldesk Pre-Launch Website: Content Pack

**Project:** Stilldesk. Tagline: **Plan it. Sit down. Study.**
**Goal of the site:** collect waitlist sign-ups (and closed-beta volunteers) for an Android study app launching soon, and build trust that the app is calm, honest and private.
**Status line to show on the site:** "Launching soon on Android."

This folder is the single source of content for the website. Give the whole folder to the AI that builds the site. Everything it needs (copy, structure, brand, legal text, emails, backend spec) is in these files.

---

## Instructions for the builder AI (read this first)

You are building the **pre-launch website** for Stilldesk, not the Android app. Follow these rules:

1. **Read the files in numeric order** (00, 01, 02 ...). Use the copy exactly as written unless a file says it is a suggestion.
2. **Do not invent facts.** No fake testimonials, user counts, press logos, ratings, download numbers, prices, launch dates or "only X spots left" urgency. If something is missing, use the placeholder tokens listed in `14-placeholders-and-open-decisions.md` (written like `{{SUPPORT_EMAIL}}`) and keep them in one config file so they are easy to replace.
3. **Never copy another app's words, layout or images.** The visual identity is the **Lamp** (file 06). Do not use an orb.
4. **Tone:** calm, warm, guilt-free. Never use shame, fear, pressure or fake urgency (see voice rules in file 06).
5. **Be honest about the product:** it blocks apps **only during a study session**, the user can **always end a session**, it does **not block websites in v1**, and it is **Android first** (iPhone later, no date).
6. **Product facts come from** `Stilldesk-Master-Plan.pdf`. Where that plan's Part B conflicts with Part A, Part B wins. Where this folder and the plan differ on *website wording*, this folder wins.
7. **Do not publish internal material.** The competitor comparison in the master plan (section 7), the risks, the pricing strategy notes and the "Decisions still open" lists are internal. Do not put them on the site.
8. **All FAQ answers must be visible in the HTML** (accordion is fine, but content must be in the page source for SEO and accessibility). No text that only exists inside an animation.
9. **Every footer and nav link must point to a real section or page.** Test every anchor.
10. **Accessibility is a requirement,** not a nice-to-have (file 13).

## Tech stack for the website (from the master plan, Part B)

| Layer | Choice |
|---|---|
| Website | Next.js (App Router, TypeScript), static-first, fast on mobile |
| API | Express.js (TypeScript), zod validation, helmet, CORS allow-list, rate limiting |
| Database | MongoDB Atlas with **Prisma pinned to v6.19** (verify before installing) |
| Email | Resend (verify the sending domain: SPF, DKIM, DMARC) |
| Analytics | Umami (assumed, **confirm**). Never send personal data or form text |
| Fast fallback | A Google Form for the waitlist on day one, while the API is being built |

## File index

| File | What it contains | Used for |
|---|---|---|
| `00-README-START-HERE.md` | This file | Orientation + prompts |
| `01-strategy-keep-remove-add.md` | What was kept, removed and added versus the Focal site, plus site strategy | Understanding the "why" |
| `02-sitemap-and-page-specs.md` | Every page, section order, components, behaviours | Structure |
| `03-landing-page-copy.md` | **All copy for the home page**, section by section | Home page |
| `04-faq-page-copy.md` | Full FAQ (about 40 questions) | /faq page and FAQ section |
| `05-waitlist-forms-survey-thankyou.md` | Waitlist form, survey, thank-you, confirm, unsubscribe, feedback, 404 copy | Forms and small pages |
| `06-brand-identity-and-design-tokens.md` | The Lamp, colours, type, motion, voice, logo rules, CSS tokens | Visual design |
| `07-seo-meta-social.md` | Titles, descriptions, Open Graph, schema, sitemap, robots | SEO and sharing |
| `08-privacy-policy.md` / `.pdf` | Privacy policy for the pre-launch site | /privacy |
| `09-terms-of-service.md` / `.pdf` | Terms for the pre-launch site and waitlist | /terms |
| `10-data-and-privacy-summary.md` | Plain-language "what we store" page | /data |
| `11-email-templates.md` | All emails (confirm, welcome, beta, launch) | Resend |
| `12-backend-waitlist-api-spec.md` | Endpoints, data model, security, env vars, tests | Express API |
| `13-quality-accessibility-launch-checklist.md` | Final checks before going live | QA |
| `14-placeholders-and-open-decisions.md` | Every `{{TOKEN}}` and every decision still open | Fill-in sheet |
| `15-later-subscription-refund-policy-DRAFT.md` | Draft policy for when Pro launches (do NOT publish now) | Future |
| `Stilldesk-Master-Plan.pdf` | The full product plan | Source of truth for product facts |

## Suggested build order and prompts

Build one step at a time and test before the next (the master plan's own rule).

**Step 1: API (Phase 0, prompt 1)**
> Create the Express API in `apps/api` with TypeScript, zod, helmet, a CORS allow-list and rate limiting. Implement everything in `12-backend-waitlist-api-spec.md`: `GET /health`, `POST /v1/waitlist`, `GET /v1/waitlist/confirm`, `POST /v1/waitlist/survey`, `POST /v1/waitlist/unsubscribe`, `POST /v1/feedback`, with Prisma pinned to v6.19 and MongoDB. Include the honeypot check, the double opt-in token flow and tests.

**Step 2: Email (prompt 2)**
> Add Resend to the API. Send the emails defined in `11-email-templates.md` (confirmation with a confirm link that sets `confirmedAt`, then the welcome email). Include plain-text versions and a working unsubscribe link in every non-essential email.

**Step 3: Website (prompt 3)**
> Create the Next.js website in `apps/web`. Build the pages in `02-sitemap-and-page-specs.md` using the copy in files 03, 04 and 05, the identity in file 06, the SEO data in file 07, and the legal text in files 08, 09 and 10. Connect the forms to the API. Use the placeholder tokens from file 14 through one config file. Respect reduced motion. Then run the checklist in file 13.

**Step 4: Review**
> Run a code review and an accessibility pass. Confirm every item in file 13 is ticked and no `{{TOKEN}}` remains in the built output.

## Things the owner must do before launch (short version)

1. Check that the name **Stilldesk** is free (Google Play, Google, trademark database, domain, Instagram handle).
2. Buy the domain, set up `hello@` and `support@` addresses, verify the domain in Resend.
3. Fill every token in file 14. Read the legal pages once and have a qualified person review them (the drafts are not legal advice).
4. Confirm the analytics tool (Umami?).
5. Decide the early-bird offer wording.
