/**
 * The ONE place the website talks to the Stilldesk API (apps/api).
 * - Only a public URL is used (NEXT_PUBLIC_API_URL). Secrets never belong in the browser.
 * - Every request has a timeout, so the screen can never wait forever.
 * - A result is "ok" only when the server answered 2xx with { ok: true }. Nothing is ever faked.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export const DEFAULT_TIMEOUT_MS = 12_000;

export type ApiFailKind = "not-configured" | "network" | "timeout" | "rate" | "unavailable" | "validation" | "token-invalid" | "token-expired" | "server";
export type ApiResult<T> = ({ ok: true } & T) | { ok: false; kind: ApiFailKind; fields?: Record<string, string> };

type Opts = { timeoutMs?: number; baseUrl?: string; fetchImpl?: typeof fetch };

export async function postJson<T extends object = Record<string, never>>(path: string, body: unknown, opts: Opts = {}): Promise<ApiResult<T>> {
  const base = opts.baseUrl ?? API_URL;
  if (!base) return { ok: false, kind: "not-configured" };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const res = await (opts.fetchImpl ?? fetch)(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      credentials: "omit", // no cookies are used, so none are sent
    });
    const data = (await res.json().catch(() => null)) as ({ ok?: boolean; error?: { code?: string; fields?: Record<string, string> } } & T) | null;
    if (res.ok && data?.ok === true) return data as { ok: true } & T;
    if (res.status === 429 || data?.error?.code === "RATE_LIMITED") return { ok: false, kind: "rate" };
    if (res.status === 503 || data?.error?.code === "UNAVAILABLE") return { ok: false, kind: "unavailable" };
    const code = data?.error?.code;
    if (code === "VALIDATION_ERROR") return { ok: false, kind: "validation", ...(data?.error?.fields ? { fields: data.error.fields } : {}) };
    if (code === "TOKEN_EXPIRED") return { ok: false, kind: "token-expired" };
    if (code === "TOKEN_INVALID") return { ok: false, kind: "token-invalid" };
    return { ok: false, kind: "server" };
  } catch (e) {
    return { ok: false, kind: e instanceof DOMException && e.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}

/** Plain-language message for each failure. `what` = e.g. "sign-up" or "feedback". */
export function failMessage(kind: ApiFailKind, supportHint = ""): string {
  switch (kind) {
    case "not-configured": return "This version of the site isn’t connected to the Stilldesk server yet, so nothing was sent.";
    case "rate": return "Lots of requests from this connection. Please try again in a little while.";
    case "unavailable": return "This is temporarily unavailable on our side. Please try again in a few minutes.";
    case "timeout": return "That took too long. Check your connection and try again.";
    case "network": return "We couldn’t reach the server. Check your connection and try again.";
    case "token-expired": return "That link has expired.";
    case "token-invalid": return "That link doesn’t look right.";
    default: return `Something went wrong on our side. Please try again${supportHint}.`;
  }
}
