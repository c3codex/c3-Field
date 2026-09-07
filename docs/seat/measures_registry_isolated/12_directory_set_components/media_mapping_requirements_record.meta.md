---
document_type: directory_set_component_record
system_scope: measures_registry
component: media_mappings
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Media Mapping Requirements Record

```yaml
media_mapping_requirements_record:
  status: component_seated
  component: media_mappings

  required_media_groups:
    unDrifted_media:
      standing: partial
      needs:
        - active media selection
        - storage readback
        - fallback/poster record

    assessment_media:
      standing: partial
      needs:
        - obsidian assessment media confirmation
        - storage readback
        - fallback/poster record

    findings_preparation_media:
      standing: optional_pending_operator_choice
      if_not_used: not_required_after_operator_confirmation

    marble_MAP_media:
      standing: optional_pending_operator_choice
      if_not_used: not_required_after_operator_confirmation

    poster_fallback_records:
      standing: missing
      required: true
```
