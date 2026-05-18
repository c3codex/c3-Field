---
document_type: candidate_manifest
authority_level: review
document_scope: source_authority
title: Source Authority Candidate Manifest
status: assembled
version: v1
operator: op044
date: 2026-05-17
source_oar2: docs/oar/source_authority/oar2_source_authority_candidate_folder_assembly_v1.meta.md
source_classification: docs/oar/source_authority/oar1_source_reference_classification_pass_v1.meta.md
tags:
  - source-authority
  - candidate-folder
  - source-review
  - ambiguity-cleanup
---

# Source Authority Candidate Manifest

## Boundary

This folder is a review surface only.

Copy does not equal authority.

Candidate does not equal seated.

Review folder does not equal Codex.

No row is upgraded to `codex_seated`.

## Candidates

| candidate_key | candidate_filename | original_path | source_family | authority_scope | governance_function | standing | risk_level | ambiguity_group | codex_candidate | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| seed_concordance | seed_concordance.meta.md | docs/_source/seed/seed_concordance.meta.md | semantic_concordance | semantic | defines_language | written | high | semantic_foundation | yes | Source body copy for review; authority state unresolved. |
| source_21_of_coherence_v1 | source_21_of_coherence_v1.meta.md | docs/_source/seed/source_21_of_coherence_v1.meta.md | semantic_concordance | semantic | defines_language | written | high | semantic_foundation | yes | Source body copy for review; lineage requires verification. |
| seed_concordance_governance_usage_and_change_control_v1 | seed_concordance_governance_usage_and_change_control_v1.meta.md | docs/concordance/seed_concordance_governance_usage_and_change_control_v1.meta.md | process_rule | process | defines_process | written | high | semantic_foundation | yes | Governance boundary candidate for Seed Concordance use. |
| seeded_reference_control | seeded_reference_control.md | docs/_source/working/Chazz_sources/seeded_reference_control.md | seed_constraints | process | defines_process | written | high | seeded_reference_control | yes | Preserves seeded vs Codex-seated distinction for review. |
| oar_lifecycle_execution_and_handoff | oar_lifecycle_execution_and_handoff.meta.md | docs/process/oar_lifecycle.meta.md | oar_lifecycle | process | defines_process | seeded | high | oar_lifecycle | yes | Copied under normalized candidate filename. |
| seed_qualification_rules | seed_qualification_rules.meta.md | docs/process/governance/seed_qualification_rules.meta.md | process_rule | process | defines_validation | written | high | seeded_reference_control | yes | Candidate for seeded qualification boundary review. |
| relational_output_governance | relational_output_governance.meta.md | docs/process/governance/relational_output_governance.meta.md | process_rule | process | defines_process | written | medium | process_governance | yes | Candidate for AI-output authority boundary review. |
| db_role_contract_supabase | db_role_contract_supabase.meta.md | docs/process/oar/db_role_contract_supabase.meta.md | role_contract | role | defines_role_boundary | written | medium | role_boundary | yes | Candidate role boundary for DB operations review. |
| oar2_generation_and_handoff_process | oar2_generation_and_handoff_process.meta.md | docs/process/oar/oar2_generation_and_handoff_process.meta.md | process_rule | process | defines_process | written | medium | oar_lifecycle | yes | Ambiguous with OAR lifecycle; requires operator review. |
| c3field_online_infrastructure_activation_v1 | c3field_online_infrastructure_activation_v1.meta.md | docs/oar/c3_field_convergence/oar1_c3field_online_infrastructure_activation_v1.meta.md | implementation_manifest | infrastructure | defines_manifest | active_reference | critical | oar_spine | yes | Active reference copy; active does not mean Codex-seated. |
| foundational_role_registration_v1 | foundational_role_registration_v1.meta.md | docs/oar/c3_field_convergence/oar1_foundational_role_registration_v1.meta.md | role_contract | role | defines_role_boundary | active_reference | critical | oar_spine | yes | Active process reference copy; authority state unresolved. |
| phase_1_oar_operations_spine_v1 | phase_1_oar_operations_spine_v1.meta.md | docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md | process_rule | process | defines_process | seeded | critical | oar_spine | yes | Seeded reference copy; seeded does not mean Codex-seated. |
| phase_1_operational_spine_validation_refinement_v1 | phase_1_operational_spine_validation_refinement_v1.meta.md | docs/oar/c3_field_convergence/oar1_phase_1_operational_spine_validation_refinement_v1.meta.md | verification_checklist | verification | defines_validation | seeded | critical | oar_spine | yes | Seeded validation candidate for review. |
| c3_oar_spine_persistence_registry_convergence_v1 | c3_oar_spine_persistence_registry_convergence_v1.meta.md | docs/oar/c3_field_convergence/oar2_phase_2_oar_spine_persistence_registry_convergence_v1.meta.md | migration_architecture | migration | defines_migration | written | critical | oar_spine | yes | Existing c3_oar table architecture candidate. |
| media_authority_governance_process_seed | media_authority_governance_process_seed.meta.md | docs/process/media/media_authority_governance_process_seed.meta.md | process_rule | media | defines_media_authority | written | high | media_authority | yes | Part of media governance ambiguity group. |
| institutional_media_bucket_governance_process | institutional_media_bucket_governance_process.meta.md | docs/process/media/institutional_media_bucket_governance_process.meta.md | process_rule | media | defines_media_authority | written | high | media_authority | yes | Part of media governance ambiguity group. |
| conversion_engine_media_authority_seed | conversion_engine_media_authority_seed.meta.md | docs/process/media/conversion_engine_media_authority_seed.meta.md | process_rule | media | defines_media_authority | written | high | media_authority | yes | Part of media governance ambiguity group. |
| database_src_manifest | database_src_manifest.meta.md | docs/_source/session_24/database_src_manifest.meta.md | implementation_manifest | migration | defines_manifest | written | critical | database_manifest | yes | DB surface manifest candidate; authority state unresolved. |
| database_render_contract_manifest | database_render_contract_manifest.meta.md | docs/_source/session_25/manifests/database_render_contract_manifest.meta.md | implementation_manifest | runtime | defines_runtime_contract | written | critical | renderer_contract | yes | Ambiguous with renderer contract seed. |
| frontend_renderer_obedience_manifest | frontend_renderer_obedience_manifest.meta.md | docs/_source/session_25/frontend_renderer_obedience_manifest.meta.md | frontend_contract | frontend | defines_runtime_contract | written | critical | frontend_encounter_contract | yes | Frontend obeys authority; does not create authority. |
| chamberplate_contract_manifest | chamberplate_contract_manifest.meta.md | docs/_source/manifests/chamberplate_contract_manifest.meta.md | encounter_contract | encounter | defines_runtime_contract | written | critical | encounter_contract | yes | Encounter contract candidate for review. |
| renderer_contract_seed_v1 | renderer_contract_seed_v1.meta.md | docs/_source/working/intel_recovery/renderer_contract_seed_v1.meta.md | runtime_validation | runtime | defines_runtime_contract | written | critical | renderer_contract | yes | Ambiguous with database render contract manifest. |
| encounter_behavior_resolution_rule_v1 | encounter_behavior_resolution_rule_v1.meta.md | docs/_source/working/intel_recovery/encounter_behavior_resolution_rule_v1.meta.md | runtime_validation | encounter | defines_runtime_contract | written | critical | encounter_contract | yes | Runtime behavior candidate tied to encounter resolution. |
| frontend_encounter_contract_condensed | frontend_encounter_contract_condensed.meta.md | docs/_source/session_21/process/frontend_encounter_coherence/frontend_encounter_contract_condensed.meta.md | frontend_contract | frontend | defines_runtime_contract | written | critical | frontend_encounter_contract | yes | Ambiguous with session 21 companion rules. |
| measures_seed_phase_map_registry_definition | measures_seed_phase_map_registry_definition.md | docs/_source/seed/measures_seed_phase_map_registry_definition.md | source_set | runtime | defines_release_or_access | written | critical | phase_map_definition | yes | Ambiguous with field definition phase map. |
| field_definition_phase_map_v2 | field_definition_phase_map_v2.meta.md | docs/_source/field/field_definition_phase_map_v2.meta.md | source_set | semantic | defines_language | written | high | phase_map_definition | yes | Ambiguous with Measures phase map registry definition. |
| registry_release_states_v1 | registry_release_states_v1.meta.md | docs/_source/registry/registry_release_states_v1.meta.md | runtime_validation | runtime | defines_release_or_access | written | critical | release_access | yes | Runtime release/access candidate. |
| registry_encounter_mapping_v1 | registry_encounter_mapping_v1.meta.md | docs/_source/registry/registry_encounter_mapping_v1.meta.md | encounter_contract | encounter | defines_runtime_contract | written | critical | encounter_contract | yes | Registry-to-encounter mapping candidate. |
| registered_process_log_runtime_v1 | registered_process_log_runtime_v1.md | docs/oar/measures_registry/registered_process_log_runtime_v1.md | runtime_validation | runtime | records_execution | written | critical | process_runtime | yes | Process log runtime candidate. |
| seat_hold_notification_provider_integration_v1 | seat_hold_notification_provider_integration_v1.meta.md | docs/oar/measures_registry/oar2_seat_hold_notification_provider_integration_v1.meta.md | runtime_validation | runtime | defines_runtime_contract | written | critical | notification_runtime | yes | Notification provider integration candidate. |

## Excluded Draft Non-Candidates

| reference_key | original_path | standing | codex_candidate | notes |
|---|---|---|---|---|
| tree_concordance_extension_proposal_v1 | docs/c3_field/seed_extensions/tree_concordance_extension_proposal_v1.meta.md | draft | no | Preserved outside candidate folder until validation and authority scope are explicit. |
| tree_relational_schema_direction_v1 | docs/c3_field/schema/tree_relational_schema_direction_v1.meta.md | draft | no | Preserved outside candidate folder until TREE semantics are validated. |

## Ambiguity Groups

- renderer_contract
- frontend_encounter_contract
- phase_map_definition
- media_authority
- oar_lifecycle
- oar_spine
- encounter_contract
- release_access
- notification_runtime
- process_runtime

