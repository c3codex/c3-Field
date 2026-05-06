---
document_type: oar2
title: OAR2 — Cohort Conversion Encounter
version: v1
status: ready_for_cody
system: measures_registry

execution_type:
  - frontend_runtime
  - media_map
  - encounter_content

execution_mode:
  - full

canonical_keys:
  encounter_key: cohort_conversion_encounter
  parent_surface: landing_root

  media_roles:
    - hero_measured_image

  action_keys:
    - request_cohort_consideration

deploy: requires_confirmation

fallback_policy: report_only_no_invention

do_not_touch:
  - measures_of_inanna
  - landing_epigraph
  - educate_eval_encounter
  - iis_eval_gate1
  - production_env_vars

validation:
  requires_db_connection: true
  requires_build: true
  requires_storage_check: true
  requires_deploy: false
---

# OAR2 — Cohort Conversion Encounter

## Observed

The landing OAR1 already seated `cohort_conversion_encounter` as a routed surface from the split hero, but its content structure remains incomplete.

The combined split image is valid for `landing_root` choice presentation.

This encounter requires the separate measured/resolved image as its own media role.

## Aligned

`cohort_conversion_encounter` must render as institutional structural orientation prior to governed conversion consideration.

It must not render as:

- generic AI education
- SaaS onboarding
- automatic conversion
- registry confirmation
- immediate SRC intake

## Routed

### Media Map

cohort_conversion_encounter:
  hero_measured_image:
    measures_registry/landing/images/measures_registry_measured_hero.webp

If current storage uses a flat bucket path, Cody must report the actual resolved path and not invent a replacement.

## Encounter Layout

1. measured/resolved hero image
2. title: Measures Conversion
3. subtitle: Structured Foundational Cohort
4. cohort distinction statement
5. 3-phase cohort structure
6. live structural review
7. structural drift index
8. conversion readiness conditions
9. 6 recognition touchpoints
10. structural review threshold
11. 6 governed conversion touchpoints
12. CTA: Request Cohort Consideration

## Core Copy

The Structured Foundational Cohort prepares institutions to recognize, evaluate, and orient their AI environments before governed conversion begins.

The cohort is preparatory.

Conversion requires an additional six-touchpoint governed implementation circuit prior to registry confirmation.

## 3-Phase Cohort

### Phase 1 — Recognition

Session:
Codexstone — Restoring Central Authority

Failure Signature:
Contradictory truth surfaces

Artifact:
codexstone_authority_map_v1.pdf

### Phase 2 — Constraint

Session:
The Three Gates — Constraint Before Scale

Failure Signature:
Unchecked propagation

Artifact:
three_gates_constraint_review_v1.pdf

Three Gates:

1. No AI system operates without identified authority.
2. No output proceeds without validation path.
3. No environment scales beyond governance capacity.

### Phase 3 — Governance

Session:
Governed Execution — Roles, Boundaries, and Implementation

Failure Signature:
Role collapse

Artifact:
governed_execution_review_v1.pdf

Three AI Role Contracts:

1. Authority does not execute.
2. Execution does not invent.
3. Governance remains external to output.

Three Governing Implementations:

1. DB-first rendering.
2. Traceable execution logging.
3. Verification before deployment.

## Live Structural Review

After Session 3, the institution enters a live structural review.

Purpose:

Apply recognition to the institution’s environment, identify active drift zones, identify missing implementation layers, and determine whether governed conversion may proceed.

## Structural Drift Index

No scoring system permitted.

Observed drift zones may include:

- authority
- validation
- governance
- execution
- traceability
- deployment oversight

## Conversion Readiness Conditions

Readiness may include:

- identifiable authority surface
- defined validation ownership
- traceable execution path
- bounded AI role contracts
- governance capacity aligned to deployment scope
- measurable behavioral oversight

## Full Progression

### Recognition Circuit — 6 Touchpoints

1. Epigraph encounter
2. Split-path recognition
3. Educate / evaluate encounter
4. iis_eval_gate1
5. Foundational cohort
6. Live structural review

### Threshold

Structural Review

This is not conversion, approval, or registry confirmation.

It determines whether governed conversion may proceed.

### Governed Conversion Circuit — 6 Touchpoints

1. SRC Intake
2. Codex Authority Seating
3. Constraint Implementation
4. AI Role Contract Assignment
5. Governing Implementation Validation
6. Registry Verification / Conversion Confirmation

## CTA

Request Cohort Consideration

Action key:
request_cohort_consideration

## Frontend Must

- render cohort content from DB metadata
- render measured image from media role
- preserve cohort vs conversion distinction
- show conversion as completed through the governed conversion circuit
- report missing media or action state honestly

## Frontend Must Not

- imply immediate conversion
- imply cohort completion equals registry confirmation
- score institutions
- invent readiness status
- collapse cohort into SRC
- modify landing epigraph
- modify educate/eval path
- touch iis_eval_gate1 capture

## Validation

Cody must run:

select encounter_key, metadata
from public.measures_encounter_def
where encounter_key = 'cohort_conversion_encounter';

Cody must confirm:

- DB connection active
- cohort_conversion_encounter exists
- hero_measured_image resolves or exact missing path is reported
- request_cohort_consideration action exists or exact absence is reported
- no scoring logic introduced
- build succeeds
- no deploy performed

## Success Condition

`cohort_conversion_encounter` renders as a bounded institutional orientation surface that prepares institutions for governed conversion consideration without implying registry confirmation.

Codex defines.
Field structures.
Measures registers.
Chazz routes.
Cody executes.
Frontend renders.