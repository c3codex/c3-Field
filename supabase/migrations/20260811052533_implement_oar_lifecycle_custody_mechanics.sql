-- Implement c3Ops OAR Lifecycle and Custody Mechanics
-- Governing OAR2: oar2_implement_c3ops_oar_lifecycle_and_custody_mechanics_v1.meta.md
-- Execution instance: implement_oar_lifecycle_custody_mechanics_codex_001

begin;

create table if not exists public.c3ops_oar_custody_resolution_event (
  resolution_event_key text primary key,
  process_key text not null references public.system_process_registry(process_key),
  object_identifier text not null,
  object_type text not null,
  related_system text not null,
  intended_function text not null,
  standing text not null,
  integrity_hash text,
  custody_type text,
  custody_reference text,
  retrieval_access_rule text,
  related_execution_instance text not null,
  related_oar1 text,
  related_oar2 text,
  resolution_status text not null,
  hold_reason text,
  transition_timestamp timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint c3ops_oar_custody_resolution_event_object_type_check
    check (object_type in ('oar1', 'oar2', 'evidence', 'asset', 'protected_source')),
  constraint c3ops_oar_custody_resolution_event_resolution_status_check
    check (resolution_status in ('resolved', 'held')),
  constraint c3ops_oar_custody_resolution_event_process_key_check
    check (process_key in (
      'oar_lifecycle_resolution_v1',
      'oar_custody_resolution_v1',
      'oar_evidence_asset_custody_resolution_v1'
    )),
  constraint c3ops_oar_custody_resolution_event_resolved_has_custody_check
    check (resolution_status <> 'resolved' or (custody_type is not null and custody_reference is not null)),
  constraint c3ops_oar_custody_resolution_event_held_has_reason_check
    check (resolution_status <> 'held' or hold_reason is not null),
  constraint c3ops_oar_custody_resolution_event_metadata_object_check
    check (jsonb_typeof(metadata) = 'object')
);

create index if not exists c3ops_oar_custody_resolution_event_execution_idx
  on public.c3ops_oar_custody_resolution_event(related_execution_instance);

create index if not exists c3ops_oar_custody_resolution_event_oar_relation_idx
  on public.c3ops_oar_custody_resolution_event(related_oar1, related_oar2);

create index if not exists c3ops_oar_custody_resolution_event_process_status_idx
  on public.c3ops_oar_custody_resolution_event(process_key, resolution_status);

alter table public.c3ops_oar_custody_resolution_event enable row level security;

revoke all on table public.c3ops_oar_custody_resolution_event from public, anon, authenticated;
grant select, insert on table public.c3ops_oar_custody_resolution_event to service_role;

comment on table public.c3ops_oar_custody_resolution_event is
  'Recoverability and transition-event persistence for the registered c3Ops OAR lifecycle/custody resolver. Contents are service-role governed and are not public custody.';

comment on column public.c3ops_oar_custody_resolution_event.custody_reference is
  'Reference to registered custody, not proof of publication and not authorization to dereference protected Source.';

commit;
