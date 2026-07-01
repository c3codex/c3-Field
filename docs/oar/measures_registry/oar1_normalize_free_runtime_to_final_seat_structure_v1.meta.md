---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Normalize FREE Runtime to Final SEAT Structure
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_normalize_free_runtime_to_final_seat_structure_v1
---

# OAR1 - Normalize FREE Runtime to Final SEAT Structure

## EXECUTION METHOD

Full source audit completed first (registryResolver, encounterProfileLoader,
encounterComposition, MeasuresRegistryOrchestrator, all 4 chamber renderers,
EncounterSurface type, encounter_structure JSONB in measures_registry_root, live DB
surface_assignment rows with registry_key/encounter_key columns). Atomic rename applied:
DB migration 202606300012 + TypeScript source changes in the same commit.

Migration applied via `npx supabase db push` (exit code 0). TypeScript check passed
(`npx tsc --noEmit` produced zero errors). Live DB re-verified via PostgREST after migration.

---

## BEFORE / AFTER — SURFACE_KEY RENAMES (8 canonical surfaces)

| Old surface_key | New surface_key (SEAT term) | DB registry_key (unchanged) |
|---|---|---|
| `intro_hook` | `crystal_seat_threshold` | ai_isnt_broken_intro |
| `path_choice` | `crystal_seat_split_path` | evaluate_structure_path |
| `intro` | `crystal_seat_orientation` | ai_isnt_broken_intro |
| `about_measures_registry` | `crystal_seat_encounter` | about_measures_registry |
| `structural_drift_dispatches` | `lapis_chamber_encounter` | undrifted |
| `structural_coherence_explainer` | `obsidian_chamber_orientation` | obsidian_chamber_orientation_passage |
| `measures_assessment` | `obsidian_chamber_encounter_surface` | measures_assessment |
| `map_integrity_governance` | `marble_chamber_C2_compact` | map_integrity_governance |

Surface_key column is UNIQUE (not PK; PK is UUID `id`). No FK constraints on
surface_key from any other table. UPDATE was safe without CASCADE.

---

## SOURCE FILES CHANGED

### `src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts`

`EncounterSurface` union replaced: 8 old surface_key strings removed, 8 canonical SEAT
terms added. Held/legacy/audit-trace surfaces retained in union (their DB rows still
exist; renderer dispatch must handle them defensively).

### `src/measures_registry/encounter_renderer/resolver/registryResolver.ts`

- `ENCOUNTER_REGISTRY_KEYS`: removed dead entries (`eval_passage`, `structure_passage`,
  `structural_drift_publication` — none exist as registry_keys in `measures_registry`
  table). Added `undrifted` (registry_key for lapis_chamber_encounter surface).
- `ENCOUNTER_DEF_KEYS`: same removals, same addition of `undrifted`.
- No changes to the Supabase query select columns (registryResolver does not select
  `metadata` from `measures_encounter_surface_assignment` — confirmed, no change needed).

### `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx`

- `ROUTE_SURFACE_MAP`: all 6 active path entries updated to canonical SEAT terms.
  Public routes unchanged (`/undrifted`, `/about-measures-registry`, etc. remain stable).
- `PUBLIC_ROUTE_BY_SURFACE`: updated to canonical SEAT term keys.
- `initialSurface()` default: `"intro_hook"` → `"crystal_seat_threshold"`.
- `"/publication/structural_drift"` path: `"structural_drift_dispatches"` → `"lapis_chamber_encounter"`.
- Footer `navigate("about_measures_registry")` → `navigate("crystal_seat_encounter")`.
- Capture callbacks (`onCaptureAssessment`, `onCaptureSubscription`, `onCaptureConnect`,
  `onInitiateMapPayment`) left completely unchanged — these write archival metadata to
  capture tables, not runtime dispatch strings.
- Stripe success/cancel URLs left as `/map-integrity-governance` — public route, stable.

### `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`

- Dispatch: `"intro_hook" | "intro"` → `"crystal_seat_threshold" | "crystal_seat_orientation"`.
- Dispatch: `"path_choice"` → `"crystal_seat_split_path"`.
- Dispatch: `"about_measures_registry"` → `"crystal_seat_encounter"`.
- `structure_passage | crystal_seat_orientation_passage` branch unchanged (held surfaces).
- `measures_structured_environments` held branch unchanged.
- Two hardcoded `data-surface="path_choice"` and `data-surface="about_measures_registry"`
  attributes changed to `data-surface={encounter.surface}` (dynamic, accurate after rename).

### `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx`

- Dispatch: `"structural_coherence_explainer"` replaced with `"obsidian_chamber_orientation"`.
  `"eval_passage"` and `"obsidian_chamber_orientation_passage"` retained in branch
  as defensive dispatch for held/legacy DB rows.
- Dispatch: `"measures_assessment"` → `"obsidian_chamber_encounter_surface"`.

### `src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx`

- Dispatch: `"structural_drift_dispatches"` → `"lapis_chamber_encounter"`.
- `"publication_dispatch"` branch unchanged.

### `src/measures_registry/encounter_renderer/chambers/MarbleChamberRenderer.tsx`

- Dispatch: `"map_integrity_governance"` → `"marble_chamber_C2_compact"`.
- `"marble_chamber_orientation_passage"` retained in branch as defensive dispatch for
  held DB row.

---

## ENCOUNTER_STRUCTURE JSONB — BEFORE / AFTER SUMMARY

All 8 SEAT term surface_keys were renamed as JSON keys in the encounter_structure.
`next_surface` values throughout were updated to match. eval_passage and
structure_passage/crystal_seat_orientation_passage/measures_structured_environments
entries retained with `standing` tags (legacy_alias / held). obsidian_to_marble_passage_video
next_surface updated: `"map_integrity_governance"` → `"marble_chamber_C2_compact"`.

Active navigation chain post-rename:
```
crystal_seat_threshold → (left) obsidian_chamber_orientation
crystal_seat_threshold → (right) crystal_seat_orientation_passage [held]
crystal_seat_threshold → (default) crystal_seat_split_path

crystal_seat_split_path → (left) obsidian_chamber_orientation
crystal_seat_split_path → (right) crystal_seat_orientation_passage [held]

obsidian_chamber_orientation → obsidian_chamber_encounter_surface
obsidian_chamber_encounter_surface → obsidian_to_marble_passage_video
obsidian_to_marble_passage_video → marble_chamber_C2_compact
```

All `next_surface` values are valid members of the updated `EncounterSurface` union. ✓

---

## PROFILE METADATA CORRECTIONS

Two surfaces had intermediate profile strings from migration 202606300011 that were
superseded by this OAR2's final term list. Corrected in 202606300012:

| surface_key | Old profile (202606300011) | New profile |
|---|---|---|
| `crystal_seat_orientation` | `crystal_orientation_surface` | `crystal_seat_orientation` |
| `obsidian_chamber_encounter_surface` | `obsidian_chamber_encounter_assessment` | `obsidian_chamber_encounter_surface` |
| `marble_chamber_C2_compact` | `marble_chamber_C2_encounter` | `marble_chamber_C2_compact` |

---

## REGISTRYRESOLVER KEY CORRECTION

Added `"undrifted"` to `ENCOUNTER_REGISTRY_KEYS` and `ENCOUNTER_DEF_KEYS`. This fixes
the pre-existing condition where `lapis_chamber_encounter` (formerly
`structural_drift_dispatches`) had registry_key=`"undrifted"` but `"undrifted"` was
not in the fetch list — causing `missing_registry_record` → gate held → `/undrifted`
always showed held state. With `"undrifted"` now fetched, the Lapis Chamber encounter
can render if `measures_registry` WHERE `registry_key = 'undrifted'` is `is_active=true`
and `release_state='released'` (confirmed from live DB query).

---

## LIVE DB STATE (POST-MIGRATION)

Active SEAT surfaces (8 canonical):
| surface_key | material | profile |
|---|---|---|
| `crystal_seat_threshold` | crystal | crystal_seat_threshold |
| `crystal_seat_split_path` | crystal | crystal_seat_split_path |
| `crystal_seat_orientation` | crystal | crystal_seat_orientation |
| `crystal_seat_encounter` | crystal | crystal_seat_encounter |
| `lapis_chamber_encounter` | lapis | lapis_chamber_encounter |
| `obsidian_chamber_orientation` | obsidian | obsidian_chamber_orientation |
| `obsidian_chamber_encounter_surface` | obsidian | obsidian_chamber_encounter_surface |
| `marble_chamber_C2_compact` | marble | marble_chamber_C2_compact |

Active passage (not a SEAT term, transition passage):
| surface_key | material | profile |
|---|---|---|
| `obsidian_to_marble_passage_video` | obsidian | obsidian_to_marble_passage |

Held / legacy / audit-trace (8 rows with standing tags):
| surface_key | standing |
|---|---|
| `eval_passage` | legacy_alias |
| `crystal_seat_orientation_passage` | held |
| `structure_passage` | held |
| `obsidian_chamber_orientation_passage` | legacy_alias |
| `marble_chamber_orientation_passage` | gap |
| `measures_structured_environments` | held |
| `publication_dispatch` | audit_trace |
| (lapis_chamber_encounter profile normalized above; no standing tag needed) | — |

---

## REMAINING GAPS (not executed in this OAR)

### 1. Passage gate standing not changed in measures_registry

`crystal_seat_orientation_passage`, `obsidian_chamber_orientation_passage`,
`marble_chamber_orientation_passage`, `structure_passage`, `measures_structured_environments`
all currently have `is_active=true, release_state=released` in the `measures_registry`
table (confirmed via live query). Their metadata.standing tags say "held" but the
actual release gate PASSES for these surfaces — the gate reads from measures_registry,
not from surface_assignment.metadata. Truly holding them requires a dedicated migration
updating `measures_registry SET is_active=false WHERE registry_key IN (...)` for these
passage registry_keys. This is the follow-up OAR.

### 2. obsidian_chamber_C1_compact, marble_chamber_orientation, marble_chamber_encounter, marble_chamber_C2_agreement, marble_chamber_C2_resolution

These 5 SEAT terms have no standalone surface_key row in measures_encounter_surface_assignment.
They are embedded inside the `obsidian_chamber_encounter_surface` component flow
(contact_capture, report_findings) and the `marble_chamber_C2_compact` component
(Stripe payment, confirmation page). Seating them as distinct surfaces requires
component-level changes plus new DB rows — a separate, dedicated OAR.

### 3. Marble chamber orientation renderer gap

`marble_chamber_orientation` (item 9 from OAR2 ALIGNED) has no distinct renderer.
MarbleChamberRenderer currently routes `marble_chamber_orientation_passage` to the same
`MapIntegrityGovernance` component as `marble_chamber_C2_compact`. Splitting these
requires a new Marble orientation component — a separate code OAR.

### 4. data-layout-contract attribute naming

`data-layout-contract` HTML attributes are used throughout chamber renderers as internal
CSS selector hooks (e.g. `data-layout-contract="intro"`, `"marble_chamber_directory"`).
Per OAR2 audit, these are pure internal CSS infrastructure, not user-facing language.
Not mutated in this OAR; flagged as a future alignment pass if desired.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Live DB inspected before mutation | ✓ |
| Full source audit completed before mutation | ✓ |
| 8 surface_keys renamed atomically (DB + code) | ✓ verified live |
| encounter_structure JSONB updated with renamed keys + next_surface values | ✓ |
| EncounterSurface union updated | ✓ |
| ROUTE_SURFACE_MAP updated | ✓ |
| PUBLIC_ROUTE_BY_SURFACE updated | ✓ |
| initialSurface() default updated | ✓ |
| Footer navigate call updated | ✓ |
| All 4 chamber renderer dispatch branches updated | ✓ |
| TypeScript: `tsc --noEmit` zero errors | ✓ |
| Public routes unchanged (/undrifted, /about-measures-registry, /ai-operations-assessment, /map-integrity-governance) | ✓ |
| Stripe success/cancel URL unchanged | ✓ |
| Capture callback internals unchanged | ✓ |
| "undrifted" added to ENCOUNTER_REGISTRY_KEYS/DEF_KEYS (fixes Lapis gate) | ✓ |
| profile metadata values corrected for 3 surfaces | ✓ verified live |
| Held/legacy surfaces retained in EncounterSurface union and renderer dispatch | ✓ |
| No new chambers, profiles, or public sequences | ✓ |
| registered_runtime remains retired | ✓ |
| FREE remains active render authority | ✓ |
| OAR1 records before/after evidence | ✓ |

---

## FINAL DISPOSITION

**SEATED** — FREE runtime normalized to final 13-part SEAT vocabulary.

The active launch vocabulary of Measures Registry FREE is now the canonical 13-term
SEAT structure:
- surface_key values, metadata.profile values, EncounterSurface type, ROUTE_SURFACE_MAP,
  chamber renderer dispatch, encounter_structure transition keys — all aligned.
- TypeScript clean. Migration applied. Live DB confirmed.

5 remaining gaps reported (passage gate standing, 5 embedded SEAT terms, marble
orientation renderer, data-layout-contract alignment) — these require dedicated follow-up
OARs, not silent mutation in this one.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
