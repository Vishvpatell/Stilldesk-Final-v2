# 01. Strategy: What We Kept, Removed and Added (vs. the Focal site)

## 1. What this website must do

**One job:** turn a visiting college student into a confirmed waitlist member (and, for some, a closed-beta volunteer).

**The one idea to land in 10 seconds:** *"Stilldesk catches your plan in class, hands it back when you sit down at your desk, and blocks distractions only while you study."*

**Lead with the two things nobody else has** (master plan, section 7):
1. The **lecture-to-room hand-off** (capture in class, arrival prompt at your desk).
2. The **AI brain-dump** (write messy, it organises into subjects, time and order).

Do not lead with "a focus timer." Timers are everywhere.

## 2. Audience

- **Primary:** college students, especially first and second years in hostels or dorms, who want to study but keep losing hours to Instagram, YouTube and similar apps.
- **Mindset:** tired of guilt-driven productivity apps, wants something calm that does not nag, wants control.
- **Age:** adults 18+ in v1 (this keeps Google Play compliance simpler).
- **Language:** English first. (The AI brain-dump handles mixed-language notes, which is worth stating.)

## 3. Positioning in one paragraph

Stilldesk is a calm, healthy study app. It fixes the gap between where you make a plan (a lecture, a free period) and where you need it (your desk). It keeps distractions away only while you study, you can always end a session, and it never shames you.

## 4. What we KEPT from the Focal approach (the approach, not the words)

| Idea on the Focal site | How Stilldesk uses it |
|---|---|
| Strong emotional "why" section before features | Our problem story: "the plan that disappears" (original writing) |
| A numbered "loop" of the user journey | Our six-stage loop: Dump, Arrive, Sit down, Focus, Protect, Study together |
| Calm tone, no pressure | Kept and made stricter (voice rules in file 06) |
| Pre-registration with an early discount | Waitlist with an early-bird offer and a 7-day Pro trial |
| Simple 3-step "how to pre-register" | Kept (join, confirm email, get the offer) |
| FAQ section + a separate Help and FAQ page | Kept, but with **all answers visible** and far more of them |
| Support line "a real person reads every email" | Kept only if true (placeholder `{{SUPPORT_EMAIL}}`; promise a reply window only if you can keep it) |
| Dedicated Privacy, Terms and Data and Privacy pages | Kept (files 08, 09, 10) |
| "Launching soon" status | "Launching soon on Android" |
| Shared study rooms as a feature | Kept as **"Study together" (coming after launch)**, with the lit-windows idea (no rankings) |

## 5. What we REMOVED because it does not fit Stilldesk (and why)

| Removed | Why |
|---|---|
| **The orb** | Another app's signature visual. Stilldesk has its own: the **Lamp**. |
| **"Worlds" gallery** (8 ambient environments with countdown numbers) | Not in the v1 plan (only "extra themes and sounds" in Pro). Would promise something we are not building. |
| **Achievements / "earns orbs"** | Stilldesk explicitly rejects points, levels, trees, pets and rewards. |
| **iPhone / App Store / Apple Screen Time wording** | Stilldesk is Android first (Google Play). Blocking uses Usage Access + overlay, not Apple's framework. |
| **"30% off Focal Pro" mechanics via Google Form only** | Stilldesk stores the waitlist in its own database with double opt-in (Google Form kept only as a day-one fallback). |
| **Open Source Licenses page** | Premature: there is no app build yet. Add `/licenses` only at app launch. |
| **Firebase / RevenueCat / Flutter / Crashlytics wording** in legal pages | Different stack. Stilldesk uses Kotlin, Express, MongoDB, Resend, Google Play Billing. |
| **Leaderboard of "people you studied with"** (in Focal's data page) | Stilldesk has **no leaderboards or rankings**. |
| **"No streak nag" claim next to a streak feature** | Stilldesk's promise is exact: forgiving streaks, one freeze day a week, no lost-streak warnings. |
| **Animated-only headline text** (the Focal scrape showed garbled text) | All text must be real HTML text. |
| **Footer links to anchors that do not exist** | Every link must work. |
| **Visible drafting notes** left inside legal pages | Never ship placeholder notes to visitors. |
| **Collapsed FAQ answers hidden from the page source** | Hurts SEO and accessibility. |
| **Vague "pricing is a surprise"** | Stilldesk states Free vs Pro clearly (no price until validated by the waitlist survey). |

## 6. What we ADDED (not on Focal, needed for Stilldesk)

1. **The "plan that disappears" problem story**: the core pain, told in a student's real moment.
2. **A "Day with Stilldesk" timeline**: free period, arrival at the room, session, night.
3. **A live example of the brain-dump**: messy text in, organised tasks out (labelled "example").
4. **An honest blocking section** ("Will it lock my phone? No."): what is blocked, what is never blocked, snooze, end session, honest limits, no website blocking in v1.
5. **"Our promises"**: the seven healthy-app rules in plain words.
6. **The Lamp section**: light on means studying; it never grows, scores or "dies".
7. **Free vs Pro table** with the rule "the core promise stays free".
8. **Roadmap**: Launch, Study rooms, Pro, Habits and Exam mode, iPhone later.
9. **On-device privacy section** and a full `/data` page for the future app.
10. **Waitlist survey + closed-beta opt-in** (the master plan wants 10 to 20 beta students in weeks 9 to 11). Extra useful questions: Android or iPhone, and phone brand (blocking reliability differs by brand).
11. **Double opt-in email flow** with confirm, welcome, beta and launch emails.
12. **Pages Focal does not show:** `/waitlist/confirmed`, `/unsubscribe`, `/feedback`, a proper 404.
13. **Full SEO pack:** titles, descriptions, Open Graph, JSON-LD, sitemap, robots.
14. **Backend spec** for the waitlist API (security, tokens, rate limits, tests).
15. **Trademark note** in the footer (third-party app names such as Instagram and YouTube are used only as examples).
16. **Voice input caveat.** The master plan says users can "type or speak" a brain-dump. If speech-to-text is used, the privacy text must say how. See file 14.
17. **Optional founder note slot.** A short real note builds trust, but only if the owner writes it. It is never invented.

## 7. Content rules that protect trust

- **No fake social proof.** Until real students use it, there are no testimonials, ratings or numbers.
- **No fake urgency.** No countdown timers, no "limited spots" unless the limit is real and documented.
- **No health claims.** Stilldesk is a study tool, not a medical or mental-health service.
- **No promises about results** ("you will study 2 hours more"). Describe what the product does, not what will happen to the user.
- **State limits plainly.** A determined user can turn off a permission or uninstall. Stilldesk is "a speed bump you chose, not a cage."
- **Do not name competitors on the public site.**

## 8. Success metrics for the site

- Visit to waitlist submit conversion rate.
- Submit to confirmed (double opt-in) rate.
- Confirmed to survey completed rate.
- Beta opt-ins (target 10 to 20 usable students, with a mix of phone brands).
- Feedback messages received.
(Track events only; never track personal text. See file 12 and 13.)
