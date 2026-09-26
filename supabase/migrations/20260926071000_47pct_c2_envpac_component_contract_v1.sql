begin;

-- 4.7% C2 boundary correction:
-- one operative initiative WebPAC (47pct_c1_connect_c3webpac_v1),
-- personal EnvPACs persist My Env state,
-- c3envpac_c2me_v0_1 carries the C2 encounter components,
-- evidence_pac_47pct_v1 is sourced/citeable factual authority.

-- Retire the non-canonical second runtime WebPAC if it exists.
update public.c3_pac
set standing='superseded',
    is_effective=false,
    release_state='held',
    superseded_at=coalesce(superseded_at,now()),
    metadata=metadata||jsonb_build_object(
      'architecture_correction','second_47pct_runtime_webpac_not_canonical',
      'canonical_operative_webpac','47pct_c1_connect_c3webpac_v1',
      'c2_carrier','c3envpac_c2me_v0_1',
      'personal_entry_carrier','participant_personal_envpac',
      'reason','WebPAC is the initiative web surface; C2 encounter is EnvPAC-held state/components resolved from My Env, not a second WebPAC.',
      'corrected_by','op044'
    ),
    updated_at=now()
where pac_key='47pct_c2me_encounter_c3webpac_v1';

update public.c3_pac_relation
set standing='held',
    metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'architecture_correction','source_webpac_superseded_not_canonical',
      'canonical_operative_webpac','47pct_c1_connect_c3webpac_v1',
      'c2_carrier','c3envpac_c2me_v0_1'
    )
where source_pac_key='47pct_c2me_encounter_c3webpac_v1'
   or target_key='47pct_c2me_encounter_c3webpac_v1';

update public.system_process_registry
set process_status='retired',
    status='superseded',
    authority_state='retired_architecture_correction',
    metadata=metadata||jsonb_build_object(
      'architecture_correction','second_47pct_runtime_webpac_not_canonical',
      'canonical_operative_webpac','47pct_c1_connect_c3webpac_v1',
      'c2_carrier','c3envpac_c2me_v0_1',
      'entry_resolves_through_personal_envpac',true
    ),
    updated_at=now()
where process_key='47pct_c2me_encounter_webpac_v1';

-- C1 primitive contract v3: Ledger is not a C1 primitive.
create or replace function public.seed_c1me_envpac_primitives_internal(p_envpac_key text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_envpac public.c3_envpac%rowtype; v_env public.c3_environment%rowtype;
begin
  select * into v_envpac from public.c3_envpac
  where envpac_key=p_envpac_key and is_effective=true and standing='effective';
  if not found then return jsonb_build_object('seeded',false,'reason_code','envpac_not_effective','envpac_key',p_envpac_key); end if;

  select * into v_env from public.c3_environment where env_key=v_envpac.env_key and is_active=true;
  if not found or v_envpac.owner_subject_type<>'individual'
     or v_env.environment_class<>'c3me_individual_environment'
     or v_env.standing<>'c1_connected' then
    return jsonb_build_object('seeded',false,'reason_code','not_persisted_individual_c1me','envpac_key',p_envpac_key);
  end if;

  update public.c3_envpac_runtime_primitive
  set standing='retired',updated_at=now()
  where envpac_key=p_envpac_key
    and primitive_key in ('personalize','ledger')
    and standing<>'retired';

  insert into public.c3_envpac_runtime_primitive
    (binding_key,envpac_key,primitive_key,primitive_class,display_label,renderer_key,runtime_endpoint,sort_order,standing,config)
  values
    (p_envpac_key||':primitive:profile_pac',p_envpac_key,'profile_pac','participant_formable_pac','Profile-PAC','c1me.profile_pac','/api/my-environment-profile',10,'active',
      jsonb_build_object('universal',true,'pac_type','ProfilePAC','contract_key','pac_contract_profilepac_v1','formation_optional',true,'currently_only_participant_formable_content_pac',true,'registry_admission_requires_complete_pac',true,'free_resolved_from_envpac',true,'includes_environment_personalization',true,'presentation_store','c3_envpac_presentation','avatar_required',false)),
    (p_envpac_key||':primitive:canopy',p_envpac_key,'canopy','environment_canopy','Canopy','c1me.canopy','/api/my-environment-canopy',20,'active',
      jsonb_build_object('universal',true,'environment_local',true,'external_surface_references',true,'registry_standing_created',false,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:native_connections',p_envpac_key,'native_connections','c3_native_connections','Connections','c1me.native_connections','/api/my-environment-connections',30,'active',
      jsonb_build_object('universal',true,'environment_local',true,'bilateral_relation_required',true,'thread_message_exchange_supported',true,'registry_object_created',false,'implementation_state','bilateral_relation_projection_live','free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:invite_connection',p_envpac_key,'invite_connection','relational_passage','Invite Connection','c1me.invite_connection','/api/my-environment-invite',40,'active',
      jsonb_build_object('universal',true,'environment_local_origin',true,'personalized_invite',true,'optional_initiative_provenance',true,'acceptance_forms_connection',true,'share_reference_is_provenance_only',true,'registry_object_created_by_invite',false,'implementation_state','bilateral_invite_connection_live','free_resolved_from_envpac',true))
  on conflict (envpac_key,primitive_key) do update
    set primitive_class=excluded.primitive_class,display_label=excluded.display_label,
        renderer_key=excluded.renderer_key,runtime_endpoint=excluded.runtime_endpoint,
        sort_order=excluded.sort_order,standing=excluded.standing,config=excluded.config,updated_at=now();

  update public.c3_envpac set metadata=metadata||jsonb_build_object(
    'runtime_primitive_contract','c1me_env_primitives_v3',
    'runtime_primitive_count',4,
    'ledger_boundary','c2_only',
    'thread_boundary','c1_relational_communication',
    'personalization_composed_into_profile_pac',true,
    'free_runtime_resolution_source','envpac'
  ),updated_at=now() where envpac_key=p_envpac_key;

  return jsonb_build_object('seeded',true,'envpac_key',p_envpac_key,'primitive_contract','c1me_env_primitives_v3','primitive_count',4);
end $;

revoke all on function public.seed_c1me_envpac_primitives_internal(text) from public,anon,authenticated;
grant execute on function public.seed_c1me_envpac_primitives_internal(text) to service_role;

update public.c3_envpac_runtime_primitive
set standing='retired',
    config=coalesce(config,'{}'::jsonb)||jsonb_build_object(
      'boundary_correction','ledger_not_c1_primitive',
      'canonical_environment','c2ME_env',
      'retired_by','op044'
    ),
    updated_at=now()
where primitive_key='ledger' and standing<>'retired';

update public.c3_envpac_runtime_primitive
set sort_order=case primitive_key
      when 'profile_pac' then 10
      when 'canopy' then 20
      when 'native_connections' then 30
      when 'invite_connection' then 40
      else sort_order end,
    config=case
      when primitive_key='native_connections'
        then (config-'ledger_message_exchange_supported')||jsonb_build_object('thread_message_exchange_supported',true)
      else config
    end,
    updated_at=now()
where primitive_key in ('profile_pac','canopy','native_connections','invite_connection') and standing='active';

update public.c3_envpac
set metadata=metadata||jsonb_build_object(
  'runtime_primitive_contract','c1me_env_primitives_v3',
  'runtime_primitive_count',4,
  'ledger_boundary','c2_only',
  'thread_boundary','c1_relational_communication',
  'personalization_composed_into_profile_pac',true
),updated_at=now()
where owner_subject_type='individual'
  and env_key in (
    select env_key from public.c3_environment
    where environment_class='c3me_individual_environment' and is_active=true
  );

update public.system_process_registry
set metadata=metadata||jsonb_build_object(
  'primitive_contract','c1me_env_primitives_v3',
  'primitive_count',4,
  'primitive_keys',jsonb_build_array('profile_pac','canopy','native_connections','invite_connection'),
  'ledger_boundary','c2_only',
  'thread_boundary','c1_relational_communication',
  'personalization_composed_into_profile_pac',true
),updated_at=now()
where process_key='c1me_envpac_primitives_v1';

-- C2 component contract. Evidence_PAC is factual authority; CURRENT is present-state authority.
insert into public.system_process_registry(
  process_key,process_family,process_scope,process_title,process_status,
  authority_level,authority_state,required_oar_type,requires_oar1_closeout,
  requires_operator_confirm,requires_preflight,source_path,source_reference_set,
  status,title,metadata
) values (
  '47pct_c2me_encounter_component_contract_v1',
  'c2me',
  'Registry-backed component contract for the 4.7% participant encounter inside canonical c2ME_env. Components resolve from the C2 EnvPAC; Evidence_PAC is factual authority; CURRENT is present-state authority; no second 4.7% runtime WebPAC is permitted.',
  '4.7% c2ME Encounter Component Contract v1',
  'active','governed','operator_confirmed_registered_runtime_access_pending',
  'oar2',true,true,true,
  'thread:2026-09-26/47pct-c2me-envpac-components',
  jsonb_build_object(
    'envpac_key','c3envpac_c2me_v0_1',
    'initiative_process_key','47pct_c2me_initiative_v1',
    'evidence_pac_key','evidence_pac_47pct_v1',
    'current_environment_key','env_c3_community_contribute'
  ),
  'active','4.7% c2ME Encounter Component Contract v1',
  jsonb_build_object(
    'operator','op044',
    'initiative_key','47pct',
    'envpac_key','c3envpac_c2me_v0_1',
    'canonical_environment','c2ME_env',
    'canonical_operative_webpac','47pct_c1_connect_c3webpac_v1',
    'second_runtime_webpac_allowed',false,
    'evidence_authority','evidence_pac_47pct_v1',
    'current_authority','public.resolve_c3_current(env_c3_community_contribute)',
    'verified_subset_only',true,
    'quantifier_gate','SOURCE_AND_CITATION_REQUIRED',
    'uncited_quantifier_disposition','HOLD',
    'thread_environment','c1_my_env',
    'ledger_environment','c2ME_env',
    'runtime_access_state','HELD_PENDING_MY_ENV_TO_C2_ACCESS_RESOLVER'
  )
)
on conflict (process_key) do update set
  process_scope=excluded.process_scope,process_title=excluded.process_title,
  process_status=excluded.process_status,authority_level=excluded.authority_level,
  authority_state=excluded.authority_state,required_oar_type=excluded.required_oar_type,
  requires_oar1_closeout=excluded.requires_oar1_closeout,
  requires_operator_confirm=excluded.requires_operator_confirm,
  requires_preflight=excluded.requires_preflight,
  source_reference_set=excluded.source_reference_set,status=excluded.status,
  title=excluded.title,metadata=excluded.metadata,updated_at=now();

insert into public.c3_envpac_runtime_component(
  binding_key,envpac_key,context_class,context_key,component_key,renderer_key,sort_order,standing,config
) values
(
  'c3envpac_c2me_v0_1:initiative:47pct:ground_map',
  'c3envpac_c2me_v0_1','initiative','47pct','ground_map','47pct.ground_map',20,'active',
  jsonb_build_object(
    'title','Ground','evidence_pac_key','evidence_pac_47pct_v1',
    'source_process_key','47pct_property_disposition_registry_v1',
    'ground_resolver','resolve_47pct_ground_map_internal',
    'property_resolver','resolve_47pct_property_map_internal',
    'provenance_resolver','resolve_47pct_property_provenance_internal',
    'resource_resolver','resolve_47pct_property_resources_internal',
    'historical_context_resolver','resolve_47pct_property_historical_context_internal',
    'layers',jsonb_build_array('ground','disposition','provenance','resources','historical_context'),
    'map_population_rule','registry_standing_only','verified_subset_only',true,
    'survivor_occurrence_rule','survivor testimony owns occurrence; Registry does not infer abuse location',
    'property_harm_rule','property identity alone never establishes abuse occurrence',
    'frontend_invention_allowed',false
  )
),
(
  'c3envpac_c2me_v0_1:initiative:47pct:money_current',
  'c3envpac_c2me_v0_1','initiative','47pct','money_current','47pct.money_current',30,'active',
  jsonb_build_object(
    'title','Money','evidence_pac_key','evidence_pac_47pct_v1',
    'evidence_process_key','47pct_property_disposition_registry_v1',
    'current_environment_key','env_c3_community_contribute',
    'current_resolver','resolve_c3_current',
    'current_state_key_at_binding','current_env_c3_community_contribute_v11',
    'quantifier_gate','SOURCE_AND_CITATION_REQUIRED',
    'uncited_quantifier_disposition','HOLD',
    'historical_value_rule','label historical',
    'time_sensitive_rule','source date required',
    'derived_value_rule','source inputs and method required',
    'render_axes',jsonb_build_array(
      'recognized_harm','allowed_claim_value','actual_distribution',
      'trust_and_bankruptcy_flow','institutional_assets_and_property','settlement_contribution'
    ),
    'display_principle','money view and geographic map are synchronized but distinct',
    'frontend_static_values_allowed',false
  )
),
(
  'c3envpac_c2me_v0_1:initiative:47pct:evidence',
  'c3envpac_c2me_v0_1','initiative','47pct','evidence','47pct.evidence_matrix',40,'active',
  jsonb_build_object(
    'title','Evidence','evidence_pac_key','evidence_pac_47pct_v1',
    'corpus_state','OPEN_INCOMPLETE','verified_subset_only',true,
    'raw_evidence_public_release_authorized',false,
    'public_oar_reference','47pct_public_oar_c3webpac_v0_1',
    'quantifier_gate','SOURCE_AND_CITATION_REQUIRED',
    'allegation_not_finding_rule',true,'historical_not_current_rule',true,
    'frontend_invention_allowed',false
  )
),
(
  'c3envpac_c2me_v0_1:initiative:47pct:ledger',
  'c3envpac_c2me_v0_1','initiative','47pct','ledger','c2me.ledger',50,'held',
  jsonb_build_object(
    'title','Ledger','environment','c2ME_env','initiative_key','47pct',
    'standing_reason','generic c2 ledger carrier not yet formed; MDM-specific ledger tables must not be reused',
    'thread_is_c1',true,'ledger_is_c2',true,
    'persistence_authorized',false,'frontend_write_authorized',false,
    'next_permitted_transition','form generic C2 initiative ledger carrier bound to participant C2 access relation'
  )
),
(
  'c3envpac_c2me_v0_1:initiative:47pct:eternal_flame',
  'c3envpac_c2me_v0_1','initiative','47pct','eternal_flame','memorial.eternal_flame',60,'active',
  jsonb_build_object(
    'name','Eternal Flame','memorial_key','47pct_eternal_flame_v1',
    'text','For those who were never heard.',
    'text_authority','47pct_c1_connect_c3webpac_v1.public_presentation.memorial_text',
    'authority_effect','none','evidence_pin',false
  )
),
(
  'c3envpac_c2me_v0_1:initiative:47pct:return_my_env',
  'c3envpac_c2me_v0_1','initiative','47pct','return_my_env','environment.return',90,'active',
  jsonb_build_object(
    'title','My Environment','route','https://my.c3field.online/',
    'navigation_changes_standing',false,'requires_owner_session',true
  )
)
on conflict (envpac_key,context_class,context_key,component_key) do update set
  renderer_key=excluded.renderer_key,sort_order=excluded.sort_order,
  standing=excluded.standing,config=excluded.config,updated_at=now();

update public.system_process_registry
set metadata=(metadata-'participant_c2_encounter_webpac')||jsonb_build_object(
      'c2_encounter_component_contract','47pct_c2me_encounter_component_contract_v1',
      'c2_encounter_carrier','c3envpac_c2me_v0_1',
      'evidence_authority','evidence_pac_47pct_v1',
      'canonical_operative_webpac','47pct_c1_connect_c3webpac_v1',
      'entry_resolves_through_personal_envpac',true,
      'second_47pct_runtime_webpac_allowed',false,
      'participant_passage_state','C1_LIVE_PROVEN_C2_ENVPAC_COMPONENTS_SEATED_ACCESS_PENDING'
    ),
    updated_at=now()
where process_key='47pct_c2me_initiative_v1';

commit;
