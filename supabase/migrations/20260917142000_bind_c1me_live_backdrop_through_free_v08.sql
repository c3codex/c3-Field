-- c1ME.env v0.8: bind the live backdrop through FREE governed media resolution.
-- Runtime/public release remains held pending deployed OAR1 proof.

begin;

update public.c3_envpac_presentation
set opening_visual_asset_key='c3_field_c1me_live_backdrop_v1',
    opening_visual_url='/api/free-media?asset=c3_field_c1me_live_backdrop_v1',
    source_webpac_key='c3field_field_encounter_webpac_v0_8',
    metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'runtime_resolver','FREE',
      'provider_neutral_media_resolution',true,
      'frontend_provider_url_authority',false,
      'webpac_private_repo_custody',true,
      'runtime_release_authorized',false
    ),
    updated_at=now()
where selection_standing='active'
  and source_webpac_key in ('c3field_field_encounter_webpac_v0_7','c3field_field_encounter_webpac_v0_8');

-- Preserve the existing formation function and change only the governed presentation binding.
do $$
declare
  fn text;
begin
  select pg_get_functiondef('public.form_c1_owner_environment(text,text)'::regprocedure) into fn;
  fn:=replace(fn,
    '''c3_field_environment_opening_visual_v1'',
    ''https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c3_tree_env.webp'',',
    '''c3_field_c1me_live_backdrop_v1'',
    ''/api/free-media?asset=c3_field_c1me_live_backdrop_v1'',');
  if position('c3_field_c1me_live_backdrop_v1' in fn)=0 then
    raise exception 'c1me_free_backdrop_function_patch_not_applied';
  end if;
  execute fn;
end $$;

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'free_media_resolver_source_created',true,
      'live_backdrop_envpac_bound',true,
      'dashboard_projection_source_replaced',true,
      'runtime_deployment_proven',false,
      'r2_binding_proven',false,
      'remaining_release_holds',jsonb_build_array(
        'configure_or_confirm_C1ME_ENV_READY_r2_binding',
        'prove_deployed_FREE_resolution_for_both_assets',
        'prove_end_to_end_six_touchpoint_runtime_path'
      )
    ),
    updated_at=now()
where process_key='c1me_six_touchpoint_arrival_encounter_v0_8';

update public.measures_persistence_state
set governed_state=coalesce(governed_state,'{}'::jsonb)||jsonb_build_object(
      'free_media_resolver_source_created',true,
      'live_backdrop_envpac_bound',true,
      'dashboard_projection_source_replaced',true,
      'runtime_release_authorized',false,
      'public_release_authorized',false,
      'deployed_runtime_proof',false
    ),
    evidence=coalesce(evidence,'{}'::jsonb)||jsonb_build_object(
      'free_media_source_path','functions/api/free-media.ts',
      'my_environment_source_path','src/c3_field_connect/MyEnvironmentEncounter.tsx',
      'free_media_source_commit','521fcb03001f168b5de5343fa3710b5bc9c03dc0',
      'environment_projection_commit','47bbd8b08725ab46efb3b39f66f2b19005fd0bc1'
    ),
    next_permitted_transition='deploy_binding_then_oar1_runtime_proof',
    updated_at=now()
where persistence_key='c1me_six_touchpoint_arrival_encounter_v0_8:preflight_elevation';

commit;
