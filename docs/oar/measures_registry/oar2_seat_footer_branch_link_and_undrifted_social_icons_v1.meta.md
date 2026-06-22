---
document_type: oar2
authority_level: working
document_scope: footer_and_undrifted_social_surface
title: OAR2 — Seat Footer Branch Link and Undrifted Social Icons
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: seat_footer_branch_link_and_undrifted_social_icons
source_oar1: docs/oar/measures_registry/oar1_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
tags:
  - oar2
  - footer
  - undrifted
  - social-icons
  - c3-field
  - branch-link
---

# OAR2 — Seat Footer Branch Link and Undrifted Social Icons v1

## OBSERVED

Root authority and encounter structure are now seated.

Remaining public surface refinements:

- footer should use site styling
- footer copy should include clickable "c3 Field"
- /undrifted needs social icons for X, Facebook, and Instagram
- Fables and Myths is published
- Agents With Keys remains unpublished with media available

## ALIGNED

Do not alter root authority.

Do not alter encounter sequence.

Do not alter MAP or payment.

Do not alter About Measures Registry content.

Do not expose private SEAT pricing, certification, DAO standing, c3 Key, SRC binding, or conversion standing.

This OAR only seats footer branch-link behavior and /undrifted social icon presence.

## ROUTED

### 1. Footer styling

Use existing site footer styling.

Footer copy must include:

Registered Branch of c3 Field

Only "c3 Field" should be clickable.

The footer must not behave as a global navigation menu.

### 2. c3 Field footer link

Clickable text:

c3 Field

Target:

c3 Field / Our Story route

If c3 Field / Our Story public URL is not seated, do not invent a route.

Return held state for the link target and render safely according to current site behavior.

### 3. /undrifted social icons

Add icon-only social links to /undrifted:

- X
- Facebook
- Instagram

Placement:

- on /undrifted only
- below primary /undrifted content or in the /undrifted footer/social strip
- not in the root encounter path
- not in assessment flow
- not in About Measures Registry unless already globally styled by footer

Use existing approved social profile URLs if seated.

If a social URL is missing, report missing target and hold that icon rather than inventing.

### 4. /undrifted article state correction

Set or verify:

Fables and Myths:
- publication_state: published
- opens on top of /undrifted if article route/content is seated

Agents With Keys:
- publication_state: unpublished
- media available in bucket
- opens only if unpublished article behavior is already supported
- otherwise hold article opening until publication is seated

Do not restore:

- Measures Registry article card
- Structural Drift article card
- Agents of Chaos article card

### 5. Validation

Return evidence for:

- footer uses site styling
- footer copy includes Registered Branch of c3 Field
- only c3 Field is clickable
- c3 Field target is seated or held without invented route
- /undrifted renders X icon
- /undrifted renders Facebook icon
- /undrifted renders Instagram icon
- no missing social URLs were invented
- Fables and Myths is marked published
- Agents With Keys remains unpublished
- removed article cards remain absent

## CODY ROLE

Cody may:

- update footer rendering
- bind footer copy/link from seated state
- add /undrifted social icon rendering
- verify or update Fables and Myths publication state
- preserve Agents With Keys unpublished standing
- return validation evidence

Cody may not:

- alter root route authority
- alter main encounter sequence
- alter MAP/payment
- add hardcoded social URLs if not seated
- invent c3 Field route
- restore removed article cards
- expose protected architecture
- create certification, conversion, DAO, SRC, c3 Key, or SEAL standing

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_footer_branch_link_and_undrifted_social_icons_v1.meta.md

## CLOSE

After OAR1 confirms footer and /undrifted social surfaces, proceed to deployment/live verification.
