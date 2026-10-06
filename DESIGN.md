---
version: 3
name: omardev-signal
description: Portfolio design system for omardev.xyz. Ink on a cool off-white canvas, one vermilion signal colour, poster-scale Mona Sans, and motion that only moves when it explains something. Combines the DESIGN.md format (VoltAgent/awesome-design-md), tasteskill's anti-slop rules (Leonxlnx/taste-skill), Vercel's Web Interface Guidelines, and the craft bar of vibrant.design.

dials:
  DESIGN_VARIANCE: 8   # asymmetric, poster type, large negative space
  MOTION_INTENSITY: 7  # load choreography, sticky stack, scrubbed text, magnetic CTAs
  VISUAL_DENSITY: 3    # gallery spacing, py-28 to py-40 sections

colors:
  light:
    canvas: "#F4F4F2"
    surface: "#FBFBFA"
    surface-2: "#EAEAE6"
    ink: "#0F0F0E"
    body: "#4A4A47"
    mute: "#6F6F6A"
    hairline: "rgba(15,15,14,0.10)"
    hairline-strong: "rgba(15,15,14,0.18)"
    signal: "#F2541A"
    signal-ink: "#C2410C"
    on-signal: "#0F0F0E"
  dark:
    canvas: "#0E0E0D"
    surface: "#171716"
    surface-2: "#222220"
    ink: "#F2F2EE"
    body: "#B9B9B2"
    mute: "#8E8E87"
    hairline: "rgba(242,242,238,0.10)"
    hairline-strong: "rgba(242,242,238,0.18)"
    signal: "#F2541A"
    signal-ink: "#FF7A45"
    on-signal: "#0F0F0E"

typography:
  display-hero:  { fontFamily: Mona Sans, fontWeight: 800, fontStretch: 112%, fontSize: "clamp(3.75rem, 14.2vw, 14rem)", lineHeight: 0.82, letterSpacing: -0.055em }
  display-xl:    { fontFamily: Mona Sans, fontWeight: 700, fontSize: "clamp(2.5rem, 6vw, 5.5rem)", lineHeight: 0.95, letterSpacing: -0.04em }
  display-lg:    { fontFamily: Mona Sans, fontWeight: 650, fontSize: "clamp(1.75rem, 3.2vw, 3rem)", lineHeight: 1.0, letterSpacing: -0.03em }
  display-md:    { fontFamily: Mona Sans, fontWeight: 600, fontSize: 1.5rem, lineHeight: 1.15, letterSpacing: -0.02em }
  metric:        { fontFamily: Mona Sans, fontWeight: 700, fontStretch: 110%, fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: -0.04em, fontVariantNumeric: tabular-nums }
  body-lg:       { fontFamily: Mona Sans, fontWeight: 400, fontSize: 1.25rem, lineHeight: 1.5 }
  body:          { fontFamily: Mona Sans, fontWeight: 400, fontSize: 1.0625rem, lineHeight: 1.65 }
  body-sm:       { fontFamily: Mona Sans, fontWeight: 400, fontSize: 0.875rem, lineHeight: 1.5 }
  mono:          { fontFamily: Geist Mono, fontWeight: 500, fontSize: 0.75rem, letterSpacing: 0.01em }

rounded:
  pill: 9999px      # buttons, nav, chips, toggles, the inline hero portrait
  container: 16px   # cards, panels, images, inputs, code blocks

spacing:
  base: 4px
  gutter: "16px mobile, 24px sm, 40px lg"
  container: 1400px
  section: "112px mobile, 160px desktop"

motion:
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  fast: 160ms     # hover colour, icon nudges
  base: 320ms     # state changes
  slow: 900ms     # reveals
  spring: { stiffness: 150, damping: 18 }   # magnetic + cursor follow

z-index:
  panel: 10       # sticky work cards, cursor preview
  header: 50      # floating nav
  overlay: 60     # mobile menu sheet (carries its own close button)
  skip-link: 70
---

## Overview

The site is a portfolio for an AI engineer and full-stack developer. The audience is a hiring manager or founder who will give it 30 seconds before deciding to read on. Everything serves that: the name and what he builds hit first, then four production systems with real numbers, then depth for anyone who keeps scrolling.

Design read: *developer portfolio for hiring managers and prospective clients, with a kinetic-type, signal-on-ink language, built on native CSS + Tailwind v4 + Motion, no design-system package.*

Mode: **redesign, overhaul.** Content, section IDs, nav labels, routes, metadata and JSON-LD are preserved. The visual language is new.

## Colors

- **Ink and canvas carry 95% of the page.** Light mode is the default (owner preference). Dark mode is fully designed, not inverted.
- **Signal (`#F2541A`) is the only accent.** It appears on: the availability dot, the primary CTA fill, the italic emphasis word in a headline, link underlines on hover, the active nav state, and one bento cell. Nowhere else. It carries forward the warm accent of v2 and drops the violet.
- Signal passes 3:1 on canvas, so it is allowed on large text (24px+) such as the italic headline emphasis. Small text in the accent uses `signal-ink`, which passes 4.5:1 in both modes. `#FF5A1F` looked marginally hotter but measured 2.83:1, so it was dropped.
- Text on a signal fill is always `on-signal` (ink). White on orange fails contrast.
- No pure `#000` or `#fff` anywhere. One fixed exception: `#050505` behind the memoji, matching the black baked into those PNGs.

## Typography

- **Mona Sans** (variable: weight 200 to 900, width 75 to 125) for everything readable. The hero name is set at weight 800 and 112% width so it reads as a poster.
- **Geist Mono** for metadata only: years, versions, install commands. Sentence case, no wide tracking.
- Emphasis inside a headline uses the *italic of the same family* in signal. Never a second typeface.
- Headings use `text-wrap: balance`, body uses `text-wrap: pretty`, numbers use `tabular-nums`.
- Italic display words with descenders get `leading-[1.1]` minimum and bottom padding.

## Layout

- 12-column grid inside `max-w-[1400px]`, gutters 16 / 24 / 40 px.
- Heroes use `min-h-[100dvh]`, never `h-screen`. Hero top padding caps at `pt-24`.
- Every multi-column layout declares its `< 768px` fallback in the same component: single column, full width.
- Each section uses a different layout family:

| Section | ID | Family |
|---|---|---|
| Hero | `about` | Kinetic-type poster, inline portrait chip |
| Capabilities | - | Marquee (the only one on the page) |
| Selected work | `portfolio` | Sticky card stack, then a hover-preview index |
| About | `about-me` | Manifesto statement with scrubbed word reveal + stat strip |
| Teaching | `teaching` | Sticky split |
| Journey | `journey` | Accordion ledger |
| Stack | `stack` | Bento, 6 cells for 6 groups |
| Credentials | `certifications` | Horizontal snap rail |
| Tools | `tools` | Card grid, 2 large + 3 small |
| Contact | `contact` | CTA poster |

## Elevation & Depth

Flat by default. Hierarchy comes from scale, weight and the ink/mute split. Containers get a 1px hairline. The floating nav is the only element with a shadow, tinted to ink. The work stack creates depth through overlap and scale, not shadows.

## Shapes

One documented rule: **pill for things you press or scan inline** (buttons, nav, chips, toggles, the hero portrait chip) and **16px for things that contain** (cards, panels, images, inputs, code). Nothing else.

## Components

- **Nav:** floating pill, 56px tall, one line on desktop, hides on scroll down and returns on scroll up. Active section tracked with IntersectionObserver. Mobile opens a full-screen sheet with `overscroll-behavior: contain`, Escape to close, scroll locked.
- **Buttons:** primary = signal fill + ink label; secondary = hairline outline. Both pills, `active:scale-[0.98]`. Primary CTAs are magnetic on fine pointers only.
- **Work panel:** surface card, project cover on the right, metrics in `metric` type.
- **Project cover** (`components/ui/ProjectCover.tsx`): the only project imagery on the site. One of three tones (ink, signal, paper), a Phosphor icon in `light` weight (the single exception to the bold icon rule, because it is illustration-sized), one real number from the project description or a short subject, and a three-step system flow. Sized in container-query units so one cover scales from the 280px hover preview to the full-width case-study banner. Tones rotate through the archive so every row of three gets ink, signal and paper. Featured projects use a subject instead of a number because their card already shows the metrics.
- **Share images** (`app/covers/[slug]/cover.png/route.tsx`): the same cover rendered to a 1200x630 PNG at build time for og:image and twitter:image.
- **Chips:** pill, `surface-2` fill, body-sm, not interactive unless they look pressed.
- **Install command:** mono, 16px container, copy button with `aria-live` confirmation.

## Motion

Every animation answers "what does this explain?" If it can't, it goes.

| Moment | What it explains |
|---|---|
| Project cover scales slightly on card hover | Feedback: this card is the link |
| Name letters rise on load | Hierarchy: this is who |
| Hero drifts up and fades on scroll | Hand-off from intro to work |
| Work cards stack and the previous one recedes | One case at a time, in order |
| Hover index preview follows the cursor | Feedback: which project you're on |
| About statement words light up as you scroll | Reading pace |
| Section headings unmask on entry | Where a new chapter starts |
| Theme toggle wipes from the button | State change, and where it came from |
| Magnetic primary CTA | Feedback: this is the thing to press |

Rules: animate `transform` and `opacity` only. No `window.addEventListener('scroll')`; use Motion `useScroll`, IntersectionObserver or CSS. Everything collapses to static under `prefers-reduced-motion`, including Lenis smooth scrolling and the marquee. The marquee has a pause button.

## Do's and Don'ts

### Do
- Use real numbers from `data/` and nothing invented.
- Keep the hero to four text elements: availability, name, one sentence, two CTAs.
- Give every icon-only button an `aria-label` and every decorative icon `aria-hidden`.
- Use `…` and curly quotes in copy. Loading states end in `…`.
- Keep one CTA label per intent: "See the work", "Email me".
- Sentence case for headings and buttons. This deliberately departs from the Web Interface Guidelines' Title Case rule: it matches the voice of the copy and of the poster type.

### Don't
- No em-dashes or en-dashes in visible copy. Hyphens only.
- No numbered eyebrows (`03 / Work`), no "Edition No. 01" strips, no locale or weather strips, no scroll cues.
- No uppercase wide-tracked eyebrow above every section. Budget: 1 per 3 sections. The hero availability flag is the only one.
- No serif, no Inter, no purple, no gradient text, no neon glow, no custom cursor.
- No three equal cards in a row. No div-based fake screenshots.
- No `transition: all`, no `outline: none` without a focus-visible replacement.

## Responsive Behavior

- Breakpoints: 640 / 768 / 1024 / 1280.
- Below 768: every grid is one column, the work stack becomes a plain vertical list (no sticky), the index hover preview is off, cards are 1 per row.
- Archive grid: 1 / 2 / 3 columns.
- Touch targets 44px minimum. `touch-action: manipulation` on interactive elements.
- Full-bleed areas respect `env(safe-area-inset-*)`.

## Agent Prompt Guide

When adding to this site:
1. Read this file and the tokens in `app/globals.css`. Use the CSS variables, never raw hex.
2. Pick a layout family not already used on the page.
3. Write copy in EN and NL. Run it past the copy audit: no em-dashes, no "elevate / seamless / leverage", no poetic labels.
4. Before calling it done, check: reduced motion, both themes, 390px width, keyboard focus, `npm run build`.
