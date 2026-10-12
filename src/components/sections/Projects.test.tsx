import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Projects } from "./Projects";

describe("Projects", () => {
  test("uses the section label as the only section heading", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Projects" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toHaveClass(
      "text-4xl",
      "md:text-5xl",
      "text-center"
    );
    expect(
      screen.queryByRole("heading", { name: "Portfolio" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Kenali projectku lebih dalam.")
    ).not.toBeInTheDocument();
  });

  test("shows a coming-soon placeholder instead of the old gallery", () => {
    render(<Projects />);
    expect(
      screen.getByText(/coming soon/i, { selector: "h3" })
    ).toBeInTheDocument();
    expect(screen.getByText("Work In Progress")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Scroll projects/ })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  test("keeps the standard padding rhythm like every other section", () => {
    render(<Projects />);
    expect(document.getElementById("projects")).toHaveClass("py-24");
    expect(document.getElementById("projects")).toHaveClass("md:py-32");
  });
});
