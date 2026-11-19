"use client";
import { useEffect, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";

// Copy: docs/03 section 10. Lit windows only: no names, no counts, no ranks.
const COLS = 9, ROWS = 5, N = COLS * ROWS;
const FACTS = ["Private groups", "Public topic rooms", "Invisible mode", "Safety built in"];

export function Together() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, { mode: "pass" });
  const [lit, setLit] = useState<boolean[]>(() => Array.from({ length: N }, (_, i) => (i * 7) % 5 < 2));
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // calm, irregular rhythm: one window changes every couple of seconds
    const id = setInterval(() => setLit((a) => { const b = a.slice(), k = Math.floor(Math.random() * N); b[k] = !b[k]; return b; }), 1700);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="tg" id="together" ref={ref} aria-labelledby="tg-h">
      <div className="tg-wrap">
        <div className="tg-copy">
          <p className="eyebrow rv">Coming after launch</p>
          <h2 id="tg-h" className="sec-h rv d1">Study alone, together.</h2>
          <p className="lead rv d2">Each friend who is studying shows as a small lit window. Lights on means studying now. That is all you see: no chat, no rankings, no hour counts.</p>
          <ul className="tg-facts">{FACTS.map((f) => (<li className="chip" key={f}>{f}</li>))}</ul>
          <p className="tg-note">Planned: up to 4 friends free, up to 20 with Pro. Details may change before release.</p>
        </div>
        <div className="tg-grid" role="img" aria-label="A grid of small windows, some lit, showing friends who are studying. Illustrative example.">
          {lit.map((on, i) => (
            <span key={i} className={on ? "on" : ""} style={{ ["--r" as string]: Math.floor(i / COLS), ["--c" as string]: i % COLS }} />
          ))}
        </div>
      </div>
    </section>
  );
}
