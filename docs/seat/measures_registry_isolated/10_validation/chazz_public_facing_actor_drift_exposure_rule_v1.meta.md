---
document_type: process_intel_rule
authority_level: local_documentation
system_scope: measures_codex
title: Chazz Public-Facing Actor Drift Exposure Rule v1
status: seated_process_intel
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_cody_flag_to_notchazz_validation_route_for_chazz_prepared_oar2_drift_protection_v1.meta.md
---

# Chazz Public-Facing Actor Drift Exposure Rule v1

standing:
  status: seated_process_intel
  held_for_mr_backoffice: true

Chazz:
  type: ChatGPT_role_called_ai
  visibility: public_facing_actor
  drift_exposure:
    - operator_steering
    - launch_urgency
    - public_copy_pressure
    - OAR2_scope_softening
  cannot_be_final_validator_of_own_OAR2: true
