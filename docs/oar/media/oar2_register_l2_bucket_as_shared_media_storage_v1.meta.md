---
document_type: oar2
authority_level: working
document_scope: shared_media_storage
title: OAR2 — Register L2 Bucket as Shared Media Storage
status: proposed
version: v1
operator: op044
system: media
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - media
  - l2-bucket
  - shared-storage
  - measures-of-inanna
  - measures-registry
source_alignment:
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Register L2 Bucket as Shared Media Storage

## OBSERVED

The operator has moved mp3, mp4, MOV, and wav media files from both active sites into the L2 bucket.

Affected systems:

- Measures of Inanna
- Measures Registry

A full L2 bucket manifest has been created:

docs/_source/working/media/l2_bucket_manifest_v1.txt

Current risk:

- existing DB/media rows may still point to prior buckets
- frontend/runtime surfaces may resolve stale storage paths
- both sites may now require bucket reference reconciliation
- L2 must be registered as the active runtime storage surface before per-site migration

## ALIGNED

Storage does not define authority.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required interpretation:

- L2 bucket stores active runtime media
- existing DB rows remain authority records
- bucket path changes must be reflected through DB-seated media records
- old bucket references are storage history, not current runtime authority
- frontend must not be patched with hardcoded L2 paths

This OAR2 registers/validates L2 as a shared media storage surface only.

It does not migrate individual site media references yet.

## ROUTED

Cody shall inspect and register L2 as shared active media storage.

### 1. Verify manifest

Confirm this manifest exists:

docs/_source/working/media/l2_bucket_manifest_v1.txt

If absent, stop and report missing manifest.

### 2. Inspect existing media storage patterns

Inspect current DB/media references for:

- bucket names
- storage providers
- storage paths
- public URLs
- media tables currently used by Measures of Inanna
- media tables currently used by Measures Registry

Do not mutate site-specific media references in this OAR2.

### 3. Register L2 storage surface

If a storage registry/config table already exists, add or update L2 as active shared media storage.

If no storage registry/config surface exists, Cody may create a minimal DB surface equivalent to:

    media_storage_registry
      storage_key
      provider
      bucket
      status
      scope
      metadata
      created_at
      updated_at

Required standing:

- storage_key: l2_shared_media
- provider: cloudflare_r2
- bucket: measures-media
- status: active
- scope: shared_runtime_media

Metadata should include:

    {
      "contains": ["mp3", "mp4", "mov", "wav"],
      "used_by": ["measures_of_inanna", "measures_registry"],
      "manifest": "docs/_source/working/media/l2_bucket_manifest_v1.txt",
      "frontend_hardcode_allowed": false
    }

### 4. Preserve old storage references

Do not delete or invalidate old bucket references yet.

Old storage remains legacy/source history until per-site validation confirms successful migration.

### 5. Prepare next migration standing

Return observed media rows that still reference prior buckets and group them by system:

- Measures of Inanna
- Measures Registry
- unknown / needs classification

### 6. No frontend mutation

Do not change frontend files.

Do not change site media references yet.

This is shared storage registration/preflight only.

## CODY ROLE

Cody may:

- read the L2 manifest
- inspect existing DB media references
- create or update a shared media storage registry surface if needed
- register L2 as active shared runtime media storage
- report media rows requiring migration
- write OAR1 closeout

Cody may not:

- hardcode L2 paths into frontend
- migrate individual site media references yet
- delete old bucket references
- mutate Measures of Inanna encounter media mappings
- mutate Measures Registry media mappings
- invent bucket object names
- proceed without manifest

## VALIDATION

Cody must return:

1. manifest found / not found
2. L2 object count from manifest
3. storage registry surface created or reused
4. active L2 storage registry row
5. observed prior buckets/storage providers
6. count of media rows requiring migration by system
7. confirmation no frontend files changed
8. OAR1 closeout path

Execution is valid only when:

- L2 manifest is present
- L2 bucket is registered as active shared media storage
- old storage references remain preserved
- per-site media migration is not performed yet
- no frontend hardcoding is introduced
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/media/oar1_register_l2_bucket_as_shared_media_storage_v1.meta.md

## CLOSE

This seats the shared storage surface.

Next OAR2s:

1. Measures of Inanna media reference migration
2. Measures Registry media reference migration

Codex holds.
Field structures.
Measures registers.
Chazz executes.
