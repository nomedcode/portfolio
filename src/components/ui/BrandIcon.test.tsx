import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { iconFills } from "@/lib/iconColor";
import { getSkillIcon } from "@/lib/skillIcons";
import { BrandIcon } from "./BrandIcon";

describe("BrandIcon", () => {
  test("paints a per-theme fill through CSS variables instead of inverting dark logos", () => {
    // a single-colour mark: one path, no fill of its own, so the theme variables reach it
    const icon = getSkillIcon("ollama")!;
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

  test("a monochrome devicon mark drops its fill, so the theme can invert it, and keeps the devicon grid", () => {
    const icon = getSkillIcon("vercel")!;
    const { container } = render(<BrandIcon icon={icon} />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toHaveAttribute("viewBox", "0 0 128 128");
    expect(svg).toHaveClass("fill-(--icon-l)");
    expect(svg.querySelector("path")).not.toHaveAttribute("fill");
  });

  test("a multi-colour mark paints one path per layer in its own colour, with no theme variables", () => {
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
    expect(svg).toHaveAttribute("viewBox", "0 0 128 128");
    expect(svg).toHaveClass("h-7", "w-7");
    expect(svg).not.toHaveClass("fill-(--icon-l)");
    expect(svg.style.getPropertyValue("--icon-l")).toBe("");
  });

  test("a mark with gradients draws them, including the one radial, and carries layer opacity", () => {
    const icon = getSkillIcon("python")!;
    const { container } = render(<BrandIcon icon={icon} />);
    const svg = container.querySelector("svg") as SVGElement;
    const linear = [...svg.querySelectorAll("linearGradient")];
    const radial = [...svg.querySelectorAll("radialGradient")];
    expect(linear).toHaveLength(2);
    expect(radial).toHaveLength(1);
    // the ids match the ones the paths reference
    for (const gradient of [...linear, ...radial]) {
      expect(svg.querySelector(`[fill="url(#${gradient.id})"]`)).not.toBeNull();
    }
    // the shadow path carries its own opacity
    const shadow = svg.querySelector('path[fill="url(#python-2)"]') as SVGPathElement;
    expect(shadow.getAttribute("opacity")).toBeTruthy();
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
