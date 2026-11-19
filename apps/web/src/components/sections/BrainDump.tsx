"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Copy: docs/03, section 5. The numbers other than 45 min are illustrative, as the docs say.
const TEXT = "dbms assignment friday, physics numericals ch3 revise, buy notebook";
const TASKS = [
  { name: "DBMS assignment", subject: "DBMS", when: "Due Friday. Suggested this evening" },
  { name: "Revise physics numericals, ch. 3", subject: "Physics", when: "Suggested tomorrow" },
  { name: "Buy notebook", subject: "Unsorted", when: "Any free slot" },
];
const START = [45, 40, 15];
type Phase = "typing" | "thinking" | "ready";
const STATUS: Record<Phase, string> = {
  typing: "Typing the example.",
  thinking: "Organising by subject, time and order.",
  ready: "Here is a suggested plan. You can change the times, then confirm.",
};

export function BrainDump() {
  const box = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const [phase, setPhase] = useState<Phase>("ready");
  const [n, setN] = useState(TEXT.length);
  const [mins, setMins] = useState(START);
  const [saved, setSaved] = useState(false);

  const clear = () => { timers.current.forEach((t) => clearTimeout(t)); timers.current = []; };
  const play = useCallback(() => {
    clear();
    setSaved(false); setMins(START); setN(0); setPhase("typing");
    let i = 0;
    const type = () => {
      i += 1; setN(i);
      if (i < TEXT.length) timers.current.push(window.setTimeout(type, 34 + (TEXT[i] === "," ? 220 : 0)));
      else {
        timers.current.push(window.setTimeout(() => setPhase("thinking"), 450));
        timers.current.push(window.setTimeout(() => setPhase("ready"), 1750));
      }
    };
    timers.current.push(window.setTimeout(type, 350));
  }, []);

  // starts by itself once, when the demo is half visible (not for reduced motion: it simply shows the finished example)
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; play(); io.disconnect(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); clear(); };
  }, [play]);

  const step = (i: number, d: number) => setMins((m) => m.map((v, k) => (k === i ? Math.max(5, Math.min(180, v + d)) : v)));
  const editable = phase === "ready" && !saved;

  return (
    <section className="bd" id="braindump" aria-labelledby="bd-h">
      <div className="bd-wrap">
        <p className="eyebrow rv">The brain-dump bar</p>
        <h2 id="bd-h" className="sec-h rv d1">Write like you think. Get a plan back.</h2>

        <div className="bd-stage" ref={box} data-phase={phase} data-saved={saved}>
          <div className="bd-in">
            <p className="bd-k">What you type</p>
            <div className="bd-box" aria-label="Example brain-dump text">
              <span>{TEXT.slice(0, n)}</span>{phase === "typing" && <b className="caret" />}
            </div>
            <button className="btn ghost sm" onClick={play}>{started.current || saved ? "Replay the example" : "Play the example"}</button>
          </div>

          <div className="bd-arrow" aria-hidden="true"><i /></div>

          <div className="bd-out">
            <div className="bd-head"><p className="bd-k">What Stilldesk suggests</p><span className="chip">Illustrative example</span></div>
            <ul className="bd-rows">
              {TASKS.map((t, i) => (
                <li className={`bd-row${t.subject === "Unsorted" ? " uns" : ""}`} style={{ ["--i" as string]: i }} key={t.name}>
                  <span className="bd-check" aria-hidden="true" />
                  <div className="bd-main">
                    <p className="bd-name">{t.name}</p>
                    <p className="bd-when">{t.when}</p>
                    {t.subject === "Unsorted" && <p className="bd-hint">Not sure? It says so and asks once.</p>}
                  </div>
                  <span className={`u-chip${t.subject === "Unsorted" ? " dashed" : ""}`}>{t.subject}</span>
                  <div className="bd-time">
                    <button disabled={!editable} onClick={() => step(i, -5)} aria-label={`Less time for ${t.name}`}>−</button>
                    <span>about {mins[i]} min</span>
                    <button disabled={!editable} onClick={() => step(i, 5)} aria-label={`More time for ${t.name}`}>+</button>
                  </div>
                  <span className="bd-sk" aria-hidden="true" />
                </li>
              ))}
            </ul>
            <div className="bd-foot">
              <button className="btn sm" disabled={!editable} onClick={() => setSaved(true)}>{saved ? "Confirmed" : "Confirm tasks"}</button>
              <p className="bd-status" aria-live="polite">{saved ? "Confirmed. In the app, this is when your tasks are saved." : STATUS[phase]}</p>
            </div>
          </div>
        </div>
        <p className="bd-cap rv"><em>An example of the idea. Times are estimates you can edit.</em></p>

        <ul className="bd-notes">
          <li className="rv"><h3>You confirm everything.</h3><p>Nothing is saved silently.</p></li>
          <li className="rv d1"><h3>Not sure? It says so.</h3><p>Unclear tasks go to “Unsorted” and it asks once, instead of guessing wildly.</p></li>
          <li className="rv d2"><h3>Offline or AI down?</h3><p>Your raw text is saved as a plain task so nothing is ever lost.</p></li>
        </ul>
      </div>
    </section>
  );
}
