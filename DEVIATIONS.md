# Where this project differs from the original documentation (please approve or change each item)

Your original documentation is untouched. `docs/original-documentation/` holds byte-identical copies, and `apps/web/content/` holds the four copies the site renders (FAQ, Privacy, Terms, Data).

1. **Name is required on the waitlist form.** Docs 05/12 say optional; you asked for required. Enforced in the browser AND on the server (`apps/api/src/schemas/index.ts`), and in `prisma/schema.prisma` (`name String`). Copy "Name is optional" became "Your name and email".
2. **Shortened copy** (you asked for less text): the Problem section (middle paragraph merged), feature cards, Blocking and Study-together text. Order and meaning unchanged.
3. **"Get early access to Pro" instead of "Upgrade to Pro".** Pro is not on sale, so an "Upgrade" button would promise something that does not exist. It leads to the waitlist (early-bird offer and 7-day trial are from the docs).
4. **No prices shown.** docs/02 says the plans section shows none. Prices are behind `showPrices` in `apps/web/src/config/pricing.config.ts`.
5. **No "recommended" / "most popular" badge** on any plan: the docs do not designate one.
6. **Pro weekly report preview** uses sample data (labelled on screen) and only plan-confirmed ideas (full colour charts, best focus time, weekly break insights, subjects). "Most productive day" is shown as the tallest highlighted bar plus "Best focus time".
7. **Proposed copy to approve:** the "Free is enough if… / Pro is for…" lines in `pricing.config.ts`.
8. **Early-bird offer wording:** until `EARLY_BIRD_OFFER` is filled, the site and emails say simply "an early-bird offer".
9. **Camera push in the hero** and scroll-driven scenes: the docs say "no parallax". You asked for cinematic scroll animation, so the hero's gentle 7% push and the pinned scenes are deliberate exceptions. All text stays real HTML and reduced motion shows a static version.
10. **Confirmation links are single-use:** opening a confirmation link a second time shows the "link doesn't look right" page (it changes nothing). Docs say single use and also "idempotent"; the safe reading was chosen.
11. **Re-joining after unsubscribing** restarts double opt-in (a fresh confirmation email), because the person gave fresh consent but we never email an unsubscribed address without confirming.
12. **Resend throttle:** signing up again with an unconfirmed email within 60 seconds does not send another email (stops anyone mail-bombing an address). Not in the docs; a safety addition.
13. **404 page wording** follows docs/05 ("This page is off.").
14. **CSP uses `'unsafe-inline'` for scripts** (Next.js needs small inline scripts). A nonce-based CSP is a documented future step (docs/SECURITY.md).
15. **Express 4** is used (stable, widely documented) rather than Express 5.
16. **Rate limiting is in-memory** per API instance (docs allow in-memory or Redis). Use Redis if you run several API instances.
17. **NEW FEATURE, owner-requested: Day planner (time blocks).** A calendar-style view where you put each task into "from this time to that time" blocks. It is **not in the original Master Plan or documents** (the plan only has the brain-dump's suggested time slots, an optional timetable of class times, and "keep within free hours"). It is shown on the website as an interactive example, listed in the Features, and placed in the **Free plan** (and therefore also in Pro, as "Yes / Yes" in the comparison). Marked "At launch": this is a product-scope decision for you to confirm, because it adds work to the first release. No calendar sync (Google Calendar etc.) is claimed or implied. The website demo covers 4 PM to 10 PM and is illustrative.
