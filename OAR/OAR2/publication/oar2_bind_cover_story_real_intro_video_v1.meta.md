---
document_type: oar2
authority_level: working
document_scope: issue001_campaign_generation
title: OAR2 - Bind Cover Story Real Intro Video
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

Conversationally-authorized correction, written to preserve this session's OAR2/OAR1 governance
trail for a real, non-trivial DB change. The operator identified that an existing site video is
already a real, produced match for the cover story campaign's still-pending hero-video gap.

---

# OBSERVED

The site's existing intro video, `ai_isnt_broken_intro.mp4` (registered in `measures_media_map`
as `intro_hook_video`, registry_key `measures_registry_root` — not newly uploaded), was
identified by the operator as matching the cover story. Verified via download, `ffmpeg` whisper
transcription, and frame extraction before acting:

- 25.941s, 1080p, real narration.
- Narration ends verbatim: "AI is not broken. Systems are." — the cover story's own headline.
- Visual: a crystalline triangular emblem with an eight-pointed star, matching the same
  eight-pointed-star motif already present in the cover story hero image
  (`ai_isnt_broken_landing.webp`).

The "Cover Story Hero Crop" derivative has sat `generation_status: pending` all session — no
image-editing tool exists to produce a real crop. This video is real, superior, already-produced
media for the same distribution slots.

---

# ROUTED

## 1
Register the real video as a new `video_short` Derivative Asset, referencing the cover story
article as its canonical Publication Asset. Transcript cleaned of ASR artifacts only.

## 2
Register a new Campaign Asset bound to this derivative, distinct from the existing (still-pending)
hero-crop Campaign Asset — do not delete or overwrite the old one.

## 3
Repoint the Website Feature and Instagram Post Distribution Assets (previously bound to the
pending-crop Campaign Asset) to the new real-video Campaign Asset, and update their Buffer
payloads accordingly.

## 4
Leave the original hero-crop derivative and Campaign Asset registered and `pending` —
superseded for these two distribution channels, not deleted, in case a real crop is ever produced.

---

# VALIDATION

Return: new derivative registered, new Campaign Asset registered, both Distribution Assets
repointed and payloads updated, original crop derivative left intact and disclosed as superseded
(not deleted). No new media upload. No scheduling. No publishing.

# STOP CONDITION

The Cover Story's website and Instagram distribution slots reference real, accurate,
already-produced media instead of an unfulfilled crop concept. Nothing drifts.
