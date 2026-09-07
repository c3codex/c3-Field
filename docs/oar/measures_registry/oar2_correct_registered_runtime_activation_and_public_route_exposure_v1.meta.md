---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_activation
title: OAR2 — Correct Registered Runtime Activation and Public Route Exposure
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-activation
  - public-route-exposure
  - registered-runtime
  - codex-first
---

# OAR2 — Correct Registered Runtime Activation and Public Route Exposure

## OBSERVED

Local runtime review confirms:

- the site loads
- the intro surface renders
- the evaluate_structure_path surface renders
- after path choice, legacy or unintended pages appear
- the intended registered runtime sequence does not fully continue

The prior implementation OAR1 confirmed the registered 13 runtime renderer alignment built cleanly and preserved DB state unchanged. However, inactive registered stub encounters and legacy route exposure likely prevent the intended public runtime from resolving in browser review.

Likely seam:

- contracted registered encounters remain inactive or unreadable to anon runtime
- path choice actions still route to legacy encounter keys
- deprecated public routes remain exposed
- transition/action metadata does not fully align to registered 13 public flow

## ALIGNED

This is runtime activation and public route exposure correction.

Do not redesign the frontend.

Do not rewrite renderer architecture.

Do not alter assessment scoring.

Do not fork structured_eval mechanics.

Do not implement email dispatch.

Do not delete deprecated rows.

Correct only the activation, action targets, route exposure, and anon-readable registered runtime path needed for local/live review.

No DB row = not registered.

No anon readback = not publicly reviewable.

## REGISTERED PUBLIC FLOW

The intended public runtime flow is:

    ai_isnt_broken_intro
        ↓
    evaluate_structure_path
        ├─ eval_passage
        │      ↓
        │   connect_src
        │      ↓
        │   measures_assessment
        │      ↓
        │   measures_phases_reveal
        │
        └─ structure_passage
               ↓
            connect_src
               ↓
            structured_eval
               ↓
            measures_phases_reveal

    measures_phases_reveal
        ↓
    about_measures_registry
        ↓
    structural_drift_publication
        ↓
    measures_eval_email_contract
        ↓
    reserve_seat
        ↓
    phase_payment

## ROUTED

### 1. Verify current runtime standing

Inspect:

- measures_encounter_def rows for all 13 registered encounters
- is_active standing
- release/access standing
- contract_status
- source_sitewide_contract
- metadata.renderer
- transition/action targets
- measures_transition_rule rows for registered runtime sequence
- anon-readable readback for intended public encounters

Report where runtime visibility fails.

### 2. Activate registered public encounters required for review

Ensure the registered 13 public encounters required for the runtime sequence are active/readable for public runtime review.

Target active/readable encounters:

- ai_isnt_broken_intro
- evaluate_structure_path
- eval_passage
- connect_src
- measures_assessment
- structure_passage
- structured_eval
- measures_phases_reveal
- about_measures_registry
- structural_drift_publication
- measures_eval_email_contract
- reserve_seat
- phase_payment

If phase_payment should remain unreleased for payment safety, report and set it to held/reviewable only if current runtime requires public access. Do not expose real payment logic.

### 3. Correct path-choice public action targets

Ensure evaluate_structure_path routes to registered paths:

- left/evaluation path target: eval_passage
- right/structure path target: structure_passage

Do not route to deprecated or legacy targets.

### 4. Correct passage and junction routing

Ensure:

- eval_passage -> connect_src
- structure_passage -> connect_src
- connect_src routes next based on path context:
  - left path -> measures_assessment
  - right path -> structured_eval

If connect_src cannot preserve path context from registered route state, report exact runtime limitation and apply minimal route-state correction.

### 5. Correct post-assessment routing

Ensure:

- measures_assessment -> measures_phases_reveal
- structured_eval -> measures_phases_reveal
- measures_phases_reveal -> about_measures_registry
- about_measures_registry -> structural_drift_publication
- structural_drift_publication -> measures_eval_email_contract
- measures_eval_email_contract -> reserve_seat
- reserve_seat -> phase_payment

### 6. Contain deprecated public routes

Deprecated public encounters must not appear in intended public navigation:

- educate_eval_encounter
- iis_eval_gate1
- cohort_conversion_encounter
- understand_failure
- foundation_offering
- systems_offering
- systems_seat_hold

Do not delete rows.

If legacy aliases remain for backward compatibility, keep them inaccessible from the registered public flow and document them.

### 7. Preserve

Do not alter:

- assessment mechanics
- assessment scoring
- structured_eval fork guard
- email dispatch deferred state
- email contract exclusion of phase reveal
- recommended structural response inclusion
- approved content contracts
- renderer contract assignments
- sitewide contract bindings
- deprecated row traceability

### 8. Validation required

Return:

- DB tables inspected
- DB rows updated, if any
- frontend files modified, if any
- before/after active/readable standing for all 13 encounters
- path action targets after correction
- transition/routing readback
- anon-readback confirmation for public registered runtime encounters
- build result
- local runtime review notes if available
- confirmation deprecated pages are not exposed in intended public flow

## DO NOT

- delete deprecated DB rows
- redesign pages
- edit CSS unless required for route visibility and explicitly reported
- hardcode route truth in frontend if DB action targets can govern
- invent new copy
- implement payment logic
- implement email sending
- fork scoring
- change sitewide style contract

## SUCCESS CONDITION

The registered 13 runtime is publicly reviewable in local/browser runtime.

After evaluate_structure_path, the flow routes only through registered public encounters.

Legacy/deprecated pages no longer appear in the intended public path.

The registered website runtime is ready for visual QA and release/deploy preparation.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md`

## CLOSE

Activate and expose the registered runtime path.

No legacy route bleed.
