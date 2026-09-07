---
document_type: oar2
authority_level: working
document_scope: measures_registry_landing_seo_social_preview_contracts
title: OAR2 — Seat Measures Registry Landing SEO and Social Preview Contracts v1
status: proposed
version: v1
operator: op044
system: measures_registry
registration_authorized: false
source_oar1:
  - docs/oar/c3_field/chamber_directories/lapis/oar1_seat_ai_operations_assessment_lapis_chamber_contracts_v1.meta.md
source_oar2:
  - docs/oar/c3_field/chamber_directories/lapis/oar2_seat_undrifted_issue_01_landing_contracts_and_chamber_media_map_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: contract_executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - seo
  - social-preview
  - open-graph
  - twitter-card
  - canonical-url
  - sitemap
  - robots
  - undrifted
  - ai-operations-assessment
  - seated-not-rendered
---

# OAR2 — Seat Measures Registry Landing SEO and Social Preview Contracts v1

## OBSERVED

Measures Registry now has two public landing surfaces requiring governed SEO and social-preview contracts:

    /undrifted
    /ai-operations-assessment

The AI Operations Assessment Lapis Chamber contract stack has been seated.

Its OAR1 confirms:

    contracts seated
    media mapping pending
    runtime implementation pending
    no SEO route-head mutation occurred
    no crawler metadata mutation occurred
    no route behavior changed

The unDrifted Issue 01 OAR2 has been delivered for contract seating and chamber media-map registration.

SEO must be seated as contract before runtime implementation so Cody does not invent title tags, descriptions, canonical URLs, or preview copy from frontend memory.

Public SEO language must remain Measures Registry-facing.

No public SEO metadata may expose:

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

## ALIGNED

Authority order remains:

    Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Frontend does not author truth.

Route-head metadata, social preview metadata, canonical URLs, robots behavior, and sitemap entries must be governed by seated contract.

This OAR2 has:

    registration_authorized: false

Therefore this OAR2 may create local SEO and social-preview contract files only.

This OAR2 does not authorize:

    DB mutation
    media-map registration
    route-head implementation
    sitemap implementation
    robots implementation
    runtime rendering
    source mutation
    deployment
    Paragraph publish
    Buffer scheduling
    social posting

## ROUTED

### 1. Create SEO contract folder

Create or ensure:

    docs/oar/c3_field/chamber_directories/lapis/seo_contracts/

Create:

    docs/oar/c3_field/chamber_directories/lapis/seo_contracts/measures_registry_landing_seo_social_preview_contract_v1.meta.md

### 2. Seat canonical domain rule

Contract must define one canonical domain.

Preferred canonical:

    https://www.measuresregistry.com

Canonical route URLs:

    https://www.measuresregistry.com/undrifted
    https://www.measuresregistry.com/ai-operations-assessment

If production routing uses apex instead of www, Cody must document mismatch and hold implementation.

No canonical ambiguity may be silently implemented.

### 3. Seat /undrifted metadata contract

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

    og:type:
      website

    og:title:
      unDrifted Issue 01 | Measures Registry

    og:description:
      Detect the patterns. Measure the condition. Correct the drift. Govern the environment.

    og:url:
      https://www.measuresregistry.com/undrifted

    og:site_name:
      Measures Registry

    og:image_key:
      undrifted_banner_website_social_v1

Twitter/X card:

    twitter:card:
      summary_large_image

    twitter:title:
      unDrifted Issue 01 | Measures Registry

    twitter:description:
      A Measures Registry publication on structural drift, AI operations, and governed correction.

    twitter:image_key:
      undrifted_banner_website_social_v1

Fallback image key if banner unavailable:

    undrifted_issue_01_hero_still_v1

If neither image key is registered:

    mark OG/Twitter image state as pending
    do not hardcode a bucket URL

### 4. Seat /ai-operations-assessment metadata contract

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

    og:type:
      website

    og:title:
      AI Operations Assessment | Measures Registry

    og:description:
      AI behavior does not happen in isolation. What appears as a model issue may reflect conditions in the surrounding system.

    og:url:
      https://www.measuresregistry.com/ai-operations-assessment

    og:site_name:
      Measures Registry

    og:image_key:
      ai_operations_assessment_hero_chamber_v1

Twitter/X card:

    twitter:card:
      summary_large_image

    twitter:title:
      AI Operations Assessment | Measures Registry

    twitter:description:
      A complimentary tool for initial AI environment review.

    twitter:image_key:
      ai_operations_assessment_hero_chamber_v1

Fallback image key:

    undrifted_feature_assess_environment_cover_v1

If neither image key is registered:

    mark OG/Twitter image state as pending
    do not hardcode a bucket URL

### 5. Seat sitemap contract

Contract must require sitemap inclusion for:

    /undrifted
    /ai-operations-assessment

Suggested sitemap metadata:

    /undrifted
      priority: 0.9
      changefreq: weekly

    /ai-operations-assessment
      priority: 0.9
      changefreq: monthly

Do not include deprecated or held routes as active sitemap entries.

Specifically do not newly seat:

    /structural-drift

Structural Drift may exist as dispatch/article overlay content under /undrifted, but must not become a second active public brand authority.

### 6. Seat robots contract

robots.txt contract:

    allow indexing for:
      /undrifted
      /ai-operations-assessment

    disallow or omit internal/system process paths:
      /c3_field
      /chamber_directories
      /admin
      /internal
      /src
      /oar

Cody must inspect current robots behavior before implementation in a later OAR.

This OAR seats the contract only.

### 7. Seat route resolution requirement

SEO contract must require route resolution:

    /undrifted must resolve as /undrifted
    /ai-operations-assessment must resolve as /ai-operations-assessment

No home fallback.

No SPA-only pretend route.

No route that visually loads home while URL changes.

No metadata shared from home page unless explicitly seated.

### 8. Seat validation contract

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

### 9. Update Lapis Chamber Directory index

Update:

    docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md

Add SEO contract reference:

    docs/oar/c3_field/chamber_directories/lapis/seo_contracts/measures_registry_landing_seo_social_preview_contract_v1.meta.md

Mark SEO contract family for:

    /undrifted: seated
    /ai-operations-assessment: seated

Required state:

    landing_seo_contract_stack_state: seated
    seo_runtime_implementation_state: pending_oar2
    seo_route_head_state: not_implemented_by_this_oar
    sitemap_state: contract_seated_pending_implementation
    robots_state: contract_seated_pending_implementation

### 10. Mutation boundary

This OAR2 authorizes:

    local SEO contract file creation
    Lapis index update
    OAR1 closeout

This OAR2 does not authorize:

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

## CODY ROLE

Cody may:

    create SEO contract folder
    create SEO/social-preview contract file
    update Lapis Chamber Directory index
    preserve public copy boundaries
    write OAR1 closeout

Cody may not:

    mutate DB
    mutate route-head code
    mutate sitemap
    mutate robots
    implement runtime
    hardcode Supabase media URLs
    expose C1/C2/C3
    expose public Lapis language
    publish or schedule
    create active /structural-drift public authority
    route into Marble
    create payment/c3 Key/SRC/conversion/certification standing

## VALIDATION

Execution is valid only when:

1. SEO contract folder exists.
2. SEO/social-preview contract exists.
3. Contract defines canonical domain rule.
4. Contract defines /undrifted metadata.
5. Contract defines /ai-operations-assessment metadata.
6. Contract defines OG metadata for both routes.
7. Contract defines Twitter/X metadata for both routes.
8. Contract uses governed media keys only.
9. Contract prohibits hardcoded bucket URLs.
10. Contract defines sitemap requirements.
11. Contract defines robots requirements.
12. Contract requires /undrifted to resolve directly.
13. Contract requires /ai-operations-assessment to resolve directly.
14. Contract prohibits home fallback.
15. Contract prohibits C1/C2/C3 public metadata.
16. Contract prohibits public Lapis metadata.
17. Contract does not seat /structural-drift as second brand authority.
18. Lapis index references SEO contract.
19. No DB mutation occurs.
20. No route-head implementation occurs.
21. No sitemap/robots implementation occurs.
22. No runtime route implementation occurs.
23. No SEO/social/Paragraph/Buffer execution occurs.
24. No payment/wallet/c3 Key/SRC/certification/conversion/DAO/permission/recognition/distribution/Marble standing is created.
25. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/c3_field/chamber_directories/lapis/oar1_seat_measures_registry_landing_seo_social_preview_contracts_v1.meta.md

OAR1 must include:

    files created
    exact paths
    Lapis index update summary
    canonical domain standing
    /undrifted metadata standing
    /ai-operations-assessment metadata standing
    OG/Twitter image key standing
    sitemap contract standing
    robots contract standing
    no-DB-mutation confirmation
    no-route-head-mutation confirmation
    no-sitemap-robots-mutation confirmation
    no-runtime-change confirmation
    no-public-C1-C2-C3 confirmation
    no-public-Lapis confirmation
    no-structural-drift-brand-authority confirmation
    no-publish/no-schedule confirmation
    no-claims confirmation
    git status standing

## CLOSE

SEO is a contract surface before it is route-head code.

Social preview is governed media before it is public metadata.

Routes must resolve directly before they can be indexed cleanly.

Seated is not implemented.

OAR2 seats.
OAR1 proves.
