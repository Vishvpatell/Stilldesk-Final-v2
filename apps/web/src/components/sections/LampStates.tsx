"use client";
import { useEffect, useRef, useState } from "react";
import { LampIcon, type LampState } from "@/components/ui/LampIcon";

// Copy: docs/03 section 8. The lamp is a status, not a score.
const STATES: [LampState, string, string][] = [
  ["studying", "Studying", "A steady, warm glow with a very slow breath."],
  ["break", "On break", "The glow dims to about half."],
  ["paused", "Paused", "The glow holds, a little cooler."],
];

export function LampStates() {
  const [i, setI] = useState(0);
  const touched = useRef(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen || touched.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % 3), 3200);
    return () => clearInterval(id);
  }, [seen]);

  const [state, label, line] = STATES[i];
  return (
    <section className="ls" id="lamp" aria-labelledby="ls-h">
      <div className="ls-wrap" ref={box}>
        <p className="eyebrow rv">The Lamp</p>
        <h2 id="ls-h" className="sec-h rv d1">Light on means you’re studying.</h2>
        <div className="ls-stage">
          <div className="ls-big" data-state={state}><LampIcon state={state} /></div>
          <div className="ls-side">
            <p className="ls-label" aria-live="polite">{label}</p>
            <p className="ls-line">{line}</p>
            <div className="u-seg wide" role="radiogroup" aria-label="Lamp state">
              {STATES.map(([k, n], j) => (<button key={k} role="radio" aria-checked={i === j} className={i === j ? "sel" : ""} onClick={() => { touched.current = true; setI(j); }}>{n}</button>))}
            </div>
            <p className="ls-note">A status, not a score. It never grows, shrinks, levels up or “dies.” It always comes with words, never colour alone.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
