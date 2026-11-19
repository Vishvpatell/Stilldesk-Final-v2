# Where this project differs from the documentation (for the owner to approve)

The original documentation folder is untouched. These are the deliberate differences:

1. **Name is required on the waitlist form.** Docs 05/12 say name is optional. You asked for it to be required, so
   the form validates it (1 to 80 characters). **When the API is built (Stage 5), `name` must be required there too**
   (zod: `name: z.string().trim().min(1).max(80)`), and the Prisma `name String?` becomes `String`.
   Waitlist copy "Name is optional" was changed to "Your name and email".
2. **Shortened copy** (you asked for less text). Problem section: the middle paragraph was merged into the other two,
   wording lightly tightened. Feature cards show a shorter line than docs/03. Blocking and Study-together text is
   shortened. Meaning and order are unchanged.
3. **"Get early access to Pro" instead of "Upgrade to Pro".** Pro is not on sale, so an "Upgrade" button would
   promise something that does not exist. The button leads to the waitlist (early-bird offer and 7-day trial are from the docs).
4. **No prices.** docs/02 says the plans section shows no price. Prices are behind `showPrices` in `pricing.config.ts`.
5. **No "recommended" or "most popular" badge** on any plan: the docs do not designate one.
6. **Pro weekly report preview**: uses only plan-confirmed ideas (full colour charts, best focus time, weekly break
   insights, this week by subject). The numbers are sample data and are labelled. "Most productive day" is shown as
   the highlighted tallest bar plus "Best focus time" because the docs confirm the latter, not a "most productive day" metric.
7. **Proposed copy to approve**: the "Free is enough if… / Pro is for…" lines in `pricing.config.ts`.
8. **/feedback is not built or linked.** It needs the API (`POST /v1/feedback`).
9. **Unfinished placeholders stay off the public page where possible**: the early-bird offer is simply "an early-bird
   offer" until you fill `EARLY_BIRD_OFFER`. Legal pages must show owner details; until filled they appear as marked
   brackets under a visible "Draft" notice.
10. **Success redirect**: per docs/05 a successful sign-up goes to `/waitlist/thanks`. That page exists. The form never
    shows success unless the server answered `{ ok: true }`.
