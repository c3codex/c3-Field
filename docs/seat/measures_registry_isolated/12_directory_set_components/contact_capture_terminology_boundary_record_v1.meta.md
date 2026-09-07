---
document_type: directory_set_requirement_record
record_key: contact_capture_terminology_boundary_record_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_assessment_and_leadership_contact_capture_records_and_email_sendout_rules_v1.meta.md
system_scope: measures_registry_isolated
mutation_authorized: false
---

# Contact Capture Terminology Boundary Record v1

```yaml
standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false

term_boundary:
  prohibited_for_current_contact_capture_email_surfaces:
    - contact_capture_contract
    - email_sendout_contract
    - paragraph_integration_contract
    - style_contract
    - surface_contract

  reserved_valid_use:
    smart_contract:
      meaning: blockchain or code-executed agreement only
      current_contact_capture_usage_allowed: false

  use_instead:
    contact_capture_record: submitted contact and consent data requirements
    email_sendout_rule: email behavior and copy
    integration_record: Paragraph, Buffer, or provider relationship
    style_profile: visual and layout styling
    surface_record: rendered surface requirements
    media_map: media placement and resolution
    validation_record: evidence and checks
    agreement: mutual understanding between named parties where applicable
    requirement: required launch or runtime condition

blocked_substitutions:
  - contact_capture_record_as_contract
  - email_sendout_rule_as_contract
  - leadership_request_as_payment
  - assessment_contact_capture_as_MAP_enrollment
  - leadership_contact_capture_as_SEAT
  - contact_consent_as_c3_Key_assignment
```

## Boundary

This record seats terminology requirements only. It does not rename runtime surfaces, edit public copy, mutate DB rows, or activate any capture or send path.
