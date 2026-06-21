---
document_type: oar2
authority_level: working
document_scope: measures_registry_current_runtime_allowlist_and_terminology_isolation
title: OAR2 - Create Measures Registry Current Runtime Allowlist and Terminology Isolation Contract v1
status: confirmed
version: v1
operator: op044
system: measures_registry
isolation_path: docs/seat/measures_registry_isolated/
source_privileged_preflight_oar1: docs/seat/measures_registry/09_oar/oar1_verify_privileged_evidence_for_measures_registry_exact_row_db_reconciliation_v1.meta.md
db_mutation_authorized: false
frontend_mutation_authorized: false
route_activation_authorized: false
payment_activation_authorized: false
scheduling_activation_authorized: false
map_activation_authorized: false
seat_activation_authorized: false
crystal_seat_activation_authorized: false
---

# OAR2 - Create Measures Registry Current Runtime Allowlist and Terminology Isolation Contract v1

## OBSERVED

Privileged DB evidence has been verified.

The privileged evidence confirmed:

- DB access standing: privileged_read_available
- privileged evidence available: true
- indexed entries: 141
- exact existing rows: 140
- ready without operator decision: 0
- operator review required: 140
- blocked rows: 1
- DB mutation: false
- frontend mutation: false

The exact-row review surface contains more inherited, legacy, held, mixed, or misnamed rows than current launch/runtime rows.

Attempting to reconcile every inherited row as the primary move would overfit the old working surface.

The correct isolation strategy is positive authority first:

Define what may govern current Measures Registry.
Everything else becomes non-governing by default.

## ALIGNED

Create a current-runtime allowlist and terminology isolation contract inside the isolated Measures Registry folder.

This OAR2 is documentation-only.

It does not authorize DB mutation, frontend mutation, route activation, payment activation, scheduling activation, MAP activation, SEAT activation, Crystal Seat activation, c3 Key assignment, Field access, certification, conversion, publishing, posting, scheduling, upload, deletion, rename, or c3 back office activation.

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

Read existing isolated evidence:

docs/seat/measures_registry_isolated/db_row_disposition_matrix.meta.md
docs/seat/measures_registry_isolated/exact_row_reconciliation_evidence_index.meta.md
docs/seat/measures_registry_isolated/exact_row_reconciliation_blockers.meta.md
docs/seat/measures_registry_isolated/privileged_db_evidence_preflight.meta.md
docs/seat/measures_registry_isolated/post_assessment_circuit_index.meta.md
docs/seat/measures_registry_isolated/launch_surface_decision.meta.md

Create:

docs/seat/measures_registry_isolated/current_runtime_allowlist.meta.md
docs/seat/measures_registry_isolated/current_terminology_allowlist.meta.md
docs/seat/measures_registry_isolated/legacy_blocked_terminology_index.meta.md
docs/seat/measures_registry_isolated/non_governing_recovered_rows_policy.meta.md
docs/seat/measures_registry_isolated/current_runtime_surface_set.meta.md
docs/seat/measures_registry_isolated/current_media_allowlist.meta.md
docs/seat/measures_registry_isolated/current_route_allowlist.meta.md
docs/seat/measures_registry_isolated/current_db_candidate_allowlist.meta.md

Create OAR1:

docs/seat/measures_registry/09_oar/oar1_create_measures_registry_current_runtime_allowlist_and_terminology_isolation_contract_v1.meta.md

## ISOLATION PRINCIPLE

isolation_strategy:
  method: allowlist_first
  current_authority:
    defined_by:
      - current_runtime_allowlist
      - current_terminology_allowlist
      - current_runtime_surface_set
      - current_media_allowlist
      - current_route_allowlist
      - current_db_candidate_allowlist

  all_non_allowlisted_recovered_rows:
    standing: non_governing
    renderable: false
    callable: false
    governs_current_launch: false
    may_remain_as:
      - legacy_trace
      - held
      - archived_working_surface
      - operator_review

## CURRENT RUNTIME ALLOWLIST REQUIREMENTS

current_runtime_allowlist.meta.md must define only the current Measures Registry governing set.

Allowed governing concepts:

current_runtime_allowlist:
  system:
    - measures_registry

  public_context:
    - unDrifted
    - unDrifted Issue 01
    - Lapis issue surface
    - Assess the Environment
    - AI Operations Assessment

  post_assessment:
    - MAP the Environment
    - Measure
    - Audit
    - Prepare
    - payment boundary
    - scheduling boundary
    - MAP execution review
    - SEAT review
    - Crystal Seat final confirmation

  current_surface_roles:
    - direct landing surface
    - Lapis relational publication context surface
    - brief Lapis-to-Obsidian assessment explainer
    - Obsidian assessment encounter
    - assessment result surface
    - MAP environment review surface
    - payment boundary surface
    - scheduling boundary surface
    - SEAT review surface
    - Crystal Seat final confirmation surface

## CURRENT TERMINOLOGY ALLOWLIST REQUIREMENTS

current_terminology_allowlist.meta.md must define public/current terminology.

Allowed public terms:

current_terms:
  - Measures Registry
  - unDrifted
  - unDrifted Issue 01
  - Assess the Environment
  - AI Operations Assessment
  - operational environment
  - structural drift
  - governed environment
  - MAP the Environment
  - Measure
  - Audit
  - Prepare
  - payment boundary
  - scheduling boundary
  - SEAT review
  - Crystal Seat final confirmation

Allowed internal terms:

internal_terms:
  - Codex
  - Field
  - Measures
  - OAR1
  - OAR2
  - Chazz
  - Cody
  - src
  - Lapis
  - Obsidian
  - Marble
  - Crystal Seat
  - Codexstone
  - c3 Key
  - Field access
  - MRM

Public boundary:

public_boundary:
  c3_key_public: false
  field_access_public: false
  certification_public: false
  conversion_public: false
  DAO_public_activation: false

## LEGACY / BLOCKED TERMINOLOGY INDEX REQUIREMENTS

legacy_blocked_terminology_index.meta.md must classify non-current terms.

legacy_or_blocked_terms:
  structural_drift_as_governing_section:
    standing: legacy_trace
    reason: structural drift may remain a concept/publication, but not governing site section

  cohort_conversion:
    standing: blocked_current_runtime
    reason: conversion held

  reserve_seat_public_route:
    standing: blocked_current_runtime
    reason: SEAT/payment path held

  phase_payment:
    standing: blocked_current_runtime
    reason: payment boundary not activated

  measures_phases_reveal:
    standing: blocked_current_runtime
    reason: old phased reveal language

  marble_pathway_reveal:
    standing: legacy_trace
    reason: legacy alias; MAP naming governs later

  crystal_chamber_as_crystal_seat:
    standing: blocked_current_runtime
    reason: Crystal Seat is not encounter/chamber

  epigraph_as_route_gate:
    standing: blocked_current_runtime
    reason: Epigraph may frame tone, not govern direct landing route

  connect_src:
    standing: legacy_or_superseded
    reason: old pre-assessment route if present

  five_question_assessment:
    standing: legacy_or_superseded
    reason: old assessment language if present

  agents_of_chaos_campaign_as_current_launch:
    standing: held
    reason: publication/reference may remain, campaign activation not current

  paragraph_publish_execution:
    standing: held
    reason: no publication execution authorized

  social_posting_or_scheduling:
    standing: held
    reason: no campaign execution authorized

## NON-GOVERNING RECOVERED ROWS POLICY

non_governing_recovered_rows_policy.meta.md must state:

policy:
  any_recovered_row_not_in_current_allowlist:
    standing: non_governing_by_default
    renderable: false
    callable_for_current_launch: false
    public_route_authority: false
    commerce_authority: false
    certification_authority: false
    conversion_authority: false

  preservation:
    old_rows_may_remain_as:
      - legacy_trace
      - held
      - archived_reference
      - operator_review

  mutation:
    required_for_db_change: future_exact_row_mutation_oar2

## CURRENT RUNTIME SURFACE SET REQUIREMENTS

current_runtime_surface_set.meta.md must define the intended current surface set:

current_surface_set:
  entry:
    - direct_landing_surface

  lapis:
    - unDrifted Issue 01
    - Our Story full video
    - Paragraph article references
    - Receive unDrifted Field Report

  passage:
    - brief Lapis-to-Obsidian assessment explainer

  obsidian:
    - AI Operations Assessment
    - assessment result / recommendation

  post_assessment:
    - MAP the Environment
    - payment boundary
    - scheduling boundary
    - MAP execution review
    - SEAT review

  final_confirmation:
    - Crystal Seat final confirmation

held:
  - c3 back office
  - c3 Key assignment
  - Field access
  - certification
  - conversion
  - DAO/public governance activation

## CURRENT MEDIA ALLOWLIST REQUIREMENTS

current_media_allowlist.meta.md must define:

current_media_allowlist:
  primary_landing:
    - questions_ungoverned_systems_cannot_answer

  epigraph_preserved:
    - ai_isnt_broken_hook_video
    - epigraph_hook_20s
    - registry_epigraph_fracture_to_alignment_15s

  lapis_context:
    - Our Story full video
    - Paragraph article references
    - lapis_background
    - measures_registry_mark

  obsidian_assessment:
    - obsidian_assessment_surface_visual
    - obsidian_eval_result_surface_visual
    - obsidian_background

not_selected_current_campaign:
  - Our Story clips
  - Our Story muted derivatives
  - Our Story tonebed derivatives
  - agents_of_chaos campaign media as active campaign
  - before_the_pathway_obsidian_to_marble_passage_video as current passage

## CURRENT ROUTE ALLOWLIST REQUIREMENTS

current_route_allowlist.meta.md must define:

current_route_allowlist:
  public_entry:
    direct_landing_urls: true
    route_through_epigraph_required: false
    route_through_temple_required: false
    route_through_crystal_seat_required: false

  allowed_flow:
    - direct_landing_or_social_link
    - landing_hook
    - unDrifted Issue 01 / Lapis page
    - brief Lapis-to-Obsidian assessment explainer
    - AI Operations Assessment
    - assessment result / recommendation
    - MAP the Environment
    - payment boundary
    - scheduling boundary
    - MAP execution review
    - SEAT review
    - Crystal Seat final confirmation

  blocked_current_routes:
    - cohort conversion
    - reserve seat as public entry
    - phase payment as active route
    - marble pathway reveal as current governing route
    - measures phases reveal as current governing route
    - Structural Drift as governing public route

## CURRENT DB CANDIDATE ALLOWLIST REQUIREMENTS

current_db_candidate_allowlist.meta.md must list rows that may be considered for future exact-row mutation or seating.

candidate_db_rows:
  registry_rows:
    - measures_registry_runtime
    - lapis_directory
    - obsidian_directory
    - crystal_directory

  reconcile_or_hold_rows:
    - marble_directory
    - epigraph
    - map_integrity_governance
    - cohort_conversion_encounter
    - reserve_seat
    - systems_offering
    - foundation_offering
    - structural_drift_publication

  encounter_rows:
    - structure_passage
    - eval_passage
    - structured_eval
    - phase_payment
    - marble_pathway_reveal
    - measures_phases_reveal
    - epigraph_view
    - crystal_chamber

  commerce_rows:
    - map_contract_pre_deployment
    - map_contract_optimization
    - map_contract_remediation

  publication_rows:
    - structural_drift
    - undrifted
    - agents_of_chaos_dispatch_v1
    - structural_drift_dispatch_v1

default_for_all_other_rows:
  standing: non_governing_by_default
  future_review_required: true

## CODY ROLE

Cody may:

- create the current runtime allowlist docs
- create terminology allowlist docs
- create legacy/blocked terminology index
- create non-governing recovered rows policy
- create current media/route/surface/DB candidate allowlists
- update isolation index to reference these docs
- write OAR1 closeout evidence

Cody may not:

- mutate DB
- mutate frontend runtime
- activate routes
- activate payment
- activate scheduling
- activate MAP
- activate SEAT
- activate Crystal Seat
- assign c3 Key
- activate Field access
- activate certification
- activate conversion
- activate c3 back office
- publish/post/schedule/upload
- delete or rename existing files

## VALIDATION

Cody must return:

1. current runtime allowlist path
2. terminology allowlist path
3. legacy/blocked terminology index path
4. non-governing recovered rows policy path
5. current runtime surface set path
6. current media allowlist path
7. current route allowlist path
8. current DB candidate allowlist path
9. confirmation isolation index was updated
10. confirmation launch_active remains false
11. confirmation no DB mutation occurred
12. confirmation no frontend mutation occurred
13. confirmation no route/payment/scheduling/MAP/SEAT/Crystal activation occurred
14. confirmation no publish/post/schedule/upload occurred
15. recommended next OAR2
16. OAR1 path

Expected OAR1:

docs/seat/measures_registry/09_oar/oar1_create_measures_registry_current_runtime_allowlist_and_terminology_isolation_contract_v1.meta.md

## CLOSE

This OAR2 succeeds when Measures Registry has a positive current-runtime allowlist and a terminology isolation contract.

All non-allowlisted recovered rows become non-governing by default, pending future exact-row mutation OAR.

No DB mutation, frontend mutation, route activation, payment activation, scheduling activation, MAP activation, SEAT activation, Crystal Seat activation, c3 Key assignment, Field access, certification, conversion, publishing, posting, scheduling, upload, deletion, rename, or c3 back office activation is authorized.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody isolates.
src remains unchanged.
