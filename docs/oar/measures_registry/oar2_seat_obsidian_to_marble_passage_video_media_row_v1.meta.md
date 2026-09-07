---
document_type: oar2
authority_level: launch_repair
document_scope: passage_media_seating
title: OAR2 - Seat Obsidian to Marble Passage Video Media Row
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat Obsidian to Marble Passage Video Media Row

## PURPOSE

Seat the missing media row for the Obsidian to Marble passage video.

This repairs the known gap in the post-assessment flow:

assessment
  -> contact capture
  -> report
  -> passage media
  -> MAP encounter

Nothing is invented.

## OBSERVED

OAR1 confirmed:

- obsidian_to_marble_passage_video surface is seated
- route/surface assignment exists
- transition into passage exists
- transition out to map_integrity_governance exists
- renderer advances to MAP
- media row was not found in migrations

Current gap:

The passage may render placeholder text because the video media row is not seated.

## REQUIRED ACTIONS

1. Locate the approved Obsidian to Marble passage video asset.
2. Confirm its storage location:
   - R2
   - Supabase storage
   - existing public URL
3. Seat a `measures_media_map` row for:

media_role:
  before_the_pathway_obsidian_to_marble_passage_video

surface / encounter:
  obsidian_to_marble_passage_video

4. Ensure row is active/public/released according to existing media-map conventions.
5. Do not invent a new video.
6. Do not replace approved media without operator confirmation.
7. Do not change assessment, report, MAP, Stripe, legal, or email behavior.

## VALIDATION

Return OAR1 evidence showing:

- approved video asset identified
- storage path or public URL confirmed
- media row inserted or updated
- media_role matches renderer expectation
- row active/released
- passage video renders
- continue advances to map_integrity_governance
- build/migration validation passes
- no unrelated mutations

## NOTCHAZZ FLAGS

Raise NotChazz if:

- unapproved media is used
- media_role does not match renderer expectation
- passage surface is renamed
- assessment/report/MAP flow changes
- Stripe behavior changes
- registered_runtime becomes active route authority
- operator is governed instead of the work body

## CLOSE

Seat Obsidian to Marble passage video media.

Then verify full post-assessment flow in browser.
