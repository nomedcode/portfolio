// Skill logos are drawn in their brand colour on the page and raised surfaces. A brand colour that is too close to
// the surface (yellow on white, navy on near-black) is moved along lightness only, keeping hue and saturation, until
// it reaches 3:1 on both surfaces of that theme. Colours that already pass are returned untouched.

// Keep in sync with --c-page / --c-raised in globals.css (iconColor.test.ts compares them).
export const SURFACES = {
  light: ["#ffffff", "#f5f5f7"],
  dark: ["#121212", "#1f1f20"],
} as const;

// Keep in sync with --c-fg. Near-neutral logos that fail a theme (black on dark) take this instead of a dull mid grey.
export const FOREGROUND = { light: "#09090b", dark: "#f5f5f7" } as const;

const MIN_CONTRAST = 3;
const NEUTRAL_SATURATION = 0.3;
// Hue degrees counted as yellow (JavaScript is 53, Hugging Face 48; orange starts near 40 and lime near 70).
const YELLOW_HUE = [40, 65] as const;

type Rgb = [number, number, number];

function toRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
}

function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two #rrggbb colours. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function toHsl(hex: string): [number, number, number] {
  const [r, g, b] = toRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

function fromHsl(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return toHex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}

function fit(
  brand: string,
  surfaces: readonly string[],
  toward: "darker" | "lighter",
  foreground: string
): string {
  const passes = (hex: string) => surfaces.every((s) => contrastRatio(hex, s) >= MIN_CONTRAST);
  if (passes(brand)) return brand;
  const [h, s, l] = toHsl(brand);
  // Black, charcoal and slate marks have no hue worth keeping: they read as "text", so they take the text colour.
  if (s < NEUTRAL_SATURATION) return foreground;
  // pass is a lightness known to meet the ratio (black on light surfaces, white on dark); fail is the brand's own.
  let pass = toward === "darker" ? 0 : 1;
  let fail = l;
  for (let i = 0; i < 24; i++) {
    const mid = (pass + fail) / 2;
    if (passes(fromHsl(h, s, mid))) pass = mid;
    else fail = mid;
  }
  return fromHsl(h, s, pass);
}

/** True for a saturated yellow, the one hue family whose dark shades stop looking like the brand (olive, mustard). */
function isYellow(hex: string): boolean {
  const [h, s] = toHsl(hex);
  return s >= NEUTRAL_SATURATION && h >= YELLOW_HUE[0] && h <= YELLOW_HUE[1];
}

/**
 * The fill to paint a brand logo with in each theme, as lowercase #rrggbb. `hex` is a simple-icons hex (no #).
 * `rim` is set for a yellow that cannot reach 3:1 on a light surface: it keeps its colour there and the logo is
 * outlined in `rim` (the light-theme text colour) instead of being darkened until it turns olive. Dark needs no rim.
 */
export function iconFills(hex: string): { light: string; dark: string; rim: string | null } {
  const brand = `#${hex.toLowerCase()}`;
  const light = fit(brand, SURFACES.light, "darker", FOREGROUND.light);
  const dark = fit(brand, SURFACES.dark, "lighter", FOREGROUND.dark);
  if (light !== brand && isYellow(brand)) return { light: brand, dark, rim: FOREGROUND.light };
  return { light, dark, rim: null };
}
