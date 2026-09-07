---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key + Alternate Payment Route Contract v1
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
  - alternate-payment
  - non-crypto-payment
  - stripe
  - payment-trace
  - wallet-migration
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - Seed Concordance
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR1 — c3 Key Metadata Schema + Image Binding v1
  - OAR1 — c3 Key Contract Audit Readiness v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key + Alternate Payment Route Contract v1

## OBSERVED

Crypto deployment is temporarily held.

The c3 Key NFT contract remains valid but is blocked by testnet / mainnet funding friction.

Current need:

1. create temporary c3 Key standing without binding identity to email alone
2. create alternate non-crypto payment route
3. preserve future wallet / NFT migration
4. preserve payment credit toward conversion
5. prevent recognition / conversion / payment authority drift

The c3 Key is already defined as an access-bearing identity key that establishes participation standing and gated access, but does not determine coherence.

## ALIGNED

Temporary c3 Key must be:

- system-generated
- unique
- non-guessable
- not email-bound as identity
- migratable to wallet / NFT later
- traceable through OAR

Email may be used only as:

- contact surface
- receipt surface
- recovery surface

Email must not become the key authority.

Alternate payment must be:

- traceable
- provider-recorded
- creditable toward later conversion where applicable
- not recognition
- not conversion
- not NFT standing
- not wallet standing

## CORE RULE

Temporary key preserves continuity.

Payment route records transaction trace.

Wallet / NFT migration waits.

Recognition waits.

Conversion waits.

Codex holds.

## ROUTED

This OAR2 defines:

1. temporary c3 Key identifier schema
2. public / private key reference rule
3. email boundary
4. alternate payment route enum
5. payment trace requirements
6. assessment credit relation
7. wallet / NFT migration standing
8. validation requirements

## TEMPORARY c3 KEY IDENTIFIER

Recommended generated format:

- temp_key: `c3tmp_<ulid>`
- public_ref: `C3-TEMP-<short_ref>`

Example:

- temp_key: `c3tmp_01JX8N9K4Q7M2P6R3T5V8Y1Z0A`
- public_ref: `C3-TEMP-8Y1Z0A`

Rule:

- temp_key = internal access identifier
- public_ref = safe receipt / support reference

## TEMP KEY STATUS VALUES

Allowed temp key status values:

- issued
- acknowledged
- held
- payment_pending
- payment_confirmed
- wallet_pending
- wallet_bound
- migrated_to_nft
- revoked
- expired

## ALTERNATE PAYMENT ROUTES

Allowed initial payment routes:

- stripe_invoice
- stripe_payment_link
- bank_transfer
- ach
- manual_recorded_payment
- sponsored_access
- operator_grant

Recommended first implementation:

- stripe_payment_link
- stripe_invoice
- manual_recorded_payment

## PAYMENT STATUS VALUES

Allowed payment status values:

- not_required
- pending
- submitted
- confirmed
- failed
- refunded
- credited
- voided

## FIELD CONTRACT

Executor may create the following table or equivalent bounded schema.

    create table if not exists public.c3_key_temp (
      id uuid primary key default gen_random_uuid(),

      temp_key text not null unique,
      public_ref text not null unique,

      origin_type text not null check (
        origin_type in ('named_individual', 'institution_in_service')
      ),

      institution_key text,
      named_individual_ref text,

      contact_email_hash text,
      contact_email_encrypted text,

      status text not null default 'issued' check (
        status in (
          'issued',
          'acknowledged',
          'held',
          'payment_pending',
          'payment_confirmed',
          'wallet_pending',
          'wallet_bound',
          'migrated_to_nft',
          'revoked',
          'expired'
        )
      ),

      payment_route text check (
        payment_route in (
          'stripe_invoice',
          'stripe_payment_link',
          'bank_transfer',
          'ach',
          'manual_recorded_payment',
          'sponsored_access',
          'operator_grant'
        )
      ),

      payment_provider text,
      payment_reference text,

      payment_status text not null default 'not_required' check (
        payment_status in (
          'not_required',
          'pending',
          'submitted',
          'confirmed',
          'failed',
          'refunded',
          'credited',
          'voided'
        )
      ),

      amount_due_cents integer,
      amount_paid_cents integer,
      currency text default 'usd',

      assessment_key text,

      assessment_credit_status text check (
        assessment_credit_status in (
          'none',
          'eligible',
          'credited_to_conversion',
          'expired',
          'voided'
        )
      ),

      wallet_address text,
      wallet_bound_at timestamptz,

      nft_contract_address text,
      nft_token_id text,
      migrated_at timestamptz,

      source_oar_id text,
      metadata jsonb not null default '{}'::jsonb,

      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      expires_at timestamptz
    );

## EMAIL BOUNDARY

Email may be stored only as:

- hashed email for matching
- encrypted email for contact / receipt if needed

Email must not be used as:

- primary key
- identity authority
- conversion authority
- recognition authority
- wallet replacement

## PAYMENT BOUNDARY

Alternate payment confirms:

- payment received or payment pending
- assessment purchase standing
- credit eligibility where applicable

Alternate payment does not confer:

- recognition
- verification
- conversion
- NFT standing
- wallet standing
- seal activation
- delivery contract standing

## CREDIT RULE

If assessment payment is credited toward conversion:

- assessment_credit_status = eligible

When conversion contract is later executed:

- assessment_credit_status = credited_to_conversion

Credit may not exceed governed conversion rules.

## MIGRATION RULE

Temporary c3 Key may later migrate to wallet / NFT only when:

- wallet address is provided
- wallet binding is verified
- NFT contract route is active
- mint OAR2 is seated
- migration OAR1 is written

## NOT AUTHORIZED

This OAR2 does not authorize:

- NFT deployment
- NFT minting
- mainnet action
- payment processor activation without provider setup
- recognition
- conversion
- production DB mutation without approved execution
- runtime / CSS change unless separately routed

## CODY / EXECUTOR ROLE

Executor may:

- define temp key schema
- define identifier generation route
- define alternate payment route values
- define payment trace columns
- define wallet / NFT migration standing
- prepare SQL migration if repo migration pattern is present
- run local / Supabase-safe validation if authorized by environment
- write OAR1 closeout

Executor may not:

- mint NFT
- deploy crypto contract
- activate payment processor without provider setup
- create recognition
- create conversion
- treat email as authority
- bypass wallet / NFT migration requirement
- mutate production DB without approved execution route
- modify runtime / CSS unless separately routed

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. temp identifier schema created or prepared
2. temp_key and public_ref are unique
3. email is not primary identity authority
4. payment routes are bounded
5. payment status values are bounded
6. assessment credit standing is bounded
7. wallet / NFT migration remains future route
8. no recognition standing is created
9. no conversion standing is created
10. no NFT minting occurred
11. no crypto deployment occurred
12. no runtime / CSS mutation occurred unless separately routed
13. DB mutation standing is clearly stated
14. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_alternate_payment_route_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when temporary c3 Key continuity and alternate payment trace are defined as one governed bridge, preserving future wallet / NFT migration without letting email, payment, or manual access become authority.

## CLOSE

Crypto waits.

Temporary access continues.

Payment trace records.

Wallet migration waits.

Codex holds.
