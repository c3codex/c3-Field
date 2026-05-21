---
document_type: oar2
authority_level: working
document_scope: measures_ai_assessment_mechanics
title: OAR2 — Measures AI Assessment Mechanics + Answer Capture v1
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - measures-registry
  - assessment
  - evaluation
  - mechanics
  - answer-capture
  - governance
  - jsonb
source_alignment:
  - OAR1 - Frontend Token Replacement Alignment v1
  - OAR1 - Public Encounter Language Audit + Runtime Terminology Alignment v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures AI Assessment Mechanics + Answer Capture v1

## OBSERVED

The current Measures AI Assessment runtime successfully captures:

- institution identity
- contact identity
- eligibility placeholder state
- assessment submission envelope

Current capture table:

public.measures_iis_eval_gate1_capture

Validation query confirmed:

evaluation_answers = {}

This confirms:

- the assessment chamber runtime exists
- submission persistence exists
- diagnostic answer mechanics do not yet exist

Current state is:

- intake capture

without

- evaluative mechanics

The assessment currently cannot:

- interpret conditions
- derive environmental standing
- produce accurate governance exposure
- generate recommendation logic
- generate legitimate structured reports

because the answer layer is not yet being captured structurally.

## ALIGNED

Measures Registry assessment logic must become:

structured
deterministic
interpretable
governed

The assessment must not behave like:

- a generic intake form
- a freeform survey
- a cosmetic questionnaire
- a theatrical AI evaluator

The system must:

- capture structured answers
- preserve optional institutional context
- map answer selections to governance conditions
- establish deterministic interpretation pathways

The assessment engine should derive:

- environmental standing
- governance exposure
- operational drift conditions
- recommendation routes

from:

submitted institutional conditions

not arbitrary AI inference.

## ROUTED

### 1. Define structured answer mechanics

Replace open-ended evaluation behavior with structured answer options.

Each assessment question should support:

- question_key
- structured answer selection
- optional institutional context field

Pattern:

Question
→ structured selection
→ optional institutional context

Example:

Do you maintain formal AI governance oversight?

○ Formal organization-wide oversight
○ Partial or department-specific oversight
○ Informal oversight only
○ No defined oversight
○ Unknown

Additional Institutional Context (optional)

### 2. Capture structured answer payloads into JSONB

Frontend runtime must persist selected answer structures into:

public.measures_iis_eval_gate1_capture.evaluation_answers

Expected shape:

{
  "authority_structure": {
    "selected": "partial_department_specific",
    "label": "Partial — department or team specific",
    "institutional_context": "Optional typed detail"
  },
  "validation_practice": {
    "selected": "informal_only",
    "label": "Informal — handled case by case",
    "institutional_context": ""
  }
}

### 3. Preserve institutional nuance

Do not remove freeform institutional explanation entirely.

Optional context fields should remain available beneath structured selections.

This preserves:

- institutional specificity
- implementation nuance
- operational detail

without sacrificing:

- deterministic interpretation
- governance mapping
- report consistency

### 4. Prepare deterministic condition mapping

Prepare a mechanics foundation for future interpretation routing.

This OAR2 does not yet require full risk/report generation.

However, answer selections should now become structurally mappable to future:

- governance conditions
- operational exposure
- environmental standing
- recommendation routes

### 5. Preserve bounded interpretation model

The assessment system must remain:

- explainable
- deterministic
- traceable
- structurally defensible

The system may identify:

- governance absence
- fragmented oversight
- validation inconsistency
- operational drift exposure
- authority ambiguity
- escalation without review structure

The system may not:

- invent legal/compliance claims
- fabricate AI danger scores
- generate theatrical AI predictions
- imply certification or legal standing

### 6. Maintain current chamber flow

Do not restructure:

- LEFT path sequencing
- intro flow
- assessment chamber routing
- media progression
- Structured Environment route
- eligibility capture
- identity capture

This OAR2 governs:

- mechanics foundation
- answer capture
- deterministic structure

only.

### 7. Validate populated answer persistence

OAR1 must confirm:

- non-empty evaluation_answers
- successful structured answer persistence
- valid JSONB structure
- successful frontend submission
- no regression in identity capture
- no regression in eligibility state

Include sample redacted payload structure in validation.

## CODY ROLE

Cody may:

- implement structured answer UI
- persist structured answer payloads
- preserve optional institutional context
- validate JSONB persistence
- preserve existing chamber flow
- write OAR1 closeout

Cody may not:

- invent AI scoring systems
- fabricate risk outputs
- implement uncontrolled interpretation logic
- generate fake governance grades
- alter DB authority structures outside routed scope
- restructure Measures Registry runtime flow

## VALIDATION

This OAR2 resolves successfully when:

- structured answers replace open-ended-only behavior
- answer payloads persist into JSONB
- optional institutional context remains available
- assessment submissions become structurally interpretable
- deterministic mechanics foundation exists
- identity capture remains stable
- frontend/runtime flow remains coherent

## EXPECTED OAR1

docs/oar/measures_registry/oar1_measures_ai_assessment_mechanics_answer_capture_v1.meta.md

## CLOSE

An assessment becomes legitimate when:
answers materially affect interpretation.
