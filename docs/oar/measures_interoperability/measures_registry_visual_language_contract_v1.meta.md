---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Visual Language Contract v1
status: seated
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_material_styling_contract_seating_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - architecture-contract
  - measures-registry
  - visual-language
  - material-styling
  - codexstone
layer: second
---

# Measures Registry — Visual Language Contract v1

## Contract Purpose

The Visual Language Contract defines the governing principles for Measures Registry's visual system: typography, color logic, layout density, motion, iconography, and what the visual language must not do.

Visual language expresses the global register — institutional, audit-grade, museum-grade — across all material places.

Visual language does not author authority. Authority is held by Codex and governed contracts.

CSS implementation is not authorized by this contract.

## Typography Principles

### Hierarchy

Typography in Measures Registry is declarative, not expressive.

| Level | Role | Character |
|---|---|---|
| Display / Eyebrow | Chamber identifier, material place label | Small caps, tracked, restrained weight |
| Title | Primary surface statement | Strong weight, precise kerning, non-decorative |
| Subtitle | Secondary surface context | Lighter weight, editorial readability |
| Body | Relational content, explanation, assessment | Comfortable reading scale, generous leading |
| Caption / Label | Form fields, indicators, metadata | Compact, audit-grade |
| Micro | Supporting metadata, version, registration marks | Smallest scale, highest precision |

### Typography Rules

- Typography does not perform enthusiasm. It states.
- No display type that evokes startup energy (oversized hero gradients, heavy distortion).
- Leading (line-height) is generous. Content is not compressed for density.
- Sentence case preferred for body and subtitle. All-caps only for eyebrow/label/institutional identifiers.
- No decorative script. No handwriting fonts.

## Color System

### Material Color Tokens

Color is governed by material assignment. Tokens are named by material function, not by hex value.

CSS implementation assigns hex values to these tokens through a future implementation OAR2.

| Material | Token Name | Tone Function |
|---|---|---|
| Pre-material (Epigraph, Temple) | `token-pre-material-field` | Dark institutional ground |
| Pre-material accent | `token-pre-material-accent` | Minimal crystalline mark |
| Lapis | `token-lapis-field` | Deep mineral depth |
| Lapis relation line | `token-lapis-relation` | Thin gold or silver connective line |
| Crystal | `token-crystal-overlay` | Transparent luminous layer |
| Crystal accent | `token-crystal-accent` | Restrained luminous geometry |
| Obsidian | `token-obsidian-field` | Dark precise diagnostic ground |
| Obsidian contrast | `token-obsidian-contrast` | Sharp light/dark indicator |
| Marble | `token-marble-surface` | Polished formal governed weight |
| Marble governance | `token-marble-governance` | Marble-lapis blend for Right Path |
| Text — primary | `token-text-primary` | Highest contrast readable on field |
| Text — secondary | `token-text-secondary` | Secondary readability layer |
| Text — meta | `token-text-meta` | Audit-grade metadata scale |
| Indicator — neutral | `token-indicator-neutral` | Progress, standing — no alarm |
| Indicator — standing | `token-indicator-standing` | Governed standing display only |
| Surface — card | `token-surface-card` | Content panel surface |
| Surface — field | `token-surface-field` | Page/section background |

### Color Rules

- Color does not imply authority. Color expresses material state.
- No red dominance for diagnostic outputs. Red is informational, not alarm.
- No green/red binary for assessment standing. Standing is nuanced, not pass/fail.
- No pricing-implication color (gold burst, activation gradient) before delivery contract.
- Circuit badges use marble token set — formal, not celebratory.
- Activation state color must not appear before delivery contract condition is met.

## Layout and Density

### Layout Principles

| Principle | Definition |
|---|---|
| Institutional density | Content has space to breathe. Not compressed. Not sparse. |
| Module-based | Content organized in governed modules — card, panel, section. |
| Left-to-right reading hierarchy | Primary content left. Secondary and supporting content right or below. |
| Grid discipline | Implicit grid. Column alignment is consistent. |
| Edge restraint | Content does not crowd viewport edges. Margins are governed. |

### Layout Rules

- No asymmetric hero layouts that imply marketing priority.
- Relational surfaces (Lapis) use editorial multi-column layout.
- Diagnostic surfaces (Obsidian) use focused single-column or structured Q/A layout.
- Contract surfaces (Marble) use formal two-panel or structured card layout.
- No infinite scroll as a discovery pattern — all surfaces are governed, not exploratory.

## Motion Principles

### Motion Rules

- Motion is restrained. Entry gestures only — no looping animation.
- No particle effects, generative backgrounds, or continuous environmental motion.
- Transitions between surfaces are governed — no ad-hoc animation.
- Video/media is rendered in governed passage surfaces only. Media does not bleed into contract surfaces.
- Assessment progress indicators animate on governed state change only — not idle.

### Permitted Motion

| Motion Type | When Permitted |
|---|---|
| Entry fade/reveal | On surface mount — restrained, under 400ms |
| Content reveal | On scroll or state change — single direction, no bounce |
| Progress indicator update | On assessment answer submission — state-driven |
| Video playback | In Media Passage Place only — governed |
| Surface transition | Between named encounter surfaces — governed route only |

### Forbidden Motion

- Looping ambient animation
- Particle or generative field effects
- Celebration animation (confetti, burst) without delivery contract confirmation
- Unsanctioned transitions past governed route

## Iconography and Symbolism

### Principles

Measures Registry uses institutional symbolic language — precision over decoration.

| Type | Governed Use |
|---|---|
| Geometric mark | Material place identifier — crystalline, mineral, architectural |
| Circuit badge | Commerced Circuit standing display — formal, not celebratory |
| Progress indicator | Assessment sequence — restrained, numbered, no trophy |
| Route arrow | Surface continuation — minimal, directional |
| Registration mark | Measures Registry identity — exact, institutional |

### Iconography Rules

- No cartoon or illustrative iconography.
- No award or achievement iconography before delivery contract.
- Symbolic marks must be legible at institutional print scale.
- No symbolic language that implies mysticism, fantasy, or faith-based authority.
- Material marks (crystal, obsidian, lapis, marble) are geometric — they are not gemstone illustrations.

## Visual Language Boundary

The Visual Language Contract governs principles, not implementation.

This contract does not authorize:
- CSS token assignment
- CSS file modification
- Component implementation
- Runtime style injection
- Design file production

CSS token assignment and component implementation wait for a future implementation OAR2.

## Close

Visual language expresses institutional state.
Typography states. Color signals material. Layout governs density.
Motion is restrained. Symbolism is precise.
CSS waits.
Codex holds.
