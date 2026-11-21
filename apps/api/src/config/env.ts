import { z } from "zod";

/**
 * Environment validation. Runs once at startup (src/index.ts). Reports which variables are wrong,
 * never their values. Required: SITE_URL, CORS_ORIGINS, DATABASE_URL, TOKEN_SECRET.
 * Email variables are optional: without them the API starts, but sign-ups answer 503 "unavailable"
 * (it never pretends to have sent an email).
 */
const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const opt = <T extends z.ZodTypeAny>(s: T) => z.preprocess(emptyToUndefined, s.optional());
const origins = z.string().min(1).transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)).pipe(z.array(z.string().url()).min(1));

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  SITE_URL: z.string().url(),
  API_URL: opt(z.string().url()),
  CORS_ORIGINS: origins,
  DATABASE_URL: z.string().min(1),
  TOKEN_SECRET: z.string().min(32, "must be at least 32 characters"),
  TRUST_PROXY: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(10).default(0)),
  EMAIL_MODE: z.preprocess(emptyToUndefined, z.enum(["resend", "console"]).default("resend")),
  RESEND_API_KEY: opt(z.string().min(1)),
  EMAIL_FROM: opt(z.string().min(3)),
  EMAIL_REPLY_TO: opt(z.string().min(3)),
  SUPPORT_EMAIL: opt(z.string().email()),
  EARLY_BIRD_OFFER: opt(z.string().max(200)),
  EMAIL_POSTAL_ADDRESS: opt(z.string().max(300)),
});

export type Env = z.infer<typeof schema> & { apiUrl: string; emailConfigured: boolean; isProduction: boolean };
export type EnvResult = { ok: true; env: Env } | { ok: false; problems: string[] };

export function loadEnv(source: Record<string, string | undefined>): EnvResult {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    return { ok: false, problems: parsed.error.issues.map((i) => `${i.path.join(".") || "env"}: ${i.message}`) };
  }
  const e = parsed.data;
  const problems: string[] = [];
  const production = e.NODE_ENV === "production";
  if (production) {
    if (!e.SITE_URL.startsWith("https://")) problems.push("SITE_URL: must be https in production");
    if (e.CORS_ORIGINS.some((o) => !o.startsWith("https://"))) problems.push("CORS_ORIGINS: every origin must be https in production");
    if (e.EMAIL_MODE === "console") problems.push("EMAIL_MODE: 'console' is for development only");
    if (!e.API_URL) problems.push("API_URL: required in production (used in email links)");
    if (e.API_URL && !e.API_URL.startsWith("https://")) problems.push("API_URL: must be https in production");
  }
  if (e.EMAIL_MODE === "resend" && (e.RESEND_API_KEY || e.EMAIL_FROM) && !(e.RESEND_API_KEY && e.EMAIL_FROM)) {
    problems.push("RESEND_API_KEY and EMAIL_FROM must be set together");
  }
  if (problems.length) return { ok: false, problems };
  const apiUrl = (e.API_URL ?? `http://localhost:${e.PORT}`).replace(/\/$/, "");
  const emailConfigured = e.EMAIL_MODE === "console" || Boolean(e.RESEND_API_KEY && e.EMAIL_FROM);
  return { ok: true, env: { ...e, SITE_URL: e.SITE_URL.replace(/\/$/, ""), apiUrl, emailConfigured, isProduction: production } };
}

/** Human-readable startup error. Names variables only. */
export function formatEnvProblems(problems: string[]): string {
  return ["Stilldesk API cannot start: fix these environment variables (see .env.example):", ...problems.map((p) => `  - ${p}`)].join("\n");
}
