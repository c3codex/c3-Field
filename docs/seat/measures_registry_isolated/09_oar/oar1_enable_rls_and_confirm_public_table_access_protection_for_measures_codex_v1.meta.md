---
document_type: oar1
authority_level: execution_evidence
system_scope: measures_codex
title: OAR1 - Enable RLS and Confirm Public Table Access Protection for Measures Codex v1
status: completed
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
mutation_scope:
  runtime: false
  database: true
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR1 - Enable RLS and Confirm Public Table Access Protection for Measures Codex v1

## OAR2 Path

```yaml
oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
```

## Tables Inspected

```yaml
inspection_scope:
  schema: public
  inspected_for_rls_disabled: all public tables
  inspected_for_policies: all public policies
  target_tables_confirmed_from_rls_disabled_readback:
    - public.system_oar_execution_evidence
    - public.system_oar_queue
    - public.system_process_registry
```

## Tables Found With RLS Disabled Before

```yaml
tables_with_rls_disabled_before:
  - table: public.system_oar_execution_evidence
    rowsecurity_before: false
  - table: public.system_oar_queue
    rowsecurity_before: false
  - table: public.system_process_registry
    rowsecurity_before: false
```

## Tables Altered

```yaml
tables_altered:
  - table: public.system_oar_execution_evidence
    action: enable_row_level_security
    result: ok
  - table: public.system_oar_queue
    action: enable_row_level_security
    result: ok
  - table: public.system_process_registry
    action: enable_row_level_security
    result: ok
```

## Policies Inspected

```yaml
policies_inspected:
  schema: public
  total_policy_count_after: 54
  target_table_policy_count_after: 0
  target_table_policies_after: []
```

## Policies Created

```yaml
policies_created: []
reason: no target table was identified as public-renderer-readable by this OAR2, and no release_state plus active column read policy was required
```

## Policies Not Created Due To Schema Gaps

```yaml
policies_not_created_due_to_schema_gaps: []
reason: no target-table read policy was attempted
```

## Unsafe Or Broad Existing Policies Found

```yaml
unsafe_or_broad_existing_policies_found:
  target_tables: []
  outside_target_tables_requires_future_review: true
  summary:
    anon_or_public_select_true_count: 21
    anon_or_public_insert_update_delete_or_all_count: 12
  broad_select_true_policies:
    - c3_ai_action_boundary_public_read
    - c3_attachment_law_public_read
    - c3_canopy_law_public_read
    - c3_chamber_directory_binding_public_read
    - c3_correction_contract_public_read
    - c3_evidence_contract_public_read
    - c3_oar_process_instance_public_read
    - c3_oar_seeded_reference_public_read
    - c3_oar_transition_event_public_read
    - c3_optics_contract_public_read
    - c3_orphaned_surface_registry_public_read
    - c3_passage_law_public_read
    - c3_public_semantic_pairing_public_read
    - c3_registered_system_public_read
    - c3_role_contract_public_read
    - c3_runtime_admission_binding_public_read
    - c3_runtime_admission_contract_public_read
    - c3_signal_law_public_read
    - c3_trace_contract_public_read
    - measures encounter history select
    - public read temp_exhibition_media
  public_or_anon_write_policies_requiring_future_review:
    - public_insert_codex_connect_capture
    - measures encounter history insert
    - measures encounter history update
    - measures_iis_eval_gate1_capture_public_insert
    - measures_publication_subscription_public_insert
    - public inserts measures registry seat holds
  action_taken: none
  reason: OAR2 did not authorize dropping policies without explicit operator confirmation, and target tables have no policies
```

## Final RLS Readback

```yaml
final_rls_readback:
  remaining_rls_disabled_public_tables: []
  target_rls_status:
    - table: public.system_oar_execution_evidence
      rowsecurity_after: true
    - table: public.system_oar_queue
      rowsecurity_after: true
    - table: public.system_process_registry
      rowsecurity_after: true
```

## Final Policy Readback

```yaml
final_policy_readback:
  public_policy_count: 54
  target_table_policies: []
  no_target_public_read_policy_created: true
  no_target_public_insert_policy_created: true
  no_target_public_update_policy_created: true
  no_target_public_delete_policy_created: true
```

## Target Row Count Readback

```yaml
target_row_count_readback:
  public.system_oar_execution_evidence: 3
  public.system_oar_queue: 2
  public.system_process_registry: 8
```

## Anon/Public Access Verification Method

```yaml
anon_public_access_verification_method:
  db_readback:
    performed: true
    evidence:
      - RLS enabled on all target tables
      - zero target policies after mutation
      - target rows exist by service-side count
  direct_anon_api_select_probe:
    performed: true
    client: VITE_SUPABASE_ANON_KEY
    result:
      - table: public.system_oar_execution_evidence
        status: 200
        visible_rows: 0
      - table: public.system_oar_queue
        status: 200
        visible_rows: 0
      - table: public.system_process_registry
        status: 200
        visible_rows: 0
  direct_anon_api_write_probe:
    performed: false
    reason: avoided creating mutation attempts against live Codex tables; DB readback with RLS enabled and zero target write policies establishes blocked write standing
```

## Anon/Public Access Standing

```yaml
anon_public_access_standing:
  target_tables:
    anon_select: blocked_by_RLS_zero_visible_rows
    anon_insert: blocked_by_RLS_no_insert_policy
    anon_update: blocked_by_RLS_no_update_policy
    anon_delete: blocked_by_RLS_no_delete_policy
    authenticated_write: blocked_by_RLS_no_write_policy
  direct_anon_api_test_performed: true
  direct_anon_api_test_scope:
    - select_probe_only
```

## Database Mutation Confirmation

```yaml
database_mutation_confirmation:
  database_mutated: true
  mutation_type: enable_row_level_security
  tables_changed:
    - public.system_oar_execution_evidence
    - public.system_oar_queue
    - public.system_process_registry
  policies_created: []
  policies_dropped: []
  rows_inserted: false
  rows_updated: false
  rows_deleted: false
```

## No Runtime Mutation Confirmation

```yaml
no_runtime_mutation_confirmation:
  runtime_mutation: false
  src_diff_after_execution: empty
```

## No Route Mutation Confirmation

```yaml
no_route_mutation_confirmation:
  route_mutation: false
  invented_routing_added: false
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

## Remaining Blockers

```yaml
remaining_blockers:
  - existing broad public read policies and public/anon write policies outside the three target tables require separate policy review
  - direct anon API write probe was not performed to avoid live write attempts; blocked standing is based on RLS and zero target write policies
```

## Next Recommended OAR2 Title

```yaml
next_recommended_oar2_title: OAR2 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1
```

## Close

RLS is enabled on the three public tables that were exposed without Row Level Security.

No target read policies were created.

No target write policies exist.

No policies were dropped.

No runtime, route, renderer, or public copy was mutated.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody secures and writes evidence.
