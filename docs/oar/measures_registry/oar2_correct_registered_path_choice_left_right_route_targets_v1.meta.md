---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Correct RegisteredPathChoice Left Right Route Targets
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
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
  - route-correction
  - codex-first
---

# OAR2 — Correct RegisteredPathChoice Left Right Route Targets

## OBSERVED

Visual QA after clean-shell implementation confirms:

- the clean registered runtime shell loads
- the path choice surface opens
- clicking either the left or right path opens the same old / incorrect page:
  - "AI isn't broken. Systems are."
- the expected left and right passage videos are not opening from the path choice clicks

Expected behavior:

    LEFT path click
        -> eval_passage
        -> left/evaluation passage video

    RIGHT path click
        -> structure_passage
        -> right/structure passage video

Observed behavior:

    LEFT path click
        -> old/shared page

    RIGHT path click
        -> old/shared page

The app has already switched to the clean registered shell:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

The old monolithic runtime is frozen as legacy recovery source only.

Therefore this is a clean-shell route target bug, likely in:

- RegisteredPathChoice.tsx
- MeasuresRegistryRuntimeRegistered.tsx path-choice props
- registered surface mapping
- path-choice action resolver
- default click target shared by both plaques

## ALIGNED

This is a bounded clean-shell correction.

Do not re-enter the legacy monolithic runtime.

Do not patch the old runtime.

Do not rewrite architecture.

Do not alter DB contracts unless the seated action target is proven wrong.

Do not redesign the path choice surface.

Do not change assessment scoring.

Do not implement email dispatch.

Do not expose payment logic.

Frontend must continue rendering seated Codex state only.

## ROUTED

### 1. Inspect RegisteredPathChoice

Inspect:

    src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx

Determine:

- how left/right path buttons are rendered
- what click handlers are used
- whether both buttons share the same route target
- whether actions are read from metadata
- whether a default target is overriding the seated target
- whether both plaques route to the current surface or intro/hero copy

Return the exact cause.

### 2. Inspect parent props / navigation

Inspect:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Confirm what props are passed into RegisteredPathChoice.

Confirm the available navigation function.

Confirm the path-choice renderer can call:

    navigate("eval_passage")
    navigate("structure_passage")

or equivalent registered surface names.

### 3. Correct left path target

The left/evaluation path must route to:

    eval_passage

Do not route left path to:

- evaluate_structure_path
- intro
- ai_isnt_broken_intro
- educational_diagnostic_passage unless explicitly mapped to eval_passage by clean shell alias
- educate_eval_encounter
- understand_failure
- cohort_conversion_encounter

### 4. Correct right path target

The right/structure path must route to:

    structure_passage

Do not route right path to:

- evaluate_structure_path
- intro
- ai_isnt_broken_intro
- cohort_conversion_encounter
- systems_offering
- open_src_intake
- connect_src

### 5. Preserve registered flow

After correction, active flow must be:

    evaluate_structure_path
        LEFT -> eval_passage -> measures_assessment
        RIGHT -> structure_passage -> structured_eval

Do not reintroduce connect_src as a pre-assessment gate.

Do not route either branch to deprecated surfaces.

### 6. Use seated DB action targets where available

If evaluate_structure_path metadata contains seated action targets, use them:

- left / evaluation target: eval_passage
- right / structure target: structure_passage

If metadata structure is inconsistent, add a bounded fallback in the clean shell only:

- left fallback: eval_passage
- right fallback: structure_passage

Report any fallback used.

Do not hardcode semantic copy.

### 7. Validate visual branch behavior

Validate in browser or by runtime inspection:

    ?surface=evaluate_structure_path

Then:

- click left path
  - expected URL/surface: eval_passage
  - expected visual: left/evaluation passage video/surface

- click right path
  - expected URL/surface: structure_passage
  - expected visual: right/structure passage video/surface

Confirm neither click opens the old "AI isn't broken. Systems are." page.

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
- redesign path choice visuals broadly
- hardcode copy
- hardcode media URLs

## VALIDATION REQUIRED

Return:

- exact route bug source
- files modified
- DB rows modified, if any
- left target before
- left target after
- right target before
- right target after
- seated metadata action target readback if used
- fallback target if used
- left click runtime result
- right click runtime result
- build result
- confirmation old runtime was not edited
- confirmation no deprecated route bleed
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed

## SUCCESS CONDITION

The clean registered runtime path choice surface routes correctly:

    LEFT -> eval_passage
    RIGHT -> structure_passage

Both clicks open their intended passage surfaces.

The old shared "AI isn't broken. Systems are." page no longer appears after either path choice click.

Build remains clean.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_correct_registered_path_choice_left_right_route_targets_v1.meta.md`

## CLOSE

Fix the clean-shell branch target.

Do not return to drift city.
