---
document_type: validation_report
authority_level: upload_exclusion_manifest
system_scope: measures_codex
title: Measures Registry SEAT Upload Exclusion Manifest v1
status: completed_exclusion_manifest
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
source_manifest: docs/seat/measures_registry_isolated/10_validation/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
mutation_scope:
  bucket_upload: false
  bucket_delete: false
  bucket_overwrite: false
  bucket_move: false
  database: false
  policies: false
  rows: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
---

# Measures Registry SEAT Upload Exclusion Manifest v1

## Exclusion Summary

```yaml
upload_authorized_now: false
excluded_hold_docs_count: 41
appendix_docs_held_count: 34
unknown_docs_excluded_count: 7
active_drift_risk_docs_excluded_count: 14
appendix_docs_included_count: 0
operator_review_required: true
```

## Held Appendix Docs

```yaml
appendix_docs_held:
  count: 34
  reason: possible process/reference appendices require explicit operator confirmation before inclusion
  representative_rows:
    - local_path: docs/seat/measures_registry/01_contracts/paragraph_integrated_surface_contract.meta.md
      exclusion_class: process_reference
      reason: process/reference contract; not included without appendix confirmation
      upload_authorized_now: false
    - local_path: docs/seat/measures_registry/01_contracts/src_registry_circuit_reference.meta.md
      exclusion_class: process_reference
      reason: source circuit reference; not included without appendix confirmation
      upload_authorized_now: false
    - local_path: docs/seat/measures_registry/07_media_assets/our_story_media_manifest.meta.md
      exclusion_class: process_reference
      reason: media manifest reference; not a confirmed current upload source
      upload_authorized_now: false
```

## Hold Do Not Upload Docs

```yaml
hold_do_not_upload_docs:
  count: 41
  reason: excluded set includes intel, backoffice, protected, historical, working, unknown, or drift-risk docs
  representative_rows:
    - local_path: docs/seat/measures_registry/00_index/dependency_map.meta.md
      exclusion_class: held_backoffice_setup
      reason: backoffice/admin/future operating setup signal
      upload_authorized_now: false
    - local_path: docs/seat/measures_registry/04_integrations/facebook_social_surface.meta.md
      exclusion_class: intel_capture
      reason: social/media observation, not launch-selected current upload source
      upload_authorized_now: false
    - local_path: docs/seat/measures_registry/03_chamber_directories/marble_directory_held.meta.md
      exclusion_class: protected_measures_of_inanna_reference
      reason: protected material reference outside current Measures Registry SEAT upload authority
      upload_authorized_now: false
    - local_path: docs/seat/measures_registry/01_contracts/undrifted_lapis_encounter_contract.meta.md
      exclusion_class: working_candidate_not_seeded
      reason: working candidate not promoted by this OAR
      upload_authorized_now: false
```

## Category Exclusions

```yaml
category_exclusions:
  intel_docs_excluded:
    local_count: 62
    bucket_count: 27
    reason: intel/source capture remains preserved but not uploaded to current SEAT folder
  process_docs_excluded:
    local_count: 500
    bucket_count: 44
    reason: process references remain preserved; possible appendix set requires operator confirmation
  backoffice_docs_excluded:
    local_count: 87
    bucket_count: 3
    reason: held c3 backoffice/admin/legal/operations material is not current launch upload material
  protected_docs_excluded:
    protected_c3_system_reference: 77
    protected_measures_of_inanna_reference: 233
    reason: protected references require separate authority before inclusion
  unknown_docs_excluded:
    count: 7
    reason: unknown docs remain excluded unless operator later promotes them
  active_drift_risk_docs_excluded:
    count: 14
    reason: active drift risk docs remain excluded from upload and current-reference use
```

## Boundary Confirmation

```yaml
boundary_confirmation:
  bucket_upload_performed: false
  bucket_delete_performed: false
  bucket_overwrite_performed: false
  bucket_move_performed: false
  local_document_content_mutated: false
  local_docs_deleted: false
  local_docs_moved: false
  database_mutation: false
  policy_mutation: false
  row_mutation: false
  rls_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
```
