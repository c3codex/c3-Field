---
artifact_id: measures_registry_content_packet_manifest_v1
artifact_type: content_packet_working_review_manifest
system_scope: measures_registry
status: mixed_review_standing
content_packet_count: 6
authority_created: false
---

# Content Packet Manifest v1

```yaml
content_packets:
  intro_epigraph:
    source_evidence:
      - src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
      - docs/_source/working/archive_working_docs/field_definition_epigraph_surface.md
    classification: current_allowed
  ai_operations_assessment:
    source_evidence:
      - src/measures_registry/PublicAssessmentSurface.tsx
      - src/measures_registry/measuresAssessmentCopy.ts
    classification: current_allowed
  undrifted:
    source_evidence:
      - docs/oar/measures_registry/paragraph_api_db_to_paragraph_export_package_v1.md
    classification: controlled_allowed
  about_measures_registry:
    source_evidence:
      - docs/oar/measures_registry/oar2_seat_public_landing_page_design_contracts_for_undrifted_and_ai_operations_assessment_v1.meta.md
    classification: working_unregistered
  map_the_environment_controlled_passage:
    source_evidence:
      - docs/oar/oar1_audit_measures_registry_launch_integrations_assessment_media_maps_map_seat_payment_and_publication_authority_v1.meta.md
    classification: held
  email_src_report_candidates:
    source_evidence:
      - docs/working/measures_registry_site_review_v1/boundary_records/carryout_recovery_oar1_v1.meta.md
    classification: operator_review_required

content_packet_status:
  current_allowed: [intro_epigraph, ai_operations_assessment]
  controlled_allowed: [undrifted]
  working_unregistered: [about_measures_registry]
  seated_not_rendered: []
  held: [map_the_environment_controlled_passage]
  deprecated_trace: []
  operator_review_required: [email_src_report_candidates]
```

