---
document_type: oar1
authority_level: working
title: OAR1 — Introduce Renderable Encounter Boundary
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_introduce_renderable_encounter_boundary_v1.meta.md
---

# OAR1 — Introduce Renderable Encounter Boundary

## OBJECTIVE

Post-gate encounter state renamed and narrowed.

`RenderableEncounter` replaces `EncounterProfile` as the post-gate type.
`HeldEncounterState` introduced as the held-path type.
`RenderableEncounterResult` replaces `EncounterProfileResult`.

`EncounterProfile` removed entirely — no alias retained.

Two files changed. No migration. No DB changes. No rendering implementation. No monolith edits.
Build passes. Zero TypeScript errors.

---

## BOUNDARY ENFORCEMENT (confirmed)

```
ComposedEncounter     — assembled seated state, pre-gate
       ↓
  Release Gate        — evaluates registry standing
       ↓
RenderableEncounter   — gateResult narrowed to { status: "released" } only
       ↓
 Chamber Router       — receives RenderableEncounter only (Phase 4)
       ↓
 Chamber Renderer     — receives RenderableEncounter only (Phase 2/3)
```

Held state exits before chamber routing. Chamber renderer cannot receive held state by type.

---

## FILES CHANGED

### UPDATED: `types/encounterRendererTypes.ts`

**Removed:**
- `EncounterProfile` — was `ComposedEncounter` fields + `gateResult: GateResult` (union, ambiguous)
- `EncounterProfileResult` — was `{ loaded: true; profile } | { loaded: false; reason }`

**Added:**

```typescript
export type RenderableEncounter = {
  surface: EncounterSurface
  registryKey: string
  registryRow: RegistryRow
  encounterDef: EncounterDefRow | null
  mediaByRole: Map<string, EncounterMediaRow>
  transitionNodes: Record<string, TransitionNode>
  materialIdentity: MaterialIdentity
  chamberAssignment: ChamberAssignment
  gateResult: { status: "released" }   // narrowed — cannot be held
}

export type HeldEncounterState = {
  surface: EncounterSurface
  reason: string                        // sanitized — must not expose internal standing
}

export type RenderableEncounterResult =
  | { renderable: true; encounter: RenderableEncounter }
  | { renderable: false; reason: string }
```

The key narrowing: `RenderableEncounter.gateResult` is typed as `{ status: "released" }` — not the full `GateResult` union. Held gate results cannot satisfy this type. A chamber renderer accepting `RenderableEncounter` is structurally barred from receiving held state.

`ComposedEncounter` unchanged — pre-gate, no gate fields.

---

### UPDATED: `resolver/encounterProfileLoader.ts`

**Imports updated:**
- Removed: `EncounterProfile`, `EncounterProfileResult`
- Added: `RenderableEncounter`, `RenderableEncounterResult`

**Return type:** `EncounterProfileResult` → `RenderableEncounterResult`

**Return values updated:**
- All `{ loaded: false, reason }` → `{ renderable: false, reason }`
- Final return: `{ loaded: true, profile }` → `{ renderable: true, encounter }`

**Gate comment updated** to reflect boundary intent:
```
// Gate failure returns renderable:false; held state never reaches a chamber renderer.
```

Execution order and logic unchanged:
1. Find surface assignment → `renderable: false` if missing
2. Validate material_identity and chamber_assignment → `renderable: false` if invalid
3. Find registry row → `renderable: false` if missing
4. Call `composeEncounter(...)` → `ComposedEncounter`
5. Apply `checkReleaseGate(registryRow)` → `renderable: false` if held
6. Return `{ renderable: true, encounter: { ...composed, gateResult } }`

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  composition/
    encounterComposition.ts         unchanged
  resolver/
    registryResolver.ts             unchanged
    releaseGate.ts                  unchanged
    transitionResolver.ts           unchanged
    encounterProfileLoader.ts       UPDATED (return type + return values)
  types/
    encounterRendererTypes.ts       UPDATED (RenderableEncounter, HeldEncounterState, RenderableEncounterResult)
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Type | Carries | Cannot carry |
|---|---|---|
| `ComposedEncounter` | assembled seated state | gate result |
| `RenderableEncounter` | assembled state + released gate | held gate result |
| `HeldEncounterState` | surface + sanitized reason | internal registry standing |
| `RenderableEncounterResult` | renderable encounter or failure reason | — |

| Layer | Accepts | Produces |
|---|---|---|
| `encounterComposition` | seated data | `ComposedEncounter` |
| `encounterProfileLoader` | `EncounterSurface` + `RegistryResolverData` | `RenderableEncounterResult` |
| Chamber Renderer (future) | `RenderableEncounter` only | render output |
| Chamber Router (future) | `RenderableEncounter` only | renderer dispatch |

---

## NOTCHAZZ FLAGS

None raised.

- `RenderableEncounter.gateResult` is narrowed to `{ status: "released" }` — held cannot satisfy the type
- `EncounterProfile` removed — no ambiguous union remains
- Held state exits at `loadEncounterProfile` return; chamber renderer is never called
- `HeldEncounterState` carries no internal standing
- No chamber renderers created
- No DB changes
- No live behavior changes

---

## VALIDATION

| Constraint | Status |
|---|---|
| `RenderableEncounter` type created | PASS |
| `gateResult` narrowed to `{ status: "released" }` only | PASS |
| `HeldEncounterState` type created | PASS |
| `RenderableEncounterResult` replaces `EncounterProfileResult` | PASS |
| `EncounterProfile` removed | PASS |
| `encounterProfileLoader` returns `RenderableEncounterResult` | PASS |
| All fail-closed paths return `renderable: false` | PASS |
| Gate failure cannot reach chamber renderer by type | PASS |
| No chamber renderers created | PASS |
| No shell wired | PASS |
| No monolith edited | PASS |
| No live behavior changes | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 6.23s |

---

## CLOSE

`RenderableEncounter` is the post-gate type. Chamber renderers accept only `RenderableEncounter`.
Held state is barred structurally — not by convention.
`EncounterProfile` is gone. Boundary is unambiguous.

Commit: `e23fef3`

Recommended next OAR2: `oar2_encounter_renderer_obsidian_chamber_v1`
