---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Normalize Measures Registry Terms Across DB FREE CSS
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Normalize Measures Registry Terms Across DB FREE CSS

## OBSERVED

Metadata profile seating is not enough.

Measures Registry still contains mixed working terms, stale profile names, passage aliases, and partial architecture terms.

The operator has seated the exact active Measures Registry SEAT structure.

The live system must normalize to those terms across:

- DB rows
- metadata
- route keys
- encounter keys
- surface keys
- FREE resolver logic
- encounter_renderer references
- CSS/profile selectors
- public launch rendering

Anything outside the seated structure must be isolated.

Passages and antechambers remain HELD for secured/scale.

## ALIGNED

This is the only active public Measures Registry SEAT structure:

1. `intro_hook` = `crystal_seat_threshold`
2. `path_choice` = `crystal_seat_split_path`
3. `intro` = `crystal_orientation_surface`
4. `crystal_seat_encounter` = `/about-measures-registry`
5. `lapis_chamber_encounter` = `/undrifted`
6. `obsidian_chamber_orientation` = `structural_coherence_explainer`
7. `obsidian_chamber_encounter_assessment` = `/ai-operations-assessment`
8. `obsidian_chamber_C1` = `contact_capture`
9. `marble_chamber_orientation` = before-the-paths explainer
10. `marble_chamber_encounter_assessment_findings` = `report_findings`
11. `marble_chamber_C2_encounter` = `MAP_the_environment`
12. `marble_chamber_C2_agreement` = Stripe payment
13. `marble_chamber_encounter_resolution` = confirmation page

This is SEAT.

No other active Measures Registry public launch structure is authorized.

## NORMALIZATION REQUIREMENT

Cody must normalize exact terms, not merely add metadata.

If live DB/source keys use stale working terms, Cody must propose and apply controlled mutation where safe.

Mutation is authorized only after dependency inspection.

Required pattern:

1. inspect current key usage
2. identify dependencies
3. mutate key/term only if dependent references can be updated in same OAR
4. preserve legacy alias only when needed for route continuity
5. isolate anything outside SEAT
6. write OAR1 with before/after evidence

## REQUIRED TERM TARGETS

Normalize toward these active names:

- `crystal_seat_threshold`
- `crystal_seat_split_path`
- `crystal_orientation_surface`
- `crystal_seat_encounter`
- `lapis_chamber_encounter`
- `obsidian_chamber_orientation`
- `obsidian_chamber_encounter_assessment`
- `obsidian_chamber_C1`
- `marble_chamber_orientation`
- `marble_chamber_encounter_assessment_findings`
- `marble_chamber_C2_encounter`
- `marble_chamber_C2_agreement`
- `marble_chamber_encounter_resolution`

## DRIFT ISOLATION RULE

Anything not mapped to the 13 seated terms must be isolated as:

- `deprecated`
- `held`
- `secured_scale`
- `legacy_alias`
- `audit_trace`
- `inactive`
- `gap`

No stale working term may remain active by accident.

Specific drift terms requiring audit/isolation include:

- `structure_passage`
- `measures_structured_environments`
- `crystal_seat_orientation_passage`
- `obsidian_chamber_orientation_passage`
- `marble_chamber_orientation_passage`
- generic `lapis_publication_surface` if it hides `/undrifted` chamber encounter standing
- generic profile names that should now resolve to exact SEAT terms

## PASSAGE / ANTECHAMBER HOLD RULE

Passages and antechambers are HELD for secured/scale.

They may remain in DB only as held/secured_scale/legacy/audit state.

They must not appear as active public launch encounter surfaces unless they are normalized into one of the 13 seated terms.

Do not delete held records unless deletion is already supported and dependency-safe.

Prefer isolation over deletion.

## CONTRACT USE BAN

No active term may use `contract`.

Allowed exception:

- `smart_contract`

If contract-named fields exist in schema, treat them as legacy implementation fields only.

Do not introduce new contract language.

Use:

- profile
- surface
- encounter
- agreement
- compact
- boundary
- requirement
- standing
- passage
- resolution

## ROUTED

### 1. Full DB/source audit

Cody must search DB migrations/source for all active references to:

- `surface_key`
- `encounter_key`
- `route`
- `profile`
- `metadata.profile`
- `chamber_assignment`
- `material_identity`
- CSS profile/class selectors
- FREE resolver mappings
- encounter_renderer mappings

### 2. Produce before-state table

OAR1 must include current state for all 13 target items:

- current key
- current route
- current profile
- current release state
- current active state
- current dependency references
- required normalized term
- action taken

### 3. Controlled mutation

Where safe, mutate DB/source terms to exact seated names.

Allowed mutation surfaces:

- DB metadata
- DB surface keys / encounter keys where dependency-safe
- route alias tables if present
- resolver maps
- profile constants
- CSS class names/selectors
- encounter_renderer references

Not allowed:

- silent route breakage
- duplicate active terms for same function
- frontend-only alias as authority
- hardcoded route truth
- stale term preservation as active architecture

### 4. Alias boundary

If a public route must remain stable, preserve public route as route only.

Example:

- `/about-measures-registry` may remain public route.
- Its seated structural identity must normalize to `crystal_seat_encounter`.

Route is not authority.

### 5. `/undrifted`

`/undrifted` must normalize as:

- structural identity: `lapis_chamber_encounter`
- public route: `/undrifted`
- chamber: Lapis
- sequence: non-required
- profile/renderer: Lapis public promoted page

It must not remain merely generic publication dispatch if it is the main Lapis encounter.

## DO NOT TOUCH

This OAR does not authorize:

- new public sequence
- new chamber terms
- passage activation
- antechamber activation
- secured/scale implementation
- report copy change
- scoring change
- Stripe logic change
- payment flow change
- certification claim
- conversion claim
- registered_runtime restoration
- frontend-owned truth
- visual redesign

## CODY ROLE

Cody may:

- inspect DB/source dependencies
- mutate exact terms when dependency-safe
- update references in same OAR
- isolate stale terms
- preserve public routes as route aliases only
- write migration if required
- write source updates if required
- write OAR1 with before/after evidence

Cody may not:

- normalize by metadata only if keys remain drifted
- invent missing authority
- mutate without dependency inspection
- keep stale working terms active
- activate passages/antechambers
- introduce contract terminology
- expand beyond the 13-part SEAT structure

## VALIDATION

Validation succeeds when:

- the 13 SEAT terms are the active structure across DB/FREE/CSS/renderer
- stale working terms are isolated
- passage/antechamber terms are held for secured/scale
- public routes remain stable where required
- route names are not treated as authority
- `/undrifted` resolves as Lapis Chamber encounter
- `/about-measures-registry` resolves as Crystal Seat encounter
- `/ai-operations-assessment` resolves as Obsidian Chamber assessment encounter
- report findings resolves as Marble assessment findings encounter
- MAP the Environment resolves as Marble C2 encounter
- Stripe payment resolves as Marble C2 agreement
- confirmation page resolves as Marble resolution
- no unlisted active launch surfaces remain
- no contract terminology is introduced
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_normalize_measures_registry_terms_across_db_free_css_v1.meta.md

## CLOSE

Normalize the system, not just metadata.

Exact seated terms must carry through DB, FREE, CSS, profiles, and encounter rendering.

Anything else is isolated.

Passages and antechambers are held for secured/scale.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
