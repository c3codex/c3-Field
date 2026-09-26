begin;

do $$
declare r record; d text;
begin
  for r in
    select p.oid
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and p.proname in (
        'resolve_47pct_ground_map_internal',
        'resolve_47pct_property_map_internal',
        'resolve_47pct_property_provenance_internal',
        'resolve_47pct_property_resources_internal',
        'resolve_47pct_property_historical_context_internal'
      )
  loop
    d:=pg_get_functiondef(r.oid);
    d:=replace(
      d,
      'standing=''registered_complete_evidence_bound''',
      'standing in (''registered_complete_evidence_bound'',''registered_evidence_bound_open_corpus'')'
    );
    execute d;
  end loop;
end $$;

update public.c3_initiative_operator_binding
set metadata=metadata||jsonb_build_object(
  'target_environment_key','env_c3_community_contribute',
  'target_environment_label','c2ME_env'
)
where initiative_key='47pct' and binding_standing='active';

update public.c3_env_initiative_visibility
set target_environment_key='env_c3_community_contribute',
    metadata=metadata||jsonb_build_object(
      'target_environment_label','c2ME_env',
      'target_environment_key_canonicalized',true
    )
where initiative_key='47pct'
  and standing='active'
  and revoked_at is null
  and target_environment_key is distinct from 'env_c3_community_contribute';

create or replace function public.apply_47pct_c2_consumer_grant_from_visibility()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_grant_key text;
begin
  if new.initiative_key<>'47pct' then return new; end if;
  v_grant_key:='grant_47pct_c2_'||substr(md5(new.relationship_key),1,24);

  if new.standing='active'
     and new.revoked_at is null
     and new.initiative_envpac_key='c3envpac_c2me_v0_1'
     and new.target_environment_key='env_c3_community_contribute' then
    insert into public.c3_envpac_access_grant(
      grant_key,envpac_key,subject_type,subject_key,relation_role,scope,standing,
      granted_by_type,granted_by_key,expires_at,revoked_at,evidence_ref,metadata
    ) values (
      v_grant_key,new.initiative_envpac_key,'individual',new.relationship_key,'consumer',
      jsonb_build_object(
        'initiative_key','47pct','environment_key','env_c3_community_contribute',
        'rights',jsonb_build_array(
          'inspect_runtime_components','read_verified_evidence','read_current',
          'read_ground_map','read_money_view','write_ledger_when_authorized'
        ),
        'ownership_created',false,'custody_transfer',false,'standing_created',false
      ),
      'active','system','c3_field',null,null,new.visibility_key,
      jsonb_build_object(
        'source','c3_env_initiative_visibility','visibility_key',new.visibility_key,
        'visibility_source',new.visibility_source,'source_personal_env_key',new.env_key,
        'source_personal_envpac_key',new.envpac_key,'initiative_key','47pct',
        'target_environment_key','env_c3_community_contribute',
        'grant_effect','bounded_c2_consumer_access_only'
      )
    )
    on conflict (grant_key) do update
      set envpac_key=excluded.envpac_key,subject_type=excluded.subject_type,
          subject_key=excluded.subject_key,relation_role=excluded.relation_role,
          scope=excluded.scope,standing='active',revoked_at=null,
          evidence_ref=excluded.evidence_ref,metadata=excluded.metadata;
  else
    update public.c3_envpac_access_grant
    set standing='revoked',revoked_at=now(),
        metadata=metadata||jsonb_build_object('revoked_from_visibility',true)
    where grant_key=v_grant_key and standing='active';
  end if;
  return new;
end $$;

revoke all on function public.apply_47pct_c2_consumer_grant_from_visibility() from public,anon,authenticated;
grant execute on function public.apply_47pct_c2_consumer_grant_from_visibility() to service_role;

drop trigger if exists trg_apply_47pct_c2_consumer_grant on public.c3_env_initiative_visibility;
create trigger trg_apply_47pct_c2_consumer_grant
after insert or update of standing,revoked_at,initiative_envpac_key,target_environment_key
on public.c3_env_initiative_visibility
for each row execute function public.apply_47pct_c2_consumer_grant_from_visibility();

insert into public.c3_envpac_access_grant(
  grant_key,envpac_key,subject_type,subject_key,relation_role,scope,standing,
  granted_by_type,granted_by_key,evidence_ref,metadata
)
select
  'grant_47pct_c2_'||substr(md5(v.relationship_key),1,24),
  'c3envpac_c2me_v0_1','individual',v.relationship_key,'consumer',
  jsonb_build_object(
    'initiative_key','47pct','environment_key','env_c3_community_contribute',
    'rights',jsonb_build_array(
      'inspect_runtime_components','read_verified_evidence','read_current',
      'read_ground_map','read_money_view','write_ledger_when_authorized'
    ),
    'ownership_created',false,'custody_transfer',false,'standing_created',false
  ),
  'active','system','c3_field',v.visibility_key,
  jsonb_build_object(
    'source','c3_env_initiative_visibility','visibility_key',v.visibility_key,
    'visibility_source',v.visibility_source,'source_personal_env_key',v.env_key,
    'source_personal_envpac_key',v.envpac_key,'initiative_key','47pct',
    'target_environment_key','env_c3_community_contribute',
    'grant_effect','bounded_c2_consumer_access_only'
  )
from public.c3_env_initiative_visibility v
where v.initiative_key='47pct' and v.standing='active' and v.revoked_at is null
  and v.initiative_envpac_key='c3envpac_c2me_v0_1'
on conflict (grant_key) do update
set standing='active',revoked_at=null,scope=excluded.scope,
    evidence_ref=excluded.evidence_ref,metadata=excluded.metadata;

insert into public.c3_envpac_runtime_component(
  binding_key,envpac_key,context_class,context_key,component_key,renderer_key,sort_order,standing,config
) values (
  'c3envpac_c2me_v0_1:initiative:47pct:encounter_entry',
  'c3envpac_c2me_v0_1','initiative','47pct','encounter_entry','initiative.entry_card',15,'active',
  jsonb_build_object(
    'title','Enter the 4.7% Encounter',
    'summary','Open the C2 environment for Ground, Money, Evidence, and the initiative Ledger when authorized.',
    'target_environment_label','c2ME.env',
    'target_environment_key','env_c3_community_contribute',
    'route','/api/c2-access?initiative=47pct',
    'destination_route','/c2?initiative=47pct',
    'access_exchange_required',true,'access_role','consumer',
    'requires_active_47pct_visibility',true,
    'creates_ownership',false,'creates_c2_standing',false,
    'frontend_invention_allowed',false
  )
)
on conflict (envpac_key,context_class,context_key,component_key) do update
set renderer_key=excluded.renderer_key,sort_order=excluded.sort_order,
    standing=excluded.standing,config=excluded.config,updated_at=now();

update public.system_process_registry
set metadata=metadata||jsonb_build_object(
      'c2_access_model','personal_owner_session + active_47pct_visibility + consumer_grant -> scoped_c2_runtime_session',
      'c2_access_grant_role','consumer',
      'c2_access_grant_envpac','c3envpac_c2me_v0_1',
      'c2_target_environment_key','env_c3_community_contribute',
      'participant_passage_state','C2_ACCESS_GRANT_SEATED_SESSION_EXCHANGE_PENDING_DEPLOY'
    ),
    updated_at=now()
where process_key='47pct_c2me_initiative_v1';

commit;
