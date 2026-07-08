---
document_type: oar1
authority_level: proof
document_scope: publication_issue_pages
title: OAR1 - Seat unDrifted Issue Page Model and Launch Layout Sequence
closes: OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Seat unDrifted Issue Page Model and Launch Layout Sequence

## Summary

Issue 001's six launch pages are now governed registry objects — a new `measures_publication_issue_page` table, one row per page, every asset/dispatch/banner reference pointing at something already real (nothing invented). The Publication Encounter Profile now carries the full sequence, and it's been projected through to Encounter Projection. **Nothing renders differently on `/undrifted` yet** — this OAR seats the model; consuming it in FREE is explicitly a separate, later renderer OAR.

---

## 1. Issue-Page Model Standing

**No suitable existing table was found** (checked `information_schema.tables` for anything matching `%page%` before creating one — confirmed empty). Created `public.measures_publication_issue_page` (migration `20260708014143`), matching this OAR2's minimum field list exactly, plus the two extra fields the schema needs to function (`id`, `created_at`/`updated_at` already counted). `page_role` is a checked enum (`cover`, `editors_letter`, `contents`, `cover_story`, `dispatches`, `launch_encounter`); `page_key`/`page_number` (unique per `publication_key`+`issue_id`) are authority, `route_path` is stored but explicitly not used as a uniqueness or authority constraint, per this OAR2's instruction. RLS enabled, mirroring the sibling Publication-layer tables' actual convention (checked `pg_policies` on `measures_publication_registry`/`measures_publication_dispatch` first, rather than assuming) — single public-read policy gated on `visibility_state = 'visible'`.

## 2. Issue 001 Pages Registered

All six seated (migration `20260708014404`), in order:

| # | page_role | title | asset_id | dispatch_key | banner_asset_id | release_state |
|---|---|---|---|---|---|---|
| 1 | cover | Issue 001 | — | — | — | `released` |
| 2 | editors_letter | From the Editor | `undrifted_issue01_editors_letter_article_v1` | `editors_letter_issue001_v1` | `undrifted_issue01_editors_letter_codexstone_banner_v1` | `released` |
| 3 | contents | Contents | — | — | — | `released` |
| 4 | cover_story | AI Isn't Broken. Systems Are. | `undrifted_issue01_ai_isnt_broken_systems_are_article_v1` | `ai_isnt_broken_systems_are_dispatch_v1` | `undrifted_ai_isnt_broken_landing_banner_v1` | **`held`** |
| 5 | dispatches | Dispatches | — | — | — | `released` |
| 6 | launch_encounter | AI Operations Assessment | — | — | — | `released` |

**No blockers — every referenced asset_id, dispatch_key, and banner_asset_id already existed** from prior OARs this session; none were invented. Page 4 (`cover_story`) is deliberately seated `release_state: 'held'` (not `'released'`) — its dispatch is still `status: 'draft'` (Paragraph publish blocked by rate limiting, per the immediately-prior OAR1), so this directly enforces this OAR2's Routed §4 instruction: "do not make the cover story clickable until... the cover story article is published." All six rows are `visibility_state: 'not_rendered'` — honest, since no renderer consumes this table yet (see §6).

## 3. Publication Encounter Profile Update

Extended the already-seated `encounter_profile` object inside `measures_publication_registry.metadata` (migration `20260708014521`) via `jsonb_set` targeting only the `encounter_profile` path — verified `profile_key` and every pre-existing field (`route_scope`, `viewport_contract`, `region_order`, `region_weights`, `masthead_behavior`, etc.) are untouched. Added exactly the six fields requested:

- `issue_page_sequence` — the six `page_key`s in order
- `front_matter_sequence` — `[cover, editors_letter, contents]`
- `article_sequence` — `[cover_story, dispatches]`
- `encounter_sequence` — `[launch_encounter]`
- `layout_profiles` — a map of all six `page_role → layout_profile_key`
- `held_future_renderers` — `[flipbook_renderer, page_turn_animation, issue_archive_library, contributor_registry, social_registry, feed, comments]`, per Routed §7

No visual flip behavior was built — these are data fields only.

## 4. Route Model — Assessed, Prepared as Held, Not Implemented

**Classification: prepared as held routes; implementing them requires a later route OAR.** Reused the exact tracing already done in the prior finalize OAR1 rather than re-deriving it: routing in this app is not dynamically derived from any DB `public_routes` field despite one existing — it's a hardcoded `ROUTE_SURFACE_MAP` / closed `EncounterSurface` TypeScript union in `MeasuresRegistryOrchestrator.tsx` / `types/encounterRendererTypes.ts`. Making `/undrifted/issue-001`, `/undrifted/issue-001/editors-letter`, and `/undrifted/issue-001/ai-isnt-broken-systems-are` real would require: new `EncounterSurface` literals, new `ROUTE_SURFACE_MAP`/`PUBLIC_ROUTE_BY_SURFACE` entries, new `measures_encounter_surface_assignment` rows, and new dispatch branches in `LapisChamberRenderer.tsx` — none of that was touched this pass (`Executor may not: hardcode page sequence in FREE`, and building routing ahead of a rendering plan risks exactly that).

Each page row stores its intended `route_path` and a `metadata.route_state: 'held'` marker (`'live_but_not_wired_as_issue_page'` for the launch_encounter page, since `/ai-operations-assessment` itself is already live — only its role *as an issue-sequence page* is unwired). Nothing was route-implemented.

## 5. Paragraph / External URL Standing

Preserved as distribution, not authority, per Routed §5: the Editor's Letter page row carries `metadata.external_url: 'https://paragraph.com/@undrifted/from-the-editor'` (the real, live URL) alongside its own internal `route_path`. The cover story page row has no `external_url` yet — correctly, since it isn't published (§2). No page's `route_path` was set to a Paragraph URL; the canonical route stays `/undrifted/...`.

## 6. Projection Update

`measures_encounter_def.metadata.encounter_profile` re-synced from the now-extended Publication Registry copy (migration `20260708014633`) — confirmed via query: `issue_page_sequence` present, 6 entries. `scripts/regenerate-undrifted-encounter-projection.cjs` needed no code change — it already projects `encounter_profile` as a whole object, so this extension flowed through automatically; added a comment documenting why for future readers.

**Renderer blocker returned, as explicitly allowed:** nothing in `LapisChamberRenderer.tsx` or `lapis.css` reads `issue_page_sequence` (or any of the five sibling fields) yet. Consuming it — i.e. actually rendering Issue 001 as a sequence of pages — is a distinct implementation task or its own OAR2, not attempted here.

## 7. Held Future Expansion

Recorded only, not implemented: flipbook renderer, page-turn animation, issue archive/library, contributor registry, social registry, feed, comments (§3's `held_future_renderers`).

---

## Blockers

1. **Cover story page held** — mirrors the standing blocker from the immediately-prior OAR1 (Paragraph publish rate-limited). Once published, flip `measures_publication_issue_page` row 4 to `release_state: 'released'`.
2. **No renderer consumes the page model yet** — `issue_page_sequence` and friends are real, seated, correct data with nothing reading them. Needs its own OAR2, explicitly scoped to touch `LapisChamberRenderer.tsx`/routing (this OAR2 did not authorize that).
3. **Issue-page routes remain unimplemented** (§4) — same reasoning as the finalize OAR2's deferred routing, now extended to three more paths.

## Files / Migrations

```
supabase/migrations/20260708014143_seat_undrifted_publication_issue_page_model.sql
supabase/migrations/20260708014404_register_undrifted_issue001_launch_page_sequence.sql
supabase/migrations/20260708014521_extend_undrifted_encounter_profile_with_issue_page_sequence.sql
supabase/migrations/20260708014633_project_undrifted_issue_page_sequence_into_encounter_def.sql
scripts/regenerate-undrifted-encounter-projection.cjs   (comment only, no logic change)
```

## Next Recommended OAR2

Once the cover story is actually published (retry blocked by rate limiting — see prior OAR1), a renderer OAR2 explicitly scoped to consume `issue_page_sequence` in `LapisChamberRenderer.tsx` and seat the three held routes — that's the point at which Issue 001 stops being a registered data model and starts being a navigable multi-page experience.
