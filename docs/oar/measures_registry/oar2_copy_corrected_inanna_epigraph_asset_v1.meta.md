---
document_type: oar2
authority_level: working
document_scope: bucket_media_correction
title: OAR2 — Copy Corrected Inanna Epigraph Asset
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_copy_corrected_pre_codex_media_assets_to_measures_registry_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Copy Corrected Inanna Epigraph Asset

## OBSERVED

The prior correction OAR held the epigraph asset because the routed source object:

    inanna_encounter.webp

was no longer present during execution.

Operator has now confirmed the source asset itself was renamed because the original encounter naming was incorrect.

Correct source object:

    inanna_epigraph.webp

The provider-contract seam remains unresolved.

DB remap remains intentionally held.

This OAR2 resolves only the corrected epigraph copy and verification layer.

## ALIGNED

Codex remains authority.

Field structures media relation.

Measures registers media readiness.

Chazz validates and routes.

Cody executes only from this OAR2.

This OAR2 authorizes:

1. verification of the corrected epigraph source object
2. copy into the measures-registry bucket
3. target verification
4. OAR1 validation closeout

This OAR2 does not authorize:

- DB remap
- storage provider mutation
- frontend hardcoding
- runtime resolver mutation
- inferred media creation
- source deletion

## ROUTED

### 1. Source verification

Cody must verify the source object exists in:

    pre-codex-exhibition/inanna_epigraph.webp

Verification required:

- object exists
- nonzero size
- retrievable URL succeeds

### 2. Target copy

Target bucket:

    measures-registry

Target path:

    measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp

### 3. Verification

After copy, Cody must verify:

- target object exists
- nonzero size
- signed URL generation succeeds
- retrieval status returns 200

### 4. Hold boundary

No DB mutation authorized.

The provider-contract seam remains unresolved and outside this OAR2 scope.

### 5. Frontend boundary

Frontend remains DB-driven.

No hardcoded media paths.
No fallback media logic.
No resolver mutation.

## VALIDATION

Cody must return:

- source verification result
- copied target verification result
- retrieval verification result
- DB mutation count 0
- frontend mutation count 0

## CODY ROLE

Cody may:

- verify source asset
- copy target asset
- validate retrieval
- write OAR1 closeout

Cody may not:

- mutate DB rows
- alter provider contract
- hardcode frontend paths
- invent missing media
- bypass verification

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_copy_corrected_inanna_epigraph_asset_v1.meta.md

## CLOSE

Correct the epigraph source.
Verify the target.
Hold the DB boundary.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
