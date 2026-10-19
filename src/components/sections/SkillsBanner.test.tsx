import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { featuredSkillIcons, skillCategories } from "@/lib/content";
import { SkillsBanner } from "./SkillsBanner";

const css = readFileSync(path.resolve(__dirname, "../../app/globals.css"), "utf8");

function cssBlock(motion: "reduce" | "no-preference") {
  return (
    css.match(
      new RegExp(`@media \\(prefers-reduced-motion: ${motion}\\)\\s*\\{([\\s\\S]*?)\\n\\}`)
    )?.[1] ?? ""
  );
}

function expectedLogoCount() {
  const expected = new Set<string>();
  for (const cat of skillCategories) {
    for (const s of cat.skills) expected.add(s.icon);
  }
  return expected.size;
}

function contentOrderWithoutFeatured() {
  return [
    ...new Set(skillCategories.flatMap((c) => c.skills.map((s) => s.icon))),
  ].filter((id) => !featuredSkillIcons.includes(id));
}

describe("Skills banner", () => {
  test("keeps one fixed order, on the server and after mount, with the infra run swapped ahead of the web run", () => {
    const html = renderToStaticMarkup(<SkillsBanner />);
    const serverIds = [...html.matchAll(/data-skill="([^"]+)"/g)].map((m) => m[1]);

    // Same skills as before, featured first; only the placement of two runs changes.
    expect(serverIds.slice(0, featuredSkillIcons.length)).toEqual(featuredSkillIcons);
    expect([...serverIds].sort()).toEqual(
      [...featuredSkillIcons, ...contentOrderWithoutFeatured()].sort()
    );

    // The banner trades the infra run for the web run. The dialog keeps its categories.
    // The web run now sits where the infra run was, immediately before NGINX.
    const web = serverIds.indexOf("gsap");
    expect(serverIds.slice(web, web + 3)).toEqual(["gsap", "nodedotjs", "bun"]);
    expect(serverIds[web + 3]).toBe("nginx");

    // The infra run now sits where the web run was, immediately before Laravel.
    const infra = serverIds.indexOf("terraform");
    expect(serverIds.slice(infra, infra + 3)).toEqual([
      "terraform",
      "docker",
      "kubernetes",
    ]);
    expect(serverIds[infra + 3]).toBe("laravel");

    const { unmount } = render(<SkillsBanner />);
    const clientIds = [...document.querySelectorAll("[data-preview-logo]")].map((li) =>
      li.getAttribute("data-skill")
    );
    expect(clientIds).toEqual(serverIds);
    unmount();

    // a second mount shows the same order: nothing is shuffled between loads
    render(<SkillsBanner />);
    expect(
      [...document.querySelectorAll("[data-preview-logo]")].map((li) =>
        li.getAttribute("data-skill")
      )
    ).toEqual(serverIds);
  });

  test("preview logos use the shared per-theme brand fill, never a dark-mode invert", () => {
    render(<SkillsBanner />);
    const svgs = document.querySelectorAll("[data-preview-logo] svg");
    expect(svgs).toHaveLength(expectedLogoCount());
    expect(document.querySelectorAll("svg.dark\\:invert")).toHaveLength(0);
    // ten marks are theme-fitted: the seven devicon does not carry, the line-art Bun, plus the monochrome AWS and
    // Motion. The other thirty-seven carry their own brand colours (the devicon originals and the uxwing Hugging
    // Face), so no --icon-l.
    const selfColoured = 37;
    const withFills = [...svgs].filter((s) =>
      (s as SVGElement).style.getPropertyValue("--icon-l")
    );
    expect(withFills).toHaveLength(svgs.length - selfColoured);
  });

  test("preview logos start hidden and are staggered by an index, so the CSS can pop them in", () => {
    render(<SkillsBanner />);
    const logos = [...document.querySelectorAll("[data-preview-logo]")];
    expect(logos[0]).toHaveClass("preview-logo");
    expect(logos[0]).toHaveStyle({ "--i": "0" });
    expect(logos[1]).toHaveStyle({ "--i": "1" });
    // The animation lives in CSS now, so the icon paths never enter the client bundle.
    const css = readFileSync(path.resolve(__dirname, "../../app/globals.css"), "utf8");
    expect(css).toMatch(/\.preview-in \.preview-logo\s*\{[^}]*animation:\s*logo-pop/);
  });

  test("reduced motion swaps the pop for a short fade in CSS, so the markup is unchanged", () => {
    const reduced = cssBlock("reduce");
    expect(reduced).toMatch(
      /\.preview-in \.preview-logo\s*\{[^}]*animation:\s*logo-fade 200ms/
    );
  });

  test("preview logos carry data-reveal, so the noscript rule unhides them when JS never runs", () => {
    render(<SkillsBanner />);
    const logos = [...document.querySelectorAll("[data-preview-logo]")];
    expect(logos.length).toBeGreaterThan(0);
    for (const logo of logos) {
      // The hidden first frame comes from .preview-logo, so the noscript rule has to target this element.
      expect(logo).toHaveAttribute("data-reveal");
      expect(logo).toHaveClass("preview-logo");
    }
  });

  test("renders one banner card with the Skills label and every skill logo", () => {
    render(<SkillsBanner />);
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Skills." })).not.toBeInTheDocument();
    expect(screen.getByText("View all skills")).toBeInTheDocument();
    expect(screen.queryByText(/click|tap/i)).not.toBeInTheDocument();
    const preview = document.querySelector("[data-preview-list]");
    expect(preview).toHaveAttribute("aria-hidden", "true");
    expect(preview?.tagName).toBe("UL");
    expect(
      [...(preview?.children ?? [])].every((c) => c.tagName === "LI")
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "View all skills" })
    ).toHaveAttribute("aria-haspopup", "dialog");
    expect(document.getElementById("skills")).not.toBeNull();
    expect(
      document.querySelectorAll("[data-preview-logo]")
    ).toHaveLength(expectedLogoCount());
  });

  test("the card takes its press and lift timing from CSS and its focus ring from the shared token", () => {
    render(<SkillsBanner />);
    const card = document.querySelector("[data-banner-card]") as HTMLElement;
    expect(card).toHaveClass("press", "press-lift");
    expect(card.className).not.toMatch(/transition-|duration-/);
    const opener = screen.getByRole("button", { name: "View all skills" });
    expect(opener.className).not.toContain("outline-accent");
  });

  test("banner card enters through the shared Reveal wrapper", () => {
    render(<SkillsBanner />);
    const card = document.querySelector("[data-banner-card]");
    expect(card).not.toBeNull();
    expect(card?.parentElement).toHaveAttribute("data-reveal");
  });

  test("opens the tech stack dialog on banner click and shows all categories", async () => {
    const user = userEvent.setup();
    render(<SkillsBanner />);
    await user.click(screen.getByRole("button", { name: "View all skills" }));
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Skills" })
    ).toBeInTheDocument();
    expect(
      within(dialog).queryByRole("heading", { name: "Kemampuanku." })
    ).not.toBeInTheDocument();
    for (const cat of skillCategories) {
      expect(
        within(dialog).getByRole("heading", { name: cat.name })
      ).toBeInTheDocument();
      expect(
        within(dialog).getByRole("list", { name: `${cat.name} skills` })
      ).toBeInTheDocument();
    }
    expect(dialog.querySelectorAll("[data-skill-chip]")).toHaveLength(
      skillCategories.flatMap((c) => c.skills).length
    );
    expect(dialog.querySelector(".overflow-y-auto")).toHaveClass(
      "overscroll-contain"
    );
  });

  test("the popup lists exactly the skills the banner previews, each with its logo", async () => {
    const user = userEvent.setup();
    render(<SkillsBanner />);
    const previewCount = document.querySelectorAll("[data-preview-logo]").length;
    await user.click(screen.getByRole("button", { name: "View all skills" }));
    const dialog = await screen.findByRole("dialog");
    const chips = [...dialog.querySelectorAll("[data-skill-chip]")];
    expect(chips).toHaveLength(previewCount);
    expect(chips.every((chip) => chip.querySelector("svg"))).toBe(true);
    for (const name of ["AWS", "Azure", "Terraform"]) {
      expect(within(dialog).getByText(name)).toBeInTheDocument();
    }
  });

  test("dialog has no eyebrow and no category description paragraphs", async () => {
    const user = userEvent.setup();
    render(<SkillsBanner />);
    await user.click(screen.getByRole("button", { name: "View all skills" }));
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).queryByText("Kenali lebih dalam")
    ).not.toBeInTheDocument();
    expect(dialog.querySelector("p")).toBeNull();
  });

  test("closes via the close button and returns focus to the banner", async () => {
    const user = userEvent.setup();
    render(<SkillsBanner />);
    const banner = screen.getByRole("button", { name: "View all skills" });
    await user.click(banner);
    const close = await screen.findByRole("button", { name: "Close" });
    expect(close).toHaveFocus();
    await user.click(close);
    await waitFor(
      () => expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
      { timeout: 2000 }
    );
    expect(banner).toHaveFocus();
  });

  test("closes on Escape key", async () => {
    const user = userEvent.setup();
    render(<SkillsBanner />);
    await user.click(screen.getByRole("button", { name: "View all skills" }));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(
      () => expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
      { timeout: 2000 }
    );
  });

  test("dialog scroller is a named, keyboard-focusable region", async () => {
    const user = userEvent.setup();
    render(<SkillsBanner />);
    await user.click(screen.getByRole("button", { name: "View all skills" }));
    const dialog = await screen.findByRole("dialog");
    const scroller = within(dialog).getByRole("region", {
      name: "Skills by category",
    });
    expect(scroller).toHaveAttribute("tabindex", "0");
    expect(scroller).toHaveClass("overflow-y-auto");
  });

  test("Tab cycles Close then the scroller and wraps inside the dialog", async () => {
    const user = userEvent.setup();
    render(<SkillsBanner />);
    await user.click(screen.getByRole("button", { name: "View all skills" }));
    const dialog = await screen.findByRole("dialog");
    const close = within(dialog).getByRole("button", { name: "Close" });
    const scroller = within(dialog).getByRole("region", {
      name: "Skills by category",
    });
    expect(close).toHaveFocus();
    await user.tab();
    expect(scroller).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(scroller).toHaveFocus();
  });
});
