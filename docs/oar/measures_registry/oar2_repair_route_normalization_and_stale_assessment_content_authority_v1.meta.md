---
document_type: oar2
authority_level: urgent
document_scope: live_route_and_assessment_authority_repair
title: OAR2 — Repair Route Normalization and Stale Assessment Content Authority
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: repair_route_normalization_and_stale_assessment_content_authority
---

# OAR2 — Repair Route Normalization and Stale Assessment Content Authority v1

## OBSERVED

Live browser QA shows direct public routes failing:

- /undrifted/
- /ai-operations-assessment/

Both render:

Root route authority is not seated.

Source audit says these routes are seated without trailing slash:

- /undrifted
- /ai-operations-assessment

Live QA also shows stale assessment framework/content still active. Question 1 renders old review-pathway language instead of the approved deployment-stage/status question.

## ALIGNED

Repair route resolution and assessment authority only.

Do not change public flow.

Do not create /ai-isnt-broken route.

Do not create /about-measures-registry route.

Do not alter MAP/payment.

Do not alter social scheduling.

Do not publish Paragraph content.

Do not mutate unrelated registry records.

Runtime must render seated authority only.

## ROUTED

### 1. Repair route normalization

Normalize path before route lookup.

Required behavior:

- /undrifted -> /undrifted
- /undrifted/ -> /undrifted
- /ai-operations-assessment -> /ai-operations-assessment
- /ai-operations-assessment/ -> /ai-operations-assessment
- /c3field -> redirect to https://c3field.online
- /c3field/ -> redirect to https://c3field.online
- / remains /

Confirm normalized path is used for:

- ROUTE_SURFACE_ALIASES lookup
- ROUTE_UNIT_KEYS lookup
- public route matching
- rendered component selection

### 2. Repair direct-route authority failure

Verify production route authority resolution for:

- /
- /undrifted
- /undrifted/
- /ai-operations-assessment
- /ai-operations-assessment/

No seated public route may fall into:

Root route authority is not seated.

If route unit exists but DB fetch fails, return exact failed query and key.

### 3. Audit active assessment question source

Identify the source currently rendering the assessment questions.

Return whether questions come from:

- DB/registry seated content
- generated runtime registry
- hardcoded frontend array
- stale framework fallback
- deprecated assessment record

### 4. Replace stale assessment framework authority

Approved current assessment must begin with deployment stage/status.

Repair source of truth so Q1 reflects approved deployment-stage/status question.

Do not invent questions.

Use seated approved registry/question content if present.

If approved question set is not seated, stop and return missing authority instead of hardcoding.

Remove or disable stale hardcoded assessment framework if it is active.

### 5. Build and deploy

Build registry runtime.

Commit repair.

Push to measures branch.

Record commit hash and deployment status.

### 6. Browser verification

Verify live production after deployment:

Routes:

- /
- /undrifted
- /undrifted/
- /ai-operations-assessment
- /ai-operations-assessment/
- /c3field
- /c3field/

Assessment:

- Q1 is approved deployment-stage/status question
- old review-pathway Q1 no longer renders
- assessment still has 7 questions
- assessment proceeds before contact capture

Media:

- root intro media loads or exact media failure returned
- right path media loads or exact media failure returned

Safety:

- no MAP/payment mutation
- no checkout session
- no social scheduling mutation
- no Paragraph publish

## VALIDATION

Return:

- route normalization code evidence
- before/after route lookup behavior
- assessment content source evidence
- stale source removed/disabled
- approved Q1 evidence
- deployment identifier
- browser screenshots if capability exists
- final SEAT standing

## EXPECTED OAR1

docs/oar/measures_registry/oar1_repair_route_normalization_and_stale_assessment_content_authority_v1.meta.md

## CLOSE

SEAT remains held until direct public routes resolve correctly and the assessment no longer renders stale framework content.
