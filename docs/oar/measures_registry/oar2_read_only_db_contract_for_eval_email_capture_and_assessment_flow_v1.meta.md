---
document_type: oar2
authority_level: working
document_scope: measures_registry_db_contract_read
title: OAR2 — Read Only DB Contract for Eval Email Capture and Assessment Flow
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
  - docs/oar/measures_registry/oar1_resequence_assessment_capture_and_resolving_interstitial_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_passage_eval_video_and_assessment_email_capture_route_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - read-only
  - db-contract
  - eval-email-contract
  - assessment-flow
  - codex-first
---

# OAR2 — Read Only DB Contract for Eval Email Capture and Assessment Flow

## OBSERVED

Visual QA confirms partial clean-shell recovery:

- path-choice page now opens
- left/right path choices are visible
- eval passage video is back
- assessment questions are reachable
- final assessment route reaches `measures_eval_email_contract`

However, the `measures_eval_email_contract` surface does not visually express the intended contact/delivery capture contract.

Current browser expression appears as a large report-style surface:

    Measures Evaluation Email Contract
    assessment summary
    findings
    interpretation

This does not appear to match the intended post-question delivery capture flow.

Intended flow:

    final evaluation question
        -> measures_eval_email_contract contact/delivery capture
        -> submit delivery fields
        -> resolving interstitial for at least 4 seconds
        -> measures_phases_reveal

Before any further code correction, the seated DB contract must be read directly.

## ALIGNED

This is a read-only DB contract inspection.

Do not modify DB.

Do not modify src.

Do not edit CSS.

Do not infer contract from runtime behavior.

Do not patch the clean shell.

Do not patch the old runtime.

Return exact seated contract state from Codex/DB first.

The purpose is to determine whether the current browser expression is:

1. correctly rendering seated Codex contract, or
2. clean-shell renderer invention / report-dump drift beyond seated contract.

## ROUTED

### 1. Inspect target registered encounters

Read DB contract state for these encounters:

- measures_eval_email_contract
- measures_assessment
- structured_eval
- measures_phases_reveal
- evaluate_structure_path
- eval_passage
- structure_passage

For each encounter, return:

- encounter_key
- registry_key if joined/available
- display_title
- is_active
- release/access standing if available
- function_layer
- state_expression
- metadata.renderer
- full metadata keys present
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.fields
- metadata.form_fields
- metadata.soft_src_fields
- metadata.delivery_fields
- metadata.actions
- metadata.route_after_capture
- metadata.email_contract
- metadata.assessment_package
- metadata.result_display
- metadata.report_display
- metadata.copy / blocks / paragraphs if present
- source_sitewide_contract if present
- encounter_isolation_contract if present
- transition_contract if present

Return raw seated values where practical.

Do not summarize away fields needed for renderer correction.

### 2. Inspect measures_eval_email_contract in detail

For `measures_eval_email_contract`, determine:

- what the surface is contracted to display before submit
- whether contact/delivery fields are seated
- whether the assessment package summary is seated to appear before submit
- whether findings/results should appear before submit
- whether findings/results should appear only after delivery submit
- what route_after_capture is seated
- what CTA/action targets are seated
- whether the metadata says email dispatch is active or deferred
- whether phase reveal is included or excluded from email package
- whether recommended structural response is included

Return the exact DB evidence for each finding.

### 3. Inspect assessment completion contract

For `measures_assessment` and `structured_eval`, determine:

- what route is seated after final question
- whether the route target is `measures_eval_email_contract`
- whether the assessment result is seated to display immediately after final question
- whether result generation and result display are separated in metadata
- whether the registered contract expects silent report generation before email capture
- whether the registered contract expects report display before email capture

Return exact evidence.

### 4. Inspect transition rules

Inspect any transition rules involving:

- eval_passage
- structure_passage
- measures_assessment
- structured_eval
- measures_eval_email_contract
- measures_phases_reveal
- reserve_seat

Return:

- source encounter
- target encounter
- action key / transition key
- active/held state
- ordering/sequence if present
- whether transition conflicts with registered flow

Do not create or modify transition rules.

### 5. Inspect media roles for passage surfaces

Read media standing for:

- eval_passage
- structure_passage
- evaluate_structure_path

Return relevant `measures_media_map` rows or active media mappings for:

- eval passage video
- structure passage video
- path-choice left/right stills
- path-choice left/right motion if present
- background roles used by these surfaces

For each media row, return:

- campaign_key
- media_role
- storage_provider
- storage_bucket
- storage_path
- is_active
- resolved URL if runtime utility provides it
- whether asset appears available

Do not modify media rows.

### 6. Compare DB contract to current browser behavior

Compare seated contract to browser-observed behavior:

Browser-observed `measures_eval_email_contract`:

- title: Measures Evaluation Email Contract
- assessment result visible before contact/delivery form
- findings visible before submit
- contact capture not clearly expressed as primary surface

Determine whether this behavior is:

- contract-valid
- contract-incomplete
- renderer-invented
- renderer-ordering drift
- missing DB contract fields
- missing CSS/layout expression
- stale runtime state

Return exact mismatch table:

| Surface | DB Contract Says | Browser Shows | Classification |
|---|---|---|---|

### 7. Required conclusion

Return one of the following recommended next actions:

- DB contract correction required
- clean-shell renderer correction required
- both DB contract and renderer correction required
- no correction required; browser behavior is contract-valid
- insufficient DB contract; contract must be seated before renderer correction

Do not execute the correction in this OAR2.

## DO NOT

- modify DB
- modify src
- edit CSS
- patch renderer
- infer authority from runtime
- hardcode missing fields
- create new DB rows
- delete deprecated rows
- implement email dispatch
- expose payment logic
- change assessment scoring
- change assessment questions
- fork structured_eval mechanics

## VALIDATION REQUIRED

Return:

- SQL/scripts used for read-only inspection
- DB tables inspected
- rows inspected
- exact readback for target encounters
- exact readback for measures_eval_email_contract
- transition rule readback
- media role readback
- DB vs browser mismatch table
- correction recommendation
- confirmation no DB rows modified
- confirmation no source files modified
- confirmation no CSS modified

## SUCCESS CONDITION

The seated DB contract for the assessment-to-email-capture flow is known.

The system can determine whether the browser expression is contract-valid or renderer drift.

No correction occurs before Codex state is read.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_read_only_db_contract_for_eval_email_capture_and_assessment_flow_v1.meta.md

## CLOSE

Read Codex first.

No more patching from visual frustration.
