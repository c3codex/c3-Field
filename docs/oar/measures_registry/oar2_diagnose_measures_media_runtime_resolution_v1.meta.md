---
document_type: oar2
authority_level: working
document_scope: runtime_media_diagnostic
title: OAR2 — Diagnose Measures Media Runtime Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_remap_verified_pre_codex_assets_to_supabase_provider_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Diagnose Measures Media Runtime Resolution

## OBSERVED

Operator reports that no media is loading in the runtime surface:

- no L2 animated media
- no still images
- no visible rendered media after verified storage/remap work

Prior OAR1 confirmed:

- verified Pre-Codex media rows were remapped to storage_provider = supabase
- target objects exist and retrieve successfully
- runtime resolver was tested for sample remapped rows
- no frontend or resolver mutation was performed
- held assets with no DB rows were not invented

The active failure is now runtime rendering, not bucket transfer.

## ALIGNED

Codex remains authority.

Field structures media relation.

Measures registers media mapping and encounter reveal.

Chazz diagnoses routing and runtime state.

Cody executes only from this OAR2.

Frontend must not invent media, hardcode paths, or bypass DB state.

This OAR2 authorizes diagnostic inspection only.

This OAR2 does not authorize:

- DB mutation
- frontend hardcoding
- resolver rewrite
- bucket transfer
- source deletion
- media row invention

## ROUTED

### 1. Identify active runtime surface

Cody must identify the current runtime page or encounter failing media render.

For the active rendered surface, report:

- route/page/component
- registry key or encounter key used
- media slots requested
- expected media types:
  - still
  - animation
  - audio
  - video
  - poster/preview if applicable

### 2. Trace DB media query

Cody must inspect the actual DB query used by src to retrieve media.

Report:

- table or view queried
- join path
- filters used
- registry/encounter key conditions
- release/access conditions
- ordering logic
- returned row count

### 3. Compare requested keys to returned rows

For each requested media slot, report:

- requested media key
- requested media type
- returned DB row yes/no
- storage_provider
- bucket
- storage_path
- resolved URL
- render decision

If no rows are returned, identify whether failure is caused by:

- missing mapping
- wrong key
- wrong registry relation
- release state filter
- media type mismatch
- provider resolver failure
- RLS/policy issue
- component expectation mismatch

### 4. Verify Supabase resolver in runtime context

Cody must verify that runtime code resolves:

    storage_provider = supabase
    bucket = measures-registry
    storage_path = measures_registry/pre_codex_exhibition/images/<filename>.webp

using DB fields only.

No component may construct paths independently.

### 5. Verify Cloudflare/R2 resolver still works

Because L2 animated media may still live under cloudflare_r2, Cody must verify runtime resolver behavior for existing:

    storage_provider = cloudflare_r2

rows.

If L2 animation rows are missing, held, or excluded by query filters, report that clearly.

### 6. Inspect media slot renderer

Cody must inspect the renderer handling stills and animated media.

Report:

- whether renderer expects media_type
- whether renderer expects animation before still image
- whether slot keys match DB records
- whether null media is silently swallowed
- whether missing media is hidden without diagnostic output

### 7. Produce diagnostic output

Cody must produce a diagnostic table with:

- surface/encounter
- requested media key
- DB row found
- provider
- bucket/path
- resolved URL
- retrieval status if tested
- rendered yes/no
- failure reason

### 8. No mutation boundary

No DB row changes.

No frontend changes.

No resolver changes.

This is diagnostic only.

Any required fix must be routed through a follow-up OAR2.

## CODY ROLE

Cody may:

- inspect runtime query paths
- inspect renderer media-slot logic
- run read-only DB validation queries
- test generated media URLs
- produce diagnostic evidence
- write OAR1 closeout

Cody may not:

- mutate DB rows
- create media mappings
- hardcode media paths
- alter frontend resolver behavior
- bypass release/access logic
- invent fallback media

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. active failing surface identified
2. requested media keys identified
3. DB media query path documented
4. returned media rows documented
5. resolver output documented for Supabase and Cloudflare/R2
6. L2 animated media status documented
7. still image status documented
8. exact failure seam identified
9. no mutation performed

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_diagnose_measures_media_runtime_resolution_v1.meta.md

## CLOSE

Do not move more media.

Find the failed seam.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
