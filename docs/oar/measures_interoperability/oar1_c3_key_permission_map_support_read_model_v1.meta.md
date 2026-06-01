---
document_type: oar1
authority_level: recorded
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Permission Map Support Read Model v1
status: recorded
version: v1
operator: op044
system: c3_field_systems
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_permission_map_support_read_model_v1.meta.md
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
  - permission-map
  - support-read-model
  - service-role-only
  - support-safe
  - no-public-access
  - staging
  - folder-reconciliation-pending
---

# OAR1 - c3 Key Permission Map Support Read Model v1

## 1 - Execution Standing

OAR2 executed.

Support-safe read model seated for:

`public.c3_key_permission_map`

RPC seated:

`public.get_c3_key_permission_map_support_read(text,text)`

Execution route:

- Supabase `exec_sql` RPC
- `.env` server-side Supabase credential
- SQL artifact: `docs/oar/measures_interoperability/sql/seat_c3_key_permission_map_support_read_model_v1.sql`
- migration artifact: `supabase/migrations/202606010003_c3_key_permission_map_support_read_model.sql`

DB mutation standing: **performed under OAR2 authorization**.

The mutation created or replaced only the support-read RPC and its execute grants.

## 2 - Files Created / Modified

Created:

- `docs/oar/measures_interoperability/sql/seat_c3_key_permission_map_support_read_model_v1.sql`
- `supabase/migrations/202606010003_c3_key_permission_map_support_read_model.sql`
- `docs/oar/measures_interoperability/oar1_c3_key_permission_map_support_read_model_v1.meta.md`

Existing OAR2 staged by operator:

- `docs/oar/measures_interoperability/oar2_c3_key_permission_map_support_read_model_v1.meta.md`

No frontend source files were modified.

No runtime route files were modified.

## 3 - Read Model Contract

RPC:

`public.get_c3_key_permission_map_support_read(text,text)`

Parameters:

- `p_public_ref text default null`
- `p_permission_class text default null`

Access posture:

- `SECURITY DEFINER`
- `search_path = public`
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`
- execute granted to `service_role`

View creation was intentionally avoided. The read model uses RPC to avoid Supabase view access ambiguity.

## 4 - Allowed Response Fields

Returned fields:

- `permission_id`
- `temp_key_id`
- `public_ref`
- `key_form`
- `origin_type`
- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `source_oar_path`
- `permission_class`
- `permission_status`
- `branch_key`
- `branch_scope`
- `role_key`
- `role_nft_contract`
- `role_nft_token_id`
- `audit_id`
- `expires_at`
- `revoked_at`
- `support_safe`
- `created_at`
- `updated_at`
- `has_audit_link`
- `is_expired`
- `has_branch_scope`
- `has_role_reference`

Allowed support metadata:

- `support_safe`

No unbounded metadata payload is returned.

## 5 - Prohibited Fields Excluded

Validation confirmed the read model does not return:

- `temp_key`
- `contact_email_hash`
- `contact_email_encrypted`
- provider API key
- service-role key
- raw email body
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase
- unbounded private metadata
- raw `metadata`

`temp_key_id` is returned as an allowed relation identifier. The secret key value itself is not returned.

## 6 - Live Validation

Service-role read validation:

```json
{
  "service_role_row_count": 0,
  "prohibited_returned": []
}
```

Anon RPC validation:

```json
{
  "anon_status": 401,
  "anon_code": "42501",
  "anon_message": "permission denied for function get_c3_key_permission_map_support_read"
}
```

Database guard assertion:

```json
{
  "guard_assertions": "PASS"
}
```

The guard assertion verified:

- support read RPC exists
- RLS remains enabled on `public.c3_key_permission_map`
- policy count on `public.c3_key_permission_map` remains `0`
- row count on `public.c3_key_permission_map` remains `0`
- `anon` cannot execute the RPC
- `authenticated` cannot execute the RPC
- `service_role` can execute the RPC

## 7 - Boundaries Held

No permission was granted.

No permission was activated.

No permission records were mutated.

No c3 Key records were mutated.

No public policy was opened.

No anon access was opened.

No authenticated broad access was opened.

No frontend runtime was wired.

No public c3 Key lookup was created.

No public API was opened.

No DAO voting was activated.

No distribution was activated.

No wallet was bound.

No wallet verification was performed.

No NFT was deployed or minted.

No Role NFT was minted.

No payment standing was activated.

No recognition standing was created.

No conversion standing was created.

No folder reconciliation was performed.

No process rule was created.

## 8 - Validation Against OAR2

Confirmed:

1. support read model created
2. exact files created / modified documented
3. DB mutation occurred and is documented
4. RPC name documented
5. allowed fields documented
6. prohibited fields excluded
7. RLS remains enabled on base table
8. no public / anon policy opened
9. service-role-only posture confirmed
10. no permission granted
11. no permission activated
12. no permission records mutated
13. no runtime / public API opened
14. no DAO / distribution activation
15. no wallet / NFT / payment action
16. no recognition / conversion standing created
17. folder reconciliation not performed
18. process rule not created
19. file staged in measures_interoperability intentionally
20. final folder reconciliation remains pending
21. next route recommendation documented

## 9 - Next Route Recommendation

Recommended next route:

`OAR2 - c3 Key Permission Map Support Read Model Operator Use Packet v1`

Purpose:

- define operator/admin usage pattern
- define acceptable support queries
- define audit expectations for support reads
- preserve service-role-only posture
- keep frontend/runtime/public lookup closed

Alternate next route:

`OAR2 - c3 Key Assign Temporary System Function Invocation Guard v1`

Use this route if the permission-map support read model is sufficient and the next required system surface is callable-function guard seating for `assign_temp_c3_key`.

## CLOSE

Permission storage remains closed.

Support read model is seated.

No permission granted.

No permission activated.

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
