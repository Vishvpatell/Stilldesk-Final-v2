# Stilldesk: The Complete Report

**Plan it. Sit down. Study.**
Everything to know about the Stilldesk app, its website, its backend and this project, in one place. Sources are marked: **[Plan]** = Stilldesk Master Plan, **[Docs]** = your content pack (files 00 to 15), **[Built]** = what this project contains, **[NEW]** = added at the owner's request and not in the original documents.

---

## Contents
1. Stilldesk at a glance
2. The problem, the promise, the audience
3. The seven principles
4. The loop and "a day with Stilldesk"
5. Every feature, in detail (including the new Day planner)
6. Free vs Pro, pricing facts, early-bird offer
7. The Lamp and the brand
8. Roadmap and build order
9. Technology and architecture
10. Google Play and launch checklist
11. The website: pages, sections, interactions
12. The API (waitlist, survey, unsubscribe, feedback)
13. Emails
14. Privacy, security and legal
15. How to run the project (MacBook + VS Code)
16. Environment variables and credentials
17. Testing: what passed, what was not run
18. Decisions still open, and what you must provide
19. Where this project differs from your documents
20. Risks and metrics
21. Glossary

---

## 1. Stilldesk at a glance
| | |
|---|---|
| **Name / tagline** | Stilldesk. "Plan it. Sit down. Study." |
| **What it is** | A calm, healthy study app for college students that closes the gap between making a plan and actually starting to study. |
| **Platform** | **Android first** (Google Play). iPhone later, with **no date** (it needs Apple's approval for Screen Time access). |
| **Who it is for** | College students, especially first and second years in hostels or dorms. Adults **18+** in version 1. English first. |
| **Status** | Pre-launch. The website collects a waitlist and closed-beta volunteers. The status line is **"Launching soon on Android."** |
| **Core loop** | Dump, Arrive, Sit down, Focus, Protect, Study together. |
| **Money** | Core promise **free for good**. Optional **Pro** later (after the free app is stable). **No ads. No selling data.** |
| **What it is NOT** | A general project manager, a phone lock, a social network, or a game with trees, pets and leaderboards. |

## 2. The problem, the promise, the audience
**The problem.** You make a plan during a lecture or a free period. By the time you reach your room it has gone soft, and the phone wins ("just for a minute" becomes an hour). The plan did not fail because you are lazy. It failed in the gap between where you made it and where you needed it. [Plan §1]

**The promise.** Stilldesk catches your plan the moment you think of it, hands it back when you sit down, and keeps distractions away only while you are studying. [Plan §1]

**What makes it different.** (1) It starts where the problem starts: capture in class, hand-off in your room, focus session at your desk. (2) You write messy and AI organises it (subject, time, order). (3) It blocks only during study sessions and you can always end a session. (4) It is calm and guilt-free by design. [Plan §1]

**Audience.** Mindset: tired of guilt-driven productivity apps, wants something calm that does not nag, wants control. [Docs 01]

**Positioning.** Lead with the *lecture-to-room hand-off* and the *AI brain-dump*. Do **not** lead with "a focus timer": timers are everywhere. [Docs 01]

## 3. The seven principles ("healthy app" rules) [Plan §2]
1. **Blocking happens only inside a study session.** Never at any other time.
2. **You are always in control.** End session is one tap. There is a 5-minute emergency snooze. You choose which apps are blocked.
3. **No shame.** No "you failed" messages; one missed day does not erase your progress.
4. **Few notifications.** Two a day at most by default, with quiet hours.
5. **Privacy first.** Data stays on the phone unless a feature needs the cloud (AI, groups, sync). No ads, no selling data.
6. **Fast.** Capture takes seconds. Starting a session takes two taps.
7. **Honest.** The app never claims to block something it cannot.

## 4. The loop and "a day with Stilldesk"
**The six-step loop** [Docs 03]
1. **Dump**: type or speak anything, messy. AI turns it into tasks by subject with time estimates and a suggested order. You confirm; nothing is saved without you.
2. **Arrive**: when you reach your room, one gentle notification brings your plan back in your own words ("You wrote: finish DBMS assignment."). Triggers: saved Wi-Fi, a geofence, a time-of-day fallback, or an "I'm at my desk" button. Never a full-screen takeover.
3. **Sit down**: two taps to start. First task big and clear; pick a mode (stopwatch, timer or 90-minute deep work), name what you will finish, press Start.
4. **Focus**: a quiet screen, a lit Lamp. Pause any time. Ending is always one tap. A summary shows your time and what you finished.
5. **Protect**: the apps you chose show a friendly "Your session is on" screen. The moment the session ends they open normally. Outside a session Stilldesk blocks nothing.
6. **Study together** *(after launch)*: private rooms with friends or public topic rooms, shown as small lit windows. No chat, no rankings, no pressure.

**A day with Stilldesk** [Plan §3]
- *Free period in class:* you type "dbms assignment friday, physics numericals ch3 revise, buy notebook". AI shows three tasks sorted by subject with time estimates. You confirm.
- *Evening, you reach your room:* saved Wi-Fi or location triggers one notification: "Your plan is ready. First up: DBMS assignment, about 45 min."
- *You tap Start.* A stopwatch runs. If you open a distracting app you chose, you see a friendly "Your session is on" screen.
- *You finish.* A summary shows time and subject. You tick the task and take a break, optionally tagged "Snack".
- *Night.* Your streak updates quietly. Quiet hours begin. Nothing buzzes.

## 5. Every feature, in detail
(Free/Pro and launch timing in brackets.)

**5.1 First-open setup** (about one minute, everything skippable) [Plan §4.1]: name and course/year; subjects (suggestions or your own, each with a colour); optional timetable (class times, so AI knows your free hours); optional room trigger (Wi-Fi or location); day-reset time (default 4:00 AM); quiet hours (default 11 PM to 7 AM); distracting apps; permissions asked only when needed, with a plain-language explanation first.

**5.2 Brain-dump bar (AI)** [Free: 10 a day. Pro: unlimited] [Plan §4.2]: one blank bar; grammar, spelling and mixed languages do not matter. The text goes to an AI service through the server (the AI key is never in the app). The AI returns tasks with title, subject, estimated minutes, deadline if mentioned, and a **suggested time slot**. You see a preview and confirm or edit. Rules: never save silently; if unsure of the subject it uses "Unsorted" and asks once; if the AI fails or you are offline your raw text is saved as a plain task so nothing is lost; scheduling is earliest deadline first, within your free hours, with buffers, never into quiet hours. Only the typed text, your subject names and free hours are sent. Free limit is a fair cap because AI calls cost money.

**5.3 Subjects and AI sorting** [Plan §4.3]: every task belongs to one subject; you can drag a task to another subject any time; your corrections are remembered locally to improve sorting. Subjects drive the colour-coded stats.

**5.4 Today screen** [Plan §4.4]: only today's plan, first task big with a Start button, the rest collapsed. A "not today" swipe moves a task to tomorrow with no penalty. You never face a scary long list.

**5.5 NEW: Day planner (time blocks)** [NEW, Free plan, marked "At launch"]. A calendar-style day view where you put each task into **"from this time to that time"**, for example *DBMS assignment 5:00 – 6:30 PM*, *Break (Snack) 6:30 – 6:45 PM*, *Plan tomorrow 9:00 – 9:15 PM*. You can drag a block to move it, drag its bottom edge to change its length, or select it and use Earlier / Later / Shorter / Longer / Remove (also works with arrow keys and touch). Blocks snap to 15 minutes and never overlap. It builds on the plan's existing ideas (the brain-dump's suggested time slots and "keep within your free hours") but is **not described in the Master Plan**, so it is a scope decision for you to confirm (see section 19). No calendar sync (for example Google Calendar) is claimed.

**5.6 Arrival prompt (the hand-off)** [Free] [Plan §4.5]: one notification per arrival, in your own words; tapping opens Today with Start ready. Location is optional; offer the manual button and time fallback to people who decline. An *optional Gentle Nudge* (off by default) is undecided.

**5.7 Study sessions** [Free] [Plan §4.6]: modes: **free study (stopwatch, default)**, **timer (15, 25 or 45 min, or custom)**, **deep work (90 min)**. Choose a task (or just a subject), optionally name your intention, pick a mode, press Start. During a session: a calm screen with time, subject and task; pause counts as a break; ending is one tap. Ending: summary, tick tasks, break suggestion; timers end with a soft chime and "Take a break or keep going?". Sessions of 5+ minutes are saved; pauses are tracked as breaks.

**5.8 Blocking (session-only, blocklist style)** [Free: a few apps (the plan says up to 3; 3 vs 5 undecided). Pro: unlimited plus optional strict mode] [Plan §4.7]: during a session the apps you chose show a soft "Your session is on" screen with **Back to studying** and **Take 5 minutes** (the emergency snooze, once or twice per session); End session is also reachable. **Never blocked:** Phone, emergency calling, Settings, Clock, and Stilldesk itself. A blocklist (not allowlist) means calculator, PDF reader and notes just work. **No website blocking in v1** (add the browser app to the blocklist instead). Honest limits: a determined user can switch the permission off or uninstall; it is "a speed bump you chose, not a cage".

**5.9 Breaks and break tags** [Free: tagging. Pro: weekly insights] [Plan §4.8]: a break starts when you pause or end a session; optional one-tap tags **Snack, Scroll, Chat, Rest, Other**; a planned 10-minute scroll break during which nothing is blocked and no guilt is shown.

**5.10 Stats** [Free: today's time, this week by subject, current streak. Pro: colour-coded charts by subject over weeks and months, break-tag insights, best focus time of day, monthly goal progress, CSV export] [Plan §4.9]. Charts use colour plus labels (colour-blind safe). The weekly report is an opt-in notification.

**5.11 Streaks and day reset** [Free] [Plan §4.10]: a day counts at 20 minutes (adjustable 10 to 60); one automatic freeze day per week; if you miss days the streak resets quietly with "Welcome back"; best streak and total hours are always kept; day boundary uses your reset time; no lost-streak warnings, no red badges.

**5.12 Study groups, "Study together"** [After launch; Free: up to 4 friends (planned). Pro: up to 20 (planned)] [Plan §4.11]: private groups (invite by code or link) and public topic rooms (creating one needs Pro to reduce spam). Members see a nickname and "studying now" and optionally the subject; presence only during a session; invisible mode available. Safety: **no chat, no direct messages, no images, no links** in v1; filtered nicknames; report and block; owners can remove members; **no leaderboards, no rankings**.

**5.13 Habit tracker** [After launch; Free 3 habits, Pro unlimited] [Plan §4.12]: simple daily checkboxes, no stopwatch, kept small.

**5.14 Exam mode** [Pro, after launch] [Plan §4.13]: add an exam with date and subjects; countdown; AI spreads topics across the days left (always shown as suggestions you can edit).

**5.15 Notifications and quiet hours** [Plan §4.14]: default maximum two a day: the arrival prompt and one optional evening plan reminder. Quiet hours default 11 PM to 7 AM. "Snooze everything today" is one tap. Tone: "Your plan is ready." never "You're falling behind."

**5.16 Settings, privacy and data** [Plan §4.15]: everything stored on the device first (local database works offline); cloud only for AI, groups and sync (Pro); easy **Export my data** and **Delete everything**; no ads; dark mode by default, adjustable text size, one-handed layout.

**5.17 Also planned** [Docs 03]: themes and sounds (Basic free, Extra Pro); sync across devices (Pro).

## 6. Free vs Pro
**The rule: the core promise stays free.** Capture, the arrival prompt, study sessions and basic blocking are free for good. Pro adds extras for people who want more and launches **after the free app is stable**. [Docs 03]

| Feature | Free | Pro |
|---|---|---|
| First-open setup and subjects | Yes | Yes |
| Brain-dump bar (AI) | 10 a day | Unlimited |
| **Day planner (time blocks) [NEW]** | **Yes** | **Yes** |
| Today screen and tasks | Yes | Yes |
| Arrival prompt | Yes | Yes |
| Stopwatch, timer, 90-minute deep work | Yes | Yes |
| Session blocking | A few apps | Unlimited apps, plus optional strict mode |
| End anytime and emergency snooze | Yes | Yes |
| Breaks and break tags | Yes | Plus weekly break insights |
| Stats | Today, and this week by subject | Full colour charts, best focus time, monthly goals, CSV export |
| Streak, freeze day, day reset | Yes | Yes |
| Habit tracker | 3 habits | Unlimited |
| Exam mode | No | Yes |
| Private groups | Planned: up to 4 friends | Planned: up to 20 |
| Public rooms | Join | Join and create |
| Sync across devices | No | Yes |
| Themes and sounds | Basic | Extra |

**Pricing facts.** **No price is published** (the plan says validate with the waitlist survey). The idea: Pro monthly and yearly with a clear saving, starting near the price of one or two coffees a month, avoiding the premium end because students are price-sensitive. Waitlist members get an **early-bird offer** and a **7-day Pro trial**. **No ads.** [Plan §10, Docs 03]

**Payments (later)** [Plan §27]: inside the Android app **Google Play Billing** sells Pro; on the web a merchant of record (Dodo Payments primary, Paddle optional) sells it; the server (never the app) decides who is Pro; a Restore purchases button and easy cancel path are required; clear price and renewal text before purchase; a refund and cancellation policy page. A draft policy exists (docs file 15) and is **not published**.

## 7. The Lamp and the brand
**The Lamp is the signature visual.** Light on means you are studying. It is a status, **not a score or reward**: it never grows, shrinks, levels up or "dies", and it always comes with words, never colour alone. **Do not use an orb.** [Docs 00, 06]

| State | What you see | Label |
|---|---|---|
| Idle | Lamp off, faint outline | Ready |
| Session starts | Warm glow fades in over about 1 second | Studying |
| Focus | Steady glow, very slow breathing (about 6 s), no flashing | Studying |
| Break | Glow dims to about half | On break |
| Paused | Glow holds, slightly cooler | Paused |
| Session ends | Glow fades out gently, then the summary | none |

**Palette (design tokens)**: `--bg #0A0A0B` near-black; `--surface #121214`; `--surface-2 #1A1A1D`; `--border #26262B`; `--text` warm ivory (`#F4F0E8` used on the site); `--text-muted #A8A29A`; Lamp core/glow amber (`#FFD488`/`#FFB84D`, site uses `#FFD9A8`/`#FFB36B`); `--accent #8497B8` (the one muted accent for buttons and links); Midnight Navy `#0E1B36` for subtle depth; Sunset Orange `#FF6B35` for tiny highlights only; focus ring 2 px ivory. The Lamp is the main source of warm colour.
**Type**: DM Sans (one typeface). **Motion**: calm, one easing, no bounce; reduced-motion respected.
**Voice**: calm, warm, guilt-free. Say: "Your plan is ready.", "Nice, 40 minutes done.", "Take 5 if you need it.", "Welcome back.", "Your session is on." Never: "You're falling behind!", "You failed your streak.", "Are you sure you want to quit?", "You lost your 12-day streak.", "Stay locked in!"
**Content rules**: no fake testimonials, ratings, user counts, press logos, prices, launch dates or urgency; no health claims; no promised results; state limits plainly; do not name competitors publicly.

## 8. Roadmap and build order [Plan §11, §12]
| Phase | When (estimate) | What |
|---|---|---|
| 0. Prep | Weeks 1-2 | Name checks, website with waitlist and feedback form, privacy policy draft, Play developer account |
| 1. MVP | Weeks 3-6 | Setup, tasks and subjects, brain-dump AI, stopwatch and timer, session blocking, arrival prompt, basic stats, streak |
| 2. Closed beta | Weeks 7-9 | 10 to 20 real students, bug fixing, tune notifications and blocking |
| 3. Play release | Week 10+ | Free tier live; Pro after stability |
| 4. Groups | After release | Private groups, then public rooms with moderation |
| 5. Extras | Later | Habits, exam mode, themes, sync (and iPhone, no date) |

**Build order, testing each step on a real phone:** app skeleton and local database; subjects and manual tasks, Today screen; stopwatch and timer; **session blocking (the risky part, test it first)**; arrival prompt and notifications with quiet hours; brain-dump AI bar; stats, streaks, day reset, break tags; polish, dark mode, empty states, error handling. (The Day planner would slot in after the Today screen.)

## 9. Technology and architecture [Plan §8, §21-§26; Docs 00]
| Layer | Choice |
|---|---|
| Android app | Kotlin |
| Website | Next.js (App Router, TypeScript), Tailwind, static-first |
| API | Express.js (TypeScript), Zod, helmet, CORS allow-list, rate limiting |
| Database | MongoDB Atlas with **Prisma pinned to 6.19** (needs a replica set; Atlas has one; use `db push`, not migrations) |
| Email | Resend (verify the sending domain: SPF, DKIM, DMARC) |
| Analytics | Umami assumed (confirm); never send personal data or form text |
| Payments | Google Play Billing in the app; Dodo (or Paddle) on the web |

**Blocking approach (the riskiest part).** Use Usage Access (UsageStatsManager) to detect the foreground app during a session and show the soft screen over blocked apps. Needs the Usage Access permission, display-over-other-apps permission, and a foreground service while a session runs (on Android 14+ it must declare a type; "special use" with a written explanation for Play review). **Avoid AccessibilityService** (it can read everything on screen and Google restricts it). Poll every one to two seconds **only during sessions**. Test on real phones early; ship a per-brand setup guide because some phone brands close background apps aggressively.

**Data.** Local database first (works offline). Cloud only for AI, groups and sync, with anonymous sign-in plus rate limits so groups and AI cannot be abused; real accounts only for sync. Main collections: User, Subject, Task, StudySession, Break, Habit/HabitLog, Group/GroupMember, Report, Subscription, WebhookEvent, AiUsage, **WaitlistEntry, Feedback**. A **time-block** collection would be needed for the new Day planner (decision for later).

**AI.** One provider interface (`parseTasks(text, subjects, freeHours)`), output validated with Zod against a strict JSON shape (tasks with title, subject, estimatedMinutes, dueAt, suggestedSlot; plus "unsorted"); retry once then save raw text; treat user text as data, never instructions (prompt-injection safety); log counts only, never text; collect **50 messy real examples** and score them before choosing the production model. Compare self-hosted vs hosted on cost per 1,000 brain-dumps.

## 10. Google Play and launch checklist [Plan §9]
Developer account (one-time fee, verify current amount); verify closed-test requirements for new accounts; privacy policy on the website; honest Data safety form; prominent disclosure screens for Usage Access and overlay permission; foreground-service justification; user-generated-content compliance for groups (report, block, moderation); target audience adults 18+; store listing (name, description, screenshots, icon, feature graphic); **name check** for "Stilldesk" (Play, Google, trademark, domain, Instagram handle) before spending on branding.

## 11. The website
**Routes** [Built]: `/` home, `/faq`, `/feedback`, `/privacy`, `/terms`, `/data`, `/waitlist/thanks`, `/waitlist/confirmed`, `/waitlist/survey`, `/unsubscribe`, a branded 404, an error page, a global error fallback, `/sitemap.xml`, `/robots.txt`. Private flow pages are `noindex` and excluded from the sitemap.

**Home page, in story order** (all text is real HTML, readable without animation):
1. **Hero**: scroll-driven Lamp scene (the lamp lights, light spreads over the desk, the notebook's ink writes in, a gentle camera push). Headline "Plan it. Sit down. Study.", "Join the waitlist" button.
2. **The problem** ("You made a plan. Then you walked to your room.").
3. **The spark** (pinned): an energy point travels a soft curve into the lamp, the lamp lights gradually, the desk and notebook glow, then "The plan finally meets the desk." and "Stilldesk is built for that gap."
4. **The loop** (pinned on desktop): six steps with one phone interface that changes per step, including the Lamp over a desk and notebook that lights with scroll and shows Studying / Paused / On break.
5. **A day with Stilldesk**: the page shifts from daylight to night as you scroll; five moments.
6. **Brain-dump demo**: types the example, organises it, lets you edit times and confirm.
7. **Day planner [NEW]**: the calendar-style time-block planner (drag, resize, keyboard, buttons) with a "now" line that moves as you scroll.
8. **Features**: four working demos (Today, Sessions, Breaks, Streaks) plus all feature cards.
9. **Blocking** (pinned on desktop): an animated demonstration plus honest limits.
10. **The Lamp**: the three states, switchable.
11. **Our promises**: seven promises.
12. **Study together**: calm lit windows, no names or ranks.
13. **Pro weekly report preview**: animated charts with clearly labelled sample data.
14. **Free vs Pro**: plan cards, full comparison, "Free is enough if… / Pro is for…", FAQ.
15. **Private by default**: what stays on the phone vs the cloud.
16. **Roadmap** (honest, no dates).
17. **FAQ** (8 questions).
18. **Waitlist**: name, email, consent, with the Lamp lighting the form.

**Behaviour.** Scroll-linked scenes reverse smoothly when scrolling up and hold exactly when scrolling stops. Pinned scenes (loop, spark, blocking) only on desktop; phones get shorter, unpinned versions. **Reduced motion** shows a static lit scene with every text visible. Animations pause when their section is off screen.

**Accessibility.** Skip link, visible focus, labelled inputs with spoken errors, accordion ARIA, one `h1` per page, 44 px touch targets, text contrast at 4.5:1 or better in dimmed states, no keyboard traps in pinned scenes.

**SEO.** Unique titles and descriptions, per-page canonicals, Open Graph and Twitter card with a 1200x630 share image, favicon and Apple icon, homepage JSON-LD (Organization, WebSite, SoftwareApplication) and FAQ JSON-LD, sitemap and robots. The production domain is **never invented**: it comes only from `NEXT_PUBLIC_SITE_URL`, and a production build refuses a missing or localhost value.

## 12. The API (apps/api)
Express + TypeScript + Zod + Prisma (MongoDB) + Resend. Base `/v1`.
| Endpoint | Purpose |
|---|---|
| `GET /health` | database up/down, email configured/console/not_configured (no secrets) |
| `POST /v1/waitlist` | `{ name, email, consent:true, consentTextVersion, source?, company_website? }`. **Name and email both required.** Always answers `{ ok:true }` for real, duplicate and bot sign-ups (never reveals whether an email exists) |
| `GET /v1/waitlist/confirm?token=` | confirms, redirects to `/waitlist/confirmed?status=ok|expired|invalid` |
| `POST /v1/waitlist/survey` | optional survey answers from fixed lists, signed token |
| `POST /v1/waitlist/unsubscribe` | idempotent, token in body or query (one-click header) |
| `POST /v1/feedback` | message 1-2000 characters, optional email |
Protections: Zod validation (unknown fields rejected), 10 KB body limit, honeypot field, CORS allow-list, helmet, per-endpoint rate limits (5/hour for sign-up and feedback), resend throttle (once a minute per email), hashed single-use confirmation tokens (7 days), HMAC-signed survey/unsubscribe links, logs with ids only (no emails, names, messages, tokens or IPs), generic error messages, **success only after real processing** (email down → 503, database down → 500). Start-up refuses to run with missing or weak settings and names the variables, never the values.

## 13. Emails [Docs 11, Built]
Confirmation ("Confirm your spot on the Stilldesk waitlist", link valid 7 days) and welcome ("You're on the Stilldesk list", closed beta then free launch, early-bird offer and 7-day Pro trial, survey link, unsubscribe). Names are HTML-escaped; HTML and plain-text versions; List-Unsubscribe headers on the welcome email. Beta and launch emails exist in the docs but are sent manually later.

## 14. Privacy, security and legal
The Privacy Policy, Terms of Service and the plain-language Data and Privacy page are rendered from your documents. They show a visible **"Draft"** notice and marked brackets until the owner supplies the legal name, address, governing law, liability cap, retention periods and contacts. **Have them reviewed by a lawyer.** Adults 18+ only. A refund and cancellation policy is needed only when Pro is sold (draft not published). No cookie banner is needed while the site sets no cookies and loads no third-party scripts. Analytics and error monitoring are **disabled integration points** (`apps/web/src/lib/monitoring.ts`). Security details: `docs/SECURITY.md`.

## 15. How to run it (MacBook + VS Code)
1. Unzip `Stilldesk-Final.zip`. 2. Install Node.js LTS (nodejs.org; `node -v` must be v20.9 or higher). 3. Install VS Code, *File > Open Folder…* the project, open a terminal. 4. `npm run install:all`. 5. Website only: `cp apps/web/.env.example apps/web/.env.local`, `npm run dev:web`, open http://localhost:3000. 6. For a real waitlist: create free MongoDB Atlas and Resend accounts, `cp apps/api/.env.example apps/api/.env`, fill it (for a first test use `EMAIL_MODE=console`), `npm --prefix apps/api run db:push`, `npm run dev:api`, set `NEXT_PUBLIC_API_URL=http://localhost:4000` in `apps/web/.env.local`, restart the website. 7. `npm run check` runs types, lint and tests. 8. Production: set `NEXT_PUBLIC_SITE_URL` to your https domain and run `npm run build:web`; `STRICT_PLACEHOLDERS=1 npm run build:web` fails while unfinished placeholders remain.

## 16. Environment variables and credentials
| Variable | App | Secret? | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | web | no | public https domain (required for production build) |
| `NEXT_PUBLIC_API_URL` | web | no | where the API lives (empty = frontend-only mode, form says "not connected") |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `NEXT_PUBLIC_ERROR_MONITORING` | web | no | leave empty (off) |
| `SITE_URL`, `API_URL`, `CORS_ORIGINS` | api | no | links, redirects, browser allow-list |
| `DATABASE_URL` | api | **yes** | MongoDB Atlas connection string |
| `TOKEN_SECRET` | api | **yes** | 32+ random characters for signed links |
| `RESEND_API_KEY`, `EMAIL_FROM` | api | **yes** / no | sending email (verified domain) |
| `EMAIL_MODE` | api | no | `resend`, or `console` for development only |
| `SUPPORT_EMAIL`, `EARLY_BIRD_OFFER`, `EMAIL_POSTAL_ADDRESS`, `EMAIL_REPLY_TO` | api | no | wording and contacts |
| `TRUST_PROXY` | api | no | `1` behind one proxy/load balancer |
Never put a secret in a `NEXT_PUBLIC_` variable. Real `.env` files are git-ignored; only `.env.example` templates are committed.

## 17. Testing: what passed, what was not run
**Passed (run in this project):** 25 API tests; 18 website tests (including the planner logic); strict TypeScript on the API core (0 errors); every website file transpiles; 16 routes opened directly at 1440, 1280, 768 and 375 px (no overflow, one h1 each, no console errors); homepage scrolled top to bottom at four widths (no broken links, no console errors); Privacy 15/15, Terms 14/14, Data 2/2 sections present; waitlist, feedback, survey and unsubscribe flows against a mock server; scroll scenes hold and reverse correctly; reduced-motion; the new Day planner (drag, resize, keyboard, buttons, add/remove/reset, scroll "now" line, 4 widths, 44 px targets).
**Not run (no internet in the build environment, so these may reveal issues on your first run):** `npm install`, the Next.js production build, ESLint, the website's type-check, `npm audit`, the live Express server, a real MongoDB, real Resend emails, real phones, Safari/Firefox, screen readers, Lighthouse/Core Web Vitals. Full details: `docs/TESTING.md`.

## 18. Decisions still open, and what you must provide
**Before the site goes live** [Docs 14]: final name check for Stilldesk (Play, Google, trademark, domain, Instagram); domain, support and privacy emails; legal operator name, address and governing law; early-bird offer wording and expiry; analytics tool (Umami?) and whether it uses cookies; hosting for the website and API.
**Can wait:** Pro price points (after the waitlist survey); web payment provider (Dodo or Paddle); production AI model (after the 50-example test); **free blocked-app cap (3 or 5)**; keep or drop the optional Gentle Nudge; who moderates public rooms; app package name and final logo/palette.
**New, from this build:** confirm the **Day planner** is in the first release; confirm "Get early access to Pro" wording; approve the proposed "Free is enough if… / Pro is for…" copy; decide Redis vs in-memory rate limits if you run several API instances.
**Gaps noted in the plan** [Docs 14 §C]: voice input vs privacy (if speech-to-text is used, the privacy text and Play Data safety form must say how); what the AI receives (Part B wins: typed text, subject names, free hours); Prisma 7 vs 6.19 (pin 6.19); adults-only 18+; iPhone blocking needs Apple's approval; the privacy policy and terms are drafts, not legal advice.
See `docs/REQUIRED-SETUP.md` for the practical checklist.

## 19. Where this project differs from your documents
Full list: `DEVIATIONS.md` (17 items). Highlights: name is required on the waitlist form; shortened copy; "Get early access to Pro" instead of "Upgrade to Pro"; no prices and no "recommended" badge; Pro report uses labelled sample data; the hero's gentle camera push and pinned scenes are deliberate exceptions to "no parallax"; confirmation links are single-use; a one-minute resend throttle and a CSP that allows inline scripts; and **item 17, the new Day planner**, which is not in the Master Plan.

## 20. Risks and metrics [Plan §15, §16]
**Risks and mitigations:** blocking unreliable on some phones (test early on several phones, per-brand setup guide); Google Play rejects permission use (prominent disclosure, foreground-service justification, no AccessibilityService); AI cost grows (daily cap, small model, caching, Pro for unlimited); public-room abuse (no chat, nickname filter, report/block, admin removal, Pro to create rooms); users feel trapped (End session always available, snooze, session-only blocking); low retention (keep it simple, soft tone, forgiving streaks, listen to beta feedback); strong competitors (lead with hand-off plus AI brain-dump, not timers); name conflicts (check before launch).
**Metrics that matter:** activation (finished setup and completed a first session); day-1 and day-7 retention; sessions per week per active user; share of sessions ended normally vs abandoned; snooze usage; brain-dump to started-session conversion; waitlist to install; free to Pro conversion.

## 21. Glossary
**Brain-dump**: the free-text bar that AI turns into tasks. **Arrival prompt**: the one notification when you reach your desk. **Session**: a study period (stopwatch, timer or deep work). **Blocklist**: only the apps you choose are blocked. **Lamp**: the brand's light that shows you are studying. **Double opt-in**: you confirm your email by link before you are on the list. **Honeypot**: a hidden form field that only bots fill. **CSP**: a browser rule limiting where a page can load code from. **Merchant of record**: the payment company that is the legal seller and handles tax. **Prisma / MongoDB Atlas / Resend**: the database toolkit, the hosted database, and the email service.
