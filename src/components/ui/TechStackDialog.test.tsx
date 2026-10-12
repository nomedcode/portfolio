import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { TechStackDialog } from "./TechStackDialog";

type Box = { left: number; top: number; width: number; height: number };

function mockBoxes(opener: Box, dialog: Box) {
  return vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      const box =
        this.getAttribute("role") === "dialog"
          ? dialog
          : this.getAttribute("data-test-opener") !== null
            ? opener
            : { left: 0, top: 0, width: 0, height: 0 };
      return {
        ...box,
        x: box.left,
        y: box.top,
        right: box.left + box.width,
        bottom: box.top + box.height,
        toJSON: () => ({}),
      } as DOMRect;
    });
}

function mockReducedMotion() {
  const original = window.matchMedia;
  return vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    ...original(query),
    matches: query === "(prefers-reduced-motion: reduce)",
  }));
}

let opener: HTMLButtonElement | null = null;

function renderDialog() {
  opener = document.createElement("button");
  opener.setAttribute("data-test-opener", "");
  document.body.appendChild(opener);
  render(
    <TechStackDialog onClose={() => {}} returnFocusRef={{ current: opener }} />
  );
  return { opener, dialog: screen.getByRole("dialog") };
}

afterEach(() => {
  cleanup();
  opener?.remove();
  opener = null;
  vi.restoreAllMocks();
});

describe("TechStackDialog motion", () => {
  test("opens from the Skills card: it scales out of the card's position", () => {
    mockBoxes(
      { left: 100, top: 700, width: 600, height: 200 },
      { left: 200, top: 100, width: 800, height: 600 }
    );
    const { dialog } = renderDialog();
    // card centre (400, 800) minus dialog corner (200, 100)
    expect(dialog.style.transformOrigin).toBe("200px 700px");
    expect(dialog.getAttribute("style")).toContain("scale(0.85)");
    expect(dialog.getAttribute("style")).toContain("opacity: 0");
  });

  test("keeps the origin within half a dialog of its box when the card is far away", () => {
    mockBoxes(
      { left: 100, top: 5000, width: 600, height: 200 },
      { left: 200, top: 100, width: 800, height: 600 }
    );
    const { dialog } = renderDialog();
    expect(dialog.style.transformOrigin).toBe("200px 900px");
  });

  test("under reduced motion the dialog and its backdrop only fade, with no origin", () => {
    mockBoxes(
      { left: 100, top: 700, width: 600, height: 200 },
      { left: 200, top: 100, width: 800, height: 600 }
    );
    mockReducedMotion();
    const { dialog } = renderDialog();
    expect(dialog.style.transformOrigin).toBe("");
    const style = dialog.getAttribute("style") ?? "";
    expect(style).toContain("opacity: 0");
    expect(style).not.toMatch(/transform|translate|scale/);
  });
});
