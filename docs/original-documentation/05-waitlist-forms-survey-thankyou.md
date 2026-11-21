# 05. Waitlist, Survey, Thank-you, Feedback and Utility Pages

All copy for forms and small pages. Tone: calm, warm, no pressure.

---

## A. Waitlist form (home `#waitlist`)

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | No | Max 80 characters |
| Email | email | Yes | Lowercase and trim before saving |
| Consent | checkbox | Yes | Unchecked by default |
| Honeypot (`company_website`) | hidden text | No | Must stay empty. Hidden from users and screen readers (`aria-hidden`, `tabindex=-1`). If filled, pretend success and save nothing |

**Consent text (store a version id, e.g. `consent-v1`):**
I agree to receive emails about Stilldesk's launch and beta. I've read the [Privacy Policy](/privacy), and I can unsubscribe at any time.

**Button:** Join the waitlist
**Submitting label:** Joining...

**Messages**
- Success (redirect to `/waitlist/thanks`).
- Invalid email: "That email doesn't look quite right. Could you check it?"
- Consent missing: "Please tick the box so we know you're happy to hear from us."
- Rate limited: "Lots of sign-ups from this connection. Please try again in a little while."
- Server error: "Something went wrong on our side. Please try again, or use [this form]({{GOOGLE_FORM_URL}})."

Never reveal whether an email is already registered. Show the same success page.

---

## B. Thank-you page (`/waitlist/thanks`)

**H1:** You're on the list.

**Body:** Thanks for joining. One more step so we know it's really you.

**Steps**
1. **Check your inbox.** We just sent a confirmation email. Click the link inside. (Check spam or promotions if it doesn't show up in a few minutes.)
2. **Help shape Stilldesk (optional).** After you confirm, you can answer a short survey. It takes about a minute.
3. **We'll email you at launch.** You'll get the early-bird offer ({{EARLY_BIRD_OFFER}}) and a 7-day Pro trial.

**Small note:** Didn't get it? Email {{SUPPORT_EMAIL}}.
**Link:** Back to the home page

UI note: `noindex`.

---

## C. Confirmation page (`/waitlist/confirmed`)

Shown when the email link is clicked.

**Success H1:** Confirmed. You're in.
**Body:** Your spot on the Stilldesk waitlist is confirmed. We'll be in touch as the beta and launch get closer.
**Button:** Answer a one-minute survey (optional) (goes to `/waitlist/survey?token=...`)
**Secondary link:** Maybe later

**Expired link:** H1 "That link has expired." Body: "No problem. Join again with the same email and we'll send a fresh one." Button: Back to the waitlist.
**Invalid link:** H1 "That link doesn't look right." Body: "Try the link in your email again, or contact {{SUPPORT_EMAIL}}."

---

## D. Survey (`/waitlist/survey`)

Optional. One screen, 9 questions, all skippable. Do not collect more than this. Save under the waitlist entry (file 12).

**Intro:** Help us build the right thing. Every question is optional.

1. **What year are you in?** (single choice) 1st year · 2nd year · 3rd year · 4th year or above · Postgraduate · Other
2. **Which apps distract you most?** (multi-select + "Other") Instagram · YouTube · WhatsApp · Snapchat · X (Twitter) · Reddit · Games · Short-video apps · Other
3. **When do you lose focus most?** (multi-select) Morning · Afternoon · Evening · Late night · After classes · Before exams · Other
4. **Do you prefer a stopwatch or a timer?** Stopwatch · Timer · Both · Not sure
5. **What would you pay per month for Pro?** (single choice) Nothing, I'd stay on free · Under the price of one coffee · About one coffee · About two coffees · More than that
   (Plain currency-free ranges avoid committing to a price. Alternatively a free-text number field.)
6. **What would make you delete this app?** (short text, max 300 characters)
7. **Which phone do you use?** Android · iPhone · Both
8. **What is your phone brand?** (only if Android) Samsung · Xiaomi/Redmi/Poco · Realme · OnePlus · Oppo · Vivo · Motorola · Google Pixel · Other
   (Why we ask: some brands close background apps aggressively, which affects blocking, so we want a mix on the beta.)
9. **Would you like to try the closed beta?** Yes, I'm interested · Maybe later · No thanks

**Submit:** Send my answers
**Skip link:** Skip for now

**Thank-you text:** Thank you. That genuinely helps. We'll email you if you're picked for the beta.

---

## E. Unsubscribe page (`/unsubscribe`)

**Confirming H1:** You're unsubscribed.
**Body:** We've removed {{email shown partially, e.g. j***@gmail.com}} from Stilldesk emails. Sorry to see you go. If this was a mistake, you can [join again](/#waitlist).
**Link:** Delete my data too (mailto to {{PRIVACY_EMAIL}} with a prefilled subject "Delete my Stilldesk waitlist data").

Rules: unsubscribe is one click (no login, no survey), takes effect immediately, and is idempotent.

---

## F. Feedback page (`/feedback`)

**H1:** Tell us what you think.
**Intro:** A real person reads every message. Ideas, bugs, worries about the plan, all welcome.

| Field | Type | Required |
|---|---|---|
| Message | textarea (max 2000 characters) | Yes |
| Your email, if you'd like a reply | email | No |
| Honeypot | hidden | No |

**Helper text under message:** Please don't include passwords or anyone else's personal information.
**Button:** Send feedback
**Success:** "Thank you. We read every message{{FEEDBACK_REPLY_PROMISE}}."
**Error:** "We couldn't send that. Please try again, or email {{SUPPORT_EMAIL}}."

---

## G. 404 page

**H1:** This page is off.
**Body:** The lamp is dim here. Let's get you back to somewhere lit.
**Button:** Go to the home page
UI note: show the Lamp in its "off" state.

---

## H. Cookie and storage notice

Stilldesk's site uses no advertising or tracking cookies. If the analytics tool is cookieless (Umami normally is, **verify**), no consent banner is needed in most places, but check your local law. If any non-essential cookie or storage is added, add a consent banner with equally prominent **Accept** and **Reject** buttons.

**Footer line (optional):** We use privacy-friendly analytics that don't track you across sites. See the [Privacy Policy](/privacy).
