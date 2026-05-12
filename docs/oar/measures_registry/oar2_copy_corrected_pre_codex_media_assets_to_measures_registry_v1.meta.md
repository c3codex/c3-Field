---
document_type: oar2
authority_level: working
document_scope: bucket_media_correction
title: OAR2 — Copy Corrected Pre-Codex Media Assets to Measures Registry
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_confirm_transfer_and_remap_operator_verified_pre_codex_assets_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Copy Corrected Pre-Codex Media Assets to Measures Registry

## OBSERVED

The prior OAR1 reported three missing target objects during operator-confirmed verification:

- inanna_epigraph.webp
- obsidian_chamberplate_gate01.webp
- og.webp

Operator has now clarified:

- inanna_epigraph.webp was previously misnamed as inanna_encounter.webp
- obsidian_chamberplate_gate01.webp has now been compressed and prepared from the original .jpeg
- og.webp has now been compressed and prepared from the original .jpeg

The provider-contract seam remains unresolved and DB remap remains intentionally held.

This OAR2 resolves only the corrected media-copy and verification layer.

## ALIGNED

Codex remains authority.

Field structures media relation.

Measures registers media readiness.

Chazz validates and routes.

Cody executes only from this OAR2.

This OAR2 authorizes:

1. verification of corrected source assets
2. copy of corrected media into the measures-registry bucket
3. verification of copied targets
4. normalization of the epigraph asset naming surface
5. OAR1 validation closeout

This OAR2 does not authorize:

- DB remap
- storage_provider mutation
- frontend hardcoding
- runtime resolver changes
- source deletion
- inferred media creation

## ROUTED

### 1. Corrected source verification

Cody must verify source objects exist in the source bucket.

Required source relations:

- source: inanna_encounter.webp
  target normalization:
  inanna_epigraph.webp

- source:
  obsidian_chamberplate_gate01.webp

- source:
  og.webp

Verification required:

- object exists
- nonzero size
- retrievable URL succeeds

### 2. Target copy

Target bucket:

    measures-registry

Target path pattern:

    measures_registry/pre_codex_exhibition/images/<filename>

Required target filenames:

- inanna_epigraph.webp
- obsidian_chamberplate_gate01.webp
- og.webp

### 3. Verification

After copy, Cody must verify:

- target object exists
- nonzero size
- signed URL generation succeeds
- retrieval status returns 200
- copied count equals expected count 3

### 4. Naming normalization

The epigraph asset must normalize to:

    inanna_epigraph.webp

No duplicate epigraph naming should remain active in remap recommendations moving forward.

### 5. Hold boundary

DB remap remains held until storage provider contract support for Supabase-backed rows is resolved.

No DB mutation authorized by this OAR2.

### 6. Frontend boundary

Frontend remains DB-driven.

No hardcoded storage paths.
No fallback media logic.
No resolver mutation.

## VALIDATION

Cody must return:

- verified source objects
- copied target objects
- target verification results
- normalized epigraph naming confirmation
- confirmation that DB mutation count remains 0
- confirmation that frontend mutation count remains 0

## CODY ROLE

Cody may:

- verify corrected source assets
- copy corrected target assets
- validate target retrieval
- normalize epigraph target naming
- write OAR1 closeout

Cody may not:

- mutate DB rows
- alter storage provider contract
- hardcode frontend paths
- invent missing media
- delete source objects
- bypass verification

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_copy_corrected_pre_codex_media_assets_to_measures_registry_v1.meta.md

## CLOSE

Correct the assets.
Verify the targets.
Hold the DB boundary.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
