---
document_type: chamber_directory_index
authority_level: working
document_scope: c3_field_chamber_directory_lapis
title: Lapis Chamber Directory Index v1
status: seated_working_directory
version: v1
operator: op044
system: c3_field
material_family: lapis
system_process_surface: chamber_directory
standing: seated_working_directory
registration_state: registered_directory
registered_process_key: c3_field_chamber_directory_lapis_v1
registered_process_readback: docs/oar/c3_field/chamber_directories/lapis_chamber_directory_registration_readback_v1.json
contract_stack_state: assessment_landing_contracts_seated
media_mapping_state: pending_registration
runtime_implementation_state: pending_oar2
public_render_state: not_implemented_by_this_oar
undrifted_issue_01_contract_stack_state: seated
undrifted_media_map_state: registered_after_readback
undrifted_runtime_implementation_state: pending_oar2
undrifted_public_render_state: not_implemented_by_this_oar
landing_seo_contract_stack_state: seated
seo_runtime_implementation_state: pending_oar2
seo_route_head_state: not_implemented_by_this_oar
sitemap_state: contract_seated_pending_implementation
robots_state: contract_seated_pending_implementation
public_facing: false
authority: working_surface_only
registration_authorized: false
requirements_matrix_reference: docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md
source_oar2:
  - docs/oar/c3_field/chamber_directories/oar2_seat_chamber_directory_system_process_surface_and_run_db_schema_review_v1.meta.md
  - docs/oar/c3_field/chamber_directories/oar2_establish_chamber_directory_requirement_matrix_for_all_material_families_v1.meta.md
  - docs/oar/c3_field/chamber_directories/lapis/oar2_seat_ai_operations_assessment_lapis_chamber_contracts_v1.meta.md
  - docs/oar/c3_field/chamber_directories/lapis/oar2_seat_undrifted_issue_01_landing_contracts_and_chamber_media_map_v1.meta.md
  - docs/oar/c3_field/chamber_directories/lapis/oar2_seat_measures_registry_landing_seo_social_preview_contracts_v1.meta.md
tags:
  - chamber-directory
  - lapis
  - c3-field
  - system-process
  - working-surface
  - requirements-matrix
  - ai-operations-assessment
  - undrifted
  - issue-01
  - assessment-landing-contracts-seated
  - undrifted-media-map-registered
  - landing-seo-contracts-seated
  - seated-not-registered
---

# Lapis Chamber Directory Index v1

## Standing

This file seats a working Chamber Directory surface for the Lapis material family.

This file does not authorize new DB registration.

Separate DB process registration has been readback-confirmed for:

    process_key: c3_field_chamber_directory_lapis_v1
    readback: docs/oar/c3_field/chamber_directories/lapis_chamber_directory_registration_readback_v1.json

Index standing remains:

    material_family: lapis
    system_process_surface: chamber_directory
    standing: seated_working_directory
    registration_state: registered_directory
    contract_stack_state: assessment_landing_contracts_seated
    media_mapping_state: pending_registration
    runtime_implementation_state: pending_oar2
    public_render_state: not_implemented_by_this_oar
    undrifted_issue_01_contract_stack_state: seated
    undrifted_media_map_state: registered_after_readback
    undrifted_runtime_implementation_state: pending_oar2
    undrifted_public_render_state: not_implemented_by_this_oar
    landing_seo_contract_stack_state: seated
    seo_runtime_implementation_state: pending_oar2
    seo_route_head_state: not_implemented_by_this_oar
    sitemap_state: contract_seated_pending_implementation
    robots_state: contract_seated_pending_implementation
    public_facing: false
    authority: working_surface_only
    registration_authorized: false
    requirements_matrix_reference: docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

## Purpose

The Lapis Chamber Directory is a c3 Field system-process working surface for grouping contracts under the Lapis material family.

Lapis is the material family.

The Chamber Directory is the working directory surface.

Registration changes standing, not identity.

## Requirement Families

Requirement standing uses the shared matrix states:

    missing
    needed
    drafted
    seated
    registered
    held
    not_applicable
    deprecated

Current Lapis requirement family standing:

    public_encounter_contracts: seated
    landing_page_design_contracts: seated
    content_contracts: seated
    media_contracts: seated
    runtime_render_contracts: seated
    cta_transition_contracts: seated
    seo_contracts: seated
    paragraph_contracts: seated
    buffer_contracts: seated
    social_distribution_contracts: seated
    api_contracts: held
    cli_contracts: not_applicable
    sdk_contracts: held
    webhook_contracts: held
    auth_contracts: held
    secret_boundary_contracts: seated
    scheduler_contracts: seated
    analytics_contracts: needed
    email_contracts: held
    storage_contracts: seated
    validation_contracts: seated
    evidence_contracts: seated
    oar_contracts: seated
    article_overlay_contracts: seated

Held reason:

    API, SDK, webhook, auth, and email contracts are held until a later OAR2 authorizes those incorporated surfaces.

Needed reason:

    Analytics contracts are recognized but not yet drafted for this directory.

## Dependency Map

Current Measures Registry Lapis dependencies:

    /undrifted depends on:
      - public_encounter_contracts
      - content_contracts
      - landing_page_design_contracts
      - media_contracts
      - runtime_render_contracts
      - seo_contracts
      - paragraph_contracts
      - buffer_contracts
      - social_distribution_contracts
      - cta_transition_contracts
      - article_overlay_contracts
      - seo_social_preview_contracts

    /ai-operations-assessment depends on:
      - public_encounter_contracts
      - content_contracts
      - landing_page_design_contracts
      - media_contracts
      - runtime_render_contracts
      - cta_transition_contracts
      - validation_contracts
      - seo_social_preview_contracts

    /structural-drift legacy trace depends on:
      - runtime_render_contracts
      - seo_contracts
      - cta_transition_contracts
      - no_public_authority_bleed_check

## AI Operations Assessment Contract Stack

The following `/ai-operations-assessment` contracts are seated under this Lapis Chamber Directory:

    public_encounter_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/public_encounter_contracts/ai_operations_assessment_public_encounter_contract_v1.meta.md
      contract_key: ai_operations_assessment_public_encounter_contract_v1

    landing_page_design_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/landing_page_design_contracts/ai_operations_assessment_landing_style_contract_v1.meta.md
      contract_key: ai_operations_assessment_landing_style_contract_v1

    content_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/content_contracts/ai_operations_assessment_landing_content_contract_v1.meta.md
      contract_key: ai_operations_assessment_landing_content_contract_v1

    media_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/media_contracts/ai_operations_assessment_landing_media_contract_v1.meta.md
      contract_key: ai_operations_assessment_landing_media_contract_v1
      media_label: ai_isnt_broken_landing
      media_mapping_state: pending_registration

    runtime_render_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/runtime_render_contracts/ai_operations_assessment_landing_runtime_render_contract_v1.meta.md
      contract_key: ai_operations_assessment_landing_runtime_render_contract_v1
      runtime_implementation_state: pending_oar2

    cta_transition_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/cta_transition_contracts/ai_operations_assessment_cta_transition_contract_v1.meta.md
      contract_key: ai_operations_assessment_cta_transition_contract_v1
      primary_cta: Assess the Environment
      primary_target: eval_passage
      secondary_cta: Read unDrifted
      secondary_target: /undrifted

Contract stack standing:

    registration_state: registered_directory
    contract_stack_state: assessment_landing_contracts_seated
    media_mapping_state: pending_registration
    runtime_implementation_state: pending_oar2
    public_render_state: not_implemented_by_this_oar

This stack seats contracts only.

This stack does not register media mapping.

This stack does not implement runtime rendering.

This stack does not change `/ai-operations-assessment` route behavior.

This stack does not create public Lapis language.

## unDrifted Issue 01 Contract Stack

The following `/undrifted` Issue 01 contracts are seated under this Lapis Chamber Directory:

    public_encounter_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/public_encounter_contracts/undrifted_issue_01_public_encounter_contract_v1.meta.md
      contract_key: undrifted_issue_01_public_encounter_contract_v1

    landing_page_design_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/landing_page_design_contracts/undrifted_issue_01_landing_style_contract_v1.meta.md
      contract_key: undrifted_issue_01_landing_style_contract_v1

    content_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/content_contracts/undrifted_issue_01_landing_content_contract_v1.meta.md
      contract_key: undrifted_issue_01_landing_content_contract_v1

    media_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/media_contracts/undrifted_issue_01_media_contract_v1.meta.md
      contract_key: undrifted_issue_01_media_contract_v1
      media_map_readback: docs/oar/c3_field/chamber_directories/lapis/undrifted_issue_01_chamber_media_map_readback_v1.json
      media_map_state: registered_after_readback
      held_media: undrifted_issue_01_hero_motion_v1
      held_glyphs: glyph_semantics_pending_operator_naming

    runtime_render_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/runtime_render_contracts/undrifted_issue_01_runtime_render_contract_v1.meta.md
      contract_key: undrifted_issue_01_runtime_render_contract_v1
      runtime_implementation_state: pending_oar2

    cta_transition_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/cta_transition_contracts/undrifted_issue_01_cta_transition_contract_v1.meta.md
      contract_key: undrifted_issue_01_cta_transition_contract_v1
      primary_top_cta: Assess the Environment
      primary_top_target: /ai-operations-assessment
      featured_cta: Assess the Environment
      featured_target: /ai-operations-assessment
      dispatch_target: overlay reader
      leadership_target: pending_runtime_resolution

    article_overlay_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/article_overlay_contracts/undrifted_issue_01_article_overlay_reader_contract_v1.meta.md
      contract_key: undrifted_issue_01_article_overlay_reader_contract_v1
      articles:
        - Structural Drift
        - Agents with Keys
        - Agents of Chaos

Contract stack standing:

    undrifted_issue_01_contract_stack_state: seated
    undrifted_media_map_state: registered_after_readback
    undrifted_runtime_implementation_state: pending_oar2
    undrifted_public_render_state: not_implemented_by_this_oar

This stack seats contracts and registers chamber media-map entries only.

This stack does not implement `/undrifted` runtime rendering.

This stack does not change `/undrifted` route behavior.

This stack does not create public Lapis language.

This stack does not expose C1, C2, C3, commerce circuits, payment, c3 Key, SRC, certification, conversion, DAO standing, or Marble readiness.

## Landing SEO and Social Preview Contract Stack

The following Measures Registry landing SEO/social-preview contract is seated under this Lapis Chamber Directory:

    seo_contracts:
      state: seated
      contract: docs/oar/c3_field/chamber_directories/lapis/seo_contracts/measures_registry_landing_seo_social_preview_contract_v1.meta.md
      contract_key: measures_registry_landing_seo_social_preview_contract_v1
      canonical_domain: https://www.measuresregistry.com

    /undrifted:
      seo_contract_family_state: seated
      title: unDrifted Issue 01 | Measures Registry
      canonical: https://www.measuresregistry.com/undrifted
      og_image_key: undrifted_banner_website_social_v1
      twitter_image_key: undrifted_banner_website_social_v1
      fallback_image_key: undrifted_issue_01_hero_still_v1
      image_key_state: registered_after_readback

    /ai-operations-assessment:
      seo_contract_family_state: seated
      title: AI Operations Assessment | Measures Registry
      canonical: https://www.measuresregistry.com/ai-operations-assessment
      og_image_key: ai_operations_assessment_hero_chamber_v1
      twitter_image_key: ai_operations_assessment_hero_chamber_v1
      fallback_image_key: undrifted_feature_assess_environment_cover_v1
      primary_image_key_state: pending_media_map_registration
      fallback_image_key_state: registered_after_readback

Contract stack standing:

    landing_seo_contract_stack_state: seated
    seo_runtime_implementation_state: pending_oar2
    seo_route_head_state: not_implemented_by_this_oar
    sitemap_state: contract_seated_pending_implementation
    robots_state: contract_seated_pending_implementation

This SEO stack seats contract authority only.

This SEO stack does not mutate route-head code.

This SEO stack does not mutate sitemap or robots files.

This SEO stack does not implement runtime rendering.

This SEO stack does not create `/structural-drift` as a second active public brand authority.

This SEO stack does not expose C1, C2, C3, public Lapis language, commerce circuits, payment, c3 Key, SRC, certification, conversion, DAO standing, or Marble readiness.

## Proof Requirements

Current proof requirements:

    file_exists
    OAR2_exists
    OAR1_exists
    DB_readback
    route_head_validation
    hydrated_browser_validation
    runtime_validation
    no_secret_exposure_check
    no_public_authority_bleed_check
    no_claims_boundary_check
    git_diff_check
    build_validation
    TypeScript_validation

## Public Copy Boundary

No public copy may expose:

    Lapis Chamber
    Enter Lapis
    Lapis SEO Chamber
    Lapis Distribution Chamber
    Lapis Landing Page

## Registration Readiness Boundary

This index does not authorize new DB registration.

Future registration readiness must satisfy the shared matrix gate and must be authorized by a later OAR2 with `registration_authorized: true`.

This index does not create route, SEO, publication, Paragraph, Buffer, social, article, payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble readiness standing.
