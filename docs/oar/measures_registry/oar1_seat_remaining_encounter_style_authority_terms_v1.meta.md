---
document_type: oar1
authority_level: working
title: OAR1 — Seat Remaining Encounter Style Authority Terms
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_remaining_encounter_style_authority_terms_v1.meta.md
commit: f44ea54
---

# OAR1 — Seat Remaining Encounter Style Authority Terms

## FINAL DISPOSITION

**STYLE_AUTHORITY_LANGUAGE_LAYER_COMPLETE**

Every field in the canonical `EncounterStyleProfile` shape now has bounded TypeScript vocabulary — the 7 concordance dimensions from the prior OAR plus the 8 remaining fields seated here. Nothing was applied as DB truth, no CSS was touched, no visual behavior is claimed. Per this OAR2's own close: "the next valid movement is Field/Measures DB seating," not a Cody CSS pass.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| All remaining style fields have bounded vocabulary | PASS | `encounterStyleProfile.ts` — `MediaRatio`, `ContentWidth`, `ButtonPosition`, `OverlayTreatment`, `WatermarkTreatment`, `AudioControlTreatment`, `MobileBehavior`, `ReleaseStateBehavior` added, each a string-literal union of exactly the OAR2-listed values |
| EncounterStyleProfile uses bounded field types | PASS | `media_ratio`, `content_width`, `button_position`, `overlay_treatment`, `watermark_treatment`, `audio_control_treatment`, `mobile_behavior`, `release_state_behavior` retyped from `string \| null` to their new unions `\| null` |
| Unresolved DB authority remains reported as gap/null | PASS | `GAP_FIELDS` and `resolveEncounterStyleProfile()` unchanged — every field beyond `profile_key` still resolves to `null` |
| Migration-ready profile records may be drafted but not applied | N/A this pass | The draft table from the prior OAR1 (`oar1_seat_encounter_style_concordance_language_v1.meta.md`) already covers the 7 concordance fields; this OAR2 didn't ask for a new draft covering the 8 additional fields since none have a documented per-material/per-surface default (OAR2 gives allowed values, not defaults, for these 8) — nothing to draft without inventing one |
| No CSS rewrite performed | PASS | Zero `.css` files touched |
| No visual behavior claimed without browser QA | PASS | Type-only change; confirmed via build that `dist-registry`'s emitted JS/CSS bundle hashes are byte-identical to the prior commit (TypeScript unions erase at compile time) — nothing rendered differently, so nothing needed visual verification |
| No per-surface defaults invented | PASS | No `PROVISIONAL_..._DEFAULTS`-style table was added for these 8 fields — OAR2 didn't specify material/surface defaults for them (only allowed values), so none were invented |
| No encounter-specific exceptions hardcoded | PASS | No renderer file touched |
| No flow/assessment/MAP/payment/release/routing logic altered | PASS | Only `encounterStyleProfile.ts` changed |

---

## CHANGES — EVIDENCE

### `src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts`

Added 8 string-literal unions (`MediaRatio` through `ReleaseStateBehavior`), each copied verbatim from the OAR2's allowed-value lists. `EncounterStyleProfile`'s matching 8 fields retyped from `string | null` to `<Union> | null`. `GAP_FIELDS` and `resolveEncounterStyleProfile()` required no changes — `null` satisfies every new union type unchanged.

Rebuilt `dist-registry` to confirm the change is genuinely inert at runtime: emitted asset hashes (`index-BSR_Zs-w.css`, `index-3qi-ysQ3.js`) are identical to the previous commit, so no tracked build-output diff exists — nothing to stage there.

---

## NOT DONE / DEFERRED

Same as the prior style-authority OAR1s: no field beyond `profile_key` is DB-seeded yet. The canonical profile shape is now fully named and bounded end-to-end (all 17 fields), which is exactly what this OAR2 sets up as the precondition for the next real movement:

## RECOMMENDED NEXT OAR2

Field/Measures DB seating pass — seat real values for the 16 non-`profile_key` fields (starting from the draft table in `oar1_seat_encounter_style_concordance_language_v1.meta.md` for the 7 concordance fields; the 8 fields seated in this OAR2 have no drafted defaults yet and would need Field/Measures to decide real values directly, since OAR2 gave allowed values but not material/surface defaults for them). Only after that seating should a browser-QA-equipped Cody pass begin wiring `[data-frame-profile]`-style CSS selectors.

---

## NOTCHAZZ FLAGS

None raised.

- No DB truth applied — purely a TypeScript type-system change.
- No per-surface or per-material defaults invented for the 8 new fields.
- No CSS rewritten, no visual behavior wired or claimed.
- No flow/assessment/MAP/payment/release/routing logic touched.
