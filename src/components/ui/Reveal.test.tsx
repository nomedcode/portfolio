import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Reveal } from "./Reveal";

function mockReducedMotion() {
  return vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: query.includes("reduce"),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Reveal", () => {
  test("renders children", () => {
    render(
      <Reveal>
        <p>hello world</p>
      </Reveal>
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  test("marks its wrapper with data-reveal for noscript overrides", () => {
    render(
      <Reveal>
        <p>marked content</p>
      </Reveal>
    );
    expect(screen.getByText("marked content").parentElement).toHaveAttribute(
      "data-reveal"
    );
  });

  test("rises 20px while fading in by default", () => {
    render(
      <Reveal>
        <p>moves</p>
      </Reveal>
    );
    const style = screen.getByText("moves").parentElement?.getAttribute("style");
    expect(style).toContain("opacity: 0");
    expect(style).toContain("translateY(20px)");
  });

  test("reduced motion paints the same hidden first frame as normal motion, so hydration cannot leave it offset", () => {
    const { unmount } = render(
      <Reveal>
        <p>probe</p>
      </Reveal>
    );
    const normal = screen.getByText("probe").parentElement?.getAttribute("style");
    unmount();
    mockReducedMotion();
    render(
      <Reveal>
        <p>probe</p>
      </Reveal>
    );
    const wrapper = screen.getByText("probe").parentElement;
    expect(wrapper).toHaveAttribute("data-reveal");
    expect(wrapper?.getAttribute("style")).toBe(normal);
  });
});
