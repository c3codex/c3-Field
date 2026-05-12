---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_pre_codex_media_l2_migration
title: OAR2 — Migrate Pre-Codex Exhibition Media to L2
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
  - cloudflare-r2
source_alignment:
  - OAR1 - Validate L2 Runtime Media Delivery
  - OAR1 - Repair Inanna Registry-to-Encounter Key Resolution
  - OAR Lifecycle — Execution and Handoff
  - OAR2 - Update PowerShell Transfer Surface Rule
---

# OAR2 — Migrate Pre-Codex Exhibition Media to L2

## OBSERVED

Measures Registry now loads L2 media correctly.

Measures of Inanna loads runtime state, but animated and still media do not load.

Current codex_media_asset bucket standing:

- measures-media / cloudflare_r2: 7 rows
- pre-codex-exhibition / cloudflare_r2: 21 rows

Operator confirmed the 21 pre-codex-exhibition rows and storage paths.

Mixed R2 bucket naming may be preventing shared provider-aware runtime delivery.

## ALIGNED

This is a media bucket reference reconciliation pass.

Authority order remains:

Codex → Field → Measures → Chazz/src

Storage does not define truth.

This pass only reconciles media asset bucket references where exact L2 object matches exist.

No surface-key repair is included in this pass.

No frontend mutation is included in this pass.

PowerShell transfer must remain parser-safe.

## ROUTED

Cody shall migrate deterministic pre-codex-exhibition media asset references to measures-media.

### 1. Verify source rows

Inspect public.codex_media_asset where bucket equals pre-codex-exhibition.

Expected source count: 21.

### 2. Verify L2 manifest

Use the active measures-media L2 manifest.

Preferred source:

docs/_source/working/media/l2_bucket_manifest_v1.txt

If the manifest has a different current path, report it and use the active manifest only if clearly identified.

Do not infer object names.

Do not invent object paths.

### 3. Migrate exact object matches only

For each pre-codex-exhibition row:

- verify exact storage_path exists in the measures-media manifest
- if exact match exists:
  - set bucket = measures-media
  - preserve storage_provider = cloudflare_r2
  - preserve storage_path
  - preserve media_key
  - preserve media_type
  - preserve status/title/metadata
  - append migration metadata:
    - previous_bucket: pre-codex-exhibition
    - migration_oar2: oar2_migrate_pre_codex_exhibition_media_to_l2_v1
    - migration_reason: unify_inanna_r2_runtime_delivery
- if exact match does not exist:
  - do not mutate row
  - report unmatched row

### 4. Preserve surface mappings

Do not mutate:

- public.measures_surface_media_map
- surface keys
- roles
- sequence index
- media keys

### 5. Preserve frontend

Do not mutate frontend files.

Do not change media resolver.

Do not change encounter resolver.

### 6. Validation queries

Return bucket count grouped by bucket and storage_provider.

Return the full list of the 21 routed media_key rows after migration.

## CODY ROLE

Cody may:

- inspect codex_media_asset
- inspect L2 manifest
- update bucket references for exact deterministic matches
- preserve previous bucket metadata
- report unmatched rows
- write OAR1 closeout

Cody may not:

- mutate frontend files
- mutate surface mappings
- mutate encounter definitions
- infer object names
- invent bucket paths
- change media roles
- change sequence order
- perform surface-key repair
- expose secrets

## VALIDATION

Cody must return:

1. source pre-codex-exhibition row count
2. L2 manifest found / not found
3. exact matched rows count
4. migrated rows list
5. unmatched rows list
6. bucket count after migration
7. confirmation no surface mappings changed
8. confirmation no frontend files changed
9. confirmation no media resolver changed
10. OAR1 closeout path

Execution is valid only when:

- only exact manifest matches are migrated
- unmatched rows are preserved
- previous bucket is preserved in metadata
- surface mappings are unchanged
- frontend is unchanged
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_migrate_pre_codex_exhibition_media_to_l2_v1.meta.md

## CLOSE

This pass unifies deterministic Measures of Inanna R2 media references under the shared L2 bucket without changing surface mapping or encounter logic.

Codex holds.
Field structures.
Measures registers.
Chazz executes.
