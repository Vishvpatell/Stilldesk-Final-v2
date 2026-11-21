"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { failMessage, postJson } from "@/lib/api";
import { QUESTIONS, cleanAnswers, type Answers } from "@/lib/survey";

type State = "idle" | "sending" | "sent" | "error";

export function SurveyForm({ token }: { token: string }) {
  const [a, setA] = useState<Answers>({}), [state, setState] = useState<State>("idle"), [err, setErr] = useState("");
  const lock = useRef(false);
  const toggle = (k: string, v: string) => setA((p) => { const cur = (p[k] as string[] | undefined) ?? []; return { ...p, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] }; });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (lock.current) return;
    lock.current = true; setState("sending"); setErr("");
    try {
      const r = await postJson("/v1/waitlist/survey", { token, answers: cleanAnswers(a) });
      if (r.ok) { setState("sent"); return; }
      setState("error"); setErr(failMessage(r.kind));
    } finally { lock.current = false; }
  };

  if (state === "sent") return <div className="wl-card done" role="status"><h2>Thank you.</h2><p>That genuinely helps. We’ll email you if you’re picked for the beta.</p><p><Link className="link" href="/">Back to the home page</Link></p></div>;
  const busy = state === "sending";
  return (
    <form className="wl-card survey" onSubmit={onSubmit} aria-busy={busy}>
      {QUESTIONS.filter((q) => !q.only || q.only(a)).map((q) => (
        <fieldset className="q" key={q.key} disabled={busy}>
          <legend>{q.label}</legend>
          {q.type === "text" ? (
            <>
              <label className="sr-only" htmlFor={`q-${q.key}`}>{q.label}</label>
              <textarea id={`q-${q.key}`} rows={3} maxLength={q.max} value={(a[q.key] as string) ?? ""} onChange={(e) => setA({ ...a, [q.key]: e.target.value })} />
            </>
          ) : (
            <div className="opts">
              {q.options?.map(([v, label]) => (
                <label className="opt" key={v}>
                  <input type={q.type === "multi" ? "checkbox" : "radio"} name={q.key} value={v}
                    checked={q.type === "multi" ? ((a[q.key] as string[] | undefined) ?? []).includes(v) : a[q.key] === v}
                    onChange={() => (q.type === "multi" ? toggle(q.key, v) : setA({ ...a, [q.key]: v }))} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      ))}
      <button className="btn wl-btn" type="submit" disabled={busy}><span className="sheen">{busy ? "Sending..." : "Send my answers"}</span></button>
      <p className="wl-note"><Link className="link" href="/">Skip for now</Link></p>
      {err && <p className="wl-form-err" role="alert">{err}</p>}
    </form>
  );
}
