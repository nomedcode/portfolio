import type { CSSProperties } from "react";
import { iconFills } from "@/lib/iconColor";
import type { SimpleIcon } from "simple-icons";

// The fill comes from two CSS variables so the theme class switches it without re-rendering; the path carries no
// fill attribute of its own, which would beat the value inherited from the svg.
export function BrandIcon({
  icon,
  className = "",
}: {
  icon: SimpleIcon;
  className?: string;
}) {
  const fills = iconFills(icon.hex);
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} fill-(--icon-l) dark:fill-(--icon-d)`}
      style={{ "--icon-l": fills.light, "--icon-d": fills.dark } as CSSProperties}
    >
      <path d={icon.path} />
    </svg>
  );
}
