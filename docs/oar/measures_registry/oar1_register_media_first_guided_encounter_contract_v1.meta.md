---
document_type: oar1
authority_level: closeout
document_scope: encounter_contract_registration
title: OAR1 — Register Media-First Guided Encounter Contract
status: deployed_browser_qa_pending
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_register_media_first_guided_encounter_contract_v1.meta.md
final_seat_standing: held_browser_verification
---

# OAR1 — Register Media-First Guided Encounter Contract v1

## Closeout

```yaml
closeout:
  status: deployed_browser_qa_pending
  execution_started: true
  runtime_reconciled: true
  undrifted_reconciled: true
  assessment_route_reconciled: true
  about_route_seated: true
  c3field_boundary_preserved: true
  build_deployed: true
  browser_qa: not_verified
  final_seat_standing: held_browser_verification
```

## Step 1 — Encounter Contract Registered

```yaml
encounter_contract:
  contract_key: media_first_guided_encounter_v1
  operator: op044
  system: measures_registry
  registered_as: runtime_authority_oar1
  sequence_map:
    - root: /
      type: encounter
      surface: ai_isnt_broken_intro
    - path_choice:
        type: encounter
        surface: evaluate_structure_path
    - left_path:
        1: eval_passage
        2: measures_assessment (route: /ai-operations-assessment)
        3: obsidian_to_marble_passage_video
        4: marble_pathway_reveal
        5: map_integrity_governance
    - right_path:
        1: structure_passage / measures_structured_environments
        2: about_measures_registry (route: /about-measures-registry)
  publication_cover:
    route: /undrifted
    type: publication_cover
    not_in_encounter_sequence: true
  external_redirects:
    - route: /c3field
      target: https://c3field.online
      type: external_redirect
  surface_classifications:
    ai_isnt_broken_intro: encounter
    evaluate_structure_path: encounter
    eval_passage: passage
    measures_assessment: assessment
    obsidian_to_marble_passage_video: passage
    marble_pathway_reveal: result
    map_integrity_governance: map
    structure_passage: passage
    about_measures_registry: encounter
    structural_drift_dispatches: publication_cover
```

## Step 2 — Runtime Reconciled

### Route surface aliases — before/after

| Route | Before | After |
|---|---|---|
| /ai-operations-assessment | ai_operations_assessment_landing | measures_assessment |
| /about-measures-registry | (not seated) | about_measures_registry |
| /structural-drift | structural_drift_dispatches | structural_drift_dispatches (unchanged) |
| /undrifted | structural_drift_dispatches | structural_drift_dispatches (unchanged) |
| /map-integrity-governance | map_integrity_governance | map_integrity_governance (unchanged) |

### Public route by surface — before/after

| Surface | Before | After |
|---|---|---|
| ai_operations_assessment_landing | /ai-operations-assessment | (removed — no public URL) |
| measures_assessment | (none) | /ai-operations-assessment |
| about_measures_registry | (none) | /about-measures-registry |
| map_integrity_governance | /map-integrity-governance | /map-integrity-governance (unchanged) |
| structural_drift_dispatches | /undrifted | /undrifted (unchanged) |
| publication_dispatch | /structural-drift | /structural-drift (unchanged) |

### Route unit keys — before/after

| Route | Before | After |
|---|---|---|
| / | measures_registry_root | measures_registry_root (unchanged) |
| /ai-operations-assessment | ai_operations_assessment_landing | (removed — activeRouteUnit null, no governed surface override) |
| /structural-drift | structural_drift_landing | structural_drift_landing (unchanged) |
| /undrifted | undrifted_publication_landing | undrifted_publication_landing (unchanged) |
| /map-integrity-governance | map_integrity_governance_landing | map_integrity_governance_landing (unchanged) |

### Rationale for /ai-operations-assessment ROUTE_UNIT_KEYS removal

Keeping `ai_operations_assessment_landing` in ROUTE_UNIT_KEYS would cause the DB-governed effect to read `runtime_surface = "ai_operations_assessment_landing"` from that record and override the initial surface. Removing it ensures `activeRouteUnit = null`, the governed effect no-ops, and `initialSurface()` → `"measures_assessment"` holds.

## Step 3 — /undrifted Reconciled

### Changes applied to RegisteredStructuralDrift.tsx

1. **questions_ungoverned video** — `questionsUngovernedVideoUrl` prop added to Props type, destructured, and rendered as a `<video controls playsInline preload="metadata">` section before the dispatches grid.

2. **Leadership callout** — Static text replaced with active link to https://c3field.online.

3. **LinkedIn support** — `socialGlyph()` updated: LinkedIn → "in". Facebook glyph removed from function.

4. **Facebook filtered** — Social links render now filters `platform === "Facebook"` before mapping, regardless of DB state.

5. **About Measures Registry** — Button replaced with `<a href="/about-measures-registry">` linking directly to the new public route.

### /undrifted surface classification

```yaml
surface: structural_drift_dispatches
type: publication_cover
scroll: allowed if required
sequence_position: outside_encounter
```

## Step 4 — /ai-operations-assessment Reconciled

```yaml
before:
  url: /ai-operations-assessment
  surface: ai_operations_assessment_landing
  renderer: RegisteredAssessmentLanding
  behavior: landing page with single CTA

after:
  url: /ai-operations-assessment
  surface: measures_assessment
  renderer: RegisteredPublicAssessment
  behavior: assessment encounter, one question at a time
```

Assessment Q1 source is DB — stale content present (`ai_output_review_pathway`). This OAR does not replace Q1 — that requires operator authority per OAR1 `oar1_repair_route_normalization_and_stale_assessment_content_authority_v1.meta.md`. Assessment renders with existing DB questions. `frontend_hardcode_allowed: false` is respected.

## Step 5 — /about-measures-registry Seated

```yaml
route: /about-measures-registry
surface: about_measures_registry
renderer: RegisteredAboutMeasuresRegistry
video: present, not autoplay (preload="metadata")
route_head: dist-registry/about-measures-registry/index.html
canonical: https://measuresregistry.com/about-measures-registry
og_url: https://measuresregistry.com/about-measures-registry
generated_by: writeAboutRouteHead() in generate-registry-route-heads.cjs
```

## Step 6 — c3 Field Boundary Preserved

```yaml
/c3field:
  type: external_redirect
  target: https://c3field.online
  redirect_rules:
    - /c3field https://c3field.online 301
    - /c3field/ https://c3field.online 301
  route_head: dist-registry/c3field/index.html (canonical: https://c3field.online)
  internal_renderer: false
```

No internal c3 Field renderer created in Measures Registry.

## Step 7 — Build and Deploy

```yaml
deployment:
  commit: 58a2260
  branch: measures
  remote: https://github.com/c3codex/c3-Field.git
  push_confirmed: true
  deploy_target: measuresregistry.com (Cloudflare Pages)
  asset_hash: index-DEzkq48C.js
  files_deployed:
    - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    - src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
    - scripts/generate-registry-route-heads.cjs
    - dist-registry/about-measures-registry/index.html
    - dist-registry/assets/index-DEzkq48C.js
    - dist-registry/index.html
    - dist-registry/c3field/index.html
    - dist-registry/ai-operations-assessment/index.html
    - dist-registry/structural-drift/index.html
    - dist-registry/undrifted/index.html
```

## Step 8 — Browser QA

```yaml
browser_qa:
  status: not_verified
  reason: Browser verification tooling unavailable in this execution context.
  gate_rule: "If browser verification tooling is unavailable: STOP. Do not mark verification complete."
  required_proof:
    - / root intro media loads
    - path choice displays both media choices
    - left path passage autoloads
    - assessment renders one question at a time (at /ai-operations-assessment)
    - contact capture follows assessment
    - results passage renders
    - right path talking-head autoloads
    - /about-measures-registry renders and video does not autoplay
    - /undrifted renders as publication cover with questions_ungoverned video
    - /undrifted leadership links to https://c3field.online
    - /undrifted About links to /about-measures-registry
    - /undrifted no Facebook
    - /undrifted LinkedIn present if seated in DB
    - /c3field redirects externally
    - laptop screenshot
    - mobile screenshot if available
    - console/network findings
```

## Mutation Confirmation

```yaml
mutation_confirmation:
  runtime_mutation: true
  runtime_mutation_scope: >
    ROUTE_SURFACE_ALIASES: /ai-operations-assessment → measures_assessment, /about-measures-registry added.
    PUBLIC_ROUTE_BY_SURFACE: measures_assessment → /ai-operations-assessment, about_measures_registry → /about-measures-registry, ai_operations_assessment_landing removed.
    ROUTE_UNIT_KEYS: /ai-operations-assessment removed.
    questionsUngovernedVideoUrl prop added to RegisteredStructuralDrift call.
  renderer_mutation: true
  renderer_mutation_scope: >
    RegisteredStructuralDrift: Props type updated, questionsUngovernedVideoUrl wired,
    socialGlyph LinkedIn added, Facebook filtered, leadership link added, About anchor updated.
  build_script_mutation: true
  build_script_scope: writeAboutRouteHead() added to generate-registry-route-heads.cjs
  db_mutation: false
  content_mutation: false
  map_mutation: false
  payment_mutation: false
  social_campaign_mutation: false
  publication_mutation: false
  release_state_mutation: false
```

## Remaining Held Authority

```yaml
remaining_held:
  assessment_q1:
    status: held
    reason: Stale DB Q1 (ai_output_review_pathway). Operator must provide approved Q1-Q7 model.
    source_oar1: oar1_repair_route_normalization_and_stale_assessment_content_authority_v1.meta.md

  browser_verification:
    status: pending
    reason: Browser tooling unavailable. All surfaces deployed but not screenshot-verified.
    required_before: SEAT can advance to VERIFIED

  structural_drift_og_url:
    status: held
    reason: DB-side decision pending. Operator confirmation required.
```

## Final Standing

```yaml
repair_standing: deployed_browser_qa_pending
encounter_contract_registered: true
runtime_reconciled: true
undrifted_reconciled: true
assessment_route_direct: true
about_route_seated: true
c3field_boundary_preserved: true
build_deployed: true
browser_qa: not_verified
final_seat_standing: held_browser_verification

seat_advancement:
  current: held
  next: VERIFIED
  requires: browser QA screenshots confirming all required surfaces per OAR2 §8
```

SEAT remains HELD pending browser verification. All runtime and renderer changes are deployed. No DB mutations executed. Assessment Q1 remains stale — operator authority required to advance.
