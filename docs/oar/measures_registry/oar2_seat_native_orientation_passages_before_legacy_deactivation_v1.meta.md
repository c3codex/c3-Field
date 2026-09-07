---
document_type: oar2
authority_level: working
document_scope: native_architecture_normalization
title: OAR2 — Seat Native Orientation Passages Before Legacy Deactivation
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_database_term_sweep_before_native_architecture_normalization_v1.meta.md
---

# OAR2 — Seat Native Orientation Passages Before Legacy Deactivation

## GOVERNANCE STANDING

Governance belongs to the body.
Agency belongs to the individual.
Integrity belongs to both.

This OAR governs the database body.
It does not govern the operator.

Purpose is to preserve database integrity by seating native architecture before legacy terms are deactivated.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Read-only DB sweep completed.

The following native replacement keys are missing:

- crystal_seat_orientation_passage
- obsidian_chamber_orientation_passage
- marble_chamber_orientation_passage

The following legacy/stale terms are still active or referenced:

- eval_passage
- structure_passage
- evaluate_structure_path
- marble_pathway_reveal
- iis_eval_gate1
- structural_drift_publication
- crystal_chamber

OAR1 proved this is a small, governable normalization batch.

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures determine.
c3 Field arranges.
Optics prove.

Measures is the Registry.

c3 Field arranges.

Optics is the observed boundary of what enters and returns to Codex.

FREE is a governed body under Systems.
FREE is not the native order.
FREE manifests only registry-determined and field-arranged encounter state.

## ROUTED

Perform governed normalization in this order:

1. Seat native orientation passage keys.
2. Add required registry rows.
3. Add required encounter_def rows or metadata alignment.
4. Add surface assignments.
5. Add or update transition rules to point toward native keys.
6. Activate about_measures_registry.
7. Preserve live bridge behavior until replacement paths validate.
8. Only after validation, prepare separate deactivation OAR for legacy aliases.

Do NOT deactivate legacy terms in this OAR unless replacement traffic path is proven.

## REQUIRED MUTATIONS

### 1. Seat registry keys

Create or upsert:

- crystal_seat_orientation_passage
- obsidian_chamber_orientation_passage
- marble_chamber_orientation_passage

Each must include:

- system: measures_registry
- is_active: true
- release_state: held or released only if downstream surface assignment and transition validation pass
- native_architecture: true
- legacy_replaces metadata where applicable

Replacement mapping:

- structure_passage -> crystal_seat_orientation_passage
- eval_passage -> obsidian_chamber_orientation_passage
- marble_pathway_reveal -> marble_chamber_orientation_passage

### 2. Seat encounter definitions

Create encounter_def records for:

- crystal_seat_orientation_passage
- obsidian_chamber_orientation_passage
- marble_chamber_orientation_passage

Metadata must be minimal and renderer-safe.

Do not invent final public copy.

Use held/gap-safe content if copy is not already seated.

Required metadata:

- native_key
- chamber_assignment
- orientation_role
- legacy_replaces
- renderer_contract
- governance_note
- status_note

### 3. Seat surface assignments

Create surface assignments:

- crystal_seat_orientation_passage -> crystal_seat
- obsidian_chamber_orientation_passage -> obsidian
- marble_chamber_orientation_passage -> marble

Do not remove existing surface assignments yet.

### 4. Transition bridge

Add safe transition bridge rules toward native keys.

Preserve existing live transitions until validation proves native route works.

Expected bridge direction:

- path_choice / evaluate_structure_path left path -> obsidian_chamber_orientation_passage
- path_choice / evaluate_structure_path right path -> crystal_seat_orientation_passage
- obsidian_chamber_orientation_passage -> assessment or existing obsidian next step
- crystal_seat_orientation_passage -> about_measures_registry or existing crystal seat next step
- marble_chamber_orientation_passage -> map_integrity_governance where appropriate

Do not break active traffic.

### 5. Activate about_measures_registry

Set:

- about_measures_registry.is_active = true
- about_measures_registry.release_state = released only if FREE gate requires released state

Do not alter its approved_content_contract unless required by renderer validation.

### 6. Do not deactivate yet

Do not deactivate in this OAR:

- marble_pathway_reveal
- iis_eval_gate1
- structural_drift_publication
- eval_passage
- evaluate_structure_path
- structure_passage
- crystal_chamber

Prepare deactivation as next OAR after native keys validate.

## VALIDATION

Return OAR1 evidence showing:

1. Native orientation keys exist in measures_registry.
2. Native orientation keys exist in measures_encounter_def.
3. Native orientation keys have surface assignments.
4. Transition bridge exists and does not break current live routes.
5. about_measures_registry is active and renderable.
6. No legacy key was deactivated during this OAR.
7. No content was invented.
8. No renderer code was changed unless explicitly unavoidable and documented.
9. FREE can resolve native keys without frontend inference.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- legacy keys are deactivated before native paths validate
- public route behavior breaks
- content is invented
- frontend inference is added
- FREE determines standing
- stale terms are silently reused as native
- DB mutation exceeds this OAR
- operator is governed instead of the work body

## CLOSE

Seat the native bridge first.

Validate.

Then prepare legacy deactivation.

Nothing is invented.
