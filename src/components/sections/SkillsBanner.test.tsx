import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { cloudSkills, skillCategories } from "@/lib/content";
import { SkillsBanner } from "./SkillsBanner";

function expectedLogoCount() {
  const expected = new Set<string>();
  for (const c of cloudSkills) expected.add(c.id);
  for (const cat of skillCategories) {
    for (const s of cat.skills) expected.add(s.icon);
  }
  return expected.size;
}

describe("Skills banner", () => {
  test("preview logos start hidden and pop in from a point by default", () => {
    render(<SkillsBanner />);
    const style = document
      .querySelector("[data-preview-logo]")
      ?.getAttribute("style");
    expect(style).toContain("opacity: 0");
    expect(style).toContain("scale(0)");
  });

  test("under reduced motion the logos paint the same hidden first frame (matches the server HTML); the fade-only change lives in the transition", () => {
    const { unmount } = render(<SkillsBanner />);
    const normal = [
      ...document.querySelectorAll("[data-preview-logo]"),
    ].map((logo) => logo.getAttribute("style"));
    unmount();
    const originalMatchMedia = window.matchMedia;
    const spy = vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...originalMatchMedia(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    }));
    render(<SkillsBanner />);
    expect(
      [...document.querySelectorAll("[data-preview-logo]")].map((logo) =>
        logo.getAttribute("style")
      )
    ).toEqual(normal);
    spy.mockRestore();
  });

  test("renders one banner card with the Skills label and every skill logo", () => {
    render(<SkillsBanner />);
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Skills." })).not.toBeInTheDocument();
    expect(screen.getByText("Click to see all")).toBeInTheDocument();
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
