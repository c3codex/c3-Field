---
document_type: schema_alignment
authority_level: local_documentation
system_scope: measures_codex
title: Payload Expansion OAR1 Count Marker Schema Alignment v1
status: schema_aligned
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_align_measures_registry_payload_expansion_oar1_count_marker_schema_for_refined_boundary_resolution_v1.meta.md
---

# Payload Expansion OAR1 Count Marker Schema Alignment v1

standing:
  status: schema_aligned
  operator_approval_required: false
  Cody_flag_to_NotChazz_resolved: true
  payload_record_resolution_allowed_after_revised_gate: true
  manifest_build_allowed: false
  bucket_upload_allowed: false
  bucket_access_allowed: false

schema_alignment:
  incorrect_expected_markers:
    - expected_expansion_count
    - observed_expansion_row_count
  actual_governing_markers:
    source_summary_expected_expansion_count: 46
    observed_audit_expansion_row_count: 47
  corrected_gate:
    expected_count_marker: source_summary_expected_expansion_count
    observed_count_marker: observed_audit_expansion_row_count
