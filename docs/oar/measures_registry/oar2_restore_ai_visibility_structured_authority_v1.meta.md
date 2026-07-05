---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend
title: OAR2 — Restore AI Visibility Structured Authority
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
  cody: frontend_executor
tags:
  - oar2
  - measures-registry
  - ai-visibility
  - schema
  - json-ld
  - llms-txt
  - semantic-html
  - crawlability
---

# OAR2 — Restore AI Visibility Structured Authority

## OBSERVED

Lighthouse Local audit reports Measures Registry at 45/100 overall.

The highest-value AI Visibility failures are:

- no valid JSON-LD detected
- no llms.txt file found
- no H1 on homepage
- no H2/H3 semantic structure
- very thin or uncrawlable homepage content
- very few internal links
- no crawlable nav with anchor tags
- no social profile links from homepage

Several audit items are local-business assumptions and are out of model:

- LocalBusiness schema
- Google Business Profile
- Google reviews
- star ratings
- service-area pages
- aggregate rating schema

Measures Registry is not a local service-area business. It is an institutional AI governance registry and governed assessment environment.

## ALIGNED

Fix AI visibility from the top down without changing system authority.

Frontend may improve crawlability and semantic exposure, but must not invent truth.

Codex remains authority.
Field structures relation.
Measures registers routing and reveal.
Chazz validates.
Cody implements in src.

The homepage must expose crawlable, public-safe institutional meaning while preserving encounter architecture.

## ROUTED

Cody shall implement the following top-down AI visibility repairs.

### 1. Add valid JSON-LD

Add structured data to the public homepage.

Minimum graph:

- Organization
- WebSite
- Person founder
- AboutPage
- FAQPage where public FAQ content exists
- BreadcrumbList where applicable

Organization identity:

- name: Measures Registry
- url: https://measuresregistry.com
- description: Institutional governance framework for AI deployment, structural drift detection, and governable environments.
- sameAs:
  - public X profile if seated
  - LinkedIn profile if seated
  - YouTube if seated
  - Paragraph / unDrifted if seated

Founder:

- name: Stephanie Joanne Gaffney
- role: Measures Registry Instructor
- affiliation: Measures Registry
- public sameAs only where seated

Do not add address, phone, aggregateRating, LocalBusiness, or review schema unless separately seated.

### 2. Add /llms.txt

Create public file:

public/llms.txt

Content should identify:

- Measures Registry
- institutional AI governance
- structural drift
- governable environments
- Measures Alignment Protocol
- public citation-safe URLs

Do not expose private MAP pricing, SEAT pricing, DAO standing, c3 Key claims, or certification claims.

### 3. Add crawlable homepage semantic text

Ensure homepage includes real HTML text available to crawlers before or at initial render.

Minimum semantic structure:

- one h1:
  Measures Registry

- h2:
  AI isn't broken. Systems are.

- h2:
  Institutional Accountability for AI Deployment

- h2:
  Assess the Environment

- h2:
  Understand the Environment

Add concise public-safe copy explaining:

- Measures Registry helps institutions detect structural drift
- AI outcomes are shaped by the systems AI operates within
- the registry supports governable environments
- the public assessment is a baseline only
- c3 MAP, conversion, and certification are governed later states, not public self-claims

### 4. Add real crawlable navigation

Ensure homepage has a semantic nav element with real anchor links.

Minimum public links where routes exist:

- /
- /about
- /undrifted
- /our-story
- /ai-isnt-broken
- /assess-the-environment
- /understand-the-environment

Do not use div-only navigation for primary routes.

### 5. Add internal links from homepage

Homepage must contain crawlable internal links to public education and assessment routes.

Links must use anchor hrefs, not only JS click handlers.

### 6. Add public social/profile links

Add seated public profile links from homepage or footer.

Only include profiles already public/seated.

### 7. Preserve encounter design

Semantic additions must not break the encounter layout.

If crawlable copy must be visually restrained, use accessible semantic structure without hiding it from crawlers through display:none.

Acceptable:

- visually integrated copy panels
- sr-only headings where appropriate
- below-fold crawlable sections
- progressive enhancement

Not acceptable:

- empty homepage shell
- text only after unavailable JS
- schema values hardcoded with unseated claims
- local-business schema misuse

### 8. Validation

After implementation, validate:

- homepage contains exactly one h1
- h2 sections exist
- nav uses anchor tags
- internal links are crawlable
- /llms.txt returns 200
- JSON-LD validates
- no LocalBusiness, aggregateRating, review, address, or phone schema added unless seated
- Lighthouse Local AI Visibility improves without chasing local-business assumptions

## CODY ROLE

Cody may update frontend semantic HTML, public static files, JSON-LD generation, nav anchor structure, and crawlable homepage content.

Cody may not invent authority, add unseated business claims, add local-business schema, expose private pricing, expose certification claims, or replace encounter architecture with generic SaaS layout.

## VALIDATION OUTPUT

Return:

- changed files
- JSON-LD types added
- llms.txt path and response status expectation
- H1/H2 confirmation
- nav anchor confirmation
- internal links added
- any missing seated public profile links

## EXPECTED OAR1

docs/oar/measures_registry/oar1_restore_ai_visibility_structured_authority_v1.meta.md

## CLOSE

This OAR restores AI visibility by making seated public meaning crawlable.

No new authority is created.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders seated state only.
