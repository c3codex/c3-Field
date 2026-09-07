---
document_type: validation_rule
authority_level: local_documentation
system_scope: measures_codex
title: Measures Registry SEAT Upload File Payload Density Rule v1
status: active_pre_upload_density_rule
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_strengthen_measures_registry_seat_upload_file_payload_density_before_bucket_transfer_v1.meta.md
---

# Measures Registry SEAT Upload File Payload Density Rule v1

standing:
  status: active_pre_upload_density_rule
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false
  public_copy_mutation_authorized: false

rule:
  no_count_without_rows: true
  no_manifest_without_paths: true
  no_upload_without_exact_bucket_targets: true
  no_transfer_from_representative_examples: true
  no_upload_from_thin_governance_evidence: true
  no_runtime_implementation_from_record_titles_alone: true

minimum_required_fields:
  - record_key
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
  - notes

density_classes:
  upload_ready_record:
    meaning: complete enough for bucket transfer and later validation without inference
  needs_payload_expansion:
    meaning: valid record but missing fields required for upload authority
  thin_governance_evidence:
    meaning: procedural decision, count, category, or representative sample only
  evidence_only:
    meaning: OAR, validation, or process evidence, not package content
  held_or_excluded:
    meaning: valid but not part of current upload surface

boundary:
  bucket_upload_authorized_now: false
  bucket_access_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  renderer_mutation_authorized: false
