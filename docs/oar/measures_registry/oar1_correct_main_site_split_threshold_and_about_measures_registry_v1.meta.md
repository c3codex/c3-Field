---
document_type: oar1
authority_level: execution_evidence
document_scope: main_site_runtime_correction
title: OAR1 — Correct Main Site Split Threshold and About Measures Registry
status: completed_with_rendered_qa_and_deployment_held
version: v1
operator: op044
system: measures_registry
surface:
  - /
  - /about-measures-registry
source_oar2: docs/oar/measures_registry/oar2_correct_main_site_split_threshold_and_about_measures_registry_v1.meta.md
executed_at: 2026-06-24
---

# OAR1 — Correct Main Site Split Threshold and About Measures Registry v1

## Result

The two public surfaces were corrected as separate registry-driven pages.

- `/` now resolves from seated root authority to the full-screen Assess / Understand split threshold.
- `/about-measures-registry` now renders one reduced talking-head page: headline, video, four seated position paragraphs, one seated unDrifted feature, and one seated connect action.

No page was added and the two surfaces were not merged.

## DB preflight and readback

Initial live state confirmed:

- root registry row: released, visible, active
- root `encounter_structure.path_choice`: present
- left route: `structural_coherence_explainer`
- right route: `measures_structured_environments`
- left motion/still media: active
- right motion/still media: active
- About talking-head media: active at seated `about_measures_registry_video`
- About headline: `About Measures Registry`
- featured article set: two published rows with seated artwork and Paragraph URLs
- root conflict: `runtime_surface=intro_hook` and `encounter_key=ai_isnt_broken_intro`
- About reduced position/contact fields: absent

The approved OAR required DB authority to lead the renderer, so two existing metadata rows were updated and read back:

```yaml
database_mutation:
  rows_updated: 2
  rows_inserted: 0
  rows_deleted: 0
  root:
    table: public.measures_registry
    registry_key: measures_registry_root
    runtime_surface: path_choice
    encounter_key: evaluate_structure_path
    preserved_left_next_surface: structural_coherence_explainer
    preserved_right_next_surface: measures_structured_environments
  about:
    table: public.measures_encounter_def
    encounter_key: about_measures_registry
    title: About Measures Registry
    position_copy:
      - "Measures Registry position: AI optimization cannot be achieved through tools alone."
      - "AI systems interact with workflows, roles, approvals, data, outputs, and decisions."
      - "Without Governed System Integrity, those interactions can amplify instability across the systems they touch."
      - "Governed System Integrity provides the necessary environment for Optimized AI Deployment."
    connect_contract:
      title: Connect with Measures Registry
      email: connect@measuresregistry.com
      cta_label: Email Measures Registry
      action_url: mailto:connect@measuresregistry.com
  readback: passed
```

No media, route target, article standing, MAP, payment, assessment scoring, or SEAT state was changed.

## Files changed

Source:

```text
src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
src/measures_registry/registered_runtime/renderers/RegisteredAboutMeasuresRegistry.tsx
src/measures_registry/registered_runtime/styles/registry.runtime.css
src/measures_registry/registered_runtime/styles/encounters/path-choice.css
src/measures_registry/registered_runtime/styles/encounters/about.css
```

Generated build:

```text
dist-registry/about-measures-registry/index.html
dist-registry/ai-operations-assessment/index.html
dist-registry/c3field/index.html
dist-registry/index.html
dist-registry/structural-drift/index.html
dist-registry/undrifted/index.html
dist-registry/assets/index-BDDqOPFx.js (superseded)
dist-registry/assets/index-ByzwHrrz.css (superseded)
dist-registry/assets/index-DEEHthST.js
dist-registry/assets/index-Btk1xr3u.css
```

Authority/logs:

```text
docs/oar/measures_registry/oar2_correct_main_site_split_threshold_and_about_measures_registry_v1.meta.md
docs/oar/measures_registry/oar1_correct_main_site_split_threshold_and_about_measures_registry_v1.meta.md
```

## Root standing

```yaml
root:
  seated_runtime_surface: path_choice
  full_screen_panels: implemented
  desktop_layout: two_columns
  mobile_layout: two_stacked_half_viewports
  motion_to_still: preserved
  stale_intro_copy: removed_from_root_render
  continue_button: absent
  about_copy: absent
  talking_head_media: absent
  left_route_invented: false
  right_route_invented: false
```

## About standing

```yaml
about:
  headline: About Measures Registry
  talking_head_primary: implemented
  continue_state: removed
  reduced_position_copy: db_seated_and_rendered
  support_point_wall: removed
  featured_article: db_seated_and_rendered
  featured_artwork: db_seated_and_rendered
  connect_contract: db_seated_and_rendered
  duplicate_cards: removed
  generic_saas_stack: removed
  system_footer_prominence: removed_from_page
```

## Validation

Commands:

```text
npm.cmd exec tsc -- --noEmit
npm.cmd run build:registry
```

Result:

```yaml
typescript: passed
registry_build: passed
modules_transformed: 105
javascript_asset: dist-registry/assets/index-DEEHthST.js
css_asset: dist-registry/assets/index-Btk1xr3u.css
governed_route_heads:
  - /ai-operations-assessment
  - /structural-drift
  - /undrifted
chunk_size_advisory: non_blocking
```

Browser bootstrap returned `missing field sandboxPolicy`. Rendered viewport claims are held rather than inferred from source/build proof.

## Held items

```yaml
rendered_root_qa: held_missing_sandboxPolicy
rendered_about_qa: held_missing_sandboxPolicy
deployment: not_performed
production_truth: unchanged_by_this_source_build
held_worktree_cleanup: not_performed
commit: not_performed
push: not_performed
```

## Close

Root is seated as the split threshold. About is reduced to talking-head, position, one unDrifted feature, and one connect action. Build proof passes; rendered QA and deployment remain explicitly held.
