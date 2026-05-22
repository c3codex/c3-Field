---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend
title: OAR2 — Add Registry Mark to Evaluation Question Faces
status: proposed
version: v1
operator: op044
system: measures_registry
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - evaluation-surface
  - registry-mark
  - branding-contract
  - frontend
---

# OAR2 — Add Registry Mark to Evaluation Question Faces

## OBSERVED

Evaluation question faces now resolve with corrected obsidian material boundaries and institutional-facing copy.

However, the Measures Registry branding mark is not yet present on the evaluation question faces.

The branding contract already exists and has been identified in runtime/media resolution.

## ALIGNED

This is a bounded renderer/media contract correction.

Do not redesign evaluation surfaces.

Do not hardcode image paths.

Do not introduce a second branding source.

The registry mark must resolve from the already-seated Measures Registry branding/media contract.

## ROUTED

### 1. Add registry mark to all evaluation question faces

Using the already-seated Measures Registry branding/media contract:

- add the registry mark to the upper-right corner of all evaluation question faces
- resolve the mark from the existing runtime/media contract
- preserve responsive behavior
- preserve material-family styling
- preserve question content and answer behavior

### 2. Preserve

Do not alter:

- question text
- answer options
- scoring
- evaluation flow
- routing
- assessment chamber behavior
- material contracts
- media authority structure

## VALIDATION

Return:

- files modified
- registry mark source path/contract used
- confirmation no hardcoded asset path was introduced
- runtime confirmation or screenshots if available
- build result

## DO NOT

- redesign the evaluation chamber
- hardcode image imports
- introduce decorative overlays unrelated to the seated mark
- alter unrelated encounter surfaces
- bypass runtime/media contract resolution

## SUCCESS CONDITION

All evaluation question faces display the Measures Registry mark in the upper-right corner using the seated branding/media contract.

No hardcoded branding paths or duplicate branding authorities introduced.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_add_registry_mark_to_evaluation_question_faces_v1.meta.md`

## CLOSE

Apply the branding contract through the existing runtime authority surface.
