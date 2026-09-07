---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key Real Issuance Execution v1
status: proposed
version: v1
operator: op044
system: measures_interoperability
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
  - measures-interoperability
  - temp-c3-key
  - real-issuance
  - first-controlled-institutional-issuance
  - c3-community-partners-dao-llc
  - stephanie-joanne
  - agreement-acknowledgment
  - continuity-proof
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — Temporary c3 Key Operator Issuance Packet v1
  - OAR1 — Temporary c3 Key Issuance Route v1
  - OAR1 — Temporary c3 Key + Alternate Payment Route Contract v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key Real Issuance Execution v1

## OBSERVED

Temporary c3 Key infrastructure is seated.

Current standing:

- `public.c3_key_temp` seated
- `public.c3_key_temp_continuity_event` seated
- `public.c3_key_temp_agreement_ack` seated
- `public.issue_temp_c3_key(...)` seated
- operator issuance packet template seated
- service-role execution wrapper seated

The issuance route is server-side / admin only.

Runtime is not required for this issuance.

The public frontend must not issue temp c3 Keys directly.

Current execution path:

1. operator packet
2. service-role SQL wrapper
3. agreement acknowledgment
4. `public.issue_temp_c3_key(...)`
5. acknowledgment bound to returned `temp_key_id`
6. support-safe packet returned
7. OAR1 proof recorded

## ALIGNED

This OAR2 authorizes one real temporary c3 Key issuance.

This is not a test row.

Classification:

`first_controlled_institutional_temp_c3_key_issuance`

Purpose:

Create the first real temporary c3 Key for c3 Community Partners DAO, LLC, bound to Named Individual Stephanie Joanne, preserving later wallet / NFT migration proof.

This issuance proves the backend continuity route before runtime is exposed.

## CORE RULE

Named Individual answers.

Institution participates.

Temp c3 Key issues under agreement.

Temp trace remains resolvable by future wallet-held c3 Key.

Runtime waits.

No recognition.

No conversion.

No NFT mint.

Codex holds.

## COMPLETED OPERATOR PACKET

    packet_type: temp_c3_key_issuance
    source_oar_id: oar2_temp_c3_key_real_issuance_execution_v1

    origin_type: institution_in_service
    named_individual_ref: Stephanie Joanne
    institution_key: c3_community_partners_dao_llc

    contact_email: connect@measuresregistry.com

    agreement_version: v1
    agreement_title: Temp c3 Key Use Agreement
    agreement_hash: GENERATED_FROM_SEATED_AGREEMENT_TEXT
    agreement_acknowledgment_method: operator_recorded

    payment_route: operator_grant
    payment_provider: c3_internal
    payment_reference: first-controlled-temp-c3-key-issuance
    payment_status: confirmed

    amount_due_cents: 0
    amount_paid_cents: 0
    currency: usd

    assessment_key: ""
    assessment_credit_status: none
    expires_at: ""

    metadata:
      issuance_type: first_controlled_institutional_temp_c3_key_issuance
      later_wallet_migration_proof: true
      runtime_access: false
      recognition: false
      conversion: false

## CONTACT EMAIL BOUNDARY

`connect@measuresregistry.com` is provided for contact / receipt / recovery only.

Execution must confirm:

- raw email is not stored
- normalized email is hashed
- encrypted email remains null unless encryption is seated
- email does not become identity authority
- email does not become payment authority
- email does not become recognition or conversion authority

## AGREEMENT HASH RULE

Executor must generate or record `agreement_hash` from the seated Temp c3 Key Use Agreement text.

Executor may not invent an arbitrary agreement hash.

If the seated agreement text cannot be resolved, executor must hold issuance and return correction requirement.

## EXECUTION AUTHORIZATION

Executor may:

1. generate agreement_hash from the seated Temp c3 Key Use Agreement text
2. record agreement acknowledgment
3. issue one real temporary c3 Key
4. bind acknowledgment to returned `temp_key_id`
5. record continuity event
6. return support-safe packet only
7. write OAR1 closeout

Executor may not:

- mint NFT
- deploy crypto contract
- bind wallet
- activate Stripe
- create payment link
- create recognition
- create conversion
- open public RLS policy
- create frontend direct insert
- store raw email
- mutate runtime / CSS

## SUPPORT-SAFE RETURN REQUIRED

OAR1 must return only:

    temp_key_id: ""
    public_ref: ""
    status: ""
    payment_status: ""
    assessment_credit_status: ""
    origin_type: ""
    institution_key: ""
    agreement_acknowledged: true
    agreement_version: ""
    created_at: ""
    expires_at: ""

OAR1 must not expose:

- `temp_key`
- `contact_email_hash`
- `contact_email_encrypted`
- service-role secrets
- raw internal metadata
- raw agreement metadata

## RUNTIME BOUNDARY

This issuance occurs without runtime.

Runtime is not required because issuance is performed through the governed admin / service-role route.

Runtime may later be built to collect packet information and call a server endpoint.

Runtime must never receive service-role authority.

This OAR2 does not authorize runtime wiring.

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. one real temp c3 Key row issued
2. row is not classified as test row
3. issuance classified as first controlled institutional temporary c3 Key issuance
4. Named Individual = Stephanie Joanne
5. Institution in Service = c3 Community Partners DAO, LLC
6. contact email accepted only as contact / recovery surface
7. raw email not stored
8. agreement acknowledgment recorded
9. agreement hash generated or recorded from seated agreement text
10. acknowledgment bound to temp_key_id
11. continuity event created
12. expiration applied
13. support-safe return packet captured
14. no temp_key exposed
15. no service-role secrets exposed
16. no NFT minting occurred
17. no crypto deployment occurred
18. no wallet binding occurred
19. no Stripe / payment link activation occurred
20. no recognition / conversion standing created
21. no runtime / CSS mutation occurred
22. RLS remains enabled
23. no public policies opened
24. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_real_issuance_execution_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when one real temporary c3 Key is issued for c3 Community Partners DAO, LLC, bound to Named Individual Stephanie Joanne, using `connect@measuresregistry.com` as contact / recovery only, with agreement acknowledgment and continuity trace seated, while runtime, wallet / NFT migration, recognition, conversion, payment processor activation, and CSS remain held.

## CLOSE

First controlled institutional temp c3 Key issues.

Trace begins.

Runtime waits.

Wallet migration waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
