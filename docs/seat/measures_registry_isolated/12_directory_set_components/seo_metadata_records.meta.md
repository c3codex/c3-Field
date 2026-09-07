---
document_type: directory_set_requirement_record
record_key: seo_metadata_records
status: required_before_SEAT_bucket_upload
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
system_scope: measures_registry_isolated
upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# SEO Metadata Records

```yaml
SEO_metadata:
  status: required_before_SEAT_bucket_upload
  standing: requirement_record_only
  inspected_existing_sources:
    - src/app/App.tsx
    - docs/oar/measures_registry/deprecate-structural-drift-section-and-seat-undrifted-only-publication-architecture-v1.sql
    - docs/seat/measures_registry_isolated/site_design_review/ai_operations_assessment_surface_review.meta.md
    - docs/seat/measures_registry_isolated/site_design_review/undrifted_launch_landing_review.meta.md
  primary_public_headline: "AI Isn't Broken. Systems Are."
  suppress_as_primary:
    - Structural Drift
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - certification

  required_routes:
    - route: /
      purpose: primary entry or router
    - route: /ai-isnt-broken
      purpose: assessment landing or headline landing
    - route: /ai-operations-assessment
      purpose: assessment entry
    - route: /undrifted
      purpose: publication landing
    - route: /measures-assessment-protocol
      purpose: MAP / payment-of-scope review boundary

  required_fields_per_route:
    - page_title
    - meta_description
    - canonical_url
    - og_title
    - og_description
    - og_image
    - twitter_card
    - twitter_title
    - twitter_description
    - twitter_image
    - robots
    - sitemap_include
    - structured_data_if_used

  not_allowed:
    - unresolved VITE_PAGE_TITLE
    - generic default title
    - Structural Drift as main site title
    - public SEAT/SEAL/Registry Standing/c3 Key/DAO claim
    - broken social preview image
    - missing canonical for active landing pages
```

## Boundary

This record defines metadata requirements only. It does not edit renderer metadata, route definitions, public copy, sitemap files, robots policy, database rows, or deployment state.
