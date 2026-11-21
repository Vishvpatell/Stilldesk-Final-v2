# 02. Sitemap and Page Specs

## Sitemap

| Route | Page | Index in search? | Notes |
|---|---|---|---|
| `/` | Home (landing) | Yes | Copy in file 03 |
| `/faq` | Help and FAQ | Yes | Copy in file 04 |
| `/waitlist/thanks` | Thank-you after submit | No (noindex) | Copy in file 05 |
| `/waitlist/confirmed` | After the email link is clicked | No | File 05 |
| `/waitlist/survey` | Optional short survey (token link) | No | File 05 |
| `/unsubscribe` | Unsubscribe confirmation | No | File 05 |
| `/feedback` | Feedback form | Yes (low priority) | File 05 |
| `/privacy` | Privacy Policy | Yes | File 08 |
| `/terms` | Terms of Service | Yes | File 09 |
| `/data` | Data and Privacy (plain language) | Yes | File 10 |
| `/404` | Not found | No | File 05 |

Not built now: `/licenses` (add at app launch), `/refunds` (add when Pro launches, see file 15), `/account`, `/admin`.

## Global elements

### Header (sticky, minimal)
- Left: Stilldesk wordmark with a small lit-lamp mark (links to `/`).
- Centre/right links: **The problem** (`#problem`), **How it works** (`#loop`), **Features** (`#features`), **Our promises** (`#promises`), **Study together** (`#together`), **FAQ** (`#faq`).
- Right: primary button **Join the waitlist** (`#waitlist`).
- Mobile: a menu button opens a full-height menu; the primary button stays visible. Trap focus inside the open menu and close on Escape.
- On pages other than home, links go to `/#section`.

### Footer (on every page)
Three columns plus a base line. **Every link must work.**

- **Product:** How it works (`/#loop`), Features (`/#features`), Study together (`/#together`), Free vs Pro (`/#plans`), Join the waitlist (`/#waitlist`)
- **Company:** Why Stilldesk (`/#problem`), Help and FAQ (`/faq`), Send feedback (`/feedback`), Contact support (`mailto:{{SUPPORT_EMAIL}}`)
- **Legal:** Privacy (`/privacy`), Terms (`/terms`), Data and Privacy (`/data`)
- Base line: `Stilldesk. Plan it. Sit down. Study.` / `Launching soon on Android.` / `© 2026 Stilldesk. All rights reserved.`
- Small print: `Product and app names such as Instagram and YouTube belong to their owners. Stilldesk is not affiliated with them. We name them only as examples of apps you might choose to block.`

### Skip link
First focusable element: "Skip to main content."

## Home page: section order and behaviour

Section IDs are fixed so links work.

| # | ID | Section | Behaviour notes |
|---|---|---|---|
| 1 | `#top` | Hero | Lamp turns on over about 1 second on load (static, already on, if reduced motion). One primary button. Show the "Launching soon on Android" badge. |
| 2 | `#problem` | The plan that disappears | Short story. No animation needed. |
| 3 | `#loop` | The loop (6 stages) | Numbered cards or a vertical stepper. On scroll, the lamp mark may brighten subtly per stage; never required to read content. |
| 4 | `#day` | A day with Stilldesk | 4-step timeline. |
| 5 | `#braindump` | Brain-dump example | Static before/after demo. Optionally a "play" button that reveals the output. Label: "Example". Must work without JS. |
| 6 | `#features` | Features | Grid of cards. Each has a status chip: **At launch** or **After launch**. |
| 7 | `#blocking` | Blocking, honestly | Two-column "What it does / What it never does", plus the honest-limits note. |
| 8 | `#lamp` | The Lamp | Short explainer with the three lamp states shown. |
| 9 | `#promises` | Our promises | Seven short promises. |
| 10 | `#together` | Study together (after launch) | Grid of small lit windows; labelled "Coming after launch". No names, no hours, no ranks. |
| 11 | `#plans` | Free vs Pro | Comparison table. No price. |
| 12 | `#privacy` | Private by default | Four bullets + link to `/data`. |
| 13 | `#roadmap` | What's coming | Vertical roadmap, no dates. |
| 14 | `#faq` | FAQ (top 8) | Accordion, all text in the DOM; link "See all questions" to `/faq`. |
| 15 | `#waitlist` | Waitlist form | The main conversion block. |
| (footer) | | Footer | As above. |

## The waitlist form (component rules)

- Fields: **Name (optional)**, **Email (required)**, **consent checkbox (required, unchecked by default)**, hidden **honeypot** field.
- Submit button text: **Join the waitlist**.
- States: idle, submitting (button disabled, text "Joining..."), success (redirect to `/waitlist/thanks`), error (inline message in text, `aria-live="polite"`), already-registered (same success message; never reveal that an email exists), rate-limited (calm message).
- Validate on the client for convenience and on the server for truth.
- A label above each field (not placeholder-only). Errors in text, not colour only.
- Fallback: if the API is down, show a link to the Google Form (`{{GOOGLE_FORM_URL}}`).
- Repeat a compact version of the form (email + consent only) in the hero area as a secondary entry if the design needs it. It must post to the same endpoint.

## Interaction and motion rules

- Respect `prefers-reduced-motion`: no breathing, no fade-in on scroll, instant state changes.
- No parallax, no bouncing, no auto-playing video or sound.
- Scroll behaviour: smooth only when motion is allowed.
- Do not load heavy libraries for animation. CSS is enough.

## Performance targets

- Static-first rendering. Largest content paint under about 2.5 seconds on a mid-range phone on 4G.
- No layout shift from fonts (use `font-display: swap` with a good fallback stack).
- Total initial JS as small as possible; no JS required to read content.
- Images: only the OG image and (optionally) tiny inline SVGs. No stock photos of students.

## Analytics events (website only; no personal text)

`waitlist_submitted`, `waitlist_confirmed`, `survey_completed`, `beta_opt_in` (boolean only, no identity), `feedback_submitted`, `faq_opened` (question id only), `cta_clicked` (location id only). Never send emails, names, or free text.
