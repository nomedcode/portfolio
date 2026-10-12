import type { CSSProperties } from "react";
import { iconFills } from "@/lib/iconColor";
import type { SimpleIcon } from "simple-icons";

// Logos whose real art is a coloured tile with dark glyphs. The simple-icons path cuts the glyphs out of the tile,
// so an ink tile goes behind it and shows through as the letters (JavaScript is a yellow square with black "JS").
const GLYPH_TILE = new Set(["javascript"]);

// The fill comes from two CSS variables so the theme class switches it without re-rendering; the path carries no
// fill attribute of its own, which would beat the value inherited from the svg.
// A yellow that cannot reach 3:1 on light keeps its colour there and is outlined in ink (see iconFills): the stroke
// is drawn under the fill, so only its outer half shows, and it is transparent in dark where yellow already stands out.
export function BrandIcon({
  icon,
  className = "",
}: {
  icon: SimpleIcon;
  className?: string;
}) {
  const fills = iconFills(icon.hex);
  const rimmed = fills.rim !== null;
  const style = {
    "--icon-l": fills.light,
    "--icon-d": fills.dark,
    ...(rimmed && { "--icon-rim": fills.rim }),
  } as CSSProperties;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} fill-(--icon-l) dark:fill-(--icon-d)${
        rimmed ? " stroke-(--icon-rim) dark:stroke-transparent" : ""
      }`}
      style={style}
    >
      {rimmed && GLYPH_TILE.has(icon.slug) && (
        <rect x="1" y="1" width="22" height="22" fill={fills.rim!} />
      )}
      <path
        d={icon.path}
        {...(rimmed ? { strokeWidth: 1.2, strokeLinejoin: "round", paintOrder: "stroke" } : {})}
      />
    </svg>
  );
}
