import type { Metadata } from "next";
import Link from "next/link";
import { EarlyBird } from "@/components/ui/EarlyBird";
import { isUnresolved, placeholders, value } from "@/config/site.config";

export const metadata: Metadata = { title: "You’re on the list", robots: { index: false, follow: false } };

// Copy: docs/05, section B.
export default function Thanks() {
  const mail = isUnresolved("SUPPORT_EMAIL") ? `[${placeholders.SUPPORT_EMAIL.label}]` : value("SUPPORT_EMAIL");
  return (
    <article className="legal thanks">
      <header className="legal-head">
        <div className="thanks-lamp" aria-hidden="true"><span /></div>
        <h1>You’re on the list.</h1>
        <p className="lead">Thanks for joining. One more step so we know it’s really you.</p>
      </header>
      <ol className="thanks-steps">
        <li><h2>Check your inbox.</h2><p>We just sent a confirmation email. Click the link inside. (Check spam or promotions if it doesn’t show up in a few minutes.)</p></li>
        <li><h2>Help shape Stilldesk (optional).</h2><p>After you confirm, you can answer a short survey. It takes about a minute.</p></li>
        <li><h2>We’ll email you at launch.</h2><p>You’ll get <EarlyBird /> and a 7-day Pro trial.</p></li>
      </ol>
      <p className="legal-date">Didn’t get it? Email {mail}.</p>
      <p><Link className="link" href="/">Back to the home page</Link></p>
    </article>
  );
}
