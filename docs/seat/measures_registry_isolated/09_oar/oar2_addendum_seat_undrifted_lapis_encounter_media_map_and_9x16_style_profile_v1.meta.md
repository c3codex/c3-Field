---
document_type: oar2_addendum
authority_level: proposed
system_scope: measures_codex
title: OAR2 Addendum - Seat unDrifted Lapis Encounter Media Map and 9x16 Style Profile v1
status: proposed
version: v1
operator: op044
priority: launch_media_map_and_style_profile_before_revised_manifest
parent_oar2:
  - docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_undrifted_lapis_encounter_article_set_and_paragraph_publication_path_v1.meta.md
parent_oar1:
  - docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_article_set_and_paragraph_publication_path_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  bucket_delete: false
  bucket_upload: false
  bucket_overwrite: false
  bucket_move: false
  local_docs_mutation: false
  paragraph_publish: false
  paragraph_edit: false
  social_posting: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR2 Addendum - Seat unDrifted Lapis Encounter Media Map and 9x16 Style Profile v1

## OBSERVED

The unDrifted launch surface has been clarified as the Lapis encounter.

The operator confirmed the active media set:

- undrifted_hero.mp4
- undrifted_banner_website_social.webp
- agents_with_keys.webp
- fables_and_myths.webp
- measures_registry_logo.webp

The image media are already in the Supabase bucket.

The video media is also uploaded as:

- undrifted_hero.mp4

The social-first layout must be 9:16.

The surface must have no header.

The top-right corner must display:

- June 2026 · Issue 001

The 15-second hook video should load first on the page.

The headline must not block the viewport while the video plays.

After video completion, the headline state may replace or overlay the hero state.

The CTA button must say:

- Assess Your AI Environment

The following should be removed:

- Watch 15-sec hook button
- top navigation header

The articles for the Lapis encounter are:

- Agents with Keys
- Fables and Myths
- Measures Registry

Agents with Keys is currently unpublished and must be published later through Paragraph integration under separate OAR2 authorization.

Article cards must open onsite in the unDrifted surface as overlay/panel behavior.

Paragraph remains source/reference and controlled publication execution surface, not the primary article reading destination.

Icons should be governed semantic signals and should resolve from registry/media map, not be hardcoded directly into components.

## ALIGNED

This OAR2 addendum seats media-map and style-profile requirements only.

It may:

- create an unDrifted Lapis media-map requirement record
- create a 9:16 style-profile requirement record
- create an icon registry usage requirement record
- create a video-to-headline behavior requirement record
- create a validation report
- update revised manifest recommendation by adding these records
- write OAR1 evidence

It may not:

- upload bucket files
- overwrite bucket files
- move bucket files
- delete bucket files
- mutate DB rows
- mutate policies
- mutate runtime
- mutate renderer
- mutate routes
- mutate public copy
- publish Agents with Keys
- edit Paragraph
- post or schedule social
- activate launch
- activate payment
- claim SEAT completion
- claim SEAL standing
- claim Registry Standing
- assign c3 Key
- activate DAO participation
- activate c3 backoffice

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Renderer rule:

Media files may exist in storage, but runtime surfaces must resolve media through seated media-map records.

No component-owned media truth.

No direct component path authority.

No hardcoded icon authority.

## ROUTED

## 1. Confirm parent standing

Confirm these parent files exist if present:

docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_article_set_and_paragraph_publication_path_v1.meta.md

Confirm launch surface standing from parent OAR1:

- bucket upload authorized: false
- paragraph publishing authorized: false
- social posting authorized: false
- DB mutation authorized: false
- runtime mutation authorized: false
- recommended upload count after prior launch additions: 61
- if article addendum OAR1 exists, recommended upload count after addendum: 62

If parent addendum OAR1 is missing, do not fail this addendum. Record:

parent_article_addendum_oar1_verified: false
standing: media_style_addendum_can_still_be_seated_pending_article_addendum_closeout

## 2. Create media map requirement record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_media_map_record_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  upload_authorized_now: false
  runtime_mutation_authorized: false
  db_mutation_authorized: false

surface:
  surface_key: undrifted_lapis_encounter
  chamber_authority: lapis
  surface_type: relational_publication_encounter
  aspect_ratio: 9:16
  header: none

media_map:
  hero_video:
    media_key: undrifted_hero
    filename: undrifted_hero.mp4
    storage_provider: supabase_bucket
    bucket_status: operator_confirmed_uploaded
    role: initial_hero_video
    required_behavior:
      - load_first
      - play_before_headline_state
      - CTA_visible_during_video
      - headline_must_not_block_viewport
      - after_complete_reveal_or_replace_with_headline_state

  publication_banner:
    media_key: undrifted_banner_website_social
    filename: undrifted_banner_website_social.webp
    storage_provider: supabase_bucket
    bucket_status: operator_confirmed_uploaded
    role: publication_identity_banner

  article_card_images:
    agents_with_keys:
      media_key: agents_with_keys
      filename: agents_with_keys.webp
      storage_provider: supabase_bucket
      bucket_status: operator_confirmed_uploaded
      role: article_card_image
      article_standing: unpublished_candidate
      publish_path: paragraph_integration_future_oar2

    fables_and_myths:
      media_key: fables_and_myths
      filename: fables_and_myths.webp
      storage_provider: supabase_bucket
      bucket_status: operator_confirmed_uploaded
      role: article_card_image
      article_standing: article_candidate_or_published_verify

    measures_registry:
      media_key: measures_registry_logo
      filename: measures_registry_logo.webp
      storage_provider: supabase_bucket
      bucket_status: operator_confirmed_uploaded
      role: article_card_or_brand_card_image
      article_standing: article_candidate_or_published_verify

media_resolution_rule:
  renderer_reads:
    - media_key
    - storage_provider
    - bucket_path_or_public_url_when_seated
    - role
    - release_state
  renderer_must_not:
    - hardcode_file_paths_as_authority
    - import_media_directly_as_truth
    - infer_article_standing_from_filename
    - redirect_to_Paragraph_as_primary_article_reader

## 3. Create 9x16 style profile record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_9x16_style_profile_record_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  runtime_mutation_authorized: false
  upload_authorized_now: false

style_profile:
  profile_key: undrifted_lapis_9x16_social_profile
  chamber_authority: lapis
  surface_key: undrifted_lapis_encounter
  aspect_ratio: 9:16
  header: none
  primary_public_headline: "AI Isn't Broken. Systems Are."
  issue_marker:
    position: top_right
    text: "June 2026 · Issue 001"

initial_state:
  media_key: undrifted_hero
  hero_slot: video
  headline_visibility: suppressed_or_minimal
  headline_blocks_viewport: false
  CTA_visible: true
  CTA_label: "Assess Your AI Environment"
  remove:
    - Watch 15-sec hook
    - top_navigation_header

post_video_state:
  trigger: video_complete
  hero_slot: headline_panel_or_video_still
  headline: "AI Isn't Broken. Systems Are."
  subline: "Questions ungoverned systems cannot answer."
  CTA_label: "Assess Your AI Environment"
  reveal:
    - article_cards
    - icon_signal_strip
    - leadership_callout

article_cards:
  display_order:
    - Agents with Keys
    - Fables and Myths
    - Measures Registry
  card_behavior:
    opens: onsite_overlay_or_panel
    paragraph_redirect_primary: false

leadership_callout:
  required: true
  placement: lower_surface_or_panel
  allowed_CTA_labels:
    - Start Leadership Conversation
    - Request Foundational Leadership Review
    - Connect with Measures Registry
  must_not_create:
    - payment
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - Branch standing

visual_constraints:
  must_be:
    - sharp
    - high_fidelity
    - dark_lapis_signal_surface
    - social_share_ready
    - mobile_first
  must_not_be:
    - generic_SaaS_layout
    - unstyled_cards
    - header_dependent
    - cluttered_over_video
    - structural_drift_showcase

## 4. Create icon registry usage record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_icon_registry_usage_record_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  runtime_mutation_authorized: false

icon_registry_usage:
  source: media_map_or_icon_registry
  renderer_behavior: resolve_by_icon_key
  hardcoded_component_icons_allowed: false

icons:
  Agents_with_Keys:
    icon_key: key_or_access
    semantic_use: capability_is_not_authority

  Fables_and_Myths:
    icon_key: mask_scroll_or_fable
    semantic_use: stories_we_believe_become_systems_we_build

  Measures_Registry:
    icon_key: registry_seal_or_triangle_mark
    semantic_use: integrity_governance_for_AI_accelerated_systems

  Truth_is_Structure:
    icon_key: cube
    semantic_use: coherence_before_complexity

  Structure_Prevents_Drift:
    icon_key: shield
    semantic_use: governance_is_design_choice

  Authority_is_Registered:
    icon_key: column
    semantic_use: accountability_leaves_trace

  Accountability_is_Traceable:
    icon_key: clipboard
    semantic_use: what_is_measured_can_be_trusted

  Leadership_Callout:
    icon_key: people_or_handshake
    semantic_use: aligned_institutional_leadership

style_constraints:
  stroke_weight: single_system_weight
  color_tokens:
    allowed:
      - lapis_signal_blue
      - governance_gold
      - text_white
    not_allowed:
      - mixed_random_colors
      - icon_style_mismatch

## 5. Create video-to-headline behavior record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_video_to_headline_behavior_record_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  runtime_mutation_authorized: false

behavior:
  surface_key: undrifted_lapis_encounter
  initial_state:
    show_video: true
    video_media_key: undrifted_hero
    show_header: false
    show_issue_marker: true
    issue_marker_text: "June 2026 · Issue 001"
    CTA_label: "Assess Your AI Environment"
    show_watch_hook_button: false
    headline_blocks_viewport: false

  transition:
    trigger: video_complete
    allowed:
      - fade_video_to_still
      - replace_video_with_headline_panel
      - reveal_article_cards
      - reveal_leadership_callout
    not_allowed:
      - redirect_on_video_complete
      - require_user_click_to_continue
      - hide_assessment_CTA

  resolved_state:
    headline: "AI Isn't Broken. Systems Are."
    subline: "Questions ungoverned systems cannot answer."
    article_cards_visible: true
    leadership_callout_visible: true
    assessment_CTA_visible: true

## 6. Create validation report

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_undrifted_lapis_media_map_and_9x16_style_profile_validation_v1.meta.md

Required content:

standing:
  status: media_map_and_style_profile_requirements_seated
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  paragraph_publish_authorized_now: false

records_created:
  media_map_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_media_map_record_v1.meta.md
    exists: true_or_false
  style_profile_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_9x16_style_profile_record_v1.meta.md
    exists: true_or_false
  icon_registry_usage_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_icon_registry_usage_record_v1.meta.md
    exists: true_or_false
  video_to_headline_behavior_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_video_to_headline_behavior_record_v1.meta.md
    exists: true_or_false

requirements_satisfied:
  media_keys_named: true_or_false
  supabase_media_confirmed_by_operator: true_or_false
  nine_by_sixteen_profile: true_or_false
  header_removed: true_or_false
  issue_marker_added: true_or_false
  CTA_corrected: true_or_false
  watch_hook_removed: true_or_false
  video_first_behavior_seated: true_or_false
  post_video_headline_behavior_seated: true_or_false
  icon_registry_usage_seated: true_or_false

upload_manifest_update_required: true
previous_recommended_upload_count: 62
new_required_records_count: 4
recommended_upload_count_after_media_style_addendum: 66

blocking_findings:
  rows: []

## 7. Create revised manifest media/style addendum recommendation

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_revised_pre_upload_manifest_media_style_addendum_recommendation_v1.meta.md

Required content:

previous_confirmed_upload_count: 56
prior_launch_surface_additions_count: 5
prior_article_addendum_count: 1
prior_recommended_upload_count: 62
media_style_addendum_required_records_count: 4
recommended_upload_count_after_media_style_addendum: 66

new_records_to_add:
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_media_map_record_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/undrifted_lapis_media_map_record_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: seats unDrifted Lapis media keys for hero video, publication banner, and article card images

  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_9x16_style_profile_record_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/undrifted_lapis_9x16_style_profile_record_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: seats social-first 9x16 Lapis style profile

  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_icon_registry_usage_record_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/undrifted_lapis_icon_registry_usage_record_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: seats icon usage as governed semantic signals

  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_video_to_headline_behavior_record_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/undrifted_lapis_video_to_headline_behavior_record_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: seats video-first and post-video headline behavior

upload_authorized_now: false
operator_confirmation_required: true

recommended_next_oar2:
  title: OAR2 - Confirm Revised Measures Registry SEAT Upload Manifest After Launch Surface Additions v1

## 8. Boundary

Do not upload.

Do not publish.

Do not mutate runtime.

Do not mutate DB.

Do not activate launch.

## VALIDATION RETURN

Return:

- addendum OAR2 path
- media map record path
- 9x16 style profile record path
- icon registry usage record path
- video-to-headline behavior record path
- validation report path
- revised manifest media/style recommendation path
- prior recommended upload count
- media/style records added count
- recommended upload count after media/style addendum
- media keys seated
- CTA label confirmed
- issue marker confirmed
- video-first behavior confirmed
- header removed confirmed
- watch hook removed confirmed
- bucket upload authorized false
- Paragraph publish authorized false
- no bucket upload confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no social posting confirmation
- no Paragraph publishing confirmation
- recommended next OAR2 title
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md

OAR1 must report:

- addendum OAR2 path
- media map record path
- 9x16 style profile record path
- icon registry usage record path
- video-to-headline behavior record path
- validation report path
- revised manifest media/style recommendation path
- prior recommended upload count
- media/style records added count
- recommended upload count after media/style addendum
- media keys seated
- CTA label confirmed
- issue marker confirmed
- video-first behavior confirmed
- header removed confirmed
- watch hook removed confirmed
- bucket upload authorized false
- Paragraph publish authorized false
- no bucket upload confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no social posting confirmation
- no Paragraph publishing confirmation
- recommended next OAR2 title

## CLOSE

This addendum seats the unDrifted Lapis encounter media map, 9:16 style profile, icon registry usage, and video-to-headline behavior.

It does not upload, publish, mutate runtime, mutate DB, or activate launch.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody seats addendum evidence.
