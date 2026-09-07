---
document_type: oar2
authority_level: working
document_scope: measures_registry_encounter_reconciliation
title: OAR2 — Codex Reconcile Registered 13 Encounter Rows
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_reconcile_measures_registry_encounters_to_registered_13_surface_runtime_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - codex
  - encounter-rows
  - registered-runtime
  - db-reconciliation
---

# OAR2 — Codex Reconcile Registered 13 Encounter Rows

## OBSERVED

Runtime reconciliation established a target governed 13 encounter structure for Measures Registry.

Before encounter contracts can be seated, DB encounter rows must align to the registered target keys and runtime sequence.

Current state includes:

- legacy encounter keys
- duplicate / overlapping evaluation surfaces
- deprecated conversion experiments
- missing target rows
- state_expression ambiguity
- renderer-era transitional surfaces

The reconciliation OAR1 identified DB encounter reconciliation as the immediate next operation.

## ALIGNED

This is Codex row reconciliation only.

No renderer implementation.

No styling contract authoring.

No CSS edits.

No deletion of legacy rows.

Deprecation means metadata flagging, not removal.

No DB row = not registered.

No validation query = not proven.

## TARGET REGISTERED 13 ENCOUNTERS

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

## ROUTED

### 1. Rename current rows to registered keys

Rename:

- landing_root -> ai_isnt_broken_intro
- landing_path_choice -> evaluate_structure_path
- educational_diagnostic_passage -> eval_passage
- c3_field -> connect_src
- measures_ai_operational_evaluation -> measures_assessment
- structural_drift_dispatches -> structural_drift_publication

Preserve existing metadata unless explicitly replaced by this OAR2.

### 2. Preserve reserve_seat

Keep:

- reserve_seat

Correct state_expression only if required for registered runtime alignment.

### 3. Deprecate retired encounters

Flag the following rows as deprecated in metadata.

Do not delete rows.

- educate_eval_encounter
- iis_eval_gate1
- cohort_conversion_encounter
- understand_failure
- foundation_offering
- systems_offering
- systems_seat_hold

Metadata should preserve:

- deprecated: true
- deprecated_by: registered_13_surface_runtime_v1
- replacement_encounter_key where applicable
- deprecation_reason

### 4. Create phase_payment row

Create:

- phase_payment

Use foundation_seat_hold as baseline where appropriate.

Do not overwrite foundation_seat_hold unless intentionally marked merged/deprecated.

Set:

- function_layer: intake
- state_expression: public_phase_payment
- renderer: hold_surface unless a better existing renderer contract is confirmed
- release/access state aligned to current public intake path

### 5. Create target stub rows for net-new encounters

Create stub rows for:

- structure_passage
- structured_eval
- measures_phases_reveal
- about_measures_registry
- measures_eval_email_contract

Each stub must include:

- encounter_key
- renderer: TBD or explicit placeholder only if current schema permits
- function_layer
- state_expression
- active/release/access standing appropriate for unreleased contract preparation
- metadata.contract_status: pending_contract

Do not invent copy, media, or styling contracts in this OAR2.

### 6. Correct state expressions

Set target state_expressions:

- ai_isnt_broken_intro: public_ai_isnt_broken_intro
- evaluate_structure_path: public_evaluate_structure_path
- eval_passage: public_eval_passage
- connect_src: public_connect_src
- measures_assessment: public_measures_assessment
- structure_passage: public_structure_passage
- structured_eval: public_structured_eval
- measures_phases_reveal: public_measures_phases_reveal
- about_measures_registry: public_about_measures_registry
- structural_drift_publication: native_structural_drift_publication
- measures_eval_email_contract: public_measures_eval_email_contract
- reserve_seat: public_learning_reserve_seat
- phase_payment: public_phase_payment

### 7. Capture registered runtime sequence

Seat the registered 13 encounter sequence as retrievable runtime order.

Required sequence:

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

Preserve route structure:

- ai_isnt_broken_intro -> evaluate_structure_path
- evaluate_structure_path -> eval_passage OR structure_passage
- eval_passage -> connect_src -> measures_assessment
- structure_passage -> connect_src -> structured_eval
- measures_assessment -> measures_phases_reveal
- structured_eval -> measures_phases_reveal
- measures_phases_reveal -> about_measures_registry
- about_measures_registry -> structural_drift_publication
- structural_drift_publication -> measures_eval_email_contract
- measures_eval_email_contract -> reserve_seat
- reserve_seat -> phase_payment

If an existing transition/routing table exists, use it.

If no valid routing table exists, seat sequence metadata on the appropriate registered runtime authority surface and report the absence of transition-table support.

### 8. Validation required

Return:

- DB table used
- rows renamed
- rows deprecated
- rows created
- state_expressions after reconciliation
- registered sequence seat location
- route structure validation
- validation query
- readback confirmation
- any conflicts or blocked operations

## DO NOT

- delete encounter rows
- author styling contracts
- author copy contracts
- edit frontend renderer
- edit CSS
- change media assets
- change unrelated systems
- collapse internal utility encounters into public runtime

## SUCCESS CONDITION

The Measures Registry DB contains the registered 13 encounter rows with correct encounter keys, state_expressions, and retrievable runtime sequence.

Deprecated rows remain traceable and flagged.

No styling or renderer implementation has occurred.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_codex_reconcile_registered_13_encounter_rows_v1.meta.md`

## CLOSE

Reconcile Codex encounter rows before contract seating.
