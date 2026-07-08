---
document_type: oar2
authority_level: working
document_scope: publication_campaign
title: OAR2 - Register Issue 001 Launch Campaign and Distribution Assets
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  free: frontend_replacement_encounter_environment
  optics: evidence
  oar2: observed_aligned_routed
---

# OBJECTIVE

Seat the first governed Publication Campaign using Issue 001 as canonical authority.

Campaigns are not social media schedules.

Campaigns are governed registry objects that organize the movement of registered knowledge assets through distribution channels while preserving canonical authority and provenance.

---

# OBSERVED

Issue 001 now contains:

• Cover
• Editor's Letter
• Cover Story
• Dispatches
• Launch Encounter

Registered assets now include:

• Articles
• Banners
• Images
• Existing website media
• Assessment assets

The publication now contains sufficient registered assets to build campaign assets directly from Issue 001.

---

# ALIGNED

Campaigns do not own content.

Issues own content.

Campaigns orchestrate registered assets.

Distribution platforms are projections.

Paragraph

Website

LinkedIn

Instagram

X

YouTube

Email

All remain downstream of Publication authority.

---

# ROUTED

## 1

Create Campaign Registry model.

Preferred table:

measures_publication_campaign

Minimum fields:

campaign_key

publication_key

issue_id

campaign_name

campaign_objective

status

release_state

start_date

end_date

metadata

---

## 2

Register Issue 001 Launch Campaign.

Campaign:

Issue 001 Launch

Relationship:

Issue

↓

Publication Assets

↓

Campaign

---

## 3

Inventory every registered asset already belonging to Issue 001.

Do not duplicate assets.

Inventory:

Articles

Images

Banners

Videos already registered on Measures Registry

Assessment media

Audio (if present)

Existing website media

Return missing media only.

---

## 4

Create Campaign Asset model.

Campaign Assets reference Publication Assets.

Examples:

Quote

Carousel

Reel

Video

Short

Email excerpt

Thumbnail

Hero graphic

Podcast clip

Campaign Assets do NOT own media.

They reference registered assets.

---

## 5

Create Distribution Asset model.

Distribution Assets represent platform-specific projections.

Examples:

Instagram Reel

LinkedIn Article

X Thread

YouTube Short

Newsletter

Website Feature

Paragraph Publication

Every Distribution Asset references:

campaign_asset_id

publication_asset_id

campaign_id

No duplicated authority.

---

## 6

Bind existing website media.

Do not upload new media.

Locate all registered media already used by:

Issue Cover

Editor's Letter

Cover Story

Assessment

Existing landing videos

Existing hero imagery

Bind those assets to Campaign Assets where appropriate.

---

## 7

Prepare Buffer-ready export.

Do NOT schedule.

Do NOT publish.

Generate campaign-ready objects.

One object per Distribution Asset.

Status:

draft

---

## 8

Optics preparation.

Do not track individuals.

Campaign evidence should attach to:

Publication Asset

Campaign Asset

Distribution Asset

Campaign

Prepare fields only.

No analytics implementation yet.

---

# VALIDATION

Return:

Campaign Registry

Campaign Assets

Distribution Assets

Media inventory

Missing assets

Buffer export readiness

Optics readiness

No duplicated assets.

No duplicated authority.

---

# STOP CONDITION

Issue 001 becomes the canonical campaign authority.

Future campaigns originate from registered Issues rather than platform-first content creation.

Buffer becomes a distribution projection rather than campaign authority.

Publication remains canonical.

Knowledge remains governed.

Nothing drifts.
