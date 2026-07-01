---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seat All 13 Registered Surfaces Hot Through Payment Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat All 13 Registered Surfaces Hot Through Payment Resolution

## OBSERVED

The 13 SEAT items are registered encounter surfaces, not style profiles.

Some are currently first-class runtime surfaces.
Some are embedded inside component flow.
Some are gaps.

That is no longer acceptable for launch normalization.

All 13 registered surfaces through payment resolution must be seated as active/hot surfaces.

Style profiles are separate presentation mechanics and must be assigned after registered surface standing is correct.

## ALIGNED

The final 13 registered Measures Registry surfaces are:

1. `crystal_seat_intro`
   - media: `ai_isnt_broken_intro`
   - standing: hot

2. `crystal_seat_threshold`
   - L/R threshold
   - media: motion-to-still path choice
   - standing: hot

3. `crystal_seat_orientation`
   - media: `measures_position`
   - standing: hot

4. `crystal_seat_encounter`
   - route: `/about-measures-registry`
   - standing: hot

5. `lapis_chamber_encounter`
   - route: `/undrifted`
   - standing: hot

6. `obsidian_chamber_orientation`
   - media: `structural_coherence_explainer`
   - standing: hot

7. `obsidian_chamber_encounter_surface`
   - route: `/ai-operations-assessment`
   - standing: hot

8. `obsidian_chamber_C1_compact`
   - contact capture compact
   - compact = constraints + agreements + resolutions
   - standing: hot

9. `marble_chamber_orientation`
   - media title: `assessment_report_orientation`
   - standing: hot

10. `marble_chamber_encounter`
    - assessment findings report
    - standing: hot

11. `marble_chamber_C2_compact`
    - MAP the Environment
    - compact = constraints + agreements + resolutions
    - standing: hot

12. `marble_chamber_C2_agreement`
    - Stripe payment agreement
    - standing: hot

13. `marble_chamber_C2_resolution`
    - confirmation page
    - standing: hot

## SURFACE / PROFILE DISTINCTION

Registered surface = what the encounter is.

Style profile = how FREE/CSS renders that surface safely.

Do not use style profiles as authority.

Do not treat metadata profile seating as surface seating.

Every registered surface must have:

- registry_key
- encounter_key
- surface_key
- material_identity
- chamber_assignment
- release gate
- encounter_def or renderer-supported definition
- FREE route/flow support where applicable

Style profile assignment comes after this surface standing exists.

## HOT SURFACE RULE

All 13 registered surfaces must be hot:

- `is_active = true`
- `release_state = released`
- not held
- not gap
- not audit_trace
- not legacy_alias
- not embedded-only without registered surface standing

If any surface cannot be made hot because required data is missing:

- report exact blocker
- do not invent truth
- do not silently leave embedded flow as equivalent to registered surface

## PASSAGE / ANTECHAMBER RULE

Passages and antechambers remain held for secured/scale.

They are separate from these 13 registered surfaces.

Do not use passage names for orientation surfaces.

Do not activate passage or antechamber surfaces in this OAR.

## ROUTED

Cody must audit and seat all 13 registered surfaces across:

- `measures_registry`
- `measures_encounter_def`
- `measures_encounter_surface_assignment`
- encounter_structure JSONB
- FREE route maps
- EncounterSurface union
- chamber renderer dispatch
- component flow
- media references
- Stripe/payment continuation references
- confirmation flow references

## REQUIRED ACTION

For each of the 13 surfaces:

1. Verify whether first-class DB surface exists.
2. Verify whether registry row exists.
3. Verify whether encounter_def exists.
4. Verify whether release gate passes.
5. Verify whether FREE can render or route to it.
6. If embedded only, promote to registered surface where dependency-safe.
7. If missing, create only from seated existing source content/data.
8. If source content/data is missing, report blocker.

## REQUIRED OUTPUT IN OAR1

OAR1 must include a 13-row table:

- registered surface
- current source anchor
- registry_key
- encounter_key
- surface_key
- material
- chamber
- release_state
- is_active
- renderer support
- style profile assigned or pending
- action taken
- final standing

Final standing must be one of:

- hot
- blocked_with_reason

Not allowed as final standing for the 13:

- held
- gap
- legacy_alias
- audit_trace
- embedded_only

## DO NOT TOUCH

This OAR does not authorize:

- new public sequence outside the 13
- passage activation
- antechamber activation
- report copy rewrite
- scoring changes
- Stripe logic changes beyond registering payment surface standing
- payment provider replacement
- certification claims
- conversion claims
- registered_runtime restoration
- frontend-owned truth
- visual redesign

## VALIDATION

Validation succeeds when:

- all 13 registered surfaces are hot or explicitly blocked with reason
- no one of the 13 remains only embedded without registered standing
- passages and antechambers remain held
- style profiles are kept separate from registered surfaces
- `/about-measures-registry` resolves to `crystal_seat_encounter`
- `/undrifted` resolves to `lapis_chamber_encounter`
- `/ai-operations-assessment` resolves to `obsidian_chamber_encounter_surface`
- contact capture resolves to `obsidian_chamber_C1_compact`
- assessment findings resolve to `marble_chamber_encounter`
- MAP resolves to `marble_chamber_C2_compact`
- Stripe payment resolves to `marble_chamber_C2_agreement`
- confirmation resolves to `marble_chamber_C2_resolution`
- TypeScript/build passes or exact failure is reported
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md

## CLOSE

The 13 are registered surfaces.

They must be hot through payment resolution.

Style profiles come after registered surface standing.

Passages and antechambers remain held for secured/scale.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
