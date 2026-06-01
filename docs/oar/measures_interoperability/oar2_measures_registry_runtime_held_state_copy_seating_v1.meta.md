---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — Measures Registry Runtime Held-State Copy Seating v1
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
  - held-state
  - copy-seating
  - database-first
  - registry-driven
  - no-hardcode
  - no-css-change
  - no-deployment
  - no-payment-activation
  - no-c3-key-activation
  - no-permission-activation
  - no-recognition
  - no-conversion
  - staging
  - folder-reconciliation-pending
source_alignment:
  - OAR1 — Measures Registry Runtime Held-State Messaging Contract v1
  - OAR1 — Measures Registry Runtime Governing Audit Comparison v1
  - OAR1 — c3 Non-Wallet Payment Standing Contract v1
  - OAR1 — c3 Key Assign Temporary System Function Operator Use Packet v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Runtime Held-State Copy Seating v1

## OBSERVED

The held-state messaging contract is seated.

Current standing:

- held-state messaging contract: completed
- runtime mutation: not performed
- CSS mutation: not performed
- DB mutation: not performed
- deployment: not performed
- payment activation: held
- c3 Key assignment: held
- permission activation: held
- wallet / NFT activation: held
- DAO / distribution activation: held
- recognition / conversion activation: held

The prior OAR1 defines allowed held language, prohibited activation language, surface-specific copy, placement guidance, and confirms no activation occurred across payment, c3 Key, permission, wallet / NFT, DAO / distribution, recognition, verification, conversion, or c3 MAP access.

The prior OAR1 recommends this route if the operator wants public runtime to display held-state language through a bounded runtime implementation path.

Operator has confirmed this route must be database-driven.

## ALIGNED

Held-state copy must be seated in database / registry state first.

Runtime must render seated copy.

Runtime must not own held-state truth.

CSS must not be changed unless separately routed.

No public copy may imply payment, c3 Key, permission, recognition, conversion, wallet, NFT, DAO, or distribution activation.

## CORE RULE

Database seats held-state copy.

Renderer displays seated held-state copy.

Frontend does not author held-state truth.

No held state becomes active by being described.

Codex holds.

## ROUTED

Executor may inspect and document:

1. current DB surfaces capable of holding held-state copy
2. target encounter keys / registry keys for held-state copy
3. preferred metadata shape for held-state copy
4. renderer support or gap
5. required DB insert / update plan
6. validation queries
7. OAR1 closeout

Executor may not:

- modify runtime code
- modify CSS
- deploy
- activate payment
- issue temp c3 Key
- grant permission
- activate c3 MAP access
- bind wallet
- mint NFT
- activate DAO voting
- activate distribution
- claim recognition
- claim conversion
- move folders
- create process rule

## DATABASE-FIRST COPY CONTRACT

Held-state copy must be seated in the relevant registry / encounter metadata, not hardcoded in React.

Preferred copy payload shape:

    held_state:
      status: held | pending | under_review | not_yet_active
      surface_role: payment | c3_key | c3_map | recognition | conversion | processor | wallet_migration | permission
      display_title: ""
      display_body: ""
      allowed_next_step: ""
      prohibited_implication:
        - ""
      activation_boundary: ""
      support_safe: true

If existing metadata uses a different field shape, executor must preserve current schema and map this contract to the seated structure instead of inventing a second copy authority.

## TARGET SURFACES TO INSPECT

Minimum target surfaces:

- payment / seat-hold surface
- assessment package surface
- contact / intake surface
- c3 MAP explanation surface
- c3 Key explanation surface
- confirmation / status surface
- recognition / conversion status surface
- Stripe / processor status surface

Executor must identify actual registry keys, encounter keys, or metadata paths before any DB seating.

If a target surface does not exist:

- report absence
- do not invent route

## REQUIRED COPY BOUNDARIES

### 1. Payment / Seat-Hold

Allowed database copy:

This surface records seat-hold or payment-interest standing only.

Live processor execution is not active yet.

Payment standing requires separate confirmation.

Payment does not complete conversion or grant access by itself.

### 2. c3 Key

Allowed database copy:

c3 Key standing is a continuity credential.

Temporary assignment requires active source / OAR binding and operator-authorized execution.

Wallet-held migration is held until the c3 Key contract route is separately activated.

Permissions remain separately governed.

### 3. c3 MAP

Allowed database copy:

c3 MAP is Measures Assessment Protocol / commerce circuit standing.

C1 / C2 / C3 are governed commerce circuit standings where separately mapped.

Payment standing may support eligibility, but does not activate permission by itself.

### 4. Recognition / Conversion

Allowed database copy:

Recognition follows verification.

Conversion is not complete until separately reviewed, verified, and seated.

Current standing may be pending review, held, or in assessment.

### 5. Stripe / Processor

Allowed database copy:

Stripe setup is held pending business verification and processor routing.

Processor integration is not active yet.

Webhook handling is not active yet.

Payment is not automatically recorded from processor events.

## PROHIBITED COPY

Database copy must not say or imply:

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

unless separately seated and verified in a later route.

## RENDERER CONTRACT

Renderer may display held-state copy only if:

1. copy exists in DB metadata / registry state
2. support_safe = true
3. surface_role is recognized
4. activation boundary is present
5. prohibited activation language is absent

If renderer does not yet support this metadata:

- report renderer gap
- recommend runtime extension OAR2
- do not hardcode copy

## CANDIDATE DB SURFACES

Executor must inspect current standing before choosing.

Candidate DB surfaces may include:

- public.measures_registry.metadata
- public.measures_encounter_def.metadata
- public.measures_design_token where already used for display contracts
- any seated Measures Registry copy / publication / dispatch table already used by registered runtime

Executor must not create a new authority path if an existing registry / encounter metadata path is sufficient.

Executor must report which table and metadata path is selected.

## VALIDATION QUERIES

OAR1 must include read-only validation showing:

- target records inspected
- target metadata path selected or renderer gap found
- held_state payload presence if DB mutation occurs
- support_safe = true if seated
- no prohibited copy appears in seated payload
- no runtime file changed
- no CSS file changed
- no deployment occurred

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

docs/oar/measures_interoperability

System standing remains:

measures_registry

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

## NOT AUTHORIZED

This OAR2 does not authorize:

- runtime code modification
- CSS modification
- deployment
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

- inspect current DB and runtime surfaces
- identify candidate metadata paths
- seat held-state copy in DB if an existing registry / encounter metadata path supports it
- preserve renderer-driven authority
- validate prohibited activation language is absent
- validate no runtime / CSS change occurred
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- hardcode held-state copy in React
- create a second copy authority
- edit CSS
- deploy
- activate payment
- issue c3 Key
- grant permission
- activate permission
- bind wallet
- mint NFT
- claim recognition
- claim conversion
- move folders
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. DB-first copy seating contract documented
2. exact files created / modified
3. whether DB mutation occurred
4. candidate DB surfaces inspected
5. target registry / encounter keys identified or absence reported
6. metadata path selected or renderer gap reported
7. held-state copy payload documented
8. prohibited activation language checked
9. c3 MAP distinction preserved
10. c3 Key boundary preserved
11. payment boundary preserved
12. recognition / conversion boundary preserved
13. Stripe / processor boundary preserved
14. no runtime code modification occurred
15. no CSS modification occurred
16. no deployment occurred
17. no payment / c3 Key / permission / recognition / conversion activation occurred
18. no folder reconciliation occurred
19. no process rule created
20. next route recommendation

## EXPECTED OAR1

docs/oar/measures_interoperability/oar1_measures_registry_runtime_held_state_copy_seating_v1.meta.md

## SUCCESS CONDITION

This OAR2 succeeds when the database-first path for Measures Registry held-state copy is defined, target registry / encounter surfaces are identified, renderer support or gap is documented, and no held state is activated or hardcoded.

## CLOSE

Held-state copy seats from DB.

Runtime code waits unless renderer gap is proven.

CSS waits.

Stripe waits.

Payment waits.

c3 Key assignment waits.

Permissions wait.

Wallet / NFT waits.

Recognition waits.

Conversion waits.

Codex holds.
