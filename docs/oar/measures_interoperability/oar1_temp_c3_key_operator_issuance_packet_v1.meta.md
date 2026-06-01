---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 - Temporary c3 Key Operator Issuance Packet v1
status: completed
version: v1
operator: op044
date: 2026-05-31
source_oar2: docs/oar/measures_interoperability/oar2_temp_c3_key_operator_issuance_packet_v1.meta.md
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
  - operator-issuance-packet
  - use-agreement
  - agreement-acknowledgment
  - wallet-required-future
  - no-real-issuance
  - no-nft-mint
  - no-recognition
  - no-conversion
  - no-runtime
source_alignment:
  - OAR2 - Temporary c3 Key Operator Issuance Packet v1
  - OAR1 - Temporary c3 Key Issuance Route v1
  - OAR1 - Temporary c3 Key + Alternate Payment Route Contract v1
  - Seed Concordance
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - Temporary c3 Key Operator Issuance Packet v1

## Status

**Completed with live agreement acknowledgment seating.**

The operator now has a governed issuance packet template, a Temp c3 Key Use Agreement acknowledgment surface, and a placeholder service-role execution wrapper.

No real temporary c3 Key was issued. No payment processor was activated. No Stripe payment link or invoice was created. No NFT deployment occurred. No minting occurred. No wallet was bound. No recognition, conversion, runtime, or CSS standing was created.

## 1 - Files Created

| File | Standing |
|---|---|
| `docs/oar/measures_interoperability/sql/seat_temp_c3_key_operator_issuance_packet_v1.sql` | Agreement acknowledgment SQL seating artifact |
| `supabase/migrations/202605310003_temp_c3_key_operator_issuance_packet.sql` | Repo migration artifact |
| `docs/oar/measures_interoperability/templates/temp_c3_key_operator_issuance_packet_v1.json` | Placeholder operator packet template |
| `docs/oar/measures_interoperability/sql/issue_temp_c3_key_operator_packet_v1.sql` | Placeholder service-role execution wrapper |
| `docs/oar/measures_interoperability/oar1_temp_c3_key_operator_issuance_packet_v1.meta.md` | This closeout |

## 2 - DB Mutation Standing

Production DB mutation standing: **performed under OAR2 authorization** for agreement acknowledgment infrastructure only.

Execution route: Supabase `exec_sql` RPC using `.env` and the server-side `SUPABASE_C3_SECRET` credential.

Execution result:

```json
{
  "seating": "PASS",
  "rpc": { "ok": true }
}
```

## 3 - Agreement Acknowledgment Table

Table seated:

```sql
public.c3_key_temp_agreement_ack
```

Agreement acknowledgment standing:

- `temp_key_id` nullable for pre-issuance staged acknowledgment
- `temp_key_id` references `public.c3_key_temp(id)` with `ON DELETE CASCADE`
- `agreement_version`, `agreement_title`, and `agreement_hash` required
- `acknowledged_by_named_individual_ref` required
- `institution_key` available when applicable
- acknowledgment method bounded to:
  - `operator_recorded`
  - `form_checkbox`
  - `signature`
  - `email_confirmation`
- `source_oar_id` required
- metadata must be JSON object
- RLS enabled
- zero public policies

Staged binding route:

1. record agreement acknowledgment before issuance with `temp_key_id = null`
2. call `public.issue_temp_c3_key(...)`
3. bind `public.c3_key_temp_agreement_ack.temp_key_id` to the returned `temp_key_id`
4. return support-safe packet only

## 4 - Operator Packet Template

Template created:

`docs/oar/measures_interoperability/templates/temp_c3_key_operator_issuance_packet_v1.json`

The template uses placeholders only. No real personal data, payment reference, or production packet values were committed.

Required packet rules documented in the template and wrapper:

- `source_oar_id`
- `origin_type`
- `named_individual_ref`
- `agreement_version`
- `agreement_title`
- `agreement_hash`
- `agreement_acknowledgment_method`
- `institution_key` when institutional
- payment trace fields when payment status requires them
- assessment credit fields when assessment credit requires them
- expiration may be omitted to use RPC default policy

## 5 - Use Agreement Requirement

No real temporary c3 Key may be issued unless:

- Temp c3 Key Use Agreement is acknowledged
- or operator-approved exception OAR is attached

The agreement requirement includes:

- temp key is temporary and expires
- temp key does not replace wallet-held c3 Key
- temp key does not confer recognition, verification, conversion, NFT standing, wallet standing, or payment standing
- actions taken under temp c3 Key remain traceable
- future wallet-held c3 Key may inherit temp trace by governed continuity relation
- Named Individual / Institution agrees wallet procurement may be required for permanent access
- future payments, renewals, conversion actions, DAO participation, or governed access may require wallet-based c3 Key
- refusal or failure to procure wallet-held c3 Key may limit future access or participation
- email is contact / recovery only
- operator may hold, expire, revoke, or migrate temp c3 Key under governed OAR route

## 6 - Execution Wrapper

Placeholder execution surface:

`docs/oar/measures_interoperability/sql/issue_temp_c3_key_operator_packet_v1.sql`

The wrapper:

- uses placeholders only
- records agreement acknowledgment first
- calls `public.issue_temp_c3_key(...)`
- binds acknowledgment to returned `temp_key_id`
- returns support-safe payload only
- includes operator instructions not to commit real packet values
- holds real issuance until operator provides completed packet and confirms execution

Support-safe return packet:

- `temp_key_id`
- `public_ref`
- `status`
- `payment_status`
- `assessment_credit_status`
- `origin_type`
- `institution_key`
- `agreement_acknowledged`
- `agreement_version`
- `created_at`
- `expires_at`

Not returned by default:

- `temp_key`
- `contact_email_hash`
- `contact_email_encrypted`
- `source_oar_id` internals
- metadata internals
- raw agreement metadata

## 7 - Renewal Packet Outline

Renewal packet standing is documented in the OAR2 and carried forward.

Renewal is not authorized by this OAR1.

Future renewal packet must include:

- `packet_type: temp_c3_key_renewal`
- `temp_key_id`
- `public_ref`
- `source_oar_id`
- `agreement_version`
- `agreement_hash`
- `renewal_reason`
- `new_expires_at`
- `metadata`

## 8 - Live Validation

Executed through Supabase `exec_sql` RPC:

- confirmed `public.c3_key_temp_agreement_ack` exists
- confirmed temp key row count was `0` before validation
- confirmed continuity event row count was `0` before validation
- confirmed agreement acknowledgment row count was `0` before validation
- inserted one temporary validation acknowledgment row
- deleted the temporary validation acknowledgment row
- confirmed temp key row count returned to `0`
- confirmed continuity event row count returned to `0`
- confirmed agreement acknowledgment row count returned to `0`
- confirmed RLS enabled on agreement acknowledgment table
- confirmed force RLS disabled on agreement acknowledgment table
- confirmed policy count = `0`

Validation result:

```json
{
  "validation": "PASS",
  "rpc": { "ok": true }
}
```

## 9 - Validation Checklist

| Check | Result |
|---|---|
| Operator packet template created | PASS |
| Agreement acknowledgment requirement documented | PASS |
| Agreement acknowledgment table created | PASS |
| Exact files created / modified documented | PASS |
| No real temp key row inserted | PASS |
| Test validation rows returned to 0 | PASS |
| No raw production personal data committed | PASS |
| Required field rules documented | PASS |
| Payment field rules documented | PASS |
| Assessment credit rules documented | PASS |
| Expiration policy documented | PASS |
| Wallet-held c3 Key requirement documented | PASS |
| Future wallet-based payment requirement documented | PASS |
| Support-safe return packet documented | PASS |
| Renewal packet outline documented | PASS |
| No public RLS policy opened | PASS |
| No frontend direct insert created | PASS |
| No Stripe activation occurred | PASS |
| No NFT minting occurred | PASS |
| No crypto deployment occurred | PASS |
| No recognition / conversion standing created | PASS |

## 10 - Next Route Recommendation

Next route:

`OAR2 - Temporary c3 Key Real Issuance Execution v1`

That OAR2 should include a completed operator packet, explicit execution confirmation, and post-issuance OAR1 evidence with support-safe return packet only.

Payment processor activation remains separate.

Wallet / NFT migration remains separate.

Recognition and conversion remain held.

## Close

Issuance route exists.

Use agreement required.

Operator packet formed.

Real issuance waits for completed packet.

Payment processor waits.

Wallet waits.

NFT waits.

Codex holds.
