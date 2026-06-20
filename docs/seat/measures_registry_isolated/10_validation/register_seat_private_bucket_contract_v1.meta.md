---
document_type: register_seat_private_bucket_contract
authority_level: approved_storage_contract
system_scope: measures_registry_register_seat_bucket_contract
title: register_SEAT Private Bucket Contract v1
status: resolved_no_upload
version: v1
operator: op044
process_key: register_SEAT
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_approved_private_register_seat_bucket_contract_before_actual_manifest_upload_v1.meta.md
---

# register_SEAT Private Bucket Contract v1

contract:
  process_key: register_SEAT
  canonical_manifest_count: 46
  approved_bucket_name: measures-seed
  provider: supabase_storage
  bucket_exists: true
  write_access_available: true
  bucket_policy: private
  retrieval_model: signed_url
  upload_prefix: measures_registry/seat/register_SEAT/v1/
  public_exposure_allowed: false
  existing_objects_at_upload_prefix: 0
  reason: measures-seed is the existing private Supabase bucket aligned to source, seed, process, and reference material; the 46 canonical files are private source-reference transfer payloads, while measures-derived is reserved for derived output and the prior measures-registry target is public

bucket_candidates:
  - bucket_name: c3-field-media
    provider: supabase_storage
    exists: true
    public: true
    write_access_available: true
    read_access_model: public_url
    suitable_for_register_SEAT: false
    reason: public media bucket does not satisfy the private source-reference requirement
  - bucket_name: measures-derived
    provider: supabase_storage
    exists: true
    public: false
    write_access_available: true
    read_access_model: signed_url
    suitable_for_register_SEAT: false
    reason: private posture is valid but the bucket's derived-output semantics do not match canonical source-reference transfer payloads
  - bucket_name: measures-registry
    provider: supabase_storage
    exists: true
    public: true
    write_access_available: true
    read_access_model: public_url
    suitable_for_register_SEAT: false
    reason: public bucket has no seated contract permitting public exposure of register_SEAT source references
  - bucket_name: measures-seed
    provider: supabase_storage
    exists: true
    public: false
    write_access_available: true
    read_access_model: signed_url
    suitable_for_register_SEAT: true
    reason: existing private source, seed, process, and reference bucket matches the payload class and supports privileged write plus signed retrieval
  - bucket_name: pre-codex-exhibition
    provider: supabase_storage
    exists: true
    public: true
    write_access_available: true
    read_access_model: public_url
    suitable_for_register_SEAT: false
    reason: public exhibition scope is unrelated to private register_SEAT source references

evidence:
  storage_metadata_inspected_read_only: true
  live_bucket_count: 5
  service_role_storage_objects_insert_available: true
  service_role_storage_objects_select_available: true
  target_prefix_collision_count: 0
  old_estimate_retired_as_authority: true
  actual_manifest_created: true

boundary:
  bucket_upload_performed: false
  bucket_overwrite_performed: false
  bucket_move_performed: false
  bucket_delete_performed: false
  bucket_created: false
  live_DB_content_registration_performed: false
  MAP_payment_migration_performed: false
  authority_created: false
  git_commit_ready: true

This contract selects storage posture only. It creates no object, DB content record, runtime state, or authority.
