import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { Markdown } from "@/lib/markdown";
import { parseFaq } from "@/lib/content";
import { isUnresolved, placeholders, value } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Help and FAQ",
  description: "Answers about Stilldesk: how app blocking works, the AI brain-dump, the arrival prompt, privacy, the waitlist and more.",
  alternates: { canonical: "/faq" },
};

const plain = (md: string) =>
  md.replace(/\{\{([A-Z_]+)\}\}/g, (_, t) => (isUnresolved(t) ? `[${placeholders[t]?.label ?? t}]` : value(t)))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "").replace(/^\s*[-*]\s+/gm, "").trim();

export default function FaqPage() {
  const groups = parseFaq();
  const jsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items).map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: plain(i.a) } })),
  };
  return (
    <article className="legal faq-page">
      <header className="legal-head">
        <p className="eyebrow">Stilldesk</p>
        <h1>Help and FAQ</h1>
        <p className="legal-date">Last updated: November 15, 2026</p>
        <p className="lead">The questions we get asked most. If yours isn’t here, email <a href={isUnresolved("SUPPORT_EMAIL") ? undefined : `mailto:${value("SUPPORT_EMAIL")}`}>{isUnresolved("SUPPORT_EMAIL") ? `[${placeholders.SUPPORT_EMAIL.label}]` : value("SUPPORT_EMAIL")}</a>.</p>
      </header>
      {groups.map((g) => (
        <section key={g.title} className="faq-group">
          <h2>{g.title}</h2>
          <Accordion items={g.items.map((i) => ({ q: i.q, a: <Markdown source={i.a} startLevel={4} /> }))} />
        </section>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
