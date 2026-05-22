---
document_type: oar1
authority_level: working
document_scope: measures_registry_frontend
title: OAR1 — Audit Educational Diagnostic Passage Content Seating
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_educational_diagnostic_passage_content_seating_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - frontend
  - content-seating
  - codex-copy
  - institutional-surface
  - diagnostic-passage
---

# OAR1 — Audit Educational Diagnostic Passage Content Seating

## OBJECTIVE

Audit text field resolution for `educational_diagnostic_passage`.

Determine whether each visible text field is Codex-seated correctly, semantically wrong, fallback-generated, hardcoded, or awaiting approved copy.

No implementation performed.

---

## ACTION

### Files Inspected

- `src/measures_registry/MeasuresRegistryRuntime.tsx` — renderer (lines 1784–1838)
- `measures_encounter_def.metadata` — current DB state for `educational_diagnostic_passage`

### DB State Inspected

Metadata as currently seated:

```json
{
  "title": "Before evaluation, recognize the environment.",
  "eyebrow": "Assessment Readiness",
  "subtitle": "This passage frames instability, ambiguity, and unresolved AI propagation before the institution enters diagnostic evaluation.",
  "actions": [
    {
      "label": "Continue to Evaluation",
      "behavior": "route_surface",
      "action_key": "continue_to_evaluation",
      "target_encounter_key": "educate_eval_encounter"
    }
  ],
  "renderer": "diagnostic_explainer_passage",
  "media_roles": ["explainer_video"],
  "function_layer": "education_diagnostic",
  "state_expression": "public_educational_diagnostic_passage",
  "styling_contract": {
    "material_family": "obsidian"
  }
}
```

---

## RESULT

### Field-by-Field Classification

| Field | Rendered Value | Source | Classification |
|---|---|---|---|
| eyebrow | `"Assessment Readiness"` | Codex metadata | Correctly seated |
| title | `"Before evaluation, recognize the environment."` | Codex metadata | Codex-seated; semantically questionable — internal/systemic tone for institutional surface |
| subtitle | `"This passage frames instability, ambiguity, and unresolved AI propagation before the institution enters diagnostic evaluation."` | Codex metadata | Codex-seated but semantically wrong — uses internal structural language ("this passage frames") on an institutional-facing threshold |
| CTA — controls | `"Continue"` | Hardcoded renderer (`MeasuresRegistryRuntime.tsx:1816`) | Hardcoded — not from Codex |
| CTA — primary | `"Continue to Assessment"` | Hardcoded renderer (`MeasuresRegistryRuntime.tsx:1834`) | Hardcoded — not from Codex; conflicts with seated action label `"Continue to Evaluation"` |
| video aria-label | `"Measures Registry diagnostic passage"` | Hardcoded renderer (`MeasuresRegistryRuntime.tsx:1808`) | Hardcoded — internal language |
| controls aria-label | `"Passage controls"` | Hardcoded renderer (`MeasuresRegistryRuntime.tsx:1811`) | Hardcoded — internal language |

### Fallback Copy Present in Renderer

Two fallback strings are authored in JSX:

**title fallback** (`MeasuresRegistryRuntime.tsx:1824`):

```
"Before evaluation, recognize the environment."
```

Identical to the current seated value. If the Codex value were absent, the renderer would produce the same text — no visible drift from fallback, but the fallback is authored in JSX.

**subtitle fallback** (`MeasuresRegistryRuntime.tsx:1826–1827`):

```
"Most AI instability is not model failure alone. It emerges where authority, validation, oversight, implementation structure, and behavioral registration are unclear or absent."
```

This is different from the currently seated subtitle. If the Codex value were absent, this fallback would render instead. The fallback is authored in JSX.

### Actions — Seated vs Rendered

The Codex metadata seats one action:

```json
{
  "label": "Continue to Evaluation",
  "behavior": "route_surface",
  "action_key": "continue_to_evaluation",
  "target_encounter_key": "educate_eval_encounter"
}
```

The renderer does not read `educationalDiagnosticPassageCopy.actions`. Both CTAs are hardcoded. The seated label `"Continue to Evaluation"` is never rendered. The hardcoded label `"Continue to Assessment"` conflicts with the seated label.

### Approved Copy Status

| Field | Approved Copy Exists | Notes |
|---|---|---|
| eyebrow | Yes | `"Assessment Readiness"` — seated and correct |
| title | No | Current seated value is internal in tone; no approved institutional replacement seated |
| subtitle | No | Current seated value uses internal structural language; no approved institutional replacement seated |
| CTA labels | No | Renderer hardcodes `"Continue"` and `"Continue to Assessment"`; seated action label not read |

---

## FAULT CLASSIFICATION

**1 — Codex-seated but semantically wrong**

`title` and `subtitle` are correctly read from Codex metadata but the seated copy uses internal/structural language inappropriate for an institutional-facing threshold surface.

- `title`: "Before evaluation, recognize the environment." — systemic, not institutional
- `subtitle`: "This passage frames instability..." — "this passage frames" is internal system language

These require new operator-approved institutional copy, seated in Codex metadata.

**2 — Hardcoded renderer copy**

Four strings are authored in the renderer and not read from Codex:

- `"Continue"` — CTA in controls
- `"Continue to Assessment"` — primary CTA
- `"Measures Registry diagnostic passage"` — video aria-label
- `"Passage controls"` — controls aria-label

The two CTA labels are functional user-facing copy. The aria-labels are accessibility copy. None are from Codex.

**3 — Seated action not consumed**

The Codex-seated action label `"Continue to Evaluation"` is never read by the renderer. The renderer hardcodes both CTA labels. The seated `target_encounter_key` is used (navigation is wired correctly), but the label is bypassed.

**4 — JSX-authored fallback copy**

Two fallback strings are authored in JSX. They would render if Codex values were absent. The title fallback is identical to the seated value, providing no visible protection. The subtitle fallback contains different copy that would silently replace the seated value.

---

## ROUTING RECOMMENDATION

**Route 1 — New operator-approved copy (required before any DB correction)**

Operator must approve:

- Institutional-facing `title` for the passage threshold
- Institutional-facing `subtitle` for the passage threshold

These cannot be generated by the executor. The copy must express institutional readiness context, not internal system structure.

**Route 2 — Codex metadata update**

Once copy is approved:

- Update `metadata.title` in `educational_diagnostic_passage`
- Update `metadata.subtitle` in `educational_diagnostic_passage`

**Route 3 — Renderer CTA correction**

Read the seated action from `educationalDiagnosticPassageCopy.actions` and render its `label`. Remove hardcoded `"Continue to Assessment"`.

The `"Continue"` control-row button may remain as a functional shortcut label, or be replaced from a seated metadata key if warranted.

**Route 4 — JSX fallback removal (optional)**

Remove or replace fallback strings in the renderer once Codex values are confirmed stable. Low priority if Codex values remain seated.

aria-label fallbacks are lower concern and can be addressed in a separate pass.

---

## VALIDATION

### Build Status

Not checked. Audit is read-only per OAR2 scope.

### File References

| File | Relevance |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx:1784–1838` | Full passage renderer — source of all hardcoded copy |
| `measures_encounter_def` row `educational_diagnostic_passage` | Current metadata state |

### Line References

| Location | Note |
|---|---|
| `MeasuresRegistryRuntime.tsx:1808` | `aria-label="Measures Registry diagnostic passage"` — hardcoded |
| `MeasuresRegistryRuntime.tsx:1811` | `aria-label="Passage controls"` — hardcoded |
| `MeasuresRegistryRuntime.tsx:1816` | `"Continue"` CTA — hardcoded |
| `MeasuresRegistryRuntime.tsx:1823` | eyebrow — reads from Codex, no fallback |
| `MeasuresRegistryRuntime.tsx:1824` | title — reads from Codex with JSX fallback (identical value) |
| `MeasuresRegistryRuntime.tsx:1826–1827` | subtitle — reads from Codex with JSX fallback (different value) |
| `MeasuresRegistryRuntime.tsx:1834` | `"Continue to Assessment"` CTA — hardcoded; conflicts with seated `"Continue to Evaluation"` |

---

## IMPLEMENTATION STATUS

Audit only.

No implementation performed.

No files modified.

No DB state changed.

---

## CLOSEOUT

Content seating audit complete.

Two fields (`title`, `subtitle`) are Codex-seated but semantically wrong for an institutional threshold surface. Approved replacement copy is required from the operator before correction can proceed.

Four strings are hardcoded in the renderer and not read from Codex. The seated action label is not consumed.

OAR1 ready for operator review.
