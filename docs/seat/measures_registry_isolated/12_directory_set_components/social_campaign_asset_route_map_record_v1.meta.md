---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Social Campaign Asset Route Map Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_measures_registry_social_media_campaign_accounts_assets_routes_and_posting_boundary_v1.meta.md
---

# Social Campaign Asset Route Map Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  bucket_upload_authorized_now: false
  social_posting_authorized_now: false
  social_scheduling_authorized_now: false

campaign:
  name: AI Isn't Broken. Systems Are.
  primary_goal: completed_assessments
  secondary_goal: unDrifted_attention_and_leadership_interest

routes:
  primary_assessment:
    CTA: Assess Your AI Environment
    route: /ai-operations-assessment
    media_key: measures_registry_og
    filename: og.webp

  ai_isnt_broken:
    CTA: Assess Your AI Environment
    route: /ai-isnt-broken
    media_key: measures_registry_og
    filename: og.webp

  home:
    CTA: Assess Your AI Environment
    route: /
    media_key: measures_registry_og
    filename: og.webp

  measures_assessment_protocol:
    CTA: Measures Assessment Protocol
    route: /measures-assessment-protocol
    media_key: measures_registry_og
    filename: og.webp

  undrifted:
    CTA: Read unDrifted
    route: /undrifted
    media_key: undrifted_banner_website_social
    filename: undrifted_banner_website_social.webp
    fallback_media_key: measures_registry_og
    fallback_filename: og.webp

campaign_assets:
  default_measures_registry_preview:
    media_key: measures_registry_og
    filename: og.webp
    use:
      - Open Graph image
      - Twitter preview image
      - default Measures Registry social preview

  undrifted_preview:
    media_key: undrifted_banner_website_social
    filename: undrifted_banner_website_social.webp
    use:
      - unDrifted route preview
      - unDrifted social preview
      - publication surface preview

  landing_visual:
    media_key: ai_isnt_broken_landing
    filename: ai_isnt_broken_landing.webp
    use:
      - assessment campaign visual
      - supporting social visual

  article_support:
    agents_with_keys:
      media_key: agents_with_keys
      filename: agents_with_keys.webp
    fables_and_myths:
      media_key: fables_and_myths
      filename: fables_and_myths.webp

blocked_assets:
  - unapproved_images
  - images_with_misspelled_baked_text
  - payment_surface_screenshot_as_ad_without_later_authorization
  - client_result_or_report_preview

rule:
  plain_language: Measures Registry routes use og.webp. unDrifted uses undrifted_banner_website_social.webp. Campaign assets are seated for readiness only, not posting.
