---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR2 — Reposition Contact Capture to Eval Email Contract and Remove Header Bleed
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_audit_registered_runtime_for_legacy_residue_after_renderer_alignment_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
  - docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-qa
  - contact-capture
  - eval-email-contract
  - header-bleed
  - registered-runtime
  - codex-first
---

# OAR2 — Reposition Contact Capture to Eval Email Contract and Remove Header Bleed

## OBSERVED

Runtime QA confirms the registered runtime is mostly functioning, but two go-readiness issues remain.

### 1. Header / brand bleed

The Measures Registry runtime displays parent/global navigation not belonging to the Measures Registry governed 13 contract:

- `c3 Field`
- `Contact`

This appears in the active Measures Registry surface header and should not be part of the Measures Registry public runtime contract.

Measures Registry should render Measures Registry branding only unless a specific seated encounter contract calls for another link.

### 2. Contact capture timing

`connect_src` was converted to a pre-assessment soft SRC intake surface.

QA now clarifies this is not the correct user flow.

Contact capture should not occur before the assessment questions.

The correct timing is after the final evaluation question, while the assessment package is being generated.

The correct route is:

    measures_assessment -> measures_eval_email_contract

and, for the structure path:

    structured_eval -> measures_eval_email_contract

The `measures_eval_email_contract` surface should collect delivery/contact fields and then continue to the assessment result / recommended structural response path.

## ALIGNED

This is a runtime flow and contract-alignment correction.

Do not redesign the site.

Do not alter assessment scoring.

Do not fork assessment mechanics.

Do not implement email dispatch.

Do not expose payment logic.

Do not delete deprecated rows.

Do not create new DB tables.

Do not hardcode semantic copy outside seated metadata.

Frontend must continue rendering seated Codex state only.

## ROUTED

### 1. Remove Measures Registry header bleed

Inspect the global/header/nav rendering in `src/measures_registry/MeasuresRegistryRuntime.tsx` and any related shell surface.

Remove or suppress from Measures Registry runtime:

- `c3 Field`
- `Contact`

unless explicitly seated by the Measures Registry sitewide style contract or an encounter contract.

Expected Measures Registry header behavior:

- Measures Registry brand only
- registry mark if seated
- no parent/global c3 Field nav
- no generic Contact nav
- no visual title overlap with encounter content

Do not remove unrelated app shell behavior outside Measures Registry unless required and reported.

### 2. Stop using connect_src as pre-assessment gate

Current route behavior to remove:

    eval_passage -> connect_src -> measures_assessment

    structure_passage -> connect_src -> structured_eval

Correct route behavior:

    eval_passage -> measures_assessment

    structure_passage -> structured_eval

`connect_src` may remain seated and traceable, but it should not be reached as a pre-assessment step in the registered public flow.

Do not delete `connect_src`.

If retained, mark or document it as held / unused / future institutional intake unless current contract requires a different state.

### 3. Route assessment completion to measures_eval_email_contract

Update assessment completion routing so that after the final evaluation question / assessment capture step:

    measures_assessment -> measures_eval_email_contract

and:

    structured_eval -> measures_eval_email_contract

This replaces premature movement to:

    measures_phases_reveal

where contact capture has not yet occurred.

Do not alter scoring.

Do not fork structured_eval.

Do not change question order.

### 4. Convert measures_eval_email_contract into post-question delivery intake

`measures_eval_email_contract` should become the contact/delivery capture step while the assessment package is being generated.

Required fields:

- institution / company name
- business type
- contact name
- contact email

Purpose language:

    Your assessment is being generated. Enter where the completed assessment package and recommended structural response should be sent.

The email package contract remains:

- assessment result
- primary finding
- assessment interpretation
- recommended structural response
- reserve seat path

It does not include phase reveal.

Email dispatch remains deferred unless already seated and explicitly authorized elsewhere.

### 5. Route after email contract capture

After the user completes `measures_eval_email_contract`, route to:

    measures_phases_reveal

Then continue existing convergence:

    measures_phases_reveal
        -> about_measures_registry
        -> structural_drift_publication
        -> reserve_seat
        -> phase_payment

If the current `structural_drift_publication -> measures_eval_email_contract` route exists, update it if needed to avoid looping backward into contact capture after it has already been completed.

Preferred route after structural drift:

    structural_drift_publication -> reserve_seat

unless existing eval report state requires a different non-looping route.

### 6. Preserve assessment mechanics

Confirm:

- measures_assessment scoring unchanged
- structured_eval scoring unchanged
- structured_eval still references measures_assessment mechanics
- no scoring fork introduced
- no assessment question text changed
- no result interpretation logic changed except route target

### 7. Soft contact data handling

Use existing runtime state / approved mechanism where possible.

If current backend supports storing the captured delivery fields through an existing approved intake mechanism, use it.

If persistent storage is not seated:

- keep delivery fields in runtime state
- pass into the assessment package view where supported
- report persistent storage as future OAR need

Do not create new DB tables.

Do not invent new SRC authority.

### 8. Metadata / contract alignment

Update only necessary metadata for affected registered encounters.

Likely affected:

- eval_passage
- structure_passage
- measures_assessment
- structured_eval
- measures_eval_email_contract
- measures_phases_reveal
- structural_drift_publication
- connect_src if it needs to be marked held / non-primary

Required readback:

- measures_assessment route target
- structured_eval route target
- measures_eval_email_contract route-after-capture
- connect_src standing in public flow
- header/nav contract standing

### 9. Validate runtime branches

Validate left branch:

    eval_passage
        -> measures_assessment
        -> measures_eval_email_contract
        -> measures_phases_reveal

Validate right branch:

    structure_passage
        -> structured_eval
        -> measures_eval_email_contract
        -> measures_phases_reveal

Validate converged branch:

    measures_phases_reveal
        -> about_measures_registry
        -> structural_drift_publication
        -> reserve_seat
        -> phase_payment

Confirm no registered branch routes to:

- connect_src as pre-assessment gate
- cohort_conversion_encounter
- educate_eval_encounter
- iis_eval_gate1
- understand_failure
- foundation_offering
- systems_offering
- systems_seat_hold

### 10. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- redesign UI broadly
- delete connect_src
- delete deprecated rows
- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- create new DB tables
- invent new SRC authority
- hardcode copy outside seated metadata
- hardcode media URLs
- alter the registered 13 body except route timing
- reintroduce deprecated route bleed

## VALIDATION REQUIRED

Return:

- files modified
- DB rows modified, if any
- header/nav bleed source
- header/nav correction made
- connect_src before/after standing
- measures_assessment old route target
- measures_assessment new route target
- structured_eval old route target
- structured_eval new route target
- measures_eval_email_contract fields implemented
- route after email contract capture
- left branch runtime result
- right branch runtime result
- converged branch runtime result
- build result
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed
- confirmation no deprecated route bleed remains

## SUCCESS CONDITION

Measures Registry no longer displays `c3 Field` or `Contact` as active runtime header/nav bleed.

Contact capture no longer occurs before assessment.

After the final evaluation question, the runtime routes to:

    measures_eval_email_contract

where the user provides delivery/contact fields while the assessment package is generated.

Both registered branches continue cleanly to:

    measures_phases_reveal

No deprecated or precontract route bleed remains in the intended public flow.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_reposition_contact_capture_to_eval_email_contract_and_remove_header_bleed_v1.meta.md`

## CLOSE

Move contact capture to the moment of value.

Remove header bleed.

Keep the registered body clean.
