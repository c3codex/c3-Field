---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Correct Registered Runtime One-Step-Late URL History Sync
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_evaluate_structure_path_registered_path_choice_surface_contract_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - registered-runtime
  - url-sync
  - history-state
  - clean-shell
  - codex-first
---

# OAR2 — Correct Registered Runtime One-Step-Late URL History Sync

## OBSERVED

Operator browser QA confirms the visible surfaces are advancing, but the URL query appears one surface behind.

Observed behavior:

    intro video finishes
        -> path-choice page loads correctly
        -> URL still shows ?surface=ai_isnt_broken_intro

Then:

    next surface opens
        -> URL shows ?surface=evaluate_structure_path

This indicates a registered runtime URL/history synchronization failure.

The content is not the primary issue.

The active seam is:

    visible surface changes
    but URL surface query writes late or writes the previous surface

Expected URL behavior:

    intro visible
        -> ?surface=ai_isnt_broken_intro

    path choice visible
        -> ?surface=evaluate_structure_path

    left/eval passage visible
        -> ?surface=eval_passage

    right/structure passage visible
        -> ?surface=structure_passage

The URL must represent the currently visible registered surface, not the prior surface.

## ALIGNED

This is a clean-shell navigation/history correction.

Do not change DB content.

Do not change renderer copy.

Do not change path-choice content.

Do not alter assessment scoring.

Do not alter contact capture.

Do not alter email contract behavior.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Frontend must preserve registered surface identity.

## ROUTED

### 1. Inspect registered runtime navigation

Inspect:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Specifically inspect:

- navigate()
- writeHistory()
- surface query parsing
- surface query serialization
- initial surface resolution
- popstate handling
- intro video completion handler
- path-choice click handlers
- passage continue handlers

Return the exact source of the one-step-late URL behavior.

### 2. Check for stale activeSurface usage

Determine whether URL writes are using stale state.

Common failure pattern:

    navigate(nextSurface)
        -> setActiveSurface(nextSurface)
        -> writeHistory(activeSurface)

where `activeSurface` is the previous value.

Correct behavior:

    navigate(nextSurface)
        -> setActiveSurface(nextSurface)
        -> writeHistory(nextSurface)

or equivalent same-tick serialization of the target surface.

### 3. Check for activeSurface changes without URL writes

Identify any handlers that call:

    setActiveSurface(...)

without a matching history update.

Likely candidates:

- intro video ended handler
- intro skip handler
- path-choice click handler
- passage continue handler
- direct surface transition helpers
- any auto-advance effect

All visible registered surface transitions must write matching URL query state.

### 4. Correct surface-to-query serialization

Ensure internal surface states serialize to their registered public query keys:

    intro                  -> ai_isnt_broken_intro
    path_choice            -> evaluate_structure_path
    eval_passage           -> eval_passage
    structure_passage      -> structure_passage
    measures_assessment    -> measures_assessment
    structured_eval        -> structured_eval
    connect_src            -> connect_src
    measures_eval_email_contract -> measures_eval_email_contract
    measures_phases_reveal -> measures_phases_reveal
    about_measures_registry -> about_measures_registry
    structural_drift_dispatches -> structural_drift_publication
    reserve_seat           -> reserve_seat
    phase_payment          -> phase_payment

If the runtime uses a separate query alias map, ensure it maps in both directions correctly.

### 5. Preserve backward compatibility aliases

Do not break inbound compatibility for older URLs where already supported.

Inbound aliases may continue mapping:

    landing_root -> intro
    ai_isnt_broken_intro -> intro
    landing_path_choice -> path_choice
    evaluate_structure_path -> path_choice
    educational_diagnostic_passage -> eval_passage
    structural_drift_dispatches -> structural_drift_dispatches

But outbound URL writes must use the registered public encounter key, not a stale alias or previous surface.

### 6. Runtime validation

Validate in browser.

Start fresh:

    http://localhost:5173/?surface=ai_isnt_broken_intro

Expected:

    visible intro
    URL ?surface=ai_isnt_broken_intro

After intro completes / continue / skip:

    visible path choice
    URL ?surface=evaluate_structure_path

Click left:

    visible eval_passage
    URL ?surface=eval_passage

Return to path choice and click right:

    visible structure_passage
    URL ?surface=structure_passage

Continue from eval_passage:

    visible measures_assessment
    URL ?surface=measures_assessment

Continue from structure_passage:

    visible structured_eval
    URL ?surface=structured_eval

No visible surface may display while the URL still points to the previous surface.

### 7. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- edit old MeasuresRegistryRuntime.tsx
- modify DB rows
- change renderer copy
- change path-choice content
- change assessment questions
- change assessment scoring
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- hardcode media URLs
- accept build-only validation

## VALIDATION REQUIRED

Return:

- exact URL sync bug source
- files modified
- DB rows modified, if any
- old navigate/writeHistory behavior
- new navigate/writeHistory behavior
- surface-to-query serialization map
- inbound alias map retained
- intro URL sync result
- path-choice URL sync result
- left/eval passage URL sync result
- right/structure passage URL sync result
- assessment URL sync result
- structured_eval URL sync result
- build result
- confirmation old runtime was not edited
- confirmation no DB rows modified
- confirmation no renderer/content changes
- confirmation no scoring/contact/email changes

## SUCCESS CONDITION

The visible registered surface and browser URL query are synchronized on every public transition.

No surface displays with the previous surface's URL.

The one-step-late URL behavior is removed.

Build remains clean.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_correct_registered_runtime_one_step_late_url_history_sync_v1.meta.md

## CLOSE

URL must tell the same truth as the visible surface.
