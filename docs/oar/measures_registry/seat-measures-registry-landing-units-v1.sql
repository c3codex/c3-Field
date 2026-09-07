-- OAR2: Seat Measures Registry landing pages as governed registry units v1
-- Source: docs/oar/measures_registry/oar2_seat_measures_registry_landing_pages_as_governed_registry_units_v1.meta.md

do $$
declare
  v_ai_id uuid;
  v_structural_id uuid;
  v_dispatch_count integer;
  v_structural_state text;
begin
  select count(*)
    into v_dispatch_count
  from public.measures_publication_dispatch
  where publication_key = 'structural_drift'
    and status = 'published';

  v_structural_state := case when v_dispatch_count > 0 then 'released' else 'partial' end;

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
  values
    (
      'ai_operations_assessment_landing',
      'AI Operations Assessment | Measures Registry',
      'spine',
      'landing_page',
      'lapis',
      2010,
      'released',
      'visible',
      'assessment-first public route',
      true,
      jsonb_build_object(
        'unit_key', 'ai_operations_assessment_landing',
        'route_path', '/ai-operations-assessment',
        'unit_type', 'landing_page',
        'public_state', 'released',
        'canonical_url', 'https://measuresregistry.com/ai-operations-assessment',
        'metadata_profile', 'ai_operations_assessment_seo',
        'primary_cta_label', 'Begin Assessment',
        'primary_cta_target', 'assess_environment_flow',
        'runtime_target', 'registered_assessment_first_encounter_flow',
        'runtime_surface', 'eval_passage',
        'cta_surface', 'measures_assessment',
        'claims_boundary', 'assessment_only',
        'material_family', 'none_public_route_shell',
        'route_authority', 'registry',
        'frontend_role', 'renderer',
        'seo', jsonb_build_object(
          'title', 'AI Operations Assessment | Measures Registry',
          'description', 'Identify structural drift in AI operations and route into a governed assessment-first pathway.',
          'canonical_url', 'https://measuresregistry.com/ai-operations-assessment',
          'og_type', 'website',
          'og_title', 'AI Operations Assessment | Measures Registry',
          'og_description', 'Identify structural drift in AI operations and route into a governed assessment-first pathway.',
          'og_url', 'https://measuresregistry.com/ai-operations-assessment',
          'og_image', 'https://measuresregistry.com/og.jpeg',
          'twitter_card', 'summary_large_image',
          'twitter_title', 'AI Operations Assessment | Measures Registry',
          'twitter_description', 'Identify structural drift in AI operations and route into a governed assessment-first pathway.',
          'twitter_image', 'https://measuresregistry.com/og.jpeg'
        ),
        'prohibited_claims', jsonb_build_array(
          'pricing',
          'payment standing',
          'wallet connection',
          'c3 Key issuance',
          'temp c3 Key issuance',
          'SRC binding',
          'certification',
          'conversion',
          'DAO standing',
          'permission state',
          'recognition state',
          'distribution standing',
          'Marble Chamber readiness',
          'Registry Certification claim',
          'Measures Conversion claim'
        ),
        'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_landing_pages_as_governed_registry_units_v1.meta.md'
      )
    ),
    (
      'structural_drift_landing',
      'Structural Drift | Measures Registry',
      'spine',
      'landing_page',
      'lapis',
      2020,
      v_structural_state,
      'visible',
      'structural drift public route',
      true,
      jsonb_build_object(
        'unit_key', 'structural_drift_landing',
        'route_path', '/structural-drift',
        'unit_type', 'landing_page',
        'public_state', v_structural_state,
        'canonical_url', 'https://measuresregistry.com/structural-drift',
        'metadata_profile', 'structural_drift_seo',
        'publication_relation', 'structural_drift_dispatches',
        'primary_cta_label', 'Begin Structural Evaluation',
        'primary_cta_target', 'assess_environment_flow',
        'secondary_cta_target', 'understand_environment_flow',
        'runtime_target', 'registered_structural_drift_publication_support_surface',
        'runtime_surface', 'structural_drift_dispatches',
        'cta_surface', 'measures_assessment',
        'secondary_cta_surface', 'structure_passage',
        'claims_boundary', 'education_only',
        'material_family', 'none_public_route_shell',
        'route_authority', 'registry',
        'frontend_role', 'renderer',
        'publication_standing', jsonb_build_object(
          'publication_key', 'structural_drift',
          'published_dispatch_count', v_dispatch_count
        ),
        'seo', jsonb_build_object(
          'title', 'Structural Drift | Measures Registry',
          'description', 'Structural drift appears when AI systems, roles, runtime surfaces, and review pathways scale without governed operational structure.',
          'canonical_url', 'https://measuresregistry.com/structural-drift',
          'og_type', 'article',
          'og_title', 'Structural Drift | Measures Registry',
          'og_description', 'Structural drift appears when AI systems, roles, runtime surfaces, and review pathways scale without governed operational structure.',
          'og_url', 'https://measuresregistry.com/structural-drift',
          'og_image', 'https://measuresregistry.com/og.jpeg',
          'twitter_card', 'summary_large_image',
          'twitter_title', 'Structural Drift | Measures Registry',
          'twitter_description', 'Structural drift appears when AI systems, roles, runtime surfaces, and review pathways scale without governed operational structure.',
          'twitter_image', 'https://measuresregistry.com/og.jpeg'
        ),
        'prohibited_claims', jsonb_build_array(
          'pricing',
          'payment standing',
          'wallet connection',
          'c3 Key issuance',
          'temp c3 Key issuance',
          'SRC binding',
          'certification',
          'conversion',
          'DAO standing',
          'permission state',
          'recognition state',
          'distribution standing',
          'Marble Chamber readiness',
          'Registry Certification claim',
          'Measures Conversion claim'
        ),
        'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_landing_pages_as_governed_registry_units_v1.meta.md'
      )
    )
  on conflict (registry_key) do update
  set
    display_title = excluded.display_title,
    registry_family = excluded.registry_family,
    encounter_type = excluded.encounter_type,
    material_family = excluded.material_family,
    sequence_order = excluded.sequence_order,
    release_state = excluded.release_state,
    access_state = excluded.access_state,
    phase_label = excluded.phase_label,
    is_active = excluded.is_active,
    metadata = excluded.metadata,
    updated_at = now();

  select id into v_ai_id from public.measures_registry where registry_key = 'ai_operations_assessment_landing';
  select id into v_structural_id from public.measures_registry where registry_key = 'structural_drift_landing';

  delete from public.measures_release_state
  where registry_id in (v_ai_id, v_structural_id);

  insert into public.measures_release_state (
    registry_id,
    release_state,
    access_state,
    release_reason,
    access_reason,
    phase_label,
    effective_at,
    metadata
  )
  select
    mr.id,
    mr.release_state,
    mr.access_state,
    'landing page registry unit seated by OAR2',
    'public route metadata and CTA contract visible',
    mr.phase_label,
    now(),
    mr.metadata || jsonb_build_object('state_surface', 'landing_page_registry_unit')
  from public.measures_registry mr
  where mr.id in (v_ai_id, v_structural_id);

  insert into public.measures_media_map (
    registry_key,
    encounter_key,
    campaign_key,
    media_role,
    storage_bucket,
    storage_path,
    mime_type,
    sort_order,
    is_active,
    metadata
  )
  values (
    'measures_registry_landing',
    'landing_route_metadata',
    'agents_of_chaos_integrity_governance',
    'registry_shell_preview',
    'measures-registry',
    'og.jpeg',
    'image/jpeg',
    1,
    true,
    jsonb_build_object(
      'public_url', 'https://measuresregistry.com/og.jpeg',
      'exact_url_seated', 'https://measuresregistry.com/og.jpeg',
      'usage', 'open_graph_twitter_preview',
      'surface', 'landing_page_route_metadata',
      'authority', 'governed_media_mapping',
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_landing_pages_as_governed_registry_units_v1.meta.md'
    )
  )
  on conflict do nothing;

  update public.measures_media_map
  set
    is_active = true,
    metadata = metadata
      || jsonb_build_object(
        'public_url', 'https://measuresregistry.com/og.jpeg',
        'exact_url_seated', 'https://measuresregistry.com/og.jpeg',
        'authority', 'governed_media_mapping',
        'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_landing_pages_as_governed_registry_units_v1.meta.md'
      ),
    updated_at = now()
  where campaign_key = 'agents_of_chaos_integrity_governance'
    and media_role = 'registry_shell_preview';

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'ai_operations_assessment_landing'
      and metadata ->> 'route_authority' = 'registry'
      and metadata #>> '{seo,title}' = 'AI Operations Assessment | Measures Registry'
      and metadata #>> '{seo,canonical_url}' = 'https://measuresregistry.com/ai-operations-assessment'
      and metadata ->> 'claims_boundary' = 'assessment_only'
  ) then
    raise exception 'ai_operations_assessment_landing validation failed';
  end if;

  if not exists (
    select 1
    from public.measures_registry
    where registry_key = 'structural_drift_landing'
      and metadata ->> 'route_authority' = 'registry'
      and metadata #>> '{seo,title}' = 'Structural Drift | Measures Registry'
      and metadata #>> '{seo,canonical_url}' = 'https://measuresregistry.com/structural-drift'
      and metadata ->> 'claims_boundary' = 'education_only'
  ) then
    raise exception 'structural_drift_landing validation failed';
  end if;
end $$;
