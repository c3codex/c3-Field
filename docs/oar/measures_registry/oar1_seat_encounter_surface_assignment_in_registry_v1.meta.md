---
document_type: oar1
authority_level: working
title: OAR1 — Seat Encounter Surface Assignment in Registry
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_encounter_surface_assignment_in_registry_v1.meta.md
---

# OAR1 — Seat Encounter Surface Assignment in Registry

## OBJECTIVE

Surface assignment authority moved from TypeScript constants to DB.

New table `measures_encounter_surface_assignment` created and seeded.
Four infrastructure files updated.
TypeScript constants removed as runtime authority.
TypeScript type unions retained for compile-time safety only.
Build passes. Zero TypeScript errors.

---

## SCHEMA FINDINGS (pre-migration)

### Existing `measures_registry.material_family`

`measures_registry` already had a `material_family` column. Its values were stale:

| registry_key | DB material_family | Correct (encounter renderer) |
|---|---|---|
| `ai_isnt_broken_intro` | `obsidian` | `crystal` |
| `evaluate_structure_path` | `lapis` | `crystal` |
| `structural_drift_publication` | `obsidian` | `lapis` |
| `structure_passage` | `obsidian` | `crystal` |
| `about_measures_registry` | `obsidian` | `crystal` |

Stale values confirmed the need for a dedicated assignment table rather than patching `measures_registry.material_family`.

### RLS on `measures_registry`

Policy `measures_registry_public_released_active_read` restricts anon to:
```sql
is_active = true AND release_state IN ('released', 'active')
```

Held surfaces (`about_measures_registry`, `structure_passage`) are invisible to anon via RLS. The encounter profile loader still fails closed for these surfaces: `loadEncounterProfile()` returns `{ loaded: false, reason: "missing_registry_record" }`.

### Existing `c3_chamber_directory_binding`

This table carries chamber-to-surface bindings but with a different surface key vocabulary than the encounter renderer. It was not used or modified.

---

## MIGRATION

**File:** `supabase/migrations/202606240009_seat_encounter_surface_assignment.sql`

**Applied:** `npx supabase db push --linked` — succeeded.

### Table: `measures_encounter_surface_assignment`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `surface_key` | TEXT UNIQUE | Encounter surface name (e.g. `intro_hook`) |
| `registry_key` | TEXT | FK to `measures_registry.registry_key` |
| `encounter_key` | TEXT | FK to `measures_encounter_def.encounter_key` |
| `material_identity` | TEXT | `crystal / obsidian / lapis / marble` |
| `chamber_assignment` | TEXT | Chamber renderer name |
| `public_routes` | TEXT[] | Canonical public URL paths |
| `is_active` | BOOLEAN | Assignment standing |
| `release_state` | TEXT | Assignment release standing |
| `access_state` | TEXT | Access classification |
| `metadata` | JSONB | Reserved |

### RLS

Anon reads all rows (held and released). Release authority comes from `measures_registry`, not this table.

```sql
CREATE POLICY "anon_read_surface_assignments"
  ON measures_encounter_surface_assignment
  FOR SELECT TO anon, authenticated
  USING (true);
```

### Seeded Rows (13)

| surface_key | registry_key | material_identity | chamber_assignment | is_active | release_state |
|---|---|---|---|---|---|
| `intro_hook` | `ai_isnt_broken_intro` | `crystal` | `CrystalSeatRenderer` | true | released |
| `intro` | `ai_isnt_broken_intro` | `crystal` | `CrystalSeatRenderer` | true | released |
| `path_choice` | `evaluate_structure_path` | `crystal` | `CrystalSeatRenderer` | true | released |
| `structure_passage` | `structure_passage` | `crystal` | `CrystalSeatRenderer` | **false** | **held** |
| `measures_structured_environments` | `structure_passage` | `crystal` | `CrystalSeatRenderer` | **false** | **held** |
| `about_measures_registry` | `about_measures_registry` | `crystal` | `CrystalSeatRenderer` | **false** | **held** |
| `eval_passage` | `eval_passage` | `obsidian` | `ObsidianChamberRenderer` | true | released |
| `structural_coherence_explainer` | `eval_passage` | `obsidian` | `ObsidianChamberRenderer` | true | released |
| `measures_assessment` | `measures_assessment` | `obsidian` | `ObsidianChamberRenderer` | true | released |
| `obsidian_to_marble_passage_video` | `obsidian_to_marble_passage_video` | `obsidian` | `ObsidianChamberRenderer` | true | released |
| `map_integrity_governance` | `map_integrity_governance` | `marble` | `MarbleChamberRenderer` | true | released |
| `structural_drift_dispatches` | `structural_drift_publication` | `lapis` | `LapisChamberRenderer` | true | released |
| `publication_dispatch` | `structural_drift_publication` | `lapis` | `LapisChamberRenderer` | true | released |

Dead surface `ai_operations_assessment_landing` — not seated.

---

## FILES CHANGED

### `types/encounterRendererTypes.ts`

**Removed** (were runtime authority — no longer):
- `SURFACE_REGISTRY_KEY` constant
- `REGISTRY_KEY_MATERIAL` constant
- `REGISTRY_KEY_CHAMBER` constant
- `ENCOUNTER_SURFACE_SET` constant

**Added:**
- `EncounterSurfaceAssignmentRow` type
- `surfaceAssignmentRows: EncounterSurfaceAssignmentRow[]` field on `RegistryResolverData`

**Retained** (compile-time safety only):
- `MaterialIdentity` type union
- `ChamberAssignment` type union
- `EncounterSurface` type union

---

### `resolver/registryResolver.ts`

Added fifth query in `Promise.all`:
```typescript
supabase
  .from("measures_encounter_surface_assignment")
  .select("surface_key, registry_key, encounter_key, material_identity, chamber_assignment, public_routes, is_active, release_state, access_state")
```

No filter — anon reads all rows (RLS permits).

`EMPTY_DATA` updated with `surfaceAssignmentRows: []`.

---

### `resolver/encounterProfileLoader.ts`

**Removed** imports: `SURFACE_REGISTRY_KEY`, `REGISTRY_KEY_MATERIAL`, `REGISTRY_KEY_CHAMBER`

**New resolution path:**
1. Find assignment row: `surfaceAssignmentRows.find(r => r.surface_key === surface)`
2. Fail closed if no row → `"missing_surface_assignment"`
3. Validate `material_identity` against compile-time set → fail if unknown
4. Validate `chamber_assignment` against compile-time set → fail if unknown
5. Continue with registry row lookup and gate check (unchanged)

Fail-closed conditions in order:
| Condition | Reason |
|---|---|
| No assignment row | `"missing_surface_assignment"` |
| Invalid material_identity value | `"invalid_material_identity:<value>"` |
| Invalid chamber_assignment value | `"invalid_chamber_assignment:<value>"` |
| Registry row missing | `"missing_registry_record"` |
| `is_active: false` (via RLS or gate) | `"gate_held:inactive_registry_record"` |
| `release_state !== "released"` | `"gate_held:release_state:<value>"` |

---

### `resolver/transitionResolver.ts`

**Removed** imports: `SURFACE_REGISTRY_KEY`, `ENCOUNTER_SURFACE_SET`

**Signature change:**
```typescript
// Before:
resolveTransition(node, surfaceKey, registryRows)

// After:
resolveTransition(node, surfaceKey, registryRows, surfaceAssignmentRows)
```

Surface validation: `surfaceAssignmentRows.find(r => r.surface_key === rawSurface)` replaces `ENCOUNTER_SURFACE_SET.has(rawSurface)`.

Registry key lookup: `assignment.registry_key` replaces `SURFACE_REGISTRY_KEY[surface]`.

---

## VALIDATION

| Constraint | Status |
|---|---|
| Assignment table created | PASS |
| 13 rows seeded (no dead surface) | PASS |
| Held surfaces seated as held | PASS |
| TypeScript constants removed as authority | PASS |
| TypeScript type unions retained | PASS |
| `registryResolver` loads assignment rows | PASS |
| `encounterProfileLoader` reads from DB | PASS |
| `transitionResolver` reads from DB | PASS |
| No fallback to constants | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 4.71s |
| No chamber renderer created | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |
| No live behavior changed | PASS |

---

## NOTCHAZZ FLAGS

None raised.

- Surface assignment is DB-authoritative
- Chamber assignment is DB-authoritative
- Material identity is DB-authoritative
- TypeScript constants are not fallback truth
- Dead surface not seated
- Missing assignment fails closed
- Held surfaces fail closed

---

## AUTHORITY FLOW (updated)

```
Codex
→ Registry Standing (measures_registry)
→ Encounter Surface Assignment (measures_encounter_surface_assignment)
→ Release Gate (checkReleaseGate — reads measures_registry)
→ Encounter Profile Loader (loadEncounterProfile)
→ Chamber Renderer
→ Surface Renderer
```

---

## CLOSE

Migration applied. 13 surface assignments seated in DB.
Four infrastructure files updated. TypeScript constants removed as runtime authority.
Zero errors. Build passes. No live behavior changed.

Recommended next OAR2: `oar2_encounter_renderer_obsidian_chamber_v1`
Scope: `chambers/ObsidianChamberRenderer.tsx` — 3 surfaces, pre-loaded profiles, no shell wiring.
Bounded.
