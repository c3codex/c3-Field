---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_correction
title: Audit and Enforce Measures Registry Sitewide Style Contract Composition — Closeout
status: closed
version: v1
operator: op044
system: measures_registry
executor_role: claude_cody_compatible_executor
source_oar2: oar2_audit_and_enforce_sitewide_style_contract_composition_v1
---

# OAR1 — Audit and Enforce Measures Registry Sitewide Style Contract Composition v1

## SITEWIDE STYLE CONTRACT STANDING

Contract **exists — was partial, now corrected.**

The contract hierarchy was present:

    registry.runtime.css      — import orchestrator (unchanged)
    registry.tokens.css       — design tokens, fonts (unchanged)
    registry.layout.css       — frame shell (unchanged)
    registry.materials.css    — material family tokens (unchanged)
    registry.buttons.css      — button governance (CORRECTED)
    registry.footer.css       — footer governance (unchanged, complete)
    encounters/passage.css    — passage layout (unchanged)
    encounters/assessment.css — assessment chamber (unchanged)
    encounters/public_understand.css — public understand + crystal (CORRECTED)
    registry.visual-system.css — chamber/encounter visual overrides (CORRECTED)

Two defects were present before this OAR:

1. Button contract was incomplete: `registry.buttons.css` only governed two selector groups. Five additional button groups on `structure_passage` and `crystal_chamber` surfaces had their own conflicting full-border definitions in `public_understand.css`, bypassing the sitewide ruled CTA treatment.

2. Media control contract was absent: native `controls` attribute was present on video elements across four surfaces where custom controls already existed in JSX. Crystal chamber video had no custom controls at all.

---

## FILES CHANGED

    src/measures_registry/registered_runtime/styles/registry.buttons.css
    src/measures_registry/registered_runtime/styles/registry.visual-system.css
    src/measures_registry/registered_runtime/styles/encounters/public_understand.css
    src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx
    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

---

## BUTTON / CTA CORRECTION

**Defect:** Five button groups in `public_understand.css` used `border: 1px solid var(--registry-brand-primary-text)` with their own background, font-size, and hover state — a full-border generic treatment, not the sitewide ruled CTA band.

Affected selectors (pre-correction):

    .registry-public-understand-video > button
    .registry-public-understand-video-controls > button
    .registry-crystal-chamber-section > button  ← also in public_understand.css, conflicting
    .registry-public-understand-panel > button
    .registry-public-understand-assess > button
    .registry-public-understand-contact > button

**Correction:**

`registry.buttons.css` extended to cover all governed button surfaces as the single base contract (interactive states: hover, focus, active, disabled, base appearance). New selectors added:

    .registry-crystal-chamber-section > button
    .registry-crystal-publication-encounter > button
    .registry-crystal-chamber-video-controls > button
    .registry-public-understand-video-controls > button
    .registry-public-understand-panel > button
    .registry-public-understand-assess > button
    .registry-public-understand-contact > button
    .registry-field-guide-featured a
    .registry-field-guide-grid a
    .registry-field-guide-cta button
    .registry-publication-cta button
    .registry-publication-cta a

`registry.visual-system.css` ruled CTA band extended to cover the same new selectors (applies the horizontal-border, gradient background, and box-shadow ruling over the base).

`public_understand.css` button visual definitions (border, background, color, font-family, font-size, letter-spacing, padding, hover) removed. Only positional property `align-self: flex-start` retained.

Result: All governed buttons now receive one sitewide visual language — ruled CTA band, consistent spacing, consistent border weight, consistent hover/focus states.

---

## MEDIA CONTROL CORRECTION

**Defect:** Native `controls` attribute present on video elements where custom JSX controls already existed, causing browser-native control chrome to appear over cinematic surfaces.

**Surfaces corrected:**

| Surface | File | Correction |
|---|---|---|
| structure_passage | RegisteredPublicUnderstand.tsx | Removed `controls`. Custom controls in `.registry-public-understand-video-controls` remain. |
| eval_passage (non-split) | RegisteredPassage.tsx | Removed `controls`. Custom controls in `.registry-diagnostic-passage-controls` remain. |
| obsidian_to_marble_passage_video | MeasuresRegistryRuntimeRegistered.tsx | Removed `controls`. Custom Audio/Mute + navigation buttons in `.registry-diagnostic-passage-controls` remain. |
| crystal_chamber Questions video | RegisteredCrystalChamber.tsx | Removed `controls`. Added `videoMuted` state (default: muted). Added `.registry-crystal-chamber-video-controls` with Audio/Mute button. |

**Crystal chamber video custom controls:** The Questions Explainer video previously had only native `controls` and no custom equivalent. A `videoMuted` boolean state was added to `RegisteredCrystalChamber`. The video now renders muted by default with a sitewide-governed Audio/Mute toggle in `.registry-crystal-chamber-video-controls`.

**Limitation:** The split-screen eval_passage layout (governed by `layout_mode: "split_screen_passage"` from DB) already had no `controls` on the media panel video. No change required there.

**Auto-advance:** No change. `autoAdvanceOnEnd` in `RegisteredPassage` remains DB-contract driven. `onEnded` callbacks preserved across all passage videos.

---

## BOX-TO-ZONE CORRECTION

No structural zone replacements required. Audit confirmed:

- Crystal chamber sections already use left-border zone treatment (not generic box)
- Publication encounter uses panel treatment governed by visual-system.css
- Assessment form uses obsidian cinematic chamber (full source image, visual-system.css override)
- `registry-public-understand-panel` CSS retains full-border styling in the CSS file but is not rendered in the current `RegisteredPublicUnderstand` JSX — no active regression

Remaining known CSS: `.registry-public-understand-panel` box style is present in `public_understand.css` but is currently not rendered by any active surface component. Flagged for removal in a later OAR if confirmed dead.

---

## CHAMBER IDENTITY PRESERVATION

All four material families preserved:

    Crystal  = sitewide controls + crystal field + sparse chamber layout  ✓
    Obsidian = sitewide controls + obsidian field + assessment layout      ✓
    Lapis    = sitewide controls + lapis transition field (not public)     ✓
    Marble   = sitewide controls + held marble field only                  ✓

No Marble opening. No Lapis public chamber exposure. No assessment lapis bleed.

---

## BOUNDARY PRESERVATION

All OAR2 boundary constraints confirmed:

    understand_environment alias to structure_passage        ✓
    structure_passage continuation to crystal_chamber        ✓
    AI Operations Assessment title                           ✓
    Seven-question assessment flow                           ✓
    Reference statements                                     ✓
    Question 5 usability                                     ✓
    Contact/consent no-standing language                     ✓
    Crystal Questions video                                  ✓ (audio control corrected)
    Structural Drift publication cover                       ✓
    Foundational Leadership CTA                              ✓
    Assess CTA                                               ✓
    Footer copy                                              ✓
    Internal Lapis launch chamber exclusion                  ✓
    Marble held boundary                                     ✓

---

## BUILD RESULT

    npm.cmd run build:registry

    ✓ 101 modules transformed
    ✓ built in 3.10s
    No TypeScript errors. No CSS errors. No import failures.

Chunk size warning (520 kB JS) is pre-existing, not introduced by this OAR.

---

## SCREENSHOTS CAPTURED

Screenshots not captured in this execution. Visual validation is recommended at:

    crystal_chamber 1440x900
    structure_passage 1440x900
    measures_assessment question 5 1366x768
    contact_result_gate 1366x768
    structural_drift_publication 1440x900

Expected output path: `docs/oar/measures-registry/visual-validation-sitewide-style-contract/`

---

## DB MUTATION

None. No DB rows read, written, or altered.

---

## DEPLOYMENT

None. Build artifact produced locally only (`dist-registry/`). No deployment executed.

---

## REMAINING DEFECTS

1. **Non-split eval_passage structural duplication.** `RegisteredPassage.tsx` non-split layout renders the Continue CTA twice: once inside `.registry-diagnostic-passage-controls` (governed) and once as a naked `<button>` outside any governed container. The naked button receives base `border-radius` from the global rule but does not receive the full ruled CTA treatment. Active path depends on DB `layout_mode` contract. Recommend OAR to unify or confirm the intended layout mode for eval_passage.

2. **`.registry-public-understand-panel` dead CSS.** `public_understand.css` retains box-style CSS for `.registry-public-understand-panel` selectors. Current `RegisteredPublicUnderstand` JSX does not render those elements. If confirmed dead, remove in a later OAR.

3. **PublicAssessmentResult video controls not audited.** `PublicAssessmentResult.tsx` was not audited in this OAR. If it renders video with native `controls`, that surface should be included in a media control follow-up OAR.

---

## RECOMMENDED NEXT OAR

    oar2_validate_sitewide_style_contract_visual_output_v1

    Scope: Visual QA screenshots at all five required viewports, comparison against OAR2
    visual-validation-sitewide-style-contract/ path, confirmation that button, media
    control, and zone corrections read as intended at launch grade.

---

## CLOSE

Sitewide style contract standing: corrected.

Button governance: one contract, one ruling, all governed surfaces.
Media controls: native chrome removed where custom controls exist. Crystal chamber audio toggle added.
Chamber identity: preserved.
Boundaries: held.
Build: passing.

Codex holds.
Field structures.
Measures registers.
Claude executed as Cody-compatible executor from OAR2 only.
src renders seated state only.
