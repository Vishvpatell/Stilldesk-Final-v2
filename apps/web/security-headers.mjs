// Security headers, kept in a plain file so they can be unit-tested (test/config.test.ts).
// CSP note: Next.js injects small inline scripts, so script-src needs 'unsafe-inline'. A stricter nonce-based CSP
// needs fully dynamic rendering (it would slow the static site), so it is a documented future step (docs/SECURITY.md).
export function buildSecurityHeaders({ apiOrigin = "", isDev = false } = {}) {
  const connect = ["'self'", apiOrigin].filter(Boolean).join(" ");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connect}${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
  const headers = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ...(isDev ? [] : [
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "Content-Security-Policy", value: csp },
    ]),
  ];
  return headers;
}

/** Validates the production site URL. Never invents a domain; never accepts localhost for a production build. */
export function checkSiteUrl(raw, { production }) {
  if (!raw) {
    return production ? "NEXT_PUBLIC_SITE_URL is not set. Set it to your real https:// domain (see .env.example) before `next build`." : null;
  }
  let u;
  try { u = new URL(raw); } catch { return `NEXT_PUBLIC_SITE_URL is not a valid URL: "${raw}"`; }
  if (production && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) return "NEXT_PUBLIC_SITE_URL points to localhost. Use your real domain for a production build.";
  if (production && u.protocol !== "https:") return "NEXT_PUBLIC_SITE_URL must start with https:// in production.";
  return null;
}
