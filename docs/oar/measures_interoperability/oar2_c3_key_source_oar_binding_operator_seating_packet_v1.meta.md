---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Source OAR Binding Operator Seating Packet v1
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
  - source-binding
  - source-oar-binding
  - operator-seating-packet
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
  - OAR1 — c3 Key Assign Temporary System Function Source Binding Hardening v1
  - OAR1 — c3 Key Assign Temporary System Function Implementation v1
  - OAR1 — c3 Key Assign Temporary System Function Invocation Guard v1
  - OAR1 — c3 Key Permission Map Support Read Model v1
  - OAR1 — c3 Key Permission Map Storage Contract v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Source OAR Binding Operator Seating Packet v1

## OBSERVED

Source-binding hardening is seated.

Current standing:

- `public.c3_key_source_oar_binding` is seated
- `public.assign_temp_c3_key(...)` is hardened
- `SRC`, `SRC1`, and `SRC2` require explicit active source / OAR binding
- `future_SRC3` remains held
- real temporary c3 Key assignment waits for active bound source
- permissions remain held
- runtime remains held
- wallet / NFT / DAO / distribution remain held
- recognition / conversion remain held

The latest source-binding hardening OAR1 confirms explicit binding storage was created and `assign_temp_c3_key` now requires binding-required validation for `SRC`, `SRC1`, and `SRC2`.

Validation confirmed missing binding causes held standing with no temporary c3 Key issuance, no agreement acknowledgment, no permission row, and an audit row.

Current gap:

The binding table exists.

The operator-safe way to create an active binding row is not yet seated.

## ALIGNED

The next required surface is an operator seating packet for source / OAR bindings.

This packet defines how an operator may safely create an active binding row before using `assign_temp_c3_key`.

This does not issue a temporary c3 Key.

This does not grant permission.

This does not activate permission.

This does not open runtime.

This does not open public access.

## CORE RULE

No active source / OAR binding, no real assignment.

No operator authorization, no binding.

No audit trace, no binding.

No direct ad hoc insert.

No permission grant from binding.

Codex holds.

## ROUTED

Executor may document or seat:

1. operator-safe binding creation packet
2. required binding inputs
3. allowed source record types
4. binding status rules
5. audit requirement
6. support-safe metadata rule
7. protected helper RPC if needed
8. validation probes
9. OAR1 closeout

Executor may not:

- issue temporary c3 Key
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

## OPERATOR SEATING PACKET

Required binding inputs:

    source_record_type: SRC | SRC1 | SRC2
    source_record_id: ""
    source_oar_id: ""
    source_oar_path: ""
    operator_ref: ""
    binding_status: active | held | revoked | rejected
    support_safe: true
    metadata: {}

Required for active binding:

- source_record_type
- source_record_id
- source_oar_id
- operator_ref
- binding_status = active
- support_safe = true

Allowed source types:

- SRC
- SRC1
- SRC2

Not allowed:

- future_SRC3

Reason:

SRC3 is DAO / web3 specific and remains unseated.

## AUDIT REQUIREMENT

Binding creation should create or reference audit standing.

Minimum audit shape:

    function_name: seat_c3_key_source_oar_binding
    action_type: source_binding
    result_status: executed | held | failed | rejected | cancelled
    operator_ref: ""
    source_oar_id: ""
    input_ref:
      source_record_type: ""
      source_record_id: ""
      binding_status: ""
    output_ref:
      binding_id: ""
      has_active_binding: true | false
    support_safe: true
    metadata:
      source_binding_packet_version: v1

If audit cannot be attached:

- binding_status must remain held
- no active binding

No audit, no active binding.

## PREFERRED RPC CONTRACT

Preferred protected RPC:

`public.seat_c3_key_source_oar_binding(...)`

Access posture:

- SECURITY DEFINER
- fixed search_path
- execute revoked from PUBLIC
- execute revoked from anon
- execute revoked from authenticated
- execute granted to service_role only

The RPC may insert or update a binding row only when:

- source type is SRC / SRC1 / SRC2
- operator_ref is present
- source_oar_id is present
- source_record_id is present
- support_safe = true
- audit row is created or attached

## BINDING STATUS RULES

Allowed binding statuses:

- active
- held
- revoked
- rejected

Active means:

- source record and source OAR are recognized as bound for future assignment
- binding may satisfy `assign_temp_c3_key` source-binding requirement
- active binding does not itself assign a temporary c3 Key

Held means:

- binding is not sufficient for assignment
- source / OAR relation may require correction or additional evidence

Revoked means:

- prior binding is no longer valid for assignment
- future assignment must not use this binding

Rejected means:

- source / OAR relation is invalid
- future assignment must not use this binding

## SUPPORT-SAFE METADATA RULE

Allowed metadata:

- packet_version
- operator_note
- source_context
- validation_reference

Prohibited metadata:

- temp_key
- contact_email
- contact_email_hash
- contact_email_encrypted
- provider secrets
- service-role secrets
- raw email body
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase
- unbounded private payload

## SUPPORT-SAFE OUTPUT

Allowed output if helper RPC is seated:

- binding_id
- source_record_type
- source_record_id
- source_oar_id
- binding_status
- has_active_binding
- audit_id
- created_at
- updated_at

Prohibited output:

- temp_key
- contact_email
- contact_email_hash
- contact_email_encrypted
- provider secrets
- service-role secrets
- raw metadata
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase

## ACCESS POSTURE

If RPC is seated:

- execute revoked from PUBLIC
- execute revoked from anon
- execute revoked from authenticated
- execute granted to service_role only

Binding table must remain:

- RLS enabled
- zero public policies
- no anon access
- no authenticated broad access
- no frontend direct read / write

## RELATION TO ASSIGN_TEMP_C3_KEY

This packet seats or documents the operator-safe way to create the active binding required by `public.assign_temp_c3_key(...)`.

This packet does not call `assign_temp_c3_key`.

This packet does not issue a temporary c3 Key.

This packet does not create agreement acknowledgment for a temporary c3 Key.

This packet does not grant permission.

This packet does not activate c3 MAP access.

## VALIDATION PROBES

If RPC is seated, validation should confirm:

1. valid SRC / SRC1 / SRC2 binding may be created or updated
2. future_SRC3 is rejected or held
3. missing operator_ref is rejected or held
4. missing source_record_id is rejected or held
5. missing source_oar_id is rejected or held
6. prohibited metadata is rejected or stripped
7. anon cannot execute RPC
8. authenticated cannot execute RPC
9. service_role can execute RPC
10. no temporary c3 Key is issued
11. no permission is granted or activated

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

`docs/oar/measures_interoperability`

System standing remains:

`system: c3_field_systems`

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

## NOT AUTHORIZED

This OAR2 does not authorize:

- temporary c3 Key issuance
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

- create SQL seating artifact if DB RPC implementation is chosen
- create migration artifact if repo migration pattern is present
- implement protected source / OAR binding seating RPC
- validate bounded source types
- validate future_SRC3 remains held or rejected
- validate audit-first binding behavior
- validate support-safe output
- validate no temp c3 Key issuance occurs
- validate no permission grant or activation occurs
- validate no public access is opened
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- exceed this OAR2 scope
- issue temp c3 Key
- call assign_temp_c3_key
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

1. operator seating packet documented or seated
2. exact files created / modified
3. whether DB mutation occurred
4. protected binding RPC name if seated
5. source types bounded to SRC / SRC1 / SRC2
6. future_SRC3 rejected or held
7. audit requirement documented or enforced
8. support_safe required true
9. prohibited metadata excluded
10. support-safe output enforced
11. RLS remains enabled on binding table
12. no public / anon policy opened
13. no temporary c3 Key issued
14. no permission granted
15. no permission activated
16. no runtime / public API opened
17. no wallet / NFT / payment action
18. no DAO / distribution activation
19. no recognition / conversion standing created
20. folder reconciliation not performed
21. process rule not created
22. file staged in measures_interoperability intentionally
23. final folder reconciliation remains pending
24. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_source_oar_binding_operator_seating_packet_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when an operator-safe source / OAR binding seating path exists for `SRC`, `SRC1`, and `SRC2`, so a real temporary c3 Key assignment can later proceed only from explicit active binding, audit trace, and support-safe standing.

## CLOSE

Source binding is seated.

Operator seating packet forms now.

Real assignment waits.

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
