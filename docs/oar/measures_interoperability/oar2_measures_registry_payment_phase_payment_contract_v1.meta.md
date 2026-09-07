---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry Payment / phase_payment Contract v1
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
  - payment
  - phase-payment
  - c3-map
  - commerce-circuit
  - commerce-trace
  - no-recognition
  - no-conversion-activation
source_alignment:
  - OAR1 — Measures Registry Commerce Trace Schema + Logging Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit Pricing + Conversion Credit Contract v1
  - OAR1 — Measures Registry c3 MAP Commerce Circuit + Scope Contract v1
  - OAR1 — Measures Registry Assessment Response Email Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Payment / phase_payment Contract v1

## OBSERVED

The following contract surfaces are closed:

- c3 MAP Commerce Circuit + Scope Contract
- Assessment Response Email Contract
- c3 MAP Pricing + Conversion Credit Contract
- Commerce Trace Schema + Logging Contract

Commerce trace is seated as `public.measures_commerce_trace`.

The completed commerce trace OAR1 confirms the commerce trace contract and schema are seated, with no payment, invoice, email, runtime, CSS, or activation change.

The pricing contract defines:

- C1 — Registration Circuit
  - Assessment: $3,333
  - Implementation floor: $11,111
  - Credit: $3,333
  - Balance: $7,778

- C2 — Governance Circuit
  - Assessment: $11,111
  - Implementation floor: $33,333
  - Credit: $11,111
  - Balance: $22,222

- C3 — Delivery Circuit
  - Assessment: $33,333
  - Implementation floor: $111,111
  - Credit: $33,333
  - Balance: $77,778

The commerce trace closeout carries forward payment processor integration, invoice generation, and `phase_payment` activation as future OAR2 surfaces.

## ALIGNED

This OAR2 defines the payment and `phase_payment` contract for paid c3 MAP Assessment entry.

Payment is not conversion.

Payment is not recognition.

Payment is not verified assessment standing.

Payment is not delivery contract standing.

Payment opens the selected c3 MAP Commerce Circuit only when trace-bound payment evidence is recorded.

## CORE RULE

Commerce trace first.

Payment second.

Invoice / processor only after trace.

Payment opens the circuit.

Conversion review completes the circuit.

## ROUTED

This OAR2 must define:

1. payment eligibility
2. invoice eligibility
3. provider boundary
4. payment evidence requirements
5. commerce trace update rules
6. `phase_payment` surface behavior
7. prohibited claims
8. held / failed / redacted behavior
9. validation requirements

## PAYMENT ELIGIBILITY

Payment may be offered only when:

- `assessment_completed = true`
- `assessment_response_ready = true`
- `c3_map_commerce_circuit_determined = true`
- `commerce_trace_key` exists
- `payment_status` in (`not_started`, `invoice_pending`)
- recipient / institution relation exists

Payment may not be offered from:

- partial assessment
- missing circuit determination
- missing commerce trace
- unreviewed AI output
- runtime availability alone
- email delivery alone
- manual price inference

## INVOICE ELIGIBILITY

Invoice may be generated only when:

- `commerce_trace_key` exists
- `c3_map_commerce_circuit` is C1 / C2 / C3
- `assessment_price` matches seated pricing contract
- `payment_status = invoice_pending`
- provider is configured
- recipient / institution relation exists

Invoice may not be generated if:

- commerce trace is missing
- assessment price is manually altered
- circuit determination is missing
- payment is already paid
- trace is held / redacted
- provider configuration is absent

## PROVIDER BOUNDARY

Payment provider may process payment and return evidence.

Provider does not become authority.

Allowed provider evidence:

- `provider`
- `provider_payment_id`
- `provider_invoice_id`
- `provider_status`
- `amount_received`
- `currency`
- `paid_at`
- `transaction_reference`

Provider secrets may not be stored in commerce trace.

## COMMERCE TRACE UPDATE RULES

When invoice is prepared:

- `payment_status = invoice_pending`
- `invoice_status = invoice_pending`

When invoice is issued:

- `payment_status = invoice_issued`
- `invoice_status = invoice_issued`
- `provider_invoice_id = returned provider invoice id`

When payment is pending:

- `payment_status = payment_pending`

When payment succeeds:

- `payment_status = paid`
- `credit_status = eligible`
- `metadata.payment_evidence` recorded

When payment fails:

- `payment_status = payment_failed`
- `metadata.provider_error` recorded

When held:

- `payment_status = held`
- `metadata.held_reason` recorded

When redacted:

- `payment_status = redacted`
- `credit_status = redacted`
- `conversion_status = redacted`

## phase_payment SURFACE

`phase_payment` is the payment encounter / runtime surface for entering the paid c3 MAP Assessment.

It may display:

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

## REQUIRED PAYMENT LANGUAGE

Example:

c3 MAP Commerce Circuit:
C2 — Governance Circuit

Paid c3 MAP Assessment:
$11,111

Implementation Contract Floor:
$33,333

Assessment Credit:
Your c3 MAP Assessment payment is creditable toward the corresponding implementation contract if your institution proceeds under a governed contract.

Payment opens the selected c3 MAP Commerce Circuit. It does not confer Measures Registry recognition, verification, certification, seal activation, delivery contract standing, implementation standing, or conversion status.

## PAYMENT BOUNDARY

Payment opens the c3 MAP Commerce Circuit.

Payment does not:

- complete the circuit
- complete c3 MAP
- complete conversion
- activate recognition
- activate verified assessment seal
- activate delivery contract standing
- activate implementation
- certify AI systems as safe or compliant

## CREDIT BOUNDARY

Credit becomes eligible only after:

- `payment_status = paid`
- assessment completed
- same institution / assessment relation remains bound
- commerce trace exists

Credit is applied only through a later governed implementation / conversion contract.

This OAR2 may make credit eligible.

It may not apply credit to a contract unless the contract exists and the later contract OAR2 authorizes it.

## HELD / FAILURE BEHAVIOR

If commerce trace is missing:

- hold payment
- do not invoice
- route to commerce trace correction

If provider fails:

- `payment_status = payment_failed`
- preserve provider error
- do not retry without logged retry route

If pricing mismatch appears:

- hold payment
- do not invoice
- route pricing contract correction

If institution relation is missing:

- hold payment
- do not invoice
- route recipient / institution correction

## NOT AUTHORIZED

This OAR2 does not authorize:

- conversion
- recognition
- verified assessment seal activation
- delivery contract activation
- implementation start
- credit application to contract
- public claim of paid standing without provider evidence
- manual override of payment status
- runtime / CSS changes beyond bounded `phase_payment` if separately executed

## VALIDATION REQUIREMENTS

Executor must confirm:

1. commerce trace exists before payment operation
2. pricing matches seated C1 / C2 / C3 contract
3. invoice generation reads commerce trace
4. provider secrets are not stored
5. payment evidence is trace-bound
6. paid status only follows provider evidence
7. `credit_status` may become eligible only after payment success
8. no conversion activated
9. no recognition activated
10. no seal activated
11. no delivery contract activated
12. no implementation started
13. no runtime / CSS modified unless explicitly routed in bounded payment surface execution
14. OAR1 written after validation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_payment_phase_payment_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when payment and `phase_payment` are contractually defined as trace-bound entry into paid c3 MAP Assessment, with invoice / payment evidence routed through commerce trace, and without activating recognition, seals, delivery contract standing, implementation, or conversion.

## CLOSE

Obsidian reads.

c3 MAP routes.

Commerce trace holds.

Payment opens.

Credit waits for contract.

Implementation waits.

Conversion waits for review.

Codex holds.
