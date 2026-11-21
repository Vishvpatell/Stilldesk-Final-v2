// Runs after `npm run build`. Finds unfinished placeholders in the BUILT pages.
// It looks for BOTH the visible marker (data-placeholder="TOKEN", rendered where a value is still undecided)
// and raw {{TOKEN}} text. Default: warns. Before launch run:  STRICT_PLACEHOLDERS=1 npm run build  -> exits 1 if any remain.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.env.PLACEHOLDER_SCAN_DIR ?? ".next/server/app";
const found = new Map();
const note = (token, file) => found.set(token, (found.get(token) ?? new Set()).add(file));

const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(html|rsc)$/.test(f)) continue;
    const text = readFileSync(p, "utf8");
    for (const m of text.matchAll(/data-placeholder="([A-Z_]+)"/g)) note(m[1], p);
    for (const m of text.matchAll(/\{\{([A-Z_]+)\}\}/g)) note(m[1], p);
  }
};

if (!existsSync(root)) {
  console.error(`check-placeholders: nothing to scan at ${root}. Run \`npm run build\` first.`);
  process.exit(process.env.STRICT_PLACEHOLDERS ? 1 : 0);
}
walk(root);

if (found.size) {
  console.warn("\n⚠  Unfinished placeholders in the built site:");
  for (const [t, files] of found) console.warn(`   ${t}  (${files.size} file${files.size > 1 ? "s" : ""})`);
  console.warn("   Fill them in src/config/site.config.ts before launch.\n");
  if (process.env.STRICT_PLACEHOLDERS) process.exit(1);
} else console.log("✓ No unfinished placeholders in the build.");
