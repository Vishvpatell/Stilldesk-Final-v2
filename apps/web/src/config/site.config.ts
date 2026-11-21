/**
 * ONE place for every fact that is still undecided.
 * Each value starts as its {{TOKEN}}. To fill one in, replace the value with the real text.
 * Until then the site shows a clearly marked placeholder chip (see components/ui/Placeholder.tsx),
 * and `npm run build` warns if any {{TOKEN}} is still in the built pages (scripts/check-placeholders.mjs).
 */
/**
 * The public address of the site. Comes ONLY from NEXT_PUBLIC_SITE_URL: no domain is invented.
 * The localhost fallback exists for `next dev` only. A production build without the variable fails (see next.config.mjs).
 */
function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_SITE_URL is required for a production build (see .env.example).");
  return "http://localhost:3000";
}

export const site = {
  name: "Stilldesk",
  tagline: "Plan it. Sit down. Study.",
  status: "Launching soon on Android",
  url: siteUrl(),
  year: 2026,
} as const;

type Entry = { value: string; label: string };

/** token name -> current value + the friendly label shown while it is unresolved */
export const placeholders: Record<string, Entry> = {
  DOMAIN: { value: "{{DOMAIN}}", label: "domain: to be decided" },
  SUPPORT_EMAIL: { value: "{{SUPPORT_EMAIL}}", label: "support email: to be decided" },
  PRIVACY_EMAIL: { value: "{{PRIVACY_EMAIL}}", label: "privacy email: to be decided" },
  SUPPORT_RESPONSE_PROMISE: { value: "{{SUPPORT_RESPONSE_PROMISE}}", label: "reply-time promise: optional" },
  FEEDBACK_REPLY_PROMISE: { value: "{{FEEDBACK_REPLY_PROMISE}}", label: "feedback reply line: optional" },
  LEGAL_NAME: { value: "{{LEGAL_NAME}}", label: "legal name: to be decided" },
  LEGAL_ADDRESS: { value: "{{LEGAL_ADDRESS}}", label: "legal address: to be decided" },
  EMAIL_POSTAL_ADDRESS: { value: "{{EMAIL_POSTAL_ADDRESS}}", label: "postal address: if required" },
  GOVERNING_LAW: { value: "{{GOVERNING_LAW}}", label: "governing law: to be decided" },
  JURISDICTION_CLAUSE: { value: "{{JURISDICTION_CLAUSE}}", label: "courts clause: optional" },
  LIABILITY_CAP: { value: "{{LIABILITY_CAP}}", label: "liability cap: to be decided" },
  EARLY_BIRD_OFFER: { value: "{{EARLY_BIRD_OFFER}}", label: "early-bird offer: to be decided" },
  EARLY_BIRD_EXPIRY: { value: "{{EARLY_BIRD_EXPIRY}}", label: "offer expiry: to be decided" },
  EARLY_BIRD_CODE: { value: "{{EARLY_BIRD_CODE}}", label: "offer code: set at launch" },
  ANALYTICS_TOOL: { value: "{{ANALYTICS_TOOL}}", label: "analytics tool: to confirm" },
  COOKIE_STATEMENT: { value: "{{COOKIE_STATEMENT}}", label: "cookie statement: to verify" },
  HOSTING_PROVIDER: { value: "{{HOSTING_PROVIDER}}", label: "hosting provider: to be decided" },
  API_HOST: { value: "{{API_HOST}}", label: "API host: to be decided" },
  RETENTION_WAITLIST: { value: "{{RETENTION_WAITLIST}}", label: "retention period: to be decided" },
  RETENTION_UNCONFIRMED: { value: "{{RETENTION_UNCONFIRMED}}", label: "retention period: to be decided" },
  RETENTION_FEEDBACK: { value: "{{RETENTION_FEEDBACK}}", label: "retention period: to be decided" },
  RETENTION_LOGS: { value: "{{RETENTION_LOGS}}", label: "retention period: to be decided" },
  GRIEVANCE_CONTACT: { value: "{{GRIEVANCE_CONTACT}}", label: "grievance contact: if required" },
  VOICE_INPUT_NOTE: { value: "{{VOICE_INPUT_NOTE}}", label: "voice input note: to be decided" },
  PRO_PRICE_MONTHLY: { value: "{{PRO_PRICE_MONTHLY}}", label: "Pro monthly price: set after survey" },
  PRO_PRICE_YEARLY: { value: "{{PRO_PRICE_YEARLY}}", label: "Pro yearly price: set after survey" },
  PRO_CANCELLATION_TERMS: { value: "{{PRO_CANCELLATION_TERMS}}", label: "cancellation and refund terms: to be decided" },
  GOOGLE_FORM_URL: { value: "{{GOOGLE_FORM_URL}}", label: "fallback form link: to create" },
  INSTAGRAM_HANDLE: { value: "{{INSTAGRAM_HANDLE}}", label: "handle: after name check" },
  PLAY_STORE_URL: { value: "{{PLAY_STORE_URL}}", label: "store link: at launch" },
};

export const isUnresolved = (token: string) => {
  const e = placeholders[token];
  return !e || /^\{\{.*\}\}$/.test(e.value);
};
export const value = (token: string) => placeholders[token]?.value ?? `{{${token}}}`;
