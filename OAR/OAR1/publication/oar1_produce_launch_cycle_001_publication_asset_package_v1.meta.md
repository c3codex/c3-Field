---
document_type: oar1
authority_level: operational
document_scope: launch_cycle_001_publication_asset_production
title: OAR1 - Produce Launch Cycle 001 Publication Asset Package
operator: op044
system: measures_registry
executor: Claude
status: closed
disposition: partially_ready_specific_creative_items_held
closes: OAR/OAR2/publication/oar2_produce_launch_cycle_001_publication_asset_package_v1.meta.md
related_deliverable: docs/_source/codex/publications/launch_cycle_001_publication_asset_package_v1.meta.md
related_publication_family: launch_cycle_001
date: 2026-07-13
---

# OAR1: Produce Launch Cycle 001 Publication Asset Package

## Summary

19 of 20 required creative assets were produced, technically verified, and delivered: all 10
Field Findings and unDrifted Response publication assets (landscape, square, story, quote,
discussion for each), all 5 Measures Registry evergreen stills, and 5 of 6 video derivatives
(intro captioned vertical, assessment primary and alternate clips, Obsidian primary clip, Crystal
primary clip). Full sidecar metadata and the Operator Approval Package are consolidated in
`launch_cycle_001_publication_asset_package_v1.meta.md`.

## What Was Produced

- Both registered section banners downloaded from Supabase Storage and their wordmark lockups
  and photographic art cropped for reuse (no redesign of registered identity).
- 10 Field Findings / unDrifted Response assets generated programmatically (PIL) from the
  approved copy and banner art, in the two distinct-but-related brand treatments (navy / forest
  green).
- 5 evergreen stills selected per the Phase 2 editorial inspection, cropped to final formats.
  Crystal Seat required a fresh extraction directly from raw source, because every previously
  extracted still had burned-in captions; a clean frame was found at t=33s.
- 5 video derivatives rendered and `ffprobe`-verified (codec, resolution, duration, no
  truncation).

## Defects Found and Corrected Before Delivery

Two rendering defects were caught by visual inspection, not just technical probing, and fixed
before delivery rather than shipped:

1. The first captioned intro render used ffmpeg's default SRT-to-ASS conversion, which has no
   explicit `PlayResX`/`PlayResY` and renders wildly oversized text against a 1080×1920 frame.
   Fixed by hand-building an ASS file with the correct PlayRes.
2. The first assessment primary/alt clip renders added a subtitle overlay on top of source video
   that already had its own well-designed burned-in captions, producing an unreadable double
   caption. Fixed by re-rendering as clean trims with no added overlay.

Both are documented in the asset package so the same mistake is not repeated on future derivative
work from these sources.

## Held

The About Measures Registry primary video derivative and full-sentence verification of its two
evergreen stills are held. `about_measures_registry.mp4` (104.98s) has not been transcribed and
appears to be a multi-beat infographic montage rather than continuous narration; cutting a
"coherent" short clip without reviewing it end-to-end would be an arbitrary trim, which the
governing OAR2 explicitly warned against. This is reported as genuinely outstanding, not
completed.

## Not Performed (Out of Scope)

Upload to permanent storage (Supabase Storage / R2), canonical asset registration, Buffer
scheduling, and any publication-operations work — per the Claude/Cody boundary this OAR2
reaffirmed, and because no storage-upload tool was available in this session regardless.

## Disposition

**PARTIALLY READY — SPECIFIC CREATIVE ITEMS HELD.** See
`docs/_source/codex/publications/launch_cycle_001_publication_asset_package_v1.meta.md` for the
full Operator Approval Package, per-asset sidecar metadata, checksums, and file locations.
