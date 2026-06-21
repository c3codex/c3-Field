---
artifact_id: measures_registry_media_map_manifest_v1
artifact_type: media_map_working_review_manifest
system_scope: measures_registry
status: recovered_mixed_review
media_map_count: 6
authority_created: false
runtime_mutated: false
---

# Media Map Manifest v1

Media entries are references for review. This manifest does not create provider, bucket, runtime, or fallback authority.

```yaml
media_maps:
  intro_media:
    source_evidence:
      - src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
    standing: source_reference_only
  assessment_passage_media:
    source_evidence:
      - src/measures_registry/registered_runtime/styles/encounters/assessment.css
      - src/measures_registry/registered_runtime/styles/encounters/passage.css
    standing: source_reference_only
  undrifted_media:
    expected_source_path: measures_registry seated publication media mapping
    standing: missing_or_not_found_for_review
  material_media:
    materials: [crystal, obsidian, lapis, marble]
    source_evidence:
      - src/measures_registry/registered_runtime/styles/registry.materials.css
      - docs/process/media/institutional_media_bucket_governance_process.meta.md
    standing: recovered_mixed
  held_MAP_media:
    source_evidence:
      - docs/oar/oar1_audit_measures_registry_launch_integrations_assessment_media_maps_map_seat_payment_and_publication_authority_v1.meta.md
    standing: held
  social_canopy_media_candidates:
    source_evidence:
      - docs/oar/source_reference/canopy_communication_source_reference_build_view_v1.md
    standing: requirement_or_candidate

media_provider_boundary:
  Supabase:
    allowed: webp images
  R2:
    allowed: video/audio/large media
  forbidden:
    - temp media authority
    - frontend fallback media authority
```

