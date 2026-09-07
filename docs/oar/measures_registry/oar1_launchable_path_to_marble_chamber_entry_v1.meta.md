---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Launchable Path to Marble Chamber Entry
status: closed
version: v1
system: measures_registry
oar2_ref: oar2_launchable_path_to_marble_chamber_entry_v1
commit: 6e03dcf
branch: measures
date: 2026-07-01
---

# OAR1 - Launchable Path to Marble Chamber Entry

## VALIDATION TABLE

| Surface | Issue Found | Media Locator Status | Transition Status | Style/Frame Action | Browser Validation | Remaining Blocker |
|---|---|---|---|---|---|---|
| crystal_seat_intro | Intro hooks into crystal_seat_threshold via IntroHookSeat; no standalone route | `intro_hook_video` — in MEDIA_ROLES; DB row presence requires operator verify | `next_surface: crystal_seat_threshold` — correct (202606300020) | No header rendered in IntroHookSeat; no change needed | N/A (not in default entry path; site enters at crystal_seat_threshold) | Operator: verify intro_hook_video file exists in media bucket |
| crystal_seat_threshold | L/R animated-to-still layout did not render — `ai_isnt_broken_intro` encounter def lacked `threshold_copy.plaques` | `intro_hook_video`, `left_hero_fracture`, `left_hero_fracture_motion`, `right_measured_hero`, `measured_hero_motion_graphic` — in MEDIA_ROLES; DB rows require operator verify | `left → obsidian_chamber_orientation`, `right → crystal_seat_orientation` — correct | Threshold L/R layout now unlocked by seating plaques; motion-to-still fires when motion URLs present | Cannot verify without live motion media in bucket | Operator: verify left_hero_fracture / measured_hero_motion_graphic files in media bucket |
| crystal_seat_orientation | Codexstone seal too small; layout functional | `measures_position` + `official_codexstone_seal` — seated (migrations 202607010002, 202607010005) | `next_surface: crystal_seat_encounter` — correct | Seal size: `clamp(4.5rem,7vw,7rem)` (was 2.5rem); opacity 0.92 | Seal visually readable at new size | Operator: verify official_codexstone_seal.png filename in Supabase measures-registry bucket |
| crystal_seat_encounter | about_measures_registry_video locator seated; CSS fixed (selectors repaired 202607010005) | `about_measures_registry_video` + `official_codexstone_seal` — seated; R2 path verified in migration comment | `crystal_seat_encounter` has no outbound navigation (terminal for this path) | about.css selectors active (data-surface="crystal_seat_encounter"); layout operational | — | Operator: verify about_measures_registry.mp4 in R2 bucket |
| obsidian_chamber_orientation | Media role was `explainer_video` (internal storage name); L/R layout wrong for orientation; no audio control; wrong public copy structure | `explainer_video` renamed → `obsidian` in measures_media_map (migration 202607010006); storage_path = obsidian_chamber_orientation.mp4 (already correct from 202607010003) | `next_surface: obsidian_chamber_encounter_surface` — correct (202606300020) | New layout: 16:9 video left + copy right; Audio/Mute control; "Begin Assessment" CTA; obsidian.css created | — | None — obsidian role and storage_path are confirmed correct |
| obsidian_chamber_encounter_surface | Assessment must work; `next` points to obsidian_chamber_C1_compact | No visual media roles required by assessment surface itself; obsidian_* visual roles in MEDIA_ROLES | `next_surface: obsidian_chamber_C1_compact` — correct (202606300020) | No style change; assessment surface unchanged per OAR2 DO NOT TOUCH | — | None |
| obsidian_chamber_C1_compact | Contact capture + consent bundle; submit navigates to marble_chamber_orientation | No media roles required | `next_surface: marble_chamber_orientation` — correct (202606300020) | No style change | — | None; `__mreg_c1_pending` session key written by MeasuresAssessment carries eval state |
| marble_chamber_orientation | Video played without size constraints (fullscreen-dominating); no existing CSS | `assessment_report_orientation` — seated + active (migration 202606300022); R2 URL verified | `next_surface: marble_chamber_encounter` — correct (202606300020) | New CSS added: `max-height: 52svh` video container, centered, controls below | — | None; media gap state renders cleanly if video absent |
| material tones | Volumes too high (crystal 0.10, lapis 0.08, obsidian 0.08, marble 0.06) | Tonal beds seated in migration 202607010004 | — | Volumes lowered: crystal 0.035 / lapis 0.03 / obsidian 0.025 / marble 0.02 | — | None |
| header/footer/frame | Brand image height unconstrained (could render tall if logo is tall); header otherwise absolute-positioned and compact | — | — | Added `max-height: 1.75rem` to `.registry-public-brand img` in visual-system.css | — | None |

---

## DB CHANGES — migration 202607010006

### STEP 1: explainer_video → obsidian (media_role rename)
```sql
UPDATE measures_media_map
SET media_role = 'obsidian'
WHERE media_role = 'explainer_video' AND storage_bucket = 'measures-media'
```
- storage_path already correct: `obsidian_chamber_orientation.mp4` (from 202607010003)
- R2 object key: `obsidian_chamber_orientation.mp4`

### STEP 2: threshold_copy.plaques in ai_isnt_broken_intro encounter def
```json
{
  "threshold_copy": {
    "title": "Measures Registry",
    "plaques": [
      { "side": "left", "body": "Assess the Environment", "label": "Assess" },
      { "side": "right", "body": "Understand the Environment", "label": "Understand" }
    ]
  }
}
```
Required for `crystal_seat_threshold` to render L/R layout in IntroHookSeat.

### STEP 3: content_profile.body in obsidian_chamber_orientation encounter def
Added body: "The AI Operations Assessment evaluates your organization's operational environment..."

### STEP 4: encounter_structure obsidian_chamber_orientation.media_role informational update
`"explainer_video"` → `"obsidian"` in root registry encounter_structure JSONB.

---

## RENDERER CHANGES

### MeasuresRegistryOrchestrator.tsx
- `MATERIAL_TONE_VOLUME`: crystal 0.10→0.035, lapis 0.08→0.03, obsidian 0.08→0.025, marble 0.06→0.02

### registryResolver.ts
- `MEDIA_ROLES`: `"explainer_video"` → `"obsidian"`

### ObsidianChamberRenderer.tsx
- `ObsidianOrientationThreshold` rewritten from L/R motion-to-still layout to:
  - Single orientation video (role: `obsidian`)
  - Audio/Mute toggle button
  - Content profile: title + subtitle + body
  - "Begin Assessment" CTA → `next` surface (obsidian_chamber_encounter_surface)
  - `data-layout-contract="obsidian_orientation"` (was `orientation_threshold`)

---

## CSS CHANGES

### New: encounters/obsidian.css
- Scoped to `[data-surface="obsidian_chamber_orientation"]`
- Two-column layout: 16:9 video left, content right; aligned center
- Video: `max-height: 62svh`, contained `object-fit: cover`
- Controls: cta pill + audio toggle
- Mobile (720px): stacked single column

### encounters/crystal.css
- `.registry-crystal-codexstone-seal`: width `clamp(2.5rem,4vw,3.5rem)` → `clamp(4.5rem,7vw,7rem)`; opacity 0.88 → 0.92

### registry.encounter.css
- Added `@import "./encounters/obsidian.css"`

### registry.visual-system.css
- `.registry-public-brand img`: added `max-height: 1.75rem` to prevent tall logo images from inflating header
- Added marble_chamber_orientation block at end:
  - `.registry-marble-orientation` video: `max-height: 52svh`, `width: min(54rem,100%)`
  - Controls: flex row, centered
  - `.registry-media-absence`: centered, padded gap state

---

## TRANSITION AUDIT

All confirmed correct (already set by migration 202606300020):

| From | To | Status |
|---|---|---|
| crystal_seat_threshold.left | obsidian_chamber_orientation | ✓ |
| crystal_seat_threshold.right | crystal_seat_orientation | ✓ |
| crystal_seat_orientation | crystal_seat_encounter | ✓ |
| obsidian_chamber_orientation | obsidian_chamber_encounter_surface | ✓ |
| obsidian_chamber_encounter_surface | obsidian_chamber_C1_compact | ✓ |
| obsidian_chamber_C1_compact | marble_chamber_orientation | ✓ |
| marble_chamber_orientation | marble_chamber_encounter | ✓ |

No active transition points to: `obsidian_to_marble_passage_video`, `crystal_seat_orientation_passage`, `structure_passage`, `obsidian_chamber_orientation_passage`.

---

## VALIDATION

| Check | Status |
|---|---|
| TypeScript: 0 errors | ✓ |
| Migration 202607010006 applied | ✓ exit 0 |
| explainer_video row renamed obsidian | ✓ |
| threshold_copy.plaques seated | ✓ |
| obsidian_chamber_orientation.media_role updated in encounter_structure | ✓ |
| ObsidianOrientationThreshold uses mediaByRole.get("obsidian") | ✓ |
| ObsidianOrientationThreshold has Audio/Mute control | ✓ |
| ObsidianOrientationThreshold "Begin Assessment" CTA → next | ✓ |
| crystal_seat_threshold L/R layout unblocked | ✓ (motion media presence still operator-verify) |
| Codexstone seal size increased | ✓ |
| Tone volumes lowered to OAR2 spec | ✓ |
| marble_chamber_orientation video contained (max 52svh) | ✓ |
| Header brand image height constrained | ✓ |
| obsidian.css scoped to data-surface | ✓ |
| No scoring/payment/passage/certification changes | ✓ |
| Commit pushed | ✓ 6e03dcf |

---

## OPERATOR VERIFY ITEMS

1. **intro_hook_video** — must exist in campaign media bucket for crystal intro video to play. If absent, threshold shows immediately (clean gap state). Verify file in bucket.
2. **left_hero_fracture / measured_hero_motion_graphic** — motion media for L/R animated-to-still. L/R threshold shows still images if motion files absent. Verify file objects in bucket.
3. **obsidian_chamber_orientation.mp4** — R2 bucket `measures-media`. Storage_path confirmed correct in DB. Verify R2 object exists.
4. **official_codexstone_seal.png** — Supabase `measures-registry` bucket. Filename assumed; verify exact object key.
5. **about_measures_registry.mp4** — R2 `measures-media`. Filename assumed; verify exact object key.

---

## FINAL DISPOSITION

**CLOSED** — Launchable path from Crystal entry through Obsidian assessment into Marble Chamber orientation is structurally complete.

Crystal opens.
Obsidian assesses.
C1 captures.
Marble receives.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
