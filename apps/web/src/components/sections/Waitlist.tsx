"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { useScrub } from "@/hooks/useScrub";
import { LampIcon } from "@/components/ui/LampIcon";
import { EarlyBird } from "@/components/ui/EarlyBird";
import { isUnresolved, value } from "@/config/site.config";
import { submitWaitlist, validate, waitlistFailMessage, type FieldErrors } from "@/lib/waitlist";

type Status = "idle" | "submitting" | "error";

// Copy: docs/03 section 15 and docs/05 section A. "Name (optional)" became "Name" because the owner wants it required.
export function Waitlist() {
  const sec = useRef<HTMLElement>(null);
  const router = useRouter();
  const sending = useRef(false); // hard lock: blocks a second submit in the same instant, before React re-renders
  useScrub(sec, { mode: "pass" }); // the lamp from the hero comes back and warms the form as you arrive
  const [f, setF] = useState({ name: "", email: "", consent: false, company_website: "" });
  const [errs, setErrs] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = (k: keyof typeof f, v: string | boolean) => {
    const next = { ...f, [k]: v } as typeof f;
    setF(next);
    if (touched[k] || status === "error") setErrs(validate(next));
  };
  const blur = (k: string) => { setTouched((t) => ({ ...t, [k]: true })); setErrs(validate(f)); };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate(f);
    setErrs(v); setTouched({ name: true, email: true, consent: true });
    if (Object.keys(v).length) {
      setStatus("idle"); setFormError(null);
      document.getElementById(Object.keys(v)[0] === "consent" ? "wl-consent" : `wl-${Object.keys(v)[0]}`)?.focus();
      return;
    }
    if (sending.current) return;
    sending.current = true;
    setStatus("submitting"); setFormError(null);
    try {
      const r = await submitWaitlist(f);
      if (r.ok) { router.push("/waitlist/thanks"); return; } // success only ever comes from a real server answer
      setStatus("error");
      if (r.kind === "validation") { setErrs(r.fields ?? {}); setFormError(null); }
      else setFormError(waitlistFailMessage(r.kind));
    } finally {
      sending.current = false;
    }
  };

  const form = !isUnresolved("GOOGLE_FORM_URL") ? value("GOOGLE_FORM_URL") : null;
  const busy = status === "submitting";

  return (
    <section className="wl" id="waitlist" ref={sec} aria-labelledby="wl-h">
      <div className="wl-glow" aria-hidden="true" />
      <div className="wl-grid">
        <div className="wl-copy">
          <div className="wl-lamp" aria-hidden="true"><LampIcon /></div>
          <p className="eyebrow">Launching soon on Android</p>
          <h2 id="wl-h" className="wl-h">Be first to sit down.</h2>
          <p className="lead">We’ll email you the day Stilldesk is ready, with <EarlyBird /> and a 7-day Pro trial. Under a minute. A few emails, never spam.</p>
          <ol className="wl-steps">
            <li><span>1</span><div><strong>Join.</strong> Your name and email.</div></li>
            <li><span>2</span><div><strong>Confirm.</strong> One email, one click.</div></li>
            <li><span>3</span><div><strong>Help out.</strong> Optional survey and beta.</div></li>
          </ol>
        </div>

        <form className="wl-card" onSubmit={onSubmit} noValidate aria-busy={busy}>
          <div className="wl-field">
            <label htmlFor="wl-name">Name</label>
            <input id="wl-name" name="name" autoComplete="name" maxLength={90} value={f.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")}
              aria-invalid={!!errs.name} aria-describedby={errs.name ? "wl-name-e" : undefined} disabled={busy} placeholder="Your name" />
            {errs.name && <p className="wl-err" id="wl-name-e" role="alert">{errs.name}</p>}
          </div>
          <div className="wl-field">
            <label htmlFor="wl-email">Email</label>
            <input id="wl-email" name="email" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")}
              aria-invalid={!!errs.email} aria-describedby={errs.email ? "wl-email-e" : undefined} disabled={busy} placeholder="you@college.edu" />
            {errs.email && <p className="wl-err" id="wl-email-e" role="alert">{errs.email}</p>}
          </div>
          {/* honeypot: hidden from people and screen readers; bots fill it, the server then saves nothing */}
          <div className="wl-hp" aria-hidden="true">
            <input name="company_website" tabIndex={-1} autoComplete="off" value={f.company_website} onChange={(e) => set("company_website", e.target.value)} />
          </div>
          <div className="wl-field check">
            <label className="wl-consent">
              <input id="wl-consent" type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} onBlur={() => blur("consent")}
                aria-invalid={!!errs.consent} aria-describedby={errs.consent ? "wl-consent-e" : undefined} disabled={busy} />
              <span className="box" aria-hidden="true" />
              <span>I agree to receive emails about Stilldesk’s launch, and I’ve read the <Link href="/privacy">Privacy Policy</Link>. I can unsubscribe at any time.</span>
            </label>
            {errs.consent && <p className="wl-err" id="wl-consent-e" role="alert">{errs.consent}</p>}
          </div>

          <button className="btn wl-btn" type="submit" disabled={busy}>
            <span className="sheen">{busy ? "Joining..." : "Join the waitlist"}</span>
          </button>
          <p className="wl-note">We use your email only for Stilldesk updates. No ads, no selling your data.</p>

          {formError && (
            <p className="wl-form-err" role="alert">
              {formError}{form && <> You can also <a href={form}>use this form</a>.</>}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
