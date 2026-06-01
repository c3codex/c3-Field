---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — Measures Registry Runtime Governed Status Renderer Support v1
status: proposed
version: v1
operator: op044
system: measures_registry
staging_location: measures_interoperability
final_location_pending: true
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - runtime
  - governed-status
  - renderer-support
  - held-state
  - missing-state
  - incomplete-state
  - database-driven
  - registry-driven
  - no-hardcode
  - no-css-change
  - no-db-mutation
  - no-deployment
  - no-payment-activation
  - no-c3-key-activation
  - no-permission-activation
  - no-recognition
  - no-conversion
  - staging
  - folder-reconciliation-pending
source_alignment:
  - OAR1 — Measures Registry Runtime Held-State Copy Seating v1
  - OAR1 — Measures Registry Runtime Held-State Messaging Contract v1
  - OAR1 — Measures Registry Runtime Governing Audit Comparison v1
  - OAR1 — c3 Non-Wallet Payment Standing Contract v1
  - OAR1 — c3 Key Assign Temporary System Function Operator Use Packet v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Runtime Governed Status Renderer Support v1

## OBSERVED

Held-state copy is seated in DB at:

`public.measures_encounter_def.metadata.held_state`

Rows updated:

- `phase_payment`
- `reserve_seat`
- `connect_src`
- `measures_assessment`
- `measures_phases_reveal`

The previous OAR1 confirms:

- DB copy is seated
- runtime display is not yet active
- renderer gap is confirmed
- active registered runtime reads `measures_encounter_def.metadata`
- active registered runtime does not currently map or display `metadata.held_state`

Operator has clarified the runtime principle extends beyond held-state copy to governed status rendering for:

- held
- pending
- missing
- incomplete
- unavailable
- sealed
- not yet active
- renderer gap
- source absent
- file absent
- chamber not ready
- encounter not ready

## ALIGNED

This route replaces the narrower held-state renderer support route.

The site should render governed status from DB-seated state / copy.

Frontend must not invent fallback truth.

Frontend must not hide absence with hardcoded copy.

Frontend must not imply activation.

Runtime may now be extended only to render seated DB status copy.

Runtime must not author governed status truth.

Runtime must not introduce new copy authority.

Runtime must not activate payment, c3 Key, permission, wallet / NFT, DAO / distribution, recognition, conversion, or c3 MAP access.

No CSS change is authorized.

## CORE RULE

DB seats status.

Renderer displays governed status.

Frontend does not author missing, held, incomplete, or unavailable truth.

No status message activates access, payment, c3 Key, permission, wallet / NFT, DAO / distribution, recognition, or conversion.

Codex holds.

## ROUTED

Executor may:

1. inspect active registered runtime status handling
2. add renderer support for `metadata.held_state`
3. support future governed status payloads if present
4. render only DB-seated support-safe status copy
5. validate `support_safe = true`
6. validate recognized `surface_role` / `status_role`
7. validate `activation_boundary` exists
8. block display if prohibited activation language appears in display fields
9. preserve threshold hero language
10. preserve active routing
11. write OAR1 closeout

Executor may not:

- change CSS
- create new copy authority
- hardcode status copy
- modify DB
- deploy
- activate payment
- issue c3 Key
- grant permission
- bind wallet
- mint NFT
- activate DAO / distribution
- claim recognition
- claim conversion
- move folders
- create process rule

## GOVERNED STATUS CONTRACT

Renderer may display governed status from DB metadata when one of these payloads exists:

- `metadata.held_state`
- `metadata.status_state`
- `metadata.missing_state`
- `metadata.incomplete_state`
- `metadata.unavailable_state`
- `metadata.renderer_gap_state`

Initial required support:

- `metadata.held_state`

Future-compatible support may be added only if it follows the same guard contract.

Preferred payload shape:

    status_state:
      status: held | pending | missing | incomplete | unavailable | sealed | not_yet_active | under_review
      surface_role: payment | c3_key | c3_map | recognition | conversion | processor | wallet_migration | permission | encounter | chamber | file | source | renderer
      display_title: ""
      display_body: ""
      allowed_next_step: ""
      prohibited_implication:
        - ""
      activation_boundary: ""
      support_safe: true

Existing seated copy currently uses:

`metadata.held_state`

Do not create a second copy authority.

## RECOGNIZED STATUS VALUES

Allowed status values:

- held
- pending
- under_review
- missing
- incomplete
- unavailable
- sealed
- not_yet_active
- renderer_gap
- source_absent
- file_absent
- chamber_not_ready
- encounter_not_ready

## RECOGNIZED SURFACE ROLES

Allowed surface roles:

- payment
- c3_key
- c3_map
- recognition
- conversion
- processor
- wallet_migration
- permission
- encounter
- chamber
- file
- source
- renderer
- route
- media

Unknown roles must not render.

## RENDERER GUARDS

Renderer may display governed status only when:

1. status payload exists in DB metadata
2. `support_safe = true`
3. status is recognized
4. `surface_role` is recognized
5. `activation_boundary` exists
6. display fields contain no prohibited activation language

Allowed display fields:

- `display_title`
- `display_body`
- `allowed_next_step`
- `activation_boundary`
- `status`
- `surface_role`

Do not render:

- `prohibited_implication`
- `source_oar2`
- raw metadata
- unknown fields
- private payloads
- debug objects

## PROHIBITED DISPLAY CHECK

Block display if these appear in display fields unless separately seated later:

- payment complete
- conversion complete
- recognized
- verified
- access granted
- permission activated
- c3 Key issued
- wallet-bound
- NFT minted
- DAO voting active
- distribution eligible
- processor connected
- webhook active
- automatic enrollment
- automatic conversion
- guaranteed acceptance
- c3 MAP access active

## MISSING / INCOMPLETE / UNAVAILABLE RULE

If an encounter, chamber, route, file, media, source, or renderer state is missing / incomplete / unavailable:

Renderer must display only DB-seated governed status copy.

If no DB-seated status copy exists:

- renderer may show a minimal neutral system-safe absence state only where an absence surface already exists
- renderer may not invent explanatory copy
- renderer must not imply access, activation, recognition, conversion, or completion

Minimal neutral fallback may be limited to:

`This surface is not available yet.`

Only if the current renderer already has a generic absence surface. Otherwise report gap.

## PLACEMENT

Governed status display may render inside:

- encounter body
- status panel
- card note
- support-safe notice area
- payment / seat-hold surface
- assessment package surface
- contact / intake surface
- c3 MAP explanation surface
- c3 Key explanation surface
- confirmation / status surface

It must not replace or clutter the threshold hero.

Threshold hero remains:

- `Evaluate the Environment`
- `Structure the Environment`

## NOT AUTHORIZED

This OAR2 does not authorize:

- CSS modification
- DB mutation
- deployment
- new copy authority
- hardcoded copy
- payment processor integration
- payment execution
- webhook activation
- temp c3 Key issuance
- permission grant
- permission activation
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- Role NFT minting
- DAO voting activation
- distribution activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- inspect active registered runtime status handling
- update renderer mapping to read DB-seated governed status copy
- begin with `metadata.held_state`
- optionally support future governed status payload names through the same guard contract
- add support-safe guard checks
- block prohibited activation language in display fields
- preserve threshold hero copy
- preserve active routing
- validate no hardcoded status copy was introduced
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- write held-state copy directly into React
- create new status copy in frontend
- edit CSS
- mutate DB
- deploy
- activate payment
- issue c3 Key
- grant permission
- activate permission
- bind wallet
- mint NFT
- activate DAO / distribution
- claim recognition
- claim conversion
- move folder location before reconciliation is routed
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. exact files modified
2. renderer support added for `metadata.held_state`
3. whether future-compatible status payload support was added
4. no DB mutation occurred
5. no CSS modification occurred
6. no deployment occurred
7. no hardcoded governed status copy added
8. `support_safe` guard implemented
9. recognized status guard implemented
10. recognized `surface_role` guard implemented
11. `activation_boundary` guard implemented
12. prohibited display-language guard implemented
13. unknown / raw metadata not rendered
14. threshold hero preserved
15. active routing preserved
16. payment not activated
17. c3 Key not issued
18. permission not granted / activated
19. wallet / NFT not activated
20. DAO / distribution not activated
21. recognition / conversion not claimed
22. folder reconciliation not performed
23. process rule not created
24. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_runtime_governed_status_renderer_support_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when active registered runtime can render DB-seated governed status copy safely, beginning with `metadata.held_state`, while preserving support-safe guards, avoiding hardcoded copy, avoiding CSS changes, avoiding DB mutation, and activating no held operational state.

## CLOSE

Governed status rendering forms now.

DB remains authority.

Runtime renders only seated status.

CSS waits.

Deployment waits.

Stripe waits.

Payment waits.

c3 Key assignment waits.

Permissions wait.

Wallet / NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
