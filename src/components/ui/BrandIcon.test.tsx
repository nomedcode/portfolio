import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { iconFills } from "@/lib/iconColor";
import { getSkillIcon } from "@/lib/skillIcons";
import { BrandIcon } from "./BrandIcon";

describe("BrandIcon", () => {
  test("paints a per-theme fill through CSS variables instead of inverting dark logos", () => {
    const icon = getSkillIcon("prisma")!;
    const { container } = render(<BrandIcon icon={icon} className="h-7 w-7" />);
    const svg = container.querySelector("svg") as SVGElement;
    const fills = iconFills(icon.hex);
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("h-7", "w-7", "fill-(--icon-l)", "dark:fill-(--icon-d)");
    expect(svg).not.toHaveClass("dark:invert");
    expect(svg.style.getPropertyValue("--icon-l")).toBe(fills.light);
    expect(svg.style.getPropertyValue("--icon-d")).toBe(fills.dark);
    // an explicit fill on the path would beat the inherited variable
    expect(svg.querySelector("path")).not.toHaveAttribute("fill");
    expect(svg.querySelector("path")).toHaveAttribute("d", icon.path);
    // an ordinary brand colour needs no rim or tile
    expect(svg).not.toHaveClass("stroke-(--icon-rim)");
    expect(svg.querySelector("rect")).toBeNull();
  });

  test("JavaScript keeps its yellow on light: ink glyphs from a tile behind the cut-out, no olive", () => {
    const icon = getSkillIcon("javascript")!;
    const { container } = render(<BrandIcon icon={icon} className="h-7 w-7" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.getPropertyValue("--icon-l")).toBe("#f7df1e");
    expect(svg.style.getPropertyValue("--icon-d")).toBe("#f7df1e");
    expect(svg).toHaveClass("stroke-(--icon-rim)", "dark:stroke-transparent");
    expect(svg.style.getPropertyValue("--icon-rim")).toBe(iconFills("F7DF1E").rim);
    // the simple-icons path cuts "JS" out of the square; an ink tile behind it shows through as the letters
    const tile = svg.querySelector("rect") as SVGRectElement;
    expect(tile).not.toBeNull();
    expect(tile).toHaveAttribute("fill", iconFills("F7DF1E").rim);
    expect(svg.firstElementChild).toBe(tile);
    expect(svg.querySelector("path")).not.toHaveAttribute("fill");
  });

  test("Hugging Face keeps its yellow on light with an ink outline and no tile", () => {
    const icon = getSkillIcon("huggingface")!;
    const { container } = render(<BrandIcon icon={icon} className="h-4 w-4" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.getPropertyValue("--icon-l")).toBe("#ffd21e");
    expect(svg).toHaveClass("stroke-(--icon-rim)", "dark:stroke-transparent");
    const path = svg.querySelector("path") as SVGPathElement;
    // the stroke goes under the fill, so only its outer half shows as a rim
    expect(path).toHaveAttribute("paint-order", "stroke");
    expect(path).toHaveAttribute("stroke-width");
    expect(svg.querySelector("rect")).toBeNull();
  });
});
