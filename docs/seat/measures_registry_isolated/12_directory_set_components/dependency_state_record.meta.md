---
document_type: directory_set_component_record
system_scope: measures_registry
component: dependency_state
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Dependency State Record

```yaml
dependency_state_record:
  status: component_seated
  component: dependency_state

  dependencies:
    Resend:
      required_for:
        - email_dispatch
      current_standing: partial
      next_required_evidence:
        - provider_key_confirmed_without_secret_exposure
        - sender_domain_confirmed
        - test_dispatch_or_provider_readiness_evidence

    Stripe:
      required_for:
        - payment_of_scope
      current_standing: partial
      next_required_evidence:
        - payment_provider_final_readiness
        - confirmation_trigger
        - webhook_or_manual_confirmation_boundary

    storage:
      required_for:
        - media_mappings
        - c3_7s_attachment
        - MAP_deliverable_delivery
      current_standing: partial
      next_required_evidence:
        - current_object_inventory_validation
        - poster_fallback_records
        - attachment_storage_boundary

    Paragraph:
      required_for:
        - unDrifted_publication_reference
      current_standing: partial
      next_required_evidence:
        - public_reference_boundary
        - no_publication_execution_unless_authorized

    Buffer:
      required_for:
        - social_scheduling_if_used
      current_standing: held
      next_required_evidence:
        - Buffer_execution_standing
        - no_social_posting_without_authorization

    survey_provider:
      required_for:
        - survey_intake
      current_standing: partial
      next_required_evidence:
        - provider_or_native_surface_decision
        - intake_trace_boundary
```
