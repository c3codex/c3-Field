---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Normalize FREE Runtime to Final SEAT Structure
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Normalize FREE Runtime to Final SEAT Structure

## OBSERVED

Measures Registry SEAT structure is now final.

Prior runtime and metadata work exposed drift:

- metadata.profile is not currently consumed by runtime
- FREE dispatch still uses historical literal surface_key strings
- chamber renderers contain duplicate-function branches
- CSS/profile naming still carries older working terms
- some passage/orientation names remain mixed
- `contract` terminology must not remain active except `smart_contract`

The operator has finalized the canonical 13-part Measures Registry SEAT structure.

This OAR replaces prior candidate structures where they conflict.

## ALIGNED

Final canonical Measures Registry SEAT structure:

1. `crystal_seat_threshold`
   - current anchor: `intro_hook`

2. `crystal_seat_split_path`
   - current anchor: `path_choice`

3. `crystal_seat_orientation`
   - current anchor: `intro`
   - media rename: `measures_position` -> seated orientation media name

4. `crystal_seat_encounter`
   - route: `/about-measures-registry`

5. `lapis_chamber_encounter`
   - route: `/undrifted`

6. `obsidian_chamber_orientation`
   - current anchor: `structural_coherence_explainer`

7. `obsidian_chamber_encounter_surface`
   - route: `/ai-operations-assessment`

8. `obsidian_chamber_C1_compact`
   - current anchor: `contact_capture`
   - compact = constraints + agreements + resolutions

9. `marble_chamber_orientation`
   - media rename: `marble_map_orientation`

10. `marble_chamber_encounter`
    - function: assessment findings report

11. `marble_chamber_C2_compact`
    - current anchor: `MAP_the_environment`
    - compact = constraints + agreements + resolutions

12. `marble_chamber_C2_agreement`
    - function: Stripe payment agreement

13. `marble_chamber_C2_resolution`
    - function: confirmation page

This is the final answer.

## SEAT LOCK RULE

The 13-part structure above is the canonical Measures Registry structure.

All active Measures Registry launch runtime must normalize to these exact terms across:

- DB rows
- DB metadata
- route maps
- surface keys
- encounter keys
- component names where feasible
- chamber renderer dispatch
- chamber directory references
- profiles
- FREE resolver
- encounter_renderer
- CSS selectors / data keys
- C1 / C2 commerce circuit references
- compact references
- media naming where applicable

Anything outside this structure must be isolated as:

- held
- deprecated
- legacy_alias
- secured_scale
- audit_trace
- inactive
- gap

No unlisted term may remain active authority accidentally.

## MATERIAL CHAMBER RULE

All components, chambers, directories, encounters, profiles, FREE routes, CSS keys, and C1/C2 commerce circuits must resolve to their material chamber surface.

Crystal Seat:

- threshold
- split path
- orientation
- encounter

Lapis Chamber:

- encounter

Obsidian Chamber:

- orientation
- encounter surface
- C1 compact

Marble Chamber:

- orientation
- encounter
- C2 compact
- C2 agreement
- C2 resolution

## COMPACT RULE

Compact means:

- constraints
- agreements
- resolutions

C1 and C2 are commerce circuits only where compact requirements are present.

C1 must resolve through:

- `obsidian_chamber_C1_compact`

C2 must resolve through:

- `marble_chamber_C2_compact`
- `marble_chamber_C2_agreement`
- `marble_chamber_C2_resolution`

Do not use `contract`.

Allowed exception:

- `smart_contract`

## PASSAGE / ANTECHAMBER RULE

Passages and antechambers are HELD for secured/scale.

They are not active public launch surfaces.

Any passage or antechamber term currently active in FREE, CSS, profile, DB, route, or renderer logic must be isolated unless it resolves exactly to one of the final 13 SEAT terms.

Do not delete held records unless dependency-safe and separately justified.

Prefer isolation over deletion.

## REQUIRED NORMALIZATION TARGETS

Cody must normalize toward these exact active names:

- `crystal_seat_threshold`
- `crystal_seat_split_path`
- `crystal_seat_orientation`
- `crystal_seat_encounter`
- `lapis_chamber_encounter`
- `obsidian_chamber_orientation`
- `obsidian_chamber_encounter_surface`
- `obsidian_chamber_C1_compact`
- `marble_chamber_orientation`
- `marble_chamber_encounter`
- `marble_chamber_C2_compact`
- `marble_chamber_C2_agreement`
- `marble_chamber_C2_resolution`

## REQUIRED AUDIT

Cody must audit and report all current references to:

- `intro_hook`
- `path_choice`
- `intro`
- `measures_position`
- `about_measures_registry`
- `/about-measures-registry`
- `/about`
- `structural_drift_dispatches`
- `publication_dispatch`
- `/undrifted`
- `eval_passage`
- `structural_coherence_explainer`
- `obsidian_chamber_orientation_passage`
- `measures_assessment`
- `/ai-operations-assessment`
- `contact_capture`
- `structure_passage`
- `crystal_seat_orientation_passage`
- `measures_structured_environments`
- `map_integrity_governance`
- `marble_chamber_orientation_passage`
- `marble_map_orientation`
- `report_findings`
- `MAP_the_environment`
- `stripe`
- `payment`
- `confirmation_page`
- `contract`
- `compact`
- `agreement`
- `resolution`
- `constraint`
- `C1`
- `C2`

Audit surfaces:

- DB migrations
- live DB where accessible
- FREE route maps
- registry resolver
- encounter_renderer
- chamber renderers
- component names
- CSS selectors
- data attributes
- profile constants
- media references

## REQUIRED MUTATION

After audit, Cody must normalize exact terms where dependency-safe.

Authorized mutation surfaces:

- DB metadata
- DB standing tags
- DB keys only when all dependent references are updated in same OAR
- FREE route/surface map
- EncounterSurface union / type definitions
- chamber renderer dispatch keys
- component reference names where feasible
- profile constants
- CSS selectors / data keys
- media key references where applicable

Public routes may remain stable as route aliases only.

Route is not authority.

Example:

- `/about-measures-registry` remains public route.
- seated identity is `crystal_seat_encounter`.

- `/undrifted` remains public route.
- seated identity is `lapis_chamber_encounter`.

- `/ai-operations-assessment` remains public route.
- seated identity is `obsidian_chamber_encounter_surface`.

## DUPLICATE-FUNCTION DRIFT TO RESOLVE

Cody must remove or isolate duplicate runtime dispatch clusters:

### Obsidian orientation cluster

Historical keys:

- `eval_passage`
- `structural_coherence_explainer`
- `obsidian_chamber_orientation_passage`

Final active term:

- `obsidian_chamber_orientation`

### Crystal passage/orientation cluster

Historical keys:

- `structure_passage`
- `crystal_seat_orientation_passage`

Final active Crystal orientation term:

- `crystal_seat_orientation`

Passage terms remain held for secured/scale unless exact dependency requires legacy alias.

### Marble MAP/orientation cluster

Historical keys:

- `map_integrity_governance`
- `marble_chamber_orientation_passage`

Final active terms:

- `marble_chamber_orientation`
- `marble_chamber_C2_compact`

Cody must not collapse Marble orientation and C2 compact into one active term.

If code currently uses one component for both, report and split or isolate as dependency-safe.

## LAPIS RULE

`/undrifted` is the main Lapis Chamber encounter.

It holds:

- Paragraph publication references
- Buffer/social profile references where seated
- promoted public education links
- links into `/about-measures-registry`
- links into `/ai-operations-assessment`
- Paragraph article links where seated

`/undrifted` is not required sequence.

Crystal Seat may link to `/undrifted`.

Obsidian does not depend on it.

Marble does not require it.

Do not leave `/undrifted` hidden behind generic `lapis_publication_surface` as active structural identity.

## DO NOT TOUCH

This OAR does not authorize:

- new public sequence
- new chamber names
- new profile families outside final SEAT structure
- passage activation
- antechamber activation
- secured/scale implementation
- report copy rewrite
- scoring changes
- Stripe logic changes
- payment provider changes
- certification claims
- conversion claims
- registered_runtime restoration
- frontend-owned truth
- visual redesign beyond selector/name alignment

## CODY ROLE

Cody may:

- audit DB/source/runtime/CSS references
- normalize exact terms where dependency-safe
- update multiple files if required for consistent runtime normalization
- preserve public routes as route aliases
- isolate stale terms
- preserve held passage/antechamber records as held
- run dev/build validation
- write OAR1 with before/after evidence

Cody may not:

- expand beyond the 13 final SEAT terms
- invent missing surfaces
- keep unlisted terms active
- activate passages or antechambers
- introduce contract terminology
- mutate payment logic
- mutate scoring/report copy
- restore registered_runtime

## VALIDATION

Validation succeeds when:

- active FREE vocabulary equals final SEAT vocabulary
- active renderer dispatch uses final SEAT terms or documented route aliases only
- DB metadata/standing aligns with final SEAT terms
- CSS/profile/data keys align with final SEAT terms where active
- `/about-measures-registry` resolves to `crystal_seat_encounter`
- `/undrifted` resolves to `lapis_chamber_encounter`
- `/ai-operations-assessment` resolves to `obsidian_chamber_encounter_surface`
- contact capture resolves to `obsidian_chamber_C1_compact`
- assessment findings report resolves to `marble_chamber_encounter`
- MAP continuation resolves to `marble_chamber_C2_compact`
- Stripe payment resolves to `marble_chamber_C2_agreement`
- confirmation page resolves to `marble_chamber_C2_resolution`
- `measures_position` media is renamed/aligned to `crystal_seat_orientation` media standing where supported
- Marble orientation media is renamed/aligned to `marble_map_orientation` where supported
- duplicate-function clusters are removed or isolated
- passage/antechamber terms are held, not active public launch surfaces
- no active contract terminology remains except `smart_contract`
- no unlisted active public launch surface remains
- FREE remains active render authority
- registered_runtime remains retired
- build/dev validation passes or exact failure is reported
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_normalize_free_runtime_to_final_seat_structure_v1.meta.md

## CLOSE

Measures Registry SEAT structure is closed.

Implementation normalization is open.

Normalize FREE, DB, encounter_renderer, profiles, CSS, components, chamber directories, C1/C2 compact surfaces, media keys, and active runtime vocabulary to the final 13-part SEAT structure.

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
