---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Correct eval_passage and Assessment Chamber Contract Expression Gaps
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md
  - docs/oar/measures_registry/oar1_seat_measures_registry_material_style_contracts_v1.meta.md
  - docs/oar/measures_registry/oar1_create_minimal_contract_native_css_layer_for_registered_runtime_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - eval_passage
  - measures_assessment
  - structured_eval
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - eval-passage
  - assessment-chamber
  - contract-expression
  - obsidian
  - branding
  - audio-control
  - question-context
  - codex-first
---

# OAR2 — Correct eval_passage and Assessment Chamber Contract Expression Gaps

## SEATING DEFINITION

For this OAR, **seat** means DB contract mutation only.

A contract is seated only when the relevant `measures_encounter_def.metadata` or governed DB contract field is updated and read back from the database.

Renderer changes may only express already-seated DB contract state.

CSS changes may only style already-seated DB contract state.

Do not treat component constants, CSS classes, local copy, fallback values, or JSX changes as seating.

Required order:

1. Inspect DB contract.
2. Update DB contract only where routed.
3. Read back DB contract.
4. Then update renderer/CSS to consume seated contract.
5. Validate browser behavior.

## OBSERVED

Operator QA confirms the prior OAR seated contracts in DB, but browser expression remains incomplete.

The current OAR1 remains open:

    docs/oar/measures_registry/oar1_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md

because browser spot check has not passed.

Two surfaces require contract-expression correction:

1. `eval_passage`
2. `measures_assessment` / `structured_eval`

### eval_passage QA findings

The split-screen direction is present, but:

- audio control is not visible on screen
- secondary action/button placement is incomplete
- page appears to auto-advance or does not clearly preserve user-controlled continuation
- small registry mark appears awkwardly in the far upper-left
- registry mark should be intentionally placed in the upper-left governed frame
- obsidian surface appears too flat
- prior obsidian material background/texture is not clearly expressed

Prior DB contract already seated:

- `layout_mode: split_screen_passage`
- `media_position: left`
- `information_position: right`
- `cta_placement: information_panel_below_copy`
- `audio_control_placement: information_panel_secondary_action`
- `branding_visibility: visible`
- `footer_visibility: visible`
- `styling_contract.material_family: obsidian`

### measures_assessment / structured_eval QA findings

The assessment chamber still does not fully express the seated contract.

Current visible issues:

- question box is not centered
- registry mark floats awkwardly inside the question card
- registry mark should be placed in the upper-left page/brand position
- obsidian styling/background is not sufficiently expressed
- page still feels generic
- title hierarchy feels awkward
- current title text is too large/spread and not refined
- question card does not yet feel like a governed diagnostic chamber

Prior DB contract already seated:

- `surface_mode: diagnostic_chamber`
- `branding_mode: governed_measures_registry`
- `answer_option_style: refined_operational_rows`
- `question_context_visibility: true`
- `layout_mode: diagnostic_question_chamber`
- `card_scale: compact_governed`
- `header_redundancy: false`
- `brand_mark_position: chamber_header_or_background_only`
- per-question `context_statement` for all 5 questions

Therefore this is a contract-expression gap, not a new route or scoring issue.

## ALIGNED

This OAR corrects the browser/runtime expression of already-seated contracts and seats missing contract fields only where required.

Do not change routing.

Do not change assessment scoring.

Do not change assessment questions.

Do not change answer values.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not implement email dispatch.

Do not expose payment logic.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not rewrite `src/index.css`.

Use the registered-runtime CSS layer only:

    src/measures_registry/registered_runtime/styles/

All public copy, layout, branding, and material authority must resolve from DB contract state.

## ROUTED

# PART 1 — eval_passage contract expression correction

## 1. Inspect eval_passage DB contract before mutation

Inspect:

    measures_encounter_def.encounter_key = 'eval_passage'

Return current readback for:

- display_title
- function_layer
- state_expression
- renderer
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.informational_paragraph
- metadata.cta_primary
- metadata.cta_secondary
- metadata.layout_contract
- metadata.styling_contract
- metadata.branding_contract
- metadata.footer_contract
- metadata.media_behavior_contract
- metadata.media_roles
- metadata.background_media_role if present
- metadata.material_background_role if present
- metadata.route_after_capture / transition target if present

Do not infer missing contract from runtime.

## 2. Confirm or seat audio-control contract

Confirm `eval_passage.metadata.layout_contract.audio_control_placement` is seated as:

    information_panel_secondary_action

Confirm `metadata.cta_secondary` is seated as:

    Audio

If missing, seat these DB metadata fields.

Renderer must display secondary audio control from DB contract.

Do not hardcode the audio button label in renderer.

## 3. Confirm or seat user-controlled progression contract

Inspect `eval_passage` media/navigation metadata for any auto-advance behavior.

If public passage is intended to require user control, seat:

    layout_contract.progression_mode: user_controlled
    media_behavior_contract.auto_advance_on_end: false

or equivalent existing metadata shape.

Required behavior:

    video may play
    user chooses Continue to Evaluation
    video end must not silently advance public route unless DB explicitly seats auto_advance_on_end: true

Do not change route target.

Do not disable video playback.

## 4. Confirm or seat branding placement contract

The registry mark should be intentionally placed in the upper-left governed frame.

Inspect current `branding_contract`.

If needed, seat:

    branding_contract.brand_visible: true
    branding_contract.registry_mark_visible: true
    branding_contract.brand_position: upper_left_governed_frame
    branding_contract.mark_position: upper_left
    branding_contract.mark_treatment: restrained
    branding_contract.floating_mark_allowed: false

Required result:

- no awkward isolated mark floating in the far upper-left outside governed frame
- registry mark is intentional and aligned to Measures Registry branding
- brand should not overlap video or copy

If shared header already owns mark placement, route through the shared header/brand pattern rather than duplicating mark markup in the passage.

## 5. Confirm or seat obsidian material background contract

Inspect whether `eval_passage` has seated background/material media role.

Check relevant media mappings for:

- obsidian background
- material background
- passage background
- registry background
- obsidian texture
- explainer video

If obsidian background/media is already seated, renderer/CSS must express it.

If not seated, do not invent a media asset.

If appropriate, seat metadata expectation only:

    styling_contract.background_mode: obsidian_material_field
    styling_contract.material_texture_visibility: true

Report missing media mapping if a specific obsidian background asset is required.

Do not hardcode media URLs.

## 6. Renderer correction — eval_passage

Inspect:

    src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx

For `split_screen_passage`, ensure renderer reads and renders:

- `passageCopy.ctaPrimary`
- `passageCopy.ctaSecondary`
- `layoutContract.audio_control_placement`
- `layoutContract.progression_mode`
- `brandingContract`
- `mediaBehaviorContract.auto_advance_on_end` if seated
- material/background fields if already present in `sectionCopy`

Required visible controls:

- primary CTA: Continue to Evaluation
- secondary audio control: Audio
- audio control visible on right information panel
- controls do not compete with video native controls

Remove or relocate any floating registry mark that is not governed by the branding contract.

Do not hardcode copy.

Do not hardcode route target.

## 7. CSS correction — eval_passage

Use:

    src/measures_registry/registered_runtime/styles/encounters/passage.css

Do not add to `src/index.css`.

Required visual outcome:

- split-screen still holds
- video left
- info panel right
- Measures Registry mark/branding upper-left governed
- audio secondary control visible
- primary CTA visible
- obsidian field/material expression visible
- no awkward floating mark
- footer visible if seated
- single-screen desktop fit
- mobile stacks safely

# PART 2 — measures_assessment / structured_eval contract expression correction

## 8. Inspect assessment DB contracts before mutation

Inspect:

    measures_encounter_def.encounter_key = 'measures_assessment'
    measures_encounter_def.encounter_key = 'structured_eval'

Return current readback for:

- display_title
- function_layer
- state_expression
- renderer
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.assessment_questions / question source
- metadata.layout_contract
- metadata.styling_contract
- metadata.branding_contract
- metadata.footer_contract if present
- metadata.media_behavior_contract
- per-question context_statement readback
- scoring_thresholds / scoring method readback

Do not alter scoring.

## 9. Seat refined assessment public copy contract if needed

The current page title hierarchy feels awkward.

If current public copy is producing the awkward title state, seat cleaner copy in DB metadata.

Suggested public copy:

    eyebrow:
    MEASURES REGISTRY

    title:
    AI Operational Evaluation

    subtitle:
    Answer each prompt to assess whether your current environment can safely support AI acceleration.

Use existing metadata keys where possible.

Do not hardcode title/eyebrow/subtitle in renderer.

## 10. Confirm or seat assessment branding placement contract

Registry mark should not float inside the question card.

Confirm or seat:

    branding_contract.brand_visible: true
    branding_contract.registry_mark_visible: true
    branding_contract.brand_position: upper_left_governed_frame
    branding_contract.mark_position: upper_left
    branding_contract.mark_treatment: restrained
    branding_contract.question_card_mark_visible: false
    layout_contract.brand_mark_position: page_header_or_background_only

Required result:

- registry mark appears in upper-left page/brand position
- no mark inside question card body
- mark does not overlap question text/options
- mark does not float as an orphaned icon

## 11. Confirm or seat assessment centering/layout contract

Question box must be centered and governed.

Confirm or seat:

    layout_contract.question_card_alignment: centered
    layout_contract.question_card_max_width: governed
    layout_contract.question_card_position: centered_below_header
    layout_contract.viewport_fit: single_screen_initial_view
    layout_contract.card_scale: compact_governed
    layout_contract.copy_density: restrained

Required result:

- question card centered horizontally
- question card not overly wide or left-heavy
- page header does not compete with question card
- answer rows fit cleanly in the card

## 12. Confirm or seat obsidian assessment background contract

Confirm or seat:

    styling_contract.material_family: obsidian
    styling_contract.background_mode: obsidian_material_field
    styling_contract.material_texture_visibility: true
    styling_contract.surface_mode: diagnostic_chamber

If a specific background media role is required and missing, report missing media mapping.

Do not hardcode media URLs.

## 13. Preserve per-question context statements

The existing per-question `context_statement` seating must remain.

Required card order:

    progress
    context statement
    question text
    answer options

Do not reintroduce repeated static subtitle in question card.

Do not remove context statements.

## 14. Renderer correction — assessment chamber

Inspect:

    src/measures_registry/MeasuresAssessmentChamber.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx

Required:

- read page-level copy from DB metadata
- render one refined page-level header
- render per-question context statement
- remove card-internal repeated page subtitle
- remove or suppress question-card registry mark if contract says false
- place registry mark via page/header branding if contract says visible
- preserve progress indicator
- preserve answer options
- preserve scoring and routing

Do not hardcode public copy.

Do not change answer values.

## 15. CSS correction — assessment chamber

Use registered-runtime CSS layer only.

Likely file:

    src/measures_registry/registered_runtime/styles/encounters/assessment.css

Do not add to `src/index.css`.

Required visual outcome:

- centered question card
- obsidian diagnostic chamber
- actual obsidian background/material expression where seated
- refined title hierarchy
- registry mark upper-left governed
- no floating mark inside question card
- answer rows refined
- context statement visible and calm
- no repeated static statement
- single-screen initial view where practical
- mobile scroll allowed

# PART 3 — shared validation

## 16. Preserve structure_passage unless shared renderer requires safe handling

If `RegisteredPassage` changes affect `structure_passage`, verify it does not regress.

Do not seat new `structure_passage` contract in this OAR unless required to avoid shared renderer breakage.

## 17. Footer boundary

Preserve current footer standing:

Hidden:

- ai_isnt_broken_intro
- evaluate_structure_path

Visible where already seated or implemented:

- eval_passage
- structure_passage
- connect_src
- measures_phases_reveal
- downstream public surfaces

Assessment footer remains deferred unless specifically seated in this OAR. Do not force footer into `MeasuresAssessmentChamber` unless DB contract is updated and read back first.

## 18. Build validation

Run:

    npm run build:registry

Return clean build result.

## 19. Browser QA

Validate:

    ?surface=eval_passage

Expected:

- split-screen still present
- video left
- information panel right
- Measures Registry branding/mark in intentional upper-left governed position
- no awkward floating mark
- Audio secondary control visible
- Continue to Evaluation visible
- no unintended auto-advance
- obsidian material field visible
- footer visible if seated
- URL remains `?surface=eval_passage`

Validate:

    ?surface=measures_assessment
    ?surface=structured_eval

Expected:

- question card centered
- page title hierarchy refined
- registry mark upper-left governed
- no mark floating inside question card
- obsidian background/material field visible
- context statement visible
- question text visible
- answer rows refined
- no repeated subtitle
- scoring unchanged

Full branch:

    intro
      -> eval_passage
      -> measures_assessment
      -> connect_src

Expected:

- no route regression
- assessment advances to contact capture
- scoring still resolves correctly

## DO NOT

- change routing
- change scoring
- change assessment questions
- change answer values
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- edit old MeasuresRegistryRuntime.tsx
- rewrite src/index.css
- hardcode public copy in renderer
- hardcode media URLs
- invent unseated background media
- treat CSS or JSX as seating
- broaden into all downstream encounters

## VALIDATION REQUIRED

Return:

- DB rows inspected
- DB rows modified, if any
- eval_passage contract before/after
- measures_assessment contract before/after
- structured_eval contract before/after
- audio-control contract readback
- user-controlled progression contract readback
- branding placement contract readback
- obsidian/background contract readback
- media mapping readback for obsidian/background roles
- question context statement readback
- scoring preservation readback
- runtime files modified
- CSS files modified
- old auto-advance behavior source, if present
- new progression behavior
- eval_passage browser QA result
- measures_assessment browser QA result
- structured_eval browser QA result
- full branch QA result
- build result
- confirmation no routing/scoring/contact/email behavior changed
- confirmation old runtime not edited
- confirmation src/index.css not expanded
- confirmation no hardcoded copy/media authority added

## SUCCESS CONDITION

`eval_passage` fully expresses its seated contract:

- split-screen passage
- video left
- branding/copy/actions right
- visible Audio secondary control
- visible Continue primary CTA
- intentional Measures Registry mark placement
- obsidian material field expression
- footer visible where seated
- no unintended auto-advance
- no awkward floating mark

`measures_assessment` and `structured_eval` fully express their seated contracts:

- centered question chamber
- refined title hierarchy
- upper-left governed registry mark
- no mark floating in question card
- obsidian diagnostic background
- per-question context statements
- refined answer rows
- no repeated static copy
- scoring preserved

Build remains clean and browser QA confirms no regression.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_correct_eval_passage_and_assessment_chamber_contract_expression_gaps_v1.meta.md

## CLOSE

The DB contract is authority.

The page must render what was seated.
