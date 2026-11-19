import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <article className="legal thanks nf">
      <header className="legal-head">
        <div className="thanks-lamp off" aria-hidden="true"><span /></div>
        <h1>This page isn’t here.</h1>
        <p className="lead">The lamp is off in this room. Let’s go back to the desk.</p>
      </header>
      <p><ButtonLink href="/">Back to the home page</ButtonLink> <Link className="link" href="/#loop" style={{ marginLeft: 18 }}>See how it works</Link></p>
    </article>
  );
}
