---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend
title: OAR2 — Correct Educational Diagnostic Passage Obsidian Contract Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_audit_obsidian_contract_resolution_failure_v1.meta.md
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - frontend
  - obsidian
  - contract-resolution
  - renderer-correction
  - codex-metadata
---

# OAR2 — Correct Educational Diagnostic Passage Obsidian Contract Resolution

## OBSERVED

Audit confirmed `educational_diagnostic_passage` is rendering outside its seated obsidian contract.

The OAR1 audit found:

- `material_family = "obsidian"` is seated on the encounter definition column
- `metadata.styling_contract` is absent
- runtime query does not currently expose `material_family`
- renderer does not apply `data-material-family`
- obsidian CSS selector exists and would fire if the attribute were present
- hardcoded JSX copy is present in the passage renderer

Source audit: `docs/oar/measures_registry/oar1_audit_obsidian_contract_resolution_failure_v1.meta.md`.

## ALIGNED

This is not a redesign task.

Correction must restore seated contract resolution:

Codex -> Field -> Measures -> material/style contract -> renderer -> CSS contract

Frontend may not manually simulate obsidian styling.

No component-owned truth.

No hardcoded semantic copy.

## ROUTED

### 1. DB metadata correction

Update the `educational_diagnostic_passage` row in `measures_encounter_def`.

Seat:

    "styling_contract": {
      "material_family": "obsidian"
    }

inside `metadata`.

Do not remove existing metadata keys.

Do not rename encounter keys.

Do not change release/access state.

### 2. Renderer correction

In `src/measures_registry/MeasuresRegistryRuntime.tsx`:

- read `educationalDiagnosticPassageCopy.stylingContract?.material_family`
- apply it as `data-material-family` to the passage `<main>`
- follow the existing assessment chamber material pattern where applicable

### 3. Hardcoded copy correction

Remove:

    <p>This passage prepares the assessment chamber.</p>

or replace it only with a Codex-seated metadata value.

If no seated metadata value exists, remove the line.

Do not invent replacement copy in JSX.

### 4. Validation

Return:

- files modified
- DB row updated
- metadata after update
- build result
- confirmation that `data-material-family="obsidian"` is applied from metadata
- confirmation that hardcoded copy was removed or replaced from seated metadata only

## DO NOT

- redesign the passage
- hardcode obsidian Tailwind/classes
- create new registry keys
- alter unrelated surfaces
- change assessment chamber behavior
- change routing
- change Supabase schema
- invent new copy
- bypass metadata contract

## CODY / CLAUDE ROLE

Executor may implement only the routed correction.

Executor must stop and report if:

- the encounter row is missing
- metadata update cannot be verified
- material contract path is ambiguous
- build fails from unrelated causes

## SUCCESS CONDITION

`educational_diagnostic_passage` resolves obsidian styling through the seated metadata contract and renderer attribute application.

The passage must render obsidian because the contract is honored, not because visual styling was manually patched.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_correct_educational_diagnostic_passage_obsidian_contract_resolution_v1.meta.md`

## CLOSE

Correct the contract path.

Do not restyle the symptom.
