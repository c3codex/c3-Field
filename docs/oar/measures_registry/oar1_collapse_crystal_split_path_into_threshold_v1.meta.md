---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Collapse Crystal Split Path Into Threshold
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_collapse_crystal_split_path_into_threshold_v1
---

# OAR1 - Collapse Crystal Split Path Into Threshold

## EXECUTION METHOD

Live DB verified (surface_assignment, encounter_structure JSONB) before mutation.
Migration 202606300016 applied via `npx supabase db push` (exit code 0). registryResolver.ts
ENCOUNTER_REGISTRY_KEYS and ENCOUNTER_DEF_KEYS updated. TypeScript `npx tsc --noEmit`
zero errors. Post-migration encounter_structure confirmed via PostgREST.

---

## PRE-MUTATION STATE

### encounter_structure nodes (before)

| Node | Key field | Value |
|---|---|---|
| `crystal_seat_threshold.right.next_surface` | next_surface | `crystal_seat_orientation_passage` |
| `crystal_seat_threshold.next_surface` | (default) | `crystal_seat_split_path` |
| `crystal_seat_split_path.standing` | standing | (absent) |
| `crystal_seat_orientation` | (entire node) | NOT IN encounter_structure |

### surface_assignment (before)

| surface_key | registry_key | metadata.standing |
|---|---|---|
| `crystal_seat_threshold` | `ai_isnt_broken_intro` | — |
| `crystal_seat_split_path` | `evaluate_structure_path` | — |
| `crystal_seat_orientation` | `ai_isnt_broken_intro` | — |

---

## POST-MUTATION STATE

### encounter_structure nodes (after)

| Node | Key field | Value |
|---|---|---|
| `crystal_seat_threshold.left.next_surface` | next_surface | `obsidian_chamber_orientation` ✓ (unchanged) |
| `crystal_seat_threshold.right.next_surface` | next_surface | `crystal_seat_orientation` ✓ (was: crystal_seat_orientation_passage) |
| `crystal_seat_threshold.next_surface` | (default) | REMOVED ✓ (was: crystal_seat_split_path) |
| `crystal_seat_split_path.standing` | standing | `legacy_alias` ✓ |
| `crystal_seat_orientation` | next_surface | `crystal_seat_encounter` ✓ (added) |

Full verified transition chain:
```
crystal_seat_threshold.left  → obsidian_chamber_orientation
crystal_seat_threshold.right → crystal_seat_orientation
crystal_seat_orientation     → crystal_seat_encounter
crystal_seat_split_path      → legacy_alias (no active routing leads here)
```

### surface_assignment (after)

| surface_key | registry_key | metadata.standing |
|---|---|---|
| `crystal_seat_threshold` | `ai_isnt_broken_intro` | — (active) |
| `crystal_seat_split_path` | `evaluate_structure_path` | `legacy_alias` ✓ |
| `crystal_seat_orientation` | `ai_isnt_broken_intro` | — (active) |

---

## RESOLVER KEY CHANGES

### registryResolver.ts — ENCOUNTER_REGISTRY_KEYS

- REMOVED: `"evaluate_structure_path"` — no active surface uses it as registry_key; split_path is legacy_alias; gate now fails via missing_registry_record (anon RLS excludes held inactive rows if any) or simply unused fetch

### registryResolver.ts — ENCOUNTER_DEF_KEYS

- REMOVED: `"evaluate_structure_path"` — no active surface uses it as encounter_key

`structure_passage` retained in ENCOUNTER_DEF_KEYS (defensive for measures_structured_environments).

---

## RENDERER DISPATCH

`CrystalSeatRenderer.tsx` dispatch for `crystal_seat_split_path` retained as defensive legacy branch
(`PathChoiceSeat`). The surface still exists in `measures_encounter_surface_assignment`; keeping
the dispatch prevents an unknown-surface fallback if it is ever navigated to directly.
No active routing leads to `crystal_seat_split_path` after this OAR.

`crystal_seat_threshold` dispatches to `IntroHookSeat` which:
1. Plays intro video (`intro_hook_video` media role)
2. On completion → shows L/R threshold plaques (Assess / Understand the Environment)
3. Left choice → `obsidian_chamber_orientation` (via `encounter.transitionNodes.crystal_seat_threshold.left.next_surface`)
4. Right choice → `crystal_seat_orientation` (via `encounter.transitionNodes.crystal_seat_threshold.right.next_surface`)

`crystal_seat_orientation` dispatches to `IntroHookSeat` with:
- `encounter.transitionNodes.crystal_seat_orientation.next_surface = "crystal_seat_encounter"`
- No left/right branch nodes → both choices fall back to `next_surface = "crystal_seat_encounter"`

---

## GAPS — NOT EXECUTED IN THIS OAR

### 1. crystal_seat_intro as distinct surface

The OAR2 ALIGNED section describes `crystal_seat_intro` as a distinct hook/media intro surface
(`media: ai_isnt_broken_intro`) preceding `crystal_seat_threshold`. No `crystal_seat_intro`
surface_key exists in `measures_encounter_surface_assignment` or the EncounterSurface union.
The current architecture has `crystal_seat_threshold` carrying both the intro video phase
and the L/R choice phase (via IntroHookSeat). Splitting intro from threshold is a future OAR.

### 2. crystal_seat_orientation renderer

`crystal_seat_orientation` currently dispatches to `IntroHookSeat` (same component as threshold).
With `registry_key = 'ai_isnt_broken_intro'`, it receives the threshold encounterDef content
(including left/right plaques). Both choices fall back to `crystal_seat_encounter` (no left/right
transition nodes on the orientation entry). A dedicated orientation renderer using `measures_position`
media is a separate OAR (requires renderer component + registry_key normalization).

### 3. evaluate_structure_path registry_key carryover

`crystal_seat_split_path.registry_key = 'evaluate_structure_path'` — the split_path surface
still holds this key in surface_assignment. No action taken: the surface is legacy_alias,
no active surface depends on `evaluate_structure_path`, and the resolver no longer fetches it.
Formal registry_key normalization (or surface deletion) requires a separate OAR.

### 4. obsidian_chamber_orientation content_encounter_key in encounter_structure

`encounter_structure.obsidian_chamber_orientation.content_encounter_key = "eval_passage"` is stale —
obsidian_chamber_orientation now has its own canonical encounter_def. Not changed here (Crystal Seat OAR scope).

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Pre-mutation DB verified | ✓ |
| `crystal_seat_split_path` not active routing authority | ✓ legacy_alias |
| `crystal_seat_threshold` carries L/R choice | ✓ left: obsidian_chamber_orientation, right: crystal_seat_orientation |
| Default next_surface to split_path removed from threshold | ✓ |
| `crystal_seat_orientation` added to encounter_structure | ✓ next_surface: crystal_seat_encounter |
| `crystal_seat_orientation_passage` remains held | ✓ not activated |
| `crystal_seat_intro` not collapsed into `crystal_seat_orientation` | ✓ distinct (future surface) |
| `/about-measures-registry` still resolves | ✓ crystal_seat_encounter unchanged |
| evaluate_structure_path removed from resolver fetch keys | ✓ |
| No Obsidian / Lapis / Marble changes | ✓ |
| No passage activation | ✓ |
| TypeScript: tsc --noEmit zero errors | ✓ |
| Post-migration encounter_structure confirmed via PostgREST | ✓ |
| OAR1 records before/after proof | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Crystal Seat split path collapsed into threshold.

`crystal_seat_threshold` carries the L/R choice. Left routes to `obsidian_chamber_orientation`.
Right routes to `crystal_seat_orientation` (no longer to the held passage). `crystal_seat_split_path`
is legacy_alias. `crystal_seat_orientation` has a transition node routing to `crystal_seat_encounter`.

Three gaps deferred: `crystal_seat_intro` as distinct surface, `crystal_seat_orientation` dedicated
renderer, `evaluate_structure_path` registry_key carryover normalization.

Threshold carries the choice.
Crystal intro opens.
Crystal threshold offers L/R.
Crystal orientation positions.
Crystal encounter explains.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
