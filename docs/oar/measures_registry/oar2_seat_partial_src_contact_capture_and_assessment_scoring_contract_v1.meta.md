---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Seat Partial SRC Contact Capture and Assessment Scoring Contract
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_read_only_db_contract_for_eval_email_capture_and_assessment_flow_v1.meta.md
  - docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
  - docs/oar/measures_registry/oar1_resequence_assessment_capture_and_resolving_interstitial_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - partial-src
  - contact-capture
  - email-contract
  - assessment-scoring
  - registered-runtime
  - codex-first
---

# OAR2 — Seat Partial SRC Contact Capture and Assessment Scoring Contract

## OBSERVED

Read-only DB contract inspection clarified the active seam.

`measures_eval_email_contract` is not the assessment report display surface.

It is the contract for the email package sent after evaluation.

The DB contract defines:

- `renderer: measures_eval_email_contract`
- `function_layer: intake`
- `route_after_capture: measures_phases_reveal`
- `email_delivery_contract.contract_type: assessment_package_delivery`
- includes: `recommended_structural_response`
- excludes: `phase_reveal`
- requires: `completed_assessment`, `recipient_email`, `recommended_structural_response_generated`, `reserve_seat_route_available`
- dispatch implementation: deferred

The DB contract does not seat:

- `assessment_package`
- `result_display`
- `report_display`
- pre-submit findings display

Therefore the current report dump on `measures_eval_email_contract` is renderer drift.

Operator clarification:

1. A separate site contact capture / partial SRC surface is required to retain contact info.
2. The email contract should govern the package sent after evaluation.
3. A resolving interstitial is not required if contact capture explains that the report is processing.
4. Assessment outcome must be score-based. A user answering all low-risk answers must not receive a fixed “Structural Drift Detected” result.

## ALIGNED

This OAR2 corrects contract separation and assessment result logic.

Required distinction:

    contact capture / partial SRC
        captures and retains contact standing

    measures_eval_email_contract
        governs what email package will be sent after evaluation

Do not collapse these contracts.

Do not use `measures_eval_email_contract` as a full report display page.

Do not use a fixed assessment result label independent of answers.

Do not implement email dispatch.

Do not expose payment logic.

Frontend must render seated Codex state only.

## ROUTED

### 1. Re-seat contact capture as partial SRC standing

Use existing registered encounter:

    connect_src

as the partial SRC / site contact capture surface unless a better already-seated encounter exists.

Do not rename the encounter key in this OAR.

Update contract/metadata for `connect_src` if needed:

- standing: `partial_src_contact_capture`
- function_layer: `intake`
- renderer: `site_contact_capture` or existing compatible renderer if already seated
- purpose: captures site contact information after completed evaluation questions
- route_after_capture: `measures_eval_email_contract`
- source_sitewide_contract preserved
- encounter isolation preserved

Contact fields:

- institution / company name
- business type
- contact name
- contact email

Required copy intent:

    Your assessment is being prepared.
    Enter the contact information where the completed assessment package and recommended structural response should be sent.

Do not make this a pre-assessment gate.

### 2. Correct active runtime sequence

Update active registered flow.

Left branch:

    eval_passage
        -> measures_assessment
        -> final question
        -> connect_src / partial SRC contact capture
        -> measures_eval_email_contract
        -> measures_phases_reveal

Right branch:

    structure_passage
        -> structured_eval
        -> final question
        -> connect_src / partial SRC contact capture
        -> measures_eval_email_contract
        -> measures_phases_reveal

Converged branch:

    measures_phases_reveal
        -> about_measures_registry
        -> structural_drift_publication
        -> reserve_seat
        -> phase_payment

Do not route final question directly to `measures_eval_email_contract`.

Do not route contact capture before evaluation questions.

Do not reintroduce deprecated surfaces.

### 3. Remove resolving interstitial requirement

Remove the resolving interstitial as a required step in the active public flow.

If any resolving state remains as harmless internal state, it must not be required for navigation and must not appear as a public interstitial unless separately contracted.

Correct active sequence:

    final question
        -> contact capture
        -> email contract confirmation
        -> measures_phases_reveal

No 4-second delay required.

### 4. Correct measures_eval_email_contract renderer

The `measures_eval_email_contract` renderer must express email package governance only.

It may show:

- confirmation that the completed assessment package will be sent
- what the package includes at a high level:
  - completed assessment standing
  - primary finding
  - recommended structural response
  - reserve seat route
- dispatch deferred / not sent yet if appropriate
- continue CTA toward `measures_phases_reveal`

It must not show before capture:

- full assessment report
- all findings
- full interpretation
- full recommended response
- report dump from `evalReport`

No report block should render on this surface unless DB later seats `report_display` or `assessment_package` for this encounter.

### 5. Preserve email delivery contract

Do not implement email dispatch.

Preserve:

    dispatch_implementation: deferred

The contract defines what will be sent later, not current send behavior.

If runtime needs to store the recipient/contact info, use an existing approved mechanism only.

If no persistent storage exists, retain in runtime state and report required future DB/OAR support.

Do not create new DB tables in this OAR.

### 6. Seat assessment scoring contract

Assessment result must derive from answer scoring.

Do not use a universal fixed result label.

All low-risk answers must not produce:

    Structural Drift Detected

Implement or seat a scoring contract with thresholds.

Suggested threshold structure:

    0–20%
    Coherence Maintained
    Low evidence of structural drift.

    21–45%
    Emerging Drift
    Some review pathways or operational boundaries are unclear.

    46–70%
    Structural Drift Detected
    AI use is outpacing governance, review, or traceability.

    71–100%
    Critical Drift Exposure
    Operational risk is high; immediate structural response recommended.

If current answer scale is not 0–100, normalize the score from the existing answer mechanics.

The scoring contract must be documented in DB metadata where appropriate, preferably under `measures_assessment`.

Structured eval must share the same scoring mechanics unless a separate DB contract explicitly seats different thresholds.

### 7. Correct assessment result generation

Inspect assessment result generation.

Determine whether current result text is fixed from:

- `assessment_completion`
- hardcoded fallback
- `resolveEnvironmentalReport`
- static metadata
- runtime-only result object

Correct so result label and interpretation resolve by score threshold.

Required behavior examples:

- all low-risk / all 1 answers -> Coherence Maintained or lowest standing
- mixed answers -> appropriate middle threshold
- high-risk answers -> Structural Drift Detected or Critical Drift Exposure

Do not change question text.

Do not change answer options unless required to compute existing scoring and explicitly reported.

### 8. DB contract correction

Allowed DB corrections:

- update `connect_src` metadata standing/purpose/route_after_capture
- update `measures_assessment` metadata with scoring thresholds / scoring contract
- update `structured_eval` transition contract if it currently conflicts with the active route through partial SRC/contact capture
- update `measures_eval_email_contract` metadata only to clarify it is email package contract, not report display surface

Do not delete existing contract fields.

Do not remove traceability.

Do not create new DB tables.

### 9. Runtime correction

Allowed clean-shell files only.

Do not edit old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Likely files:

- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredConnectSrc.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx`
- `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`

Required runtime behavior:

- final assessment question routes to `connect_src`
- `connect_src` captures contact fields
- `connect_src` submit routes to `measures_eval_email_contract`
- `measures_eval_email_contract` shows email-package contract only
- continue routes to `measures_phases_reveal`
- no resolving interstitial required
- result scoring uses thresholds

### 10. Validate branch flow

Browser visual QA required.

Left:

    evaluate_structure_path
        -> eval_passage with video
        -> measures_assessment question 1
        -> final question
        -> connect_src contact capture
        -> measures_eval_email_contract package confirmation
        -> measures_phases_reveal

Right:

    evaluate_structure_path
        -> structure_passage with video
        -> structured_eval question 1
        -> final question
        -> connect_src contact capture
        -> measures_eval_email_contract package confirmation
        -> measures_phases_reveal

### 11. Validate scoring

Test at minimum:

- all lowest-risk answers
- all highest-risk answers
- mixed answers if practical

Return observed result labels.

All lowest-risk answers must not return:

    Structural Drift Detected

### 12. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- edit old `MeasuresRegistryRuntime.tsx`
- create new DB tables
- implement email dispatch
- expose payment logic
- change assessment questions
- fork structured_eval mechanics
- hardcode media URLs
- hardcode final result label
- display report dump on measures_eval_email_contract
- require resolving interstitial
- route contact capture before assessment
- delete deprecated rows
- alter registered 13 body except active route timing
- accept build-only validation

## VALIDATION REQUIRED

Return:

- DB rows inspected
- DB rows modified
- files modified
- connect_src before/after contract
- measures_eval_email_contract before/after behavior
- scoring contract seated/readback
- scoring threshold logic
- result generation source before/after
- all-low-risk test result
- all-high-risk test result
- left branch browser QA result
- right branch browser QA result
- build result
- confirmation old runtime was not edited
- confirmation no email dispatch
- confirmation no payment logic exposed
- confirmation no report dump on email contract surface
- confirmation no resolving interstitial required
- confirmation no deprecated route bleed

## SUCCESS CONDITION

The site has distinct contracts for:

    partial SRC contact capture
    email package delivery contract

Contact capture happens after the final evaluation question.

`measures_eval_email_contract` governs what gets sent and no longer displays a full assessment report dump.

Assessment outcome is score-based.

Low-risk answers do not produce a high-risk structural drift result.

Build remains clean and browser QA confirms both branches.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_partial_src_contact_capture_and_assessment_scoring_contract_v1.meta.md

## CLOSE

Separate contact capture from email contract.

Score the assessment from answers.

No fixed drift result.
