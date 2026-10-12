import { render } from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import Home from "./page";

const srcRoot = path.resolve(__dirname, "..");
const css = readFileSync(path.resolve(__dirname, "globals.css"), "utf8");

function token(name: string): number {
  const match = css.match(new RegExp(`--tracking-${name}:\\s*(-?[\\d.]+)em`));
  if (!match) throw new Error(`--tracking-${name} is not defined in globals.css`);
  return Number(match[1]);
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry) && !/\.test\./.test(entry) ? [full] : [];
  });
}

// Tailwind size tokens used by headings and titles, in px at their largest breakpoint.
const SIZES: Record<string, number> = {
  "text-lg": 18,
  "text-xl": 20,
  "text-2xl": 24,
  "text-3xl": 30,
  "text-4xl": 36,
  "text-5xl": 48,
  "text-6xl": 60,
  "text-7xl": 72,
  "text-[28px]": 28,
};

function largestSize(el: Element): number | null {
  const sizes = el.className
    .split(/\s+/)
    .map((c) => SIZES[c.replace(/^[a-z]+:/, "")])
    .filter((n): n is number => typeof n === "number");
  return sizes.length ? Math.max(...sizes) : null;
}

function roleFor(size: number) {
  if (size >= 60) return "display";
  if (size >= 48) return "heading";
  return "title";
}

describe("tracking ramp", () => {
  test("gets looser as type gets smaller: display < heading < title < 0", () => {
    expect(token("display")).toBeLessThan(token("heading"));
    expect(token("heading")).toBeLessThan(token("title"));
    expect(token("title")).toBeLessThan(0);
  });

  test("no component hard-codes letter-spacing inline", () => {
    const offenders = sourceFiles(srcRoot).filter((file) =>
      /letterSpacing/.test(readFileSync(file, "utf8"))
    );
    expect(offenders.map((f) => path.relative(srcRoot, f))).toEqual([]);
  });

  test("every semibold heading or title on the page uses the token for its size", () => {
    render(<Home />);
    const titled = [...document.querySelectorAll("[class*='font-semibold']")]
      .map((el) => ({ el, size: largestSize(el) }))
      .filter((x): x is { el: Element; size: number } => x.size !== null);
    // h1 + five h2s + award/certificate/education titles + five project cards + portrait monogram
    expect(titled.length).toBeGreaterThanOrEqual(12);
    for (const { el, size } of titled) {
      const role = roleFor(size);
      expect(
        el.className,
        `${el.tagName.toLowerCase()} "${el.textContent?.slice(0, 30)}" is ${size}px`
      ).toContain(`tracking-${role}`);
      expect(el.className).not.toContain("tracking-tight");
    }
  });
});
