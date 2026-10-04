
create or replace function public.resolve_c3_env_directory_v2(p_request jsonb)
returns jsonb
language plpgsql
set search_path to 'public','pg_temp'
as $$
declare
  v_env_key text := nullif(btrim(p_request->>'env_key'),'');
  v_envpac_key text := nullif(btrim(p_request->>'envpac_key'),'');
  v_action text := coalesce(nullif(btrim(p_request->>'action'),''),'list');
begin
  if v_env_key is null or v_envpac_key is null then
    return jsonb_build_object('standing','held','reason','environment_context_required');
  end if;

  if not exists (
    select 1
    from public.c3_envpac ep
    join public.c3_environment e on e.env_key=ep.env_key
    where ep.envpac_key=v_envpac_key
      and ep.env_key=v_env_key
      and ep.standing='effective'
      and ep.is_effective=true
      and e.is_active=true
  ) then
    return jsonb_build_object('standing','held','reason','envpac_unresolved');
  end if;

  if v_action <> 'list' then
    return public.resolve_c3_env_directory_v1(p_request);
  end if;

  return jsonb_build_object(
    'standing','resolved',
    'operator_participant_scope',exists(
      select 1
      from public.c3_environment_operator_binding eob
      join public.c3_operator_standing os
        on os.operator_standing_key=eob.operator_standing_key
       and os.standing='active'
      where eob.env_key=v_env_key
        and eob.envpac_key=v_envpac_key
        and eob.binding_standing='active'
        and eob.revoked_at is null
        and eob.operator_role='operator'
    ),
    'contacts',coalesce((
      with contact_rows as (
        select
          c.contact_key::text as contact_key,
          c.normalized_email as email,
          c.display_name,
          c.organization,
          c.phone,
          c.preferred_channel,
          c.source_class,
          c.standing,
          c.metadata,
          c.updated_at,
          1 as source_priority
        from public.c3_env_directory_contact c
        where c.envpac_key=v_envpac_key
          and c.env_key=v_env_key
          and c.standing='active'

        union all

        select
          'participant:'||r.relationship_key as contact_key,
          lower(btrim(r.primary_email)) as email,
          r.display_name,
          coalesce(r.organization,dc.organization) as organization,
          dc.phone,
          coalesce(dc.preferred_channel,'email') as preferred_channel,
          'active_my_env_participant_projection'::text as source_class,
          'active'::text as standing,
          jsonb_build_object(
            'relationship_key',r.relationship_key,
            'participant_env_key',pe.env_key,
            'participant_envpac_key',pep.envpac_key,
            'relationship_standing',r.relationship_standing,
            'registry_authority','c3_environment + c3_envpac + crs_relationship',
            'operator_scope','all_active_my_env_participants',
            'projection_only',true,
            'authority_created',false,
            'relationship_created',false,
            'active_initiatives',coalesce((
              select jsonb_agg(
                jsonb_build_object(
                  'initiative_key',v.initiative_key,
                  'initiative_envpac_key',v.initiative_envpac_key,
                  'visibility_key',v.visibility_key,
                  'visibility_source',v.visibility_source,
                  'visible_at',v.visible_at
                )
                order by v.initiative_key
              )
              from public.c3_env_initiative_visibility v
              where v.relationship_key=r.relationship_key
                and v.standing='active'
                and v.revoked_at is null
            ),'[]'::jsonb)
          ) as metadata,
          greatest(r.updated_at,pe.updated_at,pep.updated_at,dc.updated_at) as updated_at,
          0 as source_priority
        from public.c3_environment_operator_binding eob
        join public.c3_operator_standing os
          on os.operator_standing_key=eob.operator_standing_key
         and os.standing='active'
        join public.c3_environment pe
          on pe.environment_class='c3me_individual_environment'
         and pe.is_active=true
        join public.c3_envpac pep
          on pep.env_key=pe.env_key
         and pep.is_effective=true
         and pep.standing='effective'
         and pep.owner_subject_type='individual'
        join public.crs_relationship r
          on r.relationship_key=pep.owner_subject_key
         and r.is_active=true
         and r.relationship_standing='c1_C1_persisted'
        left join lateral (
          select c2.organization,c2.phone,c2.preferred_channel,c2.updated_at
          from public.c3_env_directory_contact c2
          where c2.env_key=v_env_key
            and c2.envpac_key=v_envpac_key
            and c2.standing='active'
            and c2.normalized_email=lower(btrim(r.primary_email))
          order by c2.updated_at desc
          limit 1
        ) dc on true
        where eob.env_key=v_env_key
          and eob.envpac_key=v_envpac_key
          and eob.binding_standing='active'
          and eob.revoked_at is null
          and eob.operator_role='operator'
          and lower(btrim(coalesce(r.primary_email,''))) <> ''
          and r.relationship_key <> coalesce(eob.metadata->>'crs_owner_relationship','')

        union all

        select
          'initiative:'||v.visibility_key as contact_key,
          lower(btrim(r.primary_email)) as email,
          r.display_name,
          r.organization,
          null::text as phone,
          'email'::text as preferred_channel,
          'initiative_participant_projection'::text as source_class,
          'active'::text as standing,
          jsonb_build_object(
            'relationship_key',r.relationship_key,
            'initiative_key',v.initiative_key,
            'initiative_envpac_key',v.initiative_envpac_key,
            'visibility_key',v.visibility_key,
            'visibility_source',v.visibility_source,
            'initiative_context_label',iob.metadata->>'initiative_context_label',
            'registry_authority','c3_env_initiative_visibility',
            'projection_only',true,
            'authority_created',false,
            'relationship_created',false
          ) as metadata,
          v.visible_at as updated_at,
          2 as source_priority
        from public.c3_environment_operator_binding eob
        join public.c3_initiative_operator_binding iob
          on iob.operator_standing_key=eob.operator_standing_key
         and iob.carrier_binding_key=eob.carrier_binding_key
         and iob.binding_standing='active'
         and iob.revoked_at is null
         and iob.metadata->>'my_env_projection_allowed'='true'
         and iob.metadata->>'my_env_projection_class'='operator'
        join public.c3_env_initiative_visibility v
          on v.initiative_key=iob.initiative_key
         and v.standing='active'
         and v.revoked_at is null
        join public.crs_relationship r
          on r.relationship_key=v.relationship_key
         and r.is_active=true
         and r.relationship_standing='c1_C1_persisted'
        where eob.env_key=v_env_key
          and eob.envpac_key=v_envpac_key
          and eob.binding_standing='active'
          and eob.revoked_at is null
          and lower(btrim(coalesce(r.primary_email,''))) <> ''
          and r.relationship_key <> coalesce(eob.metadata->>'crs_owner_relationship','')
      ),
      deduped as (
        select *,
               row_number() over(
                 partition by email
                 order by source_priority,updated_at desc nulls last,contact_key
               ) as rn
        from contact_rows
      )
      select jsonb_agg(
        jsonb_build_object(
          'contact_key',contact_key,
          'email',email,
          'display_name',display_name,
          'organization',organization,
          'phone',phone,
          'preferred_channel',preferred_channel,
          'source_class',source_class,
          'standing',standing,
          'metadata',metadata,
          'updated_at',updated_at
        )
        order by coalesce(display_name,organization,email)
      )
      from deduped
      where rn=1
    ),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.resolve_c3_env_directory_v2(jsonb) from public,anon,authenticated;
grant execute on function public.resolve_c3_env_directory_v2(jsonb) to service_role;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout
) values (
  'my_env_operator_all_participants_projection_v1',
  'c3_field',
  'My Env Operator All Participants Projection v1',
  'active',
  'registry://my_env/operator/all_participants/v1',
  'operator_binding_required',
  jsonb_build_object(
    'resolver','public.resolve_c3_env_directory_v2(jsonb)',
    'operator_scope','all_active_my_env_participants',
    'participant_authority','active c3me_individual_environment + effective owner EnvPAC + active c1_C1_persisted CRS relationship',
    'operator_self_excluded',true,
    'initiative_membership_required',false,
    'initiative_memberships_attached_as_context',true,
    'ordinary_my_env_visibility_unchanged',true,
    'projection_only',true,
    'creates_standing',false,
    'creates_relationship',false,
    'cancom_context_class','participant'
  ),
  'My Env Operator All Participants Projection v1',
  'Operator-only Directory projection of every active personal My Env participant, independent of initiative membership.',
  'active',
  'operator_private_projection',
  '[]'::jsonb,
  null,false,false,false
)
on conflict (process_key) do update set
  status=excluded.status,
  authority_state=excluded.authority_state,
  metadata=public.system_process_registry.metadata||excluded.metadata,
  process_title=excluded.process_title,
  process_scope=excluded.process_scope,
  process_status=excluded.process_status,
  authority_level=excluded.authority_level,
  updated_at=now();
