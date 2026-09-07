---
document_type: oar2
authority_level: working
document_scope: measures_registry_encounter_contracts
title: OAR2 — Audit Current Encounter Styling Contracts Against Sitewide Contract
status: proposed
version: v1
operator: op044
system: measures_registry
source_contract:
  - measures_registry_sitewide_style_contract
source_oar1:
  - docs/oar/measures_registry/oar1_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - encounter-contracts
  - styling-contract
  - sitewide-contract
  - audit
  - codex-first
---

# OAR2 — Audit Current Encounter Styling Contracts Against Sitewide Contract

## OBSERVED

The Measures Registry sitewide runtime/style contract is now Codex-seated as governing authority.

Before further renderer work, encounter splitting, or visual correction, current encounter-level contracts must be audited against the seated sitewide contract.

The goal is to determine which encounters already comply, which require amendment, which lack contracts, and which contain legacy/local styling drift.

## ALIGNED

Do not implement corrections from this audit.

Do not rewrite encounter metadata.

Do not alter renderer behavior.

This is Codex-first contract comparison.

The seated sitewide style contract governs the layer beneath encounter contracts and renderer behavior.

Implementation order remains:

    sitewide_runtime_contract
        ↓
    encounter_contracts
        ↓
    renderer_behavior
        ↓
    runtime_state

## ROUTED

Audit current Measures Registry encounter contracts against:

    measures_registry_sitewide_style_contract

### Required DB review

Inspect current encounter metadata for:

- styling_contract
- layout_contract
- media_behavior_contract
- branding_contract
- footer_contract
- transition_contract
- actions
- media_roles
- renderer
- function_layer
- state_expression
- release/access state where relevant

### Required encounter inventory

Produce an encounter-by-encounter table covering all Measures Registry runtime surfaces, including at minimum:

- landing_root
- landing_path_choice
- educational_diagnostic_passage
- educate_eval_encounter
- iis_eval_gate1
- measures_ai_operational_evaluation
- evaluation_result if present
- cohort_conversion_encounter
- understand_failure
- c3_field
- reserve_seat
- foundation_offering
- systems_offering
- foundation_seat_hold
- systems_seat_hold
- structural_drift_dispatches
- publication_dispatch
- registered_process_log
- seat_hold_notification_review

### Required classification

For each encounter classify:

- compliant
- partially compliant
- missing contract
- conflicting contract
- renderer-only styling
- legacy/local override
- orphaned seated contract
- needs new encounter row
- needs amendment
- should preserve

### Required comparison domains

Compare encounter contracts against the seated sitewide contract clauses:

- typography
- color/material
- buttons/icons
- media behavior
- marble tone
- viewport/containment
- branding
- footer/copyright
- transitions
- encounter isolation

## DO NOT

- update DB state
- edit CSS
- edit renderer code
- create new encounter contracts
- split evaluation flow yet
- remove legacy branches
- patch visual issues
- infer missing contracts as present

## RETURN

Report:

- DB contracts inspected
- runtime files inspected if needed
- encounter inventory
- compliance classification table
- missing contract list
- conflicting contract list
- renderer-only styling list
- orphaned contract list
- recommended amendment order
- recommended next OAR2

## SUCCESS CONDITION

The system has a complete map of current encounter-level styling/runtime contracts against the seated sitewide style contract before further implementation.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_audit_current_encounter_styling_contracts_against_sitewide_contract_v1.meta.md`

## CLOSE

Audit encounter contracts before renderer work.
