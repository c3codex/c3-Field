---
document_type: validation_report
authority_level: content_class_isolation
system_scope: measures_codex
title: Measures Registry Baseline Candidate Content Class Isolation v1
status: baseline_candidate_pool_classified
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_baseline_upload_candidates_by_content_class_v1.meta.md
mutation_scope:
  local_docs_mutation: true
  bucket_upload: false
  bucket_access: false
  database: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
---

# Measures Registry Baseline Candidate Content Class Isolation v1

standing:
  status: baseline_candidate_pool_classified
  bucket_upload_authorized_now: false
  operator_selection_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false
  public_copy_mutation_authorized: false

source_evidence:
  candidate_review_table: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_baseline_56_candidate_review_table_v1.meta.md
  operator_template: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_supplied_baseline_56_manifest_template_v1.meta.md

classification_summary:
  total_candidate_rows: 67
  original_content_record_count: 0
  directory_set_component_count: 14
  source_manifest_count: 3
  validation_evidence_count: 6
  OAR_instruction_count: 17
  OAR_closeout_count: 16
  policy_security_evidence_count: 11
  recent_recovery_artifact_count: 0
  held_or_backoffice_count: 0
  excluded_from_baseline_count: 0
  eligible_for_operator_selection_count: 28
  ineligible_for_operator_selection_count: 39

candidate_classification_rows:
  - candidate_number: 1
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_document_undrifted_launch_landing_and_ai_operations_assessment_surface_structure_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar2_document_undrifted_launch_landing_and_ai_operations_assessment_surface_structure_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: 
    title: 
    status: 
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 2
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_document_undrifted_launch_landing_and_ai_operations_assessment_surface_structure_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar1_document_undrifted_launch_landing_and_ai_operations_assessment_surface_structure_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: 
    title: 
    status: completed_documentation_only
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 3
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_package_reviewed_measures_registry_launch_structure_reference_inputs_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar2_package_reviewed_measures_registry_launch_structure_reference_inputs_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: 
    title: 
    status: 
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 4
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_package_reviewed_measures_registry_launch_structure_reference_inputs_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar1_package_reviewed_measures_registry_launch_structure_reference_inputs_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: 
    title: 
    status: completed_documentation_only
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 5
    local_path: docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
    proposed_bucket_path: seat/current/01_source/seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: seat_review_matrix
    title: SEAT Review Matrix - Measures Registry Launch Surface Package v1
    status: draft_for_operator_review
    content_class: source_manifest
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: SEAT review matrix/source manifest candidate
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 6
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_create_seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
    proposed_bucket_path: seat/current/01_source/oar1_create_seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: oar1
    title: OAR1 - Create SEAT Review Matrix for Measures Registry Launch Surface Package v1
    status: completed
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 7
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_populate_seat_review_matrix_from_current_measures_registry_launch_evidence_v1.meta.md
    proposed_bucket_path: seat/current/01_source/oar2_populate_seat_review_matrix_from_current_measures_registry_launch_evidence_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: oar2
    title: OAR2 - Populate SEAT Review Matrix from Current Measures Registry Launch Evidence v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 8
    local_path: docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_populated_v1.meta.md
    proposed_bucket_path: seat/current/01_source/seat_review_matrix_measures_registry_launch_surface_package_populated_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: populated_seat_review_matrix
    title: SEAT Review Matrix - Measures Registry Launch Surface Package Populated v1
    status: populated_from_current_evidence
    content_class: source_manifest
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: SEAT review matrix/source manifest candidate
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 9
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_populate_seat_review_matrix_from_current_measures_registry_launch_evidence_v1.meta.md
    proposed_bucket_path: seat/current/01_source/oar1_populate_seat_review_matrix_from_current_measures_registry_launch_evidence_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: oar1
    title: OAR1 - Populate SEAT Review Matrix from Current Measures Registry Launch Evidence v1
    status: completed
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 10
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Enable RLS and Confirm Public Table Access Protection for Measures Codex v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 11
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Enable RLS and Confirm Public Table Access Protection for Measures Codex v1
    status: completed
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 12
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_create_seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
    proposed_bucket_path: seat/current/01_source/oar2_create_seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: oar2
    title: OAR2 — Create SEAT Review Matrix for Measures Registry Launch Surface Package v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 13
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: oar2
    title: OAR2 - Seat Missing Measures Registry Launch Components Required for Directory Set v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 14
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/launch_surface_order_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/launch_surface_order_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 15
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/set_ready_directory_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/set_ready_directory_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 16
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/terminology_replacement_map.meta.md
    proposed_bucket_path: seat/current/04_directory_set/terminology_replacement_map.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 17
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/eyebrow_records.meta.md
    proposed_bucket_path: seat/current/04_directory_set/eyebrow_records.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 18
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_logic_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/assessment_logic_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 19
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/c2_route_logic_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/c2_route_logic_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 20
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_permission_scope_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/contact_permission_scope_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 21
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/email_dispatch_requirements_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/email_dispatch_requirements_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 22
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/payment_of_scope_hold_boundary.meta.md
    proposed_bucket_path: seat/current/04_directory_set/payment_of_scope_hold_boundary.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: held_with_explicit_boundary
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 23
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/survey_intake_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/survey_intake_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 24
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/release_state_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/release_state_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 25
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/dependency_state_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/dependency_state_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 26
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/media_mapping_requirements_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/media_mapping_requirements_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 27
    local_path: docs/seat/measures_registry_isolated/12_directory_set_components/content_records_requirements_record.meta.md
    proposed_bucket_path: seat/current/04_directory_set/content_records_requirements_record.meta.md
    placement_group: seat/current/04_directory_set/
    document_type: directory_set_component_record
    title: 
    status: component_seated
    content_class: directory_set_component
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: original directory-set component from reduced baseline candidate pool
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 28
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar1_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: oar1
    title: OAR1 - Seat Missing Measures Registry Launch Components Required for Directory Set v1
    status: completed
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 29
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 30
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_recheck_seat_review_matrix_for_directory_set_readiness_v1.meta.md
    proposed_bucket_path: seat/current/01_source/oar2_recheck_seat_review_matrix_for_directory_set_readiness_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: oar2
    title: OAR2 - Recheck SEAT Review Matrix for Directory Set Readiness v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 31
    local_path: docs/seat/measures_registry_isolated/10_validation/supabase_public_policy_renderer_read_review_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/supabase_public_policy_renderer_read_review_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Supabase Public Policy Renderer Read Review v1
    status: completed_with_catalog_row_return_blocker
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 32
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1
    status: completed_with_catalog_row_return_blocker
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 33
    local_path: docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_directory_set_readiness_recheck_v1.meta.md
    proposed_bucket_path: seat/current/01_source/seat_review_matrix_directory_set_readiness_recheck_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: seat_review_matrix_recheck
    title: SEAT Review Matrix Directory Set Readiness Recheck v1
    status: recheck_completed
    content_class: source_manifest
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: SEAT review matrix/source manifest candidate
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 34
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_recheck_seat_review_matrix_for_directory_set_readiness_v1.meta.md
    proposed_bucket_path: seat/current/01_source/oar1_recheck_seat_review_matrix_for_directory_set_readiness_v1.meta.md
    placement_group: seat/current/01_source/
    document_type: oar1
    title: OAR1 - Recheck SEAT Review Matrix for Directory Set Readiness v1
    status: completed
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 35
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Isolate Measures Registry Current Runtime Tables and Policy Scope Before Supabase Policy Disposition v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 36
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_current_runtime_policy_scope_isolation_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/measures_registry_current_runtime_policy_scope_isolation_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: policy_scope_isolation_report
    title: Measures Registry Current Runtime Policy Scope Isolation v1
    status: current_policy_scope_isolated
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 37
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Isolate Measures Registry Current Runtime Tables and Policy Scope Before Supabase Policy Disposition v1
    status: completed
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 38
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Seat Measures Registry Database Isolation Scope for Public Policy Disposition v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 39
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_database_policy_scope_isolation_readback_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/measures_registry_database_policy_scope_isolation_readback_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Measures Registry Database Policy Scope Isolation Readback v1
    status: completed_with_catalog_policy_row_return_limited
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 40
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Seat Measures Registry Database Isolation Scope for Public Policy Disposition v1
    status: completed_with_catalog_policy_row_return_limited
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 41
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_exact_live_catalog_row_return_for_supabase_policy_disposition_review_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_resolve_exact_live_catalog_row_return_for_supabase_policy_disposition_review_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 42
    local_path: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_live_catalog_classification_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/supabase_policy_disposition_live_catalog_classification_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Supabase Policy Disposition Live Catalog Classification v1
    status: blocked_exact_live_catalog_rows_not_returned
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 43
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_exact_live_catalog_row_return_for_supabase_policy_disposition_review_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_resolve_exact_live_catalog_row_return_for_supabase_policy_disposition_review_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1
    status: blocked_exact_catalog_row_return_unresolved
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 44
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Repair Supabase SQL Row Return Access for Policy Review v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 45
    local_path: docs/seat/measures_registry_isolated/10_validation/supabase_sql_row_return_access_repair_validation_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/supabase_sql_row_return_access_repair_validation_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Supabase SQL Row Return Access Repair Validation v1
    status: blocked_no_non_mutating_exact_catalog_row_return_path
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 46
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Repair Supabase SQL Row Return Access for Policy Review v1
    status: blocked_no_non_mutating_exact_catalog_row_return_path
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 47
    local_path: docs/seat/measures_registry_isolated/10_validation/supabase_read_only_catalog_rpc_seating_validation_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/supabase_read_only_catalog_rpc_seating_validation_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Supabase Read-Only Catalog RPC Seating Validation v1
    status: completed_exact_catalog_rows_returned
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 48
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Authorize Read-Only Catalog RPC Seating for Supabase Policy Review v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 49
    local_path: docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/read_only_catalog_rpc_seating_validation_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Read Only Catalog RPC Seating Validation v1
    status: completed_exact_rows_returned
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 50
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Authorize Read-Only Catalog RPC Seating for Supabase Policy Review v1
    status: completed_exact_rows_returned
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 51
    local_path: docs/seat/measures_registry_isolated/10_validation/supabase_exact_live_policy_catalog_rows_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/supabase_exact_live_policy_catalog_rows_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Supabase Exact Live Policy Catalog Rows v1
    status: completed_exact_rows_returned
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 52
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar2_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar2
    title: OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 53
    local_path: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_before_readback_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/supabase_policy_disposition_before_readback_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Supabase Policy Disposition Before Readback v1
    status: completed_before_mutation
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 54
    local_path: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_after_readback_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/supabase_policy_disposition_after_readback_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Supabase Policy Disposition After Readback v1
    status: completed_policy_disposition_scope_only
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 55
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: oar1
    title: OAR1 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
    status: completed_with_remaining_review_blockers
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 56
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_documentation_source_set_and_seeded_reference_scope_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar2_isolate_measures_registry_documentation_source_set_and_seeded_reference_scope_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: oar2
    title: OAR2 - Isolate Measures Registry Documentation Source Set and Seeded Reference Scope v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 57
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_local_documentation_source_set_isolation_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/measures_registry_local_documentation_source_set_isolation_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: validation_report
    title: Measures Registry Local Documentation Source Set Isolation v1
    status: completed_report_only
    content_class: validation_evidence
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: validation or process evidence requires exclusion from baseline selection unless operator separately confirms
    exclusion_reason: validation/process evidence
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 58
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_supabase_bucket_document_audit_v1.meta.md
    proposed_bucket_path: seat/current/03_policy_security/measures_registry_supabase_bucket_document_audit_v1.meta.md
    placement_group: seat/current/03_policy_security/
    document_type: validation_report
    title: Measures Registry Supabase Bucket Document Audit v1
    status: completed_read_only
    content_class: policy_security_evidence
    baseline_eligibility:
      eligible_for_operator_selection: true
      eligibility_reason: policy/security evidence is an explicit placement group in the baseline package
    exclusion_reason: 
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 59
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_folder_future_upload_candidate_manifest_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/measures_registry_seat_folder_future_upload_candidate_manifest_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: validation_report
    title: Measures Registry SEAT Folder Future Upload Candidate Manifest v1
    status: proposed_manifest_upload_not_authorized
    content_class: validation_evidence
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: validation or process evidence requires exclusion from baseline selection unless operator separately confirms
    exclusion_reason: validation/process evidence
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 60
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_documentation_source_set_and_seeded_reference_scope_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar1_isolate_measures_registry_documentation_source_set_and_seeded_reference_scope_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: oar1
    title: OAR1 - Isolate Measures Registry Documentation Source Set and Seeded Reference Scope v1
    status: completed_report_only
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 61
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_reclassify_measures_registry_documentation_archive_into_seat_upload_intel_process_and_held_backoffice_sets_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar2_reclassify_measures_registry_documentation_archive_into_seat_upload_intel_process_and_held_backoffice_sets_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: oar2
    title: OAR2 - Reclassify Measures Registry Documentation Archive Into SEAT Upload, Intel, Process, and Held Backoffice Sets v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 62
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_document_archive_reclassification_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/measures_registry_document_archive_reclassification_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: validation_report
    title: Measures Registry Document Archive Reclassification v1
    status: completed_report_only
    content_class: validation_evidence
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: validation or process evidence requires exclusion from baseline selection unless operator separately confirms
    exclusion_reason: validation/process evidence
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 63
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_bucket_doc_reclassification_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/measures_registry_bucket_doc_reclassification_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: validation_report
    title: Measures Registry Bucket Doc Reclassification v1
    status: completed_read_only
    content_class: validation_evidence
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: validation or process evidence requires exclusion from baseline selection unless operator separately confirms
    exclusion_reason: validation/process evidence
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 64
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: validation_report
    title: Measures Registry Reduced SEAT Upload Candidate Manifest v1
    status: proposed_manifest_upload_not_authorized
    content_class: validation_evidence
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: validation or process evidence requires exclusion from baseline selection unless operator separately confirms
    exclusion_reason: validation/process evidence
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 65
    local_path: docs/seat/measures_registry_isolated/09_oar/oar1_reclassify_measures_registry_documentation_archive_into_seat_upload_intel_process_and_held_backoffice_sets_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar1_reclassify_measures_registry_documentation_archive_into_seat_upload_intel_process_and_held_backoffice_sets_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: oar1
    title: OAR1 - Reclassify Measures Registry Documentation Archive Into SEAT Upload, Intel, Process, and Held Backoffice Sets v1
    status: completed_report_only
    content_class: OAR_closeout
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR1 closeout is process evidence, not baseline package content
    exclusion_reason: OAR closeout file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 66
    local_path: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/oar2_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: oar2
    title: OAR2 - Confirm Reduced Measures Registry SEAT Upload Manifest and Bucket Placement Plan v1
    status: proposed
    content_class: OAR_instruction
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: OAR2 instruction file is process authority, not baseline package content
    exclusion_reason: OAR instruction file
    already_counted_in_33_additions: false
    operator_selection_left_blank: true  - candidate_number: 67
    local_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
    proposed_bucket_path: seat/current/02_evidence/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
    placement_group: seat/current/02_evidence/
    document_type: validation_report
    title: Measures Registry Confirmed Reduced SEAT Upload Manifest v1
    status: confirmed_manifest_upload_not_authorized
    content_class: validation_evidence
    baseline_eligibility:
      eligible_for_operator_selection: false
      eligibility_reason: validation or process evidence requires exclusion from baseline selection unless operator separately confirms
    exclusion_reason: validation/process evidence
    already_counted_in_33_additions: false
    operator_selection_left_blank: true
boundary_confirmation:
  bucket_upload_performed: false
  bucket_access_checked: false
  database_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
