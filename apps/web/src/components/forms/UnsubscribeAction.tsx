"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { failMessage, postJson } from "@/lib/api";
import { isUnresolved, value } from "@/config/site.config";

type State = { s: "working" } | { s: "done"; email: string } | { s: "error"; msg: string };

/** One click, no login, no survey (docs/05 E). It runs when the page opens (not on a GET), so mail scanners can't unsubscribe anyone. */
export function UnsubscribeAction({ token }: { token: string }) {
  const [st, setSt] = useState<State>({ s: "working" });
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    postJson<{ email?: string }>("/v1/waitlist/unsubscribe", { token }).then((r) =>
      setSt(r.ok ? { s: "done", email: r.email ?? "your address" } : { s: "error", msg: failMessage(r.kind) }));
  }, [token]);

  if (st.s === "working") return <div role="status"><h1>Unsubscribing…</h1><p className="lead">One moment.</p></div>;
  if (st.s === "error") return <div><h1>That didn’t work.</h1><p className="wl-form-err" role="alert">{st.msg} Please try the link in your email again.</p></div>;
  const del = isUnresolved("PRIVACY_EMAIL") ? null : `mailto:${value("PRIVACY_EMAIL")}?subject=${encodeURIComponent("Delete my Stilldesk waitlist data")}`;
  return (
    <div role="status">
      <h1>You’re unsubscribed.</h1>
      <p className="lead">We’ve removed {st.email} from Stilldesk emails. Sorry to see you go. If this was a mistake, you can <Link href="/#waitlist">join again</Link>.</p>
      {del && <p><a className="link" href={del}>Delete my data too</a></p>}
    </div>
  );
}
