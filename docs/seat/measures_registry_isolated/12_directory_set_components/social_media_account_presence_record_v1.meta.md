---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Social Media Account Presence Record v1
status: seated_candidate_pending_operator_review
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_measures_registry_social_media_campaign_accounts_assets_routes_and_posting_boundary_v1.meta.md
---

# Social Media Account Presence Record v1

standing:
  status: candidate_confirmed_or_pending_operator_review
  mutation_authorized: false
  social_posting_authorized_now: false
  social_scheduling_authorized_now: false
  buffer_activation_authorized_now: false

accounts:
  x:
    platform: X
    expected_handle: "@measures_c3"
    status: operator_to_confirm
    campaign_use:
      - primary_assessment_post
      - unDrifted_signal_post
      - article_support_posts

  instagram:
    platform: Instagram
    expected_handle: "measures_registry"
    status: operator_to_confirm
    campaign_use:
      - visual_assessment_post
      - unDrifted_visual_post
      - article_support_posts

  linkedin:
    platform: LinkedIn
    expected_status: profile_or_page_to_confirm
    status: operator_to_confirm
    campaign_use:
      - institutional_positioning
      - assessment_invitation
      - leadership_interest

  paragraph:
    platform: Paragraph
    expected_handle: "@undrifted"
    status: operator_to_confirm
    campaign_use:
      - unDrifted_publication_reference
      - article_reference

  youtube:
    platform: YouTube
    expected_status: optional_if_video_campaign_active
    status: operator_to_confirm
    campaign_use:
      - video_reference_if_authorized_later

tooling:
  buffer:
    status: held_until_authorized
    posting_authorized_now: false
    scheduling_authorized_now: false

rule:
  plain_language: Social accounts may be recorded for campaign readiness. No post, schedule, Buffer action, or external platform mutation is authorized by this OAR2.
