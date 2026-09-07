---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Permission Map and Access Boundary v1
status: proposed
version: v1
operator: op044
system: c3_field_systems
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
  - c3-field-systems
  - c3-key
  - permission-map
  - access-boundary
  - c3-map
  - branch-access
  - role-nft
  - dao-voting-held
  - support-safe
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key Assign Temporary System Function Contract v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - OAR1 — c3 Key System Function Authority Contract v1
  - OAR1 — c3 Key System-Wide Authority Boundary v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Permission Map and Access Boundary v1

## OBSERVED

The c3 Key system-wide boundary, system-function authority contract, audit surface, and `assign_temp_c3_key` contract are seated.

Current standing:

- c3 Key = system-wide continuity credential
- Temporary c3 Key = provisional system-wide standing
- Measures Registry = first implementation surface
- c3 Field systems = parent callable-function authority layer
- audit surface = live
- `assign_temp_c3_key` contract = documented
- implementation = held
- runtime = held
- wallet / NFT = held
- recognition / conversion = held

The c3 Key does not open gates by itself.

It records who passed through them.

Access must resolve through source standing, OAR trace, permission class, role standing where applicable, and audit.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

The c3 Key must not become a master key.

The permission model must distinguish:

- c3 Key = who passed / continuity credential
- Permission Map = what access is currently active
- Role NFT = optional role-bearing credential
- Branch Permission = branch-specific access scope
- Audit = proof of grant / change / use

For Measures Registry / conversion, the access layer should resolve through c3 MAP commerce circuits and related Measures surfaces.

DAO voting is recognized as a future baseline c3 Key function, but DAO mechanics are not seated here.

## CORE RULE

No permission record, no access expansion.

No valid source standing, no permission.

No OAR-bound authorization, no permission change.

No prohibited-access boundary, no assignment.

c3 Key does not open gates.

c3 Key records who passed through them.

Codex holds.

## ROUTED

Executor may document:

1. c3 Key permission map contract
2. Measures Registry / c3 MAP access classes
3. permission classes
4. key-form distinctions
5. source standing rules
6. branch access pattern
7. role NFT compatibility pattern
8. DAO voting future-baseline note without mechanics
9. prohibited access boundary
10. audit requirement
11. OAR1 closeout

Executor may not:

- implement permission runtime
- create permission table
- grant permissions
- mutate existing c3 Key or temp key records
- wire frontend
- open public lookup
- activate DAO voting
- activate distributions
- bind wallet
- mint NFT
- create recognition
- create conversion
- move folders
- create process rule

## PERMISSION MODEL

The c3 Key identifies origin and continuity.

Permission records determine allowed action.

Permission standing must resolve from:

    source_record_type: SRC | SRC1 | SRC2 | future_SRC3
    source_record_id: ""
    source_oar_id: ""
    source_oar_path: ""
    key_form: temporary | wallet_held
    origin_type: named_individual | institution_in_service
    permission_class: ""
    permission_status: pending | active | held | expired | revoked | rejected | migrated
    expires_at: ""

## SOURCE STANDING RULE

No c3 Key permission may be granted without valid source standing.

Allowed source record types:

- SRC1 = Connect intake
- SRC2 = Contribute intake
- SRC = Measures Conversion intake
- future SRC3 = DAO / web3 intake once seated

Future SRC3 remains held until separately seated.

Every permission must reference the relevant source record and bound OAR.

If the source record is missing, unverified, unrelated, or ineligible:

- permission_status = rejected | held
- no access expansion

## MEASURES REGISTRY / c3 MAP ACCESS CLASSES

For Measures Registry and conversion, c3 Key permission standing may allow access to:

- measures_registry_participation
- c3_map_access
- c3_map_c1_access
- c3_map_c2_access
- c3_map_c3_access
- assessment_access
- conversion_intake_access
- agreement_acknowledgment_access
- communication_trace_support
- course_access
- cohort_access
- operator_support_read

c3 MAP circuit framing:

- C1 = governed entry / Connect commerce circuit
- C2 = governed contribution / Contribute commerce circuit
- C3 = governed conversion / Create commerce circuit

Access resolves only when:

    valid c3 Key
    + valid SRC / SRC1 / SRC2 standing
    + OAR-bound permission
    + active c3 MAP circuit permission
    + audit trace
    = allowed Measures access

A valid c3 Key alone does not grant all Measures access.

## GENERAL PERMISSION CLASSES

Additional future permission classes may include:

- event_access
- commons_access
- branch_access
- role_based_access
- contribution_submission
- distribution_eligibility
- dao_voting
- wallet_migration

These are classes only.

This OAR2 does not grant any permission.

## DAO VOTING NOTE

DAO voting is recognized as a future baseline function of a valid c3 Key, subject to the c3 DAO governance route, wallet-held execution requirements where applicable, and SRC3 standing once seated.

This OAR2 does not define:

- DAO mechanics
- voting weight
- proposal rights
- quorum
- delegation
- distribution rights
- token execution
- SRC3 implementation

DAO voting execution remains held.

## BRANCH ACCESS PATTERN

Future branch access may be added by branch-scoped permission records.

Example:

    permission_class: branch_access
    branch_key: measures_registry
    branch_scope: communication_trace_support
    permission_status: active
    source_record_type: SRC1
    source_record_id: ""
    source_oar_id: ""
    expires_at: ""

Rule:

- No branch permission, no branch access.
- No source standing, no branch permission.
- No OAR-bound authorization, no branch expansion.

## ROLE NFT COMPATIBILITY PATTERN

Future role NFTs may be used as role-bearing credentials alongside c3 Key.

Clean separation:

- c3 Key = core identity / continuity credential
- Role NFT = permission-bearing role credential
- Permission Map = what combined standing allows
- Audit = proof of assignment / change / use

Access may later require:

    valid c3 Key
    + required Role NFT
    + active permission record
    + valid source standing
    + audit trace

Temporary c3 Keys may prepare role eligibility.

Wallet-held c3 Keys may hold Role NFTs.

Role NFT activation must still resolve through permission map.

## KEY FORM RULE

Temporary c3 Key may be eligible for:

- measures_registry_participation
- c3_map_access where permitted
- assessment_access where permitted
- agreement acknowledgment continuity
- communication trace support
- limited event / course access where separately routed
- wallet migration preparation

Temporary c3 Key may not automatically grant:

- distribution_eligibility
- wallet-held payment execution
- recognition
- conversion
- NFT standing
- wallet standing
- role NFT standing

Wallet-held c3 Key may be eligible for stronger permissions, but only when separately routed:

- DAO voting execution
- distribution eligibility
- commons access
- wallet-based payment or contract actions
- expanded contribution / participation surfaces
- role NFT activation
- branch-scoped access

Wallet-held status alone does not grant all permissions.

## PERMISSION STATUS VALUES

Future permission standing should use bounded statuses:

- pending
- active
- held
- expired
- revoked
- rejected
- migrated

Access is allowed only when:

- permission_status = active
- permission has not expired
- source standing remains valid
- prohibited boundary is not violated

## PROHIBITED ACCESS BOUNDARY

No c3 Key permission may expose or grant access to:

- temp_key
- contact_email_hash
- contact_email_encrypted
- provider API keys
- service-role keys
- raw email body
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase
- unrelated SRC records
- unrelated Envelope / envKey records
- unrelated Institution records
- recognition standing not verified
- conversion standing not verified
- unbounded admin / system records

c3 Key must not collapse into envKey.

c3 Key may relate to Envelope / envKey access, but envKey remains the envelope-specific access handle.

## AUDIT REQUIREMENT

Every future permission grant, hold, expiration, revocation, migration, or rejection must create audit standing.

Minimum audit fields:

    function_name: resolve_c3_key_standing
    action_type: permission_change
    result_status: executed | held | failed | rejected | cancelled
    operator_ref: ""
    source_oar_id: ""
    public_ref: ""
    input_ref:
      source_record_type: ""
      source_record_id: ""
      permission_class: ""
      requested_status: ""
    output_ref:
      permission_status: ""
      expires_at: ""
    support_safe: true
    metadata: {}

No audit, no permission change.

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

`docs/oar/measures_interoperability`

System standing remains:

`system: c3_field_systems`

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

## NOT AUTHORIZED

This OAR2 does not authorize:

- permission table creation
- permission grant
- runtime wiring
- frontend route
- public c3 Key lookup
- public API
- DAO voting activation
- distribution activation
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create this permission-map document in the measures_interoperability staging folder
- preserve c3 Field systems as parent authority
- preserve Measures Registry implementation standing
- document c3 MAP access classes
- document DAO voting note without mechanics
- document branch access and role NFT compatibility patterns
- document prohibited access boundaries
- document audit requirements
- recommend next route
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- implement permission runtime
- create permission table
- grant permissions
- alter temp c3 Key records
- move existing tables
- rename existing Measures Registry implementation surfaces
- wire runtime
- open public access
- bind wallet
- mint NFT
- activate DAO voting
- activate distributions
- activate payment
- create recognition / conversion
- move folder location before reconciliation is routed
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. permission map contract documented
2. source standing rule documented
3. Measures Registry / c3 MAP access classes documented
4. general permission classes documented
5. DAO voting future-baseline note documented without mechanics
6. branch access pattern documented
7. role NFT compatibility pattern documented
8. key form distinctions documented
9. permission statuses documented
10. prohibited access boundary documented
11. audit requirement documented
12. c3 Key does not collapse into envKey
13. future temp assignment remains allowed
14. no permission granted
15. no runtime implementation occurred
16. no public access opened
17. no wallet / NFT action occurred
18. no DAO voting or distribution activation occurred
19. no recognition / conversion standing created
20. folder reconciliation not performed
21. process rule not created
22. file staged in measures_interoperability intentionally
23. final folder reconciliation remains pending
24. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_permission_map_and_access_boundary_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when c3 Key permissions are defined as registered, auditable access standing separate from key identity, preserving source-record eligibility, c3 MAP commerce circuit access for Measures Registry, permission classes, branch / role compatibility, prohibited access boundaries, temp / wallet distinction, and no runtime, wallet, NFT, DAO, payment, recognition, conversion, folder reconciliation, or process-rule execution.

## CLOSE

c3 Key identifies continuity.

Permission map governs access.

c3 MAP governs Measures commerce circuit access.

Role NFTs may carry future roles.

Branch permissions may scope future access.

Prohibited boundary protects private authority.

Audit records changes.

Implementation waits.

Runtime waits.

Wallet waits.

NFT waits.

DAO activation waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
