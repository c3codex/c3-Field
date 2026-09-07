---
document_type: oar2
authority_level: working
document_scope: campaign_derivatives
title: OAR2 - Add Campaign Derivative Assets and Human AI Role Attribution
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

# OAR2 - Add Campaign Derivative Assets and Human AI Role Attribution

## OBJECTIVE

Complete the Campaign Registry by introducing a governed Derivative Asset layer and formal Human / AI role attribution.

This OAR completes the publication lifecycle without expanding launch scope.

No renderer work.

No Buffer automation.

No scheduling.

No UI.

Registry only.

---

# OBSERVED

Issue 001 now governs:

Publication Assets

↓

Campaign Assets

↓

Distribution Assets

This exposes one remaining architectural seam.

Many campaign assets are actually reusable derivatives of Publication Assets rather than campaign-specific objects.

Examples:

• excerpts
• pull quotes
• summaries
• carousel copy
• reel scripts
• narration
• transcript
• short-form video cuts
• thumbnails

These should not belong to Campaign Assets.

Campaigns should reference them.

In addition, current execution is thread-mediated.

Threads have functioned well operationally but are not themselves governed system objects.

Human and AI participation must therefore be represented explicitly within registry relationships rather than implied by conversation history.

---

# ALIGNED

Publication Assets remain canonical.

Derivative Assets remain canonical expressions of Publication Assets.

Campaign Assets reference Derivative Assets.

Distribution Assets reference Campaign Assets.

Threads are working surfaces.

Registry is authority.

Human and AI are actor classes.

Roles remain role-bound.

Profiles, Operators, and c3_keys remain distinct.

---

# ROUTED

## 1

Create Derivative Asset model.

Preferred table:

measures_publication_derivative_asset

Minimum fields:

derivative_key

publication_asset_id

derivative_type

title

description

language

format

duration

source_reference

generation_status

approval_status

release_state

metadata

created_at

updated_at

Derivative types should support at minimum:

excerpt

pull_quote

summary

carousel_copy

reel_script

video_short

video_long

audio_narration

transcript

thumbnail

hero

caption

alt_text

Do not duplicate Publication Assets.

Every derivative references exactly one canonical Publication Asset.

---

## 2

Add Human / AI actor attribution.

Do not model "roles" as campaign abstractions.

Actor Class is limited to:

Human

AI

Each governed action should support:

created_by_actor_class

created_by_actor_key

approved_by_actor_class

approved_by_actor_key

review_status

Future actor resolution may occur through:

Operator

Profile

c3_key

Role Profile

Do not invent those systems here.

Only prepare registry fields.

---

## 3

Campaign Asset update.

Campaign Assets should now reference:

publication_asset_id

derivative_asset_id

campaign_id

Campaign Assets no longer own generated content.

They orchestrate approved derivatives.

---

## 4

Distribution Asset update.

Distribution Assets continue to reference Campaign Assets.

Do not duplicate derivatives.

Distribution Assets remain projections.

---

## 5

Derivative generation standing.

Prepare registry support for future derivative generation.

Generation sources may include:

Human authored

AI assisted

AI generated

Human edited

Human approved

Store provenance only.

Do not implement generation workflows.

---

## 6

Optics preparation.

Optics should observe:

Publication Asset

↓

Derivative Asset

↓

Campaign Asset

↓

Distribution Asset

↓

Evidence

Optics must not model individuals as primary objects.

It observes governed knowledge relationships.

Seed fields only.

No analytics implementation.

---

## 7

Thread standing.

Record architectural standing:

Conversation Threads

status:

working_surface

authority:

none

Registry remains authority.

Threads remain operational collaboration surfaces until a governed Role Workbench exists.

No implementation required.

---

# VALIDATION

Return:

Derivative Asset model

Campaign updates

Distribution updates

Human / AI attribution

Optics updates

Thread standing

Migration files

No duplicated authority.

No duplicated media.

No Buffer scheduling.

No renderer changes.

---

# STOP CONDITION

The governed publication lifecycle becomes:

Publication Asset

↓

Derivative Asset

↓

Campaign Asset

↓

Distribution Asset

↓

Evidence

Human and AI participation become explicit registry relationships.

Threads remain collaboration.

Registry remains authority.

Nothing drifts.
