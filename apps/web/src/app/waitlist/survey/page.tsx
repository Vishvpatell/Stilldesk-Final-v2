import type { Metadata } from "next";
import Link from "next/link";
import { SurveyForm } from "@/components/forms/SurveyForm";

export const metadata: Metadata = { title: "A one-minute survey", robots: { index: false, follow: false }, alternates: {} };

export default async function Survey({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <article className="legal fp">
      <header className="legal-head">
        <p className="eyebrow">Stilldesk</p>
        <h1>Help us build the right thing.</h1>
        <p className="lead">Every question is optional.</p>
      </header>
      {token ? <SurveyForm token={token} /> : <p className="wl-form-err" role="alert">That link doesn’t look right. Try the link in your email again. <Link href="/">Home</Link></p>}
    </article>
  );
}
