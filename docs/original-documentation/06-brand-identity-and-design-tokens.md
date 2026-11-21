# 06. Brand Identity and Design Tokens

## Name and wordmark
- Write it as **Stilldesk**: one word, capital S, never "StillDesk", "STILLDESK" in body text, or "Still Desk".
- Tagline: **Plan it. Sit down. Study.**
- Lockup: `Stilldesk: Plan it. Sit down. Study.` (wordmark, then tagline in smaller muted text).
- Wordmark: the name set in the brand font at a medium-bold weight with a small lit-lamp mark to its left. No gradients, no shadows on the text.

## The Lamp (signature visual)
A warm circle of light on a dark desk. **Light on means you are studying.** It is a status display, never a reward or a score.

### States
| State | What you see | Text label (always shown) |
|---|---|---|
| Idle / home | Lamp off, a faint outline | "Ready" |
| Session starts | Warm glow fades in over about 1 second | "Studying" |
| Focus | Steady glow with very slow breathing (about 6 seconds per cycle), no flashing | "Studying" |
| Break | Glow dims to about half | "On break" |
| Paused | Glow holds, slightly cooler | "Paused" |
| Session ends | Glow fades out gently, then the summary appears | none |

### Rules
- It never grows, shrinks, scores, levels up or "dies." Breathing changes **glow intensity only**, never size.
- **Reduced motion:** static glow, no breathing, no fade. Also show a static glow if the user is on low-battery mode.
- **Colour is never the only signal.** Always show text ("Studying", "On break").
- Dark-first and OLED friendly (true near-black background).
- It is yours. Do not copy other apps' visuals (no orbs).

### Where it appears on the website
- **Hero:** a single glowing lamp that turns on as the page loads (already lit if reduced motion).
- **Loop section:** the small lamp mark can brighten subtly per stage (optional, decorative).
- **Lamp section:** the three states side by side with labels.
- **Study together section:** a grid of small "windows," each a tiny lit or unlit square. No names, no hours, no ranks.
- **Empty states and 404:** lamp off with a friendly line.
- **Favicon and app icon:** a soft lit circle on near-black.

### Implementation hint (pure CSS, no images)
```css
.lamp {
  width: min(52vw, 360px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%,
    var(--lamp-core) 0%, var(--lamp-glow) 38%, rgba(255,184,77,0.0) 70%);
  box-shadow: 0 0 120px 30px rgba(255,184,77,0.18);
  opacity: 0;                       /* off */
  transition: opacity 1s ease;
}
.lamp.on { opacity: 1; }
@keyframes breathe { 0%,100% { opacity: .88; } 50% { opacity: 1; } }
.lamp.on.breathing { animation: breathe 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .lamp { transition: none; }
  .lamp.on.breathing { animation: none; opacity: 1; }
}
```
Always pair the lamp with a text label such as `<p class="lamp-label">Studying</p>`. The lamp image itself is decorative (`aria-hidden="true"`).

## Palette (proposed design tokens: choose once, then never change ad hoc)

Verify final contrast with a checker before launch.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0B` | Page background (near-black, OLED friendly) |
| `--surface` | `#121214` | Cards, sections |
| `--surface-2` | `#1A1A1D` | Raised cards, inputs |
| `--border` | `#26262B` | Hairlines |
| `--text` | `#F4EFE6` | Primary text (soft off-white) |
| `--text-muted` | `#A8A29A` | Secondary text |
| `--lamp-core` | `#FFD488` | Centre of lamp glow |
| `--lamp-glow` | `#FFB84D` | Warm amber lamp |
| `--lamp-cool` | `#F3D9A8` | Paused state (slightly cooler) |
| `--accent` | `#8497B8` | The **one** muted accent for buttons and links |
| `--on-accent` | `#0A0A0B` | Text on accent buttons |
| `--danger` | `#E58C8C` | Error text only (always with words, never colour alone) |
| `--focus-ring` | `#F4EFE6` | 2 px visible keyboard focus outline |

Rules: amber is reserved for the lamp and tiny highlights. Buttons use the muted accent so the lamp stays special. Never use red badges or red alerts as pressure.

## Typography
- **One** clean, readable sans-serif with an open licence. Suggested: **DM Sans** (SIL Open Font License 1.1). **Check the licence** and self-host the font files, or use the allowed Google Fonts host.
- Fallback stack: `"DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Scale (fluid): H1 clamp(2.4rem, 6vw, 4.5rem), H2 clamp(1.7rem, 3.6vw, 2.6rem), H3 1.25rem, body 1.0625rem (17px) with line-height 1.6, small 0.875rem.
- Weights: 400 body, 500 labels, 600 to 700 headings. Do not use more than three.
- Left-aligned text for reading; max line length about 65 characters.

## Shape, space, layout
- Rounded corners: 14px cards, 999px pill buttons, 10px inputs.
- Generous spacing; few elements per screen/section.
- Container max-width about 1120px; single column on mobile; 8 px spacing scale.
- Buttons: minimum 48 px tall (touch target); primary = accent fill, secondary = text link or outlined.

## Motion
- Slow and calm. Nothing bounces, shakes, pulses or flashes.
- Allowed: opacity fades 300 to 1000 ms, the lamp glow, accordion open/close under 200 ms.
- Everything animated has a reduced-motion alternative (instant or static).

## Voice and tone

| Do say | Never say |
|---|---|
| "Your plan is ready." | "You're falling behind!" |
| "Nice, 40 minutes done." | "You failed your streak." |
| "Take 5 if you need it." | "Are you sure you want to quit?" |
| "Welcome back." | "You lost your 12-day streak." |
| "Your session is on." | "Stay locked in!" |

Writing rules
- Plain, short sentences. Talk like a calm friend who studies too.
- No exclamation-mark hype. No emojis in headings. (A rare emoji in a footnote is fine; none in the product.)
- No guilt, no shame, no fear of missing out, no fake scarcity.
- Describe what the product does; never promise outcomes.
- Use "you" and "your." Use "we" for the team.
- Spell out limits honestly.

## Imagery
- No stock photos of students. No illustrations of trees, pets or trophies.
- Only: the lamp, simple UI mock cards drawn in HTML/CSS or SVG (labelled "example"), and the OG share image.
- Real app screenshots can be added after the beta build exists. Never fake a screenshot of features that don't exist yet.

## Social and share image (OG)
1200 x 630. Near-black background, a soft amber lamp on the left, wordmark and tagline "Plan it. Sit down. Study." on the right, small text "Launching soon on Android". Text at least 56 px so it reads in chat previews.

## Icon
App/favicon: a soft lit circle (amber) on near-black, rounded square. It must stay legible at 16 px. Provide 32, 180 (Apple touch), 192 and 512 px PNGs and an SVG.
