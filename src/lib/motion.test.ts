import { describe, expect, test } from "vitest";
import { motionTransition } from "./motion";

describe("motionTransition", () => {
  const full = { type: "spring", bounce: 0, duration: 0.4 } as const;

  test("passes the full transition through for normal motion", () => {
    expect(motionTransition(false, full)).toBe(full);
  });

  test("reduced motion fades opacity in 200ms or less and lands everything else instantly", () => {
    const t = motionTransition(true, full) as {
      default: { duration: number };
      opacity: { duration: number };
    };
    expect(t.default.duration).toBe(0);
    expect(t.opacity.duration).toBeGreaterThan(0);
    expect(t.opacity.duration).toBeLessThanOrEqual(0.2);
  });

  test("reduced motion drops entrance delays so the whole page settles inside one fade", () => {
    const t = motionTransition(true, { ...full, delay: 0.3 }) as {
      delay?: number;
    };
    expect(t.delay ?? 0).toBe(0);
  });
});
