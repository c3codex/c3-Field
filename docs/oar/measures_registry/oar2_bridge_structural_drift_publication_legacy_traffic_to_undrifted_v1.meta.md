---
document_type: oar2
authority_level: working
document_scope: legacy_bridge
title: OAR2 — Bridge structural_drift_publication Legacy Traffic to unDrifted
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_validate_native_encounter_routes_before_legacy_deactivation_v1.meta.md
---

# OAR2 — Bridge structural_drift_publication Legacy Traffic to unDrifted

## GOVERNANCE STANDING

Governance belongs to the body.
Agency belongs to the individual.
Integrity belongs to both.

This OAR governs the Lapis publication route body.
It does not govern the operator.

Purpose is to retire legacy publication traffic served by structural_drift_publication and move valid traffic to unDrifted standing.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Native Lapis publication standing is validated:

/undrifted
    ->
measures_publication_registry
    ->
structural_drift_dispatch_v1

PASS.

structural_drift_publication remains the final bridge-required legacy key.

Legacy publication route still active:

about_measures_registry
    ->
structural_drift_publication
    ->
measures_eval_email_contract

Structural Drift is a registered published article.

unDrifted is the Lapis landing page and publication surface.

structural_drift_publication is a stale legacy publication identity.

## ALIGNED

Native order:

Codex holds.
Systems align.
Measures determine.
c3 Field arranges.
Optics prove.

Measures is the Registry.

FREE manifests only registry-determined and field-arranged encounter state.

unDrifted is authoritative publication standing.

Structural Drift is article standing.

structural_drift_publication is legacy bridge/audit trace only.

## REQUIRED MUTATIONS

### 1. Transition Rules

Deactivate:

- about_measures_registry -> structural_drift_publication
- structural_drift_publication -> measures_eval_email_contract

Create or confirm active:

- about_measures_registry -> undrifted

### 2. Surface Assignments

Inspect:

- structural_drift_dispatches
- publication_dispatch

Redirect their registry_key and encounter_key to:

- undrifted

Preserve surface_key values for historical compatibility.

Preserve chamber_assignment as lapis.

### 3. Registry Archive

Update structural_drift_publication:

- is_active = false
- release_state = held
- access_state = archived
- disposition = legacy_deactivated
- replacement_publication_key = undrifted
- replacement_article_key = structural_drift
- deactivated_after_native_route_validation = true
- source_oar1 = oar1_validate_native_encounter_routes_before_legacy_deactivation_v1
- audit_trace_preserved = true

Preserve all existing metadata.

### 4. Preserve Publication Records

Do not modify:

- measures_publication_registry
- measures_publication_dispatch
- structural_drift_dispatch_v1
- Paragraph URL
- article standing

Do not delete rows.

Do not change renderer code.

Do not add frontend inference.

## VALIDATION

Return OAR1 evidence showing:

1. about_measures_registry -> structural_drift_publication is inactive.
2. structural_drift_publication -> measures_eval_email_contract is inactive.
3. about_measures_registry -> undrifted is active.
4. structural_drift_dispatches surface resolves to undrifted or is safely marked legacy alias.
5. publication_dispatch surface resolves to undrifted or is safely marked legacy alias.
6. structural_drift_publication is inactive, held, and archived.
7. undrifted remains active and released.
8. /undrifted remains functional.
9. structural_drift_dispatch_v1 remains published.
10. Paragraph URL remains unchanged.
11. No article/publication records were mutated.
12. No rows were deleted.
13. No renderer code changed.
14. No frontend inference added.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- /undrifted breaks
- article standing changes
- Paragraph URL changes
- publication dispatch records are mutated unexpectedly
- rows are deleted
- renderer logic changes
- frontend inference is added
- structural_drift_publication remains active without justification
- operator is governed instead of the work body

## CLOSE

Bridge legacy publication traffic.

Archive structural_drift_publication.

unDrifted becomes authoritative Lapis publication standing.

Structural Drift remains a registered published article.

Nothing is invented.
