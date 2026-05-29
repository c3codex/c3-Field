---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — Measures Registry c3 MAP Commerce Circuit Pricing + Conversion Credit Contract v1
status: completed
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_c3_map_commerce_circuit_pricing_conversion_credit_contract_v1.meta.md
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
  - c3-map
  - commerce-circuit
  - pricing
  - conversion-credit
  - completed
source_alignment:
  - OAR2 — Measures Registry c3 MAP Commerce Circuit Pricing + Conversion Credit Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit + Scope Contract v1
  - OAR1 — Measures Registry Assessment Response Email Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — Measures Registry c3 MAP Commerce Circuit Pricing + Conversion Credit Contract v1

## Status

**Completed.**

Pricing and conversion credit contract seated as governing document. No payment activated. No processor called. No runtime, CSS, DB, or activation change occurred.

## 1 — Pre-Seating Gate Confirmation

| Gate | Status |
|---|---|
| c3 MAP Commerce Circuit + Scope Contract seated (OAR1 confirmed) | CONFIRMED |
| Assessment Response Email Contract seated (OAR1 confirmed) | CONFIRMED |
| No payment processor activated | CONFIRMED |
| No invoice generated | CONFIRMED |
| No email sent | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No DB mutation | CONFIRMED |

## 2 — Contract Seated

`docs/oar/measures_interoperability/oar2_measures_registry_c3_map_commerce_circuit_pricing_conversion_credit_contract_v1.meta.md`

## 3 — Pricing Table Confirmed

| c3 MAP Commerce Circuit | Paid Assessment | Implementation Floor | Assessment Credit | Balance if Proceeding |
|---|---:|---:|---:|---:|
| C1 — Registration Circuit | $3,333 | $11,111 | $3,333 | $7,778 |
| C2 — Governance Circuit | $11,111 | $33,333 | $11,111 | $22,222 |
| C3 — Delivery Circuit | $33,333 | $111,111 | $33,333 | $77,778 |

### Credit Conditions (confirmed)

Assessment credit applies only when: payment is confirmed, assessment is completed, institution proceeds into the corresponding governed implementation / conversion contract, contract is accepted within the allowed term, and credit is logged in the commerce trace.

### Optional Enterprise / Foundational Contract (confirmed)

Foundational Conversion Cohort / Enterprise Delivery Contract — starting at $250,000+. Routed separately after c3 MAP where scope requires enterprise-level conversion.

## 4 — Validation Proof

| Check | Expected | Result |
|---|---|---|
| c3 MAP prices seated as contract only | confirmed | PASS |
| C1 / C2 / C3 remain Commerce Circuits, not readiness phases | confirmed | PASS |
| Assessment price separate from implementation floor | confirmed | PASS |
| Credit applicable only under governed implementation contract | confirmed | PASS |
| No payment processor activated | absent | PASS |
| No invoice generated | absent | PASS |
| No email sent | absent | PASS |
| No runtime modified | absent | PASS |
| No CSS modified | absent | PASS |
| No DB mutation | absent | PASS |
| No seal, badge, delivery, recognition, or conversion activation | absent | PASS |

## 5 — Carried Forward

| Item | Route |
|---|---|
| Payment processor integration | Future payment OAR2 |
| `phase_payment` surface activation | Future payment OAR2 |
| C1 / C2 / C3 delivery contract seating | Future delivery contract OAR2 |
| Invoice generation | Future payment OAR2 |
| Commerce trace schema and logging | Future commerce trace OAR2 |
| Credit application logic in conversion contract | Future conversion contract OAR2 |
| Enterprise / Foundational Contract routing | Future enterprise OAR2 |

## Close

Prices are seated. Credit rules are clear.

Payment waits for its processor OAR2.

Implementation waits for its contract.

Conversion waits for its review.

Codex holds.
