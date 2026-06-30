---
document_type: oar1
authority_level: launch_repair
document_scope: live_db_authority_audit
title: OAR1 - Live DB Authority Audit for Assessment Passage Report MAP
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_live_db_authority_audit_for_assessment_passage_report_map_v1
---

# OAR1 - Live DB Authority Audit for Assessment Passage Report MAP

## AUDIT METHOD

Live DB queried via Supabase PostgREST (anon key) against project `zfihrspxvennjzazxcbj`.
MCP `execute_sql` was unauthorized. PostgREST accessible for public-readable tables.

---

## 1. `measures_assessment` Encounter Def

### Q1 (assessment_mechanics.questions[0])

| Field | Live value |
|---|---|
| `question` | "How is AI currently being used within your organization?" ✓ |
| `question_key` | `ai_deployment_status` ✓ |
| `option count` | 3 ✓ |
| `condition_tags` | `ai_pre_deploy_context`, `ai_indirect_use_context`, `ai_active_operations_context` (contextual-only, score 0) ✓ |

Migration 202606300003 confirmed effective in live DB.

### assessment_evaluation_report_contract_v1

Initial query was collapsed by PowerShell `-Depth 2`. Re-queried raw JSON:

| Key | Live value |
|---|---|
| `report_header.title` | "Initial Environmental Assessment Findings" ✓ |
| `report_header.subtitle` | "An informational review of environmental conditions..." ✓ |
| `report_templates.eval_result_01.report_title` | "Emerging AI Environment" ✓ |
| `report_templates.eval_result_02.report_title` | "Fragmented AI Environment" ✓ |
| `report_templates.eval_result_03.report_title` | "Structural Drift Detected" ✓ |
| `report_templates.eval_result_04.report_title` | "High-Exposure Structural Drift" ✓ |
| `report_boundary_note` | "Assessment findings are informational and directional..." ✓ |
| `report_cta.label` | "MAP the Environment" ✓ |
| `recommendation` | "MAP the Environment to review the operating conditions..." ✓ |
| `condition_indicator_map` | 4 keys present ✓ |
| `environmental_indicator_map` | 5 entries present ✓ |

Migration 202606300005 confirmed effective in live DB.

### assessment_interpretation.scoring_thresholds

**MISMATCH CONFIRMED:**

| Threshold index | `standing_key` (live) | Expected by report_templates | Expected by MAP applicable_standing_keys |
|---|---|---|---|
| 0 (score 0) | `structured_ai_environment_confirmed` | `eval_result_01` | `eval_result_01` |
| 1 (score 1–33) | `early_structural_drift` | `eval_result_01` | `eval_result_01` |
| 2 (score 34–66) | `active_structural_drift` | `eval_result_02` | `eval_result_02` |
| 3 (score 67–100) | `system_integrity_risk` | `eval_result_03` / `eval_result_04` | `eval_result_03` / `eval_result_04` |

**Impact:**
- `resolveEnvironmentalReportByScore` sets `report.standing_key = asString(threshold.standing_key)` → returns old keys (`early_structural_drift` etc.)
- `PublicAssessmentResult` reads `reportTemplates[report.standing_key]` → no match → template lookup fails → falls back to threshold text fields (`report.assessment_result`, `report.operational_exposure_summary`) → approved band copy never renders
- MAP reads `standing_key` from `__mreg_pending_report` sessionStorage, compares to `applicable_standing_keys: ["eval_result_01"]` etc. → no match → pathway card cannot be selected

**This explains all observed symptoms: wrong report wording, no MAP continuation.**

### assessment_interpretation.finding_map

Live `finding_map` has 7 keys:
- `traceability_absent`, `review_pathway_absent`, `role_boundary_failure`, `runtime_surface_unregistered`, `implementation_boundary_absent` — non-scoring condition keys
- `emerging_ai_drift_condition` ✓ (scoring tag, mapped)
- `probable_ai_drift_condition` ✓ (scoring tag, mapped)

Missing from finding_map:
- `critical_ai_drift_condition` — not mapped → no finding string for highest-severity condition
- `governed_review_condition` — not mapped → no finding string

This is a separate gap from the standing_key mismatch. Not the cause of the main symptom.

---

## 2. Transition Authority

| Surface | `transition_target` / `next_surface` | Expected |
|---|---|---|
| `obsidian_to_marble_passage_video` | `transition_target: "map_integrity_governance"` | map_integrity_governance ✓ |
| `ai_isnt_broken_intro` | `root_sequence_binding.next_surface: "path_choice"` | path_choice ✓ |

Transitions are seated correctly.

---

## 3. Surface Assignments

| encounter_key | surface_key | chamber_assignment | material_identity |
|---|---|---|---|
| `ai_isnt_broken_intro` | `intro_hook` / `intro` | `crystal_seat` | crystal |
| `measures_assessment` | `measures_assessment` | `obsidian` | obsidian |
| `obsidian_to_marble_passage_video` | `obsidian_to_marble_passage_video` | `obsidian` | obsidian |
| `map_integrity_governance` | `map_integrity_governance` | `marble` | marble |
| `crystal_seat_orientation_passage` | `crystal_seat_orientation_passage` | `crystal_seat` | crystal |

Surface assignments are correct. Chamber routing will correctly dispatch passage video to `ObsidianChamberRenderer`.

---

## 4. Passage Media Row

Two rows found for `media_role = 'before_the_pathway_obsidian_to_marble_passage_video'`:

**Row A** — `registry_key: "measures_registry"`
```json
{
  "storage_bucket": "measures-media",
  "storage_path": "before_the_pathway_obsidian_to_marble_passage_v1.mp4",
  "is_active": true,
  "metadata": {
    "public_url": "https://media.c3field.online/before_the_pathway_obsidian_to_marble_passage_v1.mp4",
    "exact_url_seated": "https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"
  }
}
```

**MISMATCH:** `public_url` does NOT have `1` prefix (old filename). `exact_url_seated` has `1` prefix (correct filename).

Renderer (`ObsidianChamberRenderer.tsx` line 55):
```tsx
publicUrl: asString(meta?.public_url) ?? asString(meta?.exact_url_seated)
```
`public_url` is present → `exact_url_seated` is never reached → renderer resolves to old URL (without `1`).

**Row B** — `registry_key: "obsidian_to_marble_passage_video"`
```json
{
  "storage_bucket": "measures-media",
  "storage_path": "1before_the_pathway_obsidian_to_marble_passage_v1.mp4",
  "is_active": true,
  "metadata": {
    "exact_url_seated": "https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"
  }
}
```

No `public_url` → `exact_url_seated` used → resolves to correct URL (with `1`) ✓

**Which row does the renderer get?**

`encounter.mediaByRole.get("before_the_pathway_obsidian_to_marble_passage_video")` returns whichever row was inserted last into the Map. Query order from DB determines winner. If Row A wins, video loads from wrong URL. If Row B wins, video loads from correct URL.

This is a LIVE_DB_MEDIA_ROW_MISMATCH — Row A has `public_url` pointing to old file.

---

## 5. MAP pathway_cards — applicable_standing_keys

| Card | `applicable_standing_keys` | Matches live `report.standing_key`? |
|---|---|---|
| Foundational ($333) | `["eval_result_01"]` | NO — report produces `early_structural_drift` |
| Optimization ($777) | `["eval_result_02"]` | NO — report produces `active_structural_drift` |
| Remediation ($999) | `["eval_result_03", "eval_result_04"]` | NO — report produces `system_integrity_risk` |

No MAP card matches the standing_key produced by scoring. MAP cannot surface a pathway without a matching key.

---

## 6. Renderer DB Key Comparison

| Expectation | Renderer reads | Live DB has |
|---|---|---|
| Report template for band | `reportTemplates[report.standing_key]` | Templates keyed `eval_result_01`–`04`; `standing_key` is `early_structural_drift` etc. → NO MATCH |
| MAP pathway card | `applicable_standing_keys.includes(standing_key)` | Cards use `eval_result_01`–`04`; standing_key is old → NO MATCH |
| Passage video URL | `meta.public_url ?? meta.exact_url_seated` | Row A has wrong `public_url` → old URL if Row A wins |

---

## ROOT CAUSE CLASSIFICATION

**Primary: RENDERER_DB_KEY_MISMATCH**

`assessment_interpretation.scoring_thresholds[*].standing_key` uses old keys. `report_templates` and MAP `applicable_standing_keys` use new keys. Lookup fails at both report template selection and MAP pathway card matching.

**Secondary: LIVE_DB_MEDIA_ROW_MISMATCH**

Media Row A has `public_url` pointing to old file (without `1` prefix). Renderer prioritizes `public_url`, bypassing `exact_url_seated`. Passage video may load wrong file depending on which row `mediaByRole.get()` returns.

---

## REQUIRED REPAIR OAR

### Repair 1: Align scoring_thresholds standing_keys (PRIMARY)

Migration required: Update `assessment_interpretation.scoring_thresholds[*].standing_key` from:
- `structured_ai_environment_confirmed` → `eval_result_01`
- `early_structural_drift` → `eval_result_01` (or consolidate with above — operator to decide)
- `active_structural_drift` → `eval_result_02`
- `system_integrity_risk` → `eval_result_03` (or split `eval_result_04` for high-exposure case — operator to decide)

Note: Currently 4 thresholds but new report_templates has 4 bands. Need operator to confirm exact mapping: which old standing_key maps to which new `eval_result_0N`.

### Repair 2: Correct media Row A public_url (SECONDARY)

Migration required: Update `measures_media_map` WHERE `registry_key = 'measures_registry'` AND `media_role = 'before_the_pathway_obsidian_to_marble_passage_video'`:
- Update `metadata.public_url` to `"https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"` (add `1` prefix)
- OR remove `public_url` key from metadata so `exact_url_seated` is used

---

## CONFIRMED WORKING (NO REPAIR NEEDED)

- Q1 wording ✓
- report_header ✓
- report_templates (eval_result_01–04) ✓
- report_boundary_note ✓
- report_cta.label ✓
- Surface assignments ✓
- Transition targets ✓
- MAP pathway cards structure ✓
- Row B media URL (correct) ✓

---

## 7. SEAT Authority Sweep — Full Site Classification

Source sweep of all active FREE encounter renderer files to classify what reads from SEAT authority vs. what is stale, duplicated, misplaced, or hardcoded.

SEAT authority defined as:
- Active FREE encounter renderer path: `src/measures_registry/encounter_renderer/`
- DB-seated registry: `measures_encounter_def`, `measures_registry_root.metadata`, `measures_encounter_surface_assignment`, `measures_media_map`
- Approved OAR-seated updates only

---

### ACTIVE — SEAT authority confirmed

All display copy and media reads from DB-seated contracts:

| Source | Read path |
|---|---|
| Encounter copy, titles, sections | `encounterDef.metadata.*` |
| Assessment questions | `meta?.assessment_mechanics` |
| Report templates, header, CTA, boundary note | `meta?.assessment_evaluation_report_contract_v1` |
| MAP pathway cards, applicable_standing_keys | `meta?.pathway_cards` |
| Contact form fields, consent fields | `meta?.assessment_contact_capture_oar1_binding_contract_v1` |
| Assessment completion copy | `meta?.assessment_completion` |
| Footer copy | `meta?.footer_contract` |
| Scoring threshold path | `meta?.assessment_interpretation.scoring_thresholds` — logic correct; mismatch is in DB values |
| Transition targets | `encounter.transitionNodes` (DB-seated) |
| Media URLs | `encounter.mediaByRole.get(role)` (DB rows) |
| Design tokens (CSS vars) | `resolverData.designTokenRows` |
| Registry mark | `resolverData.mediaRows.find(media_role === "registry_mark")` |

---

### STALE — Legacy registered_runtime dependency in active FREE source

| File | Stale item | Impact |
|---|---|---|
| `encounter_renderer/shared/encounterRendererUtils.ts:10` | `import type { LandingSectionRow, MediaRow } from "../../registered_runtime/registeredRuntimeTypes"` | Type dependency on registered_runtime; carries `sectionCopy()` and exported `mediaUrl()` which use these types |
| `encounter_renderer/styles/registry.encounter.css:4–15` | All 11 `@import` paths point to `../../registered_runtime/styles/` | CSS entry point depends on registered_runtime; styles not yet moved to SEAT boundary |
| `registered_runtime/renderers/RegisteredPrivacy.tsx` | Stale copy; no FREE source imports it | Duplicate — active copy at `encounter_renderer/legal/` |
| `registered_runtime/renderers/RegisteredTerms.tsx` | Same | Same |

---

### DUPLICATED — Conflicting authority

| Item | Row A | Row B | Impact |
|---|---|---|---|
| `measures_media_map` for `before_the_pathway_obsidian_to_marble_passage_video` | `registry_key: "measures_registry"` — `public_url` = old filename without `1` prefix | `registry_key: "obsidian_to_marble_passage_video"` — `exact_url_seated` = correct filename | Renderer reads `public_url` first → Row A resolves to wrong URL. Primary Repair 2 target. |
| `RegisteredPrivacy.tsx` | `registered_runtime/renderers/` (stale, not imported) | `encounter_renderer/legal/` (active) | No functional conflict; stale copy is dead |
| `RegisteredTerms.tsx` | Same | Same | Same |

---

### MISPLACED — Dead exports inside active SEAT file

| File | Dead item | Why misplaced |
|---|---|---|
| `encounterRendererUtils.ts:521–529` | Exported `mediaUrl(row?: MediaRow)` | Uses `MediaRow` from registered_runtime; no FREE chamber calls it — each defines its own local `mediaUrl` using `EncounterMediaRow` |
| `encounterRendererUtils.ts:536–618` | Exported `sectionCopy(row?: LandingSectionRow)` + `SectionCopy` type | Uses `LandingSectionRow` from registered_runtime; no FREE chamber calls it |
| `MeasuresAssessmentBrandLayer.tsx` | Entire file | Not imported anywhere in active FREE source; contains hardcoded `"MEASURES REGISTRY"` and `"Integrity Governance for AI Accelerated Systems"` |

---

### HARDCODED — Active render path, not from DB

| File | Hardcoded value | Render location | DB path available? |
|---|---|---|---|
| `measuresAssessmentCopy.ts:1` | `"MEASURES AI OPERATIONAL EVALUATION"` | `<h1>` in assessment surface | No — not passed from DB; default prop always active |
| `measuresAssessmentCopy.ts:2` | `"AI reflects the structure of the environment it operates within."` | `<p>` in assessment surface | No |
| `measuresAssessmentCopy.ts:3` | `"Structure enables acceleration. Ambiguity creates drift."` | `<p>` in assessment surface | No |
| `PublicAssessmentSurface.tsx:185` | `"Your assessment evaluation is ready. Enter your information to receive the evaluation and recommended actions."` | Result-withheld copy | Fallback for `assessmentContactCaptureContract.result_withheld_transition_copy` |
| `PublicAssessmentSurface.tsx:188` | `"Enter your information to receive the assessment evaluation and recommended actions."` | Contact helper copy | Fallback for `post_assessment_contact_form.public_helper_copy` |
| `PublicAssessmentResult.tsx:72–86` | Report header, subtitle, descriptor, boundary note, CTA label | Report surface | Fallbacks only — active if `reportContract` is absent |

The three `measuresAssessmentCopy.ts` strings are the only actively-rendered hardcoded content with no DB fallback path currently wired. `ObsidianChamberRenderer` calls `PublicAssessmentSurface` without passing these props; the constants are always the active values.

---

### SWEEP SUMMARY

No active FREE chamber renderer imports from or depends on `registered_runtime` for display content or data authority.

Remaining registered_runtime ties in active source:
1. Two unused type-exports in `encounterRendererUtils.ts` (`sectionCopy`, exported `mediaUrl`) pulling `LandingSectionRow`/`MediaRow` types — dead for content authority
2. CSS entry point re-exporting styles still living in `registered_runtime/styles/` — style dependency only

Three assessment surface strings (`ASSESSMENT_PROCESS_TITLE`, `ASSESSMENT_SUPPORT_LINE`, `ASSESSMENT_SUB_SUPPORT_LINE`) are hardcoded and active — not DB-seated.

Production bugs remain the two DB-level mismatches from sections 1 and 4 above (RENDERER_DB_KEY_MISMATCH + LIVE_DB_MEDIA_ROW_MISMATCH).

---

## NO MUTATIONS APPLIED

Audit-only. No source changes. No migrations. No repairs.
