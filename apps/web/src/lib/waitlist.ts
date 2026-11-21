import { postJson, failMessage, type ApiFailKind } from "./api";

/**
 * Waitlist client. Contract: docs/12 POST /v1/waitlist.
 * DEVIATION (DEVIATIONS.md #1): `name` is required here and on the server, as the owner asked.
 */
export const CONSENT_VERSION = "consent-v1";

export type WaitlistInput = { name: string; email: string; consent: boolean; company_website: string };
export type FieldErrors = Partial<Record<"name" | "email" | "consent", string>>;
export type WaitlistResult = { ok: true } | { ok: false; kind: ApiFailKind; fields?: FieldErrors };

// Messages: docs/05 section A
export const MSG = {
  name: "Please tell us your name.",
  nameLong: "That name is a bit long. Could you shorten it to 80 characters?",
  email: "That email doesn’t look quite right. Could you check it?",
  consent: "Please tick the box so we know you’re happy to hear from us.",
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
  const r = await postJson("/v1/waitlist", {
    name: v.name.trim(), email: v.email.trim().toLowerCase(), consent: v.consent,
    consentTextVersion: CONSENT_VERSION, source: "landing", company_website: v.company_website,
  });
  if (r.ok) return { ok: true };
  if (r.kind === "validation") {
    const f = r.fields ?? {};
    return { ok: false, kind: "validation", fields: { ...(f.name ? { name: MSG.name } : {}), ...(f.email ? { email: MSG.email } : {}), ...(f.consent ? { consent: MSG.consent } : {}) } };
  }
  return { ok: false, kind: r.kind };
}

export const waitlistFailMessage = (kind: ApiFailKind) => failMessage(kind);
