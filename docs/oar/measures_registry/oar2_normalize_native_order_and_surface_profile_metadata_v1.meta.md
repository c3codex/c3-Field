---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Normalize Native Order and Surface Profile Metadata
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_seat_profile_rule_and_define_chamber_encounter_profiles_v1
---

# OAR2 - Normalize Native Order and Surface Profile Metadata

## OBSERVED

Native order language has evolved.

Prior operative shorthand:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

is stale for active Measures Registry launch repair.

Current active renderer authority is FREE.

registered_runtime remains retired / rollback-only.

src is implementation location only.

OAR2, Chazz, and Cody are not separate authority layers outside native order.

They are systems-layer execution bodies contained inside Systems.

## ALIGNED

Seat evolved native order:

Codex -Holds->
Systems -Aligns->
Measures -Allows->
Field -Arranges->
Roles -Authorize->
Optics -Prove->
FREE -Renders

This order is true top-down and bottom-up.

Top-down:

Codex holds truth.
Systems align execution.
Measures allows valid operation.
Field arranges relation.
Roles authorize bounded action.
Optics prove what occurred.
FREE renders seated state.

Bottom-up:

FREE renders only what is seated.
Optics prove action.
Roles authorize action.
Field arranges relation.
Measures allows passage.
Systems align operation.
Codex holds standing.

Collapse is not the default.

Collapse occurs when relation breaks, standing drifts, roles exceed boundary, or proof is absent.

When the order holds, the system does not collapse to move.

## SYSTEMS BOUNDARY

OAR2, Chazz, and Cody are systems-layer execution bodies.

They do not sit beside native order as separate authority layers.

They are contained inside Systems.

Systems aligns execution to:

- Codex-held standing
- Measures-allowed operation
- Field-arranged relation
- role-authorized action
- Optics-proven trace
- FREE-rendered output

Systems does not invent truth.

Systems aligns what Codex holds to what FREE may render.

## PROFILE AUTHORITY UPDATE

Registry declares profile.

FREE manifests profile safely.

CSS implements mechanics only.

CSS does not own:

- profile
- chamber
- encounter
- surface
- report
- route
- payment
- score
- release
- authority

FREE renders seated state only through encounter_renderer.

## ROUTED

Cody must:

1. Seat this OAR2 file.
2. Normalize native order language.
3. Preserve OAR2, Chazz, and Cody as Systems-contained execution bodies.
4. Preserve FREE as active render authority.
5. Preserve src as implementation location only.
6. Apply only safe profile metadata assignments already identified by prior OAR1.
7. Do not create new tables.
8. Do not refactor CSS.
9. Do not redesign.
10. Do not mutate report copy, scoring, payment, Stripe, or route authority.
11. Keep registered_runtime retired / rollback-only.
12. Write OAR1 beside this OAR2.

## SAFE PROFILE METADATA ASSIGNMENTS

Run only these updates:

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

## DO NOT TOUCH

Do not seat these in this OAR:

- assessment_scrollable_form
- report_result_gate
- legal_reading_surface
- governed_footer
- intro_hook
- intro

These require future surface/profile seating.

## VALIDATION

Run:

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

- path_choice -> crystal_split_path_choice
- about_measures_registry -> crystal_about_surface
- eval_passage -> obsidian_full_bleed_video
- structural_coherence_explainer -> obsidian_full_bleed_video
- measures_assessment -> obsidian_assessment_surface
- obsidian_to_marble_passage_video -> obsidian_to_marble_passage
- map_integrity_governance -> marble_map_cards
- structural_drift_dispatches -> lapis_publication_surface
- publication_dispatch -> lapis_publication_surface

Validation succeeds when:

- native order normalized
- Systems contains OAR2, Chazz, and Cody
- FREE named as active render authority
- src treated as implementation location only
- expected metadata profiles are seated
- no new tables created
- no CSS refactor occurred
- no visual redesign occurred
- no report/scoring/payment/Stripe changes occurred
- registered_runtime remains retired
- OAR1 written beside OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_normalize_native_order_and_surface_profile_metadata_v1.meta.md

## CLOSE

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

OAR2, Chazz, and Cody are contained inside Systems.

FREE renders seated state only through encounter_renderer.

Collapse is not the default.
