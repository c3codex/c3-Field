---
document_type: oar1
authority_level: working
title: OAR1 — Seat Native Orientation Passages Before Legacy Deactivation
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_native_orientation_passages_before_legacy_deactivation_v1.meta.md
commit: 30b64f7
---

# OAR1 — Seat Native Orientation Passages Before Legacy Deactivation

## OBJECTIVE

Seat native orientation passage keys in DB before legacy keys are deactivated.
Activate `about_measures_registry`. Add transition bridge rules. Do not deactivate legacy keys.

---

## FILES CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260001_seat_native_orientation_passages.sql` | Created — all DB mutations |
| `src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts` | Added 3 surface keys to `EncounterSurface` union |
| `src/measures_registry/encounter_renderer/resolver/registryResolver.ts` | Added 3 keys to `ENCOUNTER_REGISTRY_KEYS` and `ENCOUNTER_DEF_KEYS` |
| `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx` | Added `crystal_seat_orientation_passage` dispatch → `StructurePassageSeat` |
| `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx` | Added `obsidian_chamber_orientation_passage` to `EvalPassage` dispatch |
| `src/measures_registry/encounter_renderer/chambers/MarbleChamberRenderer.tsx` | Added `marble_chamber_orientation_passage` to `MapIntegrityGovernance` dispatch |

---

## VALIDATION

### 1. Native orientation keys exist in measures_registry

| registry_key | is_active | release_state |
|---|---|---|
| `crystal_seat_orientation_passage` | true | released |
| `obsidian_chamber_orientation_passage` | true | released |
| `marble_chamber_orientation_passage` | true | released |

PASS

### 2. Native orientation keys exist in measures_encounter_def

| encounter_key | material_family |
|---|---|
| `crystal_seat_orientation_passage` | crystal |
| `obsidian_chamber_orientation_passage` | obsidian |
| `marble_chamber_orientation_passage` | marble |

PASS

### 3. Native orientation keys have surface assignments

| surface_key | chamber_assignment |
|---|---|
| `crystal_seat_orientation_passage` | crystal_seat |
| `obsidian_chamber_orientation_passage` | obsidian |
| `marble_chamber_orientation_passage` | marble |

PASS

### 4. Transition bridge exists and does not break current live routes

| from_key | to_key | transition_kind |
|---|---|---|
| `evaluate_structure_path` | `eval_passage` | progression — PRESERVED |
| `evaluate_structure_path` | `structure_passage` | progression — PRESERVED |
| `evaluate_structure_path` | `obsidian_chamber_orientation_passage` | progression — NEW |
| `evaluate_structure_path` | `crystal_seat_orientation_passage` | progression — NEW |
| `obsidian_chamber_orientation_passage` | `measures_assessment` | progression — NEW |
| `crystal_seat_orientation_passage` | `about_measures_registry` | progression — NEW |
| `marble_chamber_orientation_passage` | `map_integrity_governance` | progression — NEW |

Existing live routes to `eval_passage` and `structure_passage` are intact. PASS

### 5. about_measures_registry is active and renderable

| registry_key | is_active | release_state |
|---|---|---|
| `about_measures_registry` | true | released |

PASS (was: `is_active: false`, `release_state: held`)

### 6. No legacy key was deactivated during this OAR

| Key | Status |
|---|---|
| `eval_passage` | is_active: true — UNCHANGED |
| `structure_passage` | is_active: false — UNCHANGED (was inactive before this OAR) |
| `evaluate_structure_path` | is_active: true — UNCHANGED |
| `marble_pathway_reveal` | is_active: true — UNCHANGED |
| `iis_eval_gate1` | is_active: true — UNCHANGED |
| `crystal_chamber` | is_active: true — UNCHANGED |
| `structural_drift_publication` | is_active: true — UNCHANGED |

PASS

### 7. No content was invented

All metadata in encounter_def rows is architectural only:
- `native_key`, `chamber_assignment`, `orientation_role`, `legacy_replaces`, `renderer_contract`, `governance_note`, `status_note`
- No public copy seeded. Renderers will present gap state until content is seeded in a future OAR.

PASS

### 8. No renderer code changed beyond unavoidable documented surface dispatch

TypeScript changes documented:
- `EncounterSurface` union extended — unavoidable, type contract
- `ENCOUNTER_REGISTRY_KEYS` and `ENCOUNTER_DEF_KEYS` arrays extended — unavoidable, resolver fetches by key
- 3 renderer dispatch additions — unavoidable, existing gap state would render for all 3 surfaces without dispatch

All dispatches route to existing sub-presentation functions. No new presentation logic was written.

PASS

### 9. FREE can resolve native keys without frontend inference

All 3 keys are now in:
- `measures_registry` (resolver fetches by `ENCOUNTER_REGISTRY_KEYS`)
- `measures_encounter_def` (resolver fetches by `ENCOUNTER_DEF_KEYS`)
- `measures_encounter_surface_assignment` (surface_key → chamber_assignment lookup by `loadEncounterProfile`)
- `EncounterSurface` type union (compile-time type safety)

FREE pipeline: `EncounterEntry` → `loadEncounterProfile` → `EncounterBoundary` → `ChamberRouter` → renderer. No inference. All state from DB.

PASS

---

## CONSTRAINT FINDING

`measures_encounter_def.material_family` and `measures_registry.material_family` have a check constraint:

```
(material_family IS NULL) OR (material_family = ANY (ARRAY['obsidian', 'crystal', 'marble', 'lapis']))
```

`'crystal_seat'` is not a valid value. Used `'crystal'` for `crystal_seat_orientation_passage` encounter_def.
`material_identity` in `measures_encounter_surface_assignment` uses `'crystal'` for `crystal_seat` chamber (confirmed from existing rows).

First push attempt failed on this constraint. Fixed and re-pushed. No partial state in DB — migration is transactional.

---

## NOTCHAZZ FLAGS

None raised.

- Legacy keys not deactivated
- No public route behavior broken — existing transitions preserved
- No content invented — encounter_def metadata is architectural only
- No frontend inference added
- FREE does not determine standing
- No stale terms silently reused as native
- DB mutation limited to this OAR's scope
- Operator not governed

---

## CLOSE

Native orientation passage bridge is seated.

Three new keys resolve through FREE without inference.

`about_measures_registry` is active and released.

Legacy keys remain live until a separate deactivation OAR validates native routes.

Nothing is invented.

Commit: 30b64f7
