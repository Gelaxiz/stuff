---
name: "Nexus School"
description: "A fast, dark game library and resilient browser surface."
colors:
  night: "#08090c"
  surface: "#101216"
  raised: "#171a20"
  rule: "#282c34"
  rule-strong: "#3a404b"
  ink: "#f4f6f8"
  muted: "#9ba3af"
  quiet: "#707985"
  signal: "#d8ff45"
  signal-ink: "#151900"
  danger: "#ff727c"
typography:
  display:
    fontFamily: "NexusDisplay, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 9vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 750
    lineHeight: 1.1
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
rounded:
  compact: "5px"
  control: "8px"
  artwork: "10px"
  panel: "12px"
  round: "999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "18px"
  lg: "28px"
  xl: "48px"
components:
  signal-button:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "44px"
  quiet-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "44px"
  game-art:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.artwork}"
    aspectRatio: "1 / 1"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "48px"
---

# Design System: Nexus School

## Overview

**Creative North Star: “The Night Arcade Index”**

Nexus is a quick-launch library, not a marketing page. A nearly black field, oversized hand-drawn display lettering, compact system text, and one acid signal color make the catalog recognizable while keeping hundreds of covers readable. Browser and utility surfaces are quieter versions of the same night environment.

## Colors

Night, surface, and raised establish depth without decorative gradients. Ink, muted, and quiet create a clear reading hierarchy. Signal marks the active filter, play affordance, and keyboard focus. Danger is reserved for errors and destructive outcomes. Never use color as the only status cue.

## Typography

The local NexusDisplay face is reserved for the main identity and arcade titles. System UI is the workhorse for search, filters, card names, browser tabs, and recovery copy. Card titles remain visible rather than relying on hover or artwork text.

## Layout

The library uses a fluid grid capped at 1500px. Search and filters share one tool row on wide screens and stack on narrow screens. Mobile keeps two useful game columns and 44px controls. The browser fills the viewport and gives its content frame all remaining height.

## Elevation & Depth

The system is flat and border-led. Artwork lifts four pixels on hover; overlays and browser recovery panels may use a single deep shadow. Avoid stacking multiple floating card layers.

## Shapes

Controls use 8px corners, artwork 10px, and structural panels 12px. Circular shapes are limited to play marks and compact status indicators. Borders stay one pixel and cool gray.

## Components

Game cards always contain square artwork, a resilient text fallback, a visible title, a category, and a clear play affordance. Search exposes a label and `/` shortcut. Filter buttons are horizontally scrollable on mobile. Loading, empty, and failure states occupy the catalog rather than appearing as transient toasts. Proxy failures provide retry, default-relay, and home actions.

## Do's and Don'ts

- Do make every launch resolve to content, progress, or a useful recovery state.
- Do keep local games usable when remote infrastructure is unavailable.
- Do preserve visible focus, reduced-motion handling, and 44px touch targets.
- Do use original or safely distributable assets for new bundled games.
- Don't hide titles behind hover, silently swallow proxy errors, or permit private-network proxy destinations.
- Don't introduce generic dashboard cards, ornamental gradients, or several competing accent colors.
