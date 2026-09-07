---
document_type: oar1
authority_level: proof
document_scope: issue001_campaign_generation
title: OAR1 - Bind Cover Story Real Intro Video
closes: OAR/OAR2/publication/oar2_bind_cover_story_real_intro_video_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Bind Cover Story Real Intro Video

## Summary

The operator pointed to an existing site video as a match for the cover story. Verified it directly (download, whisper transcription, frame extraction) before acting — confirmed the narration ends with the article's own headline and the visual shares the cover story hero image's star motif. Registered it as a real Derivative Asset, gave it its own Campaign Asset, and repointed the Website and Instagram distribution slots to it — resolving the "Cover Story Hero Crop" gap with real superior media rather than waiting indefinitely for a crop tool that doesn't exist.

---

## 1. Verification Before Acting

Located the video in `measures_media_map` (`ai_isnt_broken_intro.mp4`, `intro_hook_video`, already registered — not a new upload). Downloaded from Cloudflare R2, ran `ffprobe` (25.941s, 1080p, stereo audio), transcribed via `ffmpeg`'s `whisper` filter with timestamps, and extracted frames. Confirmed both claims independently: the narration's final line is the cover story's headline verbatim, and the visual (crystalline star emblem) matches the hero image's eight-pointed-star motif.

## 2. Registered

- New derivative: `undrifted_issue01_ai_isnt_broken_systems_are_article_v1_intro_video_v1` (`video_short`, `generation_status: draft`, `approval_status: pending` — registration is not the same as content approval, left for a future explicit approval step consistent with this session's pattern).
- New Campaign Asset: `undrifted_issue001_ca_cover_story_intro_video_v1`, bound to the new derivative.
- Repointed: `undrifted_issue001_da_cover_story_website_v1` and `undrifted_issue001_da_cover_story_instagram_v1` — `campaign_asset_id` updated, `payload` rewritten to reference the real video and its real transcript.

## 3. What Was Not Touched

The original `hero_v1` (image crop) derivative and its Campaign Asset remain registered, `pending`, untouched. They are not deleted — only superseded as the *active* choice for these two distribution channels. If a real crop is ever produced, it remains available to bind elsewhere.

---

## Validation

| Check | Result |
|---|---|
| New derivative registered | Yes, real content, verified transcript |
| New Campaign Asset registered | Yes, bound correctly |
| Both distributions repointed | Yes, verified via direct query |
| Payloads updated | Yes, both reference the real video and real copy |
| Original crop derivative preserved | Yes, untouched, `pending` |
| New media uploaded | No — video was already registered, existing site asset |
| Scheduling / publishing | None — all rows remain `draft` |
| Security advisors | Ran post-migration — no findings |

## Blockers

None.

## Files Changed

```
Assets/Registry/asset_registry.md                                                                    (Cover Story Real Intro Video section added)
Assets/Registry/undrifted_issue001_campaign_derivatives_review.md                                    (new section added, Held table annotated)
supabase/migrations/20260708220954_register_undrifted_cover_story_real_intro_video_derivative_v1.sql
supabase/migrations/20260708221014_bind_undrifted_cover_story_intro_video_to_campaign_and_distribution_v1.sql
```

No renderer or `dist-registry/` changes.

## Deploy Note

DB changes are already live. Only the two markdown files, this OAR1/OAR2 pair, and the two migrations are local-only pending commit.
