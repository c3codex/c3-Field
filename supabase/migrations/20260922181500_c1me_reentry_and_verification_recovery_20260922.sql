-- c1ME re-entry recovery + verification-link coexistence.
-- Applied to production on 2026-09-22.
create or replace function public.resolve_c1_owner_reentry(p_primary_email text)
returns jsonb
language plpgsql
security definer
set search_path to public, extensions, pg_temp
as $function$
declare
  r public.crs_relationship%rowtype;
  p public.c3_envpac%rowtype;
  v_formed jsonb;
  v_current jsonb;
begin
  select * into r
  from public.crs_relationship
  where lower(primary_email)=lower(btrim(p_primary_email))
    and is_active=true
    and coalesce(is_test_relationship,false)=false
    and relationship_standing='c1_C1_persisted'
  order by updated_at desc
  limit 1;

  if not found then return jsonb_build_object('accepted',false); end if;

  select * into p
  from public.c3_envpac
  where owner_subject_type='individual'
    and owner_subject_key=r.relationship_key
    and is_effective=true
  order by effective_at desc nulls last, created_at desc
  limit 1;

  if not found then
    v_formed := public.form_c1_owner_environment(r.relationship_key,'env_c3_community_connect');
    if coalesce(v_formed->>'accepted','false') <> 'true' then
      return jsonb_build_object('accepted',false,'repair_attempted',true);
    end if;
    select * into p
    from public.c3_envpac
    where owner_subject_type='individual'
      and owner_subject_key=r.relationship_key
      and is_effective=true
    order by effective_at desc nulls last, created_at desc
    limit 1;
    if not found then return jsonb_build_object('accepted',false,'repair_attempted',true); end if;
  end if;

  v_current := public.ensure_c1me_current_internal(r.relationship_key);
  if coalesce(v_current->>'resolution','') <> 'existing_c1' then
    return jsonb_build_object('accepted',false,'repair_attempted',true,
      'reason_code',coalesce(v_current->>'reason_code','current_unavailable'));
  end if;

  return jsonb_build_object(
    'accepted',true,'relationship_key',r.relationship_key,'owner_email',r.primary_email,
    'owner_display_name',r.display_name,'env_key',p.env_key,'envpac_key',p.envpac_key,
    'current_ref',v_current->>'current_ref','standing','c1_connected',
    'c1_standing',r.relationship_standing,'portable',p.portable,'reentry_self_healed',true
  );
end;
$function$;

revoke all on function public.resolve_c1_owner_reentry(text) from public, anon, authenticated;
grant execute on function public.resolve_c1_owner_reentry(text) to service_role;

create or replace function public.issue_relational_verification(
  p_relationship_key text,p_env_key text,p_ttl_minutes integer default 30,p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to public, extensions, pg_temp
as $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_env public.c3_environment%rowtype;
  v_now timestamptz := now();
  v_last_issued timestamptz;
  v_hour_count integer;
  v_previous_key text;
  v_issue_sequence integer;
  v_challenge_key text;
  v_event_key text;
  v_token text;
  v_ttl integer;
  v_channel_hash text;
  v_action text;
begin
  v_ttl := greatest(5,least(coalesce(p_ttl_minutes,30),60));
  select * into v_rel from public.crs_relationship where relationship_key=p_relationship_key and is_active=true limit 1;
  if not found then raise exception 'active_relationship_not_found' using errcode='22023'; end if;
  if v_rel.relationship_standing not in ('candidate_unverified','candidate_contact_verified') then
    raise exception 'relationship_not_eligible_for_contact_verification' using errcode='22023';
  end if;
  if coalesce(v_rel.metadata->>'env_key','')<>coalesce(p_env_key,'') then
    raise exception 'environment_binding_mismatch' using errcode='22023';
  end if;
  select * into v_env from public.c3_environment
  where env_key=p_env_key and is_active=true and is_canonical=true limit 1;
  if not found then raise exception 'canonical_active_environment_not_found' using errcode='22023'; end if;

  update public.crs_verification_challenge set challenge_state='expired',updated_at=v_now
  where relationship_key=p_relationship_key and verification_type='email_control'
    and challenge_state='active' and expires_at<=v_now;

  select max(issued_at),count(*) filter(where issued_at>v_now-interval '1 hour')
  into v_last_issued,v_hour_count
  from public.crs_verification_challenge
  where relationship_key=p_relationship_key and verification_type='email_control';

  if v_last_issued is not null and v_last_issued>v_now-interval '60 seconds' then
    raise exception 'verification_reissue_cooldown_active' using errcode='P0001';
  end if;
  if coalesce(v_hour_count,0)>=5 then raise exception 'verification_hourly_issue_limit_reached' using errcode='P0001'; end if;

  select challenge_key into v_previous_key
  from public.crs_verification_challenge
  where relationship_key=p_relationship_key and verification_type='email_control'
    and challenge_state='active' and expires_at>v_now
  order by issued_at desc limit 1;

  v_action:=case when v_previous_key is null then 'issue' else 'additional_issue' end;
  select coalesce(max(issue_sequence),0)+1 into v_issue_sequence
  from public.crs_verification_challenge where relationship_key=p_relationship_key and verification_type='email_control';

  v_challenge_key:='verify_'||replace(gen_random_uuid()::text,'-','');
  v_token:=encode(extensions.gen_random_bytes(24),'hex');
  v_channel_hash:=encode(extensions.digest(lower(btrim(v_rel.primary_email)),'sha256'),'hex');

  insert into public.crs_verification_challenge(
    challenge_key,relationship_key,env_key,verification_type,channel_hash,token_hash,
    challenge_state,issue_sequence,attempt_count,max_attempts,issued_at,expires_at,metadata
  ) values(
    v_challenge_key,p_relationship_key,p_env_key,'email_control',v_channel_hash,
    extensions.digest(v_token,'sha256'),'active',v_issue_sequence,0,5,v_now,
    v_now+make_interval(mins=>v_ttl),
    jsonb_strip_nulls(coalesce(p_metadata,'{}'::jsonb)||jsonb_build_object(
      'verification_contract','relational_contact_verification_v2',
      'delivery_authority','external_transport_only',
      'standing_effect','none_until_successful_contact_control_proof',
      'prior_active_challenge_key',v_previous_key,
      'prior_active_challenge_preserved',v_previous_key is not null))
  );

  v_event_key:='event_'||replace(gen_random_uuid()::text,'-','');
  insert into public.crs_relationship_event(
    event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,
    event_standing,next_permitted_encounter,metadata
  ) values(
    v_event_key,p_relationship_key,
    case when v_action='additional_issue' then 'verification_challenge_additional_issued' else 'verification_challenge_issued' end,
    v_env.system_key,'crs_verification_challenge',v_challenge_key,'candidate_evidence_only','contact_verification',
    jsonb_build_object('env_key',p_env_key,'verification_type','email_control',
      'issue_sequence',v_issue_sequence,'standing_effect','none','current_effect','none',
      'persistence_effect','none','prior_active_challenge_preserved',v_previous_key is not null)
  );

  return jsonb_build_object(
    'accepted',true,'action',v_action,'relationship_key',p_relationship_key,
    'challenge_key',v_challenge_key,'challenge_token',v_token,'verification_type','email_control',
    'expires_at',v_now+make_interval(mins=>v_ttl),'issue_sequence',v_issue_sequence,
    'prior_challenge_superseded',false,'prior_active_challenge_preserved',v_previous_key is not null,
    'next_permitted_encounter','contact_verification','standing_created',false,
    'current_created',false,'persistence_created',false
  );
end;
$function$;

revoke all on function public.issue_relational_verification(text,text,integer,jsonb) from public, anon, authenticated;
grant execute on function public.issue_relational_verification(text,text,integer,jsonb) to service_role;

create or replace function public.verify_relational_contact(
  p_relationship_key text,p_challenge_token text,p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to public, extensions, pg_temp
as $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_ch public.crs_verification_challenge%rowtype;
  v_env public.c3_environment%rowtype;
  v_now timestamptz:=now();
  v_event_key text;
  v_token_hash bytea;
begin
  if btrim(coalesce(p_challenge_token,''))='' then raise exception 'challenge_token_required' using errcode='22023'; end if;
  select * into v_rel from public.crs_relationship where relationship_key=p_relationship_key and is_active=true limit 1;
  if not found then raise exception 'active_relationship_not_found' using errcode='22023'; end if;
  if v_rel.relationship_standing not in ('candidate_unverified','candidate_contact_verified') then
    raise exception 'relationship_not_eligible_for_contact_verification' using errcode='22023';
  end if;

  v_token_hash:=extensions.digest(p_challenge_token,'sha256');
  select * into v_ch from public.crs_verification_challenge
  where relationship_key=p_relationship_key and verification_type='email_control'
    and challenge_state='active' and token_hash=v_token_hash
  order by issued_at desc limit 1 for update;

  if not found then
    select * into v_ch from public.crs_verification_challenge
    where relationship_key=p_relationship_key and verification_type='email_control' and challenge_state='active'
    order by issued_at desc limit 1 for update;
    if not found then raise exception 'active_verification_challenge_not_found' using errcode='22023'; end if;
    if v_ch.expires_at<=v_now then
      update public.crs_verification_challenge set challenge_state='expired',updated_at=v_now where challenge_key=v_ch.challenge_key;
      raise exception 'verification_challenge_expired' using errcode='P0001';
    end if;
    update public.crs_verification_challenge
    set attempt_count=attempt_count+1,last_attempt_at=v_now,
        challenge_state=case when attempt_count+1>=max_attempts then 'failed_locked' else challenge_state end,
        updated_at=v_now
    where challenge_key=v_ch.challenge_key;
    return jsonb_build_object('verified',false,'relationship_key',p_relationship_key,
      'challenge_key',v_ch.challenge_key,
      'verification_state',case when v_ch.attempt_count+1>=v_ch.max_attempts then 'failed_locked' else 'active' end,
      'attempt_count',v_ch.attempt_count+1,'max_attempts',v_ch.max_attempts,
      'standing_created',false,'current_created',false,'persistence_created',false);
  end if;

  if v_ch.expires_at<=v_now then
    update public.crs_verification_challenge set challenge_state='expired',updated_at=v_now where challenge_key=v_ch.challenge_key;
    raise exception 'verification_challenge_expired' using errcode='P0001';
  end if;
  if v_ch.attempt_count>=v_ch.max_attempts then
    update public.crs_verification_challenge set challenge_state='failed_locked',updated_at=v_now where challenge_key=v_ch.challenge_key;
    raise exception 'verification_challenge_locked' using errcode='P0001';
  end if;

  select * into v_env from public.c3_environment where env_key=v_ch.env_key limit 1;

  update public.crs_verification_challenge
  set challenge_state='verified',attempt_count=attempt_count+1,last_attempt_at=v_now,verified_at=v_now,
      metadata=metadata||jsonb_strip_nulls(coalesce(p_metadata,'{}'::jsonb)),updated_at=v_now
  where challenge_key=v_ch.challenge_key;

  update public.crs_verification_challenge
  set challenge_state='superseded',superseded_at=v_now,updated_at=v_now
  where relationship_key=p_relationship_key and verification_type='email_control'
    and challenge_state='active' and challenge_key<>v_ch.challenge_key;

  update public.crs_relationship
  set relationship_standing='candidate_contact_verified',
      metadata=metadata||jsonb_build_object('contact_verification',jsonb_build_object(
        'verification_type','email_control','challenge_key',v_ch.challenge_key,'verified_at',v_now,
        'env_key',v_ch.env_key,'standing_authority','none')),
      updated_at=v_now
  where relationship_key=p_relationship_key;

  v_event_key:='event_'||replace(gen_random_uuid()::text,'-','');
  insert into public.crs_relationship_event(
    event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,
    event_standing,next_permitted_encounter,metadata
  ) values(
    v_event_key,p_relationship_key,'contact_verification_succeeded',
    coalesce(v_env.system_key,'c3_field'),'crs_verification_challenge',v_ch.challenge_key,
    'candidate_contact_verified','car_review',
    jsonb_build_object('env_key',v_ch.env_key,'verification_type','email_control',
      'channel_hash',v_ch.channel_hash,'standing_effect','candidate_contact_verified_only',
      'current_effect','none','persistence_effect','none','car_disposition_effect','none',
      'boundary_effect','none','other_active_challenges_closed',true)
  );

  return jsonb_build_object(
    'verified',true,'relationship_key',p_relationship_key,'challenge_key',v_ch.challenge_key,
    'relationship_standing','candidate_contact_verified','event_key',v_event_key,
    'next_permitted_encounter','car_review','c1_standing_created',false,
    'current_created',false,'persistence_created',false,
    'car_disposition_created',false,'boundary_result_created',false
  );
end;
$function$;

revoke all on function public.verify_relational_contact(text,text,jsonb) from public, anon, authenticated;
grant execute on function public.verify_relational_contact(text,text,jsonb) to service_role;
