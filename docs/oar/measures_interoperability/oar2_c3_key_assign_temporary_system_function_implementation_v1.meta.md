---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Assign Temporary System Function Implementation v1
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
  - implementation
  - system-function
  - invocation-guard
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
  - OAR1 — c3 Key Assign Temporary System Function Invocation Guard v1
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

# OAR2 — c3 Key Assign Temporary System Function Implementation v1

## OBSERVED

The required c3 Key parent contracts are seated:

- c3 Key system-wide boundary
- c3 Key system-function authority contract
- c3 Key system-function audit surface
- assign_temp_c3_key function contract
- c3 Key permission map and access boundary
- c3 Key permission map storage
- c3 Key permission map support read model
- assign_temp_c3_key invocation guard

Current standing:

- c3 Key parent authority: c3_field_systems
- Measures Registry: first implementation surface
- system-function audit surface: live
- permission map storage: live
- permission map support read model: live
- invocation guard: documented
- callable assign_temp_c3_key implementation: not yet seated
- runtime: held
- wallet / NFT: held
- DAO / distribution activation: held
- recognition / conversion: held

The invocation guard confirms future assignment may not proceed unless source standing, source OAR binding, operator / admin authorization, Named Individual accountability, agreement and expiration standing, audit trace, support-safe output, and Measures Registry implementation route are valid.

Current gap:

`assign_temp_c3_key` is contracted and guarded.

The protected callable implementation does not exist yet.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

This OAR2 authorizes implementation of the protected callable system function only:

`assign_temp_c3_key`

This implementation must remain server-side / protected.

This implementation may assign temporary c3 Key standing only when all guard checks pass.

This implementation must not grant permission.

This implementation must not activate permission.

This implementation must not wire runtime.

This implementation must not open public access.

## CORE RULE

No valid source standing, no assignment.

No bound OAR, no assignment.

No operator / admin authorization, no assignment.

No Named Individual, no assignment.

No agreement and expiration, no assignment.

No audit row, no assignment.

No support-safe output, no assignment.

No permission grant in this function.

Codex holds.

## ROUTED

Executor may implement a protected database RPC or server-side function that:

1. validates operator / admin authorization
2. validates source_record_type
3. validates source_record_id
4. validates source_oar_id
5. validates source OAR binding to source record where the current schema allows
6. validates function_name = assign_temp_c3_key
7. validates action_type = assign
8. validates Named Individual
9. validates Institution in Service when origin_type = institution_in_service
10. validates agreement acknowledgment
11. validates expiration
12. creates temporary c3 Key standing only if all required checks pass
13. creates system-function audit row
14. creates communication trace only if notice is sent
15. returns support-safe output only

Executor may not:

- wire frontend runtime
- open public API
- open public c3 Key lookup
- grant permission
- activate permission
- mutate permission records except audit-linked future implementation requirements if explicitly routed later
- bind wallet
- verify wallet
- mint NFT
- deploy NFT contract
- mint Role NFT
- activate DAO voting
- activate distribution
- activate payment
- create recognition
- create conversion
- move folders
- create process rule

## FUNCTION NAME

Function:

`assign_temp_c3_key`

Preferred database RPC name if implemented in Supabase:

`public.assign_temp_c3_key(...)`

If naming collision exists, executor may use:

`public.c3_assign_temp_c3_key(...)`

Executor must document the seated function name in OAR1.

## REQUIRED INPUT CONTRACT

Required invocation packet:

    function_name: assign_temp_c3_key
    action_type: assign
    operator_ref: ""
    operator_authorization_method: operator_recorded | service_role_admin | governed_internal
    source_record_type: SRC | SRC1 | SRC2 | future_SRC3
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
    payment_route: ""
    payment_status: ""
    assessment_credit_status: ""
    metadata: {}

Required source standing:

- SRC1 = Connect intake
- SRC2 = Contribute intake
- SRC = Measures Conversion intake
- future_SRC3 remains held until DAO / web3 intake is separately seated

No assignment may proceed from future_SRC3 until SRC3 is seated.

## VALIDATION SEQUENCE

Function must validate in this order:

1. operator_ref present
2. operator_authorization_method is allowed
3. source_record_type present and allowed
4. source_record_id present
5. source_oar_id present
6. source_oar_path present where available
7. source OAR binding can be verified or must be held if not verifiable
8. function_name = assign_temp_c3_key
9. action_type = assign
10. origin_type is allowed
11. named_individual_ref present
12. institution_key present when origin_type = institution_in_service
13. agreement_version present
14. agreement_hash present
15. agreement_acknowledgment_method present
16. expires_at present and valid future timestamp
17. support-safe output boundary can be preserved
18. audit row can be created
19. Measures Registry temporary c3 Key implementation route is available

If any required check fails:

- no temporary c3 Key assignment
- result_status must be held, rejected, or failed
- audit row must be recorded if possible
- output remains support-safe

## TEMPORARY c3 KEY CREATION RULE

The function may create a temporary c3 Key record only after all guard checks pass.

If the existing Measures Registry temporary c3 Key table contract requires fields not listed here, executor must preserve existing table constraints and document required fields in OAR1.

If the existing issuance implementation already provides a safe temp-key creation routine, executor may route through that routine rather than duplicate logic.

The function must not return the raw temp_key.

The function must return only public_ref and support-safe relation identifiers.

## AUDIT REQUIREMENT

Every invocation must create one row in:

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
      implementation_version: v1

If assignment would execute but audit row cannot be created:

- assignment must not proceed

No audit, no assignment.

## SUPPORT-SAFE OUTPUT CONTRACT

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

## COMMUNICATION TRACE RULE

The function may create a communication trace only if notice is sent or explicitly recorded as an operator/system notice.

If no notice is sent:

- communication_trace_id may be null
- audit row must still be created
- OAR1 must document no notice was sent

This OAR2 does not authorize a new email send unless executor explicitly implements only the assignment function without sending outbound email.

Outbound email delivery remains separately routed unless already handled by an existing approved notice flow.

## PERMISSION MAP BOUNDARY

This function may assign temporary c3 Key standing.

This function may not:

- grant permission
- activate permission
- create permission-map rows
- mutate permission-map rows
- activate c3 MAP access
- activate DAO voting
- activate distribution eligibility
- activate role NFT standing
- activate branch access

Access expansion remains separate through permission map standing.

## HELD / REJECTED STATES

Hold when:

- operator identity not fully seated
- source OAR binding cannot be verified but may be correctable
- audit route unavailable
- implementation route unavailable
- support-safe communication route unavailable
- expiration cannot be assigned
- existing table contract requires missing non-sensitive fields

Reject when:

- source OAR missing
- source record missing
- source OAR is not bound to source record
- source_record_type = future_SRC3 while SRC3 remains unseated
- Named Individual missing
- institution_key missing for institutional origin
- agreement acknowledgment missing
- function_name / action_type mismatch
- support-safe boundary violated

Failed when:

- database insertion fails after guard validation
- audit insertion fails before assignment
- implementation route errors without assignment

## ACCESS POSTURE

If seated as database RPC:

- SECURITY DEFINER is allowed only if search_path is fixed to public
- execute must be revoked from PUBLIC
- execute must be revoked from anon
- execute must be revoked from authenticated
- execute may be granted to service_role only unless separately routed
- no public policy may be opened
- no frontend direct invocation may be created

If implemented as server-only function outside DB:

- must use server-side credentials only
- must not expose service-role key client-side
- must not open public route
- must produce equivalent audit and support-safe output

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

`docs/oar/measures_interoperability`

System standing remains:

`system: c3_field_systems`

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

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

- create SQL seating artifact if DB RPC implementation is chosen
- create migration artifact if repo migration pattern is present
- implement protected assign_temp_c3_key function
- validate guard checks
- validate support-safe output
- validate audit row creation
- validate no permission grant or activation occurs
- validate no public access is opened
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- exceed this OAR2 scope
- issue assignment without audit
- return raw temp_key
- expose private authority
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

1. implementation created or held with reason
2. exact files created / modified
3. whether DB mutation occurred
4. seated function name if implemented
5. implementation route documented
6. operator / admin authorization validation implemented
7. source record validation implemented
8. source OAR validation implemented
9. Named Individual validation implemented
10. Institution in Service conditional validation implemented
11. agreement validation implemented
12. expiration validation implemented
13. support-safe output enforced
14. audit row creation enforced
15. no audit / no assignment enforced
16. raw temp_key not returned
17. prohibited fields excluded
18. communication trace behavior documented
19. no permission granted
20. no permission activated
21. no permission map records mutated
22. no runtime / public API opened
23. no public / anon access opened
24. no wallet / NFT / payment action occurred
25. no DAO / distribution activation occurred
26. no recognition / conversion standing created
27. folder reconciliation not performed
28. process rule not created
29. file staged in measures_interoperability intentionally
30. final folder reconciliation remains pending
31. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_implementation_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when `assign_temp_c3_key` exists as a protected, audit-first, support-safe system function that can assign temporary c3 Key standing only from valid source standing and bound OAR authority, without granting permissions, opening runtime/public access, binding wallet, minting NFTs, activating DAO/distribution/payment, or creating recognition/conversion standing.

## CLOSE

Implementation forms.

Permissions wait.

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
