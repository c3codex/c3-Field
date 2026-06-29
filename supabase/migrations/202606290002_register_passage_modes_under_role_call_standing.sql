-- Register passage modes under role_call_standing in measures_registry_root.
-- Passage modes are not roles. They describe how an authorized passage is carried.
-- Must be authorized by role_call. A passage mode may not authorize itself.
-- A renderer may not infer a passage mode without role_call.
--
-- No new tables. No frontend mutation. No FREE repair.

UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{role_call_standing,passage_modes}',
  jsonb_build_object(
    'rule', 'passage_modes_are_not_roles',
    'description', 'Passage modes describe how an authorized passage is carried. They do not authorize. role_call authorizes. Passage mode carries.',
    'authorization_rule', 'Passage modes must be authorized by role_call. A passage mode may not authorize itself. A renderer may not infer a passage mode without role_call.',
    'modes', jsonb_build_object(
      'human_touch', jsonb_build_object(
        'mode_key',   'human_touch',
        'description','A passage requiring human participation, affirmation, care, review, or relational handling.'
      ),
      'AI_touch', jsonb_build_object(
        'mode_key',   'AI_touch',
        'description','A passage using AI assistance, synthesis, classification, transformation, or generated support.'
      ),
      'secure_passage', jsonb_build_object(
        'mode_key',   'secure_passage',
        'description','A passage requiring explicit authorization, eligibility, consent, boundary confirmation, or protected handoff before movement.'
      )
    )
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

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,passage_modes,rule}' = 'passage_modes_are_not_roles'
  ) THEN
    RAISE EXCEPTION 'Validation failed: passage_modes not seated under role_call_standing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{role_call_standing,passage_modes,modes,human_touch,mode_key}' = 'human_touch'
      AND metadata #>> '{role_call_standing,passage_modes,modes,AI_touch,mode_key}' = 'AI_touch'
      AND metadata #>> '{role_call_standing,passage_modes,modes,secure_passage,mode_key}' = 'secure_passage'
  ) THEN
    RAISE EXCEPTION 'Validation failed: one or more passage mode keys missing';
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
