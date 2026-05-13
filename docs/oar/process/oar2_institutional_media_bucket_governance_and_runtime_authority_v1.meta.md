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

Frontend may not:

- guess bucket paths
- infer filenames
- fallback to arbitrary media
- substitute temp media
- invent retrieval precedence

### 5. Define temporary/fallback media prohibition

Temporary tables, fallback stores, or staging media may not function as runtime authority.

Temporary or fallback media may exist operationally but may not supersede governed runtime authority.

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

### 8. Define runtime verification standards

Runtime verification must distinguish:

- bucket presence
- DB mapping existence
- release/access state
- retrieval success
- frontend render success
- deployed runtime standing

Successful upload alone does not confirm runtime coherence.

## CODY ROLE

Cody may:

- implement governed retrieval behavior
- validate runtime retrieval
- report missing governed mappings
- preserve infrastructure/authority distinction
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
8. runtime verification standards are defined
9. infrastructure/authority distinction is preserved

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
