import { escapeHtml } from "../lib/text";

// Wording: docs/11-email-templates.md (templates 1 and 2). Every email has an HTML and a plain-text version.
export type Rendered = { subject: string; html: string; text: string };
export type Brand = { domain: string; offer?: string | undefined; postalAddress?: string | undefined };

const shell = (preheader: string, body: string, footer: string) => `<!doctype html><html lang="en"><body style="margin:0;background:#0A0A0B;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#F4F0E8">
<span style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px"><tr><td style="font-size:16px;line-height:1.6">${body}</td></tr>
<tr><td style="padding-top:28px;font-size:12px;line-height:1.5;color:#A8A29A">${footer}</td></tr></table></td></tr></table></body></html>`;

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:#8497B8;color:#0A0A0B;text-decoration:none;font-weight:600;padding:14px 26px;border-radius:999px">${escapeHtml(label)}</a></p>`;

export function confirmationEmail(v: { name: string; confirmUrl: string }, b: Brand): Rendered {
  const hi = escapeHtml(v.name);
  const postal = b.postalAddress ? ` ${escapeHtml(b.postalAddress)}` : "";
  return {
    subject: "Confirm your spot on the Stilldesk waitlist",
    html: shell("One click and you're on the list.",
      `<p>Hi ${hi},</p><p>Thanks for joining the Stilldesk waitlist. Please confirm it's really you:</p>${button(v.confirmUrl, "Confirm my email")}
<p>The link works for 7 days. If you didn't sign up, you can ignore this email and nothing will happen.</p>
<p>Stilldesk is a calm study app for Android that catches your plan in class, hands it back at your desk, and blocks distractions only while you study. We'll email you when it's ready.</p>
<p>Plan it. Sit down. Study.<br>The Stilldesk team</p>`,
      `You received this because someone entered this address on ${escapeHtml(b.domain)}.${postal}`),
    text: `Hi ${v.name},\n\nThanks for joining the Stilldesk waitlist. Please confirm it's really you:\n\n${v.confirmUrl}\n\nThe link works for 7 days. If you didn't sign up, you can ignore this email and nothing will happen.\n\nStilldesk is a calm study app for Android that catches your plan in class, hands it back at your desk, and blocks distractions only while you study. We'll email you when it's ready.\n\nPlan it. Sit down. Study.\nThe Stilldesk team\n\n--\nYou received this because someone entered this address on ${b.domain}.${b.postalAddress ? ` ${b.postalAddress}` : ""}\n`,
  };
}

export function welcomeEmail(v: { name: string; surveyUrl: string; unsubscribeUrl: string }, b: Brand): Rendered {
  const offer = b.offer ? `an early-bird offer (${escapeHtml(b.offer)})` : "an early-bird offer";
  const offerText = b.offer ? `an early-bird offer (${b.offer})` : "an early-bird offer";
  return {
    subject: "You're on the Stilldesk list",
    html: shell("Here's what happens next.",
      `<p>Hi ${escapeHtml(v.name)},</p><p>You're confirmed. Here's what to expect:</p>
<ul><li>A small group of students will try Stilldesk in a <strong>closed beta</strong> first.</li><li>Then it <strong>launches free on Google Play</strong>.</li><li>You'll get <strong>${offer}</strong> and a <strong>7-day Pro trial</strong> when it does.</li></ul>
<p>Want to help shape it? A one-minute survey tells us what to build first, and lets you say if you'd like to try the beta:</p>${button(v.surveyUrl, "Answer the short survey")}
<p>That's it. We won't flood your inbox.</p><p>The Stilldesk team</p>`,
      `You can <a href="${escapeHtml(v.unsubscribeUrl)}" style="color:#A8A29A">unsubscribe</a> any time.`),
    text: `Hi ${v.name},\n\nYou're confirmed. Here's what to expect:\n\n- A small group of students will try Stilldesk in a closed beta first.\n- Then it launches free on Google Play.\n- You'll get ${offerText} and a 7-day Pro trial when it does.\n\nWant to help shape it? A one-minute survey tells us what to build first, and lets you say if you'd like to try the beta:\n\n${v.surveyUrl}\n\nThat's it. We won't flood your inbox.\n\nThe Stilldesk team\n\n--\nUnsubscribe any time: ${v.unsubscribeUrl}\n`,
  };
}

/** Internal notification to the owner. Plain text only; the message is never logged. */
export function feedbackNotification(v: { message: string; contact: string | null }): Rendered {
  return {
    subject: "New Stilldesk feedback",
    html: `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(v.message)}</pre><p>Reply-to contact: ${escapeHtml(v.contact ?? "none given")}</p>`,
    text: `${v.message}\n\nReply-to contact: ${v.contact ?? "none given"}\n`,
  };
}
