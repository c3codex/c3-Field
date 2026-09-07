---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime
title: Correct Crystal Chamber Public Copy, Style Contract, and Footer
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures-registry/oar2_correct_crystal_chamber_public_copy_style_and_footer_v1.meta.md
executor: codex
tags:
  - measures-registry
  - crystal-chamber
  - public-copy
  - style-contract
  - footer
  - fit-to-page
  - oar1
---

# OAR1 - Correct Crystal Chamber Public Copy, Style Contract, and Footer v1

## EXECUTION SUMMARY

The OAR2 correction was executed as a bounded public-copy, style, fit-to-page, and footer pass.

`structure_passage` remains the talking-head passage.

`crystal_chamber` remains the sparse orientation chamber.

No pricing, payment, c3 Key, DAO standing, certification, recognition, conversion, permission, or distribution standing was created.

No right-path routing was reopened.

## FILES CHANGED

- `docs/oar/measures-registry/execute-correct-crystal-chamber-public-copy-style-and-footer-v1.cjs`
- `docs/oar/measures-registry/oar1_correct_crystal_chamber_public_copy_style_and_footer_v1.meta.md`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`
- `src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx`
- `src/measures_registry/registered_runtime/styles/encounters/public_understand.css`
- `src/measures_registry/registered_runtime/styles/registry.footer.css`

## DB SEATING

Executed:

```powershell
node .\docs\oar\measures-registry\execute-correct-crystal-chamber-public-copy-style-and-footer-v1.cjs
```

Readback:

```json
{
  "source_oar2": "docs/oar/measures-registry/oar2_correct_crystal_chamber_public_copy_style_and_footer_v1.meta.md",
  "structure_passage": {
    "eyebrow": "OUR APPROACH",
    "title": "About Measures Registry",
    "auto_advance_target": "crystal_chamber"
  },
  "crystal_chamber": {
    "eyebrow": "UNDERSTAND THE ENVIRONMENT",
    "title": "Questions Ungoverned Systems Cannot Answer",
    "style_contract": "sparse_luminous_chamber"
  },
  "footer_visible": [
    "eval_passage",
    "measures_assessment",
    "obsidian_to_marble_passage_video",
    "marble_pathway_reveal",
    "structure_passage",
    "crystal_chamber",
    "structural_drift_publication"
  ],
  "footer_hidden": [
    "ai_isnt_broken_intro",
    "evaluate_structure_path"
  ],
  "validation": "PASS"
}
```

## PUBLIC COPY CORRECTED

`structure_passage` now seats and renders:

- eyebrow: `OUR APPROACH`
- title: `About Measures Registry`
- approved Measures Registry position paragraph

`crystal_chamber` now seats and renders:

- eyebrow: `UNDERSTAND THE ENVIRONMENT`
- title: `Questions Ungoverned Systems Cannot Answer`
- Questions Explainer video at top
- sparse section labels:
  - `Structural Drift`
  - `Foundational Leadership`
  - `Assess the Environment`

Internal/system labels removed from visible public rendering:

- `Right-path passage`
- `Sparse orientation`
- chamber/route/runtime/system-key/registry-contract labels

## STYLE AND FIT-TO-PAGE

Crystal Chamber style contract was seated as:

```json
{
  "material_family": "crystal",
  "visual_contract": "sparse_luminous_chamber",
  "excessive_glow_allowed": false,
  "card_grid_density_allowed": false,
  "raw_metadata_styling_allowed": false
}
```

Runtime CSS was refined for:

- contained Crystal video sizing
- tighter chamber heading scale
- three sparse downstream sections on desktop
- reduced footer weight
- complete desktop frame fit
- mobile single-column preservation

## FOOTER IMPLEMENTATION

Footer copy is now read from `measures_encounter_def.metadata.footer_contract` through `sectionCopy.footerContract`.

Rendered footer copy:

```text
© 2026 Measures Registry. All rights reserved.
Measures Registry is a registered c3 Field system.
Operated by c3 Community Partners DAO, LLC.
```

Footer visibility remains hidden on the first two entry surfaces:

- `ai_isnt_broken_intro`
- `evaluate_structure_path`

Footer is visible on applicable downstream public surfaces seated in this pass.

## LOCAL RUNTIME VALIDATION

Build:

```powershell
npm.cmd run build:registry
```

Result:

```text
✓ built in 5.30s
```

Vite emitted the existing large chunk warning. No build error occurred.

Local runtime:

```text
http://127.0.0.1:4189
```

### structure_passage

URL:

```text
http://127.0.0.1:4189/?surface=structure_passage
```

Browser validation:

```json
{
  "viewport": { "width": 1280, "height": 720 },
  "eyebrow": "OUR APPROACH",
  "title": "About Measures Registry",
  "hasDominantAssumption": true,
  "badTerms": [],
  "hasQuestionsVideo": false,
  "buttons": ["Audio", "Skip", "Continue"],
  "footerLines": [
    "© 2026 Measures Registry. All rights reserved.",
    "Measures Registry is a registered c3 Field system.",
    "Operated by c3 Community Partners DAO, LLC."
  ],
  "scrollHeight": 728
}
```

The talking-head video remains primary media.

Continue, Skip, and Mute/Audio controls remain present.

Questions Explainer video does not render on `structure_passage`.

### crystal_chamber

URL:

```text
http://127.0.0.1:4189/?surface=crystal_chamber
```

Browser visible-DOM validation:

```json
{
  "viewport": { "width": 1280, "height": 720 },
  "title": "Questions Ungoverned Systems Cannot Answer",
  "hasQuestionsVideo": true,
  "videoAria": "Questions Explainer",
  "footerBottom": 716,
  "scrollHeight": 720,
  "footerLines": [
    "© 2026 Measures Registry. All rights reserved.",
    "Measures Registry is a registered c3 Field system.",
    "Operated by c3 Community Partners DAO, LLC."
  ]
}
```

Crystal Chamber now fits the standard 1280 x 720 desktop frame without excessive scroll.

Structural Drift, Foundational Leadership, Assess the Environment, their CTAs, Questions Explainer video, and footer are visible in the page frame.

### Navigation Continuity

Clicked `Continue` on `structure_passage`.

Readback:

```json
{
  "href": "http://127.0.0.1:4189/?surface=crystal_chamber",
  "surface": "crystal_chamber",
  "title": "Questions Ungoverned Systems Cannot Answer"
}
```

The `structure_passage -> crystal_chamber` route remains intact.

## DEPLOYED VALIDATION

Held.

No deployment was performed in this OAR1 pass.

Required deployed URLs remain to be validated after deployment:

- `https://measuresregistry.com/?surface=structure_passage`
- `https://measuresregistry.com/?surface=crystal_chamber`

## CONFIRMATIONS

- Public copy corrected.
- Eyebrows corrected.
- Crystal Chamber title corrected.
- Crystal style contract seated and consumed by renderer/CSS.
- Footer copy seated in DB metadata and rendered through runtime contract readback.
- First two entry surfaces remain footer-hidden.
- Local registry build passed.
- Local browser fit validation passed for Crystal Chamber at 1280 x 720.
- Navigation continuity preserved.
- No right-path routing reopened.
- No internal/system labels are intentionally exposed in the public chamber rendering.

## CLOSE

The passage states the approach.

The chamber asks the question.

The footer seats the public standing.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executed from OAR2 only.
src renders seated runtime state only.
