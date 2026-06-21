---
document_type: directory_set_component_record
system_scope: measures_registry
component: terminology_concordance
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Terminology Replacement Map

```yaml
terminology_replacement_map:
  status: component_seated
  component: terminology_concordance
  db_insertion_authorized: false
  isolated_term_insert_allowed: false

  approved_public_terms:
    - unDrifted
    - AI Operations Assessment
    - Findings Preparation
    - Review Determination
    - Measures Assessment Protocol
    - payment-of-scope
    - email receipt confirmation
    - Environmental Risk Report & Operations Review
    - contact consent
    - contact scope

  approved_internal_terms:
    - SEAT
    - System Environment Alignment Track
    - SEAL
    - Structured Environment Aligned Legacy
    - component_seated
    - directory_set
    - contents_registered
    - runtime_active
    - chamber_frame
    - style_profile
    - content_records
    - media_mappings
    - email_dispatch
    - email_template_records
    - dispatch_delivery_trace
    - ERROR

  held_terms:
    - MRM
    - Measures Relational Management
    - measures_relationship_continuity
    - c3 Key
    - DAO participation
    - Branch standing
    - Registry Standing
    - SEAL standing

  not_approved_terms:
    - measure_principle_memory
    - seated_current
    - seated_supporting
    - contracts_for_system_requirements
    - style_contract
    - content_contract
    - media_contract
    - orientation_surface_for_public_launch

  replacements:
    style_contract: style_profile
    content_contract: content_records
    media_contract: media_mappings
    orientation_surface: eyebrow
    chamber_orientation: chamber_frame
    passage_when_public_transition: eyebrow
    epigraph_when_used_outside_Inanna: eyebrow
    validation: verification
    seated_current: review_classified_or_component_seated
    seated_supporting: review_classified_or_launch_supporting

  reserved_terms:
    passage:
      reserved_for:
        - secure_boundary_crossing
        - antechamber_entry
        - return_to_chamber
        - sensitive_registered_systems
      current_public_launch_allowed: false

    antechamber:
      current_public_launch_allowed: false

    epigraph:
      system_scope: Measures_of_Inanna
      current_Measures_Registry_public_launch_allowed: false

  db_insertion_boundary:
    grouped_concordance_set_required: true
    isolated_term_insert_allowed: false
```
