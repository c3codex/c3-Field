---
document_type: technical_validation_report
authority_level: operational
document_scope: buffer_youtube_media_compatibility
title: Buffer YouTube "Invalid post" Root Cause — Canonical Media Orientation
status: root_cause_confirmed_normalized_copies_verified_awaiting_upload_authorization
related_evidence: OAR/OAR1/publication/oar1_implement_buffer_native_publication_execution_v1.meta.md
operator: op044
system: measures_registry
executor: Claude
date: 2026-07-13
---

# Buffer YouTube "Invalid post" — Root Cause Assessment

## Scope

Investigated why Buffer rejected 3 of 5 canonical YouTube activation drafts with `UnexpectedError: Invalid
post` (per `OAR/OAR1/publication/oar1_implement_buffer_native_publication_execution_v1.meta.md`, executed by
Codex 2026-07-13):

- `ai_isnt_broken_intro.mp4` — **failed**
- `obsidian_chamber_orientation.mp4` — **failed**
- `assessment_report_orientation.mp4` — **failed**
- `about_measures_registry.mp4` — succeeded (Buffer update ID `6a548d6c00357d0bb66cd575`)
- `crystal_seat_orientation.mp4` — succeeded (Buffer update ID `6a548d6d98dc0120703ef8e5`)

All five source files were downloaded fresh from their live, registered R2 URLs and probed directly — not
assumed from prior notes.

## Root Cause

**Frame orientation.** All three failed files are `1920×1080` landscape (16:9). Both successful files are
non-landscape — `about_measures_registry.mp4` is `1080×1920` vertical (9:16), `crystal_seat_orientation.mp4` is
`640×640` square (1:1). This is a clean, total separation: every failure is landscape, every success is not.

This is consistent with YouTube Shorts' platform requirement that Shorts content be vertical or square —
landscape 16:9 source cannot be classified as a Short, and Buffer's generic `Invalid post` error is the
expected shape of an unhelpful passthrough of that platform-side rejection (Buffer's API does not surface the
underlying YouTube validation reason).

**Ruled out, with evidence:** `about_measures_registry.mp4` (a success) shares literally every other technical
characteristic with the three failures — same H.264 profile/level, same pixel format, same color metadata
(present, full BT.709 tags), same audio codec/sample-rate/channel-layout, same lack of a video-stream encoder
tag, same non-integer `avg_frame_rate` artifact, same moov-before-mdat (faststart) placement. The only variable
that differs between `about_measures_registry.mp4` and the three failures is orientation. This isolates
orientation as sufficient, on its own, to explain the observed split — everything else is noise.

`crystal_seat_orientation.mp4` is a separately-encoded file (different encoder pipeline, mono 44.1kHz audio,
H.264 level 30, no color metadata block, B-frames present) — its success is also consistent with the
orientation hypothesis (square, non-landscape) even though its overall encoding profile differs from the other
four in other ways not shared with the failures.

## Technical Comparison Table

| Parameter | intro (FAIL) | obsidian (FAIL) | assessment (FAIL) | about (PASS) | crystal (PASS) |
|---|---|---|---|---|---|
| Container | mov/mp4 (isom) | mov/mp4 (isom) | mov/mp4 (isom) | mov/mp4 (isom) | mov/mp4 (isom) |
| Video codec | h264 | h264 | h264 | h264 | h264 |
| H.264 profile | High | High | High | High | High |
| H.264 level | 40 | 40 | 40 | 40 | 30 |
| Pixel format | yuv420p | yuv420p | yuv420p | yuv420p | yuv420p |
| **Resolution / orientation** | **1920×1080 landscape** | **1920×1080 landscape** | **1920×1080 landscape** | **1080×1920 vertical** | **640×640 square** |
| Declared frame rate | 24/1 | 24/1 | 24/1 | 24/1 | 25/1 |
| avg_frame_rate (computed) | 623000/25917 (~24.04) | 289750/12073 (~24.00) | 24/1 (clean) | 2520000/104959 (~24.01) | 25/1 (clean) |
| B-frames | 0 | 0 | 0 | 0 | 2 |
| Video bitrate | 7,463,750 | 7,563,467 | 7,440,576 | 7,486,558 | 1,361,781 |
| Color metadata (range/space/transfer/primaries) | tv/bt709/bt709/bt709 | tv/bt709/bt709/bt709 | tv/bt709/bt709/bt709 | tv/bt709/bt709/bt709 | absent |
| Audio codec | aac LC | aac LC | aac LC | aac LC | aac LC |
| Audio sample rate | 48000 Hz | 48000 Hz | 48000 Hz | 48000 Hz | 44100 Hz |
| Audio channels | 2 (stereo) | 2 (stereo) | 2 (stereo) | 2 (stereo) | 1 (mono) |
| Video/audio duration delta | −0.024s | +0.036s | +0.034s | +0.022s | +0.012s |
| Moov before mdat (faststart) | Yes | Yes | Yes | Yes | Yes |
| Video-stream encoder tag | none | none | none | none | Lavc59.37.100 libx264 |
| File size | 24.98 MB | 47.14 MB | 77.24 MB | 101.58 MB | 7.18 MB |
| Rotation/matrix flag | none | none | none | none | none |

No rotation/orientation side-data flag was present on any of the five files — none relies on a player-applied
rotation matrix; the coded dimensions are the true display dimensions in every case.

## Recommended Normalization Specification

Reframe the three landscape sources to vertical (1080×1920), matching `about_measures_registry.mp4`'s proven
orientation class as closely as possible, using **letterbox/pillarbox padding only — no crop**:

- Scale to `1080` width, preserving aspect ratio (yields ~1080×608 for 16:9 source).
- Pad top and bottom to reach `1080×1920`, black fill, content centered — every original pixel preserved,
  nothing cropped out of frame.
- Re-encode: H.264 High profile, level 4.0, yuv420p, full BT.709 color tags (matching the working file's
  profile), AAC stereo 48kHz, faststart.
- Original audio track, timing, and narration untouched — the encode is a container/frame reformatting, not a
  re-edit. No trim, no cut, no caption, no branding change, no title change.

## Normalized Canonical Copies Produced

| Source | Normalized file | Dimensions | Duration | Status |
|---|---|---|---|---|
| `ai_isnt_broken_intro.mp4` | `ai_isnt_broken_intro__platform_normalized_9x16_v1.mp4` | 1080×1920 | 25.941s (unchanged) | Verified valid |
| `obsidian_chamber_orientation.mp4` | `obsidian_chamber_orientation__platform_normalized_9x16_v1.mp4` | 1080×1920 | 48.256s (unchanged) | Verified valid |
| `assessment_report_orientation.mp4` | `assessment_report_orientation__platform_normalized_9x16_v1.mp4` | 1080×1920 | 80.341s (unchanged) | Verified valid |

All three currently sit in local scratchpad storage
(`AppData/Local/Temp/claude/.../scratchpad/video_production/normalized/`) — **not yet uploaded to R2, not yet
registered in `measures_media_map`, not yet supplied to Buffer.** Uploading/registering/re-attempting the
Buffer draft is a distinct next step requiring explicit authorization, consistent with this session's practice
of not silently advancing state past what was actually asked.

## Confirmation

- Canonical source files were not altered, overwritten, or renamed in storage.
- No `measures_media_map` record was modified.
- No narration, timing, editorial content, branding, or title was changed — only frame padding and
  re-encoding to a platform-compatible container.
- Visual sequence fully preserved — the padding operation adds bars, it does not crop or reinterpret any
  original frame content.
