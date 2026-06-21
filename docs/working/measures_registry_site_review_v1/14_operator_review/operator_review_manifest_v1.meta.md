---
artifact_id: measures_registry_operator_review_manifest_v1
artifact_type: operator_review_queue_manifest
system_scope: measures_registry
status: unresolved_or_held
operator_review_count: 9
authority_created: false
---

# Operator Review Manifest v1

```yaml
operator_review:
  - issue: mixed registered orchestrator
    evidence: operator_review_conflicts/src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  - issue: assessment renderer boundary
    evidence: src/measures_registry/registered_runtime/renderers/RegisteredPublicAssessment.tsx
  - issue: publication renderer boundary
    evidence: src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
  - issue: MAP/payment renderer boundary
    evidence: src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx
  - issue: provider ownership
    evidence: docs/process/media/institutional_media_bucket_governance_process.meta.md
  - issue: circuit contract wording
    evidence: docs/working/measures_registry_site_review_v1/boundary_records/carryout_recovery_oar1_v1.meta.md
  - issue: Codexstone Branch conversion boundary
    evidence: saved OAR2 requirement
  - issue: SEAT requirements hold
    evidence: 13_structured_asset_requirements/seat_requirements_hold_manifest_v1.meta.md
  - issue: c3 backoffice unavailable until c3 Field
    evidence: saved OAR2 guardrail
```
