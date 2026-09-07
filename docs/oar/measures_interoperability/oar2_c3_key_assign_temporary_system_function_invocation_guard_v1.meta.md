---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Assign Temporary System Function Invocation Guard v1
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
  - invocation-guard
  - src-standing-required
  - audit-required
  - support-safe
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key Permission Map Support Read Model v1
  - OAR1 — c3 Key Permission Map Storage Contract v1
  - OAR1 — c3 Key Permission Map and Access Boundary v1
  - OAR1 — c3 Key Assign Temporary System Function Contract v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - OAR1 — c3 Key System Function Authority Contract v1
  - OAR1 — c3 Key System-Wide Authority Boundary v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Assign Temporary System Function Invocation Guard v1

## OBSERVED

The c3 Key system-wide boundary, system-function authority contract, audit surface, assign temporary contract, permission map storage, and support read model are seated.

Current standing:

- c3 Key parent authority: c3_field_systems
- Measures Registry: first implementation surface
- assign_temp_c3_key contract: documented
- audit surface: live
- permission map storage: live
- permission map support read model: live
- callable function: not implemented
- runtime: held
- wallet / NFT: held
- DAO / distribution activation: held
- recognition / conversion: held

The existing support read model is service-role only and exposes no public permission lookup.

Current gap:

The assign_temp_c3_key contract exists.

The invocation guard is not yet seated.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

Before implementation, the invocation guard must be defined.

This OAR2 defines the authorization and validation guard for future `assign_temp_c3_key` execution.

This is not function implementation.

This does not issue a temporary c3 Key.

This does not wire runtime.

This does not open public access.

This does not grant or activate permission.

## CORE RULE

No valid source standing, no assignment.

No bound OAR, no assignment.

No operator / admin authorization, no assignment.

No Named Individual, no assignment.

No agreement acknowledgment, no assignment.

No expiration standing, no assignment.

No audit row, no assignment.

No support-safe boundary, no assignment.

Codex holds.

## ROUTED

Executor may document:

1. invocation guard contract
2. operator / admin authorization requirement
3. source record standing requirement
4. source OAR validation requirement
5. validation sequence
6. audit requirement
7. hold / reject behavior
8. support-safe output boundary
9. Measures Registry implementation relationship
10. OAR1 closeout

Executor may not:

- implement callable function
- issue temporary c3 Key
- mutate temporary c3 Key records
- grant permission
- activate permission
- wire runtime
- open public API
- open public lookup
- bind wallet
- mint NFT
- activate DAO voting
- activate distribution
- activate payment
- create recognition
- create conversion
- move folders
- create process rule

## INVOCATION GUARD CONTRACT

Future `assign_temp_c3_key` invocation must validate in this order:

1. operator / admin authorization present
2. source_record_type present
3. source_record_id present
4. source_oar_id present
5. source OAR is bound to the source record
6. function_name = assign_temp_c3_key
7. action_type = assign
8. Named Individual present
9. Institution in Service present when origin_type = institution_in_service
10. agreement standing present
11. expiration standing can be applied
12. support-safe output boundary can be preserved
13. audit row can be created
14. Measures Registry implementation route available

If any check fails:

- result_status = held | rejected | failed
- no temporary c3 Key assignment
- audit row recorded if possible
- OAR1 / OAR trace records hold or rejection reason

## SOURCE RECORD REQUIREMENT

Required source packet:

    source_record_type: SRC | SRC1 | SRC2 | future_SRC3
    source_record_id: ""
    source_oar_id: ""
    source_oar_path: ""

Allowed source records:

- SRC1 = Connect intake
- SRC2 = Contribute intake
- SRC = Measures Conversion intake
- future_SRC3 = DAO / web3 intake once seated

Current rule:

- SRC3 is not seated in current seed scope.
- future_SRC3 remains held unless separately routed.
- No c3 Key assignment may proceed from future_SRC3 until SRC3 is seated.

If source record is missing, unrelated, unverified, or not bound to source OAR:

- result_status = rejected
- no assignment

## OPERATOR / ADMIN AUTHORIZATION

Required:

    operator_ref: ""
    operator_authorization_method: operator_recorded | service_role_admin | governed_internal
    source_oar_id: ""

Not allowed:

- anonymous invocation
- public invocation
- frontend / client-side service role
- unverified authenticated broad user invocation
- operator preference without source standing

If operator identity is not seated:

- function must hold

## NAMED INDIVIDUAL REQUIREMENT

Every temporary c3 Key assignment requires a Named Individual.

Required:

    named_individual_ref: ""

If origin is institutional:

    origin_type: institution_in_service
    institution_key: ""
    named_individual_ref: ""

Institution in Service may be attached.

Institution in Service may not replace Named Individual accountability.

If Named Individual is missing:

- result_status = rejected
- no assignment

## AGREEMENT AND EXPIRATION REQUIREMENT

Required agreement packet:

    agreement_version: ""
    agreement_hash: ""
    agreement_acknowledgment_method: ""

Required expiration standing:

    expires_at: ""

If agreement standing is missing:

- result_status = rejected
- no assignment

If expiration cannot be assigned:

- result_status = held
- no assignment

## AUDIT REQUIREMENT

The future invocation must create one audit row in:

`public.c3_key_system_function_audit`

Minimum audit row:

    function_name: assign_temp_c3_key
    action_type: assign
    result_status: executed | held | failed | rejected | cancelled
    operator_ref: ""
    source_oar_id: ""
    temp_key_id: ""
    public_ref: ""
    input_ref:
      source_record_type: ""
      source_record_id: ""
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
    metadata:
      invocation_guard_passed: true | false
      hold_reason: ""
      reject_reason: ""

If assignment would execute but audit row cannot be created:

- assignment must not proceed

No audit, no assignment.

## SUPPORT-SAFE OUTPUT

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

Prohibited:

- temp_key
- contact_email_hash
- contact_email_encrypted
- provider secrets
- service-role secrets
- raw email body
- raw agreement metadata
- private payment data
- wallet private data
- seed phrase
- unbounded private metadata

## HELD / REJECTED STATES

Hold when:

- operator identity not fully seated
- audit route unavailable
- implementation route unavailable
- support-safe communication route unavailable
- expiration cannot be assigned
- source standing cannot be verified but may be correctable

Reject when:

- source OAR missing
- source record missing
- source OAR is not bound to source record
- Named Individual missing
- institution_key missing for institutional origin
- agreement acknowledgment missing
- function_name / action_type mismatch
- support-safe boundary violated

## MEASURES REGISTRY RELATION

The invocation guard may route future valid assignments through the seated Measures Registry implementation surface.

Measures Registry remains implementation surface only.

Parent authority remains:

`c3_field_systems`

## PERMISSION MAP RELATION

Temporary c3 Key assignment does not itself grant access expansion.

Access expansion requires permission standing.

No permission may be granted or activated by this invocation guard.

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
- permission grant
- permission activation
- runtime wiring
- frontend route
- public c3 Key lookup
- public API
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- Role NFT minting
- DAO voting activation
- distribution activation
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create this invocation-guard document in the measures_interoperability staging folder
- preserve Measures Registry implementation standing
- preserve c3 Field systems parent authority
- document source record + OAR binding requirements
- document operator / admin authorization requirements
- document support-safe output boundary
- document audit-first assignment requirement
- document hold / reject states
- recommend next route
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- implement callable function
- issue a new temp c3 Key
- alter temp c3 Key records
- grant permission
- activate permission
- move existing tables
- rename existing Measures Registry implementation surfaces
- wire runtime
- open public access
- bind wallet
- mint NFT
- activate DAO voting
- activate distributions
- activate payment
- create recognition / conversion
- move folder location before reconciliation is routed
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. invocation guard contract documented
2. operator / admin authorization requirement documented
3. source record requirement documented
4. source OAR binding requirement documented
5. validation sequence documented
6. audit requirement documented
7. hold / reject behavior documented
8. support-safe output boundary documented
9. Measures Registry implementation relationship preserved
10. permission map relation preserved
11. future temp assignment remains allowed
12. no callable function implemented
13. no new temp c3 Key issued
14. no permission granted
15. no permission activated
16. no existing temp implementation invalidated
17. no DB / runtime mutation occurred unless explicitly documented as none
18. no public access opened
19. no wallet / NFT action occurred
20. no DAO / distribution activation occurred
21. no payment activation occurred
22. no recognition / conversion standing created
23. folder reconciliation not performed
24. process rule not created
25. file staged in measures_interoperability intentionally
26. final folder reconciliation remains pending
27. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_invocation_guard_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the `assign_temp_c3_key` invocation guard is documented, ensuring future temporary c3 Key assignment cannot execute without valid SRC / SRC1 / SRC2 standing, a source OAR bound to that source record, operator / admin authorization, Named Individual accountability, agreement and expiration standing, audit trace, support-safe output, and Measures Registry implementation availability.

## CLOSE

Contract is formed.

Guard forms now.

Implementation waits.

Permission grants wait.

Runtime waits.

Wallet waits.

NFT waits.

DAO activation waits.

Distribution waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
