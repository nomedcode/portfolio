import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { education } from "@/lib/content";
import { Education } from "./Education";

describe("Education", () => {
  test("uses the section label as the only section heading", () => {
    render(<Education />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Education" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Education" })).toHaveClass(
      "text-4xl",
      "md:text-5xl"
    );
    expect(
      screen.queryByRole("heading", { name: "Pendidikan" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Fondasinya.")).not.toBeInTheDocument();
  });

  test("renders every entry's degree, school, and period", () => {
    render(<Education />);
    for (const e of education) {
      expect(screen.getByText(e.degree)).toBeInTheDocument();
      expect(screen.getByText(e.school)).toBeInTheDocument();
      expect(screen.getAllByText(e.period).length).toBeGreaterThan(0);
    }
  });

  test("renders GPA when present and every coursework chip", () => {
    render(<Education />);
    const withGpa = education.filter((e) => e.gpa);
    for (const e of withGpa) {
      expect(screen.getByText(`GPA ${e.gpa}`)).toBeInTheDocument();
    }
    for (const c of education.flatMap((e) => e.coursework)) {
      expect(screen.getByText(c)).toBeInTheDocument();
    }
  });
});
