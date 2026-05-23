---
document_type: oar1
authority_level: working
document_scope: measures_registry_media_resolution
title: OAR1 — Audit Registered Intro and Path Choice Media Asset Resolution
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_registered_intro_and_path_choice_media_asset_resolution_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - media-resolution
  - intro
  - path-choice
  - registered-runtime
  - codex-first
---

# OAR1 — Audit Registered Intro and Path Choice Media Asset Resolution

## OBJECTIVE

Audit media resolution for `ai_isnt_broken_intro` and `evaluate_structure_path`. Identify source of visual media failure. No edits. Return correction recommendation.

---

## TABLES INSPECTED

| Table | Method |
|---|---|
| `measures_encounter_def` | service-role read — `ai_isnt_broken_intro`, `evaluate_structure_path`, `landing_root`, `landing_path_choice` |
| `measures_media_map` | service-role read — all rows; anon read — active rows only |
| `src/shared/media/runtimeMediaUrl.ts` | read — URL construction logic |
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | read — media query, mediaMap build, consumption variables, intro renderer |

---

## MEDIA AUTHORITY

**Runtime media authority: `measures_media_map`**

Single table. Columns: `encounter_key`, `campaign_key`, `media_role`, `storage_bucket`, `storage_path`, `mime_type`, `sort_order`, `is_active`, `metadata`.

The frontend queries it as:

```typescript
supabase
  .from("measures_media_map")
  .select("media_role, storage_bucket, storage_path, mime_type, is_active")
  .eq("campaign_key", "agents_of_chaos_integrity_governance")
  .in("media_role", [...QUERY_MEDIA_ROLES])
  .order("sort_order", { ascending: true })
```

**Filtering: campaign_key + media_role only. No encounter_key filter.**

The `encounter_key` column in `measures_media_map` is traceability metadata only — the runtime resolves by `media_role` name. Legacy encounter keys (`landing_root`, `landing_path_choice`) do not block resolution as long as the `media_role` exists and is active.

`mediaMap` is built from the result, filtered by `row.is_active !== false`. Rows with `is_active: false` are excluded both by RLS (anon cannot read them) and by the frontend filter.

---

## URL CONSTRUCTION

`resolveRuntimeMediaUrl` in `src/shared/media/runtimeMediaUrl.ts`:

| Bucket | Resolution |
|---|---|
| `measures-media` | R2 — `VITE_R2_PUBLIC_BASE_URL` + path |
| `c3-field-media` | R2 — `VITE_C3FIELD_R2_PUBLIC_BASE_URL` + path |
| `measures-registry` | Supabase storage public URL |
| `measures-registry-public` | Supabase storage public URL |

If `VITE_R2_PUBLIC_BASE_URL` is not set, `r2PublicBaseUrl()` returns `""` → `if (!baseUrl) return null` → all `measures-media` assets resolve to `null`.

---

## FINDING 1 — `hero_image` held, storage 400

| Field | Value |
|---|---|
| `media_role` | `hero_image` |
| `encounter_key` | `landing_root` |
| `campaign_key` | `agents_of_chaos_integrity_governance` ✓ |
| `storage_bucket` | `measures-registry` |
| `storage_path` | `hero_fracture_measure.webp` |
| `is_active` | **false** |
| `hold_reason` | `active DB media reference returned non-200 retrieval` |
| `held_by_oar2` | `oar2_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1` |
| `retrieval_status_at_hold` | 400 |
| **Current HTTP status** | **400** (confirmed — file not present in bucket) |
| Anon-readable | No |

**Effect:** `splitHeroImageUrl = null`. `thresholdLeftStillUrl` falls back to `left_hero_fracture.webp` (active, 200 ✓). `thresholdRightStillUrl` falls back to `right_measured_hero` (active). Intro surface renders threshold seats with fallback images but not the intended split hero image.

---

## FINDING 2 — `path_choice_background` held, storage 400

| Field | Value |
|---|---|
| `media_role` | `path_choice_background` |
| `encounter_key` | `landing_path_choice` |
| `campaign_key` | `agents_of_chaos_integrity_governance` ✓ |
| `storage_bucket` | `measures-registry` |
| `storage_path` | `more_vs_coherence_path.webp` |
| `is_active` | **false** |
| `hold_reason` | `active DB media reference returned non-200 retrieval` |
| `held_by_oar2` | `oar2_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1` |
| `retrieval_status_at_hold` | 400 |
| **Current HTTP status** | **400** (confirmed — file not present in bucket) |
| Anon-readable | No |

**Effect:** `pathChoiceBackgroundUrl = null`. Path choice surface renders without background image. The CSS variable `--path-choice-background` is not set. Visual degradation but not a routing blocker.

---

## FINDING 3 — `measures-media` bucket assets: R2 URL not configured locally

| Field | Value |
|---|---|
| `VITE_R2_PUBLIC_BASE_URL` | **not set in local env** |
| `VITE_C3FIELD_R2_PUBLIC_BASE_URL` | **not set in local env** |

All assets stored in `measures-media` bucket resolve to `null` locally because `r2PublicBaseUrl()` returns `""` → falsy → `resolveRuntimeMediaUrl` returns `null`.

**Affected roles:**

| Role | Bucket | Path |
|---|---|---|
| `epigraph_video` | `measures-media` | `registry_epigraph_fracture_to_alignment_15s.mp4` |
| `hero_video` | `measures-media` | `integrity_governance_intro.mp4` |
| `left_hero_fracture_motion` | `measures-media` | *(path in DB)* |
| `measured_hero_motion_graphic` | `measures-media` | *(path in DB)* |
| `measures_structured_enviroments` | `measures-media` | *(path in DB)* |
| `installation_tone_marble` | `measures-media` | *(path in DB)* |
| `installation_tone_marble_rise_return_v1` | `measures-media` | *(path in DB)* |
| `marble_tone` | `measures-media` | *(path in DB)* |
| `structured_environment_passage_video` | `measures-media` | *(path in DB)* |

**Effect on intro:** `epigraphVideoUrl = null`. The intro renderer handles this gracefully — when no video URL, it renders a fallback "Continue" button instead of the epigraph video player (lines 2089–2103 of runtime).

**This may resolve correctly in Cloudflare Pages production** if `VITE_R2_PUBLIC_BASE_URL` is set as a Pages environment variable. Local review will not show videos regardless of DB state.

---

## LEGACY VS REGISTERED MEDIA COMPARISON

| Legacy key | Registered key | Role | Legacy rows exist | Registered rows exist |
|---|---|---|---|---|
| `landing_root` | `ai_isnt_broken_intro` | `epigraph_video` | Yes (active) | — (not needed, role-based query) |
| `landing_root` | `ai_isnt_broken_intro` | `hero_image` | Yes (held) | — |
| `landing_path_choice` | `evaluate_structure_path` | `path_choice_background` | Yes (held) | — |

**The `encounter_key` column in `measures_media_map` does not affect runtime resolution.** Media is resolved by `media_role` + `campaign_key`. The legacy encounter key traceability in rows is not a blocker. No media re-seating under registered encounter keys is needed — the existing rows are correct in structure, just held due to storage failures.

---

## RENDERER MEDIA ROLE EXPECTATIONS

### `ai_isnt_broken_intro` / `epigraph_split_hero`

| Variable | Role | DB row | Active | Storage | URL resolves |
|---|---|---|---|---|---|
| `epigraphVideoUrl` | `epigraph_video` | `measures-media` | ✓ | R2 | No (R2 not configured locally) |
| `splitHeroImageUrl` | `hero_image` | `measures-registry` | ✗ held | 400 | No |
| `thresholdLeftStillUrl` | `left_hero_fracture` (+ `hero_image` fallback) | `measures-registry` | ✓ | 200 | **Yes** |
| `thresholdRightStillUrl` | `right_measured_hero` (+ fallbacks) | `measures-registry` | ✓ | *(active)* | **Yes** |

### `evaluate_structure_path` / `measures_registry_path_choice`

| Variable | Role | DB row | Active | Storage | URL resolves |
|---|---|---|---|---|---|
| `pathChoiceBackgroundUrl` | `path_choice_background` | `measures-registry` | ✗ held | 400 | No |

---

## WHAT IS RENDERING

| Asset | Status |
|---|---|
| Registry mark (`registry_mark`) | 200 — renders ✓ |
| Registry watermark | 200 — renders ✓ |
| Lapis background | 200 — renders ✓ |
| Threshold left image (`left_hero_fracture`) | 200 — renders as fallback ✓ |
| Section text copy for intro | DB — renders ✓ |
| Section text copy for path choice | DB — renders ✓ |
| Epigraph video | null locally (R2 not configured) — fallback Continue shown |
| Intro hero image | null (held, 400) — threshold fallbacks used |
| Path choice background | null (held, 400) — no background renders |

---

## CORRECTION REQUIRED

**Three distinct corrections. Priority order:**

### 1. Storage upload: `hero_fracture_measure.webp` and `more_vs_coherence_path.webp`

Both files return HTTP 400 — they are absent from the `measures-registry` bucket at the recorded paths.

Options:
- Upload the files to `measures-registry` at the existing paths
- Or update `storage_path` in the `measures_media_map` rows to point to correct paths if the files exist under different names

After confirming 200 response: reactivate both rows (`is_active = true`) in `measures_media_map`.

**Correction type:** asset upload required + DB row reactivation.

### 2. R2 env var: `VITE_R2_PUBLIC_BASE_URL`

Set `VITE_R2_PUBLIC_BASE_URL` in `.env.local` for local development so video assets resolve during local review. Verify it is set in Cloudflare Pages environment variables for production.

**Correction type:** environment configuration.

### 3. No frontend changes needed

Media role names consumed by the renderer are correct. The `encounter_key` remapping is not required — the query is role-based. The fallback chain in the runtime is working as intended (threshold images render via active fallback assets).

---

## RECOMMENDED NEXT OAR2

`oar2_reseat_held_intro_and_path_choice_media_assets_v1.meta.md`

Scope:
- Confirm or upload `hero_fracture_measure.webp` in `measures-registry` bucket
- Confirm or upload `more_vs_coherence_path.webp` in `measures-registry` bucket
- Verify HTTP 200 for each after upload
- Reactivate `hero_image` and `path_choice_background` rows in `measures_media_map`
- Confirm `VITE_R2_PUBLIC_BASE_URL` is set correctly for production and document local env guidance
- Validate anon readback includes both rows after reactivation
- No frontend edits

---

## VALIDATION

| Check | Result |
|---|---|
| DB tables inspected | `measures_encounter_def`, `measures_media_map` |
| Frontend files inspected | `MeasuresRegistryRuntime.tsx`, `runtimeMediaUrl.ts` |
| Frontend edits made | None |
| CSS edits made | None |
| Media uploaded | None |
| Encounter contracts altered | None |
| DB rows altered | None |
| Media authority invented or duplicated | None |

---

## CLOSEOUT

Media failure on `ai_isnt_broken_intro` and `evaluate_structure_path` is caused by three independent issues:

1. `hero_fracture_measure.webp` — absent from `measures-registry` storage (400), row held
2. `more_vs_coherence_path.webp` — absent from `measures-registry` storage (400), row held
3. `measures-media` bucket video assets — R2 URL not configured in local env, all videos null locally

The media role names, encounter key reconciliation, frontend consumption path, and fallback logic are all correct. No frontend changes are needed. The next corrective OAR2 should address storage upload and row reactivation.

OAR1 ready for operator review.
