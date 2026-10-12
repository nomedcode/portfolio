import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { profile } from "@/lib/content";
import { Hero } from "./Hero";

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

function enterOffset(el: Element | null) {
  const style = el?.getAttribute("style") ?? "";
  const match = style.match(/translateY\(([-\d.]+)px\)/);
  return match ? Number(match[1]) : null;
}

function enteredFromBelow(el: Element | null) {
  const offset = enterOffset(el);
  return offset === null || offset > 0;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Hero", () => {
  test("introduces the full name with one rotating role paragraph", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Hi, I'm Fa'iq Haidar Prasetya",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveAttribute(
      "aria-live"
    );
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
    expect(document.querySelector("p[data-hero-role]")).not.toHaveAttribute(
      "aria-live"
    );
    expect(
      screen.getByRole("button", { name: "Learn more" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Learn more" }).querySelector(
        "svg.lucide-arrow-down"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("LEARN MORE", { selector: "p" })).toBeInTheDocument();
    expect(screen.queryByText("Scroll", { exact: true })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pause role rotation" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Future", { exact: true })).not.toBeInTheDocument();
    expect(
      screen.queryByText("Bandung, Indonesia", { exact: true })
    ).not.toBeInTheDocument();
  });

  test("grows past the viewport on short screens and reserves room for its controls", () => {
    render(<Hero />);
    const hero = screen.getByRole("region", { name: "Introduction" });
    expect(hero).toHaveClass("min-h-svh");
    expect(hero).not.toHaveClass("h-svh");
    expect(hero.querySelector("[data-hero-content]")).toHaveClass("pb-32");
  });

  test("rises in on load: portrait, then headline, role and about line", () => {
    render(<Hero />);
    const portrait = document.querySelector("[data-hero-portrait]") as HTMLElement;
    const heading = screen.getByRole("heading", { level: 1 });
    const roleBlock = document.querySelector("[data-hero-role]")
      ?.parentElement as HTMLElement;
    const about = screen.getByText(profile.about);
    for (const el of [portrait, heading, roleBlock, about]) {
      expect(el).toHaveClass("hero-rise");
    }
    expect(portrait).not.toHaveClass("[animation-delay:100ms]");
    expect(heading).toHaveClass("[animation-delay:100ms]");
    expect(roleBlock).toHaveClass("[animation-delay:200ms]");
    expect(about).toHaveClass("[animation-delay:300ms]");
  });

  test("shows the photo in a round frame above the headline when one is provided", () => {
    render(<Hero photo="/photo.png" />);
    const img = screen.getByRole("img", {
      name: "Portrait of Fa'iq Haidar Prasetya",
    });
    expect(img.getAttribute("src")).toContain("photo.png");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveClass("object-cover");
    const frame = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(frame).toContainElement(img);
    expect(frame).toHaveClass("rounded-full", "overflow-hidden");
    follows(frame, screen.getByRole("heading", { level: 1 }));
  });

  test("without a photo it shows a decorative initials placeholder in the same frame", () => {
    render(<Hero />);
    const frame = document.querySelector("[data-hero-portrait]") as HTMLElement;
    expect(frame).toHaveClass("rounded-full", "overflow-hidden");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    const initials = within(frame).getByText("FP");
    expect(initials).toHaveAttribute("aria-hidden", "true");
  });

  test("hero-rise is a CSS animation that reduced motion switches off", () => {
    const css = readFileSync(
      path.resolve(__dirname, "../../app/globals.css"),
      "utf8"
    );
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

  test("places the LEARN MORE label above the arrow-down button", () => {
    render(<Hero />);
    const label = screen.getByText("LEARN MORE", { selector: "p" });
    const button = screen.getByRole("button", { name: "Learn more" });
    expect(
      label.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test("renders the rotating role below the headline and above the about line", () => {
    render(<Hero />);
    const role = rotatingRole("Cloud Engineer");
    const heading = screen.getByRole("heading", { level: 1 });
    const about = screen.getByText(profile.about);
    follows(heading, role);
    follows(role, about);
  });

  test("brings each new role in from below on a fresh node, never overlapping the last", async () => {
    vi.useFakeTimers({
      toFake: [
        "setInterval",
        "clearInterval",
        "setTimeout",
        "clearTimeout",
        "requestAnimationFrame",
        "cancelAnimationFrame",
      ],
    });
    render(<Hero />);
    const first = roleNode();
    expect(first).not.toBeNull();
    expect(enterOffset(first)).toBe(24);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(roleNode()).toBe(first);
    expect(activeRoles()).toHaveLength(1);
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(450);
    });
    const second = roleNode();
    expect(second).not.toBe(first);
    expect(activeRoles()).toHaveLength(1);
    expect(rotatingRole("DevOps Engineer")).toBeInTheDocument();
    expect(enteredFromBelow(second)).toBe(true);
  });

  test("renders one hero panel without carousel controls", () => {
    render(<Hero />);
    expect(
      screen.queryAllByRole("button", { name: /Go to slide/ })
    ).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: "Previous slide" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next slide" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Introduction" })
    ).not.toHaveAttribute("aria-roledescription", "carousel");
  });

  test("cycles roles while the accessible heading and the hero stay stable", async () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
    });
    const { container } = render(<Hero />);
    const hero = container.querySelector("[data-hero-inner]");
    const heading = screen.getByRole("heading", { level: 1 });
    for (const [position, role] of [
      "DevOps Engineer",
      "Site Reliability Engineer",
      "Cloud Engineer",
    ].entries()) {
      await act(async () => {
        vi.advanceTimersByTime(position === 0 ? 3000 : 2550);
      });
      expect(activeRoles()).toHaveLength(1);
      if (position > 0) {
        expect(
          rotatingRole(
            position === 1 ? "DevOps Engineer" : "Site Reliability Engineer"
          )
        ).toBeInTheDocument();
      }
      expect(queryRotatingRole(role)).not.toBeInTheDocument();
      await act(async () => {
        vi.advanceTimersByTime(450);
      });
      expect(rotatingRole(role)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: "Hi, I'm Fa'iq Haidar Prasetya",
        })
      ).toBe(heading);
      expect(hero?.contains(heading)).toBe(true);
    }
  });

  test("finishes the outgoing role before entering the next role", async () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
    });
    render(<Hero />);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(activeRoles()).toHaveLength(1);
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(449);
    });
    expect(activeRoles()).toHaveLength(1);
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(activeRoles()).toHaveLength(1);
    expect(rotatingRole("DevOps Engineer")).toBeInTheDocument();
  });

  test("pause control stops role rotation and play resumes it", async () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
    });
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: "Pause role rotation" }));
    await act(async () => {
      vi.advanceTimersByTime(9000);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Play role rotation" }));
    await act(async () => {
      vi.advanceTimersByTime(3450);
    });
    expect(rotatingRole("DevOps Engineer")).toBeInTheDocument();
  });

  test("clears its role rotation interval on unmount without errors", () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
    });
    const { unmount } = render(<Hero />);
    expect(() => unmount()).not.toThrow();
  });

  test("keeps the first role static and hides rotation controls for reduced motion", async () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
    });
    const originalMatchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...originalMatchMedia(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    }));
    render(<Hero />);
    expect(
      screen.queryByRole("button", { name: /role rotation/ })
    ).not.toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(9000);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
    expect(
      screen.queryByText("DevOps Engineer", { selector: "[data-hero-role-text]" })
    ).not.toBeInTheDocument();
  });

  test("does not advance while the tab is hidden and resumes without skipping roles", async () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
    });
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    render(<Hero />);
    await act(async () => {
      vi.advanceTimersByTime(9000);
    });
    expect(rotatingRole("Cloud Engineer")).toBeInTheDocument();
    expect(
      screen.queryByText("DevOps Engineer", { selector: "[data-hero-role-text]" })
    ).not.toBeInTheDocument();
    hidden.mockReturnValue(false);
    await act(async () => {
      vi.advanceTimersByTime(3450);
    });
    expect(rotatingRole("DevOps Engineer")).toBeInTheDocument();
  });
});
