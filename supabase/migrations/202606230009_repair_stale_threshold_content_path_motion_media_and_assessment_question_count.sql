-- Repair stale threshold content, reconcile the path motion-to-still contract,
-- and restore the approved seven-question assessment contract.
-- Source authority:
-- docs/oar/measures_registry/oar2_repair_stale_threshold_content_path_motion_media_and_assessment_question_count_v1.meta.md

UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{title}',
    to_jsonb('AI isn''t broken.'::text),
    true
  ),
  '{subtitle}',
  to_jsonb('Systems are.'::text),
  true
), updated_at = now()
WHERE encounter_key = 'ai_isnt_broken_intro';

UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{media_contract}',
  jsonb_build_object(
    'source_authority', 'measures_media_map',
    'renderer_contract', 'registered_path_choice_motion_to_still_v1',
    'motion_to_still_behavior', 'motion_plays_then_resolves_to_seated_still',
    'left_motion_role', 'left_hero_fracture_motion',
    'left_motion_bucket', 'measures-media',
    'left_motion_asset', 'left_hero_fracture_motion.mp4',
    'left_still_role', 'left_hero_fracture',
    'left_still_bucket', 'measures-registry',
    'left_still_asset', 'left_hero_fracture.webp',
    'right_motion_role', 'measured_hero_motion_graphic',
    'right_motion_bucket', 'measures-media',
    'right_motion_asset', 'right_measured_hero_motion_graphic.mp4',
    'right_still_role', 'right_measured_hero',
    'right_still_bucket', 'measures-registry',
    'right_still_asset', 'right_measured_hero.webp',
    'background_role', 'path_choice_background',
    'background_standing', 'held_inactive_not_required_for_left_right_threshold',
    'frontend_hardcode_allowed', false,
    'blank_media_container_allowed', false,
    'source_oar2', 'docs/oar/measures_registry/oar2_repair_stale_threshold_content_path_motion_media_and_assessment_question_count_v1.meta.md'
  ),
  true
), updated_at = now()
WHERE encounter_key = 'evaluate_structure_path';

UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        metadata,
        '{assessment_mechanics,questions}',
        (
          SELECT jsonb_agg(question ORDER BY ordinal)
          FROM jsonb_array_elements(metadata #> '{assessment_mechanics,questions}')
            WITH ORDINALITY AS questions(question, ordinal)
          WHERE question ->> 'question_key' <> 'ai_output_review_pathway'
        ),
        false
      ),
      '{assessment_mechanics,required_question_count}',
      '7'::jsonb,
      true
    ),
    '{assessment_mechanics,question_contract_repair}',
    jsonb_build_object(
      'total_questions', 7,
      'context_question_count', 1,
      'scored_operational_question_count', 6,
      'question_1_key', 'ai_deployment_status',
      'removed_stale_question_key', 'ai_output_review_pathway',
      'response_payload_question_count', 7,
      'scoring_source', 'assessment_interpretation.scoring_thresholds_and_standing_rules',
      'source_oar2', 'docs/oar/measures_registry/oar2_repair_stale_threshold_content_path_motion_media_and_assessment_question_count_v1.meta.md'
    ),
    true
  ),
  '{assessment_contact_capture_oar1_binding_contract_v1,oar1_payload_schema,action,question_count}',
  '7'::jsonb,
  true
), updated_at = now()
WHERE encounter_key = 'measures_assessment';

DO $$
DECLARE
  question_keys text[];
  media_count integer;
BEGIN
  SELECT array_agg(question ->> 'question_key' ORDER BY ordinal)
  INTO question_keys
  FROM public.measures_encounter_def,
       jsonb_array_elements(metadata #> '{assessment_mechanics,questions}')
         WITH ORDINALITY AS questions(question, ordinal)
  WHERE encounter_key = 'measures_assessment';

  IF cardinality(question_keys) <> 7 THEN
    RAISE EXCEPTION 'Assessment question count must equal 7; got %', cardinality(question_keys);
  END IF;

  IF question_keys[1] <> 'ai_deployment_status' THEN
    RAISE EXCEPTION 'Assessment Q1 must be ai_deployment_status; got %', question_keys[1];
  END IF;

  IF 'ai_output_review_pathway' = ANY(question_keys) THEN
    RAISE EXCEPTION 'Stale ai_output_review_pathway question remains active';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'measures_assessment'
      AND (
        metadata #>> '{assessment_mechanics,required_question_count}' <> '7'
        OR metadata #>> '{assessment_contact_capture_oar1_binding_contract_v1,oar1_payload_schema,action,question_count}' <> '7'
      )
  ) THEN
    RAISE EXCEPTION 'Assessment required or payload question count is not 7';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'ai_isnt_broken_intro'
      AND (
        metadata ->> 'title' <> 'AI isn''t broken.'
        OR metadata ->> 'subtitle' <> 'Systems are.'
        OR metadata::text LIKE '%Behavior that is not registered cannot be governed.%'
        OR metadata::text LIKE '%foundational cohort conversion%'
      )
  ) THEN
    RAISE EXCEPTION 'Deprecated intro threshold copy remains active';
  END IF;

  SELECT count(*) INTO media_count
  FROM public.measures_media_map
  WHERE campaign_key = 'agents_of_chaos_integrity_governance'
    AND is_active = true
    AND (
      (media_role = 'left_hero_fracture_motion' AND storage_bucket = 'measures-media' AND storage_path = 'left_hero_fracture_motion.mp4')
      OR (media_role = 'left_hero_fracture' AND storage_bucket = 'measures-registry' AND storage_path = 'left_hero_fracture.webp')
      OR (media_role = 'measured_hero_motion_graphic' AND storage_bucket = 'measures-media' AND storage_path = 'right_measured_hero_motion_graphic.mp4')
      OR (media_role = 'right_measured_hero' AND storage_bucket = 'measures-registry' AND storage_path = 'right_measured_hero.webp')
    );

  IF media_count <> 4 THEN
    RAISE EXCEPTION 'Required threshold media mapping count must equal 4; got %', media_count;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.measures_registry
    WHERE registry_key = 'ai_operations_assessment_landing'
      AND is_active = true
      AND release_state = 'released'
      AND metadata ->> 'route_path' = '/ai-operations-assessment'
  ) THEN
    RAISE EXCEPTION 'Assessment route release state is not seated';
  END IF;
END $$;
