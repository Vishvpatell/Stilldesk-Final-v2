"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";
import { LampIcon } from "@/components/ui/LampIcon";

/**
 * The payoff of the problem section, drawn entirely from scroll position (so it also plays backwards and holds when you stop):
 *  1. a small energy point waits at the right;  2. it travels a soft curved path towards the lamp;
 *  3. it is absorbed into the bulb (a gentle pulse, not a wire or a lightning bolt);  4. the lamp lights gradually,
 *     its light spreads over the desk and the notebook;  5. the message appears, then the closing line.
 * Pinned on desktop (long enough to read), a shorter non-pinned version on small screens.
 */
const PATH = "M1130 150 C 980 118, 770 196, 610 250 S 486 288, 446 300"; // ends at the bulb (446, 300)
const TARGET = { x: 446, y: 300 };
const TAIL = 0.2;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ss = (a: number, b: number, x: number) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };

export function Spark() {
  const ref = useRef<HTMLElement>(null);
  const cache = useRef<{ path: SVGPathElement; point: SVGGElement; trail: SVGPathElement; len: number } | null>(null);

  useScrub(ref, {
    mode: "pin",
    smooth: 7, // a little slower and softer than other scenes
    onUpdate: (p) => {
      const el = ref.current!;
      if (!cache.current) {
        const path = el.querySelector<SVGPathElement>(".sp-path")!;
        cache.current = { path, point: el.querySelector<SVGGElement>(".sp-point")!, trail: el.querySelector<SVGPathElement>(".sp-trail")!, len: path.getTotalLength() };
      }
      const c = cache.current;
      const q = innerWidth > 900 ? p : clamp((p - 0.2) / 0.6); // phones: not pinned, so use the middle of the pass
      const travel = ss(0.1, 0.44, q);
      const pt = c.path.getPointAtLength(c.len * travel);
      const gone = 1 - ss(0.44, 0.5, q); // absorbed into the bulb
      c.point.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      c.point.style.opacity = gone.toFixed(3);
      c.trail.style.strokeDashoffset = (TAIL - travel).toFixed(4);
      c.trail.style.opacity = (gone * 0.9).toFixed(3);
      el.style.setProperty("--pulse", ss(0.44, 0.62, q).toFixed(3));
      el.style.setProperty("--g", ss(0.46, 0.76, q).toFixed(3));
      el.style.setProperty("--msg", ss(0.76, 0.84, q).toFixed(3));
      el.style.setProperty("--close", ss(0.88, 0.95, q).toFixed(3));
    },
  });

  return (
    <section className="spark" id="spark" ref={ref} aria-labelledby="spark-h">
      <div className="spark-pin">
        <svg className="spark-svg" viewBox="0 0 1200 600" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="sp-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#33261b" /><stop offset="1" stopColor="#120e0b" /></linearGradient>
            <radialGradient id="sp-pt"><stop offset="0" stopColor="#FFFBEF" /><stop offset=".35" stopColor="#FFD9A8" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></radialGradient>
            <radialGradient id="sp-flash"><stop offset="0" stopColor="#FFF4DC" stopOpacity=".95" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></radialGradient>
            <filter id="sp-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          <rect x="-400" y="521" width="2000" height="200" fill="url(#sp-desk)" />
          <line x1="-400" y1="521" x2="1600" y2="521" stroke="#4a3626" strokeWidth="1.5" />
          <LampIcon scene desk={false} x={60} y={40} width={560} height={560} />
          <path className="sp-path" d={PATH} fill="none" stroke="none" />
          {/* a faint comet tail that follows the point, never a full wire */}
          <path className="sp-trail" d={PATH} pathLength={1} fill="none" stroke="#FFD9A8" strokeWidth="2.4" strokeLinecap="round" strokeDasharray={`${TAIL} 2`} strokeDashoffset={TAIL} filter="url(#sp-blur)" />
          <circle className="sp-flash" cx={TARGET.x} cy={TARGET.y} r="70" fill="url(#sp-flash)" />
          <circle className="sp-pulse" cx={TARGET.x} cy={TARGET.y} r="26" fill="none" />
          <g className="sp-point" transform="translate(1130 150)"><circle r="22" fill="url(#sp-pt)" opacity=".55" /><circle r="5.5" fill="#FFF4DC" /></g>
        </svg>
        <div className="spark-copy">
          <h2 id="spark-h" className="sp-msg">The plan finally meets the desk.</h2>
          <p className="sp-close">Stilldesk is built for that gap.</p>
        </div>
      </div>
    </section>
  );
}
