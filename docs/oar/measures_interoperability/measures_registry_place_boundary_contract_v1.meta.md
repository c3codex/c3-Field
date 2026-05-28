---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Place Boundary Contract v1
status: seated
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_second_layer_geometry_contract_seating_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - architecture-contract
  - measures-registry
  - place-boundary
  - second-layer-geometry
  - payment-boundary
  - subscription-boundary
  - email-boundary
  - runtime-boundary
  - codexstone
layer: second
---

# Measures Registry — Place Boundary Contract v1

## Contract Purpose

The Place Boundary Contract defines what cannot cross from one governed layer to another without a future seated contract and routed OAR2.

Boundary is enforced. No implementation may cross a boundary without authorization.

Urgency does not authorize a boundary crossing. Delivery pressure does not authorize a boundary crossing. Frontend urgency does not authorize a boundary crossing.

## Boundary Definitions

### Payment Boundary

No payment activation without a payment contract.

| Bounded Action | What It Requires |
|---|---|
| `phase_payment` surface activation | Seated delivery contract + confirmed seat hold |
| C1 / C2 / C3 circuit activation | Delivery contract seated + operator confirmation |
| Any pricing display | Marble Commerced Circuit — contract conditions only |
| Offering enrollment state change | Operator confirmation |

No surface may present payment UI before a delivery contract is confirmed.

No circuit may activate on standing report alone.

Payment contract seating requires its own OAR2.

**Held pending:**
- Delivery contract seating — future OAR2
- 3x33 pricing logic implementation — future OAR2

---

### Subscription Boundary

No subscription automation without a subscription contract.

| Bounded Action | What It Requires |
|---|---|
| Automated subscription sequences | Subscription automation OAR2 |
| Subscription state management (DB) | Future runtime OAR2 |
| Cross-surface subscription continuity | Subscription contract OAR2 |

Subscription invitation may appear at the Lapis Relational Place as a surface — adjacency is defined.

Automated subscription implementation requires its own OAR2.

The `contact_email` field from SRC intake does not authorize subscription sequences without a subscription contract.

**Held pending:**
- Subscription continuity implementation — future OAR2

---

### Email Boundary

No email automation without an email contract.

| Bounded Action | What It Requires |
|---|---|
| Email continuity sequences | Email contract OAR2 |
| SRC contact email routing | SRC continuation OAR2 |
| Post-assessment email sequences | Delivery contract + email contract |
| Cohort email delivery | Cohort delivery contract |
| Structural Drift email dispatch | Structural Drift distribution contract |

The `contact_email` field captured at `connect_src` is an SRC intake field. It authorizes SRC record creation. It does not authorize automated email sequences.

**Held pending:**
- Email continuity implementation — future OAR2

---

### Social Automation Boundary

No social automation without a distribution contract.

| Bounded Action | What It Requires |
|---|---|
| Social media automation | Distribution contract OAR2 |
| Publication automation | Structural Drift distribution OAR2 |
| Cross-platform routing | Distribution contract OAR2 |

Social automation placeholder is held at Lapis Interoperability Place. The placeholder does not authorize implementation.

**Held pending:**
- Social media automation — future OAR2

---

### Support Boundary

No support routing implementation without a support contract.

| Bounded Action | What It Requires |
|---|---|
| Support route implementation | Support contract OAR2 |
| c3 Field support routing | c3 Field contract OAR2 |
| Operator support escalation | Operator confirmation + support contract |
| Automated support triage | Support automation OAR2 |

Support adjacency is defined at Lapis Relational Place and Lapis Interoperability Place.

Support adjacency ≠ support implementation.

**Held pending:**
- Support routing implementation — future OAR2

---

### Runtime Boundary

No runtime implementation without a runtime OAR2.

| Bounded Action | What It Requires |
|---|---|
| DB_HELD_CODEX_SOURCE_RECORDS alignment | Future runtime OAR2 |
| SRC continuation through DB source-reference | Future runtime OAR2 |
| Marble Governance Chamber implementation | Future runtime OAR2 |
| Cohort activation logic | Future runtime OAR2 |
| Lapis Interoperability continuation route | Future runtime OAR2 |
| Conversion engine login surface | Future runtime OAR2 |
| Email continuity runtime | Future runtime OAR2 |
| Subscription state runtime | Future runtime OAR2 |

All runtime surfaces defined in first-layer and second-layer contracts as placeholders require a runtime OAR2 before implementation.

No contract artifact authorizes runtime modification.

**Held pending:**
- Future runtime OAR2 (multiple surfaces)

---

### CSS Boundary

No CSS modification without a material styling OAR2.

| Bounded Action | What It Requires |
|---|---|
| Material token assignment | Material styling OAR2 |
| Marble material tokens | Material styling OAR2 |
| Lapis material tokens | Material styling OAR2 |
| Obsidian material tokens | Material styling OAR2 |
| Crystal/Lapis material tokens | Material styling OAR2 |
| Right Path media passage styling | Material styling OAR2 |

Material assignments are defined in contracts. CSS implementation requires its own OAR2.

**Held pending:**
- Material styling OAR2

---

### DB Boundary

No DB mutation without a DB OAR2.

| Bounded Action | What It Requires |
|---|---|
| New encounter record seating | DB seating OAR2 |
| `measures_seat_offering` population | DB seating OAR2 |
| Cohort DB records | DB seating OAR2 |
| `lapis_interoperability_continuation` record | Future DB OAR2 |
| Email/subscription record tables | Future DB OAR2 |
| Social distribution record tables | Future DB OAR2 |

Existing DB records (encounter_keys seated as seeded or written) remain untouched.

No contract artifact authorizes DB mutation.

**Held pending:**
- DB seating OAR2 (for future surfaces)

---

## Governance Boundary

No circuit activation without operator confirmation.

| Bounded Action | What It Requires |
|---|---|
| C1 / C2 / C3 circuit activation | Operator confirmation + delivery contract |
| Cohort activation | Operator confirmation + delivery contract |
| Architecture contract modification | New OAR2 + operator confirmation |
| Boundary crossing | Seated contract + routed OAR2 |

## Boundary Enforcement Rule

Any implementation that crosses a boundary without a seated contract and a routed OAR2 is an architecture violation.

The following do not authorize boundary crossings:
- Urgency
- Frontend preference
- Delivery pressure
- Operator convenience
- Assumed equivalence between adjacency and implementation

## Close

Payment boundary: no activation without delivery contract.
Subscription boundary: no automation without subscription contract.
Email boundary: no sequences without email contract.
Social boundary: no automation without distribution contract.
Support boundary: no routing without support contract.
Runtime boundary: no implementation without runtime OAR2.
CSS boundary: no modification without material styling OAR2.
DB boundary: no mutation without DB OAR2.
Governance precedes activation.
Codex holds.
