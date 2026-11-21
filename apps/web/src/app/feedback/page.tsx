import type { Metadata } from "next";
import { FeedbackForm } from "@/components/forms/FeedbackForm";

export const metadata: Metadata = {
  title: "Send feedback",
  description: "Tell the Stilldesk team what you think: ideas, bugs, or worries about the plan. A real person reads every message.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return (
    <article className="legal fp">
      <header className="legal-head">
        <p className="eyebrow">Stilldesk</p>
        <h1>Tell us what you think.</h1>
        <p className="lead">A real person reads every message. Ideas, bugs, worries about the plan, all welcome.</p>
      </header>
      <FeedbackForm />
    </article>
  );
}
