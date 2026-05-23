---
document_type: oar2
authority_level: working
document_scope: measures_registry_media_contracts
title: OAR2 — Restore Epigraph Video Mapping and Rehold Dead Hero Video Role
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_correct_registered_intro_and_path_choice_video_still_media_contracts_v1.meta.md
  - docs/oar/measures_registry/oar1_audit_registered_intro_and_path_choice_media_asset_resolution_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - media-contracts
  - epigraph-video
  - correction
  - registered-runtime
  - codex-first
---

# OAR2 — Restore Epigraph Video Mapping and Rehold Dead Hero Video Role

## OBSERVED

The prior media contract correction identified that `hero_video` is a dead renderer role and that `epigraph_video` is the role actually consumed by the intro video player.

However, the prior correction mapped the wrong asset into `epigraph_video`.

Operator correction:

    registry_epigraph_fracture_to_alignment_15s.mp4

is the correct asset for:

    epigraph_video

and should be used by:

    ai_isnt_broken_intro

The asset:

    integrity_governance_intro.mp4

should not replace the epigraph video unless a future renderer contract explicitly seats it.

## ALIGNED

This is a bounded media mapping correction.

No frontend edits.

No CSS edits.

No route changes.

No renderer changes.

No duplicate media authority.

No media upload.

Do not reactivate dead roles unless renderer consumption is confirmed.

The correction must preserve the registered runtime and seated media contract discipline.

## ROUTED

### 1. Restore epigraph_video mapping

Update the active `measures_media_map` row for:

    campaign_key: agents_of_chaos_integrity_governance
    media_role: epigraph_video

Set:

    storage_bucket: measures-media
    storage_path: registry_epigraph_fracture_to_alignment_15s.mp4
    is_active: true

Preserve existing provider/bucket assumptions unless validation proves mismatch.

### 2. Preserve hero_video as inactive/dead role

Confirm:

    media_role: hero_video

remains inactive if `MeasuresRegistryRuntime.tsx` still computes but does not render `heroVideoUrl`.

Do not reactivate `hero_video`.

Do not map `integrity_governance_intro.mp4` into an active consumed role unless a future OAR2 seats a valid renderer use.

Add or preserve metadata explaining:

- `hero_video` is currently unconsumed by renderer
- `heroVideoUrl` is computed but not rendered
- role must remain inactive until renderer support is seated

### 3. Correct ai_isnt_broken_intro media contract metadata

Patch only if needed.

Ensure `ai_isnt_broken_intro.metadata.media_contract` declares:

    video_primary_role: epigraph_video
    video_primary_asset: registry_epigraph_fracture_to_alignment_15s.mp4
    video_primary_bucket: measures-media

If prior metadata currently names `integrity_governance_intro.mp4` as primary video asset, correct it.

Preserve all other valid declared roles:

- left_hero_fracture
- left_hero_fracture_motion
- right_measured_hero
- measured_hero_motion_graphic
- hero_image held status if still absent

### 4. Document integrity_governance_intro standing

Document current standing for:

    integrity_governance_intro.mp4

Return whether it is:

- stored in R2
- still present in any inactive row
- unmapped
- mapped only to inactive `hero_video`
- candidate for future renderer role

Do not delete it.

Do not activate it.

### 5. Validate R2 environment requirement

Confirm local runtime still requires:

    VITE_R2_PUBLIC_BASE_URL

for `measures-media` assets to resolve.

Confirm production Cloudflare Pages must have the same variable configured.

Do not change env files unless explicitly authorized.

### 6. Validation required

Return:

- DB table updated
- rows updated
- before/after for `epigraph_video`
- before/after for `hero_video`
- `ai_isnt_broken_intro` media contract readback
- confirmation `epigraph_video` points to `registry_epigraph_fracture_to_alignment_15s.mp4`
- confirmation `hero_video` remains inactive
- confirmation no frontend files modified
- confirmation no CSS files modified
- confirmation no route changes
- confirmation `integrity_governance_intro.mp4` is not active in a consumed role

## DO NOT

- edit frontend
- edit CSS
- hardcode media paths
- create new media authority
- duplicate active media roles
- reactivate `hero_video`
- delete `integrity_governance_intro.mp4`
- alter path choice renderer
- alter route sequence
- alter encounter contracts beyond corrected media metadata

## SUCCESS CONDITION

The intro epigraph video is restored to the correct R2 asset:

    registry_epigraph_fracture_to_alignment_15s.mp4

The dead `hero_video` role remains inactive.

`ai_isnt_broken_intro` media metadata reflects the corrected primary video asset.

No frontend-owned media truth is introduced.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_restore_epigraph_video_mapping_and_rehold_dead_hero_video_role_v1.meta.md`

## CLOSE

Restore the epigraph video.

Keep dead roles held.
