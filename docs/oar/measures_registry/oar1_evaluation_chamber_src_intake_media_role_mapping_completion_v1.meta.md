---
document_type: oar1
authority_level: closeout
document_scope: evaluation_chamber_src_intake_media_role_mapping_completion
title: OAR1 - Evaluation Chamber SRC Intake + Media Role Mapping Completion v1
status: completed_with_ambient_audio_held
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_evaluation_chamber_src_intake_media_role_mapping_completion_v1.meta.md
tags:
  - measures-registry
  - evaluation-chamber
  - src-intake
  - media-role-mapping
  - db-contract
---

# OAR1 - Evaluation Chamber SRC Intake + Media Role Mapping Completion v1

## CLOSED SCOPE

Corrected the seam between the Evaluation Chamber encounter contract, SRC-held institutional intake, Gate 1 completion, and runtime media-role authority.

This OAR1 is a DB-seated contract closeout. The frontend remains a renderer of seated state.

## DB CONTRACT SEATED

Execution:

```powershell
node docs/oar/measures_registry/execute-measures-registry-evaluation-encounter-contract.cjs
```

Evidence:

```text
docs/oar/measures_registry/evaluation_chamber_src_intake_media_role_mapping_completion_v1_evidence.json
```

Live readback confirmed:

- `source_oar2 = docs/oar/measures_registry/oar2_evaluation_chamber_src_intake_media_role_mapping_completion_v1.meta.md`
- `encounter_key = measures_ai_operational_evaluation`
- `renderer_key = measures_registry_evaluation_chamber`
- `theme_key = evaluation_chamber_lapis_obsidian_v1`
- `encounter_contract.version = v2`
- `question_count = 5`
- `answer_count = 15`

## SRC INTAKE CONTRACT

Seated in `measures_encounter_def.metadata.src_intake_contract`:

- required fields:
  - `institution_name`
  - `institution_type`
  - `institution_address`
  - `institution_phone`
  - `contact_name`
  - `contact_position`
  - `contact_email`
  - `intent`
- optional field:
  - `capture_context`
- `institution_type_route = metadata.institution_type`
- `capture_table = public.measures_iis_eval_gate1_capture`
- `schema_change_required = false`

The existing capture table supports the required SRC route without a schema migration because `institution_type` is preserved in metadata.

## GATE 1 COMPLETION RULE

Seated in `measures_encounter_def.metadata.gate_1_completion_rule`:

Complete:

```json
{
  "gate_1": "complete",
  "assessment_returned": true,
  "src_requirements_satisfied": true
}
```

Held:

```json
{
  "gate_1": "held",
  "src_requirements_satisfied": false
}
```

Runtime submission now requires the SRC-held fields before assessment progression and writes the complete eligibility marker only after assessment return.

## MEDIA ROLE MAPPINGS

Seated in `measures_media_map`:

| media_role | storage_bucket | storage_path | status |
| --- | --- | --- | --- |
| `background` | `measures-registry` | `lapis_background.webp` | public HEAD 200 |
| `watermark` | `measures-registry` | `measures_registry_emblem_watermark_preview_lapis.webp` | public HEAD 200 |
| `question_chamber_background` | `measures-registry` | `evaluation_chamber_reference.webp` | public HEAD 200 |
| `assessment_background` | `measures-registry` | `obsidian_background.webp` | public HEAD 200 |
| `transition_or_pause` | `measures-registry` | `return_antechamber.webp` | public HEAD 200 |

The previously seated compatibility roles remain active:

- `lapis_background`
- `registry_watermark`
- `registry_mark`
- `evaluation_reference_image`

## HELD MEDIA ROLE

`ambient_audio` remains held.

Reason:

- no audio object was present in the `measures-registry` bucket during execution

Expected future path:

- `measures-registry/ambient_audio.*`

No frontend fallback audio was introduced.

## SRC RENDERER ALIGNMENT

Updated renderer behavior:

- identity form captures all required SRC-held fields
- `institution_type` routes to insert metadata
- `intent` is captured explicitly
- `capture_context` remains optional/contextual
- eligibility marks Gate 1 complete only after SRC requirements and assessment return
- media background/watermark resolution now prefers seated generic OAR2 roles
- live `iis_eval_gate1` now receives seated generic background and watermark roles instead of null media props
- evaluation chamber now carries a compact `layout_contract` for single-screen initial copy fit
- same compact evaluation styling/layout contract is seated onto live `iis_eval_gate1`
- SRC capture renders from the compact evaluation-style layout contract rather than a standalone long-form page

Updated files:

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/measures_registry/MeasuresAssessmentChamber.tsx`
- `src/index.css`

## VALIDATION

DB seating:

- passed
- live readback confirmed SRC contract, Gate 1 rule, media role mappings, and held `ambient_audio`

TypeScript:

```powershell
npx.cmd tsc --noEmit
```

Result:

- passed

Measures build:

```powershell
npm.cmd run build:registry
```

Result:

- passed
- output: `dist-registry`

## CLOSEOUT ASSESSMENT

OAR2 resolved with one explicit held media role.

The runtime registry now carries the SRC intake contract, Gate 1 completion rule, and complete visual media-role mappings required to remove the chamber media warning by resolving its cause. The `ambient_audio` role is not invented because the required bucket object is absent.

Next routing:

Upload or seat an approved `ambient_audio` asset in `measures-registry`, then run a narrow media-role completion OAR if audio control is required.
