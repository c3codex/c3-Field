---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 - Temporary c3 Key Issuance Route v1
status: completed
version: v1
operator: op044
date: 2026-05-31
source_oar2: docs/oar/measures_interoperability/oar2_temp_c3_key_issuance_route_v1.meta.md
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
  - issuance-route
  - named-individual-required
  - expiration-policy
  - continuity-event
  - service-role
  - no-public-insert
  - no-nft-mint
  - no-recognition
  - no-conversion
  - no-runtime
source_alignment:
  - OAR2 - Temporary c3 Key Issuance Route v1
  - OAR1 - Temporary c3 Key + Alternate Payment Route Contract v1
  - Seed Concordance
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - Temporary c3 Key Issuance Route v1

## Status

**Completed with live DB seating.**

Temporary c3 Key issuance is now governed through a bounded server-side/admin route. Every issued temp key must bind to a Named Individual. Institution in Service may participate, but cannot replace the Named Individual.

Expiration standing is enforced at issuance. Temporary actions are traceable through continuity events.

No payment processor was activated. No Stripe payment link or invoice was created. No NFT deployment occurred. No minting occurred. No wallet was bound. No recognition, conversion, runtime, or CSS standing was created.

## 1 - Files Created

| File | Standing |
|---|---|
| `docs/oar/measures_interoperability/sql/seat_temp_c3_key_issuance_route_v1.sql` | Operator-gated SQL seating artifact |
| `supabase/migrations/202605310002_temp_c3_key_issuance_route.sql` | Repo migration artifact |
| `docs/oar/measures_interoperability/oar1_temp_c3_key_issuance_route_v1.meta.md` | This closeout |

## 2 - DB Mutation Standing

Production DB mutation standing: **performed under OAR2 authorization**.

Execution route: Supabase `exec_sql` RPC using `.env` and the server-side `SUPABASE_C3_SECRET` credential.

Execution result:

```json
{
  "seating": "PASS",
  "rpc": { "ok": true }
}
```

## 3 - Function Seated

Function / RPC name:

```sql
public.issue_temp_c3_key(...)
```

Function standing:

- `SECURITY DEFINER`
- `search_path = public, extensions`
- explicit execute grant only to `service_role`
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`

Allowed access route remains server-side/admin only.

No anonymous insert route was created.

No public RLS policy was opened.

No frontend direct insert was created.

## 4 - Table Constraint Hardened

`public.c3_key_temp` constraint `c3_key_temp_origin_reference_check` was replaced with:

```sql
named_individual_ref is not null
and (
  origin_type = 'named_individual'
  or (
    origin_type = 'institution_in_service'
    and institution_key is not null
  )
)
```

Result:

- Named Individual is always required
- Institution in Service requires `institution_key`
- institution-only temp keys cannot be issued

## 5 - Continuity Event Route

Table seated:

```sql
public.c3_key_temp_continuity_event
```

Continuity standing:

- links each event to `public.c3_key_temp(id)`
- uses `ON DELETE CASCADE` for validation cleanup and temp-key trace lifecycle consistency
- bounds event types to the OAR2 list
- requires `source_oar_id`
- stores metadata as JSON object
- RLS enabled
- zero public policies

Issuance creates one continuity event for the seated validation path.

Permanent c3 Key resolution remains future route. The temp key does not become the NFT; it remains trace for future wallet / NFT migration.

## 6 - Expiration Policy

If `expires_at` is not supplied, `public.issue_temp_c3_key(...)` calculates it from issued standing:

- `issued` / `payment_pending`: `now() + interval '14 days'`
- `payment_confirmed`: `now() + interval '90 days'`
- fallback: `now() + interval '14 days'`

The validation issuance used confirmed payment standing and returned an expiration more than 80 days in the future, proving the 90-day branch was active.

Renewal remains future route and requires OAR trace. No renewal function was created.

## 7 - Email Boundary

Email handling:

- accepted only as `p_contact_email`
- normalized with `lower(btrim(...))`
- hashed with `extensions.digest(..., 'sha256')`
- stored only as `contact_email_hash`
- `contact_email_encrypted` remains null because encryption is not seated
- raw metadata keys `email`, `contact_email`, and `raw_email` are stripped before insert

Email is not key authority, identity authority, recognition authority, conversion authority, wallet authority, or NFT authority.

## 8 - Payment And Credit Boundary

Payment trace enforcement:

- `submitted`, `confirmed`, `refunded`, and `credited` require `payment_route`, `payment_provider`, and `payment_reference`
- `pending` requires `payment_route`
- `operator_grant`, `sponsored_access`, and `manual_recorded_payment` require `source_oar_id` approval trace

Assessment credit enforcement:

- `eligible` requires `assessment_key`
- `eligible` requires `payment_status` of `confirmed` or `credited`
- `credited_to_conversion` requires `payment_status = credited`
- conversion itself remains unauthorized

## 9 - Return Payload Boundary

Support-safe return payload:

- `id`
- `public_ref`
- `status`
- `payment_status`
- `assessment_credit_status`
- `origin_type`
- `institution_key`
- `created_at`
- `expires_at`

The function does not return:

- `temp_key`
- `contact_email_hash`
- `contact_email_encrypted`
- metadata internals
- `source_oar_id`

## 10 - Live Validation

Executed through Supabase `exec_sql` RPC:

- confirmed `public.issue_temp_c3_key` exists
- rejected institution-only issuance
- rejected institution issuance without `institution_key`
- rejected confirmed payment without `payment_reference`
- rejected pending payment without `payment_route`
- rejected eligible assessment credit without confirmed or credited payment
- performed temporary valid institutional issuance
- verified returned `public_ref` format
- verified generated status = `payment_confirmed`
- verified expiration policy returned 90-day standing
- verified one `payment_confirmed` continuity event was created
- verified raw email was not stored
- verified email metadata keys were stripped
- deleted the temporary validation continuity event
- deleted the temporary validation temp-key row
- verified temp-key row count returned to `0`
- verified continuity-event row count returned to `0`
- verified RLS remains enabled on both tables
- verified force RLS remains disabled on both tables
- verified policy count remains `0` on both tables
- verified `PUBLIC`, `anon`, and `authenticated` have no execute grant on `public.issue_temp_c3_key`

Validation result:

```json
{
  "validation": "PASS",
  "rpc": { "ok": true }
}
```

## 11 - Validation Checklist

| Check | Result |
|---|---|
| Issuance route created | PASS |
| Exact files created / modified documented | PASS |
| DB mutation standing stated | PASS |
| Function / RPC name documented | PASS |
| `named_individual_ref` required always | PASS |
| `institution_key` required for `institution_in_service` | PASS |
| Institution-only temp key cannot be issued | PASS |
| Expiration policy enforced | PASS |
| Renewal requires OAR trace | PASS |
| Continuity event route created | PASS |
| Temporary actions remain traceable | PASS |
| Permanent c3 Key resolution relation preserved for future route | PASS |
| Email not stored raw | PASS |
| Payment trace requirements enforced | PASS |
| Assessment credit requirements enforced | PASS |
| Collision handling route documented | PASS |
| Return payload boundary documented | PASS |
| RLS remains enabled | PASS |
| No public insert policy opened | PASS |
| No frontend direct insert created | PASS |
| No NFT minting occurred | PASS |
| No crypto deployment occurred | PASS |
| No recognition / conversion standing created | PASS |
| Temp-key row count after validation = 0 | PASS |
| Continuity-event row count after validation = 0 | PASS |

## 12 - Next Route Recommendation

Next route:

`OAR2 - Temporary c3 Key Operator Issuance Packet v1`

That OAR2 should define the operator-facing issuance packet shape, required source approval evidence, renewal packet requirements, and the exact service-role execution surface for real issuance events.

Payment processor activation remains separate.

Wallet / NFT migration remains separate.

Recognition and conversion remain held.

## Close

Named Individual answers.

Institution participates.

Temp key expires.

Actions remain traceable.

Permanent c3 Key may inherit trace.

Email does not govern.

Payment does not govern.

Wallet waits.

NFT waits.

Codex holds.
