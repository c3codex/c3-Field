---
document_type: oar2
authority_level: working
document_scope: publication_surface
title: OAR2 — Seat unDrifted Issue 001 Launch Edition Publication Surface
status: proposed
version: v1
operator: op044
system: measures_registry
surface: undrifted
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
tags:
  - oar2
  - measures-registry
  - undrifted
  - issue-001
  - launch-edition
  - publication
  - magazine-cover
  - assessment
  - integrity-governance
---

# OAR2 — Seat unDrifted Issue 001 Launch Edition Publication Surface v1

## DB-FIRST EXECUTION RULE

Before execution, Cody must query current database state for all affected `/undrifted` records:

- publication identity
- issue metadata
- cover story
- media mappings
- article records
- assessment feature route
- leadership feature route
- next issue teaser
- release state
- runtime contract

Runtime is dependent on DB state.

If DB state is missing, stale, blocked, contradictory, or unavailable:

- report missing state
- report contradictory state
- do not invent state
- do not hardcode fallback truth
- do not infer release, route, media, content, article, or feature standing
- stop mutation until DB standing is clarified

Database first.

Runtime second.

Frontend renders seated state only.

---

## OBSERVED

`/undrifted` currently reads too much like a website.

Approved correction:

unDrifted = publication

Measures Registry = cover story

Assess the Environment = featured evaluation

Articles = editorial issue content

The attached magazine-cover reference is the approved visual direction.

The surface must read like a digital magazine front page, not a company landing page.

The strongest approved direction is:

- unDrifted as primary brand
- Issue 001 as Launch Edition
- Measures Registry as the cover story
- Assess the Environment as the featured public evaluation
- article art visible as magazine cover features
- no Measures Registry site branding dominating the page
- no video hero required

---

## ALIGNED

Primary cover hierarchy:

unDrifted

THE PUBLICATION FOR GOVERNED SYSTEM ENVIRONMENTS

ISSUE 001 • JUNE 2026 • LAUNCH EDITION

AI ISN'T BROKEN.
SYSTEMS ARE.

Measures Registry launches with Integrity Governance—
an inside-out answer to AI systems optimization.

THE STANDARD FOR AI SYSTEMS GOVERNANCE.

Core distinction:

We do not govern AI.
We govern the systems that produce AI outcomes.

The AI follows the environment.

---

## ROUTED

### Route 1 — Surface Type

Rebuild `/undrifted` as a digital magazine front page.

It is not:

- website
- landing page
- blog grid
- company profile
- video page
- SaaS homepage
- Measures Registry marketing page

### Route 2 — Visual Style Profile

Use:

- black / obsidian background
- electric blue accents
- codex gold accents
- large editorial masthead
- serif cover headlines
- tight magazine grid
- thin rule lines
- cover-story modules
- premium AI systems publication tone
- newsstand / hot-off-the-press energy
- article art as editorial feature content

Avoid:

- Measures Registry header branding
- standard navigation
- generic cards
- button-heavy CTA layout
- embedded video hero
- SaaS homepage structure
- bland footer panels

### Route 3 — Media Placement

Use static editorial media.

No video required.

Required media roles:

- hero portal / keyhole cover image
- Agents With Keys article art
- Fables & Myths article art
- optional assessment diagram / signal graphic
- optional leadership image

All media must resolve from DB media mappings.

No hardcoded bucket URLs.

If media mappings are missing, report missing records and stop media mutation.

### Route 4 — Masthead

Top full-width:

unDrifted

THE PUBLICATION FOR GOVERNED SYSTEM ENVIRONMENTS

ISSUE 001 • JUNE 2026 • LAUNCH EDITION

MEASURE • DETECT • CORRECT • GOVERN

The masthead must dominate as publication identity.

Measures Registry must not appear as masthead.

### Route 5 — Cover Story

Primary headline:

AI ISN'T BROKEN.
SYSTEMS ARE.

Feature deck:

Measures Registry launches with Integrity Governance—
an inside-out answer to AI systems optimization.

Positioning line:

THE STANDARD FOR AI SYSTEMS GOVERNANCE.

Measures Registry should read as the cover story that made the issue, not as the publication owner.

### Route 6 — Assessment Feature

Create major editorial feature block.

This is not a generic button card.

Use:

EDITOR'S FEATURE

ASSESS THE ENVIRONMENT

A public evaluation revealing structural drift,
operational misalignment, authority gaps,
and governance risk.

BEGIN ASSESSMENT →

Route:

/ai-operations-assessment

If route standing is missing in DB, report missing route and stop route mutation.

### Route 7 — Article Features

Use article art prominently.

Article 1:

AGENTS WITH KEYS

Capability is not authority.
Structure prevents drift.

Article 2:

FABLES & MYTHS

Anthropic, Fables 5, Mythos 5,
and the U.S. government.

When institutions narrate capability as control,
systems drift becomes policy risk.

Correction:

Fables & Myths is not a generic systems-failure article.

It is the Issue 001 article concerning Anthropic, Fables 5, Mythos 5, and the U.S. government.

Do not abstract it into vague institutional storytelling copy.

### Route 8 — Leadership Feature

Replace bland leadership copy with:

LEADERSHIP BRIEFING

THE SYSTEMS BEHIND AI OUTCOMES

A private briefing for leaders responsible for
AI adoption, operational alignment,
and institutional accountability.

REQUEST YOUR INVITE →

Route to seated leadership/contact route if present.

If missing, report missing DB route.

### Route 9 — Next Issue Teaser

Bottom rail:

NEXT ISSUE

FROM ASSESSMENT TO ACTION

What happens after drift is detected?

Implementation pathways.
Operational alignment.
Governed correction.

COMING JULY 2026

### Route 10 — Footer Line

Minimal publication footer only:

MEASURE. DETECT. CORRECT. GOVERN.

COHERENCE IS NOT ASSUMED. IT IS MAINTAINED.

No full website footer required unless already seated.

---

## CODY ROLE

Cody may:

- query DB state
- rebuild `/undrifted` layout
- wire seated media
- apply magazine style profile
- route assessment feature
- route article links
- route leadership feature where seated
- preserve unDrifted as primary publication brand
- preserve Measures Registry as cover story

Cody may not:

- invent article records
- invent media URLs
- add Measures Registry site branding
- use video as primary hero
- change assessment flow
- modify MAP
- modify payment
- activate SEAT
- claim certification
- claim conversion
- use govern-AI language
- make Fables & Myths generic
- override DB standing

---

## VALIDATION

This OAR2 resolves successfully when:

- `/undrifted` reads as a digital magazine cover
- unDrifted is primary brand
- Measures Registry is cover story
- AI Isn't Broken. Systems Are. dominates
- The Standard for AI Systems Governance appears as positioning line
- article art is visible
- Agents With Keys appears as article feature
- Fables & Myths appears with Anthropic / Fables 5 / Mythos 5 / U.S. government framing
- assessment feature routes correctly
- leadership feature is present
- next issue teaser is present
- no Measures Registry website branding dominates
- no video hero is required
- all content/media resolve from DB state
- frontend renders seated state only

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_undrifted_issue_001_launch_edition_publication_surface_v1.meta.md

## CLOSE

Seat unDrifted as publication.

Make Measures Registry the cover story.

Make assessment the featured public evaluation.

Render the magazine, not the website.
