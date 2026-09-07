---
document_type: oar1
authority_level: working
document_scope: measures_registry_obsidian_chamber
title: OAR1 — Seat Obsidian SRC/OAR1 Eval Email and Marble Carryover Contracts
status: migration_ready
version: v1
operator: op044
system: measures_registry
executor: claude_compatible_executor
source_oar2: docs/oar/measures_registry/oar2_seat_obsidian_src_oar1_eval_email_and_marble_carryover_contracts_v1.meta.md
tags:
  - oar1
  - measures-registry
  - obsidian-chamber
  - ai-operations-assessment
  - src
  - oar1
  - evaluation-results
  - email-contract
  - marble-governance
  - carryover
---

# OAR1 — Seat Obsidian SRC/OAR1 Eval Email and Marble Carryover Contracts v1

## OBJECTIVE

Seat the missing Obsidian Chamber governance contracts so the confirmed sequence becomes governed and traceable:

assessment_completed
→ contact_captured
→ src_opened
→ oar1_recorded
→ eval_result_delivered
→ initial_eval_email_triggered
→ followup_sequence_registered
→ marble_carryover_prepared

Register the following contract keys in the concordance system:

- obsidian_contact_src_capture_contract
- obsidian_oar1_assessment_intake_contract
- obsidian_eval_result_content_contract
- obsidian_initial_eval_email_contract
- obsidian_governed_followup_email_contract
- obsidian_marble_governance_carryover_contract

Create the supporting runtime tables without modifying existing assessment runtime, contact form, or assessment scoring.

---

## ACTION

### Migration prepared

Migration file:

    supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql

Tables created by migration:

| Table | Purpose |
|---|---|
| obsidian_src_continuity | SRC/SRC1 continuity record opened after contact capture |
| obsidian_eval_result_def | Seeded evaluation result definitions — 4 bands |
| obsidian_oar1_record | OAR1 intake record per contact |
| obsidian_email_contract_def | Seeded email contract definitions — initial + 3 followups |
| obsidian_email_sequence_instance | Per-contact email sequence tracking |
| obsidian_marble_carryover | Per-contact Marble Governance carryover payload |

Seeded by migration:

- 4 evaluation result bands (eval_result_01 through eval_result_04) seeded into obsidian_eval_result_def
- 4 email contract definitions (initial + 3 followups) seeded into obsidian_email_contract_def

Severity precedence rule implemented in table data:

    if conditions_identified >= 4 → eval_result_04 (Structural Drift)
    else if conditions_identified >= 3 → eval_result_03 (Environmental Instability)
    else if conditions_identified >= 2 → eval_result_02 (Environmental Fragmentation)
    else → eval_result_01 (Foundational Leadership Invitation)

RLS applied: service_role write for runtime tables, public read for seeded lookup tables.

---

### Contract seating prepared

Contract seating file:

    docs/oar/measures_registry/obsidian_contract_seating_v1.sql

Six concordance_document records seated:

1. obsidian_contact_src_capture_contract
   - Governs SRC/SRC1 continuity intake after contact capture
   - Standing boundary: contact_eval_continuity_opened only
   - Not SEAT, not MAP, not certification, not payment

2. obsidian_oar1_assessment_intake_contract
   - Governs OAR1 recording after SRC/SRC1 continuity opens
   - Required fields: assessment_completion_key, evaluation_result_key, src_key, env_key, contact_email, email_sequence_key, marble_carryover_key
   - Required body: objective / action / result

3. obsidian_eval_result_content_contract
   - Governs evaluation result determination by condition count
   - Four result bands seeded with top 3 critical gaps, likely AI drift behaviors, and prepared path statement
   - Approved close: "A structured environmental alignment path has been prepared for your review."
   - Prohibited: Continue to governed pathway, View your circuit, Start MAP, Buy MAP, Begin certification, Register now

4. obsidian_initial_eval_email_contract
   - Governs initial evaluation email delivery
   - Trigger: contact_captured + evaluation_result_key exists
   - Required fields: institution_name, contact_name, evaluation_result_title, summary_finding, top_3_critical_gaps, likely_ai_drift_behaviors, answer_derived_explanation, prepared_path_statement, review_path_link_or_token, envKey
   - Prohibited: C1/C2/C3, Direct/Mapped/Federated, MAP pricing, SEAT status, Registry Certification, Registered, Redacted, payment, wallet, c3 Key, permission standing

5. obsidian_governed_followup_email_contract
   - Governs 3 governed follow-up email definitions
   - Followup keys: obsidian_eval_followup_01_structural_risk, obsidian_eval_followup_02_alignment_path, obsidian_eval_followup_03_review_prepared_path
   - Non-reveal boundary preserved across all followups

6. obsidian_marble_governance_carryover_contract
   - Governs Marble carryover payload preparation and hold
   - Default state: held_until_marble_governance_passage
   - Reveal conditions: marble_governance_passage_entered = true AND evaluation_result_key exists AND src_key exists AND oar1_key exists AND hidden_marble_payload_key exists
   - Obsidian prepares payload; Marble Governance Chamber reveals only after valid passage

Each contract seated as concordance_document + concordance_version + concordance_relation.

seeded_source_snapshot record prepared for OAR2 source document.

---

### Validation SQL prepared

Validation file:

    docs/oar/measures_registry/obsidian_contract_seating_validation_v1.sql

Eleven validation checks defined:

1. All 6 new tables exist
2. Four evaluation result bands seeded with correct prepared_path_statement
3. Severity precedence logic verified at 1 / 2 / 3 / 4 conditions
4. Four email contract definitions seeded in sequence order
5. No prohibited content in email contract definitions
6. Six concordance contracts seated — all active
7. Concordance relations exist for all 6 contracts
8. Marble carryover default state is held
9. SRC continuity standing constraint is set
10. Existing assessment/contact form tables are unmodified
11. RLS policies exist on all runtime tables

---

## RESULT

Migration file ready for operator execution:

    supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql

Contract seating file ready for operator execution:

    docs/oar/measures_registry/obsidian_contract_seating_v1.sql

Validation file ready for operator review:

    docs/oar/measures_registry/obsidian_contract_seating_validation_v1.sql

---

## EXECUTION ORDER

Operator executes in this order through Supabase SQL Editor, CLI, or psql:

1. Run migration:
   supabase/migrations/202606080001_obsidian_src_oar1_eval_email_marble_contracts.sql

2. Run contract seating:
   docs/oar/measures_registry/obsidian_contract_seating_v1.sql

3. Run validation:
   docs/oar/measures_registry/obsidian_contract_seating_validation_v1.sql
   Review all 11 checks. All must return expected values.

4. Return query output for Claude review if needed.

---

## BOUNDARY CONFIRMATIONS

Assessment runtime: unchanged. No assessment questions, answer options, scoring triggers, or UI modified.

Contact form: unchanged. No contact form fields, layout, placement, or runtime behavior modified.

Commerce boundary: preserved. No MAP pricing, SEAT status, Registry Certification, Registered, Redacted, payment, wallet, c3 Key, or permission standing created or exposed.

Marble circuit: held. Commerce reveal state remains held_until_marble_governance_passage until Marble Governance Chamber passage conditions are satisfied.

SRC/SRC1 standing: contact_eval_continuity_opened only. Not SEAT. Not MAP enrollment. Not Registry Certification. Not Registered standing. Not payment standing.

---

## ACTIVE DISTINCTIONS PRESERVED

- Assessment ≠ MAP
- MAP ≠ SEAT Verification
- SEAT Verification ≠ Registry Certification
- Payment ≠ Permission
- c3 Key ≠ Conversion
- Governed Commerce ≠ public copy

---

## CLOSE

Obsidian Chamber completes:

- assessment
- contact/SRC capture (SRC/SRC1 = contact_eval_continuity_opened)
- OAR1 intake recording
- evaluation result delivery (4 governed bands)
- initial evaluation email
- governed follow-up email sequence
- Marble Governance carryover (held until passage)

Marble Governance Chamber receives:

- prepared path statement
- hidden marble payload key
- governed reveal conditions

Operator executes SQL. Claude prepared migration, seating, and validation within tool authority. Claude does not claim SQL execution.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Claude executed within tool authority.
