---
document_type: oar1
authority_level: closeout
document_scope: c3_field_chamber_directory_requirements
title: OAR1 - Establish Chamber Directory Requirement Matrix for All Material Families v1
status: completed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/chamber_directories/oar2_establish_chamber_directory_requirement_matrix_for_all_material_families_v1.meta.md
registration_authorized: false
completed_at: 2026-06-06
tags:
  - oar1
  - c3-field
  - chamber-directory
  - material-family
  - requirements-matrix
  - seated-not-registered
---

# OAR1 - Establish Chamber Directory Requirement Matrix for All Material Families v1

## Standing

Completed.

This OAR1 proves local requirement-matrix seating for all material-family Chamber Directories.

No DB mutation occurred.

No Chamber Directory registration occurred in this OAR.

## Files Created Or Updated

Created:

    docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md
    docs/oar/c3_field/chamber_directories/obsidian/obsidian_chamber_directory_index_v1.meta.md
    docs/oar/c3_field/chamber_directories/crystal/crystal_chamber_directory_index_v1.meta.md
    docs/oar/c3_field/chamber_directories/marble/marble_chamber_directory_index_v1.meta.md
    docs/oar/c3_field/chamber_directories/oar1_establish_chamber_directory_requirement_matrix_for_all_material_families_v1.meta.md

Updated:

    docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md

Directory paths confirmed:

    docs/oar/c3_field/chamber_directories/lapis/
    docs/oar/c3_field/chamber_directories/obsidian/
    docs/oar/c3_field/chamber_directories/crystal/
    docs/oar/c3_field/chamber_directories/marble/

## Matrix Standing

Matrix file:

    docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

Matrix standing:

    status: seated_working_matrix
    registration_authorized: false

Matrix defines material families:

    lapis
    obsidian
    crystal
    marble

Matrix defines the Chamber Directory as:

    system-process working directory formed from material-family contracts

Matrix registration rule:

    A directory may not be registered until required contract families are seated, registered, held with reason, or explicitly not_applicable.

Matrix standing rule:

    seated directory is a working surface
    registered directory is DB / Measures readback-confirmed standing
    directory identity remains continuous across both states

## Index Standing

Lapis index:

    path: docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md
    material_family: lapis
    standing: seated_working_directory
    registration_state: not_registered
    registration_authorized: false
    requirements_matrix_reference: docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

Lapis note:

    The index preserves separate prior process readback for c3_field_chamber_directory_lapis_v1.
    This matrix OAR did not perform new DB registration.

Obsidian index:

    path: docs/oar/c3_field/chamber_directories/obsidian/obsidian_chamber_directory_index_v1.meta.md
    material_family: obsidian
    standing: seated_working_directory
    registration_state: not_registered
    registration_authorized: false
    requirements_matrix_reference: docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

Crystal index:

    path: docs/oar/c3_field/chamber_directories/crystal/crystal_chamber_directory_index_v1.meta.md
    material_family: crystal
    standing: seated_working_directory
    registration_state: not_registered
    registration_authorized: false
    requirements_matrix_reference: docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

Marble index:

    path: docs/oar/c3_field/chamber_directories/marble/marble_chamber_directory_index_v1.meta.md
    material_family: marble
    standing: seated_working_directory
    registration_state: not_registered
    registration_authorized: false
    requirements_matrix_reference: docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md

## Requirement States Confirmed

The matrix defines:

    missing
    needed
    drafted
    seated
    registered
    held
    not_applicable
    deprecated

Each material-family index uses the shared standing vocabulary for requirement-family entries.

## Shared Contract Families Confirmed

The matrix lists:

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

## New-Surface Incorporation Rule Confirmed

The matrix requires matching contract families before execution when new surfaces are incorporated:

    API -> api_contracts
    CLI -> cli_contracts
    SDK -> sdk_contracts
    credentials/secrets -> secret_boundary_contracts
    posting/scheduling -> scheduler_contracts
    analytics -> analytics_contracts
    email -> email_contracts
    media/file storage -> storage_contracts

No new incorporated surface may execute from informal standing.

## Registration Readiness Gate Confirmed

The matrix states that registration may not be considered until:

    all known required contract families are listed
    no required family is missing
    each required family is seated, registered, held with reason, or not_applicable
    new incorporated surfaces have matching contract entries
    public/private boundaries are explicit
    authority boundaries are explicit
    proof requirements are defined
    no DB registration is claimed without readback
    registration_authorized is true in a later OAR2

Registration readiness does not itself register the directory.

## Proof Requirements Confirmed

The matrix defines allowed proof types:

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

## Dependency Map Requirement Confirmed

The matrix requires each Chamber Directory index to include upstream/downstream dependencies.

Lapis initial dependency map includes:

    /undrifted
    /ai-operations-assessment
    /structural-drift legacy trace

Obsidian, Crystal, and Marble indexes include starter dependency maps aligned to their material-family starter guidance.

## Material-Family Starter Guidance Confirmed

The matrix includes starter guidance for:

    Lapis:
      relational positioning, public encounter adjacency, landing/SEO/Paragraph/Buffer/social/CTA/media preview relation

    Obsidian:
      threshold, passage, evaluation, question runtime, contact gate, result gate, scoring, reduction/passage media contracts

    Crystal:
      intro, hero, recognition/identity, opening encounter, resonance/tone, brand entry media contracts

    Marble:
      governance, commerce/payment held, certification held, permission held, recognition held, distribution held, c3 Key readiness, DAO/governance readiness contracts

Starter guidance does not register operational state.

## Boundary Confirmation

No DB mutation occurred.

No Chamber Directory registration occurred in this OAR.

No public material-family copy was created.

No public chamber UI was created.

No route behavior changed.

No landing page design changed.

No content mutation occurred.

No media mutation occurred.

No runtime mutation occurred.

No SEO mutation occurred.

No Paragraph draft or publish occurred.

No Buffer schedule or post occurred.

No social post occurred.

No article body mutation occurred.

No Agents with Keys registration occurred.

No assessment mutation occurred.

No payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble readiness standing was created.

## Validation

Validation performed:

    Test-Path docs/oar/c3_field/chamber_directories/chamber_directory_requirements_matrix_v1.meta.md
    Test-Path docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md
    Test-Path docs/oar/c3_field/chamber_directories/obsidian/obsidian_chamber_directory_index_v1.meta.md
    Test-Path docs/oar/c3_field/chamber_directories/crystal/crystal_chamber_directory_index_v1.meta.md
    Test-Path docs/oar/c3_field/chamber_directories/marble/marble_chamber_directory_index_v1.meta.md
    rg required standing and matrix terms across all five files
    git diff --check -- docs/oar/c3_field/chamber_directories

Validation passed.

No TypeScript, build, route-head, browser, API, or DB validation was required because this OAR created and updated local process files only.

## Git Standing

Working tree already contained prior Measures Registry and Chamber Directory packages.

This OAR added or updated only Chamber Directory requirement-matrix files and this OAR1 closeout.

No commit or push was performed.

## Closeout

Each material family now has a Chamber Directory index.

The shared requirements matrix is seated.

Contracts seat before directory registration.

Directory registration waits for readiness and a later OAR2 with registration authorization.
