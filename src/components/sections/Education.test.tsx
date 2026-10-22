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

  test("period sits in a right-hand column on md+ while dt stays before dd in the DOM", () => {
    const { container } = render(<Education />);
    const terms = container.querySelectorAll("dt");
    for (const dt of terms) {
      expect(dt).toHaveClass("md:order-2", "md:text-right");
      const dd = dt.parentElement!.querySelector("dd");
      expect(dd).toHaveClass("md:order-1");
      expect(dt.parentElement).toHaveClass("md:grid-cols-[1fr_200px]");
      expect(dt.compareDocumentPosition(dd!)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
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

  // The longest course name cannot fit a phone-width pill on one line, so it wraps. Unbalanced, the pill
  // fills the row while the first line stays short and it reads as a stretched input box.
  test("balances the wrapped lines of a coursework chip", () => {
    render(<Education />);
    const [first] = education[0].coursework;
    expect(screen.getByText(first)).toHaveClass("text-balance");
  });
});
