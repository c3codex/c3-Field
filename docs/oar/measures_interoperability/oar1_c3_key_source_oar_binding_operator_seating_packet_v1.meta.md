---
document_type: oar1
authority_level: recorded
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Source OAR Binding Operator Seating Packet v1
status: recorded
version: v1
operator: op044
system: c3_field_systems
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_source_oar_binding_operator_seating_packet_v1.meta.md
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
---

# OAR1 - c3 Key Source OAR Binding Operator Seating Packet v1

## 1 - Execution Standing

OAR2 executed.

Operator-safe source / OAR binding seating path is seated.

Protected RPC seated:

`public.seat_c3_key_source_oar_binding(...)`

DB mutation standing: **performed under OAR2 authorization**.

The mutation extended the c3 Key system-function audit constraint to include:

`seat_c3_key_source_oar_binding`

Then it seated the protected RPC that can create or update rows in:

`public.c3_key_source_oar_binding`

No temporary c3 Key was issued by this packet.

No permission was granted.

No runtime was opened.

## 2 - Files Created / Modified

Created:

- `docs/oar/measures_interoperability/sql/seat_c3_key_source_oar_binding_operator_seating_packet_v1.sql`
- `supabase/migrations/202606010006_c3_key_source_oar_binding_operator_seating_packet.sql`
- `docs/oar/measures_interoperability/oar1_c3_key_source_oar_binding_operator_seating_packet_v1.meta.md`

Existing OAR2 staged by operator:

- `docs/oar/measures_interoperability/oar2_c3_key_source_oar_binding_operator_seating_packet_v1.meta.md`

The SQL artifact and migration were verified as identical before DB seating.

No frontend source files were modified.

No runtime route files were modified.

## 3 - RPC Contract

Seated function:

`public.seat_c3_key_source_oar_binding(...)`

Input contract:

- `p_source_record_type`
- `p_source_record_id`
- `p_source_oar_id`
- `p_source_oar_path`
- `p_operator_ref`
- `p_operator_authorization_method`
- `p_binding_status`
- `p_support_safe`
- `p_metadata`

Allowed source record types:

- `SRC`
- `SRC1`
- `SRC2`

Held source record type:

- `future_SRC3`

Allowed binding statuses:

- `active`
- `held`
- `revoked`
- `rejected`

Required for active binding:

- source record type is `SRC`, `SRC1`, or `SRC2`
- source record id present
- source OAR id present
- source OAR path present
- operator ref present
- operator authorization method allowed
- `support_safe = true`
- audit row created

## 4 - Support-Safe Output

The RPC returns only:

- `binding_id`
- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `binding_status`
- `has_active_binding`
- `audit_id`
- `created_at`
- `updated_at`

The RPC does not return:

- `temp_key`
- contact email
- contact email hash
- contact email encrypted
- provider secrets
- service-role secrets
- raw metadata
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase

## 5 - Audit Requirement

Every invocation that reaches the RPC creates or attempts to create a row in:

`public.c3_key_system_function_audit`

Audit shape:

- `function_name = seat_c3_key_source_oar_binding`
- `action_type = source_binding`
- `result_status = prepared | executed | held | rejected`
- `operator_ref`
- `source_oar_id`
- `input_ref`
- `output_ref`
- `support_safe = true`
- `metadata.source_binding_packet_version = v1`

Missing `operator_ref` and missing `source_oar_id` are rejected and do not create an active binding.

No audit, no active binding.

## 6 - Metadata Safety

The RPC strips prohibited metadata keys before writing audit or binding metadata:

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

Validation confirmed a probe containing `temp_key`, `contact_email`, and `seed_phrase` stored only support-safe metadata:

```json
{
  "support_safe": true,
  "operator_note": "metadata stripping probe",
  "packet_version": "v1",
  "validation_probe": true,
  "source_binding_packet_version": "v1"
}
```

## 7 - Access Posture

RPC posture:

- `SECURITY DEFINER`
- fixed `search_path = public, extensions`
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`
- execute granted to `service_role`

Binding table posture retained:

- RLS remains enabled by seated hardening SQL
- no public policies were created by this packet
- no anon table access opened
- no authenticated broad table access opened
- no frontend direct read or write opened

Anon validation:

```json
{
  "seat_rpc": {
    "code": "42501",
    "message": "permission denied for function seat_c3_key_source_oar_binding"
  },
  "binding_table": {
    "code": "42501",
    "message": "permission denied for table c3_key_source_oar_binding"
  },
  "support_read_rpc": {
    "code": "42501",
    "message": "permission denied for function get_c3_key_source_oar_binding_support_read"
  }
}
```

## 8 - Live Seating

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

## 9 - Validation Probes

Initial validation surfaced an RPC SQL ambiguity in the upsert path:

```json
{
  "code": "42702",
  "message": "column reference \"source_record_type\" is ambiguous"
}
```

Correction applied:

- upsert now targets named constraint `c3_key_source_oar_binding_unique_source_oar`
- missing `operator_ref` and missing `source_oar_id` now return rejected support-safe packets instead of raising before packet standing is visible

Corrected validation results:

Active synthetic SRC binding created:

```json
{
  "binding_id": "73b633e3-62c8-4454-a80f-2fe91be944f7",
  "source_record_type": "SRC",
  "source_record_id": "validation-operator-binding-src-v1",
  "binding_status": "active",
  "has_active_binding": true,
  "audit_id": "860db1e6-5ede-4e78-9a3e-f0ba29c9f37c"
}
```

Same synthetic binding was then revoked:

```json
{
  "binding_id": "73b633e3-62c8-4454-a80f-2fe91be944f7",
  "binding_status": "revoked",
  "has_active_binding": false,
  "audit_id": "e24edcf4-3c50-4cad-a07d-0913ebf9eddd"
}
```

`future_SRC3` held:

```json
{
  "binding_id": null,
  "source_record_type": "future_SRC3",
  "binding_status": "held",
  "has_active_binding": false,
  "audit_id": "b7569f93-8dae-41d4-93ba-f7636fd1036c"
}
```

Missing source record id rejected:

```json
{
  "binding_id": null,
  "binding_status": "rejected",
  "has_active_binding": false,
  "audit_id": "93e1b9e2-d309-4bed-b29a-09d162715acd"
}
```

Missing source OAR id rejected:

```json
{
  "binding_id": null,
  "binding_status": "rejected",
  "has_active_binding": false,
  "audit_id": "d6981f11-cc64-4980-bfb2-7d04aea93800"
}
```

Missing operator ref rejected:

```json
{
  "binding_id": null,
  "binding_status": "rejected",
  "has_active_binding": false,
  "audit_id": "9dd05ade-f35a-4418-952a-f5fc740f8c95"
}
```

Unsafe support flag rejected:

```json
{
  "binding_id": null,
  "binding_status": "rejected",
  "has_active_binding": false,
  "audit_id": "7047d0b4-f1dc-4717-8057-a695bccac52a"
}
```

Unsafe metadata stripping probe created held non-active standing:

```json
{
  "binding_id": "df9cd55f-1277-4ec0-8e0d-e0fddca5d12b",
  "binding_status": "held",
  "has_active_binding": false,
  "audit_id": "1f8ae1ea-53da-4a4f-9d67-5d5ef9226ef3"
}
```

Validation intentionally left no active synthetic binding.

## 10 - Live Counts After Validation

Readback counts:

```json
{
  "c3_key_temp": 1,
  "c3_key_temp_from_operator_oar": 0,
  "c3_key_temp_agreement_ack_from_operator_oar": 0,
  "c3_key_permission_map": 0,
  "c3_key_source_oar_binding_from_operator_oar": 2,
  "active_binding_from_operator_oar": 0,
  "c3_key_system_function_audit_from_operator_oar": 10
}
```

Interpretation:

- no temporary c3 Key was issued
- no agreement acknowledgment was created
- no permission map row exists
- validation created two non-active support-safe binding rows
- one synthetic validation binding is `revoked`
- one metadata-stripping validation binding is `held`
- no active synthetic binding remains
- audit rows record the validation and correction path

## 11 - Relationship To assign_temp_c3_key

This packet does not call:

`public.assign_temp_c3_key(...)`

This packet only seats the operator-safe binding path required before a future real assignment.

Real assignment still requires a valid active source / OAR binding and remains separately routed.

## 12 - Boundaries Held

No temporary c3 Key was issued.

No agreement acknowledgment was created for a temporary c3 Key.

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

## 13 - Validation Against OAR2

Confirmed:

1. operator seating packet seated
2. exact files created / modified documented
3. DB mutation occurred and is documented
4. protected binding RPC name documented
5. source types bounded to `SRC`, `SRC1`, and `SRC2`
6. `future_SRC3` held
7. audit requirement enforced
8. `support_safe` required true
9. prohibited metadata excluded
10. support-safe output enforced
11. RLS remains enabled on binding table by seated hardening contract
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
24. next route recommendation documented

## 14 - Next Route Recommendation

Recommended next route:

`OAR2 - c3 Key Assign Temporary System Function Operator Use Packet v1`

Purpose:

- define the governed operator-use packet for a real temporary c3 Key assignment
- require a real active source / OAR binding first
- preserve support-safe output
- keep permission grants separate

Alternate next route:

`OAR2 - c3 Key Source OAR Binding Real Source Seating v1`

Use this if the immediate next action is to seat a real active source / OAR binding before assignment.

## CLOSE

Operator binding packet is seated.

Active binding now has a governed path.

No active validation binding remains.

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
