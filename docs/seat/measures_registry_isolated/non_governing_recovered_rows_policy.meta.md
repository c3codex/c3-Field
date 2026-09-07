---
document_type: non_governing_recovered_rows_policy
system: measures_registry
status: non_allowlisted_rows_non_governing_by_default
source_oar2: docs/seat/measures_registry/09_oar/oar2_create_measures_registry_current_runtime_allowlist_and_terminology_isolation_contract_v1.meta.md
---

# Non-Governing Recovered Rows Policy

policy:
  any_recovered_row_not_in_current_allowlist:
    standing: non_governing_by_default
    renderable: false
    callable_for_current_launch: false
    public_route_authority: false
    commerce_authority: false
    certification_authority: false
    conversion_authority: false
  preservation:
    old_rows_may_remain_as:
      - legacy_trace
      - held
      - archived_reference
      - operator_review
  mutation:
    required_for_db_change: future_exact_row_mutation_oar2

boundary:
  deletes_authorized: false
  renames_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false

