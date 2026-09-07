---
document_type: directory_set_requirement_record
record_key: assessment_contact_capture_record_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_assessment_and_leadership_contact_capture_records_and_email_sendout_rules_v1.meta.md
system_scope: measures_registry_isolated
email_send_authorized_now: false
bucket_upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# Assessment Contact Capture Record v1

```yaml
standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  email_send_authorized_now: false
  bucket_upload_authorized_now: false

surface:
  surface_key: assessment_contact_capture
  chamber_authority: obsidian
  capture_type: assessment_result_delivery_permission
  trigger: AI Operations Assessment completed
  source_surface:
    - AI Operations Assessment
    - passage page
    - contact entry surface

function:
  - collect contact permission
  - support personalized assessment review delivery
  - support SRC1/OAR1 trace creation
  - support assessment risk factor carrythrough
  - support recommended MAP path continuity

required_fields:
  - name
  - email
  - organization_or_institution
  - role_or_title
  - organization_scope
  - consent_to_receive_assessment_review

optional_fields:
  - website
  - phone
  - preferred_contact_method
  - message

assessment_context_fields:
  - assessment_completion_state
  - AI_Deployment_Status
  - top_risk_factors
  - recommended_MAP_path
  - review_determination
  - passage_state
  - email_confirmation_state

consent_copy:
  public_text: "I consent to be contacted by Measures Registry about my AI Operations Assessment review."

public_status_copy:
  after_submit: "Your AI Environment Assessment Review is being prepared. Email confirmation is required for personalized report delivery."

does_not_create:
  - payment
  - MAP enrollment
  - SEAT
  - SEAL
  - Registry Standing
  - c3 Key
  - DAO participation
  - Branch standing
  - certification

future_DB_or_endpoint_requirement:
  preferred_path: edge_function_or_guarded_insert
  public_read_allowed: false
  public_insert_guarded: true
  consent_required: true
  email_required: true
  server_timestamp_required: true
  db_mutation_requires_future_oar2: true
```

## Boundary

This record does not create a table, endpoint, email send, runtime submission path, route, renderer behavior, public copy, or bucket upload.
