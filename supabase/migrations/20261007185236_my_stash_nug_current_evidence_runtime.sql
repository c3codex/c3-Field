-- Native My_Stash is a read-only decision/projection function. The existing
-- NUG caller atomically appends its private reference event and Current receipt.
-- No new storage subsystem, artifact relocation, or public/standing mutation.
create or replace function public.resolve_c3ops_my_stash_v1(p_input jsonb)
returns jsonb language plpgsql stable security invoker set search_path=''
as $function$
declare
  v_op text; v_req jsonb; v_key text; v_item jsonb; v_asset public.c3ops_asset_record%rowtype;
  v_items jsonb; v_event jsonb; v_seq bigint; v_tags jsonb;
begin
  if jsonb_typeof(p_input) is distinct from 'object'
    or jsonb_typeof(p_input->'request') is distinct from 'object'
    or p_input->>'default_visibility' is distinct from 'private'
    or p_input->>'event_contract' is distinct from 'my_stash_private_reference_v1'
    or not exists(select 1 from public.c3_envpac e join public.c3_current_state c on c.env_key=e.env_key
      where e.envpac_key=p_input->>'envpac_key' and e.env_key=p_input->>'env_key' and e.is_effective
        and e.owner_subject_key=p_input->>'owner_subject_key'
        and c.current_state_key=p_input->>'current_state_key' and c.is_current and c.superseded_at is null)
    or not exists(select 1 from public.c3_envpac_access_grant g where
      g.envpac_key=p_input->>'envpac_key' and g.subject_key=p_input->>'owner_subject_key'
      and g.relation_role='owner' and g.standing='active' and g.revoked_at is null
      and (g.expires_at is null or g.expires_at>now())) then
    return jsonb_build_object('standing','HLD','reason','private_environment_owner_current_unresolved');
  end if;
  v_req:=p_input->'request'; v_op:=v_req->>'action';
  if v_op is null or v_op not in ('retain','list','retrieve','organize','remove','surface_intent')
    or exists(select 1 from jsonb_object_keys(v_req) k where k not in
      ('action','asset_key','reference_key','label','folder','tags','target_surface'))
    or (v_op='list' and v_req-'action'<>'{}'::jsonb)
    or (v_op in ('retrieve','remove') and v_req-array['action','reference_key']<>'{}'::jsonb)
    or (v_op='retain' and v_req-array['action','asset_key','label','folder','tags']<>'{}'::jsonb)
    or (v_op='organize' and v_req-array['action','reference_key','label','folder','tags']<>'{}'::jsonb)
    or (v_op='surface_intent' and v_req-array['action','reference_key','target_surface']<>'{}'::jsonb) then
    return jsonb_build_object('standing','HLD','reason','participant_request_boundary');
  end if;
  if exists(select 1 from jsonb_each(v_req) f where f.key in
    ('asset_key','reference_key','label','folder','target_surface') and
    (jsonb_typeof(f.value)<>'string' or length(f.value #>> '{}')>200 or (f.value #>> '{}') ~ '[\r\n]'))
    or (v_req ? 'tags' and (jsonb_typeof(v_req->'tags') is distinct from 'array')) then
    return jsonb_build_object('standing','HLD','reason','participant_request_shape');
  end if;
  if v_req ? 'tags' then
    v_tags:=v_req->'tags';
    if jsonb_array_length(v_tags)>10 or exists(select 1 from jsonb_array_elements(v_tags) t
      where jsonb_typeof(t)<>'string' or length(t #>> '{}') not between 1 and 80) then
      return jsonb_build_object('standing','HLD','reason','participant_tags_shape');
    end if;
  end if;
  with latest as (
    select distinct on (metadata->'my_stash_event'->>'reference_key') metadata->'my_stash_event' as event
    from public.c3_current_evidence_ref where current_state_key=p_input->>'current_state_key'
      and evidence_class='nug_occurrence' and metadata->>'native_process_key'='c3ops_nug_my_stash_v1'
      and metadata->>'envpac_key'=p_input->>'envpac_key'
      and metadata->>'owner_subject_key'=p_input->>'owner_subject_key'
      and metadata->'my_stash_event'->>'contract'='my_stash_private_reference_v1'
    order by metadata->'my_stash_event'->>'reference_key',
      (metadata->'my_stash_event'->>'sequence')::bigint desc)
  select coalesce(jsonb_agg(event->'item' order by event->'item'->>'folder',event->'item'->>'label'),
    '[]'::jsonb) into v_items from latest where event->>'action'<>'remove';
  if jsonb_array_length(v_items)>200 then
    return jsonb_build_object('standing','HLD','reason','stash_bounded_capacity');
  end if;
  select coalesce(max((metadata->'my_stash_event'->>'sequence')::bigint),0)+1 into v_seq
    from public.c3_current_evidence_ref where current_state_key=p_input->>'current_state_key'
      and metadata->>'native_process_key'='c3ops_nug_my_stash_v1'
      and metadata->>'envpac_key'=p_input->>'envpac_key'
      and metadata->>'owner_subject_key'=p_input->>'owner_subject_key'
      and metadata->'my_stash_event'->>'contract'='my_stash_private_reference_v1';
  if v_op='retain' then
    v_key:=nullif(btrim(v_req->>'asset_key'),'');
    select * into v_asset from public.c3ops_asset_record where asset_key=v_key;
    if not found or v_asset.hash_algorithm is distinct from 'sha256'
      or coalesce(v_asset.content_hash,'') !~ '^[0-9a-f]{64}$' or coalesce(v_asset.byte_size,0)<=0
      or nullif(btrim(v_asset.authoritative_custody_type),'') is null
      or nullif(btrim(v_asset.authoritative_custody_provider),'') is null
      or nullif(btrim(v_asset.authoritative_custody_identifier),'') is null
      or nullif(btrim(v_asset.authoritative_custody_location),'') is null
      or nullif(btrim(v_asset.standing),'') is null then
      return jsonb_build_object('standing','HLD','reason','registered_artifact_custody_integrity_unresolved');
    end if;
    if v_asset.custody_controller is distinct from p_input->>'owner_subject_key'
      and v_asset.rights_holder is distinct from p_input->>'owner_subject_key'
      and v_asset.public_retrieval_standing is distinct from 'public_runtime_derivative' then
      return jsonb_build_object('standing','HLD','reason','artifact_reference_access_unresolved');
    end if;
    select item into v_item from jsonb_array_elements(v_items) item where item->>'reference_key'=v_key;
    if v_item is null then
      if jsonb_array_length(v_items)>=200 then
        return jsonb_build_object('standing','HLD','reason','stash_bounded_capacity');
      end if;
      v_item:=jsonb_build_object('reference_key',v_key,'asset_key',v_key,
        'label',coalesce(v_req->>'label',v_asset.title,v_key),'folder',coalesce(v_req->>'folder',''),
        'tags',coalesce(v_tags,'[]'::jsonb),'visibility','private','artifact_snapshot',to_jsonb(v_asset),
        'custody_transferred',false,'ownership_transferred',false);
      v_event:=jsonb_build_object('contract','my_stash_private_reference_v1','sequence',v_seq,
        'action','retain','reference_key',v_key,'item',v_item);
    end if;
  elsif v_op in ('retrieve','organize','remove','surface_intent') then
    v_key:=nullif(btrim(v_req->>'reference_key'),'');
    select item into v_item from jsonb_array_elements(v_items) item where item->>'reference_key'=v_key;
    if v_item is null then return jsonb_build_object('standing','HLD','reason','private_reference_unavailable'); end if;
    if v_op='organize' then
      if v_req ? 'label' then v_item:=v_item||jsonb_build_object('label',v_req->>'label'); end if;
      if v_req ? 'folder' then v_item:=v_item||jsonb_build_object('folder',v_req->>'folder'); end if;
      if v_req ? 'tags' then v_item:=v_item||jsonb_build_object('tags',v_tags); end if;
    elsif v_op='surface_intent' then
      if nullif(btrim(v_req->>'target_surface'),'') is null then
        return jsonb_build_object('standing','HLD','reason','explicit_target_surface_required');
      end if;
      v_item:=v_item||jsonb_build_object('selective_surface_intent',jsonb_build_object(
        'target_surface',v_req->>'target_surface','standing','awaiting_next_governed_boundary',
        'publication_authorized',false,'pac_created',false));
    end if;
    if v_op<>'retrieve' then v_event:=jsonb_build_object('contract','my_stash_private_reference_v1',
      'sequence',v_seq,'action',v_op,'reference_key',v_key,'item',v_item); end if;
  end if;
  return jsonb_build_object('standing','my_stash_resolved','action',v_op,'item',v_item,
    'items',case when v_op='list' then v_items else null end,'my_stash_event',v_event,
    'idempotent_retention',v_op='retain' and v_event is null,'visibility','private',
    'next_boundary',case when v_op='surface_intent' then 'separate_governed_surface_authority_required' else null end,
    'artifact_custody_changed',false,'ownership_transferred',false,'standing_created',false,
    'publication_created',false,'external_effects',0);
end;
$function$;
revoke all on function public.resolve_c3ops_my_stash_v1(jsonb) from public,anon,authenticated;
grant execute on function public.resolve_c3ops_my_stash_v1(jsonb) to service_role;

-- Preserve the existing NUG preflight, effect guard, locks and return rails.
CREATE OR REPLACE FUNCTION public.call_c3ops_nug_native_v1(p_request jsonb, p_occurrence_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare v_resolution jsonb; v_b public.c3ops_nug_binding%rowtype; v_result jsonb; v_hash text; v_fn text; v_occurrence jsonb; v_input jsonb; v_is_stash boolean; v_metadata jsonb;
begin
  if nullif(btrim(p_occurrence_key),'') is null then
    return jsonb_build_object('standing','HLD','reason','occurrence_key_missing'); end if;
  -- Serialize replay for the exact occurrence before invoking the native function.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_occurrence_key,0));
  if exists(select 1 from public.c3ops_nug_occurrence where occurrence_key=p_occurrence_key)
    or exists(select 1 from public.c3ops_nug_effect_passage where occurrence_key=p_occurrence_key) then
    return jsonb_build_object('standing','HLD','reason','occurrence_already_returned'); end if;
  select * into v_b from public.c3ops_nug_binding where nug_key=p_request->>'nug_key' for share;
  v_resolution := public.resolve_c3ops_nug_v1(p_request);
  if v_resolution->>'standing' is distinct from 'resolved_for_nug' then return v_resolution; end if;
  if v_b.spec->>'adapter_class' is distinct from 'direct_native' or v_b.spec->>'effect_class' is distinct from 'none' then
    return jsonb_build_object('standing','HLD','reason','bounded_effect_caller_required'); end if;
  perform 1 from public.c3_current_state where current_state_key=v_b.spec->>'current_state_key' for share;
  perform 1 from public.c3_envpac_capability_grant where capability_key=v_b.spec->>'capability_ref' for share;
  perform 1 from public.system_oar_queue where oar_key=v_b.spec->>'authority_oar_key'
    and scope_key=v_b.spec->>'execution_instance' for share;
  perform 1 from public.c3ops_cancom_context_binding where binding_key=v_b.spec->>'context_binding_key' for share;
  v_resolution := public.resolve_c3ops_nug_v1(p_request);
  if v_resolution->>'standing' is distinct from 'resolved_for_nug' then return v_resolution; end if;
  v_is_stash := v_b.spec->>'native_process_key'='c3ops_nug_my_stash_v1'
    and v_b.spec->>'native_function_ref'='public.resolve_c3ops_my_stash_v1(jsonb)';
  v_input := v_b.spec->'native_input';
  if v_is_stash then
    -- The queue authorizes private reference bookkeeping, never provider effects.
    if not exists(select 1 from public.c3_envpac_capability_grant where
        capability_key=v_b.spec->>'capability_ref' and scope->'db_mutation_authorized'='true'::jsonb)
      or not exists(select 1 from public.system_oar_queue where
        scope_key=v_b.spec->>'execution_instance' and automation_permissions->'db_mutation'='true'::jsonb)
      or jsonb_typeof(p_request->'participant_input') is distinct from 'object' then
      return jsonb_build_object('standing','HLD','reason','private_reference_mutation_authority_required');
    end if;
    -- Serialize the existing Current evidence stream before projecting its next event.
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
      'my_stash|'||(v_input->>'envpac_key')||'|'||(v_input->>'owner_subject_key'),0));
    v_input := v_input || jsonb_build_object('request',p_request->'participant_input');
  elsif p_request ? 'participant_input' then
    return jsonb_build_object('standing','HLD','reason','participant_input_not_admitted');
  end if;
  v_fn := split_part(split_part(v_b.spec->>'native_function_ref','(',1),'.',2);
  execute format('select public.%I($1)',v_fn) into v_result using v_input;
  if jsonb_typeof(v_result) is distinct from 'object'
    or v_result->>'standing' is distinct from v_b.spec->>'native_result_standing' then
    if v_is_stash and v_result->>'standing'='HLD' then return v_result; end if;
    return jsonb_build_object('standing','HLD','reason','native_function_held'); end if;
  v_hash := encode(extensions.digest(v_result::text,'sha256'),'hex');
  insert into public.c3ops_nug_occurrence(occurrence_key,nug_key,execution_instance,current_state_key,
    resolution,result_sha256,result_standing,effect_class)
    values(p_occurrence_key,v_b.nug_key,p_request->>'execution_instance',p_request->>'current_state_key',
      v_resolution,v_hash,v_result->>'standing','none')
    returning to_jsonb(c3ops_nug_occurrence.*) into v_occurrence;
  v_metadata := jsonb_build_object('nug_key',v_b.nug_key,
    'effect_class','none','serialization_basis','postgres_jsonb_text_utf8_sha256',
    'current_reresolution_required',true,'custody_transferred',false);
  if v_is_stash then
    v_metadata := v_metadata || jsonb_build_object('native_process_key','c3ops_nug_my_stash_v1',
      'envpac_key',v_input->>'envpac_key','owner_subject_key',v_input->>'owner_subject_key',
      'default_visibility','private','my_stash_event',v_result->'my_stash_event',
      'native_result',v_result,'native_result_sha256',v_hash);
  end if;
  insert into public.c3_current_evidence_ref(current_evidence_ref_key,current_state_key,evidence_key,evidence_class,
    content_hash,hash_algorithm,authoritative_custody_type,authoritative_custody_provider,
    authoritative_custody_identifier,authoritative_custody_location,evidence_standing,source_execution_instance_id,metadata,attested_by)
    values('nug:'||p_occurrence_key,p_request->>'current_state_key',p_occurrence_key,'nug_occurrence',
      encode(extensions.digest(v_occurrence::text,'sha256'),'hex'),'sha256','registry','supabase',p_occurrence_key,'registry://c3ops_nug_occurrence/'||p_occurrence_key,
      'observed',p_request->>'execution_instance',v_metadata,p_request->>'executor_ref');
  return jsonb_build_object('standing','occurrence_returned','occurrence_key',p_occurrence_key,
    'current_state_key',p_request->>'current_state_key','evidence_return_relation',v_b.spec->>'evidence_return_relation',
    'current_reresolution_required',true,'external_effects',0,'custody_transferred',false,'result',v_result);
end;
$function$
