-- Lapzuli campaign distribution contract v1.
-- Persists the cross-system CampaignPAC distribution desk and the approved
-- Measures Registry first-wave resolution. This migration creates no external
-- publication effect.

update public.measures_publication_campaign
set metadata =
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          metadata,
          '{canonical_url}',
          to_jsonb('https://measuresregistry.com/ai-operations-assessment'::text),
          true
        ),
        '{distribution_release_authorized}',
        'true'::jsonb,
        true
      ),
      '{distribution_scope,external_distribution_authorized}',
      'true'::jsonb,
      true
    ),
    '{lapzuli_active_asset_keys}',
    jsonb_build_array(
      'mr_dist_s01_facebook_v1',
      'mr_dist_s01_instagram_v1',
      'mr_dist_s01_linkedin_v1',
      'mr_dist_s01_x_v1',
      'mr_dist_s01_bluesky_v1'
    ),
    true
  )
  || jsonb_build_object(
    'lapzuli_contract_reconciliation',
      'aligned stale nested release flags to existing operator-approved external distribution authority; no external publication effect'
  )
where campaign_key='measures_registry_assess_operational_environment_campaign_v1';

insert into public.lapzuli_desk_profile (
  desk_key,desk_label,purpose,audience_classes,object_classes,active,metadata
)
values (
  'campaign_distribution',
  'Campaign Distribution',
  'Registry-confirmed CampaignPAC distribution across c3 systems without transferring source authority or asset custody to Lapzuli.',
  '["owned_social","direct_relationship","earned_media","institutional_distribution"]'::jsonb,
  '["campaign_derivative","distribution_asset","media_packet","outreach_derivative"]'::jsonb,
  true,
  jsonb_build_object(
    'scope','cross_system',
    'authority_rule','CampaignPAC and Registry standing remain authoritative; Lapzuli only resolves eligible distribution passage.',
    'formed_by','op044 + Chazz'
  )
)
on conflict (desk_key) do update set
  desk_label=excluded.desk_label,
  purpose=excluded.purpose,
  audience_classes=excluded.audience_classes,
  object_classes=excluded.object_classes,
  active=true,
  metadata=public.lapzuli_desk_profile.metadata || excluded.metadata,
  updated_at=now();

update public.lapzuli_outlet
set evidence = evidence || jsonb_build_object(
      'executor','buffer',
      'channel_key','facebook_measures_registry',
      'channel_identifier','6a54734280cc80cdcaa9743b',
      'credential_binding','BUFFER_PUB2_KEY'
    ),
    metadata = metadata || jsonb_build_object(
      'executor_key','buffer',
      'distribution_function','direct_social_discovery',
      'operator_disposition_required',true
    ),
    updated_at=now()
where outlet_key='facebook_measures_registry';

insert into public.lapzuli_outlet (
  outlet_key,outlet_name,base_url,outlet_class,qualification_state,
  ai_provenance_policy,canonical_policy,submission_mode,
  evidence_checked_at,evidence,metadata,access_requirement,account_standing,access_route,setup_reuse
)
values
(
  'instagram_measures_registry',
  'Instagram / Measures Registry',
  'https://instagram.com/measures_registry',
  'social_discovery_platform',
  'researched',
  'platform_post_with_governed_source_link_and_disclosure_when_required',
  'canonical_source_link_preserved',
  'social_source_link_distribution',
  now(),
  jsonb_build_object(
    'executor','buffer',
    'channel_key','instagram_measures_registry',
    'channel_identifier','6a23bfc4c687a22dd467a045',
    'credential_binding','BUFFER_SOCIAL_KEY',
    'registry_channel_status','active'
  ),
  jsonb_build_object(
    'executor_key','buffer',
    'distribution_function','direct_social_discovery',
    'operator_disposition_required',true
  ),
  'account_required',
  'verified',
  'Measures Registry Instagram account via Buffer',
  'reusable_account'
),
(
  'x_measures_c3',
  'X / Measures Registry',
  'https://twitter.com/measures_c3',
  'social_discovery_platform',
  'researched',
  'platform_post_with_governed_source_link_and_disclosure_when_required',
  'canonical_source_link_preserved',
  'social_source_link_distribution',
  now(),
  jsonb_build_object(
    'executor','buffer',
    'channel_key','x_measures_c3',
    'channel_identifier','6a23bff1c687a22dd467a0b3',
    'credential_binding','BUFFER_SOCIAL_KEY',
    'registry_channel_status','active'
  ),
  jsonb_build_object(
    'executor_key','buffer',
    'distribution_function','direct_social_discovery',
    'operator_disposition_required',true
  ),
  'account_required',
  'verified',
  'Measures Registry X account via Buffer',
  'reusable_account'
)
on conflict (outlet_key) do update set
  outlet_name=excluded.outlet_name,
  base_url=excluded.base_url,
  outlet_class=excluded.outlet_class,
  qualification_state=excluded.qualification_state,
  ai_provenance_policy=excluded.ai_provenance_policy,
  canonical_policy=excluded.canonical_policy,
  submission_mode=excluded.submission_mode,
  evidence_checked_at=excluded.evidence_checked_at,
  evidence=public.lapzuli_outlet.evidence || excluded.evidence,
  metadata=public.lapzuli_outlet.metadata || excluded.metadata,
  access_requirement=excluded.access_requirement,
  account_standing=excluded.account_standing,
  access_route=excluded.access_route,
  setup_reuse=excluded.setup_reuse,
  updated_at=now();

insert into public.lapzuli_outlet_qualification (
  outlet_key,desk_key,distribution_mode,standing,fit_score,
  requires_ai_disclosure,requires_canonical,requires_original_contribution,
  ai_acceptance,provenance_constraints,evidence,operator_disposition_required,
  posting_cost_usd,submission_cost_usd,automation_cost_usd,cost_standing,
  identity_mode,content_relation
)
values
(
  'facebook_measures_registry','campaign_distribution','visual_caption_pair',
  'qualified_with_constraints',89,true,true,false,'allowed_with_disclosure',
  '{"source_link_required":true,"canonical_source_required":true,"operator_confirmation_required":true}'::jsonb,
  '{"executor":"buffer","channel_key":"facebook_measures_registry","qualification_basis":"owned active social channel + operator-approved CampaignPAC derivative"}'::jsonb,
  true,0,0,0,'free_passage','publication','adapted_derivative'
),
(
  'instagram_measures_registry','campaign_distribution','visual_caption_pair',
  'qualified_with_constraints',89,true,true,false,'allowed_with_disclosure',
  '{"source_link_required":true,"canonical_source_required":true,"operator_confirmation_required":true}'::jsonb,
  '{"executor":"buffer","channel_key":"instagram_measures_registry","qualification_basis":"owned active social channel + operator-approved CampaignPAC derivative","preflight_required":true}'::jsonb,
  true,0,0,0,'free_passage','publication','adapted_derivative'
),
(
  'linkedin_measures_registry','campaign_distribution','visual_caption_pair',
  'qualified_with_constraints',89,true,true,false,'allowed_with_disclosure',
  '{"source_link_required":true,"canonical_source_required":true,"operator_confirmation_required":true}'::jsonb,
  '{"executor":"buffer","channel_key":"linkedin_measures_registry","qualification_basis":"owned active social channel + operator-approved CampaignPAC derivative"}'::jsonb,
  true,0,0,0,'free_passage','operator','adapted_derivative'
),
(
  'x_measures_c3','campaign_distribution','visual_caption_pair',
  'qualified_with_constraints',89,true,true,false,'allowed_with_disclosure',
  '{"source_link_required":true,"canonical_source_required":true,"operator_confirmation_required":true,"platform_character_limit_required":true}'::jsonb,
  '{"executor":"buffer","channel_key":"x_measures_c3","qualification_basis":"owned active social channel + operator-approved CampaignPAC derivative","preflight_required":true}'::jsonb,
  true,0,0,0,'free_passage','publication','adapted_derivative'
)
on conflict (outlet_key,desk_key,distribution_mode) do update set
  standing=excluded.standing,
  fit_score=excluded.fit_score,
  requires_ai_disclosure=excluded.requires_ai_disclosure,
  requires_canonical=excluded.requires_canonical,
  requires_original_contribution=excluded.requires_original_contribution,
  ai_acceptance=excluded.ai_acceptance,
  provenance_constraints=excluded.provenance_constraints,
  evidence=excluded.evidence,
  operator_disposition_required=excluded.operator_disposition_required,
  posting_cost_usd=excluded.posting_cost_usd,
  submission_cost_usd=excluded.submission_cost_usd,
  automation_cost_usd=excluded.automation_cost_usd,
  cost_standing=excluded.cost_standing,
  identity_mode=excluded.identity_mode,
  content_relation=excluded.content_relation,
  updated_at=now();

insert into public.registered_process_log (
  process_key, process_type, standing, oar2_reference, oar1_reference,
  execution_status, validation_status, deploy_status, seeded_status,
  executor, validator, operator, validated_at, deployed_at, closeout_state,
  pattern_steps, metadata
)
values (
  'measures_registry_assess_operational_environment_campaign_v1_lapzuli_registered',
  'lapzuli_distribution_registered_standing',
  'governing_seeded',
  'oar2_execute_active_social_campaign_pacs_codex_001_20260922',
  null,
  'executed','validated','not_required','governing_seeded',
  'chazz','chazz','op044',now(),null,'closed',
  array['campaign_pac','preflight','confirm','persistence','register']::text[],
  jsonb_build_object(
    'campaign_key','measures_registry_assess_operational_environment_campaign_v1',
    'campaign_pac_key','measures_registry_assess_operational_environment_campaign_pac_v1',
    'publication_key','measures_registry',
    'desk_key','campaign_distribution',
    'registered_for','lapzuli',
    'active_execution_scope','first_wave',
    'distribution_assets',jsonb_build_array(
      'mr_dist_s01_facebook_v1',
      'mr_dist_s01_instagram_v1',
      'mr_dist_s01_linkedin_v1',
      'mr_dist_s01_x_v1'
    ),
    'held_assets',jsonb_build_array('mr_dist_s01_bluesky_v1'),
    'channels',jsonb_build_array(
      'facebook_measures_registry',
      'instagram_measures_registry',
      'linkedin_measures_registry',
      'x_measures_c3'
    ),
    'authority_note','CampaignPAC remains source authority; registered standing resolves only the four first-wave Buffer transports with an available executor.',
    'operator_confirmation','op044 campaign activation 2026-09-22',
    'external_publication_effects',0
  )
)
on conflict (process_key) do update set
  standing=excluded.standing,
  execution_status=excluded.execution_status,
  validation_status=excluded.validation_status,
  seeded_status=excluded.seeded_status,
  executor=excluded.executor,
  validator=excluded.validator,
  operator=excluded.operator,
  validated_at=excluded.validated_at,
  closeout_state=excluded.closeout_state,
  pattern_steps=excluded.pattern_steps,
  metadata=excluded.metadata,
  updated_at=now();

with active as (
  select
    coalesce(da.metadata->>'derivative_key', da.metadata->>'caption_derivative_key', da.payload->>'caption_derivative_key') as derivative_key
  from public.measures_publication_distribution_asset da
  where da.distribution_asset_key in (
    'mr_dist_s01_facebook_v1',
    'mr_dist_s01_instagram_v1',
    'mr_dist_s01_linkedin_v1',
    'mr_dist_s01_x_v1'
  )
)
update public.measures_publication_derivative_asset d
set release_state='released',
    metadata=d.metadata || jsonb_build_object(
      'external_distribution_authorized',true,
      'release_authority','measures_registry_assess_operational_environment_campaign_pac_v1',
      'lapzuli_resolution','measures_registry_assess_operational_environment_campaign_v1_lapzuli_registered'
    ),
    updated_at=now()
from active a
where d.derivative_key=a.derivative_key
  and d.approval_status='operator_approved'
  and d.review_status in ('approved','operator_approved');

update public.measures_publication_distribution_asset da
set status='ready_for_operator_execution',
    review_status='operator_approved',
    payload=da.payload || jsonb_build_object(
      'text', da.payload->>'caption',
      'canonical_url','https://measuresregistry.com/ai-operations-assessment',
      'image_url',
        'https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/' ||
        (da.payload#>>'{media,object_path}')
    ),
    metadata=da.metadata || jsonb_build_object(
      'derivative_key', coalesce(da.metadata->>'derivative_key', da.metadata->>'caption_derivative_key', da.payload->>'caption_derivative_key'),
      'executor_key','buffer',
      'registered_for','lapzuli',
      'registered_standing_key','measures_registry_assess_operational_environment_campaign_v1_lapzuli_registered',
      'route_key','lapzuli_route_' || da.distribution_asset_key,
      'adapter_path','/buffer/posts',
      'lapzuli_resolution_state','ready_for_operator_execution',
      'external_publication_effects',0
    ),
    updated_at=now()
where da.distribution_asset_key in (
  'mr_dist_s01_facebook_v1',
  'mr_dist_s01_instagram_v1',
  'mr_dist_s01_linkedin_v1',
  'mr_dist_s01_x_v1'
)
  and da.metadata->>'operator_confirmed'='true'
  and da.metadata->>'external_distribution_authorized'='true';

insert into public.lapzuli_route (
  route_key, publication_object_key, desk_key, outlet_key,
  distribution_mode, route_status, qualification_snapshot,
  authority_reference, operator_confirmed, canonical_url,
  payload_reference, return_required, metadata
)
select
  'lapzuli_route_' || da.distribution_asset_key,
  coalesce(da.publication_asset_id, da.campaign_asset_id, da.distribution_asset_key),
  'campaign_distribution',
  da.metadata->>'channel_key',
  coalesce(da.distribution_type,'campaign_distribution'),
  'authorized',
  jsonb_build_object(
    'campaign_key',da.campaign_id,
    'campaign_pac_key','measures_registry_assess_operational_environment_campaign_pac_v1',
    'derivative_key',da.metadata->>'derivative_key',
    'channel_status',ch.status,
    'executor_status',ex.status,
    'executor_supports_publish',ex.supports_publish
  ),
  'measures_registry_assess_operational_environment_campaign_pac_v1; op044 operator-approved campaign activation',
  true,
  'https://measuresregistry.com/ai-operations-assessment',
  da.distribution_asset_key,
  true,
  jsonb_build_object(
    'channel_key',da.metadata->>'channel_key',
    'executor_key','buffer',
    'adapter_path','/buffer/posts',
    'campaign_pac_key','measures_registry_assess_operational_environment_campaign_pac_v1',
    'derivative_key',da.metadata->>'derivative_key',
    'distribution_asset_key',da.distribution_asset_key,
    'callable_by_lapzuli',true,
    'evidence_return_required',true,
    'external_publication_effects',0
  )
from public.measures_publication_distribution_asset da
join public.measures_distribution_channel ch
  on ch.channel_key=da.metadata->>'channel_key' and ch.status='active'
join public.measures_distribution_executor ex
  on ex.executor_key='buffer' and ex.status='available' and ex.supports_publish=true
where da.distribution_asset_key in (
  'mr_dist_s01_facebook_v1',
  'mr_dist_s01_instagram_v1',
  'mr_dist_s01_linkedin_v1',
  'mr_dist_s01_x_v1'
)
on conflict (route_key) do update set
  publication_object_key=excluded.publication_object_key,
  desk_key=excluded.desk_key,
  outlet_key=excluded.outlet_key,
  distribution_mode=excluded.distribution_mode,
  route_status=excluded.route_status,
  qualification_snapshot=excluded.qualification_snapshot,
  authority_reference=excluded.authority_reference,
  operator_confirmed=excluded.operator_confirmed,
  canonical_url=excluded.canonical_url,
  payload_reference=excluded.payload_reference,
  return_required=excluded.return_required,
  metadata=excluded.metadata,
  updated_at=now();
