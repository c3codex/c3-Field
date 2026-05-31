---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 - Temporary c3 Key + Alternate Payment Route Contract v1
status: completed
version: v1
operator: op044
date: 2026-05-31
source_oar2: docs/oar/measures_interoperability/oar2_temp_c3_key_alternate_payment_route_contract_v1.meta.md
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
  - alternate-payment
  - payment-trace
  - wallet-migration
  - no-nft-mint
  - no-recognition
  - no-conversion
  - no-runtime
source_alignment:
  - OAR2 - Temporary c3 Key + Alternate Payment Route Contract v1
  - OAR1 - c3 Key NFT Contract Setup v1
  - OAR1 - c3 Key Metadata Schema + Image Binding v1
  - OAR1 - c3 Key Contract Audit Readiness v1
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - Temporary c3 Key + Alternate Payment Route Contract v1

## Status

**Completed with live DB seating.**

Temporary c3 Key continuity and alternate payment trace are defined and seated as a bounded database surface.

No payment processor was activated. No Stripe invoice or payment link was generated. No NFT deployment occurred. No minting occurred. No wallet was bound. No recognition, conversion, seal, delivery contract, runtime, or CSS standing was created.

## 1 - Files Created

| File | Standing |
|---|---|
| `docs/oar/measures_interoperability/sql/seat_c3_key_temp_alternate_payment_route_contract_v1.sql` | Operator-gated SQL seating artifact |
| `supabase/migrations/202605310001_c3_key_temp_alternate_payment_route.sql` | Repo migration artifact |
| `docs/oar/measures_interoperability/oar1_temp_c3_key_alternate_payment_route_contract_v1.meta.md` | This closeout |

## 2 - Schema Seated

The seated table is:

`public.c3_key_temp`

The table defines:

- `temp_key` as internal access identifier, unique and non-guessable by generated default
- `public_ref` as safe receipt / support reference, unique and generated separately
- `origin_type` bounded to `named_individual` or `institution_in_service`
- origin reference constraint requiring the matching named individual or institution reference
- contact email hash / encrypted email columns only as contact, receipt, and recovery surfaces
- temporary key lifecycle statuses bounded to the OAR2 list
- alternate payment route values bounded to the OAR2 list
- payment status values bounded to the OAR2 list
- assessment credit standing bounded to `none`, `eligible`, `credited_to_conversion`, `expired`, or `voided`
- wallet and NFT migration columns present but inert until future governed route
- source OAR reference, metadata object, timestamps, and expiry standing

## 3 - Identifier Generation Route

Two database functions were seated:

```sql
public.c3_generate_temp_key()
public.c3_generate_temp_public_ref()
```

`public.c3_generate_temp_key()` emits `c3tmp_` plus 128 bits of random uppercase hex.

`public.c3_generate_temp_public_ref()` emits `C3-TEMP-` plus 24 bits of random uppercase hex for receipt and support visibility.

Unique constraints remain the authority for collision rejection. Any insert route must retry on unique violation rather than treating email or payment reference as key authority.

## 4 - Boundary Confirmation

| Boundary | Result |
|---|---|
| Email is not primary key | PASS |
| Email is not identity authority | PASS |
| Email is only contact / receipt / recovery surface | PASS |
| Payment route is bounded | PASS |
| Payment status is bounded | PASS |
| Payment trace required for submitted / confirmed / refunded / credited states | PASS |
| Assessment credit requires assessment reference | PASS |
| Credit-to-conversion requires credited payment status | PASS |
| Wallet-bound status requires wallet address and timestamp | PASS |
| NFT-migrated status requires wallet trace, contract, token id, and migration timestamp | PASS |
| Metadata must remain JSON object | PASS |
| No recognition standing created | PASS |
| No conversion standing created | PASS |
| No NFT minting occurred | PASS |
| No crypto deployment occurred | PASS |
| No runtime / CSS mutation occurred | PASS |

## 5 - DB Mutation Standing

Production DB mutation standing: **performed under OAR2 authorization**.

The SQL artifact includes an operator inspection gate:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'c3_key_temp';
```

Preflight confirmed `public.c3_key_temp` did not exist before execution.

Execution route: Supabase `exec_sql` RPC using `.env` and the server-side `SUPABASE_C3_SECRET` credential.

First execution attempt returned:

```text
c3_key_temp seating failed: function gen_random_bytes(integer) does not exist
```

Correction applied:

- changed generator functions from unqualified `gen_random_bytes(...)` to `extensions.gen_random_bytes(...)`
- made `ALTER TABLE public.c3_key_temp ENABLE ROW LEVEL SECURITY` explicit in repo SQL and migration artifacts

Second execution returned successful RPC envelope:

```json
{ "ok": true }
```

Live validation assertion returned:

```json
{
  "assertions": "PASS",
  "rpc": { "ok": true }
}
```

Live security posture:

- RLS enabled
- force RLS disabled
- policies count = 0
- row count = 0

## 6 - Validation

| Check | Result |
|---|---|
| Temp identifier schema seated | PASS |
| `temp_key` unique | PASS |
| `public_ref` unique | PASS |
| Email not primary identity authority | PASS |
| Payment routes bounded | PASS |
| Payment status values bounded | PASS |
| Assessment credit standing bounded | PASS |
| Wallet / NFT migration remains future route | PASS |
| No recognition standing created | PASS |
| No conversion standing created | PASS |
| No NFT minting occurred | PASS |
| No crypto deployment occurred | PASS |
| No runtime / CSS mutation occurred | PASS |
| Live table exists | PASS |
| Expected columns exist | PASS |
| Expected constraints exist | PASS |
| Expected indexes exist | PASS |
| `updated_at` trigger exists | PASS |
| Generator formats validated | PASS |
| RLS enabled with no policies | PASS |
| Row count remains zero | PASS |
| DB mutation standing clearly stated | PASS |

## 7 - Validation Commands

Executed:

```powershell
git diff --check --cached

$paths = @(
  'docs/oar/measures_interoperability/sql/seat_c3_key_temp_alternate_payment_route_contract_v1.sql',
  'supabase/migrations/202605310001_c3_key_temp_alternate_payment_route.sql',
  'docs/oar/measures_interoperability/oar1_temp_c3_key_alternate_payment_route_contract_v1.meta.md'
)

Select-String -Path $paths -Pattern '\s+$'

foreach ($path in $paths) {
  $text = Get-Content -Raw -Path $path
  if ($text.ToCharArray() | Where-Object { [int][char]$_ -gt 127 } | Select-Object -First 1) {
    Write-Error "Non-ASCII found in $path"
    exit 1
  }
}
```

Result: PASS.

## 8 - Live DB Validation Command

Executed through Supabase `exec_sql` RPC:

- table existence assertion
- expected 28-column assertion
- expected primary key, unique, and check-constraint assertion
- expected index assertion
- `c3_key_temp_set_updated_at` trigger assertion
- `public.c3_generate_temp_key()` format assertion
- `public.c3_generate_temp_public_ref()` format assertion
- zero-row assertion
- RLS posture assertion: `relrowsecurity = true`, `relforcerowsecurity = false`
- zero-policy assertion

Result: PASS.

## 9 - Next Route Recommendation

Next route:

`OAR2 - Temporary c3 Key Issuance Route v1`

That OAR2 should define the governed insert path for issuing temporary c3 Keys, including collision retry behavior, contact-email hashing/encryption responsibilities, payment trace source, and support-facing public reference handling.

Payment processor activation remains separate.

Wallet / NFT migration remains separate.

Recognition and conversion remain held.

## Close

Temporary key continuity defined.

Payment trace bounded.

Email does not govern.

Wallet migration waits.

NFT minting waits.

Codex holds.
