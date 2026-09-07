---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Non-Wallet Payment Standing Contract v1
status: proposed
version: v1
operator: op044
system: c3_field_systems
staging_location: measures_interoperability
final_location_pending: true
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
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
source_alignment:
  - OAR1 — c3 Key Assign Temporary System Function Operator Use Packet v1
  - OAR1 — c3 Key Source OAR Binding Operator Seating Packet v1
  - OAR1 — c3 Key Assign Temporary System Function Source Binding Hardening v1
  - OAR1 — c3 Key Assign Temporary System Function Implementation v1
  - OAR1 — c3 Key Permission Map Storage Contract v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Non-Wallet Payment Standing Contract v1

## OBSERVED

The temp c3 Key system path is seated and paused before real assignment.

Current standing:

- `assign_temp_c3_key` is seated, protected, audit-first, and support-safe
- source / OAR binding is seated and required
- operator-use packet is documented
- real temporary c3 Key assignment is held
- wallet-held migration is held until c3 Key NFT contract deployment
- permissions are held
- runtime is held

The previous OAR1 confirms real temp assignment has not executed, no active source / OAR binding exists, no temp key was issued, and no permission map row exists.

A separate payment standing layer is needed because Measures Registry may need to support non-wallet payment paths before wallet-held c3 Key migration.

## ALIGNED

Non-wallet payment must not be treated as wallet payment.

Payment standing must remain separate from:

- c3 Key assignment
- permission grants
- wallet binding
- NFT minting
- DAO voting
- conversion / recognition

Clean relation:

- payment standing = records payment state
- temp c3 Key = continuity credential
- permission map = access standing
- wallet-held c3 Key = future migration standing

## CORE RULE

No payment standing, no payment-based eligibility.

No private payment data in Codex-facing support surfaces.

No payment execution inside `assign_temp_c3_key`.

No wallet implication from non-wallet payment.

Codex holds.

## ROUTED

Executor may document or seat:

1. non-wallet payment standing contract
2. payment route values
3. payment status values
4. support-safe storage boundary
5. source / OAR binding relation
6. relationship to temp c3 Key assignment
7. relationship to c3 MAP commerce circuits without collapsing into c3 Model
8. no processor execution boundary
9. OAR1 closeout

Executor may not:

- process payment
- connect Stripe / PayPal / bank processor
- store card or bank data
- issue temp c3 Key
- grant permission
- activate c3 MAP access
- bind wallet
- mint NFT
- activate DAO voting
- activate distribution
- create recognition
- create conversion
- wire runtime
- open public API
- move folders
- create process rule

## PAYMENT STANDING MODEL

Preferred table:

`public.c3_payment_standing`

Purpose:

Record support-safe non-wallet payment standing for Measures Registry and c3 MAP commerce routes.

Payment standing should resolve from:

    source_record_type: SRC | SRC1 | SRC2
    source_record_id: ""
    source_oar_id: ""
    operator_ref: ""
    payment_route: ""
    payment_status: ""
    payment_provider: ""
    payment_reference: ""
    amount_due_cents: 0
    amount_paid_cents: 0
    currency: usd
    payer_type: named_individual | institution_in_service
    institution_key: ""
    named_individual_ref: ""
    payment_confirmed_at: ""
    support_safe: true
    metadata: {}

`future_SRC3` remains held unless DAO / web3 route is separately seated.

## PAYMENT ROUTES

Bounded payment routes:

- invoice
- manual
- bank_transfer
- card_processor
- grant_credit
- waived
- onchain_future

Route meanings:

- invoice = invoice issued outside wallet flow
- manual = operator-confirmed manual payment path
- bank_transfer = non-card bank transfer reference only
- card_processor = processor reference only, no card data stored
- grant_credit = credit / sponsored standing
- waived = payment intentionally waived
- onchain_future = future wallet / onchain route, not active here

## PAYMENT STATUSES

Bounded payment statuses:

- pending
- invoiced
- paid
- waived
- held
- failed
- refunded
- cancelled
- not_required

Eligibility statuses:

- paid
- waived
- not_required

Non-eligibility statuses:

- pending
- invoiced
- held
- failed
- refunded
- cancelled

## SUPPORT-SAFE STORAGE BOUNDARY

Allowed storage:

- payment_provider
- payment_reference
- amount_due_cents
- amount_paid_cents
- currency
- payment_status
- payment_route
- payment_confirmed_at
- source_record_type
- source_record_id
- source_oar_id
- operator_ref
- institution_key
- named_individual_ref
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
- contact_email_hash
- contact_email_encrypted
- unbounded private payload

## RELATION TO TEMP c3 KEY ASSIGNMENT

`assign_temp_c3_key` must not process payment.

It may later read or receive bounded payment standing only.

Eligible payment standing for assignment:

- `payment_status = paid`
- `payment_status = waived`
- `payment_status = not_required`

But this OAR does not update `assign_temp_c3_key`.

Future relationship should be:

    active source / OAR binding
    + payment standing when required
    + Named Individual
    + agreement / expiration
    + audit trace
    = eligible for temp c3 Key assignment

## RELATION TO c3 MAP COMMERCE CIRCUITS

For Measures Registry, c3 MAP refers to the Measures Assessment Protocol and its governed commerce circuit layer.

C1, C2, and C3 are governed pricing, eligibility, assessment, and distribution circuits.

They must not be collapsed into the c3 Model.

    c3 Model = Connect / Contribute / Create
    c3 MAP = Measures Assessment Protocol / commerce circuit layer
    C1 / C2 / C3 = governed commerce circuit standing

c3 MAP commerce circuits may correspond to c3 Field progression where separately mapped, but they do not replace or define Connect, Contribute, or Create.

Payment standing may support c3 MAP eligibility, but it does not activate permission by itself and does not define c3 Model standing.

Permission activation remains separate through:

`public.c3_key_permission_map`

## ACCESS POSTURE

If storage is seated:

- RLS enabled
- zero public policies
- no anon access
- no authenticated broad access
- service_role / admin only unless separately routed
- no frontend direct read / write

## AUDIT REQUIREMENT

Every payment status change should be audit-linked.

Minimum audit relation:

    function_name: seat_c3_payment_standing
    action_type: payment_standing
    result_status: executed | held | failed | rejected | cancelled
    operator_ref: ""
    source_oar_id: ""
    input_ref:
      source_record_type: ""
      source_record_id: ""
      payment_route: ""
      requested_payment_status: ""
    output_ref:
      payment_standing_id: ""
      payment_status: ""
      payment_confirmed_at: ""
    support_safe: true
    metadata:
      payment_standing_contract_version: v1

No audit, no payment status activation.

## NOT AUTHORIZED

This OAR2 does not authorize:

- payment processor integration
- payment execution
- card / bank data storage
- temp c3 Key issuance
- permission grant
- permission activation
- runtime wiring
- frontend route
- public lookup
- public API
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- Role NFT minting
- DAO voting activation
- distribution activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. non-wallet payment standing contract documented or seated
2. exact files created / modified
3. whether DB mutation occurred
4. payment routes bounded
5. payment statuses bounded
6. support-safe storage boundary documented / enforced
7. prohibited fields excluded
8. source / OAR relation documented
9. audit requirement documented / enforced
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
22. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_non_wallet_payment_standing_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when non-wallet payment standing is defined or seated as a support-safe, source / OAR-bound, audit-linked layer that can support future c3 MAP commerce eligibility without processing payments, issuing keys, granting permissions, opening runtime, implying wallet-held standing, or collapsing c3 MAP commerce circuits into the c3 Model.

## CLOSE

Payment standing forms.

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

Codex holds.
