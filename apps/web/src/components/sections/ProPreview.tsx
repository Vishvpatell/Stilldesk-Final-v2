"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * Illustrative Pro weekly report. Everything is SAMPLE data, labelled on screen.
 * Only plan-confirmed ideas appear (docs/03 sec. 11): full colour charts, best focus time, weekly break insights,
 * this week by subject, monthly goals. Nothing here is real user data.
 */
const DAYS = [["Mon", 95], ["Tue", 140], ["Wed", 110], ["Thu", 170], ["Fri", 130], ["Sat", 75], ["Sun", 60]] as const;
const SUBJECTS = [["DBMS", 300, "#8497B8"], ["Physics", 220, "#7FB5A8"], ["Maths", 160, "#B7A4D6"], ["Other", 100, "#D2C3A1"]] as const;
const TOTAL = DAYS.reduce((a, [, m]) => a + m, 0);       // 780 min
const SESSIONS = 14;
const MAX = Math.max(...DAYS.map(([, m]) => m));
const R = 42, C = 2 * Math.PI * R;
const hm = (m: number) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} m`;
const clamp = (x: number) => Math.max(0, Math.min(1, x));

export function ProPreview() {
  const ref = useRef<HTMLElement>(null);
  const cache = useRef<{ total: HTMLElement; sess: HTMLElement } | null>(null);
  useScrub(ref, {
    mode: "pass",
    onUpdate: (p) => {
      const el = ref.current!;
      if (!cache.current) cache.current = { total: el.querySelector<HTMLElement>(".k-total")!, sess: el.querySelector<HTMLElement>(".k-sess")! };
      const t = clamp((p - 0.18) / 0.32);
      cache.current.total.textContent = hm(Math.round(TOTAL * t));
      cache.current.sess.textContent = String(Math.round(SESSIONS * t));
    },
  });

  let acc = 0;
  return (
    <section className="pv" id="pro" ref={ref} aria-labelledby="pv-h">
      <div className="pv-wrap">
        <p className="eyebrow rv">What Pro adds</p>
        <h2 id="pv-h" className="sec-h rv d1">See your week at a glance.</h2>
        <p className="lead rv d2">A look at the kind of weekly report Pro is planned to give you.</p>

        <figure className="dash" aria-label="Illustrative Pro weekly report with sample numbers">
          <div className="dash-bar">
            <span className="dash-title"><i /> This week</span>
            <span className="chip">Illustrative Pro preview · sample data</span>
          </div>

          <div className="dash-grid">
            <div className="kpi"><p className="kl">Study time</p><p className="kv k-total">{hm(TOTAL)}</p></div>
            <div className="kpi"><p className="kl">Sessions</p><p className="kv k-sess">{SESSIONS}</p></div>
            <div className="kpi"><p className="kl">Best focus time</p><p className="kv small">8 to 10 PM</p></div>

            <div className="panel bars">
              <p className="kl">Daily study time</p>
              <div className="bars-row" role="list">
                {DAYS.map(([d, m], i) => (
                  <div className={`bar${m === MAX ? " top" : ""}`} role="listitem" tabIndex={0} aria-label={`${d}: ${hm(m)}`} key={d} style={{ ["--h" as string]: m / MAX, ["--i" as string]: i }}>
                    <span className="bv">{hm(m)}</span>
                    <i />
                    <span className="bday">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel donut">
              <p className="kl">By subject</p>
              <div className="donut-row">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r={R} fill="none" stroke="#1d1d22" strokeWidth="14" />
                  {SUBJECTS.map(([n, m, c]) => {
                    const len = (m / TOTAL) * C, off = acc; acc += len;
                    return <circle key={n} className="dseg" cx="60" cy="60" r={R} fill="none" stroke={c} strokeWidth="14" style={{ strokeDasharray: `calc(${len}px * var(--t, 1)) ${C}` }} strokeDashoffset={-off} transform="rotate(-90 60 60)" />;
                  })}
                </svg>
                <ul className="legend">
                  {SUBJECTS.map(([n, m, c]) => (<li key={n}><i style={{ background: c }} />{n}<span>{Math.round((m / TOTAL) * 100)}%</span></li>))}
                </ul>
              </div>
            </div>

            <div className="panel insight">
              <p className="kl">Weekly break insight</p>
              <p className="ins">Most of your breaks were tagged <strong>Snack</strong>. Short breaks, back to the desk.</p>
            </div>
          </div>
          <figcaption>Sample numbers for illustration, not real data. Planned features may change before release.</figcaption>
        </figure>

        <div className="pv-cta rv"><ButtonLink href="/#waitlist">Get early access to Pro</ButtonLink><ButtonLink href="/#plans" variant="text">Compare Free and Pro</ButtonLink></div>
      </div>
    </section>
  );
}
