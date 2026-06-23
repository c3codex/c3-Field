---
document_type: oar1
authority_level: execution_evidence
document_scope: repo_hygiene
title: OAR1 — Dirty Worktree Bushwhack and Authorized Change Isolation
status: completed_with_held_preexisting_changes
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_dirty_worktree_bushwhack_and_authorized_change_isolation_v1.meta.md
executed_at: 2026-06-23
---

# OAR1 — Dirty Worktree Bushwhack and Authorized Change Isolation v1

## Result

The dirty worktree was inspected and classified before any isolation mutation.

No file was deleted, restored, stashed, staged, committed, or pushed. No deployment was triggered.

Initial porcelain snapshot:

```yaml
dirty_paths: 322
tracked_modified: 12
tracked_deleted: 7
untracked: 303
unknown_after_inspection: 0
```

Writing this required OAR1 adds one authorized untracked path after the snapshot. Final expected dirty standing is 323 paths.

## Exhaustive classification table

Every path in the 322-path snapshot is covered by exactly one row below. Exact-path rules take precedence over directory-pattern rules.

| file_path or exhaustive path rule | status | count | classification | recommended_action | reason |
|---|---:|---:|---|---|---|
| `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx` | `M` | 1 | `authorized_current_oar` | clean commit candidate | active unDrifted polish renderer |
| `src/measures_registry/registered_runtime/styles/registry.visual-system.css` | `M` | 1 | `authorized_current_oar` | clean commit candidate | active unDrifted polish presentation |
| `docs/oar/measures_registry/oar1_polish_undrifted_issue_001_cover_composition_qa_fixes_v1.meta.md` | `??` | 1 | `authorized_current_oar` | clean commit candidate | active polish closeout |
| `docs/oar/measures_registry/oar2_polish_undrifted_issue_001_cover_composition_qa_fixes_v1.meta.md` | `??` | 1 | `authorized_current_oar` | clean commit candidate | active polish authority |
| `docs/oar/measures_registry/oar2_dirty_worktree_bushwhack_and_authorized_change_isolation_v1.meta.md` | `??` | 1 | `authorized_current_oar` | clean commit candidate | current isolation authority |
| `dist-registry/about-measures-registry/index.html` | `M` | 1 | `generated_build_artifact` | include with validated build | current route-head generation |
| `dist-registry/ai-operations-assessment/index.html` | `M` | 1 | `generated_build_artifact` | include with validated build | current route-head generation |
| `dist-registry/assets/index-ChX8Dj_L.css` | `D` | 1 | `generated_build_artifact` | include with validated build | superseded prior bundle |
| `dist-registry/assets/index-DxY3Xb96.js` | `D` | 1 | `generated_build_artifact` | include with validated build | superseded prior bundle |
| `dist-registry/assets/index-C_tJfpuN.css` | `??` | 1 | `generated_build_artifact` | include with validated build | current polish bundle |
| `dist-registry/assets/index-CsJfBpX_.js` | `??` | 1 | `generated_build_artifact` | include with validated build | current polish bundle |
| `dist-registry/c3field/index.html` | `M` | 1 | `generated_build_artifact` | include with validated build | current route-head generation |
| `dist-registry/index.html` | `M` | 1 | `generated_build_artifact` | include with validated build | current route-head generation |
| `dist-registry/structural-drift/index.html` | `M` | 1 | `generated_build_artifact` | include with validated build | current route-head generation |
| `dist-registry/undrifted/index.html` | `M` | 1 | `generated_build_artifact` | include with validated build | current route-head generation |
| `docs/oar/measures_registry/*` excluding exact active paths above | `??` | 19 | `prior_oar_artifact` | must hold | prior Measures Registry work outside active polish/isolation scope |
| `docs/oar/*` excluding `docs/oar/measures_registry/*` | `??` | 10 | `prior_oar_artifact` | must hold | prior MAP/Stripe OAR packages |
| `docs/seat/measures_registry_isolated/01_records/*` | `??` | 48 | `prior_oar_artifact` | must hold | prior transfer payload records |
| `docs/seat/measures_registry_isolated/09_oar/*` | `M` + `??` | 82 | `prior_oar_artifact` | must hold | prior isolated OAR packages |
| `docs/seat/measures_registry_isolated/10_validation/*` | `M` + `??` | 127 | `prior_oar_artifact` | must hold | prior isolated validation packages |
| remaining `docs/*` | `??` | 4 | `prior_oar_artifact` | must hold | process and SEAT integration/runtime records outside active scope |
| `functions/api/stripe/*` | `M` + `??` | 2 | `prior_oar_artifact` | must hold | substantive webhook/idempotency work outside active visual polish |
| `supabase/migrations/*` | `D` + `??` | 5 | `prior_oar_artifact` | must hold | MAP and unDrifted migration work outside active visual polish |
| `src/c1/antechamber/schemas/*` | `D` | 4 | `unrelated_preexisting_mutation` | must hold | C1 architecture relocation outside Measures scope |
| `c1/antechamber/schemas/*` | `??` | 4 | `unrelated_preexisting_mutation` | must hold | replacements are not byte-identical to deleted HEAD files |
| `supabase/.temp/cli-latest` | `M` | 1 | `safe_to_remove` | operator decision | transient CLI version marker; deletion not authorized |
| `supabase/.temp/linked-project.json` | `??` | 1 | `safe_to_remove` | operator decision | transient linked-project state; deletion not authorized |

Post-report path added by this closeout:

| file_path | status | classification | recommended_action | reason |
|---|---:|---|---|---|
| `docs/oar/measures_registry/oar1_dirty_worktree_bushwhack_and_authorized_change_isolation_v1.meta.md` | `??` | `authorized_current_oar` | clean commit candidate | required sibling closeout |

## Inspection evidence

- tracked diff inspection confirmed the Stripe webhook mutation is substantive: 193 additions and 60 deletions
- the two modified isolated-review docs only redirect stale MAP migration naming to `map_c2_circuit`
- the deleted legacy MAP migration is paired with a differently named current migration and is held as prior OAR work
- all four C1 destination files differ from their deleted HEAD counterparts; they are not safe mechanical moves
- all 303 original untracked files were inventoried; one is zero bytes:
  - `docs/oar/measures_registry/oar2_repair_undrifted_media_binding_and_split_registered_runtime_by_chamber_responsibility_v1.md`
- zero-byte prior OAR remains held for operator decision; it was not deleted

## Clean commit candidate

The active commit is safe only when staged by these exact paths:

```text
src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
src/measures_registry/registered_runtime/styles/registry.visual-system.css
dist-registry/about-measures-registry/index.html
dist-registry/ai-operations-assessment/index.html
dist-registry/assets/index-ChX8Dj_L.css
dist-registry/assets/index-DxY3Xb96.js
dist-registry/assets/index-C_tJfpuN.css
dist-registry/assets/index-CsJfBpX_.js
dist-registry/c3field/index.html
dist-registry/index.html
dist-registry/structural-drift/index.html
dist-registry/undrifted/index.html
docs/oar/measures_registry/oar2_polish_undrifted_issue_001_cover_composition_qa_fixes_v1.meta.md
docs/oar/measures_registry/oar1_polish_undrifted_issue_001_cover_composition_qa_fixes_v1.meta.md
docs/oar/measures_registry/oar2_dirty_worktree_bushwhack_and_authorized_change_isolation_v1.meta.md
docs/oar/measures_registry/oar1_dirty_worktree_bushwhack_and_authorized_change_isolation_v1.meta.md
```

Build provenance for the generated set:

```yaml
command: npm.cmd run build:registry
result: passed
modules_transformed: 105
javascript_asset: dist-registry/assets/index-CsJfBpX_.js
css_asset: dist-registry/assets/index-C_tJfpuN.css
governed_route_heads:
  - /ai-operations-assessment
  - /structural-drift
  - /undrifted
```

## Held standing

```yaml
held_prior_oar_artifacts: 297
held_unrelated_c1_paths: 8
operator_decision_transient_paths: 2
stashed_paths: 0
restored_paths: 0
deleted_paths: 0
staged_paths: 0
committed_paths: 0
pushed_paths: 0
```

## Commit safety

```yaml
mixed_worktree_commit_safe: false
exact_path_commit_safe: true
safe_only_if:
  - stage the 16 exact candidate paths above
  - verify no other path is staged
  - preserve all held paths without restore or deletion
  - keep deployment validation separate from Git push truth
```

## Close

Bushwhack complete. The authorized polish package is isolated by an exact path manifest. All unrelated and prior work remains visible, unmodified, and held.
