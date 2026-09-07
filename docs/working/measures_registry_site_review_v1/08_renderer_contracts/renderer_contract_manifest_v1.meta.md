---
artifact_id: measures_registry_renderer_contract_manifest_v1
artifact_type: renderer_contract_working_review_manifest
system_scope: measures_registry
status: mixed_renderer_boundary_review
renderer_contract_count: 9
renderer_mutated: false
authority_created: false
---

# Renderer Contract Manifest v1

```yaml
clean_shell_renderers:
  - RegisteredIntro.tsx
  - RegisteredPathChoice.tsx
  - RegisteredPassage.tsx
  - RegisteredPublicUnderstand.tsx
  - RegisteredGovernedStatus.tsx

runtime_support:
  - registeredRuntimeTypes.ts
  - registeredRuntimeUtils.ts
  - styles/

mixed_orchestrator:
  file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  review_copy_location: operator_review_conflicts/src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  current_runtime_evidence: true
  clean_whole_file_shell_authority: false
  contains_downstream_logic:
    - assessment scoring/capture
    - publication/subscription
    - MAP commerce
    - checkout
    - payment return verification
```

