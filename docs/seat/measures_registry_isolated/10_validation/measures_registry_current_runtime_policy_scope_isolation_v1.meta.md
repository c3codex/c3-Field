---
document_type: policy_scope_isolation_report
authority_level: isolation_evidence
system_scope: measures_codex
title: Measures Registry Current Runtime Policy Scope Isolation v1
status: current_policy_scope_isolated
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# Measures Registry Current Runtime Policy Scope Isolation v1

## Standing

```yaml
standing:
  status: current_policy_scope_isolated
  mutation_authorized: false
  policy_mutation_authorized: false
  db_row_mutation_authorized: false
  runtime_activation_authorized: false
  safe_for_policy_mutation: false
  isolation_rule: current Measures Registry launch/runtime tables are separated from protected c3 system, Measures of Inanna, legacy, held, and unknown scopes before policy disposition
```

## Inspected Folders

```yaml
inspected_folders:
  - path: src/
    inspected: true
  - path: supabase/
    inspected: true
  - path: docs/seat/measures_registry_isolated/
    inspected: true
  - path: docs/seat/measures_registry/
    inspected: true
  - path: docs/oar/measures_registry/
    inspected: true
  - path: docs/oar/measures-registry/
    inspected: true
  - path: docs/oar/measures_interoperability/
    inspected: true
```

## Source Evidence

```yaml
source_evidence:
  prior_rls_oar1:
    path: docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
    evidence: 54 public policies, 21 broad public read policies, and public or anon write policies requiring review
  prior_policy_review:
    path: docs/seat/measures_registry_isolated/10_validation/supabase_public_policy_renderer_read_review_v1.meta.md
    evidence: current renderer tables, public-write candidates, protected other-system reads, and exact catalog row-return blocker
  runtime_source:
    - src/app/App.tsx
    - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    - src/measures_of_inanna/resolve_encounter.ts
    - src/measures_of_inanna/encounter_history.ts
    - src/measures_of_inanna/ConnectCaptureForm.tsx
    - src/c3_field_convergence/oarSpineRegistry.ts
```

## Current Measures Registry Runtime Tables

| Table | Classification | Required by current renderer | Required by current launch | Anon read needed | Anon write needed | Evidence paths | Recommended policy disposition | Policy mutation ready |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| public.measures_registry | current_measures_registry_runtime | true | true | true | false | `src/app/App.tsx:185`; `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:250` | keep only if narrow to active/released registry rows; exact catalog row return required | false |
| public.measures_encounter_def | current_measures_registry_runtime | true | true | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:245` | narrow required to registered encounter keys and public-safe state | false |
| public.measures_media_map | current_measures_registry_runtime | true | true | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:255` | narrow required to active campaign/media-role allowlist | false |
| public.measures_design_token | current_measures_registry_runtime | true | true | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:261` | narrow required to active `measures_registry` token rows | false |
| public.measures_publication_registry | current_measures_registry_runtime | true | true | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:266` | keep only for published public publication rows | false |
| public.measures_publication_dispatch | current_measures_registry_runtime | true | true | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:271` | keep only for published public dispatch rows | false |
| public.map_commerce_contracts | current_measures_registry_runtime | true | true_with_payment_held | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:277`; `docs/seat/measures_registry_isolated/payment_boundary_contract.meta.md` | narrow required to active display rows while payment activation remains held | false |

## Current Public Write Candidate Tables

| Table | Classification | Current public form required | Current launch required | Anon insert needed | Anon update needed | Anon delete needed | Edge function preferred | Direct insert allowed now | Evidence paths | Recommended policy disposition | Policy mutation ready |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| public.measures_iis_eval_gate1_capture | current_measures_registry_public_write | true | true | true_pending_boundary | false | false | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:444`; `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:649` | replace direct anon insert with edge/function boundary or narrow after exact predicate review | false |
| public.measures_publication_subscription_capture | current_measures_registry_public_write | true | true | true_pending_boundary | false | false | true | false | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:799`; `docs/oar/measures_registry/structural_drift_publication_seeding/execute-structural-drift-publication-seeding.cjs` | replace direct anon insert with edge/function boundary or narrow with strict capture source and email constraints | false |
| public.codex_connect_capture | protected_measures_of_inanna | false_for_measures_registry | false | false_for_measures_registry | false | false | true | false | `src/measures_of_inanna/ConnectCaptureForm.tsx:37` | move to Measures of Inanna protected review; not in Measures Registry policy mutation scope | false |
| public.measures_seat_hold_capture | held_future_scope | false_now | false_until_seat_payment_authority | false_now | false | false | true | false | `docs/oar/measures_registry/execute-seat-hold-surfaces.cjs`; `docs/seat/measures_registry_isolated/payment_boundary_contract.meta.md` | hold or revoke candidate until launch/payment/seat-hold authority is seated | false |

## Protected C3 System Policy Scope

| Table | Classification | Current Measures Registry launch required | Policy mutation allowed in Measures Registry scope | Requires seeded reference review | Recommended next scope | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| public.c3_ai_action_boundary | protected_c3_system | false | false | true | c3 system seeded-reference policy review | No current Measures Registry renderer read found. |
| public.c3_attachment_law | protected_c3_system | false | false | true | c3 system seeded-reference policy review | No current Measures Registry renderer read found. |
| public.c3_canopy_law | protected_c3_system | false | false | true | c3 system seeded-reference policy review | No current Measures Registry renderer read found. |
| public.c3_chamber_directory_binding | protected_c3_system | false | false | true | c3 chamber-directory policy review | No current Measures Registry renderer read found. |
| public.c3_correction_contract | protected_c3_system | false | false | true | c3 correction-contract policy review | No current Measures Registry renderer read found. |
| public.c3_evidence_contract | protected_c3_system | false | false | true | c3 evidence-contract policy review | No current Measures Registry renderer read found. |
| public.c3_oar_process_instance | protected_c3_system | false | false | true | c3 OAR/process policy review | Read by `src/c3_field_convergence/oarSpineRegistry.ts:49`, not by current Measures Registry renderer. |
| public.c3_oar_seeded_reference | protected_c3_system | false | false | true | c3 OAR/process policy review | Read by `src/c3_field_convergence/oarSpineRegistry.ts:57`, not by current Measures Registry renderer. |
| public.c3_oar_transition_event | protected_c3_system | false | false | true | c3 OAR/process policy review | Read by `src/c3_field_convergence/oarSpineRegistry.ts:53`, not by current Measures Registry renderer. |
| public.c3_optics_contract | protected_c3_system | false | false | true | c3 optics policy review | No current Measures Registry renderer read found. |
| public.c3_orphaned_surface_registry | protected_c3_system | false | false | true | c3 orphaned surface registry review | No current Measures Registry renderer read found. |
| public.c3_passage_law | protected_c3_system | false | false | true | c3 passage-law policy review | No current Measures Registry renderer read found. |
| public.c3_public_semantic_pairing | protected_c3_system | false | false | true | c3 semantic-pairing policy review | No current Measures Registry renderer read found. |
| public.c3_registered_system | protected_c3_system | false | false | true | c3 registered-system policy review | No current Measures Registry renderer read found. |
| public.c3_role_contract | protected_c3_system | false | false | true | c3 role-contract policy review | No current Measures Registry renderer read found. |
| public.c3_runtime_admission_binding | protected_c3_system | false | false | true | c3 runtime-admission policy review | No current Measures Registry renderer read found. |
| public.c3_runtime_admission_contract | protected_c3_system | false | false | true | c3 runtime-admission policy review | No current Measures Registry renderer read found. |
| public.c3_signal_law | protected_c3_system | false | false | true | c3 signal-law policy review | No current Measures Registry renderer read found. |
| public.c3_trace_contract | protected_c3_system | false | false | true | c3 trace-contract policy review | No current Measures Registry renderer read found. |

## Protected Measures Of Inanna And Exhibition Scope

| Table | Classification | Current Measures Registry launch required | Policy mutation allowed in Measures Registry scope | Recommended next scope | Notes |
| --- | --- | --- | --- | --- | --- |
| public.measures_encounter_view_history | protected_measures_of_inanna | false | false | Measures of Inanna protected history review | Read/upserted by `src/measures_of_inanna/encounter_history.ts:30` and `src/measures_of_inanna/encounter_history.ts:48`. |
| public.temp_exhibition_media | protected_measures_of_inanna | false | false | Measures of Inanna/exhibition media fallback review | Read by `src/measures_of_inanna/resolve_encounter.ts:382`; not current Measures Registry launch authority. |
| public.codex_connect_capture | protected_measures_of_inanna | false | false | Measures of Inanna connect-capture review | Inserted by `src/measures_of_inanna/ConnectCaptureForm.tsx:37`; not current Measures Registry launch authority. |

## Isolation Matrix

```yaml
isolation_matrix:
  current_measures_registry_runtime:
    tables:
      - public.measures_registry
      - public.measures_encounter_def
      - public.measures_media_map
      - public.measures_design_token
      - public.measures_publication_registry
      - public.measures_publication_dispatch
      - public.map_commerce_contracts
    public_read_needed: true
    public_write_needed: false
    policy_disposition_allowed_after_exact_catalog_readback: narrow_read_policies_only

  current_measures_registry_public_write:
    tables:
      - public.measures_iis_eval_gate1_capture
      - public.measures_publication_subscription_capture
    direct_anon_insert_currently_allowed: false
    edge_function_preferred: true
    policy_disposition_allowed_after_exact_catalog_readback: edge_function_or_strict_insert_predicate_review_only

  current_measures_registry_internal_only:
    tables: []
    public_read_needed: false
    public_write_needed: false

  protected_c3_system:
    tables:
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
    mutate_under_this_scope: false
    requires_seeded_reference_review: true

  protected_measures_of_inanna:
    tables:
      - public.measures_encounter_view_history
      - public.temp_exhibition_media
      - public.codex_connect_capture
    mutate_under_this_scope: false
    requires_separate_system_review: true

  legacy_trace:
    tables: []
    mutate_under_this_scope: false
    requires_operator_review: true

  held_future_scope:
    tables:
      - public.measures_seat_hold_capture
    mutate_under_this_scope: false
    requires_future_authority: true

  unknown_requires_operator_review:
    tables: []
    mutate_under_this_scope: false
    requires_operator_review: true
```

## Current Renderer Read Requirements

| Table | Source file or doc evidence | Read purpose | Minimum safe public read predicate | Available predicate columns if known | Policy should be |
| --- | --- | --- | --- | --- | --- |
| public.measures_registry | `src/app/App.tsx:185`; `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:250` | route metadata and active landing/runtime unit state | active registry rows only, constrained by registry key and release/access state where present | registry_key, is_active, release_state, access_state | narrow_required |
| public.measures_encounter_def | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:245` | registered encounter definitions for landing sections | registered encounter allowlist and public-safe status if present | encounter_key; other predicate columns unknown_pending_exact_catalog_rows | narrow_required |
| public.measures_media_map | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:255` | media roles for current campaign and registered surfaces | active rows for current campaign key and registered media role allowlist | campaign_key, media_role, is_active | narrow_required |
| public.measures_design_token | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:261` | active design tokens for registry runtime | `registry_key = 'measures_registry'` and active rows only | registry_key, is_active | narrow_required |
| public.measures_publication_registry | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:266` | public publication metadata for structural drift / unDrifted surfaces | published rows only | publication_key, status | keep_if_already_narrow |
| public.measures_publication_dispatch | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:271` | published unDrifted dispatch content | `publication_key = 'undrifted'` and published rows only | publication_key, status | keep_if_already_narrow |
| public.map_commerce_contracts | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:277`; `docs/seat/measures_registry_isolated/payment_boundary_contract.meta.md` | MAP contract display while payment remains held | active display rows only; must not imply payment activation or standing | release_state, contract_key, map_circuit_key, seat_contract_state | narrow_required |

## Current Write Requirements

| Table | Form or surface | Write type | Current launch required | Direct anon write safe now | Preferred boundary |
| --- | --- | --- | --- | --- | --- |
| public.measures_iis_eval_gate1_capture | AI Operations Assessment contact-gated delivery request | insert | true | false | edge_function |
| public.measures_publication_subscription_capture | unDrifted / structural drift publication subscription capture | insert | true | false | edge_function |
| public.codex_connect_capture | Measures of Inanna connect capture | insert | false_for_measures_registry | false | hold |
| public.measures_encounter_view_history | Measures of Inanna encounter history | insert_update | false_for_measures_registry | false | hold |
| public.measures_seat_hold_capture | legacy/held seat hold capture | insert | false_until_future_authority | false | hold |

## Summary Counts

```yaml
summary_counts:
  current_measures_registry_runtime: 7
  current_measures_registry_public_write: 2
  current_measures_registry_internal_only: 0
  protected_c3_system: 19
  protected_measures_of_inanna: 3
  legacy_trace: 0
  held_future_scope: 1
  unknown_requires_operator_review: 0
```

## Operator Decisions Required

```yaml
operator_decisions_required:
  - decision: choose edge/function boundary or strict direct-insert predicates for assessment capture
    table_or_policy_scope: public.measures_iis_eval_gate1_capture
    reason: direct anon insert remains untrusted until form scope, with_check predicate, spam/rate boundary, and provider/function boundary are confirmed
  - decision: choose edge/function boundary or strict direct-insert predicates for publication subscription capture
    table_or_policy_scope: public.measures_publication_subscription_capture
    reason: public email capture requires abuse boundary and exact live predicate review
  - decision: keep payment and seat-hold capture held or authorize future payment/seat-hold scope
    table_or_policy_scope: public.measures_seat_hold_capture
    reason: seat/payment scope is held and must not imply launch, SEAT, SEAL, Registry Standing, Branch, c3 Key, DAO participation, or certification
  - decision: route c3 policy tables to separate seeded reference review
    table_or_policy_scope: protected_c3_system
    reason: c3/OAR/process/law/contract surfaces are not current Measures Registry renderer requirements
  - decision: route Inanna/exhibition policy tables to separate protected-system review
    table_or_policy_scope: protected_measures_of_inanna
    reason: Measures of Inanna history, exhibition media fallback, and connect capture are outside current Measures Registry launch scope
  - decision: authorize exact live catalog row-return path
    table_or_policy_scope: pg_policies, pg_tables, information_schema.columns
    reason: prior policy review found catalog row return blocked; policy disposition remains unsafe without exact rows and columns
```

## Next Safe OAR2

```yaml
next_safe_oar2:
  title: OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1
```

## No Mutation Boundary

```yaml
no_mutation_boundary:
  policies_dropped: false
  policies_created: false
  policies_altered: false
  RLS_enabled_or_disabled: false
  rows_inserted: false
  rows_updated: false
  rows_deleted: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  launch_activation: false
  payment_activation: false
  standing_claimed: false
  DB_contents_registered: false
```

## Close

This isolation report defines current Measures Registry policy scope only.

It does not mutate policies.

It does not mutate DB rows.

It does not activate runtime.

It does not insert DB rows.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody isolates and writes evidence.
