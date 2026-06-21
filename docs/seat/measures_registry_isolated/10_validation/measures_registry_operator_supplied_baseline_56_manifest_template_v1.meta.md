---
document_type: operator_manifest_template
authority_level: awaiting_operator_selection
system_scope: measures_codex
title: Measures Registry Operator Supplied Baseline 56 Manifest Template v1
status: awaiting_operator_selection_or_direct_supply
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_operator_supply_measures_registry_baseline_56_file_manifest_v1.meta.md
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

# Measures Registry Operator Supplied Baseline 56 Manifest Template v1

standing:
  status: awaiting_operator_selection_or_direct_supply
  bucket_upload_authorized_now: false
  operator_confirmation_required: true

instructions:
  direct_supply_allowed: true
  candidate_review_selection_allowed: true
  exact_required_rows: 56

required_row_shape:
  - row_number
  - local_path
  - bucket_path
  - placement_group
  - source_set
  - file_exists
  - upload_allowed
  - held_exclusion_check
  - operator_selected
  - notes

baseline_rows:
  - row_number: 1
    local_path:
    bucket_path:
    placement_group:
    source_set: operator_supplied_baseline_56
    file_exists:
    upload_allowed:
    held_exclusion_check:
    operator_selected:
    notes:

validation_rule:
  exact_56_required: true
  all_local_paths_required: true
  all_bucket_paths_required: true
  all_placement_groups_required: true
  no_held_files_allowed: true
  no_execution_files_allowed: true
  no_33_addition_duplicates_allowed: true
