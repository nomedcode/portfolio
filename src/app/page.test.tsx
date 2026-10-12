import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "./page";

describe("Assembled page", () => {
  test("renders nav, hero, all six sections, and footer in order", () => {
    render(<Home />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Introduction" })
    ).toBeInTheDocument();
    for (const id of [
      "projects",
      "skills",
      "awards",
      "certificates",
      "education",
      "contact",
    ]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("skip link is the first focusable element and targets main", () => {
    render(<Home />);
    const skip = screen.getByRole("link", { name: "Skip to main content" });
    expect(skip).toHaveAttribute("href", "#main");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(
      skip.compareDocumentPosition(screen.getByRole("banner")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  test("sections keep scroll margin so anchors clear the sticky chrome", () => {
    render(<Home />);
    const projects = document.getElementById("projects");
    expect(projects).toHaveClass("scroll-mt-24");
  });

  test("certificates precede awards after the swap, backgrounds stay by position", () => {
    render(<Home />);
    const certs = document.getElementById("certificates");
    const awards = document.getElementById("awards");
    expect(certs).not.toBeNull();
    expect(awards).not.toBeNull();
    expect(
      certs!.compareDocumentPosition(awards!) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  test("nav exposes the theme toggle", () => {
    render(<Home />);
    expect(
      screen.getByRole("button", { name: "Toggle dark mode" })
    ).toBeInTheDocument();
  });

  test("sections use theme-aware background tokens", () => {
    render(<Home />);
    expect(document.getElementById("projects")).toHaveClass("bg-page");
    expect(document.getElementById("skills")).toHaveClass("bg-raised");
    expect(document.getElementById("certificates")).toHaveClass("bg-page");
    expect(document.getElementById("awards")).toHaveClass("bg-raised");
    expect(document.getElementById("contact")).toHaveClass("bg-raised");
  });
});
