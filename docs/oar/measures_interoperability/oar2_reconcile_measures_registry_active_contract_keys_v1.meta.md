---
document_type: oar2
authority_level: working
document_scope: measures_registry_active_contract_keys
title: OAR2 — Reconcile Measures Registry Active Contract Keys
status: proposed
version: v1
operator: op044
system: measures_registry
session_scope: measures_interoperability
working_folder: docs/oar/measures_interoperability/
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-interoperability
  - measures-registry
  - active-contract-keys
  - deprecation
  - assessment
  - src-binding
  - c3-map
  - governed-commerce
  - payment-confirmation
  - runtime-blocker
source_alignment:
  - OAR1 Finalize Measures Registry Governed Layout
  - OAR1 Seat Measures Registry Chamber Material and Style Contracts
  - Measures Registry Operative Concordance Update
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Reconcile Measures Registry Active Contract Keys v1

## OBSERVED

Measures Registry has seated:

- governed layout metadata
- chamber contracts
- material contracts
- style contracts
- passage contracts
- tone sequences
- MAP circuit relation

The chamber/material/style OAR1 confirms these were aligned onto existing public.measures_encounter_def rows only.

Those existing rows include legacy terms that are no longer correct active architecture language:

- structure_passage
- reserve_seat
- evaluate_structure_path
- phase_payment
- connect_src
- measures_phases_reveal

These row keys acted as carriers during scoped DB metadata alignment, but they must not remain semantically active.

The corrected active chain is:

assess_environment_passage
-> measures_assessment_contract
-> assessment_result_contract
-> commerce_circuit_recommendation_contract
-> c3_map_continuation_contract
-> governed_commerce_passage
-> c3_key_or_temp_key_identity_route
-> payment_confirmation_sequence
-> c3_map_runtime_audit_contract

Runtime final pass must remain blocked until the active contract keys are reconciled and the legacy terms are deprecated from active meaning.

## ALIGNED

Seed Concordance requires terms to be defined, bound, linked, singular, non-redundant, non-drifting, and system-valid.

The 21 of Coherence requires native distinction and role integrity.

Therefore:

- Legacy carrier keys may remain as technical DB rows only.
- Legacy carrier terms may not remain active architecture language.
- Active contract keys must define what renderer reads.
- Runtime may not infer meaning from legacy row names.
- Payment confirmation comes before c3 MAP runtime audit.
- Conversion verification remains later and held.

## ROUTED

### 1. Deprecate legacy carrier terms from active semantic use

Deprecate the following terms from active architecture, renderer, route, chamber, passage, assessment, payment, key, conversion, or certification meaning:

- structure_passage
- reserve_seat
- evaluate_structure_path
- phase_payment
- connect_src
- measures_phases_reveal

They may remain only as:

- legacy_db_row_key
- historical_oar_reference
- audit_trace
- migration_carrier

They may not be reused as:

- active contract key
- public label
- route meaning
- chamber identity
- passage identity
- payment surface
- SRC binding surface
- c3 MAP surface
- conversion/certification surface
- renderer state

### 2. Seat active contract key chain

The active Measures Registry contract chain is:

- assess_environment_passage
- measures_assessment_contract
- assessment_result_contract
- commerce_circuit_recommendation_contract
- c3_map_continuation_contract
- governed_commerce_passage
- c3_key_or_temp_key_identity_route
- payment_confirmation_sequence
- c3_map_runtime_audit_contract

These keys become the semantic surfaces that renderer and runtime contracts must read.

### 3. Define assess_environment_passage

active_key: assess_environment_passage
type: passage
public_label: Assess the Environment
role: media/orientation/entry passage
resolves_to: measures_assessment_contract

Function:

- introduces the assessment path
- carries media/copy/orientation
- routes into the assessment contract
- does not score
- does not bind SRC by itself
- does not recommend commerce circuit by itself

Distinction:

assess_environment_passage is not measures_assessment_contract.

### 4. Define measures_assessment_contract

active_key: measures_assessment_contract
type: assessment_contract
role: SRC/eval-bound scored assessment
resolves_to: assessment_result_contract

Function:

- binds SRC/eval standing
- captures contact name
- captures institution name
- captures email
- captures business or institutional type
- presents 7 scored questions
- calculates baseline score
- identifies structural deficiency awareness
- determines recommended C1 / C2 / C3 commerce circuit

Required fields:

- contact_name
- institution_name
- email
- business_or_institution_type
- assessment_answers
- baseline_score
- recommended_circuit

Distinction:

measures_assessment_contract is not:

- c3 MAP
- payment
- conversion
- certification

### 5. Define assessment_result_contract

active_key: assessment_result_contract
type: result_contract
role: baseline result + deficiency awareness
resolves_to: commerce_circuit_recommendation_contract

Function:

- displays scored assessment result
- names baseline standing
- raises awareness of structural deficiencies
- explains recommendation without claiming conversion

Public-safe result copy:

Your assessment identifies a recommended c3 MAP circuit for governed continuation.

### 6. Define commerce_circuit_recommendation_contract

active_key: commerce_circuit_recommendation_contract
type: recommendation_contract
role: C1 / C2 / C3 recommendation only
resolves_to: c3_map_continuation_contract

Function:

- recommends C1, C2, or C3
- does not expose pricing
- does not activate payment
- does not issue c3 Key
- does not bind SRC continuation automatically

Rule:

Assessment recommends.
c3 MAP audits.
Governed Commerce handles private commerce.

### 7. Define c3_map_continuation_contract

active_key: c3_map_continuation_contract
type: governed_continuation_contract
role: continuation toward c3 MAP runtime audit
resolves_to: governed_commerce_passage

Function:

- receives C1 / C2 / C3 recommendation
- routes institution toward governed continuation
- does not begin runtime audit before governed commerce/payment confirmation
- preserves c3 MAP as the runtime audit after valid governed conditions

Distinction:

c3 MAP continuation is not:

- baseline assessment
- payment confirmation
- Measures Conversion
- Registry Certification

### 8. Define governed_commerce_passage

active_key: governed_commerce_passage
type: private_control_passage
role: pricing/payment/key/SRC control
resolves_to: c3_key_or_temp_key_identity_route

Function:

- remains hidden/private
- handles pricing route when governed
- handles payment route when governed
- handles wallet connect or temporary payment provider
- handles SRC continuation conditions

Default states:

- pricing_state: governed_hidden
- payment_state: held
- wallet_connection_state: held
- temp_payment_provider_state: held
- SRC_binding_state: held
- permission_state: held
- recognition_state: held
- conversion_state: held
- certification_state: held

### 9. Define c3_key_or_temp_key_identity_route

active_key: c3_key_or_temp_key_identity_route
type: identity_route
role: governed identity/access continuity
resolves_to: payment_confirmation_sequence

Supported routes:

- wallet connect -> wallet-bound c3 Key
- temp c3 Key -> later wallet reconciliation

Distinction:

- c3 Key is not conversion
- temp c3 Key is not full standing
- wallet connect is not recognition
- payment is not permission

### 10. Define payment_confirmation_sequence

active_key: payment_confirmation_sequence
type: payment_confirmation_sequence
role: governed payment confirmation before c3 MAP runtime audit
resolves_to: c3_map_runtime_audit_contract

Function:

- confirms governed payment route status
- confirms selected C1 / C2 / C3 commerce circuit
- confirms wallet payment or temp payment provider state
- confirms c3 Key or temp c3 Key continuity state
- confirms SRC continuation eligibility where applicable
- routes to c3 MAP runtime audit only after valid governed conditions are satisfied

Distinction:

payment confirmation is not:

- permission
- recognition
- Measures Conversion
- Registry Certification
- DAO standing
- distribution standing

### 11. Define c3_map_runtime_audit_contract

active_key: c3_map_runtime_audit_contract
type: governed_runtime_audit_contract
role: c3 MAP audit and governed implementation route
resolves_to: conversion_readiness_contract

Function:

- audits institutional runtime environment
- identifies structural drift
- records governed findings
- delivers action requirements
- routes governed implementation
- prepares conversion readiness

Distinction:

c3 MAP runtime audit is not:

- assessment baseline
- payment confirmation
- Measures Conversion
- Registry Certification

### 12. Hold downstream conversion/certification contracts

The following downstream contracts remain held unless separately seated:

- conversion_readiness_contract
- measures_conversion_verification_contract
- registry_certification_eligibility_contract

Required later sequence:

c3 MAP runtime audit
-> governed implementation
-> conversion readiness
-> Measures Conversion
-> verification
-> Registry Certification

These are not activated by this OAR2.

### 13. Renderer rule

Renderer must read active contract keys, not legacy carrier terms.

Renderer may read:

- active_contract_key
- public_label
- contract_type
- resolves_to
- held_states
- renderer_rule
- source_oar2

Renderer may not read legacy row names as semantic truth.

### 14. Runtime blocker

Runtime final pass remains blocked until this reconciliation OAR1 exists and validates:

- legacy terms deprecated
- active contract key chain seated
- renderer rule points to active contract keys
- no legacy carrier row names render as active meaning
- payment_confirmation_sequence precedes c3_map_runtime_audit_contract

## CODY ROLE

Cody may:

- mark legacy carrier terms deprecated from active semantic use
- seat active contract key chain in scoped metadata
- update governed_layout_contract / chamber_contract metadata to reference active keys
- preserve legacy row keys only as audit/migration carriers
- validate runtime cannot read legacy terms as active meaning
- produce OAR1 after execution

Cody may not:

- delete DB rows
- create DB terminology/tag authority
- begin runtime final pass
- expose material naming publicly
- activate payment/c3 Key/SRC/permission/recognition/conversion/certification
- treat metadata carriers as active semantic terms
- mutate Seed Concordance
- mutate The 21 of Coherence
- deploy
- skip OAR1

## VALIDATION

This OAR2 resolves successfully when:

1. Legacy carrier terms are deprecated from active semantic use.
2. Legacy row keys remain only as audit/migration carriers.
3. assess_environment_passage is seated as passage/media/orientation surface.
4. measures_assessment_contract is seated as SRC/eval/contact/7-question scored assessment contract.
5. assessment_result_contract is seated.
6. commerce_circuit_recommendation_contract is seated.
7. c3_map_continuation_contract is seated.
8. governed_commerce_passage is seated as private/held.
9. c3_key_or_temp_key_identity_route is seated as governed/provisional identity route.
10. payment_confirmation_sequence is seated before c3_map_runtime_audit_contract.
11. c3_map_runtime_audit_contract is seated as governed runtime audit.
12. Downstream conversion/certification contracts remain held.
13. Renderer rules point to active contract keys, not legacy carrier names.
14. No DB terminology/tag authority is created.
15. No payment/c3 Key/SRC/permission/recognition/conversion/certification/DAO/distribution standing is activated.
16. Runtime final pass remains blocked.
17. OAR1 is produced after execution.

## EXPECTED OAR1

docs/oar/measures_interoperability/oar1_reconcile_measures_registry_active_contract_keys_v1.meta.md

## CLOSE

Legacy terms do not get to haunt runtime.

Carrier rows may remain.
Carrier language may not govern.

Payment confirmation comes before c3 MAP runtime audit.
Conversion verification comes later.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes from OAR2 only.
src renders seated state only.
