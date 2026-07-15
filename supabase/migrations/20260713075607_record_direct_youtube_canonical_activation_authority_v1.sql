-- OAR2: oar2_establish_direct_canonical_youtube_publication_authority_v1
-- Scope: registry/evidence setup for direct canonical YouTube activation.
-- No upload, scheduling, publishing, media mutation, derivative creation, or secret storage.

insert into public.measures_distribution_executor (
  executor_key,
  executor_name,
  executor_type,
  platform,
  role_class,
  execution_mode,
  credential_reference,
  status,
  supports_media,
  supports_video,
  supports_threads,
  supports_carousel,
  supports_scheduling,
  supports_draft,
  supports_publish,
  metadata,
  optics
) values (
  'direct_youtube_api',
  'Direct YouTube Data API',
  'platform_api',
  'youtube',
  'System',
  'direct_youtube_api',
  'YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN or YOUTUBE_ACCESS_TOKEN',
  'held',
  true,
  true,
  false,
  false,
  true,
  false,
  true,
  jsonb_build_object(
    'source_oar2', 'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
    'governing_determination', 'YouTube is canonical institutional media library; Buffer is downstream distribution scheduler',
    'required_oauth_scope_upload', 'https://www.googleapis.com/auth/youtube.upload',
    'required_oauth_scope_playlist_or_thumbnail', 'https://www.googleapis.com/auth/youtube or https://www.googleapis.com/auth/youtube.force-ssl',
    'hold_reason', 'missing_youtube_oauth_upload_credentials',
    'direct_activation_plan_markdown_path', 'docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.md',
    'direct_activation_plan_json_path', 'docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.json'
  ),
  jsonb_build_object('observes', 'publication_execution', 'models_individuals_as_primary', false)
)
on conflict (executor_key) do update
set
  credential_reference = excluded.credential_reference,
  status = excluded.status,
  metadata = public.measures_distribution_executor.metadata || excluded.metadata,
  optics = public.measures_distribution_executor.optics || excluded.optics,
  updated_at = now();

insert into public.measures_distribution_channel (
  channel_key,
  executor_key,
  platform,
  account_name,
  channel_identifier,
  channel_url,
  status,
  role_owner,
  credential_reference,
  metadata,
  optics
) values (
  'youtube_measures_registry_direct',
  'direct_youtube_api',
  'youtube',
  'Measures Registry',
  'UC84Jbvswj0ykzd5nuKxoNSA',
  'https://www.youtube.com/channel/UC84Jbvswj0ykzd5nuKxoNSA',
  'held',
  'System',
  'YOUTUBE_OAUTH_BOUNDARY',
  jsonb_build_object(
    'source_oar2', 'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
    'channel_ownership_standing', 'confirmed_by_buffer_channel_and_registered_endpoint_evidence',
    'canonical_library', true,
    'hold_reason', 'direct_upload_oauth_missing'
  ),
  jsonb_build_object('observes', 'publication_execution', 'models_individuals_as_primary', false)
)
on conflict (channel_key) do update
set
  executor_key = excluded.executor_key,
  channel_identifier = excluded.channel_identifier,
  channel_url = excluded.channel_url,
  status = excluded.status,
  credential_reference = excluded.credential_reference,
  metadata = public.measures_distribution_channel.metadata || excluded.metadata,
  optics = public.measures_distribution_channel.optics || excluded.optics,
  updated_at = now();

update public.measures_publication_campaign
set metadata = metadata || jsonb_build_object(
  'direct_youtube_canonical_activation', jsonb_build_object(
    'source_oar2', 'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
    'direct_activation_plan_markdown_path', 'docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.md',
    'direct_activation_plan_json_path', 'docs/oar/measures_registry/direct_youtube_canonical_activation_plan_v1.json',
    'recommended_path', 'Canonical Video -> Direct YouTube Publication -> Registry Evidence -> Buffer Distribution -> Social Endpoints',
    'buffer_role_after_revision', 'downstream_distribution_scheduler',
    'direct_youtube_executor_key', 'direct_youtube_api',
    'direct_youtube_channel_key', 'youtube_measures_registry_direct',
    'final_disposition', 'HELD WITH REASON',
    'hold_reason', 'missing_youtube_oauth_upload_credentials'
  )
),
updated_at = now()
where campaign_key = 'launch_cycle_001_canonical_media_activation_v1';

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
      'measures_canonical_youtube_about_measures_registry_v1',
      'direct_youtube_api',
      'youtube_measures_registry_direct',
      'held',
      'direct_youtube_api',
      1,
      null::timestamptz,
      jsonb_build_object('youtube_video_id', null, 'public_url', null, 'publication_status', 'held', 'evidence_timestamp', now()),
      'missing_youtube_oauth_upload_credentials',
      'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'direct_youtube__measures_registry__about_measures_registry__v1'),
      jsonb_build_object('observes', 'publication_execution', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_ai_isnt_broken_intro_v1',
      'direct_youtube_api',
      'youtube_measures_registry_direct',
      'held',
      'direct_youtube_api',
      1,
      null::timestamptz,
      jsonb_build_object('youtube_video_id', null, 'public_url', null, 'publication_status', 'held', 'evidence_timestamp', now()),
      'missing_youtube_oauth_upload_credentials',
      'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'direct_youtube__measures_registry__ai_isnt_broken_intro__v1'),
      jsonb_build_object('observes', 'publication_execution', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_crystal_seat_orientation_v1',
      'direct_youtube_api',
      'youtube_measures_registry_direct',
      'held',
      'direct_youtube_api',
      1,
      null::timestamptz,
      jsonb_build_object('youtube_video_id', null, 'public_url', null, 'publication_status', 'held', 'evidence_timestamp', now()),
      'missing_youtube_oauth_upload_credentials',
      'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'direct_youtube__measures_registry__crystal_seat_orientation__v1'),
      jsonb_build_object('observes', 'publication_execution', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_obsidian_chamber_orientation_v1',
      'direct_youtube_api',
      'youtube_measures_registry_direct',
      'held',
      'direct_youtube_api',
      1,
      null::timestamptz,
      jsonb_build_object('youtube_video_id', null, 'public_url', null, 'publication_status', 'held', 'evidence_timestamp', now()),
      'missing_youtube_oauth_upload_credentials',
      'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'direct_youtube__measures_registry__obsidian_chamber_orientation__v1'),
      jsonb_build_object('observes', 'publication_execution', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_assessment_report_orientation_v1',
      'direct_youtube_api',
      'youtube_measures_registry_direct',
      'held',
      'direct_youtube_api',
      1,
      null::timestamptz,
      jsonb_build_object('youtube_video_id', null, 'public_url', null, 'publication_status', 'held', 'evidence_timestamp', now()),
      'missing_youtube_oauth_upload_credentials',
      'OAR/OAR2/publication/oar2_establish_direct_canonical_youtube_publication_authority_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'direct_youtube__measures_registry__assessment_report_orientation__v1'),
      jsonb_build_object('observes', 'publication_execution', 'models_individuals_as_primary', false)
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
