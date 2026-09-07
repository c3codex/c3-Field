---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Assign Temporary System Function Contract v1
status: proposed
version: v1
operator: op044
system: c3_field_systems
staging_location: measures_interoperability
final_location_pending: true
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - c3-field-systems
  - c3-key
  - assign-temp-c3-key
  - system-function
  - temporary-c3-key
  - audit-required
  - support-safe
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key System Function Audit Surface v1
  - OAR1 — c3 Key System Function Authority Contract v1
  - OAR1 — c3 Key System-Wide Authority Boundary v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Assign Temporary System Function Contract v1

## OBSERVED

The c3 Key system-wide boundary, system-function authority contract, and audit surface are seated.

Current standing:

- c3 Key authority: c3 Field system-wide
- Measures Registry: first valid implementation surface
- temporary c3 Key assignment: allowed
- system-function audit surface: live
- callable functions: not yet implemented
- runtime: held
- wallet / NFT: held
- recognition / conversion: held

The prior OAR1 confirms the audit table is live, function names and result statuses are bounded, `operator_ref` and `source_oar_id` are required, `support_safe` must be true, RLS is enabled, and zero public policies exist.

Future c3 Key callable-function OAR2s must either create an audit row during invocation or hold if audit standing is unavailable.

Current gap:

The audit surface exists.

The first protected callable system function contract is not yet defined.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

This OAR2 defines the protected callable contract for:

`assign_temp_c3_key`

This is a contract definition for the system function.

This does not execute a new temporary c3 Key assignment.

This does not implement the callable function.

This does not wire runtime.

This does not open public access.

This does not replace the existing Measures Registry implementation.

## CORE RULE

Temporary c3 Key assignment is system-wide but must be governed.

`assign_temp_c3_key` may call or route through the seated Measures Registry implementation surface where valid.

Every invocation must create an audit row or hold.

No audit, no assignment.

Codex holds.

## ROUTED

Executor may document:

1. `assign_temp_c3_key` callable contract
2. required inputs
3. required guards
4. required audit behavior
5. Measures Registry implementation dependency
6. support-safe output contract
7. held / failure states
8. OAR1 closeout

Executor may not:

- implement callable function
- issue a new temp c3 Key
- mutate existing temp c3 Key records
- wire runtime
- open public API
- open public lookup
- bind wallet
- mint NFT
- activate payment
- create recognition
- create conversion
- move folders
- create process rule

## FUNCTION CONTRACT

Function category:

`assign_temp_c3_key`

System authority:

`c3_field_systems`

Implementation dependency:

`Measures Registry temporary c3 Key implementation surface`

Preferred future callable behavior:

1. validate operator / admin authorization
2. validate source OAR
3. validate Named Individual
4. validate Institution in Service when applicable
5. validate agreement acknowledgment
6. validate expiration policy
7. call or route to seated temp c3 Key issuance implementation
8. record communication trace when notice is sent
9. record system-function audit row
10. return support-safe assignment packet

## REQUIRED INPUT CONTRACT

Required inputs:

    function_name: assign_temp_c3_key
    action_type: assign
    operator_ref: ""
    source_oar_id: ""
    origin_type: named_individual | institution_in_service
    named_individual_ref: ""
    institution_key: ""
    agreement_version: ""
    agreement_hash: ""
    agreement_acknowledgment_method: ""
    payment_route: ""
    payment_status: ""
    assessment_credit_status: ""
    metadata: {}

Conditional requirement:

- `institution_key` required when `origin_type = institution_in_service`

Optional inputs:

    contact_email: ""
    payment_provider: ""
    payment_reference: ""
    amount_due_cents:
    amount_paid_cents:
    currency: usd
    assessment_key: ""
    expires_at: ""

## REQUIRED GUARDS

The function contract must preserve:

- Named Individual required
- Institution in Service required when institutional
- source OAR required
- operator / admin reference required
- agreement acknowledgment required
- expiration required
- support-safe communication trace required when notice is sent
- audit row required during invocation
- temporary standing does not create recognition
- temporary standing does not create conversion
- wallet migration path preserved

## AUDIT REQUIREMENT

Every future invocation must create one audit row in:

`public.c3_key_system_function_audit`

Audit row minimum:

    function_name: assign_temp_c3_key
    action_type: assign
    result_status: executed | held | failed | rejected | cancelled
    operator_ref: ""
    source_oar_id: ""
    temp_key_id: ""
    public_ref: ""
    input_ref:
      origin_type: ""
      named_individual_ref: ""
      institution_key: ""
      agreement_version: ""
      payment_route: ""
      payment_status: ""
      assessment_credit_status: ""
    output_ref:
      public_ref: ""
      status: ""
      expires_at: ""
      agreement_acknowledged: true
    support_safe: true
    metadata: {}

Audit must not include:

- `temp_key`
- contact_email_hash
- contact_email_encrypted
- provider secrets
- service-role secrets
- raw email body
- raw agreement metadata
- private payment data
- wallet private data
- seed phrase

## SUPPORT-SAFE OUTPUT CONTRACT

Allowed future output:

    temp_key_id: ""
    public_ref: ""
    status: ""
    origin_type: ""
    institution_key: ""
    agreement_acknowledged: true
    agreement_version: ""
    created_at: ""
    expires_at: ""
    audit_id: ""
    communication_trace_id: ""

Not allowed:

- `temp_key`
- contact_email_hash
- contact_email_encrypted
- service-role secrets
- provider secrets
- raw metadata
- private payment data

## MEASURES REGISTRY IMPLEMENTATION RELATION

The system function may use Measures Registry as first implementation surface for:

- temporary c3 Key issuance
- agreement acknowledgment
- expiration standing
- communication trace
- support-safe read model

But Measures Registry does not become the parent authority.

Parent authority remains:

`c3_field_systems`

## HELD / FAILURE STATES

The future function must hold or reject if:

- audit surface unavailable
- operator / admin authorization missing
- source OAR missing
- Named Individual missing
- `institution_key` missing for institutional origin
- agreement acknowledgment missing
- expiration cannot be assigned
- support-safe boundary cannot be preserved
- implementation surface unavailable

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

`docs/oar/measures_interoperability`

System standing remains:

`system: c3_field_systems`

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

## NOT AUTHORIZED

This OAR2 does not authorize:

- function implementation
- new temporary c3 Key issuance
- runtime wiring
- frontend route
- public c3 Key lookup
- public API
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- DAO voting activation
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create this contract document in the measures_interoperability staging folder
- preserve Measures Registry implementation standing
- preserve future temporary assignment
- document audit-first invocation requirement
- document held / failure states
- recommend next route
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- implement callable function
- issue a new temp c3 Key
- alter temp c3 Key records
- move existing tables
- rename existing Measures Registry implementation surfaces
- wire runtime
- open public access
- bind wallet
- mint NFT
- activate DAO voting
- activate payment
- create recognition / conversion
- move folder location before reconciliation is routed
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. `assign_temp_c3_key` contract documented
2. required input contract documented
3. required guards documented
4. audit row requirement documented
5. support-safe output contract documented
6. Measures Registry implementation relationship preserved
7. held / failure states documented
8. future temp assignment remains allowed
9. no callable function implemented
10. no new temp c3 Key issued
11. no existing temp implementation invalidated
12. no DB / runtime mutation occurred unless explicitly documented as none
13. no public access opened
14. no wallet / NFT action occurred
15. no payment activation occurred
16. no recognition / conversion standing created
17. folder reconciliation not performed
18. process rule not created
19. file staged in measures_interoperability intentionally
20. final folder reconciliation remains pending
21. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the `assign_temp_c3_key` protected system-function contract is documented as the first c3 Key callable-function contract, preserving audit-first execution, support-safe output, Measures Registry implementation relationship, future temporary assignment, and all boundaries around runtime, wallet, NFT, payment, recognition, conversion, folder reconciliation, and process-rule creation.

## CLOSE

Audit surface is live.

`assign_temp_c3_key` contract forms.

Implementation waits.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
