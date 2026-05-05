---
document_type: oar2
title: OAR2 About Page Surface — Codex Bound
version: v2
status: ready_for_cody
system: measures_registry
operator: op044
replaces: about_page_surface_v1
---

OAR2: about_page_surface_v2_codex_binding

OBSERVED
- About page exists as DB-seated orientation surface.
- c3 Community Partners DAO, LLC is now seated in Codex with:
  - entity_key: c3_community_partners_dao
  - relationship: operates → measures_registry

Current gap:
About page references entity as static text instead of resolving from Codex.

ALIGNED
- Codex is authority.
- About must resolve entity reference from Codex.
- No frontend-authored entity truth.
- No exposure of internal schema.
- No conversion behavior.
- No SRC / c3_key / payment logic.

ROUTED

1. Update About encounter content structure

Add new field:

entity_reference:
c3_community_partners_dao

Remove static entity naming from content sections.

---

2. Update "HOW IT RELATES" section

Replace static text:

"Measures Registry is a system developed and operated by:
c3 Community Partners, DAO, LLC"

With:

"Measures Registry is developed and operated by the registered operating entity."

Do NOT include entity name directly in content.

---

3. Renderer responsibility

generic_content_encounter must:

IF entity_reference exists:

- resolve entity from codex_entity
- display:

entity_name
operating_role (formatted)
legal_status (optional display)

Example render block:

C3 Community Partners DAO, LLC
Operating Entity
Active — Tennessee

---

4. Data resolution rules

Renderer pulls from:

codex_entity where entity_key = entity_reference

No fallback:
If entity not found → do not render block

---

5. UI placement

Entity block appears:

- after "HOW IT RELATES" section
- before closing_statement

Styling:
- minimal
- no card UI
- no decoration
- consistent with registry tone

---

6. Constraints

- no hardcoded entity name in frontend
- no duplication of entity fields in About content
- no legal interpretation
- no artifact exposure in this surface
- no navigation changes
- no conversion additions

---

CODY ROLE

Cody may:
- update encounter metadata
- remove static entity text
- implement entity_reference resolution in renderer
- render entity block
- write OAR1

Cody may NOT:
- reintroduce hardcoded entity name
- expose private address or officer info
- render artifacts
- introduce new UI components beyond minimal block
- modify entity data itself

---

VALIDATION

- About page loads from DB
- entity_reference present
- entity resolves from codex_entity
- entity_name renders correctly
- no hardcoded entity text remains
- removing entity record removes display (test)
- layout remains stable
- build passes
