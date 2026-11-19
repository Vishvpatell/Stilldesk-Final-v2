"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";
import { LampIcon } from "@/components/ui/LampIcon";

// Copy: docs/03 section 7, shortened. The demo is a labelled example. Pinned on desktop only.
const STEPS = ["Start a session", "Open a blocked app", "A friendly stop", "End in one tap", "Everything opens normally"];
const NEVER = ["Phone and emergency calls", "Settings", "Clock", "Stilldesk itself"];
const clamp = (x: number) => Math.max(0, Math.min(1, x));

export function Blocking() {
  const ref = useRef<HTMLElement>(null);
  const last = useRef(-1);
  useScrub(ref, {
    mode: "pin",
    onUpdate: (p) => {
      const el = ref.current!, s = clamp((p - 0.05) / 0.9) * 5, act = Math.min(4, Math.floor(s));
      el.style.setProperty("--b", s.toFixed(3));
      for (let i = 0; i < 5; i++) el.style.setProperty(`--u${i}`, clamp(s - i).toFixed(3));
      if (last.current !== act) {
        last.current = act;
        el.querySelectorAll<HTMLElement>(".bstep").forEach((x, i) => { x.classList.toggle("on", i === act); x.classList.toggle("past", i < act); });
        el.querySelectorAll<HTMLElement>(".bscr").forEach((x, i) => x.classList.toggle("on", i === act));
      }
    },
  });
  return (
    <section className="blk" id="blocking" ref={ref} aria-labelledby="blk-h">
      <div className="blk-pin">
        <div className="blk-grid">
          <div className="blk-left">
            <p className="eyebrow rv">Will it lock my phone?</p>
            <h2 id="blk-h" className="sec-h rv d1">No. Only while you study, and you’re always in control.</h2>
            <ol className="bsteps">{STEPS.map((s, i) => (<li className={`bstep${i === 0 ? " on" : ""}`} key={s}><span>{i + 1}</span>{s}</li>))}</ol>
            <div className="blk-facts">
              <p><strong>Never blocked:</strong> {NEVER.join(", ")}.</p>
              <p><strong>A blocklist, not an allowlist.</strong> Calculator, PDF reader, notes and everything else just work.</p>
              <p className="muted-p"><strong>Honest limits:</strong> websites aren’t blocked in version 1 (add the browser app instead), and a determined person can turn the permission off. It’s a speed bump you chose, not a cage.</p>
            </div>
          </div>
          <div className="blk-right" aria-hidden="true">
            <figure className="phone">
              <span className="phone-label">Example interface · not a real screenshot</span>
              <div className="scr bscr on focus"><LampIcon className="u-lampsvg" state="studying" /><p className="u-state">Studying</p><p className="u-m">Session on</p></div>
              <div className="scr bscr"><div className="u-apps">{Array.from({ length: 12 }).map((_, i) => <span key={i} className={i === 5 ? "hit blocked" : ""} />)}</div><p className="u-m ctr">Blocked app tapped</p></div>
              <div className="scr bscr protect"><div className="u-apps dim">{Array.from({ length: 12 }).map((_, i) => <span key={i} />)}</div><div className="u-sheet shown"><p className="u-big">Your session is on</p><div className="u-two"><span className="p">Back to studying</span><span>Take 5 minutes</span></div></div></div>
              <div className="scr bscr focus"><LampIcon className="u-lampsvg" state="studying" /><p className="u-state">Studying</p><div className="u-two"><span>Pause</span><span className="pressed">End session</span></div></div>
              <div className="scr bscr"><div className="u-apps free">{Array.from({ length: 12 }).map((_, i) => <span key={i} />)}</div><p className="u-m ctr">Session ended. Apps open as normal.</p></div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
