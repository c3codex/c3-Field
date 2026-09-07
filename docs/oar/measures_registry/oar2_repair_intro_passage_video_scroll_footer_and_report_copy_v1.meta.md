---
document_type: oar2
authority_level: launch_repair
document_scope: browser_qa_repairs
title: OAR2 - Repair Intro Passage Video Scroll Footer and Report Copy
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Repair Intro Passage Video Scroll Footer and Report Copy

## PURPOSE

Repair browser QA issues blocking public launch.

Nothing is invented.

## OBSERVED

Operator browser QA shows:

1. Intro page requires manual click before flow begins.
2. Obsidian to Marble passage video does not render on page.
3. Laptop assessment cannot scroll to submit answers.
4. Footer/copyright/legal identity statement is missing.
5. Measures Registry branch standing needs visible footer statement.
6. Report copy is not yet aligned to approved report language.

Assessment question copy is not in scope.

## REQUIRED REPAIR

### 1. Intro behavior

Verify intended intro behavior.

If intro should auto-advance, restore autoload behavior.

If browser autoplay rules require user action, ensure first user action clearly begins the encounter and does not create a dead intro page.

Do not leave intro as a blank wait state with only Continue unless intentionally approved.

### 2. Obsidian to Marble passage video

Verify:

- media row exists
- media_role matches renderer expectation
- VITE_R2_PUBLIC_BASE_URL exists in production
- resolved video URL is valid
- video element renders
- missing video fallback is visible and not silent

Repair the passage surface so approved video renders.

Do not replace approved media.

### 3. Laptop assessment scrolling

Repair assessment layout so users can scroll to answer and submit.

Verify at:

- 1366 x 768
- 1440 x 900

Requirements:

- full assessment form scrollable
- submit/contact capture reachable
- CTA not trapped below viewport
- no fixed container blocks scrolling
- mobile/tablet behavior preserved

### 4. Footer identity

Restore footer/legal identity visibility where expected.

Footer should include:

- copyright
- Measures Registry identity
- branch statement
- Privacy link
- Terms link
- Contact/About link

Approved branch statement:

Measures Registry is a registered branch operating under c3 Community Partners DAO LLC / c3 Field authority.

Do not imply separate legal entity standing.

Do not imply federal tax-exempt status.

Do not imply tax-deductible charitable contribution.

### 5. Governed site explanation

If footer or About route supports it, add or confirm short governed-site explanation:

Measures Registry is a governed encounter, not a conventional website. Public pathways, assessments, publications, legal notices, media, and transitions are seated through registry standing before release.

Do not overexpand copy in this OAR if placement is not already supported.

### 6. Report copy alignment

Report copy must align to the approved public report structure:

1. Measures Registry Informational Notice
2. Environment Finding
3. Key Environmental Indicators
4. Recommendation

Recommendation remains:

MAP the Environment to review the operating conditions behind these findings and determine the appropriate governed pathway.

Trace and repair report copy through:

- assessment_evaluation_report_contract_v1
- assessment_interpretation
- report_templates
- condition_indicator_map
- environmental_indicator_map

Do not rewrite assessment question copy.

Do not invent report copy.

If approved wording is missing, return exact missing key inventory.

## VALIDATION

Return OAR1 evidence showing:

- intro flow no longer stalls
- passage video renders from approved media URL
- laptop assessment scroll reaches submit/contact capture
- footer identity statement renders
- Privacy/Terms/Contact links visible and navigate
- branch statement exact or approved equivalent
- governed-site explanation seated or exact hold reason returned
- report copy source traced
- report copy aligns to approved public report structure
- recommendation remains MAP the Environment
- no raw scores exposed
- no corrective instructions introduced
- no prohibited legal/tax/certification claims
- build passes
- browser QA notes for desktop/laptop/mobile

## NOTCHAZZ FLAGS

Raise NotChazz if:

- unapproved media is used
- intro behavior is changed without evidence
- assessment capture breaks
- report copy is invented
- assessment question copy is changed
- footer implies separate legal entity
- footer implies federal tax-exempt status
- footer implies tax-deductibility
- certification or c3 Key claims appear
- operator is governed instead of the work body

## CLOSE

Repair launch-blocking browser QA issues.

Then re-run full public flow QA.
