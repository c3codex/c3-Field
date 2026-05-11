---
document_type: oar1
authority_level: execution_closeout
document_scope: shared_l2_runtime_media_delivery
title: OAR1 - Validate L2 Runtime Media Delivery
status: completed_runtime_resolver_repaired_public_route_embedded
version: v1
source_oar2: oar2_validate_l2_runtime_media_delivery_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Validate L2 Runtime Media Delivery

## Result

Shared L2 runtime media delivery was inspected and repaired at the frontend resolver layer.

Root cause found:

- Measures Registry `measures_media_map` rows were still resolved through Supabase storage URL construction.
- Measures of Inanna registry media rows were still resolved through Supabase storage URL construction when `public_url` was absent.
- Rows now using `measures-media` require Cloudflare R2 public delivery configuration rather than Supabase storage URL construction.

No DB migration was performed.

No media authority rows were changed.

No individual media object URL was hardcoded.

## Files Changed

- `src/shared/media/runtimeMediaUrl.ts`
- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/measures_of_inanna/resolve_encounter.ts`
- `src/measures_of_inanna/types.ts`
- `vite.config.ts`
- `dist-registry/`
- `dist-inanna/`

## Resolver Behavior

Before:

- `measures_media_map.storage_bucket` and `storage_path` were passed directly to `supabase.storage.from(...).getPublicUrl(...)`.
- Measures of Inanna `codex_media_asset.bucket` and `storage_path` were passed through Supabase public storage URL construction unless `public_url` existed.
- `measures-media` therefore resolved like a Supabase bucket, which is incorrect for Cloudflare R2 runtime delivery.

After:

Provider-aware runtime media resolution is centralized in:

`src/shared/media/runtimeMediaUrl.ts`

Resolution priority:

1. explicit `public_url`
2. Cloudflare R2 / `measures-media` via `VITE_R2_PUBLIC_BASE_URL` plus encoded object key
3. Supabase storage public URL builder for non-R2 buckets
4. safe failure state when required fields or R2 public base URL are absent

Object keys are encoded segment-by-segment so path separators are preserved and spaces are encoded safely.

## R2 Runtime Config Standing

`.env.cloudflare` found: yes

`.env.cloudflare` gitignore standing: ignored by `.gitignore` through `.env.*`

`VITE_R2_PUBLIC_BASE_URL` standing: not present

Required deployment addition:

`VITE_R2_PUBLIC_BASE_URL=<public R2 delivery origin for measures-media>`

This value must point to one of:

- R2 public development URL
- custom public domain
- Cloudflare Worker/proxy route that serves `measures-media`

## Public Access And CORS Standing

R2 credentials were present for object-listing style access.

Signed `GetBucketCors` validation against `measures-media` returned:

- status: `403`
- standing: `AccessDenied`

Therefore CORS could not be confirmed with the available key.

Public object delivery could not be confirmed because no public R2 base URL was configured in `.env.cloudflare` or Vite runtime env.

Required delivery standing before live playback can be considered complete:

- public/proxied GET access for video and audio objects
- browser range request support for video/audio playback
- CORS allowing Measures Registry origin
- CORS allowing Measures of Inanna origin
- CORS allowing local dev origin if local media playback validation is required

## Sample URL Generation

With current env, all R2 bucket/path-only samples return safe failure because `VITE_R2_PUBLIC_BASE_URL` is missing.

Measures Registry samples:

- `registry_epigraph_fracture_to_alignment_15s.mp4` -> safe failure, missing `VITE_R2_PUBLIC_BASE_URL`
- `left_hero_fracture_motion.mp4` -> safe failure, missing `VITE_R2_PUBLIC_BASE_URL`
- `c3_field.mp4` -> safe failure, missing `VITE_R2_PUBLIC_BASE_URL`

Measures of Inanna samples:

- `harrumuk_passage.mp4` -> safe failure, missing `VITE_R2_PUBLIC_BASE_URL`
- `kumurrah_passage.mp4` -> safe failure, missing `VITE_R2_PUBLIC_BASE_URL`
- `gemynd_corpus_lapis_tone .MOV` -> encoded object key `gemynd_corpus_lapis_tone%20.MOV`; safe failure, missing `VITE_R2_PUBLIC_BASE_URL`

DB validation confirmed the routed samples are seated on `measures-media`.

## Build Validation

Measures Registry:

`npm.cmd run build:registry` passed after elevated rerun. Initial sandbox run failed with esbuild `spawn EPERM`.

Measures of Inanna:

`npm.cmd run build:inanna` passed.

## Boundary

No DB migration was performed.

No media rows were mutated.

No `.env.cloudflare` values were committed.

Supabase storage handling remains supported for non-R2 buckets.

R2 heavy media rows no longer route through Supabase storage URL construction.

Runtime delivery still requires the public R2 base URL and verified CORS/public access configuration.

## Follow-Up Correction

After Cloudflare CORS policy and the public R2 URL were configured, live media still did not load.

Cause:

- `.env.cloudflare` contained `VITE_R2_PUBLIC_BASE_URL`.
- Vite did not load `.env.cloudflare` by default.
- The committed bundles therefore still contained the safe-failure empty R2 base value.

Correction:

- `vite.config.ts` now reads `.env.cloudflare` through `dotenv`.
- Only `VITE_R2_PUBLIC_BASE_URL` is consumed from that file for client build output.
- Cloudflare/R2 secret values in `.env.cloudflare` remain unexposed.
- Registry and Inanna bundles were rebuilt.

Validation:

- `VITE_R2_PUBLIC_BASE_URL` present: yes
- generated JS bundles containing configured R2 base URL: 2 of 2
- `npm.cmd run build:registry`: passed
- `npm.cmd run build:inanna`: passed

Public sample delivery previously returned:

- status: `200`
- content type: `video/mp4`
- accept ranges: `bytes`
