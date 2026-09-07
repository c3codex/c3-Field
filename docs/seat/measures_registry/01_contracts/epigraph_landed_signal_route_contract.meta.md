---
document_type: route_contract_review
contract_key: epigraph_landed_signal_route_contract
status: bounded_from_source_oar2
verification_state: pending_live_revalidation
---

# Epigraph Landed-Signal Route Contract

Epigraph is landed-signal routing behavior, not a standalone runtime or authority surface.

- Input: seated `landing_signal` from a landing surface.
- Output: route to the current valid encounter resolved by registry state.
- Prohibited: hardcoded encounter choice, fallback authority, registration implication, or chamber ownership of signal truth.
- Absence behavior: expose missing route state; do not invent a destination.

Source: package OAR2. No route or frontend behavior was changed during packaging.
