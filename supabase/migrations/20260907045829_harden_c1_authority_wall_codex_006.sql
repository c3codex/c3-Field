-- OAR2 006: bounded c1 authority hardening. No table, grant, RLS or Current change.
do $guard$
begin
  if (select pg_get_functiondef(p.oid) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='capture_relational_candidate') is distinct from $before$CREATE OR REPLACE FUNCTION public.capture_relational_candidate(p_env_key text, p_encounter_key text, p_primary_email text, p_display_name text DEFAULT NULL::text, p_organization text DEFAULT NULL::text, p_consent_scope text DEFAULT 'c1_connect_relationship'::text, p_consent_granted boolean DEFAULT false, p_accuracy_attested boolean DEFAULT false, p_participation_intended boolean DEFAULT false, p_evidence_ref text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_env public.c3_environment%rowtype;
  v_registry public.measures_registry%rowtype;
  v_relationship_key text;
  v_consent_key text;
  v_event_key text;
  v_email text;
  v_now timestamptz := now();
begin
  v_email := lower(btrim(coalesce(p_primary_email, '')));

  if v_email = '' or position('@' in v_email) < 2 then
    raise exception 'invalid_primary_email' using errcode = '22023';
  end if;

  if btrim(coalesce(p_env_key, '')) = '' or btrim(coalesce(p_encounter_key, '')) = '' then
    raise exception 'env_key_and_encounter_key_required' using errcode = '22023';
  end if;

  if not p_consent_granted then
    raise exception 'explicit_consent_required' using errcode = '22023';
  end if;

  if not p_accuracy_attested then
    raise exception 'accuracy_attestation_required' using errcode = '22023';
  end if;

  if not p_participation_intended then
    raise exception 'participation_intention_required' using errcode = '22023';
  end if;

  select * into v_env
  from public.c3_environment
  where env_key = p_env_key
    and is_active = true
    and is_canonical = true
  limit 1;

  if not found then
    raise exception 'canonical_active_environment_not_found' using errcode = '22023';
  end if;

  if coalesce(v_env.environment_class, '') not like 'c1_%' then
    raise exception 'environment_not_eligible_for_c1_relational_capture' using errcode = '22023';
  end if;

  select * into v_registry
  from public.measures_registry
  where is_active = true
    and metadata ->> 'env_key' = p_env_key
    and encounter_type = 'c1_connect'
  order by updated_at desc
  limit 1;

  if not found then
    raise exception 'registered_c1_connect_encounter_not_found' using errcode = '22023';
  end if;

  select relationship_key into v_relationship_key
  from public.crs_relationship
  where lower(btrim(primary_email)) = v_email
  limit 1;

  if v_relationship_key is null then
    v_relationship_key := 'crs_' || replace(gen_random_uuid()::text, '-', '');

    insert into public.crs_relationship (
      relationship_key,
      primary_email,
      display_name,
      organization,
      relationship_standing,
      source_encounter,
      is_test_relationship,
      is_active,
      metadata
    ) values (
      v_relationship_key,
      v_email,
      nullif(btrim(coalesce(p_display_name, '')), ''),
      nullif(btrim(coalesce(p_organization, '')), ''),
      'candidate_unverified',
      p_encounter_key,
      false,
      true,
      jsonb_strip_nulls(coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
        'env_key', p_env_key,
        'registry_key', v_registry.registry_key,
        'capture_contract', 'capture_relational_candidate_v1',
        'standing_authority', 'none',
        'captured_at', v_now
      ))
    );
  else
    update public.crs_relationship
    set display_name = coalesce(nullif(btrim(coalesce(p_display_name, '')), ''), display_name),
        organization = coalesce(nullif(btrim(coalesce(p_organization, '')), ''), organization),
        source_encounter = p_encounter_key,
        metadata = metadata || jsonb_strip_nulls(coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
          'env_key', p_env_key,
          'registry_key', v_registry.registry_key,
          'last_capture_contract', 'capture_relational_candidate_v1',
          'last_captured_at', v_now
        )),
        updated_at = v_now
    where relationship_key = v_relationship_key;
  end if;

  v_consent_key := 'consent_' || replace(gen_random_uuid()::text, '-', '');
  insert into public.crs_consent (
    consent_key,
    relationship_key,
    consent_scope,
    consent_state,
    consent_source,
    evidence_ref,
    granted_at,
    metadata
  ) values (
    v_consent_key,
    v_relationship_key,
    p_consent_scope,
    'granted',
    p_encounter_key,
    p_evidence_ref,
    v_now,
    jsonb_build_object(
      'env_key', p_env_key,
      'accuracy_attested', true,
      'participation_intended', true,
      'standing_effect', 'none',
      'capture_contract', 'capture_relational_candidate_v1'
    )
  );

  v_event_key := 'event_' || replace(gen_random_uuid()::text, '-', '');
  insert into public.crs_relationship_event (
    event_key,
    relationship_key,
    event_type,
    source_system,
    source_record_type,
    source_record_ref,
    event_standing,
    next_permitted_encounter,
    metadata
  ) values (
    v_event_key,
    v_relationship_key,
    'candidate_captured',
    v_env.system_key,
    'c1_connect_encounter',
    p_evidence_ref,
    'candidate_evidence_only',
    'contact_verification',
    jsonb_build_object(
      'env_key', p_env_key,
      'encounter_key', p_encounter_key,
      'registry_key', v_registry.registry_key,
      'standing_effect', 'none',
      'current_effect', 'none',
      'persistence_effect', 'none',
      'capture_contract', 'capture_relational_candidate_v1'
    )
  );

  return jsonb_build_object(
    'accepted', true,
    'relationship_key', v_relationship_key,
    'consent_key', v_consent_key,
    'event_key', v_event_key,
    'relationship_standing', 'candidate_unverified',
    'event_standing', 'candidate_evidence_only',
    'next_permitted_encounter', 'contact_verification',
    'standing_created', false,
    'current_created', false,
    'persistence_created', false
  );
end;
$function$
$before$ then raise exception 'OAR006_preflight_definition_drift_capture_relational_candidate'; end if;
  if (select pg_get_functiondef(p.oid) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='evaluate_relational_car') is distinct from $before$CREATE OR REPLACE FUNCTION public.evaluate_relational_car(p_relationship_key text, p_env_key text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_env public.c3_environment%rowtype;
  v_now timestamptz := now();
  v_event_key text;
  v_verified_event text;
  v_consent_key text;
  v_foundation_ok boolean := false;
  v_seam_ok boolean := false;
  v_custody jsonb;
begin
  if btrim(coalesce(p_relationship_key,'')) = '' or btrim(coalesce(p_env_key,'')) = '' then
    raise exception 'relationship_key_and_env_key_required' using errcode='22023';
  end if;

  select * into v_rel
  from public.crs_relationship
  where relationship_key = p_relationship_key
    and is_active = true
  limit 1
  for update;

  if not found then
    raise exception 'active_relationship_not_found' using errcode='22023';
  end if;

  if v_rel.relationship_standing <> 'candidate_contact_verified' then
    raise exception 'relationship_not_eligible_for_car_review' using errcode='22023';
  end if;

  if coalesce(v_rel.metadata->>'env_key','') <> p_env_key then
    raise exception 'environment_binding_mismatch' using errcode='22023';
  end if;

  select * into v_env
  from public.c3_environment
  where env_key = p_env_key
    and is_active = true
    and is_canonical = true
  limit 1;

  if not found or coalesce(v_env.environment_class,'') not like 'c1_%' then
    raise exception 'canonical_c1_environment_not_found' using errcode='22023';
  end if;

  select event_key into v_verified_event
  from public.crs_relationship_event
  where relationship_key = p_relationship_key
    and event_type = 'contact_verification_succeeded'
    and event_standing = 'candidate_contact_verified'
    and metadata->>'env_key' = p_env_key
  order by occurred_at desc, created_at desc
  limit 1;

  if v_verified_event is null then
    raise exception 'verified_contact_evidence_required' using errcode='22023';
  end if;

  select consent_key into v_consent_key
  from public.crs_consent
  where relationship_key = p_relationship_key
    and consent_state = 'granted'
  order by granted_at desc nulls last, created_at desc
  limit 1;

  if v_consent_key is null then
    raise exception 'active_consent_evidence_required' using errcode='22023';
  end if;

  select exists(
    select 1 from public.system_process_registry
    where process_key='individual_ownership_custody_founding_principle_v1'
      and authority_state='operator_confirmed_registered'
      and process_status='active'
  ) into v_foundation_ok;

  select exists(
    select 1 from public.system_process_registry
    where process_key='individual_authority_custody_continuity_seam_weld_v1'
      and authority_state='operator_confirmed_registered'
      and process_status='active'
  ) into v_seam_ok;

  if not v_foundation_ok or not v_seam_ok then
    raise exception 'car_governance_authority_not_active' using errcode='P0001';
  end if;

  v_custody := jsonb_build_object(
    'relationship_record_custody','registry',
    'participant_authority','individual',
    'consent_authority','individual',
    'credential_custody','individual',
    'wallet_custody','not_applicable_at_c1',
    'asset_custody','not_applicable_at_c1',
    'persistence_custody','registry',
    'continuity_state','intact',
    'lineage_preserved',true
  );

  v_event_key := 'event_' || replace(gen_random_uuid()::text,'-','');

  insert into public.crs_relationship_event(
    event_key, relationship_key, event_type, source_system, source_record_type,
    source_record_ref, event_standing, next_permitted_encounter, metadata
  ) values (
    v_event_key, p_relationship_key, 'registry_car_determined',
    coalesce(v_env.system_key,'c3_field'), 'registry_car_determination', p_relationship_key,
    'car_passed_candidate', 'boundary',
    jsonb_strip_nulls(coalesce(p_metadata,'{}'::jsonb) || jsonb_build_object(
      'env_key',p_env_key,
      'car_contract','evaluate_relational_car_v1',
      'car_state','pass',
      'determination_set',v_custody,
      'verified_contact_event',v_verified_event,
      'consent_key',v_consent_key,
      'founding_principle','individual_ownership_custody_founding_principle_v1',
      'seam_weld','individual_authority_custody_continuity_seam_weld_v1',
      'standing_effect','candidate_state_only',
      'current_effect','none',
      'persistence_effect','none',
      'boundary_effect','none',
      'registration_effect','none',
      'determined_at',v_now
    ))
  );

  update public.crs_relationship
  set relationship_standing='car_passed_candidate',
      metadata = metadata || jsonb_build_object(
        'registry_car',jsonb_build_object(
          'car_state','pass',
          'event_key',v_event_key,
          'determination_set',v_custody,
          'determined_at',v_now,
          'next_permitted_encounter','boundary',
          'standing_authority','none'
        )
      ),
      updated_at=v_now
  where relationship_key=p_relationship_key;

  return jsonb_build_object(
    'accepted',true,
    'relationship_key',p_relationship_key,
    'env_key',p_env_key,
    'car_state','pass',
    'relationship_state','car_passed_candidate',
    'determination_set',v_custody,
    'event_key',v_event_key,
    'next_permitted_encounter','boundary',
    'standing_created',false,
    'current_created',false,
    'persistence_created',false,
    'registration_created',false,
    'boundary_result_created',false
  );
end;
$function$
$before$ then raise exception 'OAR006_preflight_definition_drift_evaluate_relational_car'; end if;
  if (select pg_get_functiondef(p.oid) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='register_and_persist_c1_relationship') is distinct from $before$CREATE OR REPLACE FUNCTION public.register_and_persist_c1_relationship(p_relationship_key text, p_env_key text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_boundary_event public.crs_relationship_event%rowtype;
  v_car_event public.crs_relationship_event%rowtype;
  v_process_ok boolean;
  v_persist jsonb;
  v_register_event text;
  v_persist_event text;
  v_now timestamptz := now();
  v_source_sha text;
  v_custody jsonb;
  v_lineage jsonb;
begin
  select exists(select 1 from public.system_process_registry where process_key='c1_relational_registration_persistence_v1' and process_status='active' and authority_state='operator_confirmed_registered') into v_process_ok;
  if not v_process_ok then raise exception 'registration_persistence_process_not_active' using errcode='P0001'; end if;

  select * into v_rel from public.crs_relationship where relationship_key=p_relationship_key and is_active=true for update;
  if not found then raise exception 'active_relationship_not_found' using errcode='22023'; end if;
  if v_rel.relationship_standing <> 'boundary_passed_candidate' then raise exception 'relationship_not_boundary_passed_candidate' using errcode='22023'; end if;
  if coalesce(v_rel.metadata->>'env_key','') <> coalesce(p_env_key,'') then raise exception 'environment_binding_mismatch' using errcode='22023'; end if;

  select * into v_boundary_event from public.crs_relationship_event where relationship_key=p_relationship_key and event_type='relational_encounter_boundary_determined' and event_standing='boundary_passed_candidate' and next_permitted_encounter='registration' order by occurred_at desc limit 1;
  if not found then raise exception 'boundary_pass_evidence_not_found' using errcode='22023'; end if;

  select * into v_car_event from public.crs_relationship_event where relationship_key=p_relationship_key and event_type='registry_car_determined' and event_standing='car_passed_candidate' order by occurred_at desc limit 1;
  if not found then raise exception 'car_evidence_not_found' using errcode='22023'; end if;

  v_custody := coalesce(v_car_event.metadata->'determination_set','{}'::jsonb);
  if coalesce(v_custody->>'relationship_record_custody','') <> 'registry' or coalesce(v_custody->>'participant_authority','') <> 'individual' or coalesce(v_custody->>'persistence_custody','') <> 'registry' then raise exception 'car_custody_set_not_eligible_for_persistence' using errcode='22023'; end if;

  v_source_sha := encode(extensions.digest(p_relationship_key || '|' || p_env_key || '|' || v_boundary_event.event_key || '|' || v_car_event.event_key,'sha256'),'hex');
  v_lineage := jsonb_build_object('rrt_provenance_key',p_relationship_key,'relationship_key',p_relationship_key,'car_event_key',v_car_event.event_key,'boundary_event_key',v_boundary_event.event_key,'lineage_preserved',true);

  v_register_event := 'event_' || replace(gen_random_uuid()::text,'-','');
  insert into public.crs_relationship_event(event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,event_standing,next_permitted_encounter,metadata)
  values(v_register_event,p_relationship_key,'c1_relationship_registered','c3_field','crs_relationship',p_relationship_key,'registered_pending_persistence','persistence',jsonb_build_object('env_key',p_env_key,'rrt_provenance_key',p_relationship_key,'standing_effect','none_until_persistence_success','current_effect','none_until_persistence_success','registration_effect','evidence_only_pending_persistence'));

  v_persist := public.env_role_call_persistence_v1(
    'oar2_env_role_call_persistence_v1',
    p_env_key,
    p_relationship_key,
    'c1_relational_relationship',
    jsonb_build_object('relationship_key',p_relationship_key,'relationship_state','registered_pending_persistence','registered_event_key',v_register_event,'boundary_event_key',v_boundary_event.event_key,'car_event_key',v_car_event.event_key,'metadata',coalesce(p_metadata,'{}'::jsonb)),
    v_source_sha,
    jsonb_build_object('registration_event_key',v_register_event,'boundary_event_key',v_boundary_event.event_key,'car_event_key',v_car_event.event_key),
    v_custody,
    v_lineage,
    'c1_C1_persisted',
    'c2_eligibility_review'
  );

  if coalesce(v_persist->>'result','') <> 'recoverable_governed_state' then raise exception 'persistence_did_not_return_recoverable_state' using errcode='P0001'; end if;

  update public.crs_relationship set relationship_standing='c1_C1_persisted', metadata=metadata || jsonb_build_object('rrt_provenance_key',p_relationship_key,'persistence_key',v_persist->>'persistence_key','persisted_at',v_persist->>'persisted_at','standing_authority','c1_relational_registration_persistence_v1','current_resolution','C1'), updated_at=v_now where relationship_key=p_relationship_key;

  v_persist_event := 'event_' || replace(gen_random_uuid()::text,'-','');
  insert into public.crs_relationship_event(event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,event_standing,next_permitted_encounter,metadata)
  values(v_persist_event,p_relationship_key,'c1_relationship_persisted','c3_field','measures_persistence_state',v_persist->>'persistence_key','c1_C1_persisted','c2_eligibility_review',jsonb_build_object('env_key',p_env_key,'rrt_provenance_key',p_relationship_key,'persistence_key',v_persist->>'persistence_key','source_sha256',v_source_sha,'standing_effect','c1_C1_persisted','current_effect','C1_resolved_by_qualifying_persistence','public_release_effect','none'));

  return jsonb_build_object('accepted',true,'relationship_key',p_relationship_key,'rrt_provenance_key',p_relationship_key,'relationship_standing','c1_C1_persisted','current_resolution','C1','registration_event_key',v_register_event,'persistence_event_key',v_persist_event,'persistence',v_persist,'next_permitted_encounter','c2_eligibility_review','current_created_as_separate_record',false,'public_release_created',false,'c2_created',false);
end;
$function$
$before$ then raise exception 'OAR006_preflight_definition_drift_register_and_persist_c1_relationship'; end if;
end $guard$;
CREATE OR REPLACE FUNCTION public.capture_relational_candidate(p_env_key text, p_encounter_key text, p_primary_email text, p_display_name text DEFAULT NULL::text, p_organization text DEFAULT NULL::text, p_consent_scope text DEFAULT 'c1_connect_relationship'::text, p_consent_granted boolean DEFAULT false, p_accuracy_attested boolean DEFAULT false, p_participation_intended boolean DEFAULT false, p_evidence_ref text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_env public.c3_environment%rowtype;
  v_registry public.measures_registry%rowtype;
  v_relationship_key text;
  v_consent_key text;
  v_event_key text;
  v_email text;
  v_now timestamptz := now();
begin
  v_email := lower(btrim(coalesce(p_primary_email, '')));

  if v_email = '' or position('@' in v_email) < 2 then
    raise exception 'invalid_primary_email' using errcode = '22023';
  end if;

  if btrim(coalesce(p_env_key, '')) = '' or btrim(coalesce(p_encounter_key, '')) = '' then
    raise exception 'env_key_and_encounter_key_required' using errcode = '22023';
  end if;

  if not p_consent_granted then
    raise exception 'explicit_consent_required' using errcode = '22023';
  end if;

  if not p_accuracy_attested then
    raise exception 'accuracy_attestation_required' using errcode = '22023';
  end if;

  if not p_participation_intended then
    raise exception 'participation_intention_required' using errcode = '22023';
  end if;

  select * into v_env
  from public.c3_environment
  where env_key = p_env_key
    and is_active = true
    and is_canonical = true
  limit 1;

  if not found then
    raise exception 'canonical_active_environment_not_found' using errcode = '22023';
  end if;

  if coalesce(v_env.environment_class, '') not like 'c1_%' then
    raise exception 'environment_not_eligible_for_c1_relational_capture' using errcode = '22023';
  end if;

  select * into v_registry
  from public.measures_registry
  where is_active = true
    and metadata ->> 'env_key' = p_env_key
    and encounter_type = 'c1_connect'
  order by updated_at desc
  limit 1;

  if not found then
    raise exception 'registered_c1_connect_encounter_not_found' using errcode = '22023';
  end if;

  select relationship_key into v_relationship_key
  from public.crs_relationship
  where lower(btrim(primary_email)) = v_email
  limit 1
  for update;

  if v_relationship_key is not null and not exists (
    select 1 from public.crs_relationship where relationship_key=v_relationship_key
      and metadata->>'env_key'=p_env_key and is_active=true
      and relationship_standing='candidate_unverified'
  ) then
    raise exception 'relationship_reuse_not_eligible' using errcode='22023';
  end if;

  if v_relationship_key is null then
    v_relationship_key := 'crs_' || replace(gen_random_uuid()::text, '-', '');

    insert into public.crs_relationship (
      relationship_key,
      primary_email,
      display_name,
      organization,
      relationship_standing,
      source_encounter,
      is_test_relationship,
      is_active,
      metadata
    ) values (
      v_relationship_key,
      v_email,
      nullif(btrim(coalesce(p_display_name, '')), ''),
      nullif(btrim(coalesce(p_organization, '')), ''),
      'candidate_unverified',
      p_encounter_key,
      false,
      true,
      jsonb_strip_nulls(coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
        'env_key', p_env_key,
        'registry_key', v_registry.registry_key,
        'capture_contract', 'capture_relational_candidate_v1',
        'standing_authority', 'none',
        'captured_at', v_now
      ))
    );
  else
    update public.crs_relationship
    set display_name = coalesce(nullif(btrim(coalesce(p_display_name, '')), ''), display_name),
        organization = coalesce(nullif(btrim(coalesce(p_organization, '')), ''), organization),
        source_encounter = p_encounter_key,
        metadata = metadata || jsonb_strip_nulls(coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object(
          'env_key', p_env_key,
          'registry_key', v_registry.registry_key,
          'last_capture_contract', 'capture_relational_candidate_v1',
          'last_captured_at', v_now
        )),
        updated_at = v_now
    where relationship_key = v_relationship_key;
  end if;

  v_consent_key := 'consent_' || replace(gen_random_uuid()::text, '-', '');
  insert into public.crs_consent (
    consent_key,
    relationship_key,
    consent_scope,
    consent_state,
    consent_source,
    evidence_ref,
    granted_at,
    metadata
  ) values (
    v_consent_key,
    v_relationship_key,
    p_consent_scope,
    'granted',
    p_encounter_key,
    p_evidence_ref,
    v_now,
    jsonb_build_object(
      'env_key', p_env_key,
      'accuracy_attested', true,
      'participation_intended', true,
      'standing_effect', 'none',
      'capture_contract', 'capture_relational_candidate_v1'
    )
  );

  v_event_key := 'event_' || replace(gen_random_uuid()::text, '-', '');
  insert into public.crs_relationship_event (
    event_key,
    relationship_key,
    event_type,
    source_system,
    source_record_type,
    source_record_ref,
    event_standing,
    next_permitted_encounter,
    metadata
  ) values (
    v_event_key,
    v_relationship_key,
    'candidate_captured',
    v_env.system_key,
    'c1_connect_encounter',
    p_evidence_ref,
    'candidate_evidence_only',
    'contact_verification',
    jsonb_build_object(
      'env_key', p_env_key,
      'encounter_key', p_encounter_key,
      'registry_key', v_registry.registry_key,
      'standing_effect', 'none',
      'current_effect', 'none',
      'persistence_effect', 'none',
      'capture_contract', 'capture_relational_candidate_v1'
    )
  );

  return jsonb_build_object(
    'accepted', true,
    'relationship_key', v_relationship_key,
    'consent_key', v_consent_key,
    'event_key', v_event_key,
    'relationship_standing', 'candidate_unverified',
    'event_standing', 'candidate_evidence_only',
    'next_permitted_encounter', 'contact_verification',
    'standing_created', false,
    'current_created', false,
    'persistence_created', false
  );
end;
$function$;


CREATE OR REPLACE FUNCTION public.evaluate_relational_car(p_relationship_key text, p_env_key text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_env public.c3_environment%rowtype;
  v_now timestamptz := now();
  v_event_key text;
  v_verified_event text;
  v_consent_key text;
  v_latest_consent public.crs_consent%rowtype;
  v_foundation_ok boolean := false;
  v_seam_ok boolean := false;
  v_custody jsonb;
begin
  -- Serialize evidence reads against withdrawal/invalidation/new evidence writes.
  -- The short transaction releases these locks at completion; no new authority is granted.
  lock table public.crs_consent, public.crs_relationship_event in share row exclusive mode;
  if btrim(coalesce(p_relationship_key,'')) = '' or btrim(coalesce(p_env_key,'')) = '' then
    raise exception 'relationship_key_and_env_key_required' using errcode='22023';
  end if;

  select * into v_rel
  from public.crs_relationship
  where relationship_key = p_relationship_key
    and is_active = true
  limit 1
  for update;

  if not found then
    raise exception 'active_relationship_not_found' using errcode='22023';
  end if;

  if v_rel.relationship_standing <> 'candidate_contact_verified' then
    raise exception 'relationship_not_eligible_for_car_review' using errcode='22023';
  end if;

  if coalesce(v_rel.metadata->>'env_key','') <> p_env_key then
    raise exception 'environment_binding_mismatch' using errcode='22023';
  end if;

  select * into v_env
  from public.c3_environment
  where env_key = p_env_key
    and is_active = true
    and is_canonical = true
  limit 1;

  if not found or coalesce(v_env.environment_class,'') not like 'c1_%' then
    raise exception 'canonical_c1_environment_not_found' using errcode='22023';
  end if;

  select event_key into v_verified_event
  from public.crs_relationship_event
  where relationship_key = p_relationship_key
    and event_type = 'contact_verification_succeeded'
    and event_standing = 'candidate_contact_verified'
    and metadata->>'env_key' = p_env_key
  order by occurred_at desc, created_at desc
  limit 1;

  if v_verified_event is null then
    raise exception 'verified_contact_evidence_required' using errcode='22023';
  end if;

  select * into v_latest_consent from public.crs_consent
  where relationship_key=p_relationship_key
    and consent_scope='c1_connect_relationship'
    and metadata->>'env_key'=p_env_key
  order by greatest(created_at,granted_at,withdrawn_at) desc, consent_key desc
  limit 1;
  if not found or v_latest_consent.consent_state <> 'granted'
    or v_latest_consent.withdrawn_at is not null
    or v_latest_consent.metadata->>'invalidated_at' is not null
    or v_latest_consent.metadata->>'superseded_at' is not null
    or coalesce(v_latest_consent.metadata->>'invalidated','false') <> 'false'
    or coalesce(v_latest_consent.metadata->>'superseded','false') <> 'false'
  then raise exception 'latest_active_consent_required' using errcode='22023'; end if;
  v_consent_key := v_latest_consent.consent_key;

  select exists(
    select 1 from public.system_process_registry
    where process_key='individual_ownership_custody_founding_principle_v1'
      and authority_state='operator_confirmed_registered'
      and process_status='active'
  ) into v_foundation_ok;

  select exists(
    select 1 from public.system_process_registry
    where process_key='individual_authority_custody_continuity_seam_weld_v1'
      and authority_state='operator_confirmed_registered'
      and process_status='active'
  ) into v_seam_ok;

  if not v_foundation_ok or not v_seam_ok then
    raise exception 'car_governance_authority_not_active' using errcode='P0001';
  end if;

  v_custody := jsonb_build_object(
    'relationship_record_custody','registry',
    'participant_authority','individual',
    'consent_authority','individual',
    'credential_custody','individual',
    'wallet_custody','not_applicable_at_c1',
    'asset_custody','not_applicable_at_c1',
    'persistence_custody','registry',
    'continuity_state','intact',
    'lineage_preserved',true
  );

  v_event_key := 'event_' || replace(gen_random_uuid()::text,'-','');

  insert into public.crs_relationship_event(
    event_key, relationship_key, event_type, source_system, source_record_type,
    source_record_ref, event_standing, next_permitted_encounter, metadata
  ) values (
    v_event_key, p_relationship_key, 'registry_car_determined',
    coalesce(v_env.system_key,'c3_field'), 'registry_car_determination', p_relationship_key,
    'car_passed_candidate', 'boundary',
    jsonb_strip_nulls(coalesce(p_metadata,'{}'::jsonb) || jsonb_build_object(
      'env_key',p_env_key,
      'car_contract','evaluate_relational_car_v1',
      'car_state','pass',
      'determination_set',v_custody,
      'verified_contact_event',v_verified_event,
      'consent_key',v_consent_key,
      'founding_principle','individual_ownership_custody_founding_principle_v1',
      'seam_weld','individual_authority_custody_continuity_seam_weld_v1',
      'standing_effect','candidate_state_only',
      'current_effect','none',
      'persistence_effect','none',
      'boundary_effect','none',
      'registration_effect','none',
      'determined_at',v_now
    ))
  );

  update public.crs_relationship
  set relationship_standing='car_passed_candidate',
      metadata = metadata || jsonb_build_object(
        'registry_car',jsonb_build_object(
          'car_state','pass',
          'event_key',v_event_key,
          'determination_set',v_custody,
          'determined_at',v_now,
          'next_permitted_encounter','boundary',
          'standing_authority','none'
        )
      ),
      updated_at=v_now
  where relationship_key=p_relationship_key;

  return jsonb_build_object(
    'accepted',true,
    'relationship_key',p_relationship_key,
    'env_key',p_env_key,
    'car_state','pass',
    'relationship_state','car_passed_candidate',
    'determination_set',v_custody,
    'event_key',v_event_key,
    'next_permitted_encounter','boundary',
    'standing_created',false,
    'current_created',false,
    'persistence_created',false,
    'registration_created',false,
    'boundary_result_created',false
  );
end;
$function$;


CREATE OR REPLACE FUNCTION public.register_and_persist_c1_relationship(p_relationship_key text, p_env_key text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_boundary_event public.crs_relationship_event%rowtype;
  v_car_event public.crs_relationship_event%rowtype;
  v_process_ok boolean;
  v_persist jsonb;
  v_register_event text;
  v_persist_event text;
  v_now timestamptz := now();
  v_source_sha text;
  v_custody jsonb;
  v_lineage jsonb;
  v_latest_consent public.crs_consent%rowtype;
  v_notchazz public.crs_relationship_event%rowtype;
begin
  -- Serialize evidence reads against withdrawal/invalidation/new evidence writes.
  -- The short transaction releases these locks at completion; no new authority is granted.
  lock table public.crs_consent, public.crs_relationship_event in share row exclusive mode;
  select exists(select 1 from public.system_process_registry where process_key='c1_relational_registration_persistence_v1' and process_status='active' and authority_state='operator_confirmed_registered') into v_process_ok;
  if not v_process_ok then raise exception 'registration_persistence_process_not_active' using errcode='P0001'; end if;

  select * into v_rel from public.crs_relationship where relationship_key=p_relationship_key and is_active=true for update;
  if not found then raise exception 'active_relationship_not_found' using errcode='22023'; end if;
  if v_rel.relationship_standing <> 'boundary_passed_candidate' then raise exception 'relationship_not_boundary_passed_candidate' using errcode='22023'; end if;
  if coalesce(v_rel.metadata->>'env_key','') <> coalesce(p_env_key,'') then raise exception 'environment_binding_mismatch' using errcode='22023'; end if;

  select * into v_latest_consent from public.crs_consent
  where relationship_key=p_relationship_key
    and consent_scope='c1_connect_relationship'
    and metadata->>'env_key'=p_env_key
  order by greatest(created_at,granted_at,withdrawn_at) desc, consent_key desc
  limit 1;
  if not found or v_latest_consent.consent_state <> 'granted'
    or v_latest_consent.withdrawn_at is not null
    or v_latest_consent.metadata->>'invalidated_at' is not null
    or v_latest_consent.metadata->>'superseded_at' is not null
    or coalesce(v_latest_consent.metadata->>'invalidated','false') <> 'false'
    or coalesce(v_latest_consent.metadata->>'superseded','false') <> 'false'
  then raise exception 'latest_active_consent_required' using errcode='22023'; end if;

  -- Select the newest determination, never the newest passing determination.
  select * into v_car_event from public.crs_relationship_event
  where relationship_key=p_relationship_key and event_type='registry_car_determined'
  order by occurred_at desc, created_at desc, event_key desc limit 1;
  if not found or v_car_event.metadata->>'env_key' is distinct from p_env_key
    or v_car_event.event_standing <> 'car_passed_candidate'
    or v_car_event.next_permitted_encounter <> 'boundary'
    or v_car_event.metadata->>'car_state' is distinct from 'pass'
    or v_car_event.metadata->>'consent_key' is distinct from v_latest_consent.consent_key
    or v_car_event.event_key is distinct from v_rel.metadata->'registry_car'->>'event_key'
    or v_car_event.metadata->>'invalidated_at' is not null
    or v_car_event.metadata->>'superseded_at' is not null
    or coalesce(v_car_event.metadata->>'invalidated','false') <> 'false'
    or coalesce(v_car_event.metadata->>'superseded','false') <> 'false'
  then raise exception 'latest_applicable_car_evidence_required' using errcode='22023'; end if;

  select * into v_boundary_event from public.crs_relationship_event
  where relationship_key=p_relationship_key and event_type='relational_encounter_boundary_determined'
  order by occurred_at desc, created_at desc, event_key desc limit 1;
  if not found or v_boundary_event.metadata->>'env_key' is distinct from p_env_key
    or v_boundary_event.event_standing <> 'boundary_passed_candidate'
    or v_boundary_event.next_permitted_encounter <> 'registration'
    or v_boundary_event.metadata->>'boundary_state' is distinct from 'pass'
    or v_boundary_event.event_key is distinct from v_rel.metadata->'relational_boundary'->>'boundary_event_key'
    or v_boundary_event.metadata->>'invalidated_at' is not null
    or v_boundary_event.metadata->>'superseded_at' is not null
    or coalesce(v_boundary_event.metadata->>'invalidated','false') <> 'false'
    or coalesce(v_boundary_event.metadata->>'superseded','false') <> 'false'
  then raise exception 'latest_applicable_boundary_evidence_required' using errcode='22023'; end if;

  select * into v_notchazz from public.crs_relationship_event
  where relationship_key=p_relationship_key and event_type='notchazz_relational_evaluated'
  order by occurred_at desc, created_at desc, event_key desc limit 1;
  if not found or v_notchazz.metadata->>'env_key' is distinct from p_env_key
    or v_notchazz.event_key is distinct from v_boundary_event.metadata->>'notchazz_event_key'
    or v_notchazz.source_record_ref is distinct from v_car_event.event_key
    or v_notchazz.event_standing <> 'notchazz_pass_projection'
    or v_notchazz.metadata->>'flag_count' is distinct from '0'
    or v_notchazz.metadata->>'final_disposition_authority' is distinct from 'false'
    or v_notchazz.metadata->>'invalidated_at' is not null
    or v_notchazz.metadata->>'superseded_at' is not null
    or coalesce(v_notchazz.metadata->>'invalidated','false') <> 'false'
    or coalesce(v_notchazz.metadata->>'superseded','false') <> 'false'
  then raise exception 'latest_applicable_notchazz_evidence_required' using errcode='22023'; end if;

  v_custody := coalesce(v_car_event.metadata->'determination_set','{}'::jsonb);
  if coalesce(v_custody->>'relationship_record_custody','') <> 'registry' or coalesce(v_custody->>'participant_authority','') <> 'individual' or coalesce(v_custody->>'persistence_custody','') <> 'registry' then raise exception 'car_custody_set_not_eligible_for_persistence' using errcode='22023'; end if;

  v_source_sha := encode(extensions.digest(p_relationship_key || '|' || p_env_key || '|' || v_boundary_event.event_key || '|' || v_car_event.event_key,'sha256'),'hex');
  v_lineage := jsonb_build_object('rrt_provenance_key',p_relationship_key,'relationship_key',p_relationship_key,'car_event_key',v_car_event.event_key,'boundary_event_key',v_boundary_event.event_key,'lineage_preserved',true);

  v_register_event := 'event_' || replace(gen_random_uuid()::text,'-','');
  insert into public.crs_relationship_event(event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,event_standing,next_permitted_encounter,metadata)
  values(v_register_event,p_relationship_key,'c1_relationship_registered','c3_field','crs_relationship',p_relationship_key,'registered_pending_persistence','persistence',jsonb_build_object('env_key',p_env_key,'rrt_provenance_key',p_relationship_key,'standing_effect','none_until_persistence_success','current_effect','none_until_persistence_success','registration_effect','evidence_only_pending_persistence'));

  v_persist := public.env_role_call_persistence_v1(
    'oar2_env_role_call_persistence_v1',
    p_env_key,
    p_relationship_key,
    'c1_relational_relationship',
    jsonb_build_object('relationship_key',p_relationship_key,'relationship_state','registered_pending_persistence','registered_event_key',v_register_event,'boundary_event_key',v_boundary_event.event_key,'car_event_key',v_car_event.event_key,'metadata',coalesce(p_metadata,'{}'::jsonb)),
    v_source_sha,
    jsonb_build_object('registration_event_key',v_register_event,'boundary_event_key',v_boundary_event.event_key,'car_event_key',v_car_event.event_key),
    v_custody,
    v_lineage,
    'c1_C1_persisted',
    'c2_eligibility_review'
  );

  if coalesce(v_persist->>'result','') <> 'recoverable_governed_state' then raise exception 'persistence_did_not_return_recoverable_state' using errcode='P0001'; end if;

  update public.crs_relationship set relationship_standing='c1_C1_persisted', metadata=metadata || jsonb_build_object('rrt_provenance_key',p_relationship_key,'persistence_key',v_persist->>'persistence_key','persisted_at',v_persist->>'persisted_at','standing_authority','c1_relational_registration_persistence_v1','current_resolution','C1'), updated_at=v_now where relationship_key=p_relationship_key;

  v_persist_event := 'event_' || replace(gen_random_uuid()::text,'-','');
  insert into public.crs_relationship_event(event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,event_standing,next_permitted_encounter,metadata)
  values(v_persist_event,p_relationship_key,'c1_relationship_persisted','c3_field','measures_persistence_state',v_persist->>'persistence_key','c1_C1_persisted','c2_eligibility_review',jsonb_build_object('env_key',p_env_key,'rrt_provenance_key',p_relationship_key,'persistence_key',v_persist->>'persistence_key','source_sha256',v_source_sha,'standing_effect','c1_C1_persisted','current_effect','C1_resolved_by_qualifying_persistence','public_release_effect','none'));

  return jsonb_build_object('accepted',true,'relationship_key',p_relationship_key,'rrt_provenance_key',p_relationship_key,'relationship_standing','c1_C1_persisted','current_resolution','C1','registration_event_key',v_register_event,'persistence_event_key',v_persist_event,'persistence',v_persist,'next_permitted_encounter','c2_eligibility_review','current_created_as_separate_record',false,'public_release_created',false,'c2_created',false);
end;
$function$;
