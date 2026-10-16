import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Projects } from "./Projects";

afterEach(() => {
  vi.restoreAllMocks();
});

function setScroll(
  el: HTMLElement,
  metrics: { scrollWidth: number; clientWidth: number; scrollLeft: number }
) {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(el, key, { value, configurable: true });
  }
  el.dispatchEvent(new Event("scroll"));
}

describe("Projects", () => {
  test("uses the section label as the only heading", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projects" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toHaveClass(
      "text-4xl",
      "md:text-5xl",
      "text-center"
    );
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(
      screen.queryByText("Kenali projectku lebih dalam.")
    ).not.toBeInTheDocument();
  });

  test("has no description paragraph under the heading", () => {
    render(<Projects />);
    expect(
      screen.queryByText(/I'm building a few things in the cloud/)
    ).not.toBeInTheDocument();
    const heading = screen.getByRole("heading", { name: "Projects" });
    expect(heading.nextElementSibling).toBeNull();
  });

  test("fades the heading in on scroll like every other section", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { name: "Projects" }).parentElement
    ).toHaveAttribute("data-reveal");
  });

  test("renders five coming-soon islands in a horizontal snap scroller", () => {
    const { container } = render(<Projects />);
    const scroller = container.querySelector("[data-gallery]") as HTMLElement;
    expect(scroller).toHaveClass("overflow-x-auto", "snap-x", "snap-mandatory");
    // overflow-x-auto alone computes overflow-y to auto, and the card reveal overflows the box vertically, so the
    // gallery would briefly scroll vertically and swallow the page wheel. overflow-y-hidden pins it to horizontal.
    expect(scroller).toHaveClass("overflow-y-hidden");
    const list = within(scroller).getByRole("list", {
      name: "Upcoming projects",
    });
    const cards = within(list).getAllByRole("listitem");
    expect(cards).toHaveLength(5);
    for (const card of cards) {
      expect(card).toHaveTextContent("Coming soon");
      expect(card).toHaveClass("snap-start", "shrink-0", "h-[440px]");
      expect(card).toHaveAttribute("data-gallery-card");
      // The layout's noscript rule keys on data-reveal, so cards stay visible without JS.
      expect(card).toHaveAttribute("data-reveal");
    }
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  test("each island has a distinct accessible name for screen readers", () => {
    render(<Projects />);
    const cards = screen.getAllByRole("listitem");
    expect(cards[0]).toHaveTextContent("Project 1: Coming soon");
    expect(cards[4]).toHaveTextContent("Project 5: Coming soon");
  });

  test("the scroller is a named, keyboard-focusable region", () => {
    render(<Projects />);
    const region = screen.getByRole("region", { name: "Projects gallery" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveAttribute("data-gallery");
  });

  test("keeps the standard padding rhythm like every other section", () => {
    render(<Projects />);
    expect(document.getElementById("projects")).toHaveClass("py-24");
    expect(document.getElementById("projects")).toHaveClass("md:py-32");
  });

  test("leaves the same 64px under its heading as SectionHeading (mb-16) does", () => {
    const { container } = render(<Projects />);
    const scroller = container.querySelector("[data-gallery]") as HTMLElement;
    expect(scroller).toHaveClass("mt-16");
    expect(scroller).not.toHaveClass("mt-12");
  });

  test("gallery arrows exist with the left one disabled at the start", () => {
    render(<Projects />);
    expect(
      screen.getByRole("button", { name: "Scroll projects left" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Scroll projects right" })
    ).toBeInTheDocument();
  });

  test("the right arrow reads enabled on mount, before any scroll event, when the gallery overflows", () => {
    // Mock overflow before render, so the mount-time snapshot already sees it; no scroll/resize event fires here.
    const proto = HTMLElement.prototype;
    const real = {
      scrollWidth: Object.getOwnPropertyDescriptor(proto, "scrollWidth"),
      clientWidth: Object.getOwnPropertyDescriptor(proto, "clientWidth"),
      scrollLeft: Object.getOwnPropertyDescriptor(proto, "scrollLeft"),
    };
    Object.defineProperty(proto, "scrollWidth", { configurable: true, get() { return this.hasAttribute("data-gallery") ? 2000 : 0; } });
    Object.defineProperty(proto, "clientWidth", { configurable: true, get() { return this.hasAttribute("data-gallery") ? 500 : 0; } });
    Object.defineProperty(proto, "scrollLeft", { configurable: true, get() { return 0; } });
    try {
      render(<Projects />);
      expect(
        screen.getByRole("button", { name: "Scroll projects right" })
      ).toBeEnabled();
    } finally {
      for (const [key, d] of Object.entries(real)) {
        if (d) Object.defineProperty(proto, key, d);
      }
    }
  });

  test("right arrow scrolls the gallery by one card", async () => {
    const user = userEvent.setup();
    const { container } = render(<Projects />);
    const scroller = container.querySelector("[data-gallery]") as HTMLElement;
    setScroll(scroller, { scrollWidth: 2000, clientWidth: 500, scrollLeft: 0 });
    const next = screen.getByRole("button", { name: "Scroll projects right" });
    await waitFor(() => expect(next).toBeEnabled());
    const scrollBy = vi.fn();
    scroller.scrollBy = scrollBy;
    await user.click(next);
    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect(scrollBy.mock.calls[0][0].left).toBeGreaterThan(0);
    expect(scrollBy.mock.calls[0][0].behavior).toBe("smooth");
  });

  test("left arrow scrolls back once the gallery has moved", async () => {
    const user = userEvent.setup();
    const { container } = render(<Projects />);
    const scroller = container.querySelector("[data-gallery]") as HTMLElement;
    setScroll(scroller, {
      scrollWidth: 2000,
      clientWidth: 500,
      scrollLeft: 400,
    });
    const prev = screen.getByRole("button", { name: "Scroll projects left" });
    await waitFor(() => expect(prev).toBeEnabled());
    const scrollBy = vi.fn();
    scroller.scrollBy = scrollBy;
    await user.click(prev);
    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect(scrollBy.mock.calls[0][0].left).toBeLessThan(0);
  });

  test("arrows scroll without smooth animation under reduced motion", async () => {
    const originalMatchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...originalMatchMedia(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    }));
    const user = userEvent.setup();
    const { container } = render(<Projects />);
    const scroller = container.querySelector("[data-gallery]") as HTMLElement;
    setScroll(scroller, { scrollWidth: 2000, clientWidth: 500, scrollLeft: 0 });
    const next = screen.getByRole("button", { name: "Scroll projects right" });
    await waitFor(() => expect(next).toBeEnabled());
    const scrollBy = vi.fn();
    scroller.scrollBy = scrollBy;
    await user.click(next);
    expect(scrollBy.mock.calls[0][0].behavior).toBe("auto");
  });

  test("the snap-aligned card never animates: the transform lives on its child, so the snap point cannot jump", () => {
    const { container } = render(<Projects />);
    for (const li of container.querySelectorAll("[data-gallery-card]")) {
      expect(li.getAttribute("style") ?? "").not.toMatch(/transform|opacity/);
      expect(li.firstElementChild?.getAttribute("style") ?? "").toMatch(/opacity|transform/);
    }
  });

  test("cards start hidden and rise 12px, inside the scroller's padding headroom so nothing clips", () => {
    render(<Projects />);
    const style = screen.getAllByRole("listitem")[0].firstElementChild?.getAttribute("style");
    expect(style).toContain("opacity: 0");
    expect(style).toContain("translateY(12px)");
    expect(style ?? "").not.toContain("scale");
  });

  test("under reduced motion cards paint the same hidden first frame (matches the server HTML); the fade-only change lives in the transition", () => {
    const { unmount } = render(<Projects />);
    const normal = screen
      .getAllByRole("listitem")
      .map((card) => card.firstElementChild?.getAttribute("style"));
    unmount();
    const originalMatchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...originalMatchMedia(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    }));
    render(<Projects />);
    expect(
      screen.getAllByRole("listitem").map((card) => card.firstElementChild?.getAttribute("style"))
    ).toEqual(normal);
  });
});
