import { Markdown, hasUnresolvedTokens } from "@/lib/markdown";
import { readContent } from "@/lib/content";

/** Renders a legal/plain-language page from the documentation copy, in the Stilldesk design. */
export function LegalPage({ file, title, intro }: { file: string; title: string; intro?: string }) {
  const raw = readContent(file);
  const body = raw.replace(/^# .*\n/, "").replace(/^\*{0,2}Last updated:?\*{0,2}.*\n/m, "");
  const updated = raw.match(/Last updated:?\*{0,2}\s*(.+)/)?.[1]?.replace(/\*+/g, "").trim();
  const draft = hasUnresolvedTokens(raw);
  return (
    <article className="legal">
      <header className="legal-head">
        <p className="eyebrow">Stilldesk</p>
        <h1>{title}</h1>
        {updated && <p className="legal-date">Last updated: {updated}</p>}
        {intro && <p className="lead">{intro}</p>}
      </header>
      {draft && (
        <p className="legal-draft" role="note">
          <strong>Draft.</strong> Some details, such as the company name and contact address, are still being finalised. They are shown in marked brackets. This page is not final until those are filled in and the text has been reviewed.
        </p>
      )}
      <div className="md"><Markdown source={body} startLevel={2} /></div>
    </article>
  );
}
