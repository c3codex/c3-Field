---
document_type: oar2
title: OAR2 Seat Offering Structure
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seat_offering_structure_v1

OBSERVED
Measures Registry now has:
- reserve_seat selector
- foundation_offering
- systems_offering
- foundation_seat_hold
- systems_seat_hold
- notification lifecycle control
- provider dispatch through Resend

Current missing layer:
the offerings are not yet structured as offerable seat records with clear public standing, sequence, and enrollment readiness.

ALIGNED
- Codex is authority.
- Offerings must be DB-seated.
- These are seats, not courses.
- No SRC.
- No c3_key.
- No payment logic in this OAR.
- No cohort activation yet.
- No frontend-authored offering truth.
- Renderer resolves from metadata.renderer.
- Lifecycle and notification systems remain separate.

ROUTED

1. Create offering registry table if absent:

measures_seat_offering

Required fields:
- id
- offering_key
- system_key
- label
- short_label
- description
- offering_type
- sequence_order
- enrollment_state
- hold_target_key
- offering_surface_key
- metadata
- created_at
- updated_at

2. Allowed offering_type

- foundation
- systems
- cohort

3. Allowed enrollment_state

- open
- coming_soon
- held
- closed

4. Seat records

Create / upsert:

A. foundation_seat

label:
FOUNDATION SEAT

short_label:
Foundation

offering_type:
foundation

sequence_order:
1

enrollment_state:
open

offering_surface_key:
foundation_offering

hold_target_key:
foundation_seat_hold

description:
Establish core understanding of system coherence, drift, distinction, and responsibility.

B. systems_seat

label:
SYSTEMS SEAT

short_label:
Systems

offering_type:
systems

sequence_order:
2

enrollment_state:
open

offering_surface_key:
systems_offering

hold_target_key:
systems_seat_hold

description:
Apply coherence principles to structured environments and operational systems.

C. cohort

label:
COHORT REGISTRATION

short_label:
Cohort

offering_type:
cohort

sequence_order:
3

enrollment_state:
coming_soon

offering_surface_key:
null

hold_target_key:
null

description:
Guided implementation cohort. Registration opens after Foundation and Systems seat structure is complete.

5. Runtime integration

reserve_seat selector should read options from measures_seat_offering where:
system_key = measures_registry
order by sequence_order

Do not hardcode seat options in metadata once table is active.

6. State behavior

open:
selectable

coming_soon:
visible but disabled

held:
visible but unavailable

closed:
visible but unavailable

7. Constraints

- no payment UI
- no checkout
- no SRC language
- no c3_key logic
- no cohort opening
- no frontend-invented options
- no slugs

CODY ROLE

Cody may:
- create measures_seat_offering table
- seed the three offering records
- update reserve_seat selector to read from table
- preserve existing routing to offering/hold surfaces
- write OAR1

Cody may NOT:
- add payment logic
- open cohort
- create SRC intake
- invent additional seats
- hardcode options in frontend
- collapse seat offering table into capture table

VALIDATION

- measures_seat_offering exists
- three records exist
- foundation_seat enrollment_state = open
- systems_seat enrollment_state = open
- cohort enrollment_state = coming_soon
- reserve_seat renders from measures_seat_offering
- foundation route works
- systems route works
- cohort disabled
- no payment/SRC/c3_key logic
- build passes
