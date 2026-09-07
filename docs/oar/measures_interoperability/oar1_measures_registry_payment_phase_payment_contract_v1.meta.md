---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — Measures Registry Payment / phase_payment Contract v1
status: completed
version: v1
operator: op044
date: 2026-05-29
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_payment_phase_payment_contract_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar1
  - measures-interoperability
  - payment
  - phase-payment
  - c3-map
  - commerce-circuit
  - commerce-trace
  - completed
source_alignment:
  - OAR2 — Measures Registry Payment / phase_payment Contract v1
  - OAR1 — Measures Registry Commerce Trace Schema + Logging Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit Pricing + Conversion Credit Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit + Scope Contract v1
  - OAR1 — Measures Registry Assessment Response Email Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — Measures Registry Payment / phase_payment Contract v1

## Status

**Completed.**

Payment and `phase_payment` contract seated as governing document. No payment activated. No invoice generated. No provider called. No runtime, CSS, DB, or activation change occurred.

## 1 — Pre-Seating Gate Confirmation

| Gate | Status |
|---|---|
| Commerce Trace Schema + Logging Contract seated (OAR1 confirmed) | CONFIRMED |
| c3 MAP Pricing + Conversion Credit Contract seated (OAR1 confirmed) | CONFIRMED |
| c3 MAP Commerce Circuit + Scope Contract seated (OAR1 confirmed) | CONFIRMED |
| Assessment Response Email Contract seated (OAR1 confirmed) | CONFIRMED |
| No payment processor activated | CONFIRMED |
| No invoice generated | CONFIRMED |
| No email sent | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No DB mutation | CONFIRMED |

## 2 — Contract Seated

`docs/oar/measures_interoperability/oar2_measures_registry_payment_phase_payment_contract_v1.meta.md`

## 3 — Contract Definitions Confirmed

### Payment Eligibility (confirmed)

Payment may be offered only when: `assessment_completed = true`, `assessment_response_ready = true`, `c3_map_commerce_circuit_determined = true`, `commerce_trace_key` exists, `payment_status` in (`not_started`, `invoice_pending`), and institution relation exists.

### Invoice Eligibility (confirmed)

Invoice may be generated only after commerce trace exists, circuit is determined, price matches seated contract, status is `invoice_pending`, provider is configured, and institution relation exists.

### Commerce Trace Update Rules (confirmed)

| Event | Fields Updated |
|---|---|
| Invoice prepared | `payment_status = invoice_pending`, `invoice_status = invoice_pending` |
| Invoice issued | `payment_status = invoice_issued`, `invoice_status = invoice_issued`, `provider_invoice_id` recorded |
| Payment pending | `payment_status = payment_pending` |
| Payment succeeded | `payment_status = paid`, `credit_status = eligible`, `metadata.payment_evidence` recorded |
| Payment failed | `payment_status = payment_failed`, `metadata.provider_error` recorded |
| Held | `payment_status = held`, `metadata.held_reason` recorded |
| Redacted | `payment_status = redacted`, `credit_status = redacted`, `conversion_status = redacted` |

### phase_payment Surface (confirmed)

May display: c3 MAP Commerce Circuit, assessment price, implementation/conversion floor, assessment credit, balance if proceeding, payment boundary disclaimer, invoice/payment action if eligible.

May not display or imply: recognition, verification, certification, conversion complete, delivery contract active, seal active, C1/C2/C3 complete, implementation started.

### Provider Boundary (confirmed)

Provider is evidence only. Provider secrets may not be stored in commerce trace. Codex / Measures hold standing.

### Payment Boundary (confirmed)

Payment opens the circuit. Payment does not complete the circuit, complete c3 MAP, complete conversion, activate recognition, activate seals, activate delivery contract, activate implementation, or certify AI systems.

### Credit Boundary (confirmed)

Credit becomes eligible only after `payment_status = paid`, assessment completed, institution relation bound, commerce trace present. Credit is applied only through a later governed implementation/conversion contract OAR2.

## 4 — Validation Proof

| Check | Expected | Result |
|---|---|---|
| Payment contract seated as document only | confirmed | PASS |
| Commerce trace required before payment operation | confirmed | PASS |
| Pricing matches seated C1 / C2 / C3 contract | confirmed | PASS |
| Invoice reads commerce trace before generating | confirmed | PASS |
| Provider secrets excluded from commerce trace | confirmed | PASS |
| `paid` status only follows provider evidence | confirmed | PASS |
| `credit_status = eligible` only after payment success | confirmed | PASS |
| No payment processor activated | absent | PASS |
| No invoice generated | absent | PASS |
| No email sent | absent | PASS |
| No runtime modified | absent | PASS |
| No CSS modified | absent | PASS |
| No DB mutation | absent | PASS |
| No conversion activated | absent | PASS |
| No recognition activated | absent | PASS |
| No seal activated | absent | PASS |
| No delivery contract activated | absent | PASS |
| No implementation started | absent | PASS |

## 5 — Carried Forward

| Item | Route |
|---|---|
| Payment processor provider selection and integration | Future payment provider OAR2 |
| Invoice generation implementation | Future invoice OAR2 |
| `phase_payment` runtime surface implementation | Future phase_payment runtime OAR2 |
| Commerce trace → `payment_status` update implementation | Future payment provider OAR2 |
| `credit_status = applied` path (after implementation contract) | Future conversion contract OAR2 |
| Retry route for failed payments | Future payment provider OAR2 |
| Enterprise / Foundational Contract payment routing ($250,000+) | Future enterprise OAR2 |

## Close

Contract seated. Boundaries confirmed.

Commerce trace first.

Payment opens.

Provider evidence governs.

Credit waits for contract.

Implementation waits.

Conversion waits for review.

Codex holds.
