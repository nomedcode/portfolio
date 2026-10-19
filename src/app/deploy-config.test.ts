import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = path.resolve(__dirname, "../..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

describe("deploy configuration", () => {
  test("the security headers live in vercel.json, because static export cannot set them in next.config", () => {
    const vercel = JSON.parse(readFileSync(path.join(root, "vercel.json"), "utf8"));
    const all = vercel.headers.flatMap((h: { headers: { key: string; value: string }[] }) =>
      h.headers.map((x) => [x.key.toLowerCase(), x.value] as const)
    );
    const map = new Map(all);
    for (const key of [
      "content-security-policy",
      "strict-transport-security",
      "x-content-type-options",
      "referrer-policy",
      "permissions-policy",
      "x-frame-options",
    ]) {
      expect(map.has(key), `${key} is missing`).toBe(true);
    }
    expect(map.get("x-content-type-options")).toBe("nosniff");
    expect(map.get("x-frame-options")).toBe("DENY");
    expect(map.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
  });

  test("npm start serves the static export instead of calling next start", () => {
    expect(pkg.scripts.start).not.toContain("next start");
    expect(pkg.scripts.start).toContain("serve-static.mjs out");
  });

  test("the Node version is pinned for local and CI installs", () => {
    expect(pkg.engines?.node).toBeTruthy();
    expect(existsSync(path.join(root, ".nvmrc"))).toBe(true);
  });
});
