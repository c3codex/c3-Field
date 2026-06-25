---
document_type: oar1
authority_level: working
title: OAR1 — Encounter Renderer Chamber Router
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_encounter_renderer_chamber_router_v1.meta.md
---

# OAR1 — Encounter Renderer Chamber Router

## OBJECTIVE

Chamber Router created.

Accepts only `RenderableEncounter`. Dispatches from `encounter.chamberAssignment`.
Routes Obsidian to `ObsidianChamberRenderer`. Returns public-safe gap state for unimplemented chambers.
No DB access. No authority logic. No release logic. No composition. No live cutover.

One file created. No migration. No DB changes. No entry point changes. No monolith edits.
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
→ Chamber Router          ← THIS OAR
→ Chamber Renderer
→ Surface
```

---

## FILE CREATED

### NEW: `router/ChamberRouter.tsx` (~72 LOC)

**Props contract:**
```typescript
export type ChamberRouterProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
```

- Accepts only `RenderableEncounter` — no composed encounter, no resolver data, no held state
- Shell callbacks (`onNavigate`, `onCaptureAssessment`, `renderHeader`, `renderSystemFooter`) passed through to chamber renderer; the router does not consume them

**Dispatch logic:**

```
encounter.chamberAssignment
  "ObsidianChamberRenderer"  → ObsidianChamberRenderer (implemented)
  "CrystalSeatRenderer"      → renderer gap state
  "LapisChamberRenderer"     → renderer gap state
  "MarbleChamberRenderer"    → renderer gap state
  never (exhausted union)    → public-safe unavailable state
```

Dispatch reads `encounter.chamberAssignment` — seated by DB surface assignment, carried through `ComposedEncounter` → `RenderableEncounter`. The router never infers chamber from surface name, material name, route, registry key, or component availability.

**Exhaustiveness check:**

`ChamberAssignment` is a closed four-member union in `encounterRendererTypes.ts`. After the two if-branches cover all four members, TypeScript narrows `chamberAssignment` to `never`. A `_exhaustive: never = chamberAssignment` assertion confirms this statically. Zero errors.

---

## RENDERER GAP STATE

For `CrystalSeatRenderer`, `LapisChamberRenderer`, `MarbleChamberRenderer`:

```html
<main data-release-standing="renderer_gap" data-layout-contract="renderer_gap">
  <section class="registry-held-state">This surface is not yet available.</section>
</main>
```

- `data-material-family` carries `encounter.materialIdentity` (seated value)
- No internal standing exposed
- No fallback to Obsidian

For unknown assignment (unreachable with current union, future-proofing):

```html
<main data-release-standing="unavailable" data-layout-contract="unavailable">
  <section class="registry-held-state">This surface is unavailable.</section>
</main>
```

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  router/
    ChamberRouter.tsx                  ← NEW (~72 LOC)
  chambers/
    ObsidianChamberRenderer.tsx        unchanged
  composition/
    encounterComposition.ts            unchanged
  resolver/
    registryResolver.ts                unchanged
    releaseGate.ts                     unchanged
    transitionResolver.ts              unchanged
    encounterProfileLoader.ts          unchanged
  types/
    encounterRendererTypes.ts          unchanged
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Layer | Does | Does Not |
|---|---|---|
| `ChamberRouter` | Dispatches `chamberAssignment` → renderer | Query DB, gate, compose, infer chamber |
| `ObsidianChamberRenderer` | Renders obsidian presentation | Route, decide authority |
| `encounterProfileLoader` | Orchestrates, gates | Route, render |
| `releaseGate` | Evaluates registry standing | Route, compose |

---

## NOTCHAZZ FLAGS

None raised.

- Router accepts only `RenderableEncounter` — no held state, no composed encounter
- Dispatch source is `encounter.chamberAssignment` exclusively — not surface name, not material name
- No fallback to Obsidian for unimplemented chambers
- No DB import, no Supabase import
- No release gate call
- No composition call
- TypeScript exhaustiveness enforced via `never` assertion
- No live cutover — not wired to entry point

---

## VALIDATION

| Constraint | Status |
|---|---|
| `router/ChamberRouter.tsx` created | PASS |
| Dispatches from `encounter.chamberAssignment` | PASS |
| `ObsidianChamberRenderer` routed correctly | PASS |
| Renderer gap for Crystal, Lapis, Marble | PASS |
| No fallback to Obsidian | PASS |
| Exhaustiveness check (`never` assertion) | PASS |
| No DB access | PASS |
| No release logic | PASS |
| No composition logic | PASS |
| No entry point wired | PASS |
| No monolith edited | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 8.27s |

---

## CLOSE

Chamber Router exists.
It routes. It does not decide.

Commit: `3d81b84`

Recommended next OAR2: `oar2_encounter_renderer_shell_v1` (Phase 4 — shell + entry point)
or additional chamber renderers (Crystal, Lapis, Marble) before shell wiring per operator direction.
