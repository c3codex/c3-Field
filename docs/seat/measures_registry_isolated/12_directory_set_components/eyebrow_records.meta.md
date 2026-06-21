---
document_type: directory_set_component_record
system_scope: measures_registry
component: eyebrows
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Eyebrow Records

```yaml
eyebrow_records:
  status: component_seated
  component: eyebrows

  eyebrows:
    AI_Operations_Assessment:
      public_label: AI Operations Assessment
      function: identifies the assessment encounter

    Findings_Preparation:
      public_label: Findings Preparation
      function: carries preliminary assessment context before review determination

    Review_Determination:
      public_label: Review Determination
      function: names recommended MAP path from assessment responses

    Measures_Assessment_Protocol:
      public_label: Measures Assessment Protocol
      function: orients the user to MAP scope and next step

    Payment_Confirmation:
      public_label: Payment Confirmation
      function: orients the user after payment-of-scope

    Survey_Intake:
      public_label: Survey Intake
      function: orients the user to post-payment MAP intake

  rule:
    - eyebrow_orients_surface_context
    - eyebrow_does_not_equal_passage
    - eyebrow_does_not_equal_antechamber
    - eyebrow_does_not_equal_epigraph
    - eyebrow_does_not_create_secure_boundary_crossing
```
