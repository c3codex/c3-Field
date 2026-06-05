---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_correction
title: Correct Laptop Viewport Frame Containment for Assessment and Crystal Chamber
status: proposed
version: v1
operator: op044
system: measures_registry
executor_role: claude_cody_compatible_executor
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
surface_scope:
  - measures_assessment
  - crystal_chamber
  - structure_passage
  - laptop_viewport_frame
  - one_page_layout_contract
tags:
  - measures-registry
  - viewport
  - laptop-frame
  - assessment
  - crystal-chamber
  - responsive-design
  - claude-executor
  - oar2
source_alignment:
  - oar1_audit_and_enforce_sitewide_style_contract_composition_v1
  - oar1_restore_seated_runtime_data_and_run_full_visual_qa_v1
  - oar1_derive_runtime_visual_system_from_existing_launch_media_v1
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Correct Laptop Viewport Frame Containment for Assessment and Crystal Chamber v1

## OBSERVED

Recent work corrected part of the sitewide style contract.

The sitewide style contract closeout confirmed:

    sitewide style contract exists
    button governance was partial and corrected
    native video controls were removed where custom controls existed
    Crystal Chamber video received custom Audio/Mute toggle
    build passed
    no DB mutation
    no deployment

However, screenshots from operator live review show the public runtime still violates laptop viewport containment.

Current visual defects:

1. `?surface=measures_assessment` still feels oversized and vertically frame-heavy on laptop.
2. `?surface=crystal_chamber` pushes lower content outside the visible laptop page frame.
3. The Crystal video, publication row, and CTA areas are still not composed into a controlled one-page chamber frame.
4. The page relies too much on overflow/scroll for desktop chamber surfaces.
5. The sitewide style contract is improved, but the one-page layout contract is not enforcing laptop-class containment.

This is a viewport-frame correction.

This is not a brand redesign.

This is not a new visual layer.

---

## ALIGNED

The public runtime must preserve a one-page encounter standard where the chamber contract requires it.

For laptop-class viewports, the encounter must remain inside the usable browser frame as much as possible.

Target viewport:

    1366x768

Also validate against operator live frame where possible.

Design rule:

    The existing visual system must fit the laptop frame.

Do not add a new visual direction.

Do not rewrite the brand.

Correct containment, spacing, scale, and density only.

---

## ROUTED

## 1. Correct AI Operations Assessment laptop frame containment

Surface:

    ?surface=measures_assessment

Required:

    - reduce excessive top spacing
    - reduce title/header vertical footprint
    - reduce assessment panel max-height where needed
    - tighten question block spacing
    - keep reference statement, question, all three answers, and controls visible or immediately reachable
    - prevent the assessment panel from dominating the entire page frame
    - preserve branded obsidian diagnostic feel
    - preserve seven-question flow
    - preserve reference statements
    - preserve scoring logic

Question 5 remains required validation.

Acceptance at 1366x768:

    - question 5 reference statement visible
    - question 5 text visible
    - all three answer choices visible
    - controls visible or immediately reachable
    - no primary assessment content appears clipped by the visible page frame

---

## 2. Correct Crystal Chamber laptop frame containment

Surface:

    ?surface=crystal_chamber

Required:

    - reduce vertical spacing above title
    - reduce title block height where needed
    - reduce Questions video height or constrain media plate height
    - ensure the video sits within a controlled cinematic media zone
    - bring Structural Drift/publication/CTA area higher into the laptop frame
    - avoid content beginning below the visible page frame because of oversized hero/video spacing
    - preserve Crystal field derived from launch media
    - preserve Questions video
    - preserve Structural Drift publication encounter
    - preserve Foundational Leadership CTA
    - preserve Assess CTA

Acceptance at 1366x768:

    - title visible
    - Questions video visible and contained
    - at least the top of the Structural Drift / CTA zone is visible without deep scroll
    - page does not feel like the video consumes the whole chamber
    - no generic native video controls appear

---

## 3. Correct structure_passage frame if affected

Surface:

    ?surface=structure_passage

Required:

    - preserve current visual improvement
    - avoid oversized copy/video panel on laptop
    - keep controls visible
    - do not regress custom media controls
    - do not restore generic buttons

Only adjust if current shared frame rules affect passage overflow.

---

## 4. Enforce one-page layout contract for desktop/laptop

Claude must inspect the one-page layout behavior for:

    assessment
    sparse_chamber
    passage

Required correction may include:

    - clamp() typography
    - max-height calculations
    - viewport-based spacing
    - compact mode for <= 800px viewport height
    - reduced media plate aspect height
    - controlled overflow inside subpanels instead of full-page uncontrolled overflow
    - footer density reduction where footer competes with encounter content

Preferred approach:

    Add or correct responsive containment rules in the shared style contract.

Avoid:

    surface-specific magic numbers unless clearly bounded
    new visual system
    new asset dependencies
    route changes
    content mutation

---

## 5. Preserve sitewide style contract corrections

Do not regress the prior sitewide style contract correction.

Preserve:

    - governed button / CTA band treatment
    - removed native video controls where custom controls exist
    - Crystal Chamber Audio/Mute toggle
    - auto-advance behavior where DB contract already controls it
    - no generic full-border button return
    - no duplicated CTA styles

---

## 6. Preserve runtime and data boundaries

Do not regress:

    understand_environment alias to structure_passage
    structure_passage continuation to crystal_chamber
    AI Operations Assessment title
    seven-question assessment flow
    reference statements
    question 5 usability
    contact/consent no-standing language
    Crystal Questions video
    Structural Drift publication cover
    Foundational Leadership CTA
    Assess CTA
    footer copy
    internal Lapis launch chamber exclusion
    Marble held boundary

---

## 7. Screenshot validation required

Required screenshots or visual notes:

    measures_assessment question 5 at 1366x768
    crystal_chamber at 1366x768
    structure_passage at 1366x768 if affected
    crystal_chamber at 1440x900
    measures_assessment question 5 at 1440x900

Expected output path:

    docs/oar/measures-registry/visual-validation-laptop-frame-containment/

Pass requires:

    - assessment question 5 fits laptop frame
    - Crystal Chamber video no longer pushes all lower content outside usable frame
    - CTA/publication zone begins within the visible laptop frame or immediately below without deep scroll
    - no native/generic video chrome reappears
    - governed CTA band treatment remains active
    - build passes

---

## CLAUDE EXECUTOR ROLE

Claude may execute as Cody-compatible executor.

Claude may:

    - correct responsive containment CSS
    - correct shared one-page layout rules
    - reduce vertical spacing and media plate height
    - preserve existing visual-source contract
    - preserve current routing and runtime logic
    - capture screenshots
    - write OAR1 closeout

Claude may not:

    - mutate DB
    - deploy
    - alter scoring
    - alter assessment questions
    - submit contact form
    - hardcode media URLs
    - invent media authority
    - create new assets
    - open Marble
    - expose internal Lapis launch chamber
    - add pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
    - rewrite SEO/social metadata
    - redesign the site beyond viewport containment

---

## EXPECTED TOUCHPOINTS

Likely touchpoints:

    src/measures_registry/registered_runtime/styles/registry.visual-system.css
    src/measures_registry/registered_runtime/styles/registry.layout.css
    src/measures_registry/registered_runtime/styles/registry.materials.css
    src/measures_registry/registered_runtime/styles/encounters/public_understand.css
    src/measures_registry/registered_runtime/styles/encounters/assessment.css
    src/measures_registry/PublicAssessmentSurface.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx

No DB mutation.

No deployment.

---

## VALIDATION

Run if runtime files change:

    npm.cmd run build:registry

Expected:

    build passes
    no DB mutation
    no deployment
    assessment question 5 fits at 1366x768
    Crystal Chamber fits laptop frame better
    sitewide controls remain governed
    boundary preserved

---

## EXPECTED OAR1

Expected path:

    docs/oar/measures-registry/oar1_correct_laptop_viewport_frame_containment_for_assessment_and_crystal_chamber_v1.meta.md

OAR1 must report:

    files changed
    assessment containment correction
    Crystal Chamber containment correction
    structure_passage standing if affected
    screenshots captured
    build result
    remaining defects
    no DB mutation
    no deployment
    boundary validation
    recommended next OAR

---

## STANDING

This OAR2 corrects laptop viewport frame containment only.

It does not authorize DB mutation, deployment, SEO rewrite, pricing, payment, c3 Key issuance, conversion, certification, DAO standing, permission, recognition, distribution, or Marble release.

## CLOSE

The sitewide contract is improving.

Now the encounter must fit the frame.

A chamber is not launch-grade if the laptop cannot hold it.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Claude executes as Cody-compatible executor from OAR2 only.
src renders seated state only.
