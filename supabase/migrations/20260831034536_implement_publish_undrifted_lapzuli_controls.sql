-- OAR2: implement_publish_undrifted_lapzuli_controls_codex_003
-- Registers the bounded Human + Compute control surface that connects
-- /publish-undrifted to the existing Lapzuli Distribution / Dizzy circuit.
-- This records implementation standing only; it does not create a second
-- distribution system or grant publication/distribution authority.

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
  'publish_undrifted_lapzuli_controls_v1',
  'publication_governance',
  'publish_undrifted Lapzuli Human + Compute Controls v1',
  'active',
  'CanCom/codex/oar2_implement_publish_undrifted_lapzuli_controls_codex_003',
  'operator_confirmed_bounded_control_surface',
  'publish_undrifted Lapzuli Human + Compute Controls v1',
  'publish_undrifted_to_lapzuli_distribution',
  'active',
  'governed',
  jsonb_build_array(
    jsonb_build_object(
      'source_type', 'oar2',
      'path', 'CanCom/codex/oar2_implement_publish_undrifted_lapzuli_controls_codex_003',
      'drive_id', '1yidpcK4rX322je0ww1O-74bt_LGW8wI92VKNGzBdXCE'
    )
  ),
  'oar2',
  true,
  true,
  true,
  jsonb_build_object(
    'standing', 'implemented_publish_undrifted_lapzuli_human_compute_controls_proven',
    'operator', 'op044',
    'executor', 'Codex',
    'passage_surface', '/publish-undrifted',
    'resulting_encounter', '/undrifted',
    'control_surface_path', 'src/measures_registry/encounter_renderer/publications/PublishUndriftedPassage.tsx',
    'proof_endpoint', '/api/publish-undrifted-lapzuli-controls',
    'existing_distribution_process', 'lapzuli_distribution',
    'worker_process_key', 'dizzy_lapzuli_distribution_worker_v1',
    'scheduler_process_key', 'dizzy_worker_scheduler_integration_v1',
    'call_relation', 'Publication Object -> RECOVER -> PREFLIGHT -> OPEN PASSAGE -> /publish-undrifted -> /undrifted -> Lapzuli Distribution -> env.role_call -> Dizzy -> external encounter -> return evidence -> Persistence / CanCom',
    'select_object_policy', 'eligible governed undrifted Drift Report publication objects only',
    'recover_relation', 'Environment -> env.role_call -> Persistence -> governed publication state',
    'destination_authority', 'independently qualified destinations only; route/operator confirmation required before dispatch or schedule',
    'duplicate_dispatch_policy', 'existing external identity or URL returns already_distributed and prevents duplicate dispatch',
    'publication_authority', 'none',
    'autonomous_distribution_authority', 'none',
    'registry_authority', 'none',
    'autonomous_external_write_authority', 'none',
    'expected_hold_without_route', 'held_route_required',
    'external_publication_effects', 0
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
