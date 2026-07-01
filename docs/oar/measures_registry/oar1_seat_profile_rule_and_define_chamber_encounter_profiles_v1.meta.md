---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seat Profile Rule and Define Chamber Encounter Profiles
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_profile_rule_and_define_chamber_encounter_profiles_v1
---

# OAR1 - Seat Profile Rule and Define Chamber Encounter Profiles

## EXECUTION METHOD

Documentation and schema audit only.

No migrations applied. No source code changed. No CSS modified. No report copy changed. No scoring changed. No payment changed. No visual mutation occurred.

OAR2 file written and seated at expected path.

Schema audit performed by reading `measures_encounter_surface_assignment` and related migration files directly. MCP DB access was unauthorized; audit conducted from migration sources.

---

## STEP 1 — OAR2 FILE SEATED

OAR2 file confirmed at expected path:

```
docs/oar/measures_registry/oar2_seat_profile_rule_and_define_chamber_encounter_profiles_v1.meta.md
```

Profile rule, contract use ban, authority boundary, and all 11 initial profiles defined.

---

## STEP 2 — SCHEMA AUDIT

### Tables inspected

**`measures_encounter_surface_assignment`** (created in `202606240009_seat_encounter_surface_assignment.sql`)

Columns relevant to profile seating:

| Column | Type | Current use |
|---|---|---|
| `surface_key` | TEXT UNIQUE | Identifies the surface (e.g., `path_choice`, `measures_assessment`) |
| `encounter_key` | TEXT | Encounter identifier |
| `material_identity` | TEXT | Chamber material: `crystal`, `obsidian`, `marble`, `lapis` |
| `chamber_assignment` | TEXT | Structural environment: `crystal_seat`, `obsidian`, `marble`, `lapis` |
| `metadata` | JSONB | Available for extensible profile assignment — no schema change required |

`metadata` JSONB column exists on all 13 current surface rows.

**No new table is required to seat profile assignments.** Profile can be written to `metadata` JSONB via UPDATE for any existing surface row.

### Current surface rows (from migration `202606240009` + `202606250001`)

| surface_key | material_identity | chamber_assignment | is_active | release_state |
|---|---|---|---|---|
| `intro_hook` | crystal | crystal_seat | true | released |
| `intro` | crystal | crystal_seat | true | released |
| `path_choice` | crystal | crystal_seat | true | released |
| `structure_passage` | crystal | crystal_seat | false | held |
| `measures_structured_environments` | crystal | crystal_seat | false | held |
| `about_measures_registry` | crystal | crystal_seat | false | held |
| `eval_passage` | obsidian | obsidian | true | released |
| `structural_coherence_explainer` | obsidian | obsidian | true | released |
| `measures_assessment` | obsidian | obsidian | true | released |
| `obsidian_to_marble_passage_video` | obsidian | obsidian | true | released |
| `map_integrity_governance` | marble | marble | true | released |
| `structural_drift_dispatches` | lapis | lapis | true | released |
| `publication_dispatch` | lapis | lapis | true | released |

---

## STEP 3 — SAFE PROFILE SEATING PATH

The following profile assignments can be seated safely via `UPDATE measures_encounter_surface_assignment SET metadata = metadata || '{"profile": "<profile_key>"}'::jsonb WHERE surface_key = '<surface_key>'` — no new tables required.

| surface_key | Safe profile assignment | OAR2 profile # |
|---|---|---|
| `path_choice` | `crystal_split_path_choice` | 6 |
| `about_measures_registry` | `crystal_about_surface` | 7 |
| `eval_passage` | `obsidian_full_bleed_video` | 1 |
| `structural_coherence_explainer` | `obsidian_full_bleed_video` | 1 |
| `measures_assessment` | `obsidian_assessment_surface` | 2 |
| `obsidian_to_marble_passage_video` | `obsidian_to_marble_passage` | 3 |
| `map_integrity_governance` | `marble_map_cards` | 9 |
| `structural_drift_dispatches` | `lapis_publication_surface` | 8 |
| `publication_dispatch` | `lapis_publication_surface` | 8 |

**This OAR seats only the profile rule and profile definitions.** Execution of the above UPDATE statements is a separate OAR. No metadata writes were performed in this OAR.

---

## STEP 4 — SCHEMA GAP REPORT

The following profiles from OAR2 do not have a current surface row in `measures_encounter_surface_assignment` to attach to:

| Profile | OAR2 # | Gap |
|---|---|---|
| `assessment_scrollable_form` | 4 | Sub-state of `measures_assessment` surface — no dedicated row |
| `report_result_gate` | 5 | Post-scoring state within obsidian assessment flow — no dedicated row |
| `legal_reading_surface` | 10 | No legal/policy surface row exists in assignment table |
| `governed_footer` | 11 | Global component — not surface-assignment-tracked |

Additionally, `intro_hook` and `intro` surface rows exist with no matching profile defined in OAR2. These are crystal chamber landing/hook surfaces; a profile definition for threshold hook surfaces is a future seating decision.

**No new tables are created in this OAR.** Schema gaps are reported only. Profile seating for gap items requires either a future surface row to be added to `measures_encounter_surface_assignment`, or a separate profile registry approach when those surfaces are formally declared.

---

## STEP 5 — CONTRACT USE BAN CONFIRMED

- Term `contract` is banned from active native Measures Registry language except `smart_contract`.
- OAR2 contains no new contract-named profile names, route names, CSS authority names, or registry meanings.
- No new contract terminology was introduced in this OAR.
- Existing contract-named fields in migration history (`contract_class`, `email_contract_def`, etc.) are acknowledged as legacy implementation terminology only.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| OAR2 file exists at expected path | ✓ confirmed |
| Profile rule seated in documentation | ✓ (OAR2 PROFILE RULE section) |
| Contract use ban included | ✓ (OAR2 CONTRACT USE BAN section) |
| Authority boundary included | ✓ (OAR2 AUTHORITY BOUNDARY section) |
| All 11 initial profiles defined | ✓ (OAR2 INITIAL PROFILE DEFINITIONS section) |
| No active visual mutation occurred | ✓ — no source or CSS touched |
| No CSS refactor occurred | ✓ |
| No DB profile table implemented | ✓ — no new tables |
| No report copy changes | ✓ |
| No scoring changes | ✓ |
| No payment changes | ✓ |
| Profile metadata support reported | ✓ (Step 3) |
| Schema gaps reported | ✓ (Step 4) |
| OAR1 written beside OAR2 | ✓ |
| No frontend-owned truth introduced | ✓ |
| FREE remains active route authority | ✓ |
| registered_runtime remains retired | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Profile rule and initial profile definitions seated as standing documentation.

No visual, scoring, payment, report, or route mutations occurred.

Schema gap report filed. Safe profile seating path identified via existing `measures_encounter_surface_assignment.metadata` JSONB — no new tables required.

Profile seating execution is a separate OAR when authorized.
