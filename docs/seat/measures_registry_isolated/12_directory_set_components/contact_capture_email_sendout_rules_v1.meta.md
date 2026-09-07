---
document_type: directory_set_requirement_record
record_key: contact_capture_email_sendout_rules_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_assessment_and_leadership_contact_capture_records_and_email_sendout_rules_v1.meta.md
system_scope: measures_registry_isolated
email_send_authorized_now: false
resend_mutation_authorized: false
runtime_mutation_authorized: false
database_mutation_authorized: false
---

# Contact Capture Email Sendout Rules v1

```yaml
standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  email_send_authorized_now: false
  resend_mutation_authorized: false
  runtime_mutation_authorized: false
  db_mutation_authorized: false

provider_candidate:
  provider: Resend
  from_address: connect@measuresregistry.com
  reply_to_rule: submitted_contact_email_when_available
  future_endpoint_required: true
  send_requires_future_oar2_or_runtime_activation_oar: true

assessment_contact_email:
  trigger: assessment_contact_capture_submitted_and_email_confirmation_pending_or_confirmed
  recipient: submitted_contact_email
  subject: "Your AI Environment Assessment Review is being prepared"
  body_text: |
    Hello,

    Thank you for completing the AI Operations Assessment.

    Your AI Environment Assessment Review is being prepared. Your submitted responses will be reviewed to identify operational, system, and environmental risk factors in your current AI operations context.

    This assessment does not diagnose AI behavior. It provides a reviewed intake basis for an AI Operations Assessment recommendation.

    You will receive your personalized assessment review after your email confirmation is complete.

    Measures Registry
  must_not_claim:
    - AI diagnosis
    - payment
    - MAP enrollment
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - certification

leadership_contact_email:
  trigger: leadership_contact_capture_submitted
  recipient: submitted_contact_email
  subject: "Measures Registry received your leadership request"
  body_text: |
    Hello,

    Thank you for reaching out to Measures Registry.

    We received your leadership request from the unDrifted surface. Measures Registry will review your message and follow up regarding leadership alignment, AI environment review, or related institutional fit.

    This request does not create payment, MAP enrollment, SEAT, SEAL, Registry Standing, c3 Key assignment, DAO participation, or certification.

    Measures Registry
  must_not_claim:
    - payment
    - MAP enrollment
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - certification

operator_notification_email:
  trigger:
    - assessment_contact_capture_submitted
    - leadership_contact_capture_submitted
  recipient: connect@measuresregistry.com
  subject: "New Measures Registry contact capture"
  body_fields:
    - capture_type
    - name
    - email
    - organization_or_institution
    - role_or_title
    - source_surface
    - timestamp
    - consent_state
    - assessment_result_or_recommended_path_if_assessment
    - risk_factors_if_assessment
    - message_or_reason_for_contact_if_leadership
    - article_context_if_available
    - trace_id_if_available
  tone: internal_functional

email_send_boundary:
  no_email_send_now: true
  no_resend_write_now: true
  no_template_deploy_now: true
  future_activation_requires:
    - endpoint_or_edge_function_confirmed
    - sender_domain_confirmed
    - public_insert_or_submission_path_seated
    - OAR2_authorizing_send_behavior
    - OAR1_returning_send_evidence
```

## Boundary

This record seats email sendout rules only. No email is sent, no Resend state is changed, and no template or endpoint is deployed.
