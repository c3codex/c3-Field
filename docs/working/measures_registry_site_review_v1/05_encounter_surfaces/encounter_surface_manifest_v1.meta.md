---
artifact_id: measures_registry_encounter_surface_manifest_v1
artifact_type: encounter_surface_working_review_manifest
system_scope: measures_registry
status: controlled_review_only
encounter_surface_count: 4
authority_created: false
---

# Encounter Surface Manifest v1

```yaml
encounter_surfaces:
  ai_operations_assessment:
    public_label: AI Operations Assessment
    public_use_allowed: true
    activates_scoring_authority: false
    activates_MAP_delivery: false
  undrifted:
    public_label: unDrifted
    public_use_allowed: true
    activates_publication_authority: false
    activates_social_dispatch: false
  map_the_environment:
    public_label: MAP the Environment
    public_use_allowed: controlled_only
    activates_payment: false
    activates_MAP_delivery: false
    activates_SEAT: false
  about_measures_registry:
    public_label: About Measures Registry
    public_use_allowed: only_if_content_standing_supports
    activates_service_authority: false

not_allowed_current_public_terms:
  - Structural Drift
  - Understand the Environment
  - Request a Review
```
