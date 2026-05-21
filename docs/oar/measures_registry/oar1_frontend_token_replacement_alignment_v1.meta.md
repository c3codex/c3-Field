---
document_type: oar1
authority_level: recorded
document_scope: measures_registry_frontend_alignment
title: OAR1 - Frontend Token Replacement Alignment v1
status: recorded
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_frontend_token_replacement_alignment_v1.meta.md
trace_type: Frontend token replacement alignment closeout
runtime_spine:
  - Codex
  - Field
  - Measures
  - OAR2
  - Chazz
  - Cody
  - src
---

# OAR1 - Frontend Token Replacement Alignment v1

## OBSERVED

Approved Lapis v2 brand tokens were already seated in Measures Registry runtime authority:

- brand_obsidian
- brand_deep_lapis
- brand_lapis_night
- brand_silver_frame
- brand_crystal_star
- brand_marble_accent

The frontend token plumbing already renders active DB tokens as CSS variables using the existing `--registry-*` naming contract. No TypeScript runtime change was required.

## ALIGNED

Updated file:

- src/index.css

Unchanged runtime contract:

- src/measures_registry/MeasuresRegistryRuntime.tsx

The Measures Registry runtime root now defines scoped Lapis v2 alignment aliases:

- `--registry-brand-field`
- `--registry-brand-panel-surface`
- `--registry-brand-accent`
- `--registry-brand-primary-text`
- `--registry-brand-secondary-text`
- `--registry-brand-muted-text`
- `--registry-brand-border`
- `--registry-brand-highlight`
- `--registry-brand-panel-wash`
- `--registry-brand-field-wash`

These aliases resolve first to the seated `brand_*` tokens and retain prior token names only as continuity fallbacks.

## TOKEN MAPPING USED

- background_obsidian -> brand_obsidian
- panel_obsidian -> brand_lapis_night
- accent_cool -> brand_deep_lapis
- accent_warm / highlight use -> brand_crystal_star
- text_primary -> brand_silver_frame
- text_secondary -> brand_marble_accent
- text_muted -> brand_marble_accent
- border_subtle -> brand_silver_frame

## REPLACED SURFACES

Token alignment was applied across Measures Registry public runtime surfaces including:

- intro video field
- landing hero field and overlay
- route/path choice public runtime text and panel surfaces
- encounter/reserve/offering/authority surfaces
- recognition passage
- diagnostic passage
- assessment explainer
- Assessment Chamber
- completion media surface
- Structured Environment passage
- publication/field-guide surfaces
- buttons, cards, forms, and registry panels

Replaced applicable legacy references to:

- `var(--registry-background-obsidian)`
- `var(--registry-panel-obsidian)`
- `var(--registry-accent-cool)`
- `var(--registry-accent-warm)`
- `var(--registry-text-primary)`
- `var(--registry-text-secondary)`
- `var(--registry-text-muted)`
- `var(--registry-border-subtle)`

Replaced applicable hardcoded Measures Registry public-surface colors including video/image black backgrounds, pale RGBA borders, pale CTA fills, dark CTA text, and assessment-chamber warm marble-era washes with token-derived variables or `color-mix()` against seated brand aliases.

## REMAINING HARDCODED COLORS

Remaining hardcoded color hits were not treated as new Measures Registry brand authority.

They are classified as:

- pre-existing c3 Field / runtime-lens visual systems outside this OAR2 replacement pass
- cinematic route/threshold media effects that still require a separate bounded visual-effects audit before replacement
- operational status/error/success colors such as read failure, missing records, reserve success, and reserve error states
- Measures of Inanna / phase-map / exhibition material surfaces after the Measures Registry public runtime section

Those surfaces were not collapsed into Lapis v2 brand tokens in this pass.

## BOUNDARIES HELD

No DB mutation was performed.

No design-token rows were renamed.

No routing, assessment behavior, intake capture, media authority, publication logic, or release logic was changed.

No Inanna material tokens, phase-map material colors, or exhibition-specific surfaces were altered as brand-token authority.

Frontend remained a renderer of seated runtime state.

## VALIDATION

Commands:

- `rg -n -- "--registry-(background-obsidian|panel-obsidian|accent-cool|accent-warm|text-primary|text-secondary|text-muted|border-subtle)" src/index.css`
- `git diff --check -- src/index.css`
- `npm.cmd run build:registry`

Result:

- Legacy Measures token references remain only inside root fallback aliases.
- Diff whitespace check passed.
- Initial sandboxed build hit the known Vite/esbuild workspace access-denied condition.
- Escalated build passed.

Build output:

- dist-registry/index.html
- dist-registry/assets/index-5w8GRKHD.css
- dist-registry/assets/index-btmFvJqg.js

## CLOSE

Measures Registry public runtime now resolves primary visual surfaces through approved Lapis v2 brand token authority.

The surface aligned.

The spine remained unchanged.
