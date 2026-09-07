---
document_type: validation_report
authority_level: local_documentation
system_scope: measures_codex
title: Measures Registry Social Campaign Accounts Assets Routes and Posting Boundary Validation v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_measures_registry_social_media_campaign_accounts_assets_routes_and_posting_boundary_v1.meta.md
---

# Measures Registry Social Campaign Accounts Assets Routes and Posting Boundary Validation v1

standing:
  status: social_campaign_confirmed_or_blocked
  social_posting_authorized_now: false
  social_scheduling_authorized_now: false
  buffer_activation_authorized_now: false
  paragraph_publish_authorized_now: false
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false

existing_social_campaign_record:
  path: docs/seat/measures_registry_isolated/12_directory_set_components/social_campaign_record.meta.md
  status: present

records_created:
  social_media_account_presence_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/social_media_account_presence_record_v1.meta.md
    exists: true

  social_campaign_asset_route_map_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/social_campaign_asset_route_map_record_v1.meta.md
    exists: true

  social_campaign_copy_cadence_and_claim_boundary_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/social_campaign_copy_cadence_and_claim_boundary_record_v1.meta.md
    exists: true

requirements_satisfied:
  social_accounts_recorded_for_review: true
  primary_assessment_route_confirmed: true
  undrifted_route_confirmed: true
  og_image_assignment_confirmed: true
  undrifted_banner_assignment_confirmed: true
  allowed_messages_seated: true
  blocked_claims_seated: true
  posting_boundary_preserved: true
  scheduling_boundary_preserved: true
  no_social_posting_now: true
  no_buffer_activation_now: true
  no_paragraph_publish_now: true

upload_manifest_update_required: true
prior_recommended_upload_count: 86
new_required_records_count: 3
recommended_upload_count_after_social_campaign_confirmation: 89

blocking_findings:
  rows: []
