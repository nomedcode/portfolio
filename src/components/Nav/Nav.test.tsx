import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { profile, sections } from "@/lib/content";
import { Nav } from "./Nav";

describe("Nav", () => {
  test("renders profile name linking to top and section links", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: profile.name })).toHaveAttribute(
      "href",
      "#top"
    );
    for (const s of sections) {
      expect(
        screen.getAllByRole("link", { name: s.label }).length
      ).toBeGreaterThan(0);
    }
  });

  test("desktop section links use full-contrast text over the hero", () => {
    render(<Nav />);
    for (const s of sections) {
      const link = screen.getAllByRole("link", { name: s.label })[0];
      expect(link).toHaveClass("text-fg");
      expect(link).not.toHaveClass("text-muted");
    }
  });

  test("offers the CV download beside the theme toggle", () => {
    render(<Nav />);
    const cv = screen.getByRole("link", { name: "Download CV" });
    expect(cv).toHaveAttribute("href", "/faiq-prasetya-cv.pdf");
    const toggle = screen.getByRole("button", { name: "Toggle dark mode" });
    expect(
      cv.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test("mobile menu points at its panel; Escape closes it and returns focus", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    await user.click(toggle);
    const panelId = toggle.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(panelId!)).toBeNull();
    expect(toggle).toHaveFocus();
  });

  test("mobile menu toggle opens the section links", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getByRole("button", { name: "Toggle menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(
      screen.getAllByRole("link", { name: "Projects" }).length
    ).toBeGreaterThan(0);
  });
});
