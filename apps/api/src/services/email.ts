import { Resend } from "resend";
import type { Env } from "../config/env";
import { AppError } from "../lib/errors";
import { confirmationEmail, feedbackNotification, welcomeEmail, type Brand, type Rendered } from "./email-templates";
import type { Logger, Mailer } from "./types";

const brandOf = (env: Env): Brand => ({ domain: new URL(env.SITE_URL).hostname, offer: env.EARLY_BIRD_OFFER, postalAddress: env.EMAIL_POSTAL_ADDRESS });

/** Real sending through Resend. The API key stays on the server and is never logged. */
export function createResendMailer(env: Env): Mailer {
  const client = new Resend(env.RESEND_API_KEY);
  const brand = brandOf(env);
  const send = async (to: string, mail: Rendered, headers?: Record<string, string>) => {
    const { error } = await client.emails.send({
      from: env.EMAIL_FROM as string,
      to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      ...(env.EMAIL_REPLY_TO ? { replyTo: env.EMAIL_REPLY_TO } : {}),
      ...(headers ? { headers } : {}),
    });
    if (error) throw new Error(`resend:${error.name}`);
  };
  return {
    configured: true,
    sendConfirmation: (to, v) => send(to, confirmationEmail(v, brand)),
    sendWelcome: (to, v) => send(to, welcomeEmail(v, brand), {
      "List-Unsubscribe": `<${v.unsubscribePostUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    }),
    notifyFeedback: async (v) => { if (env.SUPPORT_EMAIL) await send(env.SUPPORT_EMAIL, feedbackNotification(v)); },
  };
}

/** Development only (refused in production): prints links to the server console instead of emailing. Clearly not real email. */
export function createConsoleMailer(env: Env, log: Logger): Mailer {
  const note = (what: string, url: string) => log.info({ devEmail: what, url }, "EMAIL_MODE=console: no email was sent. Open this link yourself");
  return {
    configured: true,
    sendConfirmation: async (_to, v) => note("confirmation", v.confirmUrl),
    sendWelcome: async (_to, v) => note("welcome", v.surveyUrl),
    notifyFeedback: async () => undefined,
  };
}

/** Used when email is not configured: every send refuses, and sign-ups answer 503. */
export const unavailableMailer: Mailer = {
  configured: false,
  sendConfirmation: () => Promise.reject(new AppError("UNAVAILABLE", "Email is not configured.")),
  sendWelcome: () => Promise.reject(new AppError("UNAVAILABLE", "Email is not configured.")),
  notifyFeedback: () => Promise.resolve(),
};

export const createMailer = (env: Env, log: Logger): Mailer =>
  env.EMAIL_MODE === "console" ? createConsoleMailer(env, log) : env.emailConfigured ? createResendMailer(env) : unavailableMailer;
