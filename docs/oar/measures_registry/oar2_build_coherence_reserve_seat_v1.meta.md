---
document_type: oar2
title: OAR2 Build Coherence Reserve Seat
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: build_coherence_reserve_seat_v1

OBSERVED
BUILD COHERENCE currently routes directly toward conversion intent.
This must be separated into a learning-first reserve seat surface.

ALIGNED
- Codex is authority.
- This is NOT SRC intake.
- No c3_key logic here.
- No Envelope creation.
- No conversion gating.
- DB-first rendering only.
- Renderer resolves from metadata.renderer.

ROUTED

1. Classification (update existing reserve_seat):

function_layer: intake
state_expression: public_learning_reserve_seat
renderer: reserve_seat_selector

2. Encounter metadata:

entry_label:
BUILD COHERENCE

entry_headline:
Choose your point of entry.

entry_sub:
Structured learning precedes system alignment.

options:

- key: foundation_seat
  label: FOUNDATION SEAT
  description: Establish core understanding of system coherence.
  state: open

- key: systems_seat
  label: SYSTEMS SEAT
  description: Apply coherence principles to structured environments.
  state: open

- key: cohort
  label: COHORT REGISTRATION
  description: Guided institutional implementation.
  state: coming_soon

3. Actions:

foundation_seat:
→ route to foundation_offering surface

systems_seat:
→ route to systems_offering surface

cohort:
→ no route (disabled until open)

Back:
→ landing_path_choice

4. Rendering constraints:

- 3 stacked selectable cards
- clear distinction between open and coming_soon
- no form fields
- no submission actions
- no payment logic
- no diagnostics
- responsive layout
- styling from measures_design_token only

CODY ROLE

Cody may:
- update metadata for reserve_seat
- implement reserve_seat_selector renderer
- wire option routing
- enforce disabled cohort state
- write OAR1

Cody may NOT:
- introduce SRC logic
- create forms
- create payment flows
- invent additional options
- use surface_type for rendering logic

VALIDATION

- reserve_seat renders from DB
- 3 options present
- foundation and systems selectable
- cohort disabled
- routing correct
- no hardcoded content
- no conversion logic
- OAR1 written
