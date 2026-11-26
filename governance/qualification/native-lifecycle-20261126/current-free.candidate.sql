-- UNINSTALLED. Existing owner FREE function; read-only My Stash availability, no effects.
CREATE OR REPLACE FUNCTION public.free_resolve_my_env_current_state_v1(p_session_sha256 text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  with owner_context as (
    select ep.envpac_key, ep.env_key, ep.owner_subject_key
    from public.c3_env_runtime_session s
    join public.c3_envpac ep
      on ep.envpac_key = s.envpac_key and ep.env_key = s.env_key
      and ep.owner_subject_type = s.subject_type and ep.owner_subject_key = s.subject_key
    join public.c3_environment e on e.env_key = ep.env_key and e.is_active
    where s.token_sha256 = p_session_sha256
      and s.standing = 'active' and s.revoked_at is null and s.expires_at > now()
      and ep.is_effective and ep.superseded_at is null and ep.effective_at <= now()
      and exists (
        select 1 from public.c3_envpac_access_grant g
        where g.envpac_key = ep.envpac_key
          and g.subject_type = s.subject_type and g.subject_key = s.subject_key
          and g.relation_role = 'owner' and g.standing = 'active'
          and g.revoked_at is null and (g.expires_at is null or g.expires_at > now())
      )
  ), available_nugs as (
    -- Read existing registered binding and CURRENT. Never invoke a service or create authority.
    select o.envpac_key, jsonb_agg(jsonb_build_object(
      'nug_key', b.nug_key, 'service', 'My Stash', 'effect_class', 'none',
      'current_state_key', c.current_state_key)) as descriptors
    from owner_context o
    join public.c3_current_state c on c.env_key=o.env_key
      and c.is_current and c.superseded_at is null
    join public.c3ops_nug_binding b on b.standing='active'
      and b.spec->>'envpac_key'=o.envpac_key and b.spec->>'env_key'=o.env_key
      and b.spec->>'current_state_key'=c.current_state_key
      and b.spec->>'native_process_key'='c3ops_nug_my_stash_v1'
      and b.spec->>'native_function_ref'='public.resolve_c3ops_my_stash_v1(jsonb)'
      and b.spec->>'effect_class'='none' and b.spec->>'adapter_class'='direct_native'
      and b.spec->'native_input'->>'owner_subject_key'=o.owner_subject_key
      and b.spec->'native_input'->>'envpac_key'=o.envpac_key
      and b.spec->'native_input'->>'env_key'=o.env_key
      and b.spec->'native_input'->>'current_state_key'=c.current_state_key
      and b.spec->'native_input'->>'default_visibility'='private'
      and b.spec->'native_input'->>'event_contract'='my_stash_private_reference_v1'
    where public.resolve_c3ops_nug_v1(b.spec||jsonb_build_object('nug_key',b.nug_key))->>'standing'='resolved_for_nug'
    group by o.envpac_key
  ), resolved as (
    select o.envpac_key, w.pac_key as webpac_key, d.pac_key as designpac_key,
           f.free_snapshot_key, f.projection_sha256, f.projection
    from owner_context o
    join public.c3_envpac_presentation e on e.envpac_key = o.envpac_key
      and e.selection_standing = 'active'
    join public.c3_pac w on w.pac_key = e.source_webpac_key and w.envpac_key = o.envpac_key
      and w.pac_type = 'c3WebPac' and w.is_effective and w.superseded_at is null
      and ((w.release_state = 'private' and w.effective_at <= now()) or (
        (w.effective_at is null or w.effective_at <= now())
        and w.pac_key = 'c3webpac_person_eea672f5a7676dad4316755b_v0_1' and o.envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
        and o.env_key = 'env_person_eea672f5a7676dad4316755b'
        and w.registration_protocol = 'legacy_pre_hardening'
        and w.standing = 'elevated_private_repo_custody_runtime_release_held'
        and exists (
          select 1 from public.measures_persistence_state r
          where r.persistence_key = 'current_state_reconciliation_production_20261120_001:release:personal_webpac_v1'
            and r.oar2_key = 'oar2_current_state_reconciliation_production_20261120_001'
            and r.environment_key = o.env_key and r.object_key = w.pac_key
            and r.object_type = 'owner_private_webpac_presentation_release'
            and r.standing = 'private_presentation_effective'
            and r.source_sha256 = '41d2621a92cc2065fa45c19d54330508de8807ea620c394ccee1e3639e35db39'
            and r.governed_state->>'envpac_key' = o.envpac_key
            and r.governed_state->>'design_registration_sha256' = e.metadata->>'design_registration_sha256'
            and r.governed_state->>'design_pac_key' = e.metadata->>'design_pac_key'
        )
      ))
    join public.c3_pac d on d.pac_key = e.metadata->>'design_pac_key'
      and d.registration_sha256 = e.metadata->>'design_registration_sha256'
      and d.pac_type = 'DesignPac' and d.schema_key = 'pac_schema_designpac_v1_1'
      and d.is_effective and d.superseded_at is null and d.effective_at <= now()
      and d.release_state = 'private' and d.authority_effect = 'none'
    join public.c3_pac_schema ds on ds.schema_key = d.schema_key
      and ds.pac_type = d.pac_type and ds.is_active and ds.standing = 'active'
    join public.c3_free_pac_snapshot f on f.pac_key = d.pac_key
      and f.schema_key = d.schema_key and f.registration_sha256 = d.registration_sha256
      and f.registrar_role_call_key = d.registrar_role_call_key
      and f.standing = 'active' and f.superseded_at is null
      and f.free_call_key = 'my_env_current_state_owner_presentation'
      and f.surface_type = 'my_env' and f.encounter_key = 'my_env_current_state'
      and f.selector_type = 'encounter' and f.selector_value = 'my_env_current_state'
    join public.c3_free_call c on c.free_call_key = f.free_call_key
      and c.call_class = 'environment_projection' and c.surface_class = 'my_env'
      and c.standing = 'active' and c.requires_pac_snapshot and c.requires_projection
    where f.projection_sha256 = encode(extensions.digest(convert_to(f.projection::text, 'UTF8'), 'sha256'), 'hex')
      and exists (
        select 1 from public.c3_pac_encounter_scope s
        where s.pac_key = d.pac_key and s.free_call_key = f.free_call_key
          and s.surface_type = f.surface_type and s.encounter_key = f.encounter_key
          and s.selector_type = f.selector_type and s.selector_value = f.selector_value
          and s.standing = 'active'
      )
  )
  select case count(*) when 1 then (jsonb_agg(jsonb_build_object(
    'standing', 'ACT', 'authority_effect', 'none',
    'envpac_key', envpac_key, 'webpac_key', webpac_key, 'designpac_key', designpac_key,
    'free_snapshot_key', free_snapshot_key, 'projection_sha256', projection_sha256,
    'projection', projection,
    'available_nugs', coalesce((select a.descriptors from available_nugs a where a.envpac_key=resolved.envpac_key),'[]'::jsonb)
  ))->0) else jsonb_build_object('standing', 'DNR', 'authority_effect', 'none') end
  from resolved;
$function$
