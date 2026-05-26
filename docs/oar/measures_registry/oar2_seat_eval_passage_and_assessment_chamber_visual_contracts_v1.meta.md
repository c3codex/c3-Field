---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Seat eval_passage and Assessment Chamber Visual Contracts
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
  - docs/oar/measures_registry/oar1_read_only_sitewide_style_contract_and_runtime_token_seating_audit_v1.meta.md
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
  - visual-contract
  - obsidian
  - split-screen
  - question-context
  - codex-first
---

# OAR2 — Seat eval_passage and Assessment Chamber Visual Contracts

## OBSERVED

The clean registered runtime now loads through passage, evaluation, contact capture, and downstream surfaces.

A minimal contract-native CSS layer has been created for the registered runtime:

    src/measures_registry/registered_runtime/styles/

Visual QA confirms the runtime holds together after this layer was introduced.

Remaining issue is encounter-level contract expression.

Two reviewed encounters require contract seating before further styling:

1. `eval_passage`
2. `measures_assessment` / `structured_eval`

### eval_passage current issue

The current passage page still reads as stacked fragments:

- video block
- detached controls
- copy below the fold
- CTA not integrated with informational content
- Measures Registry branding not sufficiently expressed on the passage surface
- footer/copyright boundary should begin here

Operator direction:

    eval_passage should become a left/right split:
    video on the left,
    Measures Registry branding and informative paragraph on the right,
    all fit to screen.

### measures_assessment current issue

The current assessment surface has redundant content and weak governed presentation:

- page header and question card repeat the same statement
- each question lacks its own contextual statement
- small mark appears awkwardly inside the question card
- answer rows feel visually heavy
- obsidian styling is inconsistent
- the surface does not yet feel like a governed Measures Registry diagnostic chamber

Operator direction:

    Each question block should have a different statement aligned with the question.
    The chamber should be obsidian with consistent Measures Registry branding.

## ALIGNED

This OAR seats the visual contracts first, then permits runtime/CSS changes to render seated state.

No visual preference becomes authority unless seated.

No hardcoded copy in renderer.

No hardcoded layout authority in CSS without DB contract support.

This OAR is encounter-contract focused.

Do not change routing.

Do not change assessment scoring.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not change accepted intro/threshold behavior.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not rewrite `src/index.css`.

Use the minimal registered-runtime CSS layer.

## ROUTED

## PART 1 — Seat eval_passage split-screen passage contract

### 1. Inspect current eval_passage contract

Inspect DB row:

    measures_encounter_def.encounter_key = 'eval_passage'

Return current:

- display_title
- function_layer
- state_expression
- renderer
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.body / paragraph / copy blocks
- metadata.layout_contract
- metadata.styling_contract
- metadata.branding_contract
- metadata.footer_contract
- metadata.media_behavior_contract
- metadata.media_roles
- metadata.cta_primary
- metadata.route_after_capture / transition target if present

### 2. Seat eval_passage layout contract

Update `eval_passage.metadata.layout_contract` to express:

    layout_mode: split_screen_passage
    viewport_fit: single_screen
    media_position: left
    information_position: right
    cta_placement: information_panel_below_copy
    audio_control_placement: information_panel_secondary_action
    footer_visibility: visible
    branding_visibility: visible
    mobile_layout: media_first_then_information

Do not disturb route target.

### 3. Seat eval_passage branding contract

Update or add `eval_passage.metadata.branding_contract`:

    brand_visible: true
    brand_label: Measures Registry
    brand_position: information_panel_top
    registry_mark_visible: true
    header_mode: downstream_governed
    footer_visible: true

The first two entry surfaces remain footer-hidden:

    ai_isnt_broken_intro
    evaluate_structure_path

Footer visibility begins at:

    eval_passage

### 4. Seat eval_passage copy contract

Update `eval_passage` copy fields so renderer can read them without hardcoded fallback.

Suggested seated copy:

    eyebrow:
    ASSESSMENT READINESS

    title:
    How does the operational environment shape AI behavior?

    informational_paragraph:
    AI instability often develops inside unstructured environments where oversight, connected systems, external tools, and operational decisions are not fully visible or clearly governed. This evaluation identifies whether your current structure can safely support AI acceleration.

    cta_primary:
    Continue to Evaluation

    cta_secondary:
    Audio

If existing fields use different keys, preserve existing shape where practical and add only bounded keys needed for renderer consumption.

### 5. Seat eval_passage media behavior contract

Confirm or update:

    media_behavior_contract.autoplay: deferred_to_renderer
    media_behavior_contract.mute_state: muted_on_entry
    media_behavior_contract.encounter_scoped: true
    media_behavior_contract.persistence_boundary: encounter
    media_roles: explainer_video

Do not change media asset.

## PART 2 — Seat measures_assessment / structured_eval obsidian chamber contract

### 6. Inspect current assessment contracts

Inspect DB rows:

    measures_encounter_def.encounter_key = 'measures_assessment'
    measures_encounter_def.encounter_key = 'structured_eval'

Return current:

- display_title
- function_layer
- state_expression
- renderer
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.assessment_questions or question source
- metadata.assessment_interpretation
- metadata.scoring_thresholds
- metadata.layout_contract
- metadata.styling_contract
- metadata.branding_contract
- metadata.media_behavior_contract

### 7. Seat obsidian diagnostic chamber visual contract

For both `measures_assessment` and `structured_eval`, update or align:

    styling_contract.material_family: obsidian
    styling_contract.surface_mode: diagnostic_chamber
    styling_contract.branding_mode: governed_measures_registry
    styling_contract.answer_option_style: refined_operational_rows
    styling_contract.question_context_visibility: true

    layout_contract.layout_mode: diagnostic_question_chamber
    layout_contract.viewport_fit: single_screen_initial_view
    layout_contract.card_scale: compact_governed
    layout_contract.copy_density: restrained
    layout_contract.progress_visibility: true
    layout_contract.header_redundancy: false
    layout_contract.brand_mark_position: chamber_header_or_background_only
    layout_contract.mobile_layout: single_column_scroll_allowed

Do not change question order.

Do not change scoring.

### 8. Remove repeated static statement from question card contract

The assessment should not repeat the same general statement inside every question block.

Keep one page-level framing statement if seated.

Question cards should use per-question context statements.

Contract requirement:

    page_header:
      one title
      one subtitle

    question_card:
      progress
      question context statement
      question text
      answer options

Do not display the same subtitle twice.

### 9. Seat per-question context statements

For `measures_assessment`, seat per-question context statements aligned to the existing approved questions.

Use existing question storage shape.

Preferred key:

    context_statement

If question objects use another naming convention, use the least disruptive compatible key.

Context statements:

Q1 context:
    AI output becomes operational risk when it influences decisions without a documented review path.

Q2 context:
    A governable environment must be able to identify which systems, automations, and external surfaces are shaping output.

Q3 context:
    When failure occurs, accountability depends on knowing what produced the action, who approved it, and what dependencies enabled it.

Q4 context:
    Review cannot depend only on individual judgment or availability; it needs a standing operational standard.

Q5 context:
    AI acceleration is only stable when the surrounding environment can absorb increased speed without increasing drift.

Apply equivalent context statement seating to `structured_eval` if it shares the same question set or uses the same question source.

If `structured_eval` has distinct questions, do not invent. Report required operator review.

### 10. Preserve scoring contract

Do not alter:

- scoring_thresholds
- scoring_method
- answer option values
- condition tags
- result labels
- result interpretation logic

All-low-risk answers must still resolve to:

    Coherence Maintained

All-high-risk answers must still resolve to:

    Critical Drift Exposure

### 11. Renderer correction — eval_passage

Update clean-shell renderer only if needed:

    src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx

Renderer must read seated contract fields and render:

Desktop:
    left panel:
        explainer video

    right panel:
        Measures Registry branding
        eyebrow
        title
        informational paragraph
        Continue CTA
        Audio secondary control

    footer:
        visible through shared footer contract

Mobile:
    media first
    information second
    footer after content

Do not hardcode copy.

Do not hardcode route targets.

Do not alter video asset.

### 12. Renderer correction — assessment chamber

Update clean-shell renderer or passed props only if needed:

    src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx
    MeasuresAssessmentChamber if required and in current active path

Renderer must read:

    question.context_statement

and render it inside the question block.

Renderer must avoid repeated static subtitle inside every question card.

Branding must be consistent and not float awkwardly inside the question text area.

If mark placement is currently controlled by CSS only, correct through CSS layer rather than hardcoded markup changes.

### 13. CSS correction through registered runtime layer only

Use:

    src/measures_registry/registered_runtime/styles/

Do not add new styling to `src/index.css` unless absolutely required for fallback and explicitly reported.

Likely files:

    styles/encounters/passage.css
    styles/encounters/assessment.css

If `assessment.css` does not exist, create it and import from:

    registry.runtime.css

CSS must be scoped under:

    .measures-registry-runtime

Required visual outcome:

eval_passage:
- split-screen desktop
- video left
- information right
- branding visible
- single-screen fit
- footer visible
- no header overlap
- no detached CTA

measures_assessment / structured_eval:
- obsidian chamber
- compact governed question card
- clear page-level header
- no duplicate statement
- per-question context statement visible
- answer rows refined
- consistent branding
- no awkward mark overlap
- single-screen initial view where practical

### 14. Footer boundary

Ensure footer/copyright visibility rule is preserved:

Hidden:
- ai_isnt_broken_intro
- evaluate_structure_path

Visible:
- eval_passage
- structure_passage
- measures_assessment
- structured_eval
- connect_src
- measures_eval_email_contract
- measures_phases_reveal
- downstream surfaces

If footer copy is still hardcoded, do not solve that here unless already seated. Report as open DB contract item.

### 15. Build validation

Run:

    npm run build:registry

Return clean build result.

### 16. Browser visual QA

Validate:

    ?surface=eval_passage
    ?surface=measures_assessment
    ?surface=structured_eval

Then validate one full branch:

    intro
        -> eval_passage
        -> measures_assessment
        -> connect_src

Expected:

- eval_passage split-screen renders correctly
- Measures Registry branding visible on eval_passage
- footer visible on eval_passage
- assessment card shows per-question context
- repeated static statement removed from question card
- answer rows are refined
- scoring still works
- route still reaches connect_src after final question

## DO NOT

- change routing
- change scoring
- change assessment questions
- change answer values
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- touch accepted intro/threshold surfaces except footer-hidden preservation
- edit old MeasuresRegistryRuntime.tsx
- rewrite src/index.css
- hardcode copy in renderer
- hardcode visual authority outside contract
- broaden into all encounters

## VALIDATION REQUIRED

Return:

- DB rows inspected
- DB rows modified
- eval_passage contract before/after
- measures_assessment contract before/after
- structured_eval contract before/after
- question context statement readback
- files modified
- CSS files created/modified
- renderer files modified, if any
- eval_passage visual QA result
- measures_assessment visual QA result
- structured_eval visual QA result
- full branch QA result
- scoring preservation result
- build result
- confirmation old runtime not edited
- confirmation src/index.css not expanded
- confirmation no routing/scoring/contact/email behavior changed
- confirmation intro/threshold surfaces remain accepted and footer-hidden

## SUCCESS CONDITION

The reviewed encounters are seated as contracts before styling:

1. `eval_passage` is contracted and rendered as a split-screen Measures Registry passage with video left, branding/copy/actions right, and footer visible.

2. `measures_assessment` and `structured_eval` are contracted and rendered as obsidian diagnostic chambers with per-question context statements, no repeated static copy, refined answer rows, and consistent Measures Registry branding.

Build remains clean and browser QA confirms no runtime regression.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md

## CLOSE

Seat the encounter contracts.

Then render them.
