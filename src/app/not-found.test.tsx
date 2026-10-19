import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import NotFound, { metadata } from "./not-found";

describe("404 page", () => {
  test("says what happened and offers the way back", () => {
    render(<NotFound />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/not found/i);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
  });

  test("uses the page surface and type scale, so a missing URL stays inside the design", () => {
    render(<NotFound />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("bg-page");
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
      "text-display",
      "tracking-display"
    );
  });

  test("carries its own title and noindex, instead of inheriting the home page's", () => {
    expect(metadata.title).toBe("Page not found");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
