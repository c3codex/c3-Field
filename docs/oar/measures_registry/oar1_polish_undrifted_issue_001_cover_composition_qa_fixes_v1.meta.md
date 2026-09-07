---
document_type: oar1
authority_level: execution_evidence
document_scope: runtime_layout_polish
title: OAR1 — Polish unDrifted Issue 001 Cover Composition QA Fixes
status: completed_with_rendered_visual_qa_held
version: v1
operator: op044
system: measures_registry
surface: undrifted
source_oar2: docs/oar/measures_registry/oar2_polish_undrifted_issue_001_cover_composition_qa_fixes_v1.meta.md
executed_at: 2026-06-23
---

# OAR1 — Polish unDrifted Issue 001 Cover Composition QA Fixes v1

## Result

The saved OAR2 was executed as a bounded DB-first runtime polish.

The cover renderer now:

- keeps article copy in controlled caption bands below artwork
- adds a viewport-safe top frame for the masthead and issue rail
- left-weights the seated cover-story headline
- renders the active seated Measures Registry logo in the assessment feature
- removes the duplicate Connect / Contribute / Create position list
- renders Role Call body, Our Story label, story body, CTA label, and destination from seated authority

## DB-first evidence

Read-only preflight confirmed:

- `measures_registry_root`: released, visible, active
- `undrifted_publication_landing`: released, visible, active
- `measures_media_map.media_role=measures_registry_logo`: active
- `measures_media_map.media_role=registry_mark`: active
- assessment route: `/ai-operations-assessment`
- article URLs: two published Paragraph destinations
- Role Call destination: `https://measuresregistry.com/c3field`
- Role Call CTA: `Connect · Contribute · Create →`

The operator then explicitly authorized DB addition during execution.

One existing row was updated:

```yaml
table: public.measures_publication_registry
publication_key: undrifted
mutation: metadata.role_call_feature merge
fields_added:
  feature_body: Systems, AI, and institutions are empty shells without the people who rely on them.
  story_body: |-
    An artist, an AI, one year,
    and a c3 Field of possibility.
  source_oar2: docs/oar/measures_registry/oar2_polish_undrifted_issue_001_cover_composition_qa_fixes_v1.meta.md
readback: passed
rows_updated: 1
rows_inserted: 0
```

Existing `destination_label`, `cta_label`, `destination_key`, and public URL authority were preserved.

No media row, route, release standing, publication standing, article URL, storage object, or assessment contract was created or changed.

## Component mutations

- `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx`
  - consumes the seated Measures Registry logo for the assessment feature
  - consumes seated Role Call `feature_body`, `destination_label`, and `story_body`
  - removes the duplicate standalone positions list
- `src/measures_registry/registered_runtime/styles/registry.visual-system.css`
  - moves article text out of artwork overlays and into caption bands
  - adds the initial viewport safe area
  - moves the cover-story editorial zone left
  - replaces the generic assessment-circle treatment with the seated logo presentation
  - adds governed Role Call body and story typography

## Build validation

Command:

```text
npm.cmd run build:registry
```

Result:

```text
105 modules transformed
registry production build passed
generated governed route heads for /ai-operations-assessment, /structural-drift, /undrifted
JavaScript: dist-registry/assets/index-CsJfBpX_.js
CSS: dist-registry/assets/index-C_tJfpuN.css
```

Vite emitted its existing main-chunk size advisory. It did not fail the build.

## Acceptance standing

```yaml
acceptance:
  magazine_cover_identity_preserved: implemented
  masthead_dominance_preserved: implemented
  article_text_caption_bands: implemented
  initial_viewport_safe_area: implemented
  cover_story_left_weighted: implemented
  assessment_uses_seated_mr_logo: implemented
  role_call_our_story_copy_db_seated: true
  connect_contribute_create_once: implemented
  seated_links_preserved: true
  invented_authority: false
  production_build: passed
  rendered_browser_qa: held_missing_sandboxPolicy
  deployment: not_performed
```

## Close

The magazine polish is locally complete and registry-driven. Rendered screenshot evidence and deployed production QA remain held because Browser bootstrap returned `missing field sandboxPolicy` and this execution did not authorize a push.
