import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Reveal } from "./Reveal";

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

  test("reduced motion renders final state immediately (no hidden transform)", () => {
    const stub = vi
      .spyOn(window, "matchMedia")
      .mockImplementation(
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
    render(
      <Reveal>
        <p>readable right away</p>
      </Reveal>
    );
    expect(screen.getByText("readable right away")).toBeInTheDocument();
    stub.mockRestore();
  });
});
