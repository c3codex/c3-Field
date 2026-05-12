---
document_type: oar1
authority_level: execution_closeout
document_scope: inanna_governed_media_public_read_policy
title: OAR1 - Inanna Governed Media Public Read Policy
status: completed
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
