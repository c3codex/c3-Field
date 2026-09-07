---
document_type: chamber_directory_requirements_matrix
authority_level: working
document_scope: c3_field_chamber_directory_requirements
title: Chamber Directory Requirements Matrix v1
status: seated_working_matrix
version: v1
operator: op044
system: c3_field
registration_authorized: false
source_oar2: docs/oar/c3_field/chamber_directories/oar2_establish_chamber_directory_requirement_matrix_for_all_material_families_v1.meta.md
material_families:
  - lapis
  - obsidian
  - crystal
  - marble
tags:
  - chamber-directory
  - requirements-matrix
  - material-family
  - seated-not-registered
---

# Chamber Directory Requirements Matrix v1

## Standing

This matrix seats the shared Chamber Directory requirement model for all material families.

It does not register any Chamber Directory.

Registration remains unauthorized in this OAR.

## Shared Model

Material families:

    lapis
    obsidian
    crystal
    marble

Chamber Directory:

    system-process working directory formed from material-family contracts

Registration rule:

    A directory may not be registered until required contract families are seated, registered, held with reason, or explicitly not_applicable.

Standing rule:

    A seated directory is a working surface.
    A registered directory is DB / Measures readback-confirmed standing.
    Directory identity remains continuous across both states.

## Requirement Standing States

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

## Shared Requirement Families

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

## New-Surface Incorporation Rule

When a new surface is incorporated into any Chamber Directory, a matching contract family must be added before execution.

Examples:

    API used -> add api_contracts
    CLI used -> add cli_contracts
    SDK installed -> add sdk_contracts
    credentials or secrets used -> add secret_boundary_contracts
    posting or scheduling used -> add scheduler_contracts
    platform analytics used -> add analytics_contracts
    email send/receive used -> add email_contracts
    media or file storage used -> add storage_contracts

No new incorporated surface may execute from informal standing.

## Registration Readiness Gate

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

## Proof Requirements

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

## Dependency Map Requirement

Each Chamber Directory index must include upstream/downstream dependencies.

Dependencies must identify:

    surface_or_contract
    required_contract_families
    standing
    proof_requirements
    held_reason when standing is held

## Material-Family Starter Guidance

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

## DB Boundary

This matrix does not authorize DB mutation.

This matrix does not register any Chamber Directory.

This matrix does not create public route, public copy, landing design, SEO, Paragraph, Buffer, social, payment, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble readiness standing.
