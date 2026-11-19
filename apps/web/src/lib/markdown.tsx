import Link from "next/link";
import type { ReactNode } from "react";
import { Placeholder } from "@/components/ui/Placeholder";
import { isUnresolved, value } from "@/config/site.config";

/**
 * A tiny, dependency-free markdown renderer for our own documentation files
 * (headings, paragraphs, lists, tables, bold/italic, links, {{TOKENS}}). It only ever renders files we ship.
 */
const INLINE = /(\{\{[A-Z_]+\}\})|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|`([^`]+)`/g;
const TOKEN = /^\{\{([A-Z_]+)\}\}$/;

export function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0, n = 0, m: RegExpExecArray | null;
  const re = new RegExp(INLINE.source, "g"); // a fresh regex per call: nested calls must not reset our position
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1]) out.push(<Placeholder key={k} token={m[1].slice(2, -2)} />);
    else if (m[2]) {
      const href = m[3], t = href.match(TOKEN);
      if (t) out.push(isUnresolved(t[1]) ? <Placeholder key={k} token={t[1]} /> : <a key={k} href={value(t[1])}>{m[2]}</a>);
      else if (href.startsWith("/")) out.push(<Link key={k} href={href}>{m[2]}</Link>);
      else out.push(<a key={k} href={href} rel="noopener noreferrer">{m[2]}</a>);
    } else if (m[4]) out.push(<strong key={k}>{inline(m[4], k)}</strong>);
    else if (m[5]) out.push(<em key={k}>{inline(m[5], k)}</em>);
    else if (m[6]) out.push(<code key={k}>{m[6]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, startLevel = 2 }: { source: string; startLevel?: number }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0, k = 0;
  const heading = (lvl: number, text: string) => {
    const L = Math.min(6, Math.max(startLevel, lvl + startLevel - 2));
    const Tag = `h${L}` as "h2";
    blocks.push(<Tag key={k++}>{inline(text, `h${k}`)}</Tag>);
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { heading(h[1].length, h[2]); i++; continue; }
    if (/^---+$/.test(line.trim())) { i++; continue; }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|[\s:|-]+\|?$/.test(lines[i])) rows.push(lines[i].replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
        i++;
      }
      blocks.push(
        <div className="md-table" key={k++}><table>
          <thead><tr>{rows[0].map((c, j) => <th key={j} scope="col">{inline(c, `th${j}`)}</th>)}</tr></thead>
          <tbody>{rows.slice(1).map((r, a) => <tr key={a}>{r.map((c, b) => <td key={b}>{inline(c, `td${a}${b}`)}</td>)}</tr>)}</tbody>
        </table></div>,
      );
      continue;
    }
    const list = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (list) {
      const ordered = /\d/.test(list[2]), items: string[] = [];
      while (i < lines.length) {
        const mm = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        if (mm) { items.push(mm[3]); i++; }
        else if (/^\s+\S/.test(lines[i]) && items.length) { items[items.length - 1] += " " + lines[i].trim(); i++; }
        else break;
      }
      const L = items.map((t, j) => <li key={j}>{inline(t, `li${k}${j}`)}</li>);
      blocks.push(ordered ? <ol key={k++}>{L}</ol> : <ul key={k++}>{L}</ul>);
      continue;
    }
    if (line.startsWith(">")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
      blocks.push(<blockquote key={k++}>{inline(q.join(" "), `q${k}`)}</blockquote>);
      continue;
    }
    const p: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|---+$|\||>|\s*([-*]|\d+\.)\s)/.test(lines[i])) { p.push(lines[i].trim()); i++; }
    blocks.push(<p key={k++}>{inline(p.join(" "), `p${k}`)}</p>);
  }
  return <>{blocks}</>;
}

/** true if the markdown still contains an unresolved {{TOKEN}} */
export function hasUnresolvedTokens(source: string) {
  return (source.match(/\{\{([A-Z_]+)\}\}/g) ?? []).some((t) => isUnresolved(t.slice(2, -2)));
}
