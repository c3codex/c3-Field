-- Register typical authorities per passage mode and update encounter order.
-- OAR2: docs/oar/measures_registry/oar2_register_passage_modes_for_role_call_standing_v1.meta.md
--
-- Passage modes were seated in 202606290002 without typical_authorities.
-- required_order in role_call_standing did not include "Passage mode carries".
-- This migration completes both.
--
-- No new tables. No frontend mutation. No FREE repair.

-- ============================================================
-- 1. Add typical_authorities to each passage mode
-- ============================================================

UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    jsonb_set(
      metadata,
      '{role_call_standing,passage_modes,modes,human_touch,typical_authorities}',
      '["lapis_guide","lapis_steward","marble_sealkeeper"]'::jsonb,
      true
    ),
    '{role_call_standing,passage_modes,modes,AI_touch,typical_authorities}',
    '["obsidian_examiner","marble_resolver","marble_cartographer"]'::jsonb,
    true
  ),
  '{role_call_standing,passage_modes,modes,secure_passage,typical_authorities}',
  '["obsidian_gatekeeper","lapis_steward","marble_sealkeeper"]'::jsonb,
  true
),
updated_at = now()
WHERE registry_key = 'measures_registry_root';

-- ============================================================
-- 2. Update required_order to include Passage mode carries
-- ============================================================

UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{role_call_standing,required_order}',
  jsonb_build_array(
    'EncounterBoundary',
    'role_call',
    'Chamber assembles',
    'Role authorizes',
    'Passage mode carries',
    'Passage moves',
    'Renderer manifests',
    'Optics proves'
  ),
  true
),
updated_at = now()
WHERE registry_key = 'measures_registry_root';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
BEGIN

  -- typical_authorities seated on all three modes
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #> '{role_call_standing,passage_modes,modes,human_touch,typical_authorities}'
          @> '["lapis_guide","lapis_steward","marble_sealkeeper"]'::jsonb
      AND metadata #> '{role_call_standing,passage_modes,modes,AI_touch,typical_authorities}'
          @> '["obsidian_examiner","marble_resolver","marble_cartographer"]'::jsonb
      AND metadata #> '{role_call_standing,passage_modes,modes,secure_passage,typical_authorities}'
          @> '["obsidian_gatekeeper","lapis_steward","marble_sealkeeper"]'::jsonb
  ) THEN
    RAISE EXCEPTION 'Validation failed: typical_authorities not seated on all passage modes';
  END IF;

  -- required_order includes Passage mode carries
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #> '{role_call_standing,required_order}'
          @> '["Passage mode carries"]'::jsonb
  ) THEN
    RAISE EXCEPTION 'Validation failed: Passage mode carries not in required_order';
  END IF;

  -- required_order has 8 steps
  IF (
    SELECT jsonb_array_length(metadata #> '{role_call_standing,required_order}')
    FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
  ) != 8 THEN
    RAISE EXCEPTION 'Validation failed: required_order step count is not 8';
  END IF;

  -- passage_modes.rule preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,passage_modes,rule}' = 'passage_modes_are_not_roles'
  ) THEN
    RAISE EXCEPTION 'Validation failed: passage_modes.rule was disturbed';
  END IF;

  -- role_call_standing.rule preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,rule}' = 'chambers_assemble_roles_authorize'
  ) THEN
    RAISE EXCEPTION 'Validation failed: role_call_standing.rule was disturbed';
  END IF;

END $$;
