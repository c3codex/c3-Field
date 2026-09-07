---
document_type: oar2
authority_level: working
document_scope: runtime_alignment_repair
title: OAR2 — Repair Root Authority Media Query and Remove Stale Crystal Chamber Runtime Dependency
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: repair_root_authority_media_query_and_remove_stale_crystal_chamber_runtime_dependency
source_oar1:
  - docs/oar/measures_registry/oar1_live_deployment_and_seat_verification_v1.meta.md
---

# OAR2 — Repair Root Authority Media Query and Remove Stale Crystal Chamber Runtime Dependency v1

## OBSERVED

Live deployment verification returned HELD.

Root authority media records are seated and active in Codex but are excluded from the deployed runtime media query.

Current runtime query still requests stale campaign authority:

- measures_registry_crystal_chamber

Current runtime query does not request:

- measures_registry_root_authority_v1

Consequences observed:

- intro_hook_video cannot resolve from seated authority
- about_measures_registry_video cannot resolve
- official_codexstone_seal cannot resolve
- agents_with_keys_cover cannot resolve
- fables_and_myths_cover cannot resolve
- renderer falls back to epigraph_video authority

Additionally:

Facebook is seated as:

- url: null
- standing: held_not_in_launch_scope

but public rendering still exposes a held glyph instead of remaining absent.

## ALIGNED

Repair renderer alignment only.

No DB mutation.

No content mutation.

No MAP mutation.

No payment mutation.

No social campaign mutation.

No publication mutation.

No route mutation.

No release-state mutation.

Codex remains authority.

Runtime must render seated authority only.

No fallback authority behavior.

## ROUTED

### 1. Remove stale Crystal Chamber runtime dependency

Audit runtime media queries.

Locate all active references to:

- measures_registry_crystal_chamber

Determine whether reference is:

- active runtime dependency
- deprecated compatibility branch
- dead code

Remove active runtime dependency.

Do not use Crystal Chamber as active authority source.

Retain only as historical/deprecated reference if required for traceability.

### 2. Seat root authority campaign into runtime query

Ensure runtime requests:

- measures_registry_root_authority_v1

Required seated media:

- intro_hook_video
- about_measures_registry_video
- official_codexstone_seal
- agents_with_keys_cover
- fables_and_myths_cover

Confirm records enter runtime media map.

Confirm no fallback authority path executes when seated media exists.

### 3. Remove fallback authority behavior

Current fallback:

- epigraph_video

must not become authority when seated root-authority media exists.

Renderer behavior:

- seated media -> render
- missing media -> missing state
- no authority substitution

Confirm root-authority media resolves directly from registry state.

### 4. Public social rendering correction

Current standing:

Facebook:
- url: null
- launch_scope: inactive

Renderer must omit null-url social rows from public display.

Required result:

- X visible
- Instagram visible
- LinkedIn visible
- Facebook absent

No placeholder glyph.

No held indicator.

No public representation.

### 5. Redeploy

Deploy repaired runtime.

Record deployment identifier.

### 6. Verification

Verify:

Root Authority:
- intro hook resolves
- path choice resolves

Right Path:
- about_measures_registry_video resolves
- official_codexstone_seal resolves

Undrifted:
- agents_with_keys_cover resolves if seated
- fables_and_myths_cover resolves if seated
- Facebook absent
- X active
- Instagram active
- LinkedIn active

Confirm:

- no stale crystal chamber runtime authority
- no fallback authority execution
- no DB mutation
- no MAP/payment mutation

## VALIDATION

Return:

- stale references found
- stale references removed
- runtime query before/after
- media records resolved
- deployment identifier
- verification evidence
- final SEAT standing

## EXPECTED OAR1

docs/oar/measures_registry/oar1_repair_root_authority_media_query_and_remove_stale_crystal_chamber_runtime_dependency_v1.meta.md

## CLOSE

SEAT may only move from HELD to VERIFIED when root-authority media resolves from seated registry authority and public rendering no longer exposes inactive social rows.
