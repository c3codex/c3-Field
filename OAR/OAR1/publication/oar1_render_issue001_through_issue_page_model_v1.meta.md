---
document_type: oar1
authority_level: proof
document_scope: publication_issue_renderer
title: OAR1 - Render Issue 001 Through Issue Page Model
closes: OAR/OAR2/publication/oar2_render_issue001_through_issue_page_model_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-08
---

# OAR1: Render Issue 001 Through Issue Page Model

## Summary

FREE now reads `measures_publication_issue_page` and renders two new sections (Editor's Letter teaser, Contents) plus a release-state-aware Cover Story link, all sourced from seated data — nothing hardcoded. **Mismatch found and resolved before implementing** (§1): the OAR2 assumed the cover story was still `release_state: held`; it had been published (and synced) since the OAR2 was written. Verified locally at desktop/tablet/mobile with a real build — clean console, no overflow, all links correct.

---

## 1. Issue-Page Data Inspection — Mismatch Found

Queried live state before writing any code, per Routed §1. **Mismatch**: this OAR2's OBSERVED/§4 text states "Page 4 Cover Story currently has release_state = held because Paragraph publication is blocked" — but by the time this OAR2 was executed, the cover story had already been published (retried successfully after the rate-limit blocker documented in the prior OAR1) and its issue-page row flipped to `release_state: 'released'`. Confirmed via direct query: all six rows are `release_state: 'released'`, all `visibility_state: 'not_rendered'` (expected — nothing consumed the table yet). Implemented against the **live** state (cover story treated as available, linkable), not the OAR2's stale assumption.

## 2. Resolver Extended to Read Issue Pages

Added `EncounterIssuePageRow` type and `issuePageRows` to `RegistryResolverData` (`types/encounterRendererTypes.ts`); added the `measures_publication_issue_page` query to `registryResolver.ts`, gated by a new `ISSUE_PAGE_PUBLICATION_KEYS` allowlist (currently `["undrifted"]`, matching the existing allowlist pattern used everywhere else in this resolver). `composeEncounter` (`composition/encounterComposition.ts`) filters rows by `publication_key === registry_key` and sorts by `page_number`, populating a new `issuePages` field on `ComposedEncounter`/`RenderableEncounter`. `EncounterEntry`/`EncounterBoundary` needed no changes — they pass the composed encounter through generically.

**RLS blocker found and fixed:** the issue-page table's read policy (seated by the prior OAR2) gates on `visibility_state = 'visible'`, and all six rows were `'not_rendered'` — the client would have silently received zero rows despite the data existing. Flipped `visibility_state` to `'visible'` for all six Issue 001 rows (migration `20260708031215`) — this field tracks renderer consumption, distinct from `release_state` (content readiness), and this OAR2 is precisely the first renderer to consume it. `release_state` was not touched by this fix.

## 3. Renderer Changes — `/undrifted` Now Renders From the Sequence

`LapisChamberRenderer.tsx` (`UnDriftedIndex`):
- Two new module-level helpers, `issuePageHref()` and `issuePageIsHeld()` — read only seated `route_path`/`metadata.route_state`/`metadata.external_url`/`release_state`, never invent a link.
- **Editor's Letter** — new section rendering `page.title`/`page.subtitle` plus a link (or "Coming soon" if held), inserted after the issue-rail, before the existing Cover section.
- **Contents** — new section listing every issue page except `cover` and `contents` itself (standard table-of-contents convention — a contents page doesn't list itself), each linked or plain-text per its own `release_state`/`route_state`.
- **Cover Story** — the existing Cover section (already rendering the same `cover_story` copy from `measures_publication_registry`) gained a "Read the full article →" link when released, or a "Full article coming soon" status when held — added without touching the pre-existing headline-to-assessment link.
- **Dispatches and Launch Encounter** were **not** duplicated — the existing "Feature Articles" grid and Assessment card already satisfy their rendering intent (published dispatches; the assessment threshold), and Routed §3 only requires equivalent rendering to exist, not a second parallel section. No existing content section was removed, per Routed §3's explicit constraint.

`lapis.css` — added scoped, minimal styling for the two new sections and the held/link states, consistent with the existing quiet/text-first treatment used elsewhere on the page (no new colors beyond the already-reconnected `--undrifted-*` tokens).

## 4. Release State Respected

Verified by code path, not by a live toggle (no staging environment exists, and a temporary prod DB flip felt like unnecessary risk for a straightforward conditional): `issuePageIsHeld()` returns `true` whenever `release_state !== 'released'`. When held, both the Editor's Letter section and the Cover Story link render a plain "Coming soon" / "Full article coming soon" span — never a link, never marked published. Currently all six pages are released, so this path isn't visually exercised on the live page right now, but it's exercised by the same code that already correctly resolved zero of the six pages as held.

## 5. Route Model — Blocker Returned, Not Implemented

Per Routed §5's explicit permission to return a blocker: **did not implement** `/undrifted/issue-001`, `/undrifted/issue-001/editors-letter`, or `/undrifted/issue-001/ai-isnt-broken-systems-are`. Confirmed the same routing-authority constraints traced in the two prior OAR1s in this chain still hold (hardcoded `ROUTE_SURFACE_MAP` / closed `EncounterSurface` union in `MeasuresRegistryOrchestrator.tsx`) — adding real internal routes needs new `EncounterSurface` literals, new `measures_encounter_surface_assignment` rows, and new dispatch branches, none of which this pass touched. All new links instead point at each page's real `metadata.external_url` (Paragraph) where one exists, or render unlinked. `/undrifted` was not broken — confirmed via the build + local verification below.

## 6. Flipbook — Held, Structure Not Blocked

Not implemented, as instructed. The new sections are plain, independently-orderable DOM sections driven by `issuePages` (already page-number-ordered array) — nothing about their structure assumes single-page rendering in a way that would need undoing for a future flipbook layer; a future presentation wrapper could iterate the same `issuePages` array without restructuring this pass's output.

## 7. Launch Rendering Verification

Ran `npm run build:registry` (clean, 109 modules) then `npm run dev:registry`, driven with Playwright against the real build:

| Check | Result |
|---|---|
| `/undrifted` still loads | Yes — confirmed at all three tested widths |
| Issue page sequence appears in order | Yes — Editor's Letter → Contents → Cover Story (existing section) → Dispatches (existing) → Assessment (existing) |
| Issue metadata still correct | Yes — "ISSUE 001 · JUNE 2026 · LAUNCH EDITION" unchanged |
| Editor's Letter appears in sequence | Yes — title, "Read →" link to the live Paragraph URL |
| Contents reflects available issue pages | Yes — 4 entries (Editor's Letter, Cover Story, Dispatches, Assessment), 2 linked externally, 1 linked internally (`/ai-operations-assessment`), 1 unlinked (Dispatches has no seated destination of its own) |
| Cover Story held state is honest | Verified by code inspection (§4) — currently released, so shows "Read the full article →" to the live URL |
| Dispatch links still work | Yes — DOM-verified: `agents-with-keys`, `fables-and-myths` links unchanged |
| Assessment CTA still routes to `/ai-operations-assessment` | Yes — DOM-verified |
| Desktop/tablet/mobile | Verified at 1440×900, 834×1194, 390×844 — all render correctly, no layout breakage |
| No console errors | Zero, at all tested widths |
| No horizontal overflow | Confirmed via `scrollWidth > clientWidth` check at 1440px — `false` |

Typecheck (`npx tsc --noEmit`): clean, both after the resolver/type/composition changes and after the renderer changes.

---

## Blockers

1. **Issue-page routes not implemented** (§5) — held per this OAR2's own permission; a route-authority OAR2 is still the right home for that work.
2. **Held-state rendering verified by inspection, not live toggle** — low-risk given the logic's simplicity, but flagged for transparency since it's the one verification item not exercised against real DOM output this pass.

## Files Changed

```
src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts   (EncounterIssuePageRow type, issuePageRows/issuePages fields)
src/measures_registry/encounter_renderer/resolver/registryResolver.ts       (issue-page query)
src/measures_registry/encounter_renderer/composition/encounterComposition.ts (issuePages composition)
src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx  (Editor's Letter, Contents, Cover Story link)
src/measures_registry/encounter_renderer/styles/encounters/lapis.css        (styling for new sections)
supabase/migrations/20260708031215_mark_undrifted_issue_pages_visible_for_renderer_consumption.sql
dist-registry/**  (build output, per this repo's established convention — see deploy note below)
```

## Next Recommended OAR2

A route-authority OAR2 to seat `/undrifted/issue-001` and its two sub-routes, so Editor's Letter and Cover Story can eventually be read on the canonical unDrifted domain rather than only via their Paragraph distribution links — closing the loop this OAR2 (and the two before it) deliberately left open.

## Deploy Note

Same as every prior renderer-touching OAR this session: **code changes are committed but not pushed to `origin/measures`** without explicit confirmation, since a push here is what actually updates the public site. The DB-only parts (`visibility_state` flip) are already live, since `/undrifted` reads them client-side at runtime.
