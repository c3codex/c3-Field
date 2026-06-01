---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — Measures Registry Runtime Held-State Messaging Contract v1
status: proposed
version: v1
operator: op044
system: measures_registry
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
  - measures-registry
  - runtime
  - held-state
  - messaging-contract
  - c3-map
  - c3-key
  - payment-standing
  - no-runtime-change
  - no-css-change
  - no-db-mutation
  - no-deployment
  - staging
  - folder-reconciliation-pending
source_alignment:
  - OAR1 — Measures Registry Runtime Governing Audit Comparison v1
  - OAR1 — c3 MAP / Deprecation-First Review v1
  - OAR1 — c3 Non-Wallet Payment Standing Contract v1
  - OAR1 — c3 Key Assign Temporary System Function Operator Use Packet v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Runtime Held-State Messaging Contract v1

## OBSERVED

The governing runtime audit comparison is complete.

It confirmed:

- runtime mutation: no
- CSS mutation: no
- DB mutation: no
- deployment: no
- payment / c3 Key / permission / recognition / conversion activation: no

The audit also found that active registered runtime does not clearly publish full held-state messaging for every pending operational item, including:

- Stripe live setup held
- payment processor held
- webhook held
- temp c3 Key real assignment held
- wallet migration held
- NFT deployment held
- permissions held
- DAO / distribution held
- recognition / conversion held

Current standing:

- active runtime: registered runtime
- deprecated path language: cleared from active registered runtime
- legacy runtime residue: still present, inactive
- payment activation: held
- c3 Key assignment: held
- permissions: held
- recognition / conversion: held
- wallet / NFT: held

## ALIGNED

Runtime may explain held states.

Runtime may not convert held states into active claims.

Held-state messaging must clarify system standing without activating payment, c3 Key, permission, wallet, DAO, recognition, or conversion.

## CORE RULE

Held means held.

Pending means pending.

Review means review.

No runtime copy may imply activation where system state is held.

Codex holds.

## ROUTED

Executor may define:

1. held-state messaging contract
2. allowed held-state copy
3. prohibited activation language
4. placement guidance for runtime surfaces
5. c3 MAP payment / commerce held language
6. c3 Key held language
7. recognition / conversion held language
8. validation requirements
9. OAR1 closeout

Executor may not:

- modify runtime
- modify CSS
- modify DB
- deploy
- wire Stripe
- open webhook
- issue temp c3 Key
- grant permission
- activate c3 MAP access
- bind wallet
- mint NFT
- activate DAO voting
- activate distribution
- claim recognition
- claim conversion
- move folders
- create process rule

## HELD-STATE MESSAGING PURPOSE

The runtime should make clear that certain surfaces are available for:

- interest
- review
- seat hold
- preparation
- assessment inquiry
- status explanation

But not yet:

- payment activated
- c3 Key activated
- permission activated
- wallet-bound
- NFT-minted
- recognized
- converted
- DAO / distribution activated

## ALLOWED HELD LANGUAGE

Allowed terms:

- held
- pending
- not yet active
- not yet available
- under review
- requires confirmation
- requires source / OAR standing
- requires operator confirmation
- requires separate activation
- processor not yet connected
- wallet migration not yet active
- recognition not yet issued
- conversion not yet confirmed

## PROHIBITED ACTIVATION LANGUAGE

Runtime must not say or imply:

- payment complete
- conversion complete
- recognized
- verified
- access granted
- permission activated
- c3 Key issued
- wallet-bound
- NFT minted
- DAO voting active
- distribution eligible
- processor connected
- automatic enrollment
- automatic conversion
- guaranteed acceptance

unless those states are separately seated and verified.

## SURFACE-SPECIFIC CONTRACT

### 1. Payment / Seat-Hold Surface

Allowed:

This surface may record seat-hold or payment-interest standing.

Live processor execution is not active yet.

Payment standing requires separate confirmation.

Payment does not complete conversion or grant access by itself.

Not allowed:

- Your payment is complete.
- Your access is active.
- Your c3 Key has been issued.
- Your institution is converted.

### 2. c3 Key Surface

Allowed:

c3 Key standing is a continuity credential.

Temporary assignment requires active source / OAR binding and operator-authorized execution.

Wallet-held migration is held until c3 Key contract deployment.

Permissions remain separately governed.

Not allowed:

- Your c3 Key unlocks all access.
- Your c3 Key grants c3 MAP access.
- Your c3 Key activates DAO / distribution rights.

### 3. c3 MAP Surface

Allowed:

c3 MAP is Measures Assessment Protocol / commerce circuit standing.

C1 / C2 / C3 are governed commerce circuit standings where separately mapped.

Payment standing may support eligibility, but does not activate permission by itself.

Not allowed:

- C1 = Connect.
- C2 = Contribute.
- C3 = Create.
- Payment completes c3 MAP conversion.

### 4. Recognition / Conversion Surface

Allowed:

Recognition follows verification.

Conversion is not complete until separately reviewed, verified, and seated.

Current standing may be pending review, held, or in assessment.

Not allowed:

- You are converted.
- You are recognized.
- Verification is complete.

### 5. Stripe / Processor Surface

Allowed:

Stripe setup is held pending business verification and processor routing.

Processor integration and webhook handling are not active yet.

Not allowed:

- Stripe is live.
- Webhook is active.
- Payment is automatically recorded.

## RUNTIME PLACEMENT GUIDANCE

Held-state messaging may appear on:

- payment / seat-hold surfaces
- assessment package surfaces
- contact / intake surfaces
- c3 MAP explanation surfaces
- c3 Key explanation surfaces
- confirmation / status surfaces

Messaging should be compact, institutional, and non-alarming.

It should not clutter the threshold hero.

Threshold language remains:

- Evaluate the Environment
- Structure the Environment

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. held-state messaging contract documented
2. exact files created / modified
3. whether DB mutation occurred
4. whether runtime mutation occurred
5. whether CSS mutation occurred
6. allowed held language documented
7. prohibited activation language documented
8. payment held-state language documented
9. c3 Key held-state language documented
10. c3 MAP distinction preserved
11. recognition / conversion held-state language documented
12. Stripe / processor held-state language documented
13. no runtime modification occurred unless separately routed
14. no CSS modification occurred
15. no DB mutation occurred
16. no deployment occurred
17. no payment / c3 Key / permission / recognition / conversion activation occurred
18. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_runtime_held_state_messaging_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when Measures Registry runtime held-state messaging is defined so public copy can accurately distinguish interest, review, seat-hold, payment standing, c3 Key standing, permission standing, wallet / NFT standing, DAO / distribution standing, recognition, and conversion without activating or implying any held state.

## CLOSE

Held-state messaging forms.

Runtime correction waits.

CSS waits.

Stripe waits.

Payment waits.

c3 Key assignment waits.

Permissions wait.

Wallet / NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
