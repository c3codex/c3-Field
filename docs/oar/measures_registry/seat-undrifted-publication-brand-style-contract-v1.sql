do $$
declare
  v_now timestamptz := now();
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

  insert into public.measures_publication_registry (
    publication_key,
    title,
    subtitle,
    publication_type,
    status,
    distribution_surface,
    external_platform,
    external_slug,
    external_url,
    tone,
    metadata,
    updated_at
  )
  values (
    'undrifted',
    'unDrifted',
    'Structural drift is detectable. Collapse is not the default.',
    'dispatch_publication',
    'published',
    'measures_registry',
    null,
    null,
    null,
    '["clear","measured","diagnostic","field_defining","non_sensational"]'::jsonb,
    jsonb_build_object(
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_undrifted_publication_brand_and_style_contract_v1.meta.md',
      'parent_authority', 'measures_registry',
      'brand_title', 'unDrifted',
      'primary_series', 'structural_drift',
      'claim_boundary', 'education_only',
      'cta_boundary', 'no_payment_no_conversion_no_certification',
      'style_contract_key', 'undrifted_publication_style_v1',
      'release_state', 'released',
      'brand_assets', jsonb_build_object(
        'primary_full_lockup_path', '/undrifted_logo.png',
        'publication_header_path', '/undrifted_logo.png',
        'avatar_favicon_source', 'uD monogram only crop from primary mark',
        'social_banner_source', 'unDrifted wordmark + canonical brand line + Measures Registry parent mark'
      ),
      'logo_contract', jsonb_build_object(
        'primary_mark_status', 'canonical',
        'wordmark', 'unDrifted',
        'tagline', 'MEASURE · DETECT · CORRECT · GOVERN',
        'usage_hierarchy', jsonb_build_array(
          jsonb_build_object('rank', 1, 'surface', 'primary full lockup', 'composition', 'uD monogram + unDrifted wordmark + tagline'),
          jsonb_build_object('rank', 2, 'surface', 'publication header', 'composition', 'unDrifted wordmark + canonical brand line'),
          jsonb_build_object('rank', 3, 'surface', 'avatar / favicon', 'composition', 'uD monogram only'),
          jsonb_build_object('rank', 4, 'surface', 'social banner', 'composition', 'unDrifted wordmark + canonical brand line + Measures Registry parent mark')
        ),
        'mark_characteristics', jsonb_build_array(
          'dark obsidian field',
          'circular detection / registry geometry',
          'split uD monogram',
          'left-side drift displacement lines',
          'central vertical measurement axis',
          'cyan/lapis corrected D form',
          'cold white drifted/u form',
          'governed circular relation field',
          'wordmark: unDrifted',
          'tagline: MEASURE · DETECT · CORRECT · GOVERN'
        ),
        'must_remain', jsonb_build_array('typographic','mark_based'),
        'forbidden_logo_patterns', jsonb_build_array(
          'illustrated_scene',
          'badge_emblem',
          'mascot',
          'generic_cyber_logo',
          'compliance_seal',
          'crypto_token_mark'
        )
      ),
      'brand_copy', jsonb_build_object(
        'header', 'unDrifted',
        'primary_line', 'Structural drift is detectable. Collapse is not the default.',
        'subtitle_lines', jsonb_build_array(
          'Structural drift is detectable.',
          'Collapse is not the default.'
        ),
        'secondary_description', 'Dispatches from Measures Registry on structural drift, AI operations, and governed environments.',
        'metadata_description', 'Structural drift is detectable. Collapse is not the default. unDrifted is a Measures Registry publication on AI operations, governed environments, and the correction of structural drift.',
        'principles', jsonb_build_array(
          'Drift is detectable.',
          'Systems can be measured.',
          'Authority can be restored.'
        ),
        'publication_rule', 'unDrifted does not dramatize collapse. It documents drift, names the seam, and routes correction.'
      ),
      'hierarchy', jsonb_build_object(
        'parent', 'measures_registry',
        'publication_key', 'undrifted',
        'series', jsonb_build_array(
          jsonb_build_object(
            'series_key', 'structural_drift',
            'title', 'Structural Drift',
            'current_dispatches', jsonb_build_array('structural_drift', 'agents_of_chaos_dispatch_v1')
          ),
          jsonb_build_object('series_key', 'assessment_first', 'title', 'Assessment-First', 'future_state', true),
          jsonb_build_object('series_key', 'governed_environments', 'title', 'Governed Environments', 'future_state', true),
          jsonb_build_object('series_key', 'ai_operations', 'title', 'AI Operations', 'future_state', true),
          jsonb_build_object('series_key', 'field_notes', 'title', 'Field Notes', 'future_state', true)
        )
      ),
      'style_contract', jsonb_build_object(
        'key', 'undrifted_publication_style_v1',
        'base_material', 'obsidian',
        'accent_material', 'lapis_cyan',
        'secondary_material', 'graphite',
        'text_material', 'cold_white',
        'visual_posture', jsonb_build_array('dark_editorial','fracture_aware','registry_governed','precise','non_sensational'),
        'forbidden_visual_patterns', jsonb_build_array('cyberpunk_neon_overload','ai_apocalypse_graphics','compliance_beige','crypto_web3_cues','hud_clutter','generic_saas_dashboard'),
        'texture_contract', jsonb_build_array('obsidian fracture','subtle lattice','graphite plates','faint cyan relation lines','controlled glow only at relation points'),
        'tokens', jsonb_build_object(
          '--undrifted-bg', '#030608',
          '--undrifted-panel', '#070b0f',
          '--undrifted-graphite', '#111820',
          '--undrifted-line', 'rgba(180, 210, 255, 0.18)',
          '--undrifted-line-strong', 'rgba(70, 145, 255, 0.55)',
          '--undrifted-text', '#e8edf2',
          '--undrifted-muted', '#aab4bf',
          '--undrifted-faint', '#687481',
          '--undrifted-blue', '#1f8cff',
          '--undrifted-cyan', '#59c7ff',
          '--undrifted-obsidian', '#05070a'
        )
      ),
      'allowed_cta_labels', jsonb_build_array(
        'Read the Dispatch',
        'Assess the Environment',
        'Continue to Structural Evaluation',
        'Understand the Environment',
        'View Field Notes'
      )
    ),
    v_now
  )
  on conflict (publication_key) do update set
    title = excluded.title,
    subtitle = excluded.subtitle,
    publication_type = excluded.publication_type,
    status = excluded.status,
    distribution_surface = excluded.distribution_surface,
    tone = excluded.tone,
    metadata = public.measures_publication_registry.metadata || excluded.metadata,
    updated_at = excluded.updated_at;

  update public.measures_publication_registry
  set metadata = metadata || jsonb_build_object(
        'umbrella_publication_key', 'undrifted',
        'series_key', 'structural_drift',
        'series_title', 'Structural Drift',
        'publication_role', 'diagnostic_series',
        'parent_publication_key', 'undrifted'
      ),
      updated_at = v_now
  where publication_key = 'structural_drift';

  update public.measures_publication_dispatch
  set primary_cta = 'Continue to Structural Evaluation',
      secondary_cta = 'View Field Notes',
      metadata = metadata || jsonb_build_object(
        'umbrella_publication_key', 'undrifted',
        'series_key', 'structural_drift',
        'claim_boundary', 'education_only',
        'cta_boundary', 'no_payment_no_conversion_no_certification',
        'cta_label', 'Read the Dispatch'
      ),
      updated_at = v_now
  where publication_key = 'structural_drift'
    and status = 'published';

  if not exists (
    select 1
    from public.measures_publication_registry
    where publication_key = 'undrifted'
      and title = 'unDrifted'
      and metadata #>> '{style_contract,key}' = 'undrifted_publication_style_v1'
      and metadata #>> '{claim_boundary}' = 'education_only'
      and metadata #>> '{primary_series}' = 'structural_drift'
  ) then
    raise exception 'undrifted publication validation failed';
  end if;

  if exists (
    select 1
    from public.measures_publication_dispatch
    where publication_key = 'structural_drift'
      and status = 'published'
      and coalesce(primary_cta, '') not in ('Read the Dispatch','Assess the Environment','Continue to Structural Evaluation','Understand the Environment','View Field Notes')
  ) then
    raise exception 'published structural_drift dispatch CTA validation failed';
  end if;
end $$;
