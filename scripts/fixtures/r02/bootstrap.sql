-- DISPOSABLE SYNTHETIC ONLY: actual column/check/unique/trigger shapes; foreign-key parents omitted; provider admission stubbed.
create role anon; create role authenticated; create role service_role nologin bypassrls;
create schema extensions; create extension pgcrypto with schema extensions;
create table public.c3_envpac_capability_grant("capability_key" text not null,"envpac_key" text not null,"system_key" text not null,"capability" text not null,"scope" jsonb default '{}'::jsonb not null,"standing" text default 'active'::text not null,"evidence_ref" text,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3_oar_process_instance("process_instance_key" text not null,"source_oar2_path" text not null,"source_oar2_standing" text not null,"expected_oar1_path" text not null,"actual_oar1_path" text,"evidence_path" text,"lifecycle_type" text not null,"execution_standing" text not null,"validation_standing" text not null,"deploy_standing" text not null,"held_standing" text,"seeded_reference_standing" text not null,"correction_source_oar2_path" text,"correction_oar2_path" text,"partial_oar1_reference" text,"validation_finding" text,"correction_scope" text,"execution_result" text default ''::text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
create table public.c3_oar_transition_event("transition_event_key" text not null,"process_instance_key" text not null,"actor" text not null,"from_status" text not null,"to_status" text not null,"transition_type" text not null,"timestamp" timestamp with time zone not null,"evidence_reference" text not null,"notes" text default ''::text not null,"created_at" timestamp with time zone default now() not null);
create table public.c3ops_cancom_notification_event("id" uuid default gen_random_uuid() not null,"event_key" text not null,"event_type" text not null,"source_system" text default 'cancom'::text not null,"source_object_type" text not null,"source_object_key" text not null,"actor_key" text,"standing" text not null,"requires_operator_attention" boolean default false not null,"summary" text not null,"evidence" jsonb default '{}'::jsonb not null,"observed_at" timestamp with time zone default now() not null,"acknowledged_at" timestamp with time zone,"created_at" timestamp with time zone default now() not null);
create table public.c3ops_notchazz_oar_formation_evaluation("evaluation_key" text default (gen_random_uuid())::text not null,"oar_key" text not null,"execution_instance" text not null,"oar_integrity_sha256" text not null,"boundary_process_key" text default 'notchazz_oar_predispatch_semantic_boundary_v1'::text not null,"governed_process_key" text default 'governed_object_passage_process_v4'::text not null,"result" text not null,"result_reason" text not null,"required_predicates" jsonb not null,"unresolved_predicates" jsonb default '[]'::jsonb not null,"evaluator" text default 'notchazz'::text not null,"authority_created" boolean default false not null,"standing" text default 'active'::text not null,"created_at" timestamp with time zone default now() not null);
create table public.c3ops_oar_custody_resolution_event("resolution_event_key" text not null,"process_key" text not null,"object_identifier" text not null,"object_type" text not null,"related_system" text not null,"intended_function" text not null,"standing" text not null,"integrity_hash" text,"custody_type" text,"custody_reference" text,"retrieval_access_rule" text,"related_execution_instance" text not null,"related_oar1" text,"related_oar2" text,"resolution_status" text not null,"hold_reason" text,"transition_timestamp" timestamp with time zone default now() not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null);
create table public.system_oar_execution_evidence("evidence_key" text not null,"queue_key" text not null,"evidence_type" text not null,"evidence_summary" text not null,"validation_query" text,"validation_result" jsonb,"artifact_path" text,"commit_hash" text,"created_at" timestamp with time zone default now() not null);
create table public.system_oar_queue("queue_key" text not null,"process_key" text not null,"oar_key" text not null,"oar_type" text not null,"queue_status" text not null,"operator_key" text not null,"system_key" text not null,"scope_key" text not null,"requested_action" text not null,"execution_boundary" text not null,"preflight_status" text default 'required'::text not null,"operator_confirmed_at" timestamp with time zone,"execution_started_at" timestamp with time zone,"execution_completed_at" timestamp with time zone,"blocked_reason" text,"refusal_reason" text,"oar1_path" text,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"source_oar2_path" text,"expected_oar1_path" text,"automation_permissions" jsonb default '{}'::jsonb not null,"cody_handoff_prompt" text,"chazz_review_prompt" text,"chazz_review_prompt_generated_at" timestamp with time zone,"chazz_review_prompt_authority" text default 'thread_prompt_only'::text not null,"execution_summary" text,"db_mutation_standing" text default 'not_authorized'::text not null,"src_mutation_standing" text default 'not_authorized'::text not null,"deploy_standing" text default 'not_authorized'::text not null);
create table public.system_process_registry("id" uuid default gen_random_uuid() not null,"process_key" text not null,"process_family" text not null,"title" text not null,"status" text not null,"source_path" text not null,"authority_state" text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"process_title" text not null,"process_scope" text not null,"process_status" text not null,"authority_level" text not null,"source_reference_set" jsonb default '[]'::jsonb not null,"required_oar_type" text,"requires_operator_confirm" boolean default true not null,"requires_preflight" boolean default true not null,"requires_oar1_closeout" boolean default true not null);
alter table public.c3_envpac_capability_grant add constraint c3_envpac_capability_grant_envpac_key_system_key_capability_key UNIQUE (envpac_key, system_key, capability);
alter table public.c3_envpac_capability_grant add constraint c3_envpac_capability_grant_pkey PRIMARY KEY (capability_key);
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_deploy_standing_check CHECK ((deploy_standing = ANY (ARRAY['not_authorized'::text, 'not_applicable'::text, 'configured'::text, 'deployed'::text, 'held'::text])));
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_execution_standing_check CHECK ((execution_standing = ANY (ARRAY['not_queued'::text, 'queued'::text, 'executing'::text, 'completed'::text, 'blocked'::text, 'held'::text])));
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_held_standing_check CHECK (((held_standing IS NULL) OR (held_standing = ANY (ARRAY['held_pending_operator'::text, 'held_pending_source'::text, 'held_pending_validation'::text, 'held_pending_identity'::text, 'held_pending_deployment'::text, 'held_pending_correction_oar2'::text]))));
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_lifecycle_type_check CHECK ((lifecycle_type = ANY (ARRAY['valid'::text, 'held'::text, 'correction'::text, 'blocked'::text])));
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_pkey PRIMARY KEY (process_instance_key);
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_seeded_reference_standing_check CHECK ((seeded_reference_standing = ANY (ARRAY['seeded'::text, 'unseeded_blocked'::text, 'pending'::text])));
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_source_oar2_standing_check CHECK ((source_oar2_standing = ANY (ARRAY['confirmed'::text, 'proposed'::text, 'review_only'::text])));
alter table public.c3_oar_process_instance add constraint c3_oar_process_instance_validation_standing_check CHECK ((validation_standing = ANY (ARRAY['not_ready'::text, 'pending_validation'::text, 'automatic_pass'::text, 'chazz_review_required'::text, 'operator_required'::text, 'correction_required'::text])));
alter table public.c3_oar_transition_event add constraint c3_oar_transition_event_actor_check CHECK ((actor = ANY (ARRAY['operator'::text, 'chazz'::text, 'cody'::text, 'measures'::text, 'notchazz'::text, 'codex'::text])));
alter table public.c3_oar_transition_event add constraint c3_oar_transition_event_pkey PRIMARY KEY (transition_event_key);
alter table public.c3_oar_transition_event add constraint c3_oar_transition_event_transition_type_check CHECK ((transition_type = ANY (ARRAY['queue'::text, 'execution'::text, 'validation'::text, 'held'::text, 'correction'::text, 'seeded_reference'::text, 'deployment'::text])));
alter table public.c3ops_cancom_notification_event add constraint c3ops_cancom_notification_event_event_key_key UNIQUE (event_key);
alter table public.c3ops_cancom_notification_event add constraint c3ops_cancom_notification_event_pkey PRIMARY KEY (id);
alter table public.c3ops_notchazz_oar_formation_evaluation add constraint c3ops_notchazz_oar_formation_authority_check CHECK ((authority_created IS FALSE));
alter table public.c3ops_notchazz_oar_formation_evaluation add constraint c3ops_notchazz_oar_formation_evaluation_pkey PRIMARY KEY (evaluation_key);
alter table public.c3ops_notchazz_oar_formation_evaluation add constraint c3ops_notchazz_oar_formation_result_check CHECK ((result = ANY (ARRAY['PASS'::text, 'HOLD'::text, 'SEND'::text])));
alter table public.c3ops_notchazz_oar_formation_evaluation add constraint c3ops_notchazz_oar_formation_sha_check CHECK ((oar_integrity_sha256 ~ '^[0-9a-f]{64}$'::text));
alter table public.c3ops_notchazz_oar_formation_evaluation add constraint c3ops_notchazz_oar_formation_standing_check CHECK ((standing = ANY (ARRAY['active'::text, 'superseded'::text])));
alter table public.c3ops_oar_custody_resolution_event add constraint c3ops_oar_custody_resolution_event_held_has_reason_check CHECK (((resolution_status <> 'held'::text) OR (hold_reason IS NOT NULL)));
alter table public.c3ops_oar_custody_resolution_event add constraint c3ops_oar_custody_resolution_event_metadata_object_check CHECK ((jsonb_typeof(metadata) = 'object'::text));
alter table public.c3ops_oar_custody_resolution_event add constraint c3ops_oar_custody_resolution_event_object_type_check CHECK ((object_type = ANY (ARRAY['oar1'::text, 'oar2'::text, 'evidence'::text, 'asset'::text, 'protected_source'::text])));
alter table public.c3ops_oar_custody_resolution_event add constraint c3ops_oar_custody_resolution_event_pkey PRIMARY KEY (resolution_event_key);
alter table public.c3ops_oar_custody_resolution_event add constraint c3ops_oar_custody_resolution_event_process_key_check CHECK ((process_key = ANY (ARRAY['oar_lifecycle_resolution_v1'::text, 'oar_custody_resolution_v1'::text, 'oar_evidence_asset_custody_resolution_v1'::text])));
alter table public.c3ops_oar_custody_resolution_event add constraint c3ops_oar_custody_resolution_event_resolution_status_check CHECK ((resolution_status = ANY (ARRAY['resolved'::text, 'held'::text])));
alter table public.c3ops_oar_custody_resolution_event add constraint c3ops_oar_custody_resolution_event_resolved_has_custody_check CHECK (((resolution_status <> 'resolved'::text) OR ((custody_type IS NOT NULL) AND (custody_reference IS NOT NULL))));
alter table public.system_oar_execution_evidence add constraint system_oar_execution_evidence_pkey PRIMARY KEY (evidence_key);
alter table public.system_oar_execution_evidence add constraint system_oar_execution_evidence_type_check CHECK ((evidence_type = ANY (ARRAY['file_check'::text, 'db_query'::text, 'migration_result'::text, 'git_commit'::text, 'operator_review'::text, 'runtime_validation'::text, 'refusal_record'::text])));
alter table public.system_oar_queue add constraint system_oar_queue_chazz_prompt_thread_only_check CHECK ((chazz_review_prompt_authority = 'thread_prompt_only'::text));
alter table public.system_oar_queue add constraint system_oar_queue_closed_requires_oar1_path_check CHECK (((queue_status <> 'closed'::text) OR (oar1_path IS NOT NULL)));
alter table public.system_oar_queue add constraint system_oar_queue_completed_requires_execution_completed_check CHECK (((queue_status <> ALL (ARRAY['oar1_submitted'::text, 'completed'::text, 'closed'::text])) OR (execution_completed_at IS NOT NULL)));
alter table public.system_oar_queue add constraint system_oar_queue_deploy_standing_check CHECK ((deploy_standing = ANY (ARRAY['not_authorized'::text, 'not_applicable'::text, 'configured'::text, 'deployed'::text, 'held'::text, 'failed'::text])));
alter table public.system_oar_queue add constraint system_oar_queue_executing_requires_operator_confirm_check CHECK (((queue_status <> 'executing'::text) OR (operator_confirmed_at IS NOT NULL)));
alter table public.system_oar_queue add constraint system_oar_queue_executing_requires_passed_preflight_check CHECK (((queue_status <> 'executing'::text) OR (preflight_status = 'passed'::text)));
alter table public.system_oar_queue add constraint system_oar_queue_mutation_standing_check CHECK (((db_mutation_standing = ANY (ARRAY['not_authorized'::text, 'not_applicable'::text, 'mutated'::text, 'held'::text, 'failed'::text])) AND (src_mutation_standing = ANY (ARRAY['not_authorized'::text, 'not_applicable'::text, 'mutated'::text, 'held'::text, 'failed'::text]))));
alter table public.system_oar_queue add constraint system_oar_queue_oar1_submitted_requires_oar1_path_check CHECK (((queue_status <> 'oar1_submitted'::text) OR (oar1_path IS NOT NULL)));
alter table public.system_oar_queue add constraint system_oar_queue_oar_type_check CHECK ((oar_type = ANY (ARRAY['oar1'::text, 'oar2'::text])));
alter table public.system_oar_queue add constraint system_oar_queue_pkey PRIMARY KEY (queue_key);
alter table public.system_oar_queue add constraint system_oar_queue_preflight_status_check CHECK ((preflight_status = ANY (ARRAY['required'::text, 'passed'::text, 'failed'::text, 'waived'::text])));
alter table public.system_oar_queue add constraint system_oar_queue_queue_status_check CHECK ((queue_status = ANY (ARRAY['draft'::text, 'queued'::text, 'queued_for_cody'::text, 'preflight_required'::text, 'awaiting_operator_confirm'::text, 'approved_for_execution'::text, 'executing'::text, 'oar1_submitted'::text, 'blocked'::text, 'held'::text, 'refused'::text, 'completed'::text, 'closed'::text])));
alter table public.system_process_registry add constraint system_process_registry_pkey PRIMARY KEY (id);
alter table public.system_process_registry add constraint system_process_registry_process_key_key UNIQUE (process_key);
alter table public.system_process_registry add constraint system_process_registry_process_status_check CHECK ((process_status = ANY (ARRAY['draft'::text, 'active'::text, 'paused'::text, 'retired'::text, 'blocked'::text])));
alter table public.system_process_registry add constraint system_process_registry_required_oar_type_check CHECK (((required_oar_type IS NULL) OR (required_oar_type = ANY (ARRAY['oar1'::text, 'oar2'::text, 'both'::text]))));
grant usage on schema public,extensions to service_role; grant select,insert,update on all tables in schema public to service_role;
CREATE OR REPLACE FUNCTION public.c3_oar_prevent_transition_mutation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  raise exception 'c3_oar_transition_event is append-only';
end;
$function$
;
CREATE OR REPLACE FUNCTION public.c3_oar_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.notchazz_cancom_oar_delivery_gate_v1()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_sha text;
  v_n integer;
begin
  if new.process_key='cancom_oar_delivery_retrieval_v1'
     and new.oar_type='oar2'
     and new.queue_status='approved_for_execution' then
    v_sha := new.automation_permissions->>'canonical_sha256';

    select count(*) into v_n
    from public.c3ops_notchazz_oar_formation_evaluation e
    where e.oar_key=new.oar_key
      and e.execution_instance=new.scope_key
      and e.oar_integrity_sha256=v_sha
      and e.standing='active'
      and e.result='PASS';

    if v_n<>1 then
      raise exception 'HLD_NOTCHAZZ_OAR_FORMATION_BOUNDARY: PASS evaluation required before executor delivery';
    end if;
  end if;
  return new;
end
$function$
;
CREATE OR REPLACE FUNCTION public.system_oar_queue_prevent_queued_to_executing()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if old.queue_status = 'queued' and new.queue_status = 'executing' then
    raise exception 'system_oar_queue cannot transition automatically from queued to executing; use operator-confirmed queued_for_cody handoff';
  end if;

  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.system_oar_queue_require_closeout_evidence()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.queue_status = 'closed' and not exists (
    select 1
    from public.system_oar_execution_evidence evidence
    where evidence.queue_key = new.queue_key
  ) then
    raise exception 'system_oar_queue cannot close without execution evidence';
  end if;

  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.validate_cancom_model_resolution_evidence_v1(p_model jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare v_field text;
begin
  if jsonb_typeof(p_model) is distinct from 'object' then return false; end if;
  foreach v_field in array array['preferred_model_or_tier','selected_model_or_explicit_unverified_state',
    'fallback_level','fallback_reason','context_fit','execution_result'] loop
    if jsonb_typeof(p_model->v_field) is distinct from 'string'
      or nullif(btrim(p_model->>v_field),'') is null then return false; end if;
  end loop;
  if jsonb_typeof(p_model->'fallback_used') is distinct from 'boolean'
    or p_model->'capability_floor_passed' is distinct from 'true'::jsonb
    or jsonb_typeof(p_model->'tools_available') is distinct from 'array'
    or jsonb_array_length(p_model->'tools_available')=0
    or exists(select 1 from jsonb_array_elements(p_model->'tools_available') item
      where jsonb_typeof(item) is distinct from 'string' or nullif(btrim(item #>> '{}'),'') is null)
  then return false; end if;
  return true;
end; $function$
;create function public.validate_cancom_custody_provider_v1(text,text) returns jsonb language sql as $$select '{"standing":"admitted"}'::jsonb$$;
CREATE TRIGGER c3_oar_process_instance_set_updated_at BEFORE UPDATE ON public.c3_oar_process_instance FOR EACH ROW EXECUTE FUNCTION c3_oar_set_updated_at();
CREATE TRIGGER c3_oar_transition_event_no_delete BEFORE DELETE ON public.c3_oar_transition_event FOR EACH ROW EXECUTE FUNCTION c3_oar_prevent_transition_mutation();
CREATE TRIGGER c3_oar_transition_event_no_update BEFORE UPDATE ON public.c3_oar_transition_event FOR EACH ROW EXECUTE FUNCTION c3_oar_prevent_transition_mutation();
CREATE TRIGGER notchazz_cancom_oar_delivery_gate BEFORE INSERT ON public.system_oar_queue FOR EACH ROW EXECUTE FUNCTION notchazz_cancom_oar_delivery_gate_v1();
CREATE CONSTRAINT TRIGGER system_oar_queue_closed_requires_evidence AFTER INSERT OR UPDATE OF queue_status ON public.system_oar_queue DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION system_oar_queue_require_closeout_evidence();
CREATE TRIGGER system_oar_queue_no_queued_to_executing BEFORE UPDATE OF queue_status ON public.system_oar_queue FOR EACH ROW EXECUTE FUNCTION system_oar_queue_prevent_queued_to_executing();
CREATE TRIGGER system_oar_queue_set_updated_at BEFORE UPDATE ON public.system_oar_queue FOR EACH ROW EXECUTE FUNCTION c3_oar_set_updated_at();CREATE OR REPLACE FUNCTION public.register_cancom_oar_delivery_v1(p_manifest jsonb, p_passage jsonb, p_registrar text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_oar text;
  v_instance text;
  v_n integer;
  v_q public.system_oar_queue%rowtype;
  v_manifest_event public.c3ops_oar_custody_resolution_event%rowtype;
  v_wake public.c3ops_cancom_notification_event%rowtype;
  v_process public.c3_oar_process_instance%rowtype;
  v_transition public.c3_oar_transition_event%rowtype;
  v_manifest_expected jsonb;
  v_passage_expected jsonb;
begin
  if jsonb_typeof(p_manifest) is distinct from 'object'
     or jsonb_typeof(p_passage) is distinct from 'object' then
    return public.register_cancom_oar_delivery_v1_core(p_manifest,p_passage,p_registrar);
  end if;

  v_oar:=nullif(p_manifest->>'oar_key','');
  v_instance:=nullif(p_manifest->>'execution_instance','');

  if v_oar is null or v_instance is null then
    return public.register_cancom_oar_delivery_v1_core(p_manifest,p_passage,p_registrar);
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('cancom_delivery_oar|'||v_oar,0)
  );
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('cancom_delivery_instance|'||v_instance,0)
  );

  select count(*) into v_n
  from public.system_oar_queue q
  where q.oar_key=v_oar or q.scope_key=v_instance;

  if v_n=0 then
    if exists(
         select 1 from public.c3ops_oar_custody_resolution_event
         where resolution_event_key=v_instance||':oar2:registry_manifest_delivery'
       )
       or exists(
         select 1 from public.c3ops_cancom_notification_event
         where event_key=v_instance||':wake:001'
       )
       or exists(
         select 1 from public.c3_oar_process_instance
         where process_instance_key=v_instance
       )
       or exists(
         select 1 from public.c3_oar_transition_event
         where transition_event_key=v_instance||':register_and_queue'
       ) then
      return jsonb_build_object(
        'standing','HLD',
        'reason','delivery_retry_partial_state',
        'execution_instance',v_instance,
        'oar_key',v_oar
      );
    end if;

    return public.register_cancom_oar_delivery_v1_core(p_manifest,p_passage,p_registrar);
  end if;

  if v_n<>1 then
    return jsonb_build_object(
      'standing','HLD','reason','delivery_retry_conflict',
      'execution_instance',v_instance,'oar_key',v_oar
    );
  end if;

  select * into v_q
  from public.system_oar_queue q
  where q.oar_key=v_oar or q.scope_key=v_instance;

  if v_q.oar_key is distinct from v_oar
     or v_q.scope_key is distinct from v_instance then
    return jsonb_build_object(
      'standing','HLD','reason','delivery_retry_conflict',
      'execution_instance',v_instance,'oar_key',v_oar
    );
  end if;

  select * into v_manifest_event
  from public.c3ops_oar_custody_resolution_event
  where resolution_event_key=v_instance||':oar2:registry_manifest_delivery';

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  select * into v_wake
  from public.c3ops_cancom_notification_event
  where event_key=v_instance||':wake:001';

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  select * into v_process
  from public.c3_oar_process_instance
  where process_instance_key=v_instance;

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  select * into v_transition
  from public.c3_oar_transition_event
  where transition_event_key=v_instance||':register_and_queue';

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  v_manifest_expected:=p_manifest||jsonb_build_object(
    'manifest_key',v_oar,
    'payload_custody_provider',p_manifest->>'payload_custody_provider'
  );
  v_passage_expected:=p_passage||jsonb_build_object(
    'oar_key',v_oar,
    'queue_key',v_q.queue_key
  );

  if p_registrar is distinct from p_manifest->>'registrar_ref'
     or v_q.queue_key is distinct from 'queue_'||v_instance
     or v_q.source_oar2_path is distinct from 'registry://cancom/oar2/'||v_oar
     or v_q.expected_oar1_path is distinct from p_manifest->>'expected_return_route'
     or v_manifest_event.object_identifier is distinct from v_oar
     or v_manifest_event.object_type is distinct from 'oar2'
     or v_manifest_event.related_execution_instance is distinct from v_instance
     or v_manifest_event.related_oar2 is distinct from v_oar
     or v_manifest_event.standing is distinct from 'delivered_for_execution'
     or v_manifest_event.integrity_hash is distinct from p_manifest->>'integrity_value'
     or v_manifest_event.custody_reference is distinct from p_manifest->>'payload_custody_ref'
     or v_manifest_event.metadata is distinct from v_manifest_expected
     or v_wake.source_object_key is distinct from v_instance
     or v_wake.actor_key is distinct from p_manifest->>'executor_ref'
     or v_wake.event_type is distinct from 'executor_wake_ready'
     or v_wake.evidence is distinct from v_passage_expected
     or v_process.source_oar2_path is distinct from v_q.source_oar2_path
     or v_process.expected_oar1_path is distinct from v_q.expected_oar1_path
     or v_transition.process_instance_key is distinct from v_instance
     or v_transition.evidence_reference is distinct from
          'registry://c3ops_oar_custody_resolution_event/'||v_manifest_event.resolution_event_key then
    return jsonb_build_object(
      'standing','HLD','reason','delivery_retry_conflict',
      'execution_instance',v_instance,'oar_key',v_oar
    );
  end if;

  return jsonb_build_object(
    'standing','delivered_for_execution',
    'queue_key',v_q.queue_key,
    'manifest_event_key',v_manifest_event.resolution_event_key,
    'wake_event_key',v_wake.event_key,
    'execution_instance',v_instance,
    'oar_key',v_oar,
    'current_queue_status',v_q.queue_status,
    'idempotent',true
  );
end $function$
;
CREATE OR REPLACE FUNCTION public.register_cancom_oar_delivery_v1_core(p_manifest jsonb, p_passage jsonb, p_registrar text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_instance text := p_manifest->>'execution_instance';
  v_oar text := p_manifest->>'oar_key';
  v_executor text := p_manifest->>'executor_ref';
  v_operator text := p_manifest->>'operator_ref';
  v_cap public.c3_envpac_capability_grant%rowtype;
  v_executor_cap public.c3_envpac_capability_grant%rowtype;
  v_permissions jsonb;
  v_manifest_event text;
  v_wake_event text;
  v_queue text;
  v_required text;
  v_provider text := p_manifest->>'payload_custody_provider';
  v_provider_check jsonb;
begin
  if jsonb_typeof(p_manifest) <> 'object' or jsonb_typeof(p_passage) <> 'object' then
    return jsonb_build_object('standing','HLD','reason','invalid_manifest_or_passage');
  end if;
  foreach v_required in array array['oar_key','oar_type','execution_instance',
    'operator_ref','registrar_ref','executor_ref','objective_ref','authority_scope_ref',
    'passage_key','payload_custody_ref','payload_custody_provider','payload_revision_ref','serialization_basis',
    'integrity_value','expected_return_route','lifecycle_standing','registrar_capability_ref',
    'executor_capability_ref','operator_confirmed_at'] loop
    if nullif(btrim(p_manifest->>v_required),'') is null then
      return jsonb_build_object('standing','HLD','reason','missing_manifest_field','field',v_required);
    end if;
  end loop;
  if p_manifest->>'oar_type' <> 'oar2'
     or p_manifest->>'registrar_ref' <> p_registrar
     or p_manifest->>'passage_key' <> v_instance
     or p_manifest->>'lifecycle_standing' <> 'delivered_for_execution'
     or p_manifest->>'serialization_basis' <> 'utf8_raw_bytes_sha256'
     or p_manifest->>'integrity_value' !~ '^[0-9a-f]{64}$'
     or p_manifest->>'payload_revision_ref' <> 'sha256:'||(p_manifest->>'integrity_value')
     or v_provider !~ '^[a-z][a-z0-9_]*$'

     or p_manifest->>'expected_return_route' <> 'registry://cancom/oar1_return/'||v_instance
     or p_manifest->>'authority_scope_ref' <> 'capability:'||(p_manifest->>'executor_capability_ref')
     or coalesce(p_manifest->>'payload_bytes','') !~ '^[1-9][0-9]*$' then
    return jsonb_build_object('standing','HLD','reason','manifest_boundary_conflict');
  end if;

  v_provider_check := public.validate_cancom_custody_provider_v1(v_provider,p_manifest->>'payload_custody_ref');
  if v_provider_check->>'standing'<>'admitted' then return v_provider_check; end if;

  select * into v_cap from public.c3_envpac_capability_grant g
   where g.capability_key=p_manifest->>'registrar_capability_ref'
     and g.standing='active' and g.system_key='c3ops'
     and g.scope->>'actor_ref'=p_registrar
     and g.scope->>'execution_instance'=v_instance
     and g.scope->>'oar_key'=v_oar
     and g.scope->>'operator_ref'=v_operator;
  if not found or not (v_cap.scope->'allowed_actions' ? 'register_oar_delivery')
     or coalesce((v_cap.scope->>'operator_confirmed')::boolean,false) is not true
     or v_cap.scope->>'operator_confirmed_at' <> p_manifest->>'operator_confirmed_at' then
    return jsonb_build_object('standing','HLD','reason','registrar_capability_unresolved');
  end if;
  select * into v_executor_cap from public.c3_envpac_capability_grant g
   where g.capability_key=p_manifest->>'executor_capability_ref'
     and g.standing='active' and g.system_key='c3ops'
     and g.scope->>'executor_ref'=v_executor
     and g.scope->>'execution_instance'=v_instance
     and g.scope->>'oar_key'=v_oar
     and g.scope->>'process_key'='cancom_oar_delivery_retrieval_v1';
  if not found or not (v_executor_cap.scope->'allowed_actions' ? 'resolve_registry_manifest') then
    return jsonb_build_object('standing','HLD','reason','executor_capability_unresolved');
  end if;
  if not exists(select 1 from public.system_process_registry p
      where p.process_key='cancom_oar_delivery_retrieval_v1' and p.process_status='active') then
    return jsonb_build_object('standing','HLD','reason','process_not_active');
  end if;
  if exists(select 1 from public.system_oar_queue q
      where q.oar_key=v_oar or q.scope_key=v_instance) then
    return jsonb_build_object('standing','HLD','reason','oar_or_instance_already_registered');
  end if;
  foreach v_required in array array['passage_key','communication_type','origin_environment',
    'asserted_sender','resolved_actor','relation_ref','thread_ref','payload_ref',
    'payload_custody_ref','transport_adapter','receiving_environment','audience_role',
    'authority_scope_ref','integrity_basis','integrity_value','return_route',
    'evidence_state','optics_state','standing'] loop
    if nullif(btrim(p_passage->>v_required),'') is null then
      return jsonb_build_object('standing','HLD','reason','missing_passage_field','field',v_required);
    end if;
  end loop;
  if p_passage->>'passage_key' <> v_instance
     or p_passage->>'execution_instance' <> v_instance
     or p_passage->>'relation_ref' <> v_oar
     or p_passage->>'thread_ref' <> v_instance
     or p_passage->>'payload_ref' <> p_manifest->>'payload_custody_ref'
     or p_passage->>'payload_custody_ref' <> p_manifest->>'payload_custody_ref'
     or p_passage->>'integrity_basis' <> p_manifest->>'serialization_basis'
     or p_passage->>'integrity_value' <> p_manifest->>'integrity_value'
     or p_passage->>'authority_scope_ref' <> p_manifest->>'authority_scope_ref'
     or p_passage->>'return_route' <> p_manifest->>'expected_return_route'
     or p_passage->>'receiving_environment' <> 'executor:'||v_executor
     or p_passage->>'resolved_actor' <> p_registrar
     or p_passage->>'communication_type' <> 'oar2_execution_passage'
     or p_passage->>'optics_state' <> 'executor_bounded'
     or p_passage->>'standing' <> 'ready_for_executor_pickup'
     or p_passage->>'audience_role' <> 'direct_executor'
     or p_passage->>'evidence_state' <> 'ready_for_preflight' then
    return jsonb_build_object('standing','HLD','reason','passage_boundary_conflict');
  end if;

  v_queue := 'queue_'||v_instance;
  v_manifest_event := v_instance||':oar2:registry_manifest_delivery';
  v_wake_event := v_instance||':wake:001';
  v_permissions := jsonb_build_object(
    'executor_binding_mode','specific_executor','executor_ref',v_executor,
    'passage_key',v_instance,'capability_ref',v_executor_cap.capability_key,
    'required_capability',v_executor_cap.capability,
    'canonical_payload_ref',p_manifest->>'payload_custody_ref',
    'payload_custody_provider',v_provider,
    'canonical_sha256',p_manifest->>'integrity_value',
    'canonical_payload_bytes',(p_manifest->>'payload_bytes')::bigint,
    'serialization_basis','utf8_raw_bytes_sha256',
    'db_mutation',coalesce((v_executor_cap.scope->>'db_mutation_authorized')::boolean,false),
    'src_mutation',coalesce((v_executor_cap.scope->>'source_mutation_authorized')::boolean,false),
    'deploy',coalesce((v_executor_cap.scope->>'deployment_authorized')::boolean,false),
    'external_correspondence',coalesce((v_executor_cap.scope->>'external_correspondence_authorized')::boolean,false),
    'requires_oar1_return',true);
  if v_executor_cap.scope->'model_resolution_policy'->>'oar1_model_resolution_evidence_required'='true' then
    if nullif(btrim(v_executor_cap.scope->'execution_profile'->>'minimum_capability_floor'),'') is null then
      return jsonb_build_object('standing','HLD','reason','model_execution_profile_unresolved');
    end if;
    v_permissions := v_permissions || jsonb_build_object(
      'execution_profile_process','oar_execution_profile_model_resolution_v1',
      'model_resolution_evidence_required',true,
      'minimum_capability_floor',v_executor_cap.scope->'execution_profile'->>'minimum_capability_floor');
  end if;

  insert into public.system_oar_queue(queue_key,process_key,oar_key,oar_type,queue_status,
    operator_key,system_key,scope_key,requested_action,execution_boundary,preflight_status,
    operator_confirmed_at,source_oar2_path,expected_oar1_path,automation_permissions)
  values(v_queue,'cancom_oar_delivery_retrieval_v1',v_oar,'oar2','approved_for_execution',
    v_operator,'c3ops',v_instance,p_manifest->>'objective_ref',
    coalesce(p_manifest->>'execution_boundary','bounded_oar_execution'),
    'passed',(p_manifest->>'operator_confirmed_at')::timestamptz,
    'registry://cancom/oar2/'||v_oar,
    p_manifest->>'expected_return_route',v_permissions);
  insert into public.c3ops_oar_custody_resolution_event(
    resolution_event_key,process_key,object_identifier,object_type,related_system,
    intended_function,standing,integrity_hash,custody_type,custody_reference,
    retrieval_access_rule,related_execution_instance,related_oar2,resolution_status,metadata)
  values(v_manifest_event,'oar_custody_resolution_v1',v_oar,'oar2','c3ops',
    'registry_manifest_delivery','delivered_for_execution',p_manifest->>'integrity_value',
    'registry_manifest_with_immutable_source_payload',p_manifest->>'payload_custody_ref',
    'resolve_by:oar_key|'||v_oar||';passage|'||v_instance||';execution|'||v_instance,
    v_instance,v_oar,'resolved',
    p_manifest || jsonb_build_object('manifest_key',v_oar,
      'payload_custody_provider',v_provider));
  insert into public.c3_oar_process_instance(
    process_instance_key,source_oar2_path,source_oar2_standing,expected_oar1_path,
    evidence_path,lifecycle_type,execution_standing,validation_standing,deploy_standing,
    seeded_reference_standing,validation_finding)
  values(v_instance,'registry://cancom/oar2/'||v_oar,'confirmed',
    p_manifest->>'expected_return_route',
    'registry://c3ops_oar_custody_resolution_event/'||v_manifest_event,
    'valid','queued','pending_validation','held','seeded',
    'Registrar delivery registered; executor preflight pending.');
  insert into public.c3_oar_transition_event(
    transition_event_key,process_instance_key,actor,from_status,to_status,
    transition_type,"timestamp",evidence_reference,notes)
  values(v_instance||':register_and_queue',v_instance,p_registrar,'not_queued','queued',
    'queue',now(),'registry://c3ops_oar_custody_resolution_event/'||v_manifest_event,
    'Registry manifest, CanCom passage, and process instance registered together.');
  insert into public.c3ops_cancom_notification_event(
    event_key,event_type,source_system,source_object_type,source_object_key,
    actor_key,standing,requires_operator_attention,summary,evidence)
  values(v_wake_event,'executor_wake_ready','cancom','oar2_execution_instance',
    v_instance,v_executor,'ready_for_executor_pickup',false,
    'Registry-resolved CanCom OAR passage ready for executor pickup.',
    p_passage || jsonb_build_object('oar_key',v_oar,'queue_key',v_queue));
  return jsonb_build_object('standing','delivered_for_execution','queue_key',v_queue,
    'manifest_event_key',v_manifest_event,'wake_event_key',v_wake_event,
    'execution_instance',v_instance,'oar_key',v_oar);
end;
$function$
;
CREATE OR REPLACE FUNCTION public.register_cancom_oar_return_v1(p_execution_instance text, p_executor text, p_oar1_key text, p_integrity_sha256 text, p_custody_reference text, p_return_standing text, p_evidence jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_q public.system_oar_queue%rowtype;
  v_process public.c3_oar_process_instance%rowtype;
  v_event public.c3ops_oar_custody_resolution_event%rowtype;
  v_transition public.c3_oar_transition_event%rowtype;
  v_exec_evidence public.system_oar_execution_evidence%rowtype;
  v_q_count integer;
  v_event_count integer;
  v_has_return_state boolean:=false;
  v_event_key text;
  v_event_ref text;
  v_expected_execution_standing text;
begin
  if nullif(btrim(coalesce(p_execution_instance,'')),'') is null then
    return public.register_cancom_oar_return_v1_core(
      p_execution_instance,p_executor,p_oar1_key,p_integrity_sha256,
      p_custody_reference,p_return_standing,p_evidence
    );
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('cancom_oar1_return|'||p_execution_instance,0)
  );

  select count(*) into v_q_count
  from public.system_oar_queue
  where scope_key=p_execution_instance;

  if v_q_count=1 then
    select * into v_q
    from public.system_oar_queue
    where scope_key=p_execution_instance;

    select * into v_process
    from public.c3_oar_process_instance
    where process_instance_key=p_execution_instance;

    v_has_return_state :=
      v_q.queue_status in ('oar1_submitted','completed','closed')
      or v_q.oar1_path is not null
      or (found and v_process.actual_oar1_path is not null);
  elsif v_q_count>1 then
    return jsonb_build_object(
      'standing','HLD','reason','return_retry_conflict',
      'execution_instance',p_execution_instance
    );
  end if;

  select count(*) into v_event_count
  from public.c3ops_oar_custody_resolution_event
  where object_type='oar1'
    and intended_function='cancom_oar_return'
    and related_execution_instance=p_execution_instance;

  if v_event_count>0
     or exists(
       select 1 from public.c3_oar_transition_event
       where transition_event_key=p_execution_instance||':oar1_return'
     )
     or exists(
       select 1 from public.system_oar_execution_evidence
       where evidence_key=p_execution_instance||':oar1_return'
     ) then
    v_has_return_state:=true;
  end if;

  if not v_has_return_state then
    return public.register_cancom_oar_return_v1_core(
      p_execution_instance,p_executor,p_oar1_key,p_integrity_sha256,
      p_custody_reference,p_return_standing,p_evidence
    );
  end if;

  if v_q_count<>1 or v_event_count<>1 then
    return jsonb_build_object(
      'standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance
    );
  end if;

  select * into v_process
  from public.c3_oar_process_instance
  where process_instance_key=p_execution_instance;
  if not found then
    return jsonb_build_object('standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance);
  end if;

  select * into v_event
  from public.c3ops_oar_custody_resolution_event
  where object_type='oar1'
    and intended_function='cancom_oar_return'
    and related_execution_instance=p_execution_instance;

  select * into v_transition
  from public.c3_oar_transition_event
  where transition_event_key=p_execution_instance||':oar1_return';
  if not found then
    return jsonb_build_object('standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance);
  end if;

  select * into v_exec_evidence
  from public.system_oar_execution_evidence
  where evidence_key=p_execution_instance||':oar1_return';
  if not found then
    return jsonb_build_object('standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance);
  end if;

  v_event_key:=p_execution_instance||':oar1:'||p_oar1_key;
  v_event_ref:='registry://c3ops_oar_custody_resolution_event/'||v_event.resolution_event_key;
  v_expected_execution_standing:=
    case when p_return_standing='held_for_registrar_review' then 'held' else 'completed' end;

  if v_event.resolution_event_key is distinct from v_event_key
     or v_event.object_identifier is distinct from p_oar1_key
     or v_event.related_oar1 is distinct from p_oar1_key
     or v_event.related_oar2 is distinct from v_q.oar_key
     or v_event.integrity_hash is distinct from p_integrity_sha256
     or v_event.custody_reference is distinct from p_custody_reference
     or v_event.standing is distinct from p_return_standing
     or v_event.metadata->>'executor_ref' is distinct from p_executor
     or v_event.metadata->>'origin_oar2_key' is distinct from v_q.oar_key
     or v_event.metadata->>'expected_return_route' is distinct from v_q.expected_oar1_path
     or v_event.metadata->'evidence' is distinct from p_evidence
     or v_q.oar1_path is distinct from v_q.expected_oar1_path
     or v_q.queue_status not in ('oar1_submitted','completed','closed')
     or v_process.actual_oar1_path is distinct from v_q.expected_oar1_path
     or v_process.evidence_path is distinct from v_event_ref
     or v_process.execution_standing is distinct from v_expected_execution_standing
     or v_transition.process_instance_key is distinct from p_execution_instance
     or v_transition.evidence_reference is distinct from v_event_ref
     or v_exec_evidence.queue_key is distinct from v_q.queue_key
     or v_exec_evidence.validation_result is distinct from p_evidence
     or v_exec_evidence.artifact_path is distinct from v_event_ref then
    return jsonb_build_object(
      'standing','HLD','reason','return_retry_conflict',
      'execution_instance',p_execution_instance,
      'existing_return_event_key',v_event.resolution_event_key
    );
  end if;

  return jsonb_build_object(
    'standing',v_event.standing,
    'return_event_key',v_event.resolution_event_key,
    'origin_oar2_key',v_q.oar_key,
    'execution_instance',p_execution_instance,
    'passage_key',p_execution_instance,
    'return_route',v_q.expected_oar1_path,
    'current_queue_status',v_q.queue_status,
    'current_execution_standing',v_process.execution_standing,
    'idempotent',true,
    'lifecycle_rails',jsonb_build_array(
      'system_oar_queue','c3_oar_process_instance','c3_oar_transition_event',
      'system_oar_execution_evidence','c3ops_oar_custody_resolution_event'
    )
  );
end $function$
;
CREATE OR REPLACE FUNCTION public.register_cancom_oar_return_v1_core(p_execution_instance text, p_executor text, p_oar1_key text, p_integrity_sha256 text, p_custody_reference text, p_return_standing text, p_evidence jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_pickup jsonb;
  v_q public.system_oar_queue%rowtype;
  v_p public.c3_oar_process_instance%rowtype;
  v_key text;
  v_db text;
  v_src text;
  v_deploy text;
  v_started timestamptz;
  v_finished timestamptz := now();
  v_held boolean;
begin
  v_pickup := public.resolve_cancom_oar_pickup_v1('execution_instance',p_execution_instance,p_executor);
  if v_pickup->>'standing' <> 'resolved_for_executor' then
    return jsonb_build_object('standing','HLD','reason','pickup_preflight_failed','pickup',v_pickup);
  end if;
  if exists(select 1 from public.system_oar_queue q
    where q.queue_key=v_pickup->>'queue_key'
      and q.automation_permissions->>'model_resolution_evidence_required'='true')
    and (not exists(select 1 from public.system_process_registry r
      where r.process_key='oar1_model_resolution_return_contract_v1' and r.process_status='active')
      or not public.validate_cancom_model_resolution_evidence_v1(
        p_evidence->'model_resolution_evidence')) then
    return jsonb_build_object('standing','HLD','reason','HLD_MODEL_RESOLUTION_EVIDENCE_REQUIRED');
  end if;
  if nullif(btrim(p_oar1_key),'') is null or nullif(btrim(p_custody_reference),'') is null
    or p_integrity_sha256 !~ '^[0-9a-f]{64}$'
    or p_return_standing not in ('returned_for_registrar_review','held_for_registrar_review')
    or jsonb_typeof(p_evidence) is distinct from 'object'
    or nullif(p_evidence->>'execution_summary','') is null
    or nullif(p_evidence->>'validation_summary','') is null
    or p_evidence->>'origin_oar2_key' is distinct from v_pickup->>'oar_key'
    or p_evidence->>'canonical_payload_ref' is distinct from v_pickup->>'payload_custody_ref'
    or p_evidence->>'canonical_sha256' is distinct from v_pickup->>'sha256' then
    return jsonb_build_object('standing','HLD','reason','invalid_return_manifest');
  end if;
  v_db := p_evidence->>'db_mutation_standing';
  v_src := p_evidence->>'src_mutation_standing';
  v_deploy := p_evidence->>'deploy_standing';
  if v_db is null or v_src is null or v_deploy is null
    or v_db not in ('not_applicable','mutated','held','failed')
    or v_src not in ('not_applicable','mutated','held','failed')
    or v_deploy not in ('not_authorized','not_applicable','configured','deployed','held','failed')
    or (v_deploy='deployed' and v_pickup->>'deployment_authorized' <> 'true')
    or coalesce(p_evidence->>'external_messages_sent','') !~ '^[0-9]+$' then
    return jsonb_build_object('standing','HLD','reason','mutation_standing_invalid');
  end if;
  if v_pickup->>'external_correspondence_authorized' <> 'true'
    and (p_evidence->>'external_messages_sent')::integer <> 0 then
    return jsonb_build_object('standing','HLD','reason','external_effect_boundary');
  end if;
  v_held := p_return_standing='held_for_registrar_review';
  if v_held and nullif(p_evidence->>'hold_reason','') is null then
    return jsonb_build_object('standing','HLD','reason','missing_hold_reason');
  end if;
  select * into v_q from public.system_oar_queue where queue_key=v_pickup->>'queue_key' for update;
  select * into v_p from public.c3_oar_process_instance where process_instance_key=p_execution_instance for update;
  if not found or v_p.source_oar2_path <> v_q.source_oar2_path
    or v_p.expected_oar1_path <> v_q.expected_oar1_path
    or v_q.queue_status not in ('approved_for_execution','executing')
    or v_p.execution_standing not in ('queued','executing') then
    return jsonb_build_object('standing','HLD','reason','lifecycle_boundary_conflict');
  end if;
  v_key := p_execution_instance||':oar1:'||p_oar1_key;
  if exists(select 1 from public.c3ops_oar_custody_resolution_event where resolution_event_key=v_key)
    or exists(select 1 from public.c3_oar_transition_event where transition_event_key=p_execution_instance||':oar1_return')
    or exists(select 1 from public.system_oar_execution_evidence where evidence_key=p_execution_instance||':oar1_return') then
    return jsonb_build_object('standing','HLD','reason','return_already_registered');
  end if;
  v_started := coalesce(v_q.execution_started_at, v_finished);
  insert into public.c3ops_oar_custody_resolution_event(
    resolution_event_key,process_key,object_identifier,object_type,related_system,
    intended_function,standing,integrity_hash,custody_type,custody_reference,
    retrieval_access_rule,related_execution_instance,related_oar1,related_oar2,
    resolution_status,hold_reason,metadata)
  values(v_key,'oar_custody_resolution_v1',p_oar1_key,'oar1',v_q.system_key,
    'cancom_oar_return',p_return_standing,p_integrity_sha256,'registry_return_manifest',
    p_custody_reference,'resolve_by:execution:'||p_execution_instance,
    p_execution_instance,p_oar1_key,v_q.oar_key,
    case when v_held then 'held' else 'resolved' end,
    case when v_held then p_evidence->>'hold_reason' else null end,
    jsonb_build_object('oar_key',p_oar1_key,'oar_type','oar1','execution_instance',p_execution_instance,
      'passage_key',p_execution_instance,'origin_oar2_key',v_q.oar_key,
      'origin_manifest_event_key',v_pickup->>'manifest_event_key',
      'origin_wake_event_key',v_pickup->>'wake_event_key',
      'executor_ref',p_executor,'authority_scope_ref',v_pickup->>'authority_scope_ref',
      'payload_custody_ref',p_custody_reference,'serialization_basis','utf8_raw_bytes_sha256',
      'integrity_value',p_integrity_sha256,'expected_return_route',v_pickup->>'return_route',
      'lifecycle_standing',p_return_standing,'evidence',p_evidence));
  update public.system_oar_queue set queue_status='oar1_submitted',
    execution_started_at=v_started,execution_completed_at=v_finished,
    db_mutation_standing=v_db,src_mutation_standing=v_src,deploy_standing=v_deploy,
    oar1_path=v_pickup->>'return_route',
    execution_summary=p_evidence->>'execution_summary',updated_at=v_finished
    where queue_key=v_q.queue_key;
  update public.c3_oar_process_instance set actual_oar1_path=v_pickup->>'return_route',
    evidence_path='registry://c3ops_oar_custody_resolution_event/'||v_key,
    execution_standing=case when v_held then 'held' else 'completed' end,
    validation_standing='chazz_review_required',
    held_standing=case when v_held then 'held_pending_validation' else null end,
    validation_finding=p_evidence->>'validation_summary',
    execution_result=p_evidence->>'execution_summary',updated_at=v_finished
    where process_instance_key=p_execution_instance;
  insert into public.c3_oar_transition_event(transition_event_key,process_instance_key,actor,
    from_status,to_status,transition_type,"timestamp",evidence_reference,notes)
  values(p_execution_instance||':oar1_return',p_execution_instance,p_executor,
    v_p.execution_standing,case when v_held then 'held' else 'completed' end,
    case when v_held then 'held' else 'execution' end,v_finished,
    'registry://c3ops_oar_custody_resolution_event/'||v_key,
    'Registry-bound OAR1 return; Registrar review required.');
  insert into public.system_oar_execution_evidence(evidence_key,queue_key,evidence_type,
    evidence_summary,validation_result,artifact_path)
  values(p_execution_instance||':oar1_return',v_q.queue_key,'runtime_validation',
    p_evidence->>'validation_summary',p_evidence,
    'registry://c3ops_oar_custody_resolution_event/'||v_key);
  return jsonb_build_object('standing',p_return_standing,'return_event_key',v_key,
    'origin_oar2_key',v_q.oar_key,'execution_instance',p_execution_instance,
    'passage_key',p_execution_instance,'return_route',v_pickup->>'return_route',
    'lifecycle_rails',jsonb_build_array('system_oar_queue','c3_oar_process_instance',
      'c3_oar_transition_event','system_oar_execution_evidence','c3ops_oar_custody_resolution_event'));
end; $function$
;
CREATE OR REPLACE FUNCTION public.resolve_cancom_oar_pickup_v1(p_key_type text, p_key text, p_executor text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare
  v_q public.system_oar_queue%rowtype;
  v_manifest public.c3ops_oar_custody_resolution_event%rowtype;
  v_wake public.c3ops_cancom_notification_event%rowtype;
  v_cap public.c3_envpac_capability_grant%rowtype;
  v_n integer;
  v_a jsonb;
  v_e jsonb;
  v_provider text;
  v_provider_check jsonb;
begin
  if p_key_type not in ('oar_key','passage_key','execution_instance')
    or nullif(btrim(p_key),'') is null or nullif(btrim(p_executor),'') is null then
    return jsonb_build_object('standing','HLD','reason','invalid_lookup');
  end if;

  select count(*) into v_n from public.system_oar_queue q
   where (p_key_type = 'oar_key' and q.oar_key = p_key)
      or (p_key_type in ('passage_key','execution_instance') and q.scope_key = p_key);
  if v_n <> 1 then
    return jsonb_build_object('standing','HLD','reason','manifest_missing_or_ambiguous','count',v_n);
  end if;
  select * into v_q from public.system_oar_queue q
   where (p_key_type = 'oar_key' and q.oar_key = p_key)
      or (p_key_type in ('passage_key','execution_instance') and q.scope_key = p_key);
  v_a := v_q.automation_permissions;
  v_provider := coalesce(nullif(v_a->>'payload_custody_provider',''),
    case when v_a->>'canonical_payload_ref' like 'drive_file:%' then 'drive' end);
  if v_q.process_key <> 'cancom_oar_delivery_retrieval_v1'
     or v_q.oar_type <> 'oar2'
     or v_q.queue_status not in ('approved_for_execution','executing','oar1_submitted','completed')
     or v_q.preflight_status <> 'passed' or v_q.operator_confirmed_at is null
     or coalesce(v_a->>'executor_binding_mode','') <> 'specific_executor'
     or coalesce(v_a->>'executor_ref','') <> p_executor
     or coalesce(v_a->>'passage_key','') <> v_q.scope_key
     or coalesce(v_a->>'capability_ref','') = ''
     or coalesce(v_a->>'canonical_payload_ref','') = ''
     or coalesce(v_a->>'canonical_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(v_a->>'serialization_basis','') <> 'utf8_raw_bytes_sha256'
     or coalesce(v_a->>'canonical_payload_bytes','') !~ '^[1-9][0-9]*$'
     or coalesce(v_provider,'') !~ '^[a-z][a-z0-9_]*$'
 then
    return jsonb_build_object('standing','HLD','reason','queue_or_manifest_boundary');
  end if;

  v_provider_check := public.validate_cancom_custody_provider_v1(v_provider,v_a->>'canonical_payload_ref');
  if v_provider_check->>'standing'<>'admitted' then return v_provider_check; end if;

  select count(*) into v_n from public.c3ops_oar_custody_resolution_event c
   where c.object_type='oar2' and c.object_identifier=v_q.oar_key
     and c.related_execution_instance=v_q.scope_key
     and c.custody_reference=v_a->>'canonical_payload_ref'
     and lower(c.integrity_hash)=v_a->>'canonical_sha256'
     and c.metadata->>'serialization_basis'=v_a->>'serialization_basis'
     and (c.metadata->>'payload_revision_ref'='sha256:'||(v_a->>'canonical_sha256')
       or (v_provider='drive' and c.metadata->>'payload_revision_ref' is null))
     and c.standing='delivered_for_execution' and c.resolution_status='resolved';
  if v_n <> 1 then
    return jsonb_build_object('standing','HLD','reason','canonical_payload_binding_missing_or_ambiguous','count',v_n);
  end if;
  select * into v_manifest from public.c3ops_oar_custody_resolution_event c
   where c.object_type='oar2' and c.object_identifier=v_q.oar_key
     and c.related_execution_instance=v_q.scope_key
     and c.custody_reference=v_a->>'canonical_payload_ref'
     and lower(c.integrity_hash)=v_a->>'canonical_sha256'
     and c.metadata->>'serialization_basis'=v_a->>'serialization_basis'
     and (c.metadata->>'payload_revision_ref'='sha256:'||(v_a->>'canonical_sha256')
       or (v_provider='drive' and c.metadata->>'payload_revision_ref' is null))
     and c.standing='delivered_for_execution' and c.resolution_status='resolved';

  select count(*) into v_n from public.c3ops_cancom_notification_event n
   where n.source_object_key=v_q.scope_key and n.event_type='executor_wake_ready'
     and n.actor_key=p_executor and n.standing='ready_for_executor_pickup'
     and n.evidence->>'oar_key'=v_q.oar_key
     and n.evidence->>'queue_key'=v_q.queue_key;
  if v_n <> 1 then
    return jsonb_build_object('standing','HLD','reason','passage_missing_or_ambiguous','count',v_n);
  end if;
  select * into v_wake from public.c3ops_cancom_notification_event n
   where n.source_object_key=v_q.scope_key and n.event_type='executor_wake_ready'
     and n.actor_key=p_executor and n.standing='ready_for_executor_pickup'
     and n.evidence->>'oar_key'=v_q.oar_key
     and n.evidence->>'queue_key'=v_q.queue_key;
  v_e := v_wake.evidence;
  if coalesce(v_e->>'execution_instance','') <> v_q.scope_key
     or coalesce(v_e->>'passage_key','') <> v_q.scope_key
     or coalesce(v_e->>'relation_ref','') <> v_q.oar_key
     or coalesce(v_e->>'thread_ref','') <> v_q.scope_key
     or coalesce(v_e->>'payload_custody_ref','') <> v_a->>'canonical_payload_ref'
     or coalesce(v_e->>'integrity_value','') <> v_a->>'canonical_sha256'
     or coalesce(v_e->>'integrity_basis','') <> v_a->>'serialization_basis'
     or coalesce(v_e->>'authority_scope_ref','') <> 'capability:'||(v_a->>'capability_ref')
     or coalesce(v_e->>'receiving_environment','') <> 'executor:'||p_executor
     or coalesce(v_e->>'return_route','') <> v_q.expected_oar1_path
     or coalesce(v_e->>'optics_state','') <> 'executor_bounded'
     or coalesce(v_e->>'audience_role','') <> 'direct_executor'
     or coalesce(v_e->>'asserted_sender','') = ''
     or coalesce(v_e->>'resolved_actor','') = ''
     or coalesce(v_e->>'origin_environment','') = ''
     or coalesce(v_e->>'transport_adapter','') = ''
     or coalesce(v_e->>'communication_type','') <> 'oar2_execution_passage'
     or coalesce(v_e->>'evidence_state','') <> 'ready_for_preflight' then
    return jsonb_build_object('standing','HLD','reason','passage_field_conflict');
  end if;

  select * into v_cap from public.c3_envpac_capability_grant g
   where g.capability_key=v_a->>'capability_ref' and g.standing='active'
     and g.capability=v_a->>'required_capability'
     and g.scope->>'executor_ref'=p_executor
     and g.scope->>'execution_instance'=v_q.scope_key
     and g.scope->>'oar_key'=v_q.oar_key
     and g.scope->>'process_key'=v_q.process_key;
  if not found or not (v_cap.scope->'allowed_actions' ?& array['resolve_registry_manifest',
      'resolve_cancom_passage','retrieve_canonical_payload']) then
    return jsonb_build_object('standing','HLD','reason','executor_capability_unresolved');
  end if;
  return jsonb_build_object(
    'standing','resolved_for_executor','queue_key',v_q.queue_key,
    'queue_status',v_q.queue_status,'oar_key',v_q.oar_key,
    'execution_instance',v_q.scope_key,'passage_key',v_q.scope_key,
    'wake_event_key',v_wake.event_key,'manifest_event_key',v_manifest.resolution_event_key,
    'executor_ref',p_executor,'capability_ref',v_cap.capability_key,
    'authority_scope_ref',v_e->>'authority_scope_ref',
    'payload_custody_ref',v_a->>'canonical_payload_ref',
    'payload_custody_provider',v_provider,
    'payload_bytes',(v_a->>'canonical_payload_bytes')::bigint,
    'serialization_basis',v_a->>'serialization_basis',
    'sha256',v_a->>'canonical_sha256',
    'return_route',v_q.expected_oar1_path,
    'external_correspondence_authorized',v_cap.scope->'external_correspondence_authorized',
    'deployment_authorized',v_cap.scope->'deployment_authorized');
end;
$function$
;
revoke all on function public.register_cancom_oar_delivery_v1_core(jsonb,jsonb,text),public.register_cancom_oar_return_v1_core(text,text,text,text,text,text,jsonb) from public,anon,authenticated,service_role;
