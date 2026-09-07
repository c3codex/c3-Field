---
document_type: exact_row_reconciliation_blockers
system: measures_registry
status: blockers_indexed_mutation_held
source_oar2: docs/seat/measures_registry/09_oar/oar2_verify_privileged_evidence_for_measures_registry_exact_row_db_reconciliation_v1.meta.md
db_mutation: false
---

# Exact-Row Reconciliation Blockers

## Rows Without Exact Primary-Key Evidence

- `measures_publication_subscription_capture`: zero rows under privileged and anonymous reads; no row exists to reconcile.

## Rows Hidden By RLS Or Anonymous Access

The 29 privileged-only indexed rows are all inactive `measures_media_map` rows. Exact IDs:

| row key | primary key |
| --- | --- |
| measures_registry_landing | 3edd37a5-e06c-4321-8675-a994e176dffb |
| measures_registry_landing | a2f3fd83-5384-4201-8f14-0cca987c1ef8 |
| measures_registry_landing | 5e4053a6-471a-4cf5-9564-31a14100bad2 |
| measures_registry_publication | 61ec389f-9baf-4720-adda-2ebca5c36b7b |
| landing_path_choice | 6f584d0e-4832-4f23-87ba-3732adc63c29 |
| measures_registry_landing | 688a1163-9237-4535-9ce2-f2cf14490e09 |
| measures_registry_landing | 45b24e90-df0c-49f8-bd91-7b85f2ad967d |
| landing_intro_video | 1d78c181-7f1f-4651-83d2-9f5836790233 |
| measures_registry_glyphs | 55056c68-1a4b-441a-a0a5-8eda1367c999 |
| measures_registry_glyphs | 328ac591-8457-4b8a-a2d1-29478a0ca31d |
| measures_registry_glyphs | 2ed93c29-4cc2-4790-a95e-bf5853d319a1 |
| measures_registry_glyphs | 986aa85e-24d0-432b-9e95-92284397f7b6 |
| measures_registry_glyphs | f8c4be22-7492-4c6c-bd3e-d14f0bf26188 |
| measures_registry_glyphs | 959f5623-63e7-45c4-bbd1-8eedb9a28171 |
| measures_registry_glyphs | 2ced6513-4b80-435e-8fc5-f71e6575c3ec |
| measures_registry_glyphs | 32e9768b-8635-4218-92eb-6acd25dd5e51 |
| measures_registry_glyphs | 3851e678-9cfa-4280-81bf-000d1a0b678e |
| measures_registry_glyphs | 485bbb64-b462-4aa9-9ad2-61914f2f60bc |
| measures_registry_glyphs | 51e37204-a5ba-409f-974e-eb4ce457a725 |
| measures_registry_glyphs | b8cfa012-7659-4b48-9254-75460243a812 |
| measures_registry_glyphs | 06138308-57b4-4091-81e5-37f935eb4600 |
| measures_registry_glyphs | efe2d929-3ca3-4dbb-a5d9-0fd2882e663d |
| measures_registry_glyphs | 05a6d54f-e062-4556-b80a-20b30da58ee6 |
| measures_registry_glyphs | ab5b0a72-c8c6-4ba1-9bbc-26c76a4ba002 |
| measures_registry_glyphs | 7fea3e17-a254-43a2-ba05-831933a22c89 |
| measures_registry_glyphs | 1fd95d52-78d8-4554-9189-c5c198ab95e1 |
| measures_registry_glyphs | 49f1a108-2ed6-4699-8301-ef23f5b8d64e |
| measures_registry_glyphs | 5e0ba1e8-1654-416b-805f-8b254d67e62d |
| measures_registry_glyphs | ea7f4ce0-89ea-4218-a5d5-617da3048257 |

Table-level privileged-only counts also include 9 `measures_registry` rows and 12 `measures_encounter_def` rows outside the exact target set.

## Rows With Unclear Ownership

- All media rows whose metadata does not explicitly identify an owner.
- All design tokens without explicit owner metadata.
- `obsidian_directory`, `marble_directory`, `epigraph`, and `epigraph_view` because their metadata preserves Inanna/shared-system standing.

## Rows That May Belong To Inanna Or Shared c3 Systems

- `measures_registry.obsidian_directory`
- `measures_registry.marble_directory`
- `measures_registry.epigraph`
- `measures_encounter_def.epigraph_view`

## Rows Whose Current Release State Conflicts With Docs

- `marble_directory`, `map_integrity_governance`, `cohort_conversion_encounter`, `reserve_seat`, `systems_offering`, and `foundation_offering` conflict with held package activation.
- All three `map_commerce_contracts` rows are active while payment and MAP activation remain held.
- `phase_payment` is active while payment activation remains held.
- Published publication and dispatch rows require explicit preservation or rollback treatment.

## Rows Whose Mutation Would Affect Public Runtime

All released, published, active, callable, visible, or active-mapping entries in the evidence index require public-impact review. This includes the named registry rows, eight encounter rows, two publication rows, two dispatch rows, three commerce rows, active media mappings, and active design tokens.

## Rows Requiring Operator Decision Before Mutation

All 140 existing indexed rows are `operator_review`. No row is marked `ready_for_future_mutation_oar: true`.

## Rows Requiring Rollback Plan Before Mutation

Every existing indexed row requires before/after evidence and rollback instructions. Privileged-only rows also require privileged and anonymous post-change readback to detect unintended access changes.

## Hold

No reconciliation or mutation OAR should execute until operator disposition, ownership, public-impact, and rollback-plan blockers are closed.
