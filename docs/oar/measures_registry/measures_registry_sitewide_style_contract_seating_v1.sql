-- Measures Registry Sitewide Style Contract — Seating SQL v1
-- Source OAR2: docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md

-- concordance_document
insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'measures_registry_sitewide_style_contract',
  'Measures Registry Sitewide Runtime/Style Contract',
  'sitewide_style_contract',
  'active',
  'internal',
  '1',
  '[{"key": "measures_registry_runtime_audit_intelligence", "type": "intelligence_source"}]'::jsonb,
  '{
    "document_type": "style_contract",
    "authority_level": "system",
    "status": "seeded",
    "system_key": "measures_registry",
    "intelligence_class": "sitewide_governance",
    "seating_class": "runtime_style_contract",
    "source_intelligence": "measures_registry_runtime_audit_intelligence",
    "implementation_order": "sitewide_runtime_contract → encounter_contracts → renderer_behavior → runtime_state"
  }'::jsonb
) on conflict (document_key) do nothing;

-- concordance_version
insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  'docs/oar/measures_registry/oar1_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{"status": "seeded", "system_key": "measures_registry"}'::jsonb
) on conflict (version_key) do nothing;

-- concordance_relation: intelligence binding (source_alignment)
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_intelligence_binding',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_runtime_audit_intelligence',
  'system',
  'source_alignment',
  'Upstream implementation intelligence authority',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "intelligence_binding",
    "contract_class": "upstream_authority"
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: typography contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_typography_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'typography',
  'system',
  'related_to',
  'Typography authority: heading font, body font, hierarchy scaling, desktop/mobile behavior',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "typography",
    "contract_class": "style_contract_clause",
    "governs": ["heading_font_authority", "body_font_authority", "hierarchy_scaling", "desktop_mobile_typography"]
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: color and material contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_color_material_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'color_material',
  'system',
  'related_to',
  'Color and material authority: obsidian, lapis, crystal, marble, semantic usage, interaction states',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "color_material",
    "contract_class": "style_contract_clause",
    "governs": ["obsidian", "lapis", "crystal", "marble", "semantic_usage_boundaries", "interaction_states"]
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: button and icon contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_button_icon_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'button_icon',
  'system',
  'related_to',
  'Button and icon authority: primary CTA, secondary CTA, passage controls, icon rendering, hover/focus, mobile scaling',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "button_icon",
    "contract_class": "style_contract_clause",
    "governs": ["primary_cta", "secondary_cta", "passage_controls", "icon_rendering_authority", "hover_focus_behavior", "mobile_scaling"]
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: media behavior contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_media_behavior_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'media_behavior',
  'system',
  'related_to',
  'Media behavior authority: autoplay, mute/unmute, interaction unlock, persistence boundaries, encounter-scoped media',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "media_behavior",
    "contract_class": "style_contract_clause",
    "governs": ["autoplay_rules", "mute_unmute_behavior", "interaction_unlock_rules", "media_persistence_boundaries", "encounter_scoped_media_behavior"],
    "audit_finding": "passageMuted_is_session_global"
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: marble tone contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_marble_tone_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'marble_tone',
  'system',
  'related_to',
  'Marble tone authority: low-volume baseline, encounter-scoped playback, continuity rules, mute relationship',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "marble_tone",
    "contract_class": "style_contract_clause",
    "governs": ["low_volume_baseline", "encounter_scoped_playback_rules", "continuity_rules", "mute_relationship_rules"],
    "audit_finding": "marble_tone_persists_across_surfaces_unscoped"
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: viewport and containment contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_viewport_containment_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'viewport_containment',
  'system',
  'related_to',
  'Viewport and containment authority: desktop/mobile containment, single-screen fit, overflow, encounter boundaries',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "viewport_containment",
    "contract_class": "style_contract_clause",
    "governs": ["desktop_containment", "mobile_containment", "single_screen_encounter_fit", "overflow_behavior", "encounter_viewport_boundaries"]
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: branding contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_branding_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'branding',
  'system',
  'related_to',
  'Branding authority: registry mark usage, placement classes, opacity rules, institutional identity boundaries',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "branding",
    "contract_class": "style_contract_clause",
    "governs": ["registry_mark_usage", "mark_placement_classes", "mark_opacity_rules", "institutional_identity_boundaries"]
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: footer contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_footer_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'footer',
  'system',
  'related_to',
  'Footer authority: copyright authority, visibility rules, footer copy authority, system linkage',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "footer",
    "contract_class": "style_contract_clause",
    "governs": ["copyright_authority", "footer_visibility_rules", "footer_copy_authority", "system_linkage_rules"],
    "audit_finding": "copyright_hardcoded_in_jsx"
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: transition contract
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_transition_contract',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'transition',
  'system',
  'related_to',
  'Transition authority: encounter transition behavior, dissolve/fade authority, state isolation expectations',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "transition",
    "contract_class": "style_contract_clause",
    "governs": ["encounter_transition_behavior", "dissolve_fade_authority", "state_isolation_expectations"],
    "audit_finding": "orphaned_transition_contract_unrealized"
  }'::jsonb
) on conflict (relation_key) do nothing;

-- concordance_relation: preserved runtime assets
insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values (
  'mrssc_v1_preserved_runtime_assets',
  'measures_registry_sitewide_style_contract_v1',
  'measures_registry_sitewide_style_contract',
  'preserved_runtime_assets',
  'system',
  'related_to',
  'Preserved runtime assets: MeasuresAssessmentChamber, MeasuresAssessmentResult, sectionCopy(), resolveEnvironmentalReport(), token pipeline, media resolution, navigation, obsidian contract',
  'active',
  'internal',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{
    "seating": "sitewide_style_contract_seating",
    "system_key": "measures_registry",
    "contract_domain": "preserved_runtime_assets",
    "contract_class": "preservation_clause",
    "preserved": ["MeasuresAssessmentChamber", "MeasuresAssessmentResult", "sectionCopy()", "resolveEnvironmentalReport()", "token_pipeline", "media_resolution", "navigation_history", "obsidian_material_contract"]
  }'::jsonb
) on conflict (relation_key) do nothing;

-- seeded_source_snapshot
insert into public.seeded_source_snapshot (
  snapshot_key,
  version_key,
  snapshot_type,
  local_source_path,
  source_sha256,
  byte_size,
  verification_standing,
  visibility_standing,
  verified_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'mrssc_v1_local_source_78d1a538',
  'measures_registry_sitewide_style_contract_v1',
  'local_source',
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '78d1a5383c98cc77098d74dc4ec35a8084bfc5efd33cce5b78bb2053c6a3b644',
  4744,
  'verified',
  'internal',
  now(),
  'docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  'docs/oar/measures_registry/oar1_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md',
  '{"snapshot_note": "OAR2 source document verification"}'::jsonb
) on conflict (snapshot_key) do nothing;
