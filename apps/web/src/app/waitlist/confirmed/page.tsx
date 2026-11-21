import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SupportEmail } from "@/components/ui/SupportEmail";

export const metadata: Metadata = { title: "Confirmed", robots: { index: false, follow: false }, alternates: {} };

// Copy: docs/05 section C. The API redirects here with ?status=ok|expired|invalid (and &survey=<token> on success).
export default async function Confirmed({ searchParams }: { searchParams: Promise<{ status?: string; survey?: string }> }) {
  const { status, survey } = await searchParams;
  if (status === "ok") {
    return (
      <article className="legal thanks">
        <header className="legal-head"><div className="thanks-lamp" aria-hidden="true"><span /></div><h1>Confirmed. You’re in.</h1>
          <p className="lead">Your spot on the Stilldesk waitlist is confirmed. We’ll be in touch as the beta and launch get closer.</p></header>
        <p>{survey && <ButtonLink href={`/waitlist/survey?token=${encodeURIComponent(survey)}`}>Answer a one-minute survey (optional)</ButtonLink>}{" "}
          <Link className="link" href="/" style={{ marginLeft: 18 }}>Maybe later</Link></p>
      </article>
    );
  }
  const expired = status === "expired";
  return (
    <article className="legal thanks">
      <header className="legal-head"><div className="thanks-lamp off" aria-hidden="true"><span /></div>
        <h1>{expired ? "That link has expired." : "That link doesn’t look right."}</h1>
        <p className="lead">{expired ? "No problem. Join again with the same email and we’ll send a fresh one." : <>Try the link in your email again, or contact <SupportEmail />.</>}</p></header>
      <p>{expired ? <ButtonLink href="/#waitlist">Back to the waitlist</ButtonLink> : <Link className="link" href="/">Back to the home page</Link>}</p>
    </article>
  );
}
