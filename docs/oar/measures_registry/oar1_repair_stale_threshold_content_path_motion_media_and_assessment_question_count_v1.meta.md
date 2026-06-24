---
document_type: oar1
authority_level: closeout
document_scope: threshold_repair
title: OAR1 — Repair Stale Threshold Content, Path Motion Media, and Assessment Question Count
status: db_repaired_local_runtime_validated_deployment_and_browser_qa_held
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_repair_stale_threshold_content_path_motion_media_and_assessment_question_count_v1.meta.md
executed_at: 2026-06-23
final_seat_standing: held_deployment_and_browser_qa
---

# OAR1 — Repair Stale Threshold Content, Path Motion Media, and Assessment Question Count v1

## RESULT

The live DB threshold, media, assessment, and scoring authority was queried before mutation.

The stale intro copy and eight-question assessment drift were repaired in live DB authority. The path-choice media contract was reconciled to the already seated and publicly available motion/still mappings. The local renderer guard was restored to seven questions and the registry build passed.

Deployment and rendered browser QA remain held because this OAR does not authorize a Git commit/push deployment, and the in-app browser capability failed during bootstrap in this thread.

## DB PREFLIGHT — BEFORE

```yaml
intro_hook:
  encounter_key: ai_isnt_broken_intro
  title: Behavior that is not registered cannot be governed.
  subtitle: Enter through system evaluation or foundational cohort conversion.
  renderer: epigraph_split_hero

path_choice:
  encounter_key: evaluate_structure_path
  title: "AI isn't broken.\nSystems are."
  renderer: measures_registry_path_choice
  media_contract_standing: stale_renderer_gap_description

assessment:
  encounter_key: measures_assessment
  question_count: 8
  required_question_count: 8
  payload_question_count: 8
  q1: ai_deployment_status
  q2_stale: ai_output_review_pathway
  scoring_threshold_count: 4
  standing_rule_count: 4
  fallback_standing_key: early_structural_drift
```

The live sequence proved that AI Deployment Status had been prepended. The former Question 1 remained at position 2, producing eight questions instead of replacing the old first position.

## INTRO REPAIR

Final live DB copy:

```yaml
intro_hook:
  title: AI isn't broken.
  subtitle: Systems are.
```

Removed from active intro metadata:

- `Behavior that is not registered cannot be governed.`
- `Enter through system evaluation or foundational cohort conversion.`

The existing path-choice supporting copy remains seated:

```text
Most AI failures aren't intelligence problems.
They're system failures.
```

No frontend copy fallback was added.

## PATH MOTION-TO-STILL MEDIA

Four required active media mappings were confirmed before and after repair:

```yaml
left:
  motion:
    role: left_hero_fracture_motion
    bucket: measures-media
    path: left_hero_fracture_motion.mp4
    http_status: 200
    content_type: video/mp4
    content_length: 7537934
  still:
    role: left_hero_fracture
    bucket: measures-registry
    path: left_hero_fracture.webp
    http_status: 200
    content_type: image/webp
    content_length: 48266
right:
  motion:
    role: measured_hero_motion_graphic
    bucket: measures-media
    path: right_measured_hero_motion_graphic.mp4
    http_status: 200
    content_type: video/mp4
    content_length: 2977050
  still:
    role: right_measured_hero
    bucket: measures-registry
    path: right_measured_hero.webp
    http_status: 200
    content_type: image/webp
    content_length: 55160
```

Final DB media contract:

```yaml
renderer_contract: registered_path_choice_motion_to_still_v1
source_authority: measures_media_map
motion_to_still_behavior: motion_plays_then_resolves_to_seated_still
frontend_hardcode_allowed: false
blank_media_container_allowed: false
```

`path_choice_background` remains inactive and held. It is not used as fallback authority and is not required for the seated left/right threshold plates.

Runtime evidence already present and preserved:

- `RegisteredPathChoice` loads each seated motion URL.
- `onEnded` marks the side settled.
- The settled plate renders its seated still image.
- `RegisteredIntro` uses the same seated motion/still roles for the root threshold.
- No hardcoded media URL was added.

## SEVEN-QUESTION CONTRACT

Final live DB order:

```yaml
total_questions: 7
required_question_count: 7
payload_question_count: 7
questions:
  - position: 1
    question_key: ai_deployment_status
    context_label: AI Deployment Status
    option_count: 4
  - position: 2
    question_key: active_ai_system_visibility
  - position: 3
    question_key: failure_traceability
  - position: 4
    question_key: persistent_review_standard
  - position: 5
    question_key: safe_ai_acceleration_capacity
  - position: 6
    question_key: role_authority_boundary
  - position: 7
    question_key: implementation_boundary
removed_question_key: ai_output_review_pathway
```

The approved deployment-status question remained seated; the stale former Q1 was removed rather than adding or inventing a new question.

## SCORING AND PAYLOAD PROTECTION

```yaml
scoring:
  context_question_count: 1
  scored_operational_question_count: 6
  scoring_threshold_count: 4
  standing_rule_count: 4
  fallback_standing_key: early_structural_drift
  scoring_contract_mutated: false
payload:
  runtime_expected_question_count: 7
  db_required_question_count: 7
  db_payload_question_count: 7
  completion_requires_every_active_question: true
  stored_evaluation_answers_source: populated_evalAnswers
```

Runtime scoring consumes the active DB mechanics array only. Before calculation it rejects any mechanics array not equal to `PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT` and rejects any missing active answer. The capture payload filters selected entries from that same answer map. After the runtime deployment, an eight-question payload cannot satisfy the active seven-question contract.

The direct standalone scoring harness was not completed because the isolated TS runner could not initially resolve the Vite `@/shared` alias; the retry requiring external access was then blocked by the environment usage limit. The successful Vite registry build is the compile proof, while live DB readback is the contract proof. This limitation is not upgraded into a completed dynamic scoring claim.

## RELEASE AND RUNTIME CONTRACT

```yaml
measures_registry_root:
  release_state: released
  access_state: visible
  is_active: true
  route_path: /
  runtime_surface: intro_hook
  intro_next_surface: path_choice
  path_choice_left_motion_role: left_hero_fracture_motion
  path_choice_left_poster_role: left_hero_fracture
  path_choice_right_motion_role: measured_hero_motion_graphic
  path_choice_right_poster_role: right_measured_hero

ai_operations_assessment_landing:
  release_state: released
  access_state: visible
  is_active: true
  route_path: /ai-operations-assessment
```

## RUNTIME CHANGE

Changed:

```typescript
const PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7
```

No question text, scoring weight, result map, media URL, or route was hardcoded in `src`.

## BUILD VALIDATION

```yaml
command: npm.cmd run build:registry
result: passed
vite_version: 7.3.2
modules_transformed: 105
js_asset: dist-registry/assets/index-Do38ZHfw.js
css_asset: dist-registry/assets/index-Bzi8UxsL.css
route_heads:
  - /ai-operations-assessment
  - /structural-drift
  - /undrifted
warning: chunk_size_over_500_kb_non_blocking
```

The first sandboxed build attempt hit the known Vite/esbuild filesystem permission error. The identical build passed after rerunning with the required filesystem access.

## BROWSER QA

```yaml
browser_qa:
  status: held_thread_capability_failure
  local_preview_started: true
  browser_bootstrap_succeeded: false
  validation_not_claimed:
    - rendered intro copy
    - visible 1 of 7 progress
    - motion-to-still transition
    - balanced threshold presentation
```

Per the Browser skill boundary, the bootstrap failure is treated as thread-scoped capability loss. HTTP media proof, DB proof, and build proof are preserved; they are not substituted for rendered browser proof.

## DEPLOYMENT STANDING

```yaml
deployment:
  commit_created: false
  push_performed: false
  production_runtime_updated: false
  local_runtime_ready: true
  live_db_repaired: true
  standing: held_pending_authorized_commit_push_and_browser_qa
```

Because the live DB now contains seven questions while the previously deployed runtime may still expect eight, the deployed assessment is expected to fail closed at its contract guard until the local runtime repair is deployed. No scoring from an eight-question payload can proceed during this held state.

## FILES

- `supabase/migrations/202606230009_repair_stale_threshold_content_path_motion_media_and_assessment_question_count.sql`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `docs/oar/measures_registry/oar1_repair_stale_threshold_content_path_motion_media_and_assessment_question_count_v1.meta.md`
- `dist-registry/assets/index-Do38ZHfw.js`
- `dist-registry/assets/index-Bzi8UxsL.css`
- regenerated `dist-registry` route-head HTML files

The prior hashed registry assets are superseded by the new build and appear as deletions in the worktree. No deployment claim is made from local build output.

The migration passed a live PostgreSQL transaction validation with explicit rollback before execution, then executed through the established Supabase `exec_sql` RPC. Final live readback passed.

## BOUNDARY CONFIRMATION

- MAP mutation: none
- payment mutation: none
- SEAT activation: none
- route mutation: none
- scoring threshold/rule mutation: none
- media upload or bucket mutation: none
- hardcoded media URL: none
- hardcoded question content: none
- deprecated cohort/system-evaluation copy retained in active intro DB metadata: no

Pre-existing unrelated `src/c1/antechamber/schemas/*` deletions were preserved and not modified.

## CLOSE

The threshold DB authority is repaired. The seven-question contract is restored. The path media contract is coherent with the seated renderer and assets.

SEAT remains held pending authorized deployment and rendered Browser QA.
