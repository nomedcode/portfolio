import { describe, expect, test } from "vitest";
import { profile } from "./content";
import { siteMetadata, siteUrl } from "./siteMetadata";

describe("siteMetadata", () => {
  test("resolves relative URLs against the production domain", () => {
    expect(siteUrl).toBe("https://faiq.codes");
    expect(String(siteMetadata.metadataBase)).toBe("https://faiq.codes/");
    expect(siteMetadata.alternates?.canonical).toBe("/");
  });

  test("has a title and a description short enough for search results", () => {
    expect(String(siteMetadata.title)).toContain(profile.fullName);
    expect(String(siteMetadata.description).length).toBeGreaterThan(40);
    expect(String(siteMetadata.description).length).toBeLessThanOrEqual(160);
  });

  test("describes the page for Open Graph with the same title and description", () => {
    const og = siteMetadata.openGraph as Record<string, unknown>;
    expect(og.type).toBe("website");
    expect(og.url).toBe("/");
    expect(og.title).toBe(siteMetadata.title);
    expect(og.description).toBe(siteMetadata.description);
    expect(og.siteName).toBeTruthy();
  });

  test("asks Twitter/X for a large summary card", () => {
    const tw = siteMetadata.twitter as Record<string, unknown>;
    expect(tw.card).toBe("summary_large_image");
    expect(tw.title).toBe(siteMetadata.title);
    expect(tw.description).toBe(siteMetadata.description);
  });
});
