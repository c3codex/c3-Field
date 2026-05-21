---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend_alignment
title: OAR2 — Frontend Token Replacement Alignment v1
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - measures-registry
  - frontend
  - token-alignment
  - branding
  - lapis-v2
  - runtime
  - visual-authority
source_alignment:
  - OAR1 - Seat Approved Lapis v2 Brand Tokens v1
  - OAR1 - Measures Registry Branding + Frontend Dependency Audit v1
  - Measures Registry Brand Package Lapis v2
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Frontend Token Replacement Alignment v1

## OBSERVED

Approved Measures Registry Lapis v2 brand tokens are now seated as governed runtime design-token authority.

Runtime read confirmed all six approved brand tokens are available:

- brand_obsidian
- brand_deep_lapis
- brand_lapis_night
- brand_silver_frame
- brand_crystal_star
- brand_marble_accent

The prior OAR1 confirmed the authority is seated, but surface alignment remains pending.

Current frontend still contains:

- hardcoded hex colors
- hardcoded RGBA values
- legacy Measures-era colors
- near-match token usage
- off-palette accents
- mixed Measures/Inanna visual references

This OAR2 routes controlled replacement alignment only.

## ALIGNED

This is not a redesign.

This is governed frontend alignment to already seated brand authority.

Measures Registry public runtime should resolve visual language through approved Lapis v2 tokens wherever applicable.

Approved mapping:

background_obsidian → brand_obsidian
panel_obsidian      → brand_lapis_night
accent_cool         → brand_deep_lapis
text_primary        → brand_silver_frame
text_secondary      → brand_marble_accent
text_muted          → brand_marble_accent
border_subtle       → brand_silver_frame
highlight/star      → brand_crystal_star

Preserve system distinction:

- Measures Registry public runtime uses Lapis v2 brand tokens.
- Measures of Inanna material/phase-map systems remain distinct.
- Do not collapse material tokens into Measures Registry brand tokens.

## ROUTED

### 1. Replace Measures Registry color usage with governed tokens

Audit and update only Measures Registry public runtime styling in:

src/measures_registry/MeasuresRegistryRuntime.tsx
src/index.css

Replace applicable hardcoded colors and legacy tokens with seated brand tokens.

### 2. Preserve non-Measures visual systems

Do not alter:

- Measures of Inanna material tokens
- phase-map material colors
- exhibition-specific surfaces
- unrelated shared styles unless directly used by Measures Registry public runtime

### 3. Use token authority, not new hardcoded values

No new hex/RGBA values should be introduced for Measures Registry brand surfaces.

Where opacity is needed, Cody may use token-derived CSS variables with opacity handling, but must avoid arbitrary color invention.

### 4. Align primary surfaces first

Prioritize:

- intro
- landing
- recognition passage
- assessment explainer
- Assessment Chamber
- completion surface
- Structured Environment passage
- buttons
- cards/forms
- overlays/watermarks
- text and borders

### 5. Keep layout intact

Do not restructure flow, routing, assessment logic, media handling, or intake capture.

This OAR2 is visual token alignment only.

### 6. Return before/after standing

OAR1 must report:

- replaced hardcoded colors
- remaining hardcoded colors
- untouched non-Measures surfaces
- token mapping used
- build result

## CODY ROLE

Cody may:

- replace Measures Registry color references with governed brand token variables
- update CSS variable mapping
- preserve visual containment
- verify build
- write OAR1 closeout

Cody may not:

- redesign page structure
- rename DB tokens
- mutate DB
- alter media roles
- alter assessment behavior
- collapse Inanna material systems
- introduce new unapproved brand colors

## VALIDATION

This OAR2 resolves successfully when:

- Measures Registry public runtime uses approved Lapis v2 token authority
- hardcoded color drift is reduced
- no new visual authority is invented
- Inanna/material systems remain untouched
- build passes
- OAR1 records replacements and remaining drift

## EXPECTED OAR1

docs/oar/measures_registry/oar1_frontend_token_replacement_alignment_v1.meta.md

## CLOSE

The authority is seated.

Now the surface aligns.
