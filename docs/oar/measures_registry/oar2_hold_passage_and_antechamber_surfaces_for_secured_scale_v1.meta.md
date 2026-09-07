---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Hold Passage and Antechamber Surfaces for Secured Scale
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_normalize_free_runtime_to_final_seat_structure_v1
---

# OAR2 - Hold Passage and Antechamber Surfaces for Secured Scale

## OBSERVED

OAR1 normalized active FREE runtime vocabulary to final SEAT structure.

However, OAR1 also confirmed a remaining gate mismatch:

Metadata standing says held, but `measures_registry` release gate still passes for several passage / held surfaces.

Current mismatch:

- `metadata.standing = held | legacy_alias | gap`
- but `measures_registry.is_active = true`
- and `measures_registry.release_state = released`

This means these surfaces are cosmetically held but still gate-active.

That is not valid.

Passages and antechambers are HELD for secured/scale.

They are not active public Measures Registry launch surfaces.

## ALIGNED

Final active Measures Registry public launch structure remains the SEAT structure.

Active FREE public runtime must not expose passage or antechamber surfaces as public launch surfaces.

Passage / antechamber records may remain in DB only as:

- held
- secured_scale
- legacy_alias
- audit_trace
- gap

But their actual registry gate must not pass publicly.

The release gate must match standing.

## TARGET SURFACES FOR HOLD REVIEW

Cody must verify and hold these registry/surface records where present:

- `crystal_seat_orientation_passage`
- `obsidian_chamber_orientation_passage`
- `marble_chamber_orientation_passage`
- `structure_passage`
- `measures_structured_environments`

Cody must also review but not necessarily hold:

- `eval_passage`
- `publication_dispatch`

because prior OAR1 classified them as:

- `eval_passage` = legacy_alias
- `publication_dispatch` = audit_trace

If either remains needed for route continuity or defensive renderer compatibility, preserve as legacy/audit standing but ensure it is not independently public sequence authority.

## ROUTED

### 1. Verify live gate state first

Run:

    SELECT
      registry_key,
      is_active,
      release_state
    FROM public.measures_registry
    WHERE registry_key IN (
      'crystal_seat_orientation_passage',
      'obsidian_chamber_orientation_passage',
      'marble_chamber_orientation_passage',
      'structure_passage',
      'measures_structured_environments',
      'eval_passage',
      'publication_dispatch'
    )
    ORDER BY registry_key;

Also run:

    SELECT
      surface_key,
      metadata->>'standing' AS standing,
      metadata->>'profile' AS profile
    FROM public.measures_encounter_surface_assignment
    WHERE surface_key IN (
      'crystal_seat_orientation_passage',
      'obsidian_chamber_orientation_passage',
      'marble_chamber_orientation_passage',
      'structure_passage',
      'measures_structured_environments',
      'eval_passage',
      'publication_dispatch'
    )
    ORDER BY surface_key;

### 2. Hold actual passage / scale surfaces

If present, update registry gate for true held surfaces:

    UPDATE public.measures_registry
    SET
      is_active = false,
      release_state = 'held',
      updated_at = NOW()
    WHERE registry_key IN (
      'crystal_seat_orientation_passage',
      'obsidian_chamber_orientation_passage',
      'marble_chamber_orientation_passage',
      'structure_passage',
      'measures_structured_environments'
    );

If `updated_at` does not exist, rerun without `updated_at`.

### 3. Preserve legacy/audit surfaces without activating new sequence

For `eval_passage` and `publication_dispatch`, Cody must inspect route usage and renderer dependency before mutation.

If they are not public route authorities and are only defensive/audit/legacy surfaces, leave gate standing unchanged but confirm they do not appear in active route maps.

If they independently pass as public launch route authority, hold or isolate them with evidence.

Do not delete.

### 4. Confirm SEAT active surfaces remain released

Run:

    SELECT
      registry_key,
      is_active,
      release_state
    FROM public.measures_registry
    WHERE registry_key IN (
      'ai_isnt_broken_intro',
      'evaluate_structure_path',
      'about_measures_registry',
      'undrifted',
      'obsidian_chamber_orientation_passage',
      'measures_assessment',
      'map_integrity_governance'
    )
    ORDER BY registry_key;

Cody must confirm no SEAT active route was accidentally held.

If `obsidian_chamber_orientation` still depends on registry_key `obsidian_chamber_orientation_passage`, do not break active Obsidian orientation. In that case, report registry_key mismatch and stop before holding that key.

This is critical.

Surface_key was normalized to `obsidian_chamber_orientation`, but DB registry_key may still be `obsidian_chamber_orientation_passage`.

Do not hold a registry_key that still gates an active SEAT surface.

If any held candidate is still the registry_key for an active SEAT surface, report required registry_key normalization as a separate OAR.

## CRITICAL BOUNDARY

Do not confuse:

- `surface_key`
- `registry_key`
- `encounter_key`
- `route`
- `metadata.profile`
- `metadata.standing`

Holding is valid only when the registry gate being held is not currently required by a final SEAT surface.

Codex holds.
Do not infer.

## DO NOT TOUCH

This OAR does not authorize:

- deleting rows
- creating rows
- new routes
- new public sequence
- CSS refactor
- visual redesign
- report copy changes
- scoring changes
- Stripe/payment logic changes
- certification/conversion claims
- registered_runtime restoration
- frontend-owned truth

## CODY ROLE

Cody may:

- inspect live registry and surface assignment rows
- hold true passage/scale records where dependency-safe
- report registry_key mismatches
- preserve active SEAT surfaces
- write migration only after verifying no active SEAT dependency is broken
- write OAR1 with before/after evidence

Cody may not:

- blindly hold `obsidian_chamber_orientation_passage` if it still gates active `obsidian_chamber_orientation`
- delete records
- break active route resolution
- treat metadata standing as actual release standing
- activate passages or antechambers
- mutate unrelated launch behavior

## VALIDATION

Validation succeeds when:

- held passage/scale records no longer pass public registry gate
- active SEAT surfaces still pass registry gate
- no active SEAT surface is broken by holding legacy registry_key
- `metadata.standing` and actual `measures_registry` gate no longer contradict each other for true held records
- passage and antechamber surfaces remain held for secured/scale
- no public launch route is added
- no visual/report/scoring/payment mutation occurs
- registered_runtime remains retired
- OAR1 records before/after proof and any blocked key mismatch

## EXPECTED OAR1

docs/oar/measures_registry/oar1_hold_passage_and_antechamber_surfaces_for_secured_scale_v1.meta.md

## CLOSE

Metadata held is not enough.

The registry gate must hold too.

Passages and antechambers remain held for secured/scale.

Do not break active SEAT surfaces.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
