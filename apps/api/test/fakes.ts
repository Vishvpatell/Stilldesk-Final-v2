import { DuplicateEmailError, type EntryRecord, type Logger, type Mailer, type WaitlistRepo } from "../src/services/types";
import type { SurveyAnswers } from "../src/schemas";

export class MemoryRepo implements WaitlistRepo {
  entries: (EntryRecord & { survey?: SurveyAnswers; betaOptIn?: boolean | null; consentAt?: Date })[] = [];
  feedback: { message: string; contact: string | null }[] = [];
  failWrites = false;
  private n = 0;
  private guard() { if (this.failWrites) throw new Error("db down"); }
  async findByEmail(email: string) { this.guard(); return this.entries.find((e) => e.email === email) ?? null; }
  async findByTokenHash(h: string) { this.guard(); return this.entries.find((e) => e.confirmTokenHash === h) ?? null; }
  async findById(id: string) { this.guard(); return this.entries.find((e) => e.id === id) ?? null; }
  async create(d: Parameters<WaitlistRepo["create"]>[0]) {
    this.guard();
    if (this.entries.some((e) => e.email === d.email)) throw new DuplicateEmailError();
    const rec = { id: `id${++this.n}`, email: d.email, name: d.name, confirmedAt: null, unsubscribedAt: null, confirmTokenHash: d.confirmTokenHash, confirmTokenExpiresAt: d.confirmTokenExpiresAt, consentAt: d.consentAt };
    this.entries.push(rec);
    return rec;
  }
  async resetForResend(id: string, d: Parameters<WaitlistRepo["resetForResend"]>[1]) {
    this.guard();
    const e = this.entries.find((x) => x.id === id)!;
    Object.assign(e, { name: d.name, confirmTokenHash: d.confirmTokenHash, confirmTokenExpiresAt: d.confirmTokenExpiresAt, confirmedAt: null, unsubscribedAt: null });
  }
  async confirm(id: string, at: Date) { this.guard(); Object.assign(this.entries.find((x) => x.id === id)!, { confirmedAt: at, confirmTokenHash: null, confirmTokenExpiresAt: null }); }
  async setUnsubscribed(id: string, at: Date) { this.guard(); this.entries.find((x) => x.id === id)!.unsubscribedAt = at; }
  async saveSurvey(id: string, survey: SurveyAnswers, beta: boolean | null) { this.guard(); Object.assign(this.entries.find((x) => x.id === id)!, { survey, betaOptIn: beta }); }
  async createFeedback(d: { message: string; contact: string | null }) { this.guard(); this.feedback.push(d); }
}

export class RecordingMailer implements Mailer {
  configured = true;
  failSend = false;
  confirmations: { to: string; name: string; confirmUrl: string }[] = [];
  welcomes: { to: string; surveyUrl: string; unsubscribeUrl: string; unsubscribePostUrl: string }[] = [];
  notes: { message: string; contact: string | null }[] = [];
  async sendConfirmation(to: string, v: { name: string; confirmUrl: string }) { if (this.failSend) throw new Error("resend down"); this.confirmations.push({ to, ...v }); }
  async sendWelcome(to: string, v: { name: string; surveyUrl: string; unsubscribeUrl: string; unsubscribePostUrl: string }) { if (this.failSend) throw new Error("resend down"); this.welcomes.push({ to, ...v }); }
  async notifyFeedback(v: { message: string; contact: string | null }) { this.notes.push(v); }
}

/** Collects everything logged, so tests can prove no personal data leaks into logs. */
export class MemoryLogger implements Logger {
  lines: string[] = [];
  info(o: Record<string, unknown>, m: string) { this.lines.push(JSON.stringify({ o, m })); }
  warn(o: Record<string, unknown>, m: string) { this.lines.push(JSON.stringify({ o, m })); }
  error(o: Record<string, unknown>, m: string) { this.lines.push(JSON.stringify({ o, m })); }
}
