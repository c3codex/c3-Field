---
document_type: directory_set_component_record
system_scope: measures_registry
component: payment_of_scope
status: held_with_explicit_boundary
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Payment Of Scope Hold Boundary

```yaml
payment_of_scope_hold_boundary:
  status: held_with_explicit_boundary
  component: payment_of_scope

  standing:
    payment_activation: false
    provider_final_readiness: pending
    confirmation_trigger: pending
    directory_set_can_continue: true

  required_before_activation:
    - payment_amount_or_class_confirmed
    - payment_provider_confirmed
    - confirmation_trigger_confirmed
    - payment_confirmation_dispatch_template_confirmed
    - OAR2_authorizes_payment_activation
    - OAR1_records_payment_activation
    - DB_readback_confirms_payment_state_if_DB_is_used

  does_not_create:
    - SEAT
    - SEAL
    - Registry Standing
    - Branch
    - c3 Key
    - DAO participation
    - certification
```
