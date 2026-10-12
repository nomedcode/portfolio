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

  test("the Skills card keeps the 100ms press and adds its own 200ms lift, instead of one rule overriding the other", () => {
    expect(css).toMatch(
      /\.press-lift\s*\{[^}]*transition:\s*transform\s+100ms[^;}]*,\s*translate\s+200ms/
    );
    expect(reducedBlock()).toMatch(/\.press-lift\s*\{[^}]*transition:\s*opacity\s+100ms/);
    // the lift class has to come after .press so it wins the tie
    expect(css.indexOf(".press-lift")).toBeGreaterThan(css.indexOf(".press {"));
  });

  test("a theme switch fades colours for a moment, and only when motion is allowed", () => {
    expect(css).toMatch(
      /\.theme-fade,\s*\.theme-fade \*[^{]*\{[^}]*transition:[^;}]*background-color\s+200ms[^;}]*color\s+200ms[^;}]*!important/
    );
    expect(reducedBlock()).toMatch(/\.theme-fade[^{]*\{[^}]*transition:\s*none\s*!important/);
  });

  test("the light glass header is opaque enough not to turn grey over the dark hero", () => {
    const alpha = Number(
      css.match(/\.material-light\s*\{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/)?.[1]
    );
    expect(alpha).toBeGreaterThanOrEqual(0.75);
  });});
