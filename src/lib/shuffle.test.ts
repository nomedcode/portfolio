import { afterEach, describe, expect, test, vi } from "vitest";
import { shuffle } from "./shuffle";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("shuffle", () => {
  const items = [1, 2, 3, 4, 5, 6];

  test("returns a new array with the same items and leaves the input alone", () => {
    const input = [...items];
    const out = shuffle(input, () => 0);
    expect(out).not.toBe(input);
    expect(input).toEqual(items);
    expect([...out].sort()).toEqual(items);
  });

  test("follows the random source it is given: a source that never swaps keeps the order, one that always picks the first slot rotates it", () => {
    expect(shuffle(items, () => 0.999)).toEqual(items);
    expect(shuffle(items, () => 0)).toEqual([2, 3, 4, 5, 6, 1]);
  });

  test("uses Math.random when no source is given", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(shuffle(items)).toEqual([2, 3, 4, 5, 6, 1]);
  });

  test("an empty list or a single item comes back as it was", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["only"])).toEqual(["only"]);
  });
});
