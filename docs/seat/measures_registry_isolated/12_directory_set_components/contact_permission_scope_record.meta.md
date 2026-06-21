---
document_type: directory_set_component_record
system_scope: measures_registry
component: contact_permission
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Contact Permission Scope Record

```yaml
contact_permission_scope_record:
  status: component_seated
  component: contact_permission

  contact_consent:
    function:
      - permits_contact_for_scoped_purpose
      - permits_report_or_assessment_delivery_where_applicable
      - does_not_create_general_relationship_authority

  contact_scope:
    function:
      - records_what_content_or_follow_up_consent_allows
      - prevents_blanket_contact_authority
      - controls_email_dispatch_permissions

  contact_scope_options:
    assessment_delivery:
      permits:
        - AI_Operations_Assessment_recommendation_delivery

    MAP_transactional_notice:
      permits:
        - payment_confirmation
        - official_c3_7s_attachment
        - survey_surface_login

    MAP_deliverable_delivery:
      permits:
        - Environmental_Risk_Report_and_Operations_Review_delivery

    unDrifted_field_report:
      permits:
        - unDrifted_report_delivery
        - related_publication_follow_up

  revocation_or_opt_out_boundary:
    required: true
    standing: pending_exact_mechanism
    minimum_rule: representative_must_be_able_to_withdraw_or_limit_non_transactional_follow_up

  does_not_equal:
    - MRM
    - CRM
    - general_marketing_permission
```
