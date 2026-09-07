-- OAR2: oar2_authorize_issue001_campaign_release_for_buffer_draft_export_v1
-- No mismatches found (ROUTED §1/§2, all confirmed against live state before writing):
--   - publication authority: approved
--   - launch-critical derivatives pending: 0 (all 4 remaining pending are deferred_production/documentation)
--   - campaign assets: all 12 reference either approved or launch-valid (deferred/documentation) derivatives
--   - distribution assets: all 12 status=draft, payloads populated
--   - no scheduled/published statuses exist anywhere
--   - Buffer integration: automation_status=held, is_active=false, unchanged
--
-- Authorizes campaign RELEASE READINESS only. Does not call Buffer, does not schedule, does not
-- publish. measures_publication_distribution_asset has no export_status column — per ROUTED §4's
-- explicit fallback, readiness is recorded in metadata only; row status stays 'draft'.

update public.measures_publication_campaign
set status = 'ready_for_export',
    release_state = 'release_ready',
    metadata = metadata || jsonb_build_object(
      'approved_by_actor_class', 'Human',
      'approved_by_actor_key', 'op044',
      'source_oar2', 'OAR/OAR2/publication/oar2_authorize_issue001_campaign_release_for_buffer_draft_export_v1.meta.md',
      'decision_scope', 'campaign release readiness only',
      'buffer_scheduling_authorized', false,
      'publication_authority_dependency', 'resolved',
      'stripe_dependency', 'separate_runtime_gate',
      'facebook_groups_distribution_mode', 'human_mediated'
    )
where campaign_key = 'undrifted_issue001_launch_campaign_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'export_status', 'ready_for_buffer_draft_export',
  'export_status_note', 'measures_publication_distribution_asset has no dedicated export_status column; recorded here per ROUTED §4''s explicit fallback. Row status remains draft.',
  'authorized_via_oar2', 'OAR/OAR2/publication/oar2_authorize_issue001_campaign_release_for_buffer_draft_export_v1.meta.md'
)
where campaign_id = 'undrifted_issue001_launch_campaign_v1';
