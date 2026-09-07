---
document_type: oar2
authority_level: working
document_scope: encounter_surface_assignment_authority
title: OAR2 — Remove Release State from Surface Assignment
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Remove Release State from Surface Assignment

## OBSERVED

The new table `measures_encounter_surface_assignment` correctly moved surface assignment authority into DB.

However, the table currently duplicates release authority through:

- `is_active`
- `release_state`
- `access_state`

This creates a second governance surface for whether a surface may render.

That duplicates `measures_registry`, which already carries live standing.

Correction:

Surface assignment defines what a surface belongs to.

Registry standing defines whether it may render.

## ALIGNED

Correct separation:

Surface Assignment answers:

- what surface is this
- which registry_key does it belong to
- which encounter_key does it use
- which material identity applies
- which chamber renderer receives it
- which public routes or aliases map to it

Registry Standing answers:

- is it active
- is it released
- who may access it
- may it render live

Authority flow:

Codex
→ Registry Standing
→ Encounter Surface Assignment
→ Encounter Profile Loader
→ Release Gate
→ Chamber Router
→ Chamber Renderer
→ Surface Renderer

No duplicate release standing.

No duplicate active standing.

No duplicate access standing.

## ROUTED

### 1. Update DB Schema

Create migration to remove release authority duplication from:

`measures_encounter_surface_assignment`

Remove or deprecate:

- `is_active`
- `release_state`
- `access_state`

Preferred:

Drop these columns if no downstream dependency exists.

If dropping is unsafe, deprecate them clearly and update resolver/loader to ignore them.

### 2. Update Seeded Rows

Ensure assignment rows retain only assignment authority:

- surface_key
- registry_key
- encounter_key
- material_identity
- chamber_assignment
- public_routes
- metadata

No assignment row should carry render permission.

### 3. Update Resolver Types

Update `EncounterSurfaceAssignmentRow`.

Remove:

- is_active
- release_state
- access_state

### 4. Update Registry Resolver

Update assignment query to load only assignment fields.

Resolver may load assignment rows regardless of registry standing.

### 5. Update Encounter Profile Loader

Profile loader should:

- find assignment row
- find linked registry row
- assemble profile from assignment + registry + encounter_def + media

It must not read render permission from assignment row.

### 6. Update Release Gate

Release gate must read only from `measures_registry` registry row.

Release gate must not inspect assignment standing.

### 7. Update Transition Resolver

Transition resolver validates target by:

- finding target surface assignment
- finding linked registry row
- applying release gate to linked registry row

Not assignment release state.

### 8. Fail-Closed Rule

If assignment exists but registry row is missing:

governed held state.

If assignment exists but registry is inactive or held:

governed held state.

If registry is released but assignment missing:

governed held state.

Both assignment and registry standing are required.

## CLAUDE ROLE

Claude may:

- create migration
- update infrastructure files
- update types
- update resolver query
- update profile loader
- update transition resolver
- run build
- return OAR1 evidence

Claude may not:

- implement chamber renderers
- edit monolith
- change live runtime
- change public behavior
- activate held registry records
- invent release authority in assignment
- preserve assignment release fields as fallback truth

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- assignment table still carries release authority
- release gate reads assignment standing
- transition resolver reads assignment standing
- profile loader treats assignment as permission
- registry and assignment can disagree on release state
- duplicate authority remains

## VALIDATION

Success is achieved when:

- surface assignment carries no release authority
- registry remains sole release authority
- resolver loads assignment fields only
- profile loader requires both assignment and registry
- release gate reads registry only
- transition resolver gates against registry only
- no chamber renderer is created
- no live behavior changes
- build passes
- OAR1 reports schema change, files changed, and authority separation

Expected OAR1:

docs/oar/measures_registry/oar1_remove_release_state_from_surface_assignment_v1.meta.md
