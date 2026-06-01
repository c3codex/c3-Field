---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key Communication Trace Runtime Read Model v1
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
  - runtime-read-model
  - admin-support-read
  - support-safe
  - no-public-access
  - no-runtime-execution
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — Temporary c3 Key Communication Trace Surface v1
  - OAR1 — Temporary c3 Key Email Provider Configuration and Delivery Retry v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key Communication Trace Runtime Read Model v1

## OBSERVED

`public.c3_key_communication_trace` is live seated with one support-safe backfill row.

Current standing:

- communication trace table seated
- backfill row seated
- email delivery queryable
- provider evidence captured
- RLS enabled
- no public policies intentionally opened
- runtime held
- wallet migration held
- NFT held
- recognition / conversion held

The prior OAR1 confirms the trace table was created with bounded communication types, bounded delivery channels / statuses, support-safe provider evidence fields, required `source_oar_id`, JSON object metadata only, RLS enabled, and no public policy intentionally opened.

The prior OAR1 also confirms the Resend confirmation was backfilled and safely bound to the existing temporary c3 Key row without exposing or storing the raw `temp_key`.

## ALIGNED

The system now needs a read model definition, not runtime execution.

This OAR2 defines what a future admin / support runtime may safely read.

It does not authorize frontend wiring.

It does not authorize public access.

It does not authorize mutation.

## CORE RULE

Define read model.

Do not execute runtime.

Do not open public access.

Do not expose private authority.

Codex holds.

## ROUTED

Executor may define or prepare:

1. support-safe read view or RPC
2. allowed read fields
3. admin / support response shape
4. access posture
5. validation query
6. OAR1 closeout

Executor may not:

- open anon read policy
- open public RLS policy
- wire frontend runtime
- create public dashboard
- expose `temp_key`
- expose provider secrets
- expose service-role secrets
- expose `contact_email_hash`
- expose `contact_email_encrypted`
- mutate records
- send or resend email
- bind wallet
- mint NFT
- create recognition
- create conversion

## READ MODEL PURPOSE

The read model exists so a future admin / support surface can answer:

- Was a communication sent?
- To what support-safe recipient reference?
- From what sender reference?
- What public c3 Key reference was used?
- What provider handled the send?
- What provider message id was returned?
- What source OAR authorized the action?
- When was it sent?

It must not expose private credential or identity internals.

## SUPPORT-SAFE READ FIELDS

Allowed read fields:

- trace_id
- temp_key_id
- public_ref
- communication_type
- delivery_channel
- delivery_status
- provider
- provider_message_id
- recipient_ref
- sender_ref
- reply_to_ref
- subject
- source_oar_id
- sent_at
- created_at
- metadata.support_safe
- metadata.raw_email_body_stored
- metadata.secrets_stored
- metadata.temp_key_stored

Optional derived field:

- has_temp_key_binding = true / false

## NOT ALLOWED IN READ MODEL

- temp_key
- contact_email_hash
- contact_email_encrypted
- provider API key
- service-role key
- raw email body
- raw agreement metadata
- private payment data
- unbounded metadata payload

## PREFERRED FIELD CONTRACT

Executor may create a view or RPC.

Preferred read view:

    create or replace view public.v_c3_key_communication_trace_support_read as
    select
      ct.id as trace_id,
      ct.temp_key_id,
      ct.public_ref,
      ct.communication_type,
      ct.delivery_channel,
      ct.delivery_status,
      ct.provider,
      ct.provider_message_id,
      ct.recipient_ref,
      ct.sender_ref,
      ct.reply_to_ref,
      ct.subject,
      ct.source_oar_id,
      ct.sent_at,
      ct.created_at,
      case
        when ct.temp_key_id is not null then true
        else false
      end as has_temp_key_binding,
      jsonb_build_object(
        'support_safe', ct.metadata -> 'support_safe',
        'raw_email_body_stored', ct.metadata -> 'raw_email_body_stored',
        'secrets_stored', ct.metadata -> 'secrets_stored',
        'temp_key_stored', ct.metadata -> 'temp_key_stored'
      ) as support_metadata
    from public.c3_key_communication_trace ct;

## ACCESS POSTURE

Default:

- RLS on base table remains enabled
- no anon / public policy opened
- no frontend direct read opened

If view is created, executor must ensure it does not bypass intended protection.

Preferred for now:

- admin / service-role read only
- no grant to anon
- no grant to authenticated unless separately routed

If Supabase view behavior creates unwanted access ambiguity, executor should hold view creation and prepare a service-role / admin RPC instead.

## NOT AUTHORIZED

This OAR2 does not authorize:

- frontend runtime wiring
- public dashboard creation
- anon read policy
- public RLS policy
- record mutation
- new email delivery
- email resend
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
- create support-safe read view or prepare admin RPC
- validate no prohibited fields are exposed
- validate base table RLS remains enabled
- validate no public / anon policy is opened
- write OAR1 closeout

Executor may not:

- wire frontend runtime
- open public access
- expose private authority
- mutate communication trace records
- resend email
- mint NFT
- bind wallet
- activate payment
- create recognition / conversion

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. read model created or prepared
2. exact files created / modified
3. whether DB mutation occurred
4. view / RPC name if seated
5. allowed fields documented
6. prohibited fields excluded
7. no `temp_key` exposed
8. no `contact_email_hash` exposed
9. no `contact_email_encrypted` exposed
10. no provider secrets exposed
11. no service-role secrets exposed
12. no raw email body exposed
13. RLS remains enabled on base table
14. no public / anon policy opened
15. no frontend runtime wired
16. no mutation route created
17. no email sent / resend occurred
18. no wallet binding occurred
19. no NFT minting occurred
20. no recognition / conversion standing created
21. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_communication_trace_runtime_read_model_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when a support-safe, admin-scoped communication trace read model is defined or seated, without opening public access, wiring runtime, exposing private authority, sending email, or creating wallet / NFT / recognition / conversion standing.

## CLOSE

Read model defined.

Runtime still waits.

Public access remains closed.

Private authority remains hidden.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
