-- OAR004 SOURCE ONLY. No production installation or authority rows are seeded.
-- Uses the established runtime-session/owner/CRS/operator relations. All new
-- functions are service-only SECURITY INVOKER; service access is never actor proof.
create or replace function public.resolve_lapzuli_historical_actor_v1(p_session_key uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  s public.c3_env_runtime_session%rowtype; g public.c3_envpac_access_grant%rowtype;
  ctx jsonb; op jsonb; target public.c3_environment_operator_binding%rowtype;
begin
  if current_user<>'service_role' then return jsonb_build_object('standing','HLD','reason','trusted_service_required'); end if;
  select * into s from public.c3_env_runtime_session where session_key=p_session_key for share;
  if not found or s.standing is distinct from 'active' or s.revoked_at is not null or
    s.expires_at is null or not isfinite(s.expires_at) or s.expires_at<=clock_timestamp() or s.subject_type is distinct from 'individual' then
    return jsonb_build_object('standing','HLD','reason','existing_individual_session_inactive');
  end if;
  select * into g from public.c3_envpac_access_grant where grant_key=s.evidence_ref for share;
  if not found or g.standing is distinct from 'active' or g.revoked_at is not null or
    (g.expires_at is not null and g.expires_at<=clock_timestamp()) or
    g.subject_type is distinct from 'individual' or g.subject_key is distinct from s.subject_key or
    g.envpac_key is distinct from s.envpac_key or g.relation_role is distinct from 'owner' then
    return jsonb_build_object('standing','HLD','reason','session_original_owner_grant_inactive_or_mismatched');
  end if;
  -- Lock existing identity/Current/boundary rows in a consistent order, then
  -- call the SAME native resolver used by My Env. No new identity interpretation.
  perform 1 from public.crs_relationship where relationship_key=s.subject_key for share;
  perform 1 from public.c3_envpac where owner_subject_key=s.subject_key order by envpac_key for share;
  perform 1 from public.c3_current_state where env_key=s.env_key order by current_state_key for share;
  perform 1 from public.c3_current_evidence_ref where current_state_key in
    (select current_state_key from public.c3_current_state where env_key=s.env_key)
    order by current_evidence_ref_key for share;
  perform 1 from public.system_process_registry where process_key='c1_relational_notchazz_encounter_boundary_v1' for share;
  perform 1 from public.c3_ai_action_boundary where boundary_key='measures_registry_ai_action_boundary' for share;
  perform 1 from public.c3_named_individual_crs_binding where relationship_key=s.subject_key order by continuity_binding_key for share;
  perform 1 from public.c3_named_individual_operator_binding where named_individual_key in
    (select named_individual_key from public.c3_named_individual_crs_binding where relationship_key=s.subject_key)
    order by relation_key for share;
  perform 1 from public.c3_operator_standing where operator_identifier='op044' order by operator_standing_key for share;
  perform 1 from public.c3_environment_operator_binding where operator_standing_key in
    (select operator_standing_key from public.c3_operator_standing where operator_identifier='op044')
    order by environment_operator_binding_key for share;
  ctx:=public.resolve_c1me_operator_context_internal(s.subject_key);
  if ctx->>'resolution' is distinct from 'operator_context_resolved' or
    ctx->>'relationship_ref' is distinct from s.subject_key or ctx->>'env_key' is distinct from s.env_key or
    ctx->>'envpac_ref' is distinct from s.envpac_key or
    (select count(*) from jsonb_array_elements(ctx->'operators') x where x->>'operator_identifier'='op044')<>1 then
    return jsonb_build_object('standing','HLD','reason','existing_op044_context_unresolved');
  end if;
  select x into op from jsonb_array_elements(ctx->'operators') x where x->>'operator_identifier'='op044';
  if not exists(select 1 from public.c3_named_individual_crs_binding c where
    c.continuity_binding_key=op->>'continuity_binding_key' and c.binding_standing='active' and
    c.relationship_key=s.subject_key and c.named_individual_key=op->>'named_individual_key' and
    c.binding_class='governed_identity_continuity' and
    c.revoked_at is null and c.effective_at<=clock_timestamp()) or
    not exists(select 1 from public.c3_named_individual_operator_binding b where
      b.relation_key=op->>'carrier_binding_key' and b.named_individual_key=op->>'named_individual_key' and
      b.operator_standing_key=op->>'operator_standing_key' and b.standing='active' and b.effective_at<=clock_timestamp()) or
    not exists(select 1 from public.c3_environment_operator_binding e where
      e.environment_operator_binding_key=op->>'environment_operator_binding_key' and
      e.binding_standing='active' and e.revoked_at is null and e.effective_at<=clock_timestamp()) then
    return jsonb_build_object('standing','HLD','reason','existing_identity_or_personal_operator_relation_revoked');
  end if;
  select * into target from public.c3_environment_operator_binding where
    env_key='env_c3ops' and envpac_key='c3envpac_c3ops_v0_1' and
    operator_standing_key=op->>'operator_standing_key' and carrier_binding_key=op->>'carrier_binding_key' and
    binding_standing='active' and revoked_at is null and effective_at<=clock_timestamp() for share;
  if not found then return jsonb_build_object('standing','HLD','reason','existing_c3ops_operator_relation_unresolved'); end if;
  if target.c3me_standing_required or (op->>'c3me_standing_required')::boolean then
    return jsonb_build_object('standing','HLD','reason','required_c3me_effect_standing_needs_native_qualification');
  end if;
  return jsonb_build_object('standing','identity_resolved','session_key',s.session_key,
    'relationship_ref',s.subject_key,'owner_grant_ref',g.grant_key,'source_env_key',s.env_key,
    'source_envpac_key',s.envpac_key,'current_ref',ctx->>'current_ref',
    'named_individual_key',op->>'named_individual_key','operator_ref','op044',
    'continuity_binding_key',op->>'continuity_binding_key','carrier_binding_key',op->>'carrier_binding_key',
    'operator_standing_key',op->>'operator_standing_key',
    'personal_operator_binding_key',op->>'environment_operator_binding_key',
    'target_operator_binding_key',target.environment_operator_binding_key,
    'target_operator_scope',target.scope_class,'session_expires_at',s.expires_at,
    'owner_grant_expires_at',g.expires_at,'publication_authority_created',false);
end $$;

-- Shared current-state validator used at claim AND immediately before worker
-- consumption. It derives the payload/tuple from Registry and verifies native
-- evidence references; caller preflight booleans cannot create readiness.
create or replace function public.resolve_lapzuli_historical_source_v1(p_actor jsonb,p_proof_key text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  v_instance constant text:='registrar_lapzuli_native_occurrence_claim_binder_codex_003';
  v_oar constant text:='oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003';
  v_hash constant text:='201e7fb50c3af165a4499c01c443053ddeb6241079f2725c6ce238462772e5df';
  a public.measures_publication_distribution_asset%rowtype; r public.lapzuli_route%rowtype;
  d public.measures_publication_derivative_asset%rowtype; c public.c3_pac%rowtype; p public.c3_pac%rowtype;
  src public.c3ops_asset_record%rowtype; media public.c3ops_asset_record%rowtype;
  ch public.measures_distribution_channel%rowtype; ex public.measures_distribution_executor%rowtype;
  qualification public.lapzuli_outlet_qualification%rowtype; outlet public.lapzuli_outlet%rowtype;
  profile public.lapzuli_object_profile%rowtype; registered public.registered_process_log%rowtype;
  proof public.c3ops_oar_custody_resolution_event%rowtype; producer public.c3_envpac_capability_grant%rowtype;
  passage public.c3_envpac_capability_grant%rowtype;
  installer public.system_process_registry%rowtype; cap public.c3_envpac_capability_grant%rowtype;
  callrow record; dispatchrow record; caps jsonb:='{}'; role_name text; actor_name text;
  fn text; fn_hash text; expected jsonb; tuple jsonb; source_snapshot jsonb; deadline timestamptz;
  pickup jsonb;
begin
  if current_user<>'service_role' then return jsonb_build_object('standing','HLD','reason','trusted_service_required'); end if;
  if p_actor->>'standing' is distinct from 'identity_resolved' or p_actor->>'operator_ref' is distinct from 'op044' then
    return jsonb_build_object('standing','HLD','reason','native_individual_proof_required');
  end if;
  perform pg_advisory_xact_lock(hashtextextended('undrifted_hole_map_bluesky_dist_v1',0));
  pickup:=public.resolve_cancom_oar_pickup_v1('execution_instance',v_instance,'codex');
  if pickup->>'standing' is distinct from 'resolved_for_executor' or pickup->>'sha256' is distinct from v_hash or
    not exists(select 1 from public.c3ops_oar_custody_resolution_event e where
      e.related_execution_instance='registrar_lapzuli_manual_backlog_handoff_codex_002r' and e.object_type='oar1' and
      e.integrity_hash='662f4cd9403c215eb48940be375cb7e3a5c60101605bacb107889d41977e76bb' and
      e.standing='reviewed_reconciliation_source_only_hld') then
    return jsonb_build_object('standing','HLD','reason','original_oar_and_reconciliation_relation_unresolved');
  end if;
  if pickup->>'queue_status' is null or pickup->>'queue_status' not in ('approved_for_execution','executing') then
    return jsonb_build_object('standing','HLD','reason','current_exact_effect_execution_not_admitted');
  end if;
  select * into passage from public.c3_envpac_capability_grant g where
    g.envpac_key=p_actor->>'source_envpac_key' and g.system_key='c3ops' and g.capability='lapzuli_distribution' for share;
  if not found or passage.standing is distinct from 'active' or
    not coalesce(passage.scope->'allowed_actions' ? 'historical_identity_passage',false) or
    passage.scope->>'execution_instance' is distinct from v_instance or passage.scope->>'operator_ref' is distinct from 'op044' or
    passage.scope->>'allowed_asset' is distinct from 'undrifted_hole_map_bluesky_dist_v1' or
    nullif(passage.scope->>'expires_at','')::timestamptz is null or not isfinite((passage.scope->>'expires_at')::timestamptz) or (passage.scope->>'expires_at')::timestamptz<=clock_timestamp() then
    return jsonb_build_object('standing','HLD','reason','myenv_lapzuli_identity_passage_capability_inactive_or_unscoped');
  end if;
  -- Read/preflight operator relations do not authorize this effect. Four
  -- independently admitted grants are required, scoped to this actor relation,
  -- exact target, ORIGINAL effect instance/OAR and reviewed installed source.
  deadline:=least(clock_timestamp()+interval '60 seconds',(passage.scope->>'expires_at')::timestamptz);
  foreach role_name in array array['operator','notchazz','registrar','executor'] loop
    actor_name:=case role_name when 'operator' then 'op044' when 'notchazz' then 'notchazz' when 'registrar' then 'chazz' else 'codex' end;
    select * into cap from public.c3_envpac_capability_grant g where g.standing='active' and
      g.scope->>'execution_instance'=v_instance and g.scope->>'oar_key'=v_oar and
      g.scope->>'source_oar2_sha256'=v_hash and g.scope->>'role'=role_name and g.scope->>'actor_ref'=actor_name and
      g.scope->>'operator_ref'='op044' and g.scope->>'named_individual_key'=p_actor->>'named_individual_key' and
      g.scope->>'target_operator_binding_key'=p_actor->>'target_operator_binding_key' and
      g.scope->>'target_env_key'='env_c3ops' and g.scope->>'target_envpac_key'='c3envpac_c3ops_v0_1' and
      g.scope->>'allowed_asset'='undrifted_hole_map_bluesky_dist_v1' and
      g.scope->>'allowed_route'='lapzuli_route_undrifted_hole_map_bluesky_dist_v1' and
      g.scope->>'destination_account_identifier'='undrifted.bsky.social' and
      g.scope->'allowed_actions' ? 'admit_historical_distribution_effect' and
      g.scope->'external_provider_effects_authorized'='true'::jsonb and g.scope->'max_new_external_effects'='1'::jsonb and
      nullif(g.scope->>'expires_at','')::timestamptz>clock_timestamp() and isfinite((g.scope->>'expires_at')::timestamptz) order by capability_key limit 1 for share;
    if not found then return jsonb_build_object('standing','HLD','reason','separate_exact_effect_grant_unresolved:'||role_name); end if;
    deadline:=least(deadline,(cap.scope->>'expires_at')::timestamptz);
    caps:=caps||jsonb_build_object(role_name,cap.capability_key);
  end loop;
  select * into installer from public.system_process_registry where
    process_key='lapzuli_historical_admission_installation_v1' for share;
  if not found or installer.process_status is distinct from 'active' or
    installer.authority_state is distinct from 'operator_confirmed_registered' or
    installer.metadata->>'source_sha256' is null or installer.metadata->>'source_sha256' !~ '^[0-9a-f]{64}$' or
    installer.metadata->>'source_sha256' is distinct from cap.scope->>'native_source_sha256' or
    installer.metadata->>'notchazz_effect_review_ref' is null or installer.metadata->>'registrar_effect_review_ref' is null then
    return jsonb_build_object('standing','HLD','reason','independently_reviewed_native_installation_unresolved');
  end if;
  if exists(select 1 from public.c3_envpac_capability_grant g where g.capability_key in
    (select value from jsonb_each_text(caps)) and
    g.scope->>'native_source_sha256' is distinct from installer.metadata->>'source_sha256') then
    return jsonb_build_object('standing','HLD','reason','effect_grants_native_source_hash_mismatch');
  end if;
  perform 1 from public.c3ops_notchazz_oar_formation_evaluation where evaluation_key=installer.metadata->>'notchazz_effect_review_ref' for share;
  perform 1 from public.c3_ci_role_call where role_call_key=installer.metadata->>'registrar_effect_review_ref' for share;
  if not exists(select 1 from public.c3ops_notchazz_oar_formation_evaluation n where
    n.evaluation_key=installer.metadata->>'notchazz_effect_review_ref' and n.result='PASS' and n.standing='active' and
    n.authority_created=false and n.oar_key=installer.metadata->>'installation_oar2_key' and
    n.oar_integrity_sha256=installer.metadata->>'installation_oar2_sha256') or
    not exists(select 1 from public.c3_ci_role_call rc where
      rc.role_call_key=installer.metadata->>'registrar_effect_review_ref' and rc.standing='RETURNED' and
      rc.source_oar2_ref=installer.metadata->>'installation_oar2_key' and
      rc.presented_sha256=installer.metadata->>'installation_oar2_sha256' and
      rc.evidence->>'reviewed_native_source_sha256'=installer.metadata->>'source_sha256') then
    return jsonb_build_object('standing','HLD','reason','native_installer_role_review_evidence_unresolved');
  end if;
  foreach fn in array array['resolve_lapzuli_historical_actor_v1(uuid)','resolve_lapzuli_historical_source_v1(jsonb,text)',
    'resolve_lapzuli_historical_admission_v1(text,text,jsonb)','revalidate_lapzuli_historical_admission_v1(jsonb)',
    'claim_lapzuli_historical_occurrence_v1(text,text,jsonb)','consume_lapzuli_historical_worker_claim_v1(jsonb)',
    'resolve_c1me_current_internal(text)','resolve_c1me_operator_context_internal(text)'] loop
    select encode(sha256(convert_to(pg_get_functiondef(to_regprocedure('public.'||fn)),'UTF8')),'hex') into fn_hash;
    if fn_hash is null or installer.metadata->'function_hashes'->>fn is distinct from fn_hash then
      return jsonb_build_object('standing','HLD','reason','reviewed_native_function_hash_mismatch:'||fn);
    end if;
  end loop;
  -- Canonical existing rows locked against concurrent source/rights revocation.
  select * into a from public.measures_publication_distribution_asset where distribution_asset_key='undrifted_hole_map_bluesky_dist_v1' for share;
  select * into r from public.lapzuli_route where route_key='lapzuli_route_undrifted_hole_map_bluesky_dist_v1' for share;
  select * into d from public.measures_publication_derivative_asset where derivative_key='undrifted_hole_map_caption_bluesky_v1' for share;
  select * into c from public.c3_pac where pac_key='campaign_pac_undrifted_issue003_published_recovery_v1' for share;
  select * into p from public.c3_pac where pac_key='undrifted_issue003_pubpac_current_package' for share;
  select * into src from public.c3ops_asset_record where asset_key='undrifted_hole_map_article_v1' for share;
  select * into media from public.c3ops_asset_record where asset_key='undrifted_hole_map_banner_v1' for share;
  select * into ch from public.measures_distribution_channel where channel_key='bluesky_undrifted' for share;
  select * into ex from public.measures_distribution_executor where executor_key='bluesky_api' for share;
  perform 1 from public.registered_process_log where process_key=a.metadata->>'registered_standing_key' for share;
  perform 1 from public.measures_publication_dispatch where metadata->>'publication_object_key'=r.publication_object_key order by dispatch_key for share;
  perform 1 from public.lapzuli_outlet where outlet_key=r.outlet_key for share;
  perform 1 from public.lapzuli_outlet_qualification where outlet_key=r.outlet_key and desk_key=r.desk_key for share;
  perform 1 from public.lapzuli_object_profile where publication_object_key=r.publication_object_key for share;
  select * into qualification from public.lapzuli_outlet_qualification where outlet_key=r.outlet_key and desk_key=r.desk_key and
    standing in ('qualified','qualified_with_constraints') limit 1;
  select * into outlet from public.lapzuli_outlet where outlet_key=r.outlet_key;
  select * into profile from public.lapzuli_object_profile where publication_object_key=r.publication_object_key;
  select * into registered from public.registered_process_log where process_key=a.metadata->>'registered_standing_key';
  if qualification.standing is null or outlet.account_standing is distinct from 'verified' or
    (qualification.requires_ai_disclosure and not (coalesce(profile.ai_disclosure_available,false) or
      coalesce(a.payload->'ai_disclosure_required'='true'::jsonb,false) or coalesce(a.payload->'constraints'->'ai_disclosure_required'='true'::jsonb,false))) or
    (qualification.requires_original_contribution and not (coalesce(profile.researched_and_cited,false) and coalesce(profile.operator_initiated_research,false))) or
    (qualification.provenance_constraints->'not_pure_promotion'='true'::jsonb and a.payload->'constraints'->'not_pure_promotion' is distinct from 'true'::jsonb) or
    r.canonical_url is distinct from 'https://measuresregistry.com/undrifted/the-hole-in-the-map' then
    return jsonb_build_object('standing','HLD','reason','current_outlet_qualification_constraints_unresolved');
  end if;
  select * into callrow from public.lapzuli_derivative_execution_view_v1 where distribution_asset_key=a.distribution_asset_key;
  select * into dispatchrow from public.undrifted_distribution_report_v1 where publication_object_key=r.publication_object_key;
  if a.review_status is distinct from 'operator_approved' or a.approved_by_actor_key is distinct from 'op044' or
    a.metadata->'external_distribution_authorized' is distinct from 'true'::jsonb or a.metadata->'operator_confirmed' is distinct from 'true'::jsonb or
    r.route_status is distinct from 'authorized' or r.operator_confirmed is distinct from true or r.return_required is distinct from true or
    r.publication_object_key is distinct from a.publication_asset_id or r.payload_reference is distinct from a.distribution_asset_key or
    a.metadata->>'route_key' is distinct from r.route_key or a.metadata->>'derivative_key' is distinct from d.derivative_key or
    a.metadata->>'campaign_pac_key' is distinct from c.pac_key or r.metadata->>'campaign_pac_key' is distinct from c.pac_key or
    a.metadata->>'channel_key' is distinct from ch.channel_key or r.metadata->>'channel_key' is distinct from ch.channel_key or
    a.metadata->>'executor_key' is distinct from ex.executor_key or r.metadata->>'executor_key' is distinct from ex.executor_key or
    a.payload->>'canonical_url' is distinct from r.canonical_url or d.metadata->>'canonical_url' is distinct from r.canonical_url or
    d.publication_asset_id is distinct from r.publication_object_key or d.approval_status is distinct from 'operator_approved' or
    d.release_state is distinct from 'released' or d.approved_by_actor_key is distinct from 'op044' or
    d.metadata->>'source_sha256' is distinct from src.content_hash or d.metadata->>'caption_text' is distinct from a.payload->>'text' or
    c.is_effective is distinct from true or p.is_effective is distinct from true or c.pac_type is distinct from 'CampaignPac' or p.pac_type is distinct from 'PubPac' or
    c.metadata->>'source_pubpac' is distinct from p.pac_key or c.metadata->>'public_speaking_identity' is distinct from 'unDrifted' or
    not coalesce(c.metadata->'scope'->'published_objects' ? r.publication_object_key,false) or
    not coalesce(c.metadata->'scope'->'destinations' ? 'bluesky',false) or
    c.metadata->'activation'->>'state' is distinct from 'active' or
    p.metadata->'activation'->>'state' is distinct from 'active_source_for_downstream_distribution' or
    ch.status is distinct from 'active' or ch.channel_identifier is distinct from 'undrifted.bsky.social' or ch.executor_key is distinct from 'bluesky_api' or
    ex.status is distinct from 'available' or ex.supports_publish is distinct from true or
    callrow.lapzuli_callable is distinct from true or callrow.registered_operator is distinct from 'op044' or
    dispatchrow.publication_status is distinct from 'published' or dispatchrow.source_distribution_hold is distinct from false then
    return jsonb_build_object('standing','HLD','reason','current_pac_source_derivative_route_or_release_mismatch');
  end if;
  if src.standing is distinct from 'operator_approved_canonical_article' or media.standing is distinct from 'operator_approved_publication_master' or
    src.rights_holder is distinct from 'unDrifted' or media.rights_holder is distinct from 'unDrifted' or
    src.license_or_use_rights is distinct from 'operator_approved_publication_use' or media.license_or_use_rights is distinct from 'operator_approved_publication_use' or
    src.transferability is distinct from 'publication_derivatives_permitted' or media.transferability is distinct from 'publication_derivatives_permitted' or
    media.derivative_of is distinct from src.asset_key or a.payload->'media'->>'sha256' is distinct from media.content_hash or
    src.hash_algorithm is distinct from 'sha256' or media.hash_algorithm is distinct from 'sha256' or
    src.authoritative_custody_identifier is distinct from d.metadata->>'source_drive_id' or
    media.authoritative_custody_location is distinct from a.payload->'media'->>'object_path' then
    return jsonb_build_object('standing','HLD','reason','current_source_media_rights_or_custody_mismatch');
  end if;
  expected:=jsonb_build_object('campaign_pac_key',c.pac_key,'public_speaking_identity','unDrifted','source_pubpac_key',p.pac_key,
    'destination_account_key',ch.channel_key,'destination_account_identifier',ch.channel_identifier,'dry_run',false,'execute',true,
    'publication_object_key',r.publication_object_key,'derivative_key',d.derivative_key,'distribution_asset_id',a.distribution_asset_key,
    'channel_key',ch.channel_key,'channel_identifier',ch.channel_identifier,'executor_key',ex.executor_key,
    'registered_standing_key',callrow.registered_standing_key,'registered_standing',callrow.registered_standing,
    'authority_reference',r.authority_reference,'route_key',r.route_key,'operator_confirmed',true,'lapzuli_callable',true,
    'idempotency_key',a.distribution_asset_key||':'||callrow.registered_standing_key,
    'text',case when position((a.payload->>'canonical_url') in (a.payload->>'text'))>0 then a.payload->>'text' else (a.payload->>'text')||E'\n\n'||(a.payload->>'canonical_url') end,
    'canonical_url',a.payload->>'canonical_url','image_url',a.payload->>'image_url','buffer_mode','shareNow');
  tuple:=jsonb_build_object('source_class',src.asset_class,'source_id',src.asset_key,'source_version',src.asset_version,
    'source_sha256',src.content_hash,'source_hash_basis','raw_utf8_text_export_sha256','pubpac_key',p.pac_key,'pubpac_version',p.version,
    'pubpac_sha256',p.content_sha256,'campaignpac_key',c.pac_key,'campaignpac_version',c.version,'campaignpac_sha256',c.content_sha256,
    'payload_sha256',encode(sha256(convert_to(a.payload::text,'UTF8')),'hex'),'media_sha256',media.content_hash,
    'distribution_asset_key',a.distribution_asset_key,'route_key',r.route_key,'destination_account_identifier',ch.channel_identifier,
    'release_scope_key',c.pac_key||':published_object:'||r.publication_object_key,
    'operator_source_confirmation_key',a.metadata->>'operator_confirmation_source');
  source_snapshot:=jsonb_build_array(to_jsonb(a),to_jsonb(r),to_jsonb(d),to_jsonb(c),to_jsonb(p),to_jsonb(src),to_jsonb(media),to_jsonb(ch),to_jsonb(ex),
    to_jsonb(qualification),to_jsonb(outlet),to_jsonb(profile),to_jsonb(registered),to_jsonb(dispatchrow));
  -- Existing custody rail must contain a fresh, zero-effect native proof from
  -- an independently registered producer. Anonymous/user JSON cannot attest it.
  select * into proof from public.c3ops_oar_custody_resolution_event where resolution_event_key=p_proof_key for share;
  if not found or proof.object_type is distinct from 'evidence' or proof.intended_function is distinct from 'lapzuli_historical_preflight' or
    proof.resolution_status is distinct from 'resolved' or proof.standing is distinct from 'observed' or
    proof.related_oar2 is distinct from v_oar or proof.related_execution_instance is distinct from v_instance or
    proof.created_at<clock_timestamp()-interval '60 seconds' or proof.created_at>clock_timestamp() or
    proof.metadata->'external_publication_effects' is distinct from '0'::jsonb or
    proof.metadata->>'source_sha256' is distinct from src.content_hash or proof.metadata->>'media_sha256' is distinct from media.content_hash or
    proof.metadata->>'worker_request_sha256' is distinct from encode(sha256(convert_to(expected::text,'UTF8')),'hex') or
    proof.metadata->>'account_handle' is distinct from ch.channel_identifier or
    proof.metadata->'provider_identity_verified' is distinct from 'true'::jsonb or
    proof.metadata->'provider_payload_verified' is distinct from 'true'::jsonb or
    proof.integrity_hash is distinct from encode(sha256(convert_to((proof.metadata-'proof_sha256')::text,'UTF8')),'hex') then
    return jsonb_build_object('standing','HLD','reason','fresh_native_source_media_provider_evidence_unresolved');
  end if;
  select * into producer from public.c3_envpac_capability_grant where capability_key=proof.metadata->>'producer_capability_ref' for share;
  if not found or producer.standing is distinct from 'active' or
    producer.scope->>'execution_instance' is distinct from v_instance or producer.scope->>'oar_key' is distinct from v_oar or
    producer.scope->>'allowed_asset' is distinct from a.distribution_asset_key or
    producer.scope->>'allowed_route' is distinct from r.route_key or
    producer.scope->>'destination_account_identifier' is distinct from ch.channel_identifier or
    producer.scope->'max_new_external_effects' is distinct from '0'::jsonb or
    producer.scope->>'native_source_sha256' is distinct from installer.metadata->>'source_sha256' or
    not coalesce(producer.scope->'allowed_actions' ? 'attest_lapzuli_historical_preflight',false) or
    nullif(producer.scope->>'expires_at','')::timestamptz is null or not isfinite((producer.scope->>'expires_at')::timestamptz) or (producer.scope->>'expires_at')::timestamptz<=clock_timestamp() then
    return jsonb_build_object('standing','HLD','reason','native_preflight_producer_authority_unresolved');
  end if;
  deadline:=least(deadline,proof.created_at+interval '60 seconds',(producer.scope->>'expires_at')::timestamptz,
    (p_actor->>'session_expires_at')::timestamptz,coalesce((p_actor->>'owner_grant_expires_at')::timestamptz,deadline));
  if deadline<=clock_timestamp() then return jsonb_build_object('standing','HLD','reason','native_admission_expired_before_dispatch'); end if;
  return jsonb_build_object('standing','source_resolved','capabilities',caps,'effect_tuple',tuple,
    'source_passage_capability_ref',passage.capability_key,
    'native_source_sha256',installer.metadata->>'source_sha256',
    'prepared_worker_request',expected,'source_snapshot_sha256',encode(sha256(convert_to(source_snapshot::text,'UTF8')),'hex'),
    'proof_event_key',proof.resolution_event_key,'proof_sha256',proof.integrity_hash,
    'valid_until',deadline,'verified_at',clock_timestamp());
exception when invalid_text_representation or invalid_datetime_format or datetime_field_overflow then
  return jsonb_build_object('standing','HLD','reason','registered_scope_or_evidence_shape_invalid');
end $$;

create or replace function public.resolve_lapzuli_historical_admission_v1(p_token text,p_instance text,p_preflight jsonb)
returns jsonb language plpgsql security invoker set search_path='' set log_parameter_max_length_on_error='0' as $$
declare s uuid; actor jsonb; source jsonb;
begin
  if current_user<>'service_role' then return jsonb_build_object('standing','HLD','reason','trusted_service_required'); end if;
  if p_instance is distinct from 'registrar_lapzuli_native_occurrence_claim_binder_codex_003' or
    p_token is null or p_token !~ '^[a-f0-9]{64}$' then
    return jsonb_build_object('standing','HLD','reason','exact_instance_and_existing_session_required');
  end if;
  perform pg_advisory_xact_lock(hashtextextended('undrifted_hole_map_bluesky_dist_v1',0));
  select session_key into s from public.c3_env_runtime_session where token_sha256=encode(sha256(convert_to(p_token,'UTF8')),'hex');
  actor:=public.resolve_lapzuli_historical_actor_v1(s);
  if actor->>'standing'<>'identity_resolved' then return actor; end if;
  source:=public.resolve_lapzuli_historical_source_v1(actor,p_preflight->>'native_preflight_evidence_key');
  if source->>'standing'<>'source_resolved' then return source; end if;
  if source->'prepared_worker_request' is distinct from p_preflight->'prepared_worker_request' then
    return jsonb_build_object('standing','HLD','reason','prepared_payload_differs_from_registry');
  end if;
  return source||jsonb_build_object('standing','admitted','individual_authenticated',true,'operator_ref','op044',
    'execution_instance',p_instance,'source_oar2','oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003',
    'external_effect_limit',1,'actor_binding',actor,'actor_evidence_ref','registry://c3_env_runtime_session/'||s);
end $$;

create or replace function public.revalidate_lapzuli_historical_admission_v1(p_binding jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare e public.measures_distribution_execution%rowtype; actor jsonb; source jsonb; event_row public.c3ops_cancom_notification_event%rowtype;
begin
  if current_user<>'service_role' then return jsonb_build_object('standing','HLD','reason','trusted_service_required'); end if;
  perform pg_advisory_xact_lock(hashtextextended('undrifted_hole_map_bluesky_dist_v1',0));
  -- Resolve binding from the actual occurrence/claim. A supplied UUID or echoed
  -- actor metadata is not a fresh bearer authentication proof.
  select * into event_row from public.c3ops_cancom_notification_event where event_key=p_binding->>'occurrence_key' for share;
  select * into e from public.measures_distribution_execution where execution_id::text=event_row.evidence->>'execution_id' for update;
  if not found or e.metadata->'historical_occurrence' is distinct from p_binding or
    event_row.evidence-'execution_id'-'external_publication_effects' is distinct from p_binding or
    e.execution_status is distinct from 'publication_attempted' or e.platform_post_id is not null or e.platform_url is not null or
    e.source_oar2 is distinct from p_binding->>'source_oar2' or e.distribution_asset_id is distinct from 'undrifted_hole_map_bluesky_dist_v1' then
    return jsonb_build_object('standing','HLD','reason','persisted_authenticated_occurrence_claim_unresolved');
  end if;
  actor:=public.resolve_lapzuli_historical_actor_v1((p_binding->'actor_binding'->>'session_key')::uuid);
  if actor->>'standing'<>'identity_resolved' then return actor; end if;
  if actor is distinct from p_binding->'actor_binding' then return jsonb_build_object('standing','HLD','reason','authenticated_actor_binding_changed'); end if;
  source:=public.resolve_lapzuli_historical_source_v1(actor,p_binding->>'proof_event_key');
  if source->>'standing'<>'source_resolved' then return source; end if;
  if source->'effect_tuple' is distinct from p_binding->'effect_tuple' or
    source->>'source_passage_capability_ref' is distinct from p_binding->>'source_passage_capability_ref' or
    source->>'native_source_sha256' is distinct from p_binding->>'native_source_sha256' or
    source->'capabilities' is distinct from p_binding->'capabilities' or
    source->'prepared_worker_request' is distinct from p_binding->'prepared_worker_request' or
    source->>'source_snapshot_sha256' is distinct from p_binding->>'source_snapshot_sha256' or
    source->>'proof_sha256' is distinct from p_binding->>'proof_sha256' then
    return jsonb_build_object('standing','HLD','reason','source_rights_payload_or_admission_proof_changed');
  end if;
  if (source->>'valid_until')::timestamptz<=clock_timestamp() then
    return jsonb_build_object('standing','HLD','reason','native_admission_expired_before_dispatch');
  end if;
  return jsonb_build_object('standing','admitted','occurrence_key',p_binding->>'occurrence_key','external_publication_effects',0);
exception when invalid_text_representation then
  return jsonb_build_object('standing','HLD','reason','persisted_actor_reference_invalid');
end $$;

revoke all on function public.resolve_lapzuli_historical_actor_v1(uuid),public.resolve_lapzuli_historical_source_v1(jsonb,text),
  public.resolve_lapzuli_historical_admission_v1(text,text,jsonb),public.revalidate_lapzuli_historical_admission_v1(jsonb) from public,anon,authenticated;
grant execute on function public.resolve_lapzuli_historical_actor_v1(uuid),public.resolve_lapzuli_historical_source_v1(jsonb,text),
  public.resolve_lapzuli_historical_admission_v1(text,text,jsonb),public.revalidate_lapzuli_historical_admission_v1(jsonb) to service_role;
