import type { CSSProperties } from "react";
import { iconFills } from "@/lib/iconColor";
import type { SkillIcon } from "@/lib/skillIcons";

// The fill comes from two CSS variables so the theme class switches it without re-rendering; the path carries no
// fill attribute of its own, which would beat the value inherited from the svg. A full-colour mark (layers) is the
// exception: each layer is a brand colour that stays the same in both themes, so it carries its own fill.
export function BrandIcon({
  icon,
  className = "",
}: {
  icon: SkillIcon;
  className?: string;
}) {
  const viewBox = icon.viewBox ?? "0 0 24 24";
  if (icon.layers) {
    return (
      <svg viewBox={viewBox} aria-hidden="true" className={className}>
        {icon.layers.map((layer) => (
          <path key={layer.fill} d={layer.path} fill={layer.fill} />
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
