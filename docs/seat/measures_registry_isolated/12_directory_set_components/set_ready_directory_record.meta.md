---
document_type: directory_set_component_record
system_scope: measures_registry
component: directory
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Set Ready Directory Record

```yaml
set_ready_directory_record:
  status: component_seated
  component: directory
  function: defines required component list and set readiness condition

  required_components:
    - directory
    - authority_boundary
    - terminology_concordance
    - chamber_frame
    - encounter_surfaces
    - eyebrows
    - style_profile
    - content_records
    - media_mappings
    - assessment_logic
    - C2_route_logic
    - contact_permission
    - email_dispatch
    - payment_of_scope
    - survey_intake
    - MAP_deliverable_boundary
    - release_state
    - dependency_state
    - verification_evidence
    - registration_readiness

  directory_set_allowed_when:
    - no_required_component_is_missing
    - no_required_component_is_blocked
    - every_required_component_is_seated_satisfied_held_or_not_required
    - every_held_component_has_explicit_boundary
    - verification_evidence_exists

  current_standing_after_this_record:
    directory_set: false
    reason: this record seats directory requirements but does not itself complete all components
```
