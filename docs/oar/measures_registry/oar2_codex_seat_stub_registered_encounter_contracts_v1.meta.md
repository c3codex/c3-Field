---
document_type: oar2
authority_level: working
document_scope: measures_registry_encounter_contracts
title: OAR2 — Codex Seat Stub Registered Encounter Contracts
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_assign_renderer_contracts_for_registered_stub_encounters_v1.meta.md
  - docs/oar/measures_registry/oar1_codex_seat_active_registered_encounter_contracts_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - codex
  - encounter-contracts
  - stub-encounters
  - registered-runtime
  - db-contract-seating
---

# OAR2 — Codex Seat Stub Registered Encounter Contracts

## OBSERVED

Renderer assignments are seated for the 5 registered stub encounters:

1. structure_passage
2. structured_eval
3. measures_phases_reveal
4. about_measures_registry
5. measures_eval_email_contract

All 5 remain:

    contract_status: pending_contract

The next operation is to seat full encounter contracts for these 5 stubs before renderer implementation begins.

The about_measures_registry page content has now been operator-approved and may be included in this contract seating pass.

## ALIGNED

This is Codex contract seating only.

No renderer implementation.

No CSS edits.

No copy invention beyond operator-approved copy included in this OAR2.

No scoring fork.

No media asset change.

No route mutation except contract-defined route expectations.

The seated sitewide style contract governs all encounter contracts:

    measures_registry_sitewide_style_contract

Implementation order remains:

    sitewide_runtime_contract
        ↓
    encounter_contracts
        ↓
    renderer_behavior
        ↓
    runtime_state

## ROUTED

### 1. Verify prerequisites

Before seating contracts, verify:

- measures_registry_sitewide_style_contract is active
- all 5 target stub encounters exist
- all 5 have renderer_contract_status = assigned
- all 5 are bound to source_sitewide_contract
- registered 13 sequence remains seated
- transition rules remain intact

Stop and report if prerequisites fail.

### 2. Seat full contract for structure_passage

Encounter:

    structure_passage

Renderer:

    diagnostic_explainer_passage

Purpose:

Right-path passage/orientation surface before shared SRC connection.

Seat:

- contract_status: contracted
- styling_contract
- layout_contract
- media_behavior_contract
- transition_contract
- encounter_isolation_contract

Material direction:

- obsidian threshold
- structured environment orientation
- restrained institutional passage
- no SaaS dashboard styling
- no native ceremonial language

Media role:

    measures_structured_enviroments

Approved copy:

    eyebrow: STRUCTURE READINESS

    title: How does a structured environment optimize AI performance?

    subtitle: AI performance improves when the operating environment is structured enough to clarify authority, connect relevant systems, define review paths, and make decisions traceable. Structure reduces drift and gives AI output a governed place to act.

Route expectation:

    structure_passage -> connect_src

Do not hardcode copy in src.

### 3. Seat full contract for structured_eval

Encounter:

    structured_eval

Renderer:

    measures_registry_evaluation_chamber

Purpose:

Right-path structured evaluation using the shared Measures assessment engine with structure-path framing.

Seat:

- contract_status: contracted
- styling_contract
- layout_contract
- media_behavior_contract
- branding_contract where applicable
- transition_contract
- encounter_isolation_contract
- shared_assessment_mechanics_contract

Assessment rule:

    structured_eval shares assessment mechanics with measures_assessment.

No scoring fork.

No separate assessment mechanics unless routed by future OAR2.

Route expectation:

    structured_eval -> measures_phases_reveal

### 4. Seat full contract for measures_phases_reveal

Encounter:

    measures_phases_reveal

Renderer:

    measures_phases_reveal

Purpose:

Post-assessment convergence and phase-path reveal.

This encounter shows the next governed runtime path after either:

- measures_assessment
- structured_eval

Seat:

- contract_status: contracted
- styling_contract
- layout_contract
- media_behavior_contract if required
- transition_contract
- encounter_isolation_contract

Material direction:

- marble / lapis orientation
- structured reveal
- institutional clarity
- not an assessment result page
- not an email package

Route expectation:

    measures_phases_reveal -> about_measures_registry

### 5. Seat full contract for about_measures_registry

Encounter:

    about_measures_registry

Renderer:

    about_measures_registry

Purpose:

Institutional authority/context surface.

Explains Measures Registry as a registered governance runtime.

Seat:

- contract_status: contracted
- styling_contract
- layout_contract
- branding_contract
- footer_contract
- transition_contract
- encounter_isolation_contract
- approved_content_contract

Material direction:

- marble with lapis support
- institutional authority
- clear explanation
- registered website context
- restrained registry mark
- footer visible

Approved content:

    eyebrow: ABOUT MEASURES REGISTRY

    title: A registered environment for governing AI behavior.

    subtitle: Measures Registry helps institutions identify, structure, and govern the operational environments where AI systems produce influence, decisions, and risk.

    primary_statement: AI governance cannot depend on model choice alone. It requires a registered environment where authority, review, system behavior, and operational accountability can be seen, traced, and maintained.

    support_points:
      1. Behavior that is not registered cannot be governed.
      2. AI output is shaped by the environment around it.
      3. Structure makes review, responsibility, and correction possible.
      4. Registered systems reduce drift by making operational behavior visible.
      5. Measures Registry provides a pathway from assessment to structured response.

    cta_label: Read Structural Drift

    cta_target: structural_drift_publication

Tone:

- institutional
- clear
- trustworthy
- not sales-heavy
- not mystical/native-facing
- not too technical

Route expectation:

    about_measures_registry -> structural_drift_publication

Do not hardcode copy in src.

### 6. Seat full contract for measures_eval_email_contract

Encounter:

    measures_eval_email_contract

Renderer:

    measures_eval_email_contract

Purpose:

Assessment package delivery contract after completion.

This encounter governs delivery of the completed assessment package.

It sends:

- assessment result
- primary finding
- assessment interpretation
- recommended structural response
- reserve seat path

It does not send phase reveal.

Seat:

- contract_status: contracted
- styling_contract
- layout_contract
- email_delivery_contract
- transition_contract
- encounter_isolation_contract

Email contract type:

    assessment_package_delivery

Requires:

- completed assessment
- recipient email
- recommended structural response generated
- reserve seat route available

Stores:

- delivery timestamp
- recipient email
- assessment reference
- recommended response reference
- reserve seat route
- delivery status

Route expectation:

    measures_eval_email_contract -> reserve_seat

Email package structure:

    Subject:
    Your Measures Registry Assessment Package

    Preheader:
    Your assessment result and recommended structural response are enclosed.

    Body sections:
    - Measures Registry Assessment Package
    - Assessment Result
    - Primary Finding
    - Recommended Structural Response
    - Reserve Seat
    - Record / recall reference
    - Footer / copyright

Tone:

- institutional
- clear
- short
- non-sales
- governed
- traceable

Do not implement email dispatch in this OAR2.

### 7. Preserve existing metadata

Do not remove existing metadata keys.

Preserve:

- renderer
- intended_renderer
- renderer_contract_status
- source_sitewide_contract
- approved_copy_pending_contract where present
- media_roles where present
- assessment_mechanics_note where present
- renderer_purpose where present
- registered runtime sequence references

### 8. Validation required

Return:

- DB table used
- rows updated
- contract fields seated per encounter
- validation query
- readback table for all 5 encounters
- confirmation all 5 are sitewide bound
- confirmation all 5 contract_status = contracted
- confirmation no renderer/CSS files modified
- confirmation no assessment scoring fork was introduced
- confirmation email contract excludes phase reveal and includes recommended structural response
- confirmation about_measures_registry approved content is seated from metadata

## EXECUTOR ROLE

Executor may:

- inspect required DB state
- update measures_encounter_def metadata for the 5 listed encounters
- preserve existing metadata through merge patching
- return validation queries and readback

Executor may not:

- implement renderers
- edit frontend code
- edit CSS
- invent copy
- alter scoring
- fork assessment mechanics
- change transition rules unless validation proves mismatch and operator approval follows

## DO NOT

- implement renderers
- edit frontend code
- edit CSS
- invent copy beyond approved copy in this OAR2
- implement email sending
- change assessment scoring
- fork assessment mechanics
- alter runtime sequence
- alter transition rules
- delete deprecated rows
- change media assets

## SUCCESS CONDITION

The 5 registered stub encounters have full Codex-seated encounter contracts inheriting from measures_registry_sitewide_style_contract.

All 13 registered public encounters now have seated contracts or confirmed contracted standing.

Renderer implementation remains blocked until contract seating is validated.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_codex_seat_stub_registered_encounter_contracts_v1.meta.md`

## CLOSE

Seat stub encounter contracts before renderer implementation.
