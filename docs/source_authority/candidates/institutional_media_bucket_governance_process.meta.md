---
document_type: process_seed
authority_level: working
document_scope: institutional_media_bucket_governance
title: Institutional Media Bucket Governance Process
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

# Institutional Media Bucket Governance Process

## Purpose

Define institutional media bucket governance for c3 Field runtime systems.

This process prevents infrastructure from becoming authority.

Buckets deliver media.

Governed mappings seat runtime truth.

## Authority Chain

Canonical media runtime authority resolves through:

```text
Codex
-> Field relation
-> Measures registry standing
-> measures_surface_media_map
-> codex_media_asset
-> bucket object delivery
-> runtime render validation
```

The bucket is never the first authority.

The bucket is the delivery layer after authority is seated.

## Bucket Roles

Supabase buckets primarily carry:

- webp images
- optimized stills
- lightweight runtime presentation assets
- governed encounter stills

Cloudflare R2 primarily carries:

- video
- audio
- large motion assets
- long-form media
- downloadable media
- large encounter media bodies

## Governed Mapping Rule

Runtime media selection must resolve from governed DB state.

The surface map seats:

- surface key
- media key relation
- runtime role
- sequence index
- map-level metadata
- active/inactive standing

The media asset seats:

- media key
- media type
- storage provider
- bucket
- storage path
- public URL override when explicitly governed
- asset-level metadata
- active/inactive standing

## Fallback Boundary

Fallback media may exist operationally.

Fallback media may not supersede governed media authority.

Fallback media may supplement only when explicitly governed as temporary support.

Released public surfaces should not depend on fallback media.

Any fallback use must be reported as drift with:

- source table
- surface key
- media type
- reason fallback was invoked
- removal or conversion target

## Object Key Standard

Object keys must be treated as exact runtime contracts.

Rules:

- DB path must match bucket key exactly.
- No leading or trailing whitespace.
- Lowercase extensions are preferred.
- Spaces require explicit confirmation and encoded retrieval proof.
- Replacement objects require DB authority update.
- Stale keys must be recorded as stale, removed, or held for cleanup.

## Required Retrieval Proof

Retrieval proof should record:

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

## Required Runtime Proof

Runtime proof should record:

- selected primary media
- selected support media
- role/render behavior
- fallback standing
- local render behavior
- deployed bundle identity when applicable
- live media retrieval when applicable
- live user-facing standing when applicable

## Mutation Rule

Any media authority mutation requires OAR2.

Any mutation must produce OAR1 closeout.

No DB media mutation should proceed from thread instruction alone.

## Failure Classes

Every media failure should be classified as one of:

- `missing_source`
- `retrieval_failed`
- `missing_asset_row`
- `missing_surface_mapping`
- `wrong_provider_bucket_path`
- `role_render_contract_drift`
- `fallback_override_drift`
- `deployed_bundle_drift`
- `live_runtime_mismatch`
- `ambiguous_duplicate`
- `held_pending_source`

## Success Condition

A media surface is valid only when:

- Codex-held media authority exists.
- Field relation is intact.
- Measures mapping is active.
- Runtime selects governed media.
- Retrieval proof succeeds.
- Render behavior matches role contract.
- Fallback does not act as authority.
- Live deployment is verified where applicable.

## Close

Buckets deliver.

Mappings govern.

Runtime renders only governed authority.

Infrastructure is not truth.
