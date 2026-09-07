---
document_type: oar1
authority_level: working
title: OAR1 — Remove Release State from Surface Assignment
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_remove_release_state_from_surface_assignment_v1.meta.md
---

# OAR1 — Remove Release State from Surface Assignment

## OBJECTIVE

Remove release authority duplication from `measures_encounter_surface_assignment`.

`is_active`, `release_state`, and `access_state` dropped from table and type.
Registry remains sole release authority.
Assignment carries only assignment fields.
Build passes. Zero TypeScript errors.

---

## AUTHORITY SEPARATION (confirmed)

| Question | Authority |
|---|---|
| What surface is this? | `measures_encounter_surface_assignment.surface_key` |
| Which registry key? | `measures_encounter_surface_assignment.registry_key` |
| Which encounter key? | `measures_encounter_surface_assignment.encounter_key` |
| Which material identity? | `measures_encounter_surface_assignment.material_identity` |
| Which chamber renderer? | `measures_encounter_surface_assignment.chamber_assignment` |
| Which public routes? | `measures_encounter_surface_assignment.public_routes` |
| May it render live? | `measures_registry.is_active` + `measures_registry.release_state` |
| Who may access it? | `measures_registry.access_state` |

No field crosses the boundary.

---

## MIGRATION

**File:** `supabase/migrations/202606240010_remove_release_state_from_surface_assignment.sql`

**Applied:** `npx supabase db push --linked` — succeeded.

**Pre-migration dependency check:** Zero views or functions depend on `measures_encounter_surface_assignment`. DROP COLUMN was safe.

```sql
ALTER TABLE measures_encounter_surface_assignment
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS release_state,
  DROP COLUMN IF EXISTS access_state;
```

### Final table shape

| Column | Type |
|---|---|
| `id` | UUID PK |
| `surface_key` | TEXT UNIQUE |
| `registry_key` | TEXT |
| `encounter_key` | TEXT |
| `material_identity` | TEXT |
| `chamber_assignment` | TEXT |
| `public_routes` | TEXT[] |
| `metadata` | JSONB |
| `created_at` | TIMESTAMPTZ |
| `updated_at` | TIMESTAMPTZ |

---

## FILES CHANGED

### `types/encounterRendererTypes.ts`

`EncounterSurfaceAssignmentRow` — removed `is_active`, `release_state`, `access_state`.

```typescript
// Before
export type EncounterSurfaceAssignmentRow = {
  surface_key: string
  registry_key: string
  encounter_key: string | null
  material_identity: string
  chamber_assignment: string
  public_routes: string[]
  is_active: boolean
  release_state: string
  access_state: string | null
}

// After
export type EncounterSurfaceAssignmentRow = {
  surface_key: string
  registry_key: string
  encounter_key: string | null
  material_identity: string
  chamber_assignment: string
  public_routes: string[]
}
```

### `resolver/registryResolver.ts`

Assignment SELECT reduced to assignment fields only:

```typescript
supabase
  .from("measures_encounter_surface_assignment")
  .select(
    "surface_key, registry_key, encounter_key, material_identity, chamber_assignment, public_routes",
  )
```

---

## UNCHANGED (confirmed correct)

### `resolver/releaseGate.ts`

Reads only `RegistryRow` (`is_active`, `release_state`). No reference to assignment table. Unchanged.

### `resolver/encounterProfileLoader.ts`

Reads `assignment.surface_key`, `assignment.registry_key`, `assignment.material_identity`, `assignment.chamber_assignment`. Never reads `assignment.is_active`, `assignment.release_state`, or `assignment.access_state` for any decision. Gate check uses `registryRow` exclusively. No change required.

### `resolver/transitionResolver.ts`

Reads `assignment.registry_key` only. Gate applied to `RegistryRow`. No change required.

---

## AUTHORITY FLOW (confirmed)

```
Codex
→ Registry Standing     (measures_registry — is_active, release_state, access_state)
→ Surface Assignment    (measures_encounter_surface_assignment — registry_key, material_identity, chamber_assignment)
→ Release Gate          (checkReleaseGate — reads RegistryRow only)
→ Encounter Profile Loader
→ Chamber Router
→ Chamber Renderer
→ Surface Renderer
```

---

## FAIL-CLOSED (confirmed)

| Condition | Result |
|---|---|
| Assignment row missing | `"missing_surface_assignment"` → governed held state |
| Registry row missing (RLS or absent) | `"missing_registry_record"` → governed held state |
| Registry `is_active: false` | `"gate_held:inactive_registry_record"` → governed held state |
| Registry `release_state != "released"` | `"gate_held:release_state:<value>"` → governed held state |
| Invalid `material_identity` value | `"invalid_material_identity:<v>"` → governed held state |
| Invalid `chamber_assignment` value | `"invalid_chamber_assignment:<v>"` → governed held state |

Assignment release fields no longer exist. No fallback. No dual authority.

---

## NOTCHAZZ FLAGS

None raised.

- Assignment table carries no release authority
- Release gate reads registry only
- Transition resolver gates against registry only
- Profile loader treats assignment as mapping, not permission
- No duplicate authority

---

## VALIDATION

| Constraint | Status |
|---|---|
| `is_active` dropped from assignment | PASS |
| `release_state` dropped from assignment | PASS |
| `access_state` dropped from assignment | PASS |
| `EncounterSurfaceAssignmentRow` updated | PASS |
| Resolver SELECT updated | PASS |
| Release gate unchanged (reads registry only) | PASS |
| Profile loader unchanged (reads registry for gate) | PASS |
| Transition resolver unchanged (reads registry for gate) | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 7.37s |
| No chamber renderer created | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |

---

## CLOSE

Duplicate release authority removed.
`measures_registry` is sole release authority.
`measures_encounter_surface_assignment` carries assignment only.
Zero errors. Build passes.

Recommended next OAR2: `oar2_encounter_renderer_obsidian_chamber_v1`
