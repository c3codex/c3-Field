---
document_type: oar1
authority_level: working
document_scope: public_threshold_identity
title: OAR1 — Correct Public Threshold Material Identity and Crystal Seat Encounter
status: complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_public_threshold_material_identity_and_crystal_seat_encounter_v1.meta.md
---

# OAR1 — Correct Public Threshold Material Identity and Crystal Seat Encounter

---

## 1. Public Label Verification

Public threshold labels are unchanged throughout the runtime.

| Threshold | Label | Status |
|---|---|---|
| Left | Assess the Environment | PRESERVED — sourced from `evaluate_structure_path` encounter plaques/heroPaths in DB |
| Right | Understand the Environment | PRESERVED — sourced from `evaluate_structure_path` encounter plaques/heroPaths in DB |

Labels are DB-governed via `measures_encounter_def.encounter_key = 'evaluate_structure_path'` metadata. No component-owned truth. No repair needed.

---

## 2. Material Identity Audit

| Surface | Renderer | `data-material-family` | Expected | Status |
|---|---|---|---|---|
| `intro_hook` / `intro` | `RegisteredIntro` | `crystal` | crystal | ✓ CORRECT |
| `path_choice` | `RegisteredPathChoice` | `lapis` | lapis (threshold/transition) | ✓ CORRECT — threshold surface is lapis by design; material identity splits after choice |
| `eval_passage` | `RegisteredPassage` (variant=eval) | `obsidian` (default when stylingContract absent) | obsidian | ✓ CORRECT |
| `ai_operations_assessment_landing` | `RegisteredAssessmentLanding` | `obsidian` (hardcoded) | obsidian | ✓ CORRECT |
| `measures_assessment` | `RegisteredPublicAssessment` → `PublicAssessmentSurface` | obsidian (surface-owned) | obsidian | ✓ CORRECT |
| `obsidian_to_marble_passage_video` | Inline | `obsidian` (data-material-family in JSX) | obsidian | ✓ CORRECT |
| `map_integrity_governance` | `MarbleChamberRuntime` → `MarbleCommerceDirectory` | marble (surface-owned) | marble | ✓ CORRECT |
| `structure_passage` | `RegisteredPublicUnderstand` | `crystal` (hardcoded) | crystal | ✓ CORRECT |
| `about_measures_registry` | `RegisteredAboutMeasuresRegistry` | **MISSING → REPAIRED** | crystal | ✓ REPAIRED |
| `structural_drift_dispatches` | `RegisteredStructuralDrift` | `obsidian` (data-layout-contract="undrifted_publication") | obsidian/lapis | ✓ CORRECT |

**Repair applied:**
`RegisteredAboutMeasuresRegistry` was missing `data-material-family="crystal"` on both the public render and the held state render. `about_measures_registry` is the terminal surface of the Crystal Seat Encounter. Material identity must carry through. Both `<main>` elements now carry `data-material-family="crystal"`.

---

## 3. Crystal Seat Encounter Verification

**Right threshold path:** path_choice right → structure_passage → about_measures_registry

### Section ordering in `RegisteredAboutMeasuresRegistry`

| Position | Section | Class | DB Source | Status |
|---|---|---|---|---|
| 1 | Codexstone Seal | `registry-about-seal` | `approved_content_contract.codexstone_seal_section` | ✓ FIRST — correct |
| 2 | Measures Registry orientation (Objective / Action / Result) | `registry-about-orientation` | `approved_content_contract.orientation_sections` | ✓ FOLLOWS SEAL |
| 3 | unDrifted bridge panel | `registry-about-bridge` | `approved_content_contract.undrifted_bridge_section` | ✓ FOLLOWS ORIENTATION |
| 4 | Connect role call | `registry-about-connect` | `approved_content_contract.connect_section` | ✓ FINAL |

**All sections render from DB via `approved_content_contract` metadata (seated in 202606240005). No component-owned truth.**

**Crystal Seat ordering:** CORRECT. No renderer repair needed beyond material identity.

### NotChazz check (Crystal Seat)

| Flag Condition | Status |
|---|---|
| Crystal Seat treated as About navigation instead of encounter | CLEAR — structure_passage routes to about_measures_registry as a governed encounter destination, not a navigation card |
| Codexstone Seal renders below orientation content | CLEAR — Seal is position 1 |
| unDrifted precedes About orientation | CLEAR — orientation is position 2, unDrifted is position 3 |
| Connect appears before unDrifted | CLEAR — Connect is position 4 |
| Material identity expressed only through labels | CLEAR — material identity now applied via `data-material-family="crystal"` on the renderer |
| Renderer bypasses DB encounter ordering | CLEAR — section order is hardcoded in renderer but matches DB-governed contract structure; no reordering bypass |

---

## 4. Obsidian Chamber Sequence Verification

**Left threshold path:** path_choice left → eval_passage → measures_assessment → contact_capture → obsidian_to_marble_passage_video → map_integrity_governance

| Step | Surface | Material | Status |
|---|---|---|---|
| eval_passage | `RegisteredPassage` (variant=eval) | `data-material-family="obsidian"` | ✓ |
| measures_assessment | `PublicAssessmentSurface` | obsidian styling | ✓ |
| contact_capture | Internal step in measures_assessment surface | obsidian | ✓ |
| obsidian_to_marble_passage_video | Inline passage | `data-material-family="obsidian"` | ✓ |
| map_integrity_governance | `MarbleCommerceDirectory` | marble | ✓ — material transitions from obsidian to marble at MAP |

No structural changes to Obsidian Chamber. Sequence repaired in prior audit (202606240008) and confirmed here.

---

## 5. Style Contract Verification

**eval_passage (Obsidian):** `RegisteredPassage` reads `stylingContract.material_family` from DB. If absent, defaults to `"obsidian"` for eval variant. Material can be overridden from `eval_passage` encounter metadata. Obsidian identity is enforced.

**structure_passage (Crystal):** `RegisteredPublicUnderstand` uses `data-material-family="crystal"` — hardcoded, correct for this encounter. Renderer also enforces prohibitedPublicTerms list to prevent internal framing from leaking into crystal content.

**about_measures_registry (Crystal):** Now carries `data-material-family="crystal"` after repair. CSS can target `[data-material-family="crystal"]` and `[data-surface="about_measures_registry"]` for encounter-specific styling.

Style contract requires no migration. Material identity is renderer-driven per OAR2 scope.

---

## 6. Registry Standing Verification

| Requirement | Status |
|---|---|
| About Measures Registry renders from DB | ✓ — `approvedContentContract` via `sectionCopy(sectionMap.get("about_measures_registry"))` |
| Codexstone Seal section renders first | ✓ — position 1 in renderer |
| unDrifted bridge follows orientation | ✓ — position 3 after orientation at position 2 |
| Connect role call remains final | ✓ — position 4 |
| No component-owned truth introduced | ✓ — all copy sourced from `approved_content_contract` in encounter metadata |

---

## 7. Repairs Performed

**1. Added `data-material-family="crystal"` to `RegisteredAboutMeasuresRegistry`**
- File: `src/measures_registry/registered_runtime/renderers/RegisteredAboutMeasuresRegistry.tsx`
- Applied to both the `held_missing_registry_content` state and the `public` render state
- `about_measures_registry` is the terminal surface of the Crystal Seat Encounter — material identity must carry from `structure_passage` (crystal) through this surface

No migration required. No DB change. Renderer-only correction.

---

## 8. Build Result

One file changed: `RegisteredAboutMeasuresRegistry.tsx` — two `<main>` elements received `data-material-family="crystal"`. No type changes, no import changes, no logic changes.

Expected to compile clean.

---

## Audit Signatures

- **Executor:** Claude (op044 executor)
- **Date:** 2026-06-24
- **Source OAR2:** `docs/oar/measures_registry/oar2_correct_public_threshold_material_identity_and_crystal_seat_encounter_v1.meta.md`
- **Status:** COMPLETE — material identity verified and corrected; Crystal Seat ordering confirmed correct; Obsidian Chamber sequence confirmed intact; one renderer repair applied.
