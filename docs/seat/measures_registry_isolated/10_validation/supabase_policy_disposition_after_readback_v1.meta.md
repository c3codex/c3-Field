---
document_type: validation_report
authority_level: after_policy_disposition_evidence
system_scope: measures_codex
title: Supabase Policy Disposition After Readback v1
status: completed_policy_disposition_scope_only
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
before_readback: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_before_readback_v1.meta.md
catalog_rpc: public.measures_registry_policy_catalog_review
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

# Supabase Policy Disposition After Readback v1

## Exact Policy Readback After Mutation

```yaml
exact_policy_readback_after_mutation:
  function: public.measures_registry_policy_catalog_review
  exact_rows_returned: true
  policy_rows_count: 35
  table_rows_count: 32
  column_rows_count: 522
  protected_c3_system_policy_rows: 19
  protected_measures_of_inanna_policy_rows: 5
```

## Final Runtime Policies

```yaml
final_runtime_policies:
  public.measures_registry:
    - policyname: measures_registry_public_released_active_read
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "((is_active = true) AND (release_state = ANY (ARRAY['released'::text, 'active'::text])))"
      disposition: narrowed
    - policyname: service_role_only_registry
      cmd: ALL
      roles: [public]
      qual: "(auth.role() = 'service_role'::text)"
      disposition: kept
  public.measures_encounter_def:
    - policyname: public read active measures_encounter_def
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "(is_active = true)"
      disposition: kept_with_blocker_no_safer_release_columns
    - policyname: service_role_only_encounter
      cmd: ALL
      roles: [public]
      qual: "(auth.role() = 'service_role'::text)"
      disposition: kept
  public.measures_media_map:
    - policyname: public reads active registry landing media
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "((is_active = true) AND (campaign_key = 'agents_of_chaos_integrity_governance'::text) AND (media_role = ANY (ARRAY['hero_video'::text, 'hero_poster'::text, 'path_choice_background'::text, 'registry_mark'::text])))"
      disposition: kept_narrow
  public.measures_design_token:
    - policyname: public reads active measures registry design tokens
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "((is_active = true) AND (registry_key = 'measures_registry'::text))"
      disposition: kept_narrow
  public.measures_publication_registry:
    - policyname: measures_publication_registry_public_read
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "(status = 'published'::text)"
      disposition: kept_with_evidence
  public.measures_publication_dispatch:
    - policyname: measures_publication_dispatch_public_read
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "(status = 'published'::text)"
      disposition: kept_with_evidence
  public.map_commerce_contracts:
    - policyname: map_commerce_contracts_public_read
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "(release_state = 'active'::text)"
      disposition: kept_with_operator_review
```

## Final Public Write Candidate Policies

```yaml
final_public_write_candidate_policies:
  public.measures_iis_eval_gate1_capture:
    insert_standing: strictly_constrained_direct_insert_kept
    update_standing: no_public_update_policy
    delete_standing: no_public_delete_policy
    policies:
      - policyname: measures_iis_eval_gate1_capture_public_insert
        cmd: INSERT
        roles: [anon, authenticated]
        disposition: kept_with_guardrails_current_runtime_dependency_not_broken
  public.measures_publication_subscription_capture:
    insert_standing: narrowed_direct_insert
    update_standing: no_public_update_policy
    delete_standing: no_public_delete_policy
    policies:
      - policyname: measures_publication_subscription_capture_public_insert_guarded
        cmd: INSERT
        roles: [anon, authenticated]
        with_check: "((capture_source = 'structural_drift_dispatch'::text) AND (NULLIF(btrim(email), ''::text) IS NOT NULL) AND (NULLIF(btrim(publication_key), ''::text) IS NOT NULL) AND (NULLIF(btrim(dispatch_key), ''::text) IS NOT NULL))"
        disposition: narrowed
```

## Held Future Policies

```yaml
held_future_policies:
  public.measures_seat_hold_capture:
    insert_standing: no_public_insert_policy
    update_standing: no_public_update_policy
    delete_standing: no_public_delete_policy
    affected: true
    disposition: held_future_scope_public_insert_revoked
```

## Policies Changed

```yaml
policies_changed:
  dropped:
    - table: public.measures_registry
      policyname: public read active measures_registry
    - table: public.measures_media_map
      policyname: measures_media_map_public_active_read
    - table: public.measures_publication_subscription_capture
      policyname: measures_publication_subscription_public_insert
    - table: public.measures_seat_hold_capture
      policyname: public inserts measures registry seat holds
  created:
    - table: public.measures_registry
      policyname: measures_registry_public_released_active_read
    - table: public.measures_publication_subscription_capture
      policyname: measures_publication_subscription_capture_public_insert_guarded
  narrowed:
    - public.measures_registry
    - public.measures_media_map
    - public.measures_publication_subscription_capture
  net_policy_row_delta: -2
```

## Protected Scope Confirmation

```yaml
protected_scope_confirmation:
  protected_c3_system_policies_untouched: true
  protected_measures_of_inanna_policies_untouched: true
  protected_c3_system_policy_rows_after: 19
  protected_measures_of_inanna_policy_rows_after: 5
```

## Anon Public Access Standing

```yaml
anon_public_access_standing:
  runtime_table_anon_select:
    public.measures_registry: { ok: true, count: 59 }
    public.measures_encounter_def: { ok: true, count: 92, blocker: no_safer_release_columns_available }
    public.measures_media_map: { ok: true, count: 2 }
    public.measures_design_token: { ok: true, count: 52 }
    public.measures_publication_registry: { ok: true, count: 2 }
    public.measures_publication_dispatch: { ok: true, count: 2 }
    public.map_commerce_contracts: { ok: true, count: 3, review_note: release_state_active_policy_kept }
  public_write_table_anon_insert:
    public.measures_iis_eval_gate1_capture: strictly_constrained_policy_kept_no_probe
    public.measures_publication_subscription_capture: narrowed_policy_no_probe
    public.measures_seat_hold_capture: blocked_no_public_insert_policy
  anon_update_standing: blocked_by_absence_of_public_update_policies
  anon_delete_standing: blocked_by_absence_of_public_delete_policies
  write_probes_performed: false
  write_probe_reason: no safe disposable live test path registered by OAR
```

## Mutation Boundary Confirmation

```yaml
mutation_boundary_confirmation:
  policy_mutation: true
  application_row_mutation: false
  rls_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  launch_activation: false
  payment_activation: false
```

## Remaining Blockers

```yaml
remaining_blockers:
  - table: public.measures_encounter_def
    reason: public read remains is_active-only because exact columns do not expose release_state/status/public_visible/published predicates
  - table: public.map_commerce_contracts
    reason: release_state_active policy kept; future review may decide additional commerce boundary predicates outside this OAR
  - table: public.measures_iis_eval_gate1_capture
    reason: direct anon insert kept with strict existing guardrails because current assessment/contact capture dependency was not proven safe to break
  - table: public.measures_publication_subscription_capture
    reason: direct anon insert narrowed but edge-function replacement remains preferred future architecture
```

