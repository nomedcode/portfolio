import { describe, expect, test } from "vitest";
import { getSkillIcon } from "./skillIcons";

describe("skillIcons", () => {
  test("resolves the cloud banner tiles", () => {
    expect(getSkillIcon("googlecloud")?.hex).toBe("4285F4");
    expect(getSkillIcon("terraform")).toBeTruthy();
  });

  test("resolves the newly added Java, Kiro and Langflow marks", () => {
    for (const slug of ["java", "kiro", "langflow"]) {
      const icon = getSkillIcon(slug);
      expect(icon, slug).toBeTruthy();
      expect(icon?.path.length, slug).toBeGreaterThan(100);
      expect(icon?.hex, slug).toMatch(/^[0-9A-Fa-f]{6}$/);
    }
  });

  test("Java and Kiro come with their own square view box, because no installed icon set carries them", () => {
    for (const slug of ["java", "kiro"]) {
      const box = getSkillIcon(slug)?.viewBox?.split(" ").map(Number) as number[];
      expect(box, slug).toHaveLength(4);
      expect(box[2], slug).toBe(box[3]);
      expect(box[2], slug).toBeGreaterThan(24);
    }
    // the Kiro ghost has two eyes cut out of it
    expect(getSkillIcon("kiro")?.fillRule).toBe("evenodd");
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
    ]) {
      expect(getSkillIcon(slug), slug).toBeUndefined();
    }
  });

  test("returns undefined for an unknown slug", () => {
    expect(getSkillIcon("not-a-real-icon")).toBeUndefined();
  });
});
