# 07. SEO, Meta and Social

## Global
- `lang="en"`
- Canonical: `https://{{DOMAIN}}/` (and a canonical on every page)
- Theme colour: `#0A0A0B`; `color-scheme: dark`
- Robots: index `/`, `/faq`, `/privacy`, `/terms`, `/data`, `/feedback`. **noindex** the thank-you, confirmed, survey, unsubscribe and 404 pages.
- Sitemap at `/sitemap.xml` listing only indexable pages. `robots.txt` links to it.

## Home `/`
- **Title (under 60 chars):** `Stilldesk: Plan it. Sit down. Study.`
- **Meta description (about 155 chars):** `A calm study app for college students. Capture plans in class, get them back at your desk, and block distractions only while you study. Launching soon on Android.`
- **Open Graph:** `og:type=website`, `og:site_name=Stilldesk`, `og:title` = title, `og:description` = description, `og:image=https://{{DOMAIN}}/og.png` (1200x630), `og:url`.
- **Twitter/X card:** `summary_large_image`, same title, description and image.
- **Keywords (low value, optional):** study app, student planner, study timer, focus app, app blocker, AI study planner, Android study app.

## `/faq`
- **Title:** `Help and FAQ | Stilldesk`
- **Description:** `Answers about Stilldesk: how app blocking works, the AI brain-dump, the arrival prompt, privacy, the waitlist and more.`

## `/privacy`
- **Title:** `Privacy Policy | Stilldesk`
- **Description:** `How Stilldesk collects, uses and protects your data on this website and waitlist. No ads, no selling your data.`

## `/terms`
- **Title:** `Terms of Service | Stilldesk`
- **Description:** `The terms that govern your use of the Stilldesk website and waitlist, including the early-bird offer.`

## `/data`
- **Title:** `Data and Privacy | Stilldesk`
- **Description:** `A plain-language list of the data Stilldesk stores, where it lives, how long it is kept, and how to export or delete it.`

## `/feedback`
- **Title:** `Send feedback | Stilldesk`
- **Description:** `Tell us what you think about Stilldesk. Ideas, bugs and worries are all welcome.`

## JSON-LD (home)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Stilldesk",
      "url": "https://{{DOMAIN}}/",
      "email": "{{SUPPORT_EMAIL}}"
    },
    {
      "@type": "WebSite",
      "name": "Stilldesk",
      "url": "https://{{DOMAIN}}/"
    },
    {
      "@type": "SoftwareApplication",
      "name": "Stilldesk",
      "applicationCategory": "EducationApplication",
      "operatingSystem": "Android",
      "description": "A calm study app that captures your plan in class, hands it back at your desk, and blocks distracting apps only while you study.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    }
  ]
}
```
Notes: do not add `aggregateRating` or `review` (no real reviews exist). The SoftwareApplication block should be added only if the owner is comfortable listing a pre-release app; otherwise omit it until launch. Use `priceCurrency` that matches your store.

## JSON-LD (FAQ page)
Generate `FAQPage` schema from the questions and answers in file 04 (plain-text answers, no HTML). Do not add FAQ schema for questions that are not visible on the page.

## Social profiles (when they exist)
Add handles for Instagram etc. to the Organization schema (`sameAs`) after checking the name is free. Use `{{INSTAGRAM_HANDLE}}`.

## Image alt text
- Lamp hero: `alt=""` (decorative) with a visible text label.
- OG image: `alt="Stilldesk: Plan it. Sit down. Study."`
- Every UI mock (brain-dump example, lamp states): short descriptive alt or visible caption.
