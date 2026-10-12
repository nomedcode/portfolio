// Fails when the home route's first-load JS exceeds the budget. Run after `npm run build`.
import { readFileSync } from "node:fs";

const BUDGET_BYTES = 720_000; // raw; measured 678,522 on 2026-10-12, raise on purpose only
const stats = JSON.parse(
  readFileSync(".next/diagnostics/route-bundle-stats.json", "utf8")
);
const home = stats.find((r) => r.route === "/");
if (!home) throw new Error("no '/' route in route-bundle-stats.json");

const used = home.firstLoadUncompressedJsBytes;
console.log(`first-load JS for /: ${used} B (budget ${BUDGET_BYTES} B)`);
if (used > BUDGET_BYTES) {
  console.error("Over budget.");
  process.exit(1);
}
