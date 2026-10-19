import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { profile, sections } from "@/lib/content";
import { contrastRatio, iconFills } from "@/lib/iconColor";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

const css = readFileSync(path.resolve(__dirname, "../../app/globals.css"), "utf8");

// Value of a --c-* token inside the :root (light) or .dark block of globals.css.
function token(theme: "light" | "dark", name: string) {
  const block = css.match(
    theme === "light" ? /:root\s*\{([^}]*)\}/ : /\n\.dark\s*\{([^}]*)\}/
  )?.[1];
  return block?.match(new RegExp(`--c-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1] as string;
}

describe("Contact", () => {
  test("renders the CTA heading and a mailto button", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { name: "Let's build something." })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Available for internships, freelance work, and small projects."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email me" })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`
    );
  });

  test("names the location, so the page says where the work happens", () => {
    render(<Contact />);
    expect(screen.getByText(profile.location)).toBeInTheDocument();
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
    ).toHaveAttribute("href", "/CV-ATS.pdf");
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

  test("draws the GitHub and LinkedIn logos in their brand colours, fitted to each theme", () => {
    render(<Contact />);
    for (const [label, hex] of [
      ["GitHub", "181717"],
      ["LinkedIn", "0a66c2"],
    ] as const) {
      const svg = screen
        .getByRole("link", { name: label })
        .querySelector("svg") as SVGElement;
      const fills = iconFills(hex);
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveClass("text-(color:--icon-l)", "dark:text-(color:--icon-d)");
      expect(svg.style.getPropertyValue("--icon-l")).toBe(fills.light);
      expect(svg.style.getPropertyValue("--icon-d")).toBe(fills.dark);
    }
    // LinkedIn keeps its blue, not a grey stand-in
    expect(iconFills("0a66c2").light).toBe("#0a66c2");
  });

  test("the Email logo sits in a white circle on the blue button, so its red and blue parts stay readable", () => {
    render(<Contact />);
    const link = screen.getByRole("link", { name: "Email me" });
    const svg = link.querySelector("svg") as SVGElement;
    const badge = link.querySelector("[data-gmail-badge]") as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge).toContainElement(svg);
    expect(svg.parentElement).toBe(badge);
    expect(badge).toHaveClass("bg-white", "rounded-full", "h-8", "w-8", "shrink-0");
    expect(badge).toHaveAttribute("aria-hidden", "true");
    // the badge adds no words: the link is still named by its label alone
    expect(link).toHaveAccessibleName("Email me");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 800 636.36322");

    // three shapes: right stripe and top arc are gradients, the left stripe is flat red
    const fills = [...svg.querySelectorAll("path")].map((p) => p.getAttribute("fill"));
    expect(fills).toEqual(["url(#gmail-a)", "#fc413d", "url(#gmail-b)"]);

    const stops = (id: string) =>
      [...(svg.querySelector(`#${id}`)?.querySelectorAll("stop") ?? [])].map(
        (s) => s.getAttribute("stop-color")
      );
    // green to blue down the right stripe
    expect(stops("gmail-a")).toEqual([
      "#60d673", "#42c868", "#0ebc5f", "#00a9bb", "#3c90ff", "#3186ff",
    ]);
    // pink, red, orange, yellow across the top arc
    expect(stops("gmail-b")).toEqual([
      "#ff63a0", "#fc413d", "#fc413d", "#fc413d", "#fc5c30", "#feb10c", "#fec700", "#ffdb0f",
    ]);
  });

  test("the badge keeps the Email button at its old height: 32px circle with 12px above and below", () => {
    render(<Contact />);
    const email = screen.getByRole("link", { name: "Email me" });
    const cv = screen.getByRole("link", { name: /Download CV/ });
    // 12px + 32px + 12px = 56px, the same content height as 16px + a 24px line + 16px (the outlined buttons add their 1px border)
    expect(email).toHaveClass("py-3", "pl-3");
    expect(email).not.toHaveClass("py-4", "px-8");
    expect(cv).toHaveClass("py-4");
  });

  // The filled action lifts its brightness, the same way the hero's filled action does.
  test("the filled Email button answers a pointer, like the hero's filled action", () => {
    render(<Contact />);
    expect(screen.getByRole("link", { name: "Email me" })).toHaveClass(
      "hover:brightness-110"
    );
  });

  test("the red stripe and the blue base reach 3:1 on the white badge, which they do not on the blue button", () => {
    const onBadge = "#ffffff";
    const onButton = "#0066cc";
    for (const hex of ["#fc413d", "#3186ff"]) {
      expect(contrastRatio(hex, onBadge), `${hex} on white`).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(hex, onButton), `${hex} on blue`).toBeLessThan(3);
    }
  });

  test("the GitHub and LinkedIn outline reaches 3:1 against the raised surface in both themes", () => {
    render(<Contact />);
    for (const s of profile.socials) {
      const link = screen.getByRole("link", { name: s.label });
      expect(link).toHaveClass("border");
      const colour = [...link.classList]
        .find((c) => /^border-[a-z]+$/.test(c) && c !== "border-transparent")
        ?.replace("border-", "") as string;
      expect(colour, `${s.label} border colour class`).toBeTruthy();
      for (const theme of ["light", "dark"] as const) {
        expect(
          contrastRatio(token(theme, colour), token(theme, "raised")),
          `${s.label} outline in ${theme}`
        ).toBeGreaterThanOrEqual(3);
      }
    }
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
    expect(cv).toHaveAttribute("href", "/CV-ATS.pdf");
    expect(
      document.querySelector("[data-footer-socials]")?.contains(cv)
    ).toBe(true);
  });

  test("balances credit, nav, and socials as centered thirds on wide screens", () => {
    render(<Footer />);
    const row = document.querySelector("[data-footer-row]");
    expect(row).toHaveClass("grid");
    expect(row).toHaveClass("xl:grid-cols-[1fr_auto_1fr]");
    expect(row).toHaveClass("xl:items-center");
    expect(screen.getByRole("navigation", { name: "Footer" })).toHaveClass(
      "xl:justify-self-center"
    );
    expect(document.querySelector("[data-footer-socials]")).toHaveClass(
      "xl:justify-self-end"
    );
  });

  test("stacks and centers the three footer groups through tablet widths", () => {
    render(<Footer />);
    const row = document.querySelector("[data-footer-row]");
    expect(row).toHaveClass("justify-items-center");
    expect(row).toHaveClass("text-center");
    expect(row).toHaveClass("xl:text-left");
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
