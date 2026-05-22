---
document_type: oar1
authority_level: working
document_scope: measures_registry_frontend
title: OAR1 — Correct Educational Diagnostic Passage Institutional Copy
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_educational_diagnostic_passage_institutional_copy_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - codex-copy
  - institutional-surface
  - diagnostic-passage
  - content-correction
---

# OAR1 — Correct Educational Diagnostic Passage Institutional Copy

## OBJECTIVE

Execute correction for:

`docs/oar/measures_registry/oar2_correct_educational_diagnostic_passage_institutional_copy_v1.meta.md`

Update `educational_diagnostic_passage` with approved institutional copy and render the primary CTA from seated action metadata.

---

## ACTION

### DB Correction

Execution script:

`docs/oar/measures_registry/execute-correct-educational-diagnostic-passage-institutional-copy.cjs`

Updated `measures_encounter_def.metadata` for `educational_diagnostic_passage`:

- `title` → `"How does the operational environment shape AI behavior?"`
- `subtitle` → `"AI instability often develops inside unstructured environments where oversight, connected systems, external tools, and operational decisions are not fully visible or clearly governed."`

All prior metadata keys preserved.

### Renderer Correction

File: `src/measures_registry/MeasuresRegistryRuntime.tsx`

In `renderEducationalDiagnosticPassageSurface()`:

- Added `continueAction` derivation from `educationalDiagnosticPassageCopy.actions` — finds action where `action_key === "continue_to_evaluation"`, following the established pattern in `renderEducateEvalSurface()`
- Replaced hardcoded `"Continue to Assessment"` with `{asString(continueAction?.label) ?? "Continue to Evaluation"}` on the primary CTA button

### Preserved

- `"Continue"` label on the controls-row shortcut button — compact media control, not a semantic CTA; outside the primary CTA scope of this correction
- Routing behavior unchanged (`navigateSurface("iis_eval_gate1")`)
- Styling contract unchanged
- Material family unchanged
- Media roles unchanged
- Release state unchanged

---

## RESULT

### Resolved Field State

| Field | Rendered Value | Source |
|---|---|---|
| eyebrow | `"Assessment Readiness"` | Codex metadata |
| title | `"How does the operational environment shape AI behavior?"` | Codex metadata |
| subtitle | `"AI instability often develops inside unstructured environments where oversight, connected systems, external tools, and operational decisions are not fully visible or clearly governed."` | Codex metadata |
| primary CTA | `"Continue to Evaluation"` | Codex action metadata (`continue_to_evaluation.label`) |

---

## VALIDATION

### DB State After Update

```json
{
  "source": "correct_educational_diagnostic_passage_institutional_copy_v1",
  "encounterKey": "educational_diagnostic_passage",
  "operation": "updated",
  "title": "How does the operational environment shape AI behavior?",
  "subtitle": "AI instability often develops inside unstructured environments where oversight, connected systems, external tools, and operational decisions are not fully visible or clearly governed.",
  "metadata_after_update": {
    "title": "How does the operational environment shape AI behavior?",
    "actions": [
      {
        "label": "Continue to Evaluation",
        "behavior": "route_surface",
        "action_key": "continue_to_evaluation",
        "target_encounter_key": "educate_eval_encounter"
      }
    ],
    "eyebrow": "Assessment Readiness",
    "renderer": "diagnostic_explainer_passage",
    "subtitle": "AI instability often develops inside unstructured environments where oversight, connected systems, external tools, and operational decisions are not fully visible or clearly governed.",
    "media_roles": ["explainer_video"],
    "function_layer": "education_diagnostic",
    "state_expression": "public_educational_diagnostic_passage",
    "styling_contract": {
      "material_family": "obsidian"
    },
    "source_educational_diagnostic_passage": "educational_diagnostic_passage_codex_publication_surface_v1"
  }
}
```

### Build Status

Command: `npm.cmd run build:registry`

Result: passed

Output directory: `dist-registry`

Generated build artifacts cleaned after validation.

### File References

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | `continueAction` derived from seated action metadata; primary CTA label reads from `continueAction.label` |
| `docs/oar/measures_registry/execute-correct-educational-diagnostic-passage-institutional-copy.cjs` | DB correction script — created and executed |

### Line References

| Location | Change |
|---|---|
| `MeasuresRegistryRuntime.tsx:1791–1793` | `continueAction` derived via `actions.find(action_key === "continue_to_evaluation")` |
| `MeasuresRegistryRuntime.tsx:1834` | Primary CTA label reads `asString(continueAction?.label) ?? "Continue to Evaluation"` |

### Confirmation

- `title` renders from Codex metadata — institutional-facing
- `subtitle` renders from Codex metadata — institutional-facing
- Primary CTA label renders from seated action `continue_to_evaluation.label` — not hardcoded
- No semantic truth authored in JSX
- No styling contract changed
- No routing changed
- Build passed

---

## IMPLEMENTATION STATUS

All three corrections executed.

DB metadata updated.

Renderer CTA reads from seated action.

Build validated.

---

## CLOSEOUT

OAR2 correction executed in full.

`educational_diagnostic_passage` now resolves institutional copy and CTA label from Codex metadata.

No semantic truth hardcoded in the renderer for title, subtitle, or primary CTA.

OAR1 ready for operator review.
