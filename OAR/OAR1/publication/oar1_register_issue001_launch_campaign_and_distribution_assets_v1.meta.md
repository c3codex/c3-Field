---
document_type: oar1
authority_level: proof
document_scope: publication_campaign
title: OAR1 - Register Issue 001 Launch Campaign and Distribution Assets
closes: OAR/OAR2/publication/oar2_register_issue001_launch_campaign_and_distribution_assets_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Register Issue 001 Launch Campaign and Distribution Assets

## Summary

Seated the first governed Publication Campaign: `undrifted_issue001_launch_campaign_v1`, built on three new tables (`measures_publication_campaign`, `measures_publication_campaign_asset`, `measures_publication_distribution_asset`). Registered 6 Campaign Assets and 10 Distribution Assets, every one a reference to an already-registered publication asset — nothing was uploaded, duplicated, scheduled, or published. All new rows are `status: draft`. No public read access was added; this is an internal orchestration layer, not FREE-rendered content.

---

## 1. Campaign Registry Model (ROUTED §1)

`measures_publication_campaign` seated with all required minimum fields (`campaign_key`, `publication_key`, `issue_id`, `campaign_name`, `campaign_objective`, `status`, `release_state`, `start_date`, `end_date`, `metadata`) plus an `optics` jsonb column added ahead of §8 rather than bolted on later. RLS enabled, service_role-only — no anon/authenticated read policy, matching the precedent set by `measures_publication_release`'s split (public read gated on a status field / service_role for everything else): campaigns have no OAR2 instruction to render on the live site, so no public policy was added.

## 2. Issue 001 Launch Campaign Registered (ROUTED §2)

One row: `undrifted_issue001_launch_campaign_v1`, `publication_key: undrifted`, `issue_id: undrifted_issue01`, `status: draft`, `release_state: held`. `metadata` records the `Issue → Publication Assets → Campaign` relationship explicitly, plus the standing `buffer_social_distribution_integration` / `paragraph_publication_integration` process keys (both already seated, both `automation_status: held`) so the campaign layer is traceable back to the existing (held) distribution automation without activating it.

## 3. Asset Inventory (ROUTED §3)

Queried live state before building anything:

| Category | Found | Bound into campaign |
|---|---|---|
| Articles | `undrifted_issue01_ai_isnt_broken_systems_are_article_v1` (published, cover story), `undrifted_issue01_editors_letter_article_v1` (published, editor's letter), `agents_with_keys_dispatch_v1` + `fables_and_myths_dispatch_v1` (published dispatches, Issue 001 "Dispatches" page) | Yes — all 4 |
| Banners | `undrifted_ai_isnt_broken_landing_banner_v1`, `undrifted_issue01_editors_letter_codexstone_banner_v1` (binds `editors_note_banner.webp`) | Yes — both |
| Images / existing website media | `agents_with_keys.webp`, `fables_and_myths.webp`, `measures_registry_logo.webp`, `undrifted_publication_masthead.webp` | Yes — all bound into Campaign Assets below |
| Assessment media | `obsidian_assessment_surface_visual_v1.webp` (bound), `assessment_report_orientation.mp4`, `obsidian_background.webp`, two assessment glyph SVGs | Hero graphic bound; orientation video/glyphs inventoried, not bound (no campaign asset type calls for them yet) |
| Videos | `questions_ungoverned_systems_cannot_answer.mp4` (landing hero) | Inventoried, not bound — no promotional cut exists distinct from the long-form landing video |
| Audio | None registered anywhere in the system | Missing — see §4 |

**Not registered as Issue 001 assets**: `undrifted_issue01_measures_registry_launch_article_v1` and `undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1` (and their banners) are `registered` but not bound to any Issue 001 page/dispatch — they sit outside the live page sequence, so excluded from this campaign to avoid promoting content that isn't actually part of the launched issue. `agents_of_chaos_dispatch_v1`, `structural_drift_dispatch_v1`, `measures_registry_dispatch_v1`, `undrifted_dispatch_v1` are legacy/hidden dispatches (`visible_section: false` or Issue 002-tagged) — excluded as out of Issue 001 launch scope.

No duplication: every Campaign Asset's `publication_asset_id` points at an existing `asset_registry.md` row, dispatch row, or issue-page row — none were copied or re-created.

## 4. Campaign Assets (ROUTED §4) / Missing Media

6 rows in `measures_publication_campaign_asset`, all `status: draft`:

| Campaign Asset | Type | References |
|---|---|---|
| Cover Story Hero | hero_graphic | `undrifted_ai_isnt_broken_landing_banner_v1` |
| Cover Story Quote | quote | `undrifted_issue01_ai_isnt_broken_systems_are_article_v1` |
| Editor's Letter Thumbnail | thumbnail | `undrifted_issue01_editors_letter_codexstone_banner_v1` |
| Dispatches Carousel | carousel | `agents_with_keys_dispatch_v1` + `fables_and_myths_dispatch_v1` |
| Issue 001 Launch Digest | email_excerpt | `undrifted_issue01` (issue_record + editors_letter + cover_story) |
| Assessment Hero | hero_graphic | `undrifted_issue01_page06_launch_encounter` |

**Missing media, returned per §3's "return missing media only"**: no Reel, Short, Video, or Podcast Clip campaign asset was created. No audio source of any kind is registered in the system (blocks Podcast Clip entirely), and no cut promotional video exists distinct from the two long-form orientation/landing videos already inventoried (blocks Reel/Short/Video). Fabricating placeholder media for these would have violated §6's "do not upload new media" in spirit — flagged as a real content gap rather than worked around.

## 5. Distribution Assets (ROUTED §5) / Buffer Export Readiness (ROUTED §7)

10 rows in `measures_publication_distribution_asset`, every row `status: draft`, none scheduled, none published. Each carries `campaign_asset_id`, `publication_asset_id`, and `campaign_id` as required — no duplicated authority, all three are pointers.

| Distribution Asset | Platform | Type | buffer_export_ready |
|---|---|---|---|
| Cover Story → Website | website | Website Feature | true |
| Cover Story → Instagram | instagram | Instagram Post | true |
| Cover Story Quote → X | x | X Thread | true |
| Cover Story Quote → LinkedIn | linkedin | LinkedIn Article | true |
| Editor's Letter → Paragraph | paragraph | Paragraph Publication | false |
| Editor's Letter → Email | email | Newsletter | true |
| Dispatches → Instagram | instagram | Instagram Carousel | true |
| Dispatches → LinkedIn | linkedin | LinkedIn Article | true |
| Launch Digest → Email | email | Newsletter | true |
| Assessment → Website | website | Website Feature | true |

The Paragraph row is deliberately `buffer_export_ready: false` and carries a note in `metadata`: the underlying editor's letter dispatch is already independently published to Paragraph — this row is a fresh campaign-layer record only, and its `draft` status does not alter or retract that existing publication. No object here was scheduled or published; `buffer_export_ready` marks readiness for a future, separately-authorized export step only.

## 6. Existing Website Media Binding (ROUTED §6)

No new media was uploaded. `ai_isnt_broken_landing.webp`, `editors_note_banner.webp`, `agents_with_keys.webp`, `fables_and_myths.webp`, `measures_registry_logo.webp`, and `obsidian_assessment_surface_visual_v1.webp` were bound by reference (via `metadata.bound_media_role` / `metadata.storage_path` on the relevant Campaign Asset rows) — all six already existed in `measures_media_map` before this OAR2.

## 7. Optics Preparation (ROUTED §8)

Added an `optics` jsonb column (not just a metadata sub-key) to all three new tables, so optics fields are structurally visible rather than buried. Every row seeded with `{prepared: true, tracks_individuals: false, attached_to: <table>}`; the campaign row additionally lists `metrics_pending: [impressions, engagement, click_through, conversion_attribution]` and `analytics_implemented: false`. No analytics implementation exists — this is field scaffolding only, exactly as instructed.

---

## Validation

| Item | Result |
|---|---|
| Campaign Registry | 1 row, `undrifted_issue001_launch_campaign_v1` |
| Campaign Assets | 6 rows, all draft |
| Distribution Assets | 10 rows, all draft, buffer_export_ready true except the Paragraph row |
| Media inventory | Documented in §3 |
| Missing assets | No audio/podcast source; no cut promotional video (§4) |
| Buffer export readiness | 9/10 rows marked ready; Buffer integration itself remains `automation_status: held` — no export was performed |
| Optics readiness | `optics` column present and seeded on all three tables; no analytics implemented |
| Duplicated assets | None — every reference is a pointer, verified against `asset_registry.md`, `measures_publication_dispatch`, `measures_publication_issue_page`, and `measures_media_map` |
| Duplicated authority | None — Campaign Assets and Distribution Assets hold no content, only `publication_asset_id` pointers |
| Security advisors | Ran `get_advisors(type=security)` post-migration — no findings for any of the three new tables |

---

## Blockers

None. Everything ROUTED asked for was completed; the two content gaps in §4 are genuine missing-asset findings, not blockers to this OAR2's own scope.

## Files Changed

```
Assets/Registry/asset_registry.md                                                         (Campaign Layer section added)
supabase/migrations/20260708113323_seat_undrifted_publication_campaign_model.sql
supabase/migrations/20260708113333_register_undrifted_issue001_launch_campaign.sql
supabase/migrations/20260708113348_register_undrifted_issue001_campaign_assets.sql
supabase/migrations/20260708113409_register_undrifted_issue001_distribution_assets.sql
```

No renderer, resolver, or `dist-registry/` changes — this OAR2 is purely a DB-side registry/orchestration model, not a rendering change, so nothing needed rebuilding.

## Next Recommended OAR2

A Buffer-export OAR2 to actually generate the platform-ready payloads (copy, crop, alt text) for the 9 `buffer_export_ready: true` distribution assets — still gated on the separately-held `buffer_social_distribution_integration` process, and still requiring explicit operator authorization before any real scheduling happens.

## Deploy Note

DB changes are already live (Supabase migrations apply directly). The only file change here (`asset_registry.md`) is local-only pending commit — this OAR2 introduced no renderer or `dist-registry/` changes, so there is nothing new to push to `origin/measures` beyond the registry file and the OAR1/OAR2 pair themselves.
