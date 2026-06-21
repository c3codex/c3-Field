---
document_type: oar1
authority_level: execution_evidence
system_scope: measures_codex
title: OAR1 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1
status: completed_with_catalog_row_return_blocker
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR1 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1

## OAR2 Path

```yaml
oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
```

## Report Path

```yaml
report_path: docs/seat/measures_registry_isolated/10_validation/supabase_public_policy_renderer_read_review_v1.meta.md
```

## Inspected Policy Count

```yaml
inspected_policy_count:
  public_policy_count: 54
  count_source: docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
  current_exact_catalog_row_return:
    exec_sql_rpc: reachable_but_returned_ok_without_rows_for_select_payload
    postgrest_pg_policies: blocked_not_in_schema_cache_PGRST205
    postgrest_pg_tables: blocked_not_in_schema_cache_PGRST205
  current_policy_mutation: false
```

## Inspected Tables

```yaml
inspected_tables:
  from_prior_oar1_policy_baseline:
    - public.c3_ai_action_boundary
    - public.c3_attachment_law
    - public.c3_canopy_law
    - public.c3_chamber_directory_binding
    - public.c3_correction_contract
    - public.c3_evidence_contract
    - public.c3_oar_process_instance
    - public.c3_oar_seeded_reference
    - public.c3_oar_transition_event
    - public.c3_optics_contract
    - public.c3_orphaned_surface_registry
    - public.c3_passage_law
    - public.c3_public_semantic_pairing
    - public.c3_registered_system
    - public.c3_role_contract
    - public.c3_runtime_admission_binding
    - public.c3_runtime_admission_contract
    - public.c3_signal_law
    - public.c3_trace_contract
    - public.measures_encounter_view_history
    - public.temp_exhibition_media
    - public.codex_connect_capture
    - public.measures_iis_eval_gate1_capture
    - public.measures_publication_subscription_capture
    - public.measures_seat_hold_capture
  current_renderer_required_tables:
    - public.measures_registry
    - public.measures_encounter_def
    - public.measures_media_map
    - public.measures_design_token
    - public.measures_publication_registry
    - public.measures_publication_dispatch
    - public.map_commerce_contracts
    - public.measures_iis_eval_gate1_capture
    - public.measures_publication_subscription_capture
```

## Broad Public Read Policy Count

```yaml
broad_public_read_policy_count: 21
broad_public_read_policy_count_source: prior_oar1_live_readback
```

## Public Or Anon Write Policy Count

```yaml
public_or_anon_write_policy_count:
  named_review_scope_count: 6
  prior_oar1_total_public_or_anon_insert_update_delete_or_all_count: 12
```

## Renderer Required Public Reads

```yaml
renderer_required_public_reads:
  current_measures_registry_runtime_required:
    - public.measures_registry
    - public.measures_encounter_def
    - public.measures_media_map
    - public.measures_design_token
    - public.measures_publication_registry
    - public.measures_publication_dispatch
    - public.map_commerce_contracts
  current_oar_review_broad_policy_list_required_as_broad_true: []
  protected_other_system_or_legacy_reads:
    - public.temp_exhibition_media
    - public.measures_encounter_view_history
    - public.codex_connect_capture
```

## Policies Recommended To Keep

```yaml
policies_recommended_to_keep: []
reason: no reviewed broad true policy was confirmed as safe to keep broad under current Measures Registry renderer evidence
```

## Policies Recommended To Narrow

```yaml
policies_recommended_to_narrow:
  - c3_oar_process_instance_public_read
  - c3_oar_seeded_reference_public_read
  - c3_oar_transition_event_public_read
  - measures_iis_eval_gate1_capture_public_insert
  - measures_publication_subscription_public_insert
```

## Policies Recommended To Hold Or Revoke

```yaml
policies_recommended_to_hold_or_revoke:
  - c3_orphaned_surface_registry_public_read
  - measures encounter history select
  - public read temp_exhibition_media
  - measures encounter history insert
  - measures encounter history update
  - public inserts measures registry seat holds
```

## Policies Recommended For Edge Function Replacement

```yaml
policies_recommended_for_edge_function_replacement:
  - public_insert_codex_connect_capture
  - measures_iis_eval_gate1_capture_public_insert
  - measures_publication_subscription_public_insert
  - measures encounter history insert
  - measures encounter history update
```

## Required Operator Decisions

```yaml
required_operator_decisions:
  - authorize exact live catalog row-return before any policy mutation OAR
  - decide whether c3 OAR/process public-read policies remain intentionally public
  - decide whether c3 law/contract public reads stay public or require seeded-reference protection
  - decide whether Measures of Inanna policies move to protected-system review outside Measures Registry launch scope
  - decide whether assessment capture and publication subscription use direct public inserts or edge/function boundaries
  - decide whether seat hold capture remains held/revoked until launch/payment authority is seated
```

## No DB Mutation Confirmation

```yaml
no_db_mutation_confirmation:
  database_mutation: false
  policies_dropped: false
  policies_created: false
  policies_altered: false
  rls_changed: false
  rows_inserted: false
  rows_updated: false
  rows_deleted: false
```

## No Runtime Mutation Confirmation

```yaml
no_runtime_mutation_confirmation:
  runtime_mutation: false
```

## No Route Mutation Confirmation

```yaml
no_route_mutation_confirmation:
  route_mutation: false
```

## No Renderer Mutation Confirmation

```yaml
no_renderer_mutation_confirmation:
  renderer_mutation: false
```

## No Public Copy Mutation Confirmation

```yaml
no_public_copy_mutation_confirmation:
  public_copy_mutation: false
```

## Recommended Next OAR2 Title

```yaml
recommended_next_oar2_title: OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
```

## Close

The saved OAR2 was executed as a read-only security and renderer-read review.

No database, runtime, route, renderer, or public copy mutation was performed.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody reviews and writes evidence.
