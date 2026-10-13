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

  test("the headline is just the name, with no greeting", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/^Fa'iq Haidar Prasetya$/);
    expect(h1.textContent).toBe(profile.fullName);
    expect(screen.queryByText(/Hi, I/)).not.toBeInTheDocument();
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

  test("the primary action is the one Signal Blue pill, the secondary is an outline pill", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: "Download CV" });
    const secondary = screen.getByRole("link", { name: "Contact" });
    expect(primary).toHaveClass("bg-accent", "text-white", "rounded-full", "press");
    expect(secondary).toHaveClass("border", "rounded-full", "press", "text-white");
    expect(secondary).not.toHaveClass("bg-accent");
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

  test("splits into copy on the left and the portrait on the right from md, and stacks the portrait first below it", () => {
    render(<Hero />);
    const content = document.querySelector("[data-hero-content]") as HTMLElement;
    expect(content).toHaveClass("grid");
    expect(content.className).toMatch(/md:grid-cols-\[/);
    const copy = document.querySelector("[data-hero-copy]") as HTMLElement;
    const portrait = document.querySelector("[data-hero-portrait-wrap]") as HTMLElement;
    expect(content).toContainElement(copy);
    expect(content).toContainElement(portrait);
    expect(copy).toContainElement(screen.getByRole("heading", { level: 1 }));
    expect(copy).toHaveClass("text-center", "md:text-left", "items-center", "md:items-start");
    expect(portrait).toHaveClass("max-md:order-first", "md:justify-self-end");
    // reading order stays headline first; the order utility only moves the portrait up on small screens
    follows(copy, portrait);
  });

  test("sets the headline at five sizes and balances its lines so the name breaks between words, not mid-name", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveClass(
      "font-semibold",
      "tracking-display",
      "text-balance",
      "leading-[1.05]",
      "text-[2.75rem]",
      "min-[400px]:text-5xl",
      "sm:text-6xl",
      "lg:text-7xl",
      "xl:text-[5rem]"
    );
  });

  test("rises in on load: portrait, headline, role, about line, then the actions", () => {
    render(<Hero />);
    const portrait = document.querySelector("[data-hero-portrait]") as HTMLElement;
    const heading = screen.getByRole("heading", { level: 1 });
    const roleBlock = document.querySelector("[data-hero-role]")
      ?.parentElement as HTMLElement;
    const about = screen.getByText(profile.about);
    const actions = document.querySelector("[data-hero-actions]") as HTMLElement;
    for (const el of [portrait, heading, roleBlock, about, actions]) {
      expect(el).toHaveClass("hero-rise");
    }
    expect(portrait).not.toHaveClass("[animation-delay:100ms]");
    expect(heading).toHaveClass("[animation-delay:100ms]");
    expect(roleBlock).toHaveClass("[animation-delay:200ms]");
    expect(about).toHaveClass("[animation-delay:300ms]");
    expect(actions).toHaveClass("[animation-delay:400ms]");
  });

  test("shows the photo in a round frame when one is provided, loaded first", () => {
    render(<Hero photo="/photo.png" />);
    const img = screen.getByRole("img", {
      name: "Portrait of Fa'iq Haidar Prasetya",
    });
    expect(img.getAttribute("src")).toContain("photo.png");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
    expect(img).toHaveClass("object-cover");
    const frame = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(frame).toContainElement(img);
    expect(frame).toHaveClass("rounded-full", "overflow-hidden");
  });

  test("the portrait is a large frame beside the copy from tablet up and a small one above it on a phone", () => {
    render(<Hero />);
    const frame = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(frame).toHaveClass("h-32", "w-32", "sm:h-40", "sm:w-40", "md:h-56", "md:w-56", "lg:h-72", "lg:w-72");
  });

  test("without a photo it shows a decorative initials placeholder in the same frame", () => {
    render(<Hero />);
    const frame = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(frame).toHaveClass("rounded-full", "overflow-hidden");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const initials = within(frame).getByText("FP");
    expect(initials).toHaveAttribute("aria-hidden", "true");
  });

  test("a soft blue bloom sits behind the portrait, decorative and outside the clipped frame", () => {
    render(<Hero />);
    const wrap = document.querySelector("[data-hero-portrait-wrap]") as HTMLElement;
    const frame = document.querySelector("[data-hero-portrait]") as HTMLElement;
    const glow = wrap.querySelector("[data-hero-glow]") as HTMLElement;
    expect(glow).not.toBeNull();
    expect(glow).toHaveAttribute("aria-hidden", "true");
    expect(frame).not.toContainElement(glow);
    follows(glow, frame);
    // one flat radial wash, no blur filter and no box-shadow to repaint
    expect(glow.className).toMatch(/radial-gradient/);
    expect(glow.className).not.toMatch(/blur|shadow/);
    expect(frame.className).not.toMatch(/shadow-\[/);
  });

  test("hero-rise is a CSS animation that reduced motion switches off", () => {
    expect(css).toMatch(/@keyframes hero-rise/);
    expect(css).toMatch(/\.hero-rise\s*\{[^}]*animation:[^;}]*hero-rise/);
    const reduced = css.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/
    );
    expect(reduced?.[1]).toMatch(/\.hero-rise\s*\{\s*animation:\s*none/);
  });

  test("scopes a light focus ring to the always-dark hero", () => {
    render(<Hero />);
    expect(screen.getByRole("region", { name: "Introduction" })).toHaveClass(
      "[--c-ring:#2997ff]"
    );
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
    for (const cls of ["text-xl", "md:text-2xl", "font-medium"]) {
      expect(visible).toHaveClass(cls);
      expect(sizer).toHaveClass(cls);
    }
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
    expect(style).not.toMatch(/translateX\((?!0)/);
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

  test("each new role slides in from the right, sideways only", async () => {
    useFakeClock();
    render(<Hero />);
    await act(async () => {
      vi.advanceTimersByTime(STEP);
    });
    const second = roleNode();
    expect(enterOffset(second, "X")).toBeGreaterThan(0);
    expect(enterOffset(second, "Y")).toBeNull();
    expect(second?.getAttribute("style") ?? "").not.toMatch(/translateY/);
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
