---
document_type: directory_set_requirement_record
record_key: social_campaign_record
status: required_before_SEAT_bucket_upload
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
system_scope: measures_registry_isolated
upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
social_posting_authorized_now: false
---

# Social Campaign Record

```yaml
social_campaign:
  status: required_before_SEAT_bucket_upload
  standing: requirement_record_only
  inspected_existing_sources:
    - docs/seat/measures_registry/01_contracts/social_media_campaign_contract.meta.md
    - docs/seat/measures_registry/05_automation/undrifted_social_campaign_automation.meta.md
  goal: completed_assessments
  primary_headline: "AI Isn't Broken. Systems Are."
  primary_CTA: Assess the Environment
  primary_route: AI Operations Assessment landing
  secondary_route: unDrifted landing
  surfaces:
    - X
    - Instagram
    - LinkedIn
    - Paragraph
    - YouTube_if_video_used
  selected_message_rules:
    allowed:
      - AI operations assessment
      - systems shape AI behavior
      - questions ungoverned systems cannot answer
      - environmental risk review
      - Measures Registry
      - unDrifted
    not_allowed:
      - Structural Drift as primary campaign identity
      - SEAT public claim
      - SEAL public claim
      - Registry Standing claim
      - c3 Key claim
      - DAO participation claim
      - certification claim
      - payment claim unless payment-of-scope is active and seated
  scheduling_authorized_now: false
  posting_authorized_now: false
  buffer_integration:
    status: configured_or_candidate_pending_verification
    execution_authorized_now: false
  required_future_evidence:
    - selected_posts
    - selected_media
    - posting_schedule
    - allowed_claims_check
    - OAR2_authorizing_posting_or_scheduling
```

## Boundary

This record does not schedule, post, publish, create credentials, activate Buffer execution, or authorize campaign launch.
