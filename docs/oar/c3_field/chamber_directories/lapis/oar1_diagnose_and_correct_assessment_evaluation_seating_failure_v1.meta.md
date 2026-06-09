---
document_type: oar1
authority_level: closeout
document_scope: assessment_evaluation_seating_failure
title: OAR1 — Diagnose and Correct Assessment Evaluation Seating Failure v1
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/c3_field/chamber_directories/lapis/oar2_diagnose_and_correct_assessment_evaluation_seating_failure_v1.meta.md
execution_date: 2026-06-07
tags:
  - oar1
  - measures-registry
  - assessment
  - evaluation
  - contact-gate
  - result-gate
  - db-write
  - rls
  - lapis
---

# OAR1 — Diagnose and Correct Assessment Evaluation Seating Failure v1

## Standing

Completed with DB seating correction applied.

The assessment evaluation seating failure was reproduced against the public browser Supabase key and corrected at the governed database insert policy.

The visible runtime route could not be fully completed in local preview because the current local registry state rendered held contract states before the question flow:

    /ai-operations-assessment -> Landing contract missing
    ?surface=measures_assessment -> Assessment contract is not seated; expected 7 questions, found 0

The evaluation persistence seam itself was validated directly with the same browser anon key used by the frontend runtime.

## Source Identification

Runtime source:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Function:

    submitIisEvaluation

Target:

    public.measures_iis_eval_gate1_capture

Operation:

    direct Supabase table insert

Auth context:

    public browser anon key

User-safe error branch found:

    Evaluation could not be seated. Please try again.

OAR2 observed text used `cannot`; current source uses `could not`.

## Root Cause

The runtime submitted the currently governed contact-gated assessment payload:

    capture_context = measures_assessment_contact_gated_delivery
    intent = assessment_result_delivery_request

The live RLS insert policy still only allowed the prior public capture path:

    capture_context = iis_eval_gate1
    intent = system_evaluation_request

Before correction, the browser anon insert failed with:

    status: 401
    code: 42501
    message: new row violates row-level security policy for table "measures_iis_eval_gate1_capture"

This was a DB policy drift, not a scoring failure, question failure, contact gate failure, or result renderer failure.

## Schema Findings

PostgREST service OpenAPI exposed the target table:

    public.measures_iis_eval_gate1_capture

Required REST properties:

    id
    institution_name
    institution_address
    institution_phone
    contact_name
    contact_position
    contact_email
    evaluation_answers
    capture_context
    intent
    eligibility
    campaign_tag
    notification_state
    confirmation_email_state
    metadata
    created_at
    updated_at

Defaults are present for:

    id = gen_random_uuid()
    capture_context = iis_eval_gate1
    intent = system_evaluation_request
    campaign_tag = iis_eval_gate1
    notification_state = queued
    confirmation_email_state = queued
    created_at = now()
    updated_at = now()

JSONB fields:

    evaluation_answers
    eligibility
    metadata

## DB Correction

SQL artifact added and executed:

    docs/oar/c3_field/chamber_directories/lapis/diagnose-and-correct-assessment-evaluation-seating-failure-v1.sql

Execution route:

    Supabase exec_sql RPC using the repo server-side c3 execution credential

Execution result:

    { "ok": true }

RLS correction:

    altered only public.measures_iis_eval_gate1_capture insert policy

The policy now preserves the legacy insert path and adds the current governed contact-gated delivery path.

Allowed current-path checks require:

    capture_context = measures_assessment_contact_gated_delivery
    intent = assessment_result_delivery_request
    non-empty institution_name
    non-empty contact_name
    non-empty contact_email
    evaluation_answers present
    metadata present
    metadata.encounter_key = measures_ai_operational_evaluation
    metadata.environmental_standing_report present
    metadata.assessment_result_binding present

No read, update, or delete exposure was added for anon.

## Runtime Correction

Files changed:

    src/measures_registry/PublicAssessmentSurface.tsx
    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Contact-gate website field correction:

    Governed URL fields no longer render as native type=url inputs.
    They render as type=text with inputMode=url.

This allows:

    www.example.com

without browser-native URL validation blocking submission.

Stored payload normalization:

    www.example.com -> https://www.example.com

This normalization is used for:

    institution_address
    metadata.assessment_result_binding.website

No assessment questions, scoring logic, contact gate, result gate, payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, Marble readiness, SEO, unDrifted, Paragraph, Buffer, or social automation behavior was changed.

## Validation Evidence

Validation artifact:

    docs/oar/c3_field/chamber_directories/lapis/assessment_evaluation_seating_failure_validation_v1.json

Before correction:

    browser anon insert returned 401 / 42501 RLS denial

After correction:

    browser anon insert returned 201 Created

Inserted evaluation row:

    c6f9c73f-078a-4a60-833a-6ce6ef549a09

Inserted contact:

    oar2-assessment-seating-1780858247476@example.com

Readback confirmed:

    capture_context = measures_assessment_contact_gated_delivery
    intent = assessment_result_delivery_request
    answer_count = 7
    standing_key = oar2_validation_standing
    result_binding_contact_email = oar2-assessment-seating-1780858247476@example.com
    structured_email_artifact present = true
    public_internal_boundary_preserved = true

Duplicate standing:

    beforeCount = 0
    afterCount = 1
    duplicateRowsForContact = 1

## Build Validation

Command:

    npm.cmd run build:registry

Result:

    passed

Route heads regenerated:

    /ai-operations-assessment
    /structural-drift
    /undrifted

Build warning:

    Vite chunk size warning only; no build failure.

## Browser / Route Standing

Local preview route:

    http://127.0.0.1:4177/ai-operations-assessment

Hydrated route standing:

    held before submission

Reason:

    local preview rendered governed landing/assessment contract held states, so the full UI assessment flow could not be completed locally from the current registry state.

Production route read-only standing observed during validation:

    https://www.measuresregistry.com/ai-operations-assessment opened on the older epigraph/threshold route rather than the direct assessment shell.

This route-shell standing is separate from the DB seating failure corrected by this OAR1.

## No Bypass Confirmation

No hardcoded success path was introduced.

No frontend-owned authority was introduced.

No DB seating bypass was introduced.

No public C1/C2/C3 display was introduced.

The result gate still depends on successful DB insert before `evalSubmitted` is set.

The contact gate remains required before result display.

## Git Status Standing

Worktree contains existing broader OAR/package changes from the active thread.

This OAR added or modified:

    docs/oar/c3_field/chamber_directories/lapis/diagnose-and-correct-assessment-evaluation-seating-failure-v1.sql
    docs/oar/c3_field/chamber_directories/lapis/assessment_evaluation_seating_failure_validation_v1.json
    docs/oar/c3_field/chamber_directories/lapis/oar1_diagnose_and_correct_assessment_evaluation_seating_failure_v1.meta.md
    src/measures_registry/PublicAssessmentSurface.tsx
    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    dist-registry build artifacts

## Close

The assessment evaluation seating failure was caused by RLS policy drift against the current governed contact-gated delivery payload.

The DB insert path now seats a public anon assessment evaluation record with contact data, seven answers, result standing, and result binding metadata.

OAR2 diagnosed.

Cody corrected the minimum seam.

OAR1 proves.
