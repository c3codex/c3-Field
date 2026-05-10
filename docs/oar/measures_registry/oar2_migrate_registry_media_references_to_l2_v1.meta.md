---
document_type: oar2
authority_level: working
document_scope: measures_registry_l2_media_migration
title: OAR2 — Migrate Measures Registry Heavy Media References to L2
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
  - media-migration
  - l2-bucket
  - heavy-media
  - r2
source_alignment:
  - OAR1 - Register L2 Bucket as Shared Media Storage
  - OAR1 - Migrate Measures of Inanna Media References to L2
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Migrate Measures Registry Heavy Media References to L2

## OBSERVED

L2 shared media storage is active.

L2 is for heavy runtime media:

- mp4
- mov
- mp3
- wav

Webp/image media remains in existing Supabase/image storage.

Measures Registry still has non-shared media references:

- public.measures_media_map non-shared-bucket rows: 18
- publication dispatches with media manifests: 1

Measures of Inanna migration confirmed the L2 process should only migrate deterministic heavy-media matches and preserve unmatched rows without invention.

## ALIGNED

Storage does not define authority.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required storage split:

- Supabase/image buckets remain for .webp and lightweight image assets
- L2 measures-media bucket becomes active shared runtime storage for heavy media
- DB rows remain authority
- old storage references remain preserved as history
- frontend must not be hardcoded to L2 paths

This OAR2 migrates Measures Registry heavy media only.

Measures of Inanna is out of scope.

## ROUTED

Cody shall migrate Measures Registry heavy media references to L2-backed storage.

### 1. Verify shared L2 storage row

Confirm active storage row exists:

- storage_key: l2_shared_media
- bucket: measures-media
- status: active

If missing, stop.

### 2. Verify L2 manifest

Confirm manifest exists:

docs/_source/working/media/l2_bucket_manifest_v1.txt

Use only object names present in the manifest.

Do not infer or invent bucket paths.

### 3. Inspect Measures Registry media references

Inspect:

- public.measures_media_map
- publication dispatch media manifests where present
- any Measures Registry media rows that reference mp4, mov, mp3, or wav files

Identify rows still referencing:

- measures-registry
- measures-registry-public
- any non-measures-media bucket for heavy media

### 4. Preserve image/webp storage

Do not migrate .webp, .png, .jpg, .jpeg, or other image rows in this OAR2.

Image assets remain in existing Supabase/image buckets unless later routed separately.

### 5. Match heavy media to L2 manifest

For each Measures Registry heavy media row, attempt deterministic match against L2 manifest by:

1. exact filename match
2. normalized filename match
3. extension-aware match
4. known surface/role match where already seated

Allowed migrated types:

- mp4
- mov
- mp3
- wav

Do not convert media type.

Do not rewrite titles, route meaning, or surface meaning.

### 6. Update matched Measures Registry media rows

For matched rows:

- set bucket to measures-media
- set storage_provider/provider to cloudflare_r2 where column exists
- set storage_path/object_path to matched L2 object key
- preserve existing key/id
- preserve surface/route role
- preserve status
- preserve metadata
- add migration metadata where supported

Migration metadata should include:

{
  "migrated_to_storage_key": "l2_shared_media",
  "previous_bucket": "<prior bucket>",
  "previous_storage_path": "<prior_storage_path>",
  "migration_source_manifest": "docs/_source/working/media/l2_bucket_manifest_v1.txt",
  "migration_oar": "oar2_migrate_registry_media_references_to_l2_v1",
  "heavy_media_only": true,
  "legacy_reference_preserved": true
}

### 7. Publication dispatch media manifests

If publication dispatch media manifests contain heavy media paths that now exist in L2:

- update manifest references only where deterministic L2 match exists
- preserve webp/image references as-is
- report any unmatched manifest media

If manifest structure is not safely mutable, do not mutate and report required follow-up.

### 8. Report unmatched rows

For any row that cannot be matched to L2 manifest:

- do not mutate
- report table / key / bucket / storage_path / reason

### 9. No frontend mutation

No frontend files should be changed.

This is DB/media-reference migration only.

## CODY ROLE

Cody may:

- read the shared L2 manifest
- inspect Measures Registry media references
- migrate matched heavy media rows to L2
- preserve webp/image media in existing storage
- update publication dispatch heavy media references only when safe and deterministic
- return validation output
- write OAR1 closeout

Cody may not:

- mutate Measures of Inanna media
- migrate image/webp rows
- hardcode L2 paths into frontend
- invent bucket paths
- invent media relationships
- delete old storage references
- modify frontend files
- mutate ambiguous publication manifests

## VALIDATION

Cody must return:

1. L2 storage row found / not found
2. L2 manifest found / not found
3. L2 manifest object count
4. Measures Registry heavy media rows migrated count
5. image/webp rows preserved count
6. publication dispatch references migrated count
7. publication dispatch references held count
8. unmatched media rows list
9. confirmation no frontend files changed
10. validation query output

Validation query:

    select
      *
    from public.measures_media_map
    where bucket = 'measures-media'
    order by id;

Execution is valid only when:

- shared L2 storage row exists
- L2 manifest is used
- only heavy media rows are migrated
- webp/image rows remain preserved
- unmatched rows are reported, not invented
- publication media manifests are only updated if safe
- no frontend files are changed
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_migrate_registry_media_references_to_l2_v1.meta.md

## CLOSE

This pass migrates Measures Registry heavy media to L2-backed storage.

Image assets remain in current image storage.

Valid sequence:

shared storage seated → Inanna heavy media migration → Registry heavy media migration → render validation

Codex holds.
Field structures.
Measures registers.
Chazz executes.
