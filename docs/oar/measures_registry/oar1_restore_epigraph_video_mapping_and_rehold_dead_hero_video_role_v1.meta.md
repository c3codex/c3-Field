---
document_type: oar1
authority_level: working
document_scope: measures_registry_media_contracts
title: OAR1 — Restore Epigraph Video Mapping and Rehold Dead Hero Video Role
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_restore_epigraph_video_mapping_and_rehold_dead_hero_video_role_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - media-contracts
  - epigraph-video
  - correction
  - registered-runtime
  - codex-first
---

# OAR1 — Restore Epigraph Video Mapping and Rehold Dead Hero Video Role

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_restore_epigraph_video_mapping_and_rehold_dead_hero_video_role_v1.meta.md`

Restore `epigraph_video` to `registry_epigraph_fracture_to_alignment_15s.mp4`. Confirm `hero_video` inactive. Correct `ai_isnt_broken_intro` media contract metadata. No frontend edits. No CSS edits. No route changes.

---

## CONTEXT

The prior OAR2 (`oar2_correct_registered_intro_and_path_choice_video_still_media_contracts_v1`) incorrectly placed `integrity_governance_intro.mp4` into the `epigraph_video` role. The operator-declared correct asset for `epigraph_video` is `registry_epigraph_fracture_to_alignment_15s.mp4`. This OAR2 restores the correct mapping.

---

## CORRECTIONS APPLIED

### Correction 1 — `epigraph_video` storage_path restored

| Field | Before | After |
|---|---|---|
| `storage_path` | `integrity_governance_intro.mp4` | `registry_epigraph_fracture_to_alignment_15s.mp4` |
| `is_active` | true | true (unchanged) |
| `storage_bucket` | `measures-media` | `measures-media` (unchanged) |

`registry_epigraph_fracture_to_alignment_15s.mp4` is the operator-declared correct asset for the `epigraph_video` role consumed by `epigraphVideoUrl` in the intro renderer.

### Correction 2 — `hero_video` confirmed inactive

| Field | Before | After |
|---|---|---|
| `storage_path` | `integrity_governance_intro.mp4` | `integrity_governance_intro.mp4` (unchanged) |
| `is_active` | false | false (confirmed) |

`hero_video` remains inactive. `heroVideoUrl` is computed in `MeasuresRegistryRuntime.tsx` but is never rendered in any renderer branch. The role must remain inactive until a future OAR2 seats renderer support.

`integrity_governance_intro.mp4` is retained in this row for traceability. It is stored in R2 (`measures-media` bucket) and is a candidate for future renderer role seating. It is not currently mapped to any active consumed role.

### Correction 3 — `ai_isnt_broken_intro` media contract corrected

| Field | Before | After |
|---|---|---|
| `media_contract.video_primary_asset` | `integrity_governance_intro.mp4` | `registry_epigraph_fracture_to_alignment_15s.mp4` |
| `media_contract.video_primary_role` | `epigraph_video` | `epigraph_video` (unchanged) |
| `media_contract.video_primary_bucket` | `measures-media` | `measures-media` (unchanged) |

All other declared roles preserved intact:

```json
[
  "epigraph_video",
  "hero_image",
  "left_hero_fracture",
  "left_hero_fracture_motion",
  "right_measured_hero",
  "measured_hero_motion_graphic"
]
```

---

## READBACK

| Check | Value |
|---|---|
| `epigraph_video.storage_path` | `registry_epigraph_fracture_to_alignment_15s.mp4` ✓ |
| `epigraph_video.is_active` | true ✓ |
| `epigraph_video.storage_bucket` | `measures-media` ✓ |
| `hero_video.is_active` | false ✓ |
| `hero_video.storage_path` | `integrity_governance_intro.mp4` (retained, inactive) |
| `ai_isnt_broken_intro` `video_primary_asset` | `registry_epigraph_fracture_to_alignment_15s.mp4` ✓ |
| `integrity_governance_intro.mp4` in active consumed role | false ✓ |

---

## `integrity_governance_intro.mp4` — STANDING

| Field | Value |
|---|---|
| R2 storage | `measures-media` bucket |
| Current DB row | `hero_video` (inactive) |
| Renderer consumption | None — `heroVideoUrl` computed but not rendered |
| Active consumed role | None |
| Status | Unmapped / inactive — candidate for future renderer role seating |

---

## DB STATE CHANGES

| Table | Operation | Rows |
|---|---|---|
| `measures_media_map` | UPDATE `storage_path` | 1 row (`epigraph_video`) |
| `measures_media_map` | UPDATE `metadata` | 1 row (`hero_video`) |
| `measures_encounter_def` | UPDATE `metadata.media_contract` | 1 row (`ai_isnt_broken_intro`) |

Total: 3 rows updated.

---

## R2 ENV REQUIREMENT

`VITE_R2_PUBLIC_BASE_URL` is required for local resolution of `measures-media` assets (`epigraph_video`, `left_hero_fracture_motion`, `measured_hero_motion_graphic`, `measures_structured_enviroments`). When absent locally, all R2 assets resolve to `null` — runtime shows fallback Continue button. Must be confirmed as a Cloudflare Pages environment variable for production.

---

## VALIDATION CONFIRMATIONS

| Check | Result |
|---|---|
| `epigraph_video` correct path | ✓ |
| `hero_video` inactive | ✓ |
| `integrity_governance_intro.mp4` not in active consumed role | ✓ |
| Frontend files modified | None |
| CSS files modified | None |
| Route changes | None |
| Duplicate active media rows created | None |
| DB rows updated | 3 |

---

## CLOSEOUT

`epigraph_video` is restored to `registry_epigraph_fracture_to_alignment_15s.mp4` — the operator-declared correct epigraph video. `hero_video` remains inactive with documented dead-role status. `ai_isnt_broken_intro` media contract correctly names the primary video asset. `integrity_governance_intro.mp4` is traceable in the inactive `hero_video` row and is a candidate for future renderer role seating when renderer support is added.

OAR1 ready for operator review.
