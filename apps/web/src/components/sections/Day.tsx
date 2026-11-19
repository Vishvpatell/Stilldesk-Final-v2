"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";

// Copy: docs/03, section 4. Each moment gets one small drawn state; the page behind it moves from day to night.
const MOMENTS = [
  { k: "free", title: "Free period, in class", body: "You open Stilldesk and type: “dbms assignment friday, physics numericals ch3 revise, buy notebook.” The AI shows three tasks sorted by subject with time estimates. You confirm." },
  { k: "arrive", title: "Evening, you reach your room", body: "One notification: “Your plan is ready. First up: DBMS assignment, about 45 min.”" },
  { k: "sit", title: "You sit down and start", body: "A stopwatch runs. If you open a distracting app you chose, you see a friendly note that your session is on." },
  { k: "done", title: "You finish", body: "A summary shows your time and subject. You tick the task and take a break, tagged “Snack” if you like." },
  { k: "night", title: "Night", body: "Your streak updates quietly. Quiet hours begin. Nothing buzzes." },
];
const clamp = (x: number) => Math.max(0, Math.min(1, x));

function Glyph({ k }: { k: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (k === "free") return (<svg viewBox="0 0 120 56" className="gl"><rect x="2" y="6" width="116" height="44" rx="12" {...c} opacity=".5" /><path className="draw" pathLength={1} d="M16 24h46M16 34h72" {...c} /><circle cx="104" cy="28" r="5" {...c} /></svg>);
  if (k === "arrive") return (<svg viewBox="0 0 120 56" className="gl"><circle className="ring r1" cx="60" cy="28" r="10" {...c} /><circle className="ring r2" cx="60" cy="28" r="20" {...c} /><circle cx="60" cy="28" r="4" fill="currentColor" /></svg>);
  if (k === "sit") return (<svg viewBox="0 0 120 56" className="gl"><circle cx="60" cy="30" r="20" {...c} opacity=".6" /><path d="M54 6h12" {...c} /><path className="hand" d="M60 30V16" {...c} /></svg>);
  if (k === "done") return (<svg viewBox="0 0 120 56" className="gl"><circle cx="30" cy="28" r="14" {...c} opacity=".6" /><path className="draw" pathLength={1} d="M23 28l5 5 10-11" {...c} /><rect x="58" y="18" width="48" height="20" rx="10" {...c} /><text x="82" y="32" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">Snack</text></svg>);
  return (<svg viewBox="0 0 120 56" className="gl"><path d="M70 12a18 18 0 1 0 14 28A15 15 0 0 1 70 12z" {...c} /><circle cx="94" cy="16" r="1.5" fill="currentColor" /><circle cx="102" cy="30" r="1.2" fill="currentColor" /></svg>);
}

export function Day() {
  const ref = useRef<HTMLElement>(null);
  const cache = useRef<{ cards: HTMLElement[]; rail: HTMLElement } | null>(null);

  useScrub(ref, {
    mode: "pass",
    onUpdate: () => {
      const el = ref.current!;
      if (!cache.current) cache.current = { cards: Array.from(el.querySelectorAll<HTMLElement>(".moment")), rail: el.querySelector<HTMLElement>(".drail")! };
      const { cards, rail } = cache.current, mid = innerHeight * 0.52;
      let best = 0, bd = 1e9;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
        c.style.setProperty("--c", clamp(1 - d / (innerHeight * 0.55)).toFixed(3));
        if (d < bd) { bd = d; best = i; }
      });
      cards.forEach((c, i) => c.classList.toggle("on", i === best));
      el.dataset.moment = String(best);
      const rr = rail.getBoundingClientRect();
      el.style.setProperty("--fill", clamp((mid - rr.top) / rr.height).toFixed(3));
    },
  });

  return (
    <section className="day" id="day" ref={ref} aria-labelledby="day-h">
      <div className="sky sky-cool" aria-hidden="true" /><div className="sky sky-warm" aria-hidden="true" /><div className="sky sky-night" aria-hidden="true" />
      <div className="day-grid">
        <div className="day-left">
          <div className="day-sticky">
            <p className="eyebrow rv">One ordinary day</p>
            <h2 id="day-h" className="sec-h rv d1">What a day looks like</h2>
            <div className="day-mark" aria-hidden="true"><span className="mark" /></div>
          </div>
        </div>
        <ol className="moments">
          <span className="drail" aria-hidden="true"><i /></span>
          {MOMENTS.map((m, i) => (
            <li className="moment" key={m.k} data-i={i}>
              <span className="mdot" aria-hidden="true" />
              <div className="mcard">
                <Glyph k={m.k} />
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
