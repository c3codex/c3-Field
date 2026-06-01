---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 - Temporary c3 Key Communication Trace Runtime Read Model v1
status: completed
version: v1
operator: op044
date: 2026-05-31
source_oar2: docs/oar/measures_interoperability/oar2_temp_c3_key_communication_trace_runtime_read_model_v1.meta.md
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
  - measures-interoperability
  - temp-c3-key
  - communication-trace
  - runtime-read-model
  - admin-support-read
  - support-safe
  - no-public-access
  - no-runtime-execution
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR2 - Temporary c3 Key Communication Trace Runtime Read Model v1
  - OAR1 - Temporary c3 Key Communication Trace Surface v1
  - OAR1 - Temporary c3 Key Email Provider Configuration and Delivery Retry v1
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - Temporary c3 Key Communication Trace Runtime Read Model v1

## Status

**Completed with live admin/service-role read RPC seating.**

A support-safe read model now exists for temporary c3 Key communication trace records.

No frontend runtime was wired. No public access was opened. No communication trace records were mutated. No email was sent or resent. No wallet, NFT, payment, recognition, conversion, runtime, or CSS standing was created.

## 1 - Files Created

| File | Standing |
|---|---|
| `docs/oar/measures_interoperability/sql/seat_temp_c3_key_communication_trace_runtime_read_model_v1.sql` | Operator-gated SQL seating artifact |
| `supabase/migrations/202605310005_temp_c3_key_communication_trace_runtime_read_model.sql` | Repo migration artifact |
| `docs/oar/measures_interoperability/oar1_temp_c3_key_communication_trace_runtime_read_model_v1.meta.md` | This closeout |

## 2 - DB Mutation Standing

Production DB mutation standing: **performed under OAR2 authorization**.

Execution route:

- Supabase `exec_sql` RPC
- `.env` server-side Supabase credential
- SQL artifact: `docs/oar/measures_interoperability/sql/seat_temp_c3_key_communication_trace_runtime_read_model_v1.sql`

The seating call completed and Supabase PostgREST schema cache was reloaded for RPC validation.

## 3 - Read Model Seated

RPC:

`public.get_c3_key_communication_trace_support_read(text,text)`

Access posture:

- `SECURITY DEFINER`
- explicit execute grant to `service_role`
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`
- no frontend direct read route created
- no public RLS policy opened

View creation was intentionally avoided because Supabase view access can create access ambiguity. The seated RPC keeps the read model bounded to admin/service-role usage.

## 4 - Allowed Response Fields

Service-role validation returned one row for:

- `public_ref = C3-TEMP-1A135A`
- `provider_message_id = 283da82e-c839-4ba5-b92d-1c0579b79388`

Returned fields:

- `trace_id`
- `temp_key_id`
- `public_ref`
- `communication_type`
- `delivery_channel`
- `delivery_status`
- `provider`
- `provider_message_id`
- `recipient_ref`
- `sender_ref`
- `reply_to_ref`
- `subject`
- `source_oar_id`
- `sent_at`
- `created_at`
- `has_temp_key_binding`
- `support_metadata`

Support metadata shape:

```json
{
  "support_safe": true,
  "secrets_stored": false,
  "temp_key_stored": false,
  "raw_email_body_stored": false
}
```

## 5 - Prohibited Fields Excluded

Validation confirmed none of these fields are returned by the RPC:

- `temp_key`
- `contact_email_hash`
- `contact_email_encrypted`
- provider API key
- service-role key
- raw email body
- raw agreement metadata
- private payment data
- unbounded metadata payload

## 6 - Access Validation

Service-role validation:

```json
{
  "service_role_row_count": 1,
  "has_temp_key_binding": true,
  "trace_id": "693db7b5-3203-4858-b6e6-0ff2ecac653a",
  "provider_message_id": "283da82e-c839-4ba5-b92d-1c0579b79388"
}
```

Anon RPC validation:

```json
{
  "anon_error_code": "42501",
  "anon_error_message": "permission denied for function get_c3_key_communication_trace_support_read",
  "anon_visible_rows": null
}
```

Database-side guard assertions:

```json
{
  "guard_assertions": "PASS"
}
```

The guard assertion verified:

- RLS remains enabled on `public.c3_key_communication_trace`
- policy count for `public.c3_key_communication_trace` remains `0`
- `PUBLIC` cannot execute the support read RPC
- `anon` cannot execute the support read RPC
- `authenticated` cannot execute the support read RPC
- `service_role` can execute the support read RPC

## 7 - Validation Checklist

| Check | Result |
|---|---|
| Read model created or prepared | PASS |
| Exact files created / modified documented | PASS |
| DB mutation occurred | PASS |
| View / RPC name documented | PASS |
| Allowed fields documented | PASS |
| Prohibited fields excluded | PASS |
| No `temp_key` exposed | PASS |
| No `contact_email_hash` exposed | PASS |
| No `contact_email_encrypted` exposed | PASS |
| No provider secrets exposed | PASS |
| No service-role secrets exposed | PASS |
| No raw email body exposed | PASS |
| RLS remains enabled on base table | PASS |
| No public / anon policy opened | PASS |
| No frontend runtime wired | PASS |
| No mutation route created | PASS |
| No email sent / resend occurred | PASS |
| No wallet binding occurred | PASS |
| No NFT minting occurred | PASS |
| No recognition / conversion standing created | PASS |

## 8 - Next Route Recommendation

Next route:

`OAR2 - Temporary c3 Key Admin Support Read Surface v1`

That route should remain admin-only and may define an authenticated operator surface if and only if access policy, operator identity, and audit logging are separately authorized.

## Close

Read model seated.

Runtime still waits.

Public access remains closed.

Private authority remains hidden.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
