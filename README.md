# Stilldesk website

Folder layout (your original documentation is NOT in here and is never modified):

```
stilldesk/
  apps/web/     <- the website (Next.js). Stage 1 lives here.
  apps/api/     <- the waitlist server (built in Stage 5, not created yet)
```
Keep your documentation folder (`stilldesk-website-content`) somewhere separate, e.g. next to this folder.

## Run the website on your computer (first time)

You already have Node.js. Open a terminal (Terminal on Mac, PowerShell on Windows) and run these one at a time:

1. `cd` into the folder: `cd path/to/stilldesk/apps/web`
2. Download the website's building blocks (needs internet, takes a minute): `npm install`
3. Start it: `npm run dev`
4. Open http://localhost:3000 in your browser. Press Ctrl+C in the terminal to stop it.

To see it on your phone: connect the phone to the same Wi-Fi, find your computer's local address
(e.g. 192.168.1.20) and open `http://192.168.1.20:3000` on the phone.

Useful checks:
- `npm run typecheck`  checks the code for mistakes
- `npm run build`      makes the production version and warns about any leftover {{PLACEHOLDER}}

If a command shows an error, copy the whole message to me and I will fix it.

## Where things are

| Want to change | File |
|---|---|
| Colours, spacing, fonts (design tokens) | `src/app/globals.css` (top, `:root`) |
| Placeholders (support email, legal name, early-bird offer...) | `src/config/site.config.ts` |
| Hero lamp animation logic | `src/components/hero/useHeroScroll.ts` |
| Lamp / desk artwork | `src/components/hero/scene-markup.ts` |
| Header, menu, footer | `src/components/layout/` |
| Page text for each section | `src/components/sections/` |
| Page titles and sharing info | `src/app/layout.tsx` |

## What is in this version (stilldesk-2)
Home page, in story order: hero (scroll-driven lamp), the plan that disappears (with the dot-meets-lamp payoff), six-step loop (pinned on desktop),
a day with Stilldesk, brain-dump demo, features (4 working demos + all 16), blocking demonstration (pinned on desktop), the Lamp's three states,
promises, study together, Pro weekly report preview, Free vs Pro, private by default, roadmap, FAQ, waitlist form.
Pages: /privacy, /terms, /data (from your documents), /faq (all questions), /waitlist/thanks, and a 404 page.
Not built yet: /feedback, /waitlist/confirmed, /waitlist/survey, /unsubscribe (they need the API), the share image, sitemap and robots (Stage 4), the API (Stage 5).

## Before you go live
1. Fill the placeholders in `src/config/site.config.ts` (legal name, support email, early-bird offer, ...).
2. Set `NEXT_PUBLIC_API_URL` in `.env.local` once the API exists. Until then the waitlist form honestly says sign-ups are not switched on.
3. Read `DEVIATIONS.md` (where this version differs from your documents) and approve or change each item.
4. Run `STRICT_PLACEHOLDERS=1 npm run build`: it fails while any {{TOKEN}} is left on a page.

## Pricing: where to change things
- `src/config/pricing.config.ts`: the Free vs Pro rows (from the approved table), the "no price yet" lines, and the proposed "Free is enough / Pro is for" copy.
- `src/config/site.config.ts`: placeholder tokens (early-bird offer, Pro prices, cancellation terms).
- To show prices later: set `showPrices: true` in pricing.config.ts and fill PRO_PRICE_MONTHLY / PRO_PRICE_YEARLY.
