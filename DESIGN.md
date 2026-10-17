---
name: "Portfolio, Fa'iq Haidar Prasetya"
description: "A calm, instrument-panel portfolio for a cloud engineering student: a typographic hero on the raised surface, then quiet light or dark surfaces with a single blue signal."
colors:
  cloud-white: "#ffffff"
  fog: "#f5f5f7"
  ink: "#09090b"
  hairline: "#e4e4e7"
  slate-muted: "#52525b"
  mist-subtle: "#6b6b74"
  signal-blue: "#0066cc"
  console: "#121212"
  panel: "#1f1f20"
  frost: "#f5f5f7"
  rule-dark: "#2a2a2c"
  haze: "#a1a1aa"
  dusk: "#8f8f98"
  beacon-blue: "#2997ff"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "44px below 640px (may wrap to two lines), then fluid clamp(32px, 6vw, 80px) — one line from 640px up"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "48px (36px below 768px)"
    fontWeight: 600
    lineHeight: "1 (1.11 below 768px)"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px to 28px"
    fontWeight: 600
    lineHeight: "1.25 (project cards) to 1.4"
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px to 20px"
    fontWeight: 400
    lineHeight: "1.4 to 1.56"
    letterSpacing: "normal"
  nav:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "normal"
rounded:
  card: "28px"
  card-sm: "18px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
  section-wide: "128px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.signal-blue}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  button-neutral:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  nav-link-current:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "48px"
  card-small:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card-sm}"
    padding: "32px"
  dialog:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    width: "768px"
---

# Design System: Portfolio, Fa'iq Haidar Prasetya

## Overview

**Creative North Star: "The Quiet Control Room"**

A cloud engineer's portfolio should feel like a well-kept operations console: calm, legible, and nothing blinking without a reason. The page opens on a typographic hero on the raised surface (the name on one fluid line, the role rolling beneath it), then settles into a single column of surfaces that alternate between two close tones. The only chroma outside the brand logos is one blue signal, spent on actions and focus.

Density is low and the rhythm is steady: one container, one section padding, one heading gap. Motion explains arrival and state, then gets out of the way. The voice is calm, precise and confident; copy is short and names what will happen, not the gesture used to trigger it.

**Key Characteristics:**
- One typographic hero on the raised tone, then raised and page surfaces that alternate down the page.
- A single blue signal for action and focus; no second accent hue.
- Depth from tonal layering and one translucent header, not from shadows.
- A tracking scale that gets tighter as type gets larger.
- Reduced motion substitutes quick fades; it never just removes feedback.

## Colors

A cool neutral ladder with one blue. Light and dark themes are each composed, not inverted: dark uses near-black surfaces (not pure black) and a lighter blue.

### Primary
- **Signal Blue** (#0066cc): the action color in the light theme. Primary pill buttons (including "Download CV" in the hero), outlined buttons, links and the focus ring.
- **Beacon Blue** (#2997ff): the same role in the dark theme for text, links, icons and the focus ring. Filled buttons keep a Signal Blue fill with white text in both themes — white on Beacon Blue is 3.02:1, below AA.

### Neutral
- **Cloud White** (#ffffff) and **Fog** (#f5f5f7): the page and raised surfaces in the light theme.
- **Console** (#121212) and **Panel** (#1f1f20): the page and raised surfaces in the dark theme.
- **Ink** (#09090b) and **Frost** (#f5f5f7): primary text in light and dark.
- **Slate Muted** (#52525b) and **Haze** (#a1a1aa): secondary text. **Mist Subtle** (#6b6b74) and **Dusk** (#8f8f98): metadata.
- **Hairline** (#e4e4e7) and **Rule Dark** (#2a2a2c): borders and dividers, also the current-section pill at 70%.

### Project Islands
The five placeholder project cards are dark two-stop gradients (160deg), tokenized as `--background-image-island-1` through `-5`:
1. `#1a1a2e` → `#0f3460`
2. `#0f0f23` → `#533483`
3. `#13232a` → `#264653`
4. `#2b2b2b` → `#414345`
5. `#0d1f1a` → `#1b4332`

White title text on all five is 12.5:1 or better.

### Named Rules
**The One Blue Rule.** Signal Blue and Beacon Blue are the only chroma the interface itself uses. Everything else is neutral; brand logos bring their own color.

**The Three-to-One Logo Rule.** Skill logos keep their brand hue but are never painted below 3:1 against the surface they sit on. Near-black marks take the text color in dark mode. Yellow is the one exception: a yellow dark enough to reach 3:1 on white is only olive or mustard, so JavaScript and Hugging Face keep their exact brand yellow in both themes.

## Typography

**Font:** the platform system face on Apple devices (SF Pro via `-apple-system`), with Inter (variable, via `next/font`) as the fallback everywhere else.

**Character:** one family, three weights (400, 500, 600). Hierarchy comes from size, weight and tracking, not from a second typeface.

### Hierarchy
- **Display** (600, line-height 1.05, tracking -0.03em): the hero headline, which is just the name, set at 44px with balanced wrapping below 640px and fluidly at clamp(32px, 6vw, 80px) above it, where it always stays on one line; and the Contact heading (60px).
- **Headline** (600, 48px, 36px below 768px, tracking -0.02em): every section heading.
- **Title** (600, 18px to 28px, tracking -0.01em, leading-snug on the 18px ones): card titles, dialog title, project cards.
- **Body** (400, 16px to 20px, line-height 1.4 to 1.56): about text and card copy, in secondary text colors; prose stays within about 70 characters.
- **Nav** (500, 12px, normal tracking): the header links.
- **Role line** (500, 20px, 24px from 640px, 30px from 768px, 36px from 1024px, Slate Muted / Haze): the hero role under the headline. It always stays smaller than the one-line name.

### Named Rules
**The Tracking Ramp Rule.** Tracking tightens as type grows: display -0.03em, headline -0.02em, title -0.01em, body 0. Use the `tracking-display`, `tracking-heading` and `tracking-title` tokens; never an inline letter-spacing.

## Layout

One centered container (max-width 72rem, 24px side padding) holds everything, including the hero copy, so the hero headline, the header brand and every section share one left edge. Section headings are centered inside that container; the Skills heading sits left inside its card. Only the horizontally scrolling project gallery runs full-bleed; the gallery aligns its first card to the same left edge. Sections use 96px of vertical padding (128px from 768px up) and leave 64px between a section heading and its content. Contact is the one deliberate exception: a narrower 56rem column with 112px and 160px of padding to close the page.

Surfaces alternate down the page: the hero on raised, Projects on page, Skills on raised, Certificates on page, Awards on raised, Education on page, Contact on raised, then the footer on raised with a top border. The alternation is deliberate and applies to the hero too: a raised hero is part of the rhythm, not an accent, so no section breaks it. Anchor targets clear the fixed 48px header with a 96px scroll margin.

The hero is left-aligned at every width: the name spans the full container on one fluid line, then the copy (role line, about text, actions) follows in one column. It is at least one small viewport tall and grows when the content is taller, so short landscape screens scroll instead of clipping.

Breakpoints follow content: 640px (hero type switches to the fluid display), 768px (desktop nav, larger type, wider padding), 1024px (larger hero type), 1280px (the footer's three-column layout). Below 640px the hero name is a fixed 44px and wraps if needed; from 640px it scales at 6.5vw with a 44px floor and an 80px ceiling, so it never drops below the fixed size or the 48px section headings. The mobile menu is capped to the space under the header and scrolls.

The footer stacks and centers its credit, section navigation and external links below 1280px. From 1280px it uses three columns with the navigation centered; link labels stay on one line while each link group can wrap between links.

## Elevation & Depth

Tonal layering, with one translucent layer. Cards sit on the page or raised tone separated by a 1px hairline, not by shadows. The header is the only glass: 78% of the surface tone in the light theme (60% in dark) with a 20px blur and 180% saturation, a hairline on the edge that meets content, and solid fallbacks under reduced transparency and higher contrast. The dialog sits on a black 50% scrim.

### Shadow Vocabulary
- None. No shadows or glows anywhere; depth is tonal layering only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The Skills card lifts 4px on hover by moving, not by gaining a shadow.

## Shapes

Large, soft, and consistent. Big cards use a 28px radius and small cards 18px; every control and chip is a full pill. Borders are always 1px in Hairline or Rule Dark, and inset 1px white rings (10% to 20%) edge the dark gradient project cards.

## Components

### Buttons
- **Shape:** full pill (9999px).
- **Hero:** two pills, 48px tall. "Download CV" is a Signal Blue fill with white text and a leading download icon, a link to the PDF with the `download` attribute, and "Contact" is the neutral outline (1px Mist Subtle border, Ink text, a Hairline wash at 60% on hover), a link to `#contact`. The header carries no CV link; the file is also offered in Contact and the footer.
- **Primary:** Signal Blue fill, white text, 12px left and 28px right padding (the Email action). Its leading logo is the 2026 Gmail mark (red left stripe, pink-to-yellow arc, green-to-blue right stripe) in a 32px white circle, 12px from the edge on the left, top and bottom, so the button keeps the 56px height it had without the badge. The badge is there because the mark is made for a light ground: its red stripe and blue base reach only about 1.6:1 on Signal Blue and about 3.5:1 on white. The badge stays white in both themes.
- **Outline:** 1px Signal Blue border and text, 10% blue wash on hover (Download CV in Contact).
- **Neutral:** 1px Mist Subtle border (Dusk in dark, 3:1 or better on the raised Contact surface; Hairline vanishes there), Ink text, hairline wash at 60% on hover (social links). Their logos keep the brand colour (GitHub near-black and LinkedIn blue), moved only as far as 3:1 needs per theme.
- **Press:** every control scales to 0.97 over 100ms. Under reduced motion it dips to 70% opacity instead.

### Navigation
- **Style:** fixed 48px glass bar; brand left, section links centered, the theme toggle right (with the menu button below 768px). Links are 12px medium pills in full-contrast text; on hover they take a Hairline wash at 60%.
- **Current section:** the link for the section under the reading line gets a Hairline pill at 70% with a 1px inset Hairline ring, so it never reads as hover (an underline under forced colors), and `aria-current="location"`. Nothing is current over the hero.
- **Mobile:** a hamburger opens a solid panel under the bar that drops 8px in over 200ms (plain fade under reduced motion), scrolls when short, and closes on Escape or any press outside the header.

### Chips
- **Style:** pill, page-tone fill, 12px secondary text, 4px by 12px padding. Skill chips in the dialog use a 1px Hairline border and 14px text with the brand logo.

### Cards / Containers
- **Corner style:** 28px for the Skills banner, Education list and project islands; 18px for Awards, Certificates and the dialog's category cards.
- **Background:** page or raised tone, alternating with the section behind it. Project islands are dark gradients with white 24px to 28px titles.
- **Internal padding:** 32px; from 768px up, 48px on the large cards and 40px on the small ones.

### Dialog
- **Style:** the Skills dialog is a 28px-radius page-tone sheet, up to 768px wide and 85% of the viewport tall, with a scrolling, keyboard-focusable body. It scales from 0.85 out of the Skills card (a spring of 0.4s with no bounce), leaves faster than it arrives, and only fades under reduced motion.

### Hero
- **Surface:** the raised tone in both themes (Fog light, Panel dark) with Ink / Frost text, one step off Projects on page below it. Flat: no gradient, no glow, no shadow.
- **Copy:** headline, role line, the about text (34rem wide, Mist Subtle / Dusk) and the two actions, left-aligned at every width. Each piece rises in on first paint with a 100ms stagger; the actions arrive last.
- **Role line:** rotates through the five roles (Cloud Engineer, DevOps Engineer, Site Reliability Engineer, System Administrator, AI Engineer) without end: a 2.6s hold, then 0.4s rolling out upward and 0.6s rolling in from below. It holds still while the pointer is over the line, while focus is inside the hero, while the hero is scrolled out of view, and while the tab is hidden. Under reduced motion it shows the first role and never moves. The first role is in the static HTML. There is no explicit pause control, so WCAG 2.2.2 (Level A) remains open by owner choice; a touch user's only stop is scrolling the hero away. To close it, add a visible pause control or stop after one pass.
- **Scroll:** as the hero leaves, the copy settles 48px and fades to 20%. These are transforms and opacity only, and reduced motion drops them.

## Do's and Don'ts

### Do:
- **Do** keep the page container at 72rem with 24px sides and sections at 96px (128px wide) with a 64px heading gap.
- **Do** use Signal Blue (#0066cc) or Beacon Blue (#2997ff) for actions and focus, and nothing else chromatic.
- **Do** let a theme switch fade surface, text and border colours for 200ms (`theme-fade`, skipped under reduced motion; SVG internals are excluded so the toggle stays off the long-task budget). Otherwise animate only transform and opacity: the Reveal rise is 20px over 0.9s, once, at 15% inside the viewport; project cards rise 32px over 0.7s while fading over 0.9s, staggered 0.15s; the hero entrance is CSS at 0.6s. Give every animation a reduced-motion path that fades in 200ms or less.
- **Do** write labels as the outcome ("View all skills"), not the gesture ("Click to see all").
- **Do** keep images in `public/` small: the build ships them as they are.

### Don't:
- **Don't** add shadows to cards or a second accent hue.
- **Don't** hard-code `letterSpacing` or `lineHeight` inline; use the tracking tokens and `leading-*` utilities.
- **Don't** invert logos with `dark:invert`; use the per-theme brand fills.
- **Don't** hotlink third-party images, and don't swap `initial` values per motion preference (the static HTML renders with motion enabled).
- **Don't** rely on hover for anything: touch users have no hover.
