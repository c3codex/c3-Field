---
document_type: oar1
authority_level: working
title: OAR1 — Replace Renderer Name Assignment with Environment Assignment
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_replace_renderer_name_assignment_with_environment_assignment_v1.meta.md
---

# OAR1 — Replace Renderer Name Assignment with Environment Assignment

## OBJECTIVE

Registry no longer stores renderer implementation names.

`ChamberAssignment` renamed to `EncounterEnvironmentAssignment`.
Union values are structural environment identifiers:

- `obsidian`
- `crystal_seat`
- `lapis`
- `marble`

DB assignment rows updated via migration. Router dispatches from environment values.
No live cutover. No monolith edits. No shell wired.
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
→ Chamber Router          (dispatches from EncounterEnvironmentAssignment)
→ Chamber Renderer
→ Surface
```

---

## MIGRATION

### `202606250001_replace_renderer_name_assignment_with_environment_assignment.sql`

Replaces all renderer name values in `measures_encounter_surface_assignment.chamber_assignment`:

| Old value | New value |
|---|---|
| `ObsidianChamberRenderer` | `obsidian` |
| `CrystalSeatRenderer` | `crystal_seat` |
| `LapisChamberRenderer` | `lapis` |
| `MarbleChamberRenderer` | `marble` |

Applied to remote project `zfihrspxvennjzazxcbj` via `supabase db push`.

---

## FILES CHANGED

### UPDATED: `types/encounterRendererTypes.ts`

Renamed type and updated union values:

```typescript
// Before
export type ChamberAssignment =
  | "ObsidianChamberRenderer"
  | "CrystalSeatRenderer"
  | "LapisChamberRenderer"
  | "MarbleChamberRenderer"

// After
export type EncounterEnvironmentAssignment =
  | "obsidian"
  | "crystal_seat"
  | "lapis"
  | "marble"
```

`ComposedEncounter.chamberAssignment` and `RenderableEncounter.chamberAssignment` updated to `EncounterEnvironmentAssignment`.

---

### UPDATED: `composition/encounterComposition.ts`

Import updated: `ChamberAssignment` → `EncounterEnvironmentAssignment`.
Function parameter type updated to match.

---

### UPDATED: `resolver/encounterProfileLoader.ts`

Import updated: `ChamberAssignment` → `EncounterEnvironmentAssignment`.

Validation set updated:

```typescript
// Before
const VALID_CHAMBER_ASSIGNMENTS = new Set<string>([
  "ObsidianChamberRenderer",
  "CrystalSeatRenderer",
  "LapisChamberRenderer",
  "MarbleChamberRenderer",
])

// After
const VALID_CHAMBER_ASSIGNMENTS = new Set<string>([
  "obsidian",
  "crystal_seat",
  "lapis",
  "marble",
])
```

Cast updated: `chamber_assignment as EncounterEnvironmentAssignment`.

---

### UPDATED: `router/ChamberRouter.tsx`

Dispatch strings updated from renderer names to environment values:

```typescript
// Before
if (chamberAssignment === "ObsidianChamberRenderer") { ... }
if (chamberAssignment === "CrystalSeatRenderer" || ...) { ... }

// After
if (chamberAssignment === "obsidian") { ... }
if (chamberAssignment === "crystal_seat" || ...) { ... }
```

TypeScript `never` exhaustiveness assertion still holds — `EncounterEnvironmentAssignment` is a closed four-member union.
No fallback to obsidian.

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  chambers/
    ObsidianChamberRenderer.tsx        unchanged
  composition/
    encounterComposition.ts            updated — EncounterEnvironmentAssignment import
  resolver/
    registryResolver.ts                unchanged
    releaseGate.ts                     unchanged
    transitionResolver.ts              unchanged
    encounterProfileLoader.ts          updated — import + validation set
  router/
    ChamberRouter.tsx                  updated — dispatch strings
  types/
    encounterRendererTypes.ts          updated — type renamed + union values
supabase/migrations/
  202606250001_replace_renderer_name_assignment_with_environment_assignment.sql  NEW
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Layer | Does | Does Not |
|---|---|---|
| `measures_encounter_surface_assignment` | Carries structural environment assignment | Store renderer names |
| `encounterProfileLoader` | Validates DB value against `EncounterEnvironmentAssignment` | Infer from material/surface |
| `ChamberRouter` | Maps environment → renderer component | Query DB, gate, compose, infer |
| `ObsidianChamberRenderer` | Renders obsidian presentation | Route, decide authority |

---

## NOTCHAZZ FLAGS

None raised.

- Registry stores structural environment values only — no renderer names remain
- Crystal is `crystal_seat`, not crystal_chamber or CrystalChamberRenderer
- Router dispatches from `encounter.chamberAssignment` (environment value) — no inference from surface/material
- No fallback to obsidian
- No live entry point changes
- No monolith edits
- TypeScript exhaustiveness maintained via `never` assertion

---

## VALIDATION

| Constraint | Status |
|---|---|
| Migration created and applied | PASS |
| DB rows updated to environment values | PASS |
| `ChamberAssignment` → `EncounterEnvironmentAssignment` renamed | PASS |
| Union values are structural: obsidian, crystal_seat, lapis, marble | PASS |
| Crystal seated as `crystal_seat` (not crystal_chamber) | PASS |
| Router dispatches from environment values | PASS |
| No renderer names remain in registry | PASS |
| No fallback to obsidian | PASS |
| No DB access in router | PASS |
| No live cutover | PASS |
| No monolith edits | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 9.28s |

---

## CLOSE

Registry carries environment assignment.
Renderer names are implementation details.
The software maps environment to renderer.

Commit: `1845f55`

Recommended next OAR2: `oar2_encounter_renderer_shell_v1` (Phase 4 — shell + entry point)
or additional chamber renderers (Crystal Seat, Lapis, Marble) per operator direction.
