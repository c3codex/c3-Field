---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Correct CSS Parity for Registered Runtime Downstream Surfaces
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_css_parity_for_registered_runtime_downstream_surfaces_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - css-parity
  - styling-contract
  - registered-runtime
  - downstream-surfaces
  - visual-qa
  - codex-first
---

# OAR1 — Correct CSS Parity for Registered Runtime Downstream Surfaces

## EXECUTION SUMMARY

CSS parity correction for 11 missing renderer classes across 4 downstream surfaces.

Source: `docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md`

No DB rows modified. No routing changed. No scoring changed. No contact capture behavior changed. No email contract behavior changed. No renderer files modified. No hardcoding corrections made (those are Group B/C OARs). Old runtime not touched.

First two public surfaces (`ai_isnt_broken_intro`, intro threshold / path-choice entry) were not touched.

---

## CSS FILE MODIFIED

**`src/index.css`** — new block inserted before `@media (max-width: 760px)` at line 6125 (original), between `.reserve-seat-error` and the mobile media query section.

---

## CLASSES ADDED

### connect_src surface (2 classes)

**`.registry-connect-src`**
- Single-screen section layout: `min-height: 100svh`, `width: min(--registry-text-max-width, ...)`, `margin: 0 auto`
- Padding: `calc(--registry-header-height + --registry-section-spacing-active) 0 --registry-page-padding-active`
- `display: grid`, `gap: --registry-section-spacing-active`, `align-content: start`
- Matches contract: obsidian material surface (inherits root tokens), single_screen, authority_surface layout

**`.registry-eval-error`**
- `margin: 0`, `color: #ffb7a8`, `font-size: --registry-body-active`
- Error color matches `.registry-form-error` precedent
- Contract: visibly clear, not visually dominant

### measures_eval_email_contract surface (5 classes)

**`.registry-eval-email-contract`**
- Same single-screen section layout as `.registry-connect-src`
- `align-content: start` — delivery confirmation top-aligned per `delivery_contract` layout

**`.registry-email-package-summary`**
- `display: grid`, `gap: 0.85rem`
- `border: 1px solid --registry-brand-border`, `background: --registry-brand-field-wash`
- `padding: clamp(0.9rem, 2.2vw, 1.35rem)`
- Restrained containment for package content

**`.registry-email-section`**
- Assessment result article: `display: grid`, `gap: 0.35rem`
- `border-bottom: 1px solid --registry-brand-border`, `padding-bottom: 0.7rem`
- Child span: muted label style (letter-spacing, uppercase, entry-label scale)
- Child h2: `clamp(1.35rem, 2.6vw, 2rem)`, primary-text color, weight 600

**`.registry-email-package-includes`**
- List reset: `margin: 0`, `padding: 0`, `list-style: none`
- `display: grid`, `gap: 0`, secondary-text color, body scale
- Child li: `border-top: 1px solid --registry-brand-border`, `padding: 0.45rem 0`

**`.registry-email-dispatch-note`**
- `margin: 0`, `color: --registry-brand-muted-text`, `font-size: --registry-entry-label`, `line-height: 1.45`
- Visually secondary — deferred delivery note

### measures_phases_reveal surface — marble (4 classes)

**`.registry-phases-reveal`**
- Same section layout with `min(--registry-content-max-width, ...)` — wider than text-max for reveal layout
- `position: relative`, `overflow: hidden` — contains absolutely-positioned background image
- `align-content: start`

**`.registry-phases-background`**
- `position: absolute`, `inset: 0`, `width: 100%`, `height: 100%`
- `object-fit: cover`, `opacity: 0.22`, `pointer-events: none`
- Background image atmospheric — lapis accent per contract

**`.registry-phases-reveal > *:not(.registry-phases-background)`**
- `position: relative`, `z-index: 1`
- Lifts all content above absolutely-positioned background image

**`.registry-phases-standing`**
- Assessment standing display: `border`, `background: --registry-brand-field-wash`, `padding: clamp(...)`
- Child span: muted label (uppercase, 0.1em spacing, entry-label scale)
- Child h2: `clamp(1.35rem, 2.6vw, 2rem)`, weight 600, primary-text
- Child p: secondary-text, body scale, 1.45 line-height

**`.registry-phases-sections`**
- `display: grid`, `gap: 0.75rem`, `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))`
- Article children: bordered, `background: --registry-brand-field-wash`, padded, grid with gap
- h3: plaque-title scale, weight 600, 1.2 line-height
- p: body scale, secondary-text, 1.45 line-height

### about_measures_registry surface — marble (2 classes)

**`.registry-about-authority`**
- Same section layout with `min(--registry-content-max-width, ...)`
- `position: relative`, `overflow: hidden` — contains marble accent image
- `align-content: start`

**`.registry-about-marble`**
- `position: absolute`, `inset: 0`, `width: 100%`, `height: 100%`
- `object-fit: cover`, `opacity: 0.12`, `pointer-events: none`
- Restrained atmospheric marble accent per branding contract

**`.registry-about-authority > *:not(.registry-about-marble)`**
- `position: relative`, `z-index: 1`
- Lifts encounter-entry and encounter-actions above marble accent image

### Marble material token overrides (shared)

**`.measures-registry-runtime[data-material-family="marble"]`**
- `--registry-brand-field: #f4efe4` — marble warm stone surface
- `--registry-brand-panel-surface: #eae4d9`
- `--registry-brand-primary-text: #13110e` — near-black on marble
- `--registry-brand-secondary-text: #3d3830`
- `--registry-brand-muted-text: #6b6357`
- `--registry-brand-border: rgba(19, 17, 14, 0.14)`
- `--registry-brand-accent: #2b5ab8` — lapis accent per contract
- `--registry-brand-highlight: #2b5ab8`
- `--registry-brand-panel-wash: color-mix(in srgb, #eae4d9 72%, transparent)`
- `--registry-brand-field-wash: color-mix(in srgb, #f4efe4 76%, transparent)`

Governs both `measures_phases_reveal` and `about_measures_registry` surfaces. Attribute selector (`[data-material-family="marble"]`) has higher specificity than the root class rule, correctly overriding obsidian defaults.

---

## EXISTING CSS TOUCHED

None. No existing CSS rules were altered. The new block is a clean append before the mobile media query section.

---

## BUILD RESULT

```
✓ built in 3.78s
dist-registry/assets/index-BpyuzWUq.css  159.80 kB │ gzip: 25.74 kB
dist-registry/assets/index-COORX2Fq.js   507.11 kB │ gzip: 140.26 kB
```

Clean build. No errors.

---

## BROWSER VISUAL QA

Browser QA for the surface-level views and the full branch must be completed by the operator. The following is what each surface should now express:

**`?surface=connect_src`**
- Single-screen obsidian contact capture surface
- `.registry-connect-src` provides single-screen contained layout
- `.registry-encounter-entry` heading/subtitle visible above form
- `.registry-iis-eval-form` form fields readable with existing styling
- CTA in `.registry-encounter-actions` below form
- `.registry-eval-error` error state: muted warm error color, no DOM disruption

**`?surface=measures_eval_email_contract`**
- Single-screen obsidian delivery confirmation surface
- `.registry-eval-email-contract` provides contained layout
- Assessment standing in `.registry-email-section` with label + heading hierarchy
- Package items in `.registry-email-package-includes` as clean separated list
- Dispatch note in `.registry-email-dispatch-note` visually secondary
- CTA below confirmation content

**`?surface=measures_phases_reveal`**
- Single-screen marble light-surface reveal
- Marble background: light warm stone (`#f4efe4`), dark institutional text (`#13110e`)
- Lapis background image (if seated) renders at 0.22 opacity behind content
- Assessment standing in `.registry-phases-standing` with bordered card
- Phase sections in responsive grid via `.registry-phases-sections`

**`?surface=about_measures_registry`**
- Marble authority surface with restrained marble accent image (0.12 opacity)
- Institutional dark text on warm marble ground
- `.registry-encounter-entry` heading visible above CTA
- Lapis accent on CTA button (`#2b5ab8`)

**Full branch validation required:**
```
intro -> eval_passage -> measures_assessment -> connect_src
  -> measures_eval_email_contract -> measures_phases_reveal -> about_measures_registry
```

---

## DB ROWS MODIFIED

None.

---

## SOURCE FILES MODIFIED OUTSIDE CSS

None.

---

## CONFIRMATIONS

- No DB rows modified ✓
- No routing changed ✓
- No scoring changed ✓
- No contact capture behavior changed ✓
- No email contract behavior changed ✓
- No email dispatch implemented ✓
- No renderer files modified ✓
- No hardcoding corrections (Group B/C — deferred) ✓
- Old `src/measures_registry/MeasuresRegistryRuntime.tsx` not touched ✓
- First two public surfaces not touched ✓
- Build clean ✓

---

## SUCCESS CONDITION MET

All 11 missing CSS classes from the styling audit now have coverage in `src/index.css`:

connect_src (2): `.registry-connect-src`, `.registry-eval-error`
measures_eval_email_contract (5): `.registry-eval-email-contract`, `.registry-email-package-summary`, `.registry-email-section`, `.registry-email-package-includes`, `.registry-email-dispatch-note`
measures_phases_reveal (4): `.registry-phases-reveal`, `.registry-phases-background`, `.registry-phases-standing`, `.registry-phases-sections`
about_measures_registry (2): `.registry-about-authority`, `.registry-about-marble`

Marble material token overrides added: `.measures-registry-runtime[data-material-family="marble"]`

The registered runtime downstream surfaces now have CSS foundations to visually express their seated styling contracts. Routing, scoring, contact capture, email contract behavior, and accepted entry surfaces are unchanged.

---

## REMAINING OPEN OARs

Per the audit correction map:

**Group B — Combined renderer + CSS (not executed in this OAR)**
- `RegisteredPhaseReveal`: `data-material-family="marble"` hardcoded — should read from `phaseRevealCopy.stylingContract?.material_family`
- `RegisteredAbout`: `data-material-family="marble"` hardcoded — should read from `aboutCopy.stylingContract?.material_family`; eyebrow fallback hardcoded

**Group C — Renderer-class correction (not executed in this OAR)**
- `passageMuted` is session-global state — should reset at encounter exit (mrssc_v1_media_behavior_contract)
- `RegisteredConnectSrc`: `SRC_FIELDS` / `SRC_LABELS` hardcoded — should read from `encounterCopy` (mrssc_v1_color_material_contract)

**Group D — DB contract correction (not executed in this OAR)**
- `structured_eval` layout_contract v1 under-specified relative to `MeasuresAssessmentChamber` v2 behavior
- `measures_eval_email_contract` transition_contract route_expectation stale vs `route_after_capture`
