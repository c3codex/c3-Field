---
document_type: oar2
authority_level: working
document_scope: undrifted_publication_content
title: OAR2 — Seat unDrifted Issue 001 Publication Content Slots
status: proposed
version: v1
operator: op044
system: undrifted
---

# OAR2 — Seat unDrifted Issue 001 Publication Content Slots

## OBSERVED

Claude completed the /undrifted runtime alignment.

OAR1 confirmed the runtime already renders publication structure from DB state.

Renderer slots now exist for:

- featured article feature_label
- featured article teaser / excerpt
- assessmentFeature.rating_display

These slots are conditional and renderer-bound.

No hardcoded content was added.

Current gap is DB-seated publication content.

## ALIGNED

unDrifted Issue 001 should now be completed through registry content seating.

Frontend remains renderer-only.

Content must preserve Measures Registry positioning:

- AI systems governance
- structural drift detection
- institutional accountability
- governed optimization
- publication-first tone

No SaaS framing.

No marketing funnel drift.

## ROUTED

Review current DB content for:

- measures_registry registry_key = undrifted_publication_landing
- measures_publication_registry publication_key = undrifted
- featured_article_set records
- assessment_feature record

Identify exact JSON/content fields needed to populate:

- feature_label
- teaser or excerpt
- rating_display

Then propose or apply seated content only where field structure already supports it.

Recommended content direction:

- STRUCTURAL DRIFT
- SYSTEM GOVERNANCE
- AI ACCOUNTABILITY
- INSTITUTIONAL REVIEW
- Issue 001 Recommended Assessment
- Structural Drift Review

Claude should determine what fits the existing DB shape and design slot best.

## CLAUDE ROLE

Claude may:

- inspect DB shape
- identify exact update targets
- preserve existing content
- add missing publication metadata where seated
- return SQL or implementation patch if needed
- raise NotChazz flags if fields are missing or mismatched

Claude may not:

- overwrite existing article content without evidence
- invent new article records
- hardcode content in React
- create unsupported JSON structure
- expand beyond Issue 001 publication content slots

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- fields are not actually supported in DB
- featured_article_set is malformed
- assessment_feature cannot accept rating_display
- content is component-owned
- article records are incomplete
- publication metadata conflicts across tables

## VALIDATION

Success is achieved when:

- missing publication slots are seated in DB
- /undrifted displays article labels and teasers from DB
- assessment feature displays editorial signal from DB
- no React content hardcoding is introduced
- npm run build:registry passes
- OAR1 reports exact DB fields changed or blocked

Expected OAR1:

docs/oar/undrifted/oar1_seat_undrifted_issue_001_publication_content_slots_v1.meta.md
