---
name: Librerary
description: An Apple-inspired workspace with a glass document-stack identity.
colors:
  canvas: "#f5f5f7"
  surface: "#ffffff"
  sidebar: "rgba(248, 248, 251, .82)"
  chrome: "rgba(255, 255, 255, .86)"
  line: "#e5e5ea"
  text: "#1d1d1f"
  muted: "#63636b"
  accent: "#0067d8"
  tint: "#eaf2ff"
  hover: "#f0f3f9"
  selection: "#cfe3ff"
  dark-canvas: "#151517"
  dark-surface: "#232326"
  dark-sidebar: "rgba(28, 28, 31, .86)"
  dark-chrome: "rgba(28, 28, 31, .9)"
  dark-line: "#37373e"
  dark-text: "#f5f5f7"
  dark-muted: "#aaaab3"
  dark-accent: "#64adff"
  dark-tint: "#23364f"
  dark-hover: "#2c2c32"
  dark-selection: "#214b7b"
  primary-hover: "#005bbd"
  primary-ink: "#ffffff"
  error-text: "#912921"
  error-surface: "#fff1f0"
  error-line: "#ecc9c8"
  dark-error-text: "#ffb5af"
  dark-error-surface: "#382320"
  dark-error-line: "#69403a"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "clamp(27px, 3vw, 34px)"
    fontWeight: 650
    lineHeight: 1.18
    letterSpacing: "-.035em"
  mobile-headline:
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.2
  title:
    fontSize: "18px"
    fontWeight: 600
  section:
    fontSize: "16px"
    fontWeight: 600
  settings-title:
    fontSize: "15px"
    fontWeight: 600
  body:
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
  control:
    fontSize: "13px"
    fontWeight: 550
  caption:
    fontSize: "12px"
    lineHeight: 1.5
  metadata:
    fontSize: "11px"
    fontWeight: 500
  keyboard-hint:
    fontSize: "10px"
    fontWeight: 500
  brand:
    fontSize: "21px"
    fontWeight: 650
    letterSpacing: "-.03em"
  editor-title:
    fontSize: "32px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-.025em"
  mobile-editor-title:
    fontSize: "27px"
    fontWeight: 650
  editor-body:
    fontSize: "16px"
    lineHeight: 1.85
rounded:
  keyboard: "4px"
  small: "5px"
  sidebar-icon: "6px"
  segmented: "7px"
  icon: "8px"
  field: "9px"
  control: "10px"
  primary: "11px"
  alert: "12px"
  notification: "13px"
  document-icon: "15px"
  document-list: "16px"
  catalog: "17px"
  launch-surface: "18px"
  editor: "19px"
spacing:
  tight: "6px"
  control: "8px"
  related: "12px"
  row: "16px"
  group: "20px"
  inset: "26px"
  section: "36px"
  page-inline: "42px"
  page-top: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.primary}"
    padding: "9px 15px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "9px 15px"
  search:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
    padding: "7px 10px"
    width: "324px"
  navigation-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "10px 13px"
  quick-launch:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.launch-surface}"
    padding: "26px"
---

# Design System: Librerary

## Overview

**Creative North Star: "A calm, native workspace"**

The user explicitly requested an Apple-inspired redesign on 2026-10-17. This supersedes the former green tool-shelf appearance while preserving every existing workflow. The original glass document-stack logo is the expressive brand element; the workspace stays quiet, legible, and task-focused.

Ground truth: [active stylesheet](apps/launcher/src/apple.css), [components](apps/launcher/src/main.tsx), and [brand assets](assets/brand/README.md). Browser previews of all five screens, both themes, and narrow layouts were inspected. Native Windows remains the first delivery platform; this is a Tauri interface, not AppKit or SwiftUI.

**Key Characteristics:**
- Native system typography
- Blue actions on neutral surfaces
- Functional translucent navigation
- Solid reading and editing surfaces
- Responsive rows and controls

## Colors

### Primary

Blue marks primary actions, selected icons, links, and focus. Primary button fill stays the light accent value in both themes for white-text contrast; dark-theme links use the lighter accent role. The blue, ice and periwinkle of the brand image stay inside the logo.

### Neutral

Cool near-white canvas and white working surfaces switch to near-black canvas and charcoal surfaces in dark mode. Every secondary label uses the muted role. Borders separate surfaces without heavy framing. Error colors switch with the theme.

**The Quiet Color Rule.** Reserve saturation for actions, focus, and the original brand icon; avoid additional decorative accent palettes.

## Typography

Use the platform system stack from the headline role for all text. Apple devices resolve the native SF Pro system font; Windows resolves Segoe UI Variable/Segoe UI. Do not redistribute Apple's font files. The original bundled DM Sans dependency has been removed. [Apple font guidance](https://developer.apple.com/documentation/technologyoverviews/fonts).

Hierarchy uses weight, tracking and spacing together: strong page headings, compact section headings, regular descriptive text, and quiet metadata. Writer body text uses comfortable leading and no decorative typeface. Headings tighten tracking; body stays near zero.

**The Native Type Rule.** Match the host's system typography rather than downloading an Apple font for Windows.

## Layout

Desktop has a sticky full-height navigation rail (236px), a sticky translucent toolbar, and a centered working region capped at (1240px). The rail narrows to (212px) at (1050px); actions wrap without being removed. At (650px), navigation becomes a compact top row, pins recede, and all workflows remain accessible through the app catalog. Content uses generous group spacing and tighter spacing within rows.

Home, catalog, templates, preferences and Writer keep the same route actions. Lists remain rows; the document editor is one working surface. Native min-width is (640px); the narrower web preview is a resilience check.

## Elevation & Depth

Translucency is functional chrome: sidebar and toolbar use blur/saturation over a tinted surface. Reading, forms and editing use solid surfaces. Low offset shadows gently separate working surfaces. Toasts have stronger elevation because they float above content.

Reduced-transparency preferences make the chrome opaque. Reduced-motion disables transitions and press scaling. No gesture animation or decorative scene transitions are present.

**The Functional Glass Rule.** Glass belongs to navigation and controls; text content stays on a readable solid surface.

## Shapes

Soft rectangles share the documented radius hierarchy. Inputs and buttons have tighter corners than content surfaces. The original logo is a three-plane glass document stack with alpha outside the symbol, not a fake OS frame. A consistent Lucide stroke icon set represents app functions.

## Components

Buttons provide immediate press feedback, hover, disabled and keyboard-focus states. Primary actions use blue; secondary actions use a quiet border. Navigation uses a pale selected surface and blue icon. Search keeps its label, Ctrl K shortcut and global-search workflow. Filters use a segmented-control tray. Forms use labeled native selects. Catalog availability labels distinguish working and planned modules.

Templates expose verified offline install/removal and creation of independent projects. The package and workspace status messages remain visible. Writer retains title/text fields, back navigation, save handling and TXT export. Notifications and errors remain accessible status/alert regions.

## Do's and Don'ts

- Do preserve user data and every existing action while extending the visual system.
- Do keep glass, gradients and highlights restrained; let the logo carry the richer material.
- Do keep focus, loading, empty, disabled, success and error states readable in both themes.
- Don't fake macOS traffic-light window controls inside the Windows application.
- Don't add Apple logos, proprietary SF Symbols, font files or competitor artwork.
- Don't imply DOCX or other planned modules work because they appear in the catalog.
