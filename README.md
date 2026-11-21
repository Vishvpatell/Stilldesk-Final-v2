# Stilldesk: website + waitlist API

**Plan it. Sit down. Study.** A cinematic website (Next.js) and a waitlist backend (Express + MongoDB + Resend).

```
Stilldesk-Final/
  apps/web/    the website (Next.js, TypeScript, Tailwind)
  apps/api/    the waitlist API (Express, TypeScript, Zod, Prisma + MongoDB, Resend)
  docs/        notes: API, SECURITY, TESTING, REQUIRED-SETUP, the Phase-1 audit, and unmodified copies of your original documentation
  .env.example every setting explained (copy parts into apps/web/.env.local and apps/api/.env)
  DEVIATIONS.md  every place this differs from your documents (please review)
```

## Run it on your MacBook (VS Code)

**1. Unzip.** Double-click `Stilldesk-Final.zip`. Move the `Stilldesk-Final` folder somewhere you'll find it (for example Documents).

**2. Install Node.js** (the engine that runs the project). Go to https://nodejs.org, download the **LTS** version, install it. Check it worked: open Terminal and type `node -v`. It must show v20.9 or higher (v22 is ideal).

**3. Install VS Code** from https://code.visualstudio.com if you don't have it. Then in VS Code: *File > Open Folder…* and choose `Stilldesk-Final`. Open its terminal: menu *Terminal > New Terminal*.

**4. Install the project's building blocks** (needs internet, 2–5 minutes). In the terminal:
```
npm run install:all
```

**5. See the website (no database needed).**
```
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
```
Open **http://localhost:3000**. Press `Ctrl + C` in the terminal to stop. Without the API running, the waitlist form tells visitors honestly that sign-ups aren't connected. That is expected at this step.

**6. Make the waitlist really work.** You need two free accounts (details in `docs/REQUIRED-SETUP.md`):
- **MongoDB Atlas** (https://www.mongodb.com/atlas): create a free cluster and copy its connection string.
- **Resend** (https://resend.com): create an API key. (For real visitors, verify your own sending domain.)

Then:
```
cp apps/api/.env.example apps/api/.env
```
Open `apps/api/.env` in VS Code and fill in `DATABASE_URL`, `TOKEN_SECRET` (make one with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`), and either `RESEND_API_KEY` + `EMAIL_FROM`, **or for a first test set `EMAIL_MODE=console`** (it prints the confirmation link in the terminal instead of sending an email; development only). Then:
```
npm --prefix apps/api run db:push
npm run dev:api
```
Check **http://localhost:4000/health**: it should show `"database":"up"`. In `apps/web/.env.local` set `NEXT_PUBLIC_API_URL=http://localhost:4000`, stop and restart `npm run dev:web`, and submit the form on the website. With `EMAIL_MODE=console`, copy the confirmation link from the API terminal into your browser to complete the flow.

**7. Check everything.** `npm run check` runs type-checking, linting and all tests. **8. Production build:** set `NEXT_PUBLIC_SITE_URL` to your real https domain, then `npm run build:web`. Before launch: `STRICT_PLACEHOLDERS=1 npm run build:web` fails while any unfinished legal or offer detail is still on a page.

## Pages
`/` (17 sections, scroll-driven Lamp story), `/faq`, `/feedback`, `/privacy`, `/terms`, `/data`, `/waitlist/thanks`, `/waitlist/confirmed`, `/waitlist/survey`, `/unsubscribe`, custom 404 and error pages, `/sitemap.xml`, `/robots.txt`.

## Where to change things
| Change | File |
|---|---|
| Colours and fonts | `apps/web/src/app/globals.css` (top) |
| Unfinished business details | `apps/web/src/config/site.config.ts` |
| Free vs Pro rows, prices switch | `apps/web/src/config/pricing.config.ts` |
| Waitlist, email wording | `apps/api/src/services/` |

## Honest status
Read `docs/TESTING.md`. In short: all logic and pages were tested here (36 automated tests pass, every route checked at 4 widths), but `npm install`, the Next.js build, ESLint, `npm audit`, the live Express server, a real database and real email could not be run in my offline environment. If the first `npm run check` or `npm run dev:*` shows an error, send it to me and I'll fix it.
