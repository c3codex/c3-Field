---
document_type: directory_set_requirement_record
record_key: undrifted_article_and_paragraph_integration_record
status: required_before_SEAT_bucket_upload
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
system_scope: measures_registry_isolated
upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
paragraph_publish_authorized_now: false
---

# unDrifted Article and Paragraph Integration Record

```yaml
undrifted_article_behavior:
  status: required_before_SEAT_bucket_upload
  standing: requirement_record_only
  inspected_existing_sources:
    - docs/seat/measures_registry/01_contracts/paragraph_integrated_surface_contract.meta.md
    - docs/seat/measures_registry/06_runtime_surfaces/undrifted_runtime_surface.meta.md
    - docs/seat/measures_registry/11_style_contracts/undrifted_publication_style_contract.meta.md
  card_click_behavior:
    opens: onsite_article_overlay_or_surface_panel
    does_not_open_primary: Paragraph
  reader_experience:
    - stay_inside_unDrifted_surface
    - preserve publication frame
    - preserve Assess the Environment CTA
    - preserve return_to_dispatches
  external_paragraph_link:
    allowed: true
    role: secondary_source_link
    placement: article_footer_or_source_reference
  body_source:
    allowed:
      - local_content_record
      - paragraph_reference_url
    not_allowed:
      - external_redirect_as_primary_reading_experience

paragraph_integration:
  provider: Paragraph
  handle: "@undrifted"
  role:
    - source_reference
    - syndication_surface
    - external_publication_reference
  not_role:
    - primary_article_reader
    - route_authority
    - launch_surface_authority
  required_records:
    - article_registry
    - paragraph_url
    - local_display_mode
    - release_state
    - sort_order
  execution_hold:
    api_draft_authorized_now: false
    publish_authorized_now: false
```

## Boundary

Paragraph remains an integration/source/syndication surface. It does not become article reader authority, route authority, launch authority, or publication truth.
