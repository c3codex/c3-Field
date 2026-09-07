---
document_type: oar1
authority_level: recorded
document_scope: measures_interoperability_staging
title: OAR1 - c3 Non-Wallet Payment Standing Contract v1
status: recorded
version: v1
operator: op044
system: c3_field_systems
source_oar2: docs/oar/measures_interoperability/oar2_c3_non_wallet_payment_standing_contract_v1.meta.md
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
  - non-wallet-payment
  - payment-standing
  - c3-map
  - measures-assessment-protocol
  - commerce-circuit
  - support-safe
  - audit-required
  - no-runtime
  - no-public-access
  - no-wallet-binding
  - no-nft-mint
  - no-recognition
  - no-conversion
  - staging
  - folder-reconciliation-pending
---

# OAR1 - c3 Non-Wallet Payment Standing Contract v1

## 1 - Execution Standing

OAR2 executed.

Non-wallet payment standing contract is seated as a support-safe, source / OAR-bound, audit-linked DB layer.

DB mutation standing: **performed under OAR2 authorization**.

Seated table:

`public.c3_payment_standing`

Seated protected RPC:

`public.seat_c3_payment_standing(...)`

The c3 Key system-function audit constraint was extended to include:

`seat_c3_payment_standing`

No payment processor integration occurred.

No payment was processed.

No temporary c3 Key was issued.

No permission was granted.

No runtime was opened.

## 2 - Files Created / Modified

Created:

- `docs/oar/measures_interoperability/sql/seat_c3_non_wallet_payment_standing_contract_v1.sql`
- `supabase/migrations/202606010007_c3_non_wallet_payment_standing_contract.sql`
- `docs/oar/measures_interoperability/oar1_c3_non_wallet_payment_standing_contract_v1.meta.md`

Existing OAR2 staged by operator:

- `docs/oar/measures_interoperability/oar2_c3_non_wallet_payment_standing_contract_v1.meta.md`

The SQL artifact and migration were verified as identical before closeout.

No frontend source files were modified.

No runtime route files were modified.

## 3 - Payment Routes Bounded

Allowed routes:

- `invoice`
- `manual`
- `bank_transfer`
- `card_processor`
- `grant_credit`
- `waived`
- `onchain_future`

`onchain_future` is recognized as a route label but remains held in the seated RPC.

This contract does not activate wallet or onchain payment standing.

## 4 - Payment Statuses Bounded

Allowed statuses:

- `pending`
- `invoiced`
- `paid`
- `waived`
- `held`
- `failed`
- `refunded`
- `cancelled`
- `not_required`

Eligibility statuses:

- `paid`
- `waived`
- `not_required`

Non-eligibility statuses:

- `pending`
- `invoiced`
- `held`
- `failed`
- `refunded`
- `cancelled`

Validation created eligible synthetic states and then cancelled them, so no eligible validation payment standing remains.

## 5 - Support-Safe Storage Boundary

Allowed storage:

- payment provider reference
- payment reference
- amount due cents
- amount paid cents
- currency
- payment status
- payment route
- payment confirmed timestamp
- source record type
- source record id
- source OAR id
- source OAR path
- operator ref
- institution key
- named individual ref
- support-safe metadata

Prohibited storage:

- card number
- CVV
- bank account number
- routing number
- processor API key
- service-role key
- raw receipt containing private data
- raw invoice containing private data
- private payment data
- wallet private key
- seed phrase
- contact email
- contact email hash
- contact email encrypted
- unbounded private payload

Validation confirmed prohibited metadata was stripped before storage.

Stored metadata from unsafe probe:

```json
{
  "support_safe": true,
  "operator_note": "metadata stripping probe",
  "validation_probe": true,
  "wallet_implication": false,
  "processor_execution": false,
  "source_oar_binding_id": null,
  "payment_standing_contract_version": "v1"
}
```

## 6 - Source / OAR Relation

Payment standing is source / OAR-bound by:

- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `source_oar_path`
- optional `source_oar_binding_id`

Allowed source record types:

- `SRC`
- `SRC1`
- `SRC2`

Held source record type:

- `future_SRC3`

Validation confirmed `future_SRC3` returned held standing and created no payment-standing row.

## 7 - Audit Requirement

Every RPC invocation that reaches `public.seat_c3_payment_standing(...)` creates an audit row in:

`public.c3_key_system_function_audit`

Audit shape:

- `function_name = seat_c3_payment_standing`
- `action_type = payment_standing`
- `result_status = prepared | executed | held | rejected`
- `operator_ref`
- `source_oar_id`
- `input_ref`
- `output_ref`
- `support_safe = true`
- `metadata.payment_standing_contract_version = v1`
- `metadata.processor_execution = false`
- `metadata.wallet_implication = false`

No audit, no payment status activation.

## 8 - Access Posture

Payment table posture:

- RLS enabled
- no public policies created
- table privileges revoked from `PUBLIC`
- table privileges revoked from `anon`
- table privileges revoked from `authenticated`
- table privileges granted only to `service_role`

RPC posture:

- `SECURITY DEFINER`
- fixed `search_path = public, extensions`
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`
- execute granted to `service_role`

Anon validation:

```json
{
  "seat_rpc": {
    "code": "42501",
    "message": "permission denied for function seat_c3_payment_standing"
  },
  "payment_table": {
    "code": "42501",
    "message": "permission denied for table c3_payment_standing"
  }
}
```

No public access was opened.

No authenticated broad access was opened.

## 9 - Relationship To Temp c3 Key Assignment

`assign_temp_c3_key` was not modified by this OAR.

`assign_temp_c3_key` does not process payment.

This contract seats payment standing as a separate layer that may later be checked or received by assignment logic only through a separately routed OAR.

Future eligibility shape:

```text
active source / OAR binding
+ payment standing when required
+ Named Individual
+ agreement / expiration
+ audit trace
= eligible for temp c3 Key assignment
```

This OAR did not execute a temporary c3 Key assignment.

## 10 - c3 MAP Commerce Circuit Distinction

c3 MAP remains Measures Assessment Protocol / commerce circuit standing.

c3 Model remains Connect / Contribute / Create.

C1 / C2 / C3 are governed commerce circuit standings for pricing, eligibility, assessment, and distribution where separately mapped.

This OAR does not collapse c3 MAP into c3 Model.

Payment standing may support c3 MAP eligibility in the future, but it does not activate permission and does not define c3 Model standing.

Permission activation remains separate through:

`public.c3_key_permission_map`

## 11 - Live Seating

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

## 12 - Validation Probes

Validation proved:

- `paid` manual payment standing can be seated
- `waived` payment standing can be seated
- seated eligible synthetic standings can be updated to `cancelled`
- `future_SRC3` is held
- `onchain_future` is held
- missing operator is rejected
- disallowed route is rejected
- prohibited metadata is stripped
- anon cannot execute RPC
- anon cannot read table

Paid synthetic standing was immediately cancelled:

```json
{
  "payment_standing_id": "234a321c-d8bc-48fb-ab1e-90c4a36a5ad7",
  "payment_status": "cancelled",
  "eligible_payment_standing": false
}
```

Waived synthetic standing was immediately cancelled:

```json
{
  "payment_standing_id": "3bb5edba-9713-4f0b-8063-a566a7723d3d",
  "payment_status": "cancelled",
  "eligible_payment_standing": false
}
```

Held unsafe-metadata probe:

```json
{
  "payment_standing_id": "f6f76598-7ccd-4c8f-9567-0a8084dc6a5b",
  "payment_status": "held",
  "eligible_payment_standing": false
}
```

Held probes:

```json
{
  "future_SRC3": "held",
  "onchain_future": "held"
}
```

Rejected probes:

```json
{
  "missing_operator": "rejected",
  "bad_route": "rejected"
}
```

## 13 - Live Counts After Validation

Readback counts:

```json
{
  "c3_key_temp": 1,
  "c3_key_temp_from_payment_oar": 0,
  "c3_key_temp_agreement_ack_from_payment_oar": 0,
  "c3_key_permission_map": 0,
  "c3_payment_standing": 3,
  "c3_payment_standing_from_payment_oar": 3,
  "eligible_payment_standing_from_payment_oar": 0,
  "c3_key_system_function_audit_from_payment_oar": 9
}
```

Interpretation:

- no temporary c3 Key was issued
- no agreement acknowledgment was created
- no permission map row exists
- three synthetic support-safe payment-standing rows remain
- zero eligible synthetic payment-standing rows remain
- nine audit rows record validation
- no processor execution occurred
- no wallet implication occurred

## 14 - Boundaries Held

No payment processor integration occurred.

No payment execution occurred.

No card data was stored.

No bank data was stored.

No temporary c3 Key was issued.

No agreement acknowledgment was created.

No permission was granted.

No permission was activated.

No permission map record was created.

No runtime was wired.

No frontend route was created.

No public API was opened.

No public lookup was opened.

No wallet was bound.

No wallet verification was performed.

No NFT was deployed or minted.

No Role NFT was minted.

No DAO voting was activated.

No distribution was activated.

No recognition standing was created.

No verification claim was created.

No conversion standing was created.

No folder reconciliation was performed.

No process rule was created.

## 15 - Validation Against OAR2

Confirmed:

1. non-wallet payment standing contract seated
2. exact files created / modified documented
3. DB mutation occurred and is documented
4. payment routes bounded
5. payment statuses bounded
6. support-safe storage boundary enforced
7. prohibited fields excluded
8. source / OAR relation documented
9. audit requirement enforced
10. relationship to temp c3 Key assignment documented
11. c3 MAP commerce circuit distinction documented without collapsing into c3 Model
12. no payment processor execution occurred
13. no temp c3 Key issued
14. no permission granted
15. no permission activated
16. no runtime / public API opened
17. no wallet / NFT / payment processor action occurred
18. no DAO / distribution activation
19. no recognition / conversion standing created
20. folder reconciliation not performed
21. process rule not created
22. next route recommendation documented

## 16 - Next Route Recommendation

Recommended next route:

`OAR2 - c3 Payment Standing Real Source Seating v1`

Purpose:

- seat a real source / OAR-bound payment-standing row
- keep support-safe payment metadata only
- avoid processor execution
- preserve payment standing as separate from assignment and permission

Then, if needed:

`OAR2 - c3 Key Assign Temporary System Function Payment Standing Read Hardening v1`

Purpose:

- define how `assign_temp_c3_key` may check seated payment standing
- preserve no payment processing inside assignment

## CLOSE

Payment standing is seated.

Non-wallet remains non-wallet.

c3 MAP remains commerce / assessment circuit standing.

c3 Model remains Connect / Contribute / Create.

Payment execution waits.

Temp c3 Key real assignment waits.

Permission grants wait.

Runtime waits.

Wallet waits.

NFT waits.

DAO activation waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
