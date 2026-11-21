"use client";
import { useEffect } from "react";
import Link from "next/link";

/** Shown if something breaks while rendering a page. The visitor is never left on a blank screen. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* monitoring hook: see src/lib/monitoring.ts (disabled until a provider is approved) */ void import("@/lib/monitoring").then((m) => m.reportError(error)); }, [error]);
  return (
    <article className="legal thanks">
      <header className="legal-head">
        <div className="thanks-lamp off" aria-hidden="true"><span /></div>
        <h1>Something went wrong.</h1>
        <p className="lead">That wasn’t supposed to happen. Try again, or head back to the home page.</p>
      </header>
      <p><button className="btn" onClick={reset}>Try again</button> <Link className="link" href="/" style={{ marginLeft: 18 }}>Go to the home page</Link></p>
    </article>
  );
}
