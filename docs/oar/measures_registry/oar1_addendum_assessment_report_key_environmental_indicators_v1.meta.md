---
document_type: oar1
authority_level: launch_repair
document_scope: assessment_report_environmental_indicators
title: OAR1 - Add Key Environmental Indicators to Assessment Reports
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_addendum_assessment_report_key_environmental_indicators_v1
---

# OAR1 - Add Key Environmental Indicators to Assessment Reports

## REPAIRS APPLIED

### 1. Migration 202606300002

Seated five sub-keys in `assessment_evaluation_report_contract_v1` of `measures_encounter_def WHERE encounter_key = 'measures_assessment'`:

| Key | Content |
|---|---|
| `informational_notice` | Approved 4-paragraph notice (array of strings) |
| `recommendation` | "MAP the Environment to review the operating conditions behind these findings and determine the appropriate governed pathway." |
| `key_environmental_indicators_label` | "Key Environmental Indicators" |
| `environmental_indicator_map` | 5 entries: `{finding_key, statement}` (reference document) |
| `condition_indicator_map` | 4 entries: `{condition_tag → approved statement}` (fallback derivation) |

Migration validation DO block: passed.

### 2. Renderer — `PublicAssessmentResult.tsx`

Restructured report body to OAR2-defined order:

**Before:** header → meta → result → detected conditions → findings → recommended actions → structured action → clarification → measures standing → boundary → CTA

**After:** header → meta → (1) informational notice → (2) environment finding → (3) key environmental indicators → (4) recommendation → clarification → measures standing → boundary → CTA

**Removed sections:**
- `Detected Conditions` (subsumed into indicators concept)
- `Recommended Actions` / `RecommendedOperatingProtocol` component (replaced by recommendation)
- `Recommended Structured Action` (replaced by recommendation)

**Added sections:**
- Informational Notice — reads `reportContract.informational_notice` (array of strings, rendered as `<p>` elements)
- Key Environmental Indicators — `indicators` computed from `findings.slice(0, 3)` with fallback to `condition_indicator_map` lookup on `report.explainability.condition_tags`
- Recommendation — reads `reportContract.recommendation`

**Indicator derivation logic (in order of preference):**
1. `report.findings.slice(0, 3)` — strings already produced by `resolveEnvironmentalReportByScore` from `findingMap` in `assessment_interpretation`
2. If `findings` is empty: `report.explainability.condition_tags` → lookup in `condition_indicator_map` → approved statements (up to 3 unique)

**Utilities added:** `asString`, `asStringArray` imported from `registeredRuntimeUtils` for new computed values.

**Removed:** `RecommendedOperatingProtocol` component (no longer used). `ASSESSMENT_SUB_SUPPORT_LINE` import removed (unused after restructure).

### 3. Type check and build

- `tsc --noEmit`: 0 errors
- `npm run build`: success (9.94s)

---

## VALIDATION

- Informational notice seated: ✓ (migration applied, DO block passed)
- Key Environmental Indicators section renders: ✓ (derives from `report.findings` or `condition_indicator_map` fallback)
- Maximum 3 indicators: ✓ (`findings.slice(0, 3)` / `.slice(0, 3)` on fallback)
- Minimum 1 indicator if finding exists: ✓ (section only renders when `indicators.length > 0`)
- Approved indicator language: ✓ (`condition_indicator_map` in DB, `finding_map` in assessment_interpretation governs primary path)
- No raw answers exposed: ✓
- No scoring weights exposed: ✓
- No corrective instructions: ✓ (recommendation is directional, not corrective)
- `standing_key` calculation unchanged: ✓ (no changes to `resolveEnvironmentalReportByScore` or assessment_interpretation)
- MAP pathway mapping unchanged: ✓ (no changes to `applicable_standing_keys` or MarbleChamberRenderer)
- Assessment capture unchanged: ✓ (no changes to `handleSubmitEvaluation` or `onCaptureAssessment`)
- Email dispatch unchanged: ✓ (no changes to email artifact construction)
- Build passes: ✓
- Browser QA: pending deploy (Cloudflare Pages triggered on push)

## SECURITY CONSTRAINTS

- No SEAT pricing exposed: ✓
- No certification claim: ✓
- No c3 Key issuance: ✓
- No professional advice claim: ✓ (notice explicitly states "not professional advice")

## NOTE ON INDICATOR PRIMARY PATH

The primary derivation (`report.findings`) depends on `assessment_interpretation.finding_map` in the encounter def. If `finding_map` is not currently seeded with approved statement strings, `findings` will be empty and the `condition_indicator_map` fallback will activate. The fallback provides:

- `critical_ai_drift_condition` → "AI activities may be occurring without clearly defined review or accountability pathways."
- `emerging_ai_drift_condition` → "Roles and decision authority may not be clearly established for AI-related activities."
- `probable_ai_drift_condition` → "Operational procedures may not be consistently defined across AI-related activities."
- `governed_review_condition` → "Automation boundaries and review practices may not yet be sufficiently governed."

The HOLD OAR (`oar1_align_assessment_report_wording_to_scored_results_v1.meta.md`) covers seating `assessment_interpretation` and `report_templates` when approved copy is finalized. That OAR should update `finding_map` to return the approved indicator statements, which will then flow through as the primary derivation path.
