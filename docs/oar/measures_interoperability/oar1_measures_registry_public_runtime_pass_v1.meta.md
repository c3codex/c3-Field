---
document_type: oar1
authority_level: recorded
document_scope: measures_registry_public_runtime_pass
title: OAR1 Measures Registry Public Runtime Pass
status: completed
version: v1
operator: op044
system: measures_registry
session_scope: measures_interoperability
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_public_runtime_pass_v1.meta.md
execution_order: Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src
created: 2026-06-02
tags:
  - oar1
  - measures-interoperability
  - measures-registry
  - public-runtime-pass
  - assess-environment
  - understand-environment
  - render-seated-public-state-only
  - system-chambers-held
  - private-runtime-pruned
  - deployed-by-git-push
  - assessment-contract-held
  - not-deployed
---

# OAR1 Measures Registry Public Runtime Pass v1

## Execution Summary

The Measures Registry public runtime pass was implemented in `src` as a renderer-only pass.

No DB mutation was performed.

Initial runtime implementation was not deployed until later operator confirmation.

No runtime final pass was executed.

The implementation keeps public runtime limited to:

- Assess the Environment
- Understand the Environment

Renderer rule preserved:

`render_seated_public_state_only`

## Source Changes

Implemented public-runtime support in:

- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredPublicAssessment.tsx`
- `src/measures_registry/registered_runtime/styles/encounters/public_understand.css`
- `src/measures_registry/registered_runtime/styles/registry.runtime.css`
- `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts`
- `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`
- `src/measures_registry/PublicAssessmentSurface.tsx`
- `src/measures_registry/PublicAssessmentResult.tsx`

Removed previous/private runtime drift from `src`:

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredConnectSrc.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredReserveSeat.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredPhasePayment.tsx`
- `src/measures_registry/registered_runtime/styles/encounters/contact_capture.css`
- `src/measures_registry/registered_runtime/styles/encounters/phases_reveal.css`
- `src/measures_registry/registered_runtime/styles/encounters/about.css`

## Understand the Environment

`structure_passage` now renders a public Understand surface using seated `structure_passage.metadata.crystal_chamber_content_contracts`.

Rendered public areas:

- `understand_environment_passage`
- `about_measures_registry_encounter`
- `structural_drift_publication_contract`
- `foundational_leadership_block`
- `questions_ungoverned_systems_cannot_answer_video`
- `c3_map_education_encounter`
- `measures_conversion_education_encounter`
- `assess_environment_cta_encounter`

The talking-head passage video remains distinct from the Questions Ungoverned Systems explainer video.

The Questions video is rendered as a contained 16:9 education panel with `object-fit: contain`, controls enabled, and no crop behavior.

Structural Drift rendering uses seated publication state. If publication state is absent, the renderer displays the seated held-link copy rather than inventing a URL.

The Understand CTA routes to the Assess passage only.

## Assess the Environment

The public assessment path remains active through:

- assessment passage
- scoped public assessment intake
- 7-question scored assessment
- public-safe result
- governed pathway recommendation labels only

Assessment completion no longer exposes the structured/private continuation bridge in public mode.

Public pathway labels rendered from seated boundary metadata:

- AI Environment Review
- MAP the Environment
- Foundational Measures Registry Cohort

Private route mechanics remain held outside public runtime.

## Private Runtime Pruning

The registered runtime no longer carries previous/private renderer files in `src`.

Removed source-resident route/render drift for:

- `connect_src`
- `structured_eval`
- `measures_eval_email_contract`
- `measures_phases_reveal`
- `about_measures_registry`
- `reserve_seat`
- `phase_payment`

The previous `PUBLIC_HELD_SURFACES` redirect guard was removed because those surfaces are no longer valid registered runtime surfaces.

Active public runtime surfaces are limited to:

- `intro`
- `path_choice`
- `eval_passage`
- `measures_assessment`
- `structure_passage`
- `structural_drift_dispatches`
- `publication_dispatch`

## Media Resolution

`measures_media_map.metadata` is now selected for registered runtime media rows.

`mediaUrl()` now respects seated media metadata:

- `metadata.public_url`
- `metadata.exact_url_seated`
- `metadata.storage_provider`

This allows `questions_ungoverned_systems_cannot_answer_video` to resolve from its seated R2 public URL without requiring frontend fallback authority.

## Validation

`npm.cmd run build:registry`

Result:

PASS

Build notes:

- `VITE_R2_PUBLIC_BASE_URL` remains missing locally, but the new media resolver uses seated `metadata.public_url` for the Questions video.
- Vite reported the existing chunk-size warning.
- Browserslist reported the existing stale-data notice.
- Generated `dist-registry` output was restored/removed after validation because deployment is triggered by Git push from the `measures` branch, not by committing local build artifacts.

Source validation:

- `questions_ungoverned_systems_cannot_answer_video` is registered and rendered.
- `measures_media_map` registered runtime select includes `metadata`.
- public Understand surface is scoped by `data-public-path="understand_environment"`.
- public assessment completion uses `publicResultBoundary`.
- `RegisteredPublicUnderstand.tsx` and `PublicAssessmentResult.tsx` contain no public strings for C1, C2, C3, commerce circuit, wallet connect, temp payment provider, c3 Key, SRC binding, permission standing, recognition standing, conversion standing, certification standing, DAO standing, or distribution standing.
- fixed-string route search found no `src/measures_registry` matches for: `connect_src`, `MeasuresAssessmentChamber`, `MeasuresAssessmentResult`, `RegisteredAssessment`, `5 question`, `commerce circuit`, `C1 / C2 / C3`, `payment standing`, `permission standing`, `conversion standing`, `SRC binding`, or `PUBLIC_HELD_SURFACES`.

Git validation:

- Public runtime implementation commit: `dc16385 Implement measures public runtime pass`
- Private runtime pruning commit: `2834b08 Prune measures private runtime drift`
- Branch pushed: `measures -> origin/measures`
- Deploy trigger mode: Git push

Browser smoke note:

A local dev server was started on `127.0.0.1:4187`, but browser automation was blocked because the bundled Playwright package was missing `playwright-core`. No screenshot claim is recorded.

## Boundary Confirmation

This pass did not implement:

- live MAP execution
- guided asset creation workflow
- MAP findings delivery
- payment route
- wallet route
- c3 Key issuance
- temp c3 Key issuance
- SRC binding mechanics
- permission standing
- recognition standing
- conversion standing
- certification standing
- DAO standing
- distribution standing
- pricing

No hardcoded truth was introduced.

No fallback authority was introduced.

No alternate routing authority was introduced.

DB/runtime metadata remains the source of public content and media state.

## Standing

OAR2 execution is complete for the public runtime pass.

Previous/private runtime drift has been removed from `src`.

The confirmed build and deploy were completed by Git push to `origin/measures`.

Full runtime final pass remains separate from this public runtime pass.

## Amendment: Assessment Contract Loading Correction

Operator NotChazz flag received after deployment:

- `/?surface=measures_assessment` was active.
- `connect_src` was no longer exposed.
- Assessment progress still displayed `1 of 5`.
- Expected public flow was the seated 7-question Measures AI Operational Evaluation.
- Renderer appeared to be loading legacy/static/fallback assessment body rather than the seated registered chamber contract.

### Audit Findings

Source audit confirmed:

- No local static 5-question array remains in `src/measures_registry`.
- `measures_assessment` rendered questions from `measures_encounter_def.metadata.assessment_mechanics.questions`.
- The renderer accepted whatever question count that metadata supplied.
- `resolveEnvironmentalReportByScore()` still contained a legacy deterministic fallback when scoring thresholds were absent.

Live DB readback confirmed:

- `measures_assessment.metadata.active_contract_key_reconciliation.active_contract_keys` includes `measures_assessment_contract`.
- The active contract definition states the assessment contract presents seven scored questions.
- The only live question carrier on the row is `metadata.assessment_mechanics`.
- `metadata.assessment_mechanics.questions` currently contains 5 questions.
- Therefore the 7-question registered chamber body is not seated in the live `measures_assessment` row.

### Correction Applied

Source correction applied in:

- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`
- `src/measures_registry/registered_runtime/renderers/RegisteredPublicAssessment.tsx`
- `src/measures_registry/PublicAssessmentSurface.tsx`
- `src/measures_registry/registered_runtime/styles/encounters/assessment.css`

Correction behavior:

- Public assessment now requires the seated `measures_assessment_contract`.
- Public assessment now requires exactly 7 validated questions.
- If the question contract is missing or malformed, no questions render.
- If the live row supplies 5 questions, the renderer displays a public-safe held state.
- Submit path refuses malformed question contracts.
- Scoring fallback was removed so malformed metadata cannot resolve through legacy interpretation logic.

Held public copy rendered from current registry standing:

`Assessment question contract is incomplete.`

Readback detail:

`Expected 7 seated questions; found 5.`

### Browser Verification

Local preview route:

`http://127.0.0.1:4187/?surface=measures_assessment`

Desktop browser automation result:

- `1 of 5`: NOT SHOWN
- `1 of 7`: NOT SHOWN
- held state: SHOWN
- incomplete contract message: SHOWN
- expected/found message: SHOWN
- `connect_src`: NOT SHOWN

Mobile browser automation result:

- `1 of 5`: NOT SHOWN
- `1 of 7`: NOT SHOWN
- held state: SHOWN
- question form count: 0
- result surface count: 0
- body width equals viewport width

### Deployment Standing

No deployment was performed for this amendment.

Deployment remains held because the browser could not truthfully validate `1 OF 7`.

The renderer correction passes build and prevents legacy 5-question exposure, but live DB seating of the complete 7-question registered chamber contract remains required before public route deployment.

### Required Next Bounded Route

Open a bounded DB/OAR2 seating pass for:

- seating the actual 7-question `measures_assessment_contract` body into the live Measures Registry runtime authority surface
- preserving active contract keys
- preserving public boundary prohibitions
- verifying `/?surface=measures_assessment` renders `1 OF 7`
- verifying result boundary remains public-safe
