---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR2 — Audit Left Path Post-Passage Dead Surface and Vite Placeholder Warning
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
  - docs/oar/measures_registry/oar1_restore_epigraph_video_mapping_and_rehold_dead_hero_video_role_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-qa
  - left-path
  - dead-surface
  - vite-placeholder
  - registered-runtime
  - codex-first
---

# OAR2 — Audit Left Path Post-Passage Dead Surface and Vite Placeholder Warning

## OBSERVED

Local runtime QA using `npm run dev` confirms:

- site loads
- epigraph video loads
- hero/path entry loads
- left passage video loads
- after left passage, runtime reaches a dead/blank page
- terminal reports unresolved Vite placeholder warning:

    Malformed URI sequence in request URL: /%VITE_MANIFEST_HREF%

This OAR2 audits the left-path post-passage dead surface and the Vite placeholder warning.

The left path should resolve as:

    evaluate_structure_path
        -> eval_passage
        -> connect_src
        -> measures_assessment
        -> measures_phases_reveal

Prior OAR1s confirmed:

- all 13 registered encounters are contracted
- all 13 registered encounters are active and anon-readable
- registered runtime renderer alignment built clean
- public route exposure corrected
- epigraph media mapping restored

Therefore the current issue is likely a frontend route/render-state seam, not missing registered encounter authority.

## ALIGNED

This is runtime QA audit and bounded correction.

Do not redesign surfaces.

Do not edit CSS unless a one-line containment fix is unavoidable and explicitly reported.

Do not alter assessment scoring.

Do not fork assessment mechanics.

Do not change DB state unless the audit proves a seated action/metadata route is wrong.

Do not implement email dispatch.

Do not expose payment logic.

Frontend must continue rendering seated Codex state only.

## ROUTED

### 1. Identify the dead surface

Reproduce local flow:

    ai_isnt_broken_intro
        -> evaluate_structure_path
        -> eval_passage
        -> post-video / continue action

Determine the exact runtime state after the left passage video:

- activeSurface
- target encounter key
- sectionMap presence
- action key triggered
- route source
- whether navigation uses handleAction or navigateSurface
- whether fallback route is invoked

Report whether the dead page is:

- connect_src
- measures_assessment
- another surface
- unknown state
- legacy alias
- missing/empty section copy
- renderer returning null/empty fragment

### 2. Audit eval_passage route behavior

Inspect `renderEducationalDiagnosticPassageSurface` and related video completion/continue handling.

Confirm that left path sets:

    connectSrcNextEncounter = measures_assessment

before routing to:

    connect_src

Confirm that left path does not route to:

- iis_eval_gate1
- educate_eval_encounter
- understand_failure
- systems_offering
- legacy fallback surface

If fallback occurs, identify why.

### 3. Audit connect_src renderer

Inspect `renderConnectSrcSurface`.

Confirm:

- connect_src exists in sectionMap during runtime
- copy/metadata resolves
- renderer does not silently return blank
- form/action payload is present or graceful fallback renders
- continue action routes to `connectSrcNextEncounter`
- left path continues to `measures_assessment`

If connect_src lacks required metadata, report exact missing fields.

### 4. Audit measures_assessment renderer entry

Inspect path from connect_src to measures_assessment.

Confirm:

- measures_assessment exists in sectionMap
- assessment renderer can initialize from registered key
- required identity fields are available
- activeEvaluationEncounterKey resolves correctly
- no missing state causes blank render
- no legacy key dependency blocks rendering

If measures_assessment is reached but blank, identify exact guard/failure.

### 5. Add temporary diagnostic logging only if needed

If the dead surface cannot be identified by static inspection, add minimal local diagnostic logging gated to development only.

Allowed:

- console.debug for activeSurface changes
- console.debug for post-passage route target
- console.debug for connectSrcNextEncounter

Remove or keep only if explicitly dev-gated and harmless.

Report any logging added.

### 6. Correct bounded route/render seam if proven

Allowed corrections only if the audit proves the failure:

- fix left passage route target
- fix connectSrcNextEncounter assignment
- fix handleAction target resolution
- fix renderer guard that returns empty without fallback
- add visible fallback for missing copy/action payload
- align registered key lookup where legacy-only lookup causes blank page

Do not change architecture.

Do not invent content.

### 7. Audit Vite placeholder warning

Inspect `index.html` and related HTML/template references for unresolved placeholders:

- `%VITE_MANIFEST_HREF%`
- `%VITE_PAGE_URL%`
- `%VITE_PAGE_IMAGE%`
- `%VITE_PAGE_TITLE%`
- `%VITE_PAGE_DESCRIPTION%`

Determine whether placeholders are:

- invalid for Vite runtime replacement
- intended for build-time injection but not configured
- safe to remove
- should be replaced with default literal values
- should be changed to valid Vite env usage

Correct the malformed placeholder only if bounded and safe.

Minimum correction target:

- remove or replace `%VITE_MANIFEST_HREF%` so local dev no longer requests `/%VITE_MANIFEST_HREF%`

Do not alter site branding or content beyond placeholder cleanup.

### 8. Validate

Run:

    npm run build:registry

If available, run local smoke after correction.

Return:

- dead surface identified
- exact cause
- files modified
- DB rows modified if any
- left path route after correction
- activeSurface sequence observed
- build result
- Vite placeholder warning status
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed
- confirmation no deprecated route exposed in intended left path

## DO NOT

- redesign UI
- broadly refactor MeasuresRegistryRuntime.tsx
- edit CSS unless explicitly necessary and reported
- hardcode copy
- hardcode media URLs
- change assessment scoring
- fork structured_eval or measures_assessment mechanics
- implement email dispatch
- implement payment logic
- delete deprecated rows
- change registered 13 sequence
- bypass DB-seated contracts

## SUCCESS CONDITION

The left registered path no longer dead-ends after `eval_passage`.

The flow continues visibly through:

    eval_passage
        -> connect_src
        -> measures_assessment
        -> measures_phases_reveal

The Vite placeholder warning is identified and corrected or explicitly bounded for follow-up.

Build remains clean.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_audit_left_path_post_passage_dead_surface_and_vite_placeholder_warning_v1.meta.md`

## CLOSE

Find the dead surface.

Correct only the active seam.
