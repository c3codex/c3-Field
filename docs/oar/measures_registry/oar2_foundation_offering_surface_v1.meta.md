---
document_type: oar2
title: OAR2 Foundation Offering Surface
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: foundation_offering_surface_v1

OBSERVED
reserve_seat routes to foundation_offering as an open learning seat target.
foundation_seat_hold is already seated, but foundation_offering is missing.

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

registry_key: foundation_offering
parent: measures_registry_runtime
registry_family: spine

metadata:
role: measures_registry_learning_offering
source: foundation_offering_surface_v1

2. Encounter:

encounter_key: foundation_offering

function_layer: orientation
state_expression: public_offering_surface
renderer: offering_surface

3. Metadata:

entry_label: FOUNDATION SEAT
entry_headline: Learn why systems fail before you try to fix them.
entry_sub: A structured entry into coherence, failure diagnosis, and system responsibility.

core_statement:
The Foundation Seat is for people who need the language, structure, and orientation to understand why AI-enabled systems drift, fragment, and fail to resolve.

sections:

- title: What this establishes
  body: You will learn how coherence, role integrity, registered behavior, and verification shape trustworthy systems.

- title: What this is not
  body: This is not a prompt course, productivity tutorial, or AI trend overview.

- title: What changes
  body: You stop treating failure as a tool problem and begin seeing the environment that produces it.

outcome_statement:
You leave with a clearer operating frame for recognizing drift, restoring distinction, and preparing for deeper systems work.

cta_primary: RESERVE FOUNDATION SEAT
cta_secondary: Back to Seats

4. Media:

media_roles:
- foundation_intro_video

media_render_mode: intro_then_content
video_mode: muted_autoplay
fallback: still_frame

5. Actions:

RESERVE FOUNDATION SEAT:
route -> foundation_seat_hold

Back to Seats:
route -> reserve_seat

6. Constraints:

- reuse offering_surface renderer
- video optional and non-blocking
- no payment UI
- no form fields
- no SRC logic
- no diagnostics
- responsive
- DB-driven only

CODY ROLE

Cody may:
- seat foundation_offering registry row
- seat encounter metadata
- reuse offering_surface renderer
- attach media role handling
- connect routing
- report missing media
- write OAR1

Cody may NOT:
- create payment flow
- create forms
- introduce course-platform language
- hardcode offering copy
- invent additional sections
- use surface_type as renderer authority

VALIDATION

- foundation_offering exists
- parent bound to measures_registry_runtime
- function_layer = orientation
- state_expression = public_offering_surface
- renderer = offering_surface
- sections render from DB
- media role optional and non-blocking
- CTA routes to foundation_seat_hold
- no payment logic
- no form fields
- no SRC RPC
- build passes
