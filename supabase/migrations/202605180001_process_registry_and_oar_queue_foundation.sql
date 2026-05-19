create table if not exists public.system_process_registry (
  process_key text primary key,
  process_title text not null,
  process_family text not null,
  process_scope text not null,
  process_status text not null,
  authority_level text not null,
  source_reference_set jsonb not null default '[]'::jsonb,
  required_oar_type text not null,
  requires_operator_confirm boolean not null default true,
  requires_preflight boolean not null default true,
  requires_oar1_closeout boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint system_process_registry_process_status_check
    check (process_status in ('draft', 'active', 'paused', 'retired', 'blocked')),
  constraint system_process_registry_required_oar_type_check
    check (required_oar_type in ('oar1', 'oar2', 'both'))
);

alter table public.system_process_registry
  add column if not exists process_title text,
  add column if not exists process_scope text,
  add column if not exists process_status text,
  add column if not exists authority_level text,
  add column if not exists source_reference_set jsonb not null default '[]'::jsonb,
  add column if not exists required_oar_type text,
  add column if not exists requires_operator_confirm boolean not null default true,
  add column if not exists requires_preflight boolean not null default true,
  add column if not exists requires_oar1_closeout boolean not null default true;

update public.system_process_registry
set
  process_title = coalesce(process_title, process_key),
  process_scope = coalesce(process_scope, 'governed_process'),
  process_status = coalesce(process_status, 'draft'),
  authority_level = coalesce(authority_level, 'working'),
  required_oar_type = coalesce(required_oar_type, 'both')
where
  process_title is null
  or process_scope is null
  or process_status is null
  or authority_level is null
  or required_oar_type is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'system_process_registry'
      and column_name = 'title'
  ) then
    execute '
      update public.system_process_registry
      set process_title = coalesce(nullif(process_title, process_key), title, process_title)
      where title is not null
    ';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'system_process_registry'
      and column_name = 'source_path'
  ) then
    execute '
      update public.system_process_registry
      set process_scope = coalesce(nullif(process_scope, ''governed_process''), source_path, process_scope)
      where source_path is not null
    ';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'system_process_registry'
      and column_name = 'authority_state'
  ) then
    execute '
      update public.system_process_registry
      set authority_level = coalesce(nullif(authority_level, ''working''), authority_state, authority_level)
      where authority_state is not null
    ';
  end if;
end;
$$;

update public.system_process_registry
set process_status = 'draft'
where process_status not in ('draft', 'active', 'paused', 'retired', 'blocked');

update public.system_process_registry
set required_oar_type = 'both'
where required_oar_type not in ('oar1', 'oar2', 'both');

alter table public.system_process_registry
  alter column process_title set not null,
  alter column process_scope set not null,
  alter column process_status set not null,
  alter column authority_level set not null,
  alter column required_oar_type set not null;

alter table public.system_process_registry
  drop constraint if exists system_process_registry_process_status_check,
  add constraint system_process_registry_process_status_check
    check (process_status in ('draft', 'active', 'paused', 'retired', 'blocked'));

alter table public.system_process_registry
  drop constraint if exists system_process_registry_required_oar_type_check,
  add constraint system_process_registry_required_oar_type_check
    check (required_oar_type in ('oar1', 'oar2', 'both'));

create table if not exists public.system_oar_queue (
  queue_key text primary key,
  process_key text not null references public.system_process_registry(process_key),
  oar_key text not null,
  oar_type text not null,
  queue_status text not null,
  operator_key text not null,
  system_key text not null,
  scope_key text not null,
  requested_action text not null,
  execution_boundary text not null,
  preflight_status text not null default 'required',
  operator_confirmed_at timestamptz,
  execution_started_at timestamptz,
  execution_completed_at timestamptz,
  blocked_reason text,
  refusal_reason text,
  oar1_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint system_oar_queue_oar_type_check
    check (oar_type in ('oar1', 'oar2')),
  constraint system_oar_queue_queue_status_check
    check (
      queue_status in (
        'draft',
        'queued',
        'preflight_required',
        'awaiting_operator_confirm',
        'approved_for_execution',
        'executing',
        'blocked',
        'refused',
        'completed',
        'closed'
      )
    ),
  constraint system_oar_queue_preflight_status_check
    check (preflight_status in ('required', 'passed', 'failed', 'waived')),
  constraint system_oar_queue_closed_requires_oar1_path_check
    check (queue_status <> 'closed' or oar1_path is not null),
  constraint system_oar_queue_executing_requires_operator_confirm_check
    check (queue_status <> 'executing' or operator_confirmed_at is not null),
  constraint system_oar_queue_executing_requires_passed_preflight_check
    check (queue_status <> 'executing' or preflight_status = 'passed'),
  constraint system_oar_queue_completed_requires_execution_completed_check
    check (queue_status not in ('completed', 'closed') or execution_completed_at is not null)
);

create table if not exists public.system_oar_execution_evidence (
  evidence_key text primary key,
  queue_key text not null references public.system_oar_queue(queue_key),
  evidence_type text not null,
  evidence_summary text not null,
  validation_query text,
  validation_result jsonb,
  artifact_path text,
  commit_hash text,
  created_at timestamptz not null default now(),
  constraint system_oar_execution_evidence_type_check
    check (
      evidence_type in (
        'file_check',
        'db_query',
        'migration_result',
        'git_commit',
        'operator_review',
        'runtime_validation',
        'refusal_record'
      )
    )
);

create index if not exists system_process_registry_family_status_idx
  on public.system_process_registry(process_family, process_status);

create index if not exists system_oar_queue_process_status_idx
  on public.system_oar_queue(process_key, queue_status);

create index if not exists system_oar_queue_operator_status_idx
  on public.system_oar_queue(operator_key, queue_status);

create index if not exists system_oar_queue_oar_key_idx
  on public.system_oar_queue(oar_key);

create index if not exists system_oar_execution_evidence_queue_idx
  on public.system_oar_execution_evidence(queue_key);

create index if not exists system_oar_execution_evidence_type_idx
  on public.system_oar_execution_evidence(evidence_type);

create or replace function public.c3_oar_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists system_process_registry_set_updated_at on public.system_process_registry;
create trigger system_process_registry_set_updated_at
before update on public.system_process_registry
for each row execute function public.c3_oar_set_updated_at();

drop trigger if exists system_oar_queue_set_updated_at on public.system_oar_queue;
create trigger system_oar_queue_set_updated_at
before update on public.system_oar_queue
for each row execute function public.c3_oar_set_updated_at();

create or replace function public.system_oar_queue_prevent_queued_to_executing()
returns trigger
language plpgsql
as $$
begin
  if old.queue_status = 'queued' and new.queue_status = 'executing' then
    raise exception 'system_oar_queue cannot transition automatically from queued to executing';
  end if;

  return new;
end;
$$;

drop trigger if exists system_oar_queue_no_queued_to_executing on public.system_oar_queue;
create trigger system_oar_queue_no_queued_to_executing
before update of queue_status on public.system_oar_queue
for each row execute function public.system_oar_queue_prevent_queued_to_executing();

create or replace function public.system_oar_queue_require_closeout_evidence()
returns trigger
language plpgsql
as $$
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
$$;

drop trigger if exists system_oar_queue_closed_requires_evidence on public.system_oar_queue;
create constraint trigger system_oar_queue_closed_requires_evidence
after insert or update of queue_status on public.system_oar_queue
deferrable initially deferred
for each row execute function public.system_oar_queue_require_closeout_evidence();
