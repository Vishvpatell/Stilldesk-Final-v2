"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";
import { LampIcon } from "@/components/ui/LampIcon";

// Section 2 (docs/03). Lightly tightened for length; the story, the order and the closing line are unchanged.
const HEADLINE = "You made a plan. Then you walked to your room.";

export function Problem() {
  const gap = useRef<HTMLDivElement>(null);
  useScrub(gap, { mode: "pass" }); // the payoff below is drawn from scroll position, so it also plays backwards
  return (
    <section className="problem" id="problem" aria-labelledby="problem-h">
      <div className="wrap">
        <p className="eyebrow rv">Why Stilldesk</p>
        <h2 id="problem-h" className="rv d1">
          {HEADLINE.split(" ").map((w, i) => (
            <span key={i}><span className="w"><span style={{ ["--i" as string]: i }}>{w}</span></span>{" "}</span>
          ))}
        </h2>
        <div className="body">
          <p className="rv" style={{ transitionDelay: ".35s" }}>In a lecture or a free period you think: tonight I will do the DBMS assignment, revise physics chapter 3, and buy a notebook. It feels easy.</p>
          <p className="rv" style={{ transitionDelay: ".55s" }}>Then the walk back happens. By your room, the plan has gone soft. You open your phone “just for a minute,” and an hour disappears.</p>
        </div>

        <div className="gap" ref={gap}>
          <div className="gap-track" aria-hidden="true">
            <span className="gdot a" />
            <span className="gline"><i /></span>
            <span className="gmote" />
            <div className="gdesk">
              <div className="gpool" />
              <LampIcon className="gap-lamp" />
              <svg className="gbook" viewBox="0 0 120 50"><polygon points="4,20 58,10 58,44 2,50" fill="#e8dcc2" /><polygon points="58,10 116,20 118,50 58,44" fill="#f1e8d3" /><g stroke="#2b3a57" strokeOpacity=".3" strokeWidth="1"><path d="M10,24L52,17M9,31L52,24M8,38L52,31M64,17L108,25M64,24L109,32M64,31L110,39" /></g></svg>
            </div>
          </div>
          <p className="gap-msg">The plan finally meets the desk.</p>
        </div>
        <p className="closing rv">Stilldesk is built for that gap.</p>
      </div>
    </section>
  );
}
