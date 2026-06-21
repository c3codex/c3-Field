---
document_type: directory_set_requirement_record
record_key: undrifted_lapis_media_map_record_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md
system_scope: measures_registry_isolated
upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# unDrifted Lapis Media Map Record v1

```yaml
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
  aspect_ratio: "9:16"
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
```

## Boundary

This record seats media-map requirements only. Media files may exist in storage, but runtime surfaces must resolve media through seated media-map records. No component-owned media truth is created here.
