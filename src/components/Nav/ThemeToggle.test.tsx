import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.clear();
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

  test("reflects an already-dark document as pressed", async () => {
    document.documentElement.classList.add("dark");
    const { rerender } = render(<ThemeToggle />);
    await Promise.resolve();
    rerender(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Toggle dark mode" })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
