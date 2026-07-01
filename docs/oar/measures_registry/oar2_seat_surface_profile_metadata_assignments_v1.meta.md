---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seat Surface Profile Metadata Assignments
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_seat_profile_rule_and_define_chamber_encounter_profiles_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
  src: encounter_renderer
tags:
  - oar2
  - measures-registry
  - profile
  - surface-assignment
  - metadata
  - free
  - launch-repair
---

# OAR2 - Seat Surface Profile Metadata Assignments

## OBSERVED

OAR1 confirmed profile standing is seated.

Safe seating path exists through:

`measures_encounter_surface_assignment.metadata`

No new table is required.

This OAR executes only safe metadata profile assignments for existing surface rows.

## ALIGNED

Registry declares profile.

FREE manifests profile safely.

CSS implements mechanics.

Profiles are presentation identity only.

Profiles do not create:

- authority
- content
- route standing
- report copy
- scoring
- payment standing
- release state
- certification
- conversion

Contract use remains banned except smart_contract.

## ROUTED

Apply metadata profile assignments only to existing released or known surface rows.

Run:

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"crystal_split_path_choice"}'::jsonb
    WHERE surface_key = 'path_choice';

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"crystal_about_surface"}'::jsonb
    WHERE surface_key = 'about_measures_registry';

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"obsidian_full_bleed_video"}'::jsonb
    WHERE surface_key IN (
      'eval_passage',
      'structural_coherence_explainer'
    );

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"obsidian_assessment_surface"}'::jsonb
    WHERE surface_key = 'measures_assessment';

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"obsidian_to_marble_passage"}'::jsonb
    WHERE surface_key = 'obsidian_to_marble_passage_video';

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"marble_map_cards"}'::jsonb
    WHERE surface_key = 'map_integrity_governance';

    UPDATE public.measures_encounter_surface_assignment
    SET metadata =
      COALESCE(metadata, '{}'::jsonb)
      || '{"profile":"lapis_publication_surface"}'::jsonb
    WHERE surface_key IN (
      'structural_drift_dispatches',
      'publication_dispatch'
    );

Do not update gap profiles in this OAR:

- assessment_scrollable_form
- report_result_gate
- legal_reading_surface
- governed_footer
- intro_hook
- intro

Those require future seating decisions.

## CODY ROLE

Cody may:

- apply the listed metadata updates
- verify affected rows
- write OAR1 beside this OAR2

Cody may not:

- create new tables
- refactor CSS
- redesign surfaces
- change route authority
- alter report copy
- alter scoring
- alter payment
- alter Stripe
- reintroduce registered_runtime
- assign gap profiles without seated rows
- invent profile authority from CSS

## VALIDATION

After update, run:

    SELECT
      surface_key,
      material_identity,
      chamber_assignment,
      is_active,
      release_state,
      metadata->>'profile' AS profile
    FROM public.measures_encounter_surface_assignment
    WHERE surface_key IN (
      'path_choice',
      'about_measures_registry',
      'eval_passage',
      'structural_coherence_explainer',
      'measures_assessment',
      'obsidian_to_marble_passage_video',
      'map_integrity_governance',
      'structural_drift_dispatches',
      'publication_dispatch'
    )
    ORDER BY surface_key;

Expected profile results:

- path_choice → crystal_split_path_choice
- about_measures_registry → crystal_about_surface
- eval_passage → obsidian_full_bleed_video
- structural_coherence_explainer → obsidian_full_bleed_video
- measures_assessment → obsidian_assessment_surface
- obsidian_to_marble_passage_video → obsidian_to_marble_passage
- map_integrity_governance → marble_map_cards
- structural_drift_dispatches → lapis_publication_surface
- publication_dispatch → lapis_publication_surface

Validation succeeds only if:

- expected profiles are seated in metadata
- no new table is created
- no CSS/source mutation occurs
- no report/scoring/payment mutation occurs
- FREE remains active route authority
- registered_runtime remains retired
- OAR1 is written

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_surface_profile_metadata_assignments_v1.meta.md

## CLOSE

Profile authority moves into registry metadata.

CSS remains mechanics.

No visual mutation from this OAR alone.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes from OAR2 only.
src renders seated state only.
