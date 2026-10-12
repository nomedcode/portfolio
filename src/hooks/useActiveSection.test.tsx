import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useActiveSection } from "./useActiveSection";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback = () => {};
let options: IntersectionObserverInit | undefined;
let observed: Element[] = [];
let disconnected = false;

class FakeObserver {
  constructor(cb: Callback, opts?: IntersectionObserverInit) {
    callback = cb;
    options = opts;
  }
  observe(el: Element) {
    observed.push(el);
  }
  unobserve() {}
  disconnect() {
    disconnected = true;
  }
  takeRecords() {
    return [];
  }
}

function Probe({ ids }: { ids: readonly string[] }) {
  const active = useActiveSection(ids);
  return <output data-testid="active">{active ?? "none"}</output>;
}

const IDS = ["projects", "skills", "contact"] as const;

function mountSections() {
  for (const id of IDS) {
    const el = document.createElement("section");
    el.id = id;
    document.body.appendChild(el);
  }
}

function report(id: string, isIntersecting: boolean) {
  act(() => {
    callback([{ target: document.getElementById(id)!, isIntersecting }]);
  });
}

beforeEach(() => {
  observed = [];
  disconnected = false;
  options = undefined;
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  mountSections();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  for (const id of IDS) document.getElementById(id)?.remove();
});

describe("useActiveSection", () => {
  test("starts with no active section, so server and first client render agree", () => {
    render(<Probe ids={IDS} />);
    expect(screen.getByTestId("active")).toHaveTextContent("none");
  });

  test("watches every listed section through a thin band near the middle of the viewport", () => {
    render(<Probe ids={IDS} />);
    expect(observed.map((el) => el.id)).toEqual([...IDS]);
    // Only the section under the reading line counts, not whatever merely peeks in at an edge.
    expect(options?.rootMargin).toBe("-45% 0px -50% 0px");
  });

  test("marks the section that crosses the reading line and clears it when none does", () => {
    render(<Probe ids={IDS} />);
    report("skills", true);
    expect(screen.getByTestId("active")).toHaveTextContent("skills");
    report("skills", false);
    expect(screen.getByTestId("active")).toHaveTextContent("none");
  });

  test("when two sections touch the line at a boundary, the later one wins", () => {
    render(<Probe ids={IDS} />);
    report("projects", true);
    report("skills", true);
    expect(screen.getByTestId("active")).toHaveTextContent("skills");
    report("skills", false);
    expect(screen.getByTestId("active")).toHaveTextContent("projects");
  });

  test("skips ids that are not in the page and disconnects on unmount", () => {
    const { unmount } = render(<Probe ids={[...IDS, "missing"]} />);
    expect(observed.map((el) => el.id)).toEqual([...IDS]);
    unmount();
    expect(disconnected).toBe(true);
  });
});
