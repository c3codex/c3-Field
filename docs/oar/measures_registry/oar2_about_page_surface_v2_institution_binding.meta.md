---
document_type: oar2
title: OAR2 About Page Surface — Institution Bound
version: v2
status: ready_for_cody
system: measures_registry
operator: op044
replaces: about_page_surface_v1
---

OAR2: about_page_surface_v2_institution_binding

OBSERVED
- About page exists as DB-seated orientation surface.
- c3 Community Partners DAO, LLC is seated in Codex.
- Current About references entity as static text.
- Prior v2 incorrectly framed entity as “Codex entity” instead of native role.

ALIGNED
- Codex is authority.
- Public identity must reflect native role, not storage layer.
- c3 Community Partners DAO, LLC is an Institution in Service.
- About must resolve entity from Codex but render native identity.
- No frontend-authored entity truth.
- No schema exposure.
- No SRC / c3_key / payment logic.

ROUTED

1. Update About encounter content

Add field:

entity_reference:
c3_community_partners_dao

Remove all static mentions of:
C3 Community Partners DAO, LLC

2. Update HOW IT RELATES section

Replace with:

Measures Registry is developed and operated by the registered institution in service.

Do NOT include entity name in content body.

3. Renderer responsibility

generic_content_encounter must:

IF entity_reference exists:

- resolve entity from codex_entity
- render using native role mapping:

display:

entity_name
→ C3 Community Partners DAO, LLC

role_label
→ Institution in Service

status_line:
→ Active — Tennessee

Field mapping:

entity_name → codex_entity.entity_name
status → codex_entity.legal_status
jurisdiction → codex_entity.jurisdiction

role_label is mapped from:

entity_type = institution_in_service

4. Entity type correction

Ensure:

entity_type:
institution_in_service

legal_form:
nonprofit_limited_liability_company

designation:
decentralized_organization

Do not display legal_form in About.

5. Data resolution rules

Renderer pulls:

codex_entity where entity_key = entity_reference

No fallback.
If entity missing → do not render block.

6. UI placement

Entity block appears:

- after HOW IT RELATES
- before closing_statement

Format:

C3 Community Partners DAO, LLC
Institution in Service
Active — Tennessee

Styling:
- minimal
- no card UI
- no borders or decoration

7. Constraints

- no hardcoded entity name in frontend
- no reference to Codex entity in UI
- no legal interpretation
- no artifact rendering
- no address / officer exposure
- no conversion additions
- no schema language in UI

CODY ROLE

Cody may:
- update encounter metadata
- remove static entity references
- implement entity_reference resolution
- map entity_type to Institution in Service
- render minimal entity block
- correct entity_type / legal_form if required
- write OAR1

Cody may NOT:
- display codex_entity in UI
- expose legal filings or artifacts
- render legal_form in About
- introduce new UI patterns
- modify entity data beyond type correction if required

VALIDATION

- About page loads from DB
- entity_reference present
- entity resolves correctly
- entity_name renders
- label = Institution in Service
- status line = Active — Tennessee
- no hardcoded entity text remains in frontend
- removing entity removes display
- layout stable
- build passes
