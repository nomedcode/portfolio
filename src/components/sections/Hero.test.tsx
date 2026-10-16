import {
  act,
  cleanup,
  render,
  screen,
  within,
} from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { profile } from "@/lib/content";
import { Hero } from "./Hero";

const css = readFileSync(
  path.resolve(__dirname, "../../app/globals.css"),
  "utf8"
);

// The role line holds each role for 2600 ms, then spends 400 ms leaving before the next one is put in place.
const HOLD = 2600;
const EXIT = 400;
const STEP = HOLD + EXIT;

function rotatingRole(name: string) {
  return screen.getByText(name, { selector: "[data-hero-role-text]" });
}

function queryRotatingRole(name: string) {
  return screen.queryByText(name, { selector: "[data-hero-role-text]" });
}

function activeRoles() {
  return document.querySelectorAll("[data-hero-role]");
}

function roleNode() {
  return document.querySelector("[data-hero-role-text]");
}

function follows(before: Element, after: Element) {
  expect(
    before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
}

function enterOffset(el: Element | null, axis: "X" | "Y") {
  const style = el?.getAttribute("style") ?? "";
  const match = style.match(new RegExp(`translate${axis}\\(([-\\d.]+)px\\)`));
  return match ? Number(match[1]) : null;
}

function useFakeClock() {
  vi.useFakeTimers({
    toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
  });
}

function preferReducedMotion() {
  const originalMatchMedia = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    ...originalMatchMedia(query),
    matches: query === "(prefers-reduced-motion: reduce)",
  }));
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Hero", () => {
  test("introduces the full name with one role line and no scroll cue", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Fa'iq Haidar Prasetya",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveAttribute(
      "aria-live"
    );
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
    expect(document.querySelector("p[data-hero-role]")).not.toHaveAttribute(
      "aria-live"
    );
    expect(screen.getByText(profile.about)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Learn more" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/learn more/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Scroll", { exact: true })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /role rotation/ })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Bandung, Indonesia", { exact: true })
    ).not.toBeInTheDocument();
  });

  test("the headline is just the name on one fluid line, with no greeting", () => {
    render(<Hero photo="/photo.png" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.replace(/\s+/g, " ").trim()).toBe(profile.fullName);
    expect(screen.queryByText(/Hi, I/)).not.toBeInTheDocument();
    // Big and free to wrap on a phone; from 640px up it's one fluid line instead of stepping by breakpoint.
    expect(h1).toHaveClass(
      "text-display",
      "text-balance",
      "sm:whitespace-nowrap",
      "sm:text-display-fluid"
    );
    // The portrait is its own card now, not part of the headline.
    expect(h1).not.toContainElement(
      document.querySelector("[data-hero-portrait]") as HTMLElement
    );
  });

  test("offers the CV download first, then contact, both as real links", () => {
    render(<Hero />);
    const actions = document.querySelector("[data-hero-actions]") as HTMLElement;
    expect(actions).not.toBeNull();
    const links = within(actions).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Download CV", "Contact"]);
    expect(links[0]).toHaveAttribute("href", "/CV-ATS.pdf");
    expect(links[0]).toHaveAttribute("download");
    expect(links[0].querySelector("svg.lucide-download")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(links[1]).toHaveAttribute("href", "#contact");
    expect(links[1]).not.toHaveAttribute("download");
    expect(within(actions).queryAllByRole("button")).toHaveLength(0);
    expect(
      screen.queryByRole("link", { name: "View projects" })
    ).not.toBeInTheDocument();
    follows(screen.getByText(profile.about), actions);
  });

  test("the primary action is the one Signal Blue pill, the secondary is the neutral outline pill", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: "Download CV" });
    const secondary = screen.getByRole("link", { name: "Contact" });
    expect(primary).toHaveClass("bg-accent", "text-white", "rounded-full", "press");
    expect(secondary).toHaveClass(
      "border",
      "border-subtle",
      "rounded-full",
      "press",
      "text-fg"
    );
    expect(secondary).not.toHaveClass("bg-accent");
    expect(secondary).not.toHaveClass("text-white");
  });

  test("both actions have a touch target of at least 44px", () => {
    render(<Hero />);
    for (const name of ["Download CV", "Contact"]) {
      // py-3 (24px) around a 24px line is 48px
      expect(screen.getByRole("link", { name })).toHaveClass("py-3");
    }
  });

  test("grows past the viewport on short screens", () => {
    render(<Hero />);
    const hero = screen.getByRole("region", { name: "Introduction" });
    expect(hero).toHaveClass("min-h-svh");
    expect(hero).not.toHaveClass("h-svh");
    const content = hero.querySelector("[data-hero-content]") as HTMLElement;
    expect(content).toHaveClass("min-h-svh");
    expect(content).not.toHaveClass("h-svh");
  });

  test("sits on the page container, so its left edge lines up with the header and every section", () => {
    render(<Hero />);
    const content = document.querySelector("[data-hero-content]") as HTMLElement;
    expect(content).toHaveClass("mx-auto", "max-w-6xl", "px-6");
  });

  test("is one left-aligned column: the name on top, then a row with the copy on the left and the portrait on the right from md", () => {
    render(<Hero />);
    const content = document.querySelector("[data-hero-content]") as HTMLElement;
    expect(content).toHaveClass("flex", "flex-col");
    expect(content.className).not.toMatch(/grid-cols|text-center|items-center/);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(content).toContainElement(h1);
    const row = document.querySelector("[data-hero-row]") as HTMLElement;
    expect(row).toHaveClass("flex", "flex-col", "md:flex-row", "md:justify-between");
    // The row top-aligns from md: the portrait starts level with the role line, the compact composition holds.
    expect(row).toHaveClass("md:items-start");
    const role = document.querySelector("[data-hero-role]") as HTMLElement;
    const about = screen.getByText(profile.about);
    const actions = document.querySelector("[data-hero-actions]") as HTMLElement;
    const portrait = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(actions.className).not.toMatch(/justify-center|md:justify-start/);
    for (const el of [role, about, actions, portrait]) {
      expect(row).toContainElement(el);
    }
    // Reading order: role, about, actions, portrait last.
    follows(role, about);
    follows(about, actions);
    follows(actions, portrait);
    expect(document.querySelector("[data-hero-portrait-wrap]")).toBeNull();
    expect(document.querySelector("[data-hero-copy]")).toBeNull();
  });

  test("rises in on load: headline, role, about line, actions, then the portrait", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    const roleBlock = document.querySelector("[data-hero-role]")
      ?.parentElement as HTMLElement;
    const about = screen.getByText(profile.about);
    const actions = document.querySelector("[data-hero-actions]") as HTMLElement;
    const portrait = document.querySelector("[data-hero-portrait]") as HTMLElement;
    for (const el of [heading, roleBlock, about, actions, portrait]) {
      expect(el).toHaveClass("hero-rise");
    }
    expect(heading).toHaveClass("[animation-delay:100ms]");
    expect(roleBlock).toHaveClass("[animation-delay:200ms]");
    expect(about).toHaveClass("[animation-delay:300ms]");
    expect(actions).toHaveClass("[animation-delay:400ms]");
    expect(portrait).toHaveClass("[animation-delay:500ms]");
  });

  test("sits on the raised surface, one tone off Projects below it: no dark gradient, no glow, no ring override", () => {
    render(<Hero />);
    const hero = screen.getByRole("region", { name: "Introduction" });
    expect(hero).toHaveClass("bg-raised", "text-fg");
    expect(hero).not.toHaveClass("bg-page");
    expect(hero).not.toHaveClass("bg-deep");
    expect(hero).not.toHaveClass("text-white");
    expect(hero.className).not.toMatch(/--c-ring/);
    expect(hero.getAttribute("style") ?? "").not.toMatch(/background/);
    expect(document.querySelector("[data-hero-glow]")).toBeNull();
    expect(document.querySelector("[style*='linear-gradient']")).toBeNull();
  });

  test("shows the photo as a straight 4:5 portrait card beside the copy, decorative and loaded first", () => {
    render(<Hero photo="/photo.png" />);
    const card = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(card).toHaveAttribute("aria-hidden", "true");
    const img = card.querySelector("img") as HTMLElement;
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("alt", "");
    expect(img.getAttribute("src")).toContain("photo.png");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
    expect(img).toHaveClass("object-cover");
    expect(card).toHaveClass("overflow-hidden", "rounded-card", "aspect-[4/5]", "ring-1", "ring-line");
    expect(card.className).not.toMatch(/rounded-full|rotate-/);
  });

  test("the portrait card is small beside the copy on phones and grows through the breakpoints", () => {
    render(<Hero photo="/photo.png" />);
    const card = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(card).toHaveClass("w-44", "sm:w-52", "md:w-60", "lg:w-72", "shrink-0");
  });

  test("without a photo the same card shows a decorative initials monogram", () => {
    render(<Hero />);
    const card = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(card).toHaveAttribute("aria-hidden", "true");
    expect(card.querySelector("img")).toBeNull();
    const initials = within(card).getByText("FP");
    // The card fill is the page tone: on the raised hero surface a raised fill would vanish.
    expect(initials).toHaveClass("bg-page", "text-subtle");
  });

  test("hero-rise is a CSS animation that reduced motion switches off", () => {
    expect(css).toMatch(/@keyframes hero-rise/);
    expect(css).toMatch(/\.hero-rise\s*\{[^}]*animation:[^;}]*hero-rise/);
    const reduced = css.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/
    );
    expect(reduced?.[1]).toMatch(/\.hero-rise\s*\{\s*animation:\s*none/);
  });

  test("the role line has no control of its own", () => {
    render(<Hero />);
    const roleBlock = document.querySelector("[data-hero-role]")
      ?.parentElement as HTMLElement;
    expect(within(roleBlock).queryAllByRole("button")).toHaveLength(0);
  });

  test("the hidden width sizer uses the visible role's type size, so the line keeps its width as roles change", () => {
    render(<Hero />);
    const visible = document.querySelector("[data-hero-role]") as HTMLElement;
    const sizer = document.querySelector(
      "[data-hero-role]"
    )?.parentElement?.querySelector("[aria-hidden='true']") as HTMLElement;
    for (const cls of ["text-xl", "sm:text-2xl", "md:text-3xl", "lg:text-4xl", "font-medium"]) {
      expect(visible).toHaveClass(cls);
      expect(sizer).toHaveClass(cls);
    }
    expect(visible).toHaveClass("text-muted");
    expect([...sizer.children].map((c) => c.textContent)).toEqual(profile.roles);
  });

  test("the hero is a labelled section, not a section with a redundant region role", () => {
    render(<Hero />);
    const hero = screen.getByRole("region", { name: "Introduction" });
    expect(hero.tagName).toBe("SECTION");
    expect(hero).not.toHaveAttribute("role");
  });

  test("renders the role below the headline and above the about line", () => {
    render(<Hero />);
    const role = rotatingRole("Cloud Engineer");
    const heading = screen.getByRole("heading", { level: 1 });
    const about = screen.getByText(profile.about);
    follows(heading, role);
    follows(role, about);
  });

  test("the first role is on screen in the static HTML, not waiting for a script to fade it in", () => {
    render(<Hero />);
    const style = roleNode()?.getAttribute("style") ?? "";
    expect(style).not.toMatch(/opacity:\s*0\b/);
    expect(style).not.toMatch(/translateY\((?!0)/);
  });

  test("renders one hero panel without carousel controls", () => {
    render(<Hero />);
    expect(
      screen.queryAllByRole("button", { name: /Go to slide/ })
    ).toHaveLength(0);
    expect(
      screen.getByRole("region", { name: "Introduction" })
    ).not.toHaveAttribute("aria-roledescription", "carousel");
  });

  test("moves to the next role after each hold, finishing the exit before the next one arrives", async () => {
    useFakeClock();
    render(<Hero />);
    const first = roleNode();

    await act(async () => {
      vi.advanceTimersByTime(HOLD);
    });
    expect(roleNode()).toBe(first);
    expect(activeRoles()).toHaveLength(1);
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(EXIT - 1);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(roleNode()).not.toBe(first);
    expect(activeRoles()).toHaveLength(1);
    expect(rotatingRole("DevOps Engineer")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(STEP);
    });
    expect(rotatingRole("Site Reliability Engineer")).toBeInTheDocument();
    expect(queryRotatingRole("DevOps Engineer")).not.toBeInTheDocument();
  });

  test("each new role rolls in from below, vertically only", async () => {
    useFakeClock();
    render(<Hero />);
    await act(async () => {
      vi.advanceTimersByTime(STEP);
    });
    const second = roleNode();
    expect(enterOffset(second, "Y")).toBeGreaterThan(0);
    expect(enterOffset(second, "X")).toBeNull();
    expect(second?.getAttribute("style") ?? "").not.toMatch(/translateX/);
  });

  test("keeps going round without end through every role: after the last one the first comes back, one role every three seconds", async () => {
    useFakeClock();
    render(<Hero />);
    const roles = profile.roles;
    expect(roles).toContain("System Administrator");
    expect(roles).toContain("AI Engineer");
    const steps = roles.length * 2 + 1;
    const seen: string[] = [];
    for (let i = 0; i < steps; i++) {
      await act(async () => {
        vi.advanceTimersByTime(STEP);
      });
      seen.push(roleNode()?.textContent ?? "");
      expect(activeRoles()).toHaveLength(1);
    }
    expect(seen).toEqual(
      Array.from({ length: steps }, (_, i) => roles[(i + 1) % roles.length])
    );
    // two full laps and one more: every role was shown, the first came back, and it is still running
    expect(new Set(seen)).toEqual(new Set(roles));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "Fa'iq Haidar Prasetya" })
    ).toBeInTheDocument();
  });

  test("clears its timers on unmount without errors", () => {
    useFakeClock();
    const { unmount } = render(<Hero />);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    expect(() => unmount()).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });

  test("keeps the first role static for reduced motion, with no timers at all", async () => {
    useFakeClock();
    preferReducedMotion();
    render(<Hero />);
    expect(vi.getTimerCount()).toBe(0);
    await act(async () => {
      vi.advanceTimersByTime(30_000);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
    expect(queryRotatingRole("DevOps Engineer")).not.toBeInTheDocument();
  });

  test("holds still while the tab is hidden, then starts its pass when the tab is shown", async () => {
    useFakeClock();
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    render(<Hero />);
    expect(vi.getTimerCount()).toBe(0);
    await act(async () => {
      vi.advanceTimersByTime(STEP * 5);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
    expect(queryRotatingRole("DevOps Engineer")).not.toBeInTheDocument();

    hidden.mockReturnValue(false);
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await act(async () => {
      vi.advanceTimersByTime(HOLD - 1);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(1 + EXIT);
    });
    expect(rotatingRole("DevOps Engineer")).toBeInTheDocument();
  });

  test("pauses the countdown when the tab is hidden mid-hold, and gives the role a full hold again on return", async () => {
    useFakeClock();
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    render(<Hero />);
    await act(async () => {
      vi.advanceTimersByTime(HOLD - 100);
    });
    hidden.mockReturnValue(true);
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await act(async () => {
      vi.advanceTimersByTime(HOLD * 4);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();

    hidden.mockReturnValue(false);
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await act(async () => {
      vi.advanceTimersByTime(HOLD - 1);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
  });
});
