---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 - Temporary c3 Key Communication Trace Surface v1
status: completed
version: v1
operator: op044
date: 2026-05-31
source_oar2: docs/oar/measures_interoperability/oar2_temp_c3_key_communication_trace_surface_v1.meta.md
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
  - email-confirmation
  - support-safe
  - resend
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR2 - Temporary c3 Key Communication Trace Surface v1
  - OAR1 - Temporary c3 Key Email Provider Configuration and Delivery Retry v1
  - OAR1 - Temporary c3 Key Real Issuance Execution v1
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - Temporary c3 Key Communication Trace Surface v1

## Status

**Completed with live DB seating and one support-safe backfill row.**

A governed communication trace surface now exists for temporary c3 Key communications.

No new email was sent. No runtime, CSS, NFT, wallet binding, Stripe/payment link, recognition, or conversion standing was created.

## 1 - Files Created

| File | Standing |
|---|---|
| `docs/oar/measures_interoperability/sql/seat_temp_c3_key_communication_trace_surface_v1.sql` | Operator-gated SQL seating artifact |
| `supabase/migrations/202605310004_temp_c3_key_communication_trace_surface.sql` | Repo migration artifact |
| `docs/oar/measures_interoperability/oar1_temp_c3_key_communication_trace_surface_v1.meta.md` | This closeout |

## 2 - DB Mutation Standing

Production DB mutation standing: **performed under OAR2 authorization**.

Execution route:

- Supabase `exec_sql` RPC
- `.env` server-side Supabase credential
- SQL artifact: `docs/oar/measures_interoperability/sql/seat_temp_c3_key_communication_trace_surface_v1.sql`

The seating call completed. Supabase PostgREST schema cache was reloaded after table creation so direct support-safe validation could read the new table.

## 3 - Table Seated

Table:

`public.c3_key_communication_trace`

Standing:

- relation to `public.c3_key_temp(id)` with `ON DELETE SET NULL`
- bounded `communication_type`
- bounded `delivery_channel`
- bounded `delivery_status`
- support-safe provider evidence fields
- support-safe recipient/sender/reply-to reference fields
- support-safe `public_ref`
- required `source_oar_id`
- JSON object metadata only
- RLS enabled
- no public policy intentionally opened
- unique provider message guard for non-null `provider` + `provider_message_id`

## 4 - Bounded Values

Communication types:

- `temp_key_confirmation`
- `agreement_notice`
- `expiration_notice`
- `renewal_notice`
- `wallet_migration_notice`
- `payment_notice`
- `support_notice`

Delivery channels:

- `email`
- `operator_record`
- `manual`
- `system`

Delivery statuses:

- `prepared`
- `sent`
- `delivered_to_provider`
- `held`
- `failed`
- `cancelled`

Negative validation confirmed:

- invalid communication type `email_confirmation_sent` rejected with check violation
- invalid delivery status `emailed` rejected with check violation
- zero invalid validation rows persisted

## 5 - Backfill Trace

Backfilled one communication trace row for the completed confirmation email.

Trace id:

`693db7b5-3203-4858-b6e6-0ff2ecac653a`

Backfill standing:

```yaml
communication_type: temp_key_confirmation
delivery_channel: email
delivery_status: delivered_to_provider
provider: resend
provider_message_id: 283da82e-c839-4ba5-b92d-1c0579b79388
recipient_ref: connect@measuresregistry.com
sender_ref: Measures Registry <notifications@measuresregistry.com>
reply_to_ref: connect@measuresregistry.com
public_ref: C3-TEMP-1A135A
subject: Temporary c3 Key Confirmation - C3-TEMP-1A135A
source_oar_id: oar2_temp_c3_key_email_provider_configuration_and_delivery_retry_v1
sent_at: 2026-06-01T01:10:28.020235+00:00
```

Metadata:

```json
{
  "source_oar2": "docs/oar/measures_interoperability/oar2_temp_c3_key_communication_trace_surface_v1.meta.md",
  "delivery_oar1": "docs/oar/measures_interoperability/oar1_temp_c3_key_email_provider_configuration_and_delivery_retry_v1.meta.md",
  "support_safe": true,
  "raw_email_body_stored": false,
  "secrets_stored": false,
  "temp_key_stored": false
}
```

## 6 - Temp Key Binding

`public_ref = C3-TEMP-1A135A` resolved safely to the existing temporary c3 Key row.

Trace binding:

- temp key resolution count: 1
- communication trace count for provider message id: 1
- trace `temp_key_id` bound to resolved temp key: true

The raw `temp_key` value was not read into the closeout and was not stored in the communication trace.

## 7 - Public Boundary

Anon read validation:

```json
{
  "anon_error_code": null,
  "anon_error_message": null,
  "anon_visible_count": 0,
  "anon_visible_rows": 0
}
```

The communication trace is not publicly exposed through anon reads.

## 8 - Support-Safe Boundary

Allowed and stored:

- `public_ref`
- provider
- provider message id
- recipient reference
- sender reference
- reply-to reference
- subject
- delivery status
- source OAR id
- non-sensitive metadata

Not stored:

- `temp_key`
- provider API key
- service-role key
- contact email hash
- contact email encrypted value
- raw email body
- raw agreement metadata
- private payment data

## 9 - Validation Checklist

| Check | Result |
|---|---|
| Communication trace table created or prepared | PASS |
| Exact files created / modified documented | PASS |
| DB mutation occurred | PASS |
| RLS enabled | PASS |
| No public policies intentionally opened | PASS |
| Communication types bounded | PASS |
| Delivery statuses bounded | PASS |
| Support-safe fields only | PASS |
| No secrets stored | PASS |
| No `temp_key` stored | PASS |
| No contact email hash / encrypted value stored | PASS |
| Prior confirmation delivery trace backfilled | PASS |
| Provider message ID captured | PASS |
| `temp_key_id` binding standing documented | PASS |
| No new email sent | PASS |
| No runtime / CSS mutation occurred | PASS |
| No NFT minting occurred | PASS |
| No crypto deployment occurred | PASS |
| No wallet binding occurred | PASS |
| No Stripe / payment link activation occurred | PASS |
| No recognition / conversion standing created | PASS |

## 10 - Next Route Recommendation

Next route:

`OAR2 - Temporary c3 Key Communication Trace Runtime Read Model v1`

That route should remain read-only and should define any future admin/support read model without opening public policies or exposing private authority.

## Close

Communication trace seated.

Email delivery is queryable.

Private authority remains hidden.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
