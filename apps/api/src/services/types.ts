import type { SurveyAnswers } from "../schemas";

export type EntryRecord = {
  id: string;
  email: string;
  name: string;
  confirmedAt: Date | null;
  unsubscribedAt: Date | null;
  confirmTokenHash: string | null;
  confirmTokenExpiresAt: Date | null;
};

export class DuplicateEmailError extends Error {
  constructor() { super("duplicate email"); this.name = "DuplicateEmailError"; }
}

export interface WaitlistRepo {
  findByEmail(email: string): Promise<EntryRecord | null>;
  findByTokenHash(hash: string): Promise<EntryRecord | null>;
  findById(id: string): Promise<EntryRecord | null>;
  /** Must throw DuplicateEmailError if the email already exists (unique index). */
  create(d: { email: string; name: string; source: string; consentTextVersion: string; consentAt: Date; confirmTokenHash: string; confirmTokenExpiresAt: Date }): Promise<EntryRecord>;
  /** Re-consent and fresh token for an existing, unconfirmed (or previously unsubscribed) entry. Clears confirmed/unsubscribed state. */
  resetForResend(id: string, d: { name: string; consentTextVersion: string; consentAt: Date; confirmTokenHash: string; confirmTokenExpiresAt: Date }): Promise<void>;
  /** Mark confirmed and clear the token. */
  confirm(id: string, at: Date): Promise<void>;
  setUnsubscribed(id: string, at: Date): Promise<void>;
  saveSurvey(id: string, survey: SurveyAnswers, betaOptIn: boolean | null): Promise<void>;
  createFeedback(d: { message: string; contact: string | null }): Promise<void>;
}

export interface Mailer {
  /** false = no way to send email: sign-ups must answer 503 instead of pretending. */
  readonly configured: boolean;
  sendConfirmation(to: string, v: { name: string; confirmUrl: string }): Promise<void>;
  sendWelcome(to: string, v: { name: string; surveyUrl: string; unsubscribeUrl: string; unsubscribePostUrl: string }): Promise<void>;
  notifyFeedback(v: { message: string; contact: string | null }): Promise<void>;
}

/** Ids and error names only. Never emails, names or message text. */
export interface Logger {
  info(obj: Record<string, unknown>, msg: string): void;
  warn(obj: Record<string, unknown>, msg: string): void;
  error(obj: Record<string, unknown>, msg: string): void;
}
