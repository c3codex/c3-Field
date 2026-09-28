-- Normalize the already-authorized MDM Sequence 01 distribution scope into the
-- common Lapzuli CampaignPAC contract. No external publication effect.
-- Scope remains exactly the three previously authorized destinations.

update public.measures_publication_campaign
set metadata =
  coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'external_distribution_authorized', true,
    'lapzuli_active_asset_keys', jsonb_build_array(
      'mdm_pd_s01_facebook_page_dist_v1',
      'mdm_pd_s01_facebook_group_dist_v1',
      'mdm_pd_s01_instagram_dist_v1'
    ),
    'lapzuli_contract_normalization', jsonb_build_object(
      'scope','sequence_01_exact_three_destinations_only',
      'authority_source','existing operator-approved MDM execution metadata',
      'normalized_for','lapzuli_distribution_actions_v1',
      'external_publication_effects',0
    )
  ),
  updated_at=now()
where campaign_key='mdm_public_discovery_v1'
  and review_status='operator_approved'
  and coalesce((metadata->>'external_execution_authorized')::boolean,false)=true
  and coalesce((metadata->>'external_post_execution_authorized_in_current_encounter')::boolean,false)=true
  and coalesce((metadata->>'external_distribution_authorized_for_encounter_resolution')::boolean,false)=true;

update public.measures_publication_distribution_asset
set metadata =
  coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'external_distribution_authorized', true,
    'lapzuli_contract_normalized', true,
    'lapzuli_contract_scope','sequence_01_exact_three_destinations_only'
  ),
  updated_at=now()
where distribution_asset_key in (
  'mdm_pd_s01_facebook_page_dist_v1',
  'mdm_pd_s01_facebook_group_dist_v1',
  'mdm_pd_s01_instagram_dist_v1'
)
  and coalesce((metadata->>'operator_confirmed')::boolean,false)=true
  and coalesce((metadata->>'external_post_execution_authorized')::boolean,false)=true
  and coalesce((metadata->>'external_distribution_authorized_for_encounter_resolution')::boolean,false)=true;
