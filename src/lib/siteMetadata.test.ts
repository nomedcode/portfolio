import { describe, expect, test } from "vitest";
import { profile } from "./content";
import { siteMetadata, siteUrl } from "./siteMetadata";

describe("siteMetadata", () => {
  test("resolves relative URLs against the production domain", () => {
    // The apex 308-redirects to www, so canonical and og:url must name the host that actually serves 200.
    expect(siteUrl).toBe("https://www.faiq.codes");
    expect(String(siteMetadata.metadataBase)).toBe("https://www.faiq.codes/");
    expect(siteMetadata.alternates?.canonical).toBe("/");
  });

  test("has a title and a description short enough for search results", () => {
    expect(String(siteMetadata.title)).toContain(profile.fullName);
    expect(String(siteMetadata.description).length).toBeGreaterThan(40);
    expect(String(siteMetadata.description).length).toBeLessThanOrEqual(160);
  });

  test("the title names the role, not just the word portfolio", () => {
    const title = String(siteMetadata.title);
    expect(title).toContain("Cloud");
    expect(title.length).toBeLessThanOrEqual(60);
  });

  test("the description says what he does, where, and with which credential", () => {
    const description = String(siteMetadata.description);
    expect(description).toContain("BINUS");
    expect(description).toContain("Bandung");
    expect(description).toContain("Google Cloud");
  });

  test("the site name is the name, not the page title", () => {
    const og = siteMetadata.openGraph as Record<string, unknown>;
    expect(og.siteName).toBe(profile.fullName);
  });

  test("asks crawlers for large image previews and full snippets", () => {
    const robots = siteMetadata.robots as Record<string, unknown>;
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
    expect(robots.googleBot).toMatchObject({
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    });
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
