import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = path.resolve(__dirname, "../..");
const design = readFileSync(path.join(root, "DESIGN.md"), "utf8");
const css = readFileSync(path.resolve(__dirname, "globals.css"), "utf8");

const frontmatter = design.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";

function block(name: string) {
  const match = frontmatter.match(new RegExp(`^${name}:\\r?\\n((?:[ \\t]+.*\\r?\\n?)*)`, "m"));
  return match?.[1] ?? "";
}

const colors = Object.fromEntries(
  [...block("colors").matchAll(/^\s+([\w-]+):\s*"(#[0-9a-fA-F]{6})"/gm)].map((m) => [
    m[1],
    m[2].toLowerCase(),
  ])
);

describe("DESIGN.md", () => {
  test("has frontmatter and the canonical sections in order", () => {
    expect(frontmatter).toContain("name:");
    const headings = [...design.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(headings).toEqual([
      "Overview",
      "Colors",
      "Typography",
      "Layout",
      "Elevation & Depth",
      "Shapes",
      "Components",
      "Do's and Don'ts",
    ]);
  });

  test("every colour token in globals.css is documented, with the same value", () => {
    const documented = new Set(Object.values(colors));
    const tokens = [...css.matchAll(/--(?:c|color)-[\w-]+:\s*(#[0-9a-fA-F]{6})/g)].map((m) =>
      m[1].toLowerCase()
    );
    expect(tokens.length).toBeGreaterThanOrEqual(15);
    const missing = tokens.filter((hex) => !documented.has(hex));
    expect(missing).toEqual([]);
  });

  test("the hero gradient stops are documented", () => {
    const content = readFileSync(path.resolve(root, "src/lib/content.ts"), "utf8");
    const stops = [
      ...(content.match(/heroBackground:\s*"([^"]+)"/)?.[1] ?? "").matchAll(/#[0-9a-fA-F]{6}/g),
    ].map((m) => m[0].toLowerCase());
    expect(stops.length).toBe(3);
    for (const stop of stops) expect(Object.values(colors)).toContain(stop);
  });

  test("component tokens only reference colours that exist", () => {
    const refs = [...frontmatter.matchAll(/\{colors\.([\w-]+)\}/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(5);
    for (const ref of refs) expect(colors, ref).toHaveProperty(ref);
  });

  test("the tracking scale and radii match the theme tokens", () => {
    for (const name of ["display", "heading", "title"]) {
      const value = css.match(new RegExp(`--tracking-${name}:\\s*(-[\\d.]+em)`))?.[1];
      expect(value, name).toBeTruthy();
      expect(frontmatter).toContain(`letterSpacing: "${value}"`);
    }
    const radii = block("rounded");
    expect(radii).toContain(`card: "${css.match(/--radius-card:\s*(\d+px)/)?.[1]}"`);
    expect(radii).toContain(`card-sm: "${css.match(/--radius-card-sm:\s*(\d+px)/)?.[1]}"`);
  });

  test("contains no email address or other contact detail", () => {
    expect(design).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  });
});
