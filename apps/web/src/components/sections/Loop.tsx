"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";
import { useSceneNodes } from "@/hooks/useSceneNodes";
import { LampIcon } from "@/components/ui/LampIcon";

// Copy: docs/03-landing-page-copy.md, section 3 (typographic quotes only).
const STEPS = [
  { n: "01", name: "Dump", tag: "Write it messy.", body: "Type or speak whatever you need to do, in any style, with typos and mixed languages. Stilldesk’s AI turns it into tasks sorted by subject, with time estimates and a suggested order. You check the preview and confirm. Nothing is saved without you." },
  { n: "02", name: "Arrive", tag: "Your plan finds you at your desk.", body: "When you reach your room, one gentle notification brings your plan back, in your own words: “You wrote: finish DBMS assignment.” Use your saved Wi-Fi, your location, a time, or a simple “I’m at my desk” button. Never a full-screen takeover." },
  { n: "03", name: "Sit down", tag: "Two taps to start.", body: "Your first task is waiting, big and clear. Pick a mode (stopwatch, timer or a 90-minute deep work block), name what you will finish, and press Start." },
  { n: "04", name: "Focus", tag: "A quiet screen, a lit lamp.", body: "The lamp glows while you study. Pause whenever you need to. Ending a session is always one tap. When you finish, you see your time and what you got done." },
  { n: "05", name: "Protect", tag: "Only while you study.", body: "The apps you chose to block show a friendly “Your session is on” screen. The moment the session ends, they open as normal. Outside a session, Stilldesk blocks nothing." },
  { n: "06", name: "Study together", tag: "Keep each other company.", after: true, body: "Join a private room with friends, or a public topic room. You see small lit windows: who is studying right now. No chat, no rankings, no pressure." },
];
const TYPED = "dbms assignment friday, physics numericals ch3 revise, buy notebook";
// Reading time: the Focus step (the lamp lighting, then Studying / Paused / On break) gets the most scroll; Dump and Protect a bit more than the rest.
const WEIGHTS = [1, 1, 1, 1.8, 1.2, 1];
const TOTAL_W = WEIGHTS.reduce((a, b) => a + b, 0);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ss = (a: number, b: number, x: number) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function Loop() {
  const ref = useRef<HTMLElement>(null);
  const getNodes = useSceneNodes((root) => {
    const li = Array.from(root.querySelectorAll<HTMLElement>(".step")), scr = Array.from(root.querySelectorAll<HTMLElement>(".scr")), chips = Array.from(root.querySelectorAll<HTMLElement>(".u-states span"));
    const typed = root.querySelector<HTMLElement>(".typed"), watch = root.querySelector<HTMLElement>(".watch"), lamp = root.querySelector<SVGElement>(".u-lampsvg"), lbl = root.querySelector<HTMLElement>(".u-state");
    return li.length === STEPS.length && scr.length === STEPS.length && typed && watch && lamp && lbl ? { li, scr, chips, typed, watch, lamp, lbl, last: -1 } : null;
  });

  useScrub(ref, {
    mode: "pin",
    onUpdate: (p, el) => {
      const c = getNodes(el);
      if (!c) return;
      let u = clamp((p - 0.05) / 0.9) * TOTAL_W, k = 0;
      while (k < 5 && u >= (WEIGHTS[k] as number)) { u -= WEIGHTS[k] as number; k += 1; }
      const s = k + u / (WEIGHTS[k] as number); // 0..6: which step we are in, with the fraction inside it
      const act = Math.min(5, Math.floor(s));
      c.li.forEach((li, i) => {
        li.style.setProperty("--seg", clamp(s - i).toFixed(3));
        li.classList.toggle("on", i === act);
        li.classList.toggle("past", i < act);
        el.style.setProperty(`--t${i}`, clamp(s - i).toFixed(3));
      });
      if (c.last !== act) { c.scr.forEach((x, i) => x.classList.toggle("on", i === act)); c.last = act; }
      el.style.setProperty("--lit", (ss(2.6, 3.4, s) * (1 - 0.5 * ss(5.2, 6, s))).toFixed(3));
      c.typed.textContent = TYPED.slice(0, Math.ceil(clamp(clamp(s) / 0.7) * TYPED.length));
      // Focus screen: Studying, then Paused, then Studying again, then On break (a session end starts a break)
      const f = clamp(s - 3);
      // 0..0.3 the lamp lights up with the scroll; then Studying, Paused, Studying, On break
      const st = f < 0.3 ? -1 : f < 0.52 ? 0 : f < 0.68 ? 2 : f < 0.84 ? 0 : 1;
      const names = ["Studying", "On break", "Paused"], keys = ["studying", "break", "paused"];
      if (st < 0) c.lamp.removeAttribute("data-state"); else c.lamp.setAttribute("data-state", keys[st] as string); // before 0.3 the glow follows the scroll
      c.lbl.textContent = st < 0 ? "Ready" : (names[st] as string);
      c.chips.forEach((x, i) => x.classList.toggle("on", i === st));
      const active = Math.max(0, Math.min(f, 0.52) - 0.3) + Math.max(0, Math.min(f, 0.84) - 0.68); // the clock runs only while studying
      c.watch.textContent = fmt(Math.round((active / 0.38) * 754));
    },
  });

  return (
    <section className="loop" id="loop" ref={ref} aria-labelledby="loop-h">
      <div className="loop-glow" aria-hidden="true" />
      <div className="loop-pin">
        <div className="loop-grid">
          <div className="loop-left">
            <p className="eyebrow rv">How it works</p>
            <h2 id="loop-h" className="loop-h">From class to desk, in six calm steps</h2>
            <p className="lead">One loop. Nothing to manage, nothing to feel bad about.</p>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className={`step${i === 0 ? " on" : ""}`} key={s.n}>
                  <span className="seg" aria-hidden="true"><i /></span>
                  <span className="sdot" aria-hidden="true" />
                  <div className="shead">
                    <span className="sn">{s.n}</span>
                    <h3>{s.name}</h3>
                    {s.after && <span className="chip">After launch</span>}
                    <em className="stag">{s.tag}</em>
                  </div>
                  <div className="sb"><p>{s.body}</p></div>
                </li>
              ))}
            </ol>
          </div>

          <div className="loop-right" aria-hidden="true">
            <figure className="phone">
              <span className="phone-label">Example interface · not a real screenshot</span>
              {/* 01 Dump */}
              <div className="scr on">
                <p className="u-k">Brain-dump</p>
                <div className="u-input"><span className="typed">{TYPED}</span><b className="caret" /></div>
                {[["DBMS assignment", "DBMS", "about 45 min"], ["Revise physics numericals, ch. 3", "Physics", "about 40 min"], ["Buy notebook", "Unsorted", "about 15 min"]].map(([t, sub, m], r) => (
                  <div className="u-row" style={{ ["--r" as string]: r }} key={t}>
                    <span className={`u-chip${sub === "Unsorted" ? " dashed" : ""}`}>{sub}</span><span className="u-t">{t}</span><span className="u-m">{m}</span>
                  </div>
                ))}
                <div className="u-btn conf">Confirm</div>
              </div>
              {/* 02 Arrive */}
              <div className="scr">
                <p className="u-k">At your desk</p>
                <div className="u-notif"><span className="mark" /><div><p className="u-n1">Stilldesk · now</p><p className="u-n2">You wrote: finish DBMS assignment.</p></div></div>
                <div className="u-chips"><span>Saved Wi-Fi</span><span>Location</span><span>A time</span><span className="hot">I’m at my desk</span></div>
              </div>
              {/* 03 Sit down */}
              <div className="scr">
                <p className="u-k">Today</p>
                <div className="u-card"><p className="u-big">DBMS assignment</p><p className="u-m">about 45 min</p></div>
                <div className="u-seg"><span className="sel">Stopwatch</span><span>Timer</span><span>Deep work 90</span></div>
                <div className="u-input small">I will finish: DBMS assignment</div>
                <div className="u-btn big start">Start</div>
              </div>
              {/* 04 Focus */}
              <div className="scr focus">
                <LampIcon scene className="u-lampsvg" />
                <p className="u-state">Ready</p>
                <p className="watch">00:00</p>
                <div className="u-states"><span className="on">Studying</span><span>On break</span><span>Paused</span></div>
                <div className="u-two"><span>Pause</span><span>End session</span></div>
              </div>
              {/* 05 Protect */}
              <div className="scr protect">
                <div className="u-apps">{Array.from({ length: 12 }).map((_, i) => <span key={i} className={i === 5 ? "hit" : ""} />)}</div>
                <div className="u-sheet"><p className="u-big">Your session is on</p><div className="u-two"><span className="p">Back to studying</span><span>Take 5 minutes</span></div></div>
              </div>
              {/* 06 Study together */}
              <div className="scr">
                <p className="u-k">Study room · after launch</p>
                <div className="u-win">{Array.from({ length: 30 }).map((_, i) => <span key={i} style={{ ["--h" as string]: ((i * 37) % 29) / 29 }} />)}</div>
                <p className="u-m">No names, no rankings.</p>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
