---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend
title: OAR2 — Correct Educational Diagnostic Passage Institutional Copy
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_audit_educational_diagnostic_passage_content_seating_v1.meta.md
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - codex-copy
  - institutional-surface
  - diagnostic-passage
  - content-correction
---

# OAR2 — Correct Educational Diagnostic Passage Institutional Copy

## OBSERVED

Audit confirmed:

- title and subtitle are currently Codex-seated
- current copy remains too internal/systemic for the institutional threshold surface
- CTA labels are partially hardcoded in renderer
- seated action label is not being consumed by the renderer

The obsidian contract now resolves correctly.

Remaining drift is semantic and renderer-content related.

## ALIGNED

This surface is the lead-in to institutional evaluation.

The passage should communicate:

- operational ambiguity
- layered AI influence
- unstructured environments
- fragmented oversight
- unclear operational visibility

The surface must remain institutional-facing.

No native/internal passage language.

All approved copy must resolve from Codex metadata.

Frontend may not author semantic truth.

## ROUTED

### 1. Update metadata.title

For:

    educational_diagnostic_passage

Set:

    "How does the operational environment shape AI behavior?"

### 2. Update metadata.subtitle

Set:

    "AI instability often develops inside unstructured environments where oversight, connected systems, external tools, and operational decisions are not fully visible or clearly governed."

### 3. Renderer CTA correction

In:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Remove hardcoded CTA labels and render from seated action metadata.

The seated action label:

    "Continue to Evaluation"

must become the rendered primary CTA label.

Do not invent replacement CTA copy.

### 4. Preserve

Do not alter:

- styling contract
- material family
- routing behavior
- target encounter keys
- renderer structure
- media roles
- release state

## VALIDATION

Return:

- updated metadata
- renderer changes
- confirmation rendered CTA comes from metadata
- build result
- files modified

## DO NOT

- redesign the surface
- hardcode new copy in JSX
- alter assessment chamber behavior
- invent additional institutional language
- bypass Codex metadata

## SUCCESS CONDITION

The recognition passage resolves:

- institutional-facing title/subtitle from Codex metadata
- CTA label from seated action metadata
- obsidian styling from seated material contract

No semantic truth remains hardcoded in the renderer.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_correct_educational_diagnostic_passage_institutional_copy_v1.meta.md`

## CLOSE

Correct the content path.

Preserve authority order.
