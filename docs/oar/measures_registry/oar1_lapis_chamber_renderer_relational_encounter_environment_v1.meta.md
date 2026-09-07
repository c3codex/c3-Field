---
document_type: oar1
authority_level: working
title: OAR1 — Lapis Chamber Renderer (Relational Encounter Environment)
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_lapis_chamber_renderer_relational_encounter_environment_v1.meta.md
---

# OAR1 — Lapis Chamber Renderer (Relational Encounter Environment)

## OBJECTIVE

Lapis Chamber Renderer created.

Accepts only `RenderableEncounter`. Contains presentation logic only.
Zero authority logic. Zero DB access. Zero assessment logic. Zero governance logic.

Two files changed. No migration. No DB changes. No entry point changes. No monolith edits.
Build passes. Zero TypeScript errors.

---

## AUTHORITY ORDER (confirmed)

```
Codex
→ Registry Standing       (measures_registry)
→ Surface Assignment      (measures_encounter_surface_assignment)
→ Encounter Definition    (measures_encounter_def)
→ Encounter Composition   (composition/encounterComposition.ts)
→ Release Gate            (checkReleaseGate — evaluated after composition)
→ Renderable Encounter    (RenderableEncounter — gate-narrowed)
→ Chamber Router          (dispatches lapis → LapisChamberRenderer)
→ Lapis Chamber Renderer  ← THIS OAR
→ Surface
```

---

## FILE CREATED

### NEW: `chambers/LapisChamberRenderer.tsx` (~330 LOC)

**Props contract:**
```typescript
export type SubscriptionCapturePayload = {
  email: string
  organization: string | null
  dispatchKey: string | null
}

export type LapisChamberProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
```

- Accepts only `RenderableEncounter` — no resolver data, no registry rows, no held state
- `onCaptureSubscription` is optional — shell provides the DB write in Phase 4; omitting disables subscription capture without breaking rendering
- Follows the same shell callback pattern as `ObsidianChamberRenderer.onCaptureAssessment`

**Presentation dispatch:**

| Surface | Sub-presentation |
|---|---|
| `structural_drift_dispatches` | `UnDriftedIndex` — publication landing from `encounterDef.metadata` + `mediaByRole` |
| `publication_dispatch` | `PublicationDispatch` — container + honest gap (dispatch data not in encounter model) |
| any other lapis surface | Renderer gap — `data-release-standing="renderer_gap"` |

---

## PRESENTATION PRINCIPLES (per OAR2)

**Content from encounter data — not hardcoded:**
- Brand: `encounterDef.metadata.brand_copy.header`, `.principles_line`
- Issue: `encounterDef.metadata.issue_record.issue_number`, `.issue_date`, `.edition`
- Cover story: `encounterDef.metadata.cover_story.feature_headline`, `.feature_deck`, etc.
- Editor's feature: `encounterDef.metadata.assessment_feature.*`
- Role call: `encounterDef.metadata.role_call_feature.*`
- Next issue: `encounterDef.metadata.next_issue_teaser.*`
- Footer: `encounterDef.metadata.footer_record.*`
- Featured articles: `encounterDef.metadata.featured_article_set[]`
- Landing/style contracts: `encounterDef.metadata.landing_design_contract.*`

**Media from `encounter.mediaByRole` — no DB access:**
- `undrifted_fill` / `ai_isnt_broken_landing` — banner
- `measures_registry_logo` — registry mark
- `agents_with_keys_cover`, `fables_and_myths_cover` — article covers

All media omitted gracefully when role not in map. The resolver's `MEDIA_ROLES` list does not yet include all lapis-specific roles — extending the resolver is a separate OAR.

**Null-safe throughout:**
- `encounterDef` may be `null` for lapis surfaces (not yet seeded in `measures_encounter_def`)
- `meta` derived via `asRecord()` — all content fields resolved safely
- Elements omit when content is absent — no invented fallback

---

## DATA BOUNDARY NOTE

`publication_dispatch` surface in the monolith reads from `measures_publication_dispatch`
(specific issue articles: dispatch_body, references, media_manifest, etc.). This table is
NOT queried by the registry resolver — it is not in `RegistryResolverData`.

`LapisChamberRenderer` renders an honest governed gap for this surface:

```html
<section data-gap-reason="publication_dispatch_not_in_encounter_model">
  Publication dispatch content is not yet seated in the encounter data model.
</section>
```

When the resolver is extended to include publication dispatch rows, this surface renders
the full article. No placeholder content. No invented fallback.

---

## FILE UPDATED

### UPDATED: `router/ChamberRouter.tsx`

- Added `LapisChamberRenderer` import + `SubscriptionCapturePayload` type import
- Added `onCaptureSubscription?` to `ChamberRouterProps`
- `"lapis"` now dispatches to `LapisChamberRenderer` (previously: renderer gap)
- `"crystal_seat"` and `"marble"` remain renderer gap (not yet implemented)
- TypeScript `never` exhaustiveness assertion still holds — all 4 union members handled

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  chambers/
    LapisChamberRenderer.tsx           ← NEW (~330 LOC)
    ObsidianChamberRenderer.tsx        unchanged
  composition/
    encounterComposition.ts            unchanged
  resolver/
    registryResolver.ts                unchanged
    releaseGate.ts                     unchanged
    transitionResolver.ts              unchanged
    encounterProfileLoader.ts          unchanged
  router/
    ChamberRouter.tsx                  updated — lapis dispatch + onCaptureSubscription
  types/
    encounterRendererTypes.ts          unchanged
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Concern | Owner | Not in chamber |
|---|---|---|
| Environment assignment | DB (surface assignment) | ✓ |
| Release gate | `encounterProfileLoader` | ✓ |
| Registry authority | `registryResolver` + `measures_registry` | ✓ |
| DB reads | `registryResolver` | ✓ |
| DB writes (subscription) | Shell via `onCaptureSubscription` callback | ✓ |
| Assessment logic | `ObsidianChamberRenderer` | ✓ |
| Governance logic | (future — marble) | ✓ |
| Publication landing presentation | `LapisChamberRenderer` | — |
| Publication dispatch container | `LapisChamberRenderer` | — |
| Local form state | `LapisChamberRenderer` | — |

---

## NOTCHAZZ FLAGS

None raised.

- Renderer accepts only `RenderableEncounter` — no `ComposedEncounter`, no held state, no resolver data
- No Supabase import in this file
- No authority decisions made in this file
- No assessment logic, no governance logic
- No hardcoded encounter content (all from `encounterDef.metadata` and `mediaByRole`)
- `onCaptureSubscription` optional callback — mutation lives in shell
- Honest gap for `publication_dispatch` — no invented content, no fallback to monolith data
- No shell integration started
- No monolith edited
- No live cutover

---

## VALIDATION

| Constraint | Status |
|---|---|
| `chambers/LapisChamberRenderer.tsx` created | PASS |
| Accepts only `RenderableEncounter` | PASS |
| No DB access (`supabase` import absent) | PASS |
| No authority logic (release, routing, material, chamber) | PASS |
| No assessment logic | PASS |
| No governance logic | PASS |
| No hardcoded encounter content | PASS |
| Honest gap for publication dispatch (data not in encounter model) | PASS |
| Renderer gap for unknown lapis surfaces | PASS |
| `onCaptureSubscription` optional — Phase 4 wires it | PASS |
| `ChamberRouter` dispatches `"lapis"` → `LapisChamberRenderer` | PASS |
| `ChamberRouter` `never` exhaustiveness still holds | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |
| No live behavior changes | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 9.49s |

---

## CLOSE

`LapisChamberRenderer` exists.
It relates. It does not assess. It does not govern.
Content comes from what Registry has seated. Nothing is invented.

Commit: `e75007b`

Recommended next OAR2:
- `oar2_encounter_renderer_shell_v1` (Phase 4 — shell + entry point)
- Marble chamber renderer
- Crystal Seat renderer
- Resolver extension to include publication dispatch data
