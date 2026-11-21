# Testing report (what was actually run, and what was NOT)

Test environment: a Linux sandbox with Node 22, Chromium (Playwright) and zod. It had NO internet, so packages could not be installed.

## RAN and PASSED
| Check | Result |
|---|---|
| API unit/integration tests (`apps/api/test`, node:test + real Zod) | 25 / 25 pass |
| Website unit tests (`apps/web/test`): API client incl. timeout, form validation, security headers, site-URL rule, placeholder checker | 11 / 11 pass |
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

## NOT RUN (cannot be, offline). First-run risk: these may show issues the first time you run them
- `npm install`, `npm run build` (Next.js production build), `npm run lint` (ESLint), `npm run typecheck` for the website (needs the React/Next type packages) and for the API glue files.
- `npm audit` (dependency vulnerabilities).
- The API running for real: Express routing, CORS, rate-limit middleware wiring, Prisma against a real MongoDB, real Resend emails. (All the logic behind them is tested; the glue is not executed.)
- Real devices, Safari/Firefox, screen readers, Lighthouse / Core Web Vitals.
- Next.js-specific behaviour of metadata, sitemap.xml, robots.txt, icons and the headers on a live server.

## How to run everything yourself
`npm run install:all` then `npm run check` (types + lint + all tests). If anything fails the first time, copy the message to me and I'll fix it.
