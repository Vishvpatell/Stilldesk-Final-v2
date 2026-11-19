"use client";
import Link from "next/link";
import { useState } from "react";

// Copy: docs/03 section 12.
const CLOUD: [string, string][] = [
  ["AI brain-dump", "We send only the text you typed, your subject names and your free hours. Nothing else from your phone, and we do not log your task text."],
  ["Study rooms", "Needs the cloud, because friends have to see each other’s lit windows."],
  ["Pro sync", "Needs the cloud, because your plan has to reach your other phone."],
];

export function PrivacySummary() {
  const [on, setOn] = useState<number | null>(null);
  return (
    <section className="pv2" id="privacy" aria-labelledby="pv2-h">
      <div className="pv2-wrap">
        <p className="eyebrow rv">Private by default</p>
        <h2 id="pv2-h" className="sec-h rv d1">Your plan is yours.</h2>
        <div className="pv2-diagram rv" data-on={on ?? ""}>
          <div className="node phone-n lit">
            <p className="nk">On your phone first</p>
            <ul><li>Tasks and subjects</li><li>Sessions, offline</li><li>The apps you block</li></ul>
            <p className="ns">Blocking never leaves your phone.</p>
          </div>
          <div className="wire" aria-hidden="true"><i /></div>
          <div className="node cloud-n">
            <p className="nk">The cloud, only when a feature needs it</p>
            <div className="cl-btns" role="group" aria-label="Cloud features">
              {CLOUD.map(([n], i) => (<button key={n} aria-pressed={on === i} className={on === i ? "on" : ""} onClick={() => setOn(on === i ? null : i)}>{n}</button>))}
            </div>
            <p className="ns" aria-live="polite">{on === null ? "Nothing leaves your phone until you use one of these." : CLOUD[on][1]}</p>
          </div>
        </div>
        <ul className="pv2-list rv">
          <li>No ads. No selling your data. Ever.</li>
          <li>Export or delete everything from Settings, easily.</li>
        </ul>
        <p className="rv"><Link className="link" href="/data">Read exactly what we store</Link></p>
      </div>
    </section>
  );
}
