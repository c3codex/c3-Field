---
document_type: oar1
authority_level: publication_release
document_scope: buffer_draft_publication
title: OAR1 - Publish Approved Issue001 Buffer Drafts
closes: OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md
operator: op044
system: measures_registry
executor: Cody
date: 2026-07-09
---

# OAR1 - Publish Approved Issue001 Buffer Drafts

## Summary

Executed the saved OAR2 from `OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md`.

5 approved Buffer draft IDs were verified before publication. YouTube remained held because no Buffer
YouTube channel or draft ID exists. 4 approved drafts published successfully. 1 approved Instagram
dispatch draft failed at Buffer/Instagram publication validation because the media aspect ratio is not
accepted for the selected Instagram post type.

No content edits, derivative regeneration, publication asset changes, campaign sequencing changes, or
distribution payload mutations were performed. The first publish attempt was interrupted after 3 posts
had already been sent; recovery verified live Buffer state and retried only the 2 remaining draft IDs.

## Preflight

| Check | Result |
|---|---|
| Saved OAR2 read | `OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md` |
| Expected OAR1 path | This file |
| Buffer credential | `BUFFER_SOCIAL_KEY` from `.dev.vars`, value not exposed |
| Approved Buffer drafts found | 5/5 |
| YouTube | Held; no Buffer channel or draft ID |
| Held assets | Not published |

## Buffer Publication Results

| Distribution Asset | Buffer post id | Status | Published at | Platform URL / error |
|---|---|---|---|---|
| `undrifted_issue001_da_cover_story_instagram_v1` | `6a5002b7a9e4eacc31025340` | `sent` | `2026-07-09T21:58:48.216Z` | `https://www.instagram.com/reel/DalofxJmckI/` |
| `undrifted_issue001_da_cover_story_quote_linkedin_v1` | `6a5002b8321614183a1f1ff5` | `sent` | `2026-07-09T21:56:23.513Z` | `https://www.linkedin.com/feed/update/urn:li:share:7481103989191811072` |
| `undrifted_issue001_da_cover_story_quote_x_v1` | `6a5002b83c48e2c7b33feafa` | `sent` | `2026-07-09T21:56:12.416Z` | `https://x.com/2063041676583583744/status/2075338250911183123` |
| `undrifted_issue001_da_dispatches_linkedin_v1` | `6a5002d93c48e2c7b33feba4` | `sent` | `2026-07-09T22:06:10.564Z` | `https://www.linkedin.com/feed/update/urn:li:ugcPost:7481106451558662144` |
| `undrifted_issue001_da_dispatches_instagram_v1` | `6a5002d83c48e2c7b33feb8c` | `error` | null | `Instagram doesn't support the aspect ratio of this media. Instagram supports aspect ratios between 4:5 and 1.91:1 for feed posts, and 9:16 for Stories and Reels.` |

## Registry Evidence Written

Live `measures_publication_distribution_asset.metadata` was updated for the 4 published rows with:

```json
{
  "published_at": "<Buffer sentAt>",
  "platform_post_id": "<platform id>",
  "platform_url": "<platform URL>",
  "buffer_post_id": "<Buffer post id>",
  "buffer_post_status": "sent",
  "executor": "Cody",
  "execution_mode": "buffer",
  "publication_status": "published",
  "publication_source_oar2": "OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md"
}
```

The failed Instagram dispatch row was updated with:

```json
{
  "buffer_post_id": "6a5002d83c48e2c7b33feb8c",
  "buffer_post_status": "error",
  "publication_status": "failed",
  "publication_error": "Instagram does not support the aspect ratio of this media. Instagram supports aspect ratios between 4:5 and 1.91:1 for feed posts, and 9:16 for Stories and Reels.",
  "executor": "Cody",
  "execution_mode": "buffer",
  "publication_source_oar2": "OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md"
}
```

Repo migration record:
`supabase/migrations/20260709220610_record_issue001_buffer_publication_results_v1.sql`.

## Preserved Boundaries

| Boundary | Result |
|---|---|
| Publication Assets | Untouched |
| Derivative Assets | Untouched |
| Campaign sequencing | Untouched |
| Registry authority | Preserved; evidence written to metadata |
| Distribution payloads | Untouched |
| YouTube | Not published |
| Held assets | Not published |
| Content edits | None |
| Schedule edits | None |
| Derivative regeneration | None |

## Warnings

The Instagram dispatch draft could not be published by Buffer because Instagram rejected the media aspect
ratio. A follow-up OAR2 is required to authorize any correction, replacement media, crop, or alternate
Instagram format. No corrective edit was made under this publication-only OAR.

## Stop Condition

Partially satisfied:

- 4 approved Buffer drafts are live.
- Evidence was written for all attempted approved drafts.
- Registry remains authority.
- 1 approved draft remains not live due to platform validation failure and is recorded as `publication_status: failed`.
