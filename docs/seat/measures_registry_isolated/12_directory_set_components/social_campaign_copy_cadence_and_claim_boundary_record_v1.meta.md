---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Social Campaign Copy Cadence and Claim Boundary Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_measures_registry_social_media_campaign_accounts_assets_routes_and_posting_boundary_v1.meta.md
---

# Social Campaign Copy Cadence and Claim Boundary Record v1

standing:
  status: campaign_ready_for_review
  mutation_authorized: false
  social_posting_authorized_now: false
  social_scheduling_authorized_now: false
  buffer_activation_authorized_now: false
  paragraph_publish_authorized_now: false

allowed_public_messages:
  primary_assessment:
    headline: AI isn't broken. Systems are.
    support: Questions Ungoverned Systems Cannot Answer
    CTA: Assess Your AI Environment
    route: /ai-operations-assessment

  undrifted:
    headline: Structural drift is detectable.
    support: Collapse is not the default.
    CTA: Read unDrifted
    route: /undrifted

  measures_registry_positioning:
    headline: Integrity Governance for AI Accelerated Systems
    support: Measures Registry helps organizations identify operational, system, and environmental risk factors in AI operations.
    CTA: Assess Your AI Environment
    route: /ai-operations-assessment

  article_support_agents_with_keys:
    headline: Agents with Keys
    support: Capability is not authority.
    CTA: Read unDrifted
    route: /undrifted

  article_support_fables_and_myths:
    headline: Fables and Myths
    support: The stories we believe become the systems we build.
    CTA: Read unDrifted
    route: /undrifted

campaign_cadence_candidate:
  launch_day:
    post: primary_assessment_post
    route: /ai-operations-assessment
    media: og.webp

  follow_up_1:
    post: unDrifted_publication_post
    route: /undrifted
    media: undrifted_banner_website_social.webp

  follow_up_2:
    post: agents_with_keys_article_support
    route: /undrifted
    media: agents_with_keys.webp

  follow_up_3:
    post: fables_and_myths_article_support
    route: /undrifted
    media: fables_and_myths.webp

  follow_up_4:
    post: measures_registry_positioning
    route: /ai-operations-assessment
    media: og.webp

blocked_claims:
  - SEAT_active
  - SEAL_active
  - Registry_Standing_for_client
  - c3_Key_assignment
  - DAO_participation
  - certification
  - payment_creates_standing
  - MAP_creates_SEAT
  - assessment_diagnoses_AI_behavior
  - guaranteed_AI_outcome
  - client_is_registered_branch
  - client_has_c3_Field_access
  - social_post_as_public_authority_claim

required_disclaimers_or_boundaries:
  assessment:
    - The assessment identifies operational, system, and environmental risk factors.
    - The assessment does not diagnose AI behavior.
  MAP:
    - MAP and payment-of-scope do not create SEAT, SEAL, c3 Key, DAO participation, Branch standing, or certification.
  unDrifted:
    - unDrifted is a publication and signal surface of Measures Registry.

rule:
  plain_language: Social campaign copy is approved as candidate language only. Posting and scheduling remain held until separately authorized.
