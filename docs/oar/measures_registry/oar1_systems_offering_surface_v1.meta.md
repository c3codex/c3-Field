---
document_type: oar1
title: OAR1 Systems Offering Surface
version: v1
status: executed_with_hold_target_pending
system: measures_registry
operator: op044
---

OAR1: oar1_systems_offering_surface_v1

OBJECTIVE
Seat `systems_offering` as a DB-driven offering surface reached from the Systems Seat option.

ACTION
Created and seated `systems_offering` in `measures_registry` and `measures_encounter_def` with:
- `function_layer: orientation`
- `state_expression: public_offering_surface`
- `renderer: offering_surface`

Updated the Registry runtime to render `offering_surface` metadata without form fields, payment UI, SRC logic, or diagnostics.

RESULT
Verified:
- `systems_offering` exists.
- Classification is correct.
- Renderer is `offering_surface`.
- Three sections are seated and readable.
- `systems_intro_video` is reported missing and no replacement media was invented.
- Registry source does not hardcode offering copy.
- Registry build passes.

ROUTING NOTE
The primary action target `systems_seat_hold` is present in DB metadata, but no `systems_seat_hold` surface is seated by this OAR2. Runtime does not invent that hold surface or conversion logic.

VALIDATION
```json
{
  "encounter_key": "systems_offering",
  "function_layer": "orientation",
  "state_expression": "public_offering_surface",
  "renderer": "offering_surface",
  "section_count": 3,
  "media_roles": ["systems_intro_video"],
  "missingMediaRoles": ["systems_intro_video"],
  "actions": [
    {
      "key": "reserve_systems_seat",
      "target": "systems_seat_hold"
    },
    {
      "key": "back_to_seats",
      "target": "reserve_seat"
    }
  ],
  "build_registry": "passed"
}
```

SOURCE
docs/oar/measures_registry/oar2_systems_offering_surface_v1.meta.md
