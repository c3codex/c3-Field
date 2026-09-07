---
document_type: oar1
authority_level: working
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Permission Map and Access Boundary v1
status: completed
version: v1
operator: op044
date: 2026-06-01
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_permission_map_and_access_boundary_v1.meta.md
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
  - oar1
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
  - OAR2 - c3 Key Permission Map and Access Boundary v1
  - OAR1 - c3 Key Assign Temporary System Function Contract v1
  - OAR1 - c3 Key System Function Audit Surface v1
  - OAR1 - c3 Key System Function Authority Contract v1
  - OAR1 - c3 Key System-Wide Authority Boundary v1
  - OAR1 - Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - c3 Key Permission Map and Access Boundary v1

## STATUS

Completed.

This OAR1 documents the c3 Key permission map and access boundary contract.

This closeout is documentary only.

No permission table was created.

No permission was granted.

No c3 Key or temporary c3 Key record was mutated.

No runtime, frontend route, public lookup, public API, DAO voting, distribution, wallet, NFT, payment, recognition, conversion, folder reconciliation, or process rule was opened.

## PERMISSION MAP CONTRACT DOCUMENTED

c3 Key standing is identity and continuity standing.

Permission standing is the access authority.

The c3 Key does not open gates by itself.

The permission map records what access is active, held, expired, revoked, rejected, or migrated.

Future permission records must resolve through:

    source_record_type: SRC | SRC1 | SRC2 | future_SRC3
    source_record_id: ""
    source_oar_id: ""
    source_oar_path: ""
    key_form: temporary | wallet_held
    origin_type: named_individual | institution_in_service
    permission_class: ""
    permission_status: pending | active | held | expired | revoked | rejected | migrated
    expires_at: ""

Core rule preserved:

No permission record, no access expansion.

No valid source standing, no permission.

No OAR-bound authorization, no permission change.

No prohibited-access boundary, no assignment.

## SOURCE STANDING RULE DOCUMENTED

No c3 Key permission may be granted without valid source standing.

Allowed source record types:

- SRC1 = Connect intake
- SRC2 = Contribute intake
- SRC = Measures Conversion intake
- future_SRC3 = DAO / web3 intake once seated

Future SRC3 remains held until separately routed.

Every permission must reference the relevant source record and bound OAR.

If source standing is missing, unverified, unrelated, or ineligible:

- permission status must be `held` or `rejected`
- no access expansion occurs

## MEASURES REGISTRY AND c3 MAP ACCESS CLASSES DOCUMENTED

For Measures Registry and conversion standing, future permission classes may include:

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

Allowed Measures access requires:

    valid c3 Key
    + valid SRC / SRC1 / SRC2 standing
    + OAR-bound permission
    + active c3 MAP circuit permission
    + audit trace
    = allowed Measures access

A valid c3 Key alone does not grant all Measures access.

## GENERAL PERMISSION CLASSES DOCUMENTED

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

No permission is granted by this OAR1.

## DAO VOTING NOTE DOCUMENTED

DAO voting is recognized as a future baseline function of a valid c3 Key.

DAO voting remains subject to:

- c3 DAO governance route
- wallet-held execution requirements where applicable
- SRC3 standing once separately seated
- permission map standing
- audit trace

This OAR1 does not define or activate:

- DAO mechanics
- voting weight
- proposal rights
- quorum
- delegation
- distribution rights
- token execution
- SRC3 implementation

DAO voting execution remains held.

## BRANCH ACCESS PATTERN DOCUMENTED

Future branch access may be represented by branch-scoped permission records.

Example pattern:

    permission_class: branch_access
    branch_key: measures_registry
    branch_scope: communication_trace_support
    permission_status: active
    source_record_type: SRC1
    source_record_id: ""
    source_oar_id: ""
    expires_at: ""

Branch access rules:

- no branch permission, no branch access
- no source standing, no branch permission
- no OAR-bound authorization, no branch expansion
- no audit trace, no permission change

## ROLE NFT COMPATIBILITY PATTERN DOCUMENTED

Future role NFTs may be used as role-bearing credentials alongside c3 Key.

Separation preserved:

- c3 Key = core identity / continuity credential
- Role NFT = permission-bearing role credential
- Permission Map = what combined standing allows
- Audit = proof of assignment / change / use

Future access may require:

    valid c3 Key
    + required Role NFT
    + active permission record
    + valid source standing
    + audit trace

Temporary c3 Keys may prepare role eligibility.

Wallet-held c3 Keys may hold Role NFTs.

Role NFT activation still resolves through the permission map.

No role NFT was minted or activated.

## KEY FORM DISTINCTIONS DOCUMENTED

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

Wallet-held c3 Key may be eligible for stronger permissions only when separately routed:

- DAO voting execution
- distribution eligibility
- commons access
- wallet-based payment or contract actions
- expanded contribution / participation surfaces
- role NFT activation
- branch-scoped access

Wallet-held status alone does not grant all permissions.

## PERMISSION STATUSES DOCUMENTED

Future permission standing should use bounded statuses:

- pending
- active
- held
- expired
- revoked
- rejected
- migrated

Access is allowed only when:

- `permission_status = active`
- permission has not expired
- source standing remains valid
- prohibited boundary is not violated

## PROHIBITED ACCESS BOUNDARY DOCUMENTED

No c3 Key permission may expose or grant access to:

- `temp_key`
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

## AUDIT REQUIREMENT DOCUMENTED

Every future permission grant, hold, expiration, revocation, migration, or rejection must create audit standing.

Minimum future audit shape:

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

## FUTURE TEMP ASSIGNMENT STANDING

Future temporary c3 Key assignment remains allowed only through protected, audited, OAR-bound routes.

Temporary c3 Key assignment does not itself grant access expansion.

Access expansion requires permission standing.

## NOT PERFORMED

The following were not performed in this OAR1 execution:

- no permission runtime implemented
- no permission table created
- no permission granted
- no c3 Key record mutated
- no temporary c3 Key record mutated
- no frontend route wired
- no public lookup opened
- no public API opened
- no DAO voting activated
- no distribution activated
- no wallet binding performed
- no wallet verification performed
- no NFT deployment performed
- no NFT minting performed
- no payment activation performed
- no recognition standing created
- no verification claim created
- no conversion standing created
- no folder reconciliation performed
- no process rule created

## VALIDATION AGAINST OAR2

Confirmed:

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
24. next route recommendation documented

## NEXT ROUTE RECOMMENDATION

Recommended next route:

`OAR2 - c3 Key Permission Map Storage Contract v1`

Entry condition:

Proceed only if the route explicitly authorizes a permission storage contract or table design without granting permissions or opening runtime access.

Alternate route:

`OAR2 - c3 Key Permission Audit Invocation Contract v1`

Use the alternate route first if audit behavior for grant, hold, expiration, revocation, migration, or rejection needs additional contract seating before storage or runtime work.

## CLOSE

c3 Key identifies continuity.

Permission map governs access.

c3 MAP governs Measures commerce circuit access.

Branch access remains scoped.

Role NFT compatibility remains separate.

envKey remains envelope-specific.

DAO activation waits.

Distribution waits.

Runtime waits.

Wallet waits.

NFT waits.

Payment waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
