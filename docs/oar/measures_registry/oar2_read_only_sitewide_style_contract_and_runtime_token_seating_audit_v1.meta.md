---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Read Only Sitewide Style Contract and Runtime Token Seating Audit
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_css_parity_for_registered_runtime_downstream_surfaces_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - read-only
  - sitewide-style-contract
  - runtime-token-seating
  - fonts
  - colors
  - visual-governance
  - codex-first
---

# OAR2 — Read Only Sitewide Style Contract and Runtime Token Seating Audit

## OBSERVED

Operator visual QA confirms downstream registered surfaces still do not feel governed.

The prior CSS parity OAR added missing class coverage, but that does not prove the sitewide style contract is actually operating.

Before fixing individual encounters one at a time, the sitewide design system must be read and verified.

Operator directive:

    Review the site contract first.
    Make sure fonts, colors, material tokens, button styles, footer rules, viewport rules, and branding are actually seated and actually consumed.

Current classification:

    runtime flow = accepted
    contact capture flow = accepted
    CSS class coverage = improved
    sitewide visual governance = not accepted
    token seating / runtime consumption = unverified

## ALIGNED

This is a read-only audit.

Do not modify DB.

Do not modify source files.

Do not edit CSS.

Do not change routing.

Do not change assessment scoring.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not edit old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

The purpose is to determine whether the Measures Registry sitewide style contract is:

1. seated in Codex/DB/concordance
2. represented in runtime tokens/CSS variables
3. consumed by the registered runtime and encounter renderers

No correction occurs in this OAR.

## ROUTED

### 1. Read sitewide style contract authority

Inspect:

    measures_registry_sitewide_style_contract

Read from relevant DB/concordance tables, including where applicable:

- concordance_document
- concordance_version
- concordance_relation
- any metadata containing sitewide runtime/style contract bodies

Return:

- document_key
- version_key
- authority_standing
- visibility_standing
- metadata.status
- implementation_order
- all active relation keys
- relation domains
- governed fields
- raw relation metadata where practical

### 2. Verify typography / font contract seating

Read and report the sitewide typography contract.

Return:

- heading font authority
- body font authority
- hierarchy scaling
- desktop typography rules
- mobile typography rules
- heading scale tokens
- body scale tokens
- label/eyebrow tokens
- whether custom fonts are seated or only generic fallback is used
- whether font family variables are defined in CSS
- whether renderer/CSS actually uses those variables

Inspect runtime/CSS for:

- font-family declarations
- CSS custom properties for font families
- hardcoded font stacks
- imported fonts
- fallback font behavior
- heading/body/label hierarchy usage

Classify:

- seated and consumed
- seated but not consumed
- consumed but not seated
- missing contract

### 3. Verify color and material token seating

Read and report the sitewide color/material contract.

Required material families:

- obsidian
- lapis
- crystal
- marble

Return for each material if seated:

- background/field color
- panel/surface color
- primary text
- secondary text
- muted text
- accent
- highlight
- border
- wash/overlay
- hover/focus states
- semantic usage boundaries
- interaction states

Inspect runtime/CSS for:

- root material variables
- material-specific overrides
- `[data-material-family]` token switching
- hardcoded color literals
- color-mix usage
- whether obsidian/lapis/crystal/marble actually switch in runtime
- whether downstream marble pages read marble tokens or hardcoded literals

Classify:

- seated and consumed
- seated but not consumed
- consumed but not seated
- hardcoded drift
- missing contract

### 4. Verify button / CTA contract seating

Read and report button/icon/CTA contract.

Return:

- primary CTA rules
- secondary CTA rules
- passage control rules
- icon rendering authority
- hover behavior
- focus behavior
- disabled/loading states
- mobile scaling

Inspect runtime/CSS for:

- `.registry-action-primary`
- `.registry-action-secondary`
- `.registry-encounter-actions`
- passage buttons
- form submit buttons
- reserve seat buttons
- hover/focus states
- hardcoded button styles inside components

Classify:

- seated and consumed
- seated but not consumed
- partially consumed
- missing contract
- hardcoded drift

### 5. Verify branding / mark / watermark seating

Read and report branding contract.

Return:

- registry mark usage
- mark placement classes
- mark opacity rules
- watermark rules
- institutional identity boundaries
- footer/copyright linkage if included
- entry-surface exclusions if included

Inspect runtime/CSS/renderers for:

- registry mark source
- watermark media role usage
- `registry_mark` media use
- `registry_watermark` media use
- hardcoded mark placement
- mark appearing awkwardly inside content
- watermark behind-content rules
- whether mark behavior differs across obsidian/marble surfaces

Classify:

- seated and consumed
- seated but not consumed
- consumed but not seated
- hardcoded drift
- missing contract

### 6. Verify footer/copyright contract seating

Read and report footer contract.

Return:

- footer visibility rules
- copyright authority
- footer copy authority
- system linkage rules
- entry-surface exclusions
- downstream-surface inclusion
- whether copyright text is seated
- whether footer is required downstream

Inspect runtime/CSS/renderers for:

- footer implementation source
- footer/copyright hardcoding
- shared footer wrapper or repeated markup
- footer visibility decision
- footer absence/presence by surface
- whether first two surfaces are footer-hidden
- whether downstream surfaces are footer-visible

Classify:

- seated and consumed
- seated but not consumed
- consumed but not seated
- hardcoded drift
- missing contract

### 7. Verify viewport containment contract seating

Read and report viewport containment contract.

Return:

- desktop containment rules
- mobile containment rules
- single-screen encounter fit
- overflow behavior
- encounter viewport boundaries
- scroll policy expectations

Inspect runtime/CSS for:

- `min-height: 100svh`
- surface wrapper widths
- max-width tokens
- overflow settings
- bottom peek-through risk
- scroll behavior
- mobile media query coverage
- passage pages
- assessment pages
- contact capture
- email confirmation
- phase reveal
- about

Classify each major surface family:

- seated and consumed
- seated but not consumed
- consumed but not seated
- missing contract
- CSS parity incomplete

### 8. Verify media behavior contract seating

Read and report media behavior contract.

Return:

- autoplay rules
- mute/unmute behavior
- interaction unlock rules
- media persistence boundaries
- encounter-scoped media behavior
- passage video expectations

Inspect runtime for:

- passageMuted state
- whether mute state is session-global
- whether mute resets at encounter boundary
- video autoplay/muted behavior
- video controls
- media persistence across surfaces
- any unscoped marble tone or background audio behavior

Classify:

- seated and consumed
- seated but incorrectly consumed
- session-global drift
- missing contract

### 9. Verify transition contract seating

Read and report transition contract.

Return:

- encounter transition behavior
- dissolve/fade authority
- state isolation expectations
- entry transition rules
- exit transition rules

Inspect runtime/CSS for:

- transition classes
- animation classes
- motion wrappers
- CSS keyframes
- framer motion or equivalent use
- whether transition contract is orphaned

Classify:

- seated and consumed
- seated but not implemented
- orphaned contract
- missing contract

### 10. Verify runtime token pipeline

Inspect clean registered runtime:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    src/measures_registry/registered_runtime/registeredRuntimeUtils.ts
    src/index.css

Return:

- where DB styling_contract is read
- where layout_contract is read
- where source_sitewide_contract is read
- whether sitewide contract is loaded directly or only referenced
- whether runtime produces CSS variables from DB
- whether CSS variables are static
- whether material family is passed to `data-material-family`
- whether each renderer consumes stylingContract or ignores it

### 11. Produce correction classification map

Return table:

| Layer | Contract Standing | Runtime/CSS Standing | Classification | Recommended Correction |
|---|---|---|---|---|

Layers:

- Typography / fonts
- Colors / materials
- Buttons / CTAs
- Branding / mark / watermark
- Footer / copyright
- Viewport containment
- Media behavior
- Transition behavior
- Runtime token pipeline

### 12. Define first encounter correction target

Based on the sitewide contract audit, recommend the first encounter-specific correction target.

Expected likely target:

    eval_passage

But do not implement correction.

Return what must be fixed for `eval_passage` first, grouped by:

- typography
- material/color
- video/media
- CTA/button
- viewport containment
- footer
- transition

### 13. No correction in this OAR

Do not implement any correction.

No DB writes.

No CSS edits.

No renderer edits.

No runtime edits.

This OAR1 must be readback and correction map only.

## DO NOT

- modify DB
- modify source files
- edit CSS
- change routing
- change scoring
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- edit old MeasuresRegistryRuntime.tsx
- add fonts
- add colors
- patch individual surfaces
- accept “CSS exists” as proof of contract operation

## VALIDATION REQUIRED

Return:

- scripts/queries used
- DB/concordance tables inspected
- sitewide contract readback
- typography/font seating readback
- color/material seating readback
- button/CTA seating readback
- branding/mark/watermark seating readback
- footer/copyright seating readback
- viewport containment seating readback
- media behavior seating readback
- transition seating readback
- runtime token pipeline readback
- CSS variable / token readback
- hardcoded drift findings
- contract consumption findings
- correction classification map
- recommended first encounter correction target
- confirmation no DB rows modified
- confirmation no source files modified
- confirmation no CSS modified

## SUCCESS CONDITION

The Measures Registry sitewide style contract is fully read.

Fonts, colors, material tokens, button rules, branding, footer, viewport, media, and transition rules are verified as either seated, consumed, incomplete, or drifting.

The next encounter-specific correction can be routed from the governing sitewide contract rather than visual guessing.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_read_only_sitewide_style_contract_and_runtime_token_seating_audit_v1.meta.md

## CLOSE

Find the design system before fixing the surfaces.
