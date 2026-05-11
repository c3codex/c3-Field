---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_registry_l2_media_reconciliation
title: OAR1 - Reconcile Registry Unmatched L2 Media
status: completed_partial_r2_exact_matches
version: v1
source_oar2: oar2_reconcile_registry_unmatched_l2_media_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Reconcile Registry Unmatched L2 Media

## Result

Measures Registry unmatched heavy media reconciliation completed against live Cloudflare R2 listing.

The routed manifest was refreshed from R2 `ListObjectsV2` output:

`docs/_source/working/media/l2_bucket_manifest_v1.txt`

No frontend files were changed.

No Measures of Inanna media rows were changed.

No image rows were changed.

## Validation Counts

L2 storage row found: yes

L2 manifest found: yes

R2 object count: 38

Exact media rows migrated count: 2

Image rows preserved count: 12

## Migrated Rows

The following exact R2 object-key matches were migrated to `storage_bucket = measures-media`:

- `structural_coherence_explainer_45s.mp4`
- `right_measured_hero_motion_graphic.mp4`

Both rows preserved row id, registry key, encounter key, media role, status, sort order, and prior metadata.

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

`registry_epigraph_fracture_to_alignment_15s.mp4`

- active DB row exists
- exact object key was not returned by live R2 listing
- R2 returned `registry_epigraph_fracture_to_alignment_15s.mp4.mp4`, which was not treated as an exact match
- not mutated

`integrity_governance_intro.mp4`

- active DB row exists
- exact object key was not returned by live R2 listing
- not mutated
- standing: active reference missing L2 payload

## Evidence

Full validation output was written to:

`docs/oar/measures_registry/reconcile_registry_unmatched_l2_media_v1.json`

## Boundary

No filenames were inferred.

No bucket paths were invented.

No frontend hardcoding was introduced.

No old storage references were deleted.

No image rows were mutated.
