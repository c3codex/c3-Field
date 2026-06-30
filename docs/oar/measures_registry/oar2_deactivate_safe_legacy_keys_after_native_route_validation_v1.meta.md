---
document_type: oar2
authority_level: working
document_scope: legacy_deactivation
title: OAR2 — Deactivate Safe Legacy Keys After Native Route Validation
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_validate_native_encounter_routes_before_legacy_deactivation_v1.meta.md
---

# OAR2 — Deactivate Safe Legacy Keys After Native Route Validation

## GOVERNANCE STANDING

Governance belongs to the body.
Agency belongs to the individual.
Integrity belongs to both.

This OAR governs the legacy registry body.
It does not govern the operator.

Purpose is to deactivate only legacy keys proven safe by native route validation.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

OAR1 validated native encounter routes.

All native routes passed.

The following legacy keys were classified safe_to_deactivate:

- structure_passage
- marble_pathway_reveal
- iis_eval_gate1
- crystal_chamber

The following keys require bridge work and must not be deactivated in this OAR:

- eval_passage
- structural_drift_publication

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures determine.
c3 Field arranges.
Optics prove.

Measures is the Registry.

FREE manifests only registry-determined and field-arranged encounter state.

Safe deactivation may proceed only where native route validation proved no active dependency.

## ROUTED

Deactivate only safe legacy registry keys.

Do not remove rows.

Do not drop tables.

Do not delete capture data.

Do not deactivate bridge-required legacy keys.

Do not change routes unless explicitly limited to orphaned legacy hygiene and documented.

## REQUIRED MUTATION

Update measures_registry for:

- structure_passage
- marble_pathway_reveal
- iis_eval_gate1
- crystal_chamber

Set:

- is_active = false
- release_state = held
- access_state = retired or held, according to existing allowed constraint values
- metadata.disposition = legacy_deactivated
- metadata.deactivated_after_native_route_validation = true
- metadata.source_oar1 = oar1_validate_native_encounter_routes_before_legacy_deactivation_v1
- metadata.audit_trace_preserved = true

Preserve all existing metadata.

## PRESERVE

Do not drop or mutate:

- measures_iis_eval_gate1_capture

Do not deactivate:

- eval_passage
- structural_drift_publication
- evaluate_structure_path

Do not remove:

- publication dispatch records
- article records
- existing route files

## OPTIONAL HYGIENE

Only if safe and documented, deactivate orphaned transition rules where both source and destination are now inactive or held.

Allowed hygiene candidates:

- structure_passage -> crystal_chamber
- crystal_chamber -> eval_passage
- structure_passage -> connect_src
- evaluate_structure_path -> structure_passage

Do not touch:

- evaluate_structure_path -> eval_passage
- about_measures_registry -> structural_drift_publication
- structural_drift_publication -> measures_eval_email_contract

These require bridge OARs.

## VALIDATION

Return OAR1 evidence showing:

1. structure_passage is inactive or held.
2. marble_pathway_reveal is inactive or held.
3. iis_eval_gate1 is inactive or held.
4. crystal_chamber is inactive or held.
5. eval_passage remains active and released.
6. structural_drift_publication remains active and released.
7. evaluate_structure_path remains active and released.
8. measures_iis_eval_gate1_capture still exists.
9. No rows were deleted.
10. No article/publication records were changed.
11. No renderer code changed.
12. No frontend inference added.
13. Optional transition hygiene, if performed, is documented row by row.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- eval_passage is deactivated
- structural_drift_publication is deactivated
- evaluate_structure_path is deactivated
- capture table is dropped or mutated
- rows are deleted instead of retired/held
- route behavior changes unexpectedly
- renderer code changes
- frontend inference is added
- operator is governed instead of the work body

## CLOSE

Deactivate only keys already proven safe.

Preserve audit trace.

Bridge-required legacy keys remain until separate OARs.

Nothing is invented.
