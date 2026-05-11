---
document_type: oar2
authority_level: working
document_scope: measures_registry_l2_media_reconciliation
title: OAR2 — Reconcile Registry Unmatched L2 Media
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-registry
  - media-reconciliation
  - l2-bucket
  - heavy-media
source_alignment:
  - OAR1 - Migrate Measures Registry Heavy Media References to L2
  - OAR1 - Register L2 Bucket as Shared Media Storage
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Reconcile Registry Unmatched L2 Media

## OBSERVED

The prior Measures Registry heavy media migration completed partially.

Migrated:

- left_hero_fracture_motion.mp4
- c3_field.mp4

Unmatched heavy media rows:

- integrity_governance_intro.mp4
- structural_coherence_explainer_45s.mp4
- registry_epigraph_fracture_to_alignment_15s.mp4
- right_measured_hero_motion_graphic.mp4

Operator confirmed:

- structural_coherence_explainer_45s.mp4 exists in L2 manifest
- registry_epigraph_fracture_to_alignment_15s.mp4 exists in L2 manifest
- right_measured_hero_motion_graphic.mp4 exists in L2 manifest
- integrity_governance_intro.mp4 was not observed in the L2 manifest and may not be actively used

## ALIGNED

Storage does not define authority.

Authority order remains:

Codex → Field → Measures → Chazz/src

This OAR2 reconciles remaining Measures Registry heavy-media rows only where deterministic L2 matches exist.

Image/webp media remains in existing image storage.

No frontend mutation is required.

## ROUTED

Cody shall reconcile remaining Measures Registry heavy media references.

### 1. Verify L2 shared storage

Confirm active storage row exists:

- storage_key: l2_shared_media
- bucket: measures-media
- status: active

If missing, stop.

### 2. Verify L2 manifest

Use:

docs/_source/working/media/l2_bucket_manifest_v1.txt

Do not infer or invent object names.

### 3. Migrate exact confirmed matches

Migrate these exact heavy media rows if present in public.measures_media_map and present in L2 manifest:

- structural_coherence_explainer_45s.mp4
- registry_epigraph_fracture_to_alignment_15s.mp4
- right_measured_hero_motion_graphic.mp4

For matched rows:

- set storage_bucket to measures-media
- set provider/storage provider to cloudflare_r2 if column exists
- set storage/object path to matched L2 key
- preserve row id
- preserve registry key
- preserve encounter key
- preserve media role
- preserve status
- preserve sort order
- preserve metadata
- add migration metadata

### 4. Inspect integrity_governance_intro.mp4

Inspect whether integrity_governance_intro.mp4 is actively referenced.

If active and still required:

- do not mutate
- report missing L2 payload

If not active or not used:

- do not mutate
- report as legacy/unresolved unused candidate

Do not invent a replacement.

### 5. Preserve image rows

Do not migrate or mutate:

- .webp
- .png
- .jpg
- .jpeg

### 6. No frontend mutation

No frontend files should be changed.

## CODY ROLE

Cody may:

- inspect L2 manifest
- migrate exact confirmed heavy-media matches
- inspect active usage of integrity_governance_intro.mp4
- preserve image rows
- add migration metadata
- return validation output
- write OAR1 closeout

Cody may not:

- infer missing filenames
- invent bucket paths
- mutate image rows
- mutate Measures of Inanna media
- hardcode media into frontend
- delete old storage references
- modify frontend files

## VALIDATION

Cody must return:

1. L2 storage row found / not found
2. L2 manifest found / not found
3. exact media rows migrated count
4. list of migrated rows
5. integrity governance intro usage standing
6. image rows preserved count
7. unmatched rows remaining
8. confirmation no frontend files changed
9. validation query output

Validation query:

    select
      *
    from public.measures_media_map
    where storage_bucket = 'measures-media'
    order by id;

Execution is valid only when:

- the three exact confirmed matches are migrated if present
- integrity_governance_intro.mp4 is inspected but not guessed
- image rows remain preserved
- no frontend files are changed
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_reconcile_registry_unmatched_l2_media_v1.meta.md

## CLOSE

This pass closes deterministic Measures Registry heavy-media reconciliation.

Codex holds.
Field structures.
Measures registers.
Chazz executes.
