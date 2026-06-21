---
document_type: oar1
authority_level: execution_closeout
system_scope: measures_codex
title: OAR1 - Authorize Read-Only Catalog RPC Seating for Supabase Policy Review v1
status: completed_exact_rows_returned
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
validation_file: docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
exact_catalog_evidence: docs/seat/measures_registry_isolated/10_validation/supabase_exact_live_policy_catalog_rows_v1.meta.md
mutation_scope:
  runtime: false
  database: true
  schema_function: true
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR1 - Authorize Read-Only Catalog RPC Seating for Supabase Policy Review v1

## Closeout

```yaml
oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
validation_evidence_path: docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
exact_catalog_evidence_path: docs/seat/measures_registry_isolated/10_validation/supabase_exact_live_policy_catalog_rows_v1.meta.md
source_blocked_oar1_path: docs/seat/measures_registry_isolated/09_oar/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
function_name: public.measures_registry_policy_catalog_review
function_created_or_replaced: true
security_definer_used: true
anon_execute_granted: false
public_execute_granted: false
authenticated_execute_granted: false
service_role_execute_granted: true
policy_rows_returned: true
table_rows_returned: true
column_rows_returned: true
row_counts:
  policy_rows: 37
  table_rows: 32
  column_rows: 522
safe_for_policy_disposition_oar: true
```

## Database Isolation Table Readback Result

```yaml
database_isolation_table_readback_result:
  table: public.measures_registry_policy_scope_isolation
  passed: true
  active_row_count: 32
  summary_counts:
    current_measures_registry_public_write: 2
    current_measures_registry_runtime: 7
    held_future_scope: 1
    protected_c3_system: 19
    protected_measures_of_inanna: 3
```

## Function Boundary

```yaml
function_boundary:
  function_name: public.measures_registry_policy_catalog_review
  arguments: none
  returns: jsonb
  language: sql
  stable: true
  security_definer: true
  dynamic_sql_used: false
  arbitrary_sql_input_allowed: false
  read_only_scope_source: public.measures_registry_policy_scope_isolation
  isolated_scope_only: true
```

## Mutation Scope Confirmation

```yaml
mutation_scope_confirmation:
  authorized_schema_function_seating_performed: true
  unauthorized_database_mutation_performed: false
  no_policy_mutation: true
  no_application_row_mutation: true
  no_row_mutation: true
  no_RLS_mutation: true
  no_runtime_mutation: true
  no_route_mutation: true
  no_renderer_mutation: true
  no_public_copy_mutation: true
  no_launch_activation: true
  no_payment_activation: true
  no_SEAT_completion_claim: true
  no_Seal_standing_claim: true
  no_Registry_standing_claim: true
  no_Branch_standing_claim: true
  no_c3_Key_assignment: true
  no_DAO_participation_activation: true
  no_certification_activation: true
```

## Policy Review Boundary

```yaml
policy_review_boundary:
  policy_disposition_attempted: false
  policy_classification_attempted: false
  policies_narrowed: false
  policies_revoked: false
  policies_added: false
  policies_altered: false
  rls_enabled_or_disabled: false
```

## Recommended Next OAR2

```yaml
recommended_next_oar2:
  title: OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
  reason:
    - exact isolated policy rows returned
    - exact isolated table rows returned
    - exact isolated column rows returned
    - safe_for_policy_disposition_oar is true
```

## Close

This OAR1 records successful seating of the constrained read-only catalog RPC required by the saved OAR2.

The RPC returns exact row payloads only for the active Measures Registry isolation scope.

No application policy, application row, RLS, runtime, route, renderer, public copy, launch, payment, SEAT, SEAL, Registry Standing, Branch standing, c3 Key, DAO participation, or certification mutation occurred.
