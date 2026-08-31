-- OAR2: complete_dizzy_worker_scheduler_integration_codex_002
-- Establishes Dizzy's bounded worker identity and scheduler relation for the
-- recovered Lapzuli Distribution Cloudflare implementation.
-- This does not grant publication authority, autonomous distribution authority,
-- Registry authority, or autonomous external-write authority.

insert into public.system_process_registry (
  process_key,
  process_family,
  title,
  status,
  source_path,
  authority_state,
  process_title,
  process_scope,
  process_status,
  authority_level,
  source_reference_set,
  required_oar_type,
  requires_operator_confirm,
  requires_preflight,
  requires_oar1_closeout,
  metadata
) values (
  'dizzy_lapzuli_distribution_worker_v1',
  'publication_governance',
  'Dizzy Lapzuli Distribution Worker v1',
  'active',
  'CanCom/codex/oar2_complete_dizzy_worker_scheduler_integration_codex_002.meta.md',
  'operator_confirmed_bounded_worker_binding',
  'Dizzy Lapzuli Distribution Worker v1',
  'lapzuli_distribution',
  'active',
  'governed',
  jsonb_build_array(
    jsonb_build_object(
      'source_type', 'oar2',
      'path', 'CanCom/codex/oar2_complete_dizzy_worker_scheduler_integration_codex_002.meta.md',
      'sha256', '2d2fe47c1aab07e1060c75c421b5217e6fd948913f3745945da588db29078a51'
    )
  ),
  'oar2',
  true,
  true,
  true,
  jsonb_build_object(
    'standing', 'bounded_worker_binding_established',
    'operator', 'op044',
    'executor', 'Codex',
    'role_identity', 'Dizzy',
    'worker_name', 'lapzuli-distribution-worker',
    'worker_source_path', 'workers/lapzuli-distribution-worker',
    'lapzuli_process', 'lapzuli_distribution',
    'primitive_identity', 'env.role_call',
    'call_relation', 'Lapzuli Distribution -> env.role_call -> Dizzy',
    'manual_execution_path', 'lapzuli-distribution-worker /role-call/proof',
    'scheduled_execution_path', 'undrifted-social-scheduler -> DIZZY service binding -> lapzuli-distribution-worker /role-call/proof',
    'qualification_required_upstream', true,
    'operator_confirmation_required', true,
    'publication_authority', 'none',
    'autonomous_distribution_authority', 'none',
    'registry_authority', 'none',
    'autonomous_external_write_authority', 'none',
    'historical_lapzuli_proof_preserved', true,
    'source_oar2_sha256', '2d2fe47c1aab07e1060c75c421b5217e6fd948913f3745945da588db29078a51'
  )
), (
  'dizzy_worker_scheduler_integration_v1',
  'publication_governance',
  'Dizzy Worker Scheduler Integration v1',
  'active',
  'CanCom/codex/oar2_complete_dizzy_worker_scheduler_integration_codex_002.meta.md',
  'operator_confirmed_bounded_scheduler_integration',
  'Dizzy Worker Scheduler Integration v1',
  'lapzuli_distribution',
  'active',
  'governed',
  jsonb_build_array(
    jsonb_build_object(
      'source_type', 'oar2',
      'path', 'CanCom/codex/oar2_complete_dizzy_worker_scheduler_integration_codex_002.meta.md',
      'sha256', '2d2fe47c1aab07e1060c75c421b5217e6fd948913f3745945da588db29078a51'
    )
  ),
  'oar2',
  true,
  true,
  true,
  jsonb_build_object(
    'standing', 'bounded_scheduler_integration_established',
    'operator', 'op044',
    'executor', 'Codex',
    'scheduler_name', 'undrifted-social-scheduler',
    'scheduler_source_path', 'workers/undrifted-social-scheduler',
    'worker_process_key', 'dizzy_lapzuli_distribution_worker_v1',
    'service_binding', 'DIZZY',
    'd1_database', 'undrifted-social-scheduler-state',
    'd1_database_id', '92578a5a-68fb-452a-89b3-2240ba90c91a',
    'scheduled_relation', 'scheduled governed state -> undrifted-social-scheduler -> Lapzuli Distribution -> env.role_call -> Dizzy -> external encounter -> return evidence -> Persistence / CanCom continuation',
    'duplicate_dispatch_protection', 'UPDATE scheduled_posts SET status = attempting WHERE id = ? AND status = scheduled; changes != 1 is duplicate_or_already_claimed',
    'scheduling_authority', 'attempt_timing_only',
    'publication_authority', 'none',
    'autonomous_distribution_authority', 'none',
    'registry_authority', 'none',
    'autonomous_external_write_authority', 'none',
    'return_evidence_surface', 'scheduled_posts platform_uri/platform_cid/public_url/evidence_at plus OAR1 closeout',
    'source_oar2_sha256', '2d2fe47c1aab07e1060c75c421b5217e6fd948913f3745945da588db29078a51'
  )
)
on conflict (process_key) do update
set
  status = excluded.status,
  source_path = excluded.source_path,
  authority_state = excluded.authority_state,
  process_title = excluded.process_title,
  process_scope = excluded.process_scope,
  process_status = excluded.process_status,
  authority_level = excluded.authority_level,
  source_reference_set = excluded.source_reference_set,
  required_oar_type = excluded.required_oar_type,
  requires_operator_confirm = excluded.requires_operator_confirm,
  requires_preflight = excluded.requires_preflight,
  requires_oar1_closeout = excluded.requires_oar1_closeout,
  metadata = coalesce(public.system_process_registry.metadata, '{}'::jsonb) || excluded.metadata,
  updated_at = now();
