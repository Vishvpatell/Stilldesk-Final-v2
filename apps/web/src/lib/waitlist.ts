/**
 * Waitlist client. Contract: docs/12-backend-waitlist-api-spec.md, POST /v1/waitlist.
 * Body: { name, email, consent, consentTextVersion, source, company_website }.
 * IMPORTANT DEVIATION: the docs make `name` optional; the owner asked for the site form to require it,
 * so the form validates it. The API (Stage 5) must then require it too: see DEVIATIONS.md.
 * Nothing here pretends to succeed: success only when the server answers { ok: true }.
 */
export const CONSENT_VERSION = "consent-v1";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type WaitlistInput = { name: string; email: string; consent: boolean; company_website: string };
export type FieldErrors = Partial<Record<"name" | "email" | "consent", string>>;
export type WaitlistResult =
  | { ok: true }
  | { ok: false; kind: "validation"; fields: FieldErrors }
  | { ok: false; kind: "rate" | "server" | "network" | "not-configured" };

// Messages: docs/05 section A
export const MSG = {
  name: "Please tell us your name.",
  nameLong: "That name is a bit long. Could you shorten it to 80 characters?",
  email: "That email doesn’t look quite right. Could you check it?",
  consent: "Please tick the box so we know you’re happy to hear from us.",
  rate: "Lots of sign-ups from this connection. Please try again in a little while.",
  server: "Something went wrong on our side. Please try again.",
  network: "We couldn’t reach the server. Check your connection and try again.",
  notConfigured: "Sign-ups aren’t switched on yet. The waitlist server isn’t connected to this version of the site, so nothing was sent.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function validate(v: Pick<WaitlistInput, "name" | "email" | "consent">): FieldErrors {
  const e: FieldErrors = {};
  const name = v.name.trim(), email = v.email.trim();
  if (!name) e.name = MSG.name; else if (name.length > 80) e.name = MSG.nameLong;
  if (!EMAIL.test(email) || email.length > 254) e.email = MSG.email;
  if (!v.consent) e.consent = MSG.consent;
  return e;
}

export async function submitWaitlist(v: WaitlistInput): Promise<WaitlistResult> {
  if (!API_URL) return { ok: false, kind: "not-configured" };
  try {
    const res = await fetch(`${API_URL}/v1/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: v.name.trim(), email: v.email.trim().toLowerCase(), consent: v.consent,
        consentTextVersion: CONSENT_VERSION, source: "landing", company_website: v.company_website,
      }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok === true) return { ok: true };
    const code = data?.error?.code;
    if (res.status === 429 || code === "RATE_LIMITED") return { ok: false, kind: "rate" };
    if (code === "VALIDATION_ERROR") {
      const f = data.error.fields ?? {};
      return { ok: false, kind: "validation", fields: { name: f.name && MSG.name, email: f.email && MSG.email, consent: f.consent && MSG.consent } };
    }
    return { ok: false, kind: "server" };
  } catch {
    return { ok: false, kind: "network" };
  }
}
