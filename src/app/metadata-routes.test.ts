import { describe, expect, test } from "vitest";
import { siteUrl } from "@/lib/siteMetadata";
import robots from "./robots";
import sitemap from "./sitemap";

describe("metadata routes", () => {
  test("robots.txt allows the whole site and points at the sitemap", () => {
    const out = robots();
    expect(out.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(out.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(out.host).toBe(siteUrl);
  });

  test("sitemap.xml lists the one page at the canonical host", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe(`${siteUrl}/`);
    expect(entries[0].changeFrequency).toBe("monthly");
    expect(entries[0].priority).toBe(1);
  });
});
