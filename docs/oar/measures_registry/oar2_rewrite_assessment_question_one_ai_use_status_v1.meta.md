---
document_type: oar2
authority_level: launch_repair
document_scope: assessment_question_one
title: OAR2 - Rewrite Assessment Question One AI Use Status
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Rewrite Assessment Question One AI Use Status

## PURPOSE

Rewrite Question 1 of the public assessment so it captures AI use status clearly and safely.

The question should determine the organization's relationship to AI use without publicly exposing internal pathway labels.

Nothing is invented.

## CURRENT ISSUE

The current deployment status wording is unclear and may overstate formal deployment.

Question 1 should not force users into technical language.

Question 1 should not publicly expose:

- pre-deploy
- optimization
- remediation
- internal MAP pathway labels

## APPROVED PUBLIC QUESTION

Question:

How is AI currently being used within your organization?

Approved answer options:

1. We are exploring AI or planning future use.
2. AI is used indirectly through software and third-party services.
3. AI is actively used in daily operations and decision-making.

## INTERNAL INTERPRETATION

Public recommendation remains:

MAP the Environment

Internal interpretation may classify:

- exploring or planning future use -> pre_deploy context
- indirect use through software and third-party services -> indirect_use context
- active daily operations and decision-making -> active_operations context

These internal contexts must not replace the public recommendation.

## SCORING STANDING

Question 1 should act as context, not as the sole determinant of outcome.

Do not let AI use status alone determine severe standing.

Environmental findings and score should continue to come primarily from the governance, role, review, workflow, and automation questions.

Do not change scoring thresholds unless existing assessment interpretation explicitly requires it.

## REPORT ALIGNMENT

Report language should use Question 1 only as context for environment findings.

Public report must continue to show:

- Measures Registry informational notice
- Environment finding
- Key Environmental Indicators
- MAP the Environment recommendation

Do not expose internal labels:

- foundational
- optimize
- pre-deploy
- remediation

## MAP ALIGNMENT

Public MAP recommendation remains:

MAP the Environment to review the operating conditions behind these findings and determine the appropriate governed pathway.

Internal MAP pathway mapping may use Question 1 as context but must not expose internal service labels in the public report.

## REQUIRED ACTIONS

1. Locate Question 1 in the assessment source or DB metadata.
2. Replace question text with approved wording.
3. Replace answer options with approved wording.
4. Preserve answer keys or update mappings safely if required.
5. Preserve score calculation unless explicitly required by existing interpretation structure.
6. Ensure report wording does not expose internal labels.
7. Ensure MAP cards or payment behavior are not changed in this OAR.
8. Ensure assessment capture remains compatible with email dispatch.

## VALIDATION

Return OAR1 evidence showing:

- Question 1 source identified
- Question 1 text updated
- three approved answer options seated
- internal labels not exposed publicly
- score thresholds unchanged or exact authorized change documented
- public recommendation remains MAP the Environment
- report structure preserved
- assessment capture unchanged
- email dispatch unchanged
- MAP/payment behavior unchanged
- build passes
- browser QA confirms Question 1 rendering

## NOTCHAZZ FLAGS

Raise NotChazz if:

- internal labels appear publicly
- AI use status alone determines severe standing
- scoring thresholds are changed without authority
- report recommendation changes away from MAP the Environment
- MAP pricing or Stripe behavior changes
- assessment capture breaks
- operator is governed instead of the work body

## CLOSE

Rewrite Question 1.

Keep public recommendation as MAP the Environment.

Nothing is invented.
