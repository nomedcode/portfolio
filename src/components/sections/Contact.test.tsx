import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { profile, sections } from "@/lib/content";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

describe("Contact", () => {
  test("renders the CTA heading and a mailto button", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { name: "Let's build something." })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Open to internships, freelance, and project collaborations."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email me" })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`
    );
  });

  test("renders on a theme-aware raised background", () => {
    render(<Contact />);
    const section = document.getElementById("contact");
    expect(section).toHaveClass("bg-raised");
    expect(section).toHaveClass("scroll-mt-24");
  });

  test("offers the CV download as a real link to the public asset", () => {
    render(<Contact />);
    expect(
      screen.getByRole("link", { name: /Download CV/ })
    ).toHaveAttribute("href", "/faiq-prasetya-cv.pdf");
  });

  test("renders all social links with brand logos and no Instagram", () => {
    render(<Contact />);
    const email = screen.getByRole("link", { name: "Email me" });
    expect(email.querySelector("svg")).not.toBeNull();
    for (const s of profile.socials) {
      const link = screen.getByRole("link", { name: s.label });
      expect(link).toHaveAttribute("href", s.url);
      expect(link.querySelector("svg")).not.toBeNull();
    }
    expect(
      screen.queryByRole("link", { name: /Instagram/ })
    ).not.toBeInTheDocument();
  });
});

describe("Footer", () => {
  test("renders credit line with the current year and section links", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(profile.fullName))
    ).toBeInTheDocument();
    for (const s of sections) {
      expect(screen.getByRole("link", { name: s.label })).toHaveAttribute(
        "href",
        `#${s.id}`
      );
    }
  });

  test("offers the CV download alongside the socials", () => {
    render(<Footer />);
    const cv = screen.getByRole("link", { name: "Download CV" });
    expect(cv).toHaveAttribute("href", "/faiq-prasetya-cv.pdf");
    expect(
      document.querySelector("[data-footer-socials]")?.contains(cv)
    ).toBe(true);
  });

  test("balances credit, nav, and socials as centered thirds on wide screens", () => {
    render(<Footer />);
    const row = document.querySelector("[data-footer-row]");
    expect(row).toHaveClass("grid");
    expect(row).toHaveClass("md:grid-cols-[1fr_auto_1fr]");
    expect(row).toHaveClass("md:items-center");
    expect(screen.getByRole("navigation", { name: "Footer" })).toHaveClass(
      "md:justify-self-center"
    );
    expect(document.querySelector("[data-footer-socials]")).toHaveClass(
      "md:justify-self-end"
    );
  });

  test("stacks and centers the three footer groups on narrow screens", () => {
    render(<Footer />);
    const row = document.querySelector("[data-footer-row]");
    expect(row).toHaveClass("justify-items-center");
    expect(row).toHaveClass("text-center");
    expect(row).toHaveClass("md:text-left");
    expect(screen.getByRole("navigation", { name: "Footer" })).toHaveClass(
      "justify-center"
    );
  });

  test("keeps the copyright year from breaking across lines", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))
    ).toHaveClass("whitespace-nowrap");
  });
});
