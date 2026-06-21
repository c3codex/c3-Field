---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1
status: proposed
version: v1
operator: op044
priority: critical_security_followup
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
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

# OAR2 - Review Supabase Public Policies and Renderer Read Requirements for Measures Registry v1

## OBSERVED

OAR1 confirmed Row Level Security was enabled on the three previously exposed public process tables:

```yaml
secured_tables:
  - public.system_oar_execution_evidence
  - public.system_oar_queue
  - public.system_process_registry
```

OAR1 also confirmed:

```yaml
target_tables:
  anon_select: blocked_by_RLS_zero_visible_rows
  anon_insert: blocked_by_RLS_no_insert_policy
  anon_update: blocked_by_RLS_no_update_policy
  anon_delete: blocked_by_RLS_no_delete_policy
```

However, OAR1 identified a remaining security review seam outside those three target tables:

```yaml
remaining_security_review:
  broad_public_select_policies: 21
  public_or_anon_write_policies_requiring_review: 6
```

Those policies were not changed because the prior OAR2 did not authorize dropping or revising policies outside the three exposed target tables.

This OAR2 reviews those existing public policies and compares them against actual renderer read requirements.

## ALIGNED

This OAR2 is a read-only security and renderer-read review.

This OAR2 does not authorize:

- dropping policies
- creating policies
- changing policies
- enabling/disabling RLS
- mutating DB rows
- mutating runtime
- mutating routes
- mutating renderer
- mutating public copy
- activating launch
- activating payment
- claiming SEAT completion
- claiming SEAL standing
- claiming Registry Standing
- assigning c3 Key
- activating DAO participation

The purpose is to classify policies and produce a safe next-action plan.

Authority remains:

```text
Codex → Field → Measures → OAR2 → Chazz → Cody → src
```

Renderer rule:

```text
src reads only registered, released, renderer-required state.
Public policies must exist only where renderer or public form submission actually requires them.
No broad policy remains trusted without classification.
```

## ROUTED

## 1. Inspect all public policies

Run:

```sql
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## 2. Inspect public table RLS state

Run:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

## 3. Identify broad public read policies

Classify any policy where:

```yaml
broad_public_read_policy_if:
  cmd: SELECT
  roles_include:
    - anon
    - public
  qual_is_broad:
    - "true"
    - null
    - no_release_or_active_condition
```

Known policies from prior OAR1 that require review:

```yaml
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
```

For each policy, report:

```yaml
policy_review_fields:
  table:
  policyname:
  cmd:
  roles:
  qual:
  current_public_exposure:
  likely_renderer_required:
  renderer_requirement_evidence:
  recommended_disposition:
  recommended_next_action:
```

Allowed recommended dispositions:

```yaml
recommended_dispositions:
  keep_with_evidence:
    meaning: policy appears required for current public renderer or public reference surface

  narrow_required:
    meaning: policy may be needed but should be constrained by release_state, active, system_scope, published, or equivalent columns

  hold_or_revoke_candidate:
    meaning: policy does not appear required for current launch and should be reviewed for removal or restriction

  requires_operator_review:
    meaning: policy may be intentional but authority is unclear

  protected_system_review:
    meaning: policy touches c3 system governance surfaces and must not be changed without seeded reference review

  legacy_or_deprecated:
    meaning: policy appears tied to old/deprecated surfaces
```

## 4. Identify public or anon write policies

Known policies from prior OAR1 that require review:

```yaml
public_or_anon_write_policies_requiring_future_review:
  - public_insert_codex_connect_capture
  - measures encounter history insert
  - measures encounter history update
  - measures_iis_eval_gate1_capture_public_insert
  - measures_publication_subscription_public_insert
  - public inserts measures registry seat holds
```

For each write policy, report:

```yaml
write_policy_review_fields:
  table:
  policyname:
  cmd:
  roles:
  with_check:
  public_write_surface:
  current_launch_required:
  required_form_or_capture_surface:
  abuse_risk:
  recommended_disposition:
  recommended_next_action:
```

Allowed recommended dispositions:

```yaml
write_policy_dispositions:
  keep_with_guardrails:
    meaning: public insert is required for a public capture form and has adequate with_check restrictions

  narrow_required:
    meaning: public write is required but needs stronger with_check or rate-limit/function boundary

  replace_with_edge_function:
    meaning: direct public write should be replaced by server-side controlled function

  hold_or_revoke_candidate:
    meaning: public write is not currently required

  requires_operator_review:
    meaning: unclear whether this write policy is intentionally active
```

## 5. Inspect columns for policy tables

For every table with broad public read or public write policy, inspect columns:

```sql
select
  table_schema,
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    '<table_1>',
    '<table_2>'
  )
order by table_name, ordinal_position;
```

Do not invent available narrowing columns.

Only recommend narrowing predicates if actual columns exist, such as:

```yaml
possible_safe_predicate_columns:
  - active
  - is_active
  - release_state
  - published
  - is_public
  - public_visible
  - system_scope
  - surface_key
  - encounter_key
  - status
```

## 6. Renderer-read requirement review

Inspect current renderer/source references without mutating:

```text
src/
docs/seat/measures_registry_isolated/
docs/seat/measures_registry/
docs/oar/measures_registry/
supabase/
```

Determine which public tables are actually required by current Measures Registry public runtime.

Report:

```yaml
renderer_read_requirements:
  table:
  required_by_renderer: true_or_false
  source_evidence:
    - path:
      reason:
  required_columns:
  safe_public_read_predicate_recommendation:
```

## 7. Output review report

Create:

```text
docs/seat/measures_registry_isolated/10_validation/supabase_public_policy_renderer_read_review_v1.meta.md
```

Report must include:

```yaml
report_sections:
  - standing
  - inspected_policy_count
  - broad_public_read_policy_count
  - public_or_anon_write_policy_count
  - table_column_review
  - renderer_read_requirement_review
  - policy_disposition_table
  - write_policy_disposition_table
  - unsafe_or_unclear_policies
  - policies_recommended_to_keep
  - policies_recommended_to_narrow
  - policies_recommended_to_hold_or_revoke
  - policies_recommended_for_edge_function_replacement
  - required_operator_decisions
  - next_safe_OAR2
```

## 8. No mutation boundary

Do not:

```text
drop policies
create policies
alter policies
enable or disable RLS
insert rows
update rows
delete rows
mutate runtime
mutate routes
mutate renderer
mutate public copy
activate launch
activate payment
claim standing
```

## VALIDATION RETURN

Return:

```yaml
validation_return:
  - OAR2 path
  - report path
  - public policy count
  - broad public read count
  - public or anon write count
  - renderer-required policies
  - policies recommended to keep
  - policies recommended to narrow
  - policies recommended to hold or revoke
  - policies recommended for edge function replacement
  - unresolved operator decisions
  - no DB mutation confirmation
  - no runtime mutation confirmation
  - no route mutation confirmation
  - no renderer mutation confirmation
  - no public copy mutation confirmation
  - OAR1 path
```

## OAR1 CLOSEOUT

Create OAR1:

```text
docs/seat/measures_registry_isolated/09_oar/oar1_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
```

OAR1 must report:

```yaml
required_oar1_evidence:
  - OAR2 path
  - report path
  - inspected policy count
  - inspected tables
  - broad public read policy count
  - public or anon write policy count
  - renderer-required public reads
  - policies recommended to keep
  - policies recommended to narrow
  - policies recommended to hold or revoke
  - policies recommended for edge function replacement
  - required operator decisions
  - no DB mutation confirmation
  - no runtime mutation confirmation
  - no route mutation confirmation
  - no renderer mutation confirmation
  - no public copy mutation confirmation
  - recommended next OAR2 title
```

## NEXT RECOMMENDED OAR2

```text
OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
```

## CLOSE

This OAR2 reviews public policy exposure and renderer read requirements only.

It does not change policy state.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody reviews and writes evidence.
