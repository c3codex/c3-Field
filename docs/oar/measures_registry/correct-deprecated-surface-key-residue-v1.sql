-- OAR2: Audit Deprecated Surface Key Residue in Measures Registry Landing Runtime v1
-- Source: docs/oar/measures_registry/oar2_audit_deprecated_surface_key_residue_in_measures_registry_landing_runtime_v1.meta.md

do $$
declare
  v_before jsonb;
  v_after jsonb;
begin
  select to_jsonb(med.*)
    into v_before
  from public.measures_encounter_def med
  where med.encounter_key = 'eval_passage';

  if v_before is null then
    raise exception 'eval_passage encounter row not found';
  end if;

  update public.measures_encounter_def
  set
    display_title = 'Evaluation Passage',
    metadata =
      (
        metadata
        - 'reconciled_from'
        - 'source_educational_diagnostic_passage'
      )
      || jsonb_build_object(
        'function_layer', 'assessment_passage',
        'state_expression', 'assessment_passage_public',
        'renderer', 'eval_passage',
        'deprecated_trace', coalesce(metadata -> 'deprecated_trace', '{}'::jsonb)
          || jsonb_build_object(
            'reconciled_from', metadata ->> 'reconciled_from',
            'source_educational_diagnostic_passage', metadata ->> 'source_educational_diagnostic_passage',
            'display_title', display_title,
            'function_layer', metadata ->> 'function_layer',
            'state_expression', metadata ->> 'state_expression',
            'renderer', metadata ->> 'renderer',
            'corrected_by_oar2', 'docs/oar/measures_registry/oar2_audit_deprecated_surface_key_residue_in_measures_registry_landing_runtime_v1.meta.md'
          )
      )
      || jsonb_build_object(
        'styling_contract',
        coalesce(metadata -> 'styling_contract', '{}'::jsonb)
          || jsonb_build_object('passage_mode', 'assessment_passage')
      )
      || jsonb_build_object(
        'media_behavior_contract',
        coalesce(metadata -> 'media_behavior_contract', '{}'::jsonb)
          || jsonb_build_object('surface_role', 'assessment_passage_media')
      )
      || jsonb_build_object(
        'encounter_isolation_contract',
        coalesce(metadata -> 'encounter_isolation_contract', '{}'::jsonb)
          || jsonb_build_object('renderer', 'eval_passage')
      ),
    updated_at = now()
  where encounter_key = 'eval_passage';

  select to_jsonb(med.*)
    into v_after
  from public.measures_encounter_def med
  where med.encounter_key = 'eval_passage';

  if v_after ->> 'display_title' <> 'Evaluation Passage' then
    raise exception 'display_title cleanup failed';
  end if;

  if v_after #>> '{metadata,function_layer}' <> 'assessment_passage' then
    raise exception 'function_layer cleanup failed';
  end if;

  if v_after #>> '{metadata,state_expression}' <> 'assessment_passage_public' then
    raise exception 'state_expression cleanup failed';
  end if;

  if v_after #>> '{metadata,renderer}' <> 'eval_passage' then
    raise exception 'renderer cleanup failed';
  end if;

  if (v_after -> 'metadata') ? 'reconciled_from' then
    raise exception 'active reconciled_from residue remains';
  end if;

  if (v_after -> 'metadata') ? 'source_educational_diagnostic_passage' then
    raise exception 'active source_educational_diagnostic_passage residue remains';
  end if;
end $$;
