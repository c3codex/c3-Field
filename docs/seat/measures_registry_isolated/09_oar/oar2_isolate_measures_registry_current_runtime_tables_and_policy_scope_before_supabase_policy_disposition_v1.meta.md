---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Isolate Measures Registry Current Runtime Tables and Policy Scope Before Supabase Policy Disposition v1
status: proposed
version: v1
operator: op044
priority: critical_security_preflight
source_oar1:
  - docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
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

# OAR2 - Isolate Measures Registry Current Runtime Tables and Policy Scope Before Supabase Policy Disposition v1

## OBSERVED

The immediate RLS-disabled public table blocker was addressed by enabling RLS on:

- public.system_oar_execution_evidence
- public.system_oar_queue
- public.system_process_registry

A later read-only policy review found remaining public policy exposure:

- 54 total public policies from prior baseline
- 21 broad public read policies
- 6 named public or anon write policies requiring review

That review also showed the policy scope crosses multiple surfaces:

- current Measures Registry renderer tables
- c3 / OAR / process policy tables
- Measures of Inanna / exhibition tables
- temporary media tables
- public capture tables
- legacy or held surfaces

Therefore, policy mutation must not proceed until the current Measures Registry launch/runtime table scope is isolated.

## ALIGNED

This OAR2 performs isolation only.

The purpose is to define the exact current Measures Registry launch/runtime policy scope before any Supabase public policy disposition or mutation.

This OAR2 does not authorize:

- policy mutation
- RLS mutation
- DB row mutation
- runtime mutation
- route mutation
- renderer mutation
- public copy mutation
- launch activation
- payment activation
- SEAT completion claim
- SEAL standing
- Registry Standing
- Branch standing
- c3 Key assignment
- DAO participation
- certification

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Isolation rule:

Current Measures Registry launch tables must be separated from protected other-system tables, legacy tables, held tables, and future c3 Field tables before policy disposition.

## ROUTED

## 1. Create isolation report

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_current_runtime_policy_scope_isolation_v1.meta.md

The report must classify all policy-relevant tables into one of these dispositions:

- current_measures_registry_runtime
- current_measures_registry_public_write
- current_measures_registry_internal_only
- protected_c3_system
- protected_measures_of_inanna
- legacy_trace
- held_future_scope
- unknown_requires_operator_review

## 2. Inspect current runtime and source references

Read-only inspect:

- src/
- supabase/
- docs/seat/measures_registry_isolated/
- docs/seat/measures_registry/
- docs/oar/measures_registry/
- docs/oar/measures-registry/
- docs/oar/measures_interoperability/

Do not mutate files.

## 3. Known current Measures Registry renderer-required table candidates

Classify these first:

- public.measures_registry
- public.measures_encounter_def
- public.measures_media_map
- public.measures_design_token
- public.measures_publication_registry
- public.measures_publication_dispatch
- public.map_commerce_contracts

For each table report:

table:
classification:
required_by_current_renderer: true_or_false
required_by_current_launch: true_or_false
read_access_needed_by_anon: true_or_false
write_access_needed_by_anon: false
evidence_paths:
recommended_policy_disposition:
policy_mutation_ready: false

## 4. Known current public-write candidates

Classify these separately:

- public.measures_iis_eval_gate1_capture
- public.measures_publication_subscription_capture
- public.codex_connect_capture
- public.measures_seat_hold_capture

For each table report:

table:
classification:
current_public_form_required: true_or_false
current_launch_required: true_or_false
anon_insert_needed: true_or_false
anon_update_needed: false
anon_delete_needed: false
edge_function_preferred: true_or_false
direct_insert_allowed_now: false
evidence_paths:
recommended_policy_disposition:
policy_mutation_ready: false

Default rule:

Direct anon insert remains untrusted until form scope, with_check predicate, spam/rate boundary, and provider/function boundary are confirmed.

## 5. Protected c3 system policy scope

Classify these as protected_c3_system unless exact evidence proves they are current Measures Registry renderer-required:

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

For each table report:

table:
classification: protected_c3_system
current_measures_registry_launch_required: true_or_false
policy_mutation_allowed_in_measures_registry_scope: false
requires_seeded_reference_review: true
recommended_next_scope:
notes:

## 6. Protected Measures of Inanna / exhibition scope

Classify these outside current Measures Registry launch scope unless exact evidence proves otherwise:

- public.measures_encounter_view_history
- public.temp_exhibition_media

For each table report:

table:
classification:
current_measures_registry_launch_required: true_or_false
policy_mutation_allowed_in_measures_registry_scope: false
recommended_next_scope:
notes:

## 7. Isolation matrix

The report must include this matrix:

isolation_matrix:
  current_measures_registry_runtime:
    tables:
    public_read_needed:
    public_write_needed:
    policy_disposition_allowed_after_exact_catalog_readback:

  current_measures_registry_public_write:
    tables:
    direct_anon_insert_currently_allowed: false
    edge_function_preferred:
    policy_disposition_allowed_after_exact_catalog_readback:

  current_measures_registry_internal_only:
    tables:
    public_read_needed: false
    public_write_needed: false

  protected_c3_system:
    tables:
    mutate_under_this_scope: false
    requires_seeded_reference_review: true

  protected_measures_of_inanna:
    tables:
    mutate_under_this_scope: false
    requires_separate_system_review: true

  legacy_trace:
    tables:
    mutate_under_this_scope: false
    requires_operator_review: true

  held_future_scope:
    tables:
    mutate_under_this_scope: false
    requires_future_authority: true

  unknown_requires_operator_review:
    tables:
    mutate_under_this_scope: false
    requires_operator_review: true

## 8. Current renderer-read requirements

Identify which tables are actually read by current Measures Registry runtime.

For each renderer-required table, report:

table:
source_file_or_doc_evidence:
read_purpose:
minimum_safe_public_read_predicate:
available_predicate_columns_if_known:
policy_should_be:
  - keep_if_already_narrow
  - narrow_required
  - no_public_read_required

Do not invent columns.

If columns are unknown, mark:

available_predicate_columns_if_known: unknown_pending_exact_catalog_rows

## 9. Current write requirements

Identify which tables are actually written by current public forms or public interactions.

For each write table, report:

table:
form_or_surface:
write_type:
  - insert
  - update
  - delete
current_launch_required: true_or_false
direct_anon_write_safe_now: false
preferred_boundary:
  - edge_function
  - server_action
  - authenticated_only
  - hold

## 10. Output summary

The isolation report must include:

standing:
  status: current_policy_scope_isolated
  mutation_authorized: false
  policy_mutation_authorized: false
  db_row_mutation_authorized: false
  safe_for_policy_mutation: false

summary_counts:
  current_measures_registry_runtime:
  current_measures_registry_public_write:
  current_measures_registry_internal_only:
  protected_c3_system:
  protected_measures_of_inanna:
  legacy_trace:
  held_future_scope:
  unknown_requires_operator_review:

operator_decisions_required:
  - decision:
    table_or_policy_scope:
    reason:

next_safe_oar2:
  title: OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1

## 11. No mutation boundary

Do not:

- drop policies
- create policies
- alter policies
- enable or disable RLS
- insert rows
- update rows
- delete rows
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- activate launch
- activate payment
- claim standing
- register DB contents

## VALIDATION RETURN

Return:

- OAR2 path
- isolation report path
- inspected folders
- current Measures Registry runtime tables
- current public write candidate tables
- protected c3 system tables
- protected Measures of Inanna / exhibition tables
- unknown tables requiring operator review
- renderer read requirements
- write requirements
- operator decisions required
- safe_for_policy_mutation true_or_false
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md

OAR1 must report:

- OAR2 path
- isolation report path
- inspected folders
- current Measures Registry runtime table list
- current public write candidate table list
- protected c3 system table list
- protected Measures of Inanna / exhibition table list
- unknown table list
- summary counts
- renderer read requirements
- write requirements
- operator decisions required
- safe_for_policy_mutation
- mutation scope confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- recommended next OAR2 title

Recommended next OAR2:

OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1

## CLOSE

This OAR2 isolates current Measures Registry policy scope only.

It does not mutate policies.

It does not mutate DB rows.

It does not activate runtime.

It does not insert DB rows.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody isolates and writes evidence.
