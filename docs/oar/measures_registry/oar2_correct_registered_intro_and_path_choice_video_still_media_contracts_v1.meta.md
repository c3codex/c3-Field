---
document_type: oar2
authority_level: working
document_scope: measures_registry_media_contracts
title: OAR2 — Correct Registered Intro and Path Choice Video-Still Media Contracts
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_audit_registered_intro_and_path_choice_media_asset_resolution_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - media-contracts
  - video-still
  - intro
  - path-choice
  - registered-runtime
  - codex-first
---

# OAR2 — Correct Registered Intro and Path Choice Video-Still Media Contracts

## OBSERVED

The registered runtime is active and browser-routable, but the first two registered surfaces still do not load their intended media correctly:

1. `ai_isnt_broken_intro`
2. `evaluate_structure_path`

The prior media audit confirmed:

- runtime media authority is `measures_media_map`
- media resolves by `campaign_key + media_role`, not by `encounter_key`
- frontend media role consumption is structurally valid
- no frontend hardcoded media path is required
- two old Supabase rows are held because their storage paths return HTTP 400:
  - `hero_fracture_measure.webp`
  - `more_vs_coherence_path.webp`
- local R2 video rendering requires `VITE_R2_PUBLIC_BASE_URL`

Operator has clarified that the intended first-page media pattern is a classic video-to-still setup.

Known intended assets:

### R2 motion assets

- `integrity_governance_intro`
- `left_hero_fracture_motion.mp4`
- `right_hero_measures_motion`
- `measures_structured_enviroments`

### Supabase still assets

- `left_measures_hero.webp`
- `right_measures_hero.webp`

The current issue is likely not just missing media. It is likely that the first two page media contracts are pre-registered-runtime and do not clearly declare the intended video/still fallback structure.

## ALIGNED

This OAR2 corrects media contract structure and media mapping for the two registered entry surfaces.

Do not patch blindly.

Do not hardcode media paths in frontend.

Do not duplicate media authority.

Do not revive held 400 rows unless their paths are corrected and verified.

Do not redesign surfaces.

Do not edit CSS.

Frontend must render seated media authority only.

## ROUTED

### 1. Verify current media authority and runtime expectations

Confirm:

- `measures_media_map` remains the active runtime media authority
- runtime resolves by `campaign_key + media_role`
- `ai_isnt_broken_intro` renderer expectations for:
  - primary video
  - still fallback
  - hero/threshold stills
- `evaluate_structure_path` renderer expectations for:
  - left motion asset
  - right motion asset
  - left still fallback
  - right still fallback
  - optional background asset if still contract-required

Report exact role names consumed by `MeasuresRegistryRuntime.tsx`.

### 2. Correct media contract for ai_isnt_broken_intro

Target encounter:

    ai_isnt_broken_intro

Expected renderer:

    epigraph_split_hero

Seat or correct media contract so the surface supports:

- primary motion/video asset
- still fallback behavior
- no dependency on missing `hero_fracture_measure.webp` unless a valid replacement path is confirmed

Intended motion asset:

    integrity_governance_intro

Determine whether this should map to existing role:

- `hero_video`
- `epigraph_video`
- or another already-consumed role

Use the role actually consumed by the renderer.

Do not invent a new role if an existing consumed role already expresses the contract.

### 3. Correct media contract for evaluate_structure_path

Target encounter:

    evaluate_structure_path

Expected renderer:

    measures_registry_path_choice

Seat or correct media contract so the surface supports:

- left path motion asset
- right path motion asset
- left still fallback
- right still fallback

Intended motion assets:

- `left_hero_fracture_motion.mp4`
- `right_hero_measures_motion`

Intended Supabase still assets:

- `left_measures_hero.webp`
- `right_measures_hero.webp`

Determine the exact runtime-consumed media roles for these assets.

Do not force both still assets into a single `path_choice_background` role unless the renderer actually requires one combined background.

If `path_choice_background` is obsolete under the video/still contract, leave it held or mark it superseded rather than reviving a bad 400 row.

### 4. Verify Supabase still asset paths

Verify HTTP/public access for:

- `left_measures_hero.webp`
- `right_measures_hero.webp`

Confirm:

- storage bucket
- storage path
- HTTP 200
- mime type
- anon readability if needed

If the files exist under a subfolder, use the actual verified path.

### 5. Verify R2 motion asset path requirements

Verify current `measures_media_map` rows for:

- `integrity_governance_intro`
- `left_hero_fracture_motion.mp4`
- `right_hero_measures_motion`
- `measures_structured_enviroments`

Confirm:

- storage_bucket = measures-media or correct R2 bucket
- storage_path
- mime type
- media_role
- is_active
- `VITE_R2_PUBLIC_BASE_URL` requirement for local and production

Do not upload or move R2 files in this OAR2 unless already available through current mapping and only metadata correction is needed.

### 6. Correct measures_media_map rows if bounded and verified

Allowed DB corrections:

- update incorrect `storage_path`
- update incorrect `media_role` only if required to match renderer consumption
- activate corrected rows after HTTP 200/access verification
- keep held rows held if their assets remain missing
- add superseded/hold metadata for obsolete rows if needed

Do not create duplicate active rows for the same `campaign_key + media_role` unless current runtime supports ordered alternates and that behavior is verified.

### 7. Correct encounter metadata media contracts if required

If `measures_encounter_def.metadata.media_roles` or media contracts are missing or pre-contract, patch only the two target encounters:

- `ai_isnt_broken_intro`
- `evaluate_structure_path`

Ensure metadata declares:

- video primary role
- still fallback role
- left/right path roles where applicable
- source media authority = `measures_media_map`
- no frontend hardcode allowed

### 8. Validate

Return:

- media roles expected by renderer
- media rows corrected
- held rows preserved or superseded
- Supabase still asset HTTP status
- R2 motion asset standing
- active media readback for required roles
- anon readback where applicable
- local env requirement for `VITE_R2_PUBLIC_BASE_URL`
- confirmation no frontend files modified
- confirmation no CSS edits
- confirmation no duplicate media authority created

## DO NOT

- edit frontend code
- edit CSS
- hardcode media paths
- invent new media authority
- duplicate active rows unnecessarily
- revive held 400 rows without verified corrected paths
- alter route sequence
- alter encounter contracts outside media roles/contracts
- change unrelated media
- expose payment logic
- implement email dispatch

## SUCCESS CONDITION

`ai_isnt_broken_intro` and `evaluate_structure_path` have corrected registered video-still media contracts and media mappings.

Supabase still fallbacks resolve.

R2 motion assets are correctly mapped and documented for local/prod env resolution.

The first two registered pages are ready for visual QA without frontend-owned media truth.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_correct_registered_intro_and_path_choice_video_still_media_contracts_v1.meta.md`

## CLOSE

Correct the media contract.

Do not patch the renderer.
