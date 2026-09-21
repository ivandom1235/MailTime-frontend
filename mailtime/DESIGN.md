---
name: WMS Workspace
description: Orange and slate interface for administrator and executive mail management.
colors:
  brand: "#f97316"
  primary: "#c2410c"
  primary-gradient-start: "#cc4b0a"
  primary-hover: "#9a3412"
  brand-soft: "#fff7ed"
  brand-border: "#fed7aa"
  surface: "#ffffff"
  canvas: "#f8fafc"
  outer-canvas: "#f1f5f9"
  ink: "#0f172a"
  muted: "#64748b"
  border: "#e2e8f0"
  label: "#334155"
  secondary-ink: "#475569"
  danger: "#be123c"
  danger-hover: "#9f1239"
  danger-soft: "#fff1f2"
  danger-border: "#fecdd3"
  success: "#166534"
  success-soft: "#f0fdf4"
  success-border: "#bbf7d0"
typography:
  body: {fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", sans-serif', fontSize: "14px", lineHeight: 1.6}
  headline: {fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-.025em"}
  title: {fontSize: "17px", fontWeight: 700, lineHeight: 1.4, letterSpacing: "-.02em"}
  label: {fontSize: "13px", fontWeight: 600, lineHeight: 1.4}
  button: {fontSize: "14px", fontWeight: 650, lineHeight: 1.4}
  metric: {fontSize: "26px", fontWeight: 800, lineHeight: 1.2}
rounded: {badge: "6px", inset: "8px", navigation: "10px", control: "12px", card: "16px"}
spacing: {xs: "4px", sm: "8px", compact: "12px", md: "16px", form: "18px", lg: "24px", page: "28px", xl: "32px"}
components:
  button-primary: {textColor: "{colors.surface}", rounded: "{rounded.control}", typography: "{typography.button}", padding: "11px 16px"}
  button-primary-hover: {backgroundColor: "{colors.primary-hover}"}
  button-secondary: {backgroundColor: "{colors.surface}", textColor: "{colors.label}", rounded: "{rounded.control}", padding: "11px 16px"}
  button-danger: {backgroundColor: "{colors.danger}", textColor: "{colors.surface}", rounded: "{rounded.control}", padding: "11px 16px"}
  button-quiet-danger: {backgroundColor: "transparent", textColor: "{colors.danger}", rounded: "{rounded.control}", padding: "8px 10px"}
  input: {backgroundColor: "{colors.surface}", textColor: "{colors.ink}", rounded: "{rounded.control}", padding: "11px 13px"}
  navigation-active: {backgroundColor: "{colors.brand-soft}", textColor: "{colors.primary}", rounded: "{rounded.navigation}", padding: "10px 18px"}
  badge: {backgroundColor: "{colors.brand-soft}", textColor: "{colors.primary}", rounded: "{rounded.badge}", padding: "4px 8px"}
  card: {backgroundColor: "{colors.surface}", rounded: "{rounded.card}", padding: "28px"}
---

# Design System: WMS Workspace

## Overview

Visual authority: [the supplied reference](../newDesing.txt). The implemented system uses native system sans typography, slate backgrounds and text, orange accents, and gently rounded white surfaces for mail management by administrators and executives. Source: `src/index.css`, `src/components/WorkspaceShell.jsx`, `src/pages/AdminDashboardPage.jsx`, and `src/pages/styles/*.css`.

**Key Characteristics:** compact information hierarchy, restrained shadows, clear form controls, and navigation adapted to the current role and viewport.

## Colors

Brand orange identifies the workspace; the darker primary orange supports readable links, active navigation, focus outlines, and white button text. Primary buttons blend the gradient-start color into primary at 100 degrees. Hover uses primary-hover. Soft orange and its border frame access badges and selected roles.

White surfaces sit on the pale slate canvas; the outer page is slightly darker. Ink carries headings, label and secondary-ink support forms, and muted carries secondary copy. Rose indicates destructive actions and errors; green indicates success. Blue, green, orange, and slate icon tiles distinguish existing quick actions.

## Typography

All roles inherit the system font stack; there are no downloaded fonts. Page headings use the headline role. Dashboard welcome headings use `clamp(20px, 2.5vw, 28px)` with 1.3 line height. Supporting copy ranges from 12–14px; access badges and uppercase section labels use 11px. Metrics use tabular numerals. Long names, email addresses, and record details wrap.

## Layout

The centered workspace is at most 1240px wide; dashboards are at most 1120px and reports 1184px. Desktop page padding is 28px horizontally. The sticky header is at least 73px high, with sticky horizontal navigation beneath it. Authentication surfaces use centered cards, typically 460px wide; role selection uses 500px and wide forms 840px.

The admin dashboard orders welcome, three summary cards, quick actions, and the searchable executive roster. Above 900px, actions and roster use a 0.85fr / 1.15fr split; at 900px and below they stack. General action grids and report filters become two columns at that breakpoint.

At 600px and below, the header becomes 65px high and role-aware navigation becomes a fixed five-item bottom bar. Preserve its safe-area inset and `80px + env(safe-area-inset-bottom)` content clearance. Page padding becomes 16px horizontally, dashboard padding 16px, form columns collapse, and form/search inputs use 16px text. Metrics remain three columns; quick actions remain two. At 380px and below, report filters become one column. Tables scroll horizontally within their container.

## Elevation & Depth

Thin slate borders and the shared card shadow separate white surfaces. Primary actions and the orange brand mark have restrained colored shadows. The header and mobile navigation use translucent white with 12px backdrop blur. Exact shadow, focus, and motion values are recorded in the sidecar. State transitions last 160ms with ease; reduced-motion preferences disable transitions and animations.

## Shapes

Cards use the card radius; inputs, buttons, action cards, and avatar tiles use the control radius. Badges use the smaller badge radius; inset record cells use inset. User avatars are circles. Borders are generally 1px. Avoid replacing these with large decorative shapes.

## Components

- Primary buttons have a minimum height of 46px. Secondary buttons use white and slate borders; destructive actions use rose. Quiet logout actions have a 44px minimum height. Disabled buttons reduce opacity to 0.6.
- Inputs use 46px minimum height, visible labels, and a primary border plus orange ring on focus. Shared keyboard focus uses a 3px outline with 3px offset. Keep the skip-to-content link.
- Desktop navigation shows icons beside labels; mobile shows icons above labels. Active links expose `aria-current`. Administrator links are Home, Inbound, Outbound, Execs, Settings; executive links are Home, Inbound, Outbound, Delivery, Reports.
- Executive cards show initials, name, email, phone, location, and company. Summary cards count returned executives and distinct nonempty locations and companies. Loading or failed summaries display an em dash; the roster has loading, error, empty, and no-match messages.
- Role selection uses bordered selectable rows, orange treatment for the primary option, and a trailing icon. Report tables use uppercase header labels and tabular numerals; print styling hides navigation and action/filter controls.

## Do's and Don'ts

- Do reuse the shared tokens, native system type, visible focus states, and responsive navigation clearances.
- Do derive dashboard counts and record fields from the application data.
- Don't copy fictional statuses, trends, queue metrics, or sample people from the reference.
- Don't replace the pinned orange/slate palette or introduce decorative imagery into these operational surfaces.
