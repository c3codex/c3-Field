do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'measures_registry'
      and column_name = 'metadata'
  ) then
    raise exception 'missing metadata surface: public.measures_registry.metadata';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'measures_publication_registry'
      and column_name = 'metadata'
  ) then
    raise exception 'missing metadata surface: public.measures_publication_registry.metadata';
  end if;

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'undrifted'
  ) then
    raise exception 'missing governed publication row: undrifted';
  end if;

  insert into public.measures_registry (
    registry_key,
    display_title,
    registry_family,
    encounter_type,
    material_family,
    sequence_order,
    release_state,
    access_state,
    phase_label,
    is_active,
    metadata
  )
  values (
    'undrifted_publication_landing',
    'unDrifted | Measures Registry',
    'spine',
    'landing_page',
    'obsidian',
    2010,
    'released',
    'visible',
    'unDrifted publication landing route',
    true,
    $json$
    {
      "unit_key": "undrifted_publication_landing",
      "unit_type": "landing_page",
      "route_path": "/undrifted",
      "route_role": "primary_publication_landing",
      "publication_key": "undrifted",
      "parent_authority": "measures_registry",
      "release_state": "released",
      "access_state": "visible",
      "public_state": "released",
      "canonical_url": "https://measuresregistry.com/undrifted",
      "frontend_role": "renderer",
      "route_authority": "registry",
      "runtime_surface": "structural_drift_dispatches",
      "runtime_surface_reason": "existing renderer consumes undrifted publication metadata through the structural_drift_dispatches surface",
      "runtime_target": "undrifted_publication",
      "route_rendering_contract": "renderer_reads_governed_publication_and_dispatch_records",
      "claims_boundary": "education_only",
      "style_contract": "undrifted_publication_style_v1",
      "material_family": "obsidian",
      "source_oar2": "docs/oar/measures_registry/oar2_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md",
      "metadata_profile": "undrifted_publication_landing_seo",
      "primary_cta_label": "Assess the Environment",
      "primary_cta_target": "assess_environment_flow",
      "cta_surface": "measures_assessment",
      "secondary_cta_label": "Read unDrifted",
      "secondary_cta_target": "https://paragraph.com/@undrifted",
      "seo": {
        "title": "unDrifted | Measures Registry",
        "description": "Structural drift is detectable. Collapse is not the default.",
        "canonical_url": "https://measuresregistry.com/undrifted",
        "og_type": "website",
        "og_title": "unDrifted | Measures Registry",
        "og_description": "Structural drift is detectable. Collapse is not the default.",
        "og_url": "https://measuresregistry.com/undrifted",
        "og_image": "https://measuresregistry.com/og.jpeg",
        "twitter_card": "summary_large_image",
        "twitter_title": "unDrifted | Measures Registry",
        "twitter_description": "Structural drift is detectable. Collapse is not the default.",
        "twitter_image": "https://measuresregistry.com/og.jpeg"
      },
      "prohibited_claims": [
        "pricing",
        "payment standing",
        "wallet connection",
        "c3 Key issuance",
        "temp c3 Key issuance",
        "SRC binding",
        "certification",
        "conversion",
        "DAO standing",
        "permission state",
        "recognition state",
        "distribution standing",
        "Marble Chamber readiness",
        "Registry Certification claim",
        "Measures Conversion claim"
      ]
    }
    $json$::jsonb
  )
  on conflict (registry_key) do update
  set display_title = excluded.display_title,
      registry_family = excluded.registry_family,
      encounter_type = excluded.encounter_type,
      material_family = excluded.material_family,
      sequence_order = excluded.sequence_order,
      release_state = excluded.release_state,
      access_state = excluded.access_state,
      phase_label = excluded.phase_label,
      is_active = excluded.is_active,
      metadata = coalesce(public.measures_registry.metadata, '{}'::jsonb) || excluded.metadata,
      updated_at = now();

  update public.measures_registry
  set display_title = 'Structural Drift | unDrifted',
      release_state = 'released',
      access_state = 'visible',
      is_active = true,
      metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "route_role": "diagnostic_series_route",
        "series_key": "structural_drift",
        "umbrella_publication_key": "undrifted",
        "legacy_inbound_supported": true,
        "release_state": "released",
        "access_state": "visible",
        "claims_boundary": "education_only",
        "canonical_url": "https://measuresregistry.com/structural-drift",
        "route_path": "/structural-drift",
        "route_authority": "registry",
        "frontend_role": "renderer",
        "runtime_surface": "structural_drift_dispatches",
        "runtime_target": "structural_drift_series",
        "style_contract": "undrifted_publication_style_v1",
        "source_oar2_route_reclassification": "docs/oar/measures_registry/oar2_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md",
        "seo": {
          "title": "Structural Drift | unDrifted",
          "description": "Structural Drift is the diagnostic series inside unDrifted, naming the seams where AI operations lose alignment.",
          "canonical_url": "https://measuresregistry.com/structural-drift",
          "og_type": "website",
          "og_title": "Structural Drift | unDrifted",
          "og_description": "Structural Drift is the diagnostic series inside unDrifted, naming the seams where AI operations lose alignment.",
          "og_url": "https://measuresregistry.com/structural-drift",
          "og_image": "https://measuresregistry.com/og.jpeg",
          "twitter_card": "summary_large_image",
          "twitter_title": "Structural Drift | unDrifted",
          "twitter_description": "Structural Drift is the diagnostic series inside unDrifted, naming the seams where AI operations lose alignment.",
          "twitter_image": "https://measuresregistry.com/og.jpeg"
        }
      }
      $json$::jsonb,
      updated_at = now()
  where registry_key = 'structural_drift_landing';

  update public.measures_publication_registry
  set metadata =
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            coalesce(metadata, '{}'::jsonb),
            '{buffer_scheduler_contract,buffer_capability_standing}',
            (coalesce(metadata #> '{buffer_scheduler_contract,buffer_capability_standing}', '{}'::jsonb) - 'missing_capability') || $json$
            {
              "buffer_api_available": true,
              "buffer_api_token_present": true,
              "buffer_secret_name": "BUFFER_SOCIAL_KEY",
              "credential_storage": "environment_secret_only",
              "direct_posting_authorized": false,
              "approval_required": true,
              "capability_state": "validated_read_only",
              "validated_surfaces": ["account", "organizations", "channels"],
              "expected_channels_confirmed": {
                "x_measures_c3": true,
                "instagram_measures_registry": true,
                "linkedin_measures_registry": true
              },
              "draft_created": false,
              "post_scheduled": false,
              "post_published": false
            }
            $json$::jsonb,
            true
          ),
          '{paragraph_api_publishing_contract,capability}',
          (coalesce(metadata #> '{paragraph_api_publishing_contract,capability}', '{}'::jsonb) - 'missing_capability') || $json$
          {
            "paragraph_api_available": true,
            "paragraph_secret_name": "PARAGRAPH_SECRET_KEY",
            "credential_storage": "environment_secret_only",
            "direct_publish_authorized": "false_by_default",
            "approval_required": true,
            "api_capability_state": "validated_read_only",
            "publication_access_confirmed": true,
            "post_feed_access_confirmed": true,
            "expected_article_slugs_confirmed": {
              "undrifted": true,
              "measures_registry": true,
              "structural_drift": true,
              "agents_of_chaos": true
            },
            "draft_created": false,
            "post_published": false
          }
          $json$::jsonb,
          true
        ),
        '{api_credential_validation_contract}',
        $json$
        {
          "source_oar2": "docs/oar/measures_registry/oar2_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md",
          "contract_key": "validate_api_credentials_and_seat_undrifted_publication_landing_route_v1",
          "secret_values_stored": false,
          "credential_storage": "environment_secret_only",
          "buffer_secret_name": "BUFFER_SOCIAL_KEY",
          "paragraph_secret_name": "PARAGRAPH_SECRET_KEY",
          "buffer_capability_state": "validated_read_only",
          "paragraph_capability_state": "validated_read_only",
          "no_publishing_performed": true,
          "no_scheduling_performed": true,
          "no_draft_creation_performed": true,
          "route_changes": {
            "undrifted": "primary_publication_landing",
            "structural_drift": "diagnostic_series_route"
          }
        }
        $json$::jsonb,
        true
      ),
      '{paragraph_api_publishing_contract,contract_status}',
      '"validated_read_only_no_publishing"'::jsonb,
      true
    ),
      updated_at = now()
  where publication_key = 'undrifted';

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'undrifted_publication_landing'
      and release_state = 'released'
      and access_state = 'visible'
      and is_active = true
      and metadata #>> '{route_path}' = '/undrifted'
      and metadata #>> '{route_role}' = 'primary_publication_landing'
      and metadata #>> '{publication_key}' = 'undrifted'
      and metadata #>> '{route_authority}' = 'registry'
      and metadata #>> '{frontend_role}' = 'renderer'
      and metadata #>> '{runtime_surface}' = 'structural_drift_dispatches'
      and metadata #>> '{seo,title}' = 'unDrifted | Measures Registry'
  ) then
    raise exception '/undrifted governed route validation failed';
  end if;

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'structural_drift_landing'
      and release_state = 'released'
      and access_state = 'visible'
      and metadata #>> '{route_role}' = 'diagnostic_series_route'
      and metadata #>> '{series_key}' = 'structural_drift'
      and metadata #>> '{umbrella_publication_key}' = 'undrifted'
      and metadata #>> '{legacy_inbound_supported}' = 'true'
      and metadata #>> '{seo,title}' = 'Structural Drift | unDrifted'
  ) then
    raise exception '/structural-drift route reclassification validation failed';
  end if;

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'undrifted'
      and metadata #>> '{buffer_scheduler_contract,buffer_capability_standing,buffer_api_available}' = 'true'
      and metadata #>> '{buffer_scheduler_contract,buffer_capability_standing,buffer_secret_name}' = 'BUFFER_SOCIAL_KEY'
      and metadata #>> '{buffer_scheduler_contract,buffer_capability_standing,direct_posting_authorized}' = 'false'
      and metadata #>> '{paragraph_api_publishing_contract,capability,paragraph_api_available}' = 'true'
      and metadata #>> '{paragraph_api_publishing_contract,capability,paragraph_secret_name}' = 'PARAGRAPH_SECRET_KEY'
      and metadata #>> '{paragraph_api_publishing_contract,capability,direct_publish_authorized}' = 'false_by_default'
      and metadata #>> '{api_credential_validation_contract,secret_values_stored}' = 'false'
      and metadata #>> '{api_credential_validation_contract,no_publishing_performed}' = 'true'
      and metadata #>> '{api_credential_validation_contract,no_scheduling_performed}' = 'true'
  ) then
    raise exception 'API credential capability metadata validation failed';
  end if;
end $$;
