---
document_type: validation_audit
authority_level: local_documentation
system_scope: measures_codex
title: Measures Registry SEAT Upload File Payload Density Audit v1
status: payload_density_audit_complete
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_strengthen_measures_registry_seat_upload_file_payload_density_before_bucket_transfer_v1.meta.md
density_rule: docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_upload_file_payload_density_rule_v1.meta.md
---

# Measures Registry SEAT Upload File Payload Density Audit v1

standing:
  status: payload_density_audit_complete
  bucket_upload_authorized_now: false

audit_scope:
  folders_checked:
    - docs/seat/measures_registry_isolated/00_index/
    - docs/seat/measures_registry_isolated/01_contracts/
    - docs/seat/measures_registry_isolated/02_encounters/
    - docs/seat/measures_registry_isolated/03_chamber_directories/
    - docs/seat/measures_registry_isolated/04_integrations/
    - docs/seat/measures_registry_isolated/05_automation/
    - docs/seat/measures_registry_isolated/06_runtime_surfaces/
    - docs/seat/measures_registry_isolated/07_media_assets/
    - docs/seat/measures_registry_isolated/08_mrm_contact_memory/
    - docs/seat/measures_registry_isolated/11_style_contracts/
    - docs/seat/measures_registry_isolated/12_directory_set_components/
  missing_package_folders:
    - docs/seat/measures_registry_isolated/00_index/
    - docs/seat/measures_registry_isolated/01_contracts/
    - docs/seat/measures_registry_isolated/02_encounters/
    - docs/seat/measures_registry_isolated/03_chamber_directories/
    - docs/seat/measures_registry_isolated/04_integrations/
    - docs/seat/measures_registry_isolated/05_automation/
    - docs/seat/measures_registry_isolated/06_runtime_surfaces/
    - docs/seat/measures_registry_isolated/07_media_assets/
    - docs/seat/measures_registry_isolated/08_mrm_contact_memory/
    - docs/seat/measures_registry_isolated/11_style_contracts/
  excluded_folders:
    - docs/seat/measures_registry_isolated/09_oar/
    - docs/seat/measures_registry_isolated/10_validation/

summary:
  total_files_reviewed: 47
  upload_ready_record_count: 0
  needs_payload_expansion_count: 46
  thin_governance_evidence_count: 0
  evidence_only_count: 0
  held_or_excluded_count: 1

field_presence_summary:
  all_reviewed_files_missing_bucket_path: true
  all_reviewed_files_missing_source_path: true
  all_reviewed_files_missing_placement_group: true
  all_reviewed_files_missing_authority_source: true
  all_reviewed_files_missing_upload_allowed: true
  all_reviewed_files_missing_validated_by_oar1: true
  upload_manifest_build_allowed_now: false
  bucket_upload_allowed_now: false

common_missing_transfer_fields:
  - source_path
  - bucket_path
  - placement_group
  - authority_source
  - current_or_held
  - upload_allowed
  - exclusion_status
  - runtime_use
  - dependencies
  - release_state
  - surface_or_directory_scope
  - evidence_class
  - created_by_oar
  - validated_by_oar1

audit_rows:
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_carryover_state_rule_record_v1.meta.md
    document_type: directory_set_component_record
    title: Assessment Carryover State Rule Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_carryover_surface_record_v1.meta.md
    document_type: directory_set_component_record
    title: Assessment Carryover Surface Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_contact_capture_record_v1.meta.md
    document_type: directory_set_requirement_record
    title: Assessment Contact Capture Record v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_logic_record.meta.md
    document_type: directory_set_component_record
    title: Assessment Logic Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_orientation_media_map_record_v1.meta.md
    document_type: directory_set_component_record
    title: Assessment Orientation Media Map Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_orientation_surface_record_v1.meta.md
    document_type: directory_set_component_record
    title: Assessment Orientation Surface Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/c2_route_logic_record.meta.md
    document_type: directory_set_component_record
    title: C2 Route Logic Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_email_sendout_rules_v1.meta.md
    document_type: directory_set_requirement_record
    title: Contact Capture Email Sendout Rules v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_terminology_boundary_record_v1.meta.md
    document_type: directory_set_requirement_record
    title: Contact Capture Terminology Boundary Record v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_permission_scope_record.meta.md
    document_type: directory_set_component_record
    title: Contact Permission Scope Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/content_records_requirements_record.meta.md
    document_type: directory_set_component_record
    title: Content Records Requirements Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/dependency_state_record.meta.md
    document_type: directory_set_component_record
    title: Dependency State Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/email_dispatch_requirements_record.meta.md
    document_type: directory_set_component_record
    title: Email Dispatch Requirements Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/eyebrow_records.meta.md
    document_type: directory_set_component_record
    title: Eyebrow Records
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/launch_landing_pages_record.meta.md
    document_type: directory_set_requirement_record
    title: Launch Landing Pages Record
    status: required_before_SEAT_bucket_upload
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/launch_style_profile_set_record.meta.md
    document_type: directory_set_requirement_record
    title: Launch Style Profile Set Record
    status: required_before_SEAT_bucket_upload
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/launch_surface_order_record.meta.md
    document_type: directory_set_component_record
    title: Launch Surface Order Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/marble_c3_7s_disclosure_record_v1.meta.md
    document_type: directory_set_component_record
    title: Marble c3 7s Disclosure Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/marble_map_payment_scope_dynamic_fields_record_v1.meta.md
    document_type: directory_set_component_record
    title: Marble MAP Payment Scope Dynamic Fields Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/marble_map_payment_scope_footer_disclosure_record_v1.meta.md
    document_type: directory_set_component_record
    title: Marble MAP Payment Scope Footer Disclosure Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/marble_map_payment_scope_layout_record_v1.meta.md
    document_type: directory_set_component_record
    title: Marble MAP Payment Scope Layout Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/marble_map_payment_scope_media_map_record_v1.meta.md
    document_type: directory_set_component_record
    title: Marble MAP Payment Scope Media Map Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/marble_map_payment_scope_style_profile_record_v1.meta.md
    document_type: directory_set_component_record
    title: Marble MAP Payment Scope Style Profile Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/media_mapping_requirements_record.meta.md
    document_type: directory_set_component_record
    title: Media Mapping Requirements Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_contact_capture_style_profile_record_v1.meta.md
    document_type: directory_set_component_record
    title: Obsidian Assessment Contact Capture Style Profile Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_landing_style_profile_record_v1.meta.md
    document_type: directory_set_component_record
    title: Obsidian Assessment Landing Style Profile Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_media_map_record_v1.meta.md
    document_type: directory_set_component_record
    title: Obsidian Assessment Media Map Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_question_style_profile_record_v1.meta.md
    document_type: directory_set_component_record
    title: Obsidian Assessment Question Style Profile Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_style_profile_set_record_v1.meta.md
    document_type: directory_set_component_record
    title: Obsidian Assessment Style Profile Set Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_surface_sequence_record_v1.meta.md
    document_type: directory_set_component_record
    title: Obsidian Assessment Surface Sequence Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/payment_of_scope_hold_boundary.meta.md
    document_type: directory_set_component_record
    title: Payment Of Scope Hold Boundary
    status: held_with_explicit_boundary
    density_class: held_or_excluded
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: hold_or_exclude
    notes: explicit payment boundary remains held and is not current upload authority
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/release_state_record.meta.md
    document_type: directory_set_component_record
    title: Release State Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/seo_metadata_records.meta.md
    document_type: directory_set_requirement_record
    title: SEO Metadata Records
    status: required_before_SEAT_bucket_upload
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/set_ready_directory_record.meta.md
    document_type: directory_set_component_record
    title: Set Ready Directory Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/social_campaign_asset_route_map_record_v1.meta.md
    document_type: directory_set_component_record
    title: Social Campaign Asset Route Map Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/social_campaign_copy_cadence_and_claim_boundary_record_v1.meta.md
    document_type: directory_set_component_record
    title: Social Campaign Copy Cadence and Claim Boundary Record v1
    status: seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/social_campaign_record.meta.md
    document_type: directory_set_requirement_record
    title: Social Campaign Record
    status: required_before_SEAT_bucket_upload
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/social_media_account_presence_record_v1.meta.md
    document_type: directory_set_component_record
    title: Social Media Account Presence Record v1
    status: seated_candidate_pending_operator_review
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/survey_intake_record.meta.md
    document_type: directory_set_component_record
    title: Survey Intake Record
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/terminology_replacement_map.meta.md
    document_type: directory_set_component_record
    title: Terminology Replacement Map
    status: component_seated
    density_class: needs_payload_expansion
    missing_fields: [record_key, source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_article_and_paragraph_integration_record.meta.md
    document_type: directory_set_requirement_record
    title: unDrifted Article and Paragraph Integration Record
    status: required_before_SEAT_bucket_upload
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_9x16_style_profile_record_v1.meta.md
    document_type: directory_set_requirement_record
    title: unDrifted Lapis 9x16 Style Profile Record v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_article_set_and_paragraph_publication_path_record_v1.meta.md
    document_type: directory_set_addendum_requirement_record
    title: unDrifted Lapis Encounter Article Set and Paragraph Publication Path Addendum v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1.meta.md
    document_type: directory_set_addendum_requirement_record
    title: unDrifted Lapis Encounter Article Set and Paragraph Publication Path Addendum v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_icon_registry_usage_record_v1.meta.md
    document_type: directory_set_requirement_record
    title: unDrifted Lapis Icon Registry Usage Record v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_leadership_contact_capture_record_v1.meta.md
    document_type: directory_set_requirement_record
    title: unDrifted Lapis Leadership Contact Capture Record v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_media_map_record_v1.meta.md
    document_type: directory_set_requirement_record
    title: unDrifted Lapis Media Map Record v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_video_to_headline_behavior_record_v1.meta.md
    document_type: directory_set_requirement_record
    title: unDrifted Lapis Video to Headline Behavior Record v1
    status: required_before_revised_SEAT_upload_manifest_confirmation
    density_class: needs_payload_expansion
    missing_fields: [source_path, bucket_path, placement_group, authority_source, current_or_held, upload_allowed, exclusion_status, runtime_use, dependencies, release_state, surface_or_directory_scope, evidence_class, created_by_oar, validated_by_oar1]
    correction_needed: true
    recommended_action: expand_payload
