---
document_type: oar2
authority_level: working
document_scope: issue001_campaign_generation
title: OAR2 - Correct Assessment Video Derivative With Real Media
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

Correct a fabrication surfaced by the operator: the "Assessment — Short Video Narration Script"
derivative registered by `oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1`
assumed no real narration audio existed for the assessment orientation video. The operator has
confirmed the opposite — all campaign-relevant videos already have real voiceover narration
(some with captions), produced through an existing pipeline ("agent opus," per operator), except
one talking-head video (`crystal_seat_orientation.mp4`) which is out of this OAR2's scope.

This is a conversationally-authorized correction, not a filed OAR2 the operator handed over by
path — written here to preserve this session's governance trail (OAR2 authority / OAR1 proof)
for a real, non-trivial DB and Storage change.

---

# OBSERVED

- `ffmpeg` was not installed; installed via winget (`Gyan.FFmpeg`, full build, includes a
  compiled-in `whisper` filter).
- `measures_media_map.storage_bucket = 'measures-media'` does not correspond to a Supabase
  Storage bucket — it resolves via Cloudflare R2 (`src/shared/media/runtimeMediaUrl.ts`,
  `VITE_R2_PUBLIC_BASE_URL`). This was discovered only after a Supabase Storage download attempt
  404'd with "Bucket not found."
- `assessment_report_orientation.mp4` (80.375s, 1080p, stereo AAC) has real spoken narration and
  burned-in captions, confirmed by downloading the file and running it through `ffmpeg`'s
  `whisper` filter (model: `ggml-base.en`, downloaded from the official whisper.cpp HuggingFace
  repo) plus direct frame extraction/visual review.
- The previously-registered `undrifted_issue01_page06_launch_encounter_video_short_narration_v1`
  derivative held ~50 words of invented narration text — never matched to the real video.

---

# ROUTED

## 1
Transcribe the real audio of `assessment_report_orientation.mp4` and register it as a `transcript`
derivative, cleaned of ASR artifacts only — no content added or altered beyond what whisper
actually heard.

## 2
Identify a real, timestamp-justified excerpt (a complete thought, not an arbitrary duration) and
cut it with `ffmpeg`, preserving the original video and audio track — no re-narration, no TTS.

## 3
Upload the produced cut to Supabase Storage (the correct bucket this time — confirmed via
`storage.buckets`) and register it as a `measures_media_map` row.

## 4
Correct the existing `video_short` derivative to reference the real cut and real transcript
excerpt instead of the fabricated text, with the correction documented in `metadata`, not
silently overwritten.

## 5
Update the corresponding Campaign Asset title and the YouTube Distribution Asset's Buffer
`payload` to match. Status remains `draft` throughout — nothing scheduled, nothing published.

## 6
Do not fabricate a corresponding fix for the reel script derivative (Issue Promotion) — it was
never grounded in a single real narrated source, so no equivalent correction applies. Leave it as
a disclosed script-only gap.

---

# VALIDATION

Return: real transcript registered, real cut produced and uploaded, derivative/campaign
asset/distribution payload all corrected to reference real media, review file and asset registry
updated to reflect the correction transparently (not silently).

# STOP CONDITION

The assessment video derivative reflects what the source video actually contains. No fabricated
narration remains in the registry for this asset.
