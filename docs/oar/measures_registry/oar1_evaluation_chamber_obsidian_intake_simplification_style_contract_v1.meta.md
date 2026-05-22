---
document_type: oar1
authority_level: closeout
document_scope: evaluation_chamber_obsidian_intake_simplification_style_contract
title: OAR1 - Evaluation Chamber Obsidian Intake Simplification + Style Contract v1
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_evaluation_chamber_obsidian_intake_simplification_style_contract_v1.meta.md
tags:
  - measures-registry
  - evaluation-chamber
  - obsidian
  - intake
  - style-contract
  - db-contract
---

# OAR1 - Evaluation Chamber Obsidian Intake Simplification + Style Contract v1

## CLOSED SCOPE

Simplified the Evaluation Chamber visible identity intake and shifted the Gate 1 assessment surface into an obsidian threshold contract.

The frontend remains a renderer of seated Measures state. Visible fields, required entry fields, deferred SRC fields, material family, layout fit, and style direction are seated in DB metadata.

## DB CONTRACT SEATED

Execution:

```powershell
node docs/oar/measures_registry/execute-evaluation-chamber-obsidian-intake-simplification-style-contract.cjs
```

Evidence:

```text
docs/oar/measures_registry/evaluation_chamber_obsidian_intake_simplification_style_contract_v1_evidence.json
```

Readback confirmed for both `iis_eval_gate1` and `measures_ai_operational_evaluation`:

- `material_family = obsidian`
- `styling_contract.material_family = obsidian`
- `layout_contract.viewport_fit = single_screen_initial_view`
- `frontend_hardcode_allowed = false`
- 5 assessment questions
- 3 options per question

## INTAKE SIMPLIFICATION

Seated visible identity fields:

- `institution_name`
- `institution_type`
- `contact_name`
- `contact_email`

Seated deferred SRC fields:

- `institution_address`
- `institution_phone`
- `contact_position`
- `assessment_intent`
- `capture_context`

The deferred fields remain represented in `metadata.src_intake_contract.deferred_src_fields` and do not block assessment entry.

## RENDERER ALIGNMENT

Updated renderer behavior:

- visible intake fields are read from `src_intake_contract.visible_fields`
- entry validation uses `src_intake_contract.entry_required_fields`
- `institution_type` continues to route to metadata
- hidden capture table columns are submitted as empty/default governed values where the existing table requires non-null values
- deferred SRC standing is written into submitted metadata
- `data-material-family` is derived from the seated style contract
- optional question context is not rendered in the compact chamber

Updated files:

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/measures_registry/MeasuresAssessmentChamber.tsx`
- `src/index.css`
- `docs/oar/measures_registry/execute-evaluation-chamber-obsidian-intake-simplification-style-contract.cjs`

## VISUAL CONTRACT

The chamber now renders as an obsidian threshold surface:

- reduced lapis/blue dominance
- visible restrained Measures watermark
- capsule/beveled plaque intake fields
- numbered capsule/plaque answer options
- compact viewport-aware question and intake layouts
- Begin/Continue and Audio controls remain visible at default 720px verification height

No media fallback or CSS suppression of missing registry state was introduced.

## VALIDATION

DB seating:

- passed
- readback captured in evidence JSON

Measures build:

```powershell
npm.cmd run build:registry
```

Result:

- passed
- output: `dist-registry`

Local browser verification:

- `iis_eval_gate1` initial view rendered 4 visible fields only
- hidden fields no longer appeared in the first chamber
- `data-material-family = obsidian`
- `data-layout-fit = single_screen_initial_view`
- media warning not visible because seated media roles were present
- diagnostic step rendered 3 answer options
- all 3 answer options and Continue/Audio controls fit within the 720px viewport

## CLOSEOUT ASSESSMENT

OAR2 resolved.

The visible intake now behaves as a minimal threshold identity capture rather than an administrative SRC form. SRC completeness remains represented as governed deferred metadata instead of being flattened into the first visual screen. The assessment chamber reads as obsidian and continues through the seated five-question, three-option evaluation mechanics.
