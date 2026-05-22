---
document_type: oar1
authority_level: working
document_scope: measures_registry_sitewide_runtime
title: OAR1 — Audit Measures Registry Sitewide Runtime Contract
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_measures_registry_sitewide_runtime_contract_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - sitewide-contract
  - runtime-contract
  - style-contract
  - audit
  - codex-first
---

# OAR1 — Audit Measures Registry Sitewide Runtime Contract

## OBJECTIVE

Audit for:

`docs/oar/measures_registry/oar2_audit_measures_registry_sitewide_runtime_contract_v1.meta.md`

Map the full sitewide runtime against the current implementation and seated DB contracts. Identify what is contracted, what is hardcoded, what is governed, what drifts, and what the correct implementation order is for seating the Measures Registry sitewide contract.

---

## FILES INSPECTED

| File | Role |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Full runtime host — all surface renderers, media resolution, eval flow, routing |
| `src/measures_registry/MeasuresAssessmentChamber.tsx` | Evaluation chamber component |
| `src/measures_registry/MeasuresAssessmentResult.tsx` | Result renderer |
| `src/measures_registry/MeasuresAssessmentBrandLayer.tsx` | Brand layer component |
| `src/measures_registry/measuresAssessmentCopy.ts` | Legacy frontend copy constants |
| `src/measures_registry/measuresAssessmentTypes.ts` | Type definitions including `EvalStep` |
| `src/index.css` | All Measures Registry CSS |

## DB CONTRACTS INSPECTED

| Script | Contract Seating |
|---|---|
| `execute-seat-approved-lapis-v2-brand-tokens.cjs` | 6 brand color tokens in `measures_design_token` |
| `execute-measures-registry-evaluation-encounter-contract.cjs` | Full encounter contract v1 for `measures_ai_operational_evaluation` and `iis_eval_gate1` |
| `execute-measures-registry-evaluation-encounter-contract-v2-amendment.cjs` | Styling contract v3, returned assessment contract v2, marble accent media role |
| `execute-evaluation-chamber-obsidian-intake-simplification-style-contract.cjs` | Obsidian simplification and `material_family: "obsidian"` |

---

## SECTION 1 — TYPOGRAPHY CONTRACT

### Current state

`.measures-registry-runtime` sets `font-size: var(--registry-body)` but no `font-family`.

Font families are spot-applied at individual selector level:
- `"Cormorant Garamond", Georgia, serif` — headings and display text (10+ distinct selector locations in CSS, no shared custom property)
- `Inter, system-ui, sans-serif` — ops-shell and lens-convergence utility classes only
- Body text of `.measures-registry-runtime` inherits the browser default — no explicit font stack on the runtime root

`REQUIRED_DESIGN_TOKEN_KEYS` includes size tokens (`body`, `section_headline`, `plaque_title`, `plaque_body`) but **no font-family tokens**. There is no `--registry-font-heading` or `--registry-font-body` custom property in the design token system or in the CSS.

### Gap

Typography family is not contract-governed. Cormorant Garamond is hardcoded at each heading selector. No sitewide font authority. No `font_family_heading` or `font_family_body` token in `measures_design_token`.

---

## SECTION 2 — COLOR / MATERIAL CONTRACT

### Current state — two-tier resolution chain

`.measures-registry-runtime` root defines brand semantic aliases:

```css
--registry-brand-field:         var(--registry-brand-obsidian, var(--registry-background-obsidian))
--registry-brand-panel-surface: var(--registry-brand-lapis-night, var(--registry-panel-obsidian))
--registry-brand-accent:        var(--registry-brand-deep-lapis, var(--registry-accent-cool))
--registry-brand-primary-text:  var(--registry-brand-silver-frame, var(--registry-text-primary))
--registry-brand-secondary-text:var(--registry-brand-marble-accent, var(--registry-text-secondary))
--registry-brand-muted-text:    var(--registry-brand-marble-accent, var(--registry-text-muted))
--registry-brand-border:        var(--registry-brand-silver-frame, var(--registry-border-subtle))
--registry-brand-highlight:     var(--registry-brand-crystal-star, var(--registry-text-primary))
```

**Tier 1:** `--registry-brand-*` tokens — lapis v2 brand palette (6 colors seated in `measures_design_token` with `token_scope: "brand"`):

| token_key | value | role |
|---|---|---|
| `brand_obsidian` | `#0E0E17` | primary field / institutional dark |
| `brand_deep_lapis` | `#1F2F8D` | primary lapis accent |
| `brand_lapis_night` | `#101A4D` | secondary lapis depth / panel surface |
| `brand_silver_frame` | `#D7DBE3` | text primary / borders |
| `brand_crystal_star` | `#F2F4F8` | highlight / high-value text |
| `brand_marble_accent` | `#C7CBD2` | secondary / muted text |

**Tier 2:** `--registry-*` base tokens — 24 required keys from `measures_design_token` (sizes, spacing, breakpoint). These serve as fallback when brand tokens are absent.

**Replacement alignment map** (from seating evidence):

| Legacy token | Brand replacement |
|---|---|
| `background_obsidian` | `brand_obsidian` |
| `panel_obsidian` | `brand_lapis_night` |
| `accent_cool` | `brand_deep_lapis` |
| `text_primary` | `brand_silver_frame` |
| `text_secondary` / `text_muted` | `brand_marble_accent` |
| `border_subtle` | `brand_silver_frame` |

### Material family contract — seated

Evaluation chamber styling contract (v3) is seated for `measures_ai_operational_evaluation` and `iis_eval_gate1`:

```json
{
  "material_family": "obsidian",
  "foundation_material": "obsidian",
  "atmospheric_material": "lapis",
  "structural_material": "marble"
}
```

CSS activates obsidian overrides via `[data-material-family="obsidian"]` selectors on `.measures-registry-runtime`.

### Gap

`mobile_breakpoint` is in `REQUIRED_DESIGN_TOKEN_KEYS` but CSS `@media` queries cannot consume runtime custom properties — they are hardcoded (`720px`, `760px`, `980px`). The token is semantically useful for documentation but cannot govern actual breakpoints in CSS.

No material family contract is seated for any surface other than the evaluation chamber.

---

## SECTION 3 — BUTTON / ICON CONTRACT

### Buttons — current state

No global `.measures-registry-runtime button` rule exists. Buttons are styled per-surface/per-form context in at least 8 distinct rule sets:

| Selector | Surface scope |
|---|---|
| `.registry-split-hero-routes button` | Threshold hero |
| `.registry-public-nav button` | Header nav |
| `.registry-encounter-actions button` | Encounter-level CTAs |
| `.registry-diagnostic-actions button` | Diagnostic/educational passage |
| `.registry-iis-eval-form button` | Evaluation form |
| `.reserve-seat-form button` | Seat hold form |
| `.registry-field-guide-cta button` | Field guide CTA |
| `.registry-review-actions button` | Operator review |

### Gap — buttons

No sitewide button baseline. Button styles are encounter-local. No `button_contract` in Codex.

### Icons — current state

Icon contract is **seated in Codex** for the evaluation encounter:

```json
{
  "assessment_icon": "clipboard_check",
  "warning_icon": "triangle_alert",
  "relation_icon": "network",
  "governance_icon": "shield",
  "continuation_icon": "arrow_right",
  "visibility_icon": "scan_search"
}
```

**`sectionCopy()` does not extract `icon_contract`.** No component in the renderer consumes icon contract fields. The icon contract is Codex-seated but runtime-orphaned — it has no frontend implementation.

### Gap — icons

Icon contract seated but not consumed. No icons render from Codex authority anywhere in the runtime.

---

## SECTION 4 — MEDIA BEHAVIOR CONTRACT

### Current state — video behavior per encounter

| Video | Surface | autoPlay | muted | controls | loop | mute source |
|---|---|---|---|---|---|---|
| `epigraph_video` | landing intro | yes | `epigraphMuted` state | no | no | independent state |
| `explainer_video` | educational diagnostic passage | yes | `passageMuted` state | yes | no | shared `passageMuted` |
| threshold motion videos | landing | yes | always muted | no | no | hardcoded |
| `c3FieldVideoUrl` | c3 field | yes | always muted | no | yes | hardcoded |
| offering videos | foundation/systems offering | conditional | conditional | no | no | from `video_mode` metadata |
| `structuredEnvironmentPassageVideoUrl` | evaluation result | yes | `passageMuted` state | yes | no | shared `passageMuted` |

### Gap 1 — shared `passageMuted` state

`passageMuted` is a single boolean state that controls `explainer_video` (educational diagnostic passage), `structuredEnvironmentPassageVideoUrl` (result surface), and `renderMarbleToneContinuity()` (audio). It persists across surface transitions. A mute decision made during the passage carries into the result. There is no encounter-scoped media state.

### Gap 2 — no media behavior contract for non-evaluation surfaces

`measures_encounter_def` metadata carries no `media_behavior_contract` for landing, path_choice, educate_eval, c3_field, or other surfaces. All video behavior for these surfaces is hardcoded in the renderer functions.

### Gap 3 — marble tone global persistence

`renderMarbleToneContinuity()` is mounted at the runtime root level. It plays across ALL surface states when `!passageMuted && marbleToneUrl`. There is no encounter-specific metadata field governing whether the marble tone should play on a given surface. It persists into evaluation, result, offering, seat hold, and all other surfaces.

---

## SECTION 5 — DESKTOP / MOBILE VIEWPORT FIT

### Current state

`.measures-registry-runtime` sets desktop layout defaults:

```css
--registry-page-padding-active: var(--registry-page-padding-desktop)
--registry-section-spacing-active: var(--registry-section-spacing-desktop)
--registry-plaque-padding-active: var(--registry-plaque-padding-desktop)
```

Responsive switching to mobile values occurs via `@media (max-width: 760px)` and `@media (max-width: 720px)` in CSS — hardcoded breakpoints.

`layout_contract.viewport_fit` is consumed only in the evaluation chamber:
- `data-layout-fit={layoutViewportFit}` applied to `<main>` in `MeasuresAssessmentChamber`
- CSS selector: `[data-material-family="obsidian"][data-layout-fit="single_screen_initial_view"]` — evaluation-specific

**No other surface** applies `data-layout-fit`. `layout_contract` is not seated or consumed for non-evaluation surfaces.

### Gap

Viewport fit contract exists only for the evaluation chamber. All other surfaces have no `layout_contract` in Codex and no `data-layout-fit` attribute. Viewport behavior is hardcoded in CSS.

---

## SECTION 6 — ENCOUNTER CONTAINMENT RULES

### Current state

Each surface renderer returns a standalone `<main className="measures-registry-runtime">`. Navigation via `navigateSurface()` replaces the entire `activeSurfaceElement`. Encounter containment is correct at the React rendering level.

### Gap 1 — result surface not isolated

The evaluation result surface (`evalSubmitted=true`) does NOT have its own `activeSurface` state. It renders inside the evaluation chamber's `<main>` without a surface transition. This was audited in `oar1_audit_evaluation_result_surface_runtime_contract_drift_v1.meta.md`. `data-surface` and `data-chamber-state` do not reflect the result phase.

### Gap 2 — no persistent layout shell

`renderHeader()` and `renderSystemFooter()` are inlined per surface call. There is no persistent layout shell or shared surface wrapper. A header contract change requires updating every surface that calls `renderHeader()` separately.

### Gap 3 — evaluation state not reset on surface departure

`evalAnswers`, `evalFields`, `evalStep`, `evalSectionIndex`, `evalSubmitting`, `evalError`, and `evalSubmitted` are not cleared when the user navigates away from the evaluation surface. If `evalSubmitted=true` and the user returns to `activeSurface === "iis_eval_gate1"`, the result screen shows — not the intake form. There is no evaluation reset mechanism.

---

## SECTION 7 — BRANDING / REGISTRY MARK USAGE

### Current state

Registry mark appears in three contexts:

| Context | How applied | Control |
|---|---|---|
| `renderHeader()` | `<img src={registryMarkUrl}>` — inherits container sizing | Called per-surface that requests a header |
| `MeasuresAssessmentBrandLayer` | Very low opacity watermark background behind chamber content | Always mounted inside chamber |
| `.registry-question-mark` | Absolute positioned, `clamp(1.5rem, 2.5vw, 2rem)`, `opacity: 0.55` | Conditional on `registryMarkUrl`, inside question fieldset |

Surfaces with header (and mark via header): `landing_path_choice`, `educate_eval_encounter`, `understand_failure`, `c3_field`, `reserve_seat`, `foundation_offering`, `systems_offering`, `foundation_seat_hold`, `systems_seat_hold`, `registered_process_log`, `seat_hold_notification_review`

Surfaces without mark: `landing_root` (intro + epigraph), `educational_diagnostic_passage`, `structural_drift_dispatches` (footer only, no header mark), `publication_dispatch`

### Gap

No sitewide mark authority. Mark usage is determined by whether a surface renderer calls `renderHeader()`. Mark sizing, opacity, and placement vary by context (header vs. brand layer vs. question face) without a unified contract. No `branding_contract` row in Codex governing global mark behavior.

---

## SECTION 8 — FOOTER / COPYRIGHT PLACEMENT

### Current state

`renderSystemFooter()` renders:

```tsx
<footer className="registry-system-footer">
  <p>© 2026 c3 Community Partners DAO, LLC</p>
  <p>Measures Registry is a registered <a href="/about">c3 Field</a> system.</p>
</footer>
```

Called by: `renderEducateEvalSurface()`, `renderStructuralDriftDispatchesSurface()`, `renderRegisteredProcessLogSurface()`

`renderStructuralDriftDispatchesSurface()` also renders a **second footer** with identical copyright:

```tsx
<footer className="registry-field-guide-footer">
  <p>© 2026 c3 Community Partners DAO, LLC</p>
  ...
  <button>c3 Field</button>
</footer>
```

Both render on the `structural_drift_dispatches` surface — **copyright is duplicated on one surface**.

Surfaces with no footer: intro, epigraph, path_choice, educational_diagnostic_passage, evaluation chamber, result, cohort_conversion, understand_failure, c3_field, reserve_seat, offering surfaces, hold surfaces, notification_review.

### Gap 1 — footer not sitewide

Footer present on only 3 of 18 surfaces. Not governed sitewide. Per-surface manual inclusion only.

### Gap 2 — copyright hardcoded in two JSX locations

Copyright text appears in two separate hardcoded JSX strings. No Codex authority. No `copyright_text` or `footer_contract` in any metadata row.

### Gap 3 — duplicate on structural drift dispatches surface

Both `renderSystemFooter()` and the inline `registry-field-guide-footer` render on the same surface.

---

## SECTION 9 — RUNTIME STATE ISOLATION

### Current state — gaps carried from prior audits

1. `EvalStep` type: `"src_capture" | "diagnostic" | "resolving"` — no `"complete"` state. `data-chamber-state="resolving"` persists during result display.

2. `evalSubmitted=true` persists on surface return. No reset mechanism. Returning to `"iis_eval_gate1"` shows result, not intake.

3. `passageMuted` is session-global, not encounter-scoped.

4. All eval state variables persist across surface transitions — not cleared on navigation.

---

## SECTION 10 — ENCOUNTER TRANSITION BEHAVIOR

### Current state

`navigateSurface(surface)` sets `activeSurface` immediately — no transition. The seated `interaction_contract.transition: "restrained_dissolve_fade"` for the evaluation chamber is **not implemented in CSS or React**. It is a Codex-stated design intent with no frontend execution.

### Gap

No React animation or CSS transition implements any seated transition contract. The Codex-seated `transition_style: "dissolve"` and `interaction_contract.transition: "restrained_dissolve_fade"` are unrealized. Either implement or retire from seating.

---

## SECTION 11 — HARDCODED COPY / CONSTANTS

### `measuresAssessmentCopy.ts` — four frontend constants

| Constant | Value | Usage in renderer | Status |
|---|---|---|---|
| `ASSESSMENT_PROCESS_TITLE` | `"MEASURES AI OPERATIONAL EVALUATION"` | Default prop in `MeasuresAssessmentChamber` | Conditional fallback — overridden by Codex |
| `ASSESSMENT_SUPPORT_LINE` | `"AI reflects the structure of the environment it operates within."` | Default prop in `MeasuresAssessmentChamber` | Conditional fallback — overridden by Codex |
| `ASSESSMENT_SUB_SUPPORT_LINE` | `"Structure enables acceleration. Ambiguity creates drift."` | **Unconditional render** in `MeasuresAssessmentResult.tsx:64` | **Active legacy constant — bypasses Codex** |
| `ASSESSMENT_TITLE` | `"MEASURES AI ENVIRONMENT ASSESSMENT"` | Conditional fallback in `MeasuresAssessmentResult.tsx:63` | Fallback — Codex value takes precedence |

These constants duplicate values now seated in Codex `encounter_contract.content_blocks`. The `ASSESSMENT_SUB_SUPPORT_LINE` usage at `MeasuresAssessmentResult:64` is the most critical — it always renders regardless of what is seated in Codex.

### Hardcoded JSX in `MeasuresAssessmentResult.tsx`

| Line | Content | Authority |
|---|---|---|
| 66 | `"Assessment"` span on standing report section | None — hardcoded |
| 73 | `"Findings"` label | None — hardcoded |
| 114 | `"Continue into the Structured Environment."` | None — fallback hardcoded copy |
| 42 | `"Assessment Complete"` completionLabel fallback | Hardcoded string — overridden if `assessmentCompletion.assessment_completion_label` seated |
| 58 | `"Enter Structured Environment"` progressionCta fallback | Hardcoded string — overridden if seated |

### Hardcoded JSX in `MeasuresRegistryRuntime.tsx` — intro surface

| Content | Surface | Status |
|---|---|---|
| `"Complexity is scaling faster than clarity. Your systems are producing outcomes nobody can fully explain."` | landing threshold — left | Hardcoded JSX |
| `"Evaluate the Environment"` | landing threshold — left CTA | Hardcoded JSX |
| `"Coherence must be structured. Measured environments produce stable and governable outcomes."` | landing threshold — right | Hardcoded JSX |
| `"Structure the Environment"` | landing threshold — right CTA | Hardcoded JSX |

These strings should resolve from `landing_root` encounter metadata `hero_paths` plaques. The runtime reads `heroPaths` from Codex but falls back to `"route_educate_eval"` and `"route_cohort_conversion"` action keys — the copy is entirely hardcoded.

### Additional hardcoded strings in `MeasuresRegistryRuntime.tsx`

| Content | Location | Status |
|---|---|---|
| `"Institutional Contact"` | src_capture fieldset legend | Hardcoded |
| `"Operational Evaluation"` | question fieldset legend | Hardcoded |
| `"Context before evaluation."` | educate_eval section heading | Hardcoded |
| `"Educational Grounding"` | educate_eval section header | Hardcoded |
| `"Registered observations before structural evaluation."` | educate_eval dispatch preview | Hardcoded |
| `"Begin Structural Evaluation"` | educate_eval diagnostic entry heading | Hardcoded |
| `"Operational Diagnostic Intake"` | educate_eval section label | Hardcoded |
| `"Dispatches from the Measures Registry"` | structural_drift default subtitle fallback | Hardcoded |
| `"© 2026 c3 Community Partners DAO, LLC"` | two footer locations | Hardcoded |

---

## SECTION 12 — REUSABLE RUNTIME ASSETS TO PRESERVE

| Asset | Type | Notes |
|---|---|---|
| `MeasuresAssessmentChamber` | Component | Well-structured, fully prop-driven, correctly wired to Codex |
| `MeasuresAssessmentBrandLayer` | Component | Isolated, reusable brand layer |
| `MeasuresAssessmentResult` | Component | Correct structure; requires gap fixes |
| `renderHeader()` | Renderer function | Metadata-driven via `header` and `actions` from Codex |
| `renderSystemFooter()` | Renderer function | Structure correct; copy needs to move to Codex |
| `renderMarbleToneContinuity()` | Renderer function | Correct isolation pattern; needs encounter scoping |
| `sectionCopy()` | Utility function | Comprehensive metadata extraction; no hardcoded fallbacks within |
| `resolveEnvironmentalReport()` | Utility function | Fully deterministic, fully Codex-driven |
| `mediaUrl()` | Utility function | Correct storage URL resolution |
| `navigateSurface()` + `writeHistory()` | Navigation functions | Surface routing + browser history — correct |
| `handleAction()` | Action router | Partially metadata-driven; some action keys hardcoded in switch |
| Token → `registryTokenStyle` pipeline | DB → CSS custom props | Correct injection pattern |
| `allAssessmentMechanics()` / `selectedConditionTraces()` / `replaceTemplateTokens()` | Evaluation pipeline | Fully Codex-driven; no hardcoded logic |
| `measures_design_token` contract | DB table | 30 active tokens (24 required + 6 brand) — correct authority |
| `measures_media_map` contract | DB table | 15 required roles + optional roles — correctly resolved |
| Obsidian material contract | CSS + Codex | Correctly governed via `data-material-family` |

---

## SECTION 13 — LEGACY BRANCHES TO RETIRE

| Item | Location | Reason to retire |
|---|---|---|
| `measuresAssessmentCopy.ts` | `src/measures_registry/` | All four constants belong in Codex metadata; `ASSESSMENT_SUB_SUPPORT_LINE` actively bypasses Codex |
| Threshold hero copy | `MeasuresRegistryRuntime.tsx` intro renderer | Should resolve from `landing_root.hero_paths` Codex metadata |
| Hardcoded chamber strings | `MeasuresRegistryRuntime.tsx` evaluation renderer | `"Institutional Contact"`, `"Operational Evaluation"`, `"Before evaluation begins..."` — should resolve from encounter_contract |
| Duplicate `registry-field-guide-footer` | `renderStructuralDriftDispatchesSurface()` | Duplicates `renderSystemFooter()`; copyright appears twice |
| `icon_contract` (orphaned) | Codex metadata | Seated in Codex, never consumed in frontend. Consume or remove |
| `interaction_contract.transition` (unrealized) | Codex metadata | `"restrained_dissolve_fade"` is stated but no CSS/React implementation. Implement or retire |
| `EvalStep` without `"complete"` | `measuresAssessmentTypes.ts` | Type union incomplete; causes `data-chamber-state` mismatch during result |

---

## SECTION 14 — REQUIRED DB / METADATA CONTRACT SURFACES

### Currently contracted (partial or full encounter_contract)

| Encounter key | Contract state |
|---|---|
| `measures_ai_operational_evaluation` | Full — encounter_contract v2, styling_contract v3, layout_contract, src_intake_contract, assessment_mechanics, assessment_interpretation, assessment_completion, icon_contract ✓ |
| `iis_eval_gate1` | Full (inherited from above) ✓ |
| `educational_diagnostic_passage` | Partial — styling_contract (obsidian), title, subtitle, eyebrow, actions ✓ |

### Currently un-contracted

| Encounter key | Missing contracts |
|---|---|
| `landing_root` | styling_contract, hero_path copy (threshold copy hardcoded), action labels |
| `landing_path_choice` | styling_contract, layout_contract, button/plaque copy partially from Codex (plaques) |
| `educate_eval_encounter` | styling_contract, layout_contract, section labels hardcoded |
| `cohort_conversion_encounter` | styling_contract |
| `understand_failure` | styling_contract |
| `c3_field` | styling_contract |
| `reserve_seat` | styling_contract |
| `foundation_offering` | styling_contract, media_behavior_contract |
| `systems_offering` | styling_contract, media_behavior_contract |
| `foundation_seat_hold` | styling_contract |
| `systems_seat_hold` | styling_contract |
| `structural_drift_dispatches` | styling_contract, footer_contract |
| `registered_process_log` | styling_contract |
| `evaluation_result` | **No encounter row exists** — result surface has no Codex record |

### Missing global contracts (no DB row exists)

| Contract | Required for |
|---|---|
| `sitewide_runtime_contract` | Typography, global button baseline, footer/copyright authority, marble tone scoping, branding mark rules per surface category |
| `font_contract` | Font family tokens — cannot go in `measures_design_token` as CSS values; need a font authority row |
| `footer_contract` | Copyright text, footer copy — currently hardcoded |
| `button_contract` | Sitewide button baseline |
| `marble_tone_contract` | Per-encounter playback scoping |

---

## SECTION 15 — RECOMMENDED IMPLEMENTATION ORDER

Ordered by dependency and impact. Each item maps to a correction OAR2.

### Priority 1 — Close known drift (minimal, already audited)

1. **`EvalStep` + `"complete"` state** — `measuresAssessmentTypes.ts` + `submitIisEvaluation` post-success path in `MeasuresRegistryRuntime.tsx`. Unblocks accurate `data-chamber-state` during result.

2. **`ASSESSMENT_SUB_SUPPORT_LINE` removal from result** — `MeasuresAssessmentResult.tsx:64`. Source from `assessmentCompletion` metadata. Retires the only unconditional frontend constant render on the result surface.

3. **Hardcoded JSX fallback in result** — `MeasuresAssessmentResult.tsx:114`. Render null when progression content not seated.

### Priority 2 — Seat sitewide governance row

4. **Seat `sitewide_runtime_contract`** in `measures_encounter_def` (or a new `measures_sitewide_contract` table row). Carry: font authority (heading/body stacks), global button contract, footer/copyright text, marble tone scoping rules, mark rules per surface tier. This is the authority row all per-surface OAR2s should reference.

### Priority 3 — Retire `measuresAssessmentCopy.ts`

5. **Retire all four constants** from `measuresAssessmentCopy.ts`. Move values to Codex. Update `MeasuresAssessmentChamber` default props to `undefined` — the Codex values are already seated. Remove the file.

### Priority 4 — Contract the landing surface

6. **Seat `landing_root` hero_path copy** — threshold copy, CTA labels — in `landing_root` Codex metadata. Update `renderIntroSurface()` to resolve from `landingRootCopy.heroPaths` plaques instead of hardcoded strings.

### Priority 5 — Footer centralization

7. **Seat footer/copyright in Codex** (via `sitewide_runtime_contract`). Update `renderSystemFooter()` to resolve copyright and sub-line from metadata. Remove hardcoded `registry-field-guide-footer` from `renderStructuralDriftDispatchesSurface()`.

### Priority 6 — Evaluation state reset

8. **Add `resetEvaluation()` function** — clears `evalAnswers`, `evalFields`, `evalStep`, `evalSectionIndex`, `evalSubmitted`, `evalError`. Call on navigation away from evaluation surfaces.

### Priority 7 — Contract remaining un-contracted surfaces

9. **Seat `styling_contract`** for each un-contracted encounter key (see Section 14). Start with `landing_path_choice`, `educate_eval_encounter`. Carry: `material_family`, `layout_contract`, `viewport_fit`.

### Priority 8 — Icon contract execution

10. **Either consume or retire `icon_contract`**. If icons are to be rendered, add extraction in `sectionCopy()` and implement icon rendering from metadata. If not, remove from seated encounter metadata to avoid false governance.

### Priority 9 — Marble tone scoping

11. **Seat `marble_tone_enabled` boolean per encounter** in `measures_encounter_def` metadata. Consume in `renderMarbleToneContinuity()` before rendering — check active surface metadata rather than rendering globally.

### Priority 10 — Transition implementation or retirement

12. **Decision on `interaction_contract.transition`**: If `"restrained_dissolve_fade"` is approved, implement via CSS transitions on `.measures-registry-runtime` with per-surface `data-chamber-state` changes. If not, remove from seated encounter contracts to avoid orphaned authority.

---

## SUMMARY — WHAT TO PRESERVE / RETIRE

### Preserve

- Full evaluation chamber stack: `MeasuresAssessmentChamber`, `MeasuresAssessmentResult`, `MeasuresAssessmentBrandLayer`, all Codex wiring, all evaluation flow logic
- `sectionCopy()` metadata extraction utility — no changes needed
- `resolveEnvironmentalReport()` — deterministic, fully contracted
- `measures_design_token` pipeline — correct pattern
- `measures_media_map` resolution — correct pattern
- Obsidian material CSS contract — correct, properly governed
- `renderHeader()` — correct structure, metadata-driven
- `navigateSurface()` + browser history — correct

### Retire

- `measuresAssessmentCopy.ts` — all four constants
- Hardcoded threshold hero copy in intro renderer
- Hardcoded section labels in educate_eval renderer
- Duplicate `registry-field-guide-footer` block
- Orphaned `icon_contract` seating (if icons not to be implemented)
- Orphaned `interaction_contract.transition` seating (if transitions not to be implemented)

---

## IMPLEMENTATION STATUS

Audit only. No renderer modifications. No DB state changes. No CSS changes.

---

## CLOSEOUT

Sitewide runtime contract audit complete.

The current runtime contains substantial working logic and correct Codex wiring for the evaluation surface. Typography, global button contract, marble tone scoping, footer/copyright, and branding mark rules are not sitewide-governed. The evaluation chamber is the only surface with a full seated encounter contract. Thirteen surfaces have no `styling_contract`. Four frontend copy constants remain active, one unconditionally. The `EvalStep` type is incomplete. The result surface has no Codex encounter row.

The recommended implementation order preserves all working evaluation logic and Codex contracts, retires only the legacy constants and orphaned authority seats, and sequences new contract seating from global → encounter-specific.

OAR1 ready for operator review.
