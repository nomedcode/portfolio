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

  // Behaviour under test: the mobile menu's links enter in sequence, and stop moving under reduced motion.
  // Module: the animation rules in src/app/globals.css. Existing coverage: this file already covers .menu-in and
  // menu-fade; it does not cover a per-item stagger. User instruction, verbatim: "add stagger (or whatever its
  // called) animations for navbar header dropdown in mobile / responsive".
  test("the mobile menu links rise in one after the next, and hold still under reduced motion", () => {
    expect(css).toMatch(/@keyframes menu-item-in\b/);
    expect(css).toMatch(
      /\.menu-in \.menu-item\s*\{[^}]*animation:[^;}]*menu-item-in[^}]*animation-delay:\s*calc\([^)]*var\(--i/
    );
    // Under reduced motion the panel keeps its fade and the links do not move at all.
    expect(reducedBlock()).toMatch(/\.menu-item\s*\{[^}]*animation:\s*none/);
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
      css.match(/\.glass-header\s*\{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/)?.[1]
    );
    expect(alpha).toBeGreaterThanOrEqual(0.75);
  });

  test("the glass header draws its hairline on the edge that meets content", () => {
    for (const rule of css.matchAll(/\.glass-header\s*\{([^}]*backdrop-filter:\s*blur[^}]*)\}/g)) {
      expect(rule[1]).not.toMatch(/border-top:\s*[^0]/);
      expect(rule[1]).toMatch(/border-bottom:\s*1px solid/);
    }
  });});
