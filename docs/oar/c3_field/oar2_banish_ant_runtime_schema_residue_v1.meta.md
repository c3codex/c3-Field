---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Banish ANT Runtime/Schema Residue
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1: docs/oar/c3_field/oar1_audit_and_banish_ant_residue_from_c3_field_registered_system_schema_standing_v1.meta.md
tags:
  - oar2
  - c3-field
  - ant-residue
  - banish
  - schema-cleanup
  - passage-law
  - canopy-law
  - registered-system
  - branch-guard
---

# OAR2 — Banish ANT Runtime/Schema Residue v1

## OBSERVED

OAR1 audit confirmed ANT residue remains in schema standing.

ANT tables have 0 rows, so data-level risk is low.

Schema-level dependency remains active through:

- `measures_registry_envelope_id_fkey`
- `v_envelope_access_by_c3key_v1`
- `v_field_relation_graph_v1`
- `v_measures_registry_state_v1`
- `refresh_ant_passage_state()` — broken; references removed `ant_oar_log`
- `prevent_ant_oar_log_mutation()` — orphaned
- `ant_inbox`
- `ant_signal_record`
- ANT triggers and remaining ANT tables

ANT may not be used as valid c3 Field support.

The prior audit standing has been corrected:

- passage support via ANT = invalid support surface
- canopy support via ANT = invalid support surface
- envelope/signal support via ANT = invalid support surface

Registered-system schema remains intact:

- `c3_registered_system` exists
- Measures Registry is registered
- `runtime_admission_state = not_seated`

This OAR performs the first safe banishment pass.

It removes broken/orphaned/deprecated ANT residue and removes active ANT dependencies that block future non-ANT passage and canopy law.

It does not yet drop:

- `ant_envelope`
- `ant_passage_state`
- `ant_attachment_map`

Those require non-ANT passage/canopy law to be seated first unless executor proves they are fully unreferenced and safe.

## ALIGNED

### Authority order

Codex holds.  
Field structures.  
Measures registers.  
Chazz validates/routes.  
Cody executes from OAR2 only.  
`src` renders seated state only.

### Standing correction

ANT is banished residue.

ANT must not be used as proof for:

- c3 Field passage law
- canopy law
- envelope/signal support
- runtime admission
- registered-system standing
- Measures of Inanna spine standing
- optics/evidence/trace/correction law

### Branch rule

All work must occur on:

`initiative/c3-field-convergence-infra`

Do not use Measures Registry deployment branch.

### Scope boundary

This is a schema residue banishment OAR.

It may mutate DB schema only to remove, rewrite, or legacy-hold ANT dependencies identified in the executed audit.

It may not create replacement passage/canopy law.

It may not seat runtime admission.

It may not seat Measures of Inanna registered spine standing.

It may not mutate Measures Registry runtime behavior.

## OBJECTIVE

Perform the first safe banishment of ANT runtime/schema residue.

This OAR must:

1. Verify c3 Field branch.
2. Reconfirm ANT object inventory before mutation.
3. Drop the FK from `measures_registry.envelope_id` to `ant_envelope`.
4. Rewrite or drop ANT-dependent views.
5. Drop broken/orphaned ANT functions.
6. Drop deprecated ANT tables with no live references:
   - `ant_inbox`
   - `ant_signal_record`
7. Preserve registered-system schema.
8. Preserve Measures Registry runtime behavior.
9. Leave remaining still-required ANT blocker tables legacy-held until non-ANT passage/canopy law is seated.
10. Write OAR1 with evidence.

## ROUTED

### 1. Verify repository and branch

Before mutation, verify:

- repository path
- current git branch
- git status

Required branch:

`initiative/c3-field-convergence-infra`

Return:

- `git rev-parse --show-toplevel`
- `git branch --show-current`
- `git status --short`

If branch is not `initiative/c3-field-convergence-infra`, stop and report:

`BRANCH_MISMATCH — expected c3 Field deployment branch initiative/c3-field-convergence-infra`

No mutation may proceed from the wrong branch.

### 2. Reconfirm ANT inventory before mutation

Before applying changes, recheck these objects:

Tables:

- `ant_envelope`
- `ant_passage_state`
- `ant_attachment_map`
- `ant_inbox`
- `ant_signal_record`

Functions:

- `ensure_ant_passage_state()`
- `refresh_ant_passage_state(text)`
- `prevent_ant_oar_log_mutation()`

Views:

- `v_envelope_access_by_c3key_v1`
- `v_field_relation_graph_v1`
- `v_measures_registry_state_v1`

Constraint:

- `measures_registry_envelope_id_fkey`

Return:

| object | exists_before | dependency_count | action |
|---|---:|---:|---|

If row counts for any ANT table are not 0, stop and report:

`ANT_DATA_PRESENT_BLOCKER`

### 3. Drop `measures_registry_envelope_id_fkey`

Drop the FK constraint:

`measures_registry_envelope_id_fkey`

Do not drop the `measures_registry.envelope_id` column in this OAR unless executor proves it is unused and safe.

Preferred standing:

- FK dropped
- column retained as legacy nullable field or marked deprecated if schema supports comment/metadata
- no runtime behavior changed

Return validation:

    select conname
    from pg_constraint
    where conname = 'measures_registry_envelope_id_fkey';

Expected: 0 rows.

### 4. Rewrite `v_measures_registry_state_v1`

Remove the LEFT JOIN to `ant_envelope`.

If the view currently exposes envelope-derived fields, preserve the view shape only with safe null/deprecated values.

Rules:

- no ANT JOIN
- no `ant_envelope` reference
- no public behavior change required
- do not remove unrelated MR state fields
- if view shape cannot be preserved safely, stop and report blocker

Return validation:

    select definition
    from pg_views
    where schemaname = 'public'
      and viewname = 'v_measures_registry_state_v1';

Expected: definition does not contain `ant_`.

### 5. Rewrite `v_field_relation_graph_v1`

Remove `ant_envelope` subselect/node-label dependency.

Rules:

- preserve non-ANT relation graph behavior
- remove ANT node contribution
- do not introduce replacement carrier logic in this OAR
- if graph depends entirely on ANT, stop and report blocker

Return validation:

    select definition
    from pg_views
    where schemaname = 'public'
      and viewname = 'v_field_relation_graph_v1';

Expected: definition does not contain `ant_`.

### 6. Drop or legacy-hold `v_envelope_access_by_c3key_v1`

This view is ANT-derived and references:

- `ant_envelope`
- `ant_attachment_map`
- `ant_passage_state`

Preferred action:

- drop the view if no non-ANT replacement exists
- do not create a fake replacement
- if consumers require the view, create a legacy-held replacement view only if it contains no ANT references and returns no active access standing

Acceptable legacy-held replacement semantics:

- no granted access
- no runtime admission
- no c3 Key permission expansion
- no ANT reference
- explicit held/deprecated state where columns support it

Return validation:

    select definition
    from pg_views
    where schemaname = 'public'
      and viewname = 'v_envelope_access_by_c3key_v1';

Expected:

- view absent, or
- definition contains no `ant_` and returns held/deprecated/no-access standing only.

### 7. Drop broken/orphaned ANT functions

Drop:

- `refresh_ant_passage_state(text)` — broken; references removed `ant_oar_log`
- `prevent_ant_oar_log_mutation()` — orphaned

Do not drop `ensure_ant_passage_state()` yet unless its trigger dependency is removed and executor proves no remaining dependency.

Return validation:

    select proname
    from pg_proc
    where proname in (
      'refresh_ant_passage_state',
      'prevent_ant_oar_log_mutation'
    );

Expected: 0 rows for those two function names.

### 8. Drop deprecated ANT tables with no live references

Drop only if still 0 rows and no dependencies remain:

- `ant_inbox`
- `ant_signal_record`

If dependencies exist, stop and report dependency blocker.

Return validation:

    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('ant_inbox', 'ant_signal_record');

Expected: 0 rows for those two table names.

### 9. Legacy-hold remaining ANT blocker tables

Do not yet drop unless fully unreferenced and safe:

- `ant_envelope`
- `ant_passage_state`
- `ant_attachment_map`

Expected standing after this OAR:

- no FK from Measures Registry to ANT
- no live view references to ANT
- no broken/orphaned functions
- `ant_inbox` dropped
- `ant_signal_record` dropped
- remaining tables either unreferenced legacy residue or explicitly reported as blockers for next non-ANT passage/canopy law OAR

Return table:

| remaining_ant_object | row_count | dependency_count | standing | next_action |
|---|---:|---:|---|---|

### 10. Preserve registered-system schema

Validate:

    select system_key, system_name, standing, implementation_pattern, system_scope, metadata->>'runtime_admission_state' as runtime_admission_state
    from c3_registered_system
    order by created_at;

Expected:

- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`

No changes to:

- `c3_registered_system`
- `v_c3_registered_system_v1`
- c3 Field anchor row in `field_origin`
- Measures Registry registered-system row

### 11. Preserve boundaries

Do not create:

- non-ANT passage law table
- non-ANT canopy law table
- runtime admission table
- runtime admission view
- optics contract table
- evidence contract table
- trace contract table
- correction/revocation contract table
- AI action boundary table
- role contract table
- external system contract table
- secure passage contract table

Do not seat:

- Measures of Inanna registered spine standing
- c3 Key standing
- SEAT release standing
- payment standing
- certification standing

### 12. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_banish_ant_runtime_schema_residue_v1.meta.md`

OAR1 must include:

- branch verification
- before inventory
- SQL applied
- FK drop evidence
- view rewrite/drop evidence
- function drop evidence
- table drop evidence
- remaining ANT legacy-held table inventory
- registered-system validation
- confirmation that no runtime mutation occurred
- confirmation that no Measures Registry runtime mutation occurred
- confirmation that no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred
- corrected next OAR sequence

## EXECUTOR MAY

- inspect schema dependencies
- drop `measures_registry_envelope_id_fkey`
- rewrite `v_measures_registry_state_v1` to remove ANT JOIN
- rewrite `v_field_relation_graph_v1` to remove ANT reference
- drop or legacy-hold `v_envelope_access_by_c3key_v1`
- drop `refresh_ant_passage_state(text)`
- drop `prevent_ant_oar_log_mutation()`
- drop `ant_inbox`
- drop `ant_signal_record`
- mark remaining ANT blockers in OAR1
- validate registered-system schema
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- mutate Measures Registry runtime behavior
- create non-ANT replacement schemas
- create runtime admission
- create optics/evidence/trace/correction contracts
- create AI action boundary table
- seat Measures of Inanna registered spine
- drop `ant_envelope` unless fully unreferenced and explicitly proven safe
- drop `ant_passage_state` unless fully unreferenced and explicitly proven safe
- drop `ant_attachment_map` unless fully unreferenced and explicitly proven safe
- change pricing
- change Stripe
- activate SEAT
- activate c3 Key
- activate wallet
- connect external systems
- treat ANT as valid current support
- skip OAR1

## VALIDATION

This OAR resolves successfully when:

1. c3 Field branch verified.
2. ANT inventory reconfirmed before mutation.
3. ANT table row counts confirmed 0 before table drops.
4. `measures_registry_envelope_id_fkey` dropped.
5. `v_measures_registry_state_v1` no longer references ANT.
6. `v_field_relation_graph_v1` no longer references ANT.
7. `v_envelope_access_by_c3key_v1` dropped or legacy-held without ANT reference.
8. `refresh_ant_passage_state(text)` dropped.
9. `prevent_ant_oar_log_mutation()` dropped.
10. `ant_inbox` dropped if safe.
11. `ant_signal_record` dropped if safe.
12. Remaining ANT objects inventoried and classified.
13. Registered-system schema validated intact.
14. Measures Registry registered-system row preserved.
15. No runtime mutation performed.
16. No Measures Registry runtime mutation performed.
17. No replacement schema created.
18. No runtime admission seated.
19. No Inanna registered spine standing seated.
20. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
21. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_banish_ant_runtime_schema_residue_v1.meta.md`

## CLOSE

Banish broken and orphaned ANT residue first.

Do not build runtime admission on ANT.

Do not seat Inanna spine standing until ANT is no longer acting as false passage/canopy support.

The next schema layer after this is non-ANT c3 Field passage and canopy law.

