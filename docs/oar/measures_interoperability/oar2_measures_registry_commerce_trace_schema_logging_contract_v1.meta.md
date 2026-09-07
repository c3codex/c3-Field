---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry Commerce Trace Schema + Logging Contract v1
status: completed
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
  - commerce-trace
  - c3-map
  - commerce-circuit
  - pricing
  - conversion-credit
  - logging-contract
  - no-payment-activation
source_alignment:
  - OAR1 — Measures Registry c3 MAP Commerce Circuit Pricing + Conversion Credit Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit + Scope Contract v1
  - OAR1 — Measures Registry Assessment Response Email Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Commerce Trace Schema + Logging Contract v1

## OBSERVED

The c3 MAP Commerce Circuit Pricing + Conversion Credit Contract is seated.

It confirms C1 / C2 / C3 assessment prices, implementation floors, assessment credits, and the condition that credit must be logged in the commerce trace.

No payment processor activation occurred.

No invoice generation occurred.

No runtime modification occurred.

No CSS modification occurred.

No DB mutation occurred.

No seal, badge, delivery, recognition, payment, or conversion activation occurred.

The next required contract is commerce trace.

Commerce trace must be defined before payment processor or invoice routing.

## ALIGNED

Commerce trace records the governed standing of paid c3 MAP Assessment entry, credit eligibility, implementation / conversion contract relation, and payment evidence.

Commerce trace is not payment.

Commerce trace is not recognition.

Commerce trace is not conversion.

Commerce trace is not delivery contract activation.

Commerce trace is the evidence path that lets later payment and credit actions be governed.

## CORE RULE

No money moves without trace.

No credit applies without trace.

No implementation standing exists without governed contract.

No conversion standing exists without conversion review.

## ROUTED

This OAR2 defines the schema and logging requirements for Measures Registry commerce trace.

It must support trace for:

1. c3 MAP Commerce Circuit determination
2. c3 MAP Assessment price offered
3. implementation / conversion contract floor
4. assessment credit amount
5. balance if proceeding
6. payment state
7. invoice state
8. provider evidence
9. credit eligibility
10. credit application
11. implementation / conversion contract relation
12. held / redacted / failed / closed states

This OAR2 may define contract and schema requirements.

If executor seats schema, executor must first inspect live database standing and produce schema-safe SQL.

If schema is not ready, executor must return schema-safe hold with observed table state and proposed route.

## COMMERCE TRACE STATES

Commerce trace may move through:

- `determined`
- `offered`
- `invoice_pending`
- `invoice_issued`
- `payment_pending`
- `paid`
- `payment_failed`
- `assessment_in_progress`
- `assessment_completed`
- `credit_eligible`
- `contract_offered`
- `contract_accepted`
- `credit_applied`
- `in_conversion_review`
- `converted`
- `held`
- `redacted`
- `closed`

## REQUIRED TRACE FIELDS

Minimum required trace fields:

- `commerce_trace_key`
- `assessment_key` or `capture_id`
- `institution_key`
- `institution_name`
- `contact_email`
- `c3_map_commerce_circuit`
- `assessment_price`
- `implementation_contract_floor`
- `assessment_credit_amount`
- `balance_if_proceeding`
- `payment_status`
- `invoice_status`
- `provider`
- `provider_payment_id`
- `provider_invoice_id`
- `credit_status`
- `contract_key`
- `conversion_status`
- `operator_key` or `system_key`
- `source_oar2`
- `metadata`
- `created_at`
- `updated_at`

## RECOMMENDED TABLE

Preferred table name, if no valid table already exists:

`public.measures_commerce_trace`

Required behavior:

- append-safe trace
- no provider secret storage
- no credit application without contract relation
- no payment completion without provider evidence
- no conversion completion without conversion review
- no recognition or seal activation from commerce trace alone

## REQUIRED ENUM / CHECK VALUES

### c3 MAP Commerce Circuit

Allowed values:

- `C1`
- `C2`
- `C3`

### payment_status

Allowed values:

- `not_started`
- `invoice_pending`
- `invoice_issued`
- `payment_pending`
- `paid`
- `payment_failed`
- `refunded`
- `held`
- `redacted`

### credit_status

Allowed values:

- `not_eligible`
- `eligible`
- `pending_contract`
- `applied`
- `expired`
- `held`
- `redacted`

### conversion_status

Allowed values:

- `not_started`
- `contract_offered`
- `contract_accepted`
- `in_conversion_review`
- `converted`
- `held`
- `redacted`
- `closed`

## PRICING REFERENCE

Commerce trace must preserve the seated pricing contract:

| c3 MAP Commerce Circuit | Paid c3 MAP Assessment | Implementation / Conversion Contract Floor | Assessment Credit | Balance if Proceeding |
|---|---:|---:|---:|---:|
| C1 — Registration Circuit | $3,333 | $11,111 | $3,333 | $7,778 |
| C2 — Governance Circuit | $11,111 | $33,333 | $11,111 | $22,222 |
| C3 — Delivery Circuit | $33,333 | $111,111 | $33,333 | $77,778 |

## CREDIT RULE

Assessment credit applies only when:

1. c3 MAP Assessment payment is confirmed
2. c3 MAP Assessment is completed
3. institution proceeds into the corresponding governed implementation / conversion contract
4. contract is accepted and executed within the allowed term
5. same institution / assessment key / account relation is bound
6. credit is logged in commerce trace

## CREDIT DOES NOT MEAN

Credit does not mean:

- refund
- automatic discount without contract
- automatic conversion
- automatic implementation start
- automatic recognition
- verified assessment seal activation
- delivery contract activation
- payment completion for later contract

## PROVIDER BOUNDARY

Payment provider may provide evidence.

Provider does not become authority.

Provider data may include:

- provider name
- provider payment id
- provider invoice id
- payment timestamp
- provider status
- amount received
- currency
- transaction reference

Provider secrets may not be stored in commerce trace.

## INVOICE BOUNDARY

Invoice generation is not authorized by this OAR2.

Future invoice OAR2 must read commerce trace and create an invoice only after trace state permits it.

Invoice does not confer:

- recognition
- conversion
- seal activation
- delivery contract standing
- c3 MAP completion

## PAYMENT BOUNDARY

Payment opens the c3 MAP Commerce Circuit.

Payment does not complete the circuit.

Payment does not complete conversion.

Payment does not activate recognition.

Payment does not activate verified assessment seal.

Payment does not activate delivery contract standing.

## IMPLEMENTATION / CONVERSION BOUNDARY

Implementation begins only through a separate governed implementation / conversion contract.

Commerce trace may link to the contract.

Commerce trace does not authorize implementation by itself.

Conversion review completes the circuit.

## REQUIRED VALIDATION

Executor must confirm:

1. live database standing inspected before schema mutation
2. schema-safe SQL artifact produced if table is seated
3. commerce trace table or contract can hold required fields
4. C1 / C2 / C3 remain Commerce Circuits, not readiness phases
5. pricing matches seated pricing contract
6. credit rules match seated pricing contract
7. no payment processor activated
8. no invoice generated
9. no email sent
10. no runtime modified
11. no CSS modified
12. no seal, badge, delivery, recognition, payment, or conversion activation
13. no provider secrets stored
14. OAR1 written after validation

## REQUIRED SQL ARTIFACT

If schema seating is routed, executor must produce:

`docs/oar/measures_interoperability/sql/seat_measures_registry_commerce_trace_schema_v1.sql`

If schema seating is not safe, executor must return:

- observed schema state
- missing table / field condition
- proposed correction route
- no mutation claim

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_commerce_trace_schema_logging_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when Measures Registry has a governed commerce trace contract, and if schema-safe, a commerce trace table or equivalent logging surface is seated to record c3 MAP Commerce Circuit pricing, payment standing, credit eligibility, implementation / conversion contract relation, and provider evidence without activating payment, invoice, recognition, seal, delivery, runtime, CSS, or conversion.

## CLOSE

Pricing is seated.

Trace comes next.

Payment waits.

Invoice waits.

Credit waits.

Implementation waits for contract.

Conversion waits for review.

Codex holds.
