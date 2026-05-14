---
document_type: process_seed
authority_level: working
document_scope: conversion_engine_media_authority
title: Conversion Engine Media Authority Seed
status: proposed
version: v1
operator: op044
system: process
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
source_oar2:
  - oar2_institutional_media_bucket_governance_and_runtime_authority_v1
---

# Conversion Engine Media Authority Seed

## Purpose

Seed the media conversion engine that turns source media inventory into governed runtime authority.

The conversion engine does not make bucket inventory authoritative.

The conversion engine prepares, validates, seats, and proves media authority through OAR-governed process.

## Core Rule

Conversion is complete only when runtime authority is seated and proven.

Upload alone is not conversion.

Bucket presence alone is not conversion.

DB row presence alone is not conversion.

## Conversion Flow

### 1. Intake Manifest

The conversion engine receives or produces an intake manifest with:

- source object path
- source provider
- expected media type
- target surface key
- intended runtime role
- expected render behavior
- operator notes
- source standing when known

### 2. Source Standing Classification

Before mutation, classify source standing:

- `verified`
- `missing_source`
- `retrieval_failed`
- `ambiguous_duplicate`
- `operator_confirmed_replacement`
- `held_pending_source`

Unverified or ambiguous media remains held until resolved by operator or OAR2.

### 3. Provider / Bucket Target Selection

Select target storage according to institutional bucket governance:

- Supabase for webp images and lightweight still assets.
- R2 for video, audio, large motion assets, downloads, and long-form media.

Provider selection must be recorded in evidence.

### 4. Object Key Normalization

Normalize or confirm object keys before seating:

- no leading/trailing whitespace
- lowercase extensions preferred
- stable naming
- exact DB path matches exact bucket key
- spaces require explicit encoded retrieval proof

### 5. Source Retrieval Proof

Before seating as active runtime authority, verify retrieval:

- resolved public URL
- HTTP status
- content type
- content length
- last modified timestamp when available
- provider
- bucket
- storage path

### 6. Governed Asset Row Seating

Seat or update `codex_media_asset` with:

- stable media key
- title
- media type
- storage provider
- bucket
- storage path
- status
- asset metadata
- `frontend_hardcode_allowed: false`

### 7. Surface Mapping Seating

Seat or update `measures_surface_media_map` with:

- surface key
- media key
- role
- sequence index
- status
- map metadata
- render behavior where needed

The surface map is the runtime relation authority.

### 8. Role / Render Contract Validation

Validate the intended role and render behavior.

Examples:

- `featured_video` with `muted_autoplay`
- `featured_video` with `loop_muted`
- `featured_animation` with `autoplay_after_passage`
- `oracle_card` as settled still
- `original_artwork` as aspect image
- `full_song` as Knew Album audio aspect
- `material_tone` as material tone audio aspect
- `audio` as tonal companion or installation tone

### 9. Runtime Selection Validation

Validate that runtime selects governed media:

- correct surface key
- correct media key
- correct primary media
- correct support media
- correct aspect media
- fallback not acting as authority
- renderer behavior matches role

### 10. Deployment Validation

When the conversion affects public runtime, validate:

- local build result
- pushed commit
- deployed bundle identity
- deployed media retrieval
- live user-facing behavior

Runtime-valid is not live-valid until deployment proof exists.

### 11. Held-State Routing

If conversion cannot complete, route to held standing with explicit reason:

- missing source
- retrieval failure
- ambiguous duplicate
- operator decision needed
- role/render contract unresolved
- deployment validation failed

Held state is valid when truth is not yet seated.

Fake continuity is not valid.

## Output Artifacts

The conversion engine should produce:

- execution evidence JSON
- OAR1 closeout
- media authority summary
- unresolved/held report when applicable
- deployment proof when applicable

## Automation Standing

The conversion engine may:

- inspect manifests
- classify standing
- recommend provider/bucket targets
- generate migration plans
- verify retrieval
- produce evidence

The conversion engine may not:

- mutate governed DB rows without OAR2
- treat bucket inventory as authority
- invent source objects
- bypass operator-held decisions
- create frontend hardcoded media shortcuts

## Close

Conversion seats authority.

Authority proves runtime.

Runtime proves live standing.

Unresolved media remains held.
