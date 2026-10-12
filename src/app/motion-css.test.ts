import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

// jsdom does not evaluate CSS, so these read the source rules; the real-browser check covers the computed result.
const css = readFileSync(path.resolve(__dirname, "globals.css"), "utf8");

function reducedBlock() {
  const match = css.match(
    /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/
  );
  return match?.[1] ?? "";
}

describe("reduced-motion CSS", () => {
  test("pressed feedback becomes a quick opacity dip instead of disappearing", () => {
    const block = reducedBlock();
    expect(block).toMatch(/\.press\s*\{[^}]*transition:\s*opacity\s+100ms/);
    expect(block).toMatch(
      /\.press:active\s*\{[^}]*transform:\s*none[^}]*opacity:\s*0?\.7/
    );
  });

  test("the mobile menu swaps its slide for a plain fade", () => {
    expect(css).toMatch(/@keyframes menu-in\b/);
    expect(css).toMatch(/\.menu-in\s*\{[^}]*animation:[^;}]*menu-in/);
    expect(css).toMatch(/@keyframes menu-fade\b/);
    expect(reducedBlock()).toMatch(
      /\.menu-in\s*\{[^}]*animation-name:\s*menu-fade/
    );
  });
});
