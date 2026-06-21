---
document_type: current_db_candidate_allowlist
system: measures_registry
status: candidate_rows_documented_mutation_held
source_oar2: docs/seat/measures_registry/09_oar/oar2_create_measures_registry_current_runtime_allowlist_and_terminology_isolation_contract_v1.meta.md
db_mutation: false
---

# Current DB Candidate Allowlist

candidate_db_rows:
  registry_rows:
    - measures_registry_runtime
    - lapis_directory
    - obsidian_directory
    - crystal_directory
  reconcile_or_hold_rows:
    - marble_directory
    - epigraph
    - map_integrity_governance
    - cohort_conversion_encounter
    - reserve_seat
    - systems_offering
    - foundation_offering
    - structural_drift_publication
  encounter_rows:
    - structure_passage
    - eval_passage
    - structured_eval
    - phase_payment
    - marble_pathway_reveal
    - measures_phases_reveal
    - epigraph_view
    - crystal_chamber
  commerce_rows:
    - map_contract_pre_deployment
    - map_contract_optimization
    - map_contract_remediation
  publication_rows:
    - structural_drift
    - undrifted
    - agents_of_chaos_dispatch_v1
    - structural_drift_dispatch_v1

default_for_all_other_rows:
  standing: non_governing_by_default
  future_review_required: true

boundary:
  candidate_is_not_mutation_authority: true
  exact_row_mutation_oar2_required: true

