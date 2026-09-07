---
document_type: oar2
authority_level: working
document_scope: ai_operations_assessment_lapis_chamber_contracts
title: OAR2 — Seat AI Operations Assessment Lapis Chamber Contracts v1
status: proposed
version: v1
operator: op044
system: measures_registry
registration_authorized: false
source_oar1:
  - docs/oar/c3_field/chamber_directories/oar1_register_lapis_chamber_directory_system_process_standing_v1.meta.md
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
  - ai-operations-assessment
  - lapis-chamber-directory
  - landing-page
  - style-contract
  - media-contract
  - runtime-contract
  - content-contract
  - cta-contract
  - seated-not-registered
---

# OAR2 — Seat AI Operations Assessment Lapis Chamber Contracts v1

## OBSERVED

The AI Operations Assessment landing page requires a governed public encounter contract stack before Cody renders or mutates runtime.

The page is public-facing at:

    /ai-operations-assessment

The page should tell the public-facing Measures Registry story:

    AI Isn’t Broken.
    Systems Are.

The page should frame apparent AI behavior as a possible reflection of system conditions, with emphasis on:

    agents
    keys
    systems
    access
    authority
    visibility
    control

Operator generated and uploaded assessment landing media to the Supabase bucket.

Confirmed media label:

    ai_isnt_broken_landing

Additional uploaded Supabase bucket assets:

    unDrifted logo
    unDrifted banner
    unDrifted favicon

The Lapis Chamber Directory is registered as a c3 Field system-process standing and may hold the required contract families for public landing, media, runtime, CTA, SEO, Paragraph, Buffer, and social distribution work.

This OAR2 seats the contract stack under the Lapis Chamber Directory.

This OAR2 does not authorize page implementation.

This OAR2 does not authorize DB media mapping mutation.

This OAR2 does not authorize route behavior changes.

## ALIGNED

Authority order remains:

    Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Seated does not mean registered.

This OAR2 has:

    registration_authorized: false

Therefore this OAR2 may create or update local chamber contract files only.

Cody may not mutate DB state.

Cody may not render the page yet.

Cody may not hardcode media URLs.

Cody may not use Supabase bucket object paths directly as frontend authority.

The page must remain a public Measures Registry encounter, not a public Lapis chamber.

Public-facing language may include:

    Measures Registry
    AI Operations Assessment
    AI Isn’t Broken. Systems Are.
    Assess the Environment
    Read unDrifted

Public-facing language may not include:

    Lapis Chamber
    Enter Lapis
    Chamber Directory
    c3 Field system-process
    SRC
    c3 Key
    Measures Conversion
    Registry Certification
    Marble readiness

## ROUTED

### 1. Create Lapis Chamber contract folders

Create or ensure the following folders exist:

    docs/oar/c3_field/chamber_directories/lapis/public_encounter_contracts/
    docs/oar/c3_field/chamber_directories/lapis/landing_page_design_contracts/
    docs/oar/c3_field/chamber_directories/lapis/content_contracts/
    docs/oar/c3_field/chamber_directories/lapis/media_contracts/
    docs/oar/c3_field/chamber_directories/lapis/runtime_render_contracts/
    docs/oar/c3_field/chamber_directories/lapis/cta_transition_contracts/

### 2. Create public encounter contract

Create:

    docs/oar/c3_field/chamber_directories/lapis/public_encounter_contracts/ai_operations_assessment_public_encounter_contract_v1.meta.md

Required standing:

    contract_key: ai_operations_assessment_public_encounter_contract_v1
    route_path: /ai-operations-assessment
    encounter_role: public_assessment_entry
    public_facing: true
    material_primary: obsidian
    material_support: lapis
    parent_directory: c3_field_chamber_directory_lapis_v1
    registration_state: seated_not_registered
    claim_boundary: informational_initial_review

Purpose:

    Define AI Operations Assessment as a public Measures Registry encounter that introduces assessment entry without exposing internal conversion architecture or implying certification, conversion, payment, c3 Key issuance, DAO standing, or formal governance determination.

Required public premise:

    AI Isn’t Broken.
    Systems Are.

Core story:

    When AI acts outside intent, the model is not always the source condition.
    The surrounding environment, access boundaries, keys, roles, and systems may be shaping the behavior.

### 3. Create content contract

Create:

    docs/oar/c3_field/chamber_directories/lapis/content_contracts/ai_operations_assessment_landing_content_contract_v1.meta.md

Required copy:

    eyebrow:
      AI Operations Assessment

    hero_headline:
      AI Isn’t Broken.
      Systems Are.

    subhead:
      AI behavior does not happen in isolation. What appears as a model issue may reflect conditions in the surrounding system.

    tool_statement:
      The AI Operations Assessment is a complimentary tool provided by Measures Registry to help organizations assess the environments where AI is deployed.

    disclaimer:
      Assessment results are informational and intended to support initial review.

    primary_cta:
      Assess the Environment

    secondary_cta:
      Read unDrifted

Required micro-story row:

    Agents
      are executing.

    Keys
      grant authority.

    Systems
      determine outcomes.

Diagnostic section title:

    What the Environment Reveals

Diagnostic cards:

    Unbounded access
      Keys exist without boundaries. Agents can act beyond intended authority.

    Unclear authority
      Too many sources. No single place of truth for critical decisions.

    Operational drift
      Systems change. Permissions, roles, and behaviors fall out of sync.

    Poor observability
      Blind spots across logs, actions, and outputs hide real risk.

    Untamed automation
      Agents and workflows run without review, guardrails, or accountability.

CTA band:

    See where control lives. Uncover what’s at risk. Begin with visibility.

Claims boundary:

    Allowed:
      - complimentary assessment tool
      - informational initial review
      - helps organizations assess environments where AI is deployed
      - AI behavior may reflect surrounding system conditions

    Disallowed:
      - certification
      - compliance approval
      - conversion
      - c3 MAP completion
      - payment readiness
      - c3 Key issuance
      - permission standing
      - recognition standing
      - DAO standing
      - Marble readiness

### 4. Create landing design / style contract

Create:

    docs/oar/c3_field/chamber_directories/lapis/landing_page_design_contracts/ai_operations_assessment_landing_style_contract_v1.meta.md

Required style standing:

    contract_key: ai_operations_assessment_landing_style_contract_v1
    style_role: cinematic_public_assessment_threshold
    visual_family: obsidian_primary_with_lapis_signal_support
    public_facing: true
    text_embedded_in_media: false

Visual direction:

    dark cinematic chamber
    blue / lapis signal geometry
    central keyhole or access-threshold motif
    agents / keys / systems visual logic
    reflective graphite/obsidian floor
    institutional scale
    controlled glow
    high contrast
    restrained UI
    no gold temple styling
    no beige compliance styling
    no generic SaaS page
    no robot stock imagery
    no public chamber language

Page layout:

    desktop:
      - full-width hero
      - media-led background
      - text overlay on left side
      - central/right visual threshold remains visible
      - top nav restrained
      - primary CTA under hero copy
      - secondary CTA inline or adjacent
      - diagnostic cards below hero
      - final CTA band below cards

    mobile:
      - hero image remains background or top visual
      - text stacks above fold where possible
      - keyhole/threshold crop remains centered
      - CTA remains visible without horizontal overflow
      - diagnostic cards stack vertically

Placement rules:

    hero media:
      desktop:
        position: center right
        size: cover
        focal_point: central keyhole / threshold
        overlay: left-to-right dark gradient for copy readability

      mobile:
        position: center
        size: cover
        focal_point: keyhole / figure / threshold
        overlay: full dark veil behind text

    hero copy:
      desktop:
        max_width: 42 percent of viewport
        align: left
        vertical_position: center
        z_index: above media overlay

      mobile:
        max_width: 100 percent
        align: left
        padding: compact
        z_index: above media overlay

    diagnostic cards:
      real HTML components
      not flattened into image
      thin cyan/lapis border
      graphite transparent panel
      short title
      concise body

    buttons:
      primary: filled or high-emphasis lapis/cyan-blue
      secondary: text/link style
      hover: restrained glow or underline only

### 5. Create media contract

Create:

    docs/oar/c3_field/chamber_directories/lapis/media_contracts/ai_operations_assessment_landing_media_contract_v1.meta.md

Required media standing:

    primary_hero_media_label:
      ai_isnt_broken_landing

    intended_media_key:
      ai_operations_assessment_hero_chamber_v1

    bucket_status:
      uploaded_to_supabase_by_operator

    usage:
      - /ai-operations-assessment hero background
      - assessment landing visual source
      - possible Open Graph preview candidate after review
      - possible social preview candidate after review

    alt_text:
      Dark institutional chamber with blue signal geometry, a central keyhole threshold, and a silhouetted figure approaching governed access.

    text_in_image:
      false

    runtime_text_source:
      HTML / Codex-governed copy overlay

Media mapping requirements for future implementation:

    - resolve media from governed media mapping
    - do not hardcode Supabase bucket URL in component
    - do not use /mnt/data path
    - do not invent fallback media
    - if media mapping is missing, render honest missing-media state

Additional brand media candidates:

    undrifted_logo:
      usage:
        - secondary route / unDrifted reference
        - article/publication connection
        - do not replace Measures Registry parent authority

    undrifted_banner:
      usage:
        - possible unDrifted CTA preview
        - possible social preview
        - not assessment hero replacement

    undrifted_favicon:
      usage:
        - favicon / route-head candidate only if route-head contract later authorizes

### 6. Create runtime render contract

Create:

    docs/oar/c3_field/chamber_directories/lapis/runtime_render_contracts/ai_operations_assessment_landing_runtime_render_contract_v1.meta.md

Required runtime standing:

    route_path:
      /ai-operations-assessment

    route_role:
      public_assessment_landing

    landing_behavior:
      opens directly to landing page
      no home fallback
      no intro fallback
      no ?surface dependency for landing route

    media_behavior:
      hero media resolves by governed media key
      media is background/visual field
      text renders as HTML overlay
      buttons are real components
      diagnostic cards are real components

    primary_cta_target:
      registered assessment entry / eval_passage

    required handoff:
      must not bypass contact gate
      must not bypass assessment runtime
      must not bypass result gate

    secondary_cta_target:
      /undrifted

Disallowed runtime behavior:

    - whole page as one flat image
    - invisible click zones as primary navigation
    - media path hardcoding
    - invented fallback copy
    - unregistered CTA targets
    - direct scoring shortcut
    - route into payment
    - route into c3 Key
    - route into Marble

### 7. Create CTA transition contract

Create:

    docs/oar/c3_field/chamber_directories/lapis/cta_transition_contracts/ai_operations_assessment_cta_transition_contract_v1.meta.md

Required CTA standing:

    primary_cta:
      label: Assess the Environment
      from: /ai-operations-assessment
      to: eval_passage
      relation: landing_to_registered_assessment_entry
      boundary:
        - no bypass of contact gate
        - no bypass of assessment runtime
        - no bypass of result gate

    secondary_cta:
      label: Read unDrifted
      from: /ai-operations-assessment
      to: /undrifted
      relation: assessment_landing_to_publication_landing

Optional media-zone rule:

    central keyhole / threshold area may become a governed CTA overlay only if:
      - accessible label is present
      - keyboard navigation is supported
      - visual focus state is present
      - it duplicates primary CTA behavior only
      - it does not replace real CTA button

### 8. Update Lapis Chamber Directory index

Update:

    docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md

Add references to the newly seated AI Operations Assessment contracts.

Mark relevant contract families for this route as:

    public_encounter_contracts: seated
    landing_page_design_contracts: seated
    content_contracts: seated
    media_contracts: seated
    runtime_render_contracts: seated
    cta_transition_contracts: seated

Do not mark DB registration complete.

Do not mark runtime implementation complete.

Do not mark media mapping registered.

Required state:

    registration_state: registered_directory
    contract_stack_state: assessment_landing_contracts_seated
    media_mapping_state: pending_registration
    runtime_implementation_state: pending_oar2
    public_render_state: not_implemented_by_this_oar

### 9. DB mutation boundary

This OAR2 authorizes:

    local chamber contract file creation
    Lapis directory index update
    contract seating documentation
    OAR1 closeout

This OAR2 does not authorize:

    DB mutation
    media mapping registration
    route implementation
    landing page source changes
    SEO route-head mutation
    Paragraph draft/publish
    Buffer scheduling/posting
    social posting
    article body mutation
    assessment question mutation
    scoring logic mutation
    contact gate mutation
    result gate mutation
    Agents with Keys registration
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

    create Lapis chamber contract folders
    create AI Operations Assessment public encounter contract
    create landing content contract
    create landing style contract
    create media contract
    create runtime render contract
    create CTA transition contract
    update Lapis Chamber Directory index
    preserve seated vs registered distinction
    write OAR1 closeout

Cody may not:

    mutate DB
    register media mappings
    alter /ai-operations-assessment runtime
    alter route behavior
    hardcode Supabase media URLs
    create public Lapis UI
    expose Lapis public copy
    alter SEO/social/Paragraph/Buffer behavior
    mutate article bodies
    publish or schedule anything
    register Agents with Keys
    route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. Public encounter contract file exists.
2. Landing content contract file exists.
3. Landing style contract file exists.
4. Media contract file exists.
5. Runtime render contract file exists.
6. CTA transition contract file exists.
7. Lapis index references the new assessment contract stack.
8. Media label `ai_isnt_broken_landing` is documented.
9. Contract states text is not embedded in media.
10. Contract states media must resolve by governed mapping later.
11. Contract states no hardcoded Supabase URL.
12. Contract states primary CTA routes to registered assessment entry.
13. Contract states secondary CTA routes to `/undrifted`.
14. Contract states no contact/result gate bypass.
15. Contract states no public Lapis language.
16. No DB mutation occurs.
17. No media mapping registration occurs.
18. No runtime implementation occurs.
19. No route behavior changes.
20. No SEO/social/Paragraph/Buffer execution occurs.
21. No article body mutation occurs.
22. No Agents with Keys registration occurs.
23. No payment/wallet/c3 Key/SRC/certification/conversion/DAO/permission/recognition/distribution/Marble standing is created.
24. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/c3_field/chamber_directories/lapis/oar1_seat_ai_operations_assessment_lapis_chamber_contracts_v1.meta.md

OAR1 must include:

    files created
    exact paths
    Lapis index update summary
    content contract standing
    style contract standing
    media contract standing
    runtime contract standing
    CTA contract standing
    media label confirmation: ai_isnt_broken_landing
    no-DB-mutation confirmation
    no-media-mapping-registration confirmation
    no-runtime-change confirmation
    no-route-change confirmation
    no-public-Lapis confirmation
    no-publish/no-schedule confirmation
    no-claims confirmation
    git status standing

## CLOSE

The media is uploaded.

The page contracts seat first.

Media mapping registers later.

Runtime renders later.

Lapis Chamber Directory holds the contract stack.

Seated is not registered.

OAR2 seats.
DB registers only when authorized.
OAR1 proves.
