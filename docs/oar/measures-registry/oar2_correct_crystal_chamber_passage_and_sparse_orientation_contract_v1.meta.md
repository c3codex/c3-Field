---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime
title: Correct Crystal Chamber Passage and Sparse Orientation Contract
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
surface_scope:
  - structure_passage
  - crystal_chamber
  - foundational_leadership_contact
  - assess_environment_cta
tags:
  - measures-registry
  - crystal-chamber
  - structure-passage
  - runtime-routing
  - chamber-contract
  - oar2
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
  - Measures Registry Operative Concordance Update
---

# OAR2 — Correct Crystal Chamber Passage and Sparse Orientation Contract v1

## OBSERVED

Live audit confirms that:

    https://measuresregistry.com/?surface=structure_passage

is not resolving to the intended right-path Crystal passage contract.

Observed runtime failure:

- structure_passage is rendering a displaced content/card layout.
- The surface behaves like an About / Structural Drift / Foundational Leadership hub.
- The passage talking-head video is not seated as the primary page media.
- The current surface does not cleanly separate passage, chamber, and CTA functions.
- The Crystal Chamber is not yet bound as its own sparse orientation chamber.
- The Questions Explainer video is not positioned at the top of the Crystal Chamber page.
- The page currently answers from the wrong surface authority.

This is a surface-key / chamber-contract routing issue.

It is not a copy-only issue.

## ALIGNED

Correct right-path structure:

    Understand the Environment
    -> structure_passage
       - talking-head passage video
       - Measures Registry position paragraph
       - auto-advance on video end
       - manual continue / skip / mute controls

    -> crystal_chamber
       - Questions Explainer video at top
       - Structural Drift section
       - Foundational Leadership CTA
       - Assess the Environment CTA

    -> Assess the Environment path
       - eval_passage
       - contact capture
       - Measures AI Operational Evaluation

The passage page introduces the Measures Registry position.

The Crystal Chamber page explains the questions and gives sparse orientation.

The Foundational Leadership CTA should route toward assessment or conversation without implying conversion, approval, c3 Key issuance, DAO standing, payment, permission, certification, or recognition.

Frontend must not invent missing truth.

The renderer must read seated contract state.

## ROUTED

### 1. Rebind structure_passage

Bind structure_passage as the right-path talking-head passage surface.

Required render:

- Primary media: passage talking-head video.
- Supporting copy: Measures Registry position paragraph.
- Controls:
  - mute / unmute
  - skip
  - continue
- Behavior:
  - auto-advance to crystal_chamber when video ends
  - manual continue remains available as fallback
  - skip routes to crystal_chamber

Required exclusions:

structure_passage must not render:

- Questions Explainer video
- full About Measures Registry page
- Structural Drift publication card-grid
- Foundational Leadership hub-card layout
- deprecated right-path education shell
- metadata bleed
- oversized registry mark

### 2. Seat Measures Registry position paragraph on structure_passage

Use this position paragraph unless a DB-seated copy block already exists and is more current:

    Measures Registry provides integrity governance for AI-accelerated systems. AI drift is not only a model problem. It is amplified by ungoverned authority, unclear roles, exposed runtime surfaces, missing review pathways, and implementation conditions that have not been structured. Measures Registry helps institutions identify the conditions shaping AI behavior, recognize drift-amplifying factors, and move toward governed action where appropriate.

This paragraph belongs with the talking-head passage video.

### 3. Bind crystal_chamber as sparse orientation chamber

crystal_chamber must render as the next registered chamber surface after structure_passage.

Required render order:

    1. Questions Explainer video
    2. Structural Drift section
    3. Foundational Leadership CTA
    4. Assess the Environment CTA

The Crystal Chamber is intentionally sparse at this stage.

It should not render as a dense content hub.

### 4. Questions Explainer video placement

The Questions Explainer video must appear at the top of the Crystal Chamber page.

Purpose:

    Explain why the questions matter and what they reveal about AI implementation conditions, system authority, runtime exposure, review pathways, and structural drift.

The Questions Explainer video must not appear on structure_passage.

### 5. Structural Drift section

The Structural Drift section belongs on crystal_chamber.

Purpose:

    Name the problem Measures Registry evaluates.

This section may briefly introduce Structural Drift and may link or route to the public Structural Drift publication if the route is already seated.

### 6. Foundational Leadership CTA

The Foundational Leadership CTA belongs on crystal_chamber.

Purpose:

    Invite serious institutional conversation without implying approval, implementation, access, registry standing, c3 Key issuance, DAO participation, conversion, certification, recognition, payment, or permission.

### 7. Assess the Environment CTA

The primary action from crystal_chamber should route the visitor to Assess the Environment.

Target route:

    ?surface=eval_passage

or the current registered equivalent for the left-path assessment passage.

### 8. Auto-advance requirement

structure_passage video must auto-advance to crystal_chamber when complete.

Implementation behavior:

    on video ended:
      route to crystal_chamber

Fallback:

    Manual Continue button must remain available.

This prevents visitor stall if the browser blocks autoplay behavior, the video-end event fails, or the user skips the video.

### 9. Runtime authority boundary

Correct authority path:

    registered chamber contract
    -> surface key
    -> media map
    -> copy block / metadata
    -> renderer

Incorrect authority path:

    frontend fallback
    -> hardcoded card grid
    -> displaced About content
    -> structure_passage

Remove, deprecate, or block any fallback that causes structure_passage to render as the About / Structural Drift / Foundational Leadership card hub.

### 10. Deprecation and rebinding

Deprecate or disconnect current behavior:

    structure_passage = card-grid education hub

Rebind as:

    structure_passage = talking-head passage + Measures Registry position paragraph

Bind or confirm:

    crystal_chamber = sparse orientation chamber

Do not collapse these into one surface.

## CODY ROLE

Cody may:

- inspect the bounded runtime files required for surface routing
- correct registered chamber contract resolution
- bind structure_passage to the talking-head passage contract
- bind crystal_chamber to the sparse orientation contract
- wire video-ended auto-advance to crystal_chamber
- preserve manual continue / skip / mute controls
- correct CTA routing to Assess the Environment
- remove or block displaced fallback rendering for these surfaces

Cody may not:

- invent new public conversion logic
- expose pricing
- issue or imply c3 Key standing
- create payment standing
- create certification or recognition language
- collapse passage and chamber into one surface
- hardcode frontend truth where DB/registry contract should govern
- expand beyond the bounded Crystal right-path correction

## EXPECTED RUNTIME TOUCHPOINTS

Inspect and correct only the bounded files required for:

- surface routing
- registered chamber contract resolution
- right-path Crystal media map
- structure_passage render contract
- crystal_chamber render contract
- video end auto-advance behavior
- CTA route target
- style/metadata bleed correction where directly attached to this seam

Likely touchpoints may include:

- MeasuresRegistryRuntimeRegistered.tsx
- registered encounter / chamber contract definitions
- surface route resolver
- media map / encounter media registry
- right-path copy blocks
- style contract binding

Do not perform a broad refactor unless the resolver failure requires it.

## VALIDATION

Cody must verify local runtime and deployed runtime.

### URL check: structure_passage

URL:

    https://measuresregistry.com/?surface=structure_passage

Expected:

- talking-head passage video appears
- Measures Registry position paragraph appears
- no card-grid hub
- no Questions Explainer video
- no metadata bleed
- correctly scaled registry mark
- mute / skip / continue controls available
- video auto-advances to crystal_chamber

### URL check: crystal_chamber

URL:

    https://measuresregistry.com/?surface=crystal_chamber

Expected:

- Questions Explainer video appears at top
- page is sparse
- Structural Drift section appears
- Foundational Leadership CTA appears
- Assess the Environment CTA appears
- CTA routes to assessment path
- no displaced passage content

## EXPECTED OAR1

After execution, Cody must write OAR1 beside this OAR2.

Expected path:

    docs/oar/measures-registry/oar1_correct_crystal_chamber_passage_and_sparse_orientation_contract_v1.meta.md

OAR1 must report:

- files changed
- surface keys corrected
- deprecated/fallback behavior removed or blocked
- auto-advance behavior confirmed
- local runtime validation
- deployed runtime validation
- unresolved media/copy dependency, if any

## STANDING

This OAR2 does not create a new conversion route.

This OAR2 does not authorize public pricing.

This OAR2 does not issue c3 Key standing.

This OAR2 does not create permission, payment, DAO, recognition, certification, or distribution standing.

This OAR2 only corrects right-path Crystal routing, passage behavior, sparse chamber orientation, and assessment CTA flow.

## CLOSE

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes from OAR2 only.
src renders seated state only.
