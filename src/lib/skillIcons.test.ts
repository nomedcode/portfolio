import { describe, expect, test } from "vitest";
import { getSkillIcon } from "./skillIcons";

describe("skillIcons", () => {
  test("resolves the cloud banner tiles", () => {
    expect(getSkillIcon("googlecloud")?.hex).toBe("4285F4");
    expect(getSkillIcon("terraform")).toBeTruthy();
  });

  test("Google Cloud is the full-colour mark: four layers in the Google red, blue, green and yellow", () => {
    const layers = getSkillIcon("googlecloud")?.layers;
    expect(layers?.map((l) => l.fill)).toEqual([
      "#EA4335",
      "#4285F4",
      "#34A853",
      "#FBBC05",
    ]);
    for (const layer of layers ?? []) expect(layer.path.length).toBeGreaterThan(50);
  });

  test("resolves the layered marks: AWS, Azure, Vite, Kotlin, Python and Java, each drawn in its own colours", () => {
    for (const slug of ["aws", "azure", "vite", "kotlin", "python", "java"]) {
      const icon = getSkillIcon(slug);
      expect(icon, slug).toBeTruthy();
      expect(icon?.layers?.length, slug).toBeGreaterThan(0);
      expect(icon?.hex, slug).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });

  test("AWS is the two-tone mark: a wordmark with no fill of its own (so it takes the per-theme fill) and the orange smile", () => {
    const layers = getSkillIcon("aws")?.layers;
    expect(layers).toHaveLength(2);
    expect(layers?.[0].fill).toBeUndefined();
    expect(layers?.[1].fill).toBe("#FF9900");
    expect(getSkillIcon("aws")?.fillRule).toBe("evenodd");
  });

  test("Azure, Vite, Kotlin and Python paint their layers from named gradients; Java uses flat brand colours", () => {
    for (const slug of ["azure", "vite", "kotlin", "python"]) {
      const icon = getSkillIcon(slug);
      expect(icon?.gradients?.length, slug).toBeGreaterThan(0);
      const ids = new Set((icon?.gradients ?? []).map((g) => g.id));
      let gradientLayers = 0;
      for (const layer of icon?.layers ?? []) {
        const ref = layer.fill?.match(/^url\(#(.+)\)$/)?.[1];
        if (ref === undefined) {
          // a flat layer is fine, but it must be a real brand colour
          expect(layer.fill, `${slug} ${layer.fill}`).toMatch(/^#[0-9A-Fa-f]{6}$/);
          continue;
        }
        gradientLayers++;
        expect(ids.has(ref), `${slug} ${ref}`).toBe(true);
      }
      expect(gradientLayers, slug).toBeGreaterThan(0);
    }
    const java = getSkillIcon("java");
    expect(java?.gradients).toBeUndefined();
    expect(
      [...new Set((java?.layers ?? []).map((l) => l.fill))].sort()
    ).toEqual(["#0074BD", "#EA2D2E"]);
  });

  test("resolves the single-colour Kiro, Hermes Agent and Langflow marks", () => {
    for (const slug of ["kiro", "hermes", "langflow"]) {
      const icon = getSkillIcon(slug);
      expect(icon, slug).toBeTruthy();
      expect(icon?.path?.length, slug).toBeGreaterThan(100);
      expect(icon?.hex, slug).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });

  test("resolves the Simple Icons marks added for Laravel, the web languages, observability and data science", () => {
    for (const slug of [
      "laravel",
      "html5",
      "css",
      "sentry",
      "datadog",
      "digitalocean",
      "scikitlearn",
      "numpy",
      "pandas",
      "androidstudio",
      "modelcontextprotocol",
      "cisco",
    ]) {
      const icon = getSkillIcon(slug);
      expect(icon, slug).toBeTruthy();
      expect(icon?.path?.length, slug).toBeGreaterThan(100);
      expect(icon?.hex, slug).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });

  test("the marks that come from outside Simple Icons bring their own square view box", () => {
    for (const slug of ["java", "kiro", "aws", "azure", "vite", "kotlin", "python"]) {
      const box = getSkillIcon(slug)?.viewBox?.split(" ").map(Number) as number[];
      expect(box, slug).toHaveLength(4);
      expect(box[2], slug).toBe(box[3]);
      expect(box[2], slug).toBeGreaterThanOrEqual(24);
    }
    // the Kiro ghost has two eyes cut out of it
    expect(getSkillIcon("kiro")?.fillRule).toBe("evenodd");
    // the Hermes Agent mark is drawn on the same default grid, with its shapes merged into one even-odd path
    expect(getSkillIcon("hermes")?.fillRule).toBe("evenodd");
    expect(getSkillIcon("hermes")?.viewBox).toBeUndefined();
    // the Simple Icons marks keep the default 24 unit grid
    expect(getSkillIcon("langflow")?.viewBox).toBeUndefined();
  });

  test("no longer carries the icons of the skills that were removed", () => {
    for (const slug of [
      "go",
      "vuedotjs",
      "svelte",
      "astro",
      "expo",
      "express",
      "nestjs",
      "graphql",
      "trpc",
      "prisma",
      "langchain",
      "googlegemini",
      "v0",
      "netlify",
      "cloudflare",
      "anthropic",
      "newrelic",
      "termius",
      "githubcopilot",
      "claudecode",
      "codex",
      "cursor",
    ]) {
      expect(getSkillIcon(slug), slug).toBeUndefined();
    }
  });

  test("returns undefined for an unknown slug", () => {
    expect(getSkillIcon("not-a-real-icon")).toBeUndefined();
  });
});
