---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime
title: Correct AI Operations Assessment Title, Obsidian Contract, Reference Statements, and Fit-to-Page
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
  - measures_assessment
  - assessment_renderer
  - assessment_style_contract
  - assessment_question_copy
  - assessment_footer
tags:
  - measures-registry
  - assessment
  - ai-operations-assessment
  - obsidian
  - public-copy
  - fit-to-page
  - oar2
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
  - Measures Registry Operative Concordance Update
---

# OAR2 — Correct AI Operations Assessment Title, Obsidian Contract, Reference Statements, and Fit-to-Page v1

## OBSERVED

Live/local audit of `?surface=measures_assessment` confirms assessment presentation drift.

Observed issues:

1. Assessment title currently reads:

   Measures AI Operational Evaluation

   Required title is:

   AI Operations Assessment

2. The Measures Registry brand appears twice on the assessment surface.

3. The assessment surface is rendering with a lapis-feeling background instead of the required obsidian assessment contract.

4. A background watermark / label reading `EMBLEM ONLY` is visible on at least question 5.

5. On question 5, the button/control area cannot be accessed in the visible viewport.

6. The previous 5-question assessment had a reference statement above the question that supported the question. That framing was useful and should be restored.

This is a presentation, copy, and layout correction.

This OAR2 does not reopen scoring logic unless layout or renderer structure requires bounded adjustment.

## ALIGNED

The assessment surface must render as an obsidian assessment experience.

The assessment should be public-facing and clear.

The visitor should see:

1. single Measures Registry mark / brand treatment
2. title: `AI Operations Assessment`
3. question-specific reference statement
4. question text
5. three answer choices
6. accessible controls
7. no metadata / asset-label bleed
8. footer where applicable

The assessment should remain fit-to-page on standard desktop viewport where possible.

No question may bury required controls below inaccessible page bounds.

## ROUTED

## 1. Correct assessment title

Change assessment title from:

    Measures AI Operational Evaluation

To:

    AI Operations Assessment

This title applies to the `measures_assessment` surface.

## 2. Remove duplicate Measures Registry branding

Correct the assessment header/mark rendering so Measures Registry appears only once.

Required:

    one governed brand mark / label only

Remove any duplicate stacked rendering such as:

    MEASURES REGISTRY
    MEASURES REGISTRY

The registry mark may remain, but the brand text must not duplicate.

## 3. Apply obsidian assessment style contract

The assessment currently reads visually as lapis.

Correct to obsidian.

Required qualities:

- dark threshold surface
- assessment/evaluation tone
- restrained texture
- no bright lapis chamber feel
- no over-glow
- high readability
- clear contrast
- button controls accessible
- page fits frame where possible

The assessment should feel like an obsidian operational threshold, not a lapis orientation chamber.

## 4. Remove `EMBLEM ONLY` watermark / metadata bleed

Remove visible background text:

    EMBLEM ONLY

This is asset-label or metadata bleed.

No asset-state language may render visually in the public UI.

Blocked visible terms include:

- EMBLEM ONLY
- metadata labels
- asset state labels
- internal media role labels
- renderer/debug labels
- contract labels

## 5. Restore question-specific reference statements

Each assessment question must include a short reference statement above the question.

Purpose:

    Give the visitor context for why the question matters before they answer.

Required structure:

    Reference statement
    Question
    Answer choices
    Controls

Reference statements should be concise, public-facing, and connected to the assessment logic.

They must not expose scoring logic, circuit recommendation, internal registry keys, or system terminology.

## 6. Approved reference statement pattern

Use the following pattern unless DB-seated copy already exists and is more current.

### Question 1 reference

    AI output becomes operational risk when review pathways are unclear.

### Question 2 reference

    Authority must be defined before AI-generated actions can be trusted.

### Question 3 reference

    Runtime surfaces shape what AI can touch, expose, or alter.

### Question 4 reference

    Role clarity determines who may approve, act, review, or correct.

### Question 5 reference

    Acceleration without structure can amplify instability across the environment.

### Question 6 reference

    Traceability determines whether AI-supported decisions can be reviewed after impact.

### Question 7 reference

    Governed implementation requires conditions that hold under pressure.

If the currently seated question set differs, Cody must preserve question order and bind reference statements to the corresponding question intent.

## 7. Fit-to-page and control accessibility

Every assessment question must keep controls accessible.

Required:

- answer choices fit coherently within the page frame
- Continue / Back / result controls remain visible or immediately reachable
- no question state buries buttons below inaccessible viewport
- question 5 specifically must be corrected
- title/header spacing must not consume excessive vertical space
- answer option blocks must not be oversized
- progress indicator must remain visible but not dominate the layout
- footer must not push controls out of reach

Desktop priority:

    standard desktop viewport should fit the assessment composition without excessive scroll

Mobile allowance:

    mobile may scroll where necessary, but controls must remain accessible

## 8. Assessment page structure

Target structure:

    single Measures Registry mark / brand

    AI Operations Assessment

    reference statement

    question text

    answer option 1
    answer option 2
    answer option 3

    Back / Continue / Result controls

    footer where applicable

## 9. Footer continuity

If footer has been added sitewide under the prior Crystal copy/style/footer OAR, ensure assessment footer remains visually coherent and does not break fit-to-page.

Footer copy:

    © 2026 Measures Registry. All rights reserved.
    Measures Registry is a registered c3 Field system.
    Operated by c3 Community Partners DAO, LLC.

Footer must not block or bury assessment controls.

## CODY ROLE

Cody may:

- correct assessment title
- remove duplicate Measures Registry branding
- apply obsidian assessment style
- remove `EMBLEM ONLY` / metadata bleed
- restore question-specific reference statements
- adjust assessment layout for fit-to-page
- correct button/control accessibility
- preserve scoring and answer logic unless directly impacted by renderer correction
- preserve existing assessment route and contact-capture order

Cody may not:

- change scoring logic without reporting necessity
- add pricing
- imply payment standing
- imply c3 Key issuance
- imply conversion, certification, recognition, permission, DAO, or distribution standing
- move assessment before contact capture unless already seated
- collapse assessment into Crystal Chamber
- expose internal registry/system labels
- hardcode frontend truth where DB/copy contract should govern

## EXPECTED TOUCHPOINTS

Likely touchpoints may include:

- `src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx`
- `src/measures_registry/registered_runtime/renderers/*`
- `src/measures_registry/registered_runtime/styles/encounters/*`
- `src/measures_registry/registered_runtime/styles/assessment*`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- registered assessment copy contract
- assessment question copy map
- assessment style contract
- shared brand/header/footer component if present

Cody should keep the correction bounded to the assessment surface and directly shared style/footer surfaces.

## VALIDATION

### URL

    https://measuresregistry.com/?surface=measures_assessment

### Expected

- title reads `AI Operations Assessment`
- Measures Registry brand does not duplicate
- obsidian background/style is applied
- no `EMBLEM ONLY` watermark appears
- each question has a reference statement above the question
- all seven questions preserve three answer choices
- question 5 buttons/controls are accessible
- controls are accessible on every question
- no excessive desktop scroll where avoidable
- no internal/system labels visible
- footer, if present, does not break page fit

### Question 5 specific validation

On question 5:

- reference statement appears
- question text appears
- all three answer choices appear
- Continue/control area is accessible
- no `EMBLEM ONLY` text appears in background
- layout does not force inaccessible lower controls

## EXPECTED OAR1

After execution, Cody must write OAR1 beside this OAR2.

Expected path:

    docs/oar/measures-registry/oar1_correct_ai_operations_assessment_title_obsidian_references_and_fit_v1.meta.md

OAR1 must report:

- files changed
- title correction
- duplicate brand correction
- obsidian style correction
- metadata/watermark bleed correction
- reference statements added/restored
- fit-to-page correction
- question 5 validation
- local runtime validation
- deployed runtime validation, if deployment occurs
- unresolved dependency, if deployment remains held

## STANDING

This OAR2 does not create a conversion route.

This OAR2 does not authorize pricing.

This OAR2 does not issue c3 Key standing.

This OAR2 does not create permission, payment, DAO, recognition, certification, or distribution standing.

This OAR2 corrects the public assessment surface title, copy support, obsidian style, visible metadata bleed, and fit-to-page behavior only.

## CLOSE

The assessment names the operation.

The reference frames the question.

The obsidian surface holds the threshold.

The controls remain reachable.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes from OAR2 only.
src renders seated state only.
