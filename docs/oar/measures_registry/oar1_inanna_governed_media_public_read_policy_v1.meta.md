---
document_type: oar1
authority_level: execution_closeout
document_scope: inanna_governed_media_public_read_policy
title: OAR1 - Inanna Governed Media Public Read Policy
status: completed_with_thread_followup_pending_next_oar2
version: v1
operator: op044
executor: Cody
system: measures_registry
evidence:
  - inanna_governed_media_public_read_policy_v1.json
executor_artifacts:
  - execute-inanna-governed-media-public-read-policy.cjs
mutation_performed: true
mutation_scope: db_policy_only
---

# OAR1 - Inanna Governed Media Public Read Policy

## Result

Resolved the remaining live Inanna media-loading seam.

The deployed Inanna bundle, resolver, and R2 public base URL were already correct.

The actual blocker was anon/public read visibility for governed rows in:

- `public.measures_surface_media_map`
- `public.codex_media_asset`

The browser client could resolve encounters but could not read the governed media rows, so runtime fell back to stale `temp_exhibition_media` URLs that returned `400`.

## Action

Applied narrow public read policies:

- `codex_media_asset_public_active_read`
- `measures_surface_media_map_public_active_read`

Policy standing:

- `anon` and `authenticated` may `select`
- read is bounded to `status = 'active'`
- no media rows were changed
- no resolver code was changed
- no bucket objects were changed

## Validation

Service-role baseline confirmed governed rows existed before the fix:

- `epigraph` -> `epigraph_governed_animated_media_v1`
- `epigraph` -> `epigraph_still_image_support_v1`
- `temple_antechamber` -> `temple_antechamber_still_image_v1`

Public-client validation after the fix:

- public governed row count: `3`
- `epigraph` governed row count: `2`
- `temple_antechamber` governed row count: `1`

Resolved runtime URLs and retrievals:

1. `epigraph_governed_animated_media_v1`
   - URL: `https://media.c3field.online/inanna_epigraph.MP4`
   - retrieval: `200`

2. `epigraph_still_image_support_v1`
   - URL: `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp`
   - retrieval: `200`

3. `temple_antechamber_still_image_v1`
   - URL: `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/measures_registry/pre_codex_exhibition/images/antechamber.webp`
   - retrieval: `200`

Primary media standing after the fix:

- `epigraph` primary media: `epigraph_governed_animated_media_v1`
- `temple_antechamber` primary media: `temple_antechamber_still_image_v1`

## Boundary

DB mutation performed:

- policy/grant only

No media row mutation.

No fallback deletion.

No bucket mutation.

No frontend mutation.

No resolver mutation.

## Artifacts

- `docs/oar/measures_registry/execute-inanna-governed-media-public-read-policy.cjs`
- `docs/oar/measures_registry/inanna_governed_media_public_read_policy_v1.json`
- `docs/oar/measures_registry/oar1_inanna_governed_media_public_read_policy_v1.meta.md`

## Thread Continuation

After this policy correction, the thread continued through deployment/runtime repair and epigraph playback behavior refinement.

Additional thread resolutions confirmed:

1. The wrong-site deployment seam was corrected.

- `measuresofinanna.com` had been serving Registry HTML instead of Inanna HTML.
- Cloudflare Pages output was corrected to serve `dist-inanna`.
- Live Inanna HTML later resolved to:
  - title: `Measures of Inanna`
  - manifest: `/manifest.inanna.json`

2. Live Inanna bundle identity was corrected.

- stale asset standing earlier in thread: `index-qPbY_Yxd.js`
- later valid Inanna assets included:
  - `index-DNR-DxGl.js`
  - `index-DZZGvnuY.js`
  - `index-D35Jhc3u.js`

3. Epigraph autoplay behavior was corrected in frontend runtime.

- previous behavior forced featured epigraph video toward unmuted autoplay when `audio_embedded = true`
- intro autoplay was revised so epigraph can autoplay muted under browser policy

Commit:

- `4cbfc21` - `Allow muted autoplay for Inanna epigraph`

4. Epigraph completion routing was corrected in frontend runtime.

- destination remained confirmed as `crystal_temple_home`
- metadata was not lost
- runtime bug found: featured-video end path revealed still support and returned before `triggerAutoAdvance()` executed
- that branch was corrected so epigraph can advance to `crystal_temple_home`

Commit:

- `95e17f2` - `Advance Inanna epigraph to crystal temple home`

5. Repository-level Pages output override was removed to reduce future project/output drift.

Commit:

- `de32926` - `Remove global Pages output override`

## Current Standing

This OAR1 remains accurate for the governed-media public-read seam it closed.

However, thread continuation established that Inanna media/runtime issues were not exhausted by that policy correction alone.

Resolved within thread:

- governed media public visibility restored
- Inanna domain/html binding corrected
- muted epigraph autoplay corrected
- epigraph handoff to `crystal_temple_home` corrected

Not fully closed within this OAR1 scope:

- additional media-load/runtime issues remain and should be routed through a new OAR2

## Chazz Handoff Note

For Chazz review, this OAR1 should be read as:

1. the governed public-read seam was real and was corrected
2. deployment binding drift was also real and was corrected later in thread
3. epigraph playback/advance bugs were frontend runtime defects, not metadata loss
4. the thread still requires a follow-up OAR2 for remaining media-load problems outside this OAR1's original bounded scope
