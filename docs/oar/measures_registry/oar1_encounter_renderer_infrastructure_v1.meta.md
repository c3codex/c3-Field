---
document_type: oar1
authority_level: working
title: OAR1 — Encounter Renderer Infrastructure
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_encounter_renderer_infrastructure_v1.meta.md
supersedes: ~
---

# OAR1 — Encounter Renderer Infrastructure

## OBJECTIVE

Phase 1 of encounter renderer build.

Five infrastructure files created.
No entry point changed.
No monolith edited.
No rendering introduced.
Build passes.

---

## FILES CREATED

### `src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts`

Shared types and domain constants.

**Types defined:**
- `MaterialIdentity` — `"obsidian" | "crystal" | "lapis" | "marble"`
- `ChamberAssignment` — four chamber renderer identifiers
- `EncounterSurface` — 13 surfaces; dead surface `ai_operations_assessment_landing` excluded
- `RegistryRow` — `measures_registry` DB row shape (includes `is_active`, `release_state`)
- `EncounterDefRow` — `measures_encounter_def` DB row shape
- `EncounterMediaRow` — `measures_media_map` DB row shape
- `EncounterDesignTokenRow` — `measures_design_token` DB row shape
- `GateResult` — `{ status: "released" } | { status: "held"; reason: string }`
- `TransitionNode` — encounter_structure node shape (recursive; keyed by surface name)
- `EncounterProfile` — loaded rendering state for a single surface
- `EncounterProfileResult` — `{ loaded: true; profile } | { loaded: false; reason }`
- `RegistryResolverData` — raw resolver output (4 row arrays + loading/error state)
- `EncounterRendererProps` — props contract for chamber renderers (used from Phase 4)

**Constants defined:**
- `SURFACE_REGISTRY_KEY` — surface → registry key mapping (13 surfaces → 9 registry keys)
- `REGISTRY_KEY_MATERIAL` — registry key → material identity (9 keys)
- `REGISTRY_KEY_CHAMBER` — registry key → chamber assignment (9 keys)
- `ENCOUNTER_SURFACE_SET` — `Set<string>` of all valid encounter surfaces

---

### `src/measures_registry/encounter_renderer/resolver/registryResolver.ts`

`useRegistryResolver()` — React hook, single `Promise.all`, no authority decisions.

**Loads in parallel:**
- `measures_registry` — all 9 surface keys + `measures_registry_root` (10 rows); no `is_active` filter — inactive records loaded so release gate can evaluate them
- `measures_encounter_def` — 9 encounter def keys
- `measures_media_map` — 24 media roles across 2 campaign keys
- `measures_design_token` — active tokens for `measures_registry` registry key

**Returns:** `RegistryResolverData` with `loading: true` initial state.

**Authority rule enforced:** Resolver returns raw rows only. No release decisions, no gating, no filtering by active state (except design tokens where `is_active = true` is a DB filter for performance).

---

### `src/measures_registry/encounter_renderer/resolver/releaseGate.ts`

`checkReleaseGate(row: RegistryRow): GateResult` — pure function.

**Gate passes when:**
- `row.is_active === true`
- `row.release_state === "released"`

**Gate fails (governed held state) when:**
- `is_active` is false → `reason: "inactive_registry_record"`
- `release_state` is not `"released"` → `reason: "release_state:<value>"`

**Confirms for current registry state:**
- `about_measures_registry` (`is_active: false, release_state: held`) → gate fails
- `structure_passage` (`is_active: false, release_state: held`) → gate fails
- All Obsidian/Marble/Lapis surfaces (`is_active: true, release_state: released`) → gate passes

No DB access. No side effects.

---

### `src/measures_registry/encounter_renderer/resolver/transitionResolver.ts`

`resolveTransition(node, surfaceKey, registryRows): EncounterSurface | null` — pure function.

**Steps:**
1. Read `node[surfaceKey]` — returns null if missing or not a string
2. Validate against `ENCOUNTER_SURFACE_SET` — returns null if unknown surface
3. Map surface → registry key via `SURFACE_REGISTRY_KEY`
4. Find registry row in `registryRows`
5. Check release gate via `checkReleaseGate(row)`
6. Return surface if gate passes; null if gate fails or row missing

No hardcoded transition targets.
Returns null for held, inactive, missing, or unknown targets.

---

### `src/measures_registry/encounter_renderer/resolver/encounterProfileLoader.ts`

`loadEncounterProfile(surface, resolverData): EncounterProfileResult` — pure function.

**Fail-closed conditions checked (all → `{ loaded: false, reason }`)**:

| Condition | Reason |
|---|---|
| Surface not in `SURFACE_REGISTRY_KEY` | `"unknown_surface"` |
| Registry row missing for key | `"missing_registry_record"` |
| `is_active: false` | `"gate_held:inactive_registry_record"` |
| `release_state !== "released"` | `"gate_held:release_state:<value>"` |
| Material identity not found | `"unknown_material_identity"` |
| Chamber assignment not found | `"unknown_chamber_assignment"` |

**On success, assembles:**
- `registryRow` — from `resolverData.registryRows`
- `gateResult` — `{ status: "released" }` (confirmed)
- `encounterDef` — matched by `encounter_key === registryKey`; null if absent
- `mediaByRole` — Map of all active media rows (keyed by role); chamber renderers select what they need
- `transitionNodes` — extracted from `measures_registry_root.metadata.encounter_structure`
- `materialIdentity` — from `REGISTRY_KEY_MATERIAL`
- `chamberAssignment` — from `REGISTRY_KEY_CHAMBER`

No invention. No authority decisions. Assembles only what is seated in resolver data.

---

## DIRECTORY STRUCTURE CREATED

```
src/measures_registry/encounter_renderer/
  types/
    encounterRendererTypes.ts     ← 119 LOC
  resolver/
    registryResolver.ts           ← 95 LOC
    releaseGate.ts                ← 12 LOC
    transitionResolver.ts         ← 30 LOC
    encounterProfileLoader.ts     ← 77 LOC
```

Total: 333 LOC across 5 files.

---

## VALIDATION

| Constraint | Status |
|---|---|
| Five infrastructure files created | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |
| No rendering introduced | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — built in 7.01s |
| Release gate fails closed | PASS — inactive and held records confirmed |
| Transition resolver validates targets | PASS — gate checked before surface returned |
| Encounter profile loader assembles only seated data | PASS — no invention |
| No runtime terminology | PASS |
| No contract-profile terminology | PASS |
| No monolith extraction | PASS |

---

## NOTCHAZZ FLAGS

None raised.

- No monolith logic copied
- No runtime terminology used
- Registry resolver makes no authority decisions
- Encounter profile loader loads, does not invent or validate into existence
- Release gate has no fail-open path
- Transition resolver uses no hardcoded surface targets
- No source changes affect live runtime behavior

---

## GHOST-LIVE SURFACES (confirmed blocked)

`about_measures_registry` and `structure_passage` are inactive and held in the registry.

`loadEncounterProfile()` for either surface returns:
```
{ loaded: false, reason: "gate_held:inactive_registry_record" }
```

Shell renders governed held state. Chamber renderer is never called.

Ghost-live behavior eliminated for these surfaces.

---

## BLOCKERS (unchanged from prior OAR1)

**Blocker 1 — Pending Migrations A-D:**
Deprecated aliases `marble_pathway_reveal` and `iis_eval_gate1` remain active in DB.
Encounter renderer does not reference them.
Must be deactivated before cutover.

**Blocker 2 — Held surfaces:**
`structure_passage` and `about_measures_registry` correctly gate as HELD.
Releasing either requires separate OAR2 and DB migration.

**Blocker 3 — Transition node standing:**
All `next_surface` values in `measures_registry_root.metadata.encounter_structure` validated through release gate at transition time.

---

## CLOSE

Phase 1 complete.

Five infrastructure files exist.
Zero TypeScript errors.
Build passes.
No live behavior changed.
Release gate fails closed.
Ghost-live surfaces blocked.

Recommended next OAR2: `oar2_encounter_renderer_obsidian_chamber_v1`
Scope: `chambers/ObsidianChamberRenderer.tsx` — 3 surfaces, no shell wiring, no monolith edits.
Bounded.
