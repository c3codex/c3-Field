---
document_type: media_policy
authority_level: operator_approved
system_scope: measures_codex
title: Measures Registry Media Hold and Grouping Policy Before Manifest Build v1
status: operator_approved_policy
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_apply_operator_dispositions_to_measures_registry_payload_expansion_blockers_v1.meta.md
---

# Measures Registry Media Hold and Grouping Policy Before Manifest Build v1

standing:
  status: operator_approved_policy
  unresolved_media_policy: hold_missing_media_until_source_path_confirmed
  media_grouping_policy: split_by_obsidian_lapis_marble_seo_groups
  manifest_build_authorized: false
  bucket_upload_authorized: false

media_groups:
  obsidian_assessment:
    release_state: candidate_until_source_confirmed
    runtime_use: assessment_surface_media
  lapis_undrifted:
    release_state: candidate_until_source_confirmed
    runtime_use: lapis_publication_social_media
  marble_map:
    release_state: held_until_payment_scope_surface_confirmed
    runtime_use: marble_payment_scope_background
  seo_social:
    release_state: candidate_until_social_route_confirmed
    runtime_use: og_social_preview

blocked:
  - filename_only_media_truth
  - unresolved_media_upload_ready_status
  - missing_source_path_upload
  - missing_bucket_path_upload
  - missing_release_state_public_release
