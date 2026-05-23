---
document_type: oar2
authority_level: working
document_scope: measures_registry_renderer_contracts
title: OAR2 — Assign Renderer Contracts for Registered Stub Encounters
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_codex_seat_active_registered_encounter_contracts_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - renderer-contracts
  - registered-runtime
  - stub-encounters
  - codex-first
---

# OAR2 — Assign Renderer Contracts for Registered Stub Encounters

## OBSERVED

The 8 active registered encounters with renderer continuity have Codex-seated contracts.

The remaining registered stub encounters require renderer assignment before full encounter contracts can be seated.

Target stub encounters:

1. structure_passage
2. structured_eval
3. measures_phases_reveal
4. about_measures_registry
5. measures_eval_email_contract

Renderer assignments must be determined before contract seating or renderer implementation.

## ALIGNED

This is renderer assignment and metadata contract planning only.

No renderer authoring.

No CSS edits.

No full contract seating for stub encounters yet.

No implementation from this OAR2 unless explicitly routed.

Renderer assignments must preserve the seated sitewide style contract and registered 13 runtime sequence.

Implementation order remains:

    sitewide_runtime_contract
        ↓
    encounter_contracts
        ↓
    renderer_behavior
        ↓
    runtime_state

## ROUTED

### 1. Assign renderer contract for structure_passage

Set intended renderer:

    diagnostic_explainer_passage

This encounter mirrors eval_passage as the right-path passage/orientation surface.

Set media role:

    measures_structured_enviroments

Approved seated copy for future contract seating:

    eyebrow: STRUCTURE READINESS

    title: How does a structured environment optimize AI performance?

    subtitle: AI performance improves when the operating environment is structured enough to clarify authority, connect relevant systems, define review paths, and make decisions traceable. Structure reduces drift and gives AI output a governed place to act.

Do not hardcode this copy in src.

### 2. Assign renderer contract for structured_eval

Set intended renderer:

    measures_registry_evaluation_chamber

This encounter reuses the assessment engine with structure-path framing.

It must share assessment mechanics with measures_assessment unless a later OAR2 explicitly seats a distinct mechanic.

Do not fork scoring logic.

### 3. Assign renderer contract for measures_phases_reveal

Set intended renderer:

    measures_phases_reveal

This is a new renderer assignment.

Purpose:

- post-assessment phase reveal
- convergence point for measures_assessment and structured_eval
- presents next governed runtime path
- may link to about_measures_registry

No renderer implementation in this OAR2.

### 4. Assign renderer contract for about_measures_registry

Set intended renderer:

    about_measures_registry

This is a new renderer assignment.

Purpose:

- institutional authority/context surface
- explains Measures Registry as registered runtime
- may route to structural_drift_publication

No renderer implementation in this OAR2.

### 5. Assign renderer contract for measures_eval_email_contract

Set intended renderer:

    measures_eval_email_contract

This is a new renderer assignment.

Purpose:

- governs assessment delivery email contract
- confirms what gets sent
- confirms recipient and consent/acknowledgment path
- routes toward reserve_seat

No renderer implementation in this OAR2.

### 6. Validate current DB standing

Return:

- current metadata for all 5 stub encounters
- whether each exists in measures_encounter_def
- whether renderer fields can be assigned in metadata without schema change
- whether media role measures_structured_enviroments exists in current media mapping
- whether measures_registry_evaluation_chamber can be reused for structured_eval without immediate renderer code changes
- any blockers before contract seating

### 7. Optional metadata assignment

If current schema and metadata pattern support renderer assignment safely, update only renderer-related metadata for the 5 stubs.

Do not seat full style/layout/media/footer contracts in this OAR2.

Allowed metadata updates:

- renderer
- intended_renderer
- renderer_contract_status: assigned
- source_sitewide_contract reference if not already present
- approved_copy_pending_contract for structure_passage only
- media_roles for structure_passage only

## DO NOT

- implement renderers
- edit frontend code
- edit CSS
- seat full encounter contracts
- invent copy beyond approved structure_passage copy
- alter runtime sequence
- alter transition rules
- change assessment scoring
- duplicate assessment mechanics
- delete or deprecate rows

## SUCCESS CONDITION

The 5 registered stub encounters have clear renderer assignments and are ready for full encounter contract seating.

Renderer implementation remains blocked until contracts are seated.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_assign_renderer_contracts_for_registered_stub_encounters_v1.meta.md`

## CLOSE

Assign renderer contracts before seating stub encounter contracts.
