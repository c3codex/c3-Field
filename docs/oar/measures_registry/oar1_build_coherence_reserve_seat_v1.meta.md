---
document_type: oar1
title: OAR1 Build Coherence Reserve Seat
version: v1
status: executed
system: measures_registry
operator: op044
---

OAR1: oar1_build_coherence_reserve_seat_v1

OBJECTIVE
Convert `BUILD COHERENCE` / `reserve_seat` from direct conversion intent into a learning-first selector surface.

ACTION
Updated `reserve_seat` metadata with:
- `function_layer: intake`
- `state_expression: public_learning_reserve_seat`
- `renderer: reserve_seat_selector`
- Three DB-seated options: `foundation_seat`, `systems_seat`, and `cohort`

Updated the Registry renderer to render `reserve_seat` as a selector surface with no form fields, no submission behavior, no payment logic, and no SRC RPC.

RESULT
Verified:
- `reserve_seat` renders from DB metadata.
- Three options are present.
- `foundation_seat` and `systems_seat` are open/selectable.
- `cohort` is disabled as `coming_soon`.
- No form fields are present in metadata.
- No `submit_src_intake_request` RPC is present in `reserve_seat` metadata.
- Registry source does not hardcode option copy.
- Registry build passes.

VALIDATION
```json
{
  "encounter_key": "reserve_seat",
  "function_layer": "intake",
  "state_expression": "public_learning_reserve_seat",
  "renderer": "reserve_seat_selector",
  "option_count": 3,
  "options": [
    {
      "key": "foundation_seat",
      "state": "open",
      "target": "foundation_offering"
    },
    {
      "key": "systems_seat",
      "state": "open",
      "target": "systems_offering"
    },
    {
      "key": "cohort",
      "state": "coming_soon",
      "target": null
    }
  ],
  "form_fields_present": false,
  "rpc_present": false,
  "build_registry": "passed"
}
```

SOURCE
docs/oar/measures_registry/oar2_build_coherence_reserve_seat_v1.meta.md
