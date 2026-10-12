import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { cloudSkills, skillCategories } from "./content";
import { contrastRatio, FOREGROUND, iconFills, SURFACES } from "./iconColor";
import { getSkillIcon } from "./skillIcons";

const usedIcons = [
  ...new Set([
    ...cloudSkills.map((c) => c.id),
    ...skillCategories.flatMap((c) => c.skills.map((s) => s.icon)),
  ]),
]
  .map((slug) => ({ slug, icon: getSkillIcon(slug) }))
  .filter((x): x is { slug: string; icon: NonNullable<typeof x.icon> } =>
    Boolean(x.icon)
  );

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
    expect(usedIcons.length).toBeGreaterThanOrEqual(45);
  });

  test("every icon reaches 3:1 on both surfaces of both themes (a rim carries it where the fill cannot)", () => {
    const failures: string[] = [];
    for (const { slug, icon } of usedIcons) {
      const fills = iconFills(icon.hex);
      for (const theme of ["light", "dark"] as const) {
        const mark = theme === "light" && fills.rim ? fills.rim : fills[theme];
        for (const surface of SURFACES[theme]) {
          const ratio = contrastRatio(mark, surface);
          if (ratio < 3) failures.push(`${slug} ${theme} ${mark} on ${surface}: ${ratio.toFixed(2)}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  test("yellow keeps its colour on light and takes an ink rim, because a dark yellow is only olive or mustard", () => {
    for (const hex of ["F7DF1E", "FFD21E"]) {
      const brand = `#${hex.toLowerCase()}`;
      const fills = iconFills(hex);
      expect(fills.light, hex).toBe(brand);
      expect(fills.rim, hex).toBe(FOREGROUND.light);
      // the rim is what meets 3:1 against the surfaces, and it stands clear of the yellow it edges
      for (const surface of SURFACES.light) {
        expect(contrastRatio(fills.rim!, surface)).toBeGreaterThanOrEqual(3);
      }
      expect(contrastRatio(fills.rim!, brand)).toBeGreaterThanOrEqual(3);
      // yellow is already bright enough on dark, so no rim there
      expect(fills.dark).toBe(brand);
    }
  });

  test("only yellows are rimmed; every other brand is still fitted by lightness alone", () => {
    for (const { slug, icon } of usedIcons) {
      const h = hue(`#${icon.hex.toLowerCase()}`);
      const rimmed = iconFills(icon.hex).rim !== null;
      if (rimmed) expect(h, slug).toBeGreaterThanOrEqual(40);
      if (rimmed) expect(h, slug).toBeLessThanOrEqual(65);
    }
    expect(iconFills("61DAFB").rim).toBeNull();
    expect(iconFills("00ADD8").rim).toBeNull();
    expect(iconFills("000000").rim).toBeNull();
    // a yellow that already passes needs no rim
    expect(iconFills("806600").rim).toBeNull();
  });

  test("colours that already pass are the exact brand colour", () => {
    for (const { icon } of usedIcons) {
      const brand = `#${icon.hex.toLowerCase()}`;
      const fills = iconFills(icon.hex);
      for (const theme of ["light", "dark"] as const) {
        const passes = SURFACES[theme].every((s) => contrastRatio(brand, s) >= 3);
        if (passes) expect(fills[theme]).toBe(brand);
      }
    }
  });

  test("adjusted colours keep their hue (within 4 degrees) and only move one way", () => {
    for (const { slug, icon } of usedIcons) {
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
