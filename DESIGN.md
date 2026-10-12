---
name: "Portfolio, Fa'iq Haidar Prasetya"
description: "A calm, instrument-panel portfolio for a cloud engineering student: one dark hero, then quiet light or dark surfaces with a single blue signal."
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
  void: "#000000"
  frost: "#f5f5f7"
  rule-dark: "#2a2a2c"
  haze: "#a1a1aa"
  dusk: "#8f8f98"
  beacon-blue: "#2997ff"
  hero-night: "#1a1a2e"
  hero-deep: "#16213e"
  hero-horizon: "#0f3460"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "72px (48px below 768px)"
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
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.1em"
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

A cloud engineer's portfolio should feel like a well-kept operations console: calm, legible, and nothing blinking without a reason. The page opens on one always-dark hero (a night-to-horizon gradient with a softly lit portrait), then settles into a single column of surfaces that alternate between two close tones. The only chroma outside the hero and the brand logos is one blue signal, spent on actions and focus.

Density is low and the rhythm is steady: one container, one section padding, one heading gap. Motion explains arrival and state, then gets out of the way. The voice is calm, precise and confident; copy is short and names what will happen, not the gesture used to trigger it.

**Key Characteristics:**
- One dark hero, then page and raised surfaces that alternate down the page.
- A single blue signal for action and focus; no second accent hue.
- Depth from tonal layering and one translucent header, not from shadows.
- A tracking scale that gets tighter as type gets larger.
- Reduced motion substitutes quick fades; it never just removes feedback.

## Colors

A cool neutral ladder with one blue. Light and dark themes are each composed, not inverted: dark uses near-black surfaces (not pure black) and a lighter blue.

### Primary
- **Signal Blue** (#0066cc): the action color in the light theme. Primary pill buttons, outlined buttons, links and the focus ring.
- **Beacon Blue** (#2997ff): the same role in the dark theme and always inside the hero, where it is also the focus ring and the glow behind the portrait.

### Neutral
- **Cloud White** (#ffffff) and **Fog** (#f5f5f7): the page and raised surfaces in the light theme.
- **Console** (#121212) and **Panel** (#1f1f20): the page and raised surfaces in the dark theme.
- **Ink** (#09090b) and **Frost** (#f5f5f7): primary text in light and dark.
- **Slate Muted** (#52525b) and **Haze** (#a1a1aa): secondary text. **Mist Subtle** (#6b6b74) and **Dusk** (#8f8f98): metadata.
- **Hairline** (#e4e4e7) and **Rule Dark** (#2a2a2c): borders and dividers, also the current-section pill at 70%.
- **Void** (#000000): the hero's base fill in the dark theme, under the gradient.

### Hero
- **Hero Night** (#1a1a2e), **Hero Deep** (#16213e), **Hero Horizon** (#0f3460): the 135-degree hero gradient at 0%, 55% and 100%. The hero stays dark in both themes.

### Named Rules
**The One Blue Rule.** Signal Blue and Beacon Blue are the only chroma the interface itself uses. Everything else is neutral; brand logos bring their own color.

**The Three-to-One Logo Rule.** Skill logos keep their brand hue but are never painted below 3:1 against the surface they sit on. Near-black marks take the text color in dark mode. Yellow is the one exception to darkening, because a dark yellow is only olive or mustard: on the light theme JavaScript and Hugging Face stay brand yellow and carry the 3:1 in an Ink outline instead (JavaScript's cut-out "JS" shows an Ink tile behind it, so it reads as black letters on yellow). Dark needs no outline.

## Typography

**Font:** the platform system face on Apple devices (SF Pro via `-apple-system`), with Inter (variable, via `next/font`) as the fallback everywhere else.

**Character:** one family, three weights (400, 500, 600). Hierarchy comes from size, weight and tracking, not from a second typeface.

### Hierarchy
- **Display** (600, 72px, 48px below 768px, line-height 1.05, tracking -0.03em): the hero headline and the Contact heading (60px).
- **Headline** (600, 48px, 36px below 768px, tracking -0.02em): every section heading.
- **Title** (600, 18px to 28px, tracking -0.01em, leading-snug on the 18px ones): card titles, dialog title, project cards, the portrait monogram.
- **Body** (400, 16px to 20px, line-height 1.4 to 1.56): about text and card copy, in secondary text colors; prose stays within about 70 characters.
- **Nav** (500, 12px, normal tracking): the header links and the Download CV button.
- **Label** (400, 12px, uppercase, tracking 0.1em): the Learn more prompt.

### Named Rules
**The Tracking Ramp Rule.** Tracking tightens as type grows: display -0.03em, headline -0.02em, title -0.01em, body 0. Use the `tracking-display`, `tracking-heading` and `tracking-title` tokens; never an inline letter-spacing.

## Layout

One centered container (max-width 72rem, 24px side padding) holds everything except the full-bleed hero and the horizontally scrolling project gallery, which aligns its first card to the same left edge. Sections use 96px of vertical padding (128px from 768px up) and leave 64px between a section heading and its content. Contact is the one deliberate exception with 112px and 160px of padding to close the page.

Surfaces alternate down the page: Projects on page, Skills on raised, Certificates on page, Awards on raised, Education on page, Contact on raised, then the footer on raised with a top border. Anchor targets clear the fixed 48px header with a 96px scroll margin.

Breakpoints follow content: 640px (CV label appears), 768px (desktop nav, larger type, wider padding), 1024px (CV label returns on the desktop bar). Between 768px and 1023px the CV button shows only its icon so the bar never crowds. The mobile menu is capped to the space under the header and scrolls.

## Elevation & Depth

Tonal layering, with one translucent layer. Cards sit on the page or raised tone separated by a 1px hairline, not by shadows. The header is the only glass: 78% of the surface tone in the light theme (60% in dark) with a 20px blur and 180% saturation, a hairline on the edge that meets content, and solid fallbacks under reduced transparency and higher contrast. The dialog sits on a black 50% scrim.

### Shadow Vocabulary
- **Portrait glow** (`box-shadow: 0 0 64px -16px rgba(41, 151, 255, 0.55)`): the single soft glow, behind the hero portrait.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The Skills card lifts 4px on hover by moving, not by gaining a shadow.

## Shapes

Large, soft, and consistent. Big cards use a 28px radius and small cards 18px; every control, chip and the portrait is a full pill or circle. Borders are always 1px in Hairline or Rule Dark, and inset 1px white rings (10% to 20%) edge the dark gradient project cards and the portrait.

## Components

### Buttons
- **Shape:** full pill (9999px).
- **Primary:** Signal Blue fill, white text, 16px by 32px padding (the Email action). Its leading logo is the four-colour 2020 Gmail mark, drawn straight on the blue with no badge; its blue side is the one low-contrast part, and the red, green and yellow pieces carry the shape.
- **Outline:** 1px Signal Blue border and text, 10% blue wash on hover (Download CV in Contact).
- **Neutral:** 1px Mist Subtle border (Dusk in dark, 3:1 or better on the raised Contact surface; Hairline vanishes there), Ink text, hairline wash at 60% on hover (social links). Their logos keep the brand colour (GitHub near-black and LinkedIn blue), moved only as far as 3:1 needs per theme.
- **Press:** every control scales to 0.97 over 100ms. Under reduced motion it dips to 70% opacity instead.

### Navigation
- **Style:** fixed 48px glass bar; brand left, section links centered, Download CV and the theme toggle right. Links are 12px medium pills in full-contrast text; on hover they take the same hairline wash at 60% as the Download CV button.
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

### Portrait
- **Style:** a 112px circle (144px from 768px up) with a 1px white ring at 20%, a translucent white fill that shows through the photo's transparent background, and the portrait glow. Without a photo it shows a two-letter monogram in the Title style.

## Do's and Don'ts

### Do:
- **Do** keep the page container at 72rem with 24px sides and sections at 96px (128px wide) with a 64px heading gap.
- **Do** use Signal Blue (#0066cc) or Beacon Blue (#2997ff) for actions and focus, and nothing else chromatic.
- **Do** let a theme switch fade surface, text and border colours for 250ms (`theme-fade`, skipped under reduced motion). Otherwise animate only transform and opacity, enter with the Reveal rise (20px over 0.6s, once, at 15% inside the viewport), and give every animation a reduced-motion path that fades in 200ms or less.
- **Do** write labels as the outcome ("View all skills"), not the gesture ("Click to see all").
- **Do** keep images in `public/` small: the build ships them as they are.

### Don't:
- **Don't** add shadows to cards or a second accent hue.
- **Don't** hard-code `letterSpacing` or `lineHeight` inline; use the tracking tokens and `leading-*` utilities.
- **Don't** invert logos with `dark:invert`; use the per-theme brand fills.
- **Don't** hotlink third-party images, and don't swap `initial` values per motion preference (the static HTML renders with motion enabled).
- **Don't** rely on hover for anything: touch users have no hover.
