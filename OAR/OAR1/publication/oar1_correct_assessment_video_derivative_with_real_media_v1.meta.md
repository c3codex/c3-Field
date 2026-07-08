---
document_type: oar1
authority_level: proof
document_scope: issue001_campaign_generation
title: OAR1 - Correct Assessment Video Derivative With Real Media
closes: OAR/OAR2/publication/oar2_correct_assessment_video_derivative_with_real_media_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Correct Assessment Video Derivative With Real Media

## Summary

A fabrication was caught and fixed. The prior OAR2 invented ~50 words of narration text for the assessment video, assuming no real voiceover existed. The operator corrected that assumption directly. This OAR2 installed `ffmpeg`, discovered the video actually lives on Cloudflare R2 (not Supabase Storage, despite the DB column name), transcribed its real narration, cut a real 26.871-second excerpt with the original audio intact, uploaded it, and rewired the derivative/campaign-asset/distribution-payload chain to point at the real thing instead of invented text.

---

## 1. Tooling Installed

`ffmpeg` 8.1.2 (full build, `Gyan.FFmpeg` via winget) — includes a compiled-in `whisper` filter (whisper.cpp), which was not anticipated but turned out to be the key capability: it transcribes existing audio directly inside ffmpeg, no separate service needed. Model: `ggml-base.en` (147MB, downloaded from the official whisper.cpp HuggingFace repo).

**Environment note**: MSYS2/Git Bash auto-converts path-like arguments when calling native Windows executables, which broke the first two attempts at passing the model path into the `-af whisper=model=...` filter string (colons in `C:\` got mangled). Fixed by copying the model into the working directory and referencing it by bare filename with `MSYS2_ARG_CONV_EXCL="*"` set, avoiding the conversion entirely.

## 2. A Real Bug Found Along the Way

Attempting to download `crystal_seat_orientation.mp4` and later `assessment_report_orientation.mp4` from Supabase Storage (using the pattern that worked for image banners earlier this session) returned `{"statusCode":"404","error":"Bucket not found"}`. Investigation (`storage.buckets` query, then `grep` for the bucket name in `src/`) found the actual answer: `measures_media_map.storage_bucket = 'measures-media'` isn't a Supabase bucket at all — `src/shared/media/runtimeMediaUrl.ts` resolves it through Cloudflare R2 via `VITE_R2_PUBLIC_BASE_URL` (`https://media.c3field.online`, found in `.env.production`). This is pre-existing application behavior, not something this OAR2 introduced — documented here because it will trip up the next person who assumes `storage_bucket` always means Supabase Storage.

## 3. Real Transcription and Review

Downloaded and reviewed, via `ffprobe` metadata + `whisper` transcription + extracted frames:

| Video | Duration | Confirmed |
|---|---|---|
| `crystal_seat_orientation.mp4` | 39.88s | Real talking-head video, dark hexagonal "crystal" backdrop, burned-in captions synced to speech. Out of scope for this OAR2 (operator flagged it separately) — reviewed only to confirm the pipeline works. |
| `assessment_report_orientation.mp4` | 80.375s | Real spoken narration ("agent opus"-style dark/gold data-panel visuals) with burned-in captions. **This is the video the fabricated derivative claimed to be about.** |
| `questions_ungoverned_systems_cannot_answer.mp4` | 146.26s | Same visual identity, real narration. Not tied to any registered Publication Asset (general landing media, not Issue-001-scoped) — transcribed for review and logged in the derivatives review file, but **no derivative row was created for it**, since the derivative model requires a canonical Publication Asset to reference and none exists for this video.

## 4. Correction Applied

- **New `transcript` derivative** (`undrifted_issue01_page06_launch_encounter_transcript_v1`): the full 80s narration, cleaned of ASR artifacts only (e.g., "un-struck" → "unstructured") — no content added or altered beyond what whisper actually transcribed.
- **Real excerpt selected**: 0:00–26.871s, chosen because it's a genuine segment boundary in the transcript (a complete thought — problem statement through brand mention), not an arbitrary duration.
- **Real cut produced**: `ffmpeg -t 26.871 -c:v libx264 -crf 18 -c:a aac` — video and original audio both intact, no re-narration, no TTS. Verified via `ffprobe` (duration matches) and a frame check at 20s (burned-in caption "UNSTRUCTURED ENVIRONMENT, AI ACCELERATION" matches the transcript at that timestamp).
- **Uploaded** to `measures-registry/campaign_derivatives/undrifted_issue001_assessment_short_cut_v1.mp4` via the Supabase Storage REST API using `SUPABASE_SERVICE_ROLE_KEY` (found in `.dev.vars`, never printed to output). Verified publicly reachable (`HTTP 200`, correct `Content-Type`/`Content-Length`).
- **`video_short` derivative corrected**: `description` replaced with the real 0:00–26.871s excerpt text, `source_reference` points at the uploaded file, `metadata.correction_note` explicitly documents that this row previously held fabricated content and why it changed — the correction is disclosed in the data itself, not silently overwritten.
- **`measures_media_map` row added** for the new binary (the first genuinely new media upload in this campaign-derivative chain — every prior derivative only ever referenced pre-existing assets).
- **Campaign Asset title corrected** to "AI Operations Assessment — Short Cut (Real Excerpt)".
- **YouTube Distribution Asset payload corrected**: `body` now the real excerpt text, `media_references` points at the real uploaded file, `platform_notes` states plainly that this is a real, previewable cut.

## 5. What Was Deliberately Not Done

- **Reel script (Issue Promotion)** remains script-only. It was never grounded in one specific real narrated source the way the assessment video was — correcting it the same way isn't possible without inventing a new source-of-truth video, which is out of scope. Left as a disclosed gap, not silently ignored.
- **`questions_ungoverned_systems_cannot_answer.mp4`** was transcribed for review (per operator's "yes go ahead" covering both videos) but no derivative row was created for it — no Publication Asset exists for it to reference, and creating one would exceed this correction's scope.
- **`crystal_seat_orientation.mp4`** was downloaded and transcribed only to confirm the tooling pipeline works end-to-end on a genuinely different case (talking head vs. abstract data-panel visuals). No registry change was made for it — explicitly out of scope, per the operator's own framing of it as a separate case.

---

## Validation

| Check | Result |
|---|---|
| Real transcript registered | Yes — `undrifted_issue01_page06_launch_encounter_transcript_v1`, `generation_status: draft` |
| Real cut produced, audio intact | Yes — `ffprobe` confirms `duration=26.875`, both video and audio streams present |
| Cut uploaded and publicly reachable | Yes — `HTTP 200` on the public Storage URL |
| Derivative corrected, not silently | Yes — `metadata.correction_note` documents the fabrication and the fix |
| Campaign Asset + Distribution payload updated | Yes — verified via direct query |
| Review file updated to show the correction | Yes — `Assets/Registry/undrifted_issue001_campaign_derivatives_review.md` §"Video Short — Real Cut (corrected)" |
| Security advisors | Ran `get_advisors(type=security)` — no findings for any touched table |
| Nothing scheduled/published | Confirmed — all rows remain `status: draft` |

---

## Blockers

None. The reel script gap (§5) is disclosed, not blocking.

## Files Changed

```
Assets/Registry/asset_registry.md                                                          (Media Tooling Bridge section added)
Assets/Registry/undrifted_issue001_campaign_derivatives_review.md                          (Video Short section replaced with real content + preview link)
supabase/migrations/20260708212153_correct_undrifted_assessment_video_derivative_with_real_transcript_and_cut.sql
supabase/migrations/20260708212217_register_undrifted_assessment_short_cut_media_and_update_payload.sql
```

No renderer or `dist-registry/` changes.

## Deploy Note

DB and Storage changes are already live (the video is publicly reachable right now). Only the two registry/review markdown files plus this OAR1/OAR2 pair and the two migrations are local-only pending commit.
