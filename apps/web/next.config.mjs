import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import { buildSecurityHeaders, checkSiteUrl } from "./security-headers.mjs";

export default function config(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  // Fail early, with a clear message, instead of shipping wrong canonical/share URLs.
  const problem = checkSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, { production: !isDev && process.env.NODE_ENV === "production" });
  if (problem) throw new Error(`\n\n[Stilldesk config] ${problem}\n`);

  let apiOrigin = "";
  try { apiOrigin = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : ""; } catch { /* invalid URL is reported by the form at runtime */ }

  return {
    reactStrictMode: true,
    poweredByHeader: false, // do not advertise "X-Powered-By: Next.js"
    async headers() {
      return [{ source: "/:path*", headers: buildSecurityHeaders({ apiOrigin, isDev }) }];
    },
  };
}
