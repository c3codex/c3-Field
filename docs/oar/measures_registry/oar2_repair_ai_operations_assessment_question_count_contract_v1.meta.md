---
document_type: oar2
authority_level: working
document_scope: assessment_runtime_repair
title: OAR2 — Repair AI Operations Assessment Question Count Contract
status: proposed
version: v1
operator: op044
system: measures_registry
surface: ai_operations_assessment
route: /ai-operations-assessment
---

# OAR2 — Repair AI Operations Assessment Question Count Contract v1

## OBJECTIVE

Repair the AI Operations Assessment held state caused by question count drift.

The assessment must render exactly 7 seated public questions.

Current runtime reports:

Expected 7 seated questions; found 8.

This OAR resolves the assessment contract mismatch.

---

## DB-FIRST RULE

Query DB state first.

Runtime is dependent on DB state.

No frontend fallback.

No hiding the error by changing expected count.

No rendering 8 questions.

No scoring mutation without DB authority.

Database authority wins.

---

## OBSERVED

Production route:

/ai-operations-assessment

currently shows:

Runtime Registry Held State

Assessment question contract is incomplete.

Expected 7 seated questions; found 8.

The public assessment is held because the registered public question body does not match the required seven-question AI Operations Assessment.

---

## ALIGNED

Active Measures Registry standing requires:

- 7 scored public questions
- public AI Operations Assessment
- scoring continuity preserved
- no stale eighth question
- no skewed results
- no frontend-owned assessment content

The assessment may only render when the DB-seated public question body contains exactly 7 active questions for the registered assessment.

---

## ROUTED

### 1. Inspect DB Assessment Records

Query the live assessment records for:

- assessment key / route key tied to `/ai-operations-assessment`
- active question records
- question order
- release/access state
- scoring weight / scoring map
- result mapping dependencies

Return all 8 current question records before mutation.

### 2. Identify Eighth Question Drift

Determine which question is not part of the canonical seven-question AI Operations Assessment.

Criteria:

- stale route residue
- duplicate question
- deprecated question
- non-public/internal question
- old eval carryover
- unmapped scoring dependency
- invalid order state

Do not guess.

Report exact question key, order, and reason.

### 3. Correct DB-Seated Question Body

Repair DB state so the active public assessment has exactly 7 active public questions.

Preferred repair:

- mark stale / extra question inactive or held
- preserve row for audit
- do not delete row unless DB policy explicitly requires deletion

Required preservation:

- append/update audit fields if available
- maintain OAR reference
- preserve historical trace

### 4. Verify Scoring Integrity

After repair, verify:

- exactly 7 active public questions
- question order is stable
- each question has valid options
- scoring weights still resolve
- result mapping still resolves
- no orphan scoring dependency remains from the held eighth question

### 5. Runtime Verification

Reload `/ai-operations-assessment`.

Accepted runtime:

- no Runtime Registry Held State message
- assessment renders
- progress shows 1 of 7
- all 7 questions reachable
- result generation still works
- no stale 8-question state remains

### 6. OAR1

Write:

docs/oar/measures_registry/oar1_repair_ai_operations_assessment_question_count_contract_v1.meta.md

Must include:

- pre-repair question list
- identified drift question
- DB mutation performed
- post-repair question count
- scoring verification
- runtime QA standing
- held items if any

---

## CODY ROLE

Cody may:

- query DB
- identify active assessment question records
- classify the eighth question
- update DB release/access/active state for stale question
- verify scoring dependencies
- verify runtime render
- write OAR1

Cody may not:

- change expected count from 7 to 8
- hardcode frontend override
- delete assessment history without authority
- invent new questions
- rewrite scoring logic unless required by DB evidence
- mutate MAP/payment/SEAT
- claim runtime success without QA evidence

---

## VALIDATION

Accepted when:

- `/ai-operations-assessment` renders public assessment
- active public question count equals 7
- no held-state error appears
- no stale eighth question participates in scoring
- scoring/result mapping remains valid
- OAR1 documents the exact repair

## CLOSE

The assessment is seven questions.

Repair the DB-seated question body.

Do not patch around it.
