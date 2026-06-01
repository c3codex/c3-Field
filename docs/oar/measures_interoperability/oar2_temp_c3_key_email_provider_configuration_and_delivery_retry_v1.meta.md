---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key Email Provider Configuration and Delivery Retry v1
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
  - email-confirmation
  - resend
  - provider-configuration
  - delivery-retry
  - institutional-readable
  - support-safe
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — Temporary c3 Key Email Confirmation Delivery v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - OAR1 — Temporary c3 Key Operator Issuance Packet v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key Email Provider Configuration and Delivery Retry v1

## OBSERVED

Temporary c3 Key email confirmation delivery was previously held.

Hold reason:

- `RESEND_API_KEY` missing
- `OPERATOR_DISPATCH_KEY` missing

The operator has now added required provider credentials to `.env.registry`.

The domain `measuresregistry.com` has been confirmed in Resend and DNS records have been updated.

The intended automated sender is:

- From: `Measures Registry <notifications@measuresregistry.com>`
- Reply-To: `connect@measuresregistry.com`

The intended recipient remains:

- To: `connect@measuresregistry.com`

## ALIGNED

This OAR2 authorizes one provider-configured retry of the held institutional-readable temporary c3 Key confirmation email.

The email must use only support-safe temporary c3 Key information.

The email must not expose:

- `temp_key`
- contact email hash
- contact email encrypted value
- service-role secrets
- provider secrets
- raw metadata
- raw agreement metadata
- internal DB-only values beyond support-safe reference data

## CORE RULE

Verify provider configuration.

Send held confirmation.

Capture provider message id.

Do not expose secrets.

Do not mutate runtime.

Do not create recognition.

Do not create conversion.

Codex holds.

## PROVIDER CONFIGURATION REQUIREMENTS

Executor must verify presence without printing values:

- `RESEND_API_KEY`
- `OPERATOR_DISPATCH_KEY`

Executor must verify or use configured sender:

- `MEASURES_EMAIL_FROM = Measures Registry <notifications@measuresregistry.com>`

Executor must verify or use configured reply-to:

- `MEASURES_EMAIL_REPLY_TO = connect@measuresregistry.com`

If `MEASURES_EMAIL_FROM` or `MEASURES_EMAIL_REPLY_TO` is not seated, executor may use these values directly for this retry and recommend seating env keys in OAR1.

Executor must not print secret values.

Allowed validation output:

- `RESEND_API_KEY present: true`
- `OPERATOR_DISPATCH_KEY present: true`
- `sender configured: true`
- `reply_to configured: true`

Not allowed:

- printing API key
- printing dispatch key
- committing secrets
- exposing `.env.registry` contents

## EMAIL TO SEND

To:

`connect@measuresregistry.com`

From:

`Measures Registry <notifications@measuresregistry.com>`

Reply-To:

`connect@measuresregistry.com`

Subject:

`Temporary c3 Key Confirmation — C3-TEMP-1A135A`

Body:

Temporary c3 Key Confirmation

A temporary c3 Key has been issued for c3 Community Partners DAO, LLC and connected to the Named Individual Stephanie Joanne.

Temporary c3 Key Reference:
C3-TEMP-1A135A

Status:
payment_confirmed

Agreement:
Temp c3 Key Use Agreement v1 acknowledged

Expiration Date:
August 29, 2026

The c3 Key is an access and continuity credential. It is used to connect an approved participant to governed Measures Registry activity, including records, acknowledgments, assessment-related activity, participation standing, and future access surfaces where permitted.

This temporary c3 Key preserves continuity before a wallet-held c3 Key is issued. It allows the temporary record and related activity to remain traceable so eligible activity may later be connected to a wallet-held c3 Key through a governed migration process.

This temporary c3 Key is provisional. It does not replace a wallet-held c3 Key and does not create recognition, verification, conversion, NFT standing, wallet standing, or independent payment standing.

Permanent access, future payments, DAO participation, conversion activity, or other governed actions may require a wallet-held c3 Key.

Please retain this reference for records:

C3-TEMP-1A135A

Measures Registry
Integrity Governance for AI Systems

## DELIVERY ROUTE

Executor may use the existing configured Resend-based dispatch surface or a bounded server-side send route.

If using existing dispatch route, executor must:

- load `.env.registry` server-side only
- confirm required env keys without printing them
- send to `connect@measuresregistry.com`
- send from `Measures Registry <notifications@measuresregistry.com>`
- set reply-to as `connect@measuresregistry.com`
- capture provider message id if available
- write OAR1 closeout

If Resend/Supabase integration requires a different server-side invocation, executor may use the equivalent bounded route if it preserves the same support-safe boundaries.

If provider configuration is still incomplete, executor must hold again and state the missing requirement.

## COMMUNICATION TRACE

The prior OAR1 held continuity event recording because `email_confirmation_sent` is not an allowed event type in `public.c3_key_temp_continuity_event`.

Executor must not force invalid event type insertion.

For this retry:

- delivery evidence may be recorded in OAR1 only
- provider message id may be recorded in OAR1
- future communication trace OAR2 remains recommended

This OAR2 does not authorize altering the continuity event enum/check values.

## NOT AUTHORIZED

This OAR2 does not authorize:

- exposing `temp_key`
- exposing provider secrets
- exposing service-role secrets
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
- CSS/runtime mutation
- altering continuity event type contract

## CODY / EXECUTOR ROLE

Executor may:

- verify provider env presence without printing secrets
- retry the held institutional-readable confirmation email
- capture provider message id
- record delivery result
- record support-safe delivery evidence
- write OAR1 closeout

Executor may not:

- expose private authority
- expose secrets
- include `temp_key` in email
- include contact email hash/encrypted fields
- mutate runtime/CSS
- create recognition/conversion
- activate payment processor
- mint NFT
- bind wallet
- alter event contract

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. provider env checked without exposing secrets
2. `RESEND_API_KEY` presence confirmed or missing
3. `OPERATOR_DISPATCH_KEY` presence confirmed or missing
4. sender used
5. reply-to used
6. email sent or held with reason
7. recipient = `connect@measuresregistry.com`
8. subject used
9. support-safe public reference included
10. c3 Key use explained in institutional language
11. wallet-held c3 Key future requirement disclosed
12. provisional nature disclosed
13. no `temp_key` exposed
14. no provider secrets exposed
15. no service-role secrets exposed
16. no email hash/encrypted field exposed
17. no raw metadata exposed
18. provider message id captured if available
19. communication trace standing documented
20. no runtime/CSS mutation occurred
21. no NFT minting occurred
22. no crypto deployment occurred
23. no wallet binding occurred
24. no Stripe/payment link activation occurred
25. no recognition/conversion standing created
26. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_email_provider_configuration_and_delivery_retry_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when provider configuration is verified without exposing secrets, the held temporary c3 Key confirmation email is sent to `connect@measuresregistry.com` from `notifications@measuresregistry.com`, provider delivery evidence is captured, and all boundaries around private authority, runtime, wallet, NFT, payment, recognition, and conversion remain held.

## CLOSE

Provider verifies.

Confirmation retries.

Delivery evidence records.

Private authority remains hidden.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
