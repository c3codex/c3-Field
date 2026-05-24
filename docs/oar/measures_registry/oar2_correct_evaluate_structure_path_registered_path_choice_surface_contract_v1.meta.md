---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Correct evaluate_structure_path RegisteredPathChoice Surface Contract
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_path_choice_left_right_route_targets_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - registered-runtime
  - path-choice
  - clean-shell
  - visual-contract-parity
  - codex-first
---

# OAR2 — Correct evaluate_structure_path RegisteredPathChoice Surface Contract

## OBSERVED

Visual QA after clean-shell implementation confirms:

- epigraph / intro hero loads
- after intro, the browser opens:

  http://localhost:5173/?surface=evaluate_structure_path

- the opened surface visually shows an old hero-style page:

  AI isn't broken. Systems are.

This is not the intended path-choice encounter expression.

The prior OAR1 confirmed path-choice click props are technically correct:

- left click -> eval_passage
- right click -> structure_passage

However, operator visual QA shows the issue is not the left/right click handler.

The issue is the visual expression of the evaluate_structure_path surface itself.

Current classification:

    clean-shell renderer parity drift

RegisteredPathChoice exists and routes correctly by props, but it does not yet render the seated evaluate_structure_path path-choice contract correctly.

## ALIGNED

This is a clean-shell renderer parity correction.

Do not re-enter the old monolithic runtime.

Do not edit:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not redesign the whole site.

Do not change assessment scoring.

Do not implement email dispatch.

Do not expose payment logic.

Do not alter the registered 13 sequence.

Frontend must render the seated path-choice contract, not legacy hero residue.

## ROUTED

### 1. Inspect RegisteredPathChoice renderer

Inspect:

    src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx

Determine why evaluate_structure_path renders as the old hero-style:

    AI isn't broken. Systems are.

Return:

- renderer file/function
- source of displayed title
- source of displayed body
- whether it uses intro/hero copy instead of path-choice copy
- whether it consumes metadata.header, plaques, actions, hero_paths, or fallback fields
- whether right/left plaques are rendered but visually hidden
- whether the layout collapses into a single old hero panel

### 2. Inspect evaluate_structure_path metadata consumption

Inspect how the clean shell maps DB row to renderer props.

Target row:

    evaluate_structure_path

Confirm consumed metadata fields:

- eyebrow
- title
- subtitle
- plaques
- actions
- hero_paths
- layout_contract
- styling_contract
- path_action_contract
- media_roles

Report whether RegisteredPathChoice currently reads the correct contract fields.

### 3. Render actual path-choice contract

Update RegisteredPathChoice so evaluate_structure_path renders as the governed two-path choice surface.

Required visible structure:

- Measures Registry brand/header only
- clear path-choice title or prompt from seated metadata
- two distinct path plaques/cards/buttons
- left path plaque:
  - label/body from seated metadata where available
  - routes to eval_passage
- right path plaque:
  - label/body from seated metadata where available
  - routes to structure_passage
- no generic c3 Field / Contact header bleed
- no old single-panel hero page standing in place of path choice

### 4. Route targets remain unchanged

Preserve existing prop-based route targets:

    LEFT  -> eval_passage
    RIGHT -> structure_passage

Do not introduce DB action target execution unless explicitly needed.

If DB metadata contains legacy action keys, use them for copy only if needed, not route authority.

### 5. Remove old hero-style expression from this surface

The evaluate_structure_path surface must not primarily render:

    AI isn't broken. Systems are.

unless that text is explicitly seated as part of the path-choice title/subtitle contract.

If that phrase is seated as legacy header or intro copy but conflicts with path-choice contract, do not use it as the main path-choice surface title.

Report the source field if retained anywhere.

### 6. Media behavior

If path-choice media roles are available, use only seated roles.

Allowed:

- path_choice_background if active/resolved
- left_hero_fracture
- left_hero_fracture_motion
- right_measured_hero
- measured_hero_motion_graphic

Do not hardcode media URLs.

If media is absent or held, render the two path plaques without blank panels.

No blank right side.

### 7. Visual QA target

Validate:

    http://localhost:5173/?surface=evaluate_structure_path

Expected:

- visible two-path decision surface
- left path clearly actionable
- right path clearly actionable
- no old single hero page as the whole surface
- no blank right side
- no c3 Field / Contact header
- both path buttons visible in browser viewport

Then validate:

- click left -> eval_passage
- click right -> structure_passage

### 8. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- edit old MeasuresRegistryRuntime.tsx
- reintroduce old handler logic
- route to deprecated surfaces
- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- create DB tables
- delete deprecated rows
- redesign the entire site
- hardcode semantic copy as authority
- hardcode media URLs

## VALIDATION REQUIRED

Return:

- exact visual parity bug source
- files modified
- DB rows modified, if any
- evaluate_structure_path metadata fields consumed
- old rendered title/source
- corrected rendered title/source
- left plaque rendered confirmation
- right plaque rendered confirmation
- left click runtime result
- right click runtime result
- build result
- confirmation old runtime was not edited
- confirmation no deprecated route bleed
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed

## SUCCESS CONDITION

The clean-shell evaluate_structure_path surface renders as the governed two-path choice encounter.

The old hero-style “AI isn't broken. Systems are.” page no longer appears as the path-choice surface after intro.

Left and right path choices are visually distinct, actionable, and route correctly.

Build remains clean.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_correct_evaluate_structure_path_registered_path_choice_surface_contract_v1.meta.md

## CLOSE

Correct the path-choice surface expression.

Do not return to drift city.
