import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { iconFills } from "@/lib/iconColor";
import { getSkillIcon } from "@/lib/skillIcons";
import { BrandIcon } from "./BrandIcon";

describe("BrandIcon", () => {
  test("paints a per-theme fill through CSS variables instead of inverting dark logos", () => {
    const icon = getSkillIcon("nextdotjs")!;
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

  test("a Simple Icons mark is drawn on the default 24 unit grid with the default fill rule", () => {
    const icon = getSkillIcon("langflow")!;
    const { container } = render(<BrandIcon icon={icon} />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg.querySelector("path")).not.toHaveAttribute("fill-rule");
  });

  test("a multi-colour mark paints one path per layer in its own fixed colour, with no theme variables", () => {
    const icon = getSkillIcon("googlecloud")!;
    const { container } = render(<BrandIcon icon={icon} className="h-7 w-7" />);
    const svg = container.querySelector("svg") as SVGElement;
    const paths = [...svg.querySelectorAll("path")];
    expect(paths.map((p) => p.getAttribute("fill"))).toEqual(
      icon.layers!.map((l) => l.fill)
    );
    expect(paths.map((p) => p.getAttribute("d"))).toEqual(
      icon.layers!.map((l) => l.path)
    );
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveClass("h-7", "w-7");
    expect(svg).not.toHaveClass("fill-(--icon-l)");
    expect(svg.style.getPropertyValue("--icon-l")).toBe("");
  });

  test("a mark with its own grid and holes keeps both, still painted by the theme variables", () => {
    const icon = getSkillIcon("kiro")!;
    const { container } = render(<BrandIcon icon={icon} className="h-4 w-4" />);
    const svg = container.querySelector("svg") as SVGElement;
    const fills = iconFills(icon.hex);
    expect(svg).toHaveAttribute("viewBox", icon.viewBox);
    expect(svg.querySelector("path")).toHaveAttribute("fill-rule", "evenodd");
    expect(svg.querySelector("path")).not.toHaveAttribute("fill");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.style.getPropertyValue("--icon-l")).toBe(fills.light);
    expect(svg.style.getPropertyValue("--icon-d")).toBe(fills.dark);
  });
});
