-- OAR2: oar2_implement_buffer_native_publication_execution_v1
-- Records retry evidence for three Buffer YouTube draft attempts that remained rejected.
-- No scheduling, publishing, media mutation, or secret storage.

insert into public.measures_distribution_execution (
  distribution_asset_id,
  executor_key,
  channel_key,
  execution_status,
  execution_mode,
  attempt_number,
  scheduled_for,
  evidence,
  error,
  source_oar2,
  created_by_actor_class,
  created_by_actor_key,
  approved_by_actor_class,
  approved_by_actor_key,
  metadata,
  optics
)
select *
from (
  values
    (
      'measures_canonical_youtube_ai_isnt_broken_intro_v1',
      'buffer',
      'youtube_measures_registry',
      'failed',
      'buffer',
      2,
      null::timestamptz,
      jsonb_build_object('buffer_state', 'not_created', 'credential_reference', 'BUFFER_SOCIAL_KEY', 'retry_reason', 'execute_packet_refresh_after_dry_run'),
      'Buffer API returned UnexpectedError: Invalid post',
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__ai_isnt_broken_intro__2026-07-14__retry_2', 'original_idempotency_key', 'launch_cycle_001__measures_registry__youtube__ai_isnt_broken_intro__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
      jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_obsidian_chamber_orientation_v1',
      'buffer',
      'youtube_measures_registry',
      'failed',
      'buffer',
      2,
      null::timestamptz,
      jsonb_build_object('buffer_state', 'not_created', 'credential_reference', 'BUFFER_SOCIAL_KEY', 'retry_reason', 'execute_packet_refresh_after_dry_run'),
      'Buffer API returned UnexpectedError: Invalid post',
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__obsidian_chamber_orientation__2026-07-14__retry_2', 'original_idempotency_key', 'launch_cycle_001__measures_registry__youtube__obsidian_chamber_orientation__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
      jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_assessment_report_orientation_v1',
      'buffer',
      'youtube_measures_registry',
      'failed',
      'buffer',
      2,
      null::timestamptz,
      jsonb_build_object('buffer_state', 'not_created', 'credential_reference', 'BUFFER_SOCIAL_KEY', 'retry_reason', 'execute_packet_refresh_after_dry_run'),
      'Buffer API returned UnexpectedError: Invalid post',
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__assessment_report_orientation__2026-07-14__retry_2', 'original_idempotency_key', 'launch_cycle_001__measures_registry__youtube__assessment_report_orientation__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
      jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
    )
) as v(
  distribution_asset_id,
  executor_key,
  channel_key,
  execution_status,
  execution_mode,
  attempt_number,
  scheduled_for,
  evidence,
  error,
  source_oar2,
  created_by_actor_class,
  created_by_actor_key,
  approved_by_actor_class,
  approved_by_actor_key,
  metadata,
  optics
)
where not exists (
  select 1
  from public.measures_distribution_execution existing
  where existing.metadata ->> 'idempotency_key' = v.metadata ->> 'idempotency_key'
);
