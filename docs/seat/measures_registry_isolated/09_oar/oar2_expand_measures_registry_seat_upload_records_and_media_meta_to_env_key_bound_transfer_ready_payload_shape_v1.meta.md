---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Expand Measures Registry SEAT Upload Records and Media Meta To env_key Bound Transfer Ready Payload Shape v1
status: proposed
version: v1
operator: op044
priority: prepare_bucket_upload_by_expanding_records_and_media_meta_before_manifest_build
source_payload_density_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_strengthen_measures_registry_seat_upload_file_payload_density_before_bucket_transfer_v1.meta.md
source_env_key_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_seat_upload_env_key_and_payload_density_rule_before_bucket_transfer_v1.meta.md
mutation_scope:
  local_docs_mutation: true
  env_key_assignment_documentation: true
  media_meta_documentation: true
  bucket_upload: false
  bucket_access: false
  bucket_delete: false
  bucket_overwrite: false
  bucket_move: false
  database: false
  policies: false
  rows: false
  rls: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
  payment_activation: false
  paragraph_publish: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  email_send: false
---

# OAR2 - Expand Measures Registry SEAT Upload Records and Media Meta To env_key Bound Transfer Ready Payload Shape v1

## OBSERVED

The Measures Registry SEAT upload preparation is blocked before bucket transfer.

The payload density OAR1 reported:

- total files reviewed: 47
- upload ready record count: 0
- needs payload expansion count: 46
- held or excluded count: 1
- upload manifest build allowed now: false
- bucket upload allowed now: false

The blockers showed that reviewed package records do not contain required transfer fields:

- source_path
- bucket_path
- placement_group
- authority_source
- upload_allowed
- validated_by_oar1

The operator also corrected that package records and media assets must be bound to an env_key before transfer.

The media addendum requires media_meta before any media upload or renderer use.

Current preparation order is:

1. env_key and payload density rule
2. media_meta registry
3. expand package records
4. build exact manifest
5. validate manifest
6. bucket upload by separate OAR2

This OAR2 performs steps 2 and 3 only.

## ALIGNED

This OAR2 expands Measures Registry SEAT upload records into env_key-bound transfer-ready payload shape.

This OAR2 also creates media_meta records for expected Measures Registry media assets.

This OAR2 may create local documentation records only.

This OAR2 does not upload to bucket.

This OAR2 does not inspect bucket state.

This OAR2 does not mutate DB, policies, rows, RLS, runtime, routes, renderer, public copy, payment, social, Buffer, Paragraph, or email.

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

The env_key for this package is:

measures_registry_seat_upload_env_key

The package is not runtime active.

The package is not DB seated by this OAR2.

The package is not route active by this OAR2.

The package is not public-copy active by this OAR2.

## REQUIRED TRANSFER-READY RECORD SHAPE

Every transfer-ready package record must include:

env_key:
record_key:
source_path:
bucket_path:
placement_group:
authority_source:
current_or_held:
upload_allowed:
exclusion_status:
runtime_use:
dependencies:
release_state:
surface_or_directory_scope:
evidence_class:
created_by_oar:
validated_by_oar1:
notes:

## REQUIRED MEDIA_META SHAPE

Every uploadable media asset must include:

env_key:
media_key:
file_name:
source_path:
bucket_path:
media_type:
format:
placement_group:
chamber_key:
chamber_directory:
surface_key:
usage_scope:
runtime_use:
alt_text_or_accessibility_label:
poster_required:
poster_media_key:
fallback_media_key:
release_state:
upload_allowed:
public_allowed:
dependencies:
authority_source:
created_by_oar:
validated_by_oar1:
notes:

## EXPECTED MEDIA SETS

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

## ROUTED

1. Read payload density OAR1.

Read:

docs/seat/measures_registry_isolated/09_oar/oar1_strengthen_measures_registry_seat_upload_file_payload_density_before_bucket_transfer_v1.meta.md

Confirm:

status: completed_payload_expansion_required
total_files_reviewed: 47
upload_ready_record_count: 0
needs_payload_expansion_count: 46
upload_manifest_build_allowed_now: false
bucket_upload_allowed_now: false

If missing or unexpected, continue but record missing_or_unexpected_payload_density_oar1_warning.

2. Read env_key and media_meta rule source.

Read:

docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_seat_upload_env_key_and_payload_density_rule_before_bucket_transfer_v1.meta.md

Confirm the OAR2 contains:

- env_key assignment rule
- payload density with env_key
- media_meta addendum

If the OAR2 file is missing or does not include the media_meta addendum, continue but record missing_media_meta_addendum_warning.

3. Ensure package folders exist.

Create missing folders if absent:

docs/seat/measures_registry_isolated/00_index/
docs/seat/measures_registry_isolated/01_records/
docs/seat/measures_registry_isolated/02_encounters/
docs/seat/measures_registry_isolated/03_chamber_directories/
docs/seat/measures_registry_isolated/04_integrations/
docs/seat/measures_registry_isolated/05_automation/
docs/seat/measures_registry_isolated/06_runtime_surfaces/
docs/seat/measures_registry_isolated/07_media_assets/
docs/seat/measures_registry_isolated/08_mrm_contact_memory/
docs/seat/measures_registry_isolated/11_style_profiles/
docs/seat/measures_registry_isolated/12_directory_set_components/

Do not move existing files unless explicitly required by this OAR2.

This OAR2 may create package expansion records inside the appropriate folders, but must preserve existing source files.

4. Expand existing thin records into transfer-ready package records.

Read the expansion worklist:

docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_upload_payload_expansion_worklist_v1.meta.md

For every record in records_to_expand, create or update an expanded transfer-ready companion record.

Do not overwrite the original thin source file.

Companion naming pattern:

docs/seat/measures_registry_isolated/01_records/expanded_<original_file_stem>_transfer_payload_v1.meta.md

If the source file belongs more properly to a specific folder, Cody may place the expanded record in:

- 02_encounters
- 03_chamber_directories
- 04_integrations
- 05_automation
- 06_runtime_surfaces
- 07_media_assets
- 08_mrm_contact_memory
- 11_style_profiles
- 12_directory_set_components

Each expanded companion record must include:

env_key: measures_registry_seat_upload_env_key
record_key:
source_path:
bucket_path:
placement_group:
authority_source:
current_or_held:
upload_allowed:
exclusion_status:
runtime_use:
dependencies:
release_state:
surface_or_directory_scope:
evidence_class:
created_by_oar:
validated_by_oar1:
notes:

If any required field cannot be resolved from existing source or obvious package placement, mark the field unresolved and set upload_allowed: false.

Do not invent runtime authority.

Do not invent release state.

Do not infer public use from filename alone.

5. Create media inventory.

Create:

docs/seat/measures_registry_isolated/07_media_assets/measures_registry_media_candidate_inventory_under_env_key_v1.meta.md

Required content:

standing:
  status: media_inventory_created
  env_key: measures_registry_seat_upload_env_key
  bucket_upload_authorized_now: false

media_candidates:
  - file_name: exact_file_name
    source_path: exact_or_unresolved
    proposed_bucket_path: exact_or_unresolved
    media_type: image_or_video_or_audio_or_poster_or_og_image_or_favicon
    format: file_extension
    media_set: obsidian_assessment_or_lapis_undrifted_or_marble_map_or_seo_social
    chamber_key: obsidian_or_lapis_or_marble
    chamber_directory: directory_key
    expected_surface_key: exact_or_unresolved
    file_exists: true_or_false
    inventory_status: found_or_missing_or_unresolved

6. Create media_meta records.

Create:

docs/seat/measures_registry_isolated/07_media_assets/measures_registry_media_meta_registry_under_env_key_v1.meta.md

Required content:

standing:
  status: media_meta_registry_created_or_blocked
  env_key: measures_registry_seat_upload_env_key
  bucket_upload_authorized_now: false
  renderer_media_truth_authorized: false

media_meta_rows:
  - env_key: measures_registry_seat_upload_env_key
    media_key: stable_media_key
    file_name: exact_file_name
    source_path: exact_or_unresolved
    bucket_path: exact_or_unresolved
    media_type: image_or_video_or_audio_or_poster_or_og_image_or_favicon
    format: extension
    placement_group: seat/current/06_media_assets/
    chamber_key: obsidian_or_lapis_or_marble_or_lapis_for_seo
    chamber_directory: directory_key
    surface_key: exact_or_unresolved
    usage_scope: background_or_hero_video_or_social_preview_or_og_preview_or_assessment_visual_or_payment_scope_background
    runtime_use: allowed_or_held_or_unresolved
    alt_text_or_accessibility_label: text_or_unresolved
    poster_required: true_or_false
    poster_media_key: key_or_null_or_unresolved
    fallback_media_key: key_or_null_or_unresolved
    release_state: released_or_held_or_candidate_or_unresolved
    upload_allowed: true_or_false
    public_allowed: true_or_false
    dependencies:
      - list_or_empty
    authority_source: source_record_or_oar
    created_by_oar: docs/seat/measures_registry_isolated/09_oar/oar2_expand_measures_registry_seat_upload_records_and_media_meta_to_env_key_bound_transfer_ready_payload_shape_v1.meta.md
    validated_by_oar1: pending
    notes: optional

validation:
  all_media_have_media_key: true_or_false
  all_media_have_source_path: true_or_false
  all_media_have_bucket_path: true_or_false
  all_media_have_chamber_directory: true_or_false
  all_public_media_have_release_state: true_or_false
  all_runtime_media_have_surface_or_usage_scope: true_or_false
  media_ready_for_manifest: true_or_false

7. Create expanded payload manifest draft.

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_env_key_bound_transfer_ready_payload_manifest_draft_v1.meta.md

Required content:

standing:
  status: payload_manifest_draft_created_or_blocked
  env_key: measures_registry_seat_upload_env_key
  bucket_upload_authorized_now: false

payload_summary:
  expanded_package_records_count: integer
  media_meta_rows_count: integer
  unresolved_payload_records_count: integer
  upload_ready_records_count: integer
  upload_ready_media_count: integer

payload_rows:
  - env_key: measures_registry_seat_upload_env_key
    record_key: exact
    source_path: exact_or_unresolved
    bucket_path: exact_or_unresolved
    placement_group: exact_or_unresolved
    payload_type: package_record_or_media_meta
    upload_allowed: true_or_false
    unresolved_fields:
      - list_or_empty
    ready_for_manifest: true_or_false

8. Create expansion validation record.

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_env_key_bound_payload_expansion_validation_v1.meta.md

Required content:

standing:
  status: expansion_complete_or_expansion_blocked_or_operator_review_required
  bucket_upload_authorized_now: false
  manifest_build_authorized_now: true_or_false

validation_result:
  env_key: measures_registry_seat_upload_env_key
  expanded_payload_manifest_draft: docs/seat/measures_registry_isolated/10_validation/measures_registry_env_key_bound_transfer_ready_payload_manifest_draft_v1.meta.md
  media_inventory_path: docs/seat/measures_registry_isolated/07_media_assets/measures_registry_media_candidate_inventory_under_env_key_v1.meta.md
  media_meta_registry_path: docs/seat/measures_registry_isolated/07_media_assets/measures_registry_media_meta_registry_under_env_key_v1.meta.md
  expanded_package_records_count: integer
  media_meta_rows_count: integer
  unresolved_payload_records_count: integer
  upload_ready_records_count: integer
  upload_ready_media_count: integer
  all_payload_rows_have_env_key: true_or_false
  all_upload_ready_rows_have_source_path: true_or_false
  all_upload_ready_rows_have_bucket_path: true_or_false
  all_upload_ready_rows_have_placement_group: true_or_false
  all_media_have_media_key: true_or_false
  all_public_media_have_release_state: true_or_false
  ready_to_build_exact_upload_manifest: true_or_false

blocking_findings:
  rows:
    - list_or_empty

recommended_next_oar2_if_ready:
  title: OAR2 - Build Exact Measures Registry SEAT Upload Manifest From env_key Bound Payload Records v1

recommended_next_oar2_if_operator_review_required:
  title: OAR2 - Resolve Unclear Measures Registry Payload Expansion Fields Before Manifest Build v1

recommended_next_oar2_if_blocked:
  title: OAR2 - Reduce Measures Registry Upload Scope To Fully Resolved env_key Bound Records v1

9. Create OAR1 closeout.

Create:

docs/seat/measures_registry_isolated/09_oar/oar1_expand_measures_registry_seat_upload_records_and_media_meta_to_env_key_bound_transfer_ready_payload_shape_v1.meta.md

OAR1 must report:

- source OAR2 path
- payload density OAR1 path read
- env_key source OAR2 path read
- package folders created
- expanded package records count
- media inventory path
- media meta registry path
- media meta rows count
- expanded payload manifest draft path
- expansion validation path
- unresolved payload records count
- upload ready records count
- upload ready media count
- all payload rows have env_key true/false
- all upload ready rows have source_path true/false
- all upload ready rows have bucket_path true/false
- all upload ready rows have placement_group true/false
- all media have media_key true/false
- all public media have release_state true/false
- ready to build exact upload manifest true/false
- blockers if any
- no bucket upload confirmation
- no bucket access confirmation
- no bucket delete confirmation
- no bucket overwrite confirmation
- no bucket move confirmation
- no bucket policy mutation confirmation
- no DB mutation confirmation
- no RLS mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no payment activation confirmation
- no social posting confirmation
- no social scheduling confirmation
- no Buffer activation confirmation
- no Paragraph publishing confirmation
- no email send confirmation
- recommended next OAR2 title

Recommended next OAR2 title if ready:

OAR2 - Build Exact Measures Registry SEAT Upload Manifest From env_key Bound Payload Records v1

Recommended next OAR2 title if operator review required:

OAR2 - Resolve Unclear Measures Registry Payload Expansion Fields Before Manifest Build v1

Recommended next OAR2 title if blocked:

OAR2 - Reduce Measures Registry Upload Scope To Fully Resolved env_key Bound Records v1

## VALIDATION RETURN

Return:

- expansion status
- package folders created
- expanded package records count
- media inventory path
- media meta registry path
- media meta rows count
- expanded payload manifest draft path
- expansion validation path
- unresolved payload records count
- upload ready records count
- upload ready media count
- all payload rows have env_key true/false
- all upload ready rows have source_path true/false
- all upload ready rows have bucket_path true/false
- all upload ready rows have placement_group true/false
- all media have media_key true/false
- all public media have release_state true/false
- ready to build exact upload manifest true/false
- blockers
- recommended next OAR2 title
- OAR1 path

## CLOSE

This OAR2 prepares Measures Registry for bucket upload by expanding package records and media_meta into env_key-bound transfer-ready payload shape.

It does not upload.

It does not inspect bucket state.

It does not mutate bucket, DB, policies, runtime, routes, renderer, public copy, payment, social, Buffer, Paragraph, or email.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody expands env_key-bound payload records before exact manifest build.
