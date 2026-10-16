import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { skillCategories } from "./content";
import { contrastRatio, FOREGROUND, iconFills, isYellow, SURFACES } from "./iconColor";
import { getSkillIcon } from "./skillIcons";

const usedIcons = [
  ...new Set(skillCategories.flatMap((c) => c.skills.map((s) => s.icon))),
]
  .map((slug) => ({ slug, icon: getSkillIcon(slug) }))
  .filter((x): x is { slug: string; icon: NonNullable<typeof x.icon> } =>
    Boolean(x.icon)
  );

// BrandIcon paints the per-theme fill only for marks that have no colour of their own: the single-colour Simple Icons
// and hand-written marks, plus the monochrome devicon marks (AWS, Vercel, Motion) whose artwork carries no fill.
// Every other mark is a devicon "original" that brings its own brand colours, which iconFills never touches.
const fittedIcons = usedIcons.filter(
  ({ icon }) => !icon.layers || icon.layers.some((l) => !l.fill)
);
const fixedColourIcons = usedIcons.filter(
  ({ icon }) => icon.layers && icon.layers.every((l) => l.fill)
);

// Every colour a fixed-colour mark can paint: the flat layer fills and the gradient stops.
function markColours(icon: (typeof usedIcons)[number]["icon"]): string[] {
  return [
    ...new Set([
      ...(icon.layers ?? []).map((l) => l.fill),
      ...(icon.gradients ?? []).flatMap((g) => g.stops.map((s) => s.color)),
    ]),
  ].filter((f): f is string => typeof f === "string" && /^#[0-9a-f]{6}$/.test(f));
}

// The best contrast the mark reaches on a theme: its most legible colour.
function bestContrast(
  icon: (typeof usedIcons)[number]["icon"],
  surfaces: readonly string[]
): number {
  const colours = markColours(icon);
  if (!colours.length) return Infinity;
  return Math.max(...colours.map((c) => Math.min(...surfaces.map((s) => contrastRatio(c, s)))));
}

function hue(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return null;
  const d = max - min;
  const h =
    max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

function saturated(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(r, g, b) - Math.min(r, g, b) > 40;
}

describe("contrastRatio", () => {
  test("matches the WCAG reference points", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777777", "#777777")).toBeCloseTo(1, 5);
    expect(contrastRatio("#767676", "#ffffff")).toBeGreaterThan(4.5);
  });
});

describe("iconFills", () => {
  test("covers every icon the page uses (sanity check on the fixture)", () => {
    // Every slug the content lists now resolves to a brand mark in getSkillIcon, AWS included.
    const slugs = [
      ...new Set(skillCategories.flatMap((c) => c.skills.map((s) => s.icon))),
    ];
    expect(usedIcons.map((x) => x.slug).sort()).toEqual(slugs.sort());
    expect(usedIcons.length).toBeGreaterThanOrEqual(30);
  });

  test("every theme-fitted icon reaches 3:1 on both surfaces of both themes, except yellow on light (see below)", () => {
    const failures: string[] = [];
    for (const { slug, icon } of fittedIcons) {
      const fills = iconFills(icon.hex);
      for (const theme of ["light", "dark"] as const) {
        if (theme === "light" && isYellow(`#${icon.hex.toLowerCase()}`)) continue;
        for (const surface of SURFACES[theme]) {
          const ratio = contrastRatio(fills[theme], surface);
          if (ratio < 3) failures.push(`${slug} ${theme} ${fills[theme]} on ${surface}: ${ratio.toFixed(2)}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  test("yellow is the one exception: it keeps its exact brand colour on light, because a dark yellow is only olive or mustard", () => {
    for (const hex of ["F7DF1E", "FFD21E"]) {
      const brand = `#${hex.toLowerCase()}`;
      expect(isYellow(brand), hex).toBe(true);
      expect(iconFills(hex), hex).toEqual({ light: brand, dark: brand });
    }
  });

  test("only yellows are exempt; every other theme-fitted brand is still fitted to 3:1 by lightness alone", () => {
    for (const { slug, icon } of fittedIcons) {
      const brand = `#${icon.hex.toLowerCase()}`;
      if (!isYellow(brand)) {
        // a non-yellow that fails on light is moved, never left below 3:1
        const light = iconFills(icon.hex).light;
        for (const surface of SURFACES.light) {
          expect(contrastRatio(light, surface), slug).toBeGreaterThanOrEqual(3);
        }
      }
    }
    // the neighbours of yellow are still fitted
    expect(iconFills("61DAFB").light).not.toBe("#61dafb"); // React cyan
    expect(iconFills("FF6F00").light).not.toBe("#ff6f00"); // TensorFlow orange
    expect(isYellow("#ff6f00")).toBe(false);
    // black and slate are not yellow
    expect(isYellow("#000000")).toBe(false);
  });

  test("colours that already pass are the exact brand colour", () => {
    for (const { icon } of fittedIcons) {
      const brand = `#${icon.hex.toLowerCase()}`;
      const fills = iconFills(icon.hex);
      for (const theme of ["light", "dark"] as const) {
        const passes = SURFACES[theme].every((s) => contrastRatio(brand, s) >= 3);
        if (passes) expect(fills[theme]).toBe(brand);
      }
    }
  });

  test("adjusted colours keep their hue (within 4 degrees) and only move one way", () => {
    for (const { slug, icon } of fittedIcons) {
      const brand = `#${icon.hex.toLowerCase()}`;
      const fills = iconFills(icon.hex);
      const lum = (hex: string) => contrastRatio(hex, "#000000");
      if (saturated(brand)) {
        for (const theme of ["light", "dark"] as const) {
          const h0 = hue(brand)!;
          const h1 = hue(fills[theme]);
          if (fills[theme] !== brand) {
            const diff = Math.abs(((h1 ?? 999) - h0 + 540) % 360 - 180);
            expect(diff, `${slug} ${theme}`).toBeLessThanOrEqual(4);
          }
        }
      }
      // light theme only darkens, dark theme only lightens
      expect(lum(fills.light), slug).toBeLessThanOrEqual(lum(brand) + 1e-9);
      expect(lum(fills.dark), slug).toBeGreaterThanOrEqual(lum(brand) - 1e-9);
    }
  });

  test("black and slate logos flip to the theme text colour in dark, like the invert they replace", () => {
    for (const hex of ["000000", "2D3748"]) {
      expect(iconFills(hex).dark, hex).toBe(FOREGROUND.dark);
    }
    // black already passes on light, so it stays exactly black there
    expect(iconFills("000000").light).toBe("#000000");
  });

  test("the known offenders are fixed: Prisma and C++ on dark, React on light", () => {
    const prisma = iconFills("2D3748");
    expect(contrastRatio(prisma.dark, "#1f1f20")).toBeGreaterThanOrEqual(3);
    const cpp = iconFills("00599C");
    expect(contrastRatio(cpp.dark, "#1f1f20")).toBeGreaterThanOrEqual(3);
    const react = iconFills("61DAFB");
    expect(contrastRatio(react.light, "#f5f5f7")).toBeGreaterThanOrEqual(3);
  });

  test("the devicon originals keep their brand colours, and the few under 3:1 are named here, not hidden", () => {
    // A deliberate tradeoff: devicon's "original" artwork is used verbatim, so it is never run through the 3:1 fit.
    // Only ten marks are theme-fitted (the seven devicon does not carry, the line-art Bun, plus the monochrome AWS
    // and Motion); the rest carry fixed colours. These are the only ones under 3:1 on a surface. Logos are
    // WCAG-exempt (1.4.3 and 1.4.11 exclude logotypes), the banner cloud is aria-hidden, and each popup chip names
    // its skill.
    expect(fittedIcons).toHaveLength(10);
    expect(fixedColourIcons).toHaveLength(usedIcons.length - 10);
    const under = (surfaces: readonly string[]) =>
      fixedColourIcons
        .filter(({ icon }) => bestContrast(icon, surfaces) < 3)
        .map((x) => x.slug)
        .sort();
    expect(under(SURFACES.light)).toEqual([
      "docker",
      "react",
      "tailwindcss",
      "tensorflow",
    ]);
    expect(under(SURFACES.dark)).toEqual(["mysql", "terraform"]);
  });
});

describe("surfaces", () => {
  test("match the page and raised tokens in globals.css, so the check cannot drift", () => {
    const css = readFileSync(
      path.resolve(__dirname, "../app/globals.css"),
      "utf8"
    );
    const block = (selector: RegExp) => css.match(selector)?.[1] ?? "";
    const light = block(/:root\s*\{([\s\S]*?)\}/);
    const dark = block(/\n\.dark\s*\{([\s\S]*?)\}/);
    const token = (b: string, name: string) =>
      b.match(new RegExp(`--c-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1].toLowerCase();
    expect([...SURFACES.light]).toEqual([token(light, "page"), token(light, "raised")]);
    expect([...SURFACES.dark]).toEqual([token(dark, "page"), token(dark, "raised")]);
    expect(FOREGROUND).toEqual({ light: token(light, "fg"), dark: token(dark, "fg") });
  });
});
