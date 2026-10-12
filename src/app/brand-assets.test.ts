import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const app = __dirname;

function png(file: string) {
  const bytes = readFileSync(file);
  expect(bytes.subarray(1, 4).toString("latin1")).toBe("PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), size: bytes.length };
}

describe("brand assets in src/app", () => {
  test("favicon.ico is a small multi-size icon, not the 25 KB create-next-app scaffold", () => {
    const bytes = readFileSync(path.join(app, "favicon.ico"));
    expect([bytes.readUInt16LE(0), bytes.readUInt16LE(2)]).toEqual([0, 1]); // ICO header
    expect(bytes.readUInt16LE(4)).toBeGreaterThanOrEqual(3); // 16, 32 and 48 px
    expect(bytes.length).toBeLessThan(15_000);
  });

  test("icon.svg is a vector monogram", () => {
    const svg = readFileSync(path.join(app, "icon.svg"), "utf8");
    expect(svg).toContain("<svg");
    expect(svg).toContain("FP");
    expect(statSync(path.join(app, "icon.svg")).size).toBeLessThan(3_000);
  });

  test("apple-icon.png is the 180px touch icon", () => {
    const { width, height, size } = png(path.join(app, "apple-icon.png"));
    expect([width, height]).toEqual([180, 180]);
    expect(size).toBeLessThan(30_000);
  });

  test("opengraph-image.png is 1200x630, under 200 KB, with alt text", () => {
    const { width, height, size } = png(path.join(app, "opengraph-image.png"));
    expect([width, height]).toEqual([1200, 630]);
    expect(size).toBeLessThan(200_000);
    const alt = readFileSync(path.join(app, "opengraph-image.alt.txt"), "utf8").trim();
    expect(alt.length).toBeGreaterThan(20);
    expect(alt).toContain("Fa'iq");
  });

  test("there is no stale scaffold icon next to the new ones", () => {
    expect(existsSync(path.join(app, "icon.png"))).toBe(false);
  });
});
