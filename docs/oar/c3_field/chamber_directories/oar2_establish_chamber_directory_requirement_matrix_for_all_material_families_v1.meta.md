---
document_type: oar2
authority_level: working
document_scope: c3_field_chamber_directory_requirements
title: OAR2 — Establish Chamber Directory Requirement Matrix for All Material Families v1
status: proposed
version: v1
operator: op044
system: c3_field
registration_authorized: false
source_oar1:
  - docs/oar/c3_field/chamber_directories/oar1_seat_chamber_directory_system_process_surface_and_run_db_schema_review_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: system_process_executor
  src: renderer
tags:
  - oar2
  - c3-field
  - chamber-directory
  - material-family
  - lapis
  - obsidian
  - crystal
  - marble
  - requirements-matrix
  - seated-not-registered
  - hardening-control
---

# OAR2 — Establish Chamber Directory Requirement Matrix for All Material Families v1

## OBSERVED

The Lapis Chamber Directory has been seated as a c3 Field local working directory:

    docs/oar/c3_field/chamber_directories/lapis/

The prior schema review confirmed:

    Lapis Chamber Directory is seated only.
    Lapis Chamber Directory is not registered.
    Minimal future registration can be supported through public.system_process_registry.
    No DB mutation occurred.

During review, operator clarified the broader system-process pattern:

    Lapis is a material family.
    Obsidian is a material family.
    Crystal is a material family.
    Marble is a material family.

Each material family may have its own Chamber Directory.

A Chamber Directory is a system-process working surface that holds contracts before registration.

The directory remains the same directory before and after registration.

Registration changes standing, not identity.

Current need:

    Establish a shared Chamber Directory requirement matrix for all material families.
    Require each Chamber Directory to show what it must hold before registration is allowed.
    Prevent DB registration while required contract families are missing.
    Allow new incorporated surfaces such as API, CLI, SDK, webhook, auth, secret, scheduler, analytics, email, or storage to create new required contract entries.

This OAR2 does not authorize DB registration.

## ALIGNED

Authority order remains:

    Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Process-language standing applies:

    Thread proposes.
    OAR2 seats.
    Cody executes.
    DB registers.
    src renders.
    Validation verifies.
    OAR1 proves.
    Operator closes.

Seated does not mean registered.

This OAR2 has:

    registration_authorized: false

Therefore this OAR2 may create and update working directory/index files only.

No DB mutation is authorized.

No Chamber Directory registration is authorized.

The Chamber Directory pattern is c3 Field system process.

It may later support:

    Measures Registry
    Measures of Inanna
    Priceless Gallery
    c3 DAO
    other c3 Field branches

## ROUTED

### 1. Create shared Chamber Directory requirements matrix

Create:

    docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

The matrix must define the shared Chamber Directory model:

    material_family:
      - lapis
      - obsidian
      - crystal
      - marble

    chamber_directory:
      system-process working directory formed from material-family contracts

    registration_rule:
      directory may not be registered until required contract families are seated, registered, held with reason, or explicitly not_applicable

    standing_rule:
      seated directory is a working surface
      registered directory is DB/Measures readback-confirmed standing
      directory identity remains continuous across both states

### 2. Establish material-family directories

Ensure these directories exist:

    docs/oar/c3_field/chamber_directories/lapis/
    docs/oar/c3_field/chamber_directories/obsidian/
    docs/oar/c3_field/chamber_directories/crystal/
    docs/oar/c3_field/chamber_directories/marble/

If an index does not exist, create it:

    lapis/lapis_chamber_directory_index_v1.meta.md
    obsidian/obsidian_chamber_directory_index_v1.meta.md
    crystal/crystal_chamber_directory_index_v1.meta.md
    marble/marble_chamber_directory_index_v1.meta.md

If the Lapis index already exists, update it without overwriting prior standing.

Each index must include:

    material_family
    system_process_surface: chamber_directory
    standing: seated_working_directory
    registration_state: not_registered
    public_facing: false
    authority: working_surface_only
    registration_authorized: false
    requirements_matrix_reference:
      docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

### 3. Define requirement standing states

All Chamber Directory requirement matrices must use these standing states:

    missing
    needed
    drafted
    seated
    registered
    held
    not_applicable
    deprecated

Definitions:

    missing:
      required or suspected requirement has no contract surface yet

    needed:
      requirement is recognized and must be drafted

    drafted:
      contract exists in working draft but is not approved

    seated:
      contract is approved through OAR2 or accepted working standing

    registered:
      contract or directory standing is written to DB/registry and confirmed by readback

    held:
      intentionally paused with reason

    not_applicable:
      explicitly reviewed and determined unnecessary for this chamber directory

    deprecated:
      former requirement preserved for trace but no longer active

### 4. Define shared requirement families

All Chamber Directories should support these possible requirement families, with applicability decided per material family:

    public_encounter_contracts
    landing_page_design_contracts
    content_contracts
    media_contracts
    runtime_render_contracts
    cta_transition_contracts
    seo_contracts
    paragraph_contracts
    buffer_contracts
    social_distribution_contracts
    api_contracts
    cli_contracts
    sdk_contracts
    webhook_contracts
    auth_contracts
    secret_boundary_contracts
    scheduler_contracts
    analytics_contracts
    email_contracts
    storage_contracts
    validation_contracts
    evidence_contracts
    oar_contracts

### 5. Define new-surface incorporation rule

When a new surface is incorporated into any chamber directory, a matching contract family must be added before execution.

Examples:

    If an API is used:
      add api_contracts

    If a CLI is used:
      add cli_contracts

    If an SDK is installed:
      add sdk_contracts

    If credentials or secrets are used:
      add secret_boundary_contracts

    If posting or scheduling is used:
      add scheduler_contracts

    If platform analytics are used:
      add analytics_contracts

    If email send/receive is used:
      add email_contracts

    If media or file storage is used:
      add storage_contracts

No new incorporated surface may execute from informal standing.

### 6. Define registration readiness gate

A Chamber Directory may not be registered until:

    all known required contract families are listed
    no required family is missing
    each required family is one of:
      - seated
      - registered
      - held with reason
      - not_applicable

    new incorporated surfaces have matching contract entries
    public/private boundaries are explicit
    authority boundaries are explicit
    proof requirements are defined
    no DB registration is claimed without readback
    registration_authorized is true in a later OAR2

Registration readiness does not itself register the directory.

It only permits a later registration OAR2 to be validly considered.

### 7. Define proof requirements per contract family

Each contract family must declare its proof requirement.

Allowed proof types:

    file_exists
    OAR2_exists
    OAR1_exists
    DB_readback
    route_head_validation
    hydrated_browser_validation
    runtime_validation
    API_read_only_validation
    API_write_validation
    no_secret_exposure_check
    no_public_authority_bleed_check
    no_claims_boundary_check
    git_diff_check
    build_validation
    TypeScript_validation

### 8. Define dependency map requirement

Each Chamber Directory index must include upstream/downstream dependencies.

For Lapis current Measures Registry use, initial dependencies should include:

    /undrifted depends on:
      - content_contracts
      - landing_page_design_contracts
      - media_contracts
      - runtime_render_contracts
      - seo_contracts
      - paragraph_contracts
      - buffer_contracts
      - social_distribution_contracts
      - cta_transition_contracts

    /ai-operations-assessment depends on:
      - content_contracts
      - landing_page_design_contracts
      - media_contracts
      - runtime_render_contracts
      - cta_transition_contracts
      - validation_contracts

    /structural-drift legacy trace depends on:
      - runtime_render_contracts
      - seo_contracts
      - cta_transition_contracts
      - no_public_authority_bleed_check

### 9. Material-family starter guidance

Lapis likely holds:

    relational positioning
    public encounter adjacency
    landing page relation
    SEO relation
    Paragraph relation
    Buffer relation
    social distribution relation
    CTA transitions
    media preview relation

Obsidian likely holds:

    threshold contracts
    passage contracts
    evaluation contracts
    question runtime contracts
    contact gate contracts
    result gate contracts
    assessment scoring contracts
    reduction/passage media contracts

Crystal likely holds:

    intro contracts
    hero contracts
    recognition/identity contracts
    opening encounter contracts
    resonance/tone contracts
    brand entry media contracts

Marble likely holds:

    governance contracts
    commerce/payment held contracts
    certification held contracts
    permission held contracts
    recognition held contracts
    distribution held contracts
    c3 Key readiness contracts
    DAO/governance readiness contracts

These are starter guidance only.

They do not register operational state.

They may be refined through future OARs.

### 10. DB mutation boundary

This OAR2 authorizes:

    local directory creation
    shared requirements matrix creation
    material-family index creation/update
    no-registration standing
    OAR1 closeout

This OAR2 does not authorize:

    DB mutation
    Chamber Directory registration
    route changes
    landing page design changes
    content mutation
    media mutation
    runtime mutation
    SEO mutation
    Paragraph draft/publish
    Buffer scheduling/posting
    social posting
    article body mutation
    Agents with Keys registration
    assessment mutation
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

    create or update local chamber directory files
    create shared requirements matrix
    create missing material-family directory indexes
    update Lapis index without erasing prior standing
    define requirement states
    define registration readiness gate
    define new-surface incorporation rule
    define proof requirements
    write OAR1 closeout

Cody may not:

    mutate DB
    register any Chamber Directory
    create public chamber UI
    expose material-family labels as public copy
    alter Measures Registry routes
    alter landing page designs
    alter SEO/social/Paragraph/Buffer behavior
    mutate article bodies
    publish or schedule anything
    invent schema authority
    route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. chamber_directory_requirements_matrix_v1.meta.md exists.
2. Lapis directory index exists and references the matrix.
3. Obsidian directory index exists and references the matrix.
4. Crystal directory index exists and references the matrix.
5. Marble directory index exists and references the matrix.
6. Each index states seated_working_directory.
7. Each index states registration_state: not_registered.
8. Each index states registration_authorized: false.
9. Requirement standing states are defined.
10. Shared contract families are listed.
11. New-surface incorporation rule is defined.
12. Registration readiness gate is defined.
13. Proof requirements are defined.
14. Dependency map requirement is defined.
15. Material-family starter guidance is included.
16. No DB mutation occurs.
17. No Chamber Directory registration occurs.
18. No public route behavior changes.
19. No landing page design changes occur.
20. No SEO/social/Paragraph/Buffer execution occurs.
21. No article body mutation occurs.
22. No Agents with Keys registration occurs.
23. No payment/wallet/c3 Key/SRC/certification/conversion/DAO/permission/recognition/distribution/Marble standing is created.
24. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/c3_field/chamber_directories/oar1_establish_chamber_directory_requirement_matrix_for_all_material_families_v1.meta.md

OAR1 must include:

    files created or updated
    exact directory paths
    matrix standing
    index standing for lapis
    index standing for obsidian
    index standing for crystal
    index standing for marble
    requirement states confirmed
    registration readiness gate confirmed
    new-surface incorporation rule confirmed
    proof requirements confirmed
    no-DB-mutation confirmation
    no-registration confirmation
    no-public-material-family-copy confirmation
    no-route-change confirmation
    no-design-change confirmation
    no-publish/no-schedule confirmation
    git status standing

## CLOSE

Each material family holds its own Chamber Directory.

Each Chamber Directory holds its own contracts.

Contracts seat before directory registration.

Directory registration waits for requirement readiness.

Seated is not registered.

OAR2 seats.
DB registers only when authorized.
OAR1 proves.
