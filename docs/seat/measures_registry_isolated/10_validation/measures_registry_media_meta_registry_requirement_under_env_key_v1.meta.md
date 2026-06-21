---
document_type: validation_rule
authority_level: process_standing
system_scope: measures_codex
title: Measures Registry Media Meta Registry Requirement Under env_key v1
status: media_meta_required_before_upload
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_seat_upload_env_key_and_payload_density_rule_before_bucket_transfer_v1.meta.md
---

# Measures Registry Media Meta Registry Requirement Under env_key v1

standing:
  status: media_meta_required_before_upload
  env_key: measures_registry_seat_upload_env_key
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false
  public_copy_mutation_authorized: false

rule:
  media_files_are_package_records: true
  media_key_required: true
  media_meta_required: true
  filename_only_reference_blocked: true
  renderer_media_truth_blocked: true
  release_state_required_for_public_media: true
  chamber_directory_required_for_chamber_media: true

minimum_media_meta_fields:
  - env_key
  - media_key
  - file_name
  - source_path
  - bucket_path
  - media_type
  - format
  - placement_group
  - chamber_key
  - chamber_directory
  - surface_key
  - usage_scope
  - runtime_use
  - alt_text_or_accessibility_label
  - poster_required
  - poster_media_key
  - fallback_media_key
  - release_state
  - upload_allowed
  - public_allowed
  - dependencies
  - authority_source
  - created_by_oar
  - validated_by_oar1
  - notes

media_sets_to_inventory:
  obsidian_assessment_media:
    env_key: measures_registry_seat_upload_env_key
    chamber_key: obsidian
    chamber_directory: obsidian_directory
    expected_media:
      - ai_isnt_broken_landing.webp
      - obsidian_assessment_surface.webp
      - obsidian_contact_surface.webp
      - obsidian_eval_result_surface_visual_v1.webp
      - assessment_report_orientation.mp4
  lapis_undrifted_media:
    env_key: measures_registry_seat_upload_env_key
    chamber_key: lapis
    chamber_directory: lapis_directory
    expected_media:
      - undrifted_hero.mp4
      - undrifted_banner_website_social.webp
      - agents_with_keys.webp
      - fables_and_myths.webp
  marble_map_media:
    env_key: measures_registry_seat_upload_env_key
    chamber_key: marble
    chamber_directory: marble_directory
    expected_media:
      - marble_map_payment_scope_background.webp
  seo_social_media:
    env_key: measures_registry_seat_upload_env_key
    chamber_key: lapis
    chamber_directory: lapis_directory
    expected_media:
      - og.webp
      - undrifted_banner_website_social.webp

recommended_next_oar2:
  title: OAR2 - Seat Measures Registry Media Meta Registry Under env_key Before Upload v1
