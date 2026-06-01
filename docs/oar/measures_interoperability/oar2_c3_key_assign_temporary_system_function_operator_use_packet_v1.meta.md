---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Assign Temporary System Function Operator Use Packet v1
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
  - operator-use-packet
  - source-oar-binding-required
  - audit-required
  - support-safe
  - no-runtime
  - no-public-access
  - no-nft-mint
  - no-recognition
  - no-conversion
  - staging
  - folder-reconciliation-pending
source_alignment:
  - OAR1 — c3 Key Source OAR Binding Operator Seating Packet v1
  - OAR1 — c3 Key Assign Temporary System Function Source Binding Hardening v1
  - OAR1 — c3 Key Assign Temporary System Function Implementation v1
  - OAR1 — c3 Key Assign Temporary System Function Invocation Guard v1
  - OAR1 — c3 Key Permission Map Support Read Model v1
  - OAR1 — c3 Key Permission Map Storage Contract v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Assign Temporary System Function Operator Use Packet v1

## OBSERVED

The operator-safe source / OAR binding path is seated.

Current standing:

- `public.c3_key_source_oar_binding` is seated
- `public.seat_c3_key_source_oar_binding(...)` is seated
- `public.assign_temp_c3_key(...)` is seated and hardened
- SRC / SRC1 / SRC2 require active source / OAR binding
- `future_SRC3` remains held
- real assignment has not yet executed
- permissions remain held
- runtime remains held
- wallet / NFT / DAO / distribution remain held
- recognition / conversion remain held

The prior OAR1 confirms the operator binding RPC is seated, bounded to SRC / SRC1 / SRC2, and does not issue temporary c3 Keys or grant permissions.

Current gap:

The system can seat active source / OAR bindings.

The system can assign temporary c3 Keys through a protected function.

The governed operator-use packet for real assignment is not yet documented.

## ALIGNED

This OAR2 defines the operator-use packet for a real temporary c3 Key assignment.

This does not automatically issue a key.

This defines how the operator may execute a real assignment safely after an active source / OAR binding exists.

Real assignment must remain:

- source-bound
- OAR-bound
- operator-bound
- Named Individual-bound
- agreement-bound
- expiration-bound
- audit-first
- support-safe
- permission-separated

## CORE RULE

No active source / OAR binding, no assignment.

No operator authorization, no assignment.

No Named Individual, no assignment.

No agreement acknowledgment, no assignment.

No expiration, no assignment.

No audit, no assignment.

No permission grant from assignment.

Codex holds.

## ROUTED

Executor may document:

1. real assignment operator-use packet
2. required preflight checks
3. required assignment inputs
4. active binding requirement
5. support-safe output requirements
6. audit and communication-trace expectations
7. post-assignment validation
8. OAR1 closeout

Executor may not:

- execute real assignment unless explicitly included in this OAR2 and confirmed by operator
- grant permission
- activate permission
- wire runtime
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

## REQUIRED PREFLIGHT

Before real assignment, operator must confirm:

1. active source / OAR binding exists for SRC / SRC1 / SRC2
2. source_record_type is not future_SRC3
3. source_record_id is correct
4. source_oar_id is correct
5. source_oar_path is correct where recorded
6. operator_ref is correct
7. Named Individual is correct
8. Institution in Service is correct when applicable
9. agreement version / hash / method are correct
10. expires_at is correct
11. no permission grant is intended
12. no runtime / public access is opened

## REQUIRED ASSIGNMENT PACKET

    function_name: assign_temp_c3_key
    action_type: assign
    operator_ref: op044
    operator_authorization_method: operator_recorded | service_role_admin | governed_internal
    source_record_type: SRC | SRC1 | SRC2
    source_record_id: ""
    source_oar_id: ""
    source_oar_path: ""
    origin_type: named_individual | institution_in_service
    named_individual_ref: ""
    institution_key: ""
    agreement_version: ""
    agreement_hash: ""
    agreement_acknowledgment_method: ""
    expires_at: ""
    payment_route: none | invoice | onchain_future | other
    payment_status: unpaid | paid | waived | not_required | held
    assessment_credit_status: none | pending | applied | held
    metadata:
      operator_use_packet_version: v1

## ACTIVE BINDING REQUIREMENT

Real assignment may proceed only when `public.c3_key_source_oar_binding` contains an active row matching:

- source_record_type
- source_record_id
- source_oar_id
- source_oar_path where recorded
- binding_status = active
- support_safe = true

If no active binding exists:

- status = held
- no temp key issued
- audit row required where possible

## SUPPORT-SAFE OUTPUT

Allowed output:

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

Prohibited output:

- temp_key
- contact_email
- contact_email_hash
- contact_email_encrypted
- provider secrets
- service-role secrets
- raw email body
- raw agreement metadata
- private payment data
- wallet private data
- seed phrase
- raw metadata

## COMMUNICATION TRACE RULE

Communication trace is required only if notice is sent.

If no notice is sent:

- communication_trace_id may be null
- audit row remains required
- OAR1 must document no notice was sent

Outbound email delivery remains separately routed unless already governed by an approved notice flow.

## PERMISSION MAP BOUNDARY

Assignment of a temporary c3 Key does not grant access expansion.

This operator-use packet may not:

- create permission-map rows
- grant permission
- activate permission
- activate c3 MAP access
- activate DAO voting
- activate distribution eligibility
- activate role NFT standing
- activate branch access

Permission standing remains separately routed.

## POST-ASSIGNMENT VALIDATION

OAR1 must validate:

1. whether real assignment executed or held
2. active binding existed before assignment
3. temp_key_id created only if assignment executed
4. public_ref returned only if assignment executed
5. audit row created
6. agreement acknowledgment created only if assignment executed
7. communication trace created only if notice sent
8. no permission map row created
9. no permission granted
10. no permission activated
11. raw temp_key not returned
12. prohibited fields excluded
13. public / anon access remained closed
14. no runtime / public API opened

## NOT AUTHORIZED

This OAR2 does not authorize:

- permission grant
- permission activation
- permission status change
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

- create this operator-use packet document
- validate the preflight requirements
- recommend whether real assignment is ready
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- execute real temporary c3 Key assignment unless explicitly confirmed in a separate routed execution step
- call `public.assign_temp_c3_key(...)` for real assignment without active binding
- grant permission
- activate permission
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

1. operator-use packet documented
2. exact files created / modified
3. whether DB mutation occurred
4. required preflight checks documented
5. required assignment packet documented
6. active binding requirement documented
7. support-safe output documented
8. communication trace rule documented
9. permission map boundary documented
10. no real assignment executed unless separately confirmed
11. no temp c3 Key issued unless separately confirmed
12. no permission granted
13. no permission activated
14. no runtime / public API opened
15. no wallet / NFT / payment action
16. no DAO / distribution activation
17. no recognition / conversion standing created
18. folder reconciliation not performed
19. process rule not created
20. file staged in measures_interoperability intentionally
21. final folder reconciliation remains pending
22. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_operator_use_packet_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the governed operator-use packet is documented for real temporary c3 Key assignment, requiring active source / OAR binding first and preserving audit-first, support-safe, permission-separated execution.

## CLOSE

Binding path is seated.

Assignment function is seated.

Operator-use packet forms now.

Real assignment remains separately confirmed.

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
