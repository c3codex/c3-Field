---
artifact_id: measures_registry_integration_manifest_v1
artifact_type: integration_working_review_manifest
system_scope: measures_registry
status: requirements_and_traces_only
integration_count: 6
integration_activated: false
authority_created: false
---

# Integration Manifest v1

No provider is activated by this review surface.

```yaml
integrations:
  Resend:
    standing: requirement
  Stripe:
    standing: held
  Buffer:
    standing: requirement
  Paragraph:
    standing: configured_trace
  Supabase:
    standing: configured_trace
  R2:
    standing: configured_trace

integration_status:
  configured_trace: [Paragraph, Supabase, R2]
  requirement: [Resend, Buffer]
  held: [Stripe]
  missing: []
  operator_review_required: []

source_evidence:
  - docs/oar/measures_registry/paragraph_api_db_to_paragraph_export_package_v1.md
  - src/integrations/supabase/client.ts
  - docs/process/media/institutional_media_bucket_governance_process.meta.md
  - docs/oar/oar1_audit_measures_registry_launch_integrations_assessment_media_maps_map_seat_payment_and_publication_authority_v1.meta.md
```

