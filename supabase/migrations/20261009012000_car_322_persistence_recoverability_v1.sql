-- M2 CAR / 322 persistence + recoverability proof.
-- Authority: oar2_car_322_persistence_recoverability_chazz_20261008_017
-- Two internal rails only: immutable occurrence + resolution/checkpoint receipt.

begin;

create table public.c3_car_322_occurrence (
  car_key text primary key check (length(btrim(car_key)) > 0),
  admission_sha256 text not null unique check (admission_sha256 ~ '^[0-9a-f]{64}$'),
  encounter_class text not null check (length(btrim(encounter_class)) > 0),
  env_key text not null references public.c3_environment(env_key),
  subject_type text not null check (length(btrim(subject_type)) > 0),
  subject_key text not null check (length(btrim(subject_key)) > 0),
  current_state_key text not null references public.c3_current_state(current_state_key),
  requested_disposition text not null,
  normalized_admission jsonb not null check (jsonb_typeof(normalized_admission)='object'),
  checkpoint_key text not null check (length(btrim(checkpoint_key)) > 0),
  replay_key text not null unique check (length(btrim(replay_key)) > 0),
  next_owner text not null check (length(btrim(next_owner)) > 0),
  standing text not null default 'admitted' check (standing='admitted'),
  source_oar_key text not null,
  admitted_at timestamptz not null default now()
);

create table public.c3_car_322_resolution_checkpoint (
  resolution_key text primary key check (length(btrim(resolution_key)) > 0),
  car_key text not null unique references public.c3_car_322_occurrence(car_key),
  admission_sha256 text not null references public.c3_car_322_occurrence(admission_sha256),
  resolution_disposition text not null check (resolution_disposition in ('observation_no_authority','HLD')),
  resolution_reason text not null check (length(btrim(resolution_reason)) > 0),
  resolution_payload jsonb not null check (jsonb_typeof(resolution_payload)='object'),
  resolution_sha256 text not null unique check (resolution_sha256 ~ '^[0-9a-f]{64}$'),
  effect_key text not null unique check (length(btrim(effect_key)) > 0),
  effect_class text not null check (effect_class='registry_resolution_receipt'),
  effect_standing text not null check (effect_standing='completed'),
  checkpoint_key text not null,
  replay_key text not null,
  next_owner text not null,
  resume_count integer not null default 0 check (resume_count>=0),
  last_resumed_at timestamptz,
  last_resume_sha256 text check (last_resume_sha256 is null or last_resume_sha256 ~ '^[0-9a-f]{64}$'),
  source_oar_key text not null,
  completed_at timestamptz not null default now(),
  constraint c3_car_322_resolution_checkpoint_keys_match
    check (length(btrim(checkpoint_key))>0 and length(btrim(replay_key))>0 and length(btrim(next_owner))>0)
);

alter table public.c3_car_322_occurrence enable row level security;
alter table public.c3_car_322_occurrence force row level security;
alter table public.c3_car_322_resolution_checkpoint enable row level security;
alter table public.c3_car_322_resolution_checkpoint force row level security;

revoke all on public.c3_car_322_occurrence, public.c3_car_322_resolution_checkpoint
from public,anon,authenticated;
grant select on public.c3_car_322_occurrence, public.c3_car_322_resolution_checkpoint
to service_role;

create or replace function public.c3_car_322_occurrence_immutable_guard_v1()
returns trigger
language plpgsql
security invoker
set search_path=''
as $$
begin
  raise exception 'c3_car_322_occurrence_is_immutable' using errcode='55000';
end
$$;

revoke all on function public.c3_car_322_occurrence_immutable_guard_v1()
from public,anon,authenticated;

create trigger c3_car_322_occurrence_immutable_guard
before update or delete on public.c3_car_322_occurrence
for each row execute function public.c3_car_322_occurrence_immutable_guard_v1();

create or replace function public.c3_car_322_resolution_identity_guard_v1()
returns trigger
language plpgsql
security invoker
set search_path=''
as $$
begin
  if new.resolution_key is distinct from old.resolution_key
     or new.car_key is distinct from old.car_key
     or new.admission_sha256 is distinct from old.admission_sha256
     or new.resolution_disposition is distinct from old.resolution_disposition
     or new.resolution_reason is distinct from old.resolution_reason
     or new.resolution_payload is distinct from old.resolution_payload
     or new.resolution_sha256 is distinct from old.resolution_sha256
     or new.effect_key is distinct from old.effect_key
     or new.effect_class is distinct from old.effect_class
     or new.effect_standing is distinct from old.effect_standing
     or new.checkpoint_key is distinct from old.checkpoint_key
     or new.replay_key is distinct from old.replay_key
     or new.next_owner is distinct from old.next_owner
     or new.source_oar_key is distinct from old.source_oar_key
     or new.completed_at is distinct from old.completed_at then
    raise exception 'c3_car_322_resolution_identity_is_immutable' using errcode='55000';
  end if;

  if new.resume_count < old.resume_count
     or new.resume_count > old.resume_count + 1 then
    raise exception 'c3_car_322_resume_sequence_invalid' using errcode='55000';
  end if;

  return new;
end
$$;

revoke all on function public.c3_car_322_resolution_identity_guard_v1()
from public,anon,authenticated;

create trigger c3_car_322_resolution_identity_guard
before update on public.c3_car_322_resolution_checkpoint
for each row execute function public.c3_car_322_resolution_identity_guard_v1();

create or replace function public.persist_c3_car_322_admission_v1(p_payload jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path=public,extensions,pg_temp
as $$
declare
  v_admission jsonb;
  v_normalized jsonb;
  v_existing public.c3_car_322_occurrence%rowtype;
  v_car_key text;
  v_hash text;
  v_checkpoint jsonb;
begin
  v_admission := public.validate_c3_car_322_admission_v1(p_payload);

  if v_admission->>'standing' is distinct from 'admissible_for_governed_resolution' then
    return jsonb_build_object(
      'standing','HLD',
      'reason','car_admission_not_admissible',
      'admission',v_admission
    );
  end if;

  v_normalized := v_admission->'normalized_admission';
  v_car_key := v_admission->>'car_key';
  v_hash := v_admission->>'admission_sha256';
  v_checkpoint := v_normalized->'checkpoint';

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_car_key,0));

  select * into v_existing
  from public.c3_car_322_occurrence
  where car_key=v_car_key;

  if found then
    if v_existing.admission_sha256 is distinct from v_hash
       or v_existing.replay_key is distinct from v_checkpoint->>'replay_key'
       or v_existing.checkpoint_key is distinct from v_checkpoint->>'checkpoint_key' then
      return jsonb_build_object(
        'standing','HLD',
        'reason','car_identity_replay_conflict',
        'car_key',v_car_key,
        'existing_admission_sha256',v_existing.admission_sha256,
        'submitted_admission_sha256',v_hash
      );
    end if;

    return jsonb_build_object(
      'standing','existing_admitted_car',
      'car_key',v_existing.car_key,
      'admission_sha256',v_existing.admission_sha256,
      'current_state_key',v_existing.current_state_key,
      'checkpoint_key',v_existing.checkpoint_key,
      'replay_key',v_existing.replay_key,
      'effect_created',false,
      'occurrence_created',false
    );
  end if;

  insert into public.c3_car_322_occurrence(
    car_key,admission_sha256,encounter_class,env_key,subject_type,subject_key,
    current_state_key,requested_disposition,normalized_admission,
    checkpoint_key,replay_key,next_owner,source_oar_key
  )
  values(
    v_car_key,
    v_hash,
    v_normalized->>'encounter_class',
    v_normalized->>'env_key',
    v_normalized->>'subject_type',
    v_normalized->>'subject_key',
    v_normalized->>'current_state_key',
    v_normalized->>'requested_disposition',
    v_normalized,
    v_checkpoint->>'checkpoint_key',
    v_checkpoint->>'replay_key',
    v_checkpoint->>'next_owner',
    'oar2_car_322_persistence_recoverability_chazz_20261008_017'
  );

  return jsonb_build_object(
    'standing','car_admitted_persisted',
    'car_key',v_car_key,
    'admission_sha256',v_hash,
    'current_state_key',v_normalized->>'current_state_key',
    'checkpoint_key',v_checkpoint->>'checkpoint_key',
    'replay_key',v_checkpoint->>'replay_key',
    'effect_created',false,
    'occurrence_created',true
  );
end
$$;

revoke all on function public.persist_c3_car_322_admission_v1(jsonb)
from public,anon,authenticated;
grant execute on function public.persist_c3_car_322_admission_v1(jsonb)
to service_role;

create or replace function public.resolve_c3_car_322_checkpoint_v1(
  p_car_key text,
  p_resolution jsonb
)
returns jsonb
language plpgsql
volatile
security definer
set search_path=public,extensions,pg_temp
as $$
declare
  v_car public.c3_car_322_occurrence%rowtype;
  v_existing public.c3_car_322_resolution_checkpoint%rowtype;
  v_disposition text;
  v_reason text;
  v_effect_key text;
  v_resolution_key text;
  v_normalized jsonb;
  v_hash text;
begin
  if nullif(btrim(p_car_key),'') is null
     or jsonb_typeof(p_resolution) is distinct from 'object' then
    return jsonb_build_object('standing','HLD','reason','resolution_request_invalid');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_car_key,0));

  select * into v_car
  from public.c3_car_322_occurrence
  where car_key=p_car_key;

  if not found then
    return jsonb_build_object('standing','HLD','reason','persisted_car_not_found','car_key',p_car_key);
  end if;

  if v_car.requested_disposition not in ('observation_no_authority','HLD') then
    return jsonb_build_object(
      'standing','HLD',
      'reason','state_effect_resolution_outside_recoverability_contract',
      'requested_disposition',v_car.requested_disposition
    );
  end if;

  v_disposition := p_resolution->>'resolution_disposition';
  v_reason := p_resolution->>'resolution_reason';

  if v_disposition not in ('observation_no_authority','HLD')
     or nullif(btrim(v_reason),'') is null then
    return jsonb_build_object('standing','HLD','reason','resolution_shape_invalid');
  end if;

  if v_car.requested_disposition='observation_no_authority'
     and v_disposition not in ('observation_no_authority','HLD') then
    return jsonb_build_object('standing','HLD','reason','resolution_disposition_not_permitted');
  end if;

  v_resolution_key := 'car_resolution:'||p_car_key;
  v_effect_key := 'car_resolution_effect:'||p_car_key;

  v_normalized := jsonb_build_object(
    'contract_key','c3_car_322_persistence_recoverability_v1',
    'resolution_key',v_resolution_key,
    'car_key',v_car.car_key,
    'admission_sha256',v_car.admission_sha256,
    'current_state_key',v_car.current_state_key,
    'resolution_disposition',v_disposition,
    'resolution_reason',v_reason,
    'effect_key',v_effect_key,
    'effect_class','registry_resolution_receipt',
    'effect_standing','completed',
    'checkpoint_key',v_car.checkpoint_key,
    'replay_key',v_car.replay_key,
    'next_owner',coalesce(nullif(btrim(p_resolution->>'next_owner'),''),v_car.next_owner)
  );

  v_hash := encode(
    extensions.digest(convert_to(v_normalized::text,'UTF8'),'sha256'),
    'hex'
  );

  select * into v_existing
  from public.c3_car_322_resolution_checkpoint
  where car_key=p_car_key;

  if found then
    if v_existing.resolution_sha256 is distinct from v_hash
       or v_existing.effect_key is distinct from v_effect_key then
      return jsonb_build_object(
        'standing','HLD',
        'reason','completed_resolution_effect_conflict',
        'car_key',p_car_key,
        'existing_effect_key',v_existing.effect_key,
        'existing_resolution_sha256',v_existing.resolution_sha256,
        'submitted_resolution_sha256',v_hash
      );
    end if;

    return jsonb_build_object(
      'standing','existing_completed_resolution',
      'car_key',p_car_key,
      'resolution_key',v_existing.resolution_key,
      'resolution_sha256',v_existing.resolution_sha256,
      'effect_key',v_existing.effect_key,
      'effect_class',v_existing.effect_class,
      'effect_standing',v_existing.effect_standing,
      'resume_count',v_existing.resume_count,
      'effect_created',false,
      'repeated_effect',false
    );
  end if;

  insert into public.c3_car_322_resolution_checkpoint(
    resolution_key,car_key,admission_sha256,resolution_disposition,resolution_reason,
    resolution_payload,resolution_sha256,effect_key,effect_class,effect_standing,
    checkpoint_key,replay_key,next_owner,source_oar_key
  )
  values(
    v_resolution_key,
    v_car.car_key,
    v_car.admission_sha256,
    v_disposition,
    v_reason,
    v_normalized,
    v_hash,
    v_effect_key,
    'registry_resolution_receipt',
    'completed',
    v_car.checkpoint_key,
    v_car.replay_key,
    coalesce(nullif(btrim(p_resolution->>'next_owner'),''),v_car.next_owner),
    'oar2_car_322_persistence_recoverability_chazz_20261008_017'
  );

  return jsonb_build_object(
    'standing','resolution_completed',
    'car_key',p_car_key,
    'resolution_key',v_resolution_key,
    'resolution_sha256',v_hash,
    'effect_key',v_effect_key,
    'effect_class','registry_resolution_receipt',
    'effect_standing','completed',
    'resume_count',0,
    'effect_created',true,
    'repeated_effect',false
  );
end
$$;

revoke all on function public.resolve_c3_car_322_checkpoint_v1(text,jsonb)
from public,anon,authenticated;
grant execute on function public.resolve_c3_car_322_checkpoint_v1(text,jsonb)
to service_role;

create or replace function public.resume_c3_car_322_v1(
  p_car_key text,
  p_replay_key text,
  p_checkpoint_key text
)
returns jsonb
language plpgsql
volatile
security definer
set search_path=public,extensions,pg_temp
as $$
declare
  v_car public.c3_car_322_occurrence%rowtype;
  v_resolution public.c3_car_322_resolution_checkpoint%rowtype;
  v_next_count integer;
  v_resume_hash text;
begin
  if nullif(btrim(p_car_key),'') is null
     or nullif(btrim(p_replay_key),'') is null
     or nullif(btrim(p_checkpoint_key),'') is null then
    return jsonb_build_object('standing','HLD','reason','resume_identity_incomplete');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_car_key,0));

  select * into v_car
  from public.c3_car_322_occurrence
  where car_key=p_car_key;

  if not found then
    return jsonb_build_object('standing','HLD','reason','persisted_car_not_found');
  end if;

  if v_car.replay_key is distinct from p_replay_key
     or v_car.checkpoint_key is distinct from p_checkpoint_key then
    return jsonb_build_object(
      'standing','HLD',
      'reason','resume_identity_mismatch',
      'car_key',p_car_key
    );
  end if;

  select * into v_resolution
  from public.c3_car_322_resolution_checkpoint
  where car_key=p_car_key
  for update;

  if not found then
    return jsonb_build_object(
      'standing','HLD',
      'reason','completed_resolution_required_before_resume',
      'car_key',p_car_key
    );
  end if;

  if v_resolution.effect_standing is distinct from 'completed'
     or v_resolution.effect_class is distinct from 'registry_resolution_receipt' then
    return jsonb_build_object(
      'standing','HLD',
      'reason','completed_effect_receipt_not_resolved',
      'car_key',p_car_key
    );
  end if;

  if v_resolution.replay_key is distinct from p_replay_key
     or v_resolution.checkpoint_key is distinct from p_checkpoint_key then
    return jsonb_build_object(
      'standing','HLD',
      'reason','resolution_checkpoint_mismatch',
      'car_key',p_car_key
    );
  end if;

  v_next_count := v_resolution.resume_count + 1;
  v_resume_hash := encode(
    extensions.digest(
      convert_to(
        v_resolution.resolution_sha256||':'||p_replay_key||':'||
        p_checkpoint_key||':'||v_next_count::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );

  update public.c3_car_322_resolution_checkpoint
  set resume_count=v_next_count,
      last_resumed_at=now(),
      last_resume_sha256=v_resume_hash
  where car_key=p_car_key;

  return jsonb_build_object(
    'standing','resumed_from_completed_checkpoint',
    'car_key',p_car_key,
    'admission_sha256',v_car.admission_sha256,
    'resolution_key',v_resolution.resolution_key,
    'resolution_sha256',v_resolution.resolution_sha256,
    'effect_key',v_resolution.effect_key,
    'effect_class',v_resolution.effect_class,
    'effect_standing',v_resolution.effect_standing,
    'checkpoint_key',v_resolution.checkpoint_key,
    'replay_key',v_resolution.replay_key,
    'resume_count',v_next_count,
    'resume_sha256',v_resume_hash,
    'repeated_effect',false,
    'effect_created',false,
    'nug_invoked',false,
    'current_advanced',false,
    'CURRENT_accrued',false,
    'relationship_mutated',false,
    'external_effect_performed',false
  );
end
$$;

revoke all on function public.resume_c3_car_322_v1(text,text,text)
from public,anon,authenticated;
grant execute on function public.resume_c3_car_322_v1(text,text,text)
to service_role;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,
  created_at,updated_at
)
values (
  'c3_car_322_persistence_recoverability_v1',
  'c3_field',
  'CAR / 322 Persistence + Recoverability v1',
  'active',
  'supabase/migrations/20261009012000_car_322_persistence_recoverability_v1.sql',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'admission_contract','c3_car_322_relational_admission_contract_v1',
    'occurrence_rail','c3_car_322_occurrence',
    'resolution_checkpoint_rail','c3_car_322_resolution_checkpoint',
    'occurrence_immutable',true,
    'one_resolution_receipt_per_car',true,
    'resume_policy','return_completed_receipt_without_repeating_effect',
    'effect_replay_policy','do_not_repeat_completed_effects',
    'proof_disposition','observation_no_authority',
    'state_effect_dispositions_authorized',false,
    'current_mutation_authorized',false,
    'CURRENT_mutation_authorized',false,
    'relationship_mutation_authorized',false,
    'nug_execution_authorized',false,
    'external_effect_authorized',false,
    'oar_ref','oar2_car_322_persistence_recoverability_chazz_20261008_017'
  ),
  'CAR / 322 Persistence + Recoverability v1',
  'Durable admission, single resolution/checkpoint receipt, and idempotent resume contract for M2',
  'active',
  'registered_m2_recoverability_contract',
  jsonb_build_array(
    'process:c3_car_322_relational_admission_contract_v1',
    'table:c3_car_322_occurrence',
    'table:c3_car_322_resolution_checkpoint',
    'function:persist_c3_car_322_admission_v1(jsonb)',
    'function:resolve_c3_car_322_checkpoint_v1(text,jsonb)',
    'function:resume_c3_car_322_v1(text,text,text)'
  ),
  'oar2',true,true,true,now(),now()
)
on conflict (process_key) do update
set title=excluded.title,
    status=excluded.status,
    source_path=excluded.source_path,
    authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    process_title=excluded.process_title,
    process_scope=excluded.process_scope,
    process_status=excluded.process_status,
    authority_level=excluded.authority_level,
    source_reference_set=excluded.source_reference_set,
    updated_at=now();

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'persistence_recoverability_contract','c3_car_322_persistence_recoverability_v1',
      'recoverability_implementation_state','active_pending_twice_resume_proof',
      'recoverability_oar','oar2_car_322_persistence_recoverability_chazz_20261008_017'
    ),
    updated_at=now()
where process_key='c3_322_six_touchpoint_current_resolution_v1';

commit;
