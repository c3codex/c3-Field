---
document_type: oar2
authority_level: working
document_scope: c3_field_chamber_directory_system_process
title: OAR2 — Seat Chamber Directory System-Process Surface and Run DB Schema Review v1
status: proposed
version: v1
operator: op044
system: c3_field
registration_authorized: false
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
  - lapis
  - obsidian
  - system-process
  - schema-review
  - seated-not-registered
  - codex-first
---

# OAR2 — Seat Chamber Directory System-Process Surface and Run DB Schema Review v1

## OBSERVED

The current Measures Registry public-site work exposed a missing system-process surface.

Public encounters now require grouped working contracts for:

    landing page design
    public encounter content
    media
    runtime/render behavior
    CTA transitions
    SEO
    Paragraph
    Buffer
    social distribution

These contracts should not float separately.

They should be held under a Chamber Directory.

Clarified model:

    Material family:
      Lapis, Obsidian, Crystal, Marble

    Chamber Directory:
      system-process working directory formed from contracts under a material family

    Registered Chamber Directory:
      same directory after DB / Measures registration and readback

Lapis is a material family, not the chamber itself.

A Lapis Chamber Directory may hold contracts related to relational positioning, public encounter routing, SEO, social distribution, Paragraph, Buffer, media, and CTA transitions.

This OAR2 does not register the Chamber Directory.

This OAR2 seats the Chamber Directory working surface and authorizes DB/schema review only.

## ALIGNED

Authority order remains:

    Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Seated does not mean registered.

OAR2 seats executable scope.

DB registers only after registration is authorized and readback confirms standing.

This OAR2 has:

    registration_authorized: false

Therefore Cody may inspect, create working directory files, and report schema findings.

Cody may not mutate DB operational state.

The Chamber Directory is a system-process surface in c3 Field.

It may later support Measures Registry, Measures of Inanna, Priceless Gallery, or other c3 Field branches.

## ROUTED

### 1. Create c3 Field Chamber Directory working surface

Create working directory:

    docs/oar/c3_field/chamber_directories/

Create material-family directory:

    docs/oar/c3_field/chamber_directories/lapis/

Create index file:

    docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md

The index must define:

    material_family: lapis
    system_process_surface: chamber_directory
    standing: seated_working_directory
    registration_state: not_registered
    public_facing: false
    authority: working_surface_only
    registration_authorized: false

### 2. Define what the Lapis Chamber Directory may hold

The index should list expected contract families:

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

For current Measures Registry work, likely first contracts include:

    /undrifted landing
    /ai-operations-assessment landing
    /structural-drift legacy trace
    unDrifted dispatch cards
    Paragraph @undrifted
    Buffer scheduler
    X / Instagram / LinkedIn distribution
    public preview media
    CTA relation to eval_passage

### 3. Define what the directory may not hold

The directory may not become:

    public brand
    public route
    DB authority
    publication authority
    landing page authority
    payment surface
    c3 Key surface
    certification surface
    conversion surface
    DAO surface
    Marble readiness surface

No public copy may expose:

    Lapis Chamber
    Enter Lapis
    Lapis SEO Chamber
    Lapis Distribution Chamber
    Lapis Landing Page

### 4. Query database / determine schema

Cody must inspect current DB/schema standing for where a Chamber Directory system-process surface should later be registered.

Inspect likely surfaces, if present:

    system_process_registry
    system_oar_queue
    system_oar_execution_evidence
    measures_registry
    measures_release_state
    measures_encounter_def
    measures_transition_rule
    any chamber/material registry surfaces
    any process/concordance/operative binding surfaces

Cody must report:

    tables inspected
    columns relevant to chamber directory registration
    existing Lapis/material/chamber rows
    existing process directory rows
    conflicts or duplicates
    recommended registration target
    whether schema supports direct registration
    whether migration/table addition would be required

### 5. Review before registration

Registration is not authorized in this OAR.

After DB/schema review, Cody must write OAR1 with findings.

Operator and Chazz review OAR1.

Only after review may a later OAR2 authorize registration.

### 6. DB mutation boundary

This OAR2 authorizes:

    local file/directory creation
    working index creation
    DB/schema inspection
    OAR1 closeout

This OAR2 does not authorize:

    DB mutation
    Chamber Directory registration
    Measures Registry route changes
    landing page design changes
    SEO mutation
    Paragraph draft/publish
    Buffer scheduling/posting
    social posting
    article body mutation
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

    create the c3 Field Chamber Directory working folder
    create Lapis Chamber Directory index
    inspect DB/schema surfaces
    report registration path options
    preserve seated-not-registered distinction
    write OAR1 closeout

Cody may not:

    register the Chamber Directory in DB
    mutate operational DB records
    create public Lapis UI
    expose Lapis public copy
    alter landing pages
    alter SEO/social/Paragraph/Buffer behavior
    mutate article bodies
    publish or schedule anything
    invent schema authority
    route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. c3 Field Chamber Directory working path exists.
2. Lapis Chamber Directory index exists.
3. Index states seated working directory, not registered.
4. registration_authorized remains false.
5. DB/schema surfaces are inspected.
6. Existing Lapis/chamber/material/process standing is reported.
7. Recommended registration target is reported.
8. No DB mutation occurs.
9. No public route behavior changes.
10. No landing page design changes occur.
11. No SEO/social/Paragraph/Buffer execution occurs.
12. No article body mutation occurs.
13. No Agents with Keys registration occurs.
14. No payment/wallet/c3 Key/SRC/certification/conversion/DAO/permission/recognition/distribution/Marble standing is created.
15. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/c3_field/chamber_directories/oar1_seat_chamber_directory_system_process_surface_and_run_db_schema_review_v1.meta.md

OAR1 must include:

    files created
    exact directory path
    index file standing
    DB/schema surfaces inspected
    existing Lapis/material/chamber records found
    registration target recommendation
    whether schema supports registration
    whether migration is required
    no-DB-mutation confirmation
    no-public-Lapis confirmation
    no-route-change confirmation
    no-publish/no-schedule confirmation
    git status standing

## CLOSE

Material family gives function.

Chamber Directory holds working contracts.

Registration comes after schema review.

Seated is not registered.

OAR2 seats.
DB registers only when authorized.
OAR1 proves.
