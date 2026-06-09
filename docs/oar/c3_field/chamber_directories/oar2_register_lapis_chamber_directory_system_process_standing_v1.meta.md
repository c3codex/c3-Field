---
document_type: oar2
authority_level: working
document_scope: c3_field_chamber_directory_registration
title: OAR2 — Register Lapis Chamber Directory System-Process Standing v1
status: proposed
version: v1
operator: op044
system: c3_field
registration_authorized: true
source_oar1:
  - docs/oar/c3_field/chamber_directories/oar1_seat_chamber_directory_system_process_surface_and_run_db_schema_review_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: system_process_registry_executor
  src: renderer
tags:
  - oar2
  - c3-field
  - chamber-directory
  - lapis
  - system-process
  - db-registration
  - seated-to-registered
  - codex-first
---

# OAR2 — Register Lapis Chamber Directory System-Process Standing v1

## OBSERVED

The Lapis Chamber Directory has been seated as a local c3 Field working directory:

    docs/oar/c3_field/chamber_directories/lapis/

The index exists:

    docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md

The schema review artifact exists:

    docs/oar/c3_field/chamber_directories/chamber_directory_db_schema_review_v1.json

The prior OAR1 confirmed:

    registration_authorized: false
    no DB mutation occurred
    no Chamber Directory registration occurred
    no public Lapis copy was created
    no public route behavior changed

DB/schema review found:

    public.system_process_registry supports minimal system-process registration without migration.

Recommended registration target:

    public.system_process_registry

Recommended process identity:

    process_key: c3_field_chamber_directory_lapis_v1
    process_family: chamber_directory
    process_title: Lapis Chamber Directory
    process_scope: docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md

This OAR2 authorizes registration of the already-seated Lapis Chamber Directory as a c3 Field system-process standing.

This OAR2 does not authorize landing page design work.

This OAR2 does not authorize public route changes, SEO mutation, Paragraph draft/publish, Buffer scheduling/posting, social posting, or article mutation.

## ALIGNED

Authority order remains:

    Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Process-language standing applies:

    Seated does not mean registered.
    OAR2 seats.
    DB registers.
    OAR1 proves.

This OAR2 has:

    registration_authorized: true

Registration is authorized only for:

    Lapis Chamber Directory system-process standing
    target table: public.system_process_registry
    related process metadata
    readback proof

The Chamber Directory remains:

    system-process surface
    internal working directory
    non-public
    non-route authority
    non-publication authority
    non-landing-page authority

The directory remains the same directory after registration.

Registration changes standing, not identity.

## ROUTED

### 1. Register system-process standing

Register or update a row in:

    public.system_process_registry

Required standing:

    process_key: c3_field_chamber_directory_lapis_v1
    process_title: Lapis Chamber Directory
    process_family: chamber_directory
    process_scope: docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md
    process_status: active
    authority_level: working
    required_oar_type: both
    requires_operator_confirm: true
    requires_preflight: true
    requires_oar1_closeout: true

Required metadata:

    material_family: lapis
    system_process_surface: chamber_directory
    registration_state: registered_after_readback
    public_facing: false
    authority: system_process_surface
    working_directory_path: docs/oar/c3_field/chamber_directories/lapis/
    index_path: docs/oar/c3_field/chamber_directories/lapis/lapis_chamber_directory_index_v1.meta.md
    source_oar1: docs/oar/c3_field/chamber_directories/oar1_seat_chamber_directory_system_process_surface_and_run_db_schema_review_v1.meta.md
    contract_families:
      - public_encounter_contracts
      - landing_page_design_contracts
      - content_contracts
      - media_contracts
      - runtime_render_contracts
      - cta_transition_contracts
      - seo_contracts
      - paragraph_contracts
      - buffer_contracts
      - social_distribution_contracts
    current_branch_use:
      - measures_registry_public_landing
      - undrifted_publication
      - ai_operations_assessment
      - structural_drift_legacy_trace
    disallowed_authority:
      - public_brand
      - public_route
      - db_authority
      - publication_authority
      - landing_page_authority
      - payment_surface
      - c3_key_surface
      - certification_surface
      - conversion_surface
      - dao_surface
      - marble_readiness_surface

### 2. Avoid duplicate registration

Before insert/update, inspect:

    public.system_process_registry

Check for existing rows matching:

    process_key = c3_field_chamber_directory_lapis_v1

If found:

    update only missing/incomplete metadata
    do not create duplicate process standing

If not found:

    insert the system-process row

### 3. Preserve distinction from Measures runtime rows

Do not register this Chamber Directory in:

    public.measures_registry

The prior schema review found runtime-facing rows such as:

    antechamber_directory
    epithet_directory
    obsidian_directory
    obsidian_chamber

Those rows are Measures runtime/encounter surfaces.

They are not the target for this c3 Field system-process Chamber Directory.

This OAR2 registers the Lapis Chamber Directory only as a system-process standing.

### 4. No public Lapis exposure

Do not expose public copy:

    Lapis Chamber
    Enter Lapis
    Lapis SEO Chamber
    Lapis Distribution Chamber
    Lapis Landing Page

Allowed internal metadata only:

    lapis
    Lapis Chamber Directory
    material_family: lapis
    system_process_surface: chamber_directory

### 5. No execution queue required unless existing process requires it

Do not create `system_oar_queue` or `system_oar_execution_evidence` rows unless current project practice requires queue/evidence for system-process registration.

If queue/evidence rows are created, they must be limited to this registration action and must not authorize additional execution.

At minimum, OAR1 must report whether queue/evidence rows were used or not used.

### 6. DB mutation boundary

This OAR2 authorizes DB mutation only for:

    public.system_process_registry row for c3_field_chamber_directory_lapis_v1
    metadata required for Chamber Directory standing
    optional queue/evidence rows only if current process requires them

This OAR2 does not authorize mutation of:

    public.measures_registry
    public.measures_release_state
    public.measures_encounter_def
    public.measures_transition_rule
    landing page design
    landing page copy
    SEO route-heads
    social queue
    Paragraph drafts
    Paragraph publishing
    Buffer scheduling
    Buffer posting
    social posting
    article bodies
    Agents with Keys dispatch
    assessment questions
    scoring logic
    contact gate
    result gate
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

    inspect public.system_process_registry
    insert or update the Lapis Chamber Directory system-process row
    preserve seated vs registered distinction
    preserve c3 Field process scope
    avoid Measures runtime row mutation
    perform DB readback
    report exact table/row standing
    write OAR1 closeout

Cody may not:

    mutate public.measures_registry
    create public Lapis UI
    expose Lapis public copy
    alter landing pages
    alter SEO/social/Paragraph/Buffer behavior
    mutate article bodies
    register Agents with Keys
    create Paragraph draft
    publish Paragraph article
    schedule Buffer post
    publish social post
    invent schema authority
    route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. registration_authorized is true only for this system-process registration.
2. public.system_process_registry is inspected before mutation.
3. No duplicate process registration is created.
4. c3_field_chamber_directory_lapis_v1 is inserted or updated.
5. DB readback confirms registered standing.
6. process_scope points to the seated Lapis index file.
7. metadata identifies material_family as lapis.
8. metadata identifies public_facing as false.
9. metadata preserves the working directory path.
10. metadata preserves the contract family list.
11. public.measures_registry is not mutated.
12. no runtime-facing chamber row is treated as the system-process row.
13. no public Lapis copy appears.
14. no route behavior changes.
15. no landing page design changes occur.
16. no SEO/social/Paragraph/Buffer execution occurs.
17. no article body mutation occurs.
18. no Agents with Keys registration occurs.
19. no payment/wallet/c3 Key/SRC/certification/conversion/DAO/permission/recognition/distribution/Marble standing is created.
20. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/c3_field/chamber_directories/oar1_register_lapis_chamber_directory_system_process_standing_v1.meta.md

OAR1 must include:

    target table
    records inserted or updated
    exact process_key
    DB readback proof
    final registered standing
    queue/evidence usage or non-usage
    confirmation public.measures_registry was not mutated
    confirmation runtime chamber rows were not changed
    no-public-Lapis confirmation
    no-route-change confirmation
    no-design-change confirmation
    no-SEO/social/API execution confirmation
    no-claims confirmation
    git status standing

## CLOSE

The directory remains the directory.

Registration changes standing, not identity.

Lapis is the material family.

Lapis Chamber Directory is the system-process working surface.

OAR2 seats.
DB registers by readback.
OAR1 proves.
