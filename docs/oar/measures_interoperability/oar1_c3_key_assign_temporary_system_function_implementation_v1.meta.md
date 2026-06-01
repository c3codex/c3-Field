---
document_type: oar1
authority_level: recorded
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Assign Temporary System Function Implementation v1
status: recorded
version: v1
operator: op044
system: c3_field_systems
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_implementation_v1.meta.md
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
  - implementation
  - system-function
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

# OAR1 - c3 Key Assign Temporary System Function Implementation v1

## 1 - Execution Standing

OAR2 executed.

Protected callable implementation seated:

`public.assign_temp_c3_key(...)`

Implementation route:

- Supabase `exec_sql` RPC
- `.env` server-side Supabase credential
- SQL artifact: `docs/oar/measures_interoperability/sql/seat_c3_key_assign_temporary_system_function_implementation_v1.sql`
- migration artifact: `supabase/migrations/202606010004_c3_key_assign_temporary_system_function_implementation.sql`

DB mutation standing: **performed under OAR2 authorization**.

The mutation created or replaced only the protected assignment RPC and its execute grants.

## 2 - Files Created / Modified

Created:

- `docs/oar/measures_interoperability/sql/seat_c3_key_assign_temporary_system_function_implementation_v1.sql`
- `supabase/migrations/202606010004_c3_key_assign_temporary_system_function_implementation.sql`
- `docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_implementation_v1.meta.md`

Existing OAR2 staged by operator:

- `docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_implementation_v1.meta.md`

No frontend source files were modified.

No runtime route files were modified.

## 3 - Function Contract

Seated function:

`public.assign_temp_c3_key(...)`

Access posture:

- `SECURITY DEFINER`
- fixed `search_path = public, extensions`
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`
- execute granted to `service_role`

Function returns only support-safe fields:

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

The function does not return raw `temp_key`.

## 4 - Implementation Behavior

The implementation:

- validates `operator_ref`
- validates `operator_authorization_method`
- validates `source_record_type`
- validates `source_record_id`
- validates `source_oar_id`
- validates `source_oar_path`
- validates `function_name = assign_temp_c3_key`
- validates `action_type = assign`
- validates `origin_type`
- validates `named_individual_ref`
- validates `institution_key` when `origin_type = institution_in_service`
- validates `agreement_version`
- validates `agreement_hash`
- validates `agreement_acknowledgment_method`
- validates `expires_at` as a future timestamp
- rejects payment activation in this function
- rejects assessment-credit / conversion activation in this function
- creates an audit row before assignment
- records agreement acknowledgment before assignment
- calls the existing protected `public.issue_temp_c3_key(...)` routine after guard checks pass
- binds the agreement acknowledgment to the returned `temp_key_id`
- updates the audit row to executed on successful assignment
- returns support-safe output only

Existing Measures Registry temporary c3 Key issuance logic was preserved and reused instead of duplicated.

## 5 - Source OAR Validation Standing

The implementation requires `source_oar_id` and `source_oar_path`.

The implementation rejects missing source record and source OAR standing.

The implementation holds `future_SRC3` because SRC3 remains unseated.

Current schema does not yet provide a dedicated source-record/OAR binding table for SRC, SRC1, and SRC2. The implementation therefore records:

`source_oar_binding_validation: presence_required_current_schema`

This preserves the current schema boundary and does not invent a source-authority relation table.

## 6 - Audit Requirement

Every invocation that has the minimum required audit identity fields creates one row in:

`public.c3_key_system_function_audit`

Audit row behavior:

- starts as `prepared`
- becomes `executed` after successful assignment
- becomes `held` for held standing such as `future_SRC3`
- becomes `rejected` for guard rejection
- becomes `failed` if implementation route errors after guard validation

If `operator_ref` or `source_oar_id` is absent, the function raises before assignment because the audit table cannot receive a valid row.

No audit, no assignment.

## 7 - Live Validation

Seating result:

```json
{
  "seated": true
}
```

Held probe used:

- `source_record_type = future_SRC3`
- expected no assignment
- expected audit row

Held probe result:

```json
{
  "temp_key_id": null,
  "public_ref": null,
  "status": "held",
  "agreement_acknowledged": false,
  "audit_id": "80c4aefb-76e5-4091-9c89-ef58d55bb6aa",
  "communication_trace_id": null
}
```

Returned fields:

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

Prohibited fields returned:

```json
[]
```

Anon validation:

```json
{
  "anon_status": 401,
  "anon_code": "42501",
  "anon_message": "permission denied for function assign_temp_c3_key"
}
```

Guard assertion:

```json
{
  "guard_assertions": "PASS"
}
```

The guard assertion verified:

- `public.assign_temp_c3_key(...)` exists
- `anon` cannot execute the function
- `authenticated` cannot execute the function
- `service_role` can execute the function

## 8 - Table Standing After Validation

Live counts after validation:

```json
{
  "c3_key_temp": 1,
  "c3_key_permission_map": 0,
  "c3_key_temp_agreement_ack": 1,
  "c3_key_system_function_audit": 1
}
```

Interpretation:

- no new temporary c3 Key was issued by validation
- no permission map record was created
- no agreement acknowledgment was created by the held probe
- one audit row was created for the held invocation probe
- pre-existing `c3_key_temp` and `c3_key_temp_agreement_ack` standing remained from the prior real issuance execution

Held probe audit row:

```json
{
  "function_name": "assign_temp_c3_key",
  "action_type": "assign",
  "result_status": "held",
  "temp_key_id": null,
  "public_ref": null,
  "metadata": {
    "hold_reason": "future_SRC3 remains held until seated",
    "reject_reason": "",
    "validation_probe": true,
    "expected_no_assignment": true,
    "implementation_version": "v1",
    "invocation_guard_passed": false,
    "source_oar_binding_validation": "presence_required_current_schema"
  }
}
```

## 9 - Communication Trace Behavior

No outbound notice was sent.

No communication trace was created.

`communication_trace_id` returned as `null`.

Outbound email delivery remains separately routed.

## 10 - Prohibited Fields Excluded

Validation confirmed the function does not return:

- `temp_key`
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

The function strips prohibited metadata keys before passing metadata into the existing issuance routine.

## 11 - Boundaries Held

No permission was granted.

No permission was activated.

No permission map record was created.

No permission map record was mutated.

No runtime was wired.

No public API was opened.

No public c3 Key lookup was opened.

No public / anon execute access was opened.

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

1. implementation created
2. exact files created / modified documented
3. DB mutation occurred and is documented
4. seated function name documented
5. implementation route documented
6. operator / admin authorization validation implemented
7. source record validation implemented
8. source OAR validation implemented within current schema limits
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
31. next route recommendation documented

## 13 - Next Route Recommendation

Recommended next route:

`OAR2 - c3 Key Assign Temporary System Function Source Binding Hardening v1`

Purpose:

- seat explicit source-record/OAR binding verification for SRC, SRC1, and SRC2
- avoid relying only on required `source_oar_id` / `source_oar_path` presence
- preserve audit-first assignment
- keep permission grants separate
- keep runtime/public access closed

Alternate next route:

`OAR2 - c3 Key Assign Temporary System Function Operator Use Packet v1`

Use this if the next need is a governed operator packet for real assignment through the seated protected function.

## CLOSE

Implementation is seated.

Guard is enforced.

Audit is first.

Support-safe output is held.

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
