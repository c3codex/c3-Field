---
document_type: oar1
authority_level: closeout
system_scope: measures_registry_root_runtime_architecture
title: OAR1 - Root Runtime Architecture Audit Before Live Launch v1
status: completed
version: v1
operator: op044
process_key: root_runtime_architecture_audit_before_live_launch
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_root_runtime_architecture_audit_before_live_launch_v1.meta.md
---

# OAR1 - Root Runtime Architecture Audit Before Live Launch v1

closeout:
  status: completed
  applied_date: 2026-06-21
  process_key: root_runtime_architecture_audit_before_live_launch
  audit_method: source_code_inspection
  root_component_identified: true
  root_registry_key_identified: true
  landing_root_runtime_source_identified: true
  active_layout_contract_identified: true
  active_intro_continue_contract_identified: true
  active_threshold_split_path_contract_identified: true
  threshold_hero_cause_identified: true
  root_behavior_control_source_identified: true
  exact_files_identified: true
  exact_registry_records_identified: true
  minimal_correction_path_identified: true
  defect_in_routing: true
  defect_in_source: true
  defect_in_fallback_logic: true
  defect_in_registry: false
  defect_in_layout_contract: false
  approved_lapis_component_exists: true
  approved_lapis_component_unreachable_from_root: true
  DB_mutation_performed: false
  checkout_session_created: false
  payment_created: false
  webhook_fulfillment_triggered: false
  SRC_binding_created: false
  c3_key_created: false
  permission_created: false
  certification_created: false
  DAO_standing_created: false
  Codexstone_conversion_created: false
  Registry_Certification_created: false
  oar1_closeout_created: true

root_component_evidence:
  component: MeasuresRegistryRuntimeRegistered
  file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  line: 162

root_registry_key_evidence:
  resolved_key: null
  cause: "/" not present in ROUTE_UNIT_KEYS
  ROUTE_UNIT_KEYS_file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  ROUTE_UNIT_KEYS_lines: 124-130
  activeRouteUnitKey_resolved_at_line: 339

landing_root_source_evidence:
  source: initialSurface()_hardcoded_fallback
  file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  function: initialSurface
  function_lines: 153-160
  fallback_return_line: 159
  fallback_return_value: '"intro"'
  activeSurface_initialized_at_line: 163

active_layout_contract_evidence:
  contract: intro
  attribute: data-layout-contract="intro"
  file: src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
  line: 104
  approved_contract: transition_choice
  approved_contract_file: src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
  approved_contract_line: 52

active_intro_continue_contract_evidence:
  component: RegisteredIntro
  file: src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
  epigraph_section_lines: 108-165
  threshold_hero_section_lines: 166-196
  auto_advance: false
  advance_requires_user_interaction: true

active_threshold_split_path_contract_evidence:
  component: RegisteredIntro
  file: src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
  threshold_hero_lines: 166-196
  left_side: obsidian_fracture
  right_side: crystal_measured
  center_divider_material_family: crystal
  left_choice_navigates_to: path_choice
  right_choice_navigates_to: path_choice

threshold_hero_cause_evidence:
  cause: initialSurface()_returns_intro_no_registry_governance_for_root
  governance_effect_file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  governance_effect_lines: 349-358
  governance_blocked_by: activeRouteUnit_is_null_for_root_path
  dispatcher_file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  dispatcher_lines: 986-1016
  dispatcher_condition: activeSurface === "intro"

root_behavior_control_evidence:
  source_files: true
  routing_configuration: true
  registry_records: false
  fallback_defaults: true

registry_records_evidence:
  active_for_root: false
  measures_registry_row_for_root: null
  governed_paths:
    - path: /ai-operations-assessment
      registry_key: ai_operations_assessment_landing
    - path: /structural-drift
      registry_key: structural_drift_landing
    - path: /undrifted
      registry_key: undrifted_publication_landing
    - path: /map-integrity-governance
      registry_key: map_integrity_governance_landing
  encounter_records_active_for_threshold:
    - table: measures_encounter_def
      encounter_key: ai_isnt_broken_intro
      provides: introCopy
    - table: measures_encounter_def
      encounter_key: evaluate_structure_path
      provides: pathChoiceCopy

exact_files_requiring_change:
  minimal_option_a:
    - file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      location: line 159
      change: return "path_choice" instead of return "intro"
  registry_governed_option_b:
    - file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
      location: lines 124-130
      change: add "/" entry to ROUTE_UNIT_KEYS mapped to "root_landing"

exact_records_requiring_change:
  minimal_option_a: none
  registry_governed_option_b:
    - table: measures_registry
      action: insert
      registry_key: root_landing
      is_active: true
      metadata_runtime_surface: path_choice

acceptance_matrix:
  root_runtime_architecture_source_identified: true
  active_root_component_identified: true
  active_root_registry_record_identified: true
  cause_of_threshold_crystal_architecture_identified: true
  defect_location_identified: true
  exact_files_requiring_change_identified: true
  exact_records_requiring_change_identified: true
  minimal_correction_path_identified: true

Audit of root runtime architecture is complete. Source inspection confirmed that "/" renders the legacy threshold/crystal split-path architecture because `ROUTE_UNIT_KEYS` has no entry for "/" (MeasuresRegistryRuntimeRegistered.tsx lines 124-130), causing `activeRouteUnit` to resolve null at line 339 and blocking registry governance (lines 349-358). The `initialSurface()` function (lines 153-160) returns `"intro"` as a hardcoded fallback, which the dispatcher at lines 986-1016 resolves to `RegisteredIntro` (RegisteredIntro.tsx) — a crystal-family, intro-layout-contract component. The approved Lapis landing (`RegisteredPathChoice`, data-material-family="lapis", data-layout-contract="transition_choice") exists at RegisteredPathChoice.tsx and is reachable only after user interaction with the threshold hero. The minimal correction is a single-line source change at MeasuresRegistryRuntimeRegistered.tsx:159 from `return "intro"` to `return "path_choice"`. No DB mutation, authority creation, checkout, payment, webhook, SRC binding, c3 key, permission, certification, DAO standing, Codexstone conversion, or Registry Certification standing was created during this audit.
