import { z } from "zod";
import { cleanName } from "../lib/text";
import * as O from "./survey-options";

const email = z.string().trim().toLowerCase().max(254).email();
const honeypot = z.string().max(200).default("");

/** POST /v1/waitlist. Unknown fields are rejected. `name` is required (owner decision; docs/12 had it optional). */
export const waitlistBody = z.object({
  name: z.string().max(300).transform(cleanName).pipe(z.string().min(1).max(80)),
  email,
  consent: z.literal(true),
  consentTextVersion: z.string().trim().min(1).max(40),
  source: z.string().trim().max(40).default("landing"),
  company_website: honeypot,
}).strict();
export type WaitlistBody = z.infer<typeof waitlistBody>;

export const feedbackBody = z.object({
  message: z.string().trim().min(1).max(2000),
  contact: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), email.optional()),
  company_website: honeypot,
}).strict();
export type FeedbackBody = z.infer<typeof feedbackBody>;

const list = <T extends readonly [string, ...string[]]>(v: T) => z.array(z.enum(v)).max(v.length);

export const surveyAnswers = z.object({
  year: z.enum(O.YEAR),
  distractingApps: list(O.DISTRACTING_APPS),
  loseFocusWhen: list(O.LOSE_FOCUS),
  stopwatchOrTimer: z.enum(O.STOPWATCH_OR_TIMER),
  pricePerMonth: z.enum(O.PRICE),
  deleteReason: z.string().trim().max(300),
  platform: z.enum(O.PLATFORM),
  phoneBrand: z.enum(O.PHONE_BRAND),
  betaInterest: z.enum(O.BETA),
}).partial().strict().refine((a) => !a.phoneBrand || a.platform === "android" || a.platform === "both", { message: "phoneBrand needs an Android phone", path: ["phoneBrand"] });
export type SurveyAnswers = z.infer<typeof surveyAnswers>;

export const surveyBody = z.object({ token: z.string().min(1).max(500), answers: surveyAnswers }).strict();
export const tokenOnly = z.object({ token: z.string().min(1).max(500) });

/** Safe field errors: which field failed and a short code, never the submitted value. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of error.issues) {
    const key = String(i.path[0] ?? "body");
    if (out[key]) continue;
    out[key] = i.code === "too_big" ? "too_long" : i.code === "too_small" || (i.code === "invalid_type" && i.received === "undefined") ? "required" : i.code === "unrecognized_keys" ? "unknown_field" : "invalid";
  }
  return out;
}
