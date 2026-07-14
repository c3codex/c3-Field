-- Establish Capacity-Aware Executor Routing for New Moon to Lion's Gate (addendum)
-- Source OAR2 addendum: docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md
-- Amends: docs/oar/c3_field/oar2_register_new_moon_to_lions_gate_inanna_seat_initiative_v1.meta.md
-- Expected OAR1: docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md
--
-- DRAFTED BUT NOT YET APPLIED (see OAR1 for disposition: blocked_before_mutation).
-- Prepared against the schema Cody's completed initiative-registration OAR1
-- (docs/oar/c3_field/oar1_register_new_moon_to_lions_gate_inanna_seat_initiative_v1.meta.md)
-- reveals as already live: public.c3_role_contract and public.c3_evidence_contract
-- already hold active rows for chazz/claude/cody advisement on this initiative.
-- No new table is created. This reconciles those existing rows and the existing
-- system_process_registry initiative row additively (jsonb merge), and registers
-- this addendum's own OAR2 -> OAR1 lifecycle in the c3 Field OAR spine and the
-- generic process/queue/evidence spine, without touching Cody's already-closed
-- registration queue/process-instance rows (no overlapping mutation).
--
-- Known schema gap, not patched here: public.c3_oar_transition_event's actor
-- check constraint does not include 'claude'. Recorded in OAR1 as an exact gap
-- with a bounded recommendation; the queue/confirm transition below is recorded
-- with actor = 'operator' (op044 approval), not a fabricated 'claude' actor.

-- ============================================================
-- 1. Reconcile initiative-level routing standing
--    (existing system_process_registry row, additive metadata merge)
-- ============================================================

update public.system_process_registry
set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'executor_routing', jsonb_build_object(
    'source_oar2_addendum', 'docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
    'default_route', jsonb_build_object(
      'claude', 'primary_executor_sustained_mutations_primary_oar1',
      'cody', 'bounded_executor_advisor_validation_evidence',
      'chazz', 'systems_advisor_cross_surface_validation',
      'op044', 'authority_route_decisions_release_and_cutover_approval'
    ),
    'single_mutation_executor_rule', 'Each bounded OAR2 names exactly one primary mutation executor; additional roles receive advisor/reviewer/validator standing only unless the OAR2 defines non-overlapping mutation surfaces explicitly.',
    'capacity_aware_assignment_rule', 'Route to Claude by default for long-running, multi-stage, database-heavy, migration-heavy, registry-wide, dependency-sensitive, continuity-sensitive, critical-path work. Route to Cody for bounded, discrete, independently testable, source-focused, validation-focused, low-overlap work closable within one execution chain.',
    'non_overlapping_work_rule', 'Parallel work permitted only when each surface is explicitly named, each executor has a separate bounded assignment, database/source objects do not overlap, evidence responsibilities are distinct, integration order and rollback ownership are defined.',
    'dual_advisement_requirement', 'Both Claude and Cody retain advisement standing at discovery completion, architecture routing, pre-mutation review, parallel FREE verification, pre-cutover readiness, and rollback/material revision. Advisement is recorded separately from execution; silence is not agreement.',
    'current_registration_exception', 'The initiative-registration OAR2/OAR1 (oar2_register_new_moon_to_lions_gate_inanna_seat_initiative_v1 / oar1_register_new_moon_to_lions_gate_inanna_seat_initiative_v1) closed with Cody as executor as a bounded exception; it does not alter default routing going forward.',
    'registered_at', now()
  )
)
where process_key = 'new_moon_to_lions_gate_2026';

-- ============================================================
-- 2. Reconcile existing role_contract rows with routing standing
--    (additive metadata merge only; does not alter role_key, does
--    not touch the nine native relational roles)
-- ============================================================

update public.c3_role_contract
set
  mutation_authority_allowed = true,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'routing_standing', 'default_primary_executor_sustained_mutations',
    'routing_source_oar2_addendum', 'docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
    'routing_note', 'Default primary mutation executor for the remaining New Moon to Lion''s Gate critical path. Advises before executing; does not replace operator authority or expand scope independently.'
  )
where role_key = 'claude_codex_database_advisement_new_moon_to_lions_gate_2026';

update public.c3_role_contract
set
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'routing_standing', 'bounded_executor_advisor_and_independent_validator',
    'routing_source_oar2_addendum', 'docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
    'routing_note', 'Bounded executor, advisor, and independent validator for the remaining critical path. May not mutate an active Claude-owned surface unless a later OAR2 explicitly transfers or divides authority. Does not author the primary OAR1 for Claude-owned execution.'
  )
where role_key = 'cody_source_free_advisement_new_moon_to_lions_gate_2026';

update public.c3_role_contract
set
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'routing_standing', 'systems_advisor_and_cross_surface_validator',
    'routing_source_oar2_addendum', 'docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
    'routing_note', 'Systems architecture, initiative steering, cross-executor reconciliation, drift advisement, live-browser validation. Does not become mutation authority through advisement or validation.'
  )
where role_key = 'chazz_systems_advisement_new_moon_to_lions_gate_2026';

-- ============================================================
-- 3. c3 Field OAR spine: register this addendum's own lifecycle
--    (distinct process_instance_key from Cody's closed
--    new_moon_to_lions_gate_2026_initiative_registration - no overlap)
-- ============================================================

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
  execution_result
) values (
  'c3field_executor_routing_new_moon_to_lions_gate_2026_v1',
  'docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
  'confirmed',
  'docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
  'docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
  'supabase/migrations/20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql',
  'valid',
  'completed',
  'chazz_review_required',
  'not_applicable',
  null,
  'seeded',
  'Reconciled existing c3_role_contract rows and the initiative system_process_registry row with capacity-aware routing standing. Claude established as default primary executor; Cody as bounded executor/validator; Chazz as systems advisor/validator. Cody''s prior initiative-registration OAR1 preserved as a closed bounded exception, not reopened.'
)
on conflict (process_instance_key) do update set
  actual_oar1_path = excluded.actual_oar1_path,
  execution_standing = excluded.execution_standing,
  validation_standing = excluded.validation_standing,
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
) values (
  'c3field_executor_routing_new_moon_to_lions_gate_2026_v1_operator_confirmed',
  'c3field_executor_routing_new_moon_to_lions_gate_2026_v1',
  'operator',
  'not_queued',
  'confirmed',
  'queue',
  '2026-07-14T00:00:00-05:00',
  'docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
  'op044 approved capacity-aware executor routing addendum: Claude primary executor, Cody bounded executor/validator, Chazz systems advisor, single-mutation-executor rule in force.'
)
on conflict (transition_event_key) do nothing;

insert into public.c3_oar_seeded_reference (
  seeded_reference_key,
  seeded_reference_type,
  seeded_reference_path,
  seeded_status
) values (
  'executor_routing_new_moon_to_lions_gate_2026_v1',
  'role',
  'docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md',
  'seeded'
)
on conflict (seeded_reference_key) do update set
  seeded_reference_path = excluded.seeded_reference_path,
  seeded_status = excluded.seeded_status;

-- ============================================================
-- 4. Generic process/queue/evidence spine: register this
--    addendum's own bounded queue (distinct queue_key from
--    Cody's closed new_moon_to_lions_gate_2026_registration_queue)
-- ============================================================

insert into public.system_oar_queue (
  queue_key,
  process_key,
  oar_key,
  oar_type,
  queue_status,
  operator_key,
  system_key,
  scope_key,
  requested_action,
  execution_boundary,
  preflight_status,
  operator_confirmed_at,
  execution_started_at
) values (
  'executor_routing_new_moon_to_lions_gate_2026_addendum_v1',
  'new_moon_to_lions_gate_2026',
  'oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1',
  'oar2',
  'executing',
  'op044',
  'c3_field',
  'new_moon_to_lions_gate_2026',
  'reconcile_executor_routing_standing',
  'routing_registration_only_no_content_mutation_no_overlap_with_prior_registration_queue',
  'passed',
  '2026-07-14T00:00:00-05:00',
  now()
)
on conflict (queue_key) do nothing;

insert into public.system_oar_execution_evidence (
  evidence_key,
  queue_key,
  evidence_type,
  evidence_summary,
  validation_query,
  validation_result,
  artifact_path
) values (
  'executor_routing_new_moon_to_lions_gate_2026_addendum_v1_migration',
  'executor_routing_new_moon_to_lions_gate_2026_addendum_v1',
  'migration_result',
  'Reconciled existing c3_role_contract rows (claude/cody/chazz) and system_process_registry initiative metadata with capacity-aware routing standing. No new tables. c3_oar_transition_event.actor check constraint does not include claude - recorded as an exact gap, not patched under this bounded addendum.',
  'select role_key, mutation_authority_allowed, metadata -> ''routing_standing'' as routing_standing from public.c3_role_contract where role_key like ''%new_moon_to_lions_gate_2026''',
  jsonb_build_object(
    'process_instance_key', 'c3field_executor_routing_new_moon_to_lions_gate_2026_v1',
    'expected_routing_standing', jsonb_build_object(
      'claude_codex_database_advisement_new_moon_to_lions_gate_2026', 'default_primary_executor_sustained_mutations',
      'cody_source_free_advisement_new_moon_to_lions_gate_2026', 'bounded_executor_advisor_and_independent_validator',
      'chazz_systems_advisement_new_moon_to_lions_gate_2026', 'systems_advisor_and_cross_surface_validator'
    ),
    'gap_found', 'c3_oar_transition_event_actor_check does not include claude',
    'gap_disposition', 'documented_in_oar1_not_patched'
  ),
  'supabase/migrations/20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql'
)
on conflict (evidence_key) do nothing;

update public.system_oar_queue
set
  queue_status = 'closed',
  execution_completed_at = now(),
  oar1_path = 'docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md'
where queue_key = 'executor_routing_new_moon_to_lions_gate_2026_addendum_v1';
