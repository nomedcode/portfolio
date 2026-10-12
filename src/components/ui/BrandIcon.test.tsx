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
  });
});
