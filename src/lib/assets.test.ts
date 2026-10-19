import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { credlyBadge } from "./content";

const publicDir = path.resolve(__dirname, "../../public");

// Static export serves these files as they are (images are unoptimized), so the files themselves must be small.
// Frames are 112 to 160 CSS px, so 400px covers a 2.5x screen.
const MAX_PX = 400;

function png(file: string) {
  const bytes = readFileSync(file);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), size: bytes.length };
}

describe("shipped images", () => {
  test("the Credly badge is served from this site, not hotlinked", () => {
    expect(credlyBadge.image).toBe("/badges/google-cloud-computing-foundations.png");
    expect(existsSync(path.join(publicDir, credlyBadge.image))).toBe(true);
  });

  test("the badge is sized for its frame and under 20 KB", () => {
    const { width, height, size } = png(path.join(publicDir, credlyBadge.image));
    expect(Math.max(width, height)).toBeLessThanOrEqual(MAX_PX);
    expect(size).toBeLessThan(20_000);
  });
});
