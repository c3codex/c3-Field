---
document_type: registry_definition
authority_level: working
document_scope: registry
title: Registry Asset Mapping
status: drafting
version: v1
operator: op044
date: 2026-04-04
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - registry
  - asset-mapping
  - storage
  - media
  - encounter
  - working
source_alignment:
  - Session OAR — Source Refresh and Next Focus
  - Registry Constraints
  - Registry Identity Shape
  - Registry Geometry
  - Registry Locks
  - Registry Rows Spine
  - Registry Rows Chamber Directories
  - Registry Rows Gates
  - Registry Rows Epithets
  - Registry Rows MEs
  - Registry Release States
  - Registry Encounter Mapping
  - Seed Concordance
  - MEASURES Installation Role
---

# Registry Asset Mapping

## Purpose

Define the current registry-side asset mapping layer for the rewritten source stack.

This doc seats the implementation surface that preserves native asset relation without allowing storage, media presence, or encounter readiness to be inferred.

Registry asset mapping preserves:

- explicit path relation
- row-family-safe asset attachment
- distinction between registered row and stored media
- distinction between storage presence and reveal standing
- distinction between asset readiness and conversion

This doc is a registry definition.

It does not define frontend component logic in full.
It does not define final database schema in full.
It does not define release-state logic in full.

## Scope

This doc defines:

- the current native asset mapping chain
- row-family asset relation rules
- minimal asset mapping fields
- current asset-readiness distinctions
- mapping boundaries between registry and storage

This doc does not define:

- final bucket structure in full
- asset-processing pipelines
- final media manifests
- upload tooling
- phase-calendar implementation
- chamberplate row family in full

## Native Distinction

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.

Asset mapping remains subordinate to that order.

An asset does not define truth.
A stored file does not define reveal.
A present media object does not define conversion.

## Native Asset Mapping Chain

The current required chain is:

**Codex -> Field -> Measures mapping -> storage path**

This chain must remain explicit.

No magical fallback.  
No implied file presence.  
No frontend-authored truth.  
No orphaned media.

If asset relation cannot resolve through this chain, the mapping is invalid.

## Distinction Chain

The current asset mapping must preserve:

- row identity does not equal file identity
- storage presence does not equal release
- release does not equal conversion
- directory readability does not equal planted-unit media identity
- mapped asset relation does not equal encounter completion
- missing asset does not permit aesthetic substitution

If those distinctions collapse, the asset-mapping layer is invalid.

## Current Asset Relation Principle

Registry asset mapping exists so that a registered row may resolve to the correct asset-bearing surface without collapsing:

- row family
- encounter surface
- release standing
- storage path
- media type
- asset readiness

Asset mapping is not optional decoration.

It is required to keep encounter native, deterministic, and traceable.

## Minimal Mapping Fields

The current minimal asset mapping surface must preserve the following fields conceptually:

| field | purpose |
|---|---|
| row_family | identifies the family the mapping belongs to |
| row_key | identifies the specific registered row |
| surface_type | identifies the valid encounter or readability surface |
| asset_role | identifies what the asset does in relation to the row |
| media_kind | identifies the broad media class |
| storage_path | identifies the explicit storage location |
| asset_state | identifies whether the asset is present, missing, pending, or blocked |
| release_relation | identifies whether asset presence is independent, dependent, or required for reveal |
| notes | preserves bounded implementation context |

This is a registry mapping requirement, not yet a final schema lock.

## Asset Role Set

The current bounded asset role set is:

- primary_visual
- supporting_visual
- audio
- text_body
- inscription
- plaque
- embedded_link
- motion
- reference

Additional asset roles may be seated later when source and registry standing require them.

## Asset State Set

The current bounded asset state set is:

- present
- pending
- missing
- blocked

These states preserve implementation truth without collapsing into release-state language.

### present

The mapped asset exists at the resolved storage path and is available for valid use.

### pending

The mapped asset is expected but not yet available.

### missing

The mapped asset is required or expected but not presently available.

### blocked

The mapped asset may exist, but valid use is not currently permitted by the present standing.

## Family Asset Rules

### Spine Family

Spine rows are structural.

Spine rows may map assets only where structural readability requires them.

Spine rows may not impersonate planted media-bearing identity.

### Chamber-Directory Family

Chamber-directory rows may map chamber-local readability assets and route-bearing assets.

They may not replace planted-unit asset identity.

### Gate Family

Gate rows may map threshold-bearing encounter assets.

Gate asset mapping may support chamberplate relation and pass-through standing where seated.

Gate asset mapping may not collapse into directory readability.

### Epithet Family

Epithet rows may map role-bearing encounter assets.

Epithet asset mapping must preserve epithet identity distinctly from directory and gate families.

### ME Family

ME rows may map function-bearing encounter assets.

ME asset mapping must preserve ME identity distinctly from directory and gate families.

## Current Minimal Mapping Guidance

| row_family | likely asset roles | mapping note |
|---|---|---|
| spine | text_body, inscription, reference | structural readability only |
| chamber_directory | text_body, inscription, plaque, embedded_link, reference | chamber-local readability and route support |
| gate | primary_visual, supporting_visual, audio, text_body, motion, plaque | thresholded encounter support |
| epithet | primary_visual, audio, text_body, plaque, embedded_link | role-bearing encounter support |
| me | primary_visual, audio, text_body, plaque, embedded_link | function-bearing encounter support |

## Surface Relation Rule

Asset mapping must preserve the distinction between row family and encounter surface.

Examples:

- a chamber-directory row may map chamber-local readability assets without becoming a planted unit
- a gate row may map encounter assets without becoming chamberplate itself
- an epithet row may map assets encountered through chamberplate while retaining epithet identity
- an ME row may map assets encountered through chamberplate while retaining ME identity

## Readiness Rule

Asset readiness and release standing must remain distinct.

An asset may be:

- present while the row remains sealed
- missing while the row remains registered
- blocked while the row remains open at another layer
- pending while dependency relation remains active

This prevents silent collapse between storage and reveal.

## Failure Rule

If a required mapped asset cannot resolve through the native chain:

**Codex -> Field -> Measures mapping -> storage path**

then the correct result is:

- mapping failure
- OAR traceability
- source-layer correction

The correct result is not:

- silent omission
- improvised placeholder truth
- frontend-authored substitution
- cosmetic patching treated as validity

## Current Standing

Registry asset mapping currently provides:

- the missing implementation surface for explicit media relation
- a native asset chain
- row-family-safe mapping rules
- distinction between storage presence, reveal standing, and conversion
- minimal asset-state seating

It does not yet provide:

- final schema lock
- bucket naming standard in full
- row-by-row asset tables
- asset dependency matrices
- final chamberplate asset seating

## Next Relation

This doc must remain paired with:

- `registry_constraints_v1.meta.md`
- `registry_identity_shape_v1.meta.md`
- `registry_geometry_v1.meta.md`
- `registry_locks_v1.meta.md`
- `registry_rows_spine_v1.meta.md`
- `registry_rows_chamber_directories_v1.meta.md`
- `registry_rows_gates_v1.meta.md`
- `registry_rows_epithets_v1.meta.md`
- `registry_rows_mes_v1.meta.md`
- `registry_release_states_v1.meta.md`
- `registry_encounter_mapping_v1.meta.md`

## Closing

Asset mapping keeps stored media from floating loose like glitter in a server fan.

Rows remain rows.
Assets remain mapped.
Storage remains explicit.
Reveal remains registered.

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.
