---
document_type: oar1
authority_level: audit_closeout
document_scope: root_runtime_authority_audit
title: OAR1 — Root Authority Isolation Failure Audit v1
status: completed_audit_root_authority_identified_deployed_runtime_verification_held
version: v1
operator: op044
system: measures_registry
process_key: root_authority_isolation_failure_audit
source_oar2: docs/oar/measures_registry/oar2_root_authority_isolation_failure_audit_v1.meta.md
audit_date: 2026-06-21
---

# OAR1 — Root Authority Isolation Failure Audit v1

## ROOT AUTHORITY CONCLUSION

classification: B_hardcoded_src_authority

primary_finding: `/` is selected by `initialSurface()` in `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`; it is not resolved from a root registry unit, root manifest, redirect record, or seated transition.

why_root_does_not_resolve_to_undrifted: `/undrifted` is present only in static non-root route maps. There is no `/` route-unit binding and no root redirect lookup. The default branch of `initialSurface()` owns root encounter selection.

## 1. RUNTIME ROUTE AUTHORITY

runtime_entry:
  app_file: src/app/App.tsx
  measures_host_dispatch: static_host_match_returns_MeasuresRegistryRuntime
  renderer_file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  root_route_definition: implicit_default_branch_of_initialSurface
  redirect_behavior: none_for_root
  root_hardcoded_in_src: true

route_maps:
  ROUTE_SURFACE_ALIASES:
    /ai-operations-assessment: ai_operations_assessment_landing
    /structural-drift: structural_drift_dispatches
    /undrifted: structural_drift_dispatches
    /map-integrity-governance: map_integrity_governance
  root_entry_present: false
  PUBLIC_ROUTE_BY_SURFACE_root_entry_present: false
  ROUTE_UNIT_KEYS_root_entry_present: false
  REGISTRY_ROUTE_UNITS_root_entry_present: false

## 2. RENDERER AUTHORITY

pushed_commit_runtime:
  commit: 6dfb86b113676bbce9980cc073666d1578e04ada
  active_route_key: /
  active_surface: intro
  active_encounter_key: ai_isnt_broken_intro
  active_manifest_key: none
  selection_source: source_fallback_initialSurface

current_worktree_runtime:
  committed: false
  active_route_key: /
  active_surface: path_choice
  active_encounter_key: evaluate_structure_path
  active_manifest_key: none
  selection_source: source_fallback_initialSurface
  exact_uncommitted_change: return_intro_changed_to_return_path_choice

renderer_content_boundary:
  encounter_content_query: public.measures_encounter_def
  queried_encounter_set_source: REGISTERED_ENCOUNTER_KEYS_static_set
  root_content_for_intro: DB_row_ai_isnt_broken_intro_when_selected
  root_content_for_path_choice: DB_row_evaluate_structure_path_when_selected
  root_encounter_selection_DB_driven: false
  root_encounter_content_DB_driven_after_selection: true
  fallback_driven_authority: true

## 3. DATABASE AUTHORITY

root_registry_binding:
  measures_registry_root_unit_queried: false
  root_manifest_key: none
  root_release_state_read: false
  root_transition_record_read: false
  DB_can_select_root_under_current_renderer: false

non_root_registry_bindings:
  /ai-operations-assessment: ai_operations_assessment_landing
  /structural-drift: structural_drift_landing
  /undrifted: undrifted_publication_landing
  /map-integrity-governance: map_integrity_governance_landing

DB_resolution_conclusion:
  resolves_root_to_undrifted: false
  resolves_root_to_threshold_split: false
  reason: no_root_DB_authority_read_exists
  actual_root_selection_owner: src_initialSurface

live_DB_row_read:
  performed: false
  required_to_identify_root_controller: false
  reason: renderer_has_no_root_DB_lookup_path

## 4. BUILD AUTHORITY

repository:
  branch: measures
  HEAD: 6dfb86b113676bbce9980cc073666d1578e04ada
  origin_measures: 6dfb86b113676bbce9980cc073666d1578e04ada
  commit_timestamp: 2026-06-21T14:37:08-05:00
  commit_subject: "Fix: remove stale Measures Registry surface routing"

local_build:
  asset: dist-registry/assets/index-DkKEgoYW.js
  root_html_asset_binding: /assets/index-DkKEgoYW.js
  build_source_matches_HEAD: true
  built_root_default: intro

deployed_runtime:
  expected_source_ref: 6dfb86b113676bbce9980cc073666d1578e04ada
  active_cloudflare_deployment_identifier: unverified
  active_cloudflare_commit_reference: unverified
  active_cloudflare_deployment_timestamp: unverified
  production_asset_marker_verified: false
  hold_reason: public_verification_blocked_by_execution_approval_usage_limit
  deployed_truth_inferred_from_push: false

## 5. FALLBACK AUDIT

findings:
  - key: App_registry_host_dispatch
    file: src/app/App.tsx
    standing: static_host_dispatch
    effect: measuresregistry_host_always_returns_registered_runtime
  - key: REGISTRY_METADATA
    file: src/app/App.tsx
    standing: static_root_metadata_fallback
    effect: root_metadata_does_not_query_registry
  - key: REGISTRY_ROUTE_UNITS
    file: src/app/App.tsx
    standing: static_route_map_without_root
    effect: only_named_non_root_routes_query_governed_metadata
  - key: initialSurface
    file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    standing: hardcoded_root_encounter_authority
    pushed_default: intro
    current_worktree_default: path_choice
  - key: ROUTE_SURFACE_ALIASES
    file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    standing: static_route_map_without_root
  - key: PUBLIC_ROUTE_BY_SURFACE
    file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    standing: static_history_route_map_without_root
  - key: ROUTE_UNIT_KEYS
    file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    standing: static_manifest_map_without_root
  - key: SURFACE_QUERY
    file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    standing: static_surface_to_encounter_map
  - key: RegisteredIntro_threshold_records
    file: src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
    standing: DB_content_after_source_selected_surface
    effect: threshold_copy_comes_from_evaluate_structure_path_metadata_but_root_selection_does_not

hardcoded_threshold_content:
  old_literal_threshold_body_present: false
  threshold_copy_source: measures_encounter_def_evaluate_structure_path_metadata
  threshold_surface_selection_source: src_initialSurface

## 6. AUTHORITY TRACE

actual_root_authority_source: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx_initialSurface
actual_root_encounter_source_pushed: ai_isnt_broken_intro_selected_by_src_then_content_read_from_DB
actual_root_encounter_source_current_worktree: evaluate_structure_path_selected_by_src_then_content_read_from_DB
actual_runtime_source: src/app/App.tsx_static_host_dispatch_to_MeasuresRegistryRuntimeRegistered
actual_deployment_source: origin_measures_commit_6dfb86b_expected_but_Cloudflare_active_identifier_unverified

authority_failure:
  Codex_DB_controls_root: false
  Field_schema_exposes_root_binding_to_renderer: false
  Measures_registry_root_manifest_resolved: false
  renderer_owns_root_choice: true
  incomplete_SEAT_runtime_replacement: true

## BOUNDARY CONFIRMATION

audit_only: true
DB_mutation_performed: false
runtime_mutation_performed: false
route_mutation_performed: false
content_mutation_performed: false
style_mutation_performed: false
media_mutation_performed: false
deployment_performed: false
authority_created: false

## RECOMMENDED NEXT ACTION

Hold repair pending a separate OAR2. That OAR2 must define and seat one explicit root manifest/route binding, expose its release and transition state through the registry schema, and make the renderer resolve `/` from that seated record without a source fallback. It must also reconcile the uncommitted `path_choice` root override before implementation. This audit does not authorize that repair.
