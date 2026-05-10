---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_l2_media_migration
title: OAR2 — Migrate Measures of Inanna Media References to L2
status: proposed
version: v1
operator: op044
system: measures_of_inanna
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-of-inanna
  - media-migration
  - l2-bucket
  - registry-media
  - temp-exhibition-media
  - chamberplate
source_alignment:
  - OAR1 - Register L2 Bucket as Shared Media Storage
  - OAR1 - Transition Chamberplate Runtime to Registry Media
  - OAR1 - Seat Chamber of Epithets Chamberplate Aspect Media
  - DB to src Manifest — Measures of Inanna Exhibition
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Migrate Measures of Inanna Media References to L2

## OBSERVED

L2 shared media storage has been registered.

Active shared storage row:

- storage_key: l2_shared_media
- provider: cloudflare_r2
- bucket: measures-media
- status: active
- scope: shared_runtime_media
- manifest: docs/_source/working/media/l2_bucket_manifest_v1.txt
- manifest object count: 24

Prior storage inspection found Measures of Inanna still has non-shared media references:

- codex_media_asset non-shared-bucket rows: 28
- measures_surface_media_map non-shared-bucket linked rows: 28
- temp_exhibition_media non-shared-bucket rows: 73

The Chamberplate runtime now supports registry-first media resolution with fallback to public.temp_exhibition_media.

The next migration must move Measures of Inanna media references toward L2-backed registry state without deleting legacy trace.

## ALIGNED

Storage does not define authority.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required interpretation:

- L2 bucket stores active runtime media
- DB rows remain authority records
- old bucket references are preserved as storage history
- runtime should resolve registry media where seated
- temp_exhibition_media is legacy fallback, not future authority
- frontend must not be hardcoded to L2 paths

This OAR2 is a DB/media-reference migration for Measures of Inanna only.

Measures Registry migration is out of scope.

## ROUTED

Cody shall migrate Measures of Inanna media references to L2-backed registry state.

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

### 3. Inspect Measures of Inanna media references

Inspect:

- public.codex_media_asset
- public.measures_surface_media_map
- public.temp_exhibition_media

Identify rows related to Measures of Inanna that still reference:

- pre-codex-exhibition
- l2_chamberplate
- any non-measures-media bucket

### 4. Match existing media to L2 object keys

For each Measures of Inanna media row, attempt deterministic matching against the L2 manifest by:

1. exact filename match
2. normalized filename match
3. extension-aware match
4. known media role match where already seated

Allowed media types:

- image where relevant to existing registry rows
- mp3
- mp4
- mov
- wav

Do not convert media type.

Do not rewrite titles or encounter meaning.

### 5. Update codex_media_asset rows where match is found

For matched rows:

- set bucket to measures-media
- set storage_provider to cloudflare_r2
- set storage_path to matched L2 object key
- preserve media_key
- preserve title
- preserve metadata
- add migration metadata

Migration metadata should include:

{
  "migrated_to_storage_key": "l2_shared_media",
  "previous_bucket": "<prior bucket>",
  "previous_storage_path": "<prior storage_path>",
  "migration_source_manifest": "docs/_source/working/media/l2_bucket_manifest_v1.txt",
  "migration_oar": "oar2_migrate_exhibition_media_references_to_l2_v1",
  "legacy_reference_preserved": true
}

### 6. Preserve measures_surface_media_map

Do not delete mappings.

Do not change surface_key, role, sequence, status, or metadata except where migration metadata is required.

Mappings should continue pointing to the same media_key.

### 7. Handle temp_exhibition_media carefully

Do not delete or mutate public.temp_exhibition_media rows unless an existing process already supports explicit legacy migration marking.

If a legacy marking column exists, mark matched rows as legacy/source fallback.

If no such column exists, leave temp_exhibition_media unchanged and report remaining legacy count.

### 8. Chamberplate priority

Prioritize the first three Chamber of Epithets chamberplates:

- chamber_epithets_01_primus_artus
- chamber_epithets_02_gemynd_corpus
- chamber_epithets_03_percipari

Ensure already seated registry rows remain active for:

- oracle_card
- original_artwork
- full_song

If featured videos or tones exist in L2 manifest and match intended chamberplate roles, seat them according to prior chamberplate reconciliation rules.

Do not seat epithet descriptions in this OAR2.

### 9. Report unmatched rows

For any row that cannot be matched to L2 manifest:

- do not mutate
- report media_key / table / bucket / storage_path / reason

### 10. No frontend mutation

No frontend files should be changed.

Runtime already supports registry-first rendering.

## CODY ROLE

Cody may:

- read the shared L2 manifest
- inspect Measures of Inanna media references
- update matched codex_media_asset storage pointers to L2
- preserve existing registry mappings
- leave temp fallback rows unchanged unless legacy marking is supported
- seat matching chamberplate featured video/tone assets if present in manifest
- return validation output
- write OAR1 closeout

Cody may not:

- mutate Measures Registry media
- hardcode L2 paths into frontend
- invent bucket paths
- invent media relationships
- invent epithet descriptions
- delete legacy rows
- remove old storage history
- modify frontend files

## VALIDATION

Cody must return:

1. L2 storage row found / not found
2. L2 manifest found / not found
3. L2 manifest object count
4. codex_media_asset rows migrated count
5. measures_surface_media_map rows preserved count
6. temp_exhibition_media rows unchanged or legacy-marked count
7. chamberplate featured videos seated count, if any
8. chamberplate tones seated count, if any
9. unmatched media rows list
10. confirmation no frontend files changed
11. validation query output

Validation query:

    select
      ma.media_key,
      ma.title,
      ma.media_type,
      ma.bucket,
      ma.storage_provider,
      ma.storage_path,
      ma.status,
      ma.metadata
    from public.codex_media_asset ma
    where ma.bucket = 'measures-media'
      and ma.storage_provider = 'cloudflare_r2'
    order by ma.media_key;

Chamberplate validation query:

    select
      sm.surface_key,
      sm.sequence_index,
      sm.role,
      sm.status,
      ma.media_key,
      ma.media_type,
      ma.bucket,
      ma.storage_path,
      sm.metadata as map_metadata,
      ma.metadata as asset_metadata
    from public.measures_surface_media_map sm
    join public.codex_media_asset ma
      on ma.media_key = sm.media_key
    where sm.surface_key in (
      'chamber_epithets_01_primus_artus',
      'chamber_epithets_02_gemynd_corpus',
      'chamber_epithets_03_percipari'
    )
    order by sm.surface_key, sm.sequence_index, sm.role, ma.media_key;

Execution is valid only when:

- shared L2 storage row exists
- L2 manifest is used
- matched Measures of Inanna media rows now point to measures-media
- unmatched rows are reported, not invented
- mappings remain intact
- temp fallback rows are not destructively changed
- no frontend files are changed
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_migrate_exhibition_media_references_to_l2_v1.meta.md

## CLOSE

This pass migrates Measures of Inanna media references toward L2-backed registry state.

Measures Registry remains separate.

Valid sequence:

shared storage seated → Inanna media migration → Registry media migration → render validation

Codex holds.
Field structures.
Measures registers.
Chazz executes.
