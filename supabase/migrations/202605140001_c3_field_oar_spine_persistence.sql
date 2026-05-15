create table if not exists public.c3_oar_process_instance (
  process_instance_key text primary key,
  source_oar2_path text not null,
  source_oar2_standing text not null check (source_oar2_standing in ('confirmed', 'proposed', 'review_only')),
  expected_oar1_path text not null,
  actual_oar1_path text,
  evidence_path text,
  lifecycle_type text not null check (lifecycle_type in ('valid', 'held', 'correction', 'blocked')),
  execution_standing text not null check (execution_standing in ('not_queued', 'queued', 'executing', 'completed', 'blocked', 'held')),
  validation_standing text not null check (validation_standing in ('not_ready', 'pending_validation', 'automatic_pass', 'chazz_review_required', 'operator_required', 'correction_required')),
  deploy_standing text not null check (deploy_standing in ('not_authorized', 'not_applicable', 'configured', 'deployed', 'held')),
  held_standing text check (
    held_standing is null or
    held_standing in (
      'held_pending_operator',
      'held_pending_source',
      'held_pending_validation',
      'held_pending_identity',
      'held_pending_deployment',
      'held_pending_correction_oar2'
    )
  ),
  seeded_reference_standing text not null check (seeded_reference_standing in ('seeded', 'unseeded_blocked', 'pending')),
  correction_source_oar2_path text,
  correction_oar2_path text,
  partial_oar1_reference text,
  validation_finding text,
  correction_scope text,
  execution_result text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.c3_oar_transition_event (
  transition_event_key text primary key,
  process_instance_key text not null references public.c3_oar_process_instance(process_instance_key),
  actor text not null check (actor in ('operator', 'chazz', 'cody', 'measures', 'notchazz')),
  from_status text not null,
  to_status text not null,
  transition_type text not null check (transition_type in ('queue', 'execution', 'validation', 'held', 'correction', 'seeded_reference', 'deployment')),
  "timestamp" timestamptz not null,
  evidence_reference text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.c3_oar_seeded_reference (
  seeded_reference_key text primary key,
  seeded_reference_type text not null check (seeded_reference_type in ('infrastructure', 'role', 'process', 'validation')),
  seeded_reference_path text not null,
  seeded_status text not null check (seeded_status in ('seeded', 'active_infrastructure_reference', 'active_process_reference')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.c3_oar_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists c3_oar_process_instance_set_updated_at on public.c3_oar_process_instance;
create trigger c3_oar_process_instance_set_updated_at
before update on public.c3_oar_process_instance
for each row execute function public.c3_oar_set_updated_at();

drop trigger if exists c3_oar_seeded_reference_set_updated_at on public.c3_oar_seeded_reference;
create trigger c3_oar_seeded_reference_set_updated_at
before update on public.c3_oar_seeded_reference
for each row execute function public.c3_oar_set_updated_at();

create or replace function public.c3_oar_prevent_transition_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'c3_oar_transition_event is append-only';
end;
$$;

drop trigger if exists c3_oar_transition_event_no_update on public.c3_oar_transition_event;
create trigger c3_oar_transition_event_no_update
before update on public.c3_oar_transition_event
for each row execute function public.c3_oar_prevent_transition_mutation();

drop trigger if exists c3_oar_transition_event_no_delete on public.c3_oar_transition_event;
create trigger c3_oar_transition_event_no_delete
before delete on public.c3_oar_transition_event
for each row execute function public.c3_oar_prevent_transition_mutation();

alter table public.c3_oar_process_instance enable row level security;
alter table public.c3_oar_transition_event enable row level security;
alter table public.c3_oar_seeded_reference enable row level security;

drop policy if exists "c3_oar_process_instance_public_read" on public.c3_oar_process_instance;
create policy "c3_oar_process_instance_public_read"
on public.c3_oar_process_instance
for select
to anon, authenticated
using (true);

drop policy if exists "c3_oar_transition_event_public_read" on public.c3_oar_transition_event;
create policy "c3_oar_transition_event_public_read"
on public.c3_oar_transition_event
for select
to anon, authenticated
using (true);

drop policy if exists "c3_oar_seeded_reference_public_read" on public.c3_oar_seeded_reference;
create policy "c3_oar_seeded_reference_public_read"
on public.c3_oar_seeded_reference
for select
to anon, authenticated
using (true);

insert into public.c3_oar_process_instance (
  process_instance_key,
  source_oar2_path,
  source_oar2_standing,
  expected_oar1_path,
  actual_oar1_path,
  evidence_path,
  lifecycle_type,
  execution_standing,
  validation_standing,
  deploy_standing,
  held_standing,
  seeded_reference_standing,
  correction_source_oar2_path,
  correction_oar2_path,
  partial_oar1_reference,
  validation_finding,
  correction_scope,
  execution_result
) values
(
  'c3fc_phase_1_oar_operations_spine_v1',
  'docs/oar/c3_field_convergence/oar2_phase_1_oar_operations_spine_v1.meta.md',
  'confirmed',
  'docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md',
  'docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md',
  'src/c3_field_convergence/operationsSpine.ts',
  'valid',
  'completed',
  'pending_validation',
  'configured',
  null,
  'seeded',
  null,
  null,
  null,
  null,
  null,
  'Minimum viable OAR operations spine implemented as bounded runtime console.'
),
(
  'controlled_valid_oar2_cycle_v1',
  'docs/oar/c3_field_convergence/oar2_controlled_valid_cycle_v1.meta.md',
  'confirmed',
  'docs/oar/c3_field_convergence/oar1_controlled_valid_cycle_v1.meta.md',
  'docs/oar/c3_field_convergence/oar1_controlled_valid_cycle_v1.meta.md',
  'src/c3_field_convergence/operationsSpine.ts',
  'valid',
  'completed',
  'chazz_review_required',
  'not_applicable',
  null,
  'seeded',
  null,
  null,
  null,
  'Controlled valid lifecycle preserves OAR2 -> execution -> OAR1 -> validation continuity.',
  null,
  'Valid controlled lifecycle completed and routed to Chazz review.'
),
(
  'controlled_held_oar2_cycle_v1',
  'docs/oar/c3_field_convergence/oar2_controlled_held_cycle_v1.meta.md',
  'confirmed',
  'docs/oar/c3_field_convergence/oar1_controlled_held_cycle_v1.meta.md',
  null,
  'src/c3_field_convergence/operationsSpine.ts',
  'held',
  'held',
  'operator_required',
  'held',
  'held_pending_operator',
  'seeded',
  null,
  null,
  null,
  'Held standing remains visible and does not silently execute.',
  'operator condition required before OAR1 proof',
  'Held lifecycle stopped before OAR1 proof until operator condition is resolved.'
),
(
  'controlled_correction_lineage_oar2_cycle_v1',
  'docs/oar/c3_field_convergence/oar2_controlled_correction_cycle_v1.meta.md',
  'confirmed',
  'docs/oar/c3_field_convergence/oar1_controlled_correction_cycle_v1.meta.md',
  'docs/oar/c3_field_convergence/oar1_controlled_partial_cycle_v1.meta.md',
  'src/c3_field_convergence/operationsSpine.ts',
  'correction',
  'held',
  'correction_required',
  'not_authorized',
  'held_pending_correction_oar2',
  'seeded',
  'docs/oar/c3_field_convergence/oar2_controlled_correction_cycle_v1.meta.md',
  'docs/oar/c3_field_convergence/oar2_controlled_correction_followup_v1.meta.md',
  'docs/oar/c3_field_convergence/oar1_controlled_partial_cycle_v1.meta.md',
  'Correction lineage retains source OAR2, partial OAR1, validation finding, and follow-up scope.',
  'bounded correction follow-up only',
  'Correction lifecycle retained lineage and blocked deployment.'
),
(
  'blocked_proposed_surface_example',
  'docs/oar/c3_field_convergence/example_proposed_only.meta.md',
  'proposed',
  'unavailable',
  null,
  null,
  'blocked',
  'blocked',
  'not_ready',
  'not_authorized',
  'held_pending_source',
  'unseeded_blocked',
  null,
  null,
  null,
  'Queue rule demonstration: proposed-only standing is not executable.',
  null,
  'Blocked before Cody execution.'
),
(
  'blocked_review_only_surface_example',
  'docs/oar/c3_field_convergence/example_review_only.meta.md',
  'review_only',
  'unavailable',
  null,
  null,
  'blocked',
  'blocked',
  'not_ready',
  'not_authorized',
  'held_pending_operator',
  'unseeded_blocked',
  null,
  null,
  null,
  'Queue rule demonstration: review-only surfaces cannot execute.',
  null,
  'Blocked before Cody execution.'
)
on conflict (process_instance_key) do update set
  source_oar2_path = excluded.source_oar2_path,
  source_oar2_standing = excluded.source_oar2_standing,
  expected_oar1_path = excluded.expected_oar1_path,
  actual_oar1_path = excluded.actual_oar1_path,
  evidence_path = excluded.evidence_path,
  lifecycle_type = excluded.lifecycle_type,
  execution_standing = excluded.execution_standing,
  validation_standing = excluded.validation_standing,
  deploy_standing = excluded.deploy_standing,
  held_standing = excluded.held_standing,
  seeded_reference_standing = excluded.seeded_reference_standing,
  correction_source_oar2_path = excluded.correction_source_oar2_path,
  correction_oar2_path = excluded.correction_oar2_path,
  partial_oar1_reference = excluded.partial_oar1_reference,
  validation_finding = excluded.validation_finding,
  correction_scope = excluded.correction_scope,
  execution_result = excluded.execution_result;

insert into public.c3_oar_transition_event (
  transition_event_key,
  process_instance_key,
  actor,
  from_status,
  to_status,
  transition_type,
  "timestamp",
  evidence_reference,
  notes
) values
(
  'c3fc_phase_1_oar_operations_spine_v1_operator_confirmed',
  'c3fc_phase_1_oar_operations_spine_v1',
  'operator',
  'not_queued',
  'confirmed',
  'queue',
  '2026-05-14T00:00:00-05:00',
  'docs/oar/c3_field_convergence/oar2_phase_1_oar_operations_spine_v1.meta.md',
  'OAR2 routed as Phase 1 operational spine implementation surface.'
),
(
  'c3fc_phase_1_oar_operations_spine_v1_cody_executing',
  'c3fc_phase_1_oar_operations_spine_v1',
  'cody',
  'confirmed',
  'executing',
  'execution',
  '2026-05-14T00:10:00-05:00',
  'src/c3_field_convergence/operationsSpine.ts',
  'Cody execution began from seated OAR2 authority.'
),
(
  'c3fc_phase_1_oar_operations_spine_v1_pending_validation',
  'c3fc_phase_1_oar_operations_spine_v1',
  'cody',
  'executing',
  'pending_validation',
  'validation',
  '2026-05-14T00:20:00-05:00',
  'docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md',
  'OAR operations console implemented; OAR1 proof required for closeout.'
),
(
  'controlled_valid_oar2_cycle_v1_completed',
  'controlled_valid_oar2_cycle_v1',
  'cody',
  'queued',
  'completed',
  'execution',
  '2026-05-14T00:30:00-05:00',
  'src/c3_field_convergence/operationsSpine.ts',
  'Controlled valid lifecycle reached OAR1 proof and external validation queue.'
),
(
  'controlled_held_oar2_cycle_v1_held',
  'controlled_held_oar2_cycle_v1',
  'notchazz',
  'queued',
  'held_pending_operator',
  'held',
  '2026-05-14T00:40:00-05:00',
  'src/c3_field_convergence/operationsSpine.ts',
  'Held lifecycle preserved visible stop condition before execution completion.'
),
(
  'controlled_correction_lineage_oar2_cycle_v1_correction_required',
  'controlled_correction_lineage_oar2_cycle_v1',
  'chazz',
  'pending_validation',
  'correction_required',
  'correction',
  '2026-05-14T00:50:00-05:00',
  'docs/oar/c3_field_convergence/oar2_controlled_correction_followup_v1.meta.md',
  'Correction lineage preserved source OAR2, partial OAR1, finding, and correction OAR2 route.'
)
on conflict (transition_event_key) do nothing;

insert into public.c3_oar_seeded_reference (
  seeded_reference_key,
  seeded_reference_type,
  seeded_reference_path,
  seeded_status
) values
(
  'c3field_online_infrastructure_activation_v1',
  'infrastructure',
  'docs/oar/c3_field_convergence/oar1_c3field_online_infrastructure_activation_v1.meta.md',
  'active_infrastructure_reference'
),
(
  'foundational_role_registration_v1',
  'role',
  'docs/oar/c3_field_convergence/oar1_foundational_role_registration_v1.meta.md',
  'active_process_reference'
),
(
  'phase_1_oar_operations_spine_v1',
  'process',
  'docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md',
  'seeded'
),
(
  'phase_1_operational_spine_validation_refinement_v1',
  'validation',
  'docs/oar/c3_field_convergence/oar1_phase_1_operational_spine_validation_refinement_v1.meta.md',
  'seeded'
)
on conflict (seeded_reference_key) do update set
  seeded_reference_type = excluded.seeded_reference_type,
  seeded_reference_path = excluded.seeded_reference_path,
  seeded_status = excluded.seeded_status;
