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

  // Metadata merges shallowly, so a segment that omits openGraph/twitter inherits the home page's wholesale —
  // which is what made a shared 404 link unfurl as the homepage.
  test("describes itself in social metadata rather than unfurling as the home page", () => {
    const og = metadata.openGraph as Record<string, unknown>;
    const tw = metadata.twitter as Record<string, unknown>;
    expect(og.title).toBe("Page not found");
    expect(tw.title).toBe("Page not found");
    expect(og.description).toEqual(expect.stringMatching(/does not exist/i));
    expect(tw.description).toBe(og.description);
  });

  // There is no canonical URL for an address that does not exist, and the inherited one named the home page.
  test("claims no canonical URL", () => {
    expect(metadata.alternates?.canonical).toBeNull();
  });
});
