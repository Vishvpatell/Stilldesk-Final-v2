import { useId } from "react";

export type LampState = "studying" | "break" | "paused";

/**
 * The Stilldesk Lamp: one recognisable desk lamp with a warm pool of light.
 * - With `state`: studying (steady + very slow breath), break (about half), paused (holds, a little cooler).
 * - Without `state`: the glow follows the CSS variable --g from a parent (used by scroll-driven scenes).
 * The lamp is a status, never a score: it never grows, shrinks or "dies". Always pair it with a text label.
 */
type Place = { x?: number; y?: number; width?: number | string; height?: number | string };
export function LampIcon({ state, className = "", scene = false, desk = true, ...place }: { state?: LampState; className?: string; scene?: boolean; desk?: boolean } & Place) {
  const u = useId().replace(/:/g, ""); // unique ids per instance: several lamps share one page
  return (
    <svg className={`lamp-i ${className}`} data-state={state} viewBox="0 0 200 200" {...place} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${u}-pool`}><stop offset="0" stopColor="#FFD9A8" stopOpacity=".75" /><stop offset=".5" stopColor="#FFB36B" stopOpacity=".3" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${u}-halo`}><stop offset="0" stopColor="#FFE9C8" stopOpacity=".85" /><stop offset=".4" stopColor="#FFB36B" stopOpacity=".28" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${u}-beam`} x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stopColor="#FFD9A8" stopOpacity=".6" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></linearGradient>
        <linearGradient id={`${u}-metal`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0d1017" /><stop offset=".6" stopColor="#2b3342" /><stop offset="1" stopColor="#10141c" /></linearGradient>
        <linearGradient id={`${u}-shade`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0d1017" /><stop offset=".6" stopColor="#262d3b" /><stop offset=".85" stopColor="#3a4558" /><stop offset="1" stopColor="#151a24" /></linearGradient>
        <filter id={`${u}-blur`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <defs><linearGradient id={`${u}-desk`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#33261b" /><stop offset="1" stopColor="#120e0b" /></linearGradient></defs>
      {scene && (
        <g className="li-scene">
          {desk && <><rect x="-40" y="172" width="280" height="60" fill={`url(#${u}-desk)`} /><line x1="-40" y1="172" x2="240" y2="172" stroke="#4a3626" strokeWidth="1" /></>}
          {/* an open notebook on the desk: it only becomes visible as the lamp lights */}
          <g className="li-book">
            <polygon points="104,170 146,163 146,177 100,181" fill="#e8dcc2" />
            <polygon points="146,163 190,170 194,181 146,177" fill="#f3ead6" />
            <polygon points="100,181 146,177 194,181 194,184 146,181 100,184" fill="#0f1a30" />
            <g stroke="#2b3a57" strokeOpacity=".35" strokeWidth=".7"><path d="M108,170L143,165M107,174L143,169M150,165L184,170M150,169L185,174" /></g>
          </g>
        </g>
      )}
      {!scene && <line x1="0" y1="172" x2="200" y2="172" stroke="#26262B" strokeWidth="1" />}
      {/* light: warm layer + a slightly cooler layer used only while paused */}
      <g className="li-light warm">
        <polygon points="115,106 160,80 192,172 98,172" fill={`url(#${u}-beam)`} filter={`url(#${u}-blur)`} />
        <ellipse cx="146" cy="172" rx="62" ry="10" fill={`url(#${u}-pool)`} />
        <circle cx="138" cy="94" r="46" fill={`url(#${u}-halo)`} />
      </g>
      <g className="li-light cool" style={{ filter: "hue-rotate(-12deg) saturate(.55) brightness(1.08)" }}>
        <polygon points="115,106 160,80 192,172 98,172" fill={`url(#${u}-beam)`} filter={`url(#${u}-blur)`} />
        <ellipse cx="146" cy="172" rx="62" ry="10" fill={`url(#${u}-pool)`} />
        <circle cx="138" cy="94" r="46" fill={`url(#${u}-halo)`} />
      </g>
      {/* the lamp itself */}
      <ellipse cx="58" cy="170" rx="30" ry="6.5" fill="#07090d" />
      <ellipse cx="58" cy="166" rx="30" ry="6.5" fill={`url(#${u}-metal)`} />
      <line x1="58" y1="165" x2="80" y2="100" stroke="#0b0e14" strokeWidth="6" strokeLinecap="round" />
      <line x1="62" y1="165" x2="84" y2="100" stroke={`url(#${u}-metal)`} strokeWidth="5" strokeLinecap="round" />
      <line x1="80" y1="100" x2="120" y2="62" stroke="#0b0e14" strokeWidth="6" strokeLinecap="round" />
      <line x1="83" y1="98" x2="123" y2="60" stroke={`url(#${u}-metal)`} strokeWidth="5" strokeLinecap="round" />
      <circle cx="82" cy="100" r="6" fill={`url(#${u}-metal)`} stroke="#05070a" strokeWidth="1" />
      <g transform="translate(121 61) rotate(-30)">
        <path d="M-7 -2Q0 -11 7 -2L27 34Q0 43 -27 34Z" fill={`url(#${u}-shade)`} stroke="#05070a" strokeWidth="1" />
        <ellipse cx="0" cy="36" rx="27" ry="6.5" fill="#2a1a10" />
        <g className="li-bulb">
          <ellipse cx="0" cy="36" rx="23" ry="5" fill="#FFE3B8" />
          <ellipse cx="0" cy="37" rx="10" ry="3" fill="#FFFBEF" filter={`url(#${u}-blur)`} />
        </g>
        <ellipse cx="0" cy="36" rx="27" ry="6.5" fill="none" stroke="#FF6B35" strokeWidth="1" className="li-rim" />
      </g>
      <circle cx="121" cy="61" r="5" fill={`url(#${u}-metal)`} stroke="#05070a" strokeWidth="1" />
    </svg>
  );
}
