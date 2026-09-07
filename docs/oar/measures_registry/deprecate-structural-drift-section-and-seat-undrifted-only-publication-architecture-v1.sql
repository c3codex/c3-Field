do $$
begin
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
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'measures_publication_dispatch'
      and column_name = 'metadata'
  ) then
    raise exception 'missing metadata surface: public.measures_publication_dispatch.metadata';
  end if;

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
    from public.measures_publication_registry
    where publication_key = 'undrifted'
  ) then
    raise exception 'missing governed publication row: undrifted';
  end if;

  update public.measures_publication_registry
  set metadata = coalesce(metadata, '{}'::jsonb) || $json$
    {
      "publication_role": "deprecated_diagnostic_section",
      "replacement_publication_key": "undrifted",
      "use_as_public_section": false,
      "use_as_tag": true,
      "use_as_diagnostic_concept": true,
      "historical_trace_preserved": true,
      "public_authority": false,
      "section_visibility": "deprecated_hidden",
      "source_oar2_section_deprecation": "docs/oar/measures_registry/oar2_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md"
    }
    $json$::jsonb,
      updated_at = now()
  where publication_key = 'structural_drift';

  update public.measures_publication_registry
  set metadata = jsonb_set(
        coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
          'publication_architecture_contract',
          jsonb_build_object(
            'source_oar2', 'docs/oar/measures_registry/oar2_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md',
            'publication_key', 'undrifted',
            'only_publication_landing_authority', true,
            'sections_held', true,
            'structural_drift_standing', 'diagnostic_trace_tag_only',
            'agents_with_keys_held', true,
            'paragraph_draft_authorized', false,
            'paragraph_publish_authorized', false,
            'buffer_schedule_authorized', false
          )
        ),
        '{hierarchy,series}',
        '[]'::jsonb,
        true
      ),
      updated_at = now()
  where publication_key = 'undrifted';

  update public.measures_publication_dispatch
  set publication_key = 'undrifted',
      tags = (
        select jsonb_agg(distinct tag order by tag)
        from jsonb_array_elements_text(coalesce(tags, '[]'::jsonb) || '["structural_drift"]'::jsonb) as tag
      ),
      metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "umbrella_publication_key": "undrifted",
        "publication_key_standing": "undrifted",
        "visible_section": false,
        "section_key": null,
        "public_section": false,
        "series_visibility": "hidden",
        "series_role": "diagnostic_tag_or_legacy_trace",
        "diagnostic_tag": "structural_drift",
        "historical_trace_preserved": true,
        "source_oar2_publication_architecture": "docs/oar/measures_registry/oar2_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md"
      }
      $json$::jsonb,
      updated_at = now()
  where dispatch_key in ('structural_drift_dispatch_v1', 'agents_of_chaos_dispatch_v1');

  update public.measures_registry
  set release_state = 'released',
      access_state = 'visible',
      is_active = true,
      metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "route_role": "primary_publication_landing",
        "publication_key": "undrifted",
        "public_authority": true,
        "release_state": "released",
        "access_state": "visible",
        "claims_boundary": "education_only",
        "canonical_url": "https://measuresregistry.com/undrifted",
        "sections_required": false,
        "route_authority": "registry",
        "frontend_role": "renderer",
        "runtime_surface": "structural_drift_dispatches",
        "source_oar2_undrifted_only_architecture": "docs/oar/measures_registry/oar2_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md",
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
        }
      }
      $json$::jsonb,
      updated_at = now()
  where registry_key = 'undrifted_publication_landing';

  update public.measures_registry
  set display_title = 'Structural Drift | unDrifted',
      release_state = 'released',
      access_state = 'visible',
      is_active = true,
      metadata = coalesce(metadata, '{}'::jsonb) || $json$
      {
        "route_role": "legacy_inbound_route",
        "replacement_route": "/undrifted",
        "legacy_inbound_supported": true,
        "public_authority": false,
        "publication_key": "undrifted",
        "diagnostic_tag": "structural_drift",
        "release_state": "legacy_visible",
        "claims_boundary": "education_only",
        "canonical_url": "https://measuresregistry.com/undrifted",
        "route_authority": "registry",
        "frontend_role": "renderer",
        "runtime_surface": "structural_drift_dispatches",
        "legacy_behavior": "render_legacy_note_under_undrifted_branding",
        "legacy_note": "Structural Drift is now part of unDrifted.",
        "legacy_cta_label": "Continue to unDrifted",
        "source_oar2_legacy_route": "docs/oar/measures_registry/oar2_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md",
        "seo": {
          "title": "Structural Drift | unDrifted",
          "description": "Structural Drift is now a diagnostic concept within unDrifted, the Measures Registry publication on structural drift and governed AI operations.",
          "canonical_url": "https://measuresregistry.com/undrifted",
          "og_type": "website",
          "og_title": "Structural Drift | unDrifted",
          "og_description": "Continue to unDrifted, the Measures Registry publication where Structural Drift is documented as a diagnostic concept.",
          "og_url": "https://measuresregistry.com/structural-drift",
          "og_image": "https://measuresregistry.com/og.jpeg",
          "twitter_card": "summary_large_image",
          "twitter_title": "Structural Drift | unDrifted",
          "twitter_description": "Continue to unDrifted, the Measures Registry publication where Structural Drift is documented as a diagnostic concept.",
          "twitter_image": "https://measuresregistry.com/og.jpeg"
        }
      }
      $json$::jsonb,
      updated_at = now()
  where registry_key = 'structural_drift_landing';

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'structural_drift'
      and metadata #>> '{publication_role}' = 'deprecated_diagnostic_section'
      and metadata #>> '{replacement_publication_key}' = 'undrifted'
      and metadata #>> '{use_as_public_section}' = 'false'
      and metadata #>> '{use_as_tag}' = 'true'
      and metadata #>> '{historical_trace_preserved}' = 'true'
  ) then
    raise exception 'Structural Drift section deprecation validation failed';
  end if;

  if exists (
    select 1
    from public.measures_publication_dispatch
    where dispatch_key in ('structural_drift_dispatch_v1', 'agents_of_chaos_dispatch_v1')
      and (
        publication_key <> 'undrifted'
        or metadata #>> '{public_section}' <> 'false'
        or metadata #>> '{series_visibility}' <> 'hidden'
        or not (coalesce(tags, '[]'::jsonb) ? 'structural_drift')
      )
  ) then
    raise exception 'Dispatch undrifted-only relationship validation failed';
  end if;

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'undrifted_publication_landing'
      and metadata #>> '{route_role}' = 'primary_publication_landing'
      and metadata #>> '{publication_key}' = 'undrifted'
      and metadata #>> '{public_authority}' = 'true'
      and metadata #>> '{sections_required}' = 'false'
      and metadata #>> '{seo,canonical_url}' = 'https://measuresregistry.com/undrifted'
  ) then
    raise exception '/undrifted publication authority validation failed';
  end if;

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'structural_drift_landing'
      and metadata #>> '{route_role}' = 'legacy_inbound_route'
      and metadata #>> '{replacement_route}' = '/undrifted'
      and metadata #>> '{public_authority}' = 'false'
      and metadata #>> '{publication_key}' = 'undrifted'
      and metadata #>> '{diagnostic_tag}' = 'structural_drift'
      and metadata #>> '{seo,canonical_url}' = 'https://measuresregistry.com/undrifted'
  ) then
    raise exception '/structural-drift legacy inbound validation failed';
  end if;
end $$;
