---
document_type: register_seat_bucket_upload_validation
authority_level: live_bucket_upload_validation_evidence
system_scope: measures_registry_register_seat_bucket_upload
title: register_SEAT Bucket Upload Validation v1
status: completed_bucket_upload_confirmed
version: v1
operator: op044
process_key: register_SEAT
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_upload_actual_register_seat_manifest_contents_to_approved_bucket_before_live_db_content_registration_v1.meta.md
---

# register_SEAT Bucket Upload Validation v1

prior_attempt_preserved:
  status: stopped_no_upload
  source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_begin_register_seat_by_uploading_measures_registry_seat_contents_to_bucket_before_live_db_content_registration_v1.meta.md
  prior_expected_manifest_count: 89
  prior_exact_rows_resolved: 33
  prior_unresolved_baseline_rows: 56
  prior_files_uploaded_or_confirmed: 0
  prior_reason: exact_manifest_and_private_bucket_contract_were_unresolved_at_that_time
  superseded_by_current_actual_manifest_authority: true

validation:
  process_key: register_SEAT
  canonical_manifest_count: 46
  approved_bucket_name: measures-seed
  provider: supabase_storage
  bucket_policy: private
  retrieval_model: signed_url
  upload_prefix: measures_registry/seat/register_SEAT/v1/
  public_exposure_allowed: false
  target_prefix_collision_count: 0
  files_uploaded_or_confirmed: 46
  files_failed: 0
  final_prefix_object_count: 46
  all_uploaded_objects_checksum_confirmed_or_source_checksum_preserved: true
  all_uploaded_objects_signed_url_verified: true
  bucket_upload_completed: true
  bucket_upload_performed: true
  bucket_overwrite_performed: false
  bucket_move_performed: false
  bucket_delete_performed: false
  live_DB_content_registration_performed: false
  MAP_payment_migration_performed: false
  Stripe_activation_performed: false
  webhook_activation_performed: false
  checkout_activation_performed: false
  runtime_mutation_performed: false
  route_mutation_performed: false
  renderer_mutation_performed: false
  public_copy_mutation_performed: false
  authority_created: false
  SEAT_authority_created: false
  c3_key_created: false
  certification_created: false
  DAO_standing_created: false
  Codexstone_conversion_created: false
  Registry_Certification_created: false
  validation_matrix_created: true
  uploaded_object_manifest_created: true
  oar1_closeout_created: true

verification_basis:
  local_source_hashes_recomputed_before_upload: true
  live_storage_object_count_verified_after_upload: true
  every_object_retrieved_through_temporary_signed_url: true
  every_retrieved_sha256_equal_to_source_sha256: true
  temporary_signed_urls_persisted: false
  public_url_used: false
