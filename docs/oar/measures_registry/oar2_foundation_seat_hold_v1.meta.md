---
document_type: oar2
title: OAR2 Foundation Seat Hold
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: foundation_seat_hold_v1

OBSERVED
foundation_offering routes to foundation_seat_hold, which is not yet seated.

ALIGNED
- Codex is authority.
- This is a hold surface, not SRC.
- Light capture only.
- No c3_key logic.
- No payment logic.
- No Envelope creation.
- Renderer resolves from metadata.renderer.
- Styling resolves through measures_design_token.

ROUTED
1. Create registry row:
registry_key: foundation_seat_hold
parent: measures_registry_runtime
registry_family: spine
metadata.role: measures_registry_hold_surface
metadata.source: foundation_seat_hold_v1

2. Create encounter:
encounter_key: foundation_seat_hold
function_layer: intake
state_expression: public_hold_surface
renderer: hold_surface

3. Metadata:
entry_label: FOUNDATION SEAT
entry_headline: Reserve your place.
entry_sub: You will be notified when enrollment opens.

fields:
- key: email
  type: email
  required: true

cta_primary: RESERVE SEAT
cta_secondary: Back to Offering

4. Actions:
RESERVE SEAT:
store email through simple non-SRC capture

Back to Offering:
route to foundation_offering

5. Constraints:
- one email field only
- no payment UI
- no SRC logic
- no diagnostics
- responsive
- DB-driven only

CODY ROLE
Cody may:
- seat registry and encounter
- implement hold_surface renderer
- wire simple email capture
- connect routes
- write OAR1

Cody may NOT:
- introduce SRC logic
- create multi-field forms
- create payment flows
- invent additional behavior

VALIDATION
- foundation_seat_hold exists
- classification correct
- renderer correct
- single email field present
- submission works
- no SRC / no payment
- build passes
