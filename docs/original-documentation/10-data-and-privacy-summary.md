# Data and Privacy (plain-language page, `/data`)

**Last updated:** November 15, 2026

A plain-language list of the data Stilldesk holds, where it lives, how long it stays, and how to get rid of it. For the legal text, see the [Privacy Policy](/privacy).

Stilldesk is not released yet. Part 1 covers this website today. Part 2 describes how the app is **designed** to handle data; the exact final list will be published with the app's own privacy policy before launch.

---

## Part 1: This website and waitlist (today)

### 1. What we store

| Data | Where it lives | Why |
|---|---|---|
| Email address | Our database (MongoDB Atlas) | Send you the confirmation and launch emails |
| Name (optional) | Our database | Greet you by name |
| Consent record (time and text version) | Our database | Prove you agreed |
| Confirmed or unsubscribed status | Our database | Know when to email you and when to stop |
| Survey answers (optional) | Our database | Build the right product and pick beta testers |
| Beta opt-in and phone brand (optional) | Our database | Choose a good mix of testers |
| Feedback message and optional contact email | Our database | Read and reply to you |
| Email delivery events (delivered, bounced, complaint) | Resend | Stop emailing bad addresses |
| Site statistics (page views, button clicks, no personal data) | {{ANALYTICS_TOOL}} | Understand how the site is used |
| IP address (briefly) | Our hosting and API provider logs | Security and stopping bots |

### 2. What we do not store
- No advertising identifiers, no ad networks, no cross-site tracking.
- No passwords or accounts on this website.
- No payment details.
- No sale or rental of your data.
- No names, emails or form text in analytics.

### 3. Unsubscribe, access, export and delete
- **Unsubscribe:** one click in any email. It takes effect immediately.
- **Get a copy of your data:** email {{PRIVACY_EMAIL}} from the address you used. We will send a machine-readable export within 30 days, free of charge.
- **Delete your data:** email {{PRIVACY_EMAIL}} with the subject "Delete my Stilldesk waitlist data." We remove your waitlist entry, survey answers and feedback linked to your email within 30 days. We keep only a minimal "do not email" record if you unsubscribed, so we do not email you again.

### 4. How long data is kept
- Waitlist data: until {{RETENTION_WAITLIST}} after launch, or until you unsubscribe or ask us to delete it.
- Unconfirmed sign-ups: deleted after {{RETENTION_UNCONFIRMED}}.
- Feedback: {{RETENTION_FEEDBACK}}.
- Server logs: about {{RETENTION_LOGS}}.
- Backups: rolling; deleted data can remain in a protected backup for a short time before it is overwritten.

---

## Part 2: The app (how it is designed to work)

*These are design commitments, not a final list. We will confirm them in the app's privacy policy and the Google Play Data safety form.*

### On your phone only
- Your tasks, subjects, study sessions, breaks, streaks and settings are stored on your device first and work offline.
- **App blocking runs entirely on your phone.** The apps you choose to block, and which apps you use, are not sent to us.
- Your arrival trigger (saved Wi-Fi, location area, time) is checked on your phone.
- Preferences such as theme and notification settings stay on the device.

### Sent to our server only when a feature needs it
- **AI brain-dump:** the text you typed, your subject names and your free hours go to our server, which passes them to an AI service and returns tasks. We do not log the text, only how many brain-dumps you used each day.
- **Pro sync (optional):** your records are synced so they are on more than one phone.
- **Study rooms (after launch):** your nickname and a "studying now" status (with elapsed time, and the subject only if you choose) are shown to room members **during a session only**, then disappear. An invisible mode is available.
- **Subscription status:** whether Pro is active (purchases are handled by Google Play).

### What the app is designed never to do
- No ads and no selling data.
- No reading your screen. Stilldesk does not use Android's Accessibility Service.
- No blocking outside a study session.
- No chat or messages between users in version 1.

### Your controls in the app
- **Export my data** and **Delete everything** buttons, easy to find.
- You choose which permissions to grant. Each one is explained in plain language before it is requested.

### Voice input
The plan is to let you speak your brain-dump as well as type it. We will explain exactly how the speech is processed in the app's privacy policy before it ships. {{VOICE_INPUT_NOTE}}

### Age
Stilldesk version 1 is for adults aged 18 and over.

---

**Questions?** {{PRIVACY_EMAIL}}
