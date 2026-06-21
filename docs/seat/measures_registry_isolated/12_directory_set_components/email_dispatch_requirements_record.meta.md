---
document_type: directory_set_component_record
system_scope: measures_registry
component: email_dispatch
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Email Dispatch Requirements Record

```yaml
email_dispatch_requirements_record:
  status: component_seated
  component: email_dispatch

  email_dispatch:
    standing: required_launch_function
    authority: Codex_DB_when_registered
    function:
      - sends_assessment_delivery_email
      - sends_payment_confirmation_email
      - sends_c3_7s_attachment
      - sends_survey_login
      - sends_MAP_deliverable_delivery
      - records_delivery_trace

  required_dispatches:
    assessment_delivery_dispatch:
      trigger: assessment_completed_and_contact_confirmed
      requires_contact_scope: assessment_delivery
      template_required: true

    payment_confirmation_dispatch:
      trigger: payment_of_scope_confirmed
      requires_contact_scope: MAP_transactional_notice
      template_required: true

    c3_7s_attachment_dispatch:
      trigger: payment_of_scope_confirmed
      requires_contact_scope: MAP_transactional_notice
      attachment_required: true

    survey_login_dispatch:
      trigger: payment_of_scope_confirmed
      requires_contact_scope: MAP_transactional_notice
      template_required: true

    MAP_deliverable_dispatch:
      trigger: MAP_review_completed_and_deliverable_ready
      requires_contact_scope: MAP_deliverable_delivery
      template_required: true

  dispatch_delivery_trace:
    required: true
    fields:
      - dispatch_key
      - contact_scope
      - template_key
      - trigger_event
      - delivery_status
      - provider_response
      - created_at

  does_not_equal:
    - MRM
    - CRM
    - relationship_management
    - blanket_follow_up_authority
```
