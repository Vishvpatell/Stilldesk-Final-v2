export type LampState = "studying" | "break" | "paused";

/**
 * The Stilldesk Lamp: one recognisable desk lamp with a warm pool of light.
 * - With `state`: studying (steady + very slow breath), break (about half), paused (holds, a little cooler).
 * - Without `state`: the glow follows the CSS variable --g from a parent (used by scroll-driven scenes).
 * The lamp is a status, never a score: it never grows, shrinks or "dies". Always pair it with a text label.
 */
export function LampIcon({ state, className = "" }: { state?: LampState; className?: string }) {
  return (
    <svg className={`lamp-i ${className}`} data-state={state} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="li-pool"><stop offset="0" stopColor="#FFD9A8" stopOpacity=".75" /><stop offset=".5" stopColor="#FFB36B" stopOpacity=".3" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></radialGradient>
        <radialGradient id="li-halo"><stop offset="0" stopColor="#FFE9C8" stopOpacity=".85" /><stop offset=".4" stopColor="#FFB36B" stopOpacity=".28" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></radialGradient>
        <linearGradient id="li-beam" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stopColor="#FFD9A8" stopOpacity=".6" /><stop offset="1" stopColor="#FFB36B" stopOpacity="0" /></linearGradient>
        <linearGradient id="li-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0d1017" /><stop offset=".6" stopColor="#2b3342" /><stop offset="1" stopColor="#10141c" /></linearGradient>
        <linearGradient id="li-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0d1017" /><stop offset=".6" stopColor="#262d3b" /><stop offset=".85" stopColor="#3a4558" /><stop offset="1" stopColor="#151a24" /></linearGradient>
        <filter id="li-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <line x1="0" y1="172" x2="200" y2="172" stroke="#26262B" strokeWidth="1" />
      {/* light: warm layer + a slightly cooler layer used only while paused */}
      <g className="li-light warm">
        <polygon points="115,106 160,80 192,172 98,172" fill="url(#li-beam)" filter="url(#li-blur)" />
        <ellipse cx="146" cy="172" rx="62" ry="10" fill="url(#li-pool)" />
        <circle cx="138" cy="94" r="46" fill="url(#li-halo)" />
      </g>
      <g className="li-light cool" style={{ filter: "hue-rotate(-12deg) saturate(.55) brightness(1.08)" }}>
        <polygon points="115,106 160,80 192,172 98,172" fill="url(#li-beam)" filter="url(#li-blur)" />
        <ellipse cx="146" cy="172" rx="62" ry="10" fill="url(#li-pool)" />
        <circle cx="138" cy="94" r="46" fill="url(#li-halo)" />
      </g>
      {/* the lamp itself */}
      <ellipse cx="58" cy="170" rx="30" ry="6.5" fill="#07090d" />
      <ellipse cx="58" cy="166" rx="30" ry="6.5" fill="url(#li-metal)" />
      <line x1="58" y1="165" x2="80" y2="100" stroke="#0b0e14" strokeWidth="6" strokeLinecap="round" />
      <line x1="62" y1="165" x2="84" y2="100" stroke="url(#li-metal)" strokeWidth="5" strokeLinecap="round" />
      <line x1="80" y1="100" x2="120" y2="62" stroke="#0b0e14" strokeWidth="6" strokeLinecap="round" />
      <line x1="83" y1="98" x2="123" y2="60" stroke="url(#li-metal)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="82" cy="100" r="6" fill="url(#li-metal)" stroke="#05070a" strokeWidth="1" />
      <g transform="translate(121 61) rotate(-30)">
        <path d="M-7 -2Q0 -11 7 -2L27 34Q0 43 -27 34Z" fill="url(#li-shade)" stroke="#05070a" strokeWidth="1" />
        <ellipse cx="0" cy="36" rx="27" ry="6.5" fill="#2a1a10" />
        <g className="li-bulb">
          <ellipse cx="0" cy="36" rx="23" ry="5" fill="#FFE3B8" />
          <ellipse cx="0" cy="37" rx="10" ry="3" fill="#FFFBEF" filter="url(#li-blur)" />
        </g>
        <ellipse cx="0" cy="36" rx="27" ry="6.5" fill="none" stroke="#FF6B35" strokeWidth="1" className="li-rim" />
      </g>
      <circle cx="121" cy="61" r="5" fill="url(#li-metal)" stroke="#05070a" strokeWidth="1" />
    </svg>
  );
}
