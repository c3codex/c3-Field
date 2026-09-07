---
document_type: directory_set_requirement_record
record_key: launch_landing_pages_record
status: required_before_SEAT_bucket_upload
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
system_scope: measures_registry_isolated
upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# Launch Landing Pages Record

```yaml
launch_landing_pages:
  status: required_before_SEAT_bucket_upload
  standing: requirement_record_only
  count: 2
  inspected_existing_sources:
    - docs/seat/measures_registry_isolated/site_design_review/ai_operations_assessment_surface_review.meta.md
    - docs/seat/measures_registry_isolated/site_design_review/undrifted_launch_landing_review.meta.md
    - docs/seat/measures_registry/06_runtime_surfaces/undrifted_runtime_surface.meta.md

  assessment_landing:
    surface_key: assessment_landing_ai_isnt_broken
    chamber_authority: obsidian
    public_headline: "AI Isn't Broken. Systems Are."
    required_hook: "Questions Ungoverned Systems Cannot Answer"
    primary_CTA: Assess the Environment
    secondary_route: Read unDrifted
    purpose:
      - assessment entry
      - AI operations risk framing
      - route into AI Operations Assessment
    not_allowed:
      - Structural Drift as primary headline
      - SEAT claim
      - SEAL claim
      - Registry Standing claim
      - c3 Key claim
      - DAO participation claim

  undrifted_landing:
    surface_key: undrifted_landing_ai_isnt_broken
    chamber_authority: lapis
    public_headline: "AI Isn't Broken. Systems Are."
    publication_mark: unDrifted
    publisher: Measures Registry
    primary_CTA: Assess the Environment
    purpose:
      - publication surface
      - article/dispatch reading surface
      - social campaign destination
      - route to assessment
    article_behavior:
      open_mode: onsite_overlay_or_panel
      paragraph_primary_redirect: false
      paragraph_external_link: secondary_only
    not_allowed:
      - Structural Drift as primary launch showcase
      - Paragraph as primary reading destination
      - SEAT claim
      - SEAL claim
      - Registry Standing claim
      - c3 Key claim
      - DAO participation claim
```

## Boundary

This record requires two sharp launch landings before SEAT bucket upload. It does not create routes, publish copy, mutate runtime, or authorize launch.
