# 13. Quality, Accessibility and Launch Checklist

Tick every item before the site goes live.

## Content honesty
- [ ] No fake testimonials, ratings, user counts, press logos or download numbers.
- [ ] No fake urgency (no countdowns, no "only X spots") unless real and documented.
- [ ] "Launching soon on Android" is shown. iPhone is described as "later, no date."
- [ ] Blocking is described as **only during a session**, **always endable**, **no website blocking in v1**.
- [ ] No price shown. No specific free blocked-app number shown (still deciding 3 vs 5).
- [ ] Gentle Nudge is not mentioned (still undecided).
- [ ] Competitors are not named. No internal notes or risks are published.
- [ ] Planned features are labelled **After launch**.
- [ ] Third-party app names appear only as examples, with the "not affiliated" note.
- [ ] Brain-dump demo is labelled "Example".

## Text and links
- [ ] Every nav link and footer link goes to a real section or page (click each one).
- [ ] No `{{TOKEN}}` left anywhere in the built pages, emails or legal text (search the build output).
- [ ] No drafting notes, "[insert ...]" text or lorem ipsum visible.
- [ ] Legal pages show the correct "Last updated" date.
- [ ] Spelling and punctuation checked. "Stilldesk" is always one word with a capital S.
- [ ] All FAQ answers are in the page HTML (view source).

## Accessibility (aim for WCAG 2.2 AA)
- [ ] Colour contrast: body text at least 4.5:1, large text at least 3:1 (check each token pair).
- [ ] Colour is never the only signal (lamp states always have text; errors have words).
- [ ] `prefers-reduced-motion` honoured: no fades, no breathing, instant changes.
- [ ] Full keyboard navigation; visible focus ring on every interactive element; logical tab order.
- [ ] "Skip to main content" link works.
- [ ] One `<h1>` per page, headings in order, landmarks (`header`, `nav`, `main`, `footer`).
- [ ] Form fields have visible labels; errors are announced (`aria-live="polite"`) and tied to fields.
- [ ] Honeypot is hidden from screen readers and keyboard (`aria-hidden`, `tabindex="-1"`).
- [ ] Buttons and tap targets at least 44 to 48 px.
- [ ] Decorative lamp has `aria-hidden="true"`; informative images have alt text.
- [ ] Zoom to 200 percent and large system text: nothing is cut off, no horizontal scroll (except inside tables).
- [ ] Accordions work with keyboard and screen readers (`button` + `aria-expanded`).
- [ ] Wide tables scroll inside their own container.
- [ ] Test with a screen reader (TalkBack on Android, VoiceOver on iPhone).

## Responsive and performance
- [ ] Tested at 360 px, 390 px, 768 px, 1280 px and 1920 px widths.
- [ ] Mobile-first; thumb-friendly; no sideways scroll.
- [ ] Largest content paint about 2.5 s or better on mid-range Android on 4G.
- [ ] No layout shift from fonts or the lamp.
- [ ] Fonts self-hosted or allowed host; `font-display: swap`.
- [ ] Lighthouse: Performance, Accessibility, Best Practices, SEO all high (aim for 90+).

## Forms and backend
- [ ] Waitlist: success, error, duplicate, rate-limited and honeypot paths all tested.
- [ ] Double opt-in: confirmation email arrives, link confirms, expired and invalid links handled.
- [ ] Unsubscribe link works from every email and takes effect immediately.
- [ ] Survey saves and is optional; skipping works.
- [ ] Feedback form sends and the message is received.
- [ ] No endpoint reveals whether an email is registered.
- [ ] CORS only allows the site origin. Secrets are not in the repo or the browser.
- [ ] Database backup exists and a restore has been tested.
- [ ] Uptime check and error tracking are on.

## Email
- [ ] Sending domain verified in Resend (SPF, DKIM, DMARC).
- [ ] Test emails reach Gmail, Outlook and a college email in the inbox (not spam).
- [ ] HTML and plain-text versions both look right; unsubscribe link and headers present.

## SEO and sharing
- [ ] Titles, descriptions, canonical, Open Graph and Twitter card present on every page.
- [ ] OG image looks right when the link is pasted in WhatsApp, Instagram DM and X.
- [ ] `sitemap.xml` and `robots.txt` correct. Thank-you, survey, unsubscribe and 404 are `noindex`.
- [ ] JSON-LD validates (Rich Results test). No fake ratings.
- [ ] Favicon and touch icons show correctly.

## Privacy and legal
- [ ] Privacy Policy, Terms and Data page are live and linked from the footer of every page and from the waitlist consent line.
- [ ] Analytics tool confirmed; its behaviour (cookies or not) matches the privacy text. If cookies are used, a consent banner with equal Accept and Reject exists.
- [ ] Analytics receives no names, emails or form text.
- [ ] Legal text reviewed by a qualified person for your country (India DPDP, EU/UK GDPR if relevant).
- [ ] A way to request deletion works end to end (and someone is responsible for answering within 30 days).
- [ ] Postal address in marketing emails if your law requires it.

## Brand
- [ ] The Lamp is used consistently; no orb, pets, trees, trophies or leaderboards.
- [ ] Voice rules followed: no shame, no fear, no pressure, no hype.
- [ ] Dark-first and readable in bright sunlight (check on a real phone outside or on max brightness).

## After going live
- [ ] Submit the sitemap to Google Search Console.
- [ ] Watch waitlist conversion, confirmation rate, survey completion and beta opt-ins.
- [ ] Read every feedback message. Reply to support emails within the promised window.
- [ ] Check the name, domain and handles once more before spending on ads or promotion.
