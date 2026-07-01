---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Hold Passage and Antechamber Surfaces for Secured Scale
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_hold_passage_and_antechamber_surfaces_for_secured_scale_v1
---

# OAR1 - Hold Passage and Antechamber Surfaces for Secured Scale

## EXECUTION METHOD

Live registry gate state verified first via PostgREST anon-key queries before any
mutation. SEAT active surfaces confirmed still released post-migration. Migration
202606300013 applied via `npx supabase db push` (exit code 0). Post-migration
anon-key read of `crystal_seat_orientation_passage` returned `[]` — RLS policy on
`measures_registry` blocks anon reads for `is_active=false` rows, confirming the
gate is now actually held (not just metadata-tagged). One surface (`obsidian_chamber_orientation_passage`)
blocked from hold — documented as requiring a separate registry_key normalization OAR.

---

## PRE-MIGRATION GATE STATE

Verified via PostgREST before migration. Target passage entries in `measures_registry`:

| registry_key | is_active (before) | release_state (before) | action |
|---|---|---|---|
| `crystal_seat_orientation_passage` | true | released | HELD ✓ |
| `marble_chamber_orientation_passage` | true | released | HELD ✓ |
| `obsidian_chamber_orientation_passage` | true | released | BLOCKED — see below |

Entries NOT present in `measures_registry` (already gate-failed via `missing_registry_record`):

| entry | status | classification |
|---|---|---|
| `structure_passage` | not in measures_registry | held (no row → gate fails) |
| `measures_structured_environments` | not in measures_registry | held (no row → gate fails) |
| `eval_passage` | not in measures_registry | legacy_alias (no row → gate fails) |
| `publication_dispatch` | not in measures_registry | audit_trace (no row → gate fails) |

No migration action required for these four — they are already gate-gated by absence.

---

## POST-MIGRATION GATE STATE

Migration 202606300013 applied. Confirmed via PostgREST anon-key read:

| registry_key | is_active (after) | release_state (after) | verification |
|---|---|---|---|
| `crystal_seat_orientation_passage` | false | held | anon query returned `[]` — RLS hides inactive rows ✓ |
| `marble_chamber_orientation_passage` | false | held | migration applied; WHERE clause targeted registry_key exactly ✓ |
| `obsidian_chamber_orientation_passage` | true | released | NOT touched — BLOCKED (see below) |

SEAT active surfaces — confirmed released (post-migration anon query):

| registry_key | is_active | release_state |
|---|---|---|
| `ai_isnt_broken_intro` | true | released |
| `evaluate_structure_path` | true | released |
| `about_measures_registry` | true | released |
| `undrifted` | true | released |
| `obsidian_chamber_orientation_passage` | true | released |
| `measures_assessment` | true | released |
| `map_integrity_governance` | true | released |

No SEAT active surface was accidentally held. ✓

---

## MIGRATION APPLIED

**`supabase/migrations/202606300013_hold_passage_and_antechamber_surfaces.sql`**

```sql
UPDATE public.measures_registry
SET is_active = false, release_state = 'held'
WHERE registry_key = 'crystal_seat_orientation_passage';

UPDATE public.measures_registry
SET is_active = false, release_state = 'held'
WHERE registry_key = 'marble_chamber_orientation_passage';
```

Migration comment documents:
- `obsidian_chamber_orientation_passage` blocked (reason: active SEAT surface dependency)
- `structure_passage`, `measures_structured_environments`, `eval_passage`,
  `publication_dispatch` not in `measures_registry` (no action needed, gate already fails)

---

## BLOCKED: obsidian_chamber_orientation_passage

**Cannot hold this entry in this OAR.**

Root cause: Active SEAT surface `obsidian_chamber_orientation` (surface_key in
`measures_encounter_surface_assignment`) carries `registry_key = 'obsidian_chamber_orientation_passage'`.

The `releaseGate.ts` function fetches the `measures_registry` row WHERE `registry_key`
matches the surface's `registry_key` column. If `obsidian_chamber_orientation_passage`
is set `is_active = false`, the release gate for the active live Obsidian orientation
surface returns `{ status: "held", reason: "inactive_registry_record" }` — breaking
the live site.

**Required next step:** A dedicated OAR must first update:
```sql
UPDATE public.measures_encounter_surface_assignment
SET registry_key = 'obsidian_chamber_orientation'  -- or a new canonical key
WHERE surface_key = 'obsidian_chamber_orientation';
```
and add the new registry_key to `ENCOUNTER_REGISTRY_KEYS` / `ENCOUNTER_DEF_KEYS` in
`registryResolver.ts`. Only after that decoupling is confirmed live can
`obsidian_chamber_orientation_passage` be safely held in `measures_registry`.

This is a registry_key normalization gap — the surface_key was correctly renamed to
`obsidian_chamber_orientation` in OAR2 `normalize_free_runtime_to_final_seat_structure`,
but its `registry_key` column was not updated (registry_key is a FK to `measures_registry`,
not a candidate for the same surface_key rename migration).

---

## GATE MECHANISM — CONFIRMED

`releaseGate.ts` reads:
- `row.is_active` — if false → `{ status: "held", reason: "inactive_registry_record" }`
- `row.release_state` — if not `"released"` → `{ status: "held", reason: "release_state:..." }`

`metadata.standing` tags in `measures_encounter_surface_assignment` are documentation-only.
The RLS policy on `measures_registry` (anon role) additionally restricts reads to
`is_active = true` rows — confirmed by the PostgREST anon query returning `[]` for
`crystal_seat_orientation_passage` after hold. The gate operates at two levels:
application code (releaseGate) and database (RLS). Both now enforce the hold.

---

## eval_passage AND publication_dispatch — DISPOSITION

OAR2 flagged these for review:

**eval_passage** (classified: `legacy_alias` in surface_assignment metadata)
- No row exists in `measures_registry` for `registry_key = 'eval_passage'`.
- Gate already fails with `missing_registry_record`.
- `ObsidianChamberRenderer.tsx` retains a dispatch branch for `eval_passage` as
  defensive compatibility (handled alongside `obsidian_chamber_orientation_passage`).
- Not a public launch route authority. No further action needed.

**publication_dispatch** (classified: `audit_trace` in surface_assignment metadata)
- No row exists in `measures_registry` for `registry_key = 'publication_dispatch'`.
- Gate already fails with `missing_registry_record`.
- `LapisChamberRenderer.tsx` retains a dispatch branch for `publication_dispatch`.
- Not a public launch route authority. No further action needed.

---

## REMAINING GAPS (not executed in this OAR)

### 1. obsidian_chamber_orientation registry_key normalization

Active surface `obsidian_chamber_orientation` has `registry_key = 'obsidian_chamber_orientation_passage'`
in `measures_encounter_surface_assignment`. Requires a dedicated OAR to:
1. Update `registry_key` to a normalized canonical value (e.g. `'obsidian_chamber_orientation'`)
2. Add that registry_key to `ENCOUNTER_REGISTRY_KEYS` / `ENCOUNTER_DEF_KEYS`
3. Add a row in `measures_registry` with that registry_key if not already present
4. Then hold `obsidian_chamber_orientation_passage` in `measures_registry`

### 2. Five embedded SEAT terms without standalone DB rows

`obsidian_chamber_C1_compact`, `marble_chamber_orientation`, `marble_chamber_encounter`,
`marble_chamber_C2_agreement`, `marble_chamber_C2_resolution` — carried forward from
prior OAR. Require component-level changes and new DB rows.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Live gate state verified before mutation | ✓ |
| crystal_seat_orientation_passage: held in measures_registry | ✓ |
| marble_chamber_orientation_passage: held in measures_registry | ✓ |
| obsidian_chamber_orientation_passage: NOT held (SEAT dependency active) | ✓ reported |
| SEAT active surfaces: all still is_active=true, released | ✓ confirmed post-migration |
| structure_passage / measures_structured_environments / eval_passage / publication_dispatch: already gate-failed, no action | ✓ |
| No rows deleted | ✓ |
| No new routes created | ✓ |
| No active SEAT surface broken | ✓ |
| Migration applied via npx supabase db push | ✓ exit code 0 |
| Post-migration anon gate proof | ✓ crystal_seat_orientation_passage returns [] |
| OAR1 records before/after evidence and blocked key mismatch | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Passage and antechamber registry gates aligned with standing.

The actual `measures_registry` release gate now matches `metadata.standing` for all
passages where hold was dependency-safe. `metadata.standing = held` is no longer a
cosmetic tag contradicted by a live release gate.

`obsidian_chamber_orientation_passage` remains the single outstanding gate mismatch.
It is documented, reasoned, and blocked cleanly — not silently skipped. A dedicated
registry_key normalization OAR is required before it can be safely held.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
