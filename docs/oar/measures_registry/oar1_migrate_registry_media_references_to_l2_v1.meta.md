---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_registry_l2_media_migration
title: OAR1 - Migrate Measures Registry Heavy Media References to L2
status: completed_partial_matches_only
version: v1
source_oar2: oar2_migrate_registry_media_references_to_l2_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Migrate Measures Registry Heavy Media References to L2

## Result

Measures Registry heavy media references were migrated where deterministic L2 manifest matches existed.

No Measures of Inanna media rows were changed.

No frontend files were changed.

No image/webp rows were migrated.

No old storage references were deleted.

## Validation Counts

L2 storage row found: yes

L2 manifest found: yes

L2 manifest object count: 24

Measures Registry heavy media rows migrated: 2

Image/webp rows preserved: 12

Publication dispatch references migrated: 0

Publication dispatch references held: 0

## Migrated Rows

The following `public.measures_media_map` rows now use:

- `storage_bucket`: `measures-media`

Migrated rows:

- `left_hero_fracture_motion` -> `left_hero_fracture_motion.mp4`
- `c3_field_video` -> `c3_field.mp4`

Both used exact filename matches against:

`docs/_source/working/media/l2_bucket_manifest_v1.txt`

## Preserved Rows

Image/webp rows remained in existing storage buckets.

Publication dispatch media manifests were not mutated. The dispatch with media contains a webp banner image and an external YouTube publication video, so no deterministic L2 heavy-media DB reference was migrated there.

## Unmatched Heavy Rows

The following heavy media rows were not mutated because no deterministic L2 manifest match existed:

- `integrity_governance_intro.mp4`
- `structural_coherence_explainer_45s.mp4`
- `registry_epigraph_fracture_to_alignment_15s.mp4`
- `right_measured_hero_motion_graphic.mp4`

## Metadata Preservation

Migrated rows preserved their existing row ids, registry keys, encounter keys, media roles, status, sort order, and prior metadata.

Migration metadata was added:

- `migrated_to_storage_key`: `l2_shared_media`
- `previous_bucket`
- `previous_storage_path`
- `migration_source_manifest`
- `migration_oar`
- `migration_match_strategy`
- `heavy_media_only`: true
- `legacy_reference_preserved`: true

## Evidence

Full validation output was written to:

`docs/oar/measures_registry/migrate_registry_media_references_to_l2_v1.json`

Note: the OAR2 validation query names `bucket`, but `public.measures_media_map` uses `storage_bucket`. Validation was run against `storage_bucket = 'measures-media'`.

## Boundary

No frontend hardcoding was introduced.

No bucket paths were invented.

No media relationships were invented.

No ambiguous publication manifests were mutated.

Measures of Inanna remained out of scope.
