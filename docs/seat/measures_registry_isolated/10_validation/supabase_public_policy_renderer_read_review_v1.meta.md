---
document_type: validation_report
authority_level: review_evidence
system_scope: measures_codex
title: Supabase Public Policy Renderer Read Review v1
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

# Supabase Public Policy Renderer Read Review v1

## Standing

```yaml
standing:
  review_type: read_only_security_and_renderer_requirement_review
  source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
  source_oar1_baseline: docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
  live_catalog_row_return:
    exec_sql_rpc: reachable_but_returned_ok_without_rows_for_select_payload
    postgrest_pg_policies: blocked_not_in_schema_cache_PGRST205
    postgrest_pg_tables: blocked_not_in_schema_cache_PGRST205
    disposition: exact_current_policy_rows_not_returned_by_available_read_interface
  evidence_basis:
    - prior_oar1_live_policy_readback_for_counts_and_policy_names
    - current_source_renderer_scan
    - local_migration_and_oar_script_scan_for_policy_tables_and_predicates
  database_mutated: false
  runtime_mutated: false
  route_mutated: false
  renderer_mutated: false
  public_copy_mutated: false
```

## Inspected Policy Count

```yaml
inspected_policy_count:
  public_policy_count_from_prior_oar1_live_readback: 54
  target_table_policy_count_after_prior_oar1: 0
  current_catalog_row_return_blocked: true
```

## Broad Public Read Policy Count

```yaml
broad_public_read_policy_count:
  count_from_prior_oar1_live_readback: 21
  review_scope_policy_names:
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
```

## Public Or Anon Write Policy Count

```yaml
public_or_anon_write_policy_count:
  named_review_scope_count: 6
  prior_oar1_total_public_or_anon_insert_update_delete_or_all_count: 12
  review_scope_policy_names:
    - public_insert_codex_connect_capture
    - measures encounter history insert
    - measures encounter history update
    - measures_iis_eval_gate1_capture_public_insert
    - measures_publication_subscription_public_insert
    - public inserts measures registry seat holds
```

## Table Column Review

```yaml
table_column_review:
  catalog_columns_exact_live_return: blocked_by_available_read_interface
  columns_not_invented: true
  locally_observed_tables:
    - table: public.c3_oar_process_instance
      source: supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql
      narrowing_column_evidence: c3 process standing table; exact public release predicate not confirmed by current OAR
    - table: public.c3_oar_transition_event
      source: supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql
      narrowing_column_evidence: append-only transition table; exact public release predicate not confirmed by current OAR
    - table: public.c3_oar_seeded_reference
      source: supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql
      narrowing_column_evidence: seeded reference table; exact public release predicate not confirmed by current OAR
    - table: public.measures_encounter_view_history
      source: docs/_source/session_25/sql/measures_encounter_view_history.sql
      observed_columns:
        - visitor_id
        - registry_key
        - encounter_key
        - surface_type
        - metadata
        - viewed_at
        - updated_at
      observed_policy_predicates:
        select_using: "true"
        insert_with_check: "true"
        update_using: "true"
        update_with_check: "true"
    - table: public.measures_iis_eval_gate1_capture
      source: docs/oar/measures_registry/execute-landing-epigraph-split-hero.cjs
      observed_columns:
        - institution_name
        - institution_address
        - institution_phone
        - contact_name
        - contact_position
        - contact_email
        - evaluation_answers
        - capture_context
        - intent
        - eligibility
        - campaign_tag
        - notification_state
        - metadata
      observed_policy_predicate: "capture_context = 'iis_eval_gate1' and intent = 'system_evaluation_request'"
      current_renderer_insert_payload_drift: renderer_now_uses_capture_context_measures_assessment_contact_gated_delivery_and_intent_assessment_result_delivery_request
    - table: public.measures_publication_subscription_capture
      source: docs/oar/measures_registry/structural_drift_publication_seeding/execute-structural-drift-publication-seeding.cjs
      observed_columns:
        - publication_key
        - dispatch_key
        - email
        - organization
        - capture_source
        - metadata
      observed_policy_predicate: "capture_source = 'structural_drift_dispatch'"
    - table: public.measures_seat_hold_capture
      source: docs/oar/measures_registry/execute-seat-hold-surfaces.cjs
      observed_columns:
        - registry_key
        - encounter_key
        - contact_name
        - contact_email
        - organization
        - capture_context
        - metadata
      observed_policy_predicate: "registry_key = 'measures_registry' and encounter_key in ('foundation_seat_hold','systems_seat_hold')"
  tables_requiring_exact_column_readback_before_policy_change:
    - public.c3_ai_action_boundary
    - public.c3_attachment_law
    - public.c3_canopy_law
    - public.c3_chamber_directory_binding
    - public.c3_correction_contract
    - public.c3_evidence_contract
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
    - public.codex_connect_capture
    - public.temp_exhibition_media
```

## Renderer Read Requirement Review

```yaml
renderer_read_requirement_review:
  current_measures_registry_runtime_reads:
    - table: public.measures_registry
      required_by_renderer: true
      source_evidence:
        - path: src/app/App.tsx:185
          reason: governed route metadata reads registry metadata for route units
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:250
          reason: landing/runtime unit state reads active registry rows
      safe_public_read_predicate_recommendation: "is_active = true plus release_state/access_state constraints already selected by renderer contract where available"
    - table: public.measures_encounter_def
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:245
          reason: registered encounter definitions drive landing sections
      safe_public_read_predicate_recommendation: "encounter_key in registered allowlist plus active/release column if live schema has one"
    - table: public.measures_media_map
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:255
          reason: registered media roles resolve from campaign and role allowlists
      safe_public_read_predicate_recommendation: "is_active = true plus campaign_key/media_role allowlist"
    - table: public.measures_design_token
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:261
          reason: registry design tokens read by registry key
      safe_public_read_predicate_recommendation: "registry_key = 'measures_registry' and is_active = true"
    - table: public.measures_publication_registry
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:266
          reason: publication metadata for structural drift / unDrifted surfaces
      safe_public_read_predicate_recommendation: "status = 'published'"
    - table: public.measures_publication_dispatch
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:271
          reason: published unDrifted dispatches render public publication body
      safe_public_read_predicate_recommendation: "publication_key = 'undrifted' and status = 'published'"
    - table: public.map_commerce_contracts
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:277
          reason: active MAP contract cards render from registry contract rows
      safe_public_read_predicate_recommendation: "release_state = 'active' plus current standing allowlist"
  current_measures_registry_public_writes:
    - table: public.measures_iis_eval_gate1_capture
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:649
          reason: assessment contact-gated delivery request inserts capture row
      safe_public_write_predicate_recommendation: "with_check must match current capture_context and intent, require consent booleans in metadata, and consider edge-function replacement"
    - table: public.measures_publication_subscription_capture
      required_by_renderer: true
      source_evidence:
        - path: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:799
          reason: public publication subscription form inserts email capture
      safe_public_write_predicate_recommendation: "capture_source = 'structural_drift_dispatch' plus email check; consider edge-function replacement for abuse control"
  protected_other_system_reads:
    - table: public.temp_exhibition_media
      required_by_renderer: false_for_current_measures_registry_runtime
      source_evidence:
        - path: src/measures_of_inanna/resolve_encounter.ts:382
          reason: Measures of Inanna fallback media resolver, not current Measures Registry launch authority
    - table: public.measures_encounter_view_history
      required_by_renderer: false_for_current_measures_registry_runtime
      source_evidence:
        - path: src/measures_of_inanna/encounter_history.ts:30
          reason: Measures of Inanna visitor history, not current Measures Registry renderer
    - table: public.codex_connect_capture
      required_by_renderer: false_for_current_measures_registry_runtime
      source_evidence:
        - path: src/measures_of_inanna/ConnectCaptureForm.tsx:37
          reason: Measures of Inanna connect capture, not current Measures Registry renderer
```

## Policy Disposition Table

| policy | table | current public exposure | likely renderer required | renderer evidence | recommended disposition | recommended next action |
|---|---|---:|---:|---|---|---|
| c3_ai_action_boundary_public_read | public.c3_ai_action_boundary | broad select | false | no current Measures Registry `src` read found | protected_system_review | require seeded reference and exact column readback before narrowing or revocation |
| c3_attachment_law_public_read | public.c3_attachment_law | broad select | false | no current Measures Registry `src` read found | protected_system_review | require seeded reference and exact column readback before narrowing or revocation |
| c3_canopy_law_public_read | public.c3_canopy_law | broad select | false | no current Measures Registry `src` read found | protected_system_review | require seeded reference and exact column readback before narrowing or revocation |
| c3_chamber_directory_binding_public_read | public.c3_chamber_directory_binding | broad select | false | no current Measures Registry `src` read found | protected_system_review | require chamber-directory seeded reference review before changing |
| c3_correction_contract_public_read | public.c3_correction_contract | broad select | false | no current Measures Registry `src` read found | protected_system_review | require c3 correction contract review before changing |
| c3_evidence_contract_public_read | public.c3_evidence_contract | broad select | false | no current Measures Registry `src` read found | protected_system_review | require evidence contract seeded reference review before changing |
| c3_oar_process_instance_public_read | public.c3_oar_process_instance | broad select | false for public Measures Registry | no current Measures Registry `src` read found | narrow_required | narrow to public-safe released process rows only if public process log remains intentional |
| c3_oar_seeded_reference_public_read | public.c3_oar_seeded_reference | broad select | false for public Measures Registry | no current Measures Registry `src` read found | narrow_required | narrow to public-safe released seeded references only if public process log remains intentional |
| c3_oar_transition_event_public_read | public.c3_oar_transition_event | broad select | false for public Measures Registry | no current Measures Registry `src` read found | narrow_required | narrow to public-safe transition events only if public process log remains intentional |
| c3_optics_contract_public_read | public.c3_optics_contract | broad select | false | no current Measures Registry `src` read found | protected_system_review | require optics contract seeded reference review before changing |
| c3_orphaned_surface_registry_public_read | public.c3_orphaned_surface_registry | broad select | false | no current Measures Registry `src` read found | hold_or_revoke_candidate | exact row/column readback needed; likely not launch-required |
| c3_passage_law_public_read | public.c3_passage_law | broad select | false | no current Measures Registry `src` read found | protected_system_review | require passage-law seeded reference review before changing |
| c3_public_semantic_pairing_public_read | public.c3_public_semantic_pairing | broad select | false | no current Measures Registry `src` read found | protected_system_review | require semantic pairing review before changing |
| c3_registered_system_public_read | public.c3_registered_system | broad select | false for current renderer | no current Measures Registry `src` read found | protected_system_review | do not revoke without c3 system registry review |
| c3_role_contract_public_read | public.c3_role_contract | broad select | false | no current Measures Registry `src` read found | protected_system_review | require role-contract seeded reference review before changing |
| c3_runtime_admission_binding_public_read | public.c3_runtime_admission_binding | broad select | false | no current Measures Registry `src` read found | protected_system_review | require runtime admission review before changing |
| c3_runtime_admission_contract_public_read | public.c3_runtime_admission_contract | broad select | false | no current Measures Registry `src` read found | protected_system_review | require runtime admission review before changing |
| c3_signal_law_public_read | public.c3_signal_law | broad select | false | no current Measures Registry `src` read found | protected_system_review | require signal-law seeded reference review before changing |
| c3_trace_contract_public_read | public.c3_trace_contract | broad select | false | no current Measures Registry `src` read found | protected_system_review | require trace-contract seeded reference review before changing |
| measures encounter history select | public.measures_encounter_view_history | broad select | false for current Measures Registry | `src/measures_of_inanna/encounter_history.ts:30` | hold_or_revoke_candidate | replace with visitor-scoped predicate or edge/function boundary for Inanna if still needed |
| public read temp_exhibition_media | public.temp_exhibition_media | broad select | false for current Measures Registry | `src/measures_of_inanna/resolve_encounter.ts:382` fallback only | legacy_or_deprecated | hold for Inanna fallback review; do not trust for current Measures Registry launch |

## Write Policy Disposition Table

| policy | table | public write surface | current launch required | required form or capture surface | abuse risk | recommended disposition | recommended next action |
|---|---|---:|---:|---|---|---|---|
| public_insert_codex_connect_capture | public.codex_connect_capture | insert | false for current Measures Registry | Measures of Inanna `ConnectCaptureForm.tsx` | medium; direct public contact capture | requires_operator_review | move to protected other-system review or replace with edge function |
| measures encounter history insert | public.measures_encounter_view_history | insert | false for current Measures Registry | Measures of Inanna history recorder | medium; direct public visitor tracking write | hold_or_revoke_candidate | replace with visitor-scoped function or remove if not needed |
| measures encounter history update | public.measures_encounter_view_history | update | false for current Measures Registry | Measures of Inanna history upsert | high; broad update with `true` predicate | hold_or_revoke_candidate | revoke or replace with strict visitor-scoped upsert function |
| measures_iis_eval_gate1_capture_public_insert | public.measures_iis_eval_gate1_capture | insert | true | Measures Registry assessment contact-gated result delivery | high; direct public capture with PII | narrow_required | align `with_check` to current renderer payload or replace with edge function before relying on it |
| measures_publication_subscription_public_insert | public.measures_publication_subscription_capture | insert | true | unDrifted / structural drift publication subscription | medium; public email capture | narrow_required | keep only with strict `capture_source`, email check, and preferably edge/rate-limit boundary |
| public inserts measures registry seat holds | public.measures_seat_hold_capture | insert | false while seat/payment activation is held | legacy seat hold capture | high; seat intent capture can imply launch/payment standing | hold_or_revoke_candidate | hold/revoke until a later seated launch/payment OAR explicitly activates seat holds |

## Unsafe Or Unclear Policies

```yaml
unsafe_or_unclear_policies:
  broad_public_read_without_current_measures_registry_renderer_requirement: 21
  public_write_policies_requiring_action_before_trust: 6
  highest_risk_items:
    - measures encounter history update
    - measures_iis_eval_gate1_capture_public_insert
    - public inserts measures registry seat holds
    - public_insert_codex_connect_capture
  exact_live_catalog_row_blocker: true
```

## Policies Recommended To Keep

```yaml
policies_recommended_to_keep: []
reason: none of the 21 broad read policies should be kept as broad true policies based on current Measures Registry renderer evidence
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
  - decide whether c3 OAR/process public-read surfaces remain intentionally public, and if yes identify release/public-safe predicates from exact columns
  - decide whether c3 law/contract public reads are public reference surfaces or should be protected behind seeded reference review
  - decide whether Measures of Inanna policies belong in this Measures Registry security pass or a separate protected-system pass
  - decide whether current assessment capture should remain direct public insert or move behind an edge/function boundary
  - decide whether publication subscription capture remains public insert or moves behind an edge/function boundary
  - decide whether seat hold capture remains held/revoked until launch/payment authority is seated
  - authorize a catalog-row-return path for exact `pg_policies`, `pg_tables`, and `information_schema.columns` readback before any mutation OAR
```

## Next Safe OAR2

```yaml
next_safe_OAR2:
  title: OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
  prerequisites:
    - exact live catalog row-return for pg_policies
    - exact live table column readback for each policy table
    - operator decisions for protected c3 law/contract surfaces
    - public-write boundary decision for assessment and publication captures
  allowed_initial_action: read_only_exact_catalog_evidence
  mutation_allowed_by_this_report: false
```

## Close

This report does not alter policies, rows, runtime, routes, renderer, or public copy.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody reviews and writes evidence.
