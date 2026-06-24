---
document_type: media_disposition_matrix_completion
authority_level: closeout_evidence
system_scope: measures_codex
title: Measures Registry 12-Row Media Disposition Matrix Row-Level Exclusion Reasons v1
status: row_level_exclusion_reasons_added
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_add_row_level_exclusion_reasons_to_held_and_excluded_measures_registry_media_rows_v1.meta.md
---

standing:
  status: row_level_exclusion_reasons_added
  source_matrix: docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_before_manifest_build_v1.meta.md
  held_media_count: 3
  excluded_media_count: 3
  held_rows_with_row_level_hold_reason: 3
  excluded_rows_with_row_level_exclusion_reason: 3
  send_card_ready_after_validation: true
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false
  bucket_write_allowed: false

held_media_rows:
  - media_key: obsidian_assessment_surface
    file_name: obsidian_assessment_surface.webp
    media_group: obsidian_assessment
    surface_mapping: assessment_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    hold_reason: exact_expected_object_absent_and_visual_v1_alternate_not_governing_without_mapping_confirmation
    required_next_action: confirm_authoritative_mapping_to_obsidian_assessment_surface_visual_v1.webp_or_supply_exact_source
  - media_key: obsidian_contact_surface
    file_name: obsidian_contact_surface.webp
    media_group: obsidian_assessment
    surface_mapping: contact_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    hold_reason: exact_expected_object_absent_and_visual_v1_alternate_not_governing_without_mapping_confirmation
    required_next_action: confirm_authoritative_mapping_to_obsidian_contact_surface_visual_v1.webp_or_supply_exact_source
  - media_key: marble_map_payment_scope_background
    file_name: marble_map_payment_scope_background.webp
    media_group: marble_map
    surface_mapping: payment_scope_surface
    runtime_scope: marble_payment_scope_background
    release_state: held_until_payment_scope_surface_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_source_authority
    hold_reason: exact_expected_object_absent_and_nearby_marble_objects_do_not_establish_payment_scope_mapping
    required_next_action: supply_exact_source_or_seat_authoritative_mapping_to_an_existing_marble_object

excluded_media_rows:
  - media_key: obsidian_assessment_surface
    file_name: obsidian_assessment_surface.webp
    media_group: obsidian_assessment
    surface_mapping: assessment_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    exclusion_reason: excluded_from_current_manifest_because_the_exact_assessment_surface_object_is_absent_and_the_observed_visual_v1_alternate_has_no_governing_mapping; exclusion_affects_assessment_surface_in_assessment_surface_media; exclusion_is_temporary_until_exact_source_or_mapping_authority_is_confirmed
    exclusion_scope: held_until_source_confirmed
    temporary_or_current_scope: temporary
    required_next_action: confirm_authoritative_mapping_to_obsidian_assessment_surface_visual_v1.webp_or_supply_exact_source
  - media_key: obsidian_contact_surface
    file_name: obsidian_contact_surface.webp
    media_group: obsidian_assessment
    surface_mapping: contact_surface
    runtime_scope: assessment_surface_media
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    exclusion_reason: excluded_from_current_manifest_because_the_exact_contact_surface_object_is_absent_and_the_observed_visual_v1_alternate_has_no_governing_mapping; exclusion_affects_contact_surface_in_assessment_surface_media; exclusion_is_temporary_until_exact_source_or_mapping_authority_is_confirmed
    exclusion_scope: held_until_source_confirmed
    temporary_or_current_scope: temporary
    required_next_action: confirm_authoritative_mapping_to_obsidian_contact_surface_visual_v1.webp_or_supply_exact_source
  - media_key: marble_map_payment_scope_background
    file_name: marble_map_payment_scope_background.webp
    media_group: marble_map
    surface_mapping: payment_scope_surface
    runtime_scope: marble_payment_scope_background
    release_state: held_until_payment_scope_surface_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_source_authority
    exclusion_reason: excluded_from_current_manifest_because_the_exact_payment_scope_background_object_is_absent_and_nearby_marble_objects_do_not_establish_authority; exclusion_affects_payment_scope_surface_in_marble_payment_scope_background; exclusion_is_the_governed_current_scope_until_the_source_or_surface_mapping_is_confirmed
    exclusion_scope: held_until_surface_confirmed
    temporary_or_current_scope: governed_current_scope
    required_next_action: supply_exact_source_or_seat_authoritative_mapping_to_an_existing_marble_object

summary:
  row_level_exclusion_reason_completion: true
  send_card_can_be_retried: true
  manifest_build_still_blocked_until_send_card_resolution: true
