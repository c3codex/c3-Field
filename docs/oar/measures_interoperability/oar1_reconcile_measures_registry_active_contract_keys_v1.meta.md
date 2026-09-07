---
document_type: oar1
authority_level: recorded
document_scope: measures_registry_active_contract_keys
title: OAR1 Reconcile Measures Registry Active Contract Keys
status: completed
version: v1
operator: op044
system: measures_registry
session_scope: measures_interoperability
source_oar2: docs/oar/measures_interoperability/oar2_reconcile_measures_registry_active_contract_keys_v1.meta.md
execution_order: Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src
created: 2026-06-01
tags:
  - oar1
  - measures-interoperability
  - measures-registry
  - active-contract-keys
  - legacy-carrier-deprecation
  - db-metadata-reconciliation
  - runtime-final-pass-blocker
  - no-deployment
---

# OAR1 Reconcile Measures Registry Active Contract Keys v1

## Execution Summary

Active Measures Registry contract keys were seated as scoped metadata on existing `public.measures_encounter_def` rows.

Created execution support:

`docs/oar/measures_interoperability/execute-reconcile-measures-registry-active-contract-keys-v1.cjs`

This reconciliation did not delete rows, deactivate rows, create DB terminology/tag authority, mutate Seed Concordance, mutate The 21 of Coherence, begin runtime final pass, deploy, or activate payment/c3 Key/SRC/permission/recognition/conversion/certification/DAO/distribution standing.

## Legacy Carrier Standing

The following row keys were marked deprecated from active semantic use:

- `structure_passage`
- `reserve_seat`
- `evaluate_structure_path`
- `phase_payment`
- `connect_src`
- `measures_phases_reveal`

They remain valid only as:

- `legacy_db_row_key`
- `historical_oar_reference`
- `audit_trace`
- `migration_carrier`

They may not govern as active contract keys, public labels, route meanings, chamber identities, passage identities, payment surfaces, SRC binding surfaces, c3 MAP surfaces, conversion/certification surfaces, or renderer state.

## Active Contract Key Chain

The seated active chain is:

1. `assess_environment_passage`
2. `measures_assessment_contract`
3. `assessment_result_contract`
4. `commerce_circuit_recommendation_contract`
5. `c3_map_continuation_contract`
6. `governed_commerce_passage`
7. `c3_key_or_temp_key_identity_route`
8. `payment_confirmation_sequence`
9. `c3_map_runtime_audit_contract`

Payment confirmation is seated before c3 MAP runtime audit.

Downstream conversion/certification remains held:

- `conversion_readiness_contract`
- `measures_conversion_verification_contract`
- `registry_certification_eligibility_contract`

## DB Metadata Alignment

Scoped metadata was added to existing rows only:

| Row | Active Contract Keys |
|---|---|
| `evaluate_structure_path` | `assess_environment_passage` |
| `measures_assessment` | `measures_assessment_contract`, `assessment_result_contract`, `commerce_circuit_recommendation_contract` |
| `reserve_seat` | `c3_map_continuation_contract`, `governed_commerce_passage`, `c3_key_or_temp_key_identity_route` |
| `phase_payment` | `governed_commerce_passage`, `c3_key_or_temp_key_identity_route`, `payment_confirmation_sequence` |
| `connect_src` | `c3_map_runtime_audit_contract` |
| `measures_phases_reveal` | `assessment_result_contract`, `c3_map_runtime_audit_contract` |
| `structure_passage` | none in this active chain; legacy carrier/audit row only |

Each target row now includes:

- `active_contract_key_reconciliation`
- `active_contract_chain_authority`
- `renderer_rule: read_active_contract_keys_not_legacy_carrier_row_names`
- `runtime_final_pass_authorized: false`
- `frontend_hardcode_allowed: false`
- `db_term_tag_authority_created: false`

Legacy carrier rows additionally include:

- `legacy_carrier_key_reconciliation.semantic_status: deprecated_from_active_semantic_use`

Existing `governed_layout_contract` and `chamber_contract` metadata, where present, were annotated with active contract key reconciliation references. Existing contract content was preserved.

## Renderer Standing

Renderer may read:

- `active_contract_key`
- `active_contract_keys`
- `contract_type`
- `resolves_to`
- `held_states`
- `renderer_rule`
- `source_oar2`

Renderer may not read legacy row names as semantic truth.

Technical row keys may continue to exist as DB lookup carriers until a separate runtime/folder reconciliation route authorizes replacement.

## Validation

Execution command:

`node docs/oar/measures_interoperability/execute-reconcile-measures-registry-active-contract-keys-v1.cjs`

Readback result: PASS.

| Requirement | Result |
|---|---|
| Legacy carrier terms deprecated from active semantic use | PASS |
| Legacy row keys retained only as carrier/audit/migration references | PASS |
| `assess_environment_passage` seated | PASS |
| `measures_assessment_contract` seated | PASS |
| `assessment_result_contract` seated | PASS |
| `commerce_circuit_recommendation_contract` seated | PASS |
| `c3_map_continuation_contract` seated | PASS |
| `governed_commerce_passage` seated as private/held | PASS |
| `c3_key_or_temp_key_identity_route` seated | PASS |
| `payment_confirmation_sequence` seated before c3 MAP runtime audit | PASS |
| `c3_map_runtime_audit_contract` seated | PASS |
| Downstream conversion/certification contracts remain held | PASS |
| Renderer rule points to active contract keys, not legacy row names | PASS |
| No DB terminology/tag authority created | PASS |
| No payment/c3 Key/SRC/permission/recognition/conversion/certification/DAO/distribution standing activated | PASS |
| Runtime final pass remains blocked | PASS |
| OAR1 produced after execution | PASS |

## Mutation Standing

- DB metadata mutation: yes, scoped to existing `measures_encounter_def.metadata`
- DB row deletion: none
- DB row deactivation: none
- DB terminology/tag authority creation: none
- Runtime mutation: none
- CSS mutation: none
- Deployment: none
- Runtime final pass authorization: none
- Payment/c3 Key/SRC/permission/recognition/conversion/certification/DAO/distribution activation: none

## Runtime Final Pass Standing

This OAR set is tracked in:

`docs/oar/measures_interoperability/runtime_final_pass/README.md`

Runtime final pass remains blocked until explicitly routed.

## Close

Carrier rows may remain.
Carrier language may not govern.

Payment confirmation comes before c3 MAP runtime audit.
Conversion verification comes later and remains held.

Codex holds. Field structures. Measures registers. OAR2 routes. Chazz validates. Cody executed from OAR2 only. src renders seated state only.
