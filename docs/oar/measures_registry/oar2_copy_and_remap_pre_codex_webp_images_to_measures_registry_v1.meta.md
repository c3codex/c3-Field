---
document_type: oar2
authority_level: working
document_scope: bucket_media_remap
title: OAR2 — Copy and Remap Pre-Codex WebP Images to Measures Registry
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
  - pre-codex-exhibition
  - media
  - bucket-transfer
  - webp
  - remap
  - supabase
source_alignment:
  - Seed Concordance
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
  - OAR2 Update PowerShell Transfer Surface Rule
---

# OAR2 — Copy and Remap Pre-Codex WebP Images to Measures Registry

## OBSERVED

Pre-Codex Exhibition image media currently exists in the Supabase bucket:

- source bucket: pre-codex-exhibition

Operator confirmed the images have been converted to .webp.

The prior media mapping no longer matches exactly because image filenames and/or extensions changed after conversion.

Current intent is not to migrate to an L2 bucket.

Current intent is to copy the relevant Pre-Codex Exhibition .webp image media into the Supabase bucket:

- target bucket: measures-registry

This operation is a bucket copy/remap action, not a truth-authoring action.

No frontend surface may hardcode these media paths.

No DB media mapping may be updated until copied target objects are verified retrievable.

## ALIGNED

Codex remains authority.

Field structures media relation.

Measures registers usable media mapping, encounter relation, and render eligibility.

Chazz validates and routes the operation.

Cody executes only from this OAR2.

This OAR2 aligns the active seam:

1. identify current .webp image objects in pre-codex-exhibition
2. copy selected image objects into measures-registry
3. preserve or normalize storage paths under Measures Registry media organization
4. verify target objects exist and are retrievable
5. update DB media mappings only after target verification
6. produce OAR1 closeout with validation evidence

This operation must not:

- delete source bucket objects
- alter source bucket standing
- invent missing media mappings
- hardcode frontend media URLs
- update DB records before copied media is verified
- treat filename similarity as proof of mapping correctness

## ROUTED

### 1. Source bucket inventory

Cody must list .webp image objects from:

    pre-codex-exhibition

Cody must identify only image media relevant to Pre-Codex Exhibition / Measures Registry remap.

If ambiguity exists, Cody must return an inventory table and stop before DB mutation.

### 2. Target bucket path

Copied media should be placed under a Measures Registry scoped path.

Preferred target pattern:

    measures_registry/pre_codex_exhibition/images/<filename>.webp

If existing registry media convention uses a different seated path, Cody must follow the existing convention and report it in OAR1.

### 3. Copy behavior

Cody must copy objects from:

    pre-codex-exhibition/<source_path>

to:

    measures-registry/measures_registry/pre_codex_exhibition/images/<filename>.webp

Source objects must remain intact.

No destructive operation is authorized.

### 4. Verification before DB update

Before DB mutation, Cody must verify:

- target bucket object exists
- target object has nonzero size
- target object is retrievable or public/signed URL generation succeeds according to current bucket policy
- copied media count matches intended remap count

If verification fails, Cody must stop and report missing or failed objects.

### 5. DB remap

Only after target verification, Cody may update seated media mapping records to point to the target measures-registry bucket/path.

DB update must be limited to records whose existing media relation clearly corresponds to the copied Pre-Codex Exhibition image objects.

Cody must not infer unrelated mappings.

If mapping is uncertain, Cody must produce a proposed mapping table and stop.

### 6. Frontend boundary

Frontend must continue reading media from seated DB mapping.

No React/component hardcoding is authorized.

No fallback media path is authorized.

If a mapping is missing, frontend must show absence or failure honestly.

### 7. OAR1 required

Cody must write OAR1 beside this OAR2 after execution.

Expected OAR1 path:

    docs/oar/measures_registry/oar1_copy_and_remap_pre_codex_webp_images_to_measures_registry_v1.meta.md

OAR1 must include:

- source bucket inventory summary
- copied object list
- target bucket/path list
- verification results
- DB records updated
- records skipped or held
- errors, if any
- final standing

## CODY ROLE

Cody may:

- inspect Supabase bucket object inventory
- copy verified .webp image objects
- validate copied object presence
- update DB media mappings after verification
- produce OAR1 closeout

Cody may not:

- delete source media
- hardcode frontend paths
- update DB before target verification
- invent media relationships
- remap ambiguous records without reporting
- bypass OAR1
- extend scope beyond Pre-Codex Exhibition image media

## VALIDATION

This OAR2 resolves successfully when:

1. relevant .webp image media is copied from pre-codex-exhibition to measures-registry
2. copied target objects are verified
3. DB media mappings point to verified measures-registry paths
4. frontend remains DB-driven
5. no source bucket objects are deleted
6. OAR1 is written with validation evidence

## EXPECTED FILES

Expected OAR2:

    docs/oar/measures_registry/oar2_copy_and_remap_pre_codex_webp_images_to_measures_registry_v1.meta.md

Expected OAR1 after execution:

    docs/oar/measures_registry/oar1_copy_and_remap_pre_codex_webp_images_to_measures_registry_v1.meta.md

## CLOSE

Copy first.
Verify target.
Remap only verified media.
Render from Codex state.

No hardcoding.
No destructive migration.
No invented mapping.
