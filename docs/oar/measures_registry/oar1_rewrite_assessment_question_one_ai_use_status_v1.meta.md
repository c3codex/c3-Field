---
document_type: oar1
authority_level: launch_repair
document_scope: assessment_question_one
title: OAR1 - Rewrite Assessment Question One AI Use Status
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_rewrite_assessment_question_one_ai_use_status_v1
---

# OAR1 - Rewrite Assessment Question One AI Use Status

## SOURCE TRACE

**Location:** `measures_encounter_def.metadata.assessment_mechanics.questions[0]` WHERE `encounter_key = 'measures_assessment'`

**Source of truth:** DB (not source file). Question mechanics are seeded via migrations. Runtime reads from DB.

**Prior wording (replaced):**

| Field | Value |
|---|---|
| question | "What is your organization's current AI deployment status?" |
| question_key | `ai_deployment_status` |
| options | 4 (already_using_ai, preparing_to_deploy_ai, exploring_ai_use, not_sure) |
| condition_tags | ai_active_deployment, ai_deployment_preparing, ai_deployment_exploring, ai_deployment_unknown |

## REPAIRS APPLIED

### Migration 202606300003

Replaced `assessment_mechanics.questions[0]` in-place using `jsonb_set` on path `'{assessment_mechanics,questions,0}'`.

**New Q1:**

| Field | Value |
|---|---|
| question | "How is AI currently being used within your organization?" |
| question_key | `ai_deployment_status` (preserved) |
| options | 3 (approved public wording) |

**Approved options:**

| Label | Value | Condition Tag |
|---|---|---|
| We are exploring AI or planning future use. | `exploring_or_planning_ai` | `ai_pre_deploy_context` |
| AI is used indirectly through software and third-party services. | `indirect_ai_use` | `ai_indirect_use_context` |
| AI is actively used in daily operations and decision-making. | `active_ai_operations` | `ai_active_operations_context` |

**question_key preserved** as `ai_deployment_status` for schema compatibility.

**required_question_count preserved** at 7 (Q count unchanged — Q1 rewritten in place, not added).

**Q2–Q7 unchanged.**

Migration validation DO block: passed.

## SCORING STANDING CONFIRMATION

Scoring in `registeredRuntimeUtils.ts` (`resolveEnvironmentalReportByScore`) counts only:
- `critical_ai_drift_condition` (+3)
- `emerging_ai_drift_condition` (+2)
- `probable_ai_drift_condition` (+1)
- `governed_review_condition` (separate count)

Prior Q1 condition_tags (`ai_active_deployment`, etc.) contributed 0 to drift scoring.
New Q1 condition_tags (`ai_pre_deploy_context`, `ai_indirect_use_context`, `ai_active_operations_context`) also contribute 0.

**Score thresholds: unchanged. Standing key calculation: unchanged.**

## NO SOURCE CHANGES

The renderer reads `assessment_mechanics` from `encounter.encounterDef.metadata` at runtime. No changes to `ObsidianChamberRenderer.tsx`, `registeredRuntimeUtils.ts`, `PublicAssessmentSurface.tsx`, or any TS/TSX file.

## VALIDATION

- Question 1 source identified: ✓ (`measures_encounter_def.metadata.assessment_mechanics.questions[0]`)
- Question 1 text updated: ✓ ("How is AI currently being used within your organization?")
- Three approved answer options seated: ✓ (DO block confirmed opt_count = 3)
- Internal labels not exposed publicly: ✓ (condition_tags are contextual-only; labels are approved public wording only)
- Score thresholds unchanged: ✓ (new tags are not critical/emerging/probable drift tags)
- Public recommendation remains MAP the Environment: ✓ (no changes to report contract or MAP routing)
- Report structure preserved: ✓ (no changes to PublicAssessmentResult or migration 202606300002)
- Assessment capture unchanged: ✓ (payload shape unchanged; answer value stored internally)
- Email dispatch unchanged: ✓ (no changes to email artifact construction)
- MAP/payment behavior unchanged: ✓ (no changes to MarbleChamberRenderer or Stripe functions)
- Build passes: ✓ (no source changes; prior build already passing)
- Browser QA: pending deploy (Cloudflare Pages triggered on push)

## SECURITY CONSTRAINTS

- Internal MAP pathway labels not exposed: ✓ (pre_deploy context, indirect_use context, active_operations context are stored in condition_tags, not rendered)
- No SEAT pricing exposed: ✓
- No certification claim: ✓
- No c3 Key claim: ✓
- No professional advice claim: ✓
- AI use status alone does not determine severe standing: ✓ (contextual tags contribute 0 to drift score)
