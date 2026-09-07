---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry phase_payment Runtime Surface Contract v1
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
  - phase-payment
  - runtime-surface
  - c3-map
  - commerce-circuit
  - commerce-trace
  - no-provider-call
  - no-invoice
  - no-activation
source_alignment:
  - OAR1 — Measures Registry Payment / phase_payment Contract v1
  - OAR1 — Measures Registry Commerce Trace Schema + Logging Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit Pricing + Conversion Credit Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit + Scope Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry phase_payment Runtime Surface Contract v1

## OBSERVED

The Payment / `phase_payment` Contract is confirmed and committed.

That contract seated the governing rules for payment and `phase_payment` while confirming:

- no payment processor activated
- no invoice generated
- no provider called
- no runtime modified
- no CSS modified
- no DB mutation
- no activation

It also confirms that `phase_payment` may display:

- c3 MAP Commerce Circuit
- assessment price
- implementation / conversion floor
- assessment credit
- balance if proceeding
- payment boundary disclaimer
- invoice / payment action if eligible

It may not display or imply:

- recognition
- verification
- certification
- conversion complete
- delivery contract active
- seal active
- C1 / C2 / C3 complete
- implementation started

## ALIGNED

This OAR2 defines the runtime surface contract for `phase_payment`.

This is not payment provider integration.

This is not invoice generation.

This is not processor activation.

This OAR2 governs what the payment runtime surface may render once payment provider work is routed.

## CORE RULE

`phase_payment` renders seated commerce trace and payment eligibility.

`phase_payment` does not create payment standing.

`phase_payment` does not create recognition.

`phase_payment` does not activate conversion.

`phase_payment` does not activate seals.

`phase_payment` does not activate delivery contract standing.

## ROUTED

The `phase_payment` runtime surface must read from seated state only.

Required source surfaces:

- `public.measures_commerce_trace`
- Measures AI Operational Evaluation result state
- c3 MAP Commerce Circuit determination
- Pricing + Conversion Credit Contract
- Payment / `phase_payment` Contract

## REQUIRED INPUT STATE

The runtime surface may render payment-ready state only when:

- `commerce_trace_key` exists
- `assessment_completed = true`
- `assessment_response_ready = true`
- `c3_map_commerce_circuit_determined = true`
- `payment_status` in (`not_started`, `invoice_pending`)
- institution relation exists

If any required state is missing, runtime must render a held state.

## ALLOWED DISPLAY

The surface may display:

- institution name
- assessment standing
- c3 MAP Commerce Circuit
- paid c3 MAP Assessment price
- implementation / conversion contract floor
- assessment credit
- balance if proceeding
- payment boundary language
- invoice / payment action when eligible
- held reason when not eligible

## REQUIRED CIRCUIT DISPLAY

C1 — Registration Circuit

- Assessment: $3,333
- Implementation Floor: $11,111
- Assessment Credit: $3,333
- Balance if Proceeding: $7,778

C2 — Governance Circuit

- Assessment: $11,111
- Implementation Floor: $33,333
- Assessment Credit: $11,111
- Balance if Proceeding: $22,222

C3 — Delivery Circuit

- Assessment: $33,333
- Implementation Floor: $111,111
- Assessment Credit: $33,333
- Balance if Proceeding: $77,778

## REQUIRED PAYMENT LANGUAGE

Payment opens the selected c3 MAP Commerce Circuit.

Payment does not confer Measures Registry recognition, verification, certification, seal activation, delivery contract standing, implementation standing, or conversion status.

## REQUIRED CREDIT LANGUAGE

Your c3 MAP Assessment payment is creditable toward the corresponding implementation or conversion contract if your institution proceeds under a governed contract.

## HELD STATES

If commerce trace is missing:

Payment is held. Commerce trace is required before payment can be offered.

If assessment response is not ready:

Payment is held. Assessment response must be completed before payment can be offered.

If c3 MAP Commerce Circuit is missing:

Payment is held. c3 MAP Commerce Circuit determination is required before payment can be offered.

If institution relation is missing:

Payment is held. Institution relation must be confirmed before payment can be offered.

If payment is already paid:

Payment received. Credit eligibility is governed by commerce trace and later implementation / conversion contract.

If payment failed:

Payment failed. Retry requires a logged retry route.

If redacted:

Payment unavailable. This commerce trace has been redacted.

## NOT AUTHORIZED

This OAR2 does not authorize:

- payment processor integration
- invoice generation
- payment link generation
- provider call
- provider secret handling
- DB mutation
- runtime mutation beyond bounded `phase_payment` surface definition
- CSS implementation unless separately routed
- recognition
- verification
- certification
- seal activation
- delivery contract activation
- implementation start
- conversion claim
- credit application to contract

## CODY ROLE

Cody may later implement the `phase_payment` runtime surface only from this OAR2 and only after provider / invoice routing is separately authorized.

Cody may:

- render seated commerce trace state
- render held states
- render pricing and credit language
- render payment boundary disclaimer
- prepare surface structure for future payment action

Cody may not:

- generate invoice
- call provider
- mark paid
- apply credit
- activate seal
- activate delivery contract
- claim recognition
- claim conversion
- invent missing commerce trace
- hardcode price outside seated contract

## VALIDATION REQUIREMENTS

Executor must confirm:

1. `phase_payment` surface reads seated commerce trace state only
2. pricing matches seated c3 MAP pricing contract
3. held states render when required data is missing
4. payment action is disabled unless eligible state exists
5. no provider call made
6. no invoice generated
7. no payment link generated
8. no DB mutation unless separately routed
9. no recognition claimed
10. no seal activated
11. no delivery contract activated
12. no implementation started
13. no conversion claimed
14. no CSS changed unless separately routed

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_phase_payment_runtime_surface_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the `phase_payment` runtime surface is contractually bounded to render only seated commerce trace, c3 MAP pricing, credit language, eligibility, and held states — without activating payment, provider calls, invoices, recognition, seals, delivery contract standing, implementation, or conversion.

## CLOSE

Commerce trace holds.

`phase_payment` renders.

Provider waits.

Invoice waits.

Payment waits.

Credit waits.

Conversion waits.

Codex holds.
