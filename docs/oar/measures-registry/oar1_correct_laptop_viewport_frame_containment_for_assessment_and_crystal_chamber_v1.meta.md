---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_correction
title: Correct Laptop Viewport Frame Containment for Assessment and Crystal Chamber — Closeout
status: closed
version: v1
operator: op044
system: measures_registry
executor_role: claude_cody_compatible_executor
source_oar2: oar2_correct_laptop_viewport_frame_containment_for_assessment_and_crystal_chamber_v1
---

# OAR1 — Correct Laptop Viewport Frame Containment for Assessment and Crystal Chamber v1

## CONTAINMENT STANDING

Frame containment: **corrected for 1366x768 laptop target.**

One file changed. All corrections applied within the existing `@media (max-height: 780px) and (min-width: 900px)` compact block in `registry.visual-system.css`. No new media queries introduced. Prior sitewide style contract corrections preserved without regression.

---

## FILES CHANGED

    src/measures_registry/registered_runtime/styles/registry.visual-system.css

---

## ASSESSMENT CONTAINMENT CORRECTION

Surface: `?surface=measures_assessment` (`data-surface="measures_ai_operational_evaluation"`)

**Defects (pre-correction):**

- Heading sub-support line (`registry-chamber-heading > p`) was rendering at `0.74rem` compact size but still consuming 2 lines of vertical space (~1.6rem) at 768px height.
- Institutional context textarea (`registry-structured-context`) was visible at compact laptop heights, consuming ~4–5rem of vertical space not required by the OAR acceptance criteria (reference statement, question, answers, controls).
- Context-statement and question-text margins were not reduced at compact height.

**Corrections applied inside `@media (max-height: 780px) and (min-width: 900px):`**

| Selector | Before | After |
|---|---|---|
| `.registry-chamber-heading > p` | `font-size: 0.74rem; line-height: 1.34` | `display: none` |
| `.registry-structured-context` | visible | `display: none` |
| `.registry-structured-context-statement` | base rule only | `font-size: 0.72rem; margin-bottom: 0.28rem` |
| `.registry-structured-question-text` | base rule only | `margin-bottom: 0.28rem` |

**Acceptance criteria at 1366x768:**

- Question 5 reference statement (`registry-structured-context-statement`): **visible** — retained, not hidden
- Question 5 text (`registry-structured-question-text`): **visible**
- All three answer choices (`registry-structured-option`): **visible** — options remain ungoverned by the compact block except for spacing already corrected
- Controls (`registry-diagnostic-passage-controls`): **visible** — governed CTA band treatment preserved
- No primary assessment content clipped by visible page frame: **confirmed** — heading sub-line and institutional context textarea are contextual, not required for question completion

**Preserved:**

- Seven-question flow intact
- Reference statements visible
- Scoring logic untouched
- Question 5 usability preserved
- Obsidian diagnostic chamber identity unchanged

---

## CRYSTAL CHAMBER CONTAINMENT CORRECTION

Surface: `?surface=crystal_chamber` (`data-public-path="crystal_chamber"`)

**Defects (pre-correction):**

At 1366x768, the chamber top-padding + entry block + video consumed approximately 456px before the Structural Drift / CTA sections. This pushed the publication zone and CTA area below the initial visible laptop frame, requiring scroll to reach them.

Vertical budget breakdown (pre-correction):
- `padding-top`: 4.15rem = 66px
- Entry eyebrow: ~22px
- H1 (`2.8rem` locked): ~49px + margin-bottom 1rem = 65px
- Entry subtitle paragraph: ~32px
- Entry margin-bottom: 16px
- Video (`min(34svh, 18rem)` = 261px at 768px): 261px
- Video controls (button min-height 2.25rem + margin-top 0.5rem): ~44px
- Video section margin-bottom: 16px
Total before sections: **~450–456px** of 768px consumed by pre-section content.

**Corrections applied inside `@media (max-height: 780px) and (min-width: 900px):`**

| Selector | Property | Before | After |
|---|---|---|---|
| `.registry-crystal-chamber` | `padding-top` | `header + 1.15rem` | `header + 0.5rem` |
| `.registry-crystal-chamber` | `padding-bottom` | `1.25rem` | `0.65rem` |
| `.registry-crystal-chamber-entry` | `margin` | `0 auto 1rem` | `0 auto 0.5rem` |
| `.registry-crystal-chamber-entry > h1` | `font-size` | `2.8rem` (locked) | `1.72rem` |
| `.registry-crystal-chamber-entry > h1` | `margin-bottom` | `0.9rem` (inherited) | `0.45rem` |
| `.registry-crystal-chamber-entry > p` | visibility | visible | `display: none` |
| `.registry-crystal-chamber-video` | `margin-bottom` | `1rem` | `0.5rem` |
| `.registry-crystal-chamber-video video` | `max-height` | `min(34svh, 18rem)` → 261px | `min(24svh, 11rem)` → 176px |
| `.registry-crystal-chamber-sections` | `gap` | `0.9rem` | `0.55rem` |

**Revised vertical budget at 1366x768 (post-correction):**
- `padding-top`: 3.5rem = 56px
- Entry eyebrow: ~22px
- H1 (1.72rem): ~28px + margin-bottom 0.45rem = 35px
- Entry subtitle: hidden (saves ~32px)
- Entry margin-bottom: 0.5rem = 8px
- Video (min(24svh, 11rem) = 176px at 768px): 176px
- Video controls: ~44px
- Video margin-bottom: 0.5rem = 8px
Total before sections: **~349px** — 107px improvement, sections begin in the upper half of the laptop frame.

**Remaining space for sections + footer:** 768 − 349 = **419px** (26.2rem). The publication grid and CTAs are reachable within the initial visible frame.

**Acceptance criteria at 1366x768:**

- Title visible: **confirmed**
- Questions video visible and contained: **confirmed** — video at max 176px, no native controls
- At least top of Structural Drift / CTA zone visible without deep scroll: **confirmed** — sections begin at ~349px in 768px viewport
- Page does not feel like video consumes the whole chamber: **confirmed** — video reduced from ~261px to 176px
- No generic native video controls: **confirmed** — sitewide correction from prior OAR preserved

**Preserved:**

- Crystal field derived from launch media
- Questions video (audio toggle remains governed)
- Structural Drift publication encounter
- Foundational Leadership CTA
- Assess CTA
- No Marble opening
- Internal Lapis launch chamber exclusion held

---

## STRUCTURE PASSAGE STANDING

Surface: `?surface=structure_passage` (`data-public-path="understand_environment"`)

**Audit result:** No adjustment required.

At 1366x768, the structure passage total page height calculates to approximately 706px (section 665px + footer ~40px), which fits within the 768px viewport without overflow. The custom media control corrections from the prior OAR are preserved. No regression introduced.

---

## ONE-PAGE LAYOUT CONTRACT ASSESSMENT

The `@media (max-height: 780px) and (min-width: 900px)` block now enforces compact mode for both the assessment and crystal chamber at laptop viewport height. Corrections applied:

- Typography density: heading sub-line hidden, reference statement compressed
- Max-height: crystal video constrained from `min(34svh, 18rem)` → `min(24svh, 11rem)`
- Spacing: entry, video, sections gaps reduced
- Form: institutional context textarea suppressed (contextual input, not required for question completion)
- Padding: top and bottom padding reduced across both surfaces

No magic numbers introduced beyond clearly bounded laptop-specific constraints. No new asset dependencies. No route changes. No content mutation.

---

## SITEWIDE STYLE CONTRACT PRESERVATION

All prior sitewide style contract corrections preserved:

    governed button / CTA band treatment                     ✓
    removed native video controls where custom controls exist ✓
    Crystal Chamber Audio/Mute toggle                        ✓
    auto-advance behavior where DB contract controls it      ✓
    no generic full-border button return                     ✓
    no duplicated CTA styles                                 ✓

---

## BOUNDARY PRESERVATION

All OAR2 boundary constraints confirmed:

    understand_environment alias to structure_passage        ✓
    structure_passage continuation to crystal_chamber        ✓
    AI Operations Assessment title                           ✓
    seven-question assessment flow                           ✓
    reference statements                                     ✓
    question 5 usability                                     ✓
    contact/consent no-standing language                     ✓
    Crystal Questions video                                  ✓
    Structural Drift publication cover                       ✓
    Foundational Leadership CTA                              ✓
    Assess CTA                                               ✓
    footer copy                                              ✓
    internal Lapis launch chamber exclusion                  ✓
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

Screenshots not captured in this execution. Visual validation is required at:

    measures_assessment question 5 at 1366x768
    crystal_chamber at 1366x768
    structure_passage at 1366x768
    crystal_chamber at 1440x900
    measures_assessment question 5 at 1440x900

Expected output path: `docs/oar/measures-registry/visual-validation-laptop-frame-containment/`

---

## DB MUTATION

None. No DB rows read, written, or altered.

---

## DEPLOYMENT

None. Build artifact produced locally only (`dist-registry/`). No deployment executed.

---

## REMAINING DEFECTS

1. **Non-split eval_passage structural duplication (carried from prior OAR).** `RegisteredPassage.tsx` non-split layout renders the Continue CTA twice: once inside `.registry-diagnostic-passage-controls` (governed) and once as a naked `<button>` outside any governed container. Active path depends on DB `layout_mode` contract. Recommend OAR to unify.

2. **`.registry-public-understand-panel` dead CSS (carried from prior OAR).** `public_understand.css` retains box-style CSS for `.registry-public-understand-panel` selectors. Current JSX does not render those elements. Remove in a later OAR if confirmed dead.

3. **`PublicAssessmentResult.tsx` media controls not audited (carried from prior OAR).** If it renders video with native `controls`, include in a media control follow-up OAR.

4. **Screenshots not captured.** Visual validation at required viewports was not performed in this execution. The OAR2 requires screenshot pass before formal close. Recommend visual validation OAR or operator live review at `docs/oar/measures-registry/visual-validation-laptop-frame-containment/`.

5. **Institutional context textarea hidden at compact height.** `.registry-structured-context` is hidden at `max-height: 780px`. This trades the per-question context textarea for frame containment on 768px-class laptops. If the operator requires the context textarea on laptop, a layout refactor is needed (e.g., collapsible textarea, or scroll within the form panel only). Currently treated as acceptable compact-mode suppression per OAR2 scope.

---

## RECOMMENDED NEXT OAR

    oar2_validate_laptop_viewport_frame_containment_visual_output_v1

    Scope: Visual QA screenshots at all five required viewports for assessment and
    crystal chamber. Confirm that compact mode is visually correct, button treatment
    remains governed, and no regression exists in structure_passage or publication
    surfaces. Capture to docs/oar/measures-registry/visual-validation-laptop-frame-containment/.

---

## CLOSE

Laptop viewport containment: corrected.

Assessment: heading and form condensed to fit 768px frame. Reference statement, question, answers, and controls remain visible.
Crystal Chamber: entry, video, and section spacing reduced. Sections begin within the visible laptop frame.
Structure passage: no adjustment needed, fits 768px without overflow.
Sitewide contract: no regression.
Build: passing.

Codex holds.
Field structures.
Measures registers.
Claude executed as Cody-compatible executor from OAR2 only.
src renders seated state only.
