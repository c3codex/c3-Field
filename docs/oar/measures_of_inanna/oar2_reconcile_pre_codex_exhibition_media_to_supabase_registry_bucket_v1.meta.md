---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_pre_codex_media_supabase_reconciliation
title: OAR2 — Reconcile Pre-Codex Exhibition Media to Supabase Registry Bucket
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
  - media-reconciliation
  - supabase-storage
  - pre-codex-exhibition
source_alignment:
  - OAR1 - Validate L2 Runtime Media Delivery
  - OAR1 - Repair Inanna Registry-to-Encounter Key Resolution
  - OAR2 - Update PowerShell Transfer Surface Rule
---

# OAR2 — Reconcile Pre-Codex Exhibition Media to Supabase Registry Bucket

## OBSERVED

Previous L2 migration direction is cancelled.

The 21 pre-codex-exhibition media rows should not all migrate to R2/L2.

Current intended media split:

- Supabase measures-registry bucket:
  - still images
  - oracle cards
  - original artwork
  - png
  - webp
  - jpeg

- Cloudflare R2 measures-media bucket:
  - mp4
  - mov
  - mp3
  - wav
  - heavy runtime media

Measures Registry now loads L2 media correctly.

Measures of Inanna loads runtime state, but media still fails because pre-codex-exhibition bucket references remain unresolved in current runtime delivery.

## ALIGNED

This is a media storage reconciliation pass.

Authority order remains:

Codex → Field → Measures → Chazz/src

Storage does not define truth.

This pass must not collapse still-image storage and heavy-media storage.

Do not run or execute:

docs/oar/measures_of_inanna/oar2_migrate_pre_codex_exhibition_media_to_l2_v1.meta.md

That path is superseded by this OAR2.

## ROUTED

Cody shall reconcile pre-codex-exhibition media rows into the correct storage authority.

### 1. Inspect source rows

Inspect all rows from public.codex_media_asset where bucket equals pre-codex-exhibition.

Expected source count: 21.

### 2. Classify rows by media type

Classify:

- image rows → Supabase measures-registry
- video/audio rows → R2 measures-media only if exact object exists there

Image rows include:

- png
- webp
- jpeg
- jpg

Heavy rows include:

- mp4
- mov
- mp3
- wav

### 3. Verify Supabase object presence before image mutation

Before changing any image row:

- verify exact object exists in Supabase bucket measures-registry
- use exact storage_path
- do not infer renamed paths
- do not invent folders
- if exact object is missing, do not mutate row and report unmatched

For matched image rows:

- set bucket = measures-registry
- set storage_provider = supabase
- preserve storage_path
- preserve media_key
- preserve media_type
- preserve roles and surface mappings
- append metadata:
  - previous_bucket: pre-codex-exhibition
  - previous_storage_provider: cloudflare_r2
  - migration_oar2: oar2_reconcile_pre_codex_exhibition_media_to_supabase_registry_bucket_v1
  - migration_reason: restore_supabase_image_delivery_for_inanna

### 4. Verify R2 object presence before heavy-media mutation

For video/audio rows:

- verify exact object exists in R2 measures-media
- if exact object exists:
  - set bucket = measures-media
  - set storage_provider = cloudflare_r2
  - preserve storage_path
  - append prior bucket metadata
- if exact object does not exist:
  - do not mutate row
  - report unmatched

### 5. Preserve surface mappings

Do not mutate:

- public.measures_surface_media_map
- surface_key
- role
- sequence_index
- media_key

### 6. Preserve frontend

Do not mutate frontend files.

Do not change media resolver.

Do not change encounter resolver.

### 7. Validation

Return bucket/provider counts after reconciliation.

Return the 21 source media_key rows after reconciliation.

Return unmatched rows separately.

## CODY ROLE

Cody may:

- inspect codex_media_asset
- verify Supabase measures-registry object presence
- verify R2 measures-media object presence
- update bucket/provider references for exact deterministic matches
- preserve previous bucket/provider metadata
- report unmatched rows
- write OAR1 closeout

Cody may not:

- run the superseded L2-only migration OAR2
- mutate frontend files
- mutate surface mappings
- mutate encounter definitions
- infer object names
- invent storage paths
- change media roles
- change sequence order
- perform surface-key repair
- expose secrets

## VALIDATION REQUIREMENTS

Cody must return:

1. source pre-codex-exhibition row count
2. image rows count
3. heavy media rows count
4. Supabase object matches
5. R2 object matches
6. migrated/repointed rows list
7. unmatched rows list
8. bucket/provider count after reconciliation
9. confirmation no surface mappings changed
10. confirmation no frontend files changed
11. confirmation no media resolver changed
12. OAR1 closeout path

Execution is valid only when:

- previous L2-only migration is not run
- image rows are pointed only to verified Supabase objects
- heavy rows are pointed only to verified R2 objects
- unmatched rows are preserved
- prior bucket/provider is preserved in metadata
- surface mappings are unchanged
- frontend is unchanged
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_reconcile_pre_codex_exhibition_media_to_supabase_registry_bucket_v1.meta.md

## CLOSE

This pass restores the correct storage split:

Supabase for still exhibition media.
R2 for heavy runtime media.

Codex holds.
Field structures.
Measures registers.
Chazz executes.
