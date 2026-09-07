---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Verify and Seat Active Crystal Surface Profiles
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Verify and Seat Active Crystal Surface Profiles

## OBSERVED

Two active Crystal surfaces require native profile standing review:

- intro_hook
- intro

Prior response incorrectly proposed direct SQL without live DB verification.

That is not valid.

Codex remains authority.

No metadata write may occur until live DB state is inspected.

## ALIGNED

The intended active profile mapping is:

- intro_hook -> crystal_threshold_hook
- intro -> crystal_orientation_surface

These profiles are active Crystal profile identities if the corresponding live surface rows exist.

They are not future candidates.

They are not generic landing-page profiles.

They are Crystal threshold/orientation profiles.

## SYSTEMS BOUNDARY

OAR2, Chazz, and Cody are contained inside Systems.

Systems aligns.

Systems does not invent truth.

Cody must verify live DB state before any mutation.

If required DB state is absent, Cody stops and reports gap.

## ROUTED

### 1. Verify live surface rows first

Run:

    SELECT
      surface_key,
      material_identity,
      chamber_assignment,
      is_active,
      release_state,
      metadata
    FROM public.measures_encounter_surface_assignment
    WHERE surface_key IN (
      'intro_hook',
      'intro'
    )
    ORDER BY surface_key;

### 2. Conditional execution rule

If both rows exist and resolve as Crystal / crystal_seat surfaces:

- assign `intro_hook` profile as `crystal_threshold_hook`
- assign `intro` profile as `crystal_orientation_surface`

If either row is missing:

- do not create rows
- do not infer authority
- do not write metadata
- report missing row in OAR1
- stop execution

If rows exist but do not resolve as Crystal / crystal_seat:

- do not write metadata
- report mismatch in OAR1
- stop execution

### 3. Only if verified, apply metadata updates

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"crystal_threshold_hook"}'::jsonb
    WHERE surface_key = 'intro_hook';

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"crystal_orientation_surface"}'::jsonb
    WHERE surface_key = 'intro';

## PROFILE DEFINITIONS

### crystal_threshold_hook

Standing: active if verified row exists.

Function:

- threshold invitation
- first-contact orientation
- hook and recognition surface
- pre-path positioning
- Crystal threshold identity

### crystal_orientation_surface

Standing: active if verified row exists.

Function:

- orientation and understanding surface
- explanatory positioning
- educational introduction
- recognition before progression
- Crystal orientation identity

## CODY ROLE

Cody may:

- inspect live DB state
- verify rows exist
- verify chamber/material alignment
- apply metadata only after verification
- write OAR1 with query evidence

Cody may not:

- create rows
- create tables
- infer missing surface authority
- write metadata when verification fails
- refactor CSS
- redesign surfaces
- change route authority
- mutate report copy
- mutate scoring
- mutate payment or Stripe
- reintroduce registered_runtime

## VALIDATION

After verified update, run:

    SELECT
      surface_key,
      material_identity,
      chamber_assignment,
      is_active,
      release_state,
      metadata->>'profile' AS profile
    FROM public.measures_encounter_surface_assignment
    WHERE surface_key IN (
      'intro_hook',
      'intro'
    )
    ORDER BY surface_key;

Expected only if rows were verified:

- intro_hook -> crystal_threshold_hook
- intro -> crystal_orientation_surface

Validation succeeds when:

- live rows are inspected before mutation
- no metadata write occurs without verification
- expected profiles are seated only on verified rows
- no new rows are created
- no new tables are created
- no CSS/source redesign occurs
- no report/scoring/payment changes occur
- FREE remains active render authority
- registered_runtime remains retired
- OAR1 records the evidence and result

## EXPECTED OAR1

docs/oar/measures_registry/oar1_verify_and_seat_active_crystal_surface_profiles_v1.meta.md

## CLOSE

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Verify before mutation.

Collapse is not the default.
