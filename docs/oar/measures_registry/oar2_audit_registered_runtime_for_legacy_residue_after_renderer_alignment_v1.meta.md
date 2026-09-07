---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_audit
title: OAR2 — Audit Registered Runtime for Legacy Residue After Renderer Alignment
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_left_path_route_bleed_and_convert_connect_src_soft_intake_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-audit
  - legacy-residue
  - renderer-alignment
  - registered-runtime
  - codex-first
---

# OAR2 — Audit Registered Runtime for Legacy Residue After Renderer Alignment

## OBSERVED

The Measures Registry runtime has now passed through:

1. registered 13 encounter reconciliation
2. encounter contract seating
3. renderer assignment
4. renderer alignment
5. public route activation
6. media contract correction
7. route bleed correction
8. connect_src soft intake conversion

Runtime QA exposed a process lesson:

    Registered authority does not automatically remove legacy runtime residue.

Even after Codex registration and renderer implementation, legacy residue can remain callable inside `src` through:

- hardwired handlers
- stale action targets
- retained aliases
- dead media roles
- precontract surfaces
- fallback routes
- legacy surface dispatch cases
- obsolete form completion paths
- old offering / cohort routes

This OAR2 audits the registered runtime after renderer alignment to identify and contain remaining legacy residue before final visual QA, deployment, or launch-readiness review.

## ALIGNED

This is a post-renderer runtime residue audit.

It should occur after renderer alignment, not before.

Pre-render audit proves DB and contract standing.

Post-render audit proves `src` expresses only the registered runtime.

This audit is inspection-first.

Do not rewrite architecture.

Do not redesign surfaces.

Do not delete deprecated rows.

Do not remove legacy aliases unless removal is required to prevent public route bleed and is explicitly reported.

Do not change assessment scoring.

Do not fork assessment mechanics.

Do not implement email dispatch.

Do not expose payment logic.

Frontend must render seated Codex state only.

## REGISTERED 13 RUNTIME

The intended registered runtime is:

1. ai_isnt_broken_intro
2. evaluate_structure_path
3. eval_passage
4. connect_src
5. measures_assessment
6. structure_passage
7. structured_eval
8. measures_phases_reveal
9. about_measures_registry
10. structural_drift_publication
11. measures_eval_email_contract
12. reserve_seat
13. phase_payment

Valid registered path:

    ai_isnt_broken_intro
        -> evaluate_structure_path
        -> eval_passage OR structure_passage
        -> connect_src
        -> measures_assessment OR structured_eval
        -> measures_phases_reveal
        -> about_measures_registry
        -> structural_drift_publication
        -> measures_eval_email_contract
        -> reserve_seat
        -> phase_payment

## KNOWN DEPRECATED / LEGACY SURFACES TO CONTAIN

Audit for callable residue from:

- educate_eval_encounter
- iis_eval_gate1
- cohort_conversion_encounter
- understand_failure
- foundation_offering
- systems_offering
- foundation_seat_hold
- systems_seat_hold
- c3_field
- landing_root
- landing_path_choice
- measures_ai_operational_evaluation
- educational_diagnostic_passage
- structural_drift_dispatches

Legacy aliases may remain only where intentionally bounded and not reachable from the registered public flow.

## ROUTED

### 1. Audit activeSurface definitions

Inspect `src/measures_registry/MeasuresRegistryRuntime.tsx`.

Return all `SurfaceState` values and classify each as:

- registered 13 surface
- valid internal alias
- deprecated legacy alias
- dead / unused
- unknown

Report any legacy surface still present in the dispatcher.

### 2. Audit activeSurfaceElement dispatcher

Inspect the active surface dispatch chain.

For each branch, report:

- activeSurface value
- renderer function called
- registered encounter key, if any
- legacy/deprecated standing
- whether public registered flow can reach it

Flag any deprecated surface reachable from registered path.

### 3. Audit surfaceFromEncounterKey mappings

Inspect `surfaceFromEncounterKey`.

Return all mappings.

Classify:

- registered key mappings
- legacy key mappings
- fallback mappings
- missing mappings
- mappings that route registered flow into deprecated aliases

Correct only if a mapping causes registered route bleed.

### 4. Audit hardwired navigateSurface calls

Search for all hardwired calls:

    navigateSurface(...)

Classify each target as:

- registered
- valid internal transition
- legacy/deprecated
- unknown

Flag and correct any call where registered flow can route to:

- cohort_conversion_encounter
- educate_eval_encounter
- iis_eval_gate1
- understand_failure
- foundation_offering
- systems_offering
- foundation_seat_hold
- systems_seat_hold

### 5. Audit handleAction route resolution

Inspect `handleAction`.

Confirm:

- registered action targets resolve to registered surfaces
- unknown action targets fail safely
- deprecated targets are not reachable from registered path
- DB-seated action targets are respected where valid
- frontend fallback does not override registered authority

Return any stale action target in DB metadata if found.

### 6. Audit assessment/SRC completion handlers

Inspect:

- MeasuresAssessmentChamber props
- SRC form completion handlers
- assessment completion handlers
- onEnterStructuredEnvironment handlers
- onStructuredEnvironmentVideoEnded handlers
- report generation route behavior

Confirm:

- left path completes to measures_phases_reveal
- right path completes to measures_phases_reveal
- no completion path routes to cohort_conversion_encounter
- no completion path routes to legacy offering surfaces
- structured_eval does not fork scoring

### 7. Audit connect_src behavior after conversion

Confirm `connect_src` now renders as soft SRC intake, not static authority bridge.

Required fields:

- company / institution name
- contact name
- email
- business type

Confirm route behavior:

- left path -> measures_assessment
- right path -> structured_eval

Confirm soft SRC storage behavior:

- persistent storage if existing approved mechanism supports it
- local/runtime handoff if persistence is not yet seated
- no new DB table invented
- no duplicate SRC authority created

### 8. Audit media role residue

Inspect queried media roles and consumed media variables.

Classify:

- consumed active role
- consumed inactive/held role
- queried but dead role
- active but unconsumed role
- deprecated / superseded media role

Specifically verify:

- hero_video remains inactive if still unrendered
- epigraph_video maps to registry_epigraph_fracture_to_alignment_15s.mp4
- path_choice left/right media roles are supported or explicitly pending renderer extension
- no active dead media role is presented as valid runtime authority

### 9. Audit deprecated DB action targets

Inspect metadata actions for all registered 13 encounters.

Flag any action target pointing to:

- educate_eval_encounter
- iis_eval_gate1
- cohort_conversion_encounter
- understand_failure
- foundation_offering
- systems_offering
- foundation_seat_hold
- systems_seat_hold

Correct only if the action is part of registered public flow.

Do not delete deprecated rows.

### 10. Audit public URL surface access

Test or inspect URL-param access:

    ?surface=<surface>

For each deprecated surface, determine whether direct URL access:

- renders a legacy surface
- renders blank
- redirects to registered equivalent
- is blocked
- is retained intentionally

Recommend containment behavior for direct deprecated URLs.

Do not remove access unless explicitly required by this OAR and safely bounded.

### 11. Validate registered branches

Validate left branch:

    eval_passage
        -> connect_src
        -> measures_assessment
        -> measures_phases_reveal

Validate right branch:

    structure_passage
        -> connect_src
        -> structured_eval
        -> measures_phases_reveal

Validate converged branch:

    measures_phases_reveal
        -> about_measures_registry
        -> structural_drift_publication
        -> measures_eval_email_contract
        -> reserve_seat
        -> phase_payment

### 12. Build validation

Run:

    npm run build:registry

Return build result.

## ALLOWED CORRECTIONS

Allowed only if proven by audit:

- replace deprecated route target with registered target
- update stale DB action target for registered encounter
- contain deprecated surface from registered public path
- remove public path exposure from legacy alias when safe
- correct hardwired navigateSurface target
- add visible fallback where renderer would otherwise blank
- mark dead media role inactive if consumed nowhere and superseded

## DO NOT

- delete deprecated DB rows
- remove traceability metadata
- redesign UI
- broadly refactor runtime
- edit CSS unless narrowly necessary and reported
- hardcode copy
- hardcode media URLs
- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- create new DB tables
- invent new SRC authority
- change registered 13 sequence

## VALIDATION REQUIRED

Return:

- all SurfaceState values classified
- dispatcher branch classification
- surfaceFromEncounterKey mapping review
- hardwired navigateSurface target review
- handleAction route review
- assessment/SRC completion route review
- connect_src behavior review
- media role residue review
- deprecated DB action target review
- direct URL deprecated surface review
- files modified
- DB rows modified, if any
- old targets corrected
- new targets seated
- build result
- registered left branch result
- registered right branch result
- registered converged branch result
- confirmation no deprecated route bleed remains
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed

## SUCCESS CONDITION

The registered runtime is proven clean after renderer alignment.

Legacy residue is either:

- contained
- documented as a bounded alias
- corrected where it caused registered route bleed

The registered public flow no longer exposes precontract or deprecated surfaces.

The runtime is ready for final visual QA.

## PROCESS INTELLIGENCE TO CAPTURE

Seat this lesson in OAR1 closeout:

    Registration does not equal runtime purity.

    After registered runtime seating, src must still be audited for retained aliases,
    stale handlers, dead media roles, and precontract surfaces that can continue
    to express old behavior.

Recommended future sequence:

    1. Seat registered encounters
    2. Seat contracts
    3. Implement renderer alignment
    4. Activate public runtime
    5. Audit registered runtime for legacy residue
    6. Visual QA
    7. Deploy readiness

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_audit_registered_runtime_for_legacy_residue_after_renderer_alignment_v1.meta.md`

## CLOSE

Audit after renderer alignment.

Registration proves authority.

Runtime residue audit proves expression.
