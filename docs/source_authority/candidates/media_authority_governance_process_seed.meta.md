---
document_type: process_seed
authority_level: working
document_scope: media_authority_governance
title: Media Authority Governance Process Seed
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
source_oar:
  - oar1_repair_inanna_governed_media_authority_across_passages_v1
  - oar1_repair_governed_chamberplate_media_authority_v1
---

# Media Authority Governance Process Seed

## PURPOSE

Prevent secondary media authority from surviving conversion.

This process governs media migration, runtime validation, fallback handling, and source-held decisions.

## CORE RULE

No secondary authority may survive conversion.

Runtime must resolve media from governed DB mappings.

Fallback surfaces may supplement temporarily.

Fallback surfaces may not become authority.

## PROCESS INTELLIGENCE CAPTURED

The Inanna repair sequence proved:

1. DB-valid is not the same as runtime-valid.
2. Matrix validation is not the same as live encounter validation.
3. Temp media tables create parallel authority risk.
4. Fallback rows can conceal broken governed mappings.
5. Passage-family surfaces expose mixed authority fastest.
6. Chamberplate media requires explicit video-to-still sequencing.
7. Held-source cases must remain held until source is verified.
8. Frontend must not compensate for missing Codex state.
9. Supabase should carry webp images only.
10. Cloudflare/R2 should carry large media.
11. Runtime behavior must be governed like DB state.

## REQUIRED VALIDATION LAYERS

Every media repair or migration must separate:

### 1. Seated-state validation

Confirms:

- registry row
- encounter_def
- release/access standing
- governed media rows
- media role
- provider/bucket/path
- retrieval status

### 2. Runtime-state validation

Confirms:

- selected primary media
- renderer behavior
- video/still precedence
- fallback behavior
- aspect behavior
- transition behavior
- local runtime result

### 3. Live-deploy validation

Confirms:

- deployed bundle identity
- deployed runtime behavior
- cache/stale bundle standing
- live media retrieval
- live user-facing result

## MEDIA AUTHORITY RULES

### Governed media first

Runtime must attempt governed media lookup before fallback.

### Fallback boundary

Fallback may only supplement.

Fallback may not override governed media.

Fallback may not be treated as source of truth.

### Held-source boundary

If no verified source object returns `200`, the surface remains held.

No invented media.

No fake continuity.

No frontend compensation.

### Provider boundary

Supabase:

- webp image assets only

Cloudflare/R2:

- video
- audio
- large media

No large-media drift into Supabase.

## CHAMBERPLATE CONTRACT

For chamberplate surfaces with motion:

1. governed featured video loads first
2. video plays as primary motion state
3. still image becomes settled support state
4. failed video retrieval falls through to governed still
5. fallback rows never override governed authority

## CHAMBER OF EPITHETS CONTRACT

For epithet chamberplates:

1. featured governed video loads first
2. featured governed video plays
3. runtime settles into still oracle-card state
4. aspects remain click-to-open support surfaces
5. still does not prematurely override motion
6. aspects are not flattened into chamberplate media

## PASSAGE CONTRACT

For passage surfaces:

1. passage renderer must read governed media mappings
2. passage video is preferred when active and retrievable
3. fallback media may supplement only after governed lookup
4. transition out must remain registry-driven
5. passage-family validation must include live runtime behavior

## FAILURE CLASSES

Every media failure must be classified as one of:

- missing source object
- source retrieval failure
- missing governed asset row
- missing surface mapping
- wrong provider/bucket/path
- renderer contract drift
- video/still precedence failure
- fallback override drift
- deployed bundle drift
- live runtime mismatch
- held-source pending operator decision

## OAR REQUIREMENT

Any media authority repair requires OAR2.

Any mutation requires OAR1 closeout.

No DB write proceeds from thread instruction alone.

## SUCCESS CONDITION

A media surface is valid only when:

- Codex-held media authority exists
- Field relation is intact
- Measures mapping is active
- runtime selects governed media
- live deploy renders expected behavior
- fallback does not act as authority
- unresolved source remains held

## CLOSE

No secondary authority survives conversion.

DB-valid is not runtime-valid.

Runtime-valid is not live-valid.

All three must be proven.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
