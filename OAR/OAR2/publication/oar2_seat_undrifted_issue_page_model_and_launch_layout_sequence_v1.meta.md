---
document_type: oar2
authority_level: working
document_scope: publication_issue_pages
title: OAR2 - Seat unDrifted Issue Page Model and Launch Layout Sequence
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
  free: frontend_replacement_encounter_environment
tags:
  - oar2
  - undrifted
  - issue001
  - issue-pages
  - layout-sequence
  - editors-letter
  - cover-story
  - launch-layout
  - future-flipbook
---

# OAR2 - Seat unDrifted Issue Page Model and Launch Layout Sequence

## OBSERVED

unDrifted is now a governed publication surface with confirmed publication authority, dispatch records, encounter projection, and a Publication Encounter Profile.

The publication now needs an issue-page model so that the pages discussed for Issue 001 can be registered as ordered publication objects rather than treated as loose frontend sections.

Current intended Issue 001 sequence:

- Cover
- Editor's Letter
- Contents
- Cover Story
- Dispatches
- Launch Encounter

Future desired behavior includes flip-style issue browsing, archive/library rendering, contributor expansion, social registry, and feed.

Those future behaviors should be prepared structurally but not implemented in this launch OAR.

## ALIGNED

Pages must be registered as publication issue objects.

Layouts must be profile-driven.

FREE must render seated issue sequence.

The cover story and editor's letter must become issue pages before the cover region and editorial front matter become fully functional.

The website remains the canonical issue experience.

Paragraph is distribution, not the sole authority.

Flipbook behavior is held for future renderer work.

Authority order remains:

Codex -> Field -> Measures -> Publication Registry -> Publication Release -> Issue Pages -> Encounter Projection -> FREE

## ROUTED

### 1. Seat Issue Page model

Create or define a governed issue-page model.

Preferred DB object name:

measures_publication_issue_page

If a suitable existing table already exists, use it and return evidence.

Minimum required fields:

- page_key
- publication_key
- issue_id
- issue_number
- page_number
- page_role
- title
- subtitle
- asset_id
- dispatch_key
- banner_asset_id
- route_path
- layout_profile_key
- release_state
- visibility_state
- source_authority
- metadata
- created_at
- updated_at

Page role values should support at minimum:

- cover
- editors_letter
- contents
- cover_story
- dispatches
- launch_encounter

Do not use slug as authority.

Route paths are routing surfaces only.

### 2. Register Issue 001 launch page sequence

Seat Issue 001 pages in order:

Page 01:

- page_role: cover
- title: Issue 001
- layout_profile_key: undrifted_issue_cover_layout_v1

Page 02:

- page_role: editors_letter
- title: From the Editor
- asset_id: registered Editor's Letter asset
- banner_asset_id: Codexstone banner asset
- layout_profile_key: undrifted_editors_letter_layout_v1

Page 03:

- page_role: contents
- title: Contents
- layout_profile_key: undrifted_contents_layout_v1

Page 04:

- page_role: cover_story
- title: AI Isn't Broken. Systems Are.
- asset_id: registered cover story asset
- dispatch_key: ai_isnt_broken_systems_are_dispatch_v1
- banner_asset_id: AI Isn't Broken banner asset
- layout_profile_key: undrifted_cover_story_layout_v1

Page 05:

- page_role: dispatches
- title: Dispatches
- layout_profile_key: undrifted_dispatch_grid_layout_v1

Page 06:

- page_role: launch_encounter
- title: AI Operations Assessment
- route_path: /ai-operations-assessment
- layout_profile_key: undrifted_launch_encounter_layout_v1

If any asset identifier is missing, return blocker rather than inventing it.

### 3. Seat launch layout sequence

Add or update Publication Encounter Profile metadata so it knows the Issue 001 page sequence.

The profile should carry:

- issue_page_sequence
- front_matter_sequence
- article_sequence
- encounter_sequence
- layout_profiles
- held_future_renderers

Required launch layout profiles:

- undrifted_issue_cover_layout_v1
- undrifted_editors_letter_layout_v1
- undrifted_contents_layout_v1
- undrifted_cover_story_layout_v1
- undrifted_dispatch_grid_layout_v1
- undrifted_launch_encounter_layout_v1

Do not build visual flip behavior yet.

### 4. Prepare route model

Prepare route paths for issue pages without forcing implementation if routing authority is not ready.

Preferred future paths:

- /undrifted/issue-001
- /undrifted/issue-001/editors-letter
- /undrifted/issue-001/ai-isnt-broken-systems-are

Return whether these can be seated now, prepared as held routes, or require a later route OAR.

Do not make the cover story clickable until a valid route exists and the cover story article is published or otherwise has an approved internal route.

### 5. Preserve Paragraph as distribution

If a Paragraph URL exists for an issue page, store it as external_url or paragraph_url.

Do not treat Paragraph as canonical route authority.

Canonical issue experience should remain owned by unDrifted / Measures Registry.

### 6. Update projection path

Update the projection/regeneration mechanism so Encounter Projection can receive the issue_page_sequence.

Allowed:

- add issue_page_sequence to measures_encounter_def.metadata
- expose sequence to FREE
- return renderer blocker if consuming the sequence requires separate implementation

Disallowed:

- hardcode page sequence in frontend
- duplicate article bodies into frontend
- bypass Publication Registry or Issue Page model

### 7. Hold flipbook and future expansion

Record but do not implement:

- flipbook renderer
- page-turn animation
- issue archive/library
- contributor registry
- social registry
- feed
- comments

Future flipbook should render from the issue-page sequence when seated.

## EXECUTOR ROLE

Executor may:

- inspect existing DB schema
- create issue-page model if absent
- register Issue 001 pages
- bind existing assets and dispatch keys
- update Publication Encounter Profile metadata
- update projection/regeneration script
- prepare held route metadata
- return blockers honestly

Executor may not:

- invent missing asset IDs
- create Paragraph URLs
- mark unpublished articles as published
- hardcode page sequence in FREE
- implement flipbook UI
- implement library/social/feed/contributor scope
- move publication authority into frontend

## VALIDATION

Return OAR1 with:

- issue-page model standing
- Issue 001 pages registered
- asset and banner bindings
- route model status
- Publication Encounter Profile update
- projection update
- Paragraph/external URL standing
- held future renderer notes
- blockers, if any

## EXPECTED OAR1

OAR/OAR1/publication/oar1_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md

## CLOSE

Issue pages are registry objects.

Layouts are profile-driven.

Paragraph distributes.

unDrifted remains canonical.

Flipbook waits.

Launch sequence seats first.
