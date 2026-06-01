---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Temporary c3 Key Email Confirmation Delivery v1
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
  - institutional-readable
  - delivery-surface
  - support-safe
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - OAR1 — Temporary c3 Key Operator Issuance Packet v1
  - OAR1 — Temporary c3 Key Issuance Route v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Temporary c3 Key Email Confirmation Delivery v1

## OBSERVED

One real temporary c3 Key has been issued.

Support-safe standing from OAR1:

- `public_ref`: `C3-TEMP-1A135A`
- `status`: `payment_confirmed`
- `payment_status`: `confirmed`
- `assessment_credit_status`: `none`
- `origin_type`: `institution_in_service`
- `institution_key`: `c3_community_partners_dao_llc`
- Named Individual: `Stephanie Joanne`
- agreement acknowledged: `true`
- agreement version: `v1`
- expires_at: `2026-08-29T23:35:37.087109+00:00`

The prior OAR1 confirms the issuance was not a test row and that no runtime, NFT minting, crypto deployment, wallet binding, Stripe/payment link, recognition, conversion, frontend direct insert, public RLS policy, or CSS standing was created.

Email confirmation delivery has not yet been governed or recorded.

## ALIGNED

This OAR2 authorizes one institutional-readable email confirmation for the issued temporary c3 Key.

Recipient:

`connect@measuresregistry.com`

The email must explain what the c3 Key is used for in plain institutional language.

The email must not expose:

- `temp_key`
- contact email hash
- contact email encrypted value
- service-role secrets
- raw metadata
- raw agreement metadata
- internal DB-only values beyond support-safe reference data

## CORE RULE

Confirm issuance.

Explain use.

Preserve limits.

Do not expose private authority.

Do not create recognition.

Do not create conversion.

Codex holds.

## EMAIL PURPOSE

The email confirms that a temporary c3 Key has been issued and explains that the c3 Key is an access and continuity credential used to connect an approved participant to governed Measures Registry activity.

The email must make clear:

1. The c3 Key supports participation continuity.
2. The temporary c3 Key is provisional.
3. The temporary c3 Key does not replace a wallet-held c3 Key.
4. The temporary c3 Key does not create recognition, verification, conversion, NFT standing, wallet standing, or independent payment standing.
5. Future permanent access, payments, DAO participation, conversion activity, or other governed actions may require a wallet-held c3 Key.
6. Eligible activity may later connect to a wallet-held c3 Key through governed migration.

## EMAIL TO SEND

To:

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

Executor may use the existing configured email provider if present.

If using Resend or equivalent provider, executor must:

- send to `connect@measuresregistry.com`
- use a verified sender/domain
- avoid exposing secrets in logs
- capture provider message id if available
- write OAR1 closeout

If provider configuration is missing, executor must not improvise. Executor must return a hold/correction with missing provider requirements.

## CONTINUITY EVENT

Executor should record or prepare a continuity event for email delivery if the current continuity event contract supports the event type.

If `email_confirmation_sent` is not an allowed event type, executor must not force it into the existing event table.

In that case, executor must document one of:

1. delivery recorded in OAR1 only for now
2. future OAR2 required to add delivery event type
3. email delivery trace table required

Preferred if existing enum/check blocks event insertion:

- do not alter event types in this OAR2
- record email delivery evidence in OAR1
- recommend a future communication trace OAR2

## NOT AUTHORIZED

This OAR2 does not authorize:

- exposing `temp_key`
- exposing secrets
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

## CODY / EXECUTOR ROLE

Executor may:

- send the institutional-readable confirmation email
- capture provider message id
- confirm delivery attempt/result
- record support-safe delivery evidence
- write OAR1 closeout

Executor may not:

- expose private key material
- expose service-role secrets
- include temp_key in email
- include contact email hash/encrypted fields
- mutate runtime/CSS
- create recognition/conversion
- activate payment processor
- mint NFT
- bind wallet

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. email sent or delivery held with reason
2. recipient = `connect@measuresregistry.com`
3. subject used
4. support-safe public reference included
5. c3 Key use explained in institutional language
6. wallet-held c3 Key future requirement disclosed
7. provisional nature disclosed
8. no `temp_key` exposed
9. no service-role secrets exposed
10. no email hash/encrypted field exposed
11. no raw metadata exposed
12. provider message id captured if available
13. whether continuity event was recorded or held
14. no runtime/CSS mutation occurred
15. no NFT minting occurred
16. no crypto deployment occurred
17. no wallet binding occurred
18. no Stripe/payment link activation occurred
19. no recognition/conversion standing created
20. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_temp_c3_key_email_confirmation_delivery_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when an institutionally readable confirmation email is sent to `connect@measuresregistry.com`, using only support-safe temporary c3 Key data, clearly explaining what the c3 Key is used for and preserving all boundaries around wallet-held c3 Key, recognition, conversion, payment, NFT, runtime, and private authority.

## CLOSE

Confirmation sends.

Use is explained.

Private authority remains hidden.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
