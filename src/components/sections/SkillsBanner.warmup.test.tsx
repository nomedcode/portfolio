import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const probe = vi.hoisted(() => ({ loaded: 0 }));

class FakeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// A fresh module registry and a fresh mock per test, so every trigger starts from "chunk not requested yet".
// (vi.resetModules alone keeps the cached mock result, so the factory would not run, and count, a second time.)
// The factory runs when the module is first imported, so the counter shows when the chunk is requested.
async function freshBanner() {
  probe.loaded = 0;
  vi.resetModules();
  vi.doUnmock("@/components/ui/TechStackDialog");
  vi.doMock("@/components/ui/TechStackDialog", () => {
    probe.loaded += 1;
    return { TechStackDialog: () => null };
  });
  const { SkillsBanner } = await import("./SkillsBanner");
  render(<SkillsBanner />);
  return screen.getByRole("button", { name: "View all skills" });
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", FakeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// The fourth trigger, the icon cloud scrolling into view (onViewportEnter), needs framer's viewport feature and a real
// IntersectionObserver; it is checked in a real browser instead of here.
describe("Skills dialog chunk", () => {
  test("is not requested while the page is idle", async () => {
    await freshBanner();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(probe.loaded).toBe(0);
  });

  test("is requested when the pointer reaches the card, before any click", async () => {
    const opener = await freshBanner();
    fireEvent.pointerEnter(opener);
    await vi.waitFor(() => expect(probe.loaded).toBe(1));
  });

  test("is requested when the card takes keyboard focus", async () => {
    const opener = await freshBanner();
    fireEvent.focus(opener);
    await vi.waitFor(() => expect(probe.loaded).toBe(1));
  });

  test("is requested on touch press, where there is no hover", async () => {
    const opener = await freshBanner();
    fireEvent.pointerDown(opener);
    await vi.waitFor(() => expect(probe.loaded).toBe(1));
  });
});
