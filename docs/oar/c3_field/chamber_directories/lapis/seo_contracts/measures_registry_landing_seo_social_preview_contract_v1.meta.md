---
document_type: chamber_contract
authority_level: working
document_scope: measures_registry_landing_seo_social_preview
title: Measures Registry Landing SEO and Social Preview Contract v1
status: seated_not_implemented
version: v1
operator: op044
system: measures_registry
contract_key: measures_registry_landing_seo_social_preview_contract_v1
public_facing: true
parent_directory: c3_field_chamber_directory_lapis_v1
registration_state: seated_not_implemented
canonical_domain: https://www.measuresregistry.com
route_head_state: not_implemented_by_this_oar
sitemap_state: contract_seated_pending_implementation
robots_state: contract_seated_pending_implementation
source_oar2: docs/oar/c3_field/chamber_directories/lapis/oar2_seat_measures_registry_landing_seo_social_preview_contracts_v1.meta.md
tags:
  - chamber-contract
  - seo
  - social-preview
  - open-graph
  - twitter-card
  - canonical-url
  - sitemap
  - robots
  - seated-not-implemented
---

# Measures Registry Landing SEO and Social Preview Contract v1

## Standing

This contract seats governed SEO and social-preview metadata for:

    /undrifted
    /ai-operations-assessment

This contract does not implement route-head code.

This contract does not mutate sitemap or robots files.

This contract does not mutate DB state.

This contract does not deploy public metadata.

## Canonical Domain Rule

Canonical domain:

    https://www.measuresregistry.com

Canonical route URLs:

    https://www.measuresregistry.com/undrifted
    https://www.measuresregistry.com/ai-operations-assessment

Implementation boundary:

    If production routing uses apex instead of www, implementation must document mismatch and hold route-head deployment.
    No canonical ambiguity may be silently implemented.

## /undrifted Metadata

Route:

    /undrifted

Route role:

    public_publication_issue_cover

SEO title:

    unDrifted Issue 01 | Measures Registry

Meta description:

    unDrifted is a Measures Registry publication tracking structural drift, AI operations, and governed correction. Issue 01 announces Measures Registry Launch.

Canonical:

    https://www.measuresregistry.com/undrifted

Robots:

    index, follow

Open Graph:

    og:type: website
    og:title: unDrifted Issue 01 | Measures Registry
    og:description: Detect the patterns. Measure the condition. Correct the drift. Govern the environment.
    og:url: https://www.measuresregistry.com/undrifted
    og:site_name: Measures Registry
    og:image_key: undrifted_banner_website_social_v1

Twitter/X card:

    twitter:card: summary_large_image
    twitter:title: unDrifted Issue 01 | Measures Registry
    twitter:description: A Measures Registry publication on structural drift, AI operations, and governed correction.
    twitter:image_key: undrifted_banner_website_social_v1

Fallback image key:

    undrifted_issue_01_hero_still_v1

Image standing:

    primary_image_key_state: registered_after_readback
    fallback_image_key_state: registered_after_readback
    image_authority: governed_media_key_only
    hardcoded_bucket_url_allowed: false

## /ai-operations-assessment Metadata

Route:

    /ai-operations-assessment

Route role:

    public_assessment_landing

SEO title:

    AI Operations Assessment | Measures Registry

Meta description:

    A complimentary Measures Registry assessment for initial review of environments where AI is deployed.

Canonical:

    https://www.measuresregistry.com/ai-operations-assessment

Robots:

    index, follow

Open Graph:

    og:type: website
    og:title: AI Operations Assessment | Measures Registry
    og:description: AI behavior does not happen in isolation. What appears as a model issue may reflect conditions in the surrounding system.
    og:url: https://www.measuresregistry.com/ai-operations-assessment
    og:site_name: Measures Registry
    og:image_key: ai_operations_assessment_hero_chamber_v1

Twitter/X card:

    twitter:card: summary_large_image
    twitter:title: AI Operations Assessment | Measures Registry
    twitter:description: A complimentary tool for initial AI environment review.
    twitter:image_key: ai_operations_assessment_hero_chamber_v1

Fallback image key:

    undrifted_feature_assess_environment_cover_v1

Image standing:

    primary_image_key_state: pending_media_map_registration
    fallback_image_key_state: registered_after_readback
    image_authority: governed_media_key_only
    hardcoded_bucket_url_allowed: false

If neither image key is registered:

    mark OG/Twitter image state as pending
    do not hardcode a bucket URL

## Sitemap Contract

Future sitemap implementation must include:

    /undrifted
      priority: 0.9
      changefreq: weekly

    /ai-operations-assessment
      priority: 0.9
      changefreq: monthly

Do not include deprecated or held routes as active sitemap entries.

Specifically do not newly seat:

    /structural-drift

Structural Drift may exist as dispatch/article overlay content under `/undrifted`, but must not become a second active public brand authority.

## Robots Contract

Future robots.txt implementation must allow indexing for:

    /undrifted
    /ai-operations-assessment

Future robots.txt implementation must disallow or omit internal/system process paths:

    /c3_field
    /chamber_directories
    /admin
    /internal
    /src
    /oar

Implementation must inspect current robots behavior before mutating robots.txt.

This OAR seats the contract only.

## Route Resolution Requirement

Future implementation must prove:

    /undrifted resolves as /undrifted
    /ai-operations-assessment resolves as /ai-operations-assessment

Disallowed route behavior:

    home fallback
    SPA-only pretend route
    URL changes while home visually loads
    metadata shared from home page unless explicitly seated

## Validation Contract

Future implementation validation must include:

    build validation
    route-head validation
    hydrated browser validation
    curl or static output inspection where applicable
    canonical URL check
    OG tag check
    Twitter/X tag check
    sitemap check
    robots check

Validation commands or equivalent proof must confirm:

    /undrifted title is correct
    /undrifted meta description is correct
    /undrifted canonical is correct
    /undrifted OG image resolves through governed media key

    /ai-operations-assessment title is correct
    /ai-operations-assessment meta description is correct
    /ai-operations-assessment canonical is correct
    /ai-operations-assessment OG image resolves through governed media key

    sitemap includes both routes
    robots does not block both routes
    no C1/C2/C3 appears in public HTML metadata
    no Lapis Chamber or Chamber Directory appears in public HTML metadata
    no pricing/payment/conversion/certification/c3 Key/SRC appears in public metadata

## Public Metadata Boundary

Public SEO metadata may not expose:

    C1
    C2
    C3
    commerce circuits
    pricing
    payment
    c3 Key
    SRC
    certification
    conversion
    DAO standing
    Marble readiness
    Lapis Chamber
    Chamber Directory

## Mutation Boundary

This contract does not authorize:

    DB mutation
    route-head mutation
    sitemap file mutation
    robots file mutation
    source runtime mutation
    route implementation
    landing page implementation
    social preview deployment
    Open Graph hardcoding
    Twitter/X hardcoding
    media mapping registration
    Paragraph draft/publish
    Buffer scheduling/posting
    social posting
    article body mutation
    assessment mutation
    scoring logic mutation
    contact gate mutation
    result gate mutation
    payment
    wallet
    c3 Key
    SRC
    certification
    conversion
    DAO
    permission
    recognition
    distribution standing
    Marble readiness
