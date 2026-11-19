// The Lamp scene artwork (desk, notebook, lamp, light). Layers are plain SVG so CSS variables
// (--l = light amount, --sp = light spread) can drive them without re-rendering React.
// Static, trusted markup written by us: no user input ever goes in here.
export const SCENE_MARKUP = `<div id="wall"></div>
<svg id="back" preserveAspectRatio="xMaxYMax meet" viewBox="-700 0 1900 800">
      <defs>
        <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a1d"/><stop offset=".25" stop-color="#2a1e15"/><stop offset="1" stop-color="#17110c"/></linearGradient>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8dcc2"/><stop offset=".45" stop-color="#f3ead6"/><stop offset=".5" stop-color="#cdbf9f"/><stop offset=".56" stop-color="#f1e8d3"/><stop offset="1" stop-color="#e2d6bb"/></linearGradient>
        <linearGradient id="mug" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c2a45"/><stop offset=".5" stop-color="#3a5384"/><stop offset="1" stop-color="#16213a"/></linearGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0018 0.11" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .05  0 0 0 0 .025  0 0 0 0 .01  1.7 0 0 0 -.6"/></filter>
        <filter id="soft"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      <polygon points="-900,520 2100,520 2300,830 -1100,830" fill="url(#desk)"/>
      <polygon points="-900,520 2100,520 2300,830 -1100,830" filter="url(#grain)" opacity=".55"/>
      <line x1="-900" y1="520" x2="2100" y2="520" stroke="#ffcf9c" stroke-opacity=".18" stroke-width="2"/>
      <!-- books -->
      <g>
        <polygon points="70,606 250,596 258,628 78,640" fill="#1b2a4a"/><polygon points="78,640 258,628 258,636 80,648" fill="#e5dac0"/>
        <polygon points="96,576 262,568 268,596 102,606" fill="#4a2f22"/><polygon points="102,606 268,596 268,603 104,613" fill="#d9ccae"/>
        <polygon points="116,548 262,541 267,566 121,575" fill="#2b3a57"/><polygon points="121,575 267,566 267,572 123,581" fill="#e0d4b8"/>
      </g>
      <ellipse cx="300" cy="652" rx="130" ry="20" fill="#000" opacity=".55" filter="url(#soft)"/>
      <!-- notebook -->
      <ellipse cx="740" cy="716" rx="190" ry="20" fill="#000" opacity=".55" filter="url(#soft)"/>
      <polygon points="590,620 735,604 884,618 898,720 735,708 578,724" fill="#0f1a30"/>
      <polygon points="610,612 735,600 735,696 598,710" fill="url(#pg)"/>
      <polygon points="735,600 868,612 880,708 735,696" fill="url(#pg)"/>
      <g stroke="#2b3a57" stroke-opacity=".28" stroke-width="1.3" fill="none">
        <path d="M618,632 L728,621M616,646 L728,635M614,660 L728,649M612,674 L728,663M610,688 L728,677"/>
        <path d="M744,622 L858,633M744,636 L860,647M745,650 L862,661M746,664 L864,675M747,678 L866,689"/>
      </g>
      <g stroke="#1b2a4a" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round">
        <path class="ink" data-s=".36" pathLength="1" d="M626,628c14-5 22 3 36-2s26-3 40-6"/><path class="ink" data-s=".44" pathLength="1" d="M624,643c18-4 30 3 46-1s24-3 36-5"/><path class="ink" data-s=".52" pathLength="1" d="M622,657c12-3 24 2 34-1"/>
      </g>
      <g fill="none" stroke="#1b2a4a" stroke-opacity=".75" stroke-width="1.6"><rect x="752" y="623" width="9" height="9" rx="2"/><rect x="753" y="640" width="9" height="9" rx="2"/><rect x="754" y="657" width="9" height="9" rx="2"/></g>
      <path class="ink" data-s=".66" pathLength="1" d="M754,627l3 3 5-6" fill="none" stroke="#1b2a4a" stroke-width="2" stroke-linecap="round"/>
      <g stroke="#1b2a4a" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"><path class="ink" data-s=".58" pathLength="1" d="M775,628L840,634"/><path class="ink" data-s=".64" pathLength="1" d="M776,645L828,650"/><path class="ink" data-s=".7" pathLength="1" d="M777,662L850,668"/></g>
      <!-- pen -->
      <g id="pen" stroke-linecap="round"><line x1="820" y1="728" x2="975" y2="716" stroke="#000" stroke-opacity=".5" stroke-width="9" filter="url(#soft)"/><line x1="810" y1="712" x2="965" y2="700" stroke="#16223a" stroke-width="8"/><line x1="810" y1="709" x2="965" y2="697" stroke="#5c78ad" stroke-width="2" stroke-opacity=".8"/><line x1="800" y1="713" x2="810" y2="712" stroke="#c9a15a" stroke-width="8"/></g>
      <!-- mug -->
      <ellipse cx="1060" cy="668" rx="52" ry="12" fill="#000" opacity=".55" filter="url(#soft)"/>
      <path d="M1112 600c34 2 34 52 0 52" fill="none" stroke="#2b3a57" stroke-width="10"/>
      <path d="M1012 590v70c0 12 20 18 48 18s48-6 48-18v-70z" fill="url(#mug)"/>
      <ellipse cx="1060" cy="590" rx="48" ry="12" fill="#0e1424"/><ellipse cx="1060" cy="592" rx="40" ry="8" fill="#2a1a12"/>
    </svg>
<div id="dark"></div>
<svg id="front" preserveAspectRatio="xMaxYMax meet" viewBox="-700 0 1900 800">
      <defs>
        <radialGradient id="poolg"><stop offset="0" stop-color="#FFD9A8" stop-opacity=".62"/><stop offset=".45" stop-color="#FFB36B" stop-opacity=".30"/><stop offset="1" stop-color="#FFB36B" stop-opacity="0"/></radialGradient>
        <radialGradient id="haloG"><stop offset="0" stop-color="#FFE3BB" stop-opacity=".8"/><stop offset=".3" stop-color="#FFB36B" stop-opacity=".35"/><stop offset="1" stop-color="#FFB36B" stop-opacity="0"/></radialGradient>
        <linearGradient id="beamg" gradientUnits="userSpaceOnUse" x1="592" y1="382" x2="741" y2="640"><stop offset="0" stop-color="#FFD9A8" stop-opacity=".55"/><stop offset=".7" stop-color="#FFB36B" stop-opacity=".16"/><stop offset="1" stop-color="#FFB36B" stop-opacity="0"/></linearGradient>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d1017"/><stop offset=".55" stop-color="#232a38"/><stop offset=".8" stop-color="#3a4558"/><stop offset="1" stop-color="#151a24"/></linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d1017"/><stop offset=".6" stop-color="#2b3342"/><stop offset="1" stop-color="#10141c"/></linearGradient>
        <radialGradient id="bulbg"><stop offset="0" stop-color="#FFFBEF"/><stop offset=".35" stop-color="#FFE3B8"/><stop offset="1" stop-color="#FFB36B" stop-opacity="0"/></radialGradient>
        <filter id="blur14" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
      <!-- light first (screen blended), behind the lamp parts -->
      <g id="light" style="opacity:var(--lt,1)">
        <polygon class="beam" points="530,418 655,346 1010,628 470,668" fill="url(#beamg)" filter="url(#blur14)" style="opacity:calc(var(--l)*var(--b,1))"/>
        <ellipse class="pool" id="poolE" cx="740" cy="650" rx="330" ry="80" fill="url(#poolg)" style="opacity:calc(var(--l)*var(--b,1));transform-box:fill-box;transform-origin:50% 50%;transform:scale(var(--sp,.5))"/>
        <circle class="halo" cx="592" cy="382" r="190" fill="url(#haloG)" style="opacity:calc(var(--l)*.7*var(--b,1))"/>
      </g>
      <clipPath id="bc"><polygon points="530,418 655,346 1010,628 470,668"/></clipPath>
      <g id="dust" clip-path="url(#bc)" style="opacity:calc(var(--l)*.85)"></g>
      <g style="opacity:calc(var(--l)*.7);mix-blend-mode:screen" fill="none" stroke="#FFE9D0" stroke-linecap="round" filter="url(#blur14)">
        <g transform="translate(1040 578)"><path class="steam" style="animation-delay:0s" stroke-width="5" d="M0,0c-9-12 9-22 0-34"/></g>
        <g transform="translate(1062 578)"><path class="steam" style="animation-delay:2.3s" stroke-width="6" d="M0,0c9-12-9-22 0-34"/></g>
        <g transform="translate(1082 580)"><path class="steam" style="animation-delay:4.4s" stroke-width="4" d="M0,0c-8-12 8-22 0-34"/></g>
      </g>
      <g class="lamp">
        <!-- base -->
        <ellipse cx="300" cy="652" rx="94" ry="21" fill="#07090d"/>
        <path d="M206 640v12a94 21 0 0 0 188 0v-12z" fill="url(#metal)"/>
        <ellipse cx="300" cy="640" rx="94" ry="21" fill="url(#metal)"/>
        <ellipse cx="300" cy="638" rx="70" ry="14" fill="#1a202c"/>
        <path d="M230 641a70 14 0 0 0 140 0" fill="none" stroke="#FFB36B" stroke-width="2" style="opacity:calc(var(--l)*.55)"/>
        <!-- arms: a parallelogram pair, like a real balanced lamp -->
        <line x1="292" y1="630" x2="377" y2="438" stroke="#0b0e14" stroke-width="7" stroke-linecap="round"/>
        <line x1="308" y1="632" x2="393" y2="440" stroke="url(#metal)" stroke-width="11" stroke-linecap="round"/>
        <line x1="311" y1="628" x2="395" y2="440" stroke="#FFD9A8" stroke-width="2" stroke-linecap="round" style="opacity:calc(var(--l)*.55)"/>
        <line x1="377" y1="440" x2="537" y2="304" stroke="#0b0e14" stroke-width="7" stroke-linecap="round"/>
        <line x1="394" y1="436" x2="553" y2="298" stroke="url(#metal)" stroke-width="11" stroke-linecap="round"/>
        <line x1="396" y1="432" x2="553" y2="296" stroke="#FFD9A8" stroke-width="2" stroke-linecap="round" style="opacity:calc(var(--l)*.6)"/>
        <circle cx="386" cy="439" r="15" fill="url(#metal)" stroke="#05070a" stroke-width="2"/><circle cx="386" cy="439" r="5" fill="#0b0e14"/>
        <circle cx="300" cy="632" r="12" fill="url(#metal)" stroke="#05070a" stroke-width="2"/>
        <!-- head -->
        <g transform="translate(545 300) rotate(-30)">
          <path d="M-18 -4Q0 -26 18 -4L74 92Q0 112 -74 92Z" fill="url(#shade)" stroke="#05070a" stroke-width="2"/>
          <path d="M8 -12Q16 0 40 46" fill="none" stroke="#FFD9A8" stroke-width="3" stroke-linecap="round" style="opacity:calc(var(--l)*.5)"/>
          <ellipse cx="0" cy="94" rx="74" ry="15" fill="#2a1a10"/>
          <ellipse cx="0" cy="94" rx="68" ry="12" fill="url(#bulbg)" style="opacity:var(--l)"/>
          <ellipse cx="0" cy="94" rx="74" ry="15" fill="none" stroke="#FF6B35" stroke-width="2" style="opacity:calc(var(--l)*.7)"/>
          <ellipse cx="0" cy="96" rx="26" ry="9" fill="#FFFBEF" filter="url(#blur14)" style="opacity:calc(var(--l)*.9)"/>
          <ellipse cx="0" cy="95" rx="14" ry="5" fill="#FFFBEF" style="opacity:var(--l)"/>
        </g>
        <circle cx="545" cy="300" r="13" fill="url(#metal)" stroke="#05070a" stroke-width="2"/>
      </g>
    </svg>`;
