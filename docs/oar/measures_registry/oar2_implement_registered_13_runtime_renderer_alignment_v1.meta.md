---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_implementation
title: OAR2 — Implement Registered 13 Runtime Renderer Alignment
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_codex_seat_stub_registered_encounter_contracts_v1.meta.md
  - docs/oar/measures_registry/oar1_codex_seat_active_registered_encounter_contracts_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - renderer-implementation
  - registered-runtime
  - encounter-contracts
  - codex-first
---

# OAR2 — Implement Registered 13 Runtime Renderer Alignment

## OBSERVED

All 13 registered public encounters now have Codex-seated encounter contracts.

Renderer implementation is unblocked.

The current runtime still needs to align src behavior to the registered 13 encounter structure, seated renderer contracts, sitewide style contract, and transition sequence.

The 5 previously stubbed encounters are now contracted:

1. structure_passage
2. structured_eval
3. measures_phases_reveal
4. about_measures_registry
5. measures_eval_email_contract

## ALIGNED

This is renderer alignment against seated Codex contracts.

Frontend does not author truth.

Renderer must read seated metadata, renderer assignments, contract fields, actions, media roles, and transition expectations.

Do not hardcode semantic copy.

Do not invent missing content.

Do not change DB state.

Do not alter assessment scoring.

Do not fork assessment mechanics.

Implementation order remains:

    sitewide_runtime_contract
        ↓
    encounter_contracts
        ↓
    renderer_behavior
        ↓
    runtime_state

## ROUTED

### 1. Verify contract standing before implementation

Before editing runtime code, verify in DB or current metadata read path:

- all 13 registered public encounters exist
- all 13 have contract_status = contracted
- all 13 are bound to measures_registry_sitewide_style_contract
- the 5 previously stubbed encounters have renderer assignments
- measures_transition_rule contains registered runtime sequence
- measures_assessment assessment mechanics remain seated
- structured_eval references measures_assessment mechanics authority and does not fork scoring

Stop and report if prerequisite contract standing is missing.

### 2. Align runtime to registered 13 encounter keys

Update runtime routing and surface resolution to use registered encounter keys:

1. ai_isnt_broken_intro
2. evaluate_structure_path
3. eval_passage
4. connect_src
5. measures_assessment
6. structure_passage
7. structured_eval
8. measures_phases_reveal
9. about_measures_registry
10. structural_drift_publication
11. measures_eval_email_contract
12. reserve_seat
13. phase_payment

Legacy keys may remain only as transitional aliases if required for backward compatibility, but active runtime flow must resolve registered keys.

Do not reintroduce deprecated public surfaces as active runtime routes.

### 3. Implement reusable renderer support

#### structure_passage

Use existing renderer family:

    diagnostic_explainer_passage

Render from seated metadata:

- approved copy / metadata title, subtitle, eyebrow
- media_roles including measures_structured_enviroments
- styling_contract
- layout_contract
- transition_contract
- encounter_isolation_contract

Route expectation:

    structure_passage -> connect_src

Do not hardcode passage copy.

#### structured_eval

Use existing renderer family:

    measures_registry_evaluation_chamber

Use shared assessment mechanics from:

    measures_assessment

Do not fork scoring.

Do not duplicate assessment mechanics.

Allow structure-path framing only where seated metadata supports it.

Route expectation:

    structured_eval -> measures_phases_reveal

### 4. Implement new contracted renderers

Implement renderers for:

#### measures_phases_reveal

Purpose:

- post-assessment convergence surface
- phase/path reveal after measures_assessment or structured_eval
- marble/lapis material direction
- routes to about_measures_registry

Render only seated metadata and contract fields.

#### about_measures_registry

Purpose:

- institutional authority/context surface
- renders approved_content_contract from metadata
- footer visible if footer_contract requires it
- route to structural_drift_publication

Do not hardcode approved content in JSX.

#### measures_eval_email_contract

Purpose:

- assessment package delivery contract surface
- render email_delivery_contract from metadata
- show assessment result, primary finding, assessment interpretation, recommended structural response, reserve seat path when available
- dispatch remains deferred unless already implemented in seated contract

Do not implement email sending in this OAR2.

Do not include phase reveal in email package.

Route expectation:

    measures_eval_email_contract -> reserve_seat

### 5. Preserve existing contracted renderers

Preserve behavior for:

- ai_isnt_broken_intro
- evaluate_structure_path
- eval_passage
- connect_src
- measures_assessment
- structural_drift_publication
- reserve_seat
- phase_payment

Modify only where necessary to align them to registered keys, sitewide contracts, or transition routing.

### 6. Remove or contain legacy runtime drift

Do not delete deprecated rows.

In src, ensure deprecated encounter keys are not reachable as public active runtime routes unless intentionally mapped as transitional aliases.

Deprecated public encounters:

- educate_eval_encounter
- iis_eval_gate1
- cohort_conversion_encounter
- understand_failure
- foundation_offering
- systems_offering
- systems_seat_hold

If legacy aliases remain, document them.

### 7. Validate full registered runtime sequence

Validate the intended sequence:

    ai_isnt_broken_intro
        ↓
    evaluate_structure_path
        ├─ eval_passage
        │      ↓
        │   connect_src
        │      ↓
        │   measures_assessment
        │      ↓
        │   measures_phases_reveal
        │
        └─ structure_passage
               ↓
            connect_src
               ↓
            structured_eval
               ↓
            measures_phases_reveal

    measures_phases_reveal
        ↓
    about_measures_registry
        ↓
    structural_drift_publication
        ↓
    measures_eval_email_contract
        ↓
    reserve_seat
        ↓
    phase_payment

### 8. Validation required

Return:

- files modified
- runtime keys updated
- new renderer functions/components added
- reused renderer paths confirmed
- legacy aliases retained or removed
- build result
- route validation result
- confirmation no DB state changed
- confirmation no assessment scoring fork introduced
- confirmation email dispatch not implemented
- confirmation phase reveal excluded from email package
- confirmation copy renders from metadata, not JSX hardcode

## DO NOT

- edit DB state
- edit CSS unless required for renderer containment and explicitly reported
- hardcode approved content
- invent new copy
- alter assessment scoring
- fork structured_eval mechanics
- implement email sending
- delete deprecated DB rows
- remove working runtime assets
- bypass seated contracts
- activate unreleased surfaces without separate activation OAR

## SUCCESS CONDITION

The Measures Registry frontend runtime resolves the registered 13 encounter architecture from seated Codex contracts.

The 5 previously stubbed encounters render or route according to their seated contracts.

The full registered website flow is build-valid and ready for runtime verification.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md`

## CLOSE

Implement renderer alignment against seated contracts.

No frontend-owned truth.
