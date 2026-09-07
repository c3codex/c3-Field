---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Normalize Orientation Surfaces and Hold Passage Carryover
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_hold_passage_and_antechamber_surfaces_for_secured_scale_v1
---

# OAR2 - Normalize Orientation Surfaces and Hold Passage Carryover

## OBSERVED

Prior architecture used `*_orientation_passage` naming for surfaces that are not true passages.

The operator clarified that these are media orientation surfaces before chamber encounter.

They are closer to epithet/orientation function than passage function.

The term `passage` was carryover.

True passages and antechambers are still needed later for secured/scale.

They must remain held and distinct from active public orientation surfaces.

## ALIGNED

Orientation surfaces are not passages.

Native standing:

- orientation = media orientation surface before encounter
- passage = secured/scale movement surface
- antechamber = secured/scale holding/prep surface

Any `*_orientation_passage` term is deprecated carryover unless retained only as a legacy alias during transition.

Active public launch orientation surfaces must use orientation language, not passage language.

## SEATED ORIENTATION SURFACES

The active orientation surfaces are:

1. `crystal_seat_orientation`
   - material: Crystal
   - function: Crystal Seat orientation surface
   - media rename: `measures_position` -> `crystal_seat_orientation` media standing where supported

2. `obsidian_chamber_orientation`
   - material: Obsidian
   - function: Obsidian Chamber media orientation before assessment encounter

3. `marble_chamber_orientation`
   - material: Marble
   - function: Marble Chamber media orientation before Marble encounter / MAP path
   - media rename: `marble_map_orientation`

These are not passages.

## PASSAGE CARRYOVER TO ISOLATE

The following carryover terms must not remain active public orientation authority:

- `crystal_seat_orientation_passage`
- `obsidian_chamber_orientation_passage`
- `marble_chamber_orientation_passage`

Required standing after normalization:

- active orientation surfaces use non-passage names
- carryover passage names become held or legacy_alias only
- true passage/antechamber terms remain available for future secured/scale work

## ROUTED

### 1. Verify current live DB standing

Cody must inspect:

    SELECT
      surface_key,
      registry_key,
      encounter_key,
      material_identity,
      chamber_assignment,
      is_active,
      release_state,
      metadata
    FROM public.measures_encounter_surface_assignment
    WHERE surface_key IN (
      'crystal_seat_orientation',
      'obsidian_chamber_orientation',
      'marble_chamber_orientation',
      'crystal_seat_orientation_passage',
      'obsidian_chamber_orientation_passage',
      'marble_chamber_orientation_passage'
    )
    ORDER BY surface_key;

Also inspect registry gate rows:

    SELECT
      registry_key,
      is_active,
      release_state
    FROM public.measures_registry
    WHERE registry_key IN (
      'crystal_seat_orientation',
      'obsidian_chamber_orientation',
      'marble_chamber_orientation',
      'crystal_seat_orientation_passage',
      'obsidian_chamber_orientation_passage',
      'marble_chamber_orientation_passage'
    )
    ORDER BY registry_key;

### 2. Normalize active orientation registry keys

If active orientation surfaces still depend on `*_orientation_passage` registry_keys, decouple them.

Target state:

- `crystal_seat_orientation.surface_key = crystal_seat_orientation`
- `crystal_seat_orientation.registry_key = crystal_seat_orientation`

- `obsidian_chamber_orientation.surface_key = obsidian_chamber_orientation`
- `obsidian_chamber_orientation.registry_key = obsidian_chamber_orientation`

- `marble_chamber_orientation.surface_key = marble_chamber_orientation`
- `marble_chamber_orientation.registry_key = marble_chamber_orientation`

If a target `measures_registry` row does not exist, create it only if dependency-safe and all required fields can be copied from the old active registry row without inventing truth.

If required fields cannot be verified, report gap and stop that item.

### 3. Hold carryover passage registry keys

After active orientation surfaces are decoupled, hold carryover registry keys:

    UPDATE public.measures_registry
    SET
      is_active = false,
      release_state = 'held'
    WHERE registry_key IN (
      'crystal_seat_orientation_passage',
      'obsidian_chamber_orientation_passage',
      'marble_chamber_orientation_passage'
    );

Only run this after confirming no active orientation surface still depends on those registry_keys.

### 4. Normalize renderer / route references

Cody must audit and update where dependency-safe:

- `EncounterSurface` union
- chamber renderer dispatch branches
- `ROUTE_SURFACE_MAP`
- `PUBLIC_ROUTE_BY_SURFACE`
- `encounter_structure` JSONB
- FREE resolver keys
- media references
- CSS selectors / data keys where they carry passage naming

`*_orientation_passage` may remain only as defensive legacy alias if required, but it must not be active authority.

### 5. Preserve secured/scale future space

Do not delete passage or antechamber concepts.

Do not collapse future secured passage architecture into orientation.

This OAR separates:

- orientation surfaces now
- passages later
- antechambers later

## DO NOT TOUCH

This OAR does not authorize:

- new public sequence
- new chamber names
- passage activation
- antechamber activation
- secured/scale implementation
- report copy changes
- scoring changes
- Stripe/payment changes
- certification/conversion claims
- registered_runtime restoration
- visual redesign
- frontend-owned truth

## CODY ROLE

Cody may:

- inspect live DB and source
- create/copy canonical orientation registry rows only when dependency-safe
- update surface_assignment registry_key references
- update resolver/fetch keys
- update renderer/route references
- hold carryover passage keys after decoupling
- preserve legacy aliases defensively
- run TypeScript/build validation
- write OAR1 with before/after evidence

Cody may not:

- hold a registry_key still used by an active orientation surface
- delete passage/antechamber records
- invent missing registry truth
- activate secured/scale passage behavior
- preserve `*_orientation_passage` as active public authority
- mutate unrelated launch behavior

## VALIDATION

Validation succeeds when:

- active orientation surfaces do not use passage naming
- `crystal_seat_orientation` resolves as Crystal orientation
- `obsidian_chamber_orientation` resolves as Obsidian orientation
- `marble_chamber_orientation` resolves as Marble orientation or exact renderer gap is reported
- `*_orientation_passage` terms are held or legacy aliases only
- no active public route depends on `*_orientation_passage`
- true passage and antechamber concepts remain held for secured/scale
- TypeScript/build validation passes or exact failure is reported
- no report/scoring/payment mutation occurs
- registered_runtime remains retired
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_normalize_orientation_surfaces_and_hold_passage_carryover_v1.meta.md

## CLOSE

Orientation is not passage.

Orientation surfaces prepare encounter.

Passages move secured/scale state.

Antechambers hold secured/scale preparation.

Normalize orientation now.
Hold passage carryover.
Preserve passage and antechamber architecture for scale.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
