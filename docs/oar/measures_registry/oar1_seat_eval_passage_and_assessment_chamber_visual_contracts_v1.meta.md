---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Seat eval_passage and Assessment Chamber Visual Contracts
status: open
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - eval-passage
  - assessment-chamber
  - visual-contract
  - obsidian
  - split-screen
  - question-context
  - codex-first
---

# OAR1 — Seat eval_passage and Assessment Chamber Visual Contracts

## EXECUTION SUMMARY

Seated visual contracts for `eval_passage` (split-screen passage) and `measures_assessment` / `structured_eval` (obsidian diagnostic chamber) in both DB and runtime.

DB contracts seated first. Runtime updated to render seated contracts. No hardcoded copy or layout authority introduced.

Browser spot check pending operator confirmation.

## DB ROWS INSPECTED (before mutation)

### eval_passage (before)

| field | value |
|---|---|
| layout_contract.layout_mode | passage_explainer |
| branding_contract | null |
| footer_contract | null |
| informational_paragraph | (none) |
| cta_primary | (none) |
| cta_secondary | (none) |
| styling_contract.material_family | obsidian |
| media_behavior_contract | fully seated |

### measures_assessment (before)

| field | value |
|---|---|
| layout_contract.layout_mode | (none — v2 contract present but no layout_mode key) |
| styling_contract.surface_mode | (none) |
| Q1 context_statement | (none) |
| Q2 context_statement | (none) |
| Q3 context_statement | (none) |
| Q4 context_statement | (none) |
| Q5 context_statement | (none) |

### structured_eval (before)

| field | value |
|---|---|
| layout_contract.version | v1 (under-specified) |
| layout_contract.viewport_fit | single_screen |
| layout_contract.heading_scale | chamber_heading |
| styling_contract.surface_mode | (none) |
| questions | (none — uses measures_assessment questions) |

## DB ROWS MODIFIED

### eval_passage — layout_contract (v1 → v2)

```json
{
  "version": "v2",
  "layout_mode": "split_screen_passage",
  "viewport_fit": "single_screen",
  "media_position": "left",
  "information_position": "right",
  "cta_placement": "information_panel_below_copy",
  "audio_control_placement": "information_panel_secondary_action",
  "footer_visibility": "visible",
  "branding_visibility": "visible",
  "mobile_layout": "media_first_then_information"
}
```

### eval_passage — branding_contract (seeded)

```json
{
  "brand_visible": true,
  "brand_label": "Measures Registry",
  "brand_position": "information_panel_top",
  "registry_mark_visible": true,
  "header_mode": "downstream_governed",
  "footer_visible": true
}
```

### eval_passage — footer_contract (seeded)

```json
{
  "footer_visible": true,
  "footer_note": "footer visibility begins at eval_passage"
}
```

### eval_passage — copy fields seated

| field | value |
|---|---|
| informational_paragraph | Full two-sentence paragraph (AI instability... + This evaluation identifies...) |
| cta_primary | Continue to Evaluation |
| cta_secondary | Audio |

Existing `eyebrow`, `title`, `subtitle` preserved unchanged.

### measures_assessment — styling_contract additions

```json
{
  "surface_mode": "diagnostic_chamber",
  "branding_mode": "governed_measures_registry",
  "answer_option_style": "refined_operational_rows",
  "question_context_visibility": true
}
```

All existing v3 fields preserved. Scoring contract, answer values, condition_tags: not modified.

### measures_assessment — layout_contract additions

```json
{
  "layout_mode": "diagnostic_question_chamber",
  "card_scale": "compact_governed",
  "copy_density": "restrained",
  "progress_visibility": true,
  "header_redundancy": false,
  "brand_mark_position": "chamber_header_or_background_only",
  "mobile_layout": "single_column_scroll_allowed"
}
```

All existing v2 fields preserved.

### measures_assessment — per-question context_statement

| question_key | context_statement |
|---|---|
| ai_output_review_pathway | AI output becomes operational risk when it influences decisions without a documented review path. |
| active_ai_system_visibility | A governable environment must be able to identify which systems, automations, and external surfaces are shaping output. |
| failure_traceability | When failure occurs, accountability depends on knowing what produced the action, who approved it, and what dependencies enabled it. |
| persistent_review_standard | Review cannot depend only on individual judgment or availability; it needs a standing operational standard. |
| safe_ai_acceleration_capacity | AI acceleration is only stable when the surrounding environment can absorb increased speed without increasing drift. |

### structured_eval — layout_contract (v1 → v2 parity)

```json
{
  "version": "v2",
  "layout_mode": "diagnostic_question_chamber",
  "viewport_fit": "single_screen_initial_view",
  "card_scale": "compact_governed",
  "copy_density": "restrained",
  "progress_visibility": true,
  "header_redundancy": false,
  "brand_mark_position": "chamber_header_or_background_only",
  "heading_scale": "restrained_evaluation_heading",
  "scroll_policy": "avoid_initial_copy_scroll_desktop",
  "src_capture_layout": "minimal_two_column_identity_grid",
  "mobile_layout": "single_column_scroll_allowed"
}
```

### structured_eval — styling_contract additions

Same additions as `measures_assessment`: `surface_mode`, `branding_mode`, `answer_option_style`, `question_context_visibility`.

### structured_eval — questions

No questions seated. `structured_eval` has no own question set — runtime falls back to `measures_assessment` questions (which now carry `context_statement`). No operator review required.

## SCORING CONTRACT PRESERVATION

| item | status |
|---|---|
| scoring_thresholds | not modified |
| scoring_method | not modified |
| answer option values | not modified |
| condition_tags | not modified |
| result labels | not modified |
| assessment_interpretation | not modified |
| All-low-risk → Coherence Maintained | preserved |
| All-high-risk → Critical Drift Exposure | preserved |

## SCRIPTS CREATED

- `docs/oar/measures_registry/inspect-eval-passage-and-assessment-contracts-v1.cjs` — read-only pre-flight inspection
- `docs/oar/measures_registry/update-eval-passage-and-assessment-contracts-v1.cjs` — contract seating (eval_passage + measures_assessment + structured_eval)

## TYPE / UTILS CHANGES

### `src/measures_registry/measuresAssessmentTypes.ts`

Added `contextStatement: string | null` to `AssessmentMechanicQuestion`.

### `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`

- `allAssessmentMechanics()` — reads `question.context_statement` into `contextStatement`
- `sectionCopy()` — added `informationalParagraph: asString(metadata.informational_paragraph)`

## RENDERER FILES MODIFIED

### `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx`

- Reads `passageCopy.layoutContract?.layout_mode` from DB
- If `split_screen_passage`: renders two-panel grid — `registry-passage-split` with `registry-passage-media-panel` (video, full-height cover) and `registry-passage-information-panel` (eyebrow, title, informational_paragraph, CTA, audio control)
- If any other layout_mode: existing stacked layout preserved unchanged
- `ctaPrimary` and `ctaSecondary` read from DB via `passageCopy.ctaPrimary` / `passageCopy.ctaSecondary`
- `informationalParagraph` read from DB; falls back to `subtitle` if not seated
- No copy hardcoded. No route targets changed.

### `src/measures_registry/MeasuresAssessmentChamber.tsx`

- `registry-chamber-heading`: removed combined `${assessmentSupportLine} ${assessmentSubSupportLine}` paragraph — now shows `assessmentSubSupportLine` only (one subtitle)
- Diagnostic form: removed `registry-chamber-copy` wrapper with repeated `<h2>{assessmentSupportLine}</h2>` and `<p>{assessmentSubSupportLine}</p>` — replaced with progress indicator only
- Question card: added `registry-structured-context-statement` paragraph before question text, rendered when `currentQuestion.contextStatement` is present

## CSS FILES CREATED/MODIFIED

### Created: `src/measures_registry/registered_runtime/styles/encounters/assessment.css`

Scoped under `.measures-registry-runtime`. Governs:

- `.registry-iis-eval.registry-assessment-chamber` — chamber frame, min-height 100svh
- `.registry-chamber-heading` — page header with header-height offset, one title + one subtitle
- `.registry-question-progress` — progress row and bar
- `.registry-single-question-fieldset`, `.registry-question-legend` — question container
- `.registry-question-mark` — registry mark inside question card, low opacity
- `.registry-structured-context-statement` — per-question context statement (muted text, body font)
- `.registry-structured-question-text` — question text (heading font, primary text)
- `.registry-structured-options` — answer row container
- `.registry-structured-option` — refined operational row with radio, hover state, checked elevation
- `.registry-form-error`, `.registry-media-absence` — supporting states
- Mobile breakpoint: adjusted padding

### Modified: `src/measures_registry/registered_runtime/styles/encounters/passage.css`

Added split-screen rules:

- `.registry-passage-split` — `display: grid; grid-template-columns: 1fr 1fr; min-height: 100svh`
- `.registry-passage-media-panel` — video fills full height, `object-fit: cover`
- `.registry-passage-information-panel` — flex column, centered, padded clear of header
- `.registry-passage-information-panel .registry-encounter-entry` — eyebrow / h1 / paragraph stack
- `.registry-passage-audio-control` — secondary action style
- Mobile (≤768px): stacks to single column, media first

### Modified: `src/measures_registry/registered_runtime/styles/registry.runtime.css`

Added `@import "./encounters/assessment.css"`.

## FOOTER BOUNDARY STATUS

| surface | footer_visible | mechanism |
|---|---|---|
| ai_isnt_broken_intro | hidden | RegisteredIntro does not render renderSystemFooter() |
| evaluate_structure_path | hidden | RegisteredPathChoice does not render renderSystemFooter() |
| eval_passage | visible | renderSystemFooter() called in RegisteredPassage split-screen branch ✓ |
| measures_assessment | deferred | MeasuresAssessmentChamber renders its own `<main>` — renderSystemFooter() not in scope |
| structured_eval | deferred | same as measures_assessment |

Footer for `measures_assessment` / `structured_eval` is governed as `deferred` in the DB contract (`footer_contract.footer_visibility: "deferred"`). Resolution requires a future OAR to bring assessment surfaces into the registered renderer pattern or seat footer inside `MeasuresAssessmentChamber`.

## BUILD RESULT

```
✓ 105 modules transformed
✓ built in 5.74s
```

No TypeScript errors. No CSS errors. Chunk size warning pre-existing and unrelated.

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted ✓
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched ✓
- Routing — unchanged ✓
- Assessment scoring — unchanged ✓
- Contact capture behavior — unchanged ✓
- Email contract behavior — unchanged ✓
- Intro/threshold surfaces (`ai_isnt_broken_intro`, `evaluate_structure_path`) — not altered ✓
- No copy hardcoded in renderer ✓
- No visual authority seated outside DB contract ✓

## CLOSE CONDITION

Open pending operator browser spot check on:

- `?surface=eval_passage` — split-screen renders, video left, branding/copy/CTA right, footer visible
- `?surface=measures_assessment` — obsidian chamber, per-question context statement visible, no repeated subtitle
- `?surface=structured_eval` — same chamber, same context statements via fallback questions
- Full branch: intro → eval_passage → measures_assessment → connect_src — scoring resolves correctly

Close this OAR1 when spot check passes and operator confirms.
