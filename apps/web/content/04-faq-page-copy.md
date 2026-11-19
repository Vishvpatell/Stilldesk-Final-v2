# 04. FAQ Page Copy (`/faq`)

**Page title (H1):** Help and FAQ
**Intro:** The questions we get asked most. If yours isn't here, email {{SUPPORT_EMAIL}}.
**Last updated line:** Last updated: November 15, 2026

UI note: group by the headings below. Every answer must be visible in the HTML. Use real `<details>`/`<summary>` or an accessible accordion. Add FAQPage JSON-LD (file 07). The first 8 questions of the home page preview are marked (HOME).

---

## About Stilldesk

**What is Stilldesk?** (HOME-related)
Stilldesk is a calm, healthy study app for college students. It catches your plan the moment you think of it (in class, in a free period), hands it back when you sit down at your desk, and blocks distracting apps only while you are studying.

**Is this just another Pomodoro timer?** (HOME)
No. Timers are only one part. Stilldesk starts where the problem starts: you capture a plan in class with a messy brain-dump, the AI organises it by subject, time and order, an arrival prompt hands it back when you reach your room, and then you study with a stopwatch, a timer or a 90-minute deep work mode. Blocking applies only during your session.

**Who is Stilldesk for?**
College students, especially first and second years in hostels or dorms, who want to study but keep losing hours to apps like Instagram and YouTube. Version 1 is for adults aged 18 and over.

**Will it make me study more?**
We can't promise results. Stilldesk is a tool that makes it easier to start and easier to stay with what you planned. You are still the one studying.

**Is Stilldesk a medical or mental-health app?**
No. It is a study tool. It is not a medical, mental-health or professional service.

---

## Launch and availability

**When does Stilldesk launch?** (HOME)
Soon. We are in the pre-launch stage. The plan is a closed beta with a small group of students, then a free launch on Google Play. Join the waitlist and we will email you the day it is ready. We do not give fixed dates because we would rather ship it right.

**Which phones does it work on?** (HOME)
Stilldesk is **Android first** and will be released on Google Play. An iPhone version is planned later, but there is no date. Apple has to approve the permission that app blocking needs on iPhone.

**Is Stilldesk free?** (HOME)
The core promise is free: capture, the arrival prompt, study sessions and basic blocking. Pro is an optional upgrade with extras such as unlimited AI brain-dumps, unlimited blocked apps, full charts, exam mode and sync. Pro launches after the free app is stable.

**How much will Pro cost?**
The price is not set yet. We are asking the waitlist what would feel fair for students, so we can price it sensibly. People on the waitlist get an early-bird offer and a 7-day Pro trial.

**What is the early-bird offer?**
{{EARLY_BIRD_OFFER}}. The exact terms are in the Terms of Service and in your confirmation email.

**Will there be ads?**
No. Stilldesk has no ads. It is paid for by Pro.

---

## The waitlist

**What do I get from joining the waitlist?**
An email the day Stilldesk launches, the early-bird offer, a 7-day Pro trial, and (if you opt in) a chance to join the closed beta.

**Why do I have to confirm my email?**
It proves the address is yours and stops others from signing you up. You get one confirmation email with a link. Until you click it, we will not send you launch updates.

**I didn't get the confirmation email.**
Check your spam or promotions folder and search for "Stilldesk". If it is not there after a few minutes, sign up again with the same address (we will send a fresh link) or email {{SUPPORT_EMAIL}}.

**How many emails will you send?**
Only the confirmation, a welcome, occasional updates about the beta and launch, and the launch email. We never sell your address. Every non-essential email has an unsubscribe link.

**How do I unsubscribe or delete my waitlist data?**
Use the unsubscribe link in any email, or email {{PRIVACY_EMAIL}} and we will delete your data.

**What is the closed beta?**
A small group of about 10 to 20 students tests Stilldesk on real phones before launch and helps us tune notifications and blocking. You can opt in with a tick box in the survey. We will pick a mix of phone brands.

---

## Brain-dump and AI

**What is the brain-dump bar?** (HOME-related)
One blank bar on the home screen. Type or speak anything you need to do. Grammar, spelling and mixed languages do not matter. The AI turns it into tasks with a subject, a time estimate, a deadline if you mentioned one, and a suggested time slot.

**Does the AI save things without asking?**
No. You always see a preview first and confirm or edit before anything is saved.

**What if the AI isn't sure which subject a task belongs to?**
It uses "Unsorted" and asks once, instead of guessing wildly. You can drag the task to any subject later.

**What if I'm offline or the AI fails?**
Your raw text is saved as a plain task, so nothing is lost.

**Does the AI read my phone?** (HOME)
No. We send only the text you typed, your subject names and your free hours to the AI service, through our own server. Nothing else from your phone is sent. We do not log your task text, only how many brain-dumps you used.

**How many brain-dumps can I do?**
Free: 10 a day. Pro: unlimited. AI calls cost money, so a daily cap on the free tier is fair.

**Can I talk instead of type?**
The plan is to let you type or speak. We will explain exactly how voice input works in the app's privacy information before launch.

---

## Blocking and sessions

**Will it lock my phone?** (HOME)
No. Stilldesk blocks only the apps you choose, only during a study session. The moment the session ends or you tap End, every app opens normally.

**Can I end a session whenever I want?** (HOME)
Yes. Ending a session is always one tap, from the session screen or from the block screen.

**What is the emergency snooze?**
On the "Your session is on" screen you can tap "Take 5 minutes" for a 5-minute pause (once or twice per session).

**Which apps are never blocked?**
Phone, emergency calling, messages for emergencies, Settings, Clock, and Stilldesk itself.

**Do you block everything except an allowed list?**
No. Stilldesk uses a **blocklist**: only apps you pick are blocked. Calculator, PDF reader, notes and everything else just work. A strict "allowed apps only" mode is planned for Pro.

**Does it block websites?**
Not in version 1. Blocking sites inside a browser on Android needs heavy, policy-sensitive tools, and we will not claim something we can't do reliably. If you want your browser blocked, add the browser app to your blocklist.

**Can I get around the blocking?**
Yes, if you really want to: you can turn off a permission or uninstall. That is fine. Stilldesk is a speed bump you chose, not a cage.

**Why does Stilldesk ask for permissions?**
To block apps during a session it needs **Usage Access** (to see which app is in front, only while a session runs) and **Display over other apps** (to show the "Your session is on" screen). It runs a visible foreground service during a session. Before asking for any permission, the app shows a plain-language screen explaining why. It does **not** use Android's Accessibility Service, which can read everything on your screen.

**Will it drain my battery?**
Stilldesk checks the foreground app only while a session is running, every one to two seconds, and stops completely otherwise. We will measure battery use in the beta.

**Which study modes are there?**
Free study (a stopwatch, the default), a timer (15, 25 or 45 minutes, or custom), and a 90-minute deep work mode. Some people find countdowns stressful and others want a clear block, so you choose.

**What counts as a session?**
Sessions of 5 minutes or more are saved. Pauses are tracked separately as breaks.

---

## The arrival prompt

**How does Stilldesk know I'm at my desk?**
You choose. Any one of these can trigger it: your saved Wi-Fi, a small area around your room (a geofence), a time of day, or a manual "I'm at my desk" button.

**Do I have to share my location?** (HOME)
No. Location is optional. If you decline, use the manual button or the time fallback. Wi-Fi detection on Android may need the location permission, so we offer alternatives.

**Will it take over my screen?**
No. It is one notification per arrival, shown in your own words. Never a full-screen takeover.

---

## Streaks, stats and notifications

**How do streaks work?**
A day counts if you study at least 20 minutes (you can change this from 10 to 60). You get one automatic freeze day each week. If you miss days, your streak resets quietly with a "Welcome back" message. Your best streak and total hours are always kept. No lost-streak warnings and no red badges.

**What is the day reset time?**
Your day ends at 4:00 AM by default (you can change it), so a late-night session counts for the day you started it.

**How many notifications will I get?**
Two a day at most by default: the arrival prompt and one optional evening plan reminder. Quiet hours run from 11 PM to 7 AM by default. You can snooze everything for the day with one tap.

---

## Study rooms (after launch)

**What are study rooms?**
Private groups for friends and public topic rooms. Each person who is studying appears as a small lit window. Lights on means studying now.

**Can people chat or message me?**
No. There is no chat, no direct messages, no images and no links in version 1.

**Are there leaderboards?**
No. There are no leaderboards, rankings or hour counts.

**How do you keep rooms safe?**
Nicknames are filtered, you can report and block people, room owners can remove members, and reports go to a moderation queue. Creating a public room needs Pro, which reduces spam. You can also study in invisible mode.

---

## Privacy and data

**Where is my data stored?**
On your phone first. The cloud is used only for AI brain-dumps, study rooms and Pro sync.

**Do you sell my data?**
Never. No ads and no selling.

**Can I export or delete my data?**
Yes. The app has an easy **Export my data** button and a **Delete everything** button.

**What does the website collect?**
Only what you give us (email, optional name, survey answers, feedback) plus basic, privacy-friendly site statistics. See the Privacy Policy and the Data and Privacy page.

---

## Contact

**How do I reach a human?**
Email {{SUPPORT_EMAIL}}. {{SUPPORT_RESPONSE_PROMISE}}

**I want to report a problem or suggest a feature.**
Use the Feedback page (`/feedback`) or email {{SUPPORT_EMAIL}}.
