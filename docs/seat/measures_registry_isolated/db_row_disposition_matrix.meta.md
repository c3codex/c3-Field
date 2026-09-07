---
document_type: db_row_disposition_matrix
system: measures_registry
status: disposition_matrix_created_review_only
source_oar1: docs/seat/measures_registry/09_oar/oar1_recover_and_isolate_current_measures_registry_db_and_docs_standing_v1.meta.md
---

# DB Row Disposition Matrix

## Allowed Disposition States

- keep_current
- candidate
- hold
- legacy_trace
- conflict
- operator_review

No row is launch_active.

No row is mutated.

## Matrix

| db_area | row_key_or_surface | live_state | recovered_issue | recommended_disposition | reason | requires_operator_decision | future_oar_required |
| --- | --- | --- | --- | --- | --- | --- | --- |
| measures_registry | measures_registry_runtime | released/callable/active | current runtime candidate but mixed DB ownership unresolved | candidate | may inform future launch only after isolation | true | true |
| measures_registry | landing_intro_video | released/callable/active | landing media exists but final launch hook changed | operator_review | needs final media selection | true | true |
| measures_registry | lapis_directory | released/visible/active | likely valid relational context but requires issue/encounter distinction | candidate | Lapis context may be needed | true | true |
| measures_registry | obsidian_directory | held/visible/active | assessment chamber relation needs reconciliation | hold | held release-state conflict must be checked | true | true |
| measures_registry | marble_directory | released/visible/active | package holds Marble activation | conflict | released state contradicts held package standing | true | true |
| measures_registry | crystal_directory | held/visible/active | Crystal Seat is final confirmation, not encounter | hold | needs final standing contract | true | true |
| measures_registry | epigraph | released/encounterable/typed_as_encounter | conflicts with current landing/Epigraph distinction | conflict | Epigraph should not force direct landing route | true | true |
| measures_encounter_def | epigraph_view | active encounter definition | typed as encounter/runtime view | conflict | must be reconciled against current architecture | true | true |
| measures_registry | map_integrity_governance | released/callable/active | MAP standing conflicts with held activation | conflict | may imply MAP activation | true | true |
| measures_registry | cohort_conversion_encounter | released/callable/active | conflicts with held conversion | conflict | conversion held | true | true |
| measures_registry | reserve_seat | released/callable/active | may imply SEAT/payment path | conflict | SEAT held | true | true |
| measures_registry | seat_hold_notification_review | released/gated/active | SEAT-labelled held review | hold | review only until seated | true | true |
| measures_registry | systems_offering | released/callable/active | may imply offering/payment activation | conflict | governed commerce held | true | true |
| measures_registry | foundation_offering | released/callable/active | may imply offering/payment activation | conflict | governed commerce held | true | true |
| measures_registry | structural_drift_publication | released/callable/active | old governing public structure | legacy_trace | retain history, not current structure | true | true |
| measures_publication_registry | structural_drift | published | prior publication standing | legacy_trace | may remain historical | true | true |
| measures_publication_registry | undrifted | published | unDrifted selected but issue standing unresolved | candidate | can support Issue 01 after operator decision | true | true |
| measures_publication_dispatch | published dispatch rows | published | dispatch exists, current campaign not active | operator_review | needs social/publication contract reconciliation | true | true |
| map_commerce_contracts | active rows | release_state=active | conflicts with inactive payment/MAP standing | conflict | payment/MAP held by package | true | true |
| measures_media_map | active mappings | 30 active mappings | media organization evidence, not campaign activation | candidate | use only after placement review | true | true |
| measures_design_token | active tokens | 52 active tokens | possible valid style/runtime token set | candidate | placement and ownership review needed | true | true |
| measures_publication_subscription_capture | capture rows | 0 rows | no runtime evidence | hold | contact/MRM lifecycle incomplete | true | true |
| measures_encounter_def | crystal_chamber | active encounter | chamber encounter exists; not Crystal Seat evidence | operator_review | must distinguish from Crystal Seat | true | true |
| measures_encounter_def | eval_passage | active encounter | may support assessment transition | candidate | route reconciliation required | true | true |
| measures_encounter_def | structured_eval | active encounter | assessment surface candidate | candidate | needs current assessment contract check | true | true |
| measures_encounter_def | structure_passage | active encounter | may be legacy passage naming | operator_review | needs Lapis-to-Obsidian text explainer decision | true | true |
| measures_encounter_def | phase_payment | active encounter | implies payment route | conflict | payment held | true | true |
| measures_encounter_def | marble_pathway_reveal | active encounter | legacy alias risk | legacy_trace | current MAP naming differs | true | true |
| measures_encounter_def | measures_phases_reveal | active encounter | old phased reveal risk | operator_review | needs current circuit reconciliation | true | true |

## Boundary

This matrix is disposition planning only.

No DB row is changed by this document.
