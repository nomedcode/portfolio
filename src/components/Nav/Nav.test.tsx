import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
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

  test("mobile menu slides in with the shared menu-in animation", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(document.getElementById("mobile-menu")).toHaveClass("menu-in");
  });

  test("tapping outside the header closes the menu without stealing focus", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Nav />
        <main>
          <p>page content</p>
        </main>
      </>
    );
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByText("page content"));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toBeNull();
    expect(toggle).not.toHaveFocus();
  });

  test("tapping inside the open panel or on the toggle does not count as outside", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    await user.click(toggle);
    const panel = document.getElementById("mobile-menu") as HTMLElement;
    await user.click(panel);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("mobile menu is capped to the space under the header and scrolls on short screens", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    const panel = document.getElementById("mobile-menu");
    // 3.25rem = the 48px bar + its 1px border + slack; without the cap a short landscape phone clips the last links.
    expect(panel).toHaveClass(
      "max-h-[calc(100dvh-3.25rem)]",
      "overflow-y-auto",
      "overscroll-contain"
    );
  });

  test("the CV button drops its label at tablet widths to keep the bar uncrowded", () => {
    render(<Nav />);
    const cv = screen.getByRole("link", { name: "Download CV" });
    const label = cv.querySelector("span") as HTMLElement;
    expect(label).toHaveTextContent("Download CV");
    expect(label).toHaveClass("hidden", "sm:inline", "md:max-lg:hidden");
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

describe("Nav current section", () => {
  let callback: (entries: Partial<IntersectionObserverEntry>[]) => void;

  class FakeObserver {
    constructor(cb: typeof callback) {
      callback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", FakeObserver);
    for (const s of sections) {
      const el = document.createElement("section");
      el.id = s.id;
      document.body.appendChild(el);
    }
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    for (const s of sections) document.getElementById(s.id)?.remove();
  });

  function enter(id: string, isIntersecting = true) {
    act(() => {
      callback([{ target: document.getElementById(id)!, isIntersecting }]);
    });
  }

  test("no link is current until a section reaches the reading line", () => {
    render(<Nav />);
    expect(document.querySelectorAll("[aria-current]")).toHaveLength(0);
  });

  test("the link for the section in view gets aria-current=location, and only that one", () => {
    render(<Nav />);
    enter("skills");
    const current = document.querySelectorAll("[aria-current]");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute("aria-current", "location");
    expect(current[0]).toHaveAttribute("href", "#skills");
    expect(current[0]).toHaveTextContent("Skills");
    enter("skills", false);
    enter("awards");
    expect(document.querySelector("[aria-current]")).toHaveAttribute(
      "href",
      "#awards"
    );
  });

  test("the current desktop link has a visual state besides colour, with an underline fallback for forced colours", () => {
    render(<Nav />);
    enter("education");
    const link = document.querySelector("[aria-current]") as HTMLElement;
    expect(link.className).toContain("aria-[current=location]:bg-line/70");
    expect(link.className).toContain(
      "forced-colors:aria-[current=location]:underline"
    );
  });

  test("the open mobile menu marks the same section", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    enter("contact");
    const panel = document.getElementById("mobile-menu") as HTMLElement;
    const current = panel.querySelector("[aria-current]");
    expect(current).toHaveAttribute("href", "#contact");
    expect(current?.className).toContain(
      "aria-[current=location]:font-semibold"
    );
  });
});

