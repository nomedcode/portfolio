import { describe, expect, test } from "vitest";
import { getSkillIcon } from "./skillIcons";

describe("skillIcons", () => {
  test("resolves the cloud banner tiles", () => {
    expect(getSkillIcon("googlecloud")?.hex).toBe("4285F4");
    expect(getSkillIcon("terraform")).toBeTruthy();
  });

  test("returns undefined for an unknown slug", () => {
    expect(getSkillIcon("not-a-real-icon")).toBeUndefined();
  });
});
