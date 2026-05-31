---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key Issuance Route v1
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
  - issuance-route
  - named-individual-required
  - institution-in-service
  - alternate-payment
  - payment-trace
  - expiration-policy
  - continuity-event
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — Temporary c3 Key + Alternate Payment Route Contract v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key Issuance Route v1

## OBSERVED

`public.c3_key_temp` is live seated with:

- RLS enabled
- zero policies
- zero rows
- temp_key generation seated
- public_ref generation seated
- alternate payment route / status boundaries seated
- wallet / NFT migration fields inert

The prior OAR1 confirms live DB seating, RLS enabled, zero policies, zero rows, bounded route / status values, and no recognition / conversion / NFT / runtime / CSS standing created.

Two corrections are required before issuance routing:

1. Temporary c3 Key must always bind to a Named Individual.
2. Temporary c3 Key must include validity and continuity policy.

Institution in Service may also be attached, but may not replace the Named Individual.

Native basis:

Named Individual answers.

Institution in Service participates.

Temporary c3 Key is provisional.

Permanent c3 Key may later inherit trace from temporary standing by governed continuity relation.

## ALIGNED

Temporary c3 Key issuance must:

- create exactly one temp c3 Key record per authorized issuance event
- require `named_individual_ref` always
- require `institution_key` when institutional
- generate `temp_key` internally
- generate `public_ref` separately
- use email only as contact / recovery surface
- optionally bind payment trace
- optionally bind assessment_key
- set expiration standing at issuance
- preserve continuity events for later permanent c3 Key resolution
- preserve wallet / NFT migration as future route
- return support-safe public_ref
- not expose temp_key publicly unless explicitly required

## CORE RULE

Named Individual answers.

Institution in Service participates.

Temporary c3 Key carries both when applicable.

Temporary c3 Key expires.

Temporary c3 Key actions remain traceable.

Permanent c3 Key may inherit temp trace through governed continuity relation.

Email does not govern.

Payment does not govern.

Wallet / NFT migration waits.

Codex holds.

## REQUIRED ORIGIN RULE

Every temporary c3 Key requires `named_individual_ref`.

Issuance cases:

1. Individual temp c3 Key

- `origin_type = named_individual`
- `named_individual_ref` required
- `institution_key` optional / null

2. Institutional temp c3 Key

- `origin_type = institution_in_service`
- `named_individual_ref` required
- `institution_key` required

Institution-only temp keys are not permitted.

## REQUIRED ISSUANCE INPUTS

Minimum required inputs:

- `origin_type`
- `named_individual_ref`
- `source_oar_id`

Conditional required input:

- `institution_key` required when `origin_type = institution_in_service`

Optional inputs:

- `contact_email`
- `payment_route`
- `payment_provider`
- `payment_reference`
- `payment_status`
- `amount_due_cents`
- `amount_paid_cents`
- `currency`
- `assessment_key`
- `assessment_credit_status`
- `expires_at`
- `metadata`

## REQUIRED DB / FUNCTION RULE

Issuance route must enforce:

    named_individual_ref is not null
    and (
      origin_type = 'named_individual'
      or (
        origin_type = 'institution_in_service'
        and institution_key is not null
      )
    )

If this rule is not currently enforced at table level, executor may implement it in the issuance RPC / server route first and carry a table-constraint hardening route forward.

Preferred function:

`public.issue_temp_c3_key(...)`

or equivalent server-side / admin RPC.

Function must:

- validate `named_individual_ref` always exists
- validate `institution_key` when `origin_type = institution_in_service`
- validate payment trace requirements
- validate assessment credit requirements
- set expiration standing
- insert `c3_key_temp` row
- create continuity event where required
- handle identifier collisions
- return support-safe payload

## TEMP c3 KEY VALIDITY POLICY

Temporary c3 Key is provisional and must not create endless shadow access.

Default validity:

- `issued` / `payment_pending`: expires in 14 days
- `acknowledged` / `payment_confirmed`: expires in 90 days
- `held`: access constrained until OAR route resolves
- `wallet_pending`: expires in 90 days unless renewed by OAR
- `wallet_bound`: temporary route remains transitional only
- `migrated_to_nft`: temp key closed
- `expired` / `revoked`: inactive

If `expires_at` is not supplied, issuance route must calculate it from status/payment standing.

Renewal rule:

- any renewal requires OAR trace
- renewal must be recorded as continuity event
- renewal must not create recognition, conversion, NFT standing, or wallet standing

Access rule:

A temporary c3 Key is active for access only when:

- status is one of:
  - `issued`
  - `acknowledged`
  - `payment_pending`
  - `payment_confirmed`
  - `wallet_pending`
- and `expires_at > now()`

Held, expired, revoked, and migrated statuses are not active access states unless a separate governed route authorizes a specific limited action.

## CONTINUITY EVENT POLICY

Actions taken under temporary c3 Key standing must remain traceable.

Permanent c3 Key does not erase temporary standing.

Permanent c3 Key may inherit trace by governed continuity relation after wallet / NFT migration.

Executor may create or prepare the following continuity table:

    create table if not exists public.c3_key_temp_continuity_event (
      id uuid primary key default gen_random_uuid(),

      temp_key_id uuid not null references public.c3_key_temp(id) on delete cascade,

      event_type text not null check (
        event_type in (
          'issued',
          'acknowledged',
          'payment_submitted',
          'payment_confirmed',
          'access_used',
          'renewed',
          'held',
          'expired',
          'revoked',
          'wallet_bound',
          'migrated_to_nft'
        )
      ),

      action_ref text,
      source_oar_id text not null,
      metadata jsonb not null default '{}'::jsonb,

      created_at timestamptz not null default now()
    );

Continuity events must not store raw email or private payment data.

Continuity events may reference:

- OAR trace
- payment reference
- access action reference
- wallet binding event
- future NFT migration event

## PERMANENT c3 KEY RESOLUTION RULE

When a temporary c3 Key later migrates to wallet / NFT:

- temp key record remains as trace
- continuity events remain linked to `temp_key_id`
- permanent wallet-bound c3 Key receives relation to the temporary c3 Key
- temporary status becomes `migrated_to_nft`
- `migrated_at`, `wallet_address`, `nft_contract_address`, and `nft_token_id` are set only through future governed route

The temp key does not become the NFT.

The temp key becomes part of the permanent c3 Key trace.

## EMAIL HANDLING RULE

Email may be accepted only to produce:

- `contact_email_hash`
- `contact_email_encrypted`

Email must not be stored raw.

If encryption is not seated:

- store hash only
- leave encrypted email null

## IDENTIFIER GENERATION RULE

The route must not derive `temp_key` or `public_ref` from:

- email
- institution name
- Named Individual name
- payment reference
- wallet address
- timestamp alone

Collision handling:

- on unique violation for `temp_key` or `public_ref`
- retry insert up to 3 times
- if still failing, return held `collision_error`
- write OAR1 note

## PAYMENT TRACE RULE

If `payment_status` is one of:

- submitted
- confirmed
- refunded
- credited

then payment trace must include:

- `payment_route`
- `payment_provider`
- `payment_reference`

If `payment_status = pending`, then `payment_route` is required, but `payment_reference` may be pending.

If `payment_route` is one of:

- operator_grant
- sponsored_access
- manual_recorded_payment

then `source_oar_id` must carry the approval trace.

## ASSESSMENT CREDIT RULE

If:

`assessment_credit_status = eligible`

then:

- `assessment_key` required
- `payment_status` must be confirmed or credited

If:

`assessment_credit_status = credited_to_conversion`

then:

- `payment_status` must be credited
- conversion route must exist in future OAR

This OAR2 does not authorize conversion.

## RETURN PAYLOAD BOUNDARY

Issuance route may return:

- `id`
- `public_ref`
- `status`
- `payment_status`
- `assessment_credit_status`
- `origin_type`
- `institution_key` if applicable
- `created_at`
- `expires_at`

Issuance route should not expose publicly by default:

- `temp_key`
- `contact_email_hash`
- `contact_email_encrypted`
- metadata internals
- `source_oar_id` internals

## RLS / ACCESS POSTURE

Current posture remains:

- RLS enabled
- zero policies

Allowed access route:

- server-side service-role function
- admin-only RPC
- operator-controlled script using service role

Not allowed:

- anonymous insert
- public insert
- frontend direct insert
- client-side service role

If continuity event table is seated, it must also have RLS enabled and no public insert policy.

## TEST INSERT RULE

Executor may perform rollback-safe validation or temporary test insert only if:

- test row is deleted before closeout
- row count returns to 0
- continuity test rows are deleted before closeout
- continuity event row count returns to 0
- OAR1 records the test public_ref if created

Preferred:

- validate function existence and constraints without leaving rows

## NOT AUTHORIZED

This OAR2 does not authorize:

- NFT deployment
- NFT minting
- wallet binding
- wallet verification
- Stripe activation
- payment link creation
- recognition
- verification claim
- conversion
- runtime / CSS change unless separately routed
- public RLS policy opening
- frontend direct write

## CODY / EXECUTOR ROLE

Executor may:

- create issuance SQL / RPC artifact
- create migration artifact if needed
- define server-side issuance helper if repo pattern exists
- add expiration policy to issuance logic
- create or prepare continuity event table
- run validation
- confirm zero public access
- write OAR1

Executor may not:

- issue a real temp key row unless this OAR2 explicitly authorizes test insert
- leave test rows in production
- open anonymous policies
- store raw email
- activate payment processor
- mint NFT
- bind wallet
- claim conversion

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. issuance route created or prepared
2. exact files created / modified
3. whether DB mutation occurred
4. function / RPC name if seated
5. `named_individual_ref` required always
6. `institution_key` required for `institution_in_service`
7. no institution-only temp key can be issued
8. expiration policy enforced
9. renewal requires OAR trace
10. continuity event route created or prepared
11. temporary actions remain traceable
12. permanent c3 Key resolution relation preserved for future route
13. email not stored raw
14. payment trace requirements enforced
15. assessment credit requirements enforced
16. collision handling route documented
17. return payload boundary documented
18. RLS remains enabled
19. no public insert policy opened
20. no frontend direct insert created
21. no NFT minting occurred
22. no crypto deployment occurred
23. no recognition / conversion standing created
24. row count standing after validation
25. continuity event row count standing after validation
26. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_issuance_route_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when temporary c3 Key issuance is governed through a bounded server-side / admin route, every temp key binds to a Named Individual, institutional keys also bind to Institution in Service, identifiers remain system-generated, expiration is enforced, temporary actions remain traceable by continuity event, email remains contact / recovery only, payment trace is recorded without becoming authority, RLS remains protected, and no NFT, wallet, recognition, conversion, or public insert standing is created.

## CLOSE

Named Individual answers.

Institution participates.

Temp key carries both when applicable.

Temp key expires.

Actions remain traceable.

Permanent c3 Key may inherit trace.

Email does not govern.

Payment does not govern.

Wallet waits.

NFT waits.

Codex holds.
