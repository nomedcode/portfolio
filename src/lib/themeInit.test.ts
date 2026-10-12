import { afterEach, describe, expect, test, vi } from "vitest";
import { themeInitScript } from "./themeInit";

function isDarkAfterInit(stored: string | null, osDark: boolean) {
  document.documentElement.classList.remove("dark");
  vi.spyOn(Storage.prototype, "getItem").mockReturnValue(stored);
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({ matches: osDark && query.includes("dark") }) as MediaQueryList
  );
  new Function(themeInitScript)();
  return document.documentElement.classList.contains("dark");
}

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.classList.remove("dark");
});

describe("theme init script", () => {
  test("stored dark wins over a light OS", () => {
    expect(isDarkAfterInit("dark", false)).toBe(true);
  });

  test("stored light wins over a dark OS", () => {
    expect(isDarkAfterInit("light", true)).toBe(false);
  });

  test("with nothing stored, follows the OS scheme", () => {
    expect(isDarkAfterInit(null, true)).toBe(true);
    expect(isDarkAfterInit(null, false)).toBe(false);
  });

  test("survives storage throwing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => new Function(themeInitScript)()).not.toThrow();
  });
});
