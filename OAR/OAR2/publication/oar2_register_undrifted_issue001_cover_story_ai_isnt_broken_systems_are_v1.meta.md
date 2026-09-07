---
document_type: oar2
authority_level: working
document_scope: publication_asset_registration
title: OAR2 - Register unDrifted Issue 001 Cover Story AI Isnt Broken Systems Are
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
  - cover-story
  - article-registration
  - ai-isnt-broken-systems-are
  - paragraph
  - publication-dispatch
---

# OAR2 - Register unDrifted Issue 001 Cover Story AI Isnt Broken Systems Are

## OBSERVED

unDrifted Issue 001 now has a launch-ready publication encounter surface.

The current cover story region is visually strong but has no article function.

The operator has approved the cover story draft concept:

AI Isnt Broken. Systems Are.

The cover story should become a registered article asset and publication dispatch candidate.

The article should use the same image as the Paragraph banner for visual continuity.

The article should include a Connect / subscribe invitation at the close, plus a pathway to the AI Operations Assessment.

This OAR registers the cover story as a governed publication asset and prepares it for Paragraph/publication flow.

## ALIGNED

The cover story is editorial authority, not frontend decoration.

The cover story must be registered before the cover region becomes meaningfully clickable.

Do not hardcode the article into the renderer.

Do not invent a published Paragraph URL unless it exists.

Do not overwrite existing published dispatch records without explicit operator instruction.

Publication Registry owns publication identity.

Publication Dispatch owns published article/dispatch records.

Asset Registry owns source article asset standing.

Encounter Projection renders selected issue state.

FREE renders projection.

## ROUTED

### 1. Create registered article asset

Create a markdown article asset for:

Title: AI Isnt Broken. Systems Are.
Role: Issue 001 Cover Story
Publication: unDrifted
Issue: Issue 001
Status: registered_draft or ready_for_publication
CTA route: /ai-operations-assessment
Connect route or subscribe surface: existing unDrifted subscription/capture surface if available

Use the approved draft as source body.

Include final section:

- invitation to Connect / subscribe
- invitation to continue into the AI Operations Assessment
- no certification, conversion, funding, or NSF acceptance claims

### 2. Bind banner image

Use the same image intended for the Paragraph banner.

If the exact banner asset already exists in Assets/Registry or media mapping, bind to that existing asset.

If it does not exist, return blocker and identify expected asset path/name.

Do not duplicate binary media if a registered banner already exists.

### 3. Update Asset Registry

Add the cover story article asset to the registered asset registry.

Required asset metadata:

- asset_id
- asset_type: article
- publication_key: undrifted
- issue_id: undrifted_issue01
- issue_role: cover_story
- title
- status
- source_path
- banner_asset_id or media reference
- cta_route: /ai-operations-assessment
- connect_invitation: true

### 4. Prepare Publication Dispatch entry

Prepare DB publication dispatch standing for the cover story.

If DB mutation is in scope and safe, create a pending or draft dispatch row in `measures_publication_dispatch`.

If not safe, return a migration or blocker.

Do not mark as published unless a real Paragraph URL exists.

Required dispatch shape:

- publication_key: undrifted
- dispatch_key: ai_isnt_broken_systems_are_dispatch_v1
- issue_number: ISSUE 001
- issue_role: cover_story
- title: AI Isnt Broken. Systems Are.
- status: draft or pending_publication
- article_url: null unless published
- dispatch_body: article body or approved excerpt according to existing table convention
- cta_route: /ai-operations-assessment where supported

### 5. Do not alter live /undrifted feature selection yet

Do not make the cover region clickable in this OAR unless a valid route exists.

Do not change `featured_article_set`.

Do not remove Agents With Keys or Fables and Myths.

Do not alter Publication Encounter Profile.

This OAR registers and prepares the cover article only.

A later OAR may wire the cover story region to the published article route after Paragraph publication or dispatch route seating is confirmed.

### 6. Verify publication standing of existing articles

Read-only verify whether these existing articles are already published in DB and whether they have live Paragraph URLs:

- Agents With Keys
- Fables and Myths
- Agents of Chaos
- Structural Drift
- Computational Systems Governance / NSF pitch if present
- Measures Registry launch article if present

Return their standing in OAR1.

## EXECUTOR ROLE

Executor may:

- create the registered markdown article asset
- update asset registry
- bind existing banner/media reference
- prepare or create draft publication dispatch row
- create migration if required
- verify existing article publication standing
- return blocker if media asset or route is missing

Executor may not:

- invent Paragraph URLs
- mark unpublished content as published
- overwrite live article selection
- hardcode cover article route into frontend
- implement click behavior before route authority exists
- change /undrifted layout
- expand into contributor/social/feed scope

## VALIDATION

Return OAR1 with:

- article asset path
- asset registry update
- banner/media binding status
- dispatch row or migration status
- publication status of existing articles
- whether cover story has a valid route yet
- blockers, if any

## EXPECTED OAR1

OAR/OAR1/publication/oar1_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1.meta.md

## CLOSE

The cover story must become a registered article before the cover becomes a clickable feature.

Register first.
Publish second.
Wire route third.

unDrifted remains governed publication.
FREE renders only seated state.
