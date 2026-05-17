# OAR2 — Concordance Authority RPC-Compatible Migration Packaging

## OBSERVED

Execution authorization reached live migration attempt.

Preflight passed.

Migration execution blocked because the Supabase exec_sql RPC path rejected transaction control commands inside the reviewed SQL package:

    EXECUTE of transaction commands is not implemented

No Seed Concordance seating occurred.

No post-validation occurred.

Stop-on-failure held.

## ALIGNED

This OAR2 adapts packaging only.

No authority semantics change.
No schema design change.
No DB mutation yet.
No seating execution yet.
No runtime/frontend work.

The correction is execution-surface compatibility:

    same reviewed migration logic
    RPC-compatible packaging
    external stop-on-failure control

## ROUTED

Cody shall prepare RPC-compatible execution artifacts by:

1. Removing transaction wrappers from RPC-executed SQL artifacts only:
   - BEGIN
   - COMMIT
   - ROLLBACK

2. Splitting migration execution into controlled RPC-safe blocks if needed.

3. Preserving existing:
   - tables
   - constraints
   - indexes
   - RLS
   - append protections
   - timestamp protections
   - visibility standing
   - relation scope
   - source_ref / target_ref posture

4. Updating execution helper so stop-on-failure is enforced outside SQL transaction wrappers.

5. Keeping rollback/recovery package separate and non-destructive.

6. Writing OAR1 closeout.

## CODY ROLE

Cody may:
- revise execution package SQL for RPC compatibility
- revise execution helper
- preserve validation and stop boundaries
- write OAR1

Cody may not:
- execute migration
- mutate DB
- seat rows
- change authority model
- change schema intent
- alter runtime/frontend

## VALIDATION

Success requires:
- RPC-compatible migration package prepared
- transaction-control commands removed from RPC path
- stop-on-failure preserved externally
- no authority semantics changed
- no DB mutation performed
- OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_rpc_compatible_migration_packaging_v1.meta.md

## CLOSE

Do not change authority.

Adapt the execution surface.
