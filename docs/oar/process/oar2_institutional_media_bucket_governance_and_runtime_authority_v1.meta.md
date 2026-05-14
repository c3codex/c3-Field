---
document_type: oar2
authority_level: working
document_scope: institutional_media_bucket_governance
title: OAR2 — Institutional Media Bucket Governance and Runtime Authority
status: proposed
version: v1
operator: op044
system: process
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
source_alignment:
  - DB to src Manifest — Measures of Inanna Exhibition
  - OAR Lifecycle — Execution and Handoff
  - Seeded Reference Control
  - Session 13 — DB Preflight Verification Checklist
tags:
  - media
  - buckets
  - r2
  - supabase
  - runtime
  - authority
  - process
  - governance
---

# OAR2 — Institutional Media Bucket Governance and Runtime Authority

## OBSERVED

Measures Registry and Measures of Inanna runtime repair exposed unresolved institutional media governance boundaries.

Observed drift conditions included:

- duplicate media authority paths
- fallback runtime behavior overriding governed mappings
- temporary media tables behaving as authority
- inconsistent bucket placement
- runtime retrieval inconsistency
- unresolved Supabase vs R2 role distinction
- frontend retrieval assumptions detached from governed DB mappings

Runtime coherence improved only after governed media mappings became primary runtime authority.

## ALIGNED

Codex remains authority.

Field structures media relation.

Measures registers governed media mappings and runtime reveal order.

Chazz validates media governance boundaries and runtime authority discipline.

Cody implements runtime retrieval only from governed media authority.

## ROUTED

### 1. Define institutional media authority hierarchy

Canonical authority order:

    Codex
    → Field
    → Measures governed media mappings
    → runtime retrieval
    → bucket object delivery

Buckets do not define authority.

Runtime must resolve from governed DB mappings only.

### 2. Define Supabase role

Supabase buckets resolve as:

    governed image/runtime authority layer

Supabase should primarily contain:

- webp images
- optimized still assets
- runtime-responsive image surfaces
- governed encounter stills
- lightweight runtime presentation assets

### 3. Define R2 role

Cloudflare R2 resolves as:

    large media delivery layer

R2 should primarily contain:

- video
- audio
- large motion assets
- downloadable media
- long-form media surfaces
- large encounter media bodies

### 4. Define governed media mapping authority

Runtime retrieval authority resolves from:

- governed DB media rows
- governed media mappings
- release/access state
- encounter/media relation

Canonical runtime authority chain:

    measures_registry / measures_encounter_def
    → measures_surface_media_map
    → codex_media_asset
    → bucket object delivery

The surface mapping seats relation, role, render order, and surface authority.

The media asset seats provider, bucket, path, media type, and object authority.

Frontend may not:

- guess bucket paths
- infer filenames
- fallback to arbitrary media
- substitute temp media
- invent retrieval precedence

### 5. Define temporary/fallback media prohibition

Temporary tables, fallback stores, or staging media may not function as runtime authority.

Temporary or fallback media may exist operationally but may not supersede governed runtime authority.

Fallback supplement is permitted only when explicitly governed as temporary support.

Released public surfaces should resolve from governed media mappings only unless an OAR2 explicitly authorizes temporary fallback behavior.

Any fallback usage during validation must be reported as drift with:

- source table
- surface key
- media type
- reason fallback was invoked
- removal or conversion target

### 6. Define transfer discipline

Media transfer process must include:

1. governed placement target
2. correct bucket selection
3. normalization validation
4. retrieval validation
5. DB mapping confirmation
6. runtime validation
7. deploy/runtime verification where applicable

Transfer completion is not bucket upload alone.

### 7. Define normalization standards

Images:
- webp preferred
- stable naming
- governed media keys

Video/audio:
- seated in governed delivery bucket
- retrievable through governed DB mappings
- normalized naming discipline
- no duplicate competing authority assets

Object key standards:

- object key in DB must match bucket key exactly
- no leading or trailing whitespace
- lowercase extensions preferred
- spaces in object keys require explicit confirmation and encoded retrieval proof
- replacement objects must update governed DB authority, not only bucket contents
- stale object keys must be recorded as stale, removed, or held for cleanup

Governed media rows should include or preserve:

- stable media key
- media type
- provider
- bucket
- storage path
- status
- runtime role
- map sequence index
- render behavior metadata when needed
- `frontend_hardcode_allowed: false`

### 8. Define role and render contract validation

Media migration must validate the role/render contract, not only object retrieval.

Validation should include surface-specific roles such as:

- `featured_video`
- `featured_animation`
- `image`
- `oracle_card`
- `original_artwork`
- `audio`
- `full_song`
- `material_tone`
- `lapis_tone`

Validation should include render behaviors such as:

- `muted_autoplay`
- `loop_muted`
- `autoplay_after_passage`
- `audio_play`
- `image_expand`

Chamberplate validation must confirm video/still/aspect sequencing.

Passage validation must confirm video preference, tone behavior, and registry-driven transition.

### 9. Define source standing states

Unresolved or ambiguous media must be classified before mutation.

Allowed source standing states:

- `verified`
- `missing_source`
- `retrieval_failed`
- `ambiguous_duplicate`
- `operator_confirmed_replacement`
- `held_pending_source`

No media surface should be marked runtime-valid from bucket presence alone.

### 10. Define runtime verification standards

Runtime verification must distinguish:

- bucket presence
- DB mapping existence
- release/access state
- retrieval success
- frontend render success
- deployed runtime standing

Successful upload alone does not confirm runtime coherence.

Retrieval proof should include:

- resolved public URL
- HTTP status
- content type
- content length
- last modified timestamp when available
- provider
- bucket
- storage path
- media key
- surface key
- map role

Deploy proof should include:

- local build result
- pushed commit
- deployed bundle identity
- live media retrieval
- live user-facing runtime standing

### 11. Define bucket inventory boundary

Bucket inventory may inform diagnosis.

Bucket inventory does not create runtime standing.

An object being present in Supabase or R2 is not authority until governed DB mapping and runtime validation are complete.

### 12. Seed institutional media bucket governance process

Create institutional process seed:

    docs/process/media/institutional_media_bucket_governance_process.meta.md

This process seed must preserve:

- infrastructure/authority distinction
- Supabase and R2 role boundaries
- governed mapping authority
- fallback prohibition and sunset discipline
- object key normalization
- retrieval proof standards
- deployed runtime proof standards
- OAR2/OAR1 requirements for mutation

### 13. Seed conversion engine media authority process

Create conversion engine seed:

    docs/process/media/conversion_engine_media_authority_seed.meta.md

This conversion seed must define a reusable intake-to-runtime flow:

1. intake manifest
2. source standing classification
3. provider/bucket target selection
4. object key normalization
5. source retrieval proof
6. governed asset row seating
7. surface mapping seating
8. role/render contract validation
9. runtime selection validation
10. deployed standing validation where applicable
11. held-state routing for unresolved or ambiguous media

The conversion engine may recommend mutations only through OAR2.

The conversion engine may not promote bucket inventory into authority.

## CODY ROLE

Cody may:

- implement governed retrieval behavior
- validate runtime retrieval
- report missing governed mappings
- preserve infrastructure/authority distinction
- seed institutional process documents
- seed conversion engine process documents
- write OAR1 closeout

Cody may not:

- invent fallback authority
- bypass governed mappings
- infer media truth from bucket contents
- hardcode retrieval shortcuts
- elevate infrastructure into authority

## VALIDATION

This OAR2 resolves successfully when:

1. institutional media authority hierarchy is defined
2. Supabase role is defined
3. R2 role is defined
4. governed DB mappings remain runtime authority
5. fallback authority prohibition is explicit
6. transfer discipline is defined
7. normalization standards are defined
8. role/render contract validation is defined
9. source standing states are defined
10. runtime verification standards are defined
11. bucket inventory boundary is defined
12. institutional media bucket governance process seed is created
13. conversion engine media authority seed is created
14. infrastructure/authority distinction is preserved

## EXPECTED OAR1

    docs/oar/process/oar1_institutional_media_bucket_governance_and_runtime_authority_v1.meta.md

## CLOSE

Buckets deliver.

Mappings govern.

Runtime renders only governed authority.

Infrastructure is not truth.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
