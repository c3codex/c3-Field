---
artifact_id: docs_measures_registry_launch_shell_recovery_audit_v1
artifact_type: launch_shell_recovery_audit
system_scope: measures_registry
generated_from: docs/oar/oar2_recover_measures_registry_launch_shell_from_registered_runtime_chamber_directories_and_oar1_closeouts_v1.meta.md
status: completed_read_only_shell_recovery
evidence_observed_at: 2026-06-12T03:12:57Z
mutation_scope:
  runtime: false
  database: false
  routes: false
  renderer: false
  public_copy_rewrite: false
  docs_deleted: false
  docs_moved: false
  public_metadata: false
  assessment_scoring_state: false
  payment_state: false
  publication_state: false
  social_dispatch_state: false
  map_seat_state: false
---

# Measures Registry Launch Shell Recovery Audit v1

## Recovery Rule

Shell standing is recoverable only from accepted OAR1 closeouts, current registered-runtime source bindings, chamber-directory evidence, public URL and route evidence, and current registry-resolution behavior.

Broad Batch 1 classification is excluded. Assessment/scoring, payment, MAP, SEAT, publication, social distribution, and integrations remain separate downstream authorities and are not created by shell recovery.

## Recovered Shell Matrix

| architectural layer | recovered standing | decisive evidence | boundary |
| --- | --- | --- | --- |
| Codex shell | recovered_current | Closed runtime-shell OAR1; `src/app/App.tsx` currently imports `registered_runtime/MeasuresRegistryRuntimeRegistered`; deployed bundle contains the registered shell surface set. | Establishes the Measures Registry runtime frame only. |
| Field / registry resolution | recovered_current | Current runtime queries `measures_encounter_def`, `measures_registry`, media rows, design tokens, and governed route units; missing route registry state renders an explicit held surface. | Renderer consumes registry state and surfaces absence; it does not invent missing authority. |
| chamber directories | recovered_mixed | Accepted Measures Registry directory-binding OAR1 records Lapis, Obsidian, Marble, and Crystal bindings. Lapis has a registered working c3 Field directory; Obsidian, Marble, and Crystal index files explicitly say they do not register public directories. | Directory evidence supports grouping and runtime binding, not automatic public release. |
| passage sequence | recovered_current_with_holds | Current source and deployed bundle contain intro/path choice, `eval_passage`, `structure_passage`, `crystal_chamber`, and Obsidian-to-Marble passage routing. Accepted URL-sync OAR1 records current-state history synchronization. | Assessment mechanics and downstream MAP/payment decisions remain outside shell authority. |
| public root | recovered_current_live | `https://measuresregistry.com/` returned HTTP 200 on June 12, 2026 and served the Measures Registry route head and registered bundle. | HTTP and bundle proof establish shell delivery, not every registry row's authority. |
| assessment entry route | recovered_current_live_shell | `/ai-operations-assessment` redirected canonically to the trailing-slash route and returned HTTP 200 with the AI Operations Assessment route head and registered bundle. | This proves the route shell only; no assessment or scoring authority is created. |
| unDrifted route | recovered_current_live_shell | `/undrifted` redirected canonically to the trailing-slash route and returned HTTP 200 with the unDrifted route head and registered bundle. | This proves a public route shell only; no Paragraph or publication authority is created. |
| MAP route | recovered_held_live_shell | `/map-integrity-governance` returned HTTP 200 through the registered bundle. Current source and deployed bundle contain the governed missing-registry-state hold for `map_integrity_governance_landing`. | MAP, SEAT, commerce, and payment standing remain absent unless separately seated. |
| integrations | outside_shell_not_recovered | No integration authority is required to prove the shell frame. | No provider, credential, webhook, dispatch, or integration standing is created. |

## Accepted OAR1 Evidence

- `docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md` — closed clean registered runtime shell and route import switch.
- `docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md` — closed renderer alignment with a clean registry build.
- `docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md` — closed public encounter activation and route sequence evidence.
- `docs/oar/measures_registry/oar1_establish_measures_registry_chamber_directory_bindings_v1.meta.md` — executed directory bindings and read-only directory-view evidence.
- `docs/oar/measures_registry/oar1_repair_public_url_resolution_and_assessment_runtime_routing_v1.meta.md` — closed public route aliases and governed MAP hold.
- `docs/oar/measures_registry/oar1_correct_registered_runtime_one_step_late_url_history_sync_v1.meta.md` — executor-complete URL synchronization repair with clean build evidence.

## Current Source Evidence

- `src/app/App.tsx` imports the registered runtime and resolves governed route metadata from registry units.
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` declares the registered encounter set, route aliases, registry queries, passage dispatch, URL synchronization, and missing-registry held state.
- `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts` preserves the registered surface contract.
- Chamber directory indexes preserve c3 Field system-process ownership and explicitly deny downstream public, payment, publication, social, and readiness authority.

## Deployed Evidence

Read-only HTTP checks on June 12, 2026 observed:

```yaml
deployed_route_evidence:
  root:
    status: 200
    title: Measures Registry
  ai_operations_assessment:
    canonical_redirect: /ai-operations-assessment/
    status: 200
    title: AI Operations Assessment | Measures Registry
  undrifted:
    canonical_redirect: /undrifted/
    status: 200
    title: unDrifted | Measures Registry
  map_integrity_governance:
    status: 200
    title: Measures Registry
    standing: governed_held_shell
  deployed_bundle: assets/index-DRztjOQN.js
```

The deployed bundle includes registered route and held-state markers. The local `dist-registry` bundle hash differs from the deployed bundle hash, so deployed proof and current local build output remain distinct evidence surfaces.

## Recovery Summary

```yaml
launch_shell_recovery:
  codex_shell: recovered_current
  field_registry_resolution: recovered_current
  chamber_directories: recovered_mixed
  passage_sequence: recovered_current_with_holds
  public_root: recovered_current_live
  assessment_entry_shell: recovered_current_live_shell
  undrifted_route_shell: recovered_current_live_shell
  map_route_shell: recovered_held_live_shell
  assessment_scoring_authority_created: false
  payment_authority_created: false
  map_authority_created: false
  seat_authority_created: false
  publication_authority_created: false
  social_authority_created: false
  integration_authority_created: false
```

