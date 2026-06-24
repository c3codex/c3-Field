---
document_type: oar2
authority_level: working
document_scope: publication_record
title: OAR2 — Seat Canonical unDrifted Issue 001 Publication Record
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
  - undrifted
  - issue-001
  - publication-record
  - style-profile
  - content-profile
  - media-profile
  - feature-standing
  - db-first
---

# OAR2 — Seat Canonical unDrifted Issue 001 Publication Record v1

## TERMINOLOGY RULE

Do not use contract.

Use:

- publication record
- issue record
- style profile
- content profile
- media profile
- route standing
- article standing
- feature standing
- footer record

---

## DB-FIRST EXECUTION RULE

Before execution, Cody must query current database state for:

- /undrifted route standing
- unDrifted publication record
- Issue 001 record
- landing record
- dispatch records
- article standing
- media mappings
- assessment route
- leadership route
- next issue teaser
- footer record

Runtime is dependent on DB state.

This OAR seats DB authority only.

No frontend mutation.

No src mutation.

No rendering mutation.

---

## OBSERVED

The prior /undrifted execution stopped correctly because DB authority is contradictory.

Current conflicts include:

- Agents With Keys identity and standing conflict
- Fables & Myths issue/framing conflict
- hero video/static media conflict
- missing Issue 001 cover hierarchy
- missing leadership briefing record
- missing next issue teaser
- missing publication footer record
- stale Measures Registry ownership language

The approved visual reference establishes a digital magazine front page.

The database must now seat one canonical Issue 001 publication record before runtime rendering resumes.

---

## ALIGNED

Canonical standing to seat:

unDrifted = publication

Issue 001 = June 2026 Launch Edition

Measures Registry = cover story

Assess the Environment = editor's feature

Agents With Keys = ready_to_publish / feature article

Fables & Myths = published / feature article

Hero = static editorial cover image

Video = not primary hero

Core distinction:

We do not govern AI.
We govern the systems that produce AI outcomes.

---

## ROUTED

### Route 1 — Publication Record

Create or update canonical publication standing:

publication_key: undrifted
publication_title: unDrifted
publication_type: digital magazine
surface_route: /undrifted
issue_key: undrifted_issue_001_launch_edition
issue_number: 001
issue_date: June 2026
edition: Launch Edition
release_state: released
access_state: visible

### Route 2 — Style Profile

Seat the Issue 001 style profile.

style_profile_key: undrifted_issue_001_magazine_cover_profile

Required style profile:

- digital magazine front page
- hot-off-the-press editorial energy
- black / obsidian background
- electric blue accents
- codex gold accents
- large editorial masthead
- serif cover headlines
- tight magazine grid
- thin rule lines
- cover-story modules
- article art visible
- premium AI systems publication tone

Avoid:

- website layout
- landing page structure
- SaaS homepage style
- Measures Registry header branding
- generic card grid
- video hero
- bland footer panels
- button-heavy CTA stack

### Route 3 — Content Profile

Seat the Issue 001 content profile.

content_profile_key: undrifted_issue_001_launch_content_profile

Masthead:

unDrifted

Tagline:

THE PUBLICATION FOR GOVERNED SYSTEM ENVIRONMENTS

Edition line:

ISSUE 001 • JUNE 2026 • LAUNCH EDITION

Rhythm line:

MEASURE • DETECT • CORRECT • GOVERN

Primary headline:

AI ISN'T BROKEN.
SYSTEMS ARE.

Cover story deck:

Measures Registry launches with Integrity Governance—
an inside-out answer to AI systems optimization.

Positioning line:

THE STANDARD FOR AI SYSTEMS GOVERNANCE.

Core distinction:

We do not govern AI.
We govern the systems that produce AI outcomes.

### Route 4 — Media Profile

Seat static editorial media profile.

media_profile_key: undrifted_issue_001_static_cover_media_profile

Required media roles:

- hero portal / keyhole cover image
- Agents With Keys article art
- Fables & Myths article art

Hero media standing:

- static image primary
- video not primary hero
- no autoplay hero
- no embedded video hero

Use existing seated bucket media mappings where available.

If the approved static hero image is not yet mapped, report missing media mapping and stop media mutation.

No hardcoded bucket URLs.

### Route 5 — Measures Registry Cover Story Standing

Seat Measures Registry as cover story, not masthead.

feature_key: measures_registry_launch_cover_story
feature_type: cover_story
feature_title: Measures Registry
feature_headline: AI ISN'T BROKEN. SYSTEMS ARE.
feature_deck: Measures Registry launches with Integrity Governance—an inside-out answer to AI systems optimization.
feature_positioning: THE STANDARD FOR AI SYSTEMS GOVERNANCE.
brand_relationship: featured_story_not_publication_owner

Remove or supersede stale copy implying Issue 001 is published by Measures Registry as masthead owner.

### Route 6 — Assessment Feature Standing

Seat assessment as editorial feature.

feature_key: assess_the_environment_editor_feature
feature_label: EDITOR'S FEATURE
feature_title: ASSESS THE ENVIRONMENT
feature_body: A public evaluation revealing structural drift, operational misalignment, authority gaps, and governance risk.
cta_label: BEGIN ASSESSMENT →
route_path: /ai-operations-assessment

Verify route standing is active, released, and visible.

No assessment flow mutation.

### Route 7 — Agents With Keys Article Standing

Seat Agents With Keys feature standing.

article_key: agents_with_keys_dispatch_v1
title: Agents With Keys
subtitle: Systems Without Governance
feature_teaser: Capability is not authority. Structure prevents drift.
publication_state: ready_to_publish
media_role: agents_with_keys_cover

Preserve distinctness from Agents of Chaos.

Do not route Agents With Keys to Agents of Chaos.

If Agents With Keys has since been published in DB, report contradiction with operator clarification before mutation.

### Route 8 — Fables & Myths Article Standing

Seat Fables & Myths feature standing.

article_key: fables_and_myths_dispatch_v1
title: Fables & Myths
publication_state: published
issue_standing: Issue 001 feature
media_role: fables_and_myths_cover

Required teaser:

Anthropic, Fables 5, Mythos 5,
and the U.S. government.

When institutions narrate capability as control,
systems drift becomes policy risk.

Do not make Fables & Myths generic.

Do not use vague institutional storytelling copy.

### Route 9 — Leadership Feature Standing

Seat leadership feature record.

feature_key: leadership_briefing_systems_behind_ai_outcomes
feature_label: LEADERSHIP BRIEFING
feature_title: THE SYSTEMS BEHIND AI OUTCOMES
feature_body: A private briefing for leaders responsible for AI adoption, operational alignment, and institutional accountability.
cta_label: REQUEST YOUR INVITE →

Route to seated leadership/contact route if present.

If no route is seated, report missing route standing and hold route mutation.

### Route 10 — Next Issue Teaser

Seat next issue teaser.

feature_key: next_issue_from_assessment_to_action
feature_label: NEXT ISSUE
feature_title: FROM ASSESSMENT TO ACTION
feature_body: What happens after drift is detected? Implementation pathways. Operational alignment. Governed correction.
release_hint: COMING JULY 2026

### Route 11 — Footer Record

Seat minimal publication footer.

footer_key: undrifted_issue_001_minimal_footer
footer_line_1: MEASURE. DETECT. CORRECT. GOVERN.
footer_line_2: COHERENCE IS NOT ASSUMED. IT IS MAINTAINED.

No full website footer unless already seated.

---

## CODY ROLE

Cody may:

- query DB state
- reconcile existing publication records
- seat Issue 001 publication record
- seat style profile
- seat content profile
- seat media profile
- seat feature standing
- seat article standing
- seat footer record
- write OAR1 evidence

Cody may not:

- mutate frontend src
- invent missing media
- hardcode bucket URLs
- publish articles unless separately authorized
- change assessment flow
- modify MAP
- modify payment
- activate SEAT
- claim certification
- claim conversion
- use govern-AI language
- use contract terminology

---

## VALIDATION

This OAR2 resolves when DB readback confirms:

- one canonical Issue 001 publication record exists
- style profile is seated
- content profile is seated
- media profile is seated
- unDrifted is publication identity
- Measures Registry is cover story
- assessment is editor's feature
- Agents With Keys standing is reconciled
- Fables & Myths standing is reconciled with required named-subject framing
- static hero media standing is resolved or missing mapping is reported
- leadership feature is seated
- next issue teaser is seated
- minimal footer record is seated
- no frontend mutation occurred

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md

## CLOSE

Seat the publication record.

Then render the magazine.
