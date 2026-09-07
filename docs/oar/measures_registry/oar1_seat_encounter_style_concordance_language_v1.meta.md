---
document_type: oar1
authority_level: working
title: OAR1 — Seat Encounter Style Concordance Language
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_encounter_style_concordance_language_v1.meta.md
commit: aef5cc7
---

# OAR1 — Seat Encounter Style Concordance Language

## FINAL DISPOSITION

**CONCORDANCE_LANGUAGE_SEATED_IN_TYPE_SYSTEM — NOT YET DB-AUTHORITATIVE**

This OAR seats vocabulary and shape, not visual behavior — per its own implementation boundary, no CSS was rewritten and no visual result is claimed. All 7 concordance dimensions now exist as bounded TypeScript unions, the canonical `EncounterStyleProfile` shape is updated to match the OAR2 spec exactly, material defaults are documented as explicitly provisional and kept out of the real resolution path, and migration-ready profile records are drafted below for Field/Measures review — not applied.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Style concordance terms defined | PASS | `src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts` — `FrameProfile`, `SpatialProfile`, `ContentAnchor`, `TypographyProfile`, `MotionProfile`, `SurfaceDensity`, `VisualTension` |
| Allowed values are bounded | PASS | Each is a TypeScript string-literal union of exactly the values enumerated in the OAR2 (5–6 values each, verbatim) — not an open `string` |
| Material defaults are documented | PASS | `PROVISIONAL_MATERIAL_STYLE_CONCORDANCE_DEFAULTS` — crystal/obsidian/marble/lapis, values copied verbatim from the OAR2 "MATERIAL DEFAULTS" section |
| Encounter style profile shape is updated | PASS | `EncounterStyleProfile` now matches the OAR2 "ENCOUNTER STYLE PROFILE SHAPE" section field-for-field: `profile_key`, `material_family`, `frame_profile`, `space_profile`, `content_anchor`, `typography_profile`, `motion_profile`, `surface_density`, `visual_tension`, `media_ratio`, `content_width`, `button_position`, `overlay_treatment`, `watermark_treatment`, `audio_control_treatment`, `mobile_behavior`, `release_state_behavior`. Superseded ad hoc fields from the prior OAR (`frame_mode`, `media_fit`, `typography_scale`, `heading_treatment`, `body_treatment`, `button_treatment`, `encounter_type`, `surface_role`) were removed — confirmed via grep that nothing outside this file read them |
| Implementation gaps reported honestly | PASS | `resolveEncounterStyleProfile()` still resolves only `profile_key`; every concordance/token field is `null` unless a caller explicitly opts into `applyProvisionalMaterialDefaults()`, which itself returns which fields were provisional rather than merging silently |
| No visual behavior claimed complete without browser QA | PASS | No CSS was touched, no renderer class or DOM styling changed. `npm run build:registry` succeeded (type-only change) — that is a compile check, not a visual claim |
| Material defaults not treated as Codex authority before seating | PASS | Defaults live in a separate, clearly-labeled-provisional export; not read by `resolveEncounterStyleProfile()`; not wired into any chamber renderer this pass |
| No encounter-specific style exceptions hardcoded | PASS | No renderer file was touched in this OAR — only `encounterStyleProfile.ts` |
| No unrelated CSS rewritten | PASS | Zero `.css` files touched |
| No flow/assessment/MAP/payment/release-state logic altered | PASS | Only the style-profile type module changed |

---

## CHANGES — EVIDENCE

### `src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts`

- Added `MaterialFamily` (`"crystal" | "obsidian" | "marble" | "lapis"`) and the 7 concordance-dimension unions listed above.
- `EncounterStyleProfile` restructured to the OAR2-canonical 17-field shape.
- `resolveEncounterStyleProfile()` unchanged in behavior (still resolves only `profile_key` from the DB-seeded `style_profile` metadata key; every other field is `null`).
- Added `PROVISIONAL_MATERIAL_STYLE_CONCORDANCE_DEFAULTS` (const, exported, clearly commented as provisional/non-authoritative).
- Added `applyProvisionalMaterialDefaults(profile, materialFamily)` — an explicit opt-in helper. Not called anywhere in this codebase yet; exists so a future, deliberately-invoked pass (or a Chazz-reviewed renderer change) can use it without the fallback ever being silent.

No chamber renderer, CSS file, or DOM output changed. `dist-registry` was rebuilt only because it's a tracked build artifact; the resulting bundle differs solely in hash/type-erased-at-build output, not in rendered behavior.

---

## MIGRATION-READY PROFILE RECORDS (DRAFT — NOT APPLIED)

Per OAR2 §"Cody may... prepare migration-ready profile records," below is a draft mapping from the 14 `style_profile` keys already seated in `measures_encounter_surface_assignment.metadata` (queried directly, not assumed) to their material-family's provisional concordance defaults. This is a **reference for Field/Measures to review, adjust, and formally seat** — Cody has not applied this and it is not DB truth.

| surface_key | style_profile (seeded) | material_family | frame_profile | space_profile | content_anchor | typography_profile | motion_profile | surface_density | visual_tension |
|---|---|---|---|---|---|---|---|---|---|
| crystal_seat_intro | media_intro_full_bleed | crystal | cinematic_frame | ceremonial_space | anchor_center | signal_type | breathing_motion | minimal_density | calm_tension |
| crystal_seat_threshold | split_threshold_motion_still | crystal | cinematic_frame | ceremonial_space | anchor_center | signal_type | breathing_motion | minimal_density | calm_tension |
| crystal_seat_orientation | talking_head_orientation | crystal | cinematic_frame | ceremonial_space | anchor_center | signal_type | breathing_motion | minimal_density | calm_tension |
| crystal_seat_encounter | public_about_encounter | crystal | cinematic_frame | ceremonial_space | anchor_center | signal_type | breathing_motion | minimal_density | calm_tension |
| obsidian_chamber_orientation | media_orientation_full_bleed | obsidian | threshold_frame | immersive_space | anchor_right | institutional_type | passage_motion | operational_density | diagnostic_tension |
| obsidian_chamber_encounter_surface | assessment_form_surface | obsidian | threshold_frame | immersive_space | anchor_right | institutional_type | passage_motion | operational_density | diagnostic_tension |
| obsidian_chamber_C1_compact | compact_contact_capture | obsidian | threshold_frame | immersive_space | anchor_right | institutional_type | passage_motion | operational_density | diagnostic_tension |
| marble_chamber_orientation | marble_orientation_surface_profile | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension |
| marble_chamber_encounter | assessment_findings_report | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension |
| marble_chamber_results | marble_results_surface_profile | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension |
| marble_chamber_C2_compact | marble_map_surface_profile | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension |
| marble_chamber_C2_agreement | marble_payment_surface_profile | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension |
| marble_chamber_C2_resolution | marble_confirmation_surface_profile | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension |
| lapis_chamber_encounter | publication_index_promoted | lapis | split_frame | intimate_space | anchor_floating | whisper_type | ritual_motion | narrative_density | transformative_tension |

Notes for whoever seats this:
- This table applies the *material default uniformly* to every surface of that material — it does not yet account for per-surface variation an operator may want (e.g. `marble_chamber_C2_agreement`, a payment surface, might reasonably want `operational_density` rather than `narrative_density`, or `threshold_tension` rather than `ceremonial_tension`, since it's a decision point rather than a reading surface). Cody did not make that judgment call — it's exactly the kind of per-surface exception this OAR2 reserves for Codex/Field, not Cody.
- `media_ratio`, `content_width`, `button_position`, `overlay_treatment`, `watermark_treatment`, `audio_control_treatment`, `mobile_behavior`, `release_state_behavior` have no documented default anywhere (OAR2's "MATERIAL DEFAULTS" section only covers the 7 concordance dimensions) — they remain undrafted gaps, not filled in with a guess.

## RECOMMENDED NEXT OAR2

1. Field/Measures: review the draft table above, adjust per-surface exceptions where warranted (especially the Marble payment/agreement surfaces), and seat the result as real `metadata` fields on `measures_encounter_surface_assignment` (or wherever Field decides this belongs).
2. Once seated, a follow-up Cody pass can extend `resolveEncounterStyleProfile()` to read the newly-seated concordance fields for real (replacing the `null` gaps), and only then begin wiring `[data-frame-profile]`/`[data-typography-profile]`/etc. CSS selectors — with browser QA available, per the still-open item from the prior style-profile OAR1.

---

## NOTCHAZZ FLAGS

None raised.

- No final DB state invented — the migration-ready table above is explicitly a draft for Field/Measures, not applied.
- No encounter-specific style exceptions hardcoded — provisional defaults are uniform per material, not surface-specific guesses.
- Material defaults not treated as Codex authority — kept in a separate, clearly-labeled export, unconsumed by any renderer.
- No unrelated CSS rewritten.
- No flow, assessment, MAP, payment, or release-state logic touched.
- No visual behavior claimed without browser QA — none was attempted.
