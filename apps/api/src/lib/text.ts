/** Trim, normalise and lowercase an email for storage and lookup. */
export const normaliseEmail = (email: string): string => email.trim().toLowerCase();

/** "jane.doe@gmail.com" -> "j***@gmail.com" (for the unsubscribe confirmation). */
export function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}

/** Plain-text name: Unicode-normalised, control characters removed, whitespace collapsed. */
export function cleanName(raw: string): string {
  // eslint-disable-next-line no-control-regex
  return raw.normalize("NFC").replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069]/g, "").replace(/\s+/g, " ").trim();
}

/** Escape text before putting it inside an HTML email. */
export const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
