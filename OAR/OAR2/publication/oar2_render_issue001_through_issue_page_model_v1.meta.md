---
document_type: oar2
authority_level: working
document_scope: publication_issue_renderer
title: OAR2 - Render Issue 001 Through Issue Page Model
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
  - issue-page-model
  - renderer
  - publication-encounter
  - held-routes
  - launch
---

# OAR2 - Render Issue 001 Through Issue Page Model

## OBSERVED

Issue 001 now has a seated issue-page model.

The DB now contains:

- measures_publication_issue_page
- six Issue 001 page rows
- issue_page_sequence in Publication Encounter Profile
- projected issue_page_sequence in measures_encounter_def.metadata.encounter_profile

The seated launch page sequence is:

1. Cover
2. Editor's Letter
3. Contents
4. Cover Story
5. Dispatches
6. Launch Encounter

The model is valid, but FREE does not consume it yet.

The current /undrifted renderer still behaves as a single publication landing page assembled from local component regions.

The next valid seam is renderer implementation.

## ALIGNED

Do not create new publication authority.

Do not change Issue 001 content authority.

Do not implement flipbook animation.

Do not implement library, contributors, social registry, feed, or comments.

This OAR makes FREE consume the already-seated issue-page model.

Issue Pages remain registry objects.

Routes remain routing surfaces only.

The renderer must read seated state and render it without inventing page sequence.

Authority order remains:

Codex -> Field -> Measures -> Publication Registry -> Publication Release -> Issue Pages -> Encounter Projection -> FREE

## ROUTED

### 1. Inspect Issue Page data

Read live DB state for:

- measures_publication_issue_page rows for publication_key = undrifted and issue_id = undrifted_issue01
- measures_encounter_def.metadata.encounter_profile.issue_page_sequence
- current release_state and visibility_state for each page
- route_path for each page
- asset_id, dispatch_key, banner_asset_id for each page

Return any mismatch before implementing.

### 2. Add issue-page data to resolver path

Extend the registry resolver or safe adjacent query path so FREE can access Issue Page rows.

Allowed approaches:

- query measures_publication_issue_page in registryResolver.ts
- attach issue_pages to encounter data
- use projected issue_page_sequence plus page rows
- preserve existing fallback rendering if page data is missing

Disallowed:

- hardcode issue_page_sequence in frontend
- hardcode page content
- infer page order from component order
- use slug as authority

### 3. Render /undrifted from Issue Page sequence

Update UnDriftedIndex so /undrifted renders the active Issue 001 sequence from the seated issue_page_sequence.

Launch behavior:

- Cover page renders as opening issue surface
- Editor's Letter renders as issue front matter teaser or full section depending current route support
- Contents renders issue table of contents from issue_page_sequence
- Cover Story renders as held or available depending release_state
- Dispatches renders published dispatches
- Launch Encounter renders the AI Operations Assessment threshold

Do not remove existing content sections until equivalent issue-page-driven rendering is available.

If full page rendering cannot safely be completed, return a partial implementation and blocker.

### 4. Respect release_state

Page 4 Cover Story currently has release_state = held because Paragraph publication is blocked.

Renderer must not expose it as a clickable published page until released.

Allowed rendering while held:

- show cover story as coming soon
- show registered/held status subtly
- keep cover visual non-clickable
- route disabled with honest unavailable state

Disallowed:

- make held cover story clickable
- route to unpublished Paragraph URL
- mark draft content as published

### 5. Prepare held routes without overbuilding

Prepare the route model if safe:

- /undrifted/issue-001
- /undrifted/issue-001/editors-letter
- /undrifted/issue-001/ai-isnt-broken-systems-are

If routing requires new EncounterSurface union values and renderer branches, either implement minimally or return a route blocker.

Do not implement route behavior by catch-all hacks.

Do not break /undrifted.

### 6. Keep flipbook held

Do not implement page-turn animation.

However, renderer structure should not block future flipbook behavior.

If useful, structure components so future renderer can wrap the same issue-page sequence in a flipbook presentation layer.

### 7. Verify launch rendering

Verify:

- /undrifted still loads
- issue page sequence appears in order
- issue metadata still correct
- Editor's Letter appears in sequence
- Contents reflects available issue pages
- Cover Story held state is honest
- Dispatch links still work
- Assessment CTA still routes to /ai-operations-assessment
- desktop/laptop/tablet/mobile
- no console errors
- no horizontal overflow

## EXECUTOR ROLE

Executor may:

- inspect DB issue-page state
- update resolver to read issue pages
- update types for issue-page payload
- update UnDriftedIndex rendering
- add minimal route support if safe
- return blockers for route implementation
- preserve existing visual profile
- verify responsive rendering

Executor may not:

- create new issue-page authority
- alter publication registry content
- alter dispatch publication standing
- publish to Paragraph
- mark held pages as released
- implement flipbook animation
- implement contributor/social/feed/library scope
- hardcode page sequence or article content

## VALIDATION

Return OAR1 with:

- issue-page data inspection
- resolver changes
- renderer changes
- route status
- release_state handling
- /undrifted verification
- responsive verification
- blockers, if any

## EXPECTED OAR1

OAR/OAR1/publication/oar1_render_issue001_through_issue_page_model_v1.meta.md

## CLOSE

Issue Pages are seated.

FREE now renders from the issue-page model.

Flipbook waits.

Launch stays scoped.

Publication governs.

Encounter projects.

FREE renders.
