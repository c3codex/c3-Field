---
document_type: oar1
authority_level: recorded
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Assign Temporary System Function Source Binding Hardening v1
status: recorded
version: v1
operator: op044
system: c3_field_systems
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_source_binding_hardening_v1.meta.md
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
  - source-binding
  - source-oar-binding
  - hardening
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

# OAR1 - c3 Key Assign Temporary System Function Source Binding Hardening v1

## 1 - Execution Standing

OAR2 executed.

Source-record / OAR binding hardening is seated for:

- `SRC`
- `SRC1`
- `SRC2`

`future_SRC3` remains held.

DB mutation standing: **performed under OAR2 authorization**.

The mutation created explicit binding storage and replaced the protected `public.assign_temp_c3_key(...)` function with binding-required validation for `SRC`, `SRC1`, and `SRC2`.

No frontend source was modified.

No runtime route was opened.

No public API was opened.

## 2 - Files Created / Modified

Created:

- `docs/oar/measures_interoperability/sql/seat_c3_key_assign_temporary_system_function_source_binding_hardening_v1.sql`
- `supabase/migrations/202606010005_c3_key_assign_temporary_source_binding_hardening.sql`
- `docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_source_binding_hardening_v1.meta.md`

Existing OAR2 staged by operator:

- `docs/oar/measures_interoperability/oar2_c3_key_assign_temporary_system_function_source_binding_hardening_v1.meta.md`

The SQL artifact and migration were verified as identical before DB seating.

## 3 - Binding Storage Contract

Seated table:

`public.c3_key_source_oar_binding`

Required fields:

- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `binding_status`
- `operator_ref`
- `support_safe`
- `metadata`
- `created_at`
- `updated_at`

Optional support fields:

- `source_oar_path`
- `audit_id`

Bounded source record types:

- `SRC`
- `SRC1`
- `SRC2`

Not allowed in binding table:

- `future_SRC3`

Reason: SRC3 remains DAO / web3 specific and is not seated in this route.

Binding uniqueness:

- `source_record_type`
- `source_record_id`
- `source_oar_id`

Valid real assignment now requires:

- matching source record type
- matching source record id
- matching source OAR id
- active binding status
- support-safe binding
- source OAR path match where a path is recorded on the binding

## 4 - Access Posture

Binding table posture:

- RLS enabled in seated SQL
- no public policies created
- table privileges revoked from `PUBLIC`
- table privileges revoked from `anon`
- table privileges revoked from `authenticated`
- table privileges granted only to `service_role`

Helper RPC seated:

`public.get_c3_key_source_oar_binding_support_read(text, text, text)`

Helper output is support-safe only:

- `binding_id`
- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `binding_status`
- `has_active_binding`
- `audit_id`
- `created_at`

Helper access posture:

- `SECURITY DEFINER`
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`
- execute granted to `service_role`

## 5 - assign_temp_c3_key Hardening

Updated function:

`public.assign_temp_c3_key(...)`

Existing signature and support-safe return surface were preserved.

The function still returns only:

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

The function now records:

`source_oar_binding_validation: explicit_binding_required`

For `SRC`, `SRC1`, and `SRC2`, assignment cannot proceed unless an active binding exists in:

`public.c3_key_source_oar_binding`

If no active binding exists:

- result status becomes `held`
- no temp key is created
- no agreement acknowledgment is created
- no permission map row is created
- audit row records `has_active_binding: false`
- audit row records `source_oar_binding_validation: explicit_binding_required`

If `future_SRC3` is presented:

- result status remains `held`
- no binding lookup authorizes it
- no assignment occurs

## 6 - Prohibited Storage Excluded

Binding metadata rejects these keys:

- `temp_key`
- `contact_email`
- `contact_email_hash`
- `contact_email_encrypted`
- `provider_api_key`
- `service_role_key`
- `raw_email_body`
- `raw_agreement_metadata`
- `private_payment_data`
- `wallet_private_key`
- `seed_phrase`

The assignment function continues to strip the same prohibited metadata keys before passing metadata into the existing issuance routine.

## 7 - Live Seating

Seating route:

- Supabase `exec_sql` RPC
- `.env` server-side Supabase credential

Seating result:

```json
{
  "status": 200,
  "seated": true,
  "body": {
    "ok": true
  }
}
```

## 8 - Held Validation

Missing-binding probe:

- `source_record_type = SRC`
- `source_record_id = validation-src-missing-binding-v1`
- no binding row created
- expected no assignment

Result:

```json
{
  "temp_key_id": null,
  "public_ref": null,
  "status": "held",
  "agreement_acknowledged": false,
  "audit_id": "c8a7d457-5b23-46fe-93a9-c5b57d53465c",
  "communication_trace_id": null
}
```

Audit metadata:

```json
{
  "binding_id": null,
  "hold_reason": "active source / OAR binding is required",
  "reject_reason": "",
  "validation_probe": true,
  "has_active_binding": false,
  "expected_no_assignment": true,
  "implementation_version": "v1",
  "invocation_guard_passed": false,
  "source_oar_binding_validation": "explicit_binding_required",
  "source_binding_hardening_version": "v1"
}
```

`future_SRC3` probe:

- `source_record_type = future_SRC3`
- expected held
- expected no assignment

Result:

```json
{
  "temp_key_id": null,
  "public_ref": null,
  "status": "held",
  "agreement_acknowledged": false,
  "audit_id": "4a069351-a9ba-4af4-8caf-1e7b63c5e124",
  "communication_trace_id": null
}
```

Audit metadata:

```json
{
  "binding_id": null,
  "hold_reason": "future_SRC3 remains held until seated",
  "reject_reason": "",
  "validation_probe": true,
  "has_active_binding": false,
  "expected_no_assignment": true,
  "implementation_version": "v1",
  "invocation_guard_passed": false,
  "source_oar_binding_validation": "explicit_binding_required",
  "source_binding_hardening_version": "v1"
}
```

Support read for the missing-binding probe returned:

```json
[]
```

This confirms no active binding existed for the probe.

## 9 - Access Validation

Anon invocation of `assign_temp_c3_key`:

```json
{
  "code": "42501",
  "message": "permission denied for function assign_temp_c3_key"
}
```

Anon invocation of `get_c3_key_source_oar_binding_support_read`:

```json
{
  "code": "42501",
  "message": "permission denied for function get_c3_key_source_oar_binding_support_read"
}
```

No public / anon execute access was opened.

No authenticated broad execute access was opened.

## 10 - Live Counts After Validation

Readback counts:

```json
{
  "c3_key_temp_total": 1,
  "c3_key_temp_from_hardening_oar": 0,
  "c3_key_temp_agreement_ack_total": 1,
  "c3_key_temp_agreement_ack_from_hardening_oar": 0,
  "c3_key_permission_map_total": 0,
  "c3_key_source_oar_binding_total": 0,
  "c3_key_source_oar_binding_from_hardening_oar": 0,
  "c3_key_system_function_audit_from_hardening_oar": 2
}
```

Interpretation:

- no temporary c3 Key was issued by this hardening validation
- no agreement acknowledgment was created by this hardening validation
- no permission map row exists
- no binding row was created by validation
- two audit rows were created for held probes
- pre-existing temp key and agreement acknowledgment standing remained untouched

## 11 - Boundaries Held

No temporary c3 Key was issued.

No permission was granted.

No permission was activated.

No permission map record was created.

No permission map record was mutated.

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

1. source / OAR binding hardening seated
2. exact files created / modified documented
3. DB mutation occurred and is documented
4. source record types bounded to `SRC`, `SRC1`, and `SRC2`
5. `future_SRC3` remains held
6. binding fields required
7. prohibited fields excluded
8. RLS enabled in table seating SQL
9. no public / anon policy opened
10. `assign_temp_c3_key` hardening applied
11. missing-binding behavior validated
12. no temp c3 Key issued
13. no permission granted
14. no permission activated
15. no runtime / public API opened
16. no wallet / NFT / payment action
17. no DAO / distribution activation
18. no recognition / conversion standing created
19. folder reconciliation not performed
20. process rule not created
21. file staged in measures_interoperability intentionally
22. final folder reconciliation remains pending
23. next route recommendation documented

## 13 - Next Route Recommendation

Recommended next route:

`OAR2 - c3 Key Source OAR Binding Operator Seating Packet v1`

Purpose:

- define how an operator creates an active `SRC`, `SRC1`, or `SRC2` source / OAR binding
- keep binding creation audit-safe
- avoid direct ad hoc inserts before real assignment
- preserve no-public-access posture

Alternate next route:

`OAR2 - c3 Key Assign Temporary System Function Operator Use Packet v1`

Use only after a valid active source / OAR binding exists.

## CLOSE

Source binding hardening is seated.

Presence-only validation is retired for real assignment.

Explicit active binding is required.

`future_SRC3` remains held.

Real assignment waits for a bound source.

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
