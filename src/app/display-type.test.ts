import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

// jsdom does not evaluate CSS, so this reads the source token; the browser check covers the computed size.
const css = readFileSync(path.resolve(__dirname, "globals.css"), "utf8");

function remToPx(value: string) {
  return Number(value.replace("rem", "")) * 16;
}

describe("display type scale", () => {
  test("the fluid display never shrinks below the fixed display size", () => {
    // Below 640px the h1 is text-display (2.75rem). From 640px it switches to the fluid token, whose floor has to
    // match: at 640px, 6vw is only 38.4px, so a smaller floor made the name shrink as the viewport grew.
    const fixed = css.match(/--text-display:\s*([\d.]+rem)/)?.[1];
    const fluid = css.match(
      /--text-display-fluid:\s*clamp\(\s*([\d.]+rem)\s*,/
    )?.[1];
    expect(fixed).toBeTruthy();
    expect(fluid).toBeTruthy();
    expect(remToPx(fluid!)).toBeGreaterThanOrEqual(remToPx(fixed!));
  });

  test("the fluid display stays above the section heading at its breakpoint", () => {
    // Section headings are md:text-5xl (3rem) from 768px. At 6vw the h1 computed to 46.08px there, so the page
    // name was smaller than the h2s until ~800px.
    const fluid = css.match(
      /--text-display-fluid:\s*clamp\(\s*[\d.]+rem\s*,\s*([\d.]+)vw\s*,\s*[\d.]+rem\s*\)/
    );
    expect(fluid).toBeTruthy();
    expect((768 * Number(fluid![1])) / 100).toBeGreaterThan(48);
  });
});
