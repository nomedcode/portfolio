import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { awards } from "@/lib/content";
import { Awards } from "./Awards";

describe("Awards", () => {
  test("uses the section label as the only section heading", () => {
    render(<Awards />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Awards" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Awards" })).toHaveClass(
      "text-4xl",
      "md:text-5xl"
    );
    expect(
      screen.queryByRole("heading", { name: "Penghargaan" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Bukti kerja keras.")).not.toBeInTheDocument();
  });

  test("renders every award title, year, and issuer", () => {
    render(<Awards />);
    for (const a of awards) {
      expect(screen.getByRole("heading", { name: a.title })).toBeInTheDocument();
      expect(screen.getAllByText(a.year).length).toBeGreaterThan(0);
      expect(screen.getByText(a.issuer)).toBeInTheDocument();
      expect(screen.getByText(a.description)).toBeInTheDocument();
    }
  });

  test("left-aligns the description and lets the grid fit the card count", () => {
    const { container } = render(<Awards />);
    for (const a of awards) {
      expect(screen.getByText(a.description)).not.toHaveClass("text-justify");
    }
    expect(container.querySelector(".grid")?.className).toContain("auto-fit");
  });

  test("caps the card at the Certificates width, so one long award does not run the full container", () => {
    // At the full 72rem container a single card ran ~170 characters per line.
    const { container } = render(<Awards />);
    expect(container.querySelector(".grid")?.className).toContain("max-w-3xl");
  });

  test("sets the description at body size, not caption size", () => {
    render(<Awards />);
    for (const a of awards) {
      expect(screen.getByText(a.description)).toHaveClass("text-base");
    }
  });

  test("articles stand out as page-white cards on the raised section", () => {
    const { container } = render(<Awards />);
    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(awards.length);
    for (const article of Array.from(articles)) {
      expect(article).toHaveClass("bg-page");
    }
  });

  test("cards use the once-only Reveal entrance like certificates, not a scroll scrub", () => {
    const { container } = render(<Awards />);
    const reveals = container.querySelectorAll("[data-reveal]");
    expect(reveals.length).toBeGreaterThanOrEqual(awards.length);
  });

  test("cards pad like the Certificates card: 32px, 40px from desktop width", () => {
    const { container } = render(<Awards />);
    for (const card of container.querySelectorAll("article")) {
      expect(card).toHaveClass("p-8", "md:p-10");
    }
  });});
