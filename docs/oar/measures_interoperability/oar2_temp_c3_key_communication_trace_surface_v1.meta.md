---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key Communication Trace Surface v1
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
  - communication-trace
  - email-confirmation
  - support-safe
  - resend
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — Temporary c3 Key Email Provider Configuration and Delivery Retry v1
  - OAR1 — Temporary c3 Key Email Confirmation Delivery v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key Communication Trace Surface v1

## OBSERVED

Temporary c3 Key confirmation delivery is complete.

Current standing:

- temp c3 Key issued
- agreement acknowledged
- confirmation email sent through Resend
- provider message id captured
- runtime held
- wallet migration held
- NFT held
- recognition / conversion held

Delivery evidence exists only in OAR1.

The email delivery OAR1 confirms Resend sent the confirmation, captured provider message ID `283da82e-c839-4ba5-b92d-1c0579b79388`, and preserved support-safe boundaries.

The same OAR1 confirms no communication trace row was recorded because the current continuity event contract does not allow `email_confirmation_sent`, and the OAR did not authorize altering that contract.

## ALIGNED

Communication delivery should not live only in OAR prose.

A governed trace surface is required for future confirmations, reminders, agreement notices, wallet migration notices, payment notices, and institutional support records.

This OAR2 defines a support-safe communication trace surface.

## CORE RULE

Communication trace records delivery evidence.

It does not expose message secrets.

It does not expose private key material.

It does not become recognition.

It does not become conversion.

Codex holds.

## ROUTED

Executor may create:

1. communication trace table
2. bounded communication type values
3. bounded delivery status values
4. support-safe provider evidence fields
5. relation to temp c3 Key where applicable
6. relation to source OAR
7. RLS enabled with zero public policies
8. validation query
9. OAR1 closeout

Executor may not:

- store raw email bodies with sensitive content
- store provider secrets
- store API keys
- store temp_key
- store contact_email_hash or encrypted email in communication trace
- open public RLS policies
- create frontend direct insert
- activate runtime
- mint NFT
- bind wallet
- create recognition
- create conversion

## FIELD CONTRACT

Preferred table:

    create table if not exists public.c3_key_communication_trace (
      id uuid primary key default gen_random_uuid(),

      temp_key_id uuid references public.c3_key_temp(id) on delete set null,

      communication_type text not null check (
        communication_type in (
          'temp_key_confirmation',
          'agreement_notice',
          'expiration_notice',
          'renewal_notice',
          'wallet_migration_notice',
          'payment_notice',
          'support_notice'
        )
      ),

      delivery_channel text not null check (
        delivery_channel in (
          'email',
          'operator_record',
          'manual',
          'system'
        )
      ),

      delivery_status text not null check (
        delivery_status in (
          'prepared',
          'sent',
          'delivered_to_provider',
          'held',
          'failed',
          'cancelled'
        )
      ),

      provider text,
      provider_message_id text,

      recipient_ref text,
      sender_ref text,
      reply_to_ref text,

      public_ref text,
      subject text,

      source_oar_id text not null,
      metadata jsonb not null default '{}'::jsonb,

      sent_at timestamptz,
      created_at timestamptz not null default now()
    );

## SUPPORT-SAFE RULE

Allowed in trace:

- public_ref
- provider
- provider_message_id
- recipient_ref
- sender_ref
- reply_to_ref
- subject
- delivery status
- source_oar_id
- non-sensitive metadata

Not allowed in trace:

- temp_key
- raw secret values
- provider API key
- service-role key
- contact_email_hash
- contact_email_encrypted
- raw agreement metadata
- private payment data

## BACKFILL RULE

Executor may backfill one communication trace row for the completed confirmation:

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

If `temp_key_id` can be safely resolved from `public_ref = C3-TEMP-1A135A`, executor may bind it.

If not, executor must record the trace with `temp_key_id = null` and document why.

## NOT AUTHORIZED

This OAR2 does not authorize:

- email resend
- new email delivery
- runtime wiring
- frontend direct insert
- public RLS policy
- Stripe activation
- payment link creation
- NFT deployment
- NFT minting
- wallet binding
- wallet verification
- recognition
- verification claim
- conversion
- CSS / runtime mutation

## CODY / EXECUTOR ROLE

Executor may:

- create SQL seating artifact
- create migration artifact if repo migration pattern is present
- create communication trace table
- enable RLS
- keep zero public policies
- backfill one support-safe trace row for the completed confirmation
- validate support-safe boundaries
- write OAR1 closeout

Executor may not:

- resend email
- send a new email
- expose provider secrets
- store temp_key
- store contact email hash / encrypted value
- open public policies
- mutate runtime / CSS
- mint NFT
- bind wallet
- activate payment
- create recognition / conversion

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. communication trace table created or prepared
2. exact files created / modified
3. whether DB mutation occurred
4. RLS enabled
5. no public policies opened
6. communication types bounded
7. delivery statuses bounded
8. support-safe fields only
9. no secrets stored
10. no temp_key stored
11. no contact email hash / encrypted value stored
12. prior confirmation delivery trace backfilled or held with reason
13. provider message ID captured if backfilled
14. temp_key_id binding standing documented
15. no new email sent
16. no runtime / CSS mutation occurred
17. no NFT minting occurred
18. no crypto deployment occurred
19. no wallet binding occurred
20. no Stripe / payment link activation occurred
21. no recognition / conversion standing created
22. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_communication_trace_surface_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when a governed, support-safe communication trace surface exists for temporary c3 Key communications, the completed confirmation delivery can be recorded without exposing private authority, and all runtime, wallet, NFT, payment, recognition, and conversion boundaries remain held.

## CLOSE

Email delivery is no longer only prose.

Communication trace becomes queryable.

Private authority remains hidden.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
