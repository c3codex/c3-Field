---
document_type: oar1
authority_level: working
title: OAR1 — Create Encounter Composition Layer
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_create_encounter_composition_layer_v1.meta.md
---

# OAR1 — Create Encounter Composition Layer

## OBJECTIVE

Encounter assembly extracted from profile loader into a bounded composition layer.

One new file created. Two files updated. One type added.
No migration. No DB changes. No entry point changes. No monolith edits.
Build passes. Zero TypeScript errors.

---

## AUTHORITY ORDER (updated)

```
Codex
→ Registry Standing       (measures_registry)
→ Surface Assignment      (measures_encounter_surface_assignment)
→ Encounter Definition    (measures_encounter_def)
→ Encounter Composition   (composition/encounterComposition.ts)
→ Encounter Profile       (ComposedEncounter + gateResult)
→ Release Gate            (checkReleaseGate — evaluated after composition)
→ Chamber Router          (shell — Phase 4)
→ Chamber Renderer        (Phase 2/3)
→ Surface Renderer
```

---

## FILES CHANGED

### NEW: `composition/encounterComposition.ts`

**Responsibility:** Assemble encounter state from seated registry data. Pure. No authority decisions. No release checks. No routing.

**Function:** `composeEncounter(surface, assignment, registryRow, materialIdentity, chamberAssignment, resolverData): ComposedEncounter`

**Assembles:**
- `encounterDef` — from `resolverData.encounterDefRows`, matched by `registry_key`
- `mediaByRole` — Map of all active media rows from `resolverData.mediaRows`
- `transitionNodes` — extracted from `measures_registry_root.metadata.encounter_structure`
- All other fields passed directly from loader (surface, registryKey, registryRow, materialIdentity, chamberAssignment)

**Cannot fail.** Caller (loader) validates all inputs before calling. Composition receives only valid seated data and returns `ComposedEncounter` directly.

**Helpers moved here from loader:**
- `asRecord(value): Record<string, unknown> | null`
- `extractTransitionNodes(rootMetadata): Record<string, TransitionNode>`

---

### UPDATED: `resolver/encounterProfileLoader.ts`

**Responsibility:** Orchestration only. Finds seated data. Delegates assembly. Applies gate. Returns profile or fail-closed result.

**Removed from loader:**
- `asRecord` helper (moved to composition)
- `extractTransitionNodes` helper (moved to composition)
- All encounter assembly (encounter def lookup, mediaByRole building, transition node extraction)
- Direct `EncounterProfile` construction

**Added to loader:**
- Import `composeEncounter` from `../composition/encounterComposition`

**Execution order:**
1. Find surface assignment → fail if missing (`"missing_surface_assignment"`)
2. Validate `material_identity` and `chamber_assignment` DB values → fail if invalid
3. Find registry row → fail if missing (`"missing_registry_record"`)
4. Call `composeEncounter(...)` → returns `ComposedEncounter`
5. Apply `checkReleaseGate(registryRow)` → fail if held (`"gate_held:<reason>"`)
6. Return `{ loaded: true, profile: { ...composed, gateResult } }`

The gate is evaluated **after** composition, per authority order. The composed encounter is assembled from seated data regardless of gate status; the gate determines whether it may be delivered to a chamber renderer.

---

### UPDATED: `types/encounterRendererTypes.ts`

**Added:** `ComposedEncounter` type — the fully assembled encounter state before gate evaluation.

```typescript
export type ComposedEncounter = {
  surface: EncounterSurface
  registryKey: string
  registryRow: RegistryRow
  encounterDef: EncounterDefRow | null
  mediaByRole: Map<string, EncounterMediaRow>
  transitionNodes: Record<string, TransitionNode>
  materialIdentity: MaterialIdentity
  chamberAssignment: ChamberAssignment
}
```

`EncounterProfile` remains: `ComposedEncounter` fields + `gateResult: GateResult`.

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  composition/
    encounterComposition.ts         ← NEW (~55 LOC)
  resolver/
    registryResolver.ts             unchanged
    releaseGate.ts                  unchanged
    transitionResolver.ts           unchanged
    encounterProfileLoader.ts       UPDATED (orchestration only, ~65 LOC)
  types/
    encounterRendererTypes.ts       UPDATED (ComposedEncounter added)
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Layer | Does | Does Not |
|---|---|---|
| `registryResolver` | Loads all DB tables | Makes decisions |
| `encounterComposition` | Assembles from seated data | Check release, route, render |
| `encounterProfileLoader` | Orchestrates, gates | Assemble, render |
| `releaseGate` | Evaluates registry standing | Compose, route, render |
| `transitionResolver` | Validates transition targets | Route, assemble, render |
| Chamber Renderer (future) | Renders | Query DB, assemble, determine authority |

---

## NOTCHAZZ FLAGS

None raised.

- Composition performs no release decisions
- Composition performs no routing
- Loader no longer assembles encounters
- Gate reads registry row only (unchanged)
- No chamber renderer created
- No DB changes

---

## VALIDATION

| Constraint | Status |
|---|---|
| `composition/encounterComposition.ts` created | PASS |
| `encounterProfileLoader` is orchestration only | PASS |
| Assembly moved to composition layer | PASS |
| Gate evaluated after composition | PASS |
| Gate reads registry row only | PASS |
| `ComposedEncounter` type added | PASS |
| No live behavior changes | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 9.08s |

---

## CLOSE

Encounter composition is now a bounded layer.
Profile loader is orchestration only.
Assembly concerns and rendering concerns are fully separated.
Zero errors. Build passes.

Recommended next OAR2: `oar2_encounter_renderer_obsidian_chamber_v1`
