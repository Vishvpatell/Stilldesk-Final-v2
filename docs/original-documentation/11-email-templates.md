# 11. Email Templates (Resend)

Sent through Resend from `Stilldesk <hello@{{DOMAIN}}>` with Reply-To `{{SUPPORT_EMAIL}}`. Every email needs an HTML version **and** a plain-text version. Tone: calm, short, no hype, no emojis in subject lines.

Template variables: `{{name_or_there}}` (the name, or "there"), `{{confirm_url}}`, `{{survey_url}}`, `{{unsubscribe_url}}`, `{{early_bird_offer}}`.

**Receipts and tax invoices** come from the payment provider (merchant of record), not from Resend.

---

## 1. Waitlist confirmation (essential, sent right after sign-up)

**Subject:** Confirm your spot on the Stilldesk waitlist
**Preheader:** One click and you're on the list.

Hi {{name_or_there}},

Thanks for joining the Stilldesk waitlist. Please confirm it's really you:

[ Confirm my email ]  ({{confirm_url}})

The link works for 7 days. If you didn't sign up, you can ignore this email and nothing will happen.

Stilldesk is a calm study app for Android that catches your plan in class, hands it back at your desk, and blocks distractions only while you study. We'll email you when it's ready.

Plan it. Sit down. Study.
The Stilldesk team

*Footer:* You received this because someone entered this address on {{DOMAIN}}. {{EMAIL_POSTAL_ADDRESS}}

*Plain text version:* same words, link written out in full.

---

## 2. Welcome (after the confirm link is clicked)

**Subject:** You're on the Stilldesk list
**Preheader:** Here's what happens next.

Hi {{name_or_there}},

You're confirmed. Here's what to expect:

- A small group of students will try Stilldesk in a **closed beta** first.
- Then it **launches free on Google Play**.
- You'll get an **early-bird offer** ({{early_bird_offer}}) and a **7-day Pro trial** when it does.

Want to help shape it? A one-minute survey tells us what to build first, and lets you say if you'd like to try the beta:

[ Answer the short survey ]  ({{survey_url}})

That's it. We won't flood your inbox.

The Stilldesk team

*Footer:* You can [unsubscribe]({{unsubscribe_url}}) any time.

---

## 3. Beta invitation (sent only to people who opted in and were picked)

**Subject:** Want to try Stilldesk before everyone else?
**Preheader:** You've been picked for the closed beta.

Hi {{name_or_there}},

You said you'd like to try Stilldesk early, and we'd love your help. The closed beta runs for about {{BETA_LENGTH}}.

What we ask: use it on your real study days, and tell us what's annoying, confusing or broken. Honest feedback is the whole point.

How to join: {{BETA_INSTRUCTIONS}}

Thank you. Truly.
The Stilldesk team

*Footer:* unsubscribe link. Do not include a download link until the Google Play closed-test setup is ready.

---

## 4. Launch announcement

**Subject:** Stilldesk is live on Google Play
**Preheader:** Plan it. Sit down. Study.

Hi {{name_or_there}},

Stilldesk is ready. Capture your plan in class, get it back at your desk, and study with distractions held back only while you're studying.

[ Get Stilldesk on Google Play ]  ({{PLAY_STORE_URL}})

Your early-bird offer: {{early_bird_offer}}. Use code {{EARLY_BIRD_CODE}} when Pro is available. Your 7-day Pro trial is included.

Thanks for being here from the start.
The Stilldesk team

*Footer:* unsubscribe link.

---

## 5. Optional later emails (off by default, send only to people who agreed)

- **Weekly report** (in-app opt-in only): your study time, per subject. Easy unsubscribe.
- **Product updates:** only to people who agreed; one-click unsubscribe.
- **Support replies:** written by a person from `{{SUPPORT_EMAIL}}`.

---

## Rules and setup checklist

- Verify the sending domain in Resend and add the DNS records it asks for: **SPF, DKIM** and a **DMARC** record.
- Use a sending address like `hello@{{DOMAIN}}` and a Reply-To address you actually read.
- Handle **bounces and complaints**: stop emailing those addresses automatically.
- Keep an **unsubscribe link in every non-essential email** and honour it at once (also add the `List-Unsubscribe` and `List-Unsubscribe-Post` headers).
- Do not send launch updates to anyone who has not confirmed (double opt-in).
- Check Resend's current free-tier limits before launch day.
- Keep API keys only on the server.
- Include a valid postal address in marketing emails if your law requires it (**verify**).
- Never put task text or personal survey answers in an email.
- Confirmation tokens: random, single use, expire in 7 days, stored hashed.
