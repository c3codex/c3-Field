---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Correct eval_passage and Assessment Chamber Contract Expression Gaps
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_eval_passage_and_assessment_chamber_contract_expression_gaps_v1.meta.md
executor: claude_vs
tags:
  - oar1
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

# OAR1 — Correct eval_passage and Assessment Chamber Contract Expression Gaps

## EXECUTION SUMMARY

Corrected browser contract expression for `eval_passage`, `measures_assessment`, and `structured_eval`. All changes consume seated DB contract state. No new contracts invented.

DB mutations: 3 rows updated (`eval_passage`, `measures_assessment`, `structured_eval`).

Runtime changes: `registeredRuntimeUtils.ts` (add `mediaBehaviorContract`, `brandingContract` to `sectionCopy`), `RegisteredPassage.tsx` (user-controlled progression), `RegisteredAssessment.tsx` (DB eyebrow/title/subtitle pass-through), `MeasuresAssessmentChamber.tsx` (eyebrow prop, suppress in-card mark).

CSS changes: `registry.materials.css` (obsidian background expression), `assessment.css` (form centering, compact card, background image hook), `passage.css` (audio control visibility).

No routing changes. No scoring changes. No question changes. No email dispatch. Old runtime not edited. `src/index.css` not expanded.

Browser spot check pending operator confirmation.

## DB ROWS INSPECTED (before mutation)

### eval_passage (before)

| field | value |
|---|---|
| layout_contract.progression_mode | (null) |
| layout_contract.audio_control_placement | information_panel_secondary_action ✓ |
| layout_contract.layout_mode | split_screen_passage ✓ |
| media_behavior_contract.auto_advance_on_end | (null) ← missing |
| branding_contract.brand_position | information_panel_top ← stale |
| branding_contract.floating_mark_allowed | (null) |
| styling_contract.background_mode | (null) |
| styling_contract.material_texture_visibility | (null) |
| cta_primary | Continue to Evaluation ✓ |
| cta_secondary | Audio ✓ |

### measures_assessment (before)

| field | value |
|---|---|
| title | MEASURES AI OPERATIONAL EVALUATION ← awkward all-caps |
| eyebrow | IIS Evaluation Gate 1 ← internal label, not public |
| subtitle | AI reflects the structure... ← stale |
| branding_contract.question_card_mark_visible | (null) |
| branding_contract.brand_position | (null) |
| layout_contract.question_card_alignment | (null) |
| styling_contract.background_mode | (null) |

### structured_eval (before)

| field | value |
|---|---|
| title | (null) |
| eyebrow | (null) |
| subtitle | (null) |
| branding_contract.question_card_mark_visible | (null) |
| layout_contract.question_card_alignment | (null) |
| styling_contract.background_mode | (null) |

## DB ROWS MODIFIED

### eval_passage — contract seating

```json
{
  "layout_contract": {
    "progression_mode": "user_controlled"
  },
  "media_behavior_contract": {
    "auto_advance_on_end": false,
    "progression_contract": "user_controlled_continue"
  },
  "branding_contract": {
    "brand_position": "upper_left_governed_frame",
    "mark_position": "upper_left",
    "mark_treatment": "restrained",
    "floating_mark_allowed": false
  },
  "styling_contract": {
    "background_mode": "obsidian_material_field",
    "material_texture_visibility": true
  }
}
```

All existing fields preserved via spread.

### measures_assessment — copy and contract seating

```json
{
  "eyebrow": "MEASURES REGISTRY",
  "title": "AI Operational Evaluation",
  "subtitle": "Answer each prompt to assess whether your current environment can safely support AI acceleration.",
  "branding_contract": {
    "brand_visible": true,
    "registry_mark_visible": true,
    "brand_position": "upper_left_governed_frame",
    "mark_position": "upper_left",
    "mark_treatment": "restrained",
    "question_card_mark_visible": false
  },
  "layout_contract": {
    "question_card_alignment": "centered",
    "question_card_max_width": "governed",
    "question_card_position": "centered_below_header"
  },
  "styling_contract": {
    "background_mode": "obsidian_material_field",
    "material_texture_visibility": true
  }
}
```

Preserved without modification: all `assessment_mechanics`, `scoring_thresholds`, `assessment_interpretation`, per-question `context_statement`, `answer_options`, answer values.

### structured_eval — copy and contract seating

```json
{
  "eyebrow": "MEASURES REGISTRY",
  "title": "AI Operational Evaluation",
  "subtitle": "Answer each prompt to assess whether your current environment can safely support AI acceleration.",
  "branding_contract": {
    "brand_visible": true,
    "registry_mark_visible": true,
    "brand_position": "upper_left_governed_frame",
    "mark_position": "upper_left",
    "mark_treatment": "restrained",
    "question_card_mark_visible": false
  },
  "layout_contract": {
    "question_card_alignment": "centered",
    "question_card_max_width": "governed",
    "question_card_position": "centered_below_header"
  },
  "styling_contract": {
    "background_mode": "obsidian_material_field",
    "material_texture_visibility": true
  }
}
```

All existing fields preserved via spread.

## SCRIPTS CREATED

- `docs/oar/measures_registry/update-eval-passage-and-assessment-expression-gaps-v1.cjs` — DB update (eval_passage, measures_assessment, structured_eval)

Inspection performed inline (pre-mutation readback in the update script).

## RUNTIME FILES MODIFIED

### `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`

Added to `sectionCopy()` return:

```ts
mediaBehaviorContract: asRecord(metadata.media_behavior_contract),
brandingContract: asRecord(metadata.branding_contract),
```

These are now available on all `SectionCopy` objects consumed by renderers.

### `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx`

**User-controlled progression — added:**

```ts
const autoAdvanceOnEnd = passageCopy.mediaBehaviorContract?.auto_advance_on_end !== false
```

**Video `onEnded` binding — corrected:**

```tsx
// was:
onEnded={onContinue}

// now:
onEnded={autoAdvanceOnEnd ? onContinue : undefined}
```

Behavior: `eval_passage` now has `auto_advance_on_end: false` seated in DB → `autoAdvanceOnEnd` is `false` → `onEnded` is `undefined` → video ending no longer silently advances route. User must click Continue to Evaluation.

`structure_passage` does not have `auto_advance_on_end: false` seated → behavior unchanged.

### `src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx`

**`assessmentEyebrow` prop — added:**

```tsx
assessmentEyebrow={asString(encounterCopy.eyebrow) ?? undefined}
```

**`assessmentProcessTitle` fallback chain — extended:**

```tsx
assessmentProcessTitle={
  asString(encounterCopy.assessmentChamber?.title) ??
  asString(encounterCopy.encounterContract?.content_blocks?.process_title) ??
  asString(encounterCopy.title) ??   // ← added: resolves DB title
  undefined
}
```

**`assessmentSubSupportLine` fallback chain — extended:**

```tsx
assessmentSubSupportLine={
  asString(encounterCopy.encounterContract?.content_blocks?.sub_support_line) ??
  asString(encounterCopy.subtitle) ??   // ← added: resolves DB subtitle
  undefined
}
```

### `src/measures_registry/MeasuresAssessmentChamber.tsx`

**`assessmentEyebrow` prop — added to type and signature:**

```ts
type MeasuresAssessmentChamberProps = {
  assessmentEyebrow?: string
  // ...
}
```

**Chamber heading eyebrow — now reads from prop:**

```tsx
// was:
<span>Measures Registry</span>

// now:
<span>{assessmentEyebrow ?? "Measures Registry"}</span>
```

**In-card mark suppression — added:**

```ts
const showMarkInQuestionCard = layoutContract?.brand_mark_position !== "chamber_header_or_background_only"
```

```tsx
// was: always rendered if registryMarkUrl was available
{registryMarkUrl ? <img className="registry-question-mark" ... /> : null}

// now: suppressed when brand_mark_position = "chamber_header_or_background_only"
{registryMarkUrl && showMarkInQuestionCard ? <img className="registry-question-mark" ... /> : null}
```

`brand_mark_position: "chamber_header_or_background_only"` is already seated in `measures_assessment.layout_contract` and `structured_eval.layout_contract` → in-card mark is suppressed. Mark continues to render via `MeasuresAssessmentBrandLayer` behind content.

No scoring changes. No question changes. No route changes.

## CSS FILES MODIFIED

### `src/measures_registry/registered_runtime/styles/registry.materials.css`

**Obsidian material — background and color added, fallback values hardened:**

```css
.measures-registry-runtime[data-material-family="obsidian"] {
  /* Added CSS fallback values for all variables */
  --registry-brand-field: var(--registry-brand-obsidian, var(--registry-background-obsidian, #0b0c11));
  /* ... all other vars updated with concrete fallbacks ... */
  background: var(--registry-brand-field, #0b0c11);   /* ← added */
  color: var(--registry-brand-primary-text, #dde0e7); /* ← added */
}
```

Previously the obsidian variant set CSS variables but did not apply `background` or `color` to the element (unlike lapis and marble which both had these). This caused the obsidian surface to appear transparent/flat regardless of DB token values.

### `src/measures_registry/registered_runtime/styles/encounters/assessment.css`

**Background image hook — added to chamber frame:**

```css
.measures-registry-runtime .registry-iis-eval.registry-assessment-chamber {
  background-image: var(--registry-assessment-background-image, none);
  background-size: cover;
  background-position: center;
}
```

`--registry-assessment-background-image` is set by `MeasuresAssessmentChamber` when `registryBackgroundUrl` is available.

**Eval form centering — added:**

```css
.measures-registry-runtime .registry-assessment-chamber .registry-iis-eval-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: min(var(--registry-content-max-width, 64rem), 100%);
  margin: 0 auto;
  flex: 1;
}
```

**Question fieldset — narrowed to compact_governed width:**

```css
.measures-registry-runtime .registry-single-question-fieldset {
  max-width: min(52rem, 100%);  /* was: min(var(--registry-content-max-width, 64rem), 100%) */
}
```

### `src/measures_registry/registered_runtime/styles/encounters/passage.css`

**Audio control — visibility and style strengthened:**

```css
.measures-registry-runtime .registry-passage-audio-control {
  font-size: clamp(0.78rem, 1.1vw, 0.88rem);
  letter-spacing: 0.06em;
  color: var(--registry-brand-secondary-text);
  background: transparent;
  border: 1px solid var(--registry-brand-border);
  padding: 0.3rem 0.85rem;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.12s ease, border-color 0.12s ease;
}

.measures-registry-runtime .registry-passage-audio-control:hover {
  opacity: 1;
  border-color: var(--registry-brand-primary-text);
}
```

Previously `opacity: 0.6` with no border/padding — button was present but visually nearly invisible on obsidian.

## MEDIA MAPPING STATUS

### eval_passage obsidian background

`styling_contract.background_mode: "obsidian_material_field"` is seated. No background image asset is mapped to a specific media role for eval_passage. The obsidian material field is expressed through CSS (`data-material-family="obsidian"`) rather than a background image asset.

If an obsidian texture/image asset is desired for eval_passage, a media role (`obsidian_background` or equivalent) must be mapped in the registry. Not implemented in this OAR.

### measures_assessment background

`--registry-assessment-background-image` CSS variable is set if `lapisBackgroundUrl` / `registryBackgroundUrl` is non-null. Current media role mapping for `background` / `lapis_background` determines whether this variable is populated. If the background asset is mapped, it now renders in the assessment chamber.

## AUTO-ADVANCE BEHAVIOR

| | before | after |
|---|---|---|
| eval_passage video end | navigated to measures_assessment | no action — user must click Continue |
| structure_passage video end | navigated to structured_eval | unchanged (no `auto_advance_on_end: false` seated) |

## SCORING CONTRACT PRESERVATION

| item | status |
|---|---|
| scoring_thresholds | not modified |
| scoring_method | not modified |
| answer option values | not modified |
| condition_tags | not modified |
| per-question context_statement | not modified |
| result labels | not modified |
| assessment_interpretation | not modified |

## BUILD RESULT

```
✓ 104 modules transformed
✓ built in 4.45s
```

No TypeScript errors. No CSS errors. Chunk size warning pre-existing and unrelated.

## FOOTER BOUNDARY STATUS

| surface | footer_visible | mechanism |
|---|---|---|
| ai_isnt_broken_intro | hidden | RegisteredIntro does not render renderSystemFooter() |
| evaluate_structure_path | hidden | RegisteredPathChoice does not render renderSystemFooter() |
| eval_passage | visible | renderSystemFooter() called in RegisteredPassage split-screen branch ✓ |
| structure_passage | visible | renderSystemFooter() called in RegisteredPassage (shared renderer) ✓ |
| measures_assessment | deferred | MeasuresAssessmentChamber — future OAR |
| structured_eval | deferred | same |
| connect_src | visible | RegisteredConnectSrc calls renderSystemFooter() ✓ |
| measures_phases_reveal | visible | RegisteredPhaseReveal renders footer ✓ |

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted ✓
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched ✓
- Routing — not changed ✓
- Assessment scoring — unchanged ✓
- Assessment questions — unchanged ✓
- Answer values — unchanged ✓
- Per-question context_statement — unchanged ✓
- Contact capture behavior — unchanged ✓
- Email contract behavior — unchanged ✓
- Email dispatch — not implemented ✓
- Payment logic — not exposed ✓
- No hardcoded public copy in renderer ✓
- No hardcoded media URLs ✓
- No new unseated background media invented ✓

## CLOSE CONDITION

Open pending operator browser spot check on:

- `?surface=eval_passage` — split-screen, branding upper-left, Audio button visible with border, Continue to Evaluation visible, video end does NOT auto-advance, obsidian information panel background
- `?surface=measures_assessment` — question card centered, title "AI Operational Evaluation", eyebrow "MEASURES REGISTRY", subtitle correct, no mark floating in card, obsidian background expression, per-question context statements visible
- `?surface=structured_eval` — same assessment expression as measures_assessment
- Full left branch: intro → eval_passage → measures_assessment → connect_src → measures_phases_reveal
- Full right branch: intro → structure_passage → structured_eval → connect_src → measures_phases_reveal
- Scoring still resolves correctly after branch completion

Close this OAR1 when spot check passes and operator confirms.
