---
document_type: media_disposition_matrix
authority_level: read_only_resolution_evidence
system_scope: measures_codex
title: Measures Registry 12-Row Media Disposition Matrix Before Manifest Build v1
status: media_rows_resolved_or_partially_blocked
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md
---

standing:
  status: media_rows_resolved_or_partially_blocked
  unresolved_media_start_count: 12
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false

media_rows:
  - row_number: 1
    media_key: obsidian_ai_isnt_broken_landing
    file_name: ai_isnt_broken_landing.webp
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-registry
      object_path: ai_isnt_broken_landing.webp
    target_storage_bucket: measures-registry
    target_bucket_object_path: ai_isnt_broken_landing.webp
    content_type: image/webp
    media_group: obsidian_assessment
    surface_mapping: landing_or_assessment_intro
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact live object match; no upload authorized or required
  - row_number: 2
    media_key: obsidian_assessment_surface
    file_name: obsidian_assessment_surface.webp
    current_source_path: unresolved
    confirmed_existing_bucket_object:
      value: false
      bucket_name: measures-registry
      object_path: null
    target_storage_bucket: measures-registry
    target_bucket_object_path: obsidian_assessment_surface.webp
    content_type: image/webp
    media_group: obsidian_assessment
    surface_mapping: assessment_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    upload_ready: false
    hold_reason: exact_expected_object_absent_and_visual_v1_alternate_not_governing_without_mapping_confirmation
    missing_fields:
      - source_path_or_confirmed_existing_bucket_object
    required_next_action: confirm_authoritative_mapping_to_obsidian_assessment_surface_visual_v1.webp_or_supply_exact_source
    notes: possible alternate observed but no fallback authority was inferred
  - row_number: 3
    media_key: obsidian_contact_surface
    file_name: obsidian_contact_surface.webp
    current_source_path: unresolved
    confirmed_existing_bucket_object:
      value: false
      bucket_name: measures-registry
      object_path: null
    target_storage_bucket: measures-registry
    target_bucket_object_path: obsidian_contact_surface.webp
    content_type: image/webp
    media_group: obsidian_assessment
    surface_mapping: contact_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    upload_ready: false
    hold_reason: exact_expected_object_absent_and_visual_v1_alternate_not_governing_without_mapping_confirmation
    missing_fields:
      - source_path_or_confirmed_existing_bucket_object
    required_next_action: confirm_authoritative_mapping_to_obsidian_contact_surface_visual_v1.webp_or_supply_exact_source
    notes: possible alternate observed but no fallback authority was inferred
  - row_number: 4
    media_key: obsidian_eval_result_surface_visual_v1
    file_name: obsidian_eval_result_surface_visual_v1.webp
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-registry
      object_path: obsidian_eval_result_surface_visual_v1.webp
    target_storage_bucket: measures-registry
    target_bucket_object_path: obsidian_eval_result_surface_visual_v1.webp
    content_type: image/webp
    media_group: obsidian_assessment
    surface_mapping: result_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact live object match; no upload authorized or required
  - row_number: 5
    media_key: obsidian_assessment_report_orientation
    file_name: assessment_report_orientation.mp4
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-media
      object_path: assessment_report_orientation.mp4
    target_storage_bucket: measures-media
    target_bucket_object_path: assessment_report_orientation.mp4
    content_type: video/mp4
    media_group: obsidian_assessment
    surface_mapping: assessment_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact live object match; no upload authorized or required
  - row_number: 6
    media_key: lapis_undrifted_hero
    file_name: undrifted_hero.mp4
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-media
      object_path: undrifted_hero.mp4
    target_storage_bucket: measures-media
    target_bucket_object_path: undrifted_hero.mp4
    content_type: video/mp4
    media_group: lapis_undrifted
    surface_mapping: unDrifted_lapis_encounter
    runtime_scope: lapis_publication_social_media
    release_state: candidate_until_source_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact live object match; no upload authorized or required
  - row_number: 7
    media_key: lapis_undrifted_banner_website_social
    file_name: undrifted_banner_website_social.webp
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-registry
      object_path: undrifted_banner_website_social.webp
    target_storage_bucket: measures-registry
    target_bucket_object_path: undrifted_banner_website_social.webp
    content_type: image/webp
    media_group: lapis_undrifted
    surface_mapping: social_or_publication_context
    runtime_scope: lapis_publication_social_media
    release_state: candidate_until_source_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact object retained as a distinct lapis governed context
  - row_number: 8
    media_key: lapis_agents_with_keys
    file_name: agents_with_keys.webp
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-registry
      object_path: agents_with_keys.webp
    target_storage_bucket: measures-registry
    target_bucket_object_path: agents_with_keys.webp
    content_type: image/webp
    media_group: lapis_undrifted
    surface_mapping: publication_reference
    runtime_scope: lapis_publication_social_media
    release_state: candidate_until_source_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact live object match; no upload authorized or required
  - row_number: 9
    media_key: lapis_fables_and_myths
    file_name: fables_and_myths.webp
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-registry
      object_path: fables_and_myths.webp
    target_storage_bucket: measures-registry
    target_bucket_object_path: fables_and_myths.webp
    content_type: image/webp
    media_group: lapis_undrifted
    surface_mapping: publication_reference
    runtime_scope: lapis_publication_social_media
    release_state: candidate_until_source_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact live object match; no upload authorized or required
  - row_number: 10
    media_key: marble_map_payment_scope_background
    file_name: marble_map_payment_scope_background.webp
    current_source_path: unresolved
    confirmed_existing_bucket_object:
      value: false
      bucket_name: measures-registry
      object_path: null
    target_storage_bucket: measures-registry
    target_bucket_object_path: marble_map_payment_scope_background.webp
    content_type: image/webp
    media_group: marble_map
    surface_mapping: payment_scope_surface
    runtime_scope: marble_payment_scope_background
    release_state: held_until_payment_scope_surface_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_source_authority
    upload_ready: false
    hold_reason: exact_expected_object_absent_and_nearby_marble_objects_do_not_establish_payment_scope_mapping
    missing_fields:
      - source_path_or_confirmed_existing_bucket_object
    required_next_action: supply_exact_source_or_seat_authoritative_mapping_to_an_existing_marble_object
    notes: nearby marble assets remain non-governing for this payment-scope row
  - row_number: 11
    media_key: lapis_seo_og
    file_name: og.webp
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-registry
      object_path: measures_registry/pre_codex_exhibition/images/og.webp
    target_storage_bucket: measures-registry
    target_bucket_object_path: measures_registry/pre_codex_exhibition/images/og.webp
    content_type: image/webp
    media_group: seo_social
    surface_mapping: Open_Graph
    runtime_scope: og_social_preview
    release_state: candidate_until_social_route_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact filename match at a nested live object path
  - row_number: 12
    media_key: lapis_seo_undrifted_banner_website_social
    file_name: undrifted_banner_website_social.webp
    current_source_path: confirmed_existing_bucket_object
    confirmed_existing_bucket_object:
      value: true
      bucket_name: measures-registry
      object_path: undrifted_banner_website_social.webp
    target_storage_bucket: measures-registry
    target_bucket_object_path: undrifted_banner_website_social.webp
    content_type: image/webp
    media_group: seo_social
    surface_mapping: website_banner
    runtime_scope: og_social_preview
    release_state: candidate_until_social_route_confirmed
    upload_disposition: already_present_no_upload_required
    upload_ready: true
    hold_reason: null
    required_next_action: include_existing_object_reference_in_exact_manifest
    notes: exact object retained as a distinct SEO and social governed context

summary:
  total_media_rows_reviewed: 12
  upload_ready_count: 9
  already_present_count: 9
  held_count: 3
  excluded_count: 3
  unresolved_after_review_count: 0
  all_held_media_rows_have_hold_reason: true
  all_excluded_media_rows_have_governed_exclusion_reason: true
  ready_for_exact_manifest_build_oar2: true
