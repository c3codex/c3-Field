---
document_type: oar1
authority_level: working
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key Permission Map Storage Contract v1
status: completed
version: v1
operator: op044
date: 2026-06-01
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_permission_map_storage_contract_v1.meta.md
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
  - storage-contract
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
  - OAR2 - c3 Key Permission Map Storage Contract v1
  - OAR1 - c3 Key Permission Map and Access Boundary v1
  - OAR1 - c3 Key Assign Temporary System Function Contract v1
  - OAR1 - c3 Key System Function Audit Surface v1
  - OAR1 - c3 Key System Function Authority Contract v1
  - OAR1 - c3 Key System-Wide Authority Boundary v1
  - OAR1 - Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - c3 Key Permission Map Storage Contract v1

## STATUS

Completed.

The c3 Key permission map storage contract was documented and seated.

DB mutation occurred only to create or preserve the support-safe permission-map storage surface.

No permission was granted.

No permission was activated.

No c3 Key or temporary c3 Key record was mutated.

No runtime, frontend route, public lookup, public API, DAO voting, distribution, wallet, NFT, payment, recognition, conversion, folder reconciliation, or process rule was opened.

## FILES CREATED

| File | Purpose |
| --- | --- |
| `docs/oar/measures_interoperability/sql/seat_c3_key_permission_map_storage_contract_v1.sql` | Operator-gated SQL seating artifact |
| `supabase/migrations/202606010002_c3_key_permission_map_storage_contract.sql` | Repo migration artifact |
| `docs/oar/measures_interoperability/oar1_c3_key_permission_map_storage_contract_v1.meta.md` | This OAR1 closeout |

## DB MUTATION

Mutation performed:

- created or preserved `public.c3_key_permission_map`
- enabled row-level security
- created bounded checks for key form, origin type, source record type, permission class, and permission status
- created support-safe, branch, role, audit, expiration, revoked, and metadata constraints
- created permission-map indexes
- created `public.c3_key_permission_map_set_updated_at()`
- created `c3_key_permission_map_set_updated_at` trigger

No rows were inserted.

No permission records were granted or activated.

## STORAGE SURFACE

Table seated:

`public.c3_key_permission_map`

Storage contract fields:

    id uuid
    temp_key_id uuid
    public_ref text
    key_form text
    origin_type text
    source_record_type text
    source_record_id text
    source_oar_id text
    source_oar_path text
    permission_class text
    permission_status text
    branch_key text
    branch_scope text
    role_nft_contract text
    role_nft_token_id text
    role_key text
    audit_id uuid
    expires_at timestamptz
    revoked_at timestamptz
    support_safe boolean
    metadata jsonb
    created_at timestamptz
    updated_at timestamptz

Required standing:

- `public_ref` or `temp_key_id`
- `key_form`
- `origin_type`
- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `permission_class`
- `permission_status`
- `support_safe = true`

## BOUNDED PERMISSION CLASSES

Enforced permission classes:

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
- event_access
- commons_access
- branch_access
- role_based_access
- contribution_submission
- distribution_eligibility
- dao_voting
- wallet_migration

## BOUNDED PERMISSION STATUSES

Enforced permission statuses:

- pending
- active
- held
- expired
- revoked
- rejected
- migrated

Active permission standing requires `audit_id`.

Expired permission standing requires `expires_at`.

Revoked permission standing requires `revoked_at`.

## SOURCE RECORD AND SOURCE OAR REQUIREMENTS

Required source record fields:

- `source_record_type`
- `source_record_id`

Allowed source record types:

- SRC
- SRC1
- SRC2
- future_SRC3

Required source OAR field:

- `source_oar_id`

Optional source OAR path:

- `source_oar_path`

Source record and source OAR identifiers must not be blank.

## BRANCH FIELDS

Branch fields documented and constrained:

- `branch_key`
- `branch_scope`

When `permission_class = branch_access`, both branch fields are required and must not be blank.

No branch access was granted.

## ROLE NFT FIELDS

Role NFT compatibility fields documented:

- `role_key`
- `role_nft_contract`
- `role_nft_token_id`

When `permission_class = role_based_access` and `permission_status = active`, `role_key` is required.

No Role NFT was minted.

No Role NFT standing was activated.

## AUDIT LINKAGE

Audit linkage documented and seated:

- `audit_id uuid references public.c3_key_system_function_audit(id) on delete set null`

Active permission standing requires `audit_id`.

The storage contract preserves:

No audit, no permission activation.

## SUPPORT-SAFE REQUIREMENT

`support_safe` is required and constrained to true.

Constraint seated:

`c3_key_permission_map_support_safe_required_check`

## PROHIBITED FIELDS EXCLUDED

The seated table does not include columns for:

- `temp_key`
- contact_email_hash
- contact_email_encrypted
- provider API key
- service-role key
- raw email body
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase
- unbounded private payloads

## ACCESS POSTURE

RLS is enabled on:

`public.c3_key_permission_map`

Public policy count:

`0`

Permission row count after seating:

`0`

Anon REST probe:

`blocked:PGRST205`

The probe did not expose table data or open public access.

No anon policy was opened.

No authenticated broad policy was opened.

No frontend direct read or write path was opened.

## VALIDATION EVIDENCE

Executed through Supabase `exec_sql` RPC using server-side environment credentials.

Validation assertion result:

    validation_ok table_exists=true rls_enabled=true policy_count=0 row_count=0 critical_constraints=5 expected_indexes=8 updated_at_trigger=true

Validated:

- table exists
- RLS enabled
- policy count is zero
- permission row count is zero
- critical support-safe / branch / role / audit constraints exist
- expected indexes exist
- updated-at trigger exists

## NOT PERFORMED

The following were not performed in this OAR1 execution:

- no permission granted
- no permission activated
- no runtime wired
- no frontend route wired
- no public c3 Key lookup opened
- no public API opened
- no DAO voting activated
- no distribution activated
- no wallet binding performed
- no wallet verification performed
- no NFT deployment performed
- no NFT minting performed
- no Role NFT minting performed
- no payment activation performed
- no recognition standing created
- no verification claim created
- no conversion standing created
- no folder reconciliation performed
- no process rule created

## VALIDATION AGAINST OAR2

Confirmed:

1. permission storage contract seated
2. exact files created / modified documented
3. DB mutation occurred and is documented
4. bounded permission classes enforced
5. bounded permission statuses enforced
6. source record fields required
7. source OAR field required
8. branch fields documented and constrained
9. role NFT fields documented and constrained
10. audit linkage documented and constrained for active standing
11. `support_safe` required true
12. prohibited fields excluded
13. RLS enabled
14. no public / anon policy opened
15. no permission granted
16. no permission activated
17. no runtime / public API opened
18. no DAO / distribution activation
19. no wallet / NFT / payment action
20. no recognition / conversion standing created
21. folder reconciliation not performed
22. process rule not created
23. file staged in measures_interoperability intentionally
24. final folder reconciliation remains pending
25. next route recommendation documented

## NEXT ROUTE RECOMMENDATION

Recommended next route:

`OAR2 - c3 Key Permission Map Support Read Model v1`

Entry condition:

Proceed only if the route explicitly preserves zero public table policies and exposes support-safe fields through a service-role/admin read model.

Alternate route:

`OAR2 - c3 Key Permission Map Invocation Audit Contract v1`

Use the alternate route first if grant, hold, expiration, revocation, rejection, or migration audit behavior needs additional contract seating before any read model is exposed.

## CLOSE

Permission map storage is seated.

No permission granted.

No permission activated.

RLS holds.

Public policy count is zero.

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
