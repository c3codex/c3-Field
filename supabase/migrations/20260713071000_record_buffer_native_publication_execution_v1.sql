-- OAR2: oar2_implement_buffer_native_publication_execution_v1
-- Scope: non-secret Buffer workspace/channel identity and draft-only execution evidence.
-- No scheduling, publishing, canonical media mutation, renderer mutation, or secret storage.

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
) values
  (
    'youtube_measures_registry',
    'buffer',
    'youtube',
    'Measures Registry',
    '6a54740a80cc80cdcaa976d9',
    'https://www.youtube.com/channel/UC84Jbvswj0ykzd5nuKxoNSA',
    'active',
    'System',
    'BUFFER_SOCIAL_KEY',
    jsonb_build_object(
      'service_id', 'UC84Jbvswj0ykzd5nuKxoNSA',
      'channel_display_name', 'Measures Registry',
      'channel_verification_date', '2026-07-13',
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'
    ),
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
  ),
  (
    'facebook_measures_registry',
    'buffer',
    'facebook',
    'Measures Registry',
    '6a54734280cc80cdcaa9743b',
    'https://facebook.com/1179013795290720',
    'active',
    'System',
    'BUFFER_PUB2_KEY',
    jsonb_build_object(
      'service_id', '1179013795290720',
      'channel_display_name', 'Measures Registry',
      'channel_verification_date', '2026-07-13',
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'
    ),
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
  ),
  (
    'facebook_undrifted',
    'buffer',
    'facebook',
    'UnDrifted',
    '6a54761280cc80cdcaa97c9a',
    'https://facebook.com/1241211659068854',
    'active',
    'System',
    'BUFFER_PUB2_KEY',
    jsonb_build_object(
      'service_id', '1241211659068854',
      'channel_display_name', 'UnDrifted',
      'channel_verification_date', '2026-07-13',
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'
    ),
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
  ),
  (
    'x_undrifted_c3',
    'buffer',
    'x',
    'unDrifted_c3',
    '6a546f6380cc80cdcaa962f0',
    'https://twitter.com/unDrifted_c3',
    'active',
    'System',
    'BUFFER_PUB2_KEY',
    jsonb_build_object(
      'service_id', '2076358823602753536',
      'channel_display_name', 'unDrifted_c3',
      'channel_verification_date', '2026-07-13',
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'
    ),
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
  )
on conflict (channel_key) do update
set
  platform = excluded.platform,
  account_name = excluded.account_name,
  channel_identifier = excluded.channel_identifier,
  channel_url = excluded.channel_url,
  status = excluded.status,
  credential_reference = excluded.credential_reference,
  metadata = public.measures_distribution_channel.metadata || excluded.metadata,
  optics = public.measures_distribution_channel.optics || excluded.optics;

insert into public.measures_publication_campaign (
  campaign_key,
  publication_key,
  issue_id,
  campaign_name,
  campaign_objective,
  status,
  release_state,
  start_date,
  optics,
  metadata,
  created_by_actor_class,
  created_by_actor_key,
  approved_by_actor_class,
  approved_by_actor_key,
  review_status
) values (
  'launch_cycle_001_canonical_media_activation_v1',
  'measures_registry',
  'launch_cycle_001',
  'Launch Cycle 001 Canonical Media Activation',
  'Prepare Measures Registry canonical video assets for Buffer-native YouTube draft review without scheduling or publishing.',
  'ready_for_export',
  'draft_review_only',
  '2026-07-14'::date,
  jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
  jsonb_build_object(
    'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
    'buffer_scheduling_authorized', false,
    'buffer_publishing_authorized', false,
    'canonical_media_activation', true
  ),
  'AI',
  'Codex',
  'Human',
  'op044',
  'oar2_authorized_draft_preparation'
)
on conflict (campaign_key) do update
set
  status = excluded.status,
  release_state = excluded.release_state,
  metadata = public.measures_publication_campaign.metadata || excluded.metadata,
  review_status = excluded.review_status,
  updated_at = now();

insert into public.measures_publication_campaign_asset (
  campaign_asset_key,
  campaign_id,
  publication_asset_id,
  publication_asset_type,
  campaign_asset_type,
  title,
  status,
  optics,
  metadata,
  created_by_actor_class,
  created_by_actor_key,
  approved_by_actor_class,
  approved_by_actor_key,
  review_status
) values
  (
    'launch_cycle_001_ca_youtube_about_measures_registry_v1',
    'launch_cycle_001_canonical_media_activation_v1',
    'about_measures_registry_video',
    'canonical_media',
    'youtube_activation',
    'About Measures Registry',
    'draft',
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object('source_storage_path', 'about_measures_registry.mp4', 'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation'
  ),
  (
    'launch_cycle_001_ca_youtube_ai_isnt_broken_intro_v1',
    'launch_cycle_001_canonical_media_activation_v1',
    'intro_hook_video',
    'canonical_media',
    'youtube_activation',
    'AI Isn''t Broken',
    'draft',
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object('source_storage_path', 'ai_isnt_broken_intro.mp4', 'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation'
  ),
  (
    'launch_cycle_001_ca_youtube_crystal_seat_orientation_v1',
    'launch_cycle_001_canonical_media_activation_v1',
    'measures_position',
    'canonical_media',
    'youtube_activation',
    'Crystal Seat Orientation',
    'draft',
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object('source_storage_path', 'crystal_seat_orientation.mp4', 'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation'
  ),
  (
    'launch_cycle_001_ca_youtube_obsidian_chamber_orientation_v1',
    'launch_cycle_001_canonical_media_activation_v1',
    'obsidian',
    'canonical_media',
    'youtube_activation',
    'Obsidian Chamber Orientation',
    'draft',
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object('source_storage_path', 'obsidian_chamber_orientation.mp4', 'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation'
  ),
  (
    'launch_cycle_001_ca_youtube_assessment_report_orientation_v1',
    'launch_cycle_001_canonical_media_activation_v1',
    'assessment_report_orientation',
    'canonical_media',
    'youtube_activation',
    'Assessment Report Orientation',
    'draft',
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object('source_storage_path', 'assessment_report_orientation.mp4', 'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md'),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation'
  )
on conflict (campaign_asset_key) do update
set
  status = excluded.status,
  metadata = public.measures_publication_campaign_asset.metadata || excluded.metadata,
  review_status = excluded.review_status,
  updated_at = now();

insert into public.measures_publication_distribution_asset (
  distribution_asset_key,
  campaign_asset_id,
  publication_asset_id,
  campaign_id,
  platform,
  distribution_type,
  status,
  buffer_export_ready,
  optics,
  metadata,
  created_by_actor_class,
  created_by_actor_key,
  approved_by_actor_class,
  approved_by_actor_key,
  review_status,
  payload
) values
  (
    'measures_canonical_youtube_about_measures_registry_v1',
    'launch_cycle_001_ca_youtube_about_measures_registry_v1',
    'about_measures_registry_video',
    'launch_cycle_001_canonical_media_activation_v1',
    'youtube',
    'YouTube Canonical Media Activation',
    'draft',
    true,
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object(
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'idempotency_key', 'launch_cycle_001__measures_registry__youtube__about_measures_registry__2026-07-14',
      'buffer_credential_reference', 'BUFFER_SOCIAL_KEY',
      'operator_authorization_status', 'not_authorized_to_schedule_or_publish',
      'proposed_time_america_chicago', '2026-07-14T10:00:00-05:00'
    ),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation',
    jsonb_build_object(
      'title', 'About Measures Registry',
      'body', 'Shared systems governance for institutions deploying AI.',
      'media_references', jsonb_build_array('measures-media/about_measures_registry.mp4'),
      'source_storage_path', 'about_measures_registry.mp4',
      'source_public_url', 'https://media.c3field.online/about_measures_registry.mp4',
      'playlist_recommendation', 'Measures Registry Canonical Orientation',
      'publication_visibility', 'buffer_draft_private_pending_operator_review'
    )
  ),
  (
    'measures_canonical_youtube_ai_isnt_broken_intro_v1',
    'launch_cycle_001_ca_youtube_ai_isnt_broken_intro_v1',
    'intro_hook_video',
    'launch_cycle_001_canonical_media_activation_v1',
    'youtube',
    'YouTube Canonical Media Activation',
    'draft',
    true,
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object(
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'idempotency_key', 'launch_cycle_001__measures_registry__youtube__ai_isnt_broken_intro__2026-07-14',
      'buffer_credential_reference', 'BUFFER_SOCIAL_KEY',
      'operator_authorization_status', 'not_authorized_to_schedule_or_publish',
      'proposed_time_america_chicago', '2026-07-14T10:20:00-05:00'
    ),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation',
    jsonb_build_object(
      'title', 'AI Isn''t Broken',
      'body', 'AI isn''t broken. Systems are. Responsible AI deployment requires governable systems.',
      'media_references', jsonb_build_array('measures-media/ai_isnt_broken_intro.mp4'),
      'source_storage_path', 'ai_isnt_broken_intro.mp4',
      'source_public_url', 'https://media.c3field.online/ai_isnt_broken_intro.mp4',
      'playlist_recommendation', 'Measures Registry Canonical Orientation',
      'publication_visibility', 'buffer_draft_private_pending_operator_review'
    )
  ),
  (
    'measures_canonical_youtube_crystal_seat_orientation_v1',
    'launch_cycle_001_ca_youtube_crystal_seat_orientation_v1',
    'measures_position',
    'launch_cycle_001_canonical_media_activation_v1',
    'youtube',
    'YouTube Canonical Media Activation',
    'draft',
    true,
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object(
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'idempotency_key', 'launch_cycle_001__measures_registry__youtube__crystal_seat_orientation__2026-07-14',
      'buffer_credential_reference', 'BUFFER_SOCIAL_KEY',
      'operator_authorization_status', 'not_authorized_to_schedule_or_publish',
      'proposed_time_america_chicago', '2026-07-14T10:40:00-05:00'
    ),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation',
    jsonb_build_object(
      'title', 'Crystal Seat Orientation',
      'body', 'Measures Registry orientation for coherence, resonance, and governed system standing.',
      'media_references', jsonb_build_array('measures-media/crystal_seat_orientation.mp4'),
      'source_storage_path', 'crystal_seat_orientation.mp4',
      'source_public_url', 'https://media.c3field.online/crystal_seat_orientation.mp4',
      'playlist_recommendation', 'Measures Registry Canonical Orientation',
      'publication_visibility', 'buffer_draft_private_pending_operator_review'
    )
  ),
  (
    'measures_canonical_youtube_obsidian_chamber_orientation_v1',
    'launch_cycle_001_ca_youtube_obsidian_chamber_orientation_v1',
    'obsidian',
    'launch_cycle_001_canonical_media_activation_v1',
    'youtube',
    'YouTube Canonical Media Activation',
    'draft',
    true,
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object(
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'idempotency_key', 'launch_cycle_001__measures_registry__youtube__obsidian_chamber_orientation__2026-07-14',
      'buffer_credential_reference', 'BUFFER_SOCIAL_KEY',
      'operator_authorization_status', 'not_authorized_to_schedule_or_publish',
      'proposed_time_america_chicago', '2026-07-14T11:00:00-05:00'
    ),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation',
    jsonb_build_object(
      'title', 'Obsidian Chamber Orientation',
      'body', 'Assessment readiness orientation for the conditions that shape AI behavior.',
      'media_references', jsonb_build_array('measures-media/obsidian_chamber_orientation.mp4'),
      'source_storage_path', 'obsidian_chamber_orientation.mp4',
      'source_public_url', 'https://media.c3field.online/obsidian_chamber_orientation.mp4',
      'playlist_recommendation', 'Measures Registry Canonical Orientation',
      'publication_visibility', 'buffer_draft_private_pending_operator_review'
    )
  ),
  (
    'measures_canonical_youtube_assessment_report_orientation_v1',
    'launch_cycle_001_ca_youtube_assessment_report_orientation_v1',
    'assessment_report_orientation',
    'launch_cycle_001_canonical_media_activation_v1',
    'youtube',
    'YouTube Canonical Media Activation',
    'draft',
    true,
    jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false),
    jsonb_build_object(
      'source_oar2', 'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'idempotency_key', 'launch_cycle_001__measures_registry__youtube__assessment_report_orientation__2026-07-14',
      'buffer_credential_reference', 'BUFFER_SOCIAL_KEY',
      'operator_authorization_status', 'not_authorized_to_schedule_or_publish',
      'proposed_time_america_chicago', '2026-07-14T11:20:00-05:00'
    ),
    'AI',
    'Codex',
    'Human',
    'op044',
    'oar2_authorized_draft_preparation',
    jsonb_build_object(
      'title', 'Assessment Report Orientation',
      'body', 'A brief orientation before reviewing Measures Registry assessment findings.',
      'media_references', jsonb_build_array('measures-media/assessment_report_orientation.mp4'),
      'source_storage_path', 'assessment_report_orientation.mp4',
      'source_public_url', 'https://media.c3field.online/assessment_report_orientation.mp4',
      'playlist_recommendation', 'Measures Registry Canonical Orientation',
      'publication_visibility', 'buffer_draft_private_pending_operator_review'
    )
  )
on conflict (distribution_asset_key) do update
set
  metadata = public.measures_publication_distribution_asset.metadata || excluded.metadata,
  payload = excluded.payload,
  buffer_export_ready = excluded.buffer_export_ready,
  review_status = excluded.review_status,
  updated_at = now();

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
      'buffer',
      'youtube_measures_registry',
      'draft',
      'buffer',
      1,
      null::timestamptz,
      jsonb_build_object('buffer_update_id', '6a548d6c00357d0bb66cd575', 'buffer_state', 'draft', 'buffer_due_at', null, 'credential_reference', 'BUFFER_SOCIAL_KEY'),
      null::text,
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__about_measures_registry__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
      jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_ai_isnt_broken_intro_v1',
      'buffer',
      'youtube_measures_registry',
      'failed',
      'buffer',
      1,
      null::timestamptz,
      jsonb_build_object('buffer_state', 'not_created', 'credential_reference', 'BUFFER_SOCIAL_KEY'),
      'Buffer API returned UnexpectedError: Invalid post',
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__ai_isnt_broken_intro__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
      jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_crystal_seat_orientation_v1',
      'buffer',
      'youtube_measures_registry',
      'draft',
      'buffer',
      1,
      null::timestamptz,
      jsonb_build_object('buffer_update_id', '6a548d6d98dc0120703ef8e5', 'buffer_state', 'draft', 'buffer_due_at', null, 'credential_reference', 'BUFFER_SOCIAL_KEY'),
      null::text,
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__crystal_seat_orientation__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
      jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_obsidian_chamber_orientation_v1',
      'buffer',
      'youtube_measures_registry',
      'failed',
      'buffer',
      1,
      null::timestamptz,
      jsonb_build_object('buffer_state', 'not_created', 'credential_reference', 'BUFFER_SOCIAL_KEY'),
      'Buffer API returned UnexpectedError: Invalid post',
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__obsidian_chamber_orientation__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
      jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
    ),
    (
      'measures_canonical_youtube_assessment_report_orientation_v1',
      'buffer',
      'youtube_measures_registry',
      'failed',
      'buffer',
      1,
      null::timestamptz,
      jsonb_build_object('buffer_state', 'not_created', 'credential_reference', 'BUFFER_SOCIAL_KEY'),
      'Buffer API returned UnexpectedError: Invalid post',
      'OAR/OAR2/publication/oar2_implement_buffer_native_publication_execution_v1.meta.md',
      'AI',
      'Codex',
      'Human',
      'op044',
      jsonb_build_object('idempotency_key', 'launch_cycle_001__measures_registry__youtube__assessment_report_orientation__2026-07-14', 'operator_authorization_status', 'not_authorized_to_schedule_or_publish'),
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
