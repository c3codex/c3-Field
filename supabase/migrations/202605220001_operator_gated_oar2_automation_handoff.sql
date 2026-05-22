alter table public.system_oar_queue
  add column if not exists source_oar2_path text,
  add column if not exists expected_oar1_path text,
  add column if not exists automation_permissions jsonb not null default '{}'::jsonb,
  add column if not exists cody_handoff_prompt text,
  add column if not exists chazz_review_prompt text,
  add column if not exists chazz_review_prompt_generated_at timestamptz,
  add column if not exists chazz_review_prompt_authority text not null default 'thread_prompt_only',
  add column if not exists execution_summary text,
  add column if not exists db_mutation_standing text not null default 'not_authorized',
  add column if not exists src_mutation_standing text not null default 'not_authorized',
  add column if not exists deploy_standing text not null default 'not_authorized';

alter table public.system_oar_queue
  drop constraint if exists system_oar_queue_queue_status_check,
  add constraint system_oar_queue_queue_status_check
    check (
      queue_status in (
        'draft',
        'queued',
        'queued_for_cody',
        'preflight_required',
        'awaiting_operator_confirm',
        'approved_for_execution',
        'executing',
        'oar1_submitted',
        'blocked',
        'held',
        'refused',
        'completed',
        'closed'
      )
    ),
  drop constraint if exists system_oar_queue_completed_requires_execution_completed_check,
  add constraint system_oar_queue_completed_requires_execution_completed_check
    check (queue_status not in ('oar1_submitted', 'completed', 'closed') or execution_completed_at is not null),
  drop constraint if exists system_oar_queue_oar1_submitted_requires_oar1_path_check,
  add constraint system_oar_queue_oar1_submitted_requires_oar1_path_check
    check (queue_status <> 'oar1_submitted' or oar1_path is not null),
  drop constraint if exists system_oar_queue_chazz_prompt_thread_only_check,
  add constraint system_oar_queue_chazz_prompt_thread_only_check
    check (chazz_review_prompt_authority = 'thread_prompt_only'),
  drop constraint if exists system_oar_queue_mutation_standing_check,
  add constraint system_oar_queue_mutation_standing_check
    check (
      db_mutation_standing in ('not_authorized', 'not_applicable', 'mutated', 'held', 'failed')
      and src_mutation_standing in ('not_authorized', 'not_applicable', 'mutated', 'held', 'failed')
    ),
  drop constraint if exists system_oar_queue_deploy_standing_check,
  add constraint system_oar_queue_deploy_standing_check
    check (deploy_standing in ('not_authorized', 'not_applicable', 'configured', 'deployed', 'held', 'failed'));

create or replace function public.system_oar_queue_prevent_queued_to_executing()
returns trigger
language plpgsql
as $$
begin
  if old.queue_status = 'queued' and new.queue_status = 'executing' then
    raise exception 'system_oar_queue cannot transition automatically from queued to executing; use operator-confirmed queued_for_cody handoff';
  end if;

  return new;
end;
$$;

create or replace function public.system_oar_queue_confirm_and_start_cody(
  p_queue_key text,
  p_operator_key text
)
returns public.system_oar_queue
language plpgsql
security definer
set search_path = public
as $$
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
$$;

create or replace function public.system_oar_queue_submit_oar1_for_chazz_prompt(
  p_queue_key text,
  p_oar1_path text,
  p_evidence_path text,
  p_execution_summary text,
  p_db_mutation_standing text default 'not_applicable',
  p_src_mutation_standing text default 'not_applicable',
  p_deploy_standing text default 'not_applicable'
)
returns public.system_oar_queue
language plpgsql
security definer
set search_path = public
as $$
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
$$;
