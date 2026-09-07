---
document_type: oar1
authority_level: working
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Assign Temporary System Function Contract v1
status: completed
version: v1
operator: op044
date: 2026-06-01
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_contract_v1.meta.md
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
  - oar1
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
  - OAR2 - c3 Key Assign Temporary System Function Contract v1
  - OAR1 - c3 Key System Function Audit Surface v1
  - OAR1 - c3 Key System Function Authority Contract v1
  - OAR1 - c3 Key System-Wide Authority Boundary v1
  - OAR1 - Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - c3 Key Assign Temporary System Function Contract v1

## STATUS

Completed.

This OAR1 documents the protected callable system-function contract for:

`assign_temp_c3_key`

This closeout is documentary only.

No callable function was implemented.

No temporary c3 Key was issued.

No existing temporary c3 Key record was mutated.

No runtime, public API, public lookup, wallet, NFT, payment, recognition, conversion, folder reconciliation, or process rule was opened.

## CONTRACT DOCUMENTED

Function category:

`assign_temp_c3_key`

System authority:

`c3_field_systems`

Implementation dependency:

`Measures Registry temporary c3 Key implementation surface`

Parent authority remains c3 Field system-wide.

Measures Registry remains the first valid implementation surface for temporary c3 Key assignment behavior, agreement acknowledgment, expiration standing, communication trace, and support-safe read model.

Measures Registry does not become the parent authority.

## REQUIRED INPUT CONTRACT DOCUMENTED

Required future invocation inputs:

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

- `institution_key` is required when `origin_type = institution_in_service`

Optional future invocation inputs:

    contact_email: ""
    payment_provider: ""
    payment_reference: ""
    amount_due_cents:
    amount_paid_cents:
    currency: usd
    assessment_key: ""
    expires_at: ""

## REQUIRED GUARDS DOCUMENTED

The future callable must validate or hold on:

- operator / admin authorization
- source OAR standing
- Named Individual standing
- Institution in Service standing when institutional origin is used
- agreement acknowledgment
- expiration policy
- support-safe communication trace when notice is sent
- audit row creation during invocation

The future callable must preserve:

- temporary standing does not create recognition
- temporary standing does not create conversion
- wallet migration path remains held and preserved
- no audit, no assignment

## AUDIT REQUIREMENT DOCUMENTED

Every future invocation must create one audit row in:

`public.c3_key_system_function_audit`

Required audit posture:

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

Audit row prohibited content:

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

Codex rule preserved:

No audit, no assignment.

## SUPPORT-SAFE OUTPUT CONTRACT DOCUMENTED

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

Prohibited future output:

- `temp_key`
- contact_email_hash
- contact_email_encrypted
- service-role secrets
- provider secrets
- raw metadata
- private payment data

## HELD AND FAILURE STATES DOCUMENTED

Future invocation must hold or reject if:

- audit surface is unavailable
- operator / admin authorization is missing
- source OAR is missing
- Named Individual is missing
- `institution_key` is missing for institutional origin
- agreement acknowledgment is missing
- expiration cannot be assigned
- support-safe boundary cannot be preserved
- Measures Registry implementation surface is unavailable

## FUTURE TEMP ASSIGNMENT STANDING

Future temporary c3 Key assignment remains allowed only through the documented protected contract.

Assignment must remain:

- audit-first
- support-safe
- c3 Field system-wide in parent authority
- Measures Registry implementation-dependent where valid
- held from recognition, conversion, wallet binding, NFT minting, payment activation, and runtime/public access until separately routed

## NOT PERFORMED

The following were not performed in this OAR1 execution:

- no callable function implemented
- no new temporary c3 Key issued
- no existing temporary c3 Key record mutated
- no existing Measures Registry implementation invalidated
- no DB mutation performed
- no runtime mutation performed
- no public access opened
- no public lookup opened
- no public API opened
- no wallet action performed
- no NFT action performed
- no payment activation performed
- no recognition standing created
- no conversion standing created
- no folder reconciliation performed
- no process rule created

## VALIDATION AGAINST OAR2

Confirmed:

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
12. no DB / runtime mutation occurred
13. no public access opened
14. no wallet / NFT action occurred
15. no payment activation occurred
16. no recognition / conversion standing created
17. folder reconciliation not performed
18. process rule not created
19. file staged in measures_interoperability intentionally
20. final folder reconciliation remains pending
21. next route recommendation documented

## NEXT ROUTE RECOMMENDATION

Recommended next route:

`OAR2 - c3 Key Assign Temporary System Function Implementation v1`

Entry condition:

Implementation should only proceed if operator / admin identity, invocation audit behavior, support-safe output, and Measures Registry routing remain seated and verifiable.

Alternate preparatory route:

`OAR2 - c3 Key Assign Temporary System Function Invocation Guard v1`

Use the preparatory route first if authorization, source OAR validation, or support-safe audit behavior requires additional contract seating before implementation.

## CLOSE

`assign_temp_c3_key` contract is formed.

Audit remains first.

Support-safe output remains bounded.

Measures Registry remains implementation surface.

c3 Field remains parent authority.

Implementation waits.

Runtime waits.

Wallet waits.

NFT waits.

Payment waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
