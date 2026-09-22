-- FREE environmental steering: read-only public route resolution, not a new encounter.
-- Server calls with service-role credentials after deriving a registered route.
-- No UI or user-supplied CURRENT/env identifier may select another environment.
create or replace function public.free_resolve_public_environment_steering(p_route text)
returns jsonb
language plpgsql
security invoker
set search_path=public,pg_temp
as $$
declare
 v_env public.c3_environment%rowtype;
 v_count integer;
 v_current public.c3_current_state%rowtype;
 v_current_count integer;
 v_evidence_count integer;
 v_source_count integer;
 v_public text;
begin
 if p_route is null or p_route not in ('/', '/connect') then
   return jsonb_build_object('steering','held','reason_code','route_not_registered',
     'render_permitted',false,'encounter_created',false);
 end if;
 -- /connect is an explicit alias of the registered root entry, not an arbitrary
 -- environment key or an inferred fallback to another environment.
 select count(*),min(env_key) into v_count,v_public
 from public.c3_environment
 where system_key='c3_field' and environment_class='c1_connect_environment'
   and is_active=true and is_canonical=true
   and metadata->>'public_route'='/';
 if v_count<>1 then
   return jsonb_build_object('steering','held','reason_code','public_environment_unresolved',
     'render_permitted',false,'encounter_created',false);
 end if;
 select * into v_env from public.c3_environment where env_key=v_public;
 -- Ensure the exact registered architectural source contracts remain persisted.
 select count(*) into v_source_count from public.codex_source_reference
 where source_key in (
 'c3_current_driven_encounter_resolution_architecture_v0_1',
 'c3field_current_environment_isolation_invariant_v0_1')
 and source_status='committed' and readonly=true and source_hash is not null;
 if v_source_count<>2 then
   return jsonb_build_object('steering','held','reason_code','steering_source_not_registered',
     'render_permitted',false,'encounter_created',false);
 end if;
 select count(*),min(current_state_key) into v_current_count,v_public
 from public.c3_current_state where env_key=v_env.env_key and is_current=true
 and effective_at<=now() and superseded_at is null;
 if v_current_count<>1 then
   return jsonb_build_object('steering','held','reason_code','current_unresolved',
     'render_permitted',false,'encounter_created',false);
 end if;
 select * into v_current from public.c3_current_state
 where current_state_key=v_public and env_key=v_env.env_key
 and is_current=true and superseded_at is null;
 if not found or v_current.env_key<>v_env.env_key then
   return jsonb_build_object('steering','held','reason_code','current_environment_mismatch',
     'render_permitted',false,'encounter_created',false);
 end if;
 select count(*) into v_evidence_count from public.c3_current_evidence_ref
 where current_state_key=v_current.current_state_key
 and evidence_standing in ('registered','attested','accepted','effective');
 if v_evidence_count<1 then
   return jsonb_build_object('steering','held','reason_code','current_evidence_unresolved',
     'render_permitted',false,'encounter_created',false);
 end if;
 -- Public recognition is not public-release authority. Do not disclose the
 -- held environment's identity or relations to unauthenticated callers.
 if coalesce(v_env.metadata->>'public_release_state','held')<>'released'
    or coalesce(v_env.metadata->>'runtime_activation_state','held')<>'active' then
   return jsonb_build_object('steering','held','reason_code','public_projection_not_released',
     'render_permitted',false,'encounter_created',false);
 end if;
 -- Separate public-relation projection is not yet registered. A valid CURRENT
 -- cannot by itself make relational content or a restricted encounter available.
 return jsonb_build_object('steering','environment_resolved',
    'environment_key',v_env.env_key,'current_key',v_current.current_state_key,
    'relation_projection','held_pending_registered_public_projection',
    'public_relations','[]'::jsonb,
    'render_permitted',false,'encounter_created',false);
end;$$;
revoke all on function public.free_resolve_public_environment_steering(text)
 from public,anon,authenticated;
grant execute on function public.free_resolve_public_environment_steering(text) to service_role;
