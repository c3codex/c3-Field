---
document_type: drift_flags_index
system: measures_registry
status: drift_flags_indexed
source_oar1: docs/seat/measures_registry/09_oar/oar1_recover_and_isolate_current_measures_registry_db_and_docs_standing_v1.meta.md
---

# Drift Flags Index

Drift flags are conflicts or ambiguity surfaces that must not govern until reconciled.

## Drift / Conflict Flags

- active map_commerce_contracts conflict with inactive payment/MAP standing
- released/callable cohort_conversion_encounter conflicts with held conversion
- released/callable reserve_seat/offering/MAP rows imply activation not granted
- epigraph typed as encounter conflicts with current landing/epigraph distinction
- marble_directory released while package holds Marble activation
- structural_drift_publication released/callable while no longer governing public structure
- active media campaign keys are media organization evidence, not campaign activation
- Crystal_Seat appears inside chamber-content structures in working traces
- public DB mixes Measures Registry, Inanna, publication, commerce, and legacy surfaces without isolated ownership read model

## Boundary

Drift flags are not mutations.

They require future operator decision and separately authorized OAR2 before correction.
