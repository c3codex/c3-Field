---
document_type: oar2
authority_level: working
document_scope: assessment_evaluation_seating_failure
title: OAR2 — Diagnose and Correct Assessment Evaluation Seating Failure v1
status: proposed
version: v1
operator: op044
system: measures_registry
registration_authorized: true
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: runtime_db_executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - assessment
  - evaluation
  - contact-gate
  - result-gate
  - runtime-failure
  - db-write
  - rls
  - diagnostic
---

# OAR2 — Diagnose and Correct Assessment Evaluation Seating Failure v1

## OBSERVED

The public assessment flow currently fails after the user completes:

    assessment answers
    contact information
    final submission button

Observed user-facing error:

    Evaluation cannot be seated. Please try again.

This indicates the visible assessment flow can complete, but the evaluation persistence / seating step fails.

The failure occurs before successful result handling.

This is an active runtime seam failure.

All SEO, unDrifted, landing-page expansion, and visual implementation work must pause until this assessment persistence seam is corrected.

Likely failure surfaces include:

    RLS insert/update denial
    missing required payload field
    wrong table or RPC target
    deprecated assessment table/function
    enum/status mismatch
    NOT NULL column failure
    contact payload not joined to assessment payload
    anon write permission failure
    result/email contract expecting ungenerated field
    malformed runtime payload

## ALIGNED

Authority order remains:

    Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Frontend does not author truth.

The assessment result must be seated in the governed database path before result handling proceeds.

Runtime must not fake success if seating fails.

Runtime must preserve:

    contact gate
    assessment runtime
    result gate
    scoring logic unless proven directly defective

This OAR2 authorizes a narrow diagnostic and correction pass for the assessment evaluation seating failure only.

This OAR2 does not authorize redesign, SEO work, unDrifted work, new assessment content, new scoring model, or new conversion/commercial standing.

## ROUTED

### 1. Reproduce the failure

Cody must reproduce the live/local assessment completion error.

Capture:

    route URL
    exact step where failure occurs
    browser console errors
    network request URL
    request method
    status code
    request payload
    response body
    Supabase error message if present

Search runtime source for the user-facing error string:

    Evaluation cannot be seated

Identify:

    file path
    function name
    table/RPC target
    payload shape
    error handling branch

### 2. Identify persistence target

Determine whether the runtime attempts to seat evaluation through:

    direct Supabase table insert
    direct Supabase table update
    RPC call
    edge function
    API route
    local state handler

Document exact target:

    table/function name
    operation
    expected payload
    returned payload
    auth context: anon/auth/service

### 3. Inspect DB schema and constraints

Inspect the target DB object.

If table:

    columns
    required NOT NULL fields
    default values
    enum/check constraints
    foreign keys
    unique constraints
    generated columns
    triggers

If RPC/function:

    function signature
    required args
    return type
    security definer/invoker standing
    internal table writes

### 4. Inspect RLS / permissions

Inspect RLS standing for target table(s):

    RLS enabled/disabled
    anon insert policy
    anon update policy if needed
    authenticated policy if needed
    policy conditions
    WITH CHECK expressions
    grants

If seating is intended to be public anonymous assessment submission, the DB must allow the specific governed insert path without exposing unsafe read/update/delete surfaces.

If anon writes are blocked, correct only the required insert path.

Do not open broad unsafe permissions.

### 5. Inspect contact + assessment payload join

Verify runtime payload includes required fields for:

    company/institution name
    contact name
    email
    type of business
    assessment answers
    score/result
    result label
    recommended MAP path
    route/source key if required
    created timestamp if required
    status if required

Confirm no deprecated field names are still being sent.

Confirm no public C1/C2/C3 value is required for successful insert unless privately stored and properly mapped.

Public display must use:

    MAP path recommendations

not:

    C1
    C2
    C3

### 6. Correct the minimum failing seam

Cody may correct only the minimal cause of failure.

Allowed corrections:

    fix payload field names
    add missing required payload values
    correct target table/RPC name
    correct enum/status value
    correct safe RLS insert policy
    correct insert/update call
    correct result seating sequence
    correct error logging to expose real Supabase error during development
    preserve user-safe error in production

Disallowed corrections:

    redesign assessment
    change questions
    change scoring model unless directly required by schema mismatch
    bypass contact gate
    bypass result gate
    bypass DB seating
    hardcode success
    route directly to payment
    route to c3 Key
    route to SRC
    expose C1/C2/C3 publicly
    implement SEO
    implement unDrifted
    alter Paragraph/Buffer/social
    create conversion/certification/DAO standing

### 7. Required corrected flow

Corrected flow must resolve as:

    contact captured
    assessment answers completed
    score/result calculated
    evaluation record seated in DB
    result displayed or continued
    email/result contract invoked only if already seated and valid

If email/result contract is not seated or fails independently:

    evaluation seating must still be proven separately
    email failure must be logged as separate held seam
    do not mask evaluation seating success as email failure

### 8. Validation requirements

Cody must provide validation evidence:

    before/after error standing
    failing request details
    root cause
    DB object inspected
    RLS/policy standing
    payload before correction
    payload after correction
    successful insert/readback evidence
    resulting evaluation row id/key
    no duplicate row created on retry unless expected
    no public C1/C2/C3 exposure
    no contact/result gate bypass
    no unrelated runtime mutation

Minimum validation:

    Complete assessment once with test contact.
    Confirm no “Evaluation cannot be seated” error.
    Confirm evaluation row exists in DB.
    Confirm contact fields are present.
    Confirm answers/result fields are present.
    Confirm result path proceeds as expected.

### 9. OAR1 closeout required

Cody must write OAR1 beside this OAR2:

    docs/oar/c3_field/chamber_directories/lapis/oar1_diagnose_and_correct_assessment_evaluation_seating_failure_v1.meta.md

OAR1 must include:

    root cause
    files changed
    DB changes made, if any
    SQL executed, if any
    RLS changes, if any
    schema findings
    payload findings
    validation evidence
    test submission result
    inserted evaluation record key/id
    no bypass confirmation
    no unrelated implementation confirmation
    git status standing

## CODY ROLE

Cody may:

    reproduce error
    inspect runtime source
    inspect browser/network failure
    inspect DB schema
    inspect RLS policies
    inspect target RPC/table
    correct minimal failing seam
    run safe SQL if required
    validate successful seating
    write OAR1 closeout

Cody may not:

    redesign assessment
    mutate landing page design
    mutate SEO
    mutate unDrifted
    change article content
    publish or schedule anything
    bypass database seating
    fake success
    expose internal C1/C2/C3 publicly
    create payment/c3 Key/SRC/conversion/certification/DAO standing
    broaden RLS beyond required insert path
    continue unrelated work before this seam is resolved

## VALIDATION

Execution is valid only when:

1. Error string source is identified.
2. Failing request/RPC/table is identified.
3. DB schema/constraints are inspected.
4. RLS/policies are inspected.
5. Root cause is documented.
6. Minimal correction is applied.
7. Assessment can be completed without seating error.
8. Evaluation row is seated in DB.
9. Contact data is present in seated record or linked record.
10. Assessment answers/result are present in seated record or linked record.
11. No contact gate bypass occurs.
12. No result gate bypass occurs.
13. No hardcoded success path is introduced.
14. No public C1/C2/C3 exposure occurs.
15. No SEO/unDrifted/Paragraph/Buffer/social mutation occurs.
16. No payment/wallet/c3 Key/SRC/certification/conversion/DAO/permission/recognition/distribution/Marble standing is created.
17. OAR1 closeout is written.

## CLOSE

This is an active assessment persistence failure.

Correct the seating seam first.

No expansion until the evaluation can be seated.

OAR2 diagnoses.
Cody corrects the minimum seam.
OAR1 proves.
