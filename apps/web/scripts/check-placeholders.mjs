// Runs after `npm run build`. Looks for any leftover {{TOKEN}} in the built pages.
// By default it only WARNS (tokens are expected while we are building).
// Before launch run:  STRICT_PLACEHOLDERS=1 npm run build   -> it will FAIL if any token remains.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = ".next/server/app";
const found = new Map();
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|rsc)$/.test(f)) {
      const hits = readFileSync(p, "utf8").match(/\{\{[A-Z_]+\}\}/g);
      hits?.forEach((h) => found.set(h, (found.get(h) ?? new Set()).add(p)));
    }
  }
};
if (existsSync(root)) walk(root);
if (found.size) {
  console.warn("\n⚠  Placeholder tokens still in the built site:");
  for (const [t, files] of found) console.warn(`   ${t}  (${files.size} file${files.size > 1 ? "s" : ""})`);
  console.warn("   Fill them in src/config/site.config.ts before launch.\n");
  if (process.env.STRICT_PLACEHOLDERS) process.exit(1);
} else console.log("✓ No {{TOKEN}} placeholders left in the build.");
