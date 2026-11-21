import { AppError } from "../lib/errors";
import { maskEmail } from "../lib/text";
import { newToken, sha256, signToken, verifyToken } from "../lib/tokens";
import type { FeedbackBody, SurveyAnswers, WaitlistBody } from "../schemas";
import { DuplicateEmailError, type EntryRecord, type Logger, type Mailer, type WaitlistRepo } from "./types";

const DAY = 86_400_000;
export type ServiceConfig = {
  siteUrl: string;
  apiUrl: string;
  tokenSecret: string;
  confirmTtlMs?: number;     // default 7 days (docs/11)
  resendCooldownMs?: number; // default 60 s: stops anyone from mail-bombing an address
  now?: () => Date;
};
export type ConfirmResult = { status: "ok"; surveyToken: string } | { status: "expired" } | { status: "invalid" };

export class WaitlistService {
  private readonly ttl: number;
  private readonly cooldown: number;
  private readonly now: () => Date;

  constructor(private readonly repo: WaitlistRepo, private readonly mailer: Mailer, private readonly cfg: ServiceConfig, private readonly log: Logger) {
    this.ttl = cfg.confirmTtlMs ?? 7 * DAY;
    this.cooldown = cfg.resendCooldownMs ?? 60_000;
    this.now = cfg.now ?? (() => new Date());
  }

  /** Always resolves the same `{ ok: true }` for real, duplicate and bot sign-ups: it never reveals if an email exists. */
  async join(input: WaitlistBody): Promise<{ ok: true }> {
    if (input.company_website) return { ok: true }; // honeypot: look successful, save nothing
    if (!this.mailer.configured) throw new AppError("UNAVAILABLE", "Sign-ups are temporarily unavailable. Please try again later.");

    const existing = await this.repo.findByEmail(input.email);
    if (!existing) {
      const t = this.issue();
      let rec: EntryRecord;
      try {
        rec = await this.repo.create({ email: input.email, name: input.name, source: input.source, consentTextVersion: input.consentTextVersion, consentAt: this.now(), confirmTokenHash: t.hash, confirmTokenExpiresAt: t.expires });
      } catch (e) {
        if (e instanceof DuplicateEmailError) { // two sign-ups raced: treat the loser as an existing entry
          const again = await this.repo.findByEmail(input.email);
          if (again) return this.existing(again, input);
        }
        throw e;
      }
      await this.sendConfirmation(rec, input.name, t.token);
      return { ok: true };
    }
    return this.existing(existing, input);
  }

  private async existing(rec: EntryRecord, input: WaitlistBody): Promise<{ ok: true }> {
    if (rec.confirmedAt && !rec.unsubscribedAt) return { ok: true }; // already on the list: send nothing
    const issuedAt = rec.confirmTokenExpiresAt ? rec.confirmTokenExpiresAt.getTime() - this.ttl : null;
    if (!rec.unsubscribedAt && issuedAt !== null && this.now().getTime() - issuedAt < this.cooldown) return { ok: true }; // too soon to resend
    const t = this.issue();
    await this.repo.resetForResend(rec.id, { name: input.name, consentTextVersion: input.consentTextVersion, consentAt: this.now(), confirmTokenHash: t.hash, confirmTokenExpiresAt: t.expires });
    await this.sendConfirmation(rec, input.name, t.token);
    return { ok: true };
  }

  async confirm(token: string | undefined): Promise<ConfirmResult> {
    if (!token || token.length > 200) return { status: "invalid" };
    const rec = await this.repo.findByTokenHash(sha256(token));
    if (!rec) return { status: "invalid" };
    if (!rec.confirmTokenExpiresAt || rec.confirmTokenExpiresAt.getTime() < this.now().getTime()) return { status: "expired" };
    await this.repo.confirm(rec.id, this.now());
    const surveyToken = signToken("survey", rec.id, this.cfg.tokenSecret, { ttlMs: 180 * DAY, now: this.now().getTime() });
    try { // a failed welcome email never undoes a real confirmation
      await this.mailer.sendWelcome(rec.email, {
        name: rec.name,
        surveyUrl: `${this.cfg.siteUrl}/waitlist/survey?token=${surveyToken}`,
        ...this.unsubscribeUrls(rec.id),
      });
    } catch (e) { this.log.warn({ entryId: rec.id, err: errName(e) }, "welcome email failed"); }
    return { status: "ok", surveyToken };
  }

  async unsubscribe(token: string | undefined): Promise<{ ok: true; email: string }> {
    const v = token ? verifyToken(token, "unsub", this.cfg.tokenSecret, this.now().getTime()) : ({ ok: false } as const);
    if (!v.ok) throw new AppError("TOKEN_INVALID", "That link doesn't look right.");
    const rec = await this.repo.findById(v.id);
    if (!rec) throw new AppError("TOKEN_INVALID", "That link doesn't look right.");
    if (!rec.unsubscribedAt) await this.repo.setUnsubscribed(rec.id, this.now()); // idempotent
    return { ok: true, email: maskEmail(rec.email) };
  }

  async saveSurvey(token: string, answers: SurveyAnswers): Promise<{ ok: true }> {
    const v = verifyToken(token, "survey", this.cfg.tokenSecret, this.now().getTime());
    if (!v.ok) throw new AppError(v.reason === "expired" ? "TOKEN_EXPIRED" : "TOKEN_INVALID", v.reason === "expired" ? "That link has expired." : "That link doesn't look right.");
    const rec = await this.repo.findById(v.id);
    if (!rec) throw new AppError("TOKEN_INVALID", "That link doesn't look right.");
    await this.repo.saveSurvey(rec.id, answers, answers.betaInterest === undefined ? null : answers.betaInterest === "yes"); // last write wins
    return { ok: true };
  }

  async feedback(input: FeedbackBody): Promise<{ ok: true }> {
    if (input.company_website) return { ok: true };
    await this.repo.createFeedback({ message: input.message, contact: input.contact ?? null }); // a DB failure surfaces as an error: no fake success
    try { await this.mailer.notifyFeedback({ message: input.message, contact: input.contact ?? null }); }
    catch (e) { this.log.warn({ err: errName(e) }, "feedback notification failed"); } // the message itself is already stored
    return { ok: true };
  }

  private unsubscribeUrls(id: string) {
    const t = signToken("unsub", id, this.cfg.tokenSecret);
    return { unsubscribeUrl: `${this.cfg.siteUrl}/unsubscribe?token=${t}`, unsubscribePostUrl: `${this.cfg.apiUrl}/v1/waitlist/unsubscribe?token=${t}` };
  }

  private issue() {
    const token = newToken();
    return { token, hash: sha256(token), expires: new Date(this.now().getTime() + this.ttl) };
  }

  private async sendConfirmation(rec: EntryRecord, name: string, token: string) {
    try {
      await this.mailer.sendConfirmation(rec.email, { name, confirmUrl: `${this.cfg.apiUrl}/v1/waitlist/confirm?token=${token}` });
    } catch (e) {
      this.log.error({ entryId: rec.id, err: errName(e) }, "confirmation email failed");
      throw new AppError("UNAVAILABLE", "We couldn't send the confirmation email. Please try again in a moment.");
    }
  }
}

const errName = (e: unknown) => (e instanceof Error ? e.name : "unknown");
