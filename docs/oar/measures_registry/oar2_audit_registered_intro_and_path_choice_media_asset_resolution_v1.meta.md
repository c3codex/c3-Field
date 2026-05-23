---
document_type: oar2
authority_level: working
document_scope: measures_registry_media_resolution
title: OAR2 — Audit Registered Intro and Path Choice Media Asset Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
  - docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - media-resolution
  - intro
  - path-choice
  - registered-runtime
  - codex-first
---

# OAR2 — Audit Registered Intro and Path Choice Media Asset Resolution

## OBSERVED

Local runtime review confirms the registered runtime now loads and routes farther than before.

However, the first two registered surfaces still do not appear to be loading media correctly:

1. `ai_isnt_broken_intro`
2. `evaluate_structure_path`

The prior activation OAR corrected public route exposure and anon readability for all 13 encounters, but did not verify or seat intro/path-choice video assets.

Likely seam:

- intro video asset may still be mapped under legacy `landing_root`
- path-choice visual/video assets may still be mapped under legacy `landing_path_choice`
- media role names may not match what the registered renderers consume
- asset URLs may be missing, inactive, inaccessible, or not anon-readable
- renderer may still expect legacy media keys
- R2/Supabase asset mapping may not be aligned to registered encounter keys

## ALIGNED

This is a media resolution audit only.

Do not patch blindly.

Do not redesign surfaces.

Do not edit CSS.

Do not hardcode media URLs in frontend.

Do not create duplicate media authority.

The goal is to determine whether media failure is caused by:

- missing DB media mapping
- legacy encounter-key mapping
- wrong media role names
- storage access issue
- renderer consumption mismatch
- inactive media record
- stale frontend fallback
- asset path/provider mismatch

Frontend must render seated media authority only.

## ROUTED

### 1. Inspect registered intro media contract

Audit `ai_isnt_broken_intro` for:

- metadata.media_roles
- metadata.media_contract if present
- actions/media references
- renderer assignment
- expected media role names consumed by `epigraph_split_hero`
- current media URL resolution path
- legacy mapping from `landing_root`
- storage provider and bucket/path if present
- anon/public accessibility

Determine whether intro video/media is:

- seated under registered key
- still only seated under legacy key
- missing entirely
- present but not consumed
- blocked by access/storage
- malformed provider/path

### 2. Inspect registered path-choice media contract

Audit `evaluate_structure_path` for:

- metadata.media_roles
- plaque media references
- split-path visual/video references
- renderer assignment
- expected media role names consumed by `measures_registry_path_choice`
- current media URL resolution path
- legacy mapping from `landing_path_choice`
- storage provider and bucket/path if present
- anon/public accessibility

Determine whether path-choice media is:

- seated under registered key
- still only seated under legacy key
- missing entirely
- present but not consumed
- blocked by access/storage
- malformed provider/path

### 3. Compare legacy and registered media mappings

Compare media state between:

- `landing_root` → `ai_isnt_broken_intro`
- `landing_path_choice` → `evaluate_structure_path`

Report whether media mappings, roles, or metadata were preserved during rename/reconciliation.

If legacy media is still correct and registered media is missing, recommend bounded remap rather than frontend hardcode.

### 4. Inspect media authority tables/patterns

Inspect the current media authority pattern used by Measures Registry runtime.

Check for relevant surfaces in:

- `measures_encounter_def.metadata.media_roles`
- `measures_media_map` if present/used
- any current storage mapping table used by runtime
- R2/Supabase provider fields used by `mediaUrl()`

Report which table/metadata surface is the actual runtime authority.

Do not invent a new media authority surface.

### 5. Inspect frontend consumption path

Inspect `src/measures_registry/MeasuresRegistryRuntime.tsx` for:

- media role names consumed by intro renderer
- media role names consumed by path-choice renderer
- fallback behavior
- legacy key fallback behavior
- whether registered keys are queried before legacy keys
- whether media lookup is bound to `sectionMap`
- whether asset absence is hidden, ignored, or rendered as blank

### 6. Validate asset accessibility

For any resolved media URL/path:

- confirm provider
- confirm bucket/path
- confirm public/anon accessibility where applicable
- confirm file type matches renderer expectation
- confirm no large media is incorrectly expected from Supabase if current governance requires R2

### 7. Return correction recommendation

Return one of:

- DB media remap required
- metadata role correction required
- frontend media consumption correction required
- storage/public access correction required
- asset missing and must be uploaded/seated
- no media issue found; visual problem is renderer/layout

## DO NOT

- edit frontend
- edit CSS
- hardcode video paths
- upload media
- change storage providers
- duplicate media records
- alter route sequence
- alter encounter contracts
- activate/deactivate unrelated rows
- patch visual styling

## VALIDATION

Return:

- DB tables/metadata inspected
- intro media standing
- path-choice media standing
- legacy vs registered media comparison
- renderer media role expectations
- resolved URLs/paths if available
- accessibility result
- exact correction needed
- recommended next OAR2

## SUCCESS CONDITION

The source of intro/path-choice media failure is identified.

The system knows whether to correct DB media mapping, metadata role names, storage access, or frontend media consumption.

No media authority is invented or duplicated.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_audit_registered_intro_and_path_choice_media_asset_resolution_v1.meta.md`

## CLOSE

Audit media authority before correction.

No hardcoded assets.
