"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";

// Copy: docs/03 section 9, in the approved order.
const P: [string, string][] = [
  ["Blocking only inside a study session.", "Never at any other time."],
  ["You are always in control.", "End session is one tap. You choose which apps are blocked."],
  ["No shame.", "No “you failed” messages. One missed day does not erase your progress."],
  ["Few notifications.", "Two a day at most by default, with quiet hours."],
  ["Privacy first.", "Your data stays on your phone unless a feature needs the cloud. No ads. We never sell your data."],
  ["Fast.", "Capture takes seconds. Starting a session takes two taps."],
  ["Honest.", "We will never say Stilldesk blocks something it cannot."],
];

export function Promises() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, { mode: "pass" }); // each promise “lights” as you read down, and dims as you scroll back
  return (
    <section className="pr" id="promises" ref={ref} aria-labelledby="pr-h">
      <div className="pr-wrap">
        <div className="pr-head">
          <p className="eyebrow rv">Our promises</p>
          <h2 id="pr-h" className="sec-h rv d1">Seven promises we build around</h2>
        </div>
        <ol className="pr-list">
          {P.map(([t, d], i) => (
            <li className="pitem" key={t} style={{ ["--i" as string]: i }} tabIndex={0}>
              <span className="pn">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{t}</h3><p>{d}</p></div>
              <i className="plit" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
