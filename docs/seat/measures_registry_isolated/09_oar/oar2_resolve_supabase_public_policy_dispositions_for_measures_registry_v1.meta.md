---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
status: proposed
version: v1
operator: op044
priority: critical_security_policy_resolution
source_evidence:
  - docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_database_policy_scope_isolation_readback_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
mutation_scope:
  runtime: false
  database: true
  policies: true
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1

## OBSERVED

Measures Registry policy scope has been isolated in the database.

The seated isolation table is:

public.measures_registry_policy_scope_isolation

The isolation scope contains:

current_measures_registry_runtime: 7
current_measures_registry_public_write: 2
held_future_scope: 1
protected_c3_system: 19
protected_measures_of_inanna: 3
total_active_rows: 32

A constrained read-only catalog RPC has been seated:

public.measures_registry_policy_catalog_review

The RPC returned exact rows:

policy_rows_count: 37
table_rows_count: 32
column_rows_count: 522

The RPC is bounded to the DB-seated isolation scope, uses no dynamic SQL, grants no anon/public execute permission, and is safe for policy disposition OAR.

Current need:

Resolve Supabase public policy dispositions for current Measures Registry launch scope only.

## ALIGNED

This OAR2 may mutate policies only for tables classified as:

- current_measures_registry_runtime
- current_measures_registry_public_write
- held_future_scope if the action only blocks or revokes public access

This OAR2 may not mutate protected c3 system policies.

This OAR2 may not mutate Measures of Inanna / exhibition policies.

This OAR2 may not mutate runtime, routes, renderer, public copy, or application rows.

This OAR2 may not activate launch, payment, SEAT, SEAL, Registry Standing, Branch standing, c3 Key, DAO participation, or certification.

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

The exact row-return blocker is closed. The read-only catalog RPC returned exact policy, table, and column rows and marked safe_for_policy_disposition_oar: true. :contentReference[oaicite:0]{index=0}

## ROUTED

## 1. Preflight exact catalog evidence

Run:

    select public.measures_registry_policy_catalog_review();

Confirm:

    policy_rows_count > 0
    table_rows_count = 32
    column_rows_count > 0

Confirm the function returns exact rows.

If exact rows do not return, stop and write blocker OAR1.

## 2. Limit mutation scope

Use only rows from public.measures_registry_policy_scope_isolation where active = true.

Allowed mutable scopes in this OAR2:

    current_measures_registry_runtime
    current_measures_registry_public_write
    held_future_scope only when revoking or blocking public access

Explicitly excluded scopes:

    protected_c3_system
    protected_measures_of_inanna

Do not mutate excluded scopes.

## 3. Resolve current Measures Registry runtime public read policies

Runtime tables:

    public.measures_registry
    public.measures_encounter_def
    public.measures_media_map
    public.measures_design_token
    public.measures_publication_registry
    public.measures_publication_dispatch
    public.map_commerce_contracts

For each runtime table:

1. Inspect exact policy row from catalog RPC.
2. Inspect available columns from catalog RPC.
3. If the table has an existing broad public read policy, replace it with a narrow read policy.
4. If no public read policy exists and renderer requires anon read, create a narrow read policy only if safe predicate columns exist.
5. Do not invent columns.

Preferred safe predicate order:

    release_state = 'released' and active = true
    release_state in ('released','active') and active = true
    status in ('released','active') and active = true
    is_public = true and active = true
    public_visible = true and active = true
    published = true and active = true

If available columns do not support a narrow predicate, do not create or broaden public read access. Report blocker for that table.

Known exact sample from catalog RPC:

    public.map_commerce_contracts
    policy: map_commerce_contracts_public_read
    cmd: SELECT
    roles: anon, authenticated
    qual: release_state = 'active'

This should be reviewed for whether active is sufficient or whether the policy must also require current launch / non-held / no payment activation conditions.

## 4. Resolve current public write policies

Current public write candidate tables:

    public.measures_iis_eval_gate1_capture
    public.measures_publication_subscription_capture

Catalog RPC sample confirmed exact INSERT policies exist:

    measures_iis_eval_gate1_capture_public_insert
    measures_publication_subscription_public_insert

Both are public-write candidates and both were marked edge_function_preferred in DB isolation.

Policy action:

Do not keep direct anon insert if the policy is broad or only lightly constrained.

Preferred disposition:

    replace_with_edge_function

Because Edge Function replacement may require runtime work, this OAR2 may either:

A. revoke direct anon insert now if no current launch depends on it; or
B. narrow direct insert temporarily with strict with_check if launch capture currently depends on it and columns support strict validation.

Operator default for this OAR2:

    do not break current assessment/contact capture unless runtime dependency is confirmed safe to change.

Therefore:

- if runtime currently depends on direct public insert, narrow with_check only;
- if runtime does not depend on direct public insert, revoke anon insert and mark edge function required;
- never allow anon update;
- never allow anon delete.

## 5. Hold future scope

Held future table:

    public.measures_seat_hold_capture

Action:

- confirm public write is not required for current launch
- revoke or block anon/public write if policy exists
- do not activate seat hold
- do not activate payment
- do not create SEAT / SEAL / Registry Standing

## 6. Protected scope boundary

Do not mutate policies for these scopes:

protected_c3_system:
    c3_ai_action_boundary
    c3_attachment_law
    c3_canopy_law
    c3_chamber_directory_binding
    c3_correction_contract
    c3_evidence_contract
    c3_oar_process_instance
    c3_oar_seeded_reference
    c3_oar_transition_event
    c3_optics_contract
    c3_orphaned_surface_registry
    c3_passage_law
    c3_public_semantic_pairing
    c3_registered_system
    c3_role_contract
    c3_runtime_admission_binding
    c3_runtime_admission_contract
    c3_signal_law
    c3_trace_contract

protected_measures_of_inanna:
    measures_encounter_view_history
    temp_exhibition_media
    codex_connect_capture

Report any policies on these as protected review pending, but do not change them.

## 7. Required before/after evidence

Before mutation, save:

docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_before_readback_v1.meta.md

Include:

- exact catalog RPC payload summary
- current runtime policies
- current write policies
- excluded protected policies
- planned actions

After mutation, save:

docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_after_readback_v1.meta.md

Include:

- exact policy readback after mutation
- final policies for current Measures Registry runtime tables
- final policies for current public write candidate tables
- final policies for held future table if affected
- confirmation protected scopes not mutated
- anon/public access standing

## 8. Required anon probes after policy changes

For current runtime tables:

- anon select should return only rows allowed by narrow policy.
- if no narrow policy can be safely defined, anon select should be blocked.

For public write tables:

- anon insert must be either blocked, edge/function-only, or strictly constrained.
- anon update must be blocked.
- anon delete must be blocked.

Do not perform destructive update/delete probes against live data.

Use policy readback for update/delete standing.

## 9. No application row mutation

Do not insert test rows into live capture tables unless a safe disposable test path is already registered.

If no safe test path exists, do not perform write probes. Use policy readback and report no direct write probe.

## 10. Validation return

Return:

    OAR2 path
    before readback path
    after readback path
    policies changed
    policies dropped
    policies created
    policies narrowed
    protected policies untouched confirmation
    runtime table anon select standing
    public write table anon insert standing
    anon update standing
    anon delete standing
    no application row mutation confirmation
    no runtime mutation confirmation
    no route mutation confirmation
    no renderer mutation confirmation
    no public copy mutation confirmation
    remaining blockers
    OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md

OAR1 must report:

    OAR2 path
    before readback path
    after readback path
    exact catalog RPC result
    database isolation scope used
    current Measures Registry runtime policies before
    current Measures Registry runtime policies after
    current public write policies before
    current public write policies after
    held future policies before / after if affected
    protected c3 system policies untouched
    protected Measures of Inanna policies untouched
    policies changed
    policies dropped
    policies created
    policies narrowed
    anon select standing
    anon insert standing
    anon update standing
    anon delete standing
    no application row mutation confirmation
    no runtime mutation confirmation
    no route mutation confirmation
    no renderer mutation confirmation
    no public copy mutation confirmation
    remaining blockers
    recommended next OAR2 title

Recommended next OAR2:

OAR2 - Isolate Measures Registry Documentation Source Set and Seeded Reference Scope v1

## CLOSE

This OAR2 resolves public policy dispositions for current Measures Registry scope only.

It does not mutate protected c3 policy scope.

It does not mutate Measures of Inanna policy scope.

It does not mutate runtime or launch content.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody secures and writes evidence.
