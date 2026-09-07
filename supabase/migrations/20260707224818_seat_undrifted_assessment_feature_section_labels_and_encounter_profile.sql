-- OAR2: oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1
-- Resolves the two projection-only ownership gaps found by the prior synchronization OAR2
-- (assessment_feature, landing_design_contract), and seats a new Publication Encounter Profile
-- as the governed composition authority. Additive jsonb merge only — no existing
-- measures_publication_registry field is overwritten or removed. Copy values below are taken
-- verbatim from the currently-live measures_encounter_def row, not invented.

update measures_publication_registry
set metadata = metadata || jsonb_build_object(
  -- Canonical assessment_feature — previously existed only in the encounter projection with
  -- no Publication Registry source. Value copied verbatim from the live projection.
  'assessment_feature', jsonb_build_object(
    'cta_label', 'ASSESS THE ENVIRONMENT',
    'route_path', '/ai-operations-assessment',
    'feature_body', 'Structural drift is detectable.',
    'feature_label', 'AI OPERATIONS ASSESSMENT',
    'feature_title', 'AI OPERATIONS ASSESSMENT',
    'rating_display', '7 Questions · 2 Minutes · Governed Findings',
    'source_oar2', 'OAR/OAR2/publication/oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1.meta.md'
  ),
  -- Canonical section_labels — the copy previously trapped in encounter_def-only
  -- landing_design_contract. Copy values copied verbatim.
  'section_labels', jsonb_build_object(
    'cover_eyebrow', 'ISSUE 001 — LAUNCH EDITION',
    'insights_eyebrow', 'DISPATCHES FROM MEASURES REGISTRY',
    'insights_heading', 'FEATURE ARTICLES',
    'source_oar2', 'OAR/OAR2/publication/oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1.meta.md'
  ),
  -- landing_design_contract retained for traceability but explicitly marked superseded —
  -- prevents it and the new Publication Encounter Profile from acting as competing layout
  -- authorities, per this OAR2's Routed §3.
  'landing_design_contract', jsonb_build_object(
    'style_contract_key', 'undrifted_publication_style_v1',
    'landing_contract_key', 'undrifted_issue_001_landing_v1',
    'standing', 'superseded',
    'superseded_by', 'undrifted_publication_encounter_profile_v1',
    'note', 'Copy fields migrated to metadata.section_labels; composition authority migrated to metadata.encounter_profile. Retained only for historical trace.'
  ),
  -- Publication Encounter Profile — governs composition only, distinct from publication
  -- identity. Values below implement this OAR2's Routed §4 "Required launch composition"
  -- (wider desktop viewport, unified masthead/issue identity, dominant cover story, primary
  -- assessment CTA, editorial-spread articles, de-boxed role call, forbidden generic-SaaS
  -- card-stack pattern), scoped to desktop only so mobile readability is preserved unchanged.
  'encounter_profile', jsonb_build_object(
    'profile_key', 'undrifted_publication_encounter_profile_v1',
    'publication_key', 'undrifted',
    'route_scope', '/undrifted',
    'encounter_type', 'publication_landing',
    'viewport_contract', jsonb_build_object(
      'desktop_content_max_width', 'min(94vw, 96rem)',
      'tablet_content_max_width', 'min(92vw, 100%)',
      'mobile_content_max_width', '100%',
      'desktop_breakpoint', '1024px'
    ),
    'region_order', jsonb_build_array('masthead','issue_rail','cover_story','assessment_feature','featured_articles','role_call','next_issue','subscribe','footer'),
    'region_weights', jsonb_build_object(
      'cover_story', 'dominant',
      'assessment_feature', 'primary_cta',
      'featured_articles', 'editorial_spread',
      'role_call', 'secondary',
      'next_issue', 'secondary',
      'subscribe', 'tertiary'
    ),
    'masthead_behavior', 'unified_with_issue_rail',
    'cover_story_behavior', 'dominant_full_width_on_desktop',
    'assessment_feature_behavior', 'elevated_accent_primary_cta',
    'featured_article_behavior', 'editorial_spread_large_cover',
    'role_call_behavior', 'borderless_editorial_pullquote',
    'responsive_rules', jsonb_build_object(
      'mobile', 'preserve_standard_readable_width_stacked',
      'tablet', 'moderate_width_increase',
      'desktop', 'full_viewport_contract_applies'
    ),
    'forbidden_patterns', jsonb_build_array('generic_saas_dashboard','uniform_bordered_card_stack','cyberpunk_neon_overload','ai_apocalypse_graphics'),
    'source_oar2', 'OAR/OAR2/publication/oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1.meta.md'
  )
)
where publication_key = 'undrifted';
