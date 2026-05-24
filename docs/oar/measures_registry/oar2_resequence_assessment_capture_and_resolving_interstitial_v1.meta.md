---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR2 — Resequence Assessment Capture and Resolving Interstitial
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_reposition_contact_capture_to_eval_email_contract_and_remove_header_bleed_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-qa
  - assessment-flow
  - eval-email-contract
  - resolving-interstitial
  - registered-runtime
  - codex-first
---

# OAR2 — Resequence Assessment Capture and Resolving Interstitial

## OBSERVED

Visual QA confirms the user can complete the evaluation questions.

After the final question, the runtime still shows the resolving interstitial:

Resolving environmental standing  
Reviewing operating conditions.

This interstitial is acceptable only if it belongs to the post-contact capture contract.

Current intended flow is:

final assessment question
-> measures_eval_email_contract contact/delivery capture
-> submit delivery fields
-> resolving / generating interstitial for at least 4 seconds
-> assessment result / measures_phases_reveal

The resolving interstitial must not appear before contact capture.

## ALIGNED

This is a sequencing correction.

Do not remove the resolving interstitial if it can be correctly repositioned.

The interstitial becomes part of the assessment package generation contract after delivery fields are submitted.

Do not change assessment questions.

Do not alter assessment scoring.

Do not fork structured_eval mechanics.

Do not implement email dispatch.

Do not expose payment logic.

Do not reintroduce pre-assessment contact capture.

Frontend must continue rendering seated Codex state only.

## ROUTED

### 1. Identify current resolving interstitial source

Inspect assessment completion flow and identify the exact component/state rendering:

Resolving environmental standing  
Reviewing operating conditions.

Return:

- component/function name
- state key or eval step
- triggering handler
- current route timing
- whether it appears before or after measures_eval_email_contract

### 2. Prevent resolving interstitial before contact capture

After the final question in:

- measures_assessment
- structured_eval

route directly to:

measures_eval_email_contract

Do not render the resolving interstitial before the contact/delivery form.

### 3. Attach resolving interstitial to measures_eval_email_contract submit

After user submits delivery fields on:

measures_eval_email_contract

show the resolving/generating interstitial.

The interstitial should communicate assessment package generation.

Use existing seated language where possible.

Acceptable text:

Resolving environmental standing  
Reviewing operating conditions.

Do not invent new public copy outside metadata unless a fallback is required and reported.

### 4. Enforce minimum display duration

The resolving/generating interstitial must remain visible for at least:

4 seconds

After 4 seconds, route to:

measures_phases_reveal

Do not block indefinitely.

Do not require email dispatch to complete.

Do not expose payment logic.

### 5. Preserve delivery field behavior

measures_eval_email_contract must retain these fields:

- institution / company name
- business type
- contact name
- contact email

On submit:

- update existing runtime state / evalFields
- preserve assessment package context
- trigger resolving interstitial
- after minimum 4 seconds, continue to measures_phases_reveal

If persistent storage is not seated, keep runtime-state behavior and report future OAR need.

Do not create new DB tables.

### 6. Validate direct and branch flows

Validate left branch:

eval_passage
-> measures_assessment
-> final question
-> measures_eval_email_contract
-> submit
-> resolving interstitial for >= 4 seconds
-> measures_phases_reveal

Validate right branch:

structure_passage
-> structured_eval
-> final question
-> measures_eval_email_contract
-> submit
-> resolving interstitial for >= 4 seconds
-> measures_phases_reveal

Validate direct URL behavior:

?surface=measures_assessment

Expected:

- starts at evaluation questions
- does not show pre-question contact capture
- does not show resolving interstitial before final question/contact capture

Validate:

?surface=structured_eval

Expected:

- starts at evaluation questions
- does not show pre-question contact capture
- does not show resolving interstitial before final question/contact capture

### 7. Contain interstitial viewport

If the resolving interstitial remains visually active, correct its viewport containment.

Required:

- no bottom media/background peek-through
- no prior surface visible beneath card
- interstitial occupies runtime surface cleanly
- no broad redesign

Allowed:

- narrow container class correction
- min-height correction
- overflow/background containment correction

### 8. Build validation

Run:

npm run build:registry

Return clean build result.

## DO NOT

- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- reintroduce contact capture before assessment
- remove measures_eval_email_contract delivery capture
- delete connect_src
- delete deprecated rows
- create new DB tables
- hardcode media URLs
- change registered 13 sequence
- broadly redesign UI

## VALIDATION REQUIRED

Return:

- exact source of resolving interstitial
- files modified
- DB rows modified, if any
- old flow timing
- new flow timing
- measures_assessment branch result
- structured_eval branch result
- direct measures_assessment URL result
- direct structured_eval URL result
- confirmation interstitial appears only after delivery submit
- confirmation interstitial displays for at least 4 seconds
- confirmation route after interstitial is measures_phases_reveal
- viewport containment result
- build result
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed
- confirmation no deprecated route bleed

## SUCCESS CONDITION

The resolving interstitial no longer appears immediately after the final evaluation question.

After the final question, the user is routed first to:

measures_eval_email_contract

After delivery/contact fields are submitted, the resolving interstitial appears for at least 4 seconds.

After that minimum duration, the runtime routes to:

measures_phases_reveal

Build remains clean.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_resequence_assessment_capture_and_resolving_interstitial_v1.meta.md

## CLOSE

Capture delivery first.

Resolve after submission.

Then reveal the assessment path.
