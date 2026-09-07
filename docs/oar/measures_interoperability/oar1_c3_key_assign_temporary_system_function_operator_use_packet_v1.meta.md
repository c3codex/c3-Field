---
document_type: oar1
authority_level: recorded
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Assign Temporary System Function Operator Use Packet v1
status: recorded
version: v1
operator: op044
system: c3_field_systems
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_operator_use_packet_v1.meta.md
staging_location: measures_interoperability
final_location_pending: true
runtime_spine:
  - Codex
  - Field
  - Measures
  - OAR2
  - Chazz
  - Cody
  - src
tags:
  - oar1
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
---

# OAR1 - c3 Key Assign Temporary System Function Operator Use Packet v1

## 1 - Execution Standing

OAR2 executed as documentation-only operator-use packet.

No real temporary c3 Key assignment was executed.

DB mutation standing: **not performed**.

No SQL artifact was created.

No migration artifact was created.

The seated runtime functions remain:

- `public.c3_key_source_oar_binding`
- `public.seat_c3_key_source_oar_binding(...)`
- `public.assign_temp_c3_key(...)`

This packet documents how a future real assignment may proceed after a valid active source / OAR binding exists.

## 2 - Files Created / Modified

Created:

- `docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_operator_use_packet_v1.meta.md`

Existing OAR2 staged by operator:

- `docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_operator_use_packet_v1.meta.md`

No frontend source files were modified.

No runtime route files were modified.

No database SQL files were modified.

No migration files were modified.

## 3 - Operator-Use Packet

Future real assignment packet must call:

`public.assign_temp_c3_key(...)`

Required packet fields:

- `function_name = assign_temp_c3_key`
- `action_type = assign`
- `operator_ref`
- `operator_authorization_method`
- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `source_oar_path`
- `origin_type`
- `named_individual_ref`
- `institution_key` when `origin_type = institution_in_service`
- `agreement_version`
- `agreement_hash`
- `agreement_acknowledgment_method`
- `expires_at`
- `payment_route = null`
- `payment_status = not_required`
- `assessment_credit_status = none`
- `metadata.operator_use_packet_version = v1`

Allowed source record types:

- `SRC`
- `SRC1`
- `SRC2`

Held source record type:

- `future_SRC3`

Allowed origin types:

- `named_individual`
- `institution_in_service`

Allowed operator authorization methods:

- `operator_recorded`
- `service_role_admin`
- `governed_internal`

Allowed agreement acknowledgment methods:

- `operator_recorded`
- `form_checkbox`
- `signature`
- `email_confirmation`

## 4 - Required Preflight

Before real assignment, operator must confirm:

1. active source / OAR binding exists for `SRC`, `SRC1`, or `SRC2`
2. source record type is not `future_SRC3`
3. source record id is correct
4. source OAR id is correct
5. source OAR path is correct where recorded
6. operator ref is correct
7. Named Individual is correct
8. Institution in Service is correct when applicable
9. agreement version / hash / method are correct
10. `expires_at` is correct and in the future
11. no permission grant is intended
12. no runtime / public access is opened

Current read-only preflight result:

```json
{
  "c3_key_source_oar_binding_total": 2,
  "active_source_oar_binding_total": 0,
  "active_bindings": []
}
```

Interpretation:

- no active source / OAR binding currently exists
- real assignment is not ready
- no assignment was executed

## 5 - Active Binding Requirement

Real assignment may proceed only when `public.c3_key_source_oar_binding` contains an active row matching:

- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `source_oar_path` where recorded
- `binding_status = active`
- `support_safe = true`

If no active binding exists:

- assignment must be held
- no temp key may be issued
- audit row is required where invocation reaches the function

Current standing:

```json
{
  "active_source_oar_binding_total": 0
}
```

No active binding, no real assignment.

## 6 - Support-Safe Output

Allowed assignment output:

- `temp_key_id`
- `public_ref`
- `status`
- `origin_type`
- `institution_key`
- `agreement_acknowledged`
- `agreement_version`
- `created_at`
- `expires_at`
- `audit_id`
- `communication_trace_id`

Prohibited output:

- `temp_key`
- `contact_email`
- `contact_email_hash`
- `contact_email_encrypted`
- provider secrets
- service-role secrets
- raw email body
- raw agreement metadata
- private payment data
- wallet private data
- seed phrase
- raw metadata

## 7 - Communication Trace Rule

Communication trace is required only if notice is sent.

No notice was sent in this OAR1 execution.

Therefore:

- `communication_trace_id` was not created
- outbound email delivery remains separately routed
- no communication trace row was expected

## 8 - Permission Map Boundary

Temporary c3 Key assignment does not grant access expansion.

This operator-use packet does not authorize:

- permission-map row creation
- permission grant
- permission activation
- c3 MAP access activation
- DAO voting activation
- distribution eligibility activation
- role NFT standing activation
- branch access activation

Permission standing remains separately routed.

Current read-only standing:

```json
{
  "c3_key_permission_map_total": 0
}
```

## 9 - Read-Only Validation

Read-only DB standing:

```json
{
  "c3_key_temp_total": 1,
  "c3_key_permission_map_total": 0,
  "c3_key_source_oar_binding_total": 2,
  "active_source_oar_binding_total": 0,
  "operator_use_oar_assign_audit_rows": 0,
  "operator_use_oar_temp_keys": 0,
  "operator_use_oar_agreement_acks": 0
}
```

Interpretation:

- no temp key was issued by this operator-use OAR
- no agreement acknowledgment was created by this operator-use OAR
- no audit row was created for this OAR because no assignment invocation was made
- no permission map row exists
- no active binding exists

Anon access probe for `assign_temp_c3_key`:

```json
{
  "code": "42501",
  "message": "permission denied for function assign_temp_c3_key"
}
```

Public / anon access remains closed.

## 10 - Post-Assignment Validation Packet

If real assignment is separately confirmed and executed later, the OAR1 for that execution must validate:

1. active binding existed before assignment
2. `temp_key_id` was created only if assignment executed
3. `public_ref` returned only if assignment executed
4. audit row was created
5. agreement acknowledgment was created only if assignment executed
6. communication trace was created only if notice was sent
7. no permission map row was created
8. no permission was granted
9. no permission was activated
10. raw `temp_key` was not returned
11. prohibited fields were excluded
12. public / anon access remained closed
13. no runtime / public API opened

## 11 - Boundaries Held

No real assignment was executed.

No temporary c3 Key was issued.

No agreement acknowledgment was created.

No audit row was created for assignment.

No communication trace was created.

No permission map record was created.

No permission was granted.

No permission was activated.

No runtime was wired.

No frontend route was created.

No public API was opened.

No public c3 Key lookup was opened.

No wallet was bound.

No wallet verification was performed.

No NFT was deployed or minted.

No Role NFT was minted.

No DAO voting was activated.

No distribution was activated.

No payment standing was activated.

No recognition standing was created.

No verification claim was created.

No conversion standing was created.

No folder reconciliation was performed.

No process rule was created.

## 12 - Validation Against OAR2

Confirmed:

1. operator-use packet documented
2. exact files created / modified documented
3. DB mutation did not occur
4. required preflight checks documented
5. required assignment packet documented
6. active binding requirement documented
7. support-safe output documented
8. communication trace rule documented
9. permission map boundary documented
10. no real assignment executed
11. no temp c3 Key issued
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
22. next route recommendation documented

## 13 - Next Route Recommendation

Recommended next route:

`OAR2 - c3 Key Source OAR Binding Real Source Seating v1`

Purpose:

- seat one real active source / OAR binding for a valid `SRC`, `SRC1`, or `SRC2`
- preserve audit trace
- prepare for a separately confirmed real assignment

Then:

`OAR2 - c3 Key Assign Temporary System Function Real Assignment Execution v1`

Use only after the real active binding exists and the operator confirms assignment execution.

## CLOSE

Operator-use packet is documented.

Real assignment is not executed.

No active binding exists yet.

Binding must be seated first.

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
