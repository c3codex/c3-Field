---
document_type: oar1
authority_level: working
document_scope: measures_registry_media_contracts
title: OAR1 — Correct Registered Intro and Path Choice Video-Still Media Contracts
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_registered_intro_and_path_choice_video_still_media_contracts_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - media-contracts
  - video-still
  - intro
  - path-choice
  - registered-runtime
  - codex-first
---

# OAR1 — Correct Registered Intro and Path Choice Video-Still Media Contracts

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_correct_registered_intro_and_path_choice_video_still_media_contracts_v1.meta.md`

Correct video-still media contracts for `ai_isnt_broken_intro` and `evaluate_structure_path`. No frontend edits. No CSS edits. No duplicate media authority.

---

## PRE-EXECUTION INSPECTION

### Storage state — `measures-registry` bucket (root listing)

33 files present. Relevant to this OAR:

| File | Status |
|---|---|
| `left_hero_fracture.webp` | ✓ present |
| `right_measured_hero.webp` | ✓ present |
| `hero_fracture_measure.webp` | ✗ absent (held row) |
| `more_vs_coherence_path.webp` | ✗ absent (held row) |
| `left_measures_hero.webp` | ✗ absent (not in bucket) |
| `right_measures_hero.webp` | ✗ absent (not in bucket) |

### Renderer media role consumption — confirmed

#### `ai_isnt_broken_intro` / `epigraph_split_hero`

| Variable | Role | Consumed |
|---|---|---|
| `epigraphVideoUrl` | `epigraph_video` | ✓ — main video player |
| `heroVideoUrl` | `hero_video` | **dead** — computed, never rendered |
| `splitHeroImageUrl` | `hero_image` | ✓ — held, 400 |
| `thresholdLeftStillUrl` | `left_hero_fracture` | ✓ — active, 200 |
| `thresholdLeftMotionUrl` | `left_hero_fracture_motion` | ✓ — active, R2 |
| `thresholdRightStillUrl` | `right_measured_hero` | ✓ — active, 200 |
| `thresholdRightMotionUrl` | `measured_hero_motion_graphic` | ✓ — active, R2 |

#### `evaluate_structure_path` / `measures_registry_path_choice`

| Variable | Role | Consumed |
|---|---|---|
| `pathChoiceBackgroundUrl` | `path_choice_background` | ✓ — CSS `--path-choice-background` (held, 400) |

**Renderer gap confirmed:** `renderPathChoiceSurface()` has no left/right video or still slots. The entire path choice visual surface depends on one CSS background variable. Left/right motion/still contract cannot be expressed without a frontend OAR2.

### Pre-correction DB state (relevant roles)

| Role | Bucket | Path | is_active |
|---|---|---|---|
| `epigraph_video` | measures-media | `registry_epigraph_fracture_to_alignment_15s.mp4` | true |
| `hero_video` | measures-media | `integrity_governance_intro.mp4` | true |
| `hero_image` | measures-registry | `hero_fracture_measure.webp` | false (held) |
| `left_hero_fracture` | measures-registry | `left_hero_fracture.webp` | true |
| `left_hero_fracture_motion` | measures-media | `left_hero_fracture_motion.mp4` | true |
| `right_measured_hero` | measures-registry | `right_measured_hero.webp` | true |
| `measured_hero_motion_graphic` | measures-media | `right_measured_hero_motion_graphic.mp4` | true |
| `path_choice_background` | measures-registry | `more_vs_coherence_path.webp` | false (held) |

---

## FINDING 1 — `epigraph_video` mapped to wrong asset

`epigraph_video` (the role consumed by `epigraphVideoUrl` video player) was mapped to `registry_epigraph_fracture_to_alignment_15s.mp4`.

The operator-declared primary intro video is `integrity_governance_intro.mp4`. This file was mapped to `hero_video` — a role that is queried by `REQUIRED_MEDIA_ROLES` but whose computed variable `heroVideoUrl` is **never rendered** in any renderer branch.

**Effect:** The intended intro video (`integrity_governance_intro.mp4`) was unreachable by the renderer. The video player was wired to the 15s epigraph file, not the primary intro.

---

## FINDING 2 — `hero_video` is a dead renderer role

`hero_video` appears in `REQUIRED_MEDIA_ROLES` and is queried from `measures_media_map`. `heroVideoUrl` is computed at runtime. But `heroVideoUrl` is referenced **nowhere in the renderer JSX** — it is assigned and immediately unused.

This means any asset mapped to `hero_video` is invisible to the frontend regardless of its storage state.

---

## FINDING 3 — `ai_isnt_broken_intro` encounter metadata was pre-contract

`metadata.media_roles` declared only `["epigraph_video", "hero_image"]`. Threshold roles (`left_hero_fracture`, `left_hero_fracture_motion`, `right_measured_hero`, `measured_hero_motion_graphic`) were not declared. No `media_contract` block existed.

---

## FINDING 4 — `evaluate_structure_path` encounter metadata had no media contract

`metadata.media_roles` was `null`. No media contract declared. Surface relies on `path_choice_background` CSS background, but the path choice renderer has no left/right video/still slots. The operator's intended left/right motion/still contract cannot be expressed without renderer extension.

---

## CORRECTIONS APPLIED

### Correction 1 — `epigraph_video` storage_path

| Field | Before | After |
|---|---|---|
| `storage_path` | `registry_epigraph_fracture_to_alignment_15s.mp4` | `integrity_governance_intro.mp4` |
| `is_active` | true | true (unchanged) |
| `storage_bucket` | `measures-media` | `measures-media` (unchanged) |

`integrity_governance_intro.mp4` is now the active path for `epigraph_video` — the role consumed by the renderer's video player.

Previous path `registry_epigraph_fracture_to_alignment_15s.mp4` is now unmapped. File remains in R2 storage but has no active DB row.

### Correction 2 — `hero_video` deactivated

| Field | Before | After |
|---|---|---|
| `is_active` | true | **false** |

`hero_video` is a dead renderer role. `heroVideoUrl` is computed but never rendered. The path `integrity_governance_intro.mp4` is now correctly mapped under `epigraph_video`. The duplicate active mapping is removed.

`metadata.superseded_by_oar2` and `superseded_reason` added to the row for traceability.

### Correction 3 — `ai_isnt_broken_intro` encounter metadata

`metadata.media_roles` updated from `["epigraph_video", "hero_image"]` to:

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

`metadata.media_contract` block added:

| Field | Value |
|---|---|
| `source_authority` | `measures_media_map` |
| `frontend_hardcode_allowed` | false |
| `video_primary_role` | `epigraph_video` |
| `video_primary_asset` | `integrity_governance_intro.mp4` (R2) |
| `split_hero_still_role` | `hero_image` — held, asset absent |
| `threshold_left_still_role` | `left_hero_fracture` — active ✓ |
| `threshold_left_motion_role` | `left_hero_fracture_motion` — active, R2 |
| `threshold_right_still_role` | `right_measured_hero` — active ✓ |
| `threshold_right_motion_role` | `measured_hero_motion_graphic` — active, R2 |

### Correction 4 — `evaluate_structure_path` encounter metadata

`metadata.media_roles` updated from `null` to:

```json
[
  "path_choice_background",
  "left_hero_fracture_motion",
  "measured_hero_motion_graphic"
]
```

`metadata.media_contract` block added documenting:

- `background_role: path_choice_background` — held, asset absent
- Intended left motion: `left_hero_fracture_motion.mp4` (R2, active)
- Intended right motion: `right_measured_hero_motion_graphic.mp4` (R2, active)
- Intended left still: `left_measures_hero.webp` — absent from bucket
- Intended right still: `right_measures_hero.webp` — absent from bucket
- `renderer_gap`: `renderPathChoiceSurface()` has no left/right video/still slots — frontend OAR2 required to extend the renderer before these roles can be expressed

---

## ANON READBACK

Active intro roles readable by anon key after corrections:

| Role | Anon-readable |
|---|---|
| `epigraph_video` | ✓ |
| `left_hero_fracture` | ✓ |
| `left_hero_fracture_motion` | ✓ |
| `right_measured_hero` | ✓ |
| `measured_hero_motion_graphic` | ✓ |

---

## HELD ROWS — PRESERVED

| Role | Hold reason | Action |
|---|---|---|
| `hero_image` | `hero_fracture_measure.webp` absent from bucket (400) | Preserved held |
| `hero_measured_image` | `measured_hero_right.webp` absent from bucket (400) | Preserved held |
| `path_choice_background` | `more_vs_coherence_path.webp` absent from bucket (400) | Preserved held |

---

## DB STATE CHANGES

| Table | Operation | Rows |
|---|---|---|
| `measures_media_map` | UPDATE `storage_path` | 1 row (`epigraph_video`) |
| `measures_media_map` | UPDATE `is_active = false` | 1 row (`hero_video`) |
| `measures_encounter_def` | UPDATE `metadata` | 2 rows (`ai_isnt_broken_intro`, `evaluate_structure_path`) |

Total: 4 rows updated.

---

## WHAT RENDERS NOW (ai_isnt_broken_intro)

| Asset | Status |
|---|---|
| Intro video (`integrity_governance_intro.mp4`) | Mapped to `epigraph_video` ✓ — resolves in production (R2); null locally without `VITE_R2_PUBLIC_BASE_URL` |
| Split hero image | null (held, 400) — threshold fallbacks used |
| Left threshold still | `left_hero_fracture.webp` — 200 ✓ renders |
| Left threshold motion | `left_hero_fracture_motion.mp4` — R2, resolves in production |
| Right threshold still | `right_measured_hero.webp` — 200 ✓ renders |
| Right threshold motion | `right_measured_hero_motion_graphic.mp4` — R2, resolves in production |

---

## WHAT RENDERS NOW (evaluate_structure_path)

| Asset | Status |
|---|---|
| Path choice background | null (held, 400) — surface renders without background |
| Left/right motion slots | **renderer does not support these slots** — frontend OAR2 required |

---

## R2 ENV GUIDANCE

`VITE_R2_PUBLIC_BASE_URL` must be set in `.env.local` for local resolution of `measures-media` bucket assets (`epigraph_video`, `left_hero_fracture_motion`, `measured_hero_motion_graphic`, `measures_structured_enviroments`). When absent locally, all R2 assets resolve to `null` — runtime shows fallback Continue button. Confirm the variable is set in Cloudflare Pages environment variables for production.

---

## RECOMMENDED NEXT OAR2

`oar2_extend_path_choice_renderer_for_left_right_video_still_contract_v1.meta.md`

Scope:
- Extend `renderPathChoiceSurface()` in `MeasuresRegistryRuntime.tsx` to consume `left_hero_fracture_motion`, `measured_hero_motion_graphic`, and two separate still roles for left/right path plaques
- Determine correct still fallback roles for each path plaque
- Verify left/right motion assets are active and anon-readable before extending renderer
- Seat `left_measures_hero.webp` and `right_measures_hero.webp` in `measures-registry` bucket if the operator confirms these are the intended stills
- Update `evaluate_structure_path` encounter metadata after renderer extension

---

## VALIDATION CONFIRMATIONS

| Check | Result |
|---|---|
| DB tables inspected | `measures_encounter_def`, `measures_media_map` |
| Storage bucket inspected | `measures-registry` (33 files listed) |
| Frontend files modified | None |
| CSS files modified | None |
| Media uploaded | None |
| Duplicate media authority created | None |
| Held rows revived without verified paths | None |
| Encounter contracts altered outside media roles/contracts | None |
| DB rows updated | 4 |
| Anon readback — all active intro roles | ✓ |

---

## CLOSEOUT

`epigraph_video` now correctly maps to `integrity_governance_intro.mp4` (the operator-declared primary intro video). The dead `hero_video` role is deactivated and documented. Both encounter metadata contracts are now explicit, declaring video-still role assignments, storage state, and where applicable, renderer gaps.

The intro surface (`ai_isnt_broken_intro`) is media-corrected. In production with `VITE_R2_PUBLIC_BASE_URL` set, the intro video and all threshold motion assets resolve. Threshold stills (`left_hero_fracture`, `right_measured_hero`) render now.

The path choice surface (`evaluate_structure_path`) renderer gap is documented. Full left/right video/still support requires a frontend OAR2 to extend `renderPathChoiceSurface()`.

OAR1 ready for operator review.
