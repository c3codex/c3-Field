---
document_type: payment_boundary_contract
system: measures_registry
status: documentation_seated_payment_held
source_oar2: docs/seat/measures_registry/09_oar/oar2_recover_and_seat_measures_registry_post_assessment_circuit_docs_v1.meta.md
---

# Payment Boundary Contract

Payment is the governed commerce threshold for MAP access. After confirmed payment, the circuit may become eligible for MAP onboarding and scheduling through separately seated authority.

Payment does not equal registration or certification. It does not assign a c3 Key, grant Field access, activate SEAT, or activate Crystal Seat.

The following recovered DB surfaces remain held conflicts pending an exact-row mutation OAR:

- `map_commerce_contracts` active rows;
- `measures_encounter_def.phase_payment`;
- `measures_registry.reserve_seat`;
- `measures_registry.systems_offering`;
- `measures_registry.foundation_offering`.

This contract creates no transaction or payment capability.
