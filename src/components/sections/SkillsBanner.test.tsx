import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
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
});
