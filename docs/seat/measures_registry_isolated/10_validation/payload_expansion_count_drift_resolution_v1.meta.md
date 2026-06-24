---
document_type: count_drift_resolution
authority_level: operator_approved_resolution
system_scope: measures_codex
title: Payload Expansion Count Drift Resolution v1
status: resolved
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_measures_registry_payload_records_under_approved_operator_dispositions_v1.meta.md
---

# Payload Expansion Count Drift Resolution v1

standing:
  status: resolved
  expected_count: 46
  observed_count: 47
  operator_disposition: require_Cody_trace_of_added_row

trace_result:
  extra_row_identified: true
  extra_row_key: undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1
  extra_row_file_stem: undrifted_lapis_article_set_and_paragraph_publication_path_record_v1
  extra_row_source_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_article_set_and_paragraph_publication_path_record_v1.meta.md
  extra_row_classification:
    value: duplicate
    allowed:
      - valid
      - duplicate
      - hold
  explanation: later-created manifest-resolution copy duplicates the earlier addendum record key and content authority
  silent_acceptance_blocked: true

resolution_effect:
  if_valid: include_in_corrected_payload_records
  if_duplicate: merge_or_mark_legacy_trace
  if_hold: exclude_from_upload_ready_scope
  applied_result: duplicate_sources_merged_into_new_canonical_record
  corrected_governing_record_count: 46

