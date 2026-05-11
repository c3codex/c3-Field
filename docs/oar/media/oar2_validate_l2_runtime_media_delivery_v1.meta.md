---
document_type: oar2
authority_level: working
document_scope: shared_l2_runtime_media_delivery
title: OAR2 — Validate L2 Runtime Media Delivery
status: proposed
version: v1
operator: op044
system: media
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - media
  - l2-bucket
  - runtime-delivery
  - r2
  - measures-registry
  - measures-of-inanna
source_alignment:
  - OAR1 - Register L2 Bucket as Shared Media Storage
  - OAR1 - Migrate Measures Registry Heavy Media References to L2
  - OAR1 - Reconcile Registry Unmatched L2 Media
  - OAR1 - Migrate Measures of Inanna Media References to L2
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Validate L2 Runtime Media Delivery

## OBSERVED

After migration to shared L2 storage, video assets are not loading on either site.

Observed runtime behavior:

- Measures Registry navigation still proceeds correctly
- Registry can advance to next encounter / hero and eval page
- video assets do not load
- Measures of Inanna does not load to Temple Home

Recent media migrations changed heavy media references to:

- storage bucket: measures-media
- provider: cloudflare_r2
- storage key: l2_shared_media

Likely seam:

Supabase media URLs and R2 media URLs are not resolved the same way.

The frontend may still be attempting to build video URLs through Supabase storage logic even after DB rows now point to R2/L2.

## ALIGNED

This is a runtime media delivery failure, not a content seating failure.

Do not perform more media migration until runtime delivery is validated.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required interpretation:

- DB rows define media authority
- bucket stores media payloads
- runtime must resolve provider-specific public URLs correctly
- Supabase image media may continue using Supabase URL logic
- R2 heavy media requires R2-specific base URL logic
- frontend must not hardcode individual object paths

This OAR2 validates and fixes runtime delivery for L2 heavy media only.

## ROUTED

Cody shall inspect and repair shared L2 runtime media delivery.

### 1. Inspect current media URL resolver

Inspect media URL construction in both sites:

- Measures Registry
- Measures of Inanna

Identify where media URLs are built for:

- public.measures_media_map
- public.codex_media_asset
- public.measures_surface_media_map
- public.temp_exhibition_media

Determine whether rows with:

- storage_bucket = measures-media
- bucket = measures-media
- storage_provider = cloudflare_r2
- provider = cloudflare_r2

are being incorrectly passed through Supabase storage URL builders.

### 2. Verify L2 runtime config

Check for runtime/env support for R2 public base URL.

Expected env source may include:

- .env.cloudflare
- Vite env variables
- deployment env variables

Do not print secrets.

If .env.cloudflare exists:

- verify presence only
- do not print values
- verify it is excluded from git if it contains secrets

Required public-safe runtime value should be something equivalent to:

VITE_R2_PUBLIC_BASE_URL

or an existing project-specific equivalent.

If no public base URL exists, report required env/config addition.

### 3. Verify R2 public accessibility

Cody shall verify whether measures-media objects are publicly accessible through:

- R2 public development URL
- custom public domain
- Cloudflare worker/proxy route
- configured public base URL

Do not assume bucket-private objects can be played directly.

If bucket is private and no signed/proxy mechanism exists, report required delivery route.

### 4. Verify CORS

Confirm R2 media delivery allows requests from:

- Measures Registry domain
- Measures of Inanna domain
- local dev origin, if applicable

Required media behavior:

- video playback
- audio playback
- range requests where required by browser video/audio players

If CORS is missing, report required bucket CORS config.

### 5. Implement provider-aware URL resolver

If missing, implement provider-aware media URL resolution:

Supabase storage bucket → Supabase public URL builder
Cloudflare R2 / measures-media → R2 public base URL + encoded object key
Explicit public_url present → use public_url

Priority:

1. explicit public_url
2. R2 public base URL for R2 rows
3. Supabase public URL builder for Supabase rows
4. safe failure state

Object keys must be URL-encoded safely without corrupting path separators.

### 6. Validate sample objects

Test/validate runtime URL generation for at least these known migrated objects:

Measures Registry:

- registry_epigraph_fracture_to_alignment_15s.mp4
- left_hero_fracture_motion.mp4
- c3_field.mp4

Measures of Inanna:

- harrumuk_passage.mp4
- kumurrah_passage.mp4
- gemynd_corpus_lapis_tone .MOV

Note the space before .MOV must be handled exactly if present in object key.

### 7. No DB migration

Do not migrate media rows.

Do not change media authority records unless required only to add public URL/base URL metadata and explicitly validated.

Prefer resolver/config repair over DB mutation.

### 8. Build validation

Run relevant builds:

- Measures Registry build
- Measures of Inanna build

Return build status.

## CODY ROLE

Cody may:

- inspect frontend/runtime media URL construction
- inspect env/config names without exposing secret values
- implement provider-aware media URL resolver
- add safe R2 public base URL handling
- preserve Supabase image handling
- validate sample media URL generation
- run builds
- write OAR1 closeout

Cody may not:

- perform new media migration
- invent bucket object names
- print secrets
- commit .env.cloudflare if secrets are present
- hardcode individual media URLs
- collapse Supabase image handling and R2 heavy media handling
- mutate unrelated encounter logic
- delete legacy rows

## VALIDATION

Cody must return:

1. root cause summary
2. files changed
3. media URL resolver behavior before/after
4. R2 public base URL env/config standing
5. .env.cloudflare found / not found
6. .env.cloudflare gitignore standing if present
7. CORS/public access standing
8. sample URL generation results for Registry media
9. sample URL generation results for Inanna media
10. build validation result
11. confirmation no DB migration was performed
12. OAR1 closeout path

Execution is valid only when:

- R2 media rows no longer route through Supabase URL builder
- Supabase image media remains supported
- R2 heavy media has provider-aware runtime URL resolution
- video/audio paths are URL-encoded safely
- no secrets are exposed
- no individual media URLs are hardcoded
- both builds pass or failures are reported clearly
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/media/oar1_validate_l2_runtime_media_delivery_v1.meta.md

## CLOSE

This pass repairs runtime delivery.

No further media migration should proceed until both sites can load L2 heavy media.

Codex holds.
Field structures.
Measures registers.
Chazz executes.
