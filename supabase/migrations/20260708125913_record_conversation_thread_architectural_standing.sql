-- OAR2: oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1 §7
-- Records architectural standing only — no implementation. Conversation Threads have functioned
-- well operationally but are not themselves governed system objects; Registry remains authority.

insert into public.system_process_registry
  (process_key, process_family, title, status, source_path, authority_state, metadata, process_title, process_scope, process_status, authority_level, source_reference_set, required_oar_type, requires_operator_confirm, requires_preflight, requires_oar1_closeout)
values
  (
    'conversation_threads_working_surface_standing_v1',
    'system_architecture',
    'Conversation Threads — Architectural Standing',
    'seeded',
    'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md',
    'file_seeded_db_referenced',
    jsonb_build_object(
      'system', 'measures_registry',
      'operator', 'op044',
      'function', 'operational_collaboration_surface',
      'status', 'working_surface',
      'authority', 'none',
      'source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md',
      'note', 'Registry remains authority. Threads remain operational collaboration surfaces until a governed Role Workbench exists.'
    ),
    'Conversation Threads — Architectural Standing',
    'measures_registry',
    'draft',
    'system',
    '[]'::jsonb,
    'oar2',
    true,
    true,
    true
  );
