---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Permission Map Support Read Model v1
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
  - support-read-model
  - service-role-only
  - support-safe
  - no-public-access
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key Permission Map Storage Contract v1
  - OAR1 — c3 Key Permission Map and Access Boundary v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - OAR1 — c3 Key Assign Temporary System Function Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Permission Map Support Read Model v1

## OBSERVED

The c3 Key permission map storage surface is seated.

Current standing:

- table: `public.c3_key_permission_map`
- rows: `0`
- RLS: enabled
- public policies: `0`
- permissions granted: none
- permissions activated: none
- runtime / public API: held
- DAO / distribution activation: held
- wallet / NFT / payment: held
- recognition / conversion: held

The storage surface was seated with bounded permission classes / statuses, source record / OAR requirements, branch and role NFT fields, audit linkage, support-safe constraints, indexes, and updated-at trigger.

Access posture remains closed:

- RLS enabled
- public policy count zero
- row count zero
- anon probe did not expose table data
- no frontend read / write path opened

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

The system now needs a support-safe read model for admin / service-role visibility into permission map records.

This read model must not grant permissions.

It must not activate permissions.

It must not open public access.

It must not wire runtime.

It must not expose private authority.

## CORE RULE

Read permission standing.

Do not grant permission.

Do not activate permission.

Do not open public access.

Do not expose private authority.

Codex holds.

## ROUTED

Executor may create:

1. support-safe service-role / admin read RPC
2. allowed response fields
3. prohibited field exclusions
4. access guard
5. validation query
6. OAR1 closeout

Executor may not:

- grant permission
- activate permission
- create anon / public policy
- open authenticated broad access
- wire frontend runtime
- create public lookup
- mutate c3 Key records
- mutate permission records
- activate DAO voting
- activate distribution
- bind wallet
- mint NFT
- create recognition
- create conversion
- move folders
- create process rule

## READ MODEL PURPOSE

The support read model should answer:

- What permissions exist for this public_ref or temp_key_id?
- What source record and OAR authorized the permission?
- What permission class is involved?
- What is the permission status?
- Is it expired, revoked, held, rejected, migrated, or active?
- Is audit linkage present?
- Is branch or role NFT standing referenced?

It must not become a public permission lookup.

## ALLOWED RESPONSE FIELDS

Allowed fields:

- permission_id
- temp_key_id
- public_ref
- key_form
- origin_type
- source_record_type
- source_record_id
- source_oar_id
- source_oar_path
- permission_class
- permission_status
- branch_key
- branch_scope
- role_key
- role_nft_contract
- role_nft_token_id
- audit_id
- expires_at
- revoked_at
- support_safe
- created_at
- updated_at
- has_audit_link
- is_expired
- has_branch_scope
- has_role_reference

Allowed support metadata:

- support_safe only

## PROHIBITED RESPONSE FIELDS

Must not expose:

- temp_key
- contact_email_hash
- contact_email_encrypted
- provider API key
- service-role key
- raw email body
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase
- unbounded private metadata

## PREFERRED RPC CONTRACT

Preferred RPC:

`public.get_c3_key_permission_map_support_read(text,text)`

Suggested parameters:

- `p_public_ref text default null`
- `p_permission_class text default null`

Access posture:

- `SECURITY DEFINER`
- execute granted to `service_role` only
- execute revoked from `PUBLIC`
- execute revoked from `anon`
- execute revoked from `authenticated`

The RPC should return support-safe permission standing only.

## ACCESS POSTURE

Required:

- RLS remains enabled on `public.c3_key_permission_map`
- public policy count remains `0`
- no anon access
- no authenticated broad access
- service-role / admin only
- no frontend direct read / write

If a view risks Supabase access ambiguity, executor must use RPC instead of view.

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

`docs/oar/measures_interoperability`

System standing remains:

`system: c3_field_systems`

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

## NOT AUTHORIZED

This OAR2 does not authorize:

- permission grant
- permission activation
- permission status change
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
- Role NFT minting
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create SQL seating artifact
- create migration artifact if repo migration pattern is present
- create support-safe RPC read model
- validate no prohibited fields are exposed
- validate base table RLS remains enabled
- validate no public / anon policy is opened
- preserve zero permission grant / activation standing
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- grant or activate permission
- mutate permission records
- expose private authority
- wire frontend runtime
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

1. support read model created or prepared
2. exact files created / modified
3. whether DB mutation occurred
4. RPC / view name if seated
5. allowed fields documented
6. prohibited fields excluded
7. RLS remains enabled on base table
8. no public / anon policy opened
9. service-role-only posture confirmed if RPC seated
10. no permission granted
11. no permission activated
12. no permission records mutated
13. no runtime / public API opened
14. no DAO / distribution activation
15. no wallet / NFT / payment action
16. no recognition / conversion standing created
17. folder reconciliation not performed
18. process rule not created
19. file staged in measures_interoperability intentionally
20. final folder reconciliation remains pending
21. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_permission_map_support_read_model_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when a support-safe, service-role / admin read model exists for c3 Key permission map records, without granting or activating permissions, opening public access, wiring runtime, mutating records, activating DAO / distribution, binding wallet, minting NFTs, or creating recognition / conversion standing.

## CLOSE

Permission storage is seated.

Support read model forms.

No permission granted.

Runtime waits.

Wallet waits.

NFT waits.

DAO activation waits.

Distribution waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
