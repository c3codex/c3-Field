---
document_type: oar2
authority_level: urgent
document_scope: live_site_stabilization
title: OAR2 — Emergency Live Site Stabilization: Root, About, unDrifted
status: proposed
version: v1
operator: op044
system: measures_registry
executor: claude
---

# OAR2 — Emergency Live Site Stabilization: Root, About, unDrifted v1

## OBJECTIVE

Restore a functioning live Measures Registry site.

Do not redesign.

Do not expand scope.

Fix only what live QA confirms is broken:

1. Root `/`
2. `/about-measures-registry`
3. `/undrifted`
4. Preserve repaired `/ai-operations-assessment`

---

## DB-FIRST RULE

Query DB state first.

Runtime depends on DB state.

Do not invent content, media, route targets, or fallbacks.

If DB state conflicts with this OAR, report exact conflict before mutation.

---

## LIVE QA OBSERVED

Assessment now loads.

Broken / unresolved:

- media intro is gone
- root paths page is not fixed
- About Measures Registry is not fixed
- unDrifted opening banner is not fixed
- prior OARs conflict and reintroduced continue/supporting-state behavior

---

## ROUTE 1 — PRESERVE ASSESSMENT

Do not mutate assessment question count, scoring, result mapping, or route behavior.

`/ai-operations-assessment` must remain functional.

---

## ROUTE 2 — ROOT `/`

Root page must be the split threshold.

Required:

- Assess the Environment
- Understand the Environment
- two side-by-side panels on desktop
- panels fill the screen
- motion-to-still media restored
- no wall text
- no About copy
- no talking-head video
- no stale intro replacement
- no broken/empty media state

Restore intro/media behavior if it was removed by recent mutations.

---

## ROUTE 3 — `/about-measures-registry`

This page is NOT a two-state encounter.

Remove:

- Continue button
- Audio button unless native video controls require it
- encounter/supporting state split
- SaaS cards
- support point wall
- duplicate publication/connect blocks

Render single page only:

Headline:

About Measures Registry

Primary media:

about_measures_registry talking-head video

Body copy only:

Measures Registry position: AI optimization cannot be achieved through tools alone.

AI systems interact with workflows, roles, approvals, data, outputs, and decisions.

Without Governed System Integrity, those interactions can amplify instability across the systems they touch.

Governed System Integrity provides the necessary environment for Optimized AI Deployment.

Then render:

- Featured unDrifted article
- Connect with Measures Registry
- connect@measuresregistry.com

---

## ROUTE 4 — `/undrifted`

Opening viewport must show the full unDrifted banner asset.

Use seated or uploaded banner media:

undrifted_banner_website_social.webp

Required:

- full banner visible on page load
- no square logo-only masthead
- no large empty masthead gap
- issue rail below banner
- page opens professionally
- do not redesign article layout beyond necessary banner repair

---

## EXECUTOR ROLE — CLAUDE

Claude may:

- inspect current source
- inspect DB readback
- identify conflicting OAR implementation residue
- repair source routing/renderers
- wire seated media correctly
- build
- commit exact stabilization files
- push if authorized
- write OAR1

Claude may not:

- create new designs
- generate images
- mutate assessment scoring
- mutate MAP/payment/SEAT
- reintroduce two-state About flow
- remove the repaired seven-question assessment
- claim production success without deployment QA

---

## VALIDATION

Accepted when live site shows:

- `/` split threshold restored with media
- `/about-measures-registry` single-page About surface
- `/undrifted` opens with full banner
- `/ai-operations-assessment` still loads
- build passes
- no conflicting continue/supporting-state About behavior remains

## EXPECTED OAR1

docs/oar/measures_registry/oar1_emergency_live_site_stabilization_root_about_undrifted_v1.meta.md

## CLOSE

Stabilize the live site.

No more design drift.
No more route mixing.
No more Cody loop.
