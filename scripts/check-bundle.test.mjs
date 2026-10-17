import { describe, expect, test } from "vitest";
import { firstLoadScripts } from "./check-bundle.mjs";

const html = `
<script src="/_next/static/chunks/a.js" async=""></script>
<script src="/_next/static/chunks/b.js" async=""></script>
<script src="/_next/static/chunks/legacy.js" noModule=""></script>
`;

describe("check-bundle", () => {
  test("counts every first-load script and skips the nomodule legacy chunk", () => {
    // Modern browsers never fetch the noModule fallback, so it is not first-load JS.
    expect(firstLoadScripts(html)).toEqual([
      "/_next/static/chunks/a.js",
      "/_next/static/chunks/b.js",
    ]);
  });

  test("ignores scripts without a src", () => {
    expect(firstLoadScripts("<script>inline()</script>")).toEqual([]);
  });
});
