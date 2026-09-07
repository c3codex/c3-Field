---
document_type: directory_set_component_record
system_scope: measures_registry
component: directory
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Launch Surface Order Record

```yaml
launch_surface_order_record:
  status: component_seated
  component: directory
  function: defines active launch surface order and chamber grouping
  mutation_authorized: false
  db_insertion_authorized: false

  active_launch_surface_order:
    1:
      surface: unDrifted_launch_landing
      chamber_frame: lapis_chamber_frame
      surface_type: encounter_surface
      public_allowed: true

    2:
      surface: AI_Operations_Assessment
      chamber_frame: obsidian_chamber_frame
      surface_type: encounter_surface
      public_allowed: true

    3:
      surface: contact_capture
      chamber_frame: obsidian_chamber_frame
      surface_type: encounter_surface
      public_allowed: true

    4:
      surface: Findings_Preparation
      chamber_frame: obsidian_chamber_frame
      surface_type: eyebrow
      public_allowed: true

    5:
      surface: Review_Determination
      chamber_frame: obsidian_chamber_frame
      surface_type: eyebrow
      public_allowed: true

    6:
      surface: Measures_Assessment_Protocol
      chamber_frame: marble_chamber_frame
      surface_type: encounter_surface
      public_allowed: true

    7:
      surface: payment_of_scope
      chamber_frame: marble_chamber_frame
      surface_type: encounter_surface
      standing: held_until_provider_ready

    8:
      surface: email_receipt_confirmation
      chamber_frame: marble_chamber_frame
      surface_type: email_dispatch
      standing: pending_template_and_provider_confirmation

    9:
      surface: survey_intake
      chamber_frame: marble_chamber_frame
      surface_type: encounter_surface
      standing: pending_provider_or_native_surface_boundary

    10:
      surface: Environmental_Risk_Report_and_Operations_Review_delivery
      chamber_frame: marble_chamber_frame
      surface_type: email_dispatch
      standing: pending_MAP_execution
```

This record defines launch order only. It does not activate payment, MAP execution, SEAL, Registry Standing, Branch standing, c3 Key, DAO participation, or certification.
