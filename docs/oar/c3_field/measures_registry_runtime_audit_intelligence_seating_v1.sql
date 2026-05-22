-- Measures Registry Sitewide Runtime Audit — Implementation Intelligence Seating v1
-- Source OAR2: docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md
-- Source audit: docs/oar/measures_registry/oar1_audit_measures_registry_sitewide_runtime_contract_v1.meta.md
-- System intelligence seating only. No Concordance ontology expansion.

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
  'measures_registry_runtime_audit_intelligence',
  'Measures Registry Sitewide Runtime — Implementation Intelligence',
  'runtime_governance',
  'active',
  'internal',
  'Codex -> Field -> Measures -> Chazz',
  '[
    "docs/oar/measures_registry/oar1_audit_measures_registry_sitewide_runtime_contract_v1.meta.md",
    "docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md",
    "docs/oar/c3field/oar2_seat_measures_registry_sitewide_runtime_audit_as_system_intel_v1.meta.md"
  ]'::jsonb,
  '{
    "document_type": "system_intelligence",
    "authority_level": "system",
    "document_scope": "runtime_governance",
    "status": "seeded",
    "system_key": "c3field",
    "source_system": "measures_registry",
    "intelligence_class": "implementation_intelligence",
    "intelligence_scope": "runtime_governance",
    "seeded_reference": true,
    "source_oar1": "docs/oar/measures_registry/oar1_audit_measures_registry_sitewide_runtime_contract_v1.meta.md"
  }'::jsonb
)
on conflict (document_key) do nothing;

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
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  'docs/oar/c3field/oar1_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{
    "document_type": "system_intelligence",
    "authority_level": "system",
    "document_scope": "runtime_governance",
    "status": "seeded",
    "system_key": "c3field",
    "source_system": "measures_registry",
    "intelligence_class": "implementation_intelligence",
    "intelligence_scope": "runtime_governance",
    "seeded_reference": true,
    "no_semantic_ontology_expansion": true
  }'::jsonb
)
on conflict (version_key) do nothing;

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
) values
(
  'mrs_intel_v1_implementation_sequence',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'sitewide_runtime_contract -> encounter_contracts -> renderer_behavior -> runtime_state',
  'version',
  'related_to',
  'Implementation-critical sequencing: sitewide contract must precede encounter contracts',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "implementation_sequencing"}'::jsonb
),
(
  'mrs_intel_v1_preserve_evaluation_chamber_stack',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'MeasuresAssessmentChamber, MeasuresAssessmentResult, MeasuresAssessmentBrandLayer — fully prop-driven, correctly wired to Codex',
  'version',
  'related_to',
  'Preserve: evaluation chamber stack is reusable runtime asset',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "reusable_asset"}'::jsonb
),
(
  'mrs_intel_v1_preserve_codex_extraction_utilities',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'sectionCopy(), resolveEnvironmentalReport() — comprehensive metadata extraction, no hardcoded fallbacks within',
  'version',
  'related_to',
  'Preserve: Codex extraction utilities are reusable runtime assets',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "reusable_asset"}'::jsonb
),
(
  'mrs_intel_v1_preserve_token_pipeline',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_design_token -> registryTokenStyle CSS injection — correct authority pattern; 30 active tokens (24 required + 6 brand)',
  'version',
  'related_to',
  'Preserve: design token pipeline is correctly governed; do not alter',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "reusable_asset"}'::jsonb
),
(
  'mrs_intel_v1_preserve_media_resolution',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'mediaUrl(), measures_media_map resolution — correct storage URL resolution pattern',
  'version',
  'related_to',
  'Preserve: media resolution pattern is correctly governed; do not alter',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "reusable_asset"}'::jsonb
),
(
  'mrs_intel_v1_preserve_navigation',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'navigateSurface(), writeHistory(), handleAction() — surface routing and browser history are correct',
  'version',
  'related_to',
  'Preserve: navigation and routing functions are correct; do not alter',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "reusable_asset"}'::jsonb
),
(
  'mrs_intel_v1_retire_assessment_copy_ts',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'src/measures_registry/measuresAssessmentCopy.ts — all 4 constants duplicate Codex-seated values; ASSESSMENT_SUB_SUPPORT_LINE unconditionally bypasses Codex',
  'version',
  'related_to',
  'Retire: measuresAssessmentCopy.ts — move all constants to Codex and remove file',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "retirement_candidate"}'::jsonb
),
(
  'mrs_intel_v1_retire_threshold_hero_copy',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'MeasuresRegistryRuntime.tsx intro renderer — threshold hero copy hardcoded; should resolve from landing_root.hero_paths Codex metadata',
  'version',
  'related_to',
  'Retire: hardcoded threshold hero copy in intro renderer',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "retirement_candidate"}'::jsonb
),
(
  'mrs_intel_v1_retire_duplicate_footer',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'renderStructuralDriftDispatchesSurface() — registry-field-guide-footer duplicates renderSystemFooter(); copyright appears twice on one surface',
  'version',
  'related_to',
  'Retire: duplicate registry-field-guide-footer block from structural drift dispatches surface',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "retirement_candidate"}'::jsonb
),
(
  'mrs_intel_v1_retire_orphaned_icon_contract',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'icon_contract — Codex-seated in encounter_contract for evaluation encounters; sectionCopy() does not extract it; no renderer consumes it',
  'version',
  'related_to',
  'Orphaned authority: icon_contract is Codex-seated but runtime-orphaned — consume or retire from seating',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "orphaned_authority"}'::jsonb
),
(
  'mrs_intel_v1_retire_orphaned_transition_contract',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'interaction_contract.transition: "restrained_dissolve_fade" — Codex-seated but no CSS or React implementation; navigateSurface() has no animation',
  'version',
  'related_to',
  'Orphaned authority: transition contract is stated in Codex but unrealized — implement or retire from seating',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "orphaned_authority"}'::jsonb
),
(
  'mrs_intel_v1_drift_unconditional_sub_support_line',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'MeasuresAssessmentResult.tsx:64 — ASSESSMENT_SUB_SUPPORT_LINE renders unconditionally; not a fallback; bypasses Codex entirely',
  'version',
  'related_to',
  'Frontend drift: ASSESSMENT_SUB_SUPPORT_LINE is the most critical active legacy constant — source from Codex or render null',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "frontend_drift", "priority": 1}'::jsonb
),
(
  'mrs_intel_v1_drift_hardcoded_jsx_result',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'MeasuresAssessmentResult.tsx — hardcoded: "Assessment" (66), "Findings" (73), "Continue into the Structured Environment." (114)',
  'version',
  'related_to',
  'Frontend drift: hardcoded JSX strings in result renderer bypass Codex authority',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "frontend_drift"}'::jsonb
),
(
  'mrs_intel_v1_drift_hardcoded_copyright',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'renderSystemFooter() and registry-field-guide-footer — copyright hardcoded in two JSX locations; no Codex authority for footer copy',
  'version',
  'related_to',
  'Frontend drift: copyright text hardcoded in two JSX locations without Codex authority',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "frontend_drift"}'::jsonb
),
(
  'mrs_intel_v1_isolation_result_surface_uncontracted',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'evaluation_result — no measures_encounter_def row; result renders inside evaluation chamber with no surface transition; activeSurface unchanged on completion',
  'version',
  'related_to',
  'Encounter isolation required: result surface has no Codex row and is not isolated as its own encounter',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "encounter_separation_required"}'::jsonb
),
(
  'mrs_intel_v1_isolation_eval_step_incomplete',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'EvalStep type: "src_capture" | "diagnostic" | "resolving" — no "complete" state; data-chamber-state reads "resolving" during result display',
  'version',
  'related_to',
  'Runtime state gap: EvalStep missing "complete" state causes incorrect data-chamber-state during result',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "runtime_state_gap", "priority": 1}'::jsonb
),
(
  'mrs_intel_v1_media_passageMuted_global',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'passageMuted — session-global boolean governing explainer_video, structuredEnvironmentPassageVideoUrl, and marble tone; no encounter scoping',
  'version',
  'related_to',
  'Media governance gap: passageMuted is session-global; requires encounter-scoped media state',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "media_governance_gap"}'::jsonb
),
(
  'mrs_intel_v1_media_marble_tone_unscoped',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  'renderMarbleToneContinuity() — mounted at runtime root; plays across all surface states when !passageMuted && marbleToneUrl; no per-encounter governance metadata',
  'version',
  'related_to',
  'Media governance gap: marble tone persists across all surfaces with no per-encounter scoping contract',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "media_governance_gap"}'::jsonb
),
(
  'mrs_intel_v1_uncontracted_surfaces',
  'measures_registry_runtime_audit_intelligence_v1',
  'measures_registry_runtime_audit_intelligence_v1',
  '13 of 18 surfaces lack styling_contract; only evaluation chamber (measures_ai_operational_evaluation, iis_eval_gate1) fully contracted; educational_diagnostic_passage partial',
  'version',
  'related_to',
  'Un-contracted surfaces: 13 of 18 surfaces require styling_contract seating before sitewide governance is complete',
  'active',
  'internal',
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"seating": "runtime_governance_intelligence_capture", "intel_class": "uncontracted_surface_map"}'::jsonb
)
on conflict (relation_key) do nothing;

insert into public.seeded_source_snapshot (
  snapshot_key,
  version_key,
  snapshot_type,
  local_source_path,
  bucket_name,
  bucket_path,
  source_sha256,
  byte_size,
  verification_standing,
  visibility_standing,
  verified_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'mrs_runtime_audit_intelligence_v1_local_source_2e2daffb',
  'measures_registry_runtime_audit_intelligence_v1',
  'local_source',
  'docs/oar/measures_registry/oar1_audit_measures_registry_sitewide_runtime_contract_v1.meta.md',
  'local',
  'docs/oar/measures_registry/oar1_audit_measures_registry_sitewide_runtime_contract_v1.meta.md',
  '2e2daffbac14bbe25ffc59cf8d01efbb03c811384b626eb6182a1fed781be333',
  30318,
  'verified',
  'internal',
  now(),
  'docs/oar/c3field/oar2_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  'docs/oar/c3field/oar1_codex_seat_runtime_audit_as_system_intelligence_v1.meta.md',
  '{"snapshot_boundary": "local evidence; Codex seating remains authority", "source_type": "oar1_audit"}'::jsonb
)
on conflict (snapshot_key) do nothing;
