import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Random single-use confirmation token (32 bytes). Only its SHA-256 hash is stored. */
export const newToken = (): string => randomBytes(32).toString("base64url");
export const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

export type TokenPurpose = "survey" | "unsub";
export type VerifyResult = { ok: true; id: string } | { ok: false; reason: "invalid" | "expired" };

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const sign = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("base64url");

/** HMAC-signed token: `<payload>.<signature>`. The purpose is inside the signed payload, so a survey token can't unsubscribe. */
export function signToken(purpose: TokenPurpose, id: string, secret: string, opts: { ttlMs?: number; now?: number } = {}): string {
  const now = opts.now ?? Date.now();
  const payload = JSON.stringify({ p: purpose, id, ...(opts.ttlMs ? { exp: now + opts.ttlMs } : {}) });
  const body = b64(payload);
  return `${body}.${sign(body, secret)}`;
}

export function verifyToken(token: string, purpose: TokenPurpose, secret: string, now = Date.now()): VerifyResult {
  if (typeof token !== "string" || token.length > 500) return { ok: false, reason: "invalid" };
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return { ok: false, reason: "invalid" };
  const expected = Buffer.from(sign(body, secret)), given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "invalid" };
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { p?: string; id?: string; exp?: number };
    if (p.p !== purpose || typeof p.id !== "string" || !p.id) return { ok: false, reason: "invalid" };
    if (typeof p.exp === "number" && p.exp < now) return { ok: false, reason: "expired" };
    return { ok: true, id: p.id };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
