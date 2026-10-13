import type { CSSProperties } from "react";
import { iconFills } from "@/lib/iconColor";
import type { SkillIcon } from "@/lib/skillIcons";

// The fill comes from two CSS variables so the theme class switches it without re-rendering; the path carries no
// fill attribute of its own, which would beat the value inherited from the svg. A layered mark is the exception: a
// layer with its own fill keeps it in both themes, while a layer without one takes the per-theme fill. Gradient
// layers paint from the mark's own `gradients`.
export function BrandIcon({
  icon,
  className = "",
}: {
  icon: SkillIcon;
  className?: string;
}) {
  const viewBox = icon.viewBox ?? "0 0 24 24";
  if (icon.layers) {
    const themed = icon.layers.some((layer) => !layer.fill);
    const fills = iconFills(icon.hex);
    return (
      <svg
        viewBox={viewBox}
        aria-hidden="true"
        className={
          themed ? `${className} fill-(--icon-l) dark:fill-(--icon-d)` : className
        }
        style={
          themed
            ? ({ "--icon-l": fills.light, "--icon-d": fills.dark } as CSSProperties)
            : undefined
        }
      >
        {icon.gradients && (
          <defs>
            {icon.gradients.map((gradient) => (
              <linearGradient
                key={gradient.id}
                id={gradient.id}
                x1={gradient.x1}
                y1={gradient.y1}
                x2={gradient.x2}
                y2={gradient.y2}
                gradientUnits={gradient.gradientUnits}
                gradientTransform={gradient.gradientTransform}
              >
                {gradient.stops.map((stop) => (
                  <stop
                    key={`${stop.offset}-${stop.color}`}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
            ))}
          </defs>
        )}
        {icon.layers.map((layer, index) => (
          <path
            key={index}
            d={layer.path}
            fill={layer.fill}
            fillRule={layer.fillRule ?? icon.fillRule}
            transform={layer.transform}
          />
        ))}
      </svg>
    );
  }
  const fills = iconFills(icon.hex);
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      className={`${className} fill-(--icon-l) dark:fill-(--icon-d)`}
      style={{ "--icon-l": fills.light, "--icon-d": fills.dark } as CSSProperties}
    >
      <path d={icon.path} fillRule={icon.fillRule} />
    </svg>
  );
}
