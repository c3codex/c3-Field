-- DISPOSABLE SYNTHETIC ONLY: actual column/check/unique/trigger shapes; foreign-key parents omitted; provider admission stubbed.
create role anon;
 create role authenticated;
 create role service_role nologin bypassrls;

create schema extensions;
 create extension pgcrypto with schema extensions;

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

grant usage on schema public,extensions to service_role;
 grant select,insert,update on all tables in schema public to service_role;

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
;
create function public.validate_cancom_custody_provider_v1(text,text) returns jsonb language sql as $$select '{"standing":"admitted"}'::jsonb$$;

CREATE TRIGGER c3_oar_process_instance_set_updated_at BEFORE UPDATE ON public.c3_oar_process_instance FOR EACH ROW EXECUTE FUNCTION c3_oar_set_updated_at();

CREATE TRIGGER c3_oar_transition_event_no_delete BEFORE DELETE ON public.c3_oar_transition_event FOR EACH ROW EXECUTE FUNCTION c3_oar_prevent_transition_mutation();

CREATE TRIGGER c3_oar_transition_event_no_update BEFORE UPDATE ON public.c3_oar_transition_event FOR EACH ROW EXECUTE FUNCTION c3_oar_prevent_transition_mutation();

CREATE TRIGGER notchazz_cancom_oar_delivery_gate BEFORE INSERT ON public.system_oar_queue FOR EACH ROW EXECUTE FUNCTION notchazz_cancom_oar_delivery_gate_v1();

CREATE CONSTRAINT TRIGGER system_oar_queue_closed_requires_evidence AFTER INSERT OR UPDATE OF queue_status ON public.system_oar_queue DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION system_oar_queue_require_closeout_evidence();

CREATE TRIGGER system_oar_queue_no_queued_to_executing BEFORE UPDATE OF queue_status ON public.system_oar_queue FOR EACH ROW EXECUTE FUNCTION system_oar_queue_prevent_queued_to_executing();

CREATE TRIGGER system_oar_queue_set_updated_at BEFORE UPDATE ON public.system_oar_queue FOR EACH ROW EXECUTE FUNCTION c3_oar_set_updated_at();
CREATE OR REPLACE FUNCTION public.register_cancom_oar_delivery_v1(p_manifest jsonb, p_passage jsonb, p_registrar text)
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

create table public.c3_environment("env_key" text not null,"system_key" text not null,"environment_name" text not null,"environment_class" text not null,"standing" text not null,"is_canonical" boolean default false not null,"is_active" boolean default true not null,"source_authority_ref" text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"relational_circuit" text,"current_pair" text,"model_function" text);

create table public.c3_envpac("envpac_key" text not null,"env_key" text not null,"version" text not null,"standing" text not null,"owner_subject_type" text not null,"owner_subject_key" text not null,"custodian_subject_type" text not null,"custodian_subject_key" text not null,"custody_uri" text not null,"custody_provider" text not null,"content_sha256" text,"architecture_version" text default 'c3pac_v0.1'::text not null,"is_effective" boolean default true not null,"portable" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"effective_at" timestamp with time zone default now() not null,"superseded_at" timestamp with time zone,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3_envpac_environment_binding("binding_key" text not null,"envpac_key" text not null,"env_key" text not null,"binding_role" text not null,"standing" text default 'active'::text not null,"is_primary" boolean default false not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3_envpac_rooted_system("rooted_system_key" text not null,"envpac_key" text not null,"system_key" text not null,"relation_role" text not null,"standing" text default 'active'::text not null,"authority_scope" jsonb default '{}'::jsonb not null,"runtime_ref" text,"source_ref" text,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3_pac("pac_key" text not null,"envpac_key" text not null,"pac_type" text not null,"version" text not null,"standing" text not null,"custody_uri" text not null,"content_sha256" text,"source_authority" text,"is_effective" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null,"contract_key" text,"architecture_version" text,"custodian_subject_type" text,"custodian_subject_key" text,"custody_provider" text,"authority_effect" text,"release_state" text,"execution_authority_state" text,"formation_state" text,"effective_at" timestamp with time zone,"supersedes_pac_key" text,"superseded_at" timestamp with time zone,"return_evidence_required" boolean,"owner_subject_type" text,"owner_subject_key" text,"owner_environment_key" text,"registration_protocol" text default 'legacy_pre_hardening'::text not null,"registration_sha256" text,"boundary_evaluation_key" text,"registered_at" timestamp with time zone,"registrar_role_call_key" text,"schema_key" text);

create table public.c3ops_asset_lineage_record("lineage_key" text not null,"asset_key" text not null,"parent_asset_key" text,"root_asset_key" text,"successor_asset_key" text,"lineage_type" text not null,"effective_date" timestamp with time zone default now() not null,"termination_date" timestamp with time zone,"replacement_reason" text,"legacy_standing" text default 'legacy'::text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3ops_asset_placement_determination("determination_key" text not null,"asset_key" text not null,"determined_by" text not null,"decision_authority" text not null,"owning_system_key" text not null,"seat_scope" text not null,"src_class" text not null,"src_key" text not null,"c3_key" text,"role_key" text not null,"env_key" text not null,"free_eligibility" boolean default false not null,"free_encounter_key" text,"renderer_key" text,"custody_type" text not null,"custody_provider" text not null,"target_custody_identifier" text not null,"target_object_key" text,"current_asset_key" text,"replacement_relation" text,"retention_rule" text,"rights_standing" text,"release_standing" text,"web3_standing" text,"unresolved_findings" jsonb default '{}'::jsonb not null,"determination_standing" text not null,"confirmed_at" timestamp with time zone,"executed_at" timestamp with time zone,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3ops_partner("partner_key" text not null,"partner_type" text not null,"identity_key" text not null,"owning_or_self_system_key" text,"standing" text default 'proposed'::text not null,"seat_standing" text,"c3_key" text,"default_role_key" text,"permitted_env_keys" text[] default '{}'::text[],"src_relation_keys" text[] default '{}'::text[],"authority_boundary" text,"review_relation" text,"active_from" timestamp with time zone default now(),"inactive_from" timestamp with time zone,"supersedes_partner_key" text,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3ops_publication_component("component_key" text not null,"publication_object_key" text not null,"section_key" text,"component_type" text not null,"asset_key" text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3ops_publication_lineage_record("lineage_key" text not null,"publication_object_key" text not null,"parent_object_key" text,"root_object_key" text,"successor_object_key" text,"lineage_type" text not null,"effective_date" timestamp with time zone default now() not null,"termination_date" timestamp with time zone,"replacement_reason" text,"legacy_standing" text default 'legacy'::text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.c3ops_publication_object("publication_object_key" text not null,"publisher_key" text not null,"publication_key" text not null,"series_key" text,"issue_key" text,"title" text not null,"description" text,"publication_standing" text default 'draft'::text not null,"editorial_standing" text default 'operator_directed'::text not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.measures_encounter_def("id" uuid default gen_random_uuid() not null,"registry_id" uuid not null,"encounter_key" text not null,"display_title" text not null,"encounter_type" text not null,"material_family" text,"surface_type" text,"sequence_order" integer,"pause_allowed" boolean default false not null,"is_entry_surface" boolean default false not null,"is_active" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.measures_registry("id" uuid default gen_random_uuid() not null,"registry_key" text not null,"display_title" text not null,"registry_family" text not null,"encounter_type" text,"material_family" text,"sequence_order" integer,"release_state" text default 'sealed'::text not null,"access_state" text default 'gated'::text not null,"parent_registry_id" uuid,"depends_on_registry_id" uuid,"envelope_id" uuid,"phase_label" text,"is_active" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

create table public.measures_seat_hold_capture("id" uuid default gen_random_uuid() not null,"registry_key" text default 'measures_registry'::text not null,"encounter_key" text not null,"email" text not null,"capture_context" text default 'measures_registry_seat_hold'::text not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"notification_state" text default 'captured'::text not null,"notified_at" timestamp with time zone,"source_encounter_key" text,"offering_key" text,"seat_lifecycle_state" text default 'held'::text not null);

create table public.measures_transition_rule("id" uuid default gen_random_uuid() not null,"from_registry_id" uuid,"from_encounter_id" uuid,"to_registry_id" uuid,"to_encounter_id" uuid,"transition_kind" text not null,"rule_state" text default 'active'::text not null,"requires_release" boolean default true not null,"requires_dependency_satisfied" boolean default false not null,"requires_passage_ready" boolean default false not null,"requires_connect_prompt" boolean default false not null,"sort_order" integer default 0 not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);

alter table public.c3_environment add constraint "c3_environment_class_nonempty" CHECK ((length(btrim(environment_class)) > 0));

alter table public.c3_environment add constraint "c3_environment_env_key_nonempty" CHECK ((length(btrim(env_key)) > 0));

alter table public.c3_environment add constraint "c3_environment_model_tuple_all_or_none_chk" CHECK ((((relational_circuit IS NULL) AND (current_pair IS NULL) AND (model_function IS NULL)) OR ((relational_circuit IS NOT NULL) AND (current_pair IS NOT NULL) AND (model_function IS NOT NULL))));

alter table public.c3_environment add constraint "c3_environment_name_nonempty" CHECK ((length(btrim(environment_name)) > 0));

alter table public.c3_environment add constraint "c3_environment_pkey" PRIMARY KEY (env_key);

alter table public.c3_environment add constraint "c3_environment_source_authority_nonempty" CHECK ((length(btrim(source_authority_ref)) > 0));

alter table public.c3_environment add constraint "c3_environment_standing_nonempty" CHECK ((length(btrim(standing)) > 0));

alter table public.c3_environment add constraint "c3_environment_system_key_nonempty" CHECK ((length(btrim(system_key)) > 0));

alter table public.c3_envpac add constraint "c3_envpac_custodian_subject_type_check" CHECK ((custodian_subject_type = ANY (ARRAY['individual'::text, 'entity'::text, 'system'::text, 'environment'::text, 'service'::text])));

alter table public.c3_envpac add constraint "c3_envpac_env_key_version_key" UNIQUE (env_key, version);

alter table public.c3_envpac add constraint "c3_envpac_owner_subject_type_check" CHECK ((owner_subject_type = ANY (ARRAY['individual'::text, 'entity'::text, 'system'::text, 'environment'::text])));

alter table public.c3_envpac add constraint "c3_envpac_pkey" PRIMARY KEY (envpac_key);

alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_binding_role_check" CHECK ((binding_role = ANY (ARRAY['owned_environment'::text, 'c3me_environment'::text, 'parent_environment'::text, 'related_environment'::text])));

alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_envpac_key_env_key_binding_ro_key" UNIQUE (envpac_key, env_key, binding_role);

alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_pkey" PRIMARY KEY (binding_key);

alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_envpac_key_system_key_relation_role_key" UNIQUE (envpac_key, system_key, relation_role);

alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_pkey" PRIMARY KEY (rooted_system_key);

alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_relation_role_check" CHECK ((relation_role = ANY (ARRAY['operating_system'::text, 'registry'::text, 'governance'::text, 'publication'::text, 'distribution'::text, 'source_authority'::text, 'evidence'::text, 'supporting_system'::text])));

alter table public.c3_pac add constraint "c3_pac_custodian_subject_type_v1_check" CHECK (((custodian_subject_type IS NULL) OR (custodian_subject_type = ANY (ARRAY['individual'::text, 'entity'::text, 'system'::text, 'environment'::text, 'service'::text]))));

alter table public.c3_pac add constraint "c3_pac_envpac_key_pac_key_version_key" UNIQUE (envpac_key, pac_key, version);

alter table public.c3_pac add constraint "c3_pac_owner_subject_type_hardened_chk" CHECK (((owner_subject_type IS NULL) OR (owner_subject_type = ANY (ARRAY['individual'::text, 'institution'::text, 'system'::text, 'environment'::text, 'service'::text]))));

alter table public.c3_pac add constraint "c3_pac_pkey" PRIMARY KEY (pac_key);

alter table public.c3_pac add constraint "c3_pac_registrar_v1_required_fields_chk" CHECK (((registration_protocol <> 'registrar_v1'::text) OR ((schema_key IS NOT NULL) AND (owner_subject_type IS NOT NULL) AND (owner_subject_key IS NOT NULL) AND (registration_sha256 IS NOT NULL) AND (boundary_evaluation_key IS NOT NULL) AND (registered_at IS NOT NULL) AND (registrar_role_call_key IS NOT NULL) AND ((owner_subject_type <> 'institution'::text) OR (owner_environment_key IS NOT NULL)))));

alter table public.c3_pac add constraint "c3_pac_registration_protocol_chk" CHECK ((registration_protocol = ANY (ARRAY['legacy_pre_hardening'::text, 'registrar_v1'::text])));

alter table public.c3_pac add constraint "c3_pac_registration_sha_chk" CHECK (((registration_sha256 IS NULL) OR (registration_sha256 ~ '^[0-9a-f]{64}$'::text)));

alter table public.c3_pac add constraint "c3_pac_supersedes_not_self_v1_check" CHECK (((supersedes_pac_key IS NULL) OR (supersedes_pac_key <> pac_key)));

alter table public.c3ops_asset_lineage_record add constraint "c3ops_asset_lineage_record_pkey" PRIMARY KEY (lineage_key);

alter table public.c3ops_asset_placement_determination add constraint "c3ops_asset_placement_determination_pkey" PRIMARY KEY (determination_key);

alter table public.c3ops_partner add constraint "c3ops_partner_partner_type_check" CHECK ((partner_type = ANY (ARRAY['individual'::text, 'institution'::text, 'intelligence'::text])));

alter table public.c3ops_partner add constraint "c3ops_partner_pkey" PRIMARY KEY (partner_key);

alter table public.c3ops_publication_component add constraint "c3ops_publication_component_pkey" PRIMARY KEY (component_key);

alter table public.c3ops_publication_lineage_record add constraint "c3ops_publication_lineage_record_pkey" PRIMARY KEY (lineage_key);

alter table public.c3ops_publication_object add constraint "c3ops_publication_object_editorial_standing_check" CHECK ((editorial_standing = ANY (ARRAY['operator_directed'::text, 'operator_reviewed'::text, 'ai_assisted'::text, 'ai_authored'::text, 'collaborative'::text, 'held'::text])));

alter table public.c3ops_publication_object add constraint "c3ops_publication_object_pkey" PRIMARY KEY (publication_object_key);

alter table public.c3ops_publication_object add constraint "c3ops_publication_object_publication_standing_check" CHECK ((publication_standing = ANY (ARRAY['draft'::text, 'review'::text, 'approved'::text, 'scheduled'::text, 'published'::text, 'corrected'::text, 'superseded'::text, 'legacy'::text, 'archived'::text, 'withdrawn'::text])));

alter table public.measures_encounter_def add constraint "measures_encounter_def_encounter_key_key" UNIQUE (encounter_key);

alter table public.measures_encounter_def add constraint "measures_encounter_def_material_family_check" CHECK (((material_family IS NULL) OR (material_family = ANY (ARRAY['obsidian'::text, 'crystal'::text, 'marble'::text, 'lapis'::text]))));

alter table public.measures_encounter_def add constraint "measures_encounter_def_pkey" PRIMARY KEY (id);

alter table public.measures_encounter_def add constraint "measures_encounter_def_registry_id_key" UNIQUE (registry_id);

alter table public.measures_encounter_def add constraint "measures_encounter_def_surface_type_check" CHECK (((surface_type IS NULL) OR (surface_type = ANY (ARRAY['scroll'::text, 'aspect'::text, 'inscription'::text, 'passage'::text, 'glyph_surface'::text, 'phase_map'::text, 'threshold'::text, 'chamberplate'::text]))));

alter table public.measures_registry add constraint "measures_registry_access_state_check" CHECK ((access_state = ANY (ARRAY['gated'::text, 'visible'::text, 'callable'::text, 'encounterable'::text, 'archived'::text])));

alter table public.measures_registry add constraint "measures_registry_material_family_check" CHECK (((material_family IS NULL) OR (material_family = ANY (ARRAY['obsidian'::text, 'crystal'::text, 'marble'::text, 'lapis'::text]))));

alter table public.measures_registry add constraint "measures_registry_pkey" PRIMARY KEY (id);

alter table public.measures_registry add constraint "measures_registry_registry_family_check" CHECK ((registry_family = ANY (ARRAY['spine'::text, 'chamber_directory'::text, 'gate'::text, 'epithet'::text, 'me'::text])));

alter table public.measures_registry add constraint "measures_registry_registry_key_key" UNIQUE (registry_key);

alter table public.measures_registry add constraint "measures_registry_release_state_check" CHECK ((release_state = ANY (ARRAY['sealed'::text, 'held'::text, 'released'::text, 'open'::text, 'closed'::text])));

alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_email_check" CHECK ((POSITION(('@'::text) IN (email)) > 1));

alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_encounter_check" CHECK ((encounter_key = ANY (ARRAY['foundation_seat_hold'::text, 'systems_seat_hold'::text])));

alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_notification_state_check" CHECK ((notification_state = ANY (ARRAY['captured'::text, 'queued'::text, 'notified'::text, 'failed'::text, 'suppressed'::text])));

alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_pkey" PRIMARY KEY (id);

alter table public.measures_seat_hold_capture add constraint "measures_seat_hold_capture_seat_lifecycle_state_check" CHECK ((seat_lifecycle_state = ANY (ARRAY['held'::text, 'reviewed'::text, 'approved'::text, 'notified'::text, 'suppressed'::text, 'expired'::text])));

alter table public.measures_transition_rule add constraint "measures_transition_rule_anchor_chk" CHECK ((((from_registry_id IS NOT NULL) OR (from_encounter_id IS NOT NULL)) AND ((to_registry_id IS NOT NULL) OR (to_encounter_id IS NOT NULL))));

alter table public.measures_transition_rule add constraint "measures_transition_rule_pkey" PRIMARY KEY (id);

alter table public.measures_transition_rule add constraint "measures_transition_rule_rule_state_check" CHECK ((rule_state = ANY (ARRAY['active'::text, 'held'::text, 'inactive'::text])));

alter table public.measures_transition_rule add constraint "measures_transition_rule_transition_kind_check" CHECK ((transition_kind = ANY (ARRAY['progression'::text, 'pause'::text, 'return'::text, 'release'::text, 'seal'::text, 'dependency_unlock'::text, 'connect_request_prompt'::text])));

alter table public.c3_envpac add constraint "c3_envpac_env_key_fkey" FOREIGN KEY (env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE ON DELETE RESTRICT;

alter table public.c3_envpac_capability_grant add constraint "c3_envpac_capability_grant_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;

alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_env_key_fkey" FOREIGN KEY (env_key) REFERENCES c3_environment(env_key) ON UPDATE CASCADE ON DELETE RESTRICT;

alter table public.c3_envpac_environment_binding add constraint "c3_envpac_environment_binding_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;

alter table public.c3_envpac_rooted_system add constraint "c3_envpac_rooted_system_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE CASCADE;

alter table public.c3_pac add constraint "c3_pac_envpac_key_fkey" FOREIGN KEY (envpac_key) REFERENCES c3_envpac(envpac_key) ON UPDATE CASCADE ON DELETE RESTRICT;

alter table public.c3_pac add constraint "c3_pac_supersedes_pac_key_fkey" FOREIGN KEY (supersedes_pac_key) REFERENCES c3_pac(pac_key) ON UPDATE CASCADE ON DELETE RESTRICT;

alter table public.measures_encounter_def add constraint "measures_encounter_def_registry_id_fkey" FOREIGN KEY (registry_id) REFERENCES measures_registry(id) ON DELETE CASCADE;

alter table public.measures_registry add constraint "measures_registry_depends_on_registry_id_fkey" FOREIGN KEY (depends_on_registry_id) REFERENCES measures_registry(id) ON DELETE SET NULL;

alter table public.measures_registry add constraint "measures_registry_parent_registry_id_fkey" FOREIGN KEY (parent_registry_id) REFERENCES measures_registry(id) ON DELETE SET NULL;

alter table public.measures_transition_rule add constraint "measures_transition_rule_from_encounter_id_fkey" FOREIGN KEY (from_encounter_id) REFERENCES measures_encounter_def(id) ON DELETE CASCADE;

alter table public.measures_transition_rule add constraint "measures_transition_rule_from_registry_id_fkey" FOREIGN KEY (from_registry_id) REFERENCES measures_registry(id) ON DELETE CASCADE;

alter table public.measures_transition_rule add constraint "measures_transition_rule_to_encounter_id_fkey" FOREIGN KEY (to_encounter_id) REFERENCES measures_encounter_def(id) ON DELETE CASCADE;

alter table public.measures_transition_rule add constraint "measures_transition_rule_to_registry_id_fkey" FOREIGN KEY (to_registry_id) REFERENCES measures_registry(id) ON DELETE CASCADE;

alter table public.system_oar_execution_evidence add constraint "system_oar_execution_evidence_queue_key_fkey" FOREIGN KEY (queue_key) REFERENCES system_oar_queue(queue_key);

alter table public.c3_environment enable row level security;

alter table public.c3_envpac enable row level security;

alter table public.c3_envpac_capability_grant enable row level security;

alter table public.c3_envpac_environment_binding enable row level security;

alter table public.c3_envpac_rooted_system enable row level security;

alter table public.c3_pac enable row level security;

alter table public.c3ops_asset_lineage_record enable row level security;

alter table public.c3ops_asset_placement_determination enable row level security;

alter table public.c3ops_partner enable row level security;

alter table public.c3ops_publication_component enable row level security;

alter table public.c3ops_publication_lineage_record enable row level security;

alter table public.c3ops_publication_object enable row level security;

alter table public.measures_encounter_def enable row level security;

alter table public.measures_registry enable row level security;

alter table public.measures_seat_hold_capture enable row level security;

alter table public.measures_transition_rule enable row level security;

alter table public.system_oar_execution_evidence enable row level security;

alter table public.system_oar_queue enable row level security;

create policy "Allow anon and authenticated write on c3ops_asset_lineage_recor" on public.c3ops_asset_lineage_record as PERMISSIVE for ALL to public using (true) with check (true);

create policy "Allow public read access on c3ops_asset_lineage_record" on public.c3ops_asset_lineage_record as PERMISSIVE for SELECT to public using (true);

create policy "Allow anon and authenticated write on c3ops_asset_placement_det" on public.c3ops_asset_placement_determination as PERMISSIVE for ALL to public using (true) with check (true);

create policy "Allow public read access on c3ops_asset_placement_determination" on public.c3ops_asset_placement_determination as PERMISSIVE for SELECT to public using (true);

create policy "Allow anon and authenticated write on c3ops_partner" on public.c3ops_partner as PERMISSIVE for ALL to public using (true) with check (true);

create policy "Allow public read access on c3ops_partner" on public.c3ops_partner as PERMISSIVE for SELECT to public using (true);

create policy "Allow anon and authenticated write on c3ops_publication_compone" on public.c3ops_publication_component as PERMISSIVE for ALL to public using (true) with check (true);

create policy "Allow public read access on c3ops_publication_component" on public.c3ops_publication_component as PERMISSIVE for SELECT to public using (true);

create policy "Allow anon and authenticated write on c3ops_publication_lineage" on public.c3ops_publication_lineage_record as PERMISSIVE for ALL to public using (true) with check (true);

create policy "Allow public read access on c3ops_publication_lineage_record" on public.c3ops_publication_lineage_record as PERMISSIVE for SELECT to public using (true);

create policy "Allow anon and authenticated write on c3ops_publication_object" on public.c3ops_publication_object as PERMISSIVE for ALL to public using (true) with check (true);

create policy "Allow public read access on c3ops_publication_object" on public.c3ops_publication_object as PERMISSIVE for SELECT to public using (true);

create view public.c3_envpac_effective_graph as  SELECT envpac_key,
    env_key AS registry_env_key,
    version,
    standing AS envpac_standing,
    owner_subject_type,
    owner_subject_key,
    custodian_subject_type,
    custodian_subject_key,
    custody_uri,
    custody_provider,
    content_sha256,
    portable,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('env_key', b.env_key, 'binding_role', b.binding_role, 'standing', b.standing, 'is_primary', b.is_primary, 'metadata', b.metadata) ORDER BY b.is_primary DESC, b.env_key) AS jsonb_agg
           FROM c3_envpac_environment_binding b
          WHERE b.envpac_key = ep.envpac_key), '[]'::jsonb) AS environment_bindings,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('system_key', rs.system_key, 'relation_role', rs.relation_role, 'standing', rs.standing, 'authority_scope', rs.authority_scope, 'runtime_ref', rs.runtime_ref, 'source_ref', rs.source_ref) ORDER BY rs.relation_role, rs.system_key) AS jsonb_agg
           FROM c3_envpac_rooted_system rs
          WHERE rs.envpac_key = ep.envpac_key), '[]'::jsonb) AS rooted_systems,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('pac_key', p.pac_key, 'pac_type', p.pac_type, 'version', p.version, 'standing', p.standing, 'custody_uri', p.custody_uri, 'content_sha256', p.content_sha256) ORDER BY p.pac_type, p.pac_key) AS jsonb_agg
           FROM c3_pac p
          WHERE p.envpac_key = ep.envpac_key AND p.is_effective = true), '[]'::jsonb) AS packages
   FROM c3_envpac ep
  WHERE is_effective = true;
;

create view public.c3_envpac_registry_reference as  SELECT e.env_key,
    e.system_key,
    e.environment_name,
    p.envpac_key,
    p.version AS envpac_version,
    p.standing AS envpac_standing,
    p.owner_subject_type,
    p.owner_subject_key,
    p.custodian_subject_type,
    p.custodian_subject_key,
    p.custody_uri,
    p.custody_provider,
    p.content_sha256,
    p.portable,
    p.effective_at
   FROM c3_environment e
     JOIN c3_envpac p ON p.env_key = e.env_key
  WHERE p.is_effective = true;
;

create view public.measures_seat_hold_notification_review_v1 as  SELECT id AS capture_id,
    email,
    offering_key,
    source_encounter_key,
    notification_state,
    seat_lifecycle_state,
    created_at,
    notified_at
   FROM measures_seat_hold_capture
  WHERE registry_key = 'measures_registry'::text
  ORDER BY created_at DESC;
;

grant usage on schema public to anon,authenticated,service_role;

grant all on all tables in schema public to anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION public.add_measures_transition_rule(p_from_registry_key text, p_to_registry_key text, p_transition_kind text, p_requires_release boolean DEFAULT true, p_requires_dependency_satisfied boolean DEFAULT false, p_requires_passage_ready boolean DEFAULT false, p_requires_connect_prompt boolean DEFAULT false, p_sort_order integer DEFAULT 0, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(transition_rule_id uuid, from_registry_id uuid, to_registry_id uuid, transition_kind text, rule_state text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_from_registry_id uuid;
  v_to_registry_id uuid;
  v_rule_id uuid;
begin
  select mr.id
  into v_from_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_from_registry_key
    and mr.is_active = true;

  select mr.id
  into v_to_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_to_registry_key
    and mr.is_active = true;

  if v_from_registry_id is null then
    raise exception 'from registry_key not found or inactive: %', p_from_registry_key;
  end if;

  if v_to_registry_id is null then
    raise exception 'to registry_key not found or inactive: %', p_to_registry_key;
  end if;

  insert into public.measures_transition_rule (
    from_registry_id,
    to_registry_id,
    transition_kind,
    rule_state,
    requires_release,
    requires_dependency_satisfied,
    requires_passage_ready,
    requires_connect_prompt,
    sort_order,
    metadata
  )
  values (
    v_from_registry_id,
    v_to_registry_id,
    p_transition_kind,
    'active',
    coalesce(p_requires_release, true),
    coalesce(p_requires_dependency_satisfied, false),
    coalesce(p_requires_passage_ready, false),
    coalesce(p_requires_connect_prompt, false),
    coalesce(p_sort_order, 0),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_rule_id;

  return query
  select
    mtr.id,
    mtr.from_registry_id,
    mtr.to_registry_id,
    mtr.transition_kind,
    mtr.rule_state
  from public.measures_transition_rule mtr
  where mtr.id = v_rule_id;
end;
$function$
;

grant execute on function public.add_measures_transition_rule(text,text,text,boolean,boolean,boolean,boolean,integer,jsonb) to anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION public.define_measures_encounter(p_registry_key text, p_encounter_key text, p_display_title text, p_encounter_type text, p_material_family text DEFAULT NULL::text, p_surface_type text DEFAULT NULL::text, p_sequence_order integer DEFAULT NULL::integer, p_pause_allowed boolean DEFAULT false, p_is_entry_surface boolean DEFAULT false, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(encounter_id uuid, registry_id uuid, registry_key text, encounter_key text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_registry_id uuid;
  v_encounter_id uuid;
begin
  select mr.id
  into v_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_registry_key
    and mr.is_active = true;

  if v_registry_id is null then
    raise exception 'registry_key not found or inactive: %', p_registry_key;
  end if;

  insert into public.measures_encounter_def (
    registry_id,
    encounter_key,
    display_title,
    encounter_type,
    material_family,
    surface_type,
    sequence_order,
    pause_allowed,
    is_entry_surface,
    is_active,
    metadata
  )
  values (
    v_registry_id,
    p_encounter_key,
    p_display_title,
    p_encounter_type,
    p_material_family,
    p_surface_type,
    p_sequence_order,
    coalesce(p_pause_allowed, false),
    coalesce(p_is_entry_surface, false),
    true,
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (registry_id) do update
    set encounter_key = excluded.encounter_key,
        display_title = excluded.display_title,
        encounter_type = excluded.encounter_type,
        material_family = excluded.material_family,
        surface_type = excluded.surface_type,
        sequence_order = excluded.sequence_order,
        pause_allowed = excluded.pause_allowed,
        is_entry_surface = excluded.is_entry_surface,
        metadata = excluded.metadata,
        updated_at = now()
  returning id into v_encounter_id;

  return query
  select
    med.id,
    med.registry_id,
    mr.registry_key,
    med.encounter_key
  from public.measures_encounter_def med
  join public.measures_registry mr
    on mr.id = med.registry_id
  where med.id = v_encounter_id;
end;
$function$
;

grant execute on function public.define_measures_encounter(text,text,text,text,text,text,integer,boolean,boolean,jsonb) to anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION public.system_oar_queue_confirm_and_start_cody(p_queue_key text, p_operator_key text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
begin
  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.oar_type <> 'oar2' then
    raise exception 'only OAR2 queue rows can start Cody execution';
  end if;

  if v_queue.queue_status not in ('awaiting_operator_confirm', 'approved_for_execution', 'queued_for_cody') then
    raise exception 'queue row is not eligible for operator-confirmed Cody execution: %', v_queue.queue_status;
  end if;

  if v_queue.preflight_status <> 'passed' then
    raise exception 'preflight must be passed before Cody execution';
  end if;

  if v_queue.source_oar2_path is null or v_queue.expected_oar1_path is null then
    raise exception 'source_oar2_path and expected_oar1_path are required before Cody execution';
  end if;

  update public.system_oar_queue
  set
    operator_key = p_operator_key,
    operator_confirmed_at = coalesce(operator_confirmed_at, now()),
    queue_status = 'queued_for_cody',
    cody_handoff_prompt = concat(
      'Execute only from confirmed OAR2: ',
      source_oar2_path,
      '. Expected OAR1: ',
      expected_oar1_path,
      '.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  update public.system_oar_queue
  set
    queue_status = 'executing',
    execution_started_at = coalesce(execution_started_at, now())
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;

grant execute on function public.system_oar_queue_confirm_and_start_cody(text,text) to anon,authenticated,service_role;

CREATE OR REPLACE FUNCTION public.system_oar_queue_submit_oar1_for_chazz_prompt(p_queue_key text, p_oar1_path text, p_evidence_path text, p_execution_summary text, p_db_mutation_standing text DEFAULT 'not_applicable'::text, p_src_mutation_standing text DEFAULT 'not_applicable'::text, p_deploy_standing text DEFAULT 'not_applicable'::text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
  v_evidence_key text;
begin
  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.queue_status <> 'executing' then
    raise exception 'OAR1 can only be submitted from executing standing';
  end if;

  if p_oar1_path is null or length(trim(p_oar1_path)) = 0 then
    raise exception 'OAR1 path is required before Chazz prompt generation';
  end if;

  if p_evidence_path is null or length(trim(p_evidence_path)) = 0 then
    raise exception 'evidence path is required before Chazz prompt generation';
  end if;

  v_evidence_key := concat(p_queue_key, ':oar1-submitted');

  insert into public.system_oar_execution_evidence (
    evidence_key,
    queue_key,
    evidence_type,
    evidence_summary,
    artifact_path
  )
  values (
    v_evidence_key,
    p_queue_key,
    'runtime_validation',
    coalesce(nullif(p_execution_summary, ''), 'OAR1 submitted for Chazz review prompt'),
    p_evidence_path
  )
  on conflict (evidence_key) do update
  set
    evidence_summary = excluded.evidence_summary,
    artifact_path = excluded.artifact_path;

  update public.system_oar_queue
  set
    queue_status = 'oar1_submitted',
    execution_completed_at = coalesce(execution_completed_at, now()),
    oar1_path = p_oar1_path,
    execution_summary = p_execution_summary,
    db_mutation_standing = p_db_mutation_standing,
    src_mutation_standing = p_src_mutation_standing,
    deploy_standing = p_deploy_standing,
    chazz_review_prompt_authority = 'thread_prompt_only',
    chazz_review_prompt_generated_at = now(),
    chazz_review_prompt = concat(
      'Review this OAR1 against its source OAR2.',
      E'\n\nSource OAR2: ',
      source_oar2_path,
      E'\nOAR1: ',
      p_oar1_path,
      E'\nEvidence: ',
      p_evidence_path,
      E'\nExecution standing: oar1_submitted',
      E'\nDB mutation standing: ',
      p_db_mutation_standing,
      E'\nsrc mutation standing: ',
      p_src_mutation_standing,
      E'\nDeploy standing: ',
      p_deploy_standing,
      E'\nWhat Cody changed: ',
      coalesce(p_execution_summary, 'not recorded'),
      E'\nRequested Chazz decision: `validated`, `correction_required`, or `held`.',
      E'\n\nThis prompt is a review surface only. Final standing must be seated back into governed DB/Measures state.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;

grant execute on function public.system_oar_queue_submit_oar1_for_chazz_prompt(text,text,text,text,text,text,text) to anon,authenticated,service_role;
create view public.c3ops_oar_lifecycle_optics_resolution_v1 with (security_invoker=true) as  SELECT q.oar_key,
    q.scope_key AS execution_instance,
    q.automation_permissions ->> 'executor_ref'::text AS executor_ref,
    q.queue_status AS queue_standing,
    q.preflight_status AS preflight_standing,
    q.requested_action,
    q.execution_summary,
        CASE
            WHEN p.actual_oar1_path = q.oar1_path AND p.actual_oar1_path = q.expected_oar1_path AND t.to_status = p.execution_standing AND e.artifact_path = ('registry://c3ops_oar_custody_resolution_event/'::text || c.resolution_event_key) THEN c.standing
            ELSE NULL::text
        END AS return_standing,
        CASE
            WHEN (q.automation_permissions ->> 'model_resolution_evidence_required'::text) = 'true'::text THEN
            CASE
                WHEN p.actual_oar1_path = q.oar1_path AND t.to_status = p.execution_standing AND e.artifact_path = ('registry://c3ops_oar_custody_resolution_event/'::text || c.resolution_event_key) AND validate_cancom_model_resolution_evidence_v1(e.validation_result -> 'model_resolution_evidence'::text) AND (e.validation_result -> 'model_resolution_evidence'::text) = ((c.metadata -> 'evidence'::text) -> 'model_resolution_evidence'::text) THEN 'returned'::text
                ELSE 'required'::text
            END
            ELSE 'not_required'::text
        END AS model_resolution_standing,
    p.validation_standing,
    COALESCE(q.deploy_standing, p.deploy_standing) AS deploy_standing,
    q.created_at,
    GREATEST(q.updated_at, p.updated_at, c.created_at, e.created_at, t."timestamp") AS updated_at
   FROM system_oar_queue q
     LEFT JOIN c3_oar_process_instance p ON p.process_instance_key = q.scope_key AND p.source_oar2_path = q.source_oar2_path AND p.expected_oar1_path = q.expected_oar1_path
     LEFT JOIN LATERAL ( SELECT c_1.resolution_event_key,
            c_1.process_key,
            c_1.object_identifier,
            c_1.object_type,
            c_1.related_system,
            c_1.intended_function,
            c_1.standing,
            c_1.integrity_hash,
            c_1.custody_type,
            c_1.custody_reference,
            c_1.retrieval_access_rule,
            c_1.related_execution_instance,
            c_1.related_oar1,
            c_1.related_oar2,
            c_1.resolution_status,
            c_1.hold_reason,
            c_1.transition_timestamp,
            c_1.metadata,
            c_1.created_at
           FROM c3ops_oar_custody_resolution_event c_1
          WHERE c_1.related_execution_instance = q.scope_key AND c_1.related_oar2 = q.oar_key AND c_1.object_type = 'oar1'::text AND c_1.intended_function = 'cancom_oar_return'::text AND (c_1.metadata ->> 'origin_oar2_key'::text) = q.oar_key AND ((c_1.metadata -> 'evidence'::text) ->> 'canonical_sha256'::text) = (q.automation_permissions ->> 'canonical_sha256'::text) AND ((c_1.metadata -> 'evidence'::text) ->> 'canonical_payload_ref'::text) = (q.automation_permissions ->> 'canonical_payload_ref'::text) AND (c_1.metadata ->> 'expected_return_route'::text) = q.expected_oar1_path
          ORDER BY c_1.created_at DESC, c_1.resolution_event_key DESC
         LIMIT 1) c ON true
     LEFT JOIN LATERAL ( SELECT e_1.evidence_key,
            e_1.queue_key,
            e_1.evidence_type,
            e_1.evidence_summary,
            e_1.validation_query,
            e_1.validation_result,
            e_1.artifact_path,
            e_1.commit_hash,
            e_1.created_at
           FROM system_oar_execution_evidence e_1
          WHERE e_1.queue_key = q.queue_key AND e_1.evidence_key = (q.scope_key || ':oar1_return'::text) AND e_1.evidence_type = 'runtime_validation'::text AND (e_1.validation_result ->> 'origin_oar2_key'::text) = q.oar_key AND (e_1.validation_result ->> 'canonical_sha256'::text) = (q.automation_permissions ->> 'canonical_sha256'::text)
          ORDER BY e_1.created_at DESC
         LIMIT 1) e ON true
     LEFT JOIN c3_oar_transition_event t ON t.transition_event_key = (q.scope_key || ':oar1_return'::text) AND t.process_instance_key = q.scope_key AND t.evidence_reference = ('registry://c3ops_oar_custody_resolution_event/'::text || c.resolution_event_key)
  WHERE q.operator_key = 'op044'::text AND q.oar_type = 'oar2'::text;
revoke all on public.c3ops_oar_lifecycle_optics_resolution_v1 from public,anon,authenticated;
grant select on public.c3ops_oar_lifecycle_optics_resolution_v1 to service_role;
revoke all on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text),public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb),public.resolve_cancom_oar_pickup_v1(text,text,text) from public,anon,authenticated; grant execute on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text),public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb),public.resolve_cancom_oar_pickup_v1(text,text,text) to service_role;