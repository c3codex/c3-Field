---
document_type: oar2
authority_level: working
document_scope: measures_registry_media_resolution
title: OAR2 — Reseat Held Intro and Path Choice Media Assets
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_audit_registered_intro_and_path_choice_media_asset_resolution_v1.meta.md
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - media-resolution
  - intro
  - path-choice
  - registered-runtime
  - codex-first
---

# OAR2 — Reseat Held Intro and Path Choice Media Assets

## OBSERVED

Audit OAR1 (`oar1_audit_registered_intro_and_path_choice_media_asset_resolution_v1`) confirmed:

1. `hero_image` row in `measures_media_map` is held (`is_active: false`). Storage path `hero_fracture_measure.webp` in `measures-registry` bucket returns HTTP 400 — file absent.
2. `path_choice_background` row in `measures_media_map` is held (`is_active: false`). Storage path `more_vs_coherence_path.webp` in `measures-registry` bucket returns HTTP 400 — file absent.
3. `VITE_R2_PUBLIC_BASE_URL` is not set in local `.env.local`. All `measures-media` bucket assets resolve to `null` locally. This is an environment configuration issue, not a code issue.

Both held rows were placed in hold state by `oar2_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1` when storage retrieval returned non-200.

Visual effect:
- `ai_isnt_broken_intro`: intro hero image absent; threshold fallbacks (`left_hero_fracture`, `right_measured_hero`) render
- `evaluate_structure_path`: path choice background absent; surface renders without background image

## ALIGNED

This is a corrective execution. No frontend changes. No CSS changes. No media authority duplication.

The correction path follows the audit finding:

**Option A — Upload corrected**: Files are absent from bucket. Operator uploads `hero_fracture_measure.webp` and `more_vs_coherence_path.webp` to `measures-registry` bucket at the existing recorded paths. Executor verifies HTTP 200 and reactivates rows.

**Option B — Path correction**: Files exist in `measures-registry` bucket under different names or paths. Executor updates `storage_path` in `measures_media_map` to point to correct paths. No upload required. Executor verifies HTTP 200 and reactivates rows.

The execute script determines which option applies by:
1. Fetching the public URL for each recorded path and checking HTTP status
2. If either returns non-200: listing the `measures-registry` bucket root to surface candidate paths
3. Reporting which files are found and which require operator upload

If both files confirm 200 at recorded paths: execute proceeds to full reactivation without operator intervention.

## ROUTED

### 1. Pre-check — verify storage state

For each held row:

| Row | `storage_bucket` | `storage_path` |
|---|---|---|
| `hero_image` | `measures-registry` | `hero_fracture_measure.webp` |
| `path_choice_background` | `measures-registry` | `more_vs_coherence_path.webp` |

Resolve public URL via Supabase storage. Fetch. Record HTTP status.

If any return non-200: list `measures-registry` bucket root. Report candidate paths for operator review.

**Halt condition**: if either file returns non-200, halt row reactivation. Report missing files. Operator must upload or confirm correct path before re-running.

### 2. Reactivate held rows

After confirming HTTP 200 for both paths:

Update `measures_media_map` rows:

```
WHERE campaign_key = 'agents_of_chaos_integrity_governance'
  AND media_role IN ('hero_image', 'path_choice_background')
  AND is_active = false

SET is_active = true
```

Clear hold metadata fields from each row's `metadata` column:
- `hold_reason` → remove
- `held_by_oar2` → remove
- `retrieval_status_at_hold` → remove

Record `reactivated_by_oar2: oar2_reseat_held_intro_and_path_choice_media_assets_v1`.

### 3. Validate anon readback

Using anon key: confirm both `hero_image` and `path_choice_background` rows are returned for `campaign_key = 'agents_of_chaos_integrity_governance'` and that `is_active` is not false.

RLS must permit anon read of active rows. If rows are absent from anon readback after reactivation, report RLS gap.

### 4. Verify resolved URL and storage retrieval post-reactivation

Re-fetch public URLs for both rows after reactivation. Confirm HTTP 200 is stable (no CDN caching artifact).

### 5. Document R2 env guidance

Record the following in the OAR1 closeout:

- `VITE_R2_PUBLIC_BASE_URL` must be set in `.env.local` for local development if video assets (`epigraph_video`, `hero_video`, motion roles) are expected to resolve locally
- `VITE_R2_PUBLIC_BASE_URL` must be confirmed as a Cloudflare Pages environment variable for production deployment
- This is an environment configuration issue; no frontend code change is needed
- Local absence of this variable is expected in review environments where R2 access is not provisioned; the runtime handles null video URLs gracefully (fallback Continue button shown)

## DO NOT

- Edit frontend source files
- Edit CSS
- Hardcode media URLs in frontend
- Upload media without operator authorization
- Create duplicate `measures_media_map` rows
- Alter `measures_encounter_def` rows
- Activate or deactivate rows other than `hero_image` and `path_choice_background`
- Alter media role names
- Change storage bucket assignments
- Alter encounter contracts

## VALIDATION

Return:

- Pre-check HTTP status for each file
- Bucket listing result if pre-check fails
- DB rows updated (before/after `is_active`)
- Metadata hold fields cleared
- Anon readback result after reactivation
- Post-reactivation HTTP status for each URL
- R2 env guidance documented

## SUCCESS CONDITION

Both `hero_image` and `path_choice_background` rows are active and anon-readable.

HTTP 200 confirmed for `hero_fracture_measure.webp` and `more_vs_coherence_path.webp` in `measures-registry` bucket.

`ai_isnt_broken_intro` intro hero image resolves. `evaluate_structure_path` path choice background resolves.

R2 env guidance is documented for local and production environments.

No media authority is invented or duplicated. No frontend edits made.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_reseat_held_intro_and_path_choice_media_assets_v1.meta.md`

## CLOSE

Verify before reactivating. Halt if files are absent.
