"use client";
import { useRef, useState, type FormEvent } from "react";
import { failMessage, postJson } from "@/lib/api";
import { isUnresolved, value } from "@/config/site.config";

type State = "idle" | "sending" | "sent" | "error";
const MAX = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Copy: docs/05 section F.
export function FeedbackForm() {
  const [message, setMessage] = useState(""), [contact, setContact] = useState(""), [hp, setHp] = useState("");
  const [errs, setErrs] = useState<{ message?: string; contact?: string }>({});
  const [state, setState] = useState<State>("idle"), [err, setErr] = useState("");
  const lock = useRef(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v: typeof errs = {};
    if (!message.trim()) v.message = "Please write a message first.";
    if (contact.trim() && !EMAIL.test(contact.trim())) v.contact = "That email doesn’t look quite right. Could you check it?";
    setErrs(v);
    if (v.message || v.contact) { document.getElementById(v.message ? "fb-message" : "fb-contact")?.focus(); return; }
    if (lock.current) return;
    lock.current = true; setState("sending"); setErr("");
    try {
      const r = await postJson("/v1/feedback", { message: message.trim(), contact: contact.trim(), company_website: hp });
      if (r.ok) { setState("sent"); return; } // success only after the server confirms it stored the message
      setState("error");
      const mail = isUnresolved("SUPPORT_EMAIL") ? "" : `, or email ${value("SUPPORT_EMAIL")}`;
      setErr(r.kind === "validation" ? "Please check your message and email, then try again." : `We couldn’t send that. ${failMessage(r.kind).replace(/\.$/, "")}${mail}.`);
    } finally { lock.current = false; }
  };

  if (state === "sent") {
    const promise = isUnresolved("FEEDBACK_REPLY_PROMISE") ? "" : value("FEEDBACK_REPLY_PROMISE");
    return <div className="wl-card done" role="status"><h2>Thank you.</h2><p>We read every message{promise}.</p></div>;
  }
  const busy = state === "sending";
  return (
    <form className="wl-card" onSubmit={onSubmit} noValidate aria-busy={busy}>
      <div className="wl-field">
        <label htmlFor="fb-message">Message</label>
        <textarea id="fb-message" rows={6} maxLength={MAX} value={message} onChange={(e) => setMessage(e.target.value)} disabled={busy}
          aria-invalid={!!errs.message} aria-describedby={`fb-help${errs.message ? " fb-message-e" : ""}`} />
        <p className="wl-help" id="fb-help">Please don’t include passwords or anyone else’s personal information. <span aria-hidden="true">{message.length}/{MAX}</span></p>
        {errs.message && <p className="wl-err" id="fb-message-e" role="alert">{errs.message}</p>}
      </div>
      <div className="wl-field">
        <label htmlFor="fb-contact">Your email, if you’d like a reply <span className="opt-tag">(optional)</span></label>
        <input id="fb-contact" type="email" inputMode="email" autoComplete="email" value={contact} onChange={(e) => setContact(e.target.value)} disabled={busy}
          aria-invalid={!!errs.contact} aria-describedby={errs.contact ? "fb-contact-e" : undefined} />
        {errs.contact && <p className="wl-err" id="fb-contact-e" role="alert">{errs.contact}</p>}
      </div>
      <div className="wl-hp" aria-hidden="true"><input tabIndex={-1} autoComplete="off" name="company_website" value={hp} onChange={(e) => setHp(e.target.value)} /></div>
      <button className="btn wl-btn" type="submit" disabled={busy}><span className="sheen">{busy ? "Sending..." : "Send feedback"}</span></button>
      {err && <p className="wl-form-err" role="alert">{err}</p>}
    </form>
  );
}
