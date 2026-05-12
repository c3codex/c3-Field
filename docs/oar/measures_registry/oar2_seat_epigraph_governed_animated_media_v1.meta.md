---
document_type: oar2
authority_level: working
document_scope: epigraph_governed_media_seating
title: OAR2 — Seat Epigraph Governed Animated Media
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_enable_non_chamberplate_governed_media_resolution_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Seat Epigraph Governed Animated Media

## OBSERVED

Governed media resolution now supports:

- chamberplate
- aspect
- threshold

The remaining reported runtime gap is:

    epigraph has no governed animated/video media row

Current standing:

- governed still fallback exists:
  - inanna_epigraph.webp
- fallback legacy video remains active:
  - inanna_encounter_intro.mp4
- runtime precedence correctly favors animated/video media first

The remaining requirement is seating governed animated media for epigraph.

## ALIGNED

Codex remains authority.

Field structures media relation.

Measures registers governed media.

Chazz routes final epigraph seating.

Cody executes only from this OAR2.

This OAR2 authorizes seating governed epigraph animated/video media only.

This OAR2 does not authorize:

- broad fallback migration
- bucket deletion
- frontend hardcoding
- unrelated media seating
- resolver rewrite
- temp table deletion

## ROUTED

### 1. Verify animated epigraph source object

Cody must identify and verify the intended animated/video epigraph object.

Expected standing:

- provider: cloudflare_r2
- bucket: measures-media
- retrieval status: 200

Cody must report:

- exact object key
- media type
- retrieval validation
- runtime URL

### 2. Seat governed epigraph animated media

If the animated/video object validates successfully, Cody may:

- create or update governed media row
- create or update governed surface mapping

Target surface:

    epigraph

Governed animated media must become the primary epigraph media candidate.

### 3. Preserve still fallback behavior

The existing governed still image:

    inanna_epigraph.webp

must remain secondary/fallback image support only.

Still image must not outrank animated/video media.

### 4. Preserve fallback safety

Do not delete or deactivate:

    temp_exhibition_media.inanna_encounter_intro.mp4

under this OAR2.

Fallback remains active until governed animated media validates successfully at runtime.

### 5. Runtime validation

Cody must validate:

- governed animated epigraph media resolves
- runtime URL returns 200
- epigraph animated/video media is selected before still image
- governed still fallback remains available
- chamberplate behavior remains unchanged
- no frontend hardcoding introduced

### 6. No unrelated mutation

No bucket copy unless required for the verified animated object.

No broad migration.

No provider contract mutation.

No resolver rewrite.

No unrelated media seating.

## CODY ROLE

Cody may:

- verify animated media object
- create governed epigraph media row
- create governed mapping row
- validate runtime render precedence
- write OAR1 closeout

Cody may not:

- delete fallback rows
- invent missing media
- rewrite unrelated runtime logic
- mutate unrelated surfaces
- hardcode media paths

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. governed epigraph animated/video row seated
2. runtime retrieval returns 200
3. animated media resolves before still image
4. still fallback remains secondary support
5. chamberplate behavior remains valid
6. fallback rows remain undeleted
7. no frontend hardcoding introduced
8. exact DB rows and files changed listed

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_seat_epigraph_governed_animated_media_v1.meta.md

## CLOSE

Seat the governed animation.

Preserve fallback safety.

Keep runtime DB-governed.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
