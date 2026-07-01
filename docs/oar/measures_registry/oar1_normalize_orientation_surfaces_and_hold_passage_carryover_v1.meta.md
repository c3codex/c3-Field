---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Normalize Orientation Surfaces and Hold Passage Carryover
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_normalize_orientation_surfaces_and_hold_passage_carryover_v1
---

# OAR1 - Normalize Orientation Surfaces and Hold Passage Carryover

## EXECUTION METHOD

Full DB state verified first via PostgREST queries before any mutation. Surface_assignment
and measures_registry rows audited for all three target orientation surfaces. Migration
202606300014 applied via `npx supabase db push` (exit code 0). `registryResolver.ts`
ENCOUNTER_REGISTRY_KEYS and ENCOUNTER_DEF_KEYS updated. TypeScript `npx tsc --noEmit`
produced zero errors. Post-migration anon gate queries confirmed new canonical row
is_active=true and held passage row not returned (RLS confirms hold active).

---

## PRE-MIGRATION STATE — ALL TARGET SURFACES

### measures_encounter_surface_assignment

| surface_key | registry_key (before) | encounter_key (before) | action |
|---|---|---|---|
| `crystal_seat_orientation` | `ai_isnt_broken_intro` | `ai_isnt_broken_intro` | GAP — reported, not executed |
| `obsidian_chamber_orientation` | `obsidian_chamber_orientation_passage` | `obsidian_chamber_orientation_passage` | NORMALIZED ✓ |
| `marble_chamber_orientation` | NOT IN surface_assignment | — | GAP — no row exists |

### measures_registry (passage keys — pre-migration)

| registry_key | is_active (before) | release_state (before) | action |
|---|---|---|---|
| `obsidian_chamber_orientation_passage` | true | released | HELD ✓ (after decouple) |
| `crystal_seat_orientation_passage` | false | held | already held (prior OAR) |
| `marble_chamber_orientation_passage` | false | held | already held (prior OAR) |

---

## EXECUTED: obsidian_chamber_orientation normalization

### Migration 202606300014

**Step 1 — New measures_registry row:**
```sql
INSERT INTO measures_registry (registry_key, display_title, registry_family, release_state, access_state, is_active, metadata)
VALUES ('obsidian_chamber_orientation', 'Obsidian Chamber Orientation', 'spine', 'released', 'encounterable', true,
  '{"native_architecture": true, "supersedes": "obsidian_chamber_orientation_passage", "orientation_role": "obsidian_chamber_entry"}');
```

**Step 2 — New measures_encounter_def row (referenced via registry_id subquery):**
```
encounter_key: obsidian_chamber_orientation
display_title: Obsidian Chamber Orientation
encounter_type: view / material_family: obsidian / surface_type: threshold
metadata: native_key, chamber_assignment, orientation_role, legacy_replaces, renderer_contract: EvalPassage
```

**Step 3 — surface_assignment update:**
```sql
UPDATE measures_encounter_surface_assignment
SET registry_key = 'obsidian_chamber_orientation', encounter_key = 'obsidian_chamber_orientation'
WHERE surface_key = 'obsidian_chamber_orientation';
```

**Step 4 — Hold passage carryover (now decoupled):**
```sql
UPDATE measures_registry SET is_active = false, release_state = 'held'
WHERE registry_key = 'obsidian_chamber_orientation_passage';
```

### Post-migration state

| surface_key | registry_key (after) | encounter_key (after) |
|---|---|---|
| `obsidian_chamber_orientation` | `obsidian_chamber_orientation` | `obsidian_chamber_orientation` |
| `obsidian_chamber_orientation_passage` | `obsidian_chamber_orientation_passage` (unchanged — legacy isolated) | `obsidian_chamber_orientation_passage` |

| registry_key | is_active (after) | release_state (after) | verification |
|---|---|---|---|
| `obsidian_chamber_orientation` | true | released | returned by anon query ✓ |
| `obsidian_chamber_orientation_passage` | false | held | not returned by anon query (RLS) ✓ |

---

## SOURCE FILE CHANGE: registryResolver.ts

### ENCOUNTER_REGISTRY_KEYS

| Change | Key |
|---|---|
| REMOVED | `obsidian_chamber_orientation_passage` — held, superseded |
| REMOVED | `crystal_seat_orientation_passage` — already held (prior OAR), not needed |
| REMOVED | `marble_chamber_orientation_passage` — already held (prior OAR), not needed |
| ADDED | `obsidian_chamber_orientation` — canonical gate key for obsidian orientation surface |

### ENCOUNTER_DEF_KEYS

| Change | Key |
|---|---|
| REMOVED | `obsidian_chamber_orientation_passage` (first occurrence) — superseded |
| REMOVED | `obsidian_chamber_orientation_passage` (second occurrence — duplicate, OAR cleanup) |
| REMOVED | `crystal_seat_orientation_passage` — no active surface uses this as registry_key |
| REMOVED | `marble_chamber_orientation_passage` — no active surface uses this as registry_key |
| ADDED | `obsidian_chamber_orientation` — canonical encounter_def key |
| KEPT | `structure_passage` — defensive for measures_structured_environments |

### Resolution chain (post-change)

`obsidian_chamber_orientation` surface:
1. surface_assignment → registry_key = 'obsidian_chamber_orientation'
2. registryRows.find(r.registry_key === 'obsidian_chamber_orientation') → is_active=true, released
3. releaseGate → { status: 'released' } ✓
4. encounterDefRows.find(d.encounter_key === 'obsidian_chamber_orientation') → new canonical def ✓
5. ObsidianChamberRenderer dispatch → EvalPassage component (surface === 'obsidian_chamber_orientation') ✓

### TypeScript validation

`npx tsc --noEmit` → zero errors ✓

---

## GAPS — NOT EXECUTED IN THIS OAR

### 1. crystal_seat_orientation registry_key normalization

**Current state:** `crystal_seat_orientation` uses `registry_key = 'ai_isnt_broken_intro'` — already a
non-passage key. No `*_orientation_passage` dependency exists. The OAR2 target state
(`registry_key = 'crystal_seat_orientation'`) was not executed because:

- `ai_isnt_broken_intro` encounter_def has a large metadata body with internal
  key references (`native_key: "ai_isnt_broken_intro"`, `root_sequence_binding.surface_key: "ai_isnt_broken_intro"`,
  etc.). Copying this metadata to a new `crystal_seat_orientation` encounter_def
  without updating those internal references would create stale truth.
- Updating all internal references would constitute inventing/creating new content
  beyond the OAR2 scope of "copy without inventing truth."
- `crystal_seat_orientation` shares `IntroHookSeat` rendering with `crystal_seat_threshold`
  and both currently resolve to `ai_isnt_broken_intro` encounterDef — no presentation
  regression exists from the current state.
- The primary concern (decoupling from `*_orientation_passage` key) does not apply to
  this surface — it was never on a passage key.

**Required next step:** A dedicated content-seeding OAR to:
1. Seed a `crystal_seat_orientation` encounter_def with correct content
2. Create a `crystal_seat_orientation` measures_registry row
3. Update `crystal_seat_orientation` surface_assignment.registry_key

### 2. marble_chamber_orientation — surface gap

`marble_chamber_orientation` has no row in `measures_encounter_surface_assignment`.
It is a gap surface — listed as SEAT term #9 but not yet seated as a distinct surface.
No normalization is possible without first creating:
- A surface_key row in measures_encounter_surface_assignment
- A renderer component distinct from marble_chamber_C2_compact
- Registry and encounter_def rows

Requires a dedicated surface-seating OAR.

---

## SEAL STATE — ALL THREE PASSAGE CARRYOVER KEYS

| registry_key | is_active | release_state | standing | anon-accessible |
|---|---|---|---|---|
| `crystal_seat_orientation_passage` | false | held | held | no (RLS) |
| `obsidian_chamber_orientation_passage` | false | held | legacy_alias | no (RLS) |
| `marble_chamber_orientation_passage` | false | held | gap | no (RLS) |

All three `*_orientation_passage` carryover keys are now gate-held. No active surface
depends on any of them. Passage naming is isolated.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Pre-migration DB state verified | ✓ |
| obsidian_chamber_orientation: canonical measures_registry row created | ✓ |
| obsidian_chamber_orientation: canonical measures_encounter_def row created | ✓ |
| obsidian_chamber_orientation surface_assignment: registry_key normalized | ✓ |
| obsidian_chamber_orientation_passage: held in measures_registry | ✓ confirmed via RLS |
| All SEAT active surfaces: still is_active=true, released | ✓ |
| ENCOUNTER_REGISTRY_KEYS: 3 held passage keys removed, canonical added | ✓ |
| ENCOUNTER_DEF_KEYS: duplicate + 3 passage keys removed, canonical added | ✓ |
| Resolution chain verified end-to-end | ✓ |
| TypeScript: tsc --noEmit zero errors | ✓ |
| crystal_seat_orientation: gap reported, not mutated | ✓ |
| marble_chamber_orientation: gap reported, no surface row exists | ✓ |
| No active passage or antechamber activated | ✓ |
| No public routes changed | ✓ |
| No report/scoring/payment/Stripe mutation | ✓ |
| registered_runtime remains retired | ✓ |
| OAR1 records before/after evidence and gaps | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Obsidian Chamber orientation surface decoupled from passage carryover naming.

`obsidian_chamber_orientation` now has its own canonical registry_key, encounter_key,
measures_registry gate row, and measures_encounter_def row. The `obsidian_chamber_orientation_passage`
carryover key is held. All three `*_orientation_passage` terms are now gate-held and
not accessible to the anon registry resolver.

Two gaps remain deferred to separate OARs:
- `crystal_seat_orientation` canonical normalization (content seeding required)
- `marble_chamber_orientation` surface seating (renderer + DB row required)

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
