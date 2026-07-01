UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_interpretation,scoring_thresholds}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN elem->>'standing_key' IN ('structured_ai_environment_confirmed', 'early_structural_drift')
          THEN jsonb_set(elem, '{standing_key}', '"eval_result_01"')
        WHEN elem->>'standing_key' = 'active_structural_drift'
          THEN jsonb_set(elem, '{standing_key}', '"eval_result_02"')
        WHEN elem->>'standing_key' = 'system_integrity_risk'
          THEN jsonb_set(elem, '{standing_key}', '"eval_result_03"')
        ELSE elem
      END
    )
    FROM jsonb_array_elements(
      metadata->'assessment_interpretation'->'scoring_thresholds'
    ) AS elem
  )
)
WHERE encounter_key = 'measures_assessment';
