---
document_type: oar2
authority_level: working
document_scope: threshold_repair
title: OAR2 — Repair Stale Threshold Content, Path Motion Media, and Assessment Question Count
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
tags:
  - oar2
  - threshold
  - intro-hook
  - path-choice
  - assessment
  - scoring
  - media
  - stale-content
---

# OAR2 — Repair Stale Threshold Content, Path Motion Media, and Assessment Question Count v1

## DB-FIRST EXECUTION RULE

Before execution, Cody must query current database state for:

- intro_hook
- path_choice
- path_choice media mappings
- left/right threshold media
- ai-operations-assessment
- assessment question records
- assessment scoring contract
- release state
- runtime contract

Runtime is dependent on DB state.

If DB state is missing, stale, blocked, contradictory, or unavailable:

- report missing state
- report contradictory state
- do not invent state
- do not hardcode fallback truth
- do not infer content, media, route, or scoring standing
- stop mutation until DB standing is clarified

Database first.

Runtime second.

Frontend renders seated state only.

---

## OBSERVED

Three launch-blocking drift conditions are present.

### 1. Stale Intro Content

Current runtime displays:

Behavior that is not registered cannot be governed.

Enter through system evaluation or foundational cohort conversion.

This content is deprecated residue.

### 2. Path Choice Media Not Configured

Media assets appear present.

Motion-to-still behavior is not correctly configured.

Expected threshold experience is not rendering.

### 3. Assessment Question Count Drift

Current runtime displays:

1 OF 8

Approved assessment contract is:

7 questions total.

AI Deployment Status must be Question 1 of 7.

Current standing suggests deployment status was added as Question 8 rather than replacing the original Question 1 position.

This risks corrupting assessment scoring.

---

## ALIGNED

Correct sequence:

intro_hook
→ path_choice
→ left passage
→ ai-operations-assessment

Correct threshold headline:

AI isn't broken.

Systems are.

Correct assessment structure:

Q1 AI Deployment Status

Q2-Q7 Operational Assessment Questions

Correct count:

1 OF 7

Scoring must resolve from the approved 7-question assessment contract only.

No 8-question runtime.

No cohort conversion language.

No system evaluation language.

---

## ROUTED

### Route 1 — Query DB State

Query and report current DB standing for:

- intro_hook content
- path_choice records
- media mappings
- assessment questions
- scoring contract
- runtime release state

No mutation from frontend observation alone.

### Route 2 — Remove Stale Intro Content

Locate source of:

Behavior that is not registered cannot be governed.

Enter through system evaluation or foundational cohort conversion.

Inspect:

- DB content records
- runtime content bindings
- seeded fallback files
- static configuration
- legacy page definitions
- cached build output

Correct runtime copy:

AI isn't broken.

Systems are.

Optional supporting copy if seated:

Most AI failures aren't intelligence problems.

They're system failures.

Deprecated copy may not render.

### Route 3 — Repair Path Choice Motion-to-Still Media

Repair path_choice media contract.

Required behavior:

- motion media loads
- motion resolves to still frame
- left/right threshold remains balanced
- media sourced from DB mapping
- no blank media containers
- no hardcoded fallback URLs

If media exists in storage but not DB:

report missing media standing.

### Route 4 — Restore 7 Question Contract

Repair assessment structure.

Required:

total_questions = 7

Q1 = AI Deployment Status

Q2-Q7 = Operational Assessment Questions

Progress indicator:

1 OF 7

Remove stale eighth-question behavior.

Deployment status must replace prior position rather than extend count.

### Route 5 — Scoring Protection

Verify:

- question count
- scoring weights
- result mappings
- stored response count
- progress indicator
- payload shape

Scoring must use seven responses only.

No result calculation may proceed from eight-question payloads.

---

## CODY ROLE

Cody may:

- query DB state
- identify stale content source
- repair threshold content bindings
- repair media mappings
- restore motion-to-still behavior
- repair assessment contract
- repair progress indicator
- protect scoring integrity
- write OAR1 evidence

Cody may not:

- invent replacement content
- hardcode media URLs
- retain deprecated cohort conversion language
- retain deprecated system evaluation language
- ship an 8-question assessment
- modify MAP
- modify payment
- activate SEAT
- alter assessment strategy beyond restoring approved standing

---

## VALIDATION

This OAR2 resolves when:

- intro_hook renders AI isn't broken. Systems are.
- deprecated threshold copy is removed
- path_choice media resolves correctly
- motion-to-still behavior functions
- ai-operations-assessment displays 1 OF 7
- AI Deployment Status is Question 1
- assessment contains exactly seven questions
- scoring uses seven-question contract only
- no frontend-owned fallback truth remains

## EXPECTED OAR1

docs/oar/measures_registry/oar1_repair_stale_threshold_content_path_motion_media_and_assessment_question_count_v1.meta.md

## CLOSE

Repair the threshold.

Restore the media contract.

Protect the scoring contract.
