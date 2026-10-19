import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

// jsdom does not evaluate CSS, so these read the source rules; the real-browser check covers the computed result.
const css = readFileSync(path.resolve(__dirname, "globals.css"), "utf8");
const layout = readFileSync(path.resolve(__dirname, "layout.tsx"), "utf8");

describe("platform CSS", () => {
  test("tappable elements drop the 300ms double-tap zoom delay", () => {
    expect(css).toMatch(
      /a,\s*\n\s*button\s*\{[^}]*touch-action:\s*manipulation/
    );
  });

  test("a horizontal swipe on the project gallery does not chain to the page behind it", () => {
    // overflow-x: auto alone lets the swipe bubble to the page once the gallery hits its end, which on iOS
    // reads as a back-navigation gesture.
    expect(css).toMatch(/\.gallery-scroll\s*\{[^}]*overscroll-behavior-x:\s*contain/);
    // the vertical axis stays reachable: the gallery never scrolls vertically
    expect(css).not.toMatch(/\.gallery-scroll\s*\{[^}]*overscroll-behavior:\s*contain[^-]/);
  });

  test("page gutters and the fixed header clear a notch in landscape", () => {
    // The insets are zero unless the viewport opts into the full screen, so both halves of the fix are asserted.
    expect(css).toMatch(
      /body\s*\{[^}]*padding-inline:\s*env\(safe-area-inset-left\)[^;}]*env\(safe-area-inset-right\)/
    );
    expect(css).toMatch(
      /\.glass-header\s*\{[^}]*padding-inline:\s*env\(safe-area-inset-left\)[^;}]*env\(safe-area-inset-right\)/
    );
    expect(layout).toMatch(/viewportFit:\s*"cover"/);
    // One owner for the chrome colour: a media-query pair alongside the script's tag would emit two.
    expect(layout).not.toMatch(/themeColor\s*:/);
  });
});
