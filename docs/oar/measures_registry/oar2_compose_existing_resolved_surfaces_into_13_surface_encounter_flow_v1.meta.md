---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Compose Existing Resolved Surfaces Into 13-Surface Encounter Flow
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Compose Existing Resolved Surfaces Into 13-Surface Encounter Flow

## OBSERVED

All 13 registered Measures Registry surfaces now have first-class DB standing.

8 surfaces render.

5 surfaces are registered/released but currently fall to renderer gap handlers.

The missing work is not new architecture.

The missing work is composition.

Most component bodies already exist in some shape:

- contact capture exists
- assessment exists
- report exists
- MAP exists
- payment hook exists
- confirmation flow exists or is partially implied
- orientation media pattern exists

These resolved bodies need to be composed into their seated registered surfaces.

## ALIGNED

Do not invent.

Do not redesign.

Do not re-architect.

Assemble existing resolved component bodies into the 13-surface encounter flow.

Surface identity remains DB-held.

Measures allows sequence.

Field arranges the render surface.

Roles authorize action.

Optics proves what occurred.

## TARGET COMPOSITION

### Obsidian

`obsidian_chamber_C1_compact`

Compose from existing contact/capture body:

- contact capture
- email capture
- consent capture
- acknowledgement bundle

It must become the registered C1 compact surface.

### Marble

`marble_chamber_orientation`

Compose from existing orientation media pattern.

Media title:

- `assessment_report_orientation`

Function:

- Marble media explainer before assessment findings report

`marble_chamber_encounter`

Compose from existing assessment findings report body.

Current body is coupled to passage/result flow.

It must render as Marble encounter surface.

`marble_chamber_C2_compact`

Use existing MAP the Environment body.

Function:

- governed MAP the Environment shown based on scoring

`marble_chamber_C2_agreement`

Compose payment surface from existing payment hook/body.

Function:

- payment agreement surface

Payment logic must not be rewritten.

`marble_chamber_C2_resolution`

Compose confirmation/resolution surface from existing confirmation/success concept/body.

Function:

- confirmation page
- payment/result resolution
- next-step standing

## FLOW TARGET

Target flow after composition:

    crystal_seat_intro
      -> crystal_seat_threshold

    crystal_seat_threshold.left
      -> obsidian_chamber_orientation

    crystal_seat_threshold.right
      -> crystal_seat_orientation

    crystal_seat_orientation
      -> crystal_seat_encounter

    obsidian_chamber_orientation
      -> obsidian_chamber_encounter_surface

    obsidian_chamber_encounter_surface
      -> obsidian_chamber_C1_compact

    obsidian_chamber_C1_compact
      -> marble_chamber_orientation

    marble_chamber_orientation
      -> marble_chamber_encounter

    marble_chamber_encounter
      -> marble_chamber_C2_compact

    marble_chamber_C2_compact
      -> marble_chamber_C2_agreement

    marble_chamber_C2_agreement
      -> marble_chamber_C2_resolution

    marble_chamber_C2_resolution
      -> terminal

Lapis remains optional/promoted/non-required:

    lapis_chamber_encounter
      = /undrifted

Crystal may link to Lapis.
Lapis is not required sequence.

## REQUIRED AUDIT

Cody must inspect existing bodies before implementing:

- MeasuresAssessment
- PublicAssessmentSurface
- PublicAssessmentResult
- ObsidianToMarblePassage
- MapIntegrityGovernance
- payment initiation handler
- success/cancel handling
- orientation media patterns
- chamber renderers
- encounter_structure JSONB
- route maps
- registered surface rows
- encounter_def metadata

## ROUTED

Cody must:

1. Identify existing component/body source for each renderer gap.
2. Compose each body into its seated registered surface.
3. Add chamber renderer dispatch for each of the 5 renderer-gap surfaces.
4. Update encounter_structure transitions to target registered surfaces.
5. Preserve public routes.
6. Preserve scoring logic.
7. Preserve payment logic.
8. Preserve report copy.
9. Preserve Lapis as optional/non-sequence.
10. Run TypeScript/build validation.
11. Write OAR1 with before/after evidence.

## IMPLEMENTATION BOUNDARIES

Allowed:

- component extraction
- renderer dispatch addition
- transition update
- prop threading required for existing callbacks
- using existing payment handler from new surface
- using existing report body from new surface
- using existing contact capture body from new surface
- using existing orientation media pattern

Not allowed:

- new scoring model
- report copy rewrite
- Stripe logic rewrite
- new payment provider
- new public sequence outside 13
- passage activation
- antechamber activation
- registered_runtime restoration
- frontend-owned truth

## STYLE / CONTENT / DIRECTORY NOTE

This OAR does not need to complete DB-held style/content/media/directory consumption.

However, new or composed surfaces must preserve:

- registered_surface
- style_profile
- content_profile where seated
- media_locator where seated
- directory_key where seated

If these are not consumed by FREE yet, report gap.

Do not hardcode as authority.

## REQUIRED OAR1 TABLE

OAR1 must include:

- surface
- existing body source
- renderer implemented yes/no
- transition implemented yes/no
- callback dependencies
- scoring/payment/report impact
- validation result
- remaining gap if any

## VALIDATION

Validation succeeds when:

- `obsidian_chamber_C1_compact` renders contact/email/consent/acknowledgement compact or exact blocker reported
- `marble_chamber_orientation` renders assessment_report_orientation media or exact blocker reported
- `marble_chamber_encounter` renders assessment findings report or exact blocker reported
- `marble_chamber_C2_compact` renders MAP the Environment based on scoring
- `marble_chamber_C2_agreement` renders payment surface using existing payment logic
- `marble_chamber_C2_resolution` renders confirmation/resolution or exact blocker reported
- flow transitions use registered surfaces
- no report/scoring/payment rewrite occurs
- Lapis remains optional/non-sequence
- passages and antechambers remain held
- TypeScript/build passes or exact failure is reported
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md

## CLOSE

This is assembly.

Resolved bodies become registered surfaces.

Registered surfaces become encounter flow.

Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
