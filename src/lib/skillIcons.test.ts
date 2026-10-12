import { describe, expect, test } from "vitest";
import { getSkillIcon, isDarkBrandColor } from "./skillIcons";

describe("skillIcons", () => {
  test("resolves the cloud banner tiles", () => {
    expect(getSkillIcon("googlecloud")?.hex).toBe("4285F4");
    expect(getSkillIcon("terraform")).toBeTruthy();
  });

  test("only near-black brand logos count as dark", () => {
    expect(isDarkBrandColor(getSkillIcon("nextdotjs")!.hex)).toBe(true);
    expect(isDarkBrandColor(getSkillIcon("terraform")!.hex)).toBe(false);
    expect(isDarkBrandColor(getSkillIcon("framer")!.hex)).toBe(false);
  });
});
