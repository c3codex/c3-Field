---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_publication_surface_deprecation
title: OAR1 - Deprecate Stale Publication Dispatch Surface
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_deprecate_stale_publication_dispatch_surface_v1.meta.md
operator: op044
system: measures_registry
executed_at: 2026-07-05
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: encounter_renderer
tags:
  - oar1
  - measures-registry
  - publication-dispatch
  - deprecated-surface
  - undrifted
  - route-cleanup
---

# OAR1 - Deprecate Stale Publication Dispatch Surface

## Result

RESOLVED.

`publication_dispatch` is marked deprecated in DB metadata with historical trace intact (no row deleted). `/publication/structural_drift` and all of its sub-paths now resolve to the active `lapis_chamber_encounter` surface (`/undrifted`) instead of the unprofiled `publication_dispatch` surface. No content, style, layout, or visual redesign occurred on `/about` or `/undrifted`.

## 1. Reference Inventory

Searched all of `src/` and `public/` for `publication_dispatch`, `structural_drift`, `PublicationDispatch`, and `/publication/`.

| reference | file | finding |
| --- | --- | --- |
| `PUBLIC_ROUTE_BY_SURFACE["publication_dispatch"]` | `MeasuresRegistryOrchestrator.tsx:80` | Maps the surface to `/publication/structural_drift` for history-URL writing only; only reachable if `publication_dispatch` becomes the active surface, which (after this OAR) it no longer can. Left in place — harmless, preserves historical trace, not required to remove. |
| `initialSurface()` route resolution | `MeasuresRegistryOrchestrator.tsx:93-103` (pre-fix) | `/publication/structural_drift/<slug>` resolved to `publication_dispatch`; the bare path `/publication/structural_drift` already resolved to `lapis_chamber_encounter`. This inconsistency — bare path already redirecting, only sub-paths hitting the stale surface — is itself evidence the surface was drifting toward unused. |
| `PublicationDispatch` render branch | `LapisChamberRenderer.tsx` | Renderer component exists and switches on `surface === "publication_dispatch"`; left in place (not deleted — OAR2 forbids creating a new article renderer but does not require removing the existing dead branch, and doing so would exceed "route-standing cleanup only"). It is now unreachable via any route. |
| `EncounterSurface` union member | `encounterRendererTypes.ts:33` | `"publication_dispatch"` remains a valid type member (still referenced by the renderer branch above). Not removed. |
| `structural_drift_dispatches` capture context | `MeasuresRegistryOrchestrator.tsx:463` | `onCaptureSubscription`'s default `capture_context` string for the lapis subscription form — an unrelated string literal, not a route or the surface being deprecated. Not touched. |
| Governance audit references | `GovernanceAuditSurface.tsx` (lines 34, 59, 78, 250-260, 638-641, 704-705) | References a **different** table (`measures_publication_dispatch`, plural-prefixed) and registry keys `structural_drift_publication` / `structural_drift_dispatches` — a separate legacy audit surface, not the `measures_encounter_surface_assignment` row named `publication_dispatch` this OAR governs. Confirmed distinct; not touched. |
| `App.tsx` `/structural-drift` SEO metadata + orchestrator's own legacy-alias redirect | `App.tsx:84`, `MeasuresRegistryOrchestrator.tsx` (`useEffect` redirecting `/structural-drift` → `/undrifted`) | A pre-existing, unrelated legacy path (`/structural-drift`, no `/publication/` prefix) that already hard-redirects to `/undrifted`. Confirms the site's established pattern for retiring old publication paths in favor of `/undrifted`; not modified. |
| `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` | `public/` | No references to `publication_dispatch` or `/publication/structural_drift` found. |
| DB content (`measures_encounter_def.metadata` for `undrifted` and `about_measures_registry`) | Supabase query | `featured_article_set` article links point to external `https://paragraph.com/@undrifted/...` URLs (`target="_blank"`). The About page's `undrifted_bridge_section.cta_url` is `/undrifted`. No DB-seeded content links to `/publication/structural_drift` anywhere. |

**Finding: `/publication/structural_drift` is not actively linked from any public navigation, homepage, about page, unDrifted page, footer, sitemap, llms.txt, JSON-LD, or DB-seeded content.** The only way to reach it was a direct/historical URL hit.

## 2. Active Surfaces Confirmed Distinct

- `crystal_seat_encounter` (`/about`) — untouched. Still governs institutional/about content; its `undrifted_bridge_section` correctly links to `/undrifted`, not to `publication_dispatch`.
- `lapis_chamber_encounter` (`/undrifted`) — untouched. Remains the active governed unDrifted publication index.

No content was moved between these surfaces. Neither surface's metadata, layout, composition, or render authority (seated in the three prior OARs in this sequence) was altered.

## 3. Deprecation Seating

Seated as sibling keys on the existing `measures_encounter_surface_assignment.metadata` row for `surface_key = 'publication_dispatch'` (no new row, no duplicate authority surface, no row deleted):

```sql
update public.measures_encounter_surface_assignment
set metadata = metadata || jsonb_build_object(
  'deprecated_surface', true,
  'deprecated_reason', 'stale individual publication dispatch route; /undrifted is active publication index and /about is governed separately',
  'deprecated_by_oar', 'oar2_deprecate_stale_publication_dispatch_surface_v1',
  'replacement_surface', 'lapis_chamber_encounter',
  'replacement_route', '/undrifted'
)
where surface_key = 'publication_dispatch';
```

`measures_encounter_surface_assignment` has no separate release/access-state column distinct from `metadata` for this table, so metadata is the correct authority surface for this standing, per OAR2 §3's fallback instruction ("if metadata is the current authority surface"). `release_state_behavior` was left as-is (still `null` from the prior OAR — never seated for this surface since it never had a `style_profile`); deprecation standing is now recorded via the five keys above instead.

## 4. Route Behavior Change

`src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx`, `initialSurface()`:

Before:
```ts
if (pathname.startsWith("/publication/structural_drift/")) return "publication_dispatch"
if (pathname === "/publication/structural_drift") return "lapis_chamber_encounter"
```

After:
```ts
// publication_dispatch deprecated (OAR2 "Deprecate Stale Publication Dispatch Surface") —
// /undrifted is the active governed publication index; route all /publication/structural_drift*
// paths there rather than to the unprofiled publication_dispatch surface.
if (pathname === "/publication/structural_drift" || pathname.startsWith("/publication/structural_drift/")) {
  return "lapis_chamber_encounter"
}
```

This is the OAR2-preferred behavior ("route `/publication/structural_drift` to `/undrifted`"), applied uniformly to the bare path and all sub-paths — `publication_dispatch` is no longer reachable through the app's own routing under any path. No new article page was created; no CSS, `/about` layout, `/undrifted` layout, MAP, payment, assessment, or public-claims logic was touched.

### Verified in browser

Ran against a local dev server (unmodified production source otherwise, same Supabase project):

| path requested | resulting URL | resulting surface |
| --- | --- | --- |
| `/publication/structural_drift/some-old-article-slug` | `/undrifted` | `lapis_chamber_encounter` |
| `/publication/structural_drift` | `/undrifted` | `lapis_chamber_encounter` |

Screenshot: `oar1_deprecate_stale_publication_dispatch_surface_v1_evidence/01_publication_dispatch_redirect_to_undrifted.png` (unDrifted page rendered at `/undrifted` after requesting the deprecated sub-path).

## 5. Validation Scope Cleanup

The three prior OARs in this sequence ([oar1_browser_qa_seat_held_encounter_style_fields_v1](oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md), [oar1_seat_encounter_layout_and_composition_authority_v1](oar1_seat_encounter_layout_and_composition_authority_v1.meta.md), [oar1_seat_render_intent_authority_for_layout_composition_drift_v1](oar1_seat_render_intent_authority_for_layout_composition_drift_v1.meta.md)) each carried `publication_dispatch` in their validation queries as a **known gap** (unseated, awaiting a `style_profile` binding decision), separate from the 14 active surfaces. No code-level "active surface list" exists in `src/` that enumerates `publication_dispatch` alongside the 14 — `registryResolver.ts` fetches `measures_encounter_surface_assignment` unfiltered by surface key, so there is no list to edit there.

Going forward, `publication_dispatch` should be treated as **deprecated**, not merely **unseated-pending-binding** — style/layout/composition/render OARs should exclude it from their active-surface set entirely rather than reporting it as an open gap each time. This OAR1, and the `deprecated_surface: true` DB flag, is the record future OARs should check.

Historical trace is preserved: the row itself, its `surface_key`, `registry_key`, `encounter_key`, and `public_routes` are unchanged; only deprecation metadata was added, and the three prior OAR1 documents in this directory are untouched.

## Validation Query Output

```sql
select
  surface_key,
  registry_key,
  encounter_key,
  public_routes,
  metadata->>'style_profile' as style_profile,
  metadata->>'deprecated_surface' as deprecated_surface,
  metadata->>'deprecated_reason' as deprecated_reason,
  metadata->>'deprecated_by_oar' as deprecated_by_oar,
  metadata->>'replacement_surface' as replacement_surface,
  metadata->>'replacement_route' as replacement_route
from public.measures_encounter_surface_assignment
where surface_key = 'publication_dispatch';
```

| surface_key | registry_key | encounter_key | public_routes | style_profile | deprecated_surface | deprecated_reason | deprecated_by_oar | replacement_surface | replacement_route |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| publication_dispatch | undrifted | undrifted | `["/publication/structural_drift"]` | null | true | stale individual publication dispatch route; /undrifted is active publication index and /about is governed separately | oar2_deprecate_stale_publication_dispatch_surface_v1 | lapis_chamber_encounter | /undrifted |

`style_profile` remains `null` — consistent with every prior OAR in this sequence, and consistent with OAR2's instruction not to invent one. No other row was changed by this query; `crystal_seat_encounter` and `lapis_chamber_encounter` rows are unmodified (not re-queried here since neither their metadata nor their content changed).

## Boundary Preservation

- No CSS was rewritten.
- No new renderer style attributes were wired; the existing `PublicationDispatch` render branch was left as dead code, not extended or redesigned.
- No article renderer was created.
- `/undrifted` layout and content were not changed.
- `/about` layout and content were not changed.
- MAP, payment, assessment, release, and public-claims logic were not touched.
- No DB row was deleted — `publication_dispatch` retains its full historical row (`surface_key`, `registry_key`, `encounter_key`, `public_routes` all unchanged).
- No duplicate authority surface was created.

## Closeout

`publication_dispatch` is now explicitly deprecated rather than left as an open, unseated gap. `/publication/structural_drift` and its sub-paths route to the actual active publication index (`/undrifted`) instead of a surface with no style profile and no public purpose. `/about` and `/undrifted` remain distinct and unmodified. Historical trace is preserved in full.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody executed the route fix and deprecation seating.
src renders only seated standing.
