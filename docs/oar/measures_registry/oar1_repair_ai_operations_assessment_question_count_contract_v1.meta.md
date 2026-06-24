---
document_type: oar1
authority_level: evidence
document_scope: assessment_runtime_repair
title: OAR1 — Repair AI Operations Assessment Question Count Contract
status: completed_with_rendered_runtime_qa_held
version: v1
operator: op044
system: measures_registry
surface: ai_operations_assessment
route: /ai-operations-assessment
executed_at: 2026-06-24
source_oar2: docs/oar/measures_registry/oar2_repair_ai_operations_assessment_question_count_contract_v1.meta.md
---

# OAR1 — Repair AI Operations Assessment Question Count Contract v1

## Outcome

The live DB-seated assessment contract was repaired from 8 active array entries to the canonical 7-question sequence.

The runtime expected count was not changed. No frontend fallback, hardcoded question, route mutation, scoring rewrite, row deletion, or MAP/payment/SEAT mutation was performed.

## Pre-repair DB evidence

The live `measures_encounter_def` record `measures_assessment` was active and contained:

- `assessment_mechanics.required_question_count`: `8`
- contact-capture payload `question_count`: `8`
- active question array count: `8`

| Order | Question key | Option count | Classification |
| ---: | --- | ---: | --- |
| 1 | `ai_deployment_status` | 4 | canonical context question |
| 2 | `ai_deployment_status` | 4 | exact duplicate of order 1 |
| 3 | `active_ai_system_visibility` | 3 | canonical scored question |
| 4 | `failure_traceability` | 3 | canonical scored question |
| 5 | `persistent_review_standard` | 3 | canonical scored question |
| 6 | `safe_ai_acceleration_capacity` | 3 | canonical scored question |
| 7 | `role_authority_boundary` | 3 | canonical scored question |
| 8 | `implementation_boundary` | 3 | canonical scored question |

## Drift identification

The held eighth entry was not a distinct assessment question. Order 2 was a complete duplicate of order 1:

- question key: `ai_deployment_status`
- question: `What is your organization's current AI deployment status?`
- context label, context statement, reference statement, four options, option values, and condition tags: exact match
- reason: the later sequence-restoration migration prepended `ai_deployment_status` to an array that already contained the canonical context question

The duplicate added no unique option, condition tag, scoring weight, or result dependency. The canonical contract is one context question followed by six scored operational questions.

## DB mutation

One existing `measures_encounter_def` row was updated in place:

- removed only the second `ai_deployment_status` occurrence from the active `assessment_mechanics.questions` array
- set `assessment_mechanics.required_question_count` to `7`
- set the contact-capture OAR1 payload action `question_count` to `7`
- appended `assessment_mechanics.question_count_contract_repair_v1`
- preserved the removed duplicate's complete question and option object in `preserved_duplicate_snapshot`
- recorded before/after counts, original order, canonical keys, repair action, date, and source OAR2

No DB row was deleted. Historical trace remains seated in the assessment metadata.

## Post-repair DB verification

Immediate privileged readback returned:

| Order | Question key | Option count |
| ---: | --- | ---: |
| 1 | `ai_deployment_status` | 4 |
| 2 | `active_ai_system_visibility` | 3 |
| 3 | `failure_traceability` | 3 |
| 4 | `persistent_review_standard` | 3 |
| 5 | `safe_ai_acceleration_capacity` | 3 |
| 6 | `role_authority_boundary` | 3 |
| 7 | `implementation_boundary` | 3 |

Verified values:

- active question array count: `7`
- required question count: `7`
- submission payload question count: `7`
- encounter active: `true`
- active contracts preserved: `measures_assessment_contract`, `assessment_result_contract`, `commerce_circuit_recommendation_contract`
- every question has a non-empty options array

## Scoring and result verification

- The retained order-1 context question produces every condition tag formerly produced by its duplicate; removal creates no duplicate-specific orphan dependency.
- All six scored operational questions remain present and ordered.
- The four scoring thresholds remain continuous and unchanged: `0`, `1–33`, `34–66`, `67–100`.
- Standing-rule count remains `4`.
- Fallback standing remains `early_structural_drift`.
- The email artifact template remains present.
- No scoring or result mapping was rewritten.

Two standing-rule references, `review_pathway_absent` and `review_pathway_present`, were already orphaned by an earlier removal of the stale `ai_output_review_pathway` question. They are not dependencies of the duplicate repaired here and were left held for separate governed correction rather than expanding this OAR.

## Runtime and deployment standing

- Public route network check: `https://www.measuresregistry.com/ai-operations-assessment` returned `308` to its trailing-slash canonical URL, which returned HTTP `200`.
- DB authority is live; this repair requires no source build or Git deployment trigger.
- Rendered production QA is held because the in-app Browser connection could not initialize in this thread.
- Therefore the absence of the held-state message, visible `1 of 7` progress, traversal of all seven questions, and result generation were not visually certified here.

## Held items

1. Operator/browser QA of the rendered production assessment:
   - no `Runtime Registry Held State`
   - progress begins at `1 of 7`
   - all seven questions are reachable
   - result generation completes
2. The two pre-existing orphan `review_pathway_*` standing-rule references require a separately authorized scoring-contract review if they are to be removed or remapped.

## Resume verification — 2026-06-24

- The saved OAR2 and this sibling OAR1 were re-opened as execution authority.
- Rendered production QA was retried; the in-app Browser connection remained unavailable.
- A fresh privileged DB readback was prepared but could not execute because the environment's external-execution allowance was exhausted.
- No repeat mutation was attempted. The successful post-repair readback documented above remains the latest verified DB evidence.
- No source, route, scoring, MAP, payment, or SEAT state was changed during this resume attempt.

## Close

The DB-seated active question body is exactly seven questions, the duplicate is excluded from runtime participation and preserved for audit, and scoring/result contracts were left intact. Rendered runtime acceptance remains explicitly held pending browser/operator QA.
