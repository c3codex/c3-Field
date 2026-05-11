---
document_type: oar1
authority_level: execution_closeout
document_scope: shared_l2_runtime_media_delivery
title: OAR1 - Validate L2 Runtime Media Delivery
status: pending_chazz_review_deployment_binding_unresolved
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

## Thread Follow-Up For Chazz Review

After the resolver repair and R2 public base URL embedding were committed and pushed, the operator reported that L2 media still did not load and Measures of Inanna still returned `Encounter could not be resolved`.

Additional fixes attempted in thread:

1. Supabase browser key correction

- Observed live browser requests to Supabase returning `401 Invalid API key`.
- Confirmed the local `.env.cloudflare` `VITE_SUPABASE_ANON_KEY` value was present but rejected by Supabase.
- Operator replaced the legacy JWT anon key with the current Supabase publishable key.
- Registry live bundle later confirmed publishable-key usage and Supabase `epigraph` query returned `200`.

2. R2 public delivery confirmation

- Operator configured R2 CORS policy and public URL.
- `.env.cloudflare` was updated with `VITE_R2_PUBLIC_BASE_URL`.
- Public sample check for `registry_epigraph_fracture_to_alignment_15s.mp4` returned:
  - status `200`
  - content type `video/mp4`
  - accept ranges `bytes`

3. Vite env-loading correction

- Found that Vite did not load `.env.cloudflare` by default.
- Updated `vite.config.ts` to read `.env.cloudflare` through `dotenv`.
- Only `VITE_R2_PUBLIC_BASE_URL` is consumed from `.env.cloudflare` for client build output.
- Rebuilt both Registry and Inanna bundles.
- Verified generated JS bundles containing configured R2 base URL: `2 of 2`.
- Committed and pushed: `815dfb4 Embed R2 public base URL in builds`.

4. Live deployment verification

Live Registry:

- Live asset observed after redeploy: `index-B8ConEqy.js`
- Bundle contains Supabase publishable key.
- Supabase `epigraph` query using the live bundle key returned `200`.
- Standing: Registry Supabase key issue appears corrected in live deployment.

Live Measures of Inanna:

- Live asset repeatedly observed after redeploy attempts: `index-Qr8rbREK.js`
- Bundle contains old legacy JWT anon key.
- Supabase `epigraph` query using the live bundle key returned `401 Invalid API key`.
- HTML cache headers showed:
  - `cache-control: public, max-age=0, must-revalidate`
  - `cf-cache-status: DYNAMIC`
- Standing: live Inanna custom domain is still serving an old/stale or wrong deployment artifact.

## Current Chazz Review Question

The remaining failure is not currently evidenced as DB seating drift or L2 media resolver drift.

Evidence points to Cloudflare Pages deployment binding/output drift for Measures of Inanna:

- live Inanna domain serves `index-Qr8rbREK.js`
- current repaired Inanna build output was `dist-inanna/assets/index-80UgXtfT.js`
- live Inanna bundle still uses old rejected Supabase JWT key
- live Registry bundle did update and uses publishable key successfully

Chazz should review:

1. Whether `measuresofinanna.com` and `www.measuresofinanna.com` are bound to the intended Inanna Pages project.
2. Whether the Inanna Pages project production deployment is the latest commit, not an old skipped deployment.
3. Whether the Inanna Pages project build command is exactly:

`npm run build:inanna`

4. Whether the Inanna Pages project output directory is exactly:

`dist-inanna`

5. Whether production was promoted to the deployment containing the rebuilt Inanna artifact.

Expected proof of resolution:

- live Inanna HTML no longer references `index-Qr8rbREK.js`
- live Inanna bundle contains `sb_publishable_`
- live Inanna Supabase `epigraph` query returns `200`
- live Inanna page resolves the `epigraph` encounter

## Commits In Scope

- `d75f8fd` - Validate L2 runtime media delivery
- `815dfb4` - Embed R2 public base URL in builds

## Final Standing

Code-side resolver repair is complete.

R2 public sample delivery is reachable.

Registry live Supabase auth is corrected.

Measures of Inanna remains unresolved at live custom domain due to stale or wrong Cloudflare Pages deployment artifact.
