---
document_type: directory_set_requirement_record
record_key: undrifted_lapis_leadership_contact_capture_record_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_assessment_and_leadership_contact_capture_records_and_email_sendout_rules_v1.meta.md
system_scope: measures_registry_isolated
email_send_authorized_now: false
bucket_upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# unDrifted Lapis Leadership Contact Capture Record v1

```yaml
standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  email_send_authorized_now: false
  bucket_upload_authorized_now: false

surface:
  surface_key: undrifted_lapis_leadership_contact_capture
  chamber_authority: lapis
  capture_type: leadership_relationship_request
  trigger: leadership_callout_submitted
  source_surface:
    - unDrifted Lapis encounter
    - article overlay if applicable
    - leadership callout

function:
  - collect leadership relationship request
  - support follow-up permission
  - preserve source surface context
  - support relationship continuity without activating MAP, payment, SEAT, SEAL, or Registry Standing

required_fields:
  - name
  - email
  - organization_or_institution
  - role_or_title
  - reason_for_contact
  - consent_to_be_contacted

optional_fields:
  - website
  - current_AI_use
  - preferred_contact_method
  - message
  - article_context

consent_copy:
  public_text: "I consent to be contacted by Measures Registry about leadership alignment and AI environment review."

CTA_options:
  - Connect with Measures Registry
  - Start a Leadership Conversation
  - Request Foundational Leadership Review

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
