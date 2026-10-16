import { describe, expect, test } from "vitest";
import { getSkillIcon } from "./skillIcons";

// The skills devicon carries, drawn from its "original" artwork (MIT, github.com/devicons/devicon). AWS is the one
// wordmark, because devicon ships no square AWS glyph.
const devicon = [
  "typescript",
  "javascript",
  "python",
  "cplusplus",
  "java",
  "html5",
  "css",
  "aws",
  "googlecloud",
  "azure",
  "terraform",
  "docker",
  "kubernetes",
  "githubactions",
  "nginx",
  "react",
  "vite",
  "nextdotjs",
  "tailwindcss",
  "framer",
  "laravel",
  "nodedotjs",
  "kotlin",
  "jetpackcompose",
  "flutter",
  "androidstudio",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "supabase",
  "firebase",
  "tensorflow",
  "pytorch",
  "scikitlearn",
  "numpy",
  "pandas",
  "figma",
];

// devicon does not carry these, so they stay a Simple Icons mark or a hand-written one. Bun is the exception that
// proves the rule: devicon ships a full-colour Bun, but the line-art Simple Icons mark reads better at chip size.
const notOnDevicon = [
  "gsap",
  "langflow",
  "hermes",
  "kiro",
  "ollama",
  "modelcontextprotocol",
  "cisco",
  "bun",
];

// Marks drawn in one colour with no fixed fill, so BrandIcon paints them with the per-theme fill.
const themeFilled = ["aws", "framer"];

describe("skillIcons", () => {
  test("every devicon mark is layered and sits on the devicon 128 unit grid", () => {
    for (const slug of devicon) {
      const icon = getSkillIcon(slug);
      expect(icon, slug).toBeTruthy();
      expect(icon?.layers?.length, slug).toBeGreaterThan(0);
      expect(icon?.path, `${slug} should not also carry a single-colour path`).toBeUndefined();
      expect(icon?.viewBox, slug).toBe("0 0 128 128");
      expect(icon?.hex, slug).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
    expect(devicon).toHaveLength(38);
  });

  test("Google Cloud keeps devicon's four Google colours", () => {
    const layers = getSkillIcon("googlecloud")?.layers;
    expect(layers?.map((l) => l.fill)).toEqual([
      "#ea4535",
      "#557ebf",
      "#36a852",
      "#f9bc15",
    ]);
    for (const layer of layers ?? []) expect(layer.path.length).toBeGreaterThan(50);
  });

  test("AWS is devicon's wordmark: the wordmark takes the per-theme fill, the smile keeps the brand orange", () => {
    const icon = getSkillIcon("aws");
    const layers = icon?.layers;
    expect(layers).toHaveLength(2);
    expect(layers?.[0].fill).toBeUndefined();
    expect(layers?.[1].fill).toBe("#ff9900");
    // the wordmark is the only mark whose artwork carries no fill rule of its own
    expect(icon?.fillRule).toBeUndefined();
  });

  test("Docker is devicon's plain mark: one flat brand-blue path, not the shaded original", () => {
    const icon = getSkillIcon("docker");
    expect(icon?.layers).toHaveLength(1);
    expect(icon?.layers?.[0].fill).toBe("#019bc6");
    expect(icon?.hex).toBe("019BC6");
  });

  test("the gradient marks reference gradients they define, and each keeps its own colours", () => {
    for (const slug of [
      "azure",
      "vite",
      "kotlin",
      "python",
      "nextdotjs",
      "nodedotjs",
      "flutter",
      "supabase",
    ]) {
      const icon = getSkillIcon(slug);
      const ids = new Set((icon?.gradients ?? []).map((g) => g.id));
      expect(ids.size, slug).toBeGreaterThan(0);
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
    // Python's drop shadow is the one radial gradient
    const radial = getSkillIcon("python")?.gradients?.filter((g) => g.radial);
    expect(radial).toHaveLength(1);
    // Java has no gradients: Oracle's flat blue and red
    const java = getSkillIcon("java");
    expect(java?.gradients).toBeUndefined();
    expect([...new Set((java?.layers ?? []).map((l) => l.fill))].sort()).toEqual([
      "#0074bd",
      "#ea2d2e",
    ]);
  });

  test("only the monochrome marks drop their fill so the theme can invert them", () => {
    for (const slug of themeFilled) {
      const icon = getSkillIcon(slug);
      expect(icon?.layers?.some((l) => !l.fill), slug).toBe(true);
    }
    // a monochrome mark with a fixed fill would be invisible on one of the two surfaces
    for (const slug of devicon.filter((s) => !themeFilled.includes(s))) {
      expect(
        getSkillIcon(slug)?.layers?.every((l) => l.fill),
        `${slug} should keep every fill`
      ).toBe(true);
    }
  });

  test("the marks devicon does not carry stay single-path Simple Icons or hand-written", () => {
    for (const slug of notOnDevicon) {
      const icon = getSkillIcon(slug);
      expect(icon, slug).toBeTruthy();
      expect(icon?.path?.length, slug).toBeGreaterThan(100);
      expect(icon?.layers, slug).toBeUndefined();
      expect(icon?.hex, slug).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
    expect(notOnDevicon).toHaveLength(8);
    // the Kiro ghost has two eyes cut out of it; the Hermes mark is merged into one even-odd path on the 24 unit grid
    expect(getSkillIcon("kiro")?.fillRule).toBe("evenodd");
    expect(getSkillIcon("hermes")?.fillRule).toBe("evenodd");
    expect(getSkillIcon("hermes")?.viewBox).toBeUndefined();
    expect(getSkillIcon("kiro")?.viewBox).not.toBe("0 0 128 128");
  });

  test("Hugging Face is the uxwing full-colour mark, not the flat Simple Icons silhouette", () => {
    const icon = getSkillIcon("huggingface");
    expect(icon).toBeTruthy();
    expect(icon?.layers?.length).toBeGreaterThan(0);
    // its own non-square view box, so it is neither a Simple Icons mark nor a devicon one
    expect(icon?.viewBox).toBe("0 0 475 439");
    const fills = new Set((icon?.layers ?? []).map((l) => l.fill));
    expect(fills).toEqual(new Set(["#ffd21e", "#ff9d0b", "#3a3b45", "#ff323d"]));
  });

  test("GSAP is the solid wordmark, not the old line-drawn GreenSock mark", () => {
    const icon = getSkillIcon("gsap");
    expect(icon?.title).toBe("GSAP");
    expect(icon?.hex).toBe("0AE448");
    // the wordmark's outline; the retired GreenSock mark was a much longer, detailed line drawing
    expect(icon?.path?.length).toBeGreaterThan(100);
    expect(icon?.layers).toBeUndefined();
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
      "vercel",
      "digitalocean",
      "sentry",
      "datadog",
      "greensock",
    ]) {
      expect(getSkillIcon(slug), slug).toBeUndefined();
    }
  });

  test("returns undefined for an unknown slug", () => {
    expect(getSkillIcon("not-a-real-icon")).toBeUndefined();
  });
});
