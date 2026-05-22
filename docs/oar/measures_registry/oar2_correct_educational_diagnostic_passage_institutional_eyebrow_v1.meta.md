---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend
title: OAR2 — Correct Educational Diagnostic Passage Institutional Eyebrow
status: proposed
version: v1
operator: op044
system: measures_registry
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - frontend
  - codex-copy
  - institutional-surface
  - eyebrow-correction
---

# OAR2 — Correct Educational Diagnostic Passage Institutional Eyebrow

## OBSERVED

`educational_diagnostic_passage` now resolves its obsidian contract correctly.

However, the eyebrow remains too native/internal:

    "Recognition Passage"

This surface is institutional-facing and precedes diagnostic evaluation.

The current wording exposes native passage semantics on a public institutional threshold surface.

## ALIGNED

Copy must remain Codex-seated metadata.

No JSX-authored replacement.

No frontend hardcoding.

Correction must occur through seated metadata only.

## ROUTED

Update:

    measures_encounter_def.metadata.eyebrow

for:

    educational_diagnostic_passage

from:

    "Recognition Passage"

to:

    "Assessment Readiness"

Do not alter:

- renderer behavior
- styling contract
- material family
- media roles
- actions
- release state
- routing
- encounter keys

## VALIDATION

Return:

- updated metadata
- confirmation of eyebrow value
- files modified
- build result if frontend touched

## DO NOT

- redesign the surface
- modify JSX copy
- alter renderer logic
- change assessment chamber behavior
- invent additional institutional copy
- bypass Codex metadata

## SUCCESS CONDITION

Institutional-facing eyebrow renders:

    "Assessment Readiness"

from Codex metadata.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_correct_educational_diagnostic_passage_institutional_eyebrow_v1.meta.md`

## CLOSE

Correct semantic drift at the metadata layer.

Do not patch the renderer.
