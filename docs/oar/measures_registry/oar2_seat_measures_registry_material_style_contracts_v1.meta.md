---
document_type: oar2
authority_level: working
document_scope: measures_registry_style_contracts
title: OAR2 — Seat Measures Registry Material Style Contracts
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_read_only_sitewide_style_contract_and_runtime_token_seating_audit_v1.meta.md
  - docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
  - docs/oar/measures_registry/oar1_create_minimal_contract_native_css_layer_for_registered_runtime_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - material-style-contracts
  - obsidian
  - lapis
  - marble
  - design-tokens
  - contract-native-css
  - codex-first
---

# OAR2 — Seat Measures Registry Material Style Contracts

## OBSERVED

Read-only sitewide style and token audit confirmed:

- `measures_registry_sitewide_style_contract` is active and seeded.
- `mrssc_v1_color_material_contract` is active.
- The color/material contract governs:
  - obsidian
  - lapis
  - crystal
  - marble
  - semantic usage boundaries
  - interaction states

Current material standing:

    Obsidian
        -> seated and consumed

    Lapis
        -> seated in DB as accent/panel tokens
        -> not consumed as a full material surface override

    Marble
        -> defined as material family
        -> current literal values hardcoded in CSS
        -> not fully seated as DB design tokens

The registered runtime now has a minimal contract-native CSS layer:

    src/measures_registry/registered_runtime/styles/

This allows material contracts to be seated and consumed without continuing to expand `src/index.css`.

## ALIGNED

This OAR seats Measures Registry material style contracts and prepares runtime/CSS consumption.

This is not an encounter redesign OAR.

Do not change routing.

Do not change assessment scoring.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not alter accepted intro/threshold behavior.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not rewrite `src/index.css`.

Material truth must resolve from seated design tokens and styling contracts.

## ROUTED

### 1. Inspect current material token standing

Inspect existing `measures_design_token` rows for registry:

    registry_key = measures_registry

Read back all active tokens related to:

- obsidian
- lapis
- marble
- crystal if already present
- primary text
- secondary text
- muted text
- border
- accent
- highlight
- field/background
- panel/surface
- wash/overlay
- hover/focus if present

Return token readback before mutation.

### 2. Preserve obsidian contract

Do not break current obsidian behavior.

Obsidian is already operational and consumed.

Confirm existing obsidian tokens remain active:

- background_obsidian
- brand_obsidian
- panel_obsidian
- brand_lapis_night
- brand_deep_lapis
- brand_silver_frame
- brand_marble_accent
- brand_crystal_star
- text_primary
- text_secondary
- text_muted
- border_subtle

If additional obsidian semantic tokens are required for clarity, add only if bounded and documented.

### 3. Seat lapis material surface token contract

Lapis is currently used as accent/panel support but not as a full surface material.

Seat lapis material tokens sufficient for full surface use.

Suggested token set:

    lapis_field
    lapis_panel_surface
    lapis_primary_text
    lapis_secondary_text
    lapis_muted_text
    lapis_border
    lapis_accent
    lapis_highlight
    lapis_wash

Use existing values where already seated:

    brand_deep_lapis
    brand_lapis_night
    accent_cool
    brand_silver_frame
    brand_crystal_star

Do not invent a new visual direction. Derive from existing Measures Registry palette.

### 4. Seat marble material surface token contract

Move current hardcoded marble literal values into DB design tokens.

Current hardcoded CSS values to seat:

    marble_field: #f4efe4
    marble_panel_surface: #eae4d9
    marble_primary_text: #13110e
    marble_secondary_text: #3d3830
    marble_muted_text: #6b6357
    marble_border: rgba(19, 17, 14, 0.14)
    marble_accent: #2b5ab8
    marble_highlight: #2b5ab8
    marble_panel_wash: color-mix(in srgb, #eae4d9 72%, transparent)
    marble_field_wash: color-mix(in srgb, #f4efe4 76%, transparent)

If DB token storage should not carry `color-mix()` values, store direct base colors and leave derived `color-mix()` in CSS using DB-seated base tokens.

Do not leave marble authority as CSS literals only.

### 5. Confirm material family contract metadata

Confirm `mrssc_v1_color_material_contract` relation metadata still governs:

- obsidian
- lapis
- marble
- semantic usage boundaries
- interaction states

If the relation metadata does not explicitly define material families beyond governed labels, update only metadata necessary to point to the new material token keys.

Do not replace the whole sitewide contract.

### 6. Update contract-native CSS material layer

Use the minimal registered-runtime CSS layer.

Preferred file:

    src/measures_registry/registered_runtime/styles/registry.materials.css

If this file does not exist, create it and import it from:

    registry.runtime.css

Add scoped material-family rules under:

    .measures-registry-runtime[data-material-family="obsidian"]
    .measures-registry-runtime[data-material-family="lapis"]
    .measures-registry-runtime[data-material-family="marble"]

Rules must use DB-injected CSS variables first.

Example pattern:

    --registry-brand-field: var(--registry-marble-field, #f4efe4);

Fallback literals are allowed only as temporary fallback and must match DB-seated values.

Do not place new material rules in `src/index.css`.

Do not rewrite existing `src/index.css`.

### 7. Preserve existing token bridge

Do not change the DB token pipeline unless required.

Current pipeline:

    measures_design_token
        -> designTokens
        -> cssTokenName()
        -> inline CSS variables on .measures-registry-runtime
        -> CSS var() consumption

Keep this pipeline.

Add new tokens so they resolve through existing `cssTokenName()`.

Example:

    marble_field
        -> --registry-marble-field

    lapis_panel_surface
        -> --registry-lapis-panel-surface

### 8. Runtime material-family consumption check

Inspect the clean registered runtime and renderers for hardcoded material family usage.

Known issues from audit:

    RegisteredPhaseReveal
        data-material-family="marble" hardcoded

    RegisteredAbout
        data-material-family="marble" hardcoded

Do not necessarily correct those in this OAR unless minimal and safe.

At minimum, report all places where `data-material-family` is hardcoded rather than read from:

    encounterCopy.stylingContract?.material_family

If correction is safe and bounded, update to read from stylingContract.

Do not change encounter identity, route, or copy.

### 9. Crystal handling

Crystal is included in the sitewide contract but is not the active focus of this OAR.

Read existing crystal tokens.

Do not expand crystal surface behavior unless already seated and needed by current runtime.

Return recommendation for future crystal material token seating if incomplete.

### 10. Build validation

Run:

    npm run build:registry

Return clean build result.

### 11. Browser spot check

Spot check material surfaces:

Obsidian:

    ?surface=eval_passage
    ?surface=connect_src

Marble:

    ?surface=measures_phases_reveal
    ?surface=about_measures_registry

If lapis has no active standalone surface, verify CSS rule exists and token values are present, but do not invent a lapis encounter.

Confirm:

- obsidian still renders correctly
- marble renders from DB-backed tokens or DB-backed variables
- no route regression
- no intro/threshold regression

## DO NOT

- redesign encounters
- modify routing
- modify scoring
- modify assessment questions
- modify contact capture behavior
- modify email contract behavior
- implement email dispatch
- expose payment logic
- rewrite `src/index.css`
- delete existing CSS
- edit old MeasuresRegistryRuntime.tsx
- hardcode new material authority in renderer
- create unrelated tokens
- broaden into transition animation work

## VALIDATION REQUIRED

Return:

- DB token readback before change
- DB tokens inserted or updated
- material contract metadata readback
- CSS files created/modified
- exact material selectors added
- runtime files modified, if any
- hardcoded material-family findings
- obsidian spot check result
- marble spot check result
- lapis standing result
- build result
- confirmation `src/index.css` was not rewritten
- confirmation old runtime was not edited
- confirmation no routing/scoring/contact/email changes
- confirmation intro/threshold surfaces not altered

## SUCCESS CONDITION

Measures Registry material style contracts are seated for:

- obsidian
- lapis
- marble

Obsidian behavior remains intact.

Lapis has a usable material surface token contract.

Marble no longer depends only on hardcoded CSS literals for authority.

The registered runtime CSS layer can consume material-family tokens through the existing DB token pipeline.

Build remains clean.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_measures_registry_material_style_contracts_v1.meta.md

## CLOSE

Seat the materials before styling the encounters.
