# Process Seeding Audit v1

Generated: 2026-05-07T22:34:49.704Z

## Summary

- Bucket: measures-seed
- Bucket private: true
- Rows audited: 37
- Counts: {"stale_or_superseded":9,"committed_unseeded":27,"seeded":1}
- NotChazz flags: MIXED_PROCESS_STANDING, UNSEEDED_GOVERNING_REFERENCE

## Audit Rows

| Path | Standing | Governing status | Seed verification | Supersession | Reference count |
| --- | --- | --- | --- | --- | ---: |
| docs/_source/oar/session/session_5/process/correction_loop_rule.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/correction_loop_rule.meta.md | 0 |
| docs/_source/oar/session/session_5/process/doc_set_closeout_rule.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/doc_set_closeout_rule.meta.md | 0 |
| docs/_source/oar/session/session_5/process/doc_stack_constraints.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/doc_stack_constraints.meta.md | 0 |
| docs/_source/oar/session/session_5/process/post_transfer_prompt_rule.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/post_transfer_prompt_rule.meta.md | 0 |
| docs/_source/oar/session/session_5/process/session_5_process_set_index.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/session_5_process_set_index.meta.md | 0 |
| docs/_source/oar/session/session_5/process/thread_to_transfer_validation_rule.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/thread_to_transfer_validation_rule.meta.md | 0 |
| docs/_source/oar/session/session_5/process/trace_surfaces_rule.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/trace_surfaces_rule.meta.md | 0 |
| docs/_source/oar/session/session_5/process/transfer_surface_generalization_rule.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/transfer_surface_generalization_rule.meta.md | 0 |
| docs/_source/oar/session/session_5/process/validation_state_rule.meta.md | stale_or_superseded | non_governing_duplicate_or_source_copy | not_found_in_measures_seed | superseded_by docs/_source/process/validation_state_rule.meta.md | 0 |
| docs/_source/process/correction_loop_rule.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/db_preflight_checklist_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/doc_incorporation_state_model_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/doc_set_closeout_rule.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/doc_stack_constraints.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/frontend_encounter_alignment_contract.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/post_transfer_prompt_rule.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/process_pre_insert_registry_confirmation_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/process_scheduled_release_precheck_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/process_state_restoration_subset_update_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/seed_event_process_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/seeded_index_definition_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/seeded_reference_preflight_rule_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/seeded_status_definition_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/session_5_process_set_index.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/session_system_intelligence_capture_prompt_v1.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/thread_to_transfer_validation_rule.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/trace_surfaces_rule.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/transfer_surface_generalization_rule.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/_source/process/validation_state_rule.meta.md | committed_unseeded | source_reference_unseeded | not_found_in_measures_seed |  | 0 |
| docs/process/governance/relational_output_governance.meta.md | seeded | verified_seeded_reference | hash_verified |  | 0 |
| docs/process/oar/db_role_contract_supabase.meta.md | committed_unseeded | active_local_process_surface_unseeded | not_found_in_measures_seed |  | 0 |
| docs/process/oar/new-oar.ps1 | committed_unseeded | active_local_process_surface_unseeded | not_found_in_measures_seed |  | 0 |
| docs/process/oar/oar2_generation_and_handoff_process.meta.md | committed_unseeded | active_local_process_surface_unseeded | not_found_in_measures_seed |  | 0 |
| docs/process/oar/templates/oar1_template.meta.md | committed_unseeded | active_local_process_surface_unseeded | not_found_in_measures_seed |  | 0 |
| docs/process/oar/templates/oar2_template.meta.md | committed_unseeded | active_local_process_surface_unseeded | not_found_in_measures_seed |  | 0 |
| docs/process/oar_lifecycle.meta.md | committed_unseeded | active_local_process_surface_unseeded | not_found_in_measures_seed |  | 0 |
| docs/process/publication/new-publication-dispatch.ps1 | committed_unseeded | active_local_process_surface_unseeded | not_found_in_measures_seed |  | 0 |

