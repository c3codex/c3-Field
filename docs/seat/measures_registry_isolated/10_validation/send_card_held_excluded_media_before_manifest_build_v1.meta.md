---
document_type: send_card
authority_level: operator_action_request
system_scope: measures_codex
title: send_card - Held and Excluded Media Before Manifest Build v1
status: awaiting_operator_action
version: v1
visibility: public_facing
---

standing:
  status: awaiting_operator_action
  send_card_type: constraint_agreement_resolution_delivery
  public_facing: true
  exact_manifest_build_allowed: false
  operator_action_required: true
  resolution_return_to_sender_required: true

delivery:
  send_card_id: send_card_held_excluded_media_before_manifest_build_v1
  source_event: media_resolution_before_manifest_build
  sender: Measures_Registry_system_process
  recipient: operator
  actor: Chazz

constraint:
  label: Held / Excluded Media Before Manifest Build
  problem: Three media rows are held and three media rows are excluded.
  why_it_matters: Held or excluded media changes what crosses the exact manifest threshold.
  affected_scope:
    - exact_manifest_build
    - SEAT_upload_package
    - media_manifest_readiness
  threshold_blocked: exact_manifest_build

agreement:
  action_needed_from_operator: Review and accept, revise, reclassify, or block the held/excluded media disposition before manifest build.
  options:
    - accept_held_excluded_media_disposition
    - request_media_resolution_rework
    - reclassify_media_rows
    - block_manifest_build
  required_before:
    - exact_manifest_build
    - manifest_threshold_crossing
  authority_boundary: operator_decision_required_because_manifest_contents_are_affected

resolution:
  return_to_sender_required: true
  return_message_depends_on_operator_decision: true
  if_accept:
    next_system_action: manifest_build_may_be_requested_by_next_OAR2
  if_rework:
    next_system_action: reroute_media_resolution
  if_reclassify:
    next_system_action: update_media_disposition_and_revalidate
  if_block:
    next_system_action: hold_manifest_build

held_media_rows:
  - media_key: obsidian_assessment_surface
    file_name: obsidian_assessment_surface.webp
    media_group: obsidian_assessment
    surface_mapping: assessment_surface
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    hold_reason: exact_expected_object_absent_and_visual_v1_alternate_not_governing_without_mapping_confirmation
    required_next_action: confirm_authoritative_mapping_to_obsidian_assessment_surface_visual_v1.webp_or_supply_exact_source
  - media_key: obsidian_contact_surface
    file_name: obsidian_contact_surface.webp
    media_group: obsidian_assessment
    surface_mapping: contact_surface
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    hold_reason: exact_expected_object_absent_and_visual_v1_alternate_not_governing_without_mapping_confirmation
    required_next_action: confirm_authoritative_mapping_to_obsidian_contact_surface_visual_v1.webp_or_supply_exact_source
  - media_key: marble_map_payment_scope_background
    file_name: marble_map_payment_scope_background.webp
    media_group: marble_map
    surface_mapping: payment_scope_surface
    release_state: held_until_payment_scope_surface_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_source_authority
    hold_reason: exact_expected_object_absent_and_nearby_marble_objects_do_not_establish_payment_scope_mapping
    required_next_action: supply_exact_source_or_seat_authoritative_mapping_to_an_existing_marble_object

excluded_media_rows:
  - media_key: obsidian_assessment_surface
    file_name: obsidian_assessment_surface.webp
    media_group: obsidian_assessment
    surface_mapping: assessment_surface
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    exclusion_reason: excluded_from_current_manifest_because_the_exact_assessment_surface_object_is_absent_and_the_observed_visual_v1_alternate_has_no_governing_mapping; exclusion_affects_assessment_surface_in_assessment_surface_media; exclusion_is_temporary_until_exact_source_or_mapping_authority_is_confirmed
    required_next_action: confirm_authoritative_mapping_to_obsidian_assessment_surface_visual_v1.webp_or_supply_exact_source
  - media_key: obsidian_contact_surface
    file_name: obsidian_contact_surface.webp
    media_group: obsidian_assessment
    surface_mapping: contact_surface
    release_state: candidate_until_source_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_mapping_authority
    exclusion_reason: excluded_from_current_manifest_because_the_exact_contact_surface_object_is_absent_and_the_observed_visual_v1_alternate_has_no_governing_mapping; exclusion_affects_contact_surface_in_assessment_surface_media; exclusion_is_temporary_until_exact_source_or_mapping_authority_is_confirmed
    required_next_action: confirm_authoritative_mapping_to_obsidian_contact_surface_visual_v1.webp_or_supply_exact_source
  - media_key: marble_map_payment_scope_background
    file_name: marble_map_payment_scope_background.webp
    media_group: marble_map
    surface_mapping: payment_scope_surface
    release_state: held_until_payment_scope_surface_confirmed
    upload_disposition: held_excluded_from_manifest_pending_exact_source_authority
    exclusion_reason: excluded_from_current_manifest_because_the_exact_payment_scope_background_object_is_absent_and_nearby_marble_objects_do_not_establish_authority; exclusion_affects_payment_scope_surface_in_marble_payment_scope_background; exclusion_is_the_governed_current_scope_until_the_source_or_surface_mapping_is_confirmed
    required_next_action: supply_exact_source_or_seat_authoritative_mapping_to_an_existing_marble_object
