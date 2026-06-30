---
document_type: oar1
authority_level: launch_repair
document_scope: assessment_report_wording
title: OAR1 - Align Assessment Report Wording to Scored Results
status: hold
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_align_assessment_report_wording_to_scored_results_v1
hold_reason: approved_copy_not_finalized
---

# OAR1 - Align Assessment Report Wording to Scored Results

## STATUS: HOLD

Approved copy for per-band report wording is not finalized. No copy is invented.

No migration applied in this OAR. No source changes.

---

## SCORE CHAIN TRACED

### Source table

`measures_encounter_def` WHERE `encounter_key = 'measures_assessment'`

### Rendering path

`MeasuresAssessment (ObsidianChamberRenderer.tsx)` →
  `meta = asRecord(encounter.encounterDef?.metadata)` →
  `assessmentEvaluationReportContract = asRecord(meta?.assessment_evaluation_report_contract_v1)` →
  `assessmentCompletion = asRecord(meta?.assessment_completion)` →
  Passed to `PublicAssessmentSurface` → `PublicAssessmentResult`

### Score resolution

`resolveEnvironmentalReportByScore` in `registeredRuntimeUtils.ts` (lines 350–519):

1. Reads `meta.assessment_interpretation` from encounter def
2. Builds `submittedTags` from assessment condition traces
3. Computes `totalDriftScore` = criticalCount×3 + emergingCount×2 + probableCount×1
4. Matches `standing_rules` (tag-based, priority-ordered) → `matchingRule.standingKey`
5. Computes `scorePercent` = totalScore / maxScore × 100
6. Matches `scoring_thresholds` by `standingKey` match or score `min`/`max` range
7. Falls back to `fallback_standing_key` if no threshold matches

### Four score bands (from migration 202606080002)

| `standing_key` | Standing name | MAP pathway | MAP price |
|---|---|---|---|
| `eval_result_01` | Foundational Leadership Invitation | foundational | $333 |
| `eval_result_02` | Environmental Fragmentation | optimization | $777 |
| `eval_result_03` | Environmental Instability | remediation | $999 |
| `eval_result_04` | Structural Drift | remediation | $999 |

### Report field resolution (PublicAssessmentResult.tsx)

For each band, fields are resolved in this priority order (template → report → fallback):

| Rendered field | Primary source | Fallback source |
|---|---|---|
| h3 result title | `report_templates[key].report_title` | `report.assessment_result` (from threshold) |
| Opening paragraph | `report_templates[key].summary` | `report.operational_exposure_summary` (from threshold) |
| Environmental standing | n/a | `report.environmental_standing` (from threshold) |
| Detected conditions | `report_templates[key].detected_conditions[]` | computed from `condition_labels` map |
| Findings | `report_templates[key].findings[]` | computed from `finding_map` |
| Recommended actions | `report_templates[key].recommended_actions[]` | (none — section omitted if empty) |
| Recommended structured action | `report_templates[key].recommended_structured_action` | `report.recommended_structured_action` (from threshold) |
| Report header title | `report_header.title` | `"Measures Registry Assessment Evaluation Report"` |
| Report subtitle | `report_header.subtitle` | `"Governed System Integrity for Optimized AI Deployment"` |
| Boundary note | `report_boundary_note` | inline fallback in renderer |
| CTA button label | `report_cta.label` | `"Begin Pathway Review"` |

---

## HOLD INVENTORY — MISSING KEYS (APPROVED COPY REQUIRED)

These keys must be seated in `measures_encounter_def WHERE encounter_key = 'measures_assessment'` under `metadata.assessment_evaluation_report_contract_v1`:

### `report_header` (shared across all bands)

```json
{
  "title": "...",
  "subtitle": "...",
  "descriptor": "..."
}
```

### `report_boundary_note` (shared across all bands)

```json
"..."
```

### `report_cta` (shared across all bands)

```json
{ "label": "Begin Pathway Review" }
```

### `report_templates` (one object per band, keyed by `standing_key`)

```json
{
  "eval_result_01": {
    "report_title": "...",
    "summary": "...",
    "detected_conditions": ["...", "..."],
    "findings": ["...", "..."],
    "recommended_actions": ["...", "..."],
    "recommended_structured_action": "..."
  },
  "eval_result_02": {
    "report_title": "...",
    "summary": "...",
    "detected_conditions": ["...", "..."],
    "findings": ["...", "..."],
    "recommended_actions": ["...", "..."],
    "recommended_structured_action": "..."
  },
  "eval_result_03": {
    "report_title": "...",
    "summary": "...",
    "detected_conditions": ["...", "..."],
    "findings": ["...", "..."],
    "recommended_actions": ["...", "..."],
    "recommended_structured_action": "..."
  },
  "eval_result_04": {
    "report_title": "...",
    "summary": "...",
    "detected_conditions": ["...", "..."],
    "findings": ["...", "..."],
    "recommended_actions": ["...", "..."],
    "recommended_structured_action": "..."
  }
}
```

### `assessment_completion` (shared display labels — also in encounter def metadata)

```json
{
  "assessment_completion_label": "...",
  "clarification_title": "...",
  "clarification_body": "...",
  "measures_registry_standing_title": "...",
  "measures_registry_standing_body": "..."
}
```

---

## ALSO REQUIRED — `assessment_interpretation` VERIFICATION

The `meta.assessment_interpretation.scoring_thresholds` in the encounter def drives:
- `report.assessment_result` (h3 fallback if no template)
- `report.environmental_standing` (the standing label shown in bold)
- `report.operational_exposure_summary` (paragraph fallback)
- `report.recommended_structured_action` (action fallback)
- `report.continuation_pathway`

Each threshold entry must have:

```json
{
  "standing_key": "eval_result_0N",
  "standing": "...",
  "environmental_standing": "...",
  "assessment_result": "...",
  "operational_exposure_summary": "...",
  "recommended_structured_action": "...",
  "continuation_pathway": "...",
  "min": 0,
  "max": 100
}
```

Current state of `assessment_interpretation` in DB is unknown — not in any migration file.

---

## MAP ALIGNMENT CONFIRMED (NOT HELD)

MAP pathway mapping is already correct in code and DB:

- `eval_result_01` → foundational / $333 — `applicable_standing_keys` in migration 008
- `eval_result_02` → optimization / $777 — `applicable_standing_keys` in migration 008
- `eval_result_03/04` → remediation / $999 — `applicable_standing_keys` in migration 008

No change needed. Report → MAP pathway mapping requires only that `report.standing_key` is correct, which it will be if `scoring_thresholds` are properly structured.

---

## SECURITY CONSTRAINTS (NO VIOLATIONS)

- No SEAT pricing exposed
- No certification claim
- No c3 Key issuance claim
- No professional advice claim

Boundary note (renderer fallback):
> "This report provides an environment evaluation and recommended actions based on the assessment responses submitted. It does not create approval, enrollment, implementation, or verified registry status."

This is an acceptable fallback boundary note. If DB-governed copy is preferred, seat it in `report_boundary_note`.

---

## TO RESUME THIS OAR

1. Operator finalizes approved copy for each of the four score bands.
2. Seat copy via new migration (`202606300002_seat_assessment_report_contract_wording.sql`):
   - `jsonb_set(metadata, '{assessment_evaluation_report_contract_v1}', ...)` on `measures_encounter_def WHERE encounter_key = 'measures_assessment'`
   - Include per-band `report_templates`, shared `report_header`, `report_boundary_note`, `report_cta`
   - Validate each band key present in migration DO block
3. If `assessment_interpretation.scoring_thresholds` wording also needs update, seat via separate `jsonb_set` on same migration.
4. Update this OAR1 status from `hold` to `closed`.
5. Build passes. Browser QA confirms per-band report wording.
