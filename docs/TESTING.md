# Testing report (what was actually run, and what was NOT)

Test environment: a Linux sandbox with Node 22, Chromium (Playwright) and zod. It had NO internet, so packages could not be installed.

## RAN and PASSED
| Check | Result |
|---|---|
| API unit/integration tests (`apps/api/test`, node:test + real Zod) | 25 / 25 pass |
| Website unit tests (`apps/web/test`): API client incl. timeout, form validation, security headers, site-URL rule, placeholder checker, **Day planner logic** | 18 / 18 pass |
| **Day planner in a browser**: mouse drag, edge resize, overlap refusal, keyboard (arrows, Shift+arrows), Earlier/Later/Shorter/Longer/Remove buttons, add task, reset, scroll-driven "now" line (also in reverse), 4 widths, 44 px targets, reduced motion | all pass |
| API core strict TypeScript (`strict`, `noUncheckedIndexedAccess`, no unused code) | 0 errors |
| Every website TS/TSX file transpiles; the whole homepage bundles | 0 failures |
| API Express/Prisma/Resend glue files parse | all parse (NOT executed) |
| 16 routes rendered from the real source files and opened directly, each at 1440, 1280, 768 and 375 px | 0 overflow, exactly one h1 each, no raw `{{TOKEN}}`, no console errors |
| /privacy, /terms, /data completeness against your documents | 15/15, 14/14, 2/2 sections |
| Homepage (17 sections) at 4 widths: console errors, failed requests, broken links/anchors, duplicate ids, scroll top-to-bottom | none found; 13 unique links all valid |
| Reduced-motion: no pinned scenes, hero text visible, all steps open, static lit scene | pass (a real bug was found and fixed during this test) |
| Waitlist (mock server): empty, invalid email, 503, 429, 500, "200 without ok:true" (treated as failure), network down, slow success, triple click | all correct; exactly 1 request on triple click; redirect to /waitlist/thanks only after a real `{ok:true}`; honest message when no API address is set |
| Feedback, survey, unsubscribe forms (mock server) | validation, loading, success, expired/invalid token all correct |
| Spark scene and phone lamp scroll behaviour | value tracks scroll, holds exactly when scrolling stops, returns to 0 when scrolled back |
| Contrast of dimmed scroll states | 6.4:1 or better (target 4.5:1) |

## v2 fix: runtime errors "Cannot read properties of null (reading 'style' / 'dataset')"
| Check | Result |
|---|---|
| Stress test on the OLD code: page removed and restored 192 times while scenes animate, scroll events during removal | **43 runtime errors** (29x `reading 'style'`, 14x `reading 'dataset'`): the bug reproduced exactly |
| Same stress test on the FIXED code: desktop 1440, phone 375 (touch), reduced motion (192 cycles each, 576 total) | **0 errors**; the lamp scene still animates correctly afterwards |
| Scroll behaviour at 1440, 1280, 768, 375 and reduced motion: slow scroll to the bottom, 60 fast random jumps, stop mid-scene (values hold exactly), scroll back to the top (spark glow 0, loop step 0, blocking step 0), 3 refreshes | all pass, 0 errors |
| Unit tests after the fix: API 25/25, website 18/18; API strict types 0 errors; no unused imports; every file transpiles | pass |

## NOT RUN (cannot be, offline). First-run risk: these may show issues the first time you run them
- `npm install`, `npm run build` (Next.js production build), `npm run lint` (ESLint), `npm run typecheck` for the website (needs the React/Next type packages) and for the API glue files.
- `npm audit` (dependency vulnerabilities).
- The API running for real: Express routing, CORS, rate-limit middleware wiring, Prisma against a real MongoDB, real Resend emails. (All the logic behind them is tested; the glue is not executed.)
- Real devices, Safari/Firefox, screen readers, Lighthouse / Core Web Vitals.
- Next.js-specific behaviour of metadata, sitemap.xml, robots.txt, icons and the headers on a live server.

## How to run everything yourself
`npm run install:all` then `npm run check` (types + lint + all tests). If anything fails the first time, copy the message to me and I'll fix it.

## Known, deliberate limits (not bugs)
- **Touch-target size (44 px):** every button and link meets it, with these exceptions: the 15-minute blocks in the Day planner are only about 20 px tall (a 15-minute slot cannot be 44 px at this scale; the Earlier / Later / Shorter / Longer / Remove buttons below the planner are 44 px and do the same job, and blocks are also keyboard-operable); the weekday bars in the Pro report preview are informational and 31 px wide on a phone; the small minus/plus buttons beside brain-dump times are 30 px on desktop with a 44 px invisible hit area (and a real 44 px on phones); inline text links inside sentences (for example "Privacy Policy" in the consent line) follow normal text-link sizing.
- Mouse dragging in the planner skips over positions that would overlap another block, so a fast drag can jump past a short block; the block never overlaps.
