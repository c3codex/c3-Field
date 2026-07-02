---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_regression
title: OAR2 - Restore Encounter Route, Media, and Result Surface Resolution After Runtime Removal
status: proposed
version: v1
operator: op044
system: measures_registry

native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor

environment: measures_registry
release_state: working
surface_family: crystal_obsidian_marble
route_phase: regression_repair
oar_parent: launch_style_normalization

tags:
  - measures_registry
  - regression
  - route_resolution
  - media_audio
  - assessment
  - marble_results
  - runtime_removal
  - launch_qa
---

# OBJECTIVE

Stop page-by-page patching and restore the active encounter route, media control, content visibility, and assessment result handoff after runtime removal.

Do not continue styling until route/state resolution is verified.

# OBSERVED

Repeated QA issues remain unresolved:

- fullscreen intro behavior still incorrect
- audio has no video audio control
- About page does not show all seated content
- /ai-operations-assessment does not resolve to the assessment
- Marble orientation loads
- assessment result payload appears on the wrong Marble surface
- removed runtime may have removed or bypassed active resolver/state bridge

# ALIGNED

Frontend does not author truth.

Routes, surfaces, media, and result handoff must resolve through seated registry state.

Active flow must be:

Threshold
    -> crystal_seat_threshold
    -> obsidian_chamber_orientation
    -> /ai-operations-assessment
    -> obsidian_chamber_encounter_surface
    -> obsidian_chamber_C1_compact
    -> marble_chamber_orientation
    -> marble_chamber_results
    -> marble_chamber_C2_compact

Marble orientation is not the result surface.

marble_chamber_results is the result surface.

# ROUTED

## 1. Route Map Verification

Cody must inspect and report the active route map.

Required:

/ai-operations-assessment
    must resolve to obsidian_chamber_encounter_surface

/map-integrity-governance
    must remain legacy_route_alias only

No stale runtime route may override registered surface routing.

## 2. Runtime Removal Regression Check

Inspect the runtime removal commit/worktree change.

Determine whether removal affected:

- encounter resolver
- route surface map
- pending assessment result state
- session storage handoff
- marble_chamber_results dispatch
- media control bridge
- about content renderer
- fullscreen intro gate

If removed runtime was still carrying active resolver/state behavior, restore only the needed resolver/state bridge under registry-governed names.

Do not restore deprecated runtime as authority.

## 3. Fullscreen Intro Behavior

Verify intro fullscreen behavior.

Allowed fullscreen surfaces only:

- initial intro/media surfaces explicitly seated for fullscreen

Not allowed:

- About page
- unDrifted publication page
- assessment surface
- contact capture
- marble orientation
- marble results
- MAP

If fullscreen lock styles leak, isolate them to the intended intro shell only.

## 4. Video Audio Control

Audio failure exists on desktop and iPad.

Cody must inspect actual media assets and video elements.

Report:

- asset path
- has audio track yes/no
- muted/defaultMuted state
- volume state
- controls presence
- click handler target
- content-type/CORS if relevant

Required behavior:

Enable Tone
    controls material tone bed only

Enable Video Audio
    controls explainer/media video audio only

If asset has audio:

- user click must set video.muted = false
- set video.volume = 1
- call video.play()
- show enabled state

If asset has no audio:

- report exact asset as silent in OAR1
- do not fake audio control

## 5. About Content Visibility

Restore all seated About content.

Inspect:

- about page wrapper
- crystal longform wrapper
- media wrapper
- section renderer
- mobile/iPad CSS

Remove clipping/leakage:

- height: 100vh where longform needed
- overflow: hidden on longform/publication
- display:none from inactive surface styles
- fixed shell wrappers leaking from encounter intro

Do not invent About copy.
Render all seated DB/content-profile sections.

## 6. Marble Result Surface Handoff

Correct result handoff.

Assessment completion must produce pending report state.

Then:

marble_chamber_orientation
    displays only orientation / findings preparing content

marble_chamber_results
    displays PublicAssessmentResult / assessment findings

marble_chamber_C2_compact
    displays MAP recommendation and CARs

Rules:

- marble_chamber_orientation must not render the assessment result
- marble_chamber_results must not be skipped
- stale pending result must be cleared or replaced per new assessment
- wrong surface payload must be corrected

## 7. Validation Route Walk

Cody must perform route walk evidence:

1. Open threshold.
2. Open /ai-operations-assessment directly.
3. Complete assessment.
4. Complete contact capture.
5. Verify marble orientation.
6. Continue to marble results.
7. Continue to MAP.
8. Verify About page content.
9. Verify unDrifted scroll.
10. Verify video audio control behavior.

# DO NOT TOUCH

This OAR does not authorize:

- scoring changes
- assessment question changes
- pricing changes
- Stripe changes
- certification language
- SEAT activation
- c3 Key activation
- DAO claims
- new content invention
- restoring deprecated runtime authority

# CODY ROLE

Cody must:

1. Stop surface styling patch loop.
2. Inspect route/state/media regressions first.
3. Restore registry-governed route resolution.
4. Restore video audio control or report silent assets.
5. Restore About content visibility.
6. Correct assessment result handoff to marble_chamber_results.
7. Preserve all current material styles that are already working.
8. Run build/type validation.
9. Write OAR1 with exact files changed, route evidence, and remaining gaps.

# VALIDATION

Success when:

- /ai-operations-assessment opens the assessment surface.
- Fullscreen intro behavior is limited to intended intro/media surfaces.
- About page shows all seated content.
- unDrifted scrolls on iPad.
- Video audio control works where asset has audio.
- Silent media assets are explicitly reported if no audio track exists.
- marble_chamber_orientation does not show assessment results.
- marble_chamber_results shows the correct current assessment result.
- MAP receives the correct selected pathway.
- No deprecated runtime authority is restored.
- Build/typecheck passes or exact failure is reported.

# EXPECTED OAR1

oar1_restore_encounter_route_media_and_result_surface_resolution_after_runtime_removal_v1.meta.md

# CLOSE

Stop styling the symptom.

Restore the route.
Restore the handoff.
Restore the media control.
Restore the seated content.

Then style what still remains.
