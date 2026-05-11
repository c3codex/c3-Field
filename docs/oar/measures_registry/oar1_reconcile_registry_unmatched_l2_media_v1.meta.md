---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_registry_l2_media_reconciliation
title: OAR1 - Reconcile Registry Unmatched L2 Media
status: completed_corrected_r2_exact_matches
version: v1
source_oar2: oar2_reconcile_registry_unmatched_l2_media_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Reconcile Registry Unmatched L2 Media

## Result

Measures Registry unmatched heavy media reconciliation was rerun against live Cloudflare R2 listing after the corrected bucket objects were added.

The routed manifest was refreshed from R2 `ListObjectsV2` output:

`docs/_source/working/media/l2_bucket_manifest_v1.txt`

No frontend files were changed.

No Measures of Inanna media rows were changed.

No image rows were changed.

## Validation Counts

L2 storage row found: yes

L2 manifest found: yes

R2 object count: 39

Exact media rows processed count: 3

Newly migrated from non-L2 storage on this rerun: 1

Image rows preserved count: 12

## Migrated Rows

The following exact R2 object-key matches were processed to `storage_bucket = measures-media`:

- `structural_coherence_explainer_45s.mp4`
- `registry_epigraph_fracture_to_alignment_15s.mp4`
- `right_measured_hero_motion_graphic.mp4`

`registry_epigraph_fracture_to_alignment_15s.mp4` was the newly effective migration in this rerun, moving from `measures-registry` to `measures-media` after the corrected exact object key appeared in R2.

`structural_coherence_explainer_45s.mp4` and `right_measured_hero_motion_graphic.mp4` were already seated on `measures-media` by the prior execution and were revalidated by the executor.

All processed rows preserved row id, registry key, encounter key, media role, status, sort order, and prior metadata.

Migration metadata was added:

- `migrated_to_storage_key`: `l2_shared_media`
- `previous_bucket`
- `previous_storage_path`
- `migration_source_manifest`
- `migration_oar`
- `migration_match_strategy`: `r2_exact_object_key_match`
- `heavy_media_only`: true
- `legacy_reference_preserved`: true

## Not Migrated

`integrity_governance_intro.mp4`

- active DB row exists
- exact object key is now present in live R2 listing
- not mutated
- standing: active reference present in R2 but not routed for migration by this OAR2

## Evidence

Full validation output was written to:

`docs/oar/measures_registry/reconcile_registry_unmatched_l2_media_v1.json`

## Boundary

No filenames were inferred.

No bucket paths were invented.

No frontend hardcoding was introduced.

No old storage references were deleted.

No image rows were mutated.
