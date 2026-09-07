---
document_type: oar2
authority_level: working
document_scope: legacy_bridge
title: OAR2 — Bridge eval_passage Legacy Traffic to Obsidian Orientation
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_validate_native_encounter_routes_before_legacy_deactivation_v1.meta.md
---

# OAR2 — Bridge eval_passage Legacy Traffic to Obsidian Orientation

## GOVERNANCE STANDING

Purpose is to retire legacy traffic served by eval_passage and move all valid traffic to obsidian_chamber_orientation_passage.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Native route validated:

evaluate_structure_path
    ->
obsidian_chamber_orientation_passage
    ->
measures_assessment

PASS.

Legacy route still active:

evaluate_structure_path
    ->
eval_passage
    ->
connect_src

Disposition:

bridge_required.

## REQUIRED MUTATIONS

### Transition Rules

Deactivate:

- evaluate_structure_path -> eval_passage
- eval_passage -> connect_src

Confirm active:

- evaluate_structure_path -> obsidian_chamber_orientation_passage
- obsidian_chamber_orientation_passage -> measures_assessment

### Surface Assignments

Inspect:

- eval_passage
- structural_coherence_explainer

If required:

- redirect surface assignments to:
  obsidian_chamber_orientation_passage

or

- mark legacy_route_alias=true
- replacement_key=obsidian_chamber_orientation_passage

Do not break historical references.

### Registry

Update eval_passage:

- is_active=false
- release_state=held
- access_state=archived
- disposition=legacy_deactivated
- replacement_encounter_key=obsidian_chamber_orientation_passage
- audit_trace_preserved=true

Preserve all existing metadata.

Do not delete rows.

## VALIDATION

Return evidence showing:

1. evaluate_structure_path -> eval_passage inactive.
2. eval_passage -> connect_src inactive.
3. Native obsidian route remains active.
4. No orphaned destinations.
5. No renderer changes.
6. No frontend inference.
7. eval_passage archived.
8. Historical metadata preserved.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- native route breaks
- rows are deleted
- renderer logic changes
- frontend inference added
- measures_assessment becomes unreachable
- operator is governed instead of the work body

## CLOSE

Bridge legacy traffic.

Archive eval_passage.

Native obsidian route becomes authoritative.

Nothing is invented.
