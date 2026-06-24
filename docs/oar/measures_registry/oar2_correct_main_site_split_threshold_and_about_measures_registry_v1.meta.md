---
document_type: oar2
authority_level: working
document_scope: main_site_runtime_correction
title: OAR2 — Correct Main Site Split Threshold and About Measures Registry
status: proposed
version: v1
operator: op044
system: measures_registry
surface:
  - /
  - /about-measures-registry
---

# OAR2 — Correct Main Site Split Threshold and About Measures Registry v1

## OBJECTIVE

Correct the main Measures Registry public surfaces.

This OAR resolves two separate pages only:

1. `/` split threshold page
2. `/about-measures-registry` talking-head page

Do not merge these surfaces.

Do not create new pages.

Do not generate images.

Do not introduce SaaS blocks.

---

## DB-FIRST RULE

Query DB state first.

Runtime is dependent on DB state.

Frontend renders seated state only.

No invented copy.

No invented media.

No invented routes.

If required media or route authority is missing, report it and hold that portion.

---

## SURFACE 1 — `/`

### Required Page Function

The root page is the split path threshold.

It presents:

- Assess the Environment
- Understand the Environment

### Required Layout

Two side-by-side motion-to-still panels.

The panels must fill the screen.

Left panel:

Assess the Environment

Right panel:

Understand the Environment

Each panel uses its seated motion media and still media.

Motion-to-still behavior must be restored or preserved.

### Required Behavior

- no extra continue button
- no stale intro copy
- no generic SaaS section layout
- no wall text
- no About Measures Registry copy on this surface
- no talking-head video on this surface

### Required CTA Standing

Left routes to assessment path.

Right routes to understand/about path as currently seated.

Do not invent route targets.

---

## SURFACE 2 — `/about-measures-registry`

### Required Page Function

This page is the canonical About Measures Registry talking-head page.

### Required Headline

About Measures Registry

Do not replace this headline.

Do not use:

AI isn't broken. Systems are.

as the headline on this page.

### Required Primary Media

Talking-head media belongs here.

The talking-head video must be the primary media on this page.

### Required Body Copy

Use this reduced position copy only:

Measures Registry position: AI optimization cannot be achieved through tools alone.

AI systems interact with workflows, roles, approvals, data, outputs, and decisions.

Without Governed System Integrity, those interactions can amplify instability across the systems they touch.

Governed System Integrity provides the necessary environment for Optimized AI Deployment.

### Required Secondary Features

After the reduced About section, render only:

1. Featured unDrifted article
2. Connect with Measures Registry

### Featured unDrifted

Render a featured unDrifted article with visible article artwork, title, short teaser, and link.

Use seated article authority.

Do not create new article standing.

### Connect with Measures Registry

Render:

Connect with Measures Registry

connect@measuresregistry.com

CTA:

Email Measures Registry

or seated email action if DB provides one.

---

## DELETE / REMOVE FROM ABOUT PAGE

Remove:

- long dominant-assumption wall text
- bullet list section
- duplicate publication card layout
- duplicate connect card layout
- stale "Registered Branch of c3 Field" footer prominence if it crowds the page
- generic SaaS blocks
- extra continue behavior
- unrelated route panels

---

## DESIGN REQUIREMENTS

Use the existing Measures Registry visual language.

But reduce the page.

No bloated sections.

No generic marketing cards.

No dashboard layout.

No SaaS block stack.

About page should read:

headline
talking-head
short position statement
featured article
connect

Root page should read:

two paths
motion-to-still
full screen

---

## CODY ROLE

Cody may:

- inspect DB state
- inspect seated media mappings
- repair root split threshold layout
- repair about page layout
- reduce copy to specified position statement
- remove stale blocks
- wire featured unDrifted article from seated authority
- wire connect email from seated authority
- build and write OAR1

Cody may not:

- create images
- invent copy beyond this OAR
- rename the About headline
- merge `/` and `/about-measures-registry`
- mutate MAP
- mutate payment
- mutate assessment scoring
- activate SEAT
- delete DB records
- claim production success without deployment/QA evidence

---

## VALIDATION

Accepted when:

Root `/`:

- shows split Assess / Understand threshold
- uses two motion-to-still panels
- panels are side by side on desktop
- panels fill screen
- no stale intro copy
- no continue button drift

About `/about-measures-registry`:

- headline is exactly: About Measures Registry
- talking-head media is on this page
- reduced position copy renders
- featured unDrifted article renders
- Connect with Measures Registry renders
- connect@measuresregistry.com renders
- no SaaS block stack remains
- no wall-of-text remains

Build:

- registry build passes

OAR1:

docs/oar/measures_registry/oar1_correct_main_site_split_threshold_and_about_measures_registry_v1.meta.md

Must include:

- DB readback
- files changed
- build result
- held items
- deployment standing

## CLOSE

Two pages.

Root is split threshold.

About is talking-head plus reduced position, unDrifted, and connect.

Get it done.
