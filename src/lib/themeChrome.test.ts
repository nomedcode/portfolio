import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { THEME_COLOR, applyThemeColor, themeColorScript } from "./themeChrome";

// The chrome colour is a tag the theme scripts own, so these drive the real DOM rather than the viewport export.
const css = readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");

function meta() {
  return document.head.querySelector('meta[name="theme-color"]');
}

afterEach(() => {
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
  document.documentElement.classList.remove("dark");
});

describe("theme chrome colour", () => {
  test("is the page surface in each theme, so the browser bar cannot drift from the page", () => {
    const page = (block: RegExp) =>
      css.match(block)?.[1]?.match(/--c-page:\s*(#[0-9a-fA-F]{6})/)?.[1];
    expect(page(/:root\s*\{([^}]*)\}/)).toBe(THEME_COLOR.light);
    expect(page(/\n\.dark\s*\{([^}]*)\}/)).toBe(THEME_COLOR.dark);
  });

  test("creates the tag when the document has none yet", () => {
    applyThemeColor(document.documentElement);
    expect(meta()).not.toBeNull();
    expect(meta()).toHaveAttribute("content", THEME_COLOR.light);
  });

  test("repaints to the dark surface once the dark class is on", () => {
    applyThemeColor(document.documentElement);
    document.documentElement.classList.add("dark");
    applyThemeColor(document.documentElement);
    expect(meta()).toHaveAttribute("content", THEME_COLOR.dark);
    // one tag, not one per switch
    expect(document.head.querySelectorAll('meta[name="theme-color"]')).toHaveLength(1);
  });

  test("the pre-paint script follows a stored dark choice, with no tag in the document", () => {
    document.documentElement.classList.add("dark");
    new Function(themeColorScript)();
    expect(meta()).toHaveAttribute("content", THEME_COLOR.dark);
  });

  test("the pre-paint script rewrites an existing tag rather than adding a second", () => {
    const existing = document.createElement("meta");
    existing.setAttribute("name", "theme-color");
    existing.setAttribute("content", THEME_COLOR.dark);
    document.head.appendChild(existing);
    new Function(themeColorScript)();
    expect(document.head.querySelectorAll('meta[name="theme-color"]')).toHaveLength(1);
    expect(meta()).toHaveAttribute("content", THEME_COLOR.light);
  });
});
