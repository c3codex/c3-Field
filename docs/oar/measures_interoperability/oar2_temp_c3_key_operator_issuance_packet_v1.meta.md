---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key Operator Issuance Packet v1
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
  - operator-issuance-packet
  - use-agreement
  - agreement-acknowledgment
  - wallet-required-future
  - alternate-payment
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — Temporary c3 Key Issuance Route v1
  - OAR1 — Temporary c3 Key + Alternate Payment Route Contract v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key Operator Issuance Packet v1

## OBSERVED

Temporary c3 Key infrastructure is now seated:

- `public.c3_key_temp`
- `public.c3_key_temp_continuity_event`
- `public.issue_temp_c3_key(...)`

The issuance route is bounded to server-side/admin execution.

It requires `named_individual_ref` always.

It blocks institution-only temp keys.

It enforces expiration policy.

It strips raw email.

It records continuity events.

It leaves no test rows in production.

Current gap:

The system has issuance capability.

The operator does not yet have a standardized issuance packet.

The system also needs a required use agreement acknowledgment before real temporary c3 Key issuance.

## ALIGNED

This OAR2 defines the operator-facing packet required before a real temporary c3 Key may be issued.

The packet must preserve:

- Named Individual accountability
- Institution in Service participation where applicable
- source approval evidence
- Temp c3 Key Use Agreement acknowledgment
- payment standing
- assessment credit standing
- expiration standing
- continuity trace
- support-safe output

## CORE RULE

No packet, no issuance.

No agreement acknowledgment, no real temp key.

No Named Individual, no temp key.

No raw email storage.

No payment authority drift.

No recognition or conversion created.

Temporary c3 Key does not replace wallet-held c3 Key.

Codex holds.

## ROUTED

Executor may create:

1. operator issuance packet template
2. Temp c3 Key Use Agreement acknowledgment contract/table or prepared SQL
3. service-role execution script or SQL wrapper
4. validation checklist
5. support-safe return packet
6. renewal packet outline
7. OAR1 closeout

Executor may not:

- issue a real temp key unless operator supplies real packet values
- bypass agreement acknowledgment unless operator-approved exception OAR is attached
- activate Stripe
- create payment link
- mint NFT
- bind wallet
- create recognition
- create conversion
- open public RLS policies
- create frontend direct insert

## TEMP c3 KEY USE AGREEMENT

Agreement standing:

Temporary c3 Key is provisional access continuity.

Wallet-held c3 Key is required permanent access identity where permanent access, DAO participation, wallet-based payment, conversion, or future governed access requires it.

The agreement must state:

1. Temp c3 Key is temporary and expires.
2. Temp c3 Key does not replace wallet-held c3 Key.
3. Temp c3 Key does not confer recognition, verification, conversion, NFT standing, wallet standing, or payment standing.
4. Actions taken under temp c3 Key remain traceable.
5. Future wallet-held c3 Key may inherit temp c3 Key trace by governed continuity relation.
6. Named Individual / Institution agrees wallet procurement may be required for permanent access.
7. Future payments, renewals, conversion actions, DAO participation, or governed access may require wallet-based c3 Key.
8. Refusal or failure to procure wallet-held c3 Key may limit access, renewal, voting, conversion, payment routing, or future participation.
9. Email is contact / recovery only, not identity authority.
10. Operator may hold, expire, revoke, or migrate temp c3 Key under governed OAR route.

## AGREEMENT ACKNOWLEDGMENT RULE

No real temporary c3 Key may be issued unless:

- Temp c3 Key Use Agreement is acknowledged
- or operator-approved exception OAR is attached

Acknowledgment must be bound to:

- Named Individual
- temp key issuance event or temp_key_id when available
- institution_key when applicable
- source_oar_id

Institutional temp keys require agreement acknowledgment by the Named Individual associated with the Institution in Service.

The agreement must disclose that permanent wallet-held c3 Key procurement may be required and future payments may require wallet-based execution.

## REQUIRED AGREEMENT ACKNOWLEDGMENT FIELDS

Agreement acknowledgment must include or prepare:

- agreement_version
- agreement_title
- agreement_hash
- acknowledged_at
- acknowledged_by_named_individual_ref
- institution_key if applicable
- temp_key_id when available
- public_ref when available
- source_oar_id
- acknowledgment_method
- metadata

Allowed acknowledgment methods:

- operator_recorded
- form_checkbox
- signature
- email_confirmation

## RECOMMENDED AGREEMENT ACK TABLE

Executor may create or prepare:

    create table if not exists public.c3_key_temp_agreement_ack (
      id uuid primary key default gen_random_uuid(),

      temp_key_id uuid references public.c3_key_temp(id) on delete cascade,

      agreement_version text not null,
      agreement_title text not null,
      agreement_hash text not null,

      acknowledged_by_named_individual_ref text not null,
      institution_key text,

      acknowledgment_method text not null check (
        acknowledgment_method in (
          'operator_recorded',
          'form_checkbox',
          'signature',
          'email_confirmation'
        )
      ),

      source_oar_id text not null,
      metadata jsonb not null default '{}'::jsonb,

      acknowledged_at timestamptz not null default now(),
      created_at timestamptz not null default now()
    );

If this table is seated, RLS must be enabled and no public policies may be opened.

If agreement acknowledgment is recorded before temp_key_id exists, executor must define the staged binding route in OAR1.

Preferred for first implementation:

- create table
- allow `temp_key_id` nullable for pre-issuance acknowledgment
- bind `temp_key_id` after issuance by service-role route
- no public insert policy

## OPERATOR ISSUANCE PACKET

Required packet fields:

    packet_type: temp_c3_key_issuance
    source_oar_id: ""
    origin_type: named_individual | institution_in_service
    named_individual_ref: ""
    institution_key: ""
    contact_email: ""
    agreement_version: ""
    agreement_title: ""
    agreement_hash: ""
    agreement_acknowledgment_method: operator_recorded | form_checkbox | signature | email_confirmation
    agreement_acknowledged_at: ""
    payment_route: not_required | stripe_invoice | stripe_payment_link | bank_transfer | ach | manual_recorded_payment | sponsored_access | operator_grant
    payment_provider: ""
    payment_reference: ""
    payment_status: not_required | pending | submitted | confirmed | failed | refunded | credited | voided
    amount_due_cents:
    amount_paid_cents:
    currency: usd
    assessment_key: ""
    assessment_credit_status: none | eligible | credited_to_conversion | expired | voided
    expires_at: ""
    metadata: {}

## REQUIRED FIELD RULES

Always required:

- source_oar_id
- origin_type
- named_individual_ref
- agreement_version
- agreement_title
- agreement_hash
- agreement_acknowledgment_method

Required when institutional:

- institution_key

Required when `payment_status` is `submitted`, `confirmed`, `refunded`, or `credited`:

- payment_route
- payment_provider
- payment_reference

Required when `payment_status = pending`:

- payment_route

Required when `assessment_credit_status = eligible`:

- assessment_key
- payment_status = confirmed OR credited

Required when `assessment_credit_status = credited_to_conversion`:

- assessment_key
- payment_status = credited
- future conversion route

## CONTACT EMAIL RULE

`contact_email` may be included for receipt / recovery only.

Execution must confirm:

- raw email is not stored
- hash is stored
- encrypted email remains null unless encryption is seated
- metadata email keys are stripped

## EXPIRATION RULE

If `expires_at` is blank, the RPC default policy applies:

- issued / payment_pending: 14 days
- payment_confirmed: 90 days
- fallback: 14 days

Renewal requires separate OAR trace.

## EXECUTION SURFACE

Preferred execution surface:

`docs/oar/measures_interoperability/sql/issue_temp_c3_key_operator_packet_v1.sql`

This should call:

`public.issue_temp_c3_key(...)`

The execution script must:

- use placeholders only
- avoid hardcoded real personal data
- avoid raw production packet values committed to repo
- include operator instructions for local substitution
- return support-safe payload only
- record agreement acknowledgment where applicable
- prevent issuance if agreement acknowledgment is absent

## SUPPORT-SAFE RETURN PACKET

After real issuance, operator may receive:

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

Do not return by default:

- temp_key
- contact_email_hash
- contact_email_encrypted
- source_oar_id internals
- metadata internals
- raw agreement metadata

## REAL ISSUANCE BOUNDARY

This OAR2 may prepare the packet and execution surface.

It does not authorize issuing a real temp c3 Key unless the operator explicitly provides a completed real issuance packet and confirms execution.

Template creation is authorized.

Real issuance is held.

## RENEWAL PACKET OUTLINE

Renewal packet must later include:

    packet_type: temp_c3_key_renewal
    temp_key_id: ""
    public_ref: ""
    source_oar_id: ""
    agreement_version: ""
    agreement_hash: ""
    renewal_reason: ""
    new_expires_at: ""
    metadata: {}

Renewal is not authorized by this OAR2.

## NOT AUTHORIZED

This OAR2 does not authorize:

- real temp key issuance without completed packet
- issuance without agreement acknowledgment
- Stripe activation
- payment link creation
- NFT deployment
- NFT minting
- wallet binding
- wallet verification
- recognition
- verification claim
- conversion
- runtime / CSS mutation
- public RLS policy opening
- frontend direct insert
- raw email storage

## CODY / EXECUTOR ROLE

Executor may:

- create operator issuance packet template
- create agreement acknowledgment table or SQL artifact
- create placeholder service-role execution script
- define staged agreement-to-temp-key binding route
- document wallet-held c3 Key requirement
- document future wallet-based payment requirement
- run validation
- confirm zero public access
- write OAR1

Executor may not:

- issue a real temp key row unless operator separately confirms real packet execution
- leave test rows in production
- open anonymous policies
- store raw email
- activate payment processor
- mint NFT
- bind wallet
- claim conversion

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. operator packet template created
2. agreement acknowledgment requirement documented
3. agreement acknowledgment table created or prepared
4. exact files created / modified
5. no real temp key row inserted unless separately confirmed
6. if test validation occurs, rows return to 0
7. no raw production personal data committed
8. required field rules documented
9. payment field rules documented
10. assessment credit rules documented
11. expiration policy documented
12. wallet-held c3 Key requirement documented
13. future wallet-based payment requirement documented
14. support-safe return packet documented
15. renewal packet outline documented
16. no public RLS policy opened
17. no frontend direct insert created
18. no Stripe activation occurred
19. no NFT minting occurred
20. no crypto deployment occurred
21. no recognition / conversion standing created
22. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_operator_issuance_packet_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the operator has a governed issuance packet, required Temp c3 Key Use Agreement acknowledgment, and safe execution surface for real temporary c3 Key issuance, without committing personal data, opening public access, issuing unapproved rows, activating payment processors, minting NFTs, or creating recognition / conversion standing.

## CLOSE

Issuance route exists.

Use agreement required.

Operator packet forms.

Real issuance waits for completed packet.

Payment processor waits.

Wallet waits.

NFT waits.

Codex holds.
