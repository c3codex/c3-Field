---
document_type: oar2
title: OAR2 Systems Offering Surface
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: systems_offering_surface_v1

OBSERVED
reserve_seat routes to systems_offering as an open learning seat target alongside foundation_offering.

ALIGNED
- Codex is authority.
- This is an offering surface, not a course page.
- No SRC.
- No c3_key logic.
- No payment logic.
- No form submission.
- Renderer resolves from metadata.renderer.
- Styling resolves through measures_design_token.
- Media handled via roles.

ROUTED

1. Registry row:

registry_key: systems_offering
parent: measures_registry_runtime
registry_family: spine

metadata:
role: measures_registry_learning_offering
source: systems_offering_surface_v1

2. Encounter:

encounter_key: systems_offering

function_layer: orientation
state_expression: public_offering_surface
renderer: offering_surface

3. Metadata:

entry_label: SYSTEMS SEAT
entry_headline: Apply coherence to real systems.
entry_sub: From understanding failure to structuring environments that resolve.

core_statement:
The Systems Seat moves from diagnosis into application—how coherence is structured, enforced, and sustained across real environments.

sections:

- title: What this applies
  body: You move from recognizing failure into structuring systems that maintain alignment under pressure.

- title: What this is not
  body: This is not theory, trend analysis, or surface-level frameworks.

- title: What changes
  body: You begin building environments where outputs stabilize, decisions resolve, and systems remain coherent as they scale.

outcome_statement:
You leave with the ability to structure, evaluate, and maintain systems that do not drift under complexity.

cta_primary: RESERVE SYSTEMS SEAT
cta_secondary: Back to Seats

4. Media:

media_roles:
- systems_intro_video

media_render_mode: intro_then_content
video_mode: muted_autoplay
fallback: still_frame

5. Actions:

RESERVE SYSTEMS SEAT:
route → systems_seat_hold

Back to Seats:
route → reserve_seat

6. Constraints:

- reuse offering_surface renderer
- no payment UI
- no form fields
- no SRC logic
- responsive
- DB-driven only

CODY ROLE

- seat registry + encounter
- wire renderer
- attach media role
- connect routing
- write OAR1

VALIDATION

- systems_offering exists
- parent bound
- classification correct
- renderer correct
- sections render
- media optional
- no form / no payment / no SRC
- build passes
