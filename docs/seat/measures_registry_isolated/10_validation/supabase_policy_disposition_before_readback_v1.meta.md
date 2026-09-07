---
document_type: validation_report
authority_level: before_policy_disposition_evidence
system_scope: measures_codex
title: Supabase Policy Disposition Before Readback v1
status: completed_before_mutation
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
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

# Supabase Policy Disposition Before Readback v1

## Exact Catalog RPC Payload Summary

```yaml
exact_catalog_rpc_payload_summary:
  function: public.measures_registry_policy_catalog_review
  exact_rows_returned: true
  policy_rows_count: 37
  table_rows_count: 32
  column_rows_count: 522
  scope_summary:
    current_measures_registry_public_write: 2
    current_measures_registry_runtime: 7
    held_future_scope: 1
    protected_c3_system: 19
    protected_measures_of_inanna: 3
```

## Current Runtime Policies

```yaml
current_runtime_policies:
  public.measures_registry:
    columns_available: [release_state, access_state, is_active]
    policies:
      - policyname: public read active measures_registry
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "(is_active = true)"
        disposition: narrow_required
        planned_action: replace_with_release_state_and_is_active_predicate
      - policyname: service_role_only_registry
        cmd: ALL
        roles: [public]
        qual: "(auth.role() = 'service_role'::text)"
        disposition: keep_with_evidence
        planned_action: none
  public.measures_encounter_def:
    columns_available: [is_active]
    policies:
      - policyname: public read active measures_encounter_def
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "(is_active = true)"
        disposition: blocker_no_safer_release_columns
        planned_action: none
      - policyname: service_role_only_encounter
        cmd: ALL
        roles: [public]
        qual: "(auth.role() = 'service_role'::text)"
        disposition: keep_with_evidence
        planned_action: none
  public.measures_media_map:
    columns_available: [registry_key, encounter_key, campaign_key, media_role, is_active]
    policies:
      - policyname: measures_media_map_public_active_read
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "(is_active = true)"
        disposition: hold_or_revoke_candidate
        planned_action: drop_duplicate_broad_public_read
      - policyname: public reads active registry landing media
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "((is_active = true) AND (campaign_key = 'agents_of_chaos_integrity_governance'::text) AND (media_role = ANY (ARRAY['hero_video'::text, 'hero_poster'::text, 'path_choice_background'::text, 'registry_mark'::text])))"
        disposition: keep_with_evidence
        planned_action: none
  public.measures_design_token:
    columns_available: [registry_key, is_active]
    policies:
      - policyname: public reads active measures registry design tokens
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "((is_active = true) AND (registry_key = 'measures_registry'::text))"
        disposition: keep_with_evidence
        planned_action: none
  public.measures_publication_registry:
    columns_available: [status]
    policies:
      - policyname: measures_publication_registry_public_read
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "(status = 'published'::text)"
        disposition: keep_with_evidence
        planned_action: none
  public.measures_publication_dispatch:
    columns_available: [status, published_at]
    policies:
      - policyname: measures_publication_dispatch_public_read
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "(status = 'published'::text)"
        disposition: keep_with_evidence
        planned_action: none
  public.map_commerce_contracts:
    columns_available: [release_state, payment_scope, c3_key_required, wallet_required, seat_contract_state]
    policies:
      - policyname: map_commerce_contracts_public_read
        cmd: SELECT
        roles: [anon, authenticated]
        qual: "(release_state = 'active'::text)"
        disposition: keep_with_evidence_with_operator_review
        planned_action: none
```

## Current Write Policies

```yaml
current_write_policies:
  public.measures_iis_eval_gate1_capture:
    policies:
      - policyname: measures_iis_eval_gate1_capture_public_insert
        cmd: INSERT
        roles: [anon, authenticated]
        disposition: keep_with_guardrails
        planned_action: none
        reason: current assessment/contact capture may depend on direct insert and policy already carries strict with_check branches
  public.measures_publication_subscription_capture:
    policies:
      - policyname: measures_publication_subscription_public_insert
        cmd: INSERT
        roles: [anon, authenticated]
        with_check: "(capture_source = 'structural_drift_dispatch'::text)"
        disposition: narrow_required
        planned_action: replace_with_capture_source_plus_required_email_publication_dispatch_columns
  public.measures_seat_hold_capture:
    policies:
      - policyname: public inserts measures registry seat holds
        cmd: INSERT
        roles: [anon, authenticated]
        disposition: held_future_scope
        planned_action: drop_public_insert_policy
        reason: held future scope is not required for current launch
```

## Excluded Protected Policies

```yaml
excluded_protected_policies:
  protected_c3_system_policy_rows: 19
  protected_measures_of_inanna_policy_rows: 5
  planned_action: none
  mutation_allowed: false
```

## Planned Actions

```yaml
planned_actions:
  policies_to_drop:
    - public.measures_media_map: measures_media_map_public_active_read
    - public.measures_seat_hold_capture: public inserts measures registry seat holds
    - public.measures_registry: public read active measures_registry
    - public.measures_publication_subscription_capture: measures_publication_subscription_public_insert
  policies_to_create:
    - public.measures_registry: measures_registry_public_released_active_read
    - public.measures_publication_subscription_capture: measures_publication_subscription_capture_public_insert_guarded
  protected_scopes_to_leave_untouched:
    - protected_c3_system
    - protected_measures_of_inanna
  application_rows_to_mutate: 0
  runtime_to_mutate: false
  routes_to_mutate: false
  renderer_to_mutate: false
  public_copy_to_mutate: false
```
