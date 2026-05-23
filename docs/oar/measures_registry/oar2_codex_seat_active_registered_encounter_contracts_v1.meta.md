---
document_type: oar2
authority_level: working
document_scope: measures_registry_encounter_contracts
title: OAR2 — Codex Seat Active Registered Encounter Contracts
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_codex_reconcile_registered_13_encounter_rows_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - codex
  - encounter-contracts
  - sitewide-style-contract
  - registered-runtime
  - db-contract-seating
---

# OAR2 — Codex Seat Active Registered Encounter Contracts

## OBSERVED

Registered 13 encounter row reconciliation is complete.

DB now contains:

- 13 registered public encounter rows
- 7 deprecated legacy rows
- 14 transition rules
- registered runtime sequence

The next required operation is to seat encounter contracts for the active renamed/preserved encounters that already have renderer continuity or repurposed renderer continuity.

Recommended target encounters:

1. `ai_isnt_broken_intro`
2. `evaluate_structure_path`
3. `eval_passage`
4. `connect_src`
5. `measures_assessment`
6. `structural_drift_publication`
7. `reserve_seat`
8. `phase_payment`

Stub/new encounters are not included in this OAR2.

## ALIGNED

This is Codex contract seating only.

No renderer authoring.

No CSS edits.

No copy invention.

No media asset changes.

No transition rule changes unless validation reveals mismatch.

The seated sitewide style contract governs the layer beneath all encounter contracts:

    measures_registry_sitewide_style_contract

Encounter contracts must inherit from the seated sitewide contract and define only encounter-scoped requirements.

Implementation order remains:

    sitewide_runtime_contract
        ↓
    encounter_contracts
        ↓
    renderer_behavior
        ↓
    runtime_state

## ROUTED

### 1. Verify prerequisite authority

Before seating contracts, verify:

- `measures_registry_sitewide_style_contract` is seated and active
- registered 13 encounter rows exist
- target 8 encounter rows exist
- deprecated rows remain traceable
- transition rules remain intact

Stop and report if prerequisites fail.

### 2. Seat encounter contracts for 8 active encounters

Update `measures_encounter_def.metadata` for:

- `ai_isnt_broken_intro`
- `evaluate_structure_path`
- `eval_passage`
- `connect_src`
- `measures_assessment`
- `structural_drift_publication`
- `reserve_seat`
- `phase_payment`

Each target encounter must receive or preserve:

- `source_sitewide_contract`
- `contract_status`
- `styling_contract`
- `layout_contract`
- `media_behavior_contract` where applicable
- `branding_contract` where applicable
- `footer_contract` where applicable
- `transition_contract`
- `encounter_isolation_contract`

Do not remove existing metadata keys.

### 3. Encounter-specific contract requirements

#### ai_isnt_broken_intro

Seat as entry/intro encounter.

Requires:

- styling contract
- layout contract
- media behavior contract
- branding contract
- footer contract
- transition contract
- encounter isolation contract

Preserve renderer:

    epigraph_split_hero

#### evaluate_structure_path

Seat as binary path-selection encounter.

Requires:

- styling contract
- layout contract
- button contract / path action contract
- transition contract
- encounter isolation contract

Preserve renderer:

    measures_registry_path_choice

#### eval_passage

Promote existing stub contract to full passage contract.

Requires:

- full styling contract
- layout contract
- media behavior contract if passage media is seated
- transition contract
- encounter isolation contract

Preserve renderer:

    diagnostic_explainer_passage

#### connect_src

Seat as shared SRC-lite junction.

Requires:

- styling contract
- layout contract
- branding contract
- transition contract
- encounter isolation contract
- source/intake contract marker for stored and recallable soft SRC

Preserve renderer:

    static_authority_surface

#### measures_assessment

Extend existing evaluation chamber contract.

Preserve:

- existing styling_contract v3
- existing layout_contract v2
- existing evaluation mechanics
- existing assessment interpretation metadata
- existing assessment completion metadata

Add missing sitewide clauses:

- media_behavior_contract
- branding_contract
- footer_contract
- transition_contract
- encounter_isolation_contract

Preserve renderer:

    measures_registry_evaluation_chamber

#### structural_drift_publication

Seat as support publication encounter.

Requires:

- styling contract
- layout contract
- footer contract
- transition contract
- encounter isolation contract

Preserve renderer:

    structural_drift_dispatches

#### reserve_seat

Seat as reservation/intake commitment encounter.

Requires:

- styling contract
- layout contract
- button/action contract
- transition contract
- encounter isolation contract

Preserve renderer:

    reserve_seat_selector

#### phase_payment

Seat as phase commitment/payment encounter.

Requires:

- styling contract
- layout contract
- footer contract
- transition contract
- encounter isolation contract
- payment/commitment contract marker without implementing payment logic

Preserve renderer:

    hold_surface

### 4. Preserve runtime authority

Do not alter:

- renderer names
- transition rules
- action targets
- media paths
- release/access state unless validation proves mismatch
- assessment mechanics
- assessment scoring
- email artifact templates
- deprecated row metadata except if validation requires reference correction

### 5. Validation required

Return:

- DB table used
- rows updated
- contract fields seated per encounter
- validation query
- readback table for all 8 encounters
- confirmation sitewide contract binding exists on all 8
- confirmation existing metadata was preserved
- confirmation no renderer/CSS files modified

## DO NOT

- author contracts for stub/new encounters in this OAR2
- implement renderer changes
- edit CSS
- invent new copy
- alter scoring/evaluation behavior
- delete deprecated rows
- collapse encounter isolation
- create new authority surfaces

## SUCCESS CONDITION

The 8 active registered encounters have Codex-seated encounter contracts inheriting from `measures_registry_sitewide_style_contract`.

Contracts are retrievable, validated, and ready for renderer implementation planning.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_codex_seat_active_registered_encounter_contracts_v1.meta.md`

## CLOSE

Seat active encounter contracts before renderer work.
