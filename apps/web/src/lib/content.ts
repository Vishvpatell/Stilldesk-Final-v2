import { readFileSync } from "node:fs";
import path from "node:path";

/** Reads one of the documentation copies in apps/web/content (copies of the originals; never edited here). */
export const readContent = (file: string) => readFileSync(path.join(process.cwd(), "content", file), "utf8");

export type FaqItem = { q: string; a: string; home: boolean };
export type FaqGroup = { title: string; items: FaqItem[] };

/** Parses docs/04: "## Group", "**Question?** (HOME)" then answer lines. */
export function parseFaq(): FaqGroup[] {
  const lines = readContent("04-faq-page-copy.md").split("\n");
  const groups: FaqGroup[] = [];
  let g: FaqGroup | null = null, cur: FaqItem | null = null;
  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = line.match(/^## (.+)$/);
    if (h) { g = { title: h[1], items: [] }; groups.push(g); cur = null; continue; }
    if (!g) continue;
    const q = line.match(/^\*\*(.+?)\*\*(?:\s*\((HOME[^)]*)\))?$/);
    if (q) { cur = { q: q[1], a: "", home: !!q[2] && q[2] === "HOME" }; g.items.push(cur); continue; }
    if (line === "---") { cur = null; continue; }
    if (cur) cur.a += line + "\n";
  }
  return groups.filter((x) => x.items.length);
}

export const FAQ_HOME_ORDER = [
  "Is this just another Pomodoro timer?", "Will it lock my phone?", "When does Stilldesk launch?", "Which phones does it work on?",
  "Is Stilldesk free?", "Does the AI read my phone?", "Do I have to share my location?", "Can I end a session whenever I want?",
];
