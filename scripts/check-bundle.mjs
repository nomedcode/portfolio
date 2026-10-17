// Fails when the home route's first-load JS exceeds the budget. Run after `npm run build`.
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const BUDGET_BYTES = 740_000; // raw; measured 734,322 on 2026-10-13 (the devicon logos), raise on purpose only

// Next 16 no longer writes .next/diagnostics/route-bundle-stats.json, so the budget is measured from the
// export itself: every <script src> the browser would fetch for the first load, minus the nomodule fallback.
export function firstLoadScripts(html) {
  const tags = html.match(/<script\b[^>]*>/gi) ?? [];
  return tags
    .filter((tag) => !/\bnomodule\b/i.test(tag))
    .map((tag) => tag.match(/\bsrc="([^"]+)"/i)?.[1])
    .filter(Boolean);
}

export function firstLoadBytes(outDir) {
  const html = readFileSync(path.join(outDir, "index.html"), "utf8");
  return firstLoadScripts(html).reduce(
    (total, src) => total + statSync(path.join(outDir, src)).size,
    0
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let used;
  try {
    used = firstLoadBytes("out");
  } catch {
    console.error("No out/index.html. Run `npm run build` first.");
    process.exit(1);
  }
  console.log(`first-load JS for /: ${used} B (budget ${BUDGET_BYTES} B)`);
  if (used > BUDGET_BYTES) {
    console.error("Over budget.");
    process.exit(1);
  }
}
