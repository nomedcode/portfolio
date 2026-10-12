import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useReducedMotion } from "./useReducedMotion";

describe("useReducedMotion", () => {
  test("returns false when the media query does not match", () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
