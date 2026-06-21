---
document_type: encounter_transition_review
transition_key: landing_signal_to_encounter
status: bounded_from_source_oar2
verification_state: pending_live_revalidation
---

# Landing Signal to Encounter

1. A landing surface emits `landing_signal`.
2. Epigraph interprets the signal as routing behavior.
3. Measures resolves the current valid encounter from seated registry state.
4. src renders the resolved encounter.

No step may hardcode a destination, infer missing registry state, or imply SEAT registration. Current live binding is pending revalidation outside this packaging-only OAR2.
