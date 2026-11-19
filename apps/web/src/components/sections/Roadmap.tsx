"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";

// Copy: docs/03 section 13. An honest plan, with no promised dates.
const R: [string, string, string][] = [
  ["Now", "Pre-launch", "Building in the open with a small group of students."],
  ["Next", "Closed beta", "10 to 20 students test it on real phones."],
  ["Then", "Launch on Android (free)", "Capture, arrival prompt, sessions, basic blocking, stats and streaks."],
  ["After", "Study rooms", "Private groups first, then public topic rooms with moderation."],
  ["After", "Pro", "Unlimited AI and blocking, full charts, exam mode, sync."],
  ["Later", "And more", "Habit tracker, themes and sounds, an iPhone version (needs Apple’s approval, so no date)."],
];

export function Roadmap() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, { mode: "pass" });
  return (
    <section className="rd" id="roadmap" ref={ref} aria-labelledby="rd-h">
      <div className="rd-wrap">
        <p className="eyebrow rv">An honest plan, with no promised dates</p>
        <h2 id="rd-h" className="sec-h rv d1">What’s coming</h2>
        <ol className="rd-track">
          <span className="rd-rail" aria-hidden="true"><i /></span>
          {R.map(([k, t, d], i) => (
            <li className={`rd-node${i === 0 ? " now" : ""}`} key={t} style={{ ["--i" as string]: i }}>
              <span className="rd-dot" aria-hidden="true" />
              <p className="rd-k">{k}</p><h3>{t}</h3><p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
