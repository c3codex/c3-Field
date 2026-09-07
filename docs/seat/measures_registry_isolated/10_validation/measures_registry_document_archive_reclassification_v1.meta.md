---
document_type: validation_report
authority_level: documentation_archive_reclassification_evidence
system_scope: measures_codex
title: Measures Registry Document Archive Reclassification v1
status: completed_report_only
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_reclassify_measures_registry_documentation_archive_into_seat_upload_intel_process_and_held_backoffice_sets_v1.meta.md
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_documentation_source_set_and_seeded_reference_scope_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  bucket_delete: false
  bucket_upload: false
  bucket_overwrite: false
  local_docs_mutation: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# Measures Registry Document Archive Reclassification v1

## Source Baseline

```yaml
prior_counts_from_source_oar1:
  local_docs_classified_count: 1698
  bucket_docs_classified_count: 76
  seeded_reference_count: 233
  unseeded_working_doc_count: 270
  current_SEAT_source_count: 17
  current_evidence_doc_count: 39
  stale_superseded_local_doc_count: 0
  stale_bucket_candidate_count: 73
  upload_candidate_count: 131
  unknown_review_count: 543
  protected_doc_count: 3
source_reports_read:
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_local_documentation_source_set_isolation_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_supabase_bucket_document_audit_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_folder_future_upload_candidate_manifest_v1.meta.md
source_reports_mutated: false
```

## Corrected Local Scan

```yaml
corrected_local_scan:
  scan_basis: path_and_content_heuristic_scan_over_current_doc_like_files_in_source_roots
  current_scan_doc_like_files_classified: 1093
  note: prior OAR1 count remains the upload-decision baseline; current scan excludes non-doc-like binaries and includes current filesystem standing after prior report creation
  corrected_classification_counts:
    current_SEAT_source: 17
    current_SEAT_evidence: 44
    seeded_reference: 5
    intel_capture: 62
    process_reference: 500
    held_backoffice_setup: 87
    protected_c3_system_reference: 77
    protected_measures_of_inanna_reference: 233
    historical_trace: 21
    legacy_or_superseded_route: 17
    working_candidate_not_seeded: 10
    active_drift_risk: 14
    unknown_requires_operator_review: 6
```

## Reclassification Meaning

```yaml
reclassification_meaning:
  intel_capture:
    upload_to_SEAT_folder: false
    preserve: true
    reason: source intelligence, capture, session observation, analysis, or working source material
  process_reference:
    upload_to_SEAT_folder: false_unless_operator_confirms_appendix
    preserve: true
    reason: OAR lifecycle, transfer, validation, process, schema, or handoff reference
  held_backoffice_setup:
    upload_to_SEAT_folder: false
    active_current_launch: false
    preserve: true
    reason: admin, operations, wallet, CRM, payment, or future backoffice setup signal
  protected_c3_system_reference:
    upload_to_SEAT_folder: false_unless_separately_authorized
    preserve: true
  protected_measures_of_inanna_reference:
    upload_to_SEAT_folder: false_unless_separately_authorized
    preserve: true
  historical_trace:
    upload_to_SEAT_folder: false_by_default
    preserve: true
  active_drift_risk:
    upload_to_SEAT_folder: false
    requires_operator_review: true
  unknown_requires_operator_review:
    upload_to_SEAT_folder: false
```

## Representative Local Rows

```yaml
representative_local_rows:
  current_SEAT_source:
    - local_path: docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
      reason: current isolated SEAT launch surface matrix
    - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/dependency_state_record.meta.md
      reason: current isolated directory-set source
  current_SEAT_evidence:
    - local_path: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
      reason: current policy disposition closeout
    - local_path: docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
      reason: current exact-row catalog RPC evidence
  intel_capture:
    - local_path: docs/_source/codex/dao_codex_declaration.meta.md
      reason: source capture / working source material
    - local_path: docs/_source/oar/session/oar_session_present_state_coherence_op044_2026.meta.md
      reason: session observation and captured context
  process_reference:
    - local_path: docs/oar/process/oar_lifecycle.meta.md
      reason: OAR lifecycle/process rule
    - local_path: docs/_source/measures-seed/process_pre_insert_registry_confirmation_v1.meta.md
      reason: process pre-insert confirmation reference
  held_backoffice_setup:
    - local_path: docs/oar/measures_interoperability/oar1_c3_key_nft_contract_setup_v1.meta.md
      reason: future c3 key/backoffice setup signal
    - local_path: docs/_source/process/frontend_encounter_alignment_contract.meta.md
      reason: internal operating setup signal
  protected_c3_system_reference:
    - local_path: docs/_source/field/field_definition_chamber_of_epithets_v1.meta.md
      reason: protected c3 Field/system reference
  protected_measures_of_inanna_reference:
    - local_path: docs/_source/field/field_definition_crystal_temple_v1.meta.md
      reason: protected Inanna/exhibition reference outside current Measures Registry upload
  historical_trace:
    - local_path: docs/oar/measures_registry/oar1_about_page_surface_v2_codex_binding.meta.md
      reason: historical Measures Registry OAR trace
  legacy_or_superseded_route:
    - local_path: docs/_source/carryover/session_16_carryover.meta.md
      reason: legacy/carryover trace
  active_drift_risk:
    - local_path: docs/oar/measures_registry/oar1_build_coherence_reserve_seat_v1.meta.md
      reason: contains blocked reserve/standing language; do not treat as current upload source
  unknown_requires_operator_review:
    - local_path: docs/seat/measures_registry_isolated/current_runtime_surface_set.meta.md
      reason: no safe corrected class from path/content scan
```

## Reduced Upload Baseline

```yaml
reduced_upload_baseline:
  prior_upload_candidate_count: 131
  baseline_rule: prior 131 equals current isolated source/evidence set plus docs/seat/measures_registry candidate set
  definite_SEAT_upload_candidate_count: 56
  possible_SEAT_appendix_candidate_count: 34
  hold_do_not_upload_count: 41
  current_scan_note: current filesystem scan sees 136 comparable candidates because five post-baseline OAR/report artifacts now exist; upload reduction preserves the prior OAR1 baseline of 131
```

## Upload Candidate Reclassification

```yaml
upload_candidate_reclassification:
  definite_SEAT_upload_candidate:
    disposition: held_for_operator_confirmation
    upload_authorized_now: false
    representative_rows:
      - local_path: docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
        prior_classification: current_SEAT_source
        corrected_classification: current_SEAT_source
        upload_group: definite_SEAT_upload_candidate
        reason: current isolated SEAT review matrix
        requires_operator_confirmation: true
        upload_authorized_now: false
      - local_path: docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
        prior_classification: current_policy_evidence
        corrected_classification: current_SEAT_evidence
        upload_group: definite_SEAT_upload_candidate
        reason: current read-only catalog RPC evidence
        requires_operator_confirmation: true
        upload_authorized_now: false
      - local_path: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
        prior_classification: current_policy_evidence
        corrected_classification: current_SEAT_evidence
        upload_group: definite_SEAT_upload_candidate
        reason: current policy disposition closeout
        requires_operator_confirmation: true
        upload_authorized_now: false
  possible_SEAT_appendix_candidate:
    disposition: held_for_operator_confirmation
    upload_authorized_now: false
    representative_rows:
      - local_path: docs/seat/measures_registry/01_contracts/paragraph_integrated_surface_contract.meta.md
        prior_classification: upload_candidate_after_review
        corrected_classification: process_reference
        upload_group: possible_SEAT_appendix_candidate
        reason: may support review only as process/reference appendix
        requires_operator_confirmation: true
        upload_authorized_now: false
      - local_path: docs/seat/measures_registry/07_media_assets/our_story_media_manifest.meta.md
        prior_classification: upload_candidate_after_review
        corrected_classification: process_reference
        upload_group: possible_SEAT_appendix_candidate
        reason: media manifest reference, not current authority by default
        requires_operator_confirmation: true
        upload_authorized_now: false
  hold_do_not_upload:
    disposition: preserve_but_exclude_from_current_SEAT_upload
    upload_authorized_now: false
    representative_rows:
      - local_path: docs/seat/measures_registry/00_index/dependency_map.meta.md
        prior_classification: upload_candidate_after_review
        corrected_classification: held_backoffice_setup
        upload_group: hold_do_not_upload
        reason: backoffice/admin/future operating setup signal
        requires_operator_confirmation: true
        upload_authorized_now: false
      - local_path: docs/seat/measures_registry/04_integrations/facebook_social_surface.meta.md
        prior_classification: upload_candidate_after_review
        corrected_classification: intel_capture
        upload_group: hold_do_not_upload
        reason: social/media observation and campaign intelligence, not launch-selected SEAT source
        requires_operator_confirmation: true
        upload_authorized_now: false
      - local_path: docs/seat/measures_registry/01_contracts/undrifted_lapis_encounter_contract.meta.md
        prior_classification: upload_candidate_after_review
        corrected_classification: working_candidate_not_seeded
        upload_group: hold_do_not_upload
        reason: working package candidate not promoted by this OAR
        requires_operator_confirmation: true
        upload_authorized_now: false
```

## Operator Decisions Required

```yaml
operator_decisions_required:
  - confirm whether the 56 definite candidates become the SEAT upload bundle
  - confirm whether any of the 34 process/reference candidates are needed as appendices
  - keep 41 held candidates excluded unless separately promoted
  - review 14 active_drift_risk local docs before any future reference use
  - review 6 unknown local docs before any future upload inclusion
  - preserve intel, process, protected, and backoffice material without treating it as stale-by-default
```

## Boundary Confirmation

```yaml
boundary_confirmation:
  local_document_content_mutated: false
  local_docs_deleted: false
  local_docs_moved: false
  bucket_delete_performed: false
  bucket_upload_performed: false
  bucket_overwrite_performed: false
  bucket_move_performed: false
  database_mutation: false
  policy_mutation: false
  row_mutation: false
  rls_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  seat_folder_submitted: false
  launch_activated: false
  payment_activated: false
```
