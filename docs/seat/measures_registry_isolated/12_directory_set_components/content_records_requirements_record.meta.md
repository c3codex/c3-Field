---
document_type: directory_set_component_record
system_scope: measures_registry
component: content_records
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Content Records Requirements Record

```yaml
content_records_requirements_record:
  status: component_seated
  component: content_records

  required_content_records:
    assessment_CAR_copy:
      standing: seated

    question_copy:
      standing: seated_pending_exact_runtime_match

    answer_copy:
      standing: seated_pending_exact_runtime_match

    contact_consent_copy:
      standing: partial
      needs:
        - contact_scope_copy
        - opt_out_or_revocation_boundary_copy

    Findings_Preparation_copy:
      standing: partial
      needs:
        - top_3_risk_factor_display_copy
        - current_environment_state_copy

    Review_Determination_copy:
      standing: partial
      needs:
        - pre_deploy_copy
        - remediation_copy
        - optimization_copy
        - large_federated_modifier_copy_if_displayed

    MAP_encounter_copy:
      standing: partial
      needs:
        - scope_copy
        - delivery_copy
        - payment_of_scope_copy
        - held_authority_suppression_copy

    payment_confirmation_copy:
      standing: missing

    survey_CAR_copy:
      standing: seated

    email_copy:
      standing: partial
      needs:
        - assessment_delivery_email
        - payment_confirmation_email
        - c3_7s_attachment_email
        - survey_login_email
        - MAP_deliverable_email
```
