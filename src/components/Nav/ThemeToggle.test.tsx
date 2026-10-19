import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark", "theme-fade");
    document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
    window.localStorage.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("renders a toggle button with an accessible name", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Toggle dark mode" })
    ).toBeInTheDocument();
  });

  test("toggles the dark class on html and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Toggle dark mode" });

    await user.click(btn);
    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    await user.click(btn);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(window.localStorage.getItem("theme")).toBe("light");
  });

  test("repaints the browser chrome with the page, not the OS", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Toggle dark mode" });

    await user.click(btn);
    expect(
      document.head.querySelector('meta[name="theme-color"]')
    ).toHaveAttribute("content", "#121212");

    await user.click(btn);
    expect(
      document.head.querySelector('meta[name="theme-color"]')
    ).toHaveAttribute("content", "#ffffff");
    expect(document.head.querySelectorAll('meta[name="theme-color"]')).toHaveLength(1);
  });

  test("reflects an already-dark document as pressed", async () => {
    document.documentElement.classList.add("dark");
    const { rerender } = render(<ThemeToggle />);
    await Promise.resolve();
    rerender(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Toggle dark mode" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("fades colours across the switch instead of cutting, then lets go of the transition rule", () => {
    vi.useFakeTimers();
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle dark mode" }));
    expect(document.documentElement).toHaveClass("dark", "theme-fade");
    vi.advanceTimersByTime(300);
    expect(document.documentElement).not.toHaveClass("theme-fade");
    expect(document.documentElement).toHaveClass("dark");
  });

  test("a second press before the fade ends does not leave the fade class stuck", () => {
    vi.useFakeTimers();
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Toggle dark mode" });
    fireEvent.click(btn);
    vi.advanceTimersByTime(100);
    fireEvent.click(btn);
    vi.advanceTimersByTime(300);
    expect(document.documentElement).not.toHaveClass("theme-fade");
  });

  test("two presses before the observer re-renders still persist the final theme", () => {
    // The MutationObserver callback has not run between these clicks, so `dark` is still the render-time value.
    // Persisting from that closure writes the opposite of the class that is actually on <html>.
    vi.useFakeTimers();
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Toggle dark mode" });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(document.documentElement).not.toHaveClass("dark");
    expect(window.localStorage.getItem("theme")).toBe("light");
  });

  test("reduced motion switches themes at once, with no fade class", () => {
    vi.useFakeTimers();
    const original = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...original(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    }));
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Toggle dark mode" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("theme-fade");
  });});
