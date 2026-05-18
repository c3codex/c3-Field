---
document_type: function_layer_distinction_manifest
authority_level: review
document_scope: source_authority
title: Measures Registry Function-Layer Distinction Manifest
status: proposed_distinction
version: v1
operator: op044
date: 2026-05-17
source_oar2: docs/oar/source_authority/oar2_measures_registry_function_layer_distinction_pass_v1.meta.md
runtime_evidence_manifest: docs/source_authority/candidates/runtime_evidence_manifest.meta.md
qualification_manifest: docs/source_authority/candidates/seating_qualification_manifest.meta.md
tags:
  - source-authority
  - measures-registry
  - function-layer
  - release-state
  - conversion-state
  - native-distinction
---

# Measures Registry Function-Layer Distinction Manifest

## Boundary

This pass clarifies meaning only.

No table is renamed.

No runtime code is altered.

No DB mutation occurs.

No authority is seated.

`release_state` is not `conversion_state`.

## Function-Layer Distinction

| function_layer | canonical_state_language | valid_surfaces | evidence_path | allowed_meaning | excluded_meaning | notes |
|---|---|---|---|---|---|---|
| encounter_registry | release_state; access_state; encounter_key | measures_registry; measures_encounter_def; v_measures_encounter_runtime | src/measures_of_inanna/resolve_encounter.ts; docs/source_authority/candidates/database_src_manifest.meta.md | encounter identity, encounter resolution, and reveal/access standing | institutional conversion outcome | Shared registry spine may support encounter lookup without becoming a conversion engine. |
| release_access | release_state; access_state | measures_release_state; v_measures_release_surface; GenericEncounter release gating | src/measures_of_inanna/GenericEncounter.tsx; docs/source_authority/candidates/registry_release_states_v1.meta.md; docs/_source/field/measures_tables_terminology.md | reveal, route, access, held/dependent/open/released standing | intake approval, conversion completion, institutional evaluation result | Release reveals. It does not verify institutional conversion. |
| phase_map | release_state; phase_map_state; node state | v_measures_phase_map_nodes; metadata.phase_map; GenericEncounter phase map | src/measures_of_inanna/GenericEncounter.tsx; src/shared/c3/oar2Governance.ts | relational encounter positioning and phase-map visibility | conversion outcome | Phase-map state is encounter/relation visibility, not institutional conversion. |
| conversion_registry | intake_state; evaluation_state; conversion_state; verification_state; closeout_state | registered_process_log; future institutional_conversion_state_v1 | src/measures_registry/MeasuresRegistryRuntime.tsx; docs/handoff/cody/src_reserve_seat/db_contract_src_reserve_seat.sql | institutional evaluation, verification, conversion, and closeout outcome | encounter reveal/access standing | If stronger modeling is needed, define `institutional_conversion_state_v1` separately. |
| intake | intake_state | SRC reserve seat handoff contract; future intake tables | docs/handoff/cody/src_reserve_seat/db_contract_src_reserve_seat.sql | received, held, approved, declined, converted intake standing | release/access reveal state | Intake standing must not be inferred from release_state. |
| process_runtime | closeout_state; validation_status; deploy_status; seeded_status | registered_process_log | src/measures_registry/MeasuresRegistryRuntime.tsx; docs/source_authority/candidates/registered_process_log_runtime_v1.md | process execution, validation, deployment, and closeout visibility | encounter release | Process runtime is institutional/operational standing. |
| notification_runtime | notification_state; seat_lifecycle_state | measures_seat_hold_capture; measures_seat_hold_notification_review_v1; dispatch function | src/measures_registry/MeasuresRegistryRuntime.tsx; functions/api/dispatch-seat-hold-notification.ts | notification queue, dispatch, lifecycle review, provider result | encounter release/access or conversion outcome | Notification state is operational state, not release_state. |

## Registry Release States Resolution

| reference_key | prior_evidence_status | resolved_evidence_status | prior_scope_boundary | resolved_scope_boundary | conversion_scope | evidence_paths | notes |
|---|---|---|---|---|---|---|---|
| registry_release_states_v1 | partial | confirmed | release_access | encounter_release_access | excluded | src/measures_of_inanna/GenericEncounter.tsx; src/measures_of_inanna/types.ts; docs/source_authority/candidates/registry_release_states_v1.meta.md; docs/_source/field/measures_tables_terminology.md | DB and runtime support release/access use. This confirms encounter/reveal/access scope only. It is not canonical for institutional conversion outcome. |

## Drift Rules

Flag as drift:

- using `release_state` as institutional conversion outcome
- using `release_state` as intake approval
- using `release_state` as notification lifecycle
- using `release_state` as process closeout
- using `conversion_state` to govern encounter reveal/access
- treating `measures_registry` as a single-function surface

## Future Schema Implication

If institutional conversion state needs stronger modeling, create a separate source reference or schema pass:

`institutional_conversion_state_v1`

That future reference should model:

- `intake_state`
- `evaluation_state`
- `conversion_state`
- `verification_state`
- `closeout_state`

It must not overload `release_state`.

## Boundary Validation

No DB mutation occurred.

No table was renamed.

No runtime code was altered.

No source reference was inserted.

No authority was seated.

No source file was rewritten, merged, moved, or deleted.

