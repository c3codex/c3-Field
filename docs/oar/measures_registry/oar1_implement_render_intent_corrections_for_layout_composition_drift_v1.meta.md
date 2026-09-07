---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_render_intent_implementation
title: OAR1 - Implement Render Intent Corrections for Layout Composition Drift
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_implement_render_intent_corrections_for_layout_composition_drift_v1.meta.md
operator: op044
system: measures_registry
executed_at: 2026-07-05
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: browser_visible_executor
  src: encounter_renderer
tags:
  - oar1
  - measures-registry
  - render-intent
  - css-correction
  - layout-composition
  - browser-qa
---

# OAR1 - Implement Render Intent Corrections for Layout Composition Drift

## Result

RESOLVED. All four registered drift points were corrected, verified in a real browser at desktop and mobile, and their DB standing updated from `drift_detected` to `matched` / `preserve`. The resolver now consumes the seated layout/composition/render-intent metadata (not just `style_profile`), and the registered data attributes are exposed on every encounter root, including one render root (`PublicAssessmentSurface`) that had been missed until this pass. One preserved surface per material family was re-verified against its pre-existing screenshot with no visual difference.

## 1. Resolver and Renderer Attribute Exposure

[encounterStyleProfile.ts](../../../src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts):

- `LayoutProfile`, `CompositionProfile`, `RenderStatus`, `RenderIntent` are now derived from exported `as const` arrays (`LAYOUT_PROFILE_VALUES`, etc.) instead of bare union literals, so their allowed values exist at runtime, not just in the type system.
- Added `asEnum()` — narrows an unknown DB value to the union or returns `null`. Never invents a fallback.
- `resolveEncounterStyleProfile()` now reads `layout_profile`, `mobile_layout_profile`, `composition_profile`, `mobile_composition_profile`, `render_status`, `render_intent`, `render_drift_note` from `surfaceAssignmentMetadata` via `asEnum`/string-guard, in addition to `style_profile`. Every other field (`material_family`, `frame_profile`, etc.) is untouched — still resolved via `GAP_FIELDS`, still `null`, exactly as before. Nothing beyond the seven fields this OAR2 named was wired.
- Added `encounterStyleDataAttributes()` — resolves the profile once and returns the six `data-*` attributes named in OAR2 §2 (`data-style-profile`, `data-layout-profile`, `data-mobile-layout-profile`, `data-composition-profile`, `data-mobile-composition-profile`, `data-render-status`, `data-render-intent`). `render_drift_note` is deliberately excluded from the public attribute set, per OAR2's instruction that it may remain internal.

All 15 previous `data-style-profile={resolveEncounterStyleProfile(...)?.profile_key ?? undefined}` call sites across `CrystalSeatRenderer.tsx` (5), `ObsidianChamberRenderer.tsx` (2 `<main>` roots), `LapisChamberRenderer.tsx` (2), and `MarbleChamberRenderer.tsx` (6) were replaced with `{...encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)}`.

**Gap found and closed during this pass:** `obsidian_chamber_encounter_surface` (registry key `measures_assessment`) does not render its `<main>` inside any of the four chamber files above — it delegates to a standalone component, `PublicAssessmentSurface.tsx`, which previously received only a bare `styleProfile?: string | null` prop and set `data-style-profile` itself. Verifying this surface in the browser after wiring the other four files showed `data-layout-profile`/`data-composition-profile`/etc. were simply absent on it — not a regression from this OAR's edits (confirmed via `git diff`, this component was untouched until I fixed it), but a gap OAR2 §2's "on rendered encounter roots where available" requires closing. Changed `ObsidianChamberRenderer.tsx`'s `MeasuresAssessment` to compute `encounterStyleDataAttributes(encounter.surfaceAssignmentMetadata)` and pass the whole object as a new `encounterStyleAttrs` prop; `PublicAssessmentSurface.tsx`'s prop type and `<main>` were updated to spread it (replacing the old single-string prop). Verified in browser: `data-layout-profile="assessment_layout"`, `data-composition-profile="assessment_composition"`, `data-render-status="matched"` now all present, `data-style-profile="assessment_form_surface"` preserved, and the rendered page is pixel-identical to before (screenshot `06_obsidian_assessment_regression_check_v2.png` vs the original `04_obsidian_assessment_desktop.png` from the first OAR in this sequence).

**Unrelated finding, not fixed here (out of this OAR2's scope — "change unrelated DB state" is disallowed):** while investigating why this surface showed no watermark, I found `MeasuresAssessmentBrandLayer.tsx` (the component that would render the `subtle_mark` watermark seated for `obsidian_chamber_encounter_surface` in the very first OAR of this sequence) is defined but **never imported or used anywhere in the codebase** — confirmed by a project-wide grep. `PublicAssessmentSurface.tsx` does not render it. This means the `watermark_treatment: subtle_mark` value seated for this surface in the earlier OAR was based on a component that, in the live app, never actually mounts — the correct value should be `hidden_mark`. This is a pre-existing misclassification from an earlier OAR, not something introduced today, and correcting `watermark_treatment` is unrelated DB state this OAR2 does not authorize touching. Flagging for a future OAR to correct.

No renderer file's visual output changed as a result of §1 — verified by re-screenshotting every touched-but-not-corrected surface (see §3).

## 2. The Four Corrections

All four were implemented as scoped, attribute- or surface-gated CSS additions — no existing rule was rewritten in place, no flow/assessment/MAP/payment/routing logic was touched, and no new authority vocabulary was invented.

### crystal_seat_threshold — mobile split → stacked

**File:** `src/index.css`, mobile media query (`@media (max-width: 760px)`).

Replaced the block that kept `.registry-threshold-hero` at `grid-template-columns: minmax(0,1fr) minmax(0,1fr)` on mobile (a compressed two-column split, ~195px per side at 390px viewport) with rules scoped to `.measures-registry-runtime[data-mobile-layout-profile="stacked_layout"]`: single-column grid with two rows (`grid-template-rows: minmax(0,1fr) minmax(0,1fr)`, each seat `min-height: 50svh`), left-aligned copy at a wider `min(22rem, 88%)`, and the divide line rotated from a vertical seam to a horizontal one. Gated by the seated `data-mobile-layout-profile` attribute (not a bare class rule) so the correction is driven by registered authority, not a hardcoded assumption — and so a future surface without that registration would keep the old split behavior rather than silently inheriting this fix.

Desktop `split_layout` (the `grid-template-columns` rule outside the media query) was not touched.

**Evidence:** `04_crystal_threshold_after_mobile.png` (390×844 — two full-width, full-height-visible panels, both legible without scrolling) and `04_crystal_threshold_after_desktop_check.png` (1440×900 — confirms desktop split unchanged). Click-through confirmed the "Assess"/"Understand" navigation still works (advanced to `obsidian_chamber_orientation` on click).

### marble_chamber_results — desktop report card widened

**File:** `src/index.css`, appended after the shared `.registry-eval-resolution` rule.

Root cause, found via live measurement: `.registry-eval-resolution`'s `max-width` was `var(--registry-text-max-width)`, a **DB-seeded design token** (`measures_design_token.token_key = 'text_max_width'`, value `680px`) shared by dozens of unrelated components across the whole site for general prose measure. Changing that token would have altered every surface using it — explicitly forbidden ("must not receive visual changes"). Instead added `.measures-registry-runtime[data-layout-contract="findings_report"] .registry-eval-resolution { max-width: 56rem; }` — `data-layout-contract="findings_report"` is unique to `marble_chamber_results`, so only this surface is affected. Card width went from 680px (47% of a 1440px viewport) to 896px (62%) — meaningfully wider for document gravity, still well short of the shared `--registry-content-max-width` (1120px) that bounds its parent, so not full-bleed. Mobile is unaffected (mobile's parent width is already narrower than either value).

**Evidence:** `01_marble_results_after_desktop.png` vs the prior OAR's `07_marble_results_desktop.png`.

### marble_chamber_C2_compact — exchange authority vs. chamber/hero competition

**File:** `src/measures_registry/encounter_renderer/styles/encounters/marble.css`.

Desktop: `.registry-marble-map-layout` previously had no background of its own — the three-panel CAR/center/exchange structure sat directly on the full-bleed ceremonial marble-hall photo. Added a translucent grounding surface (`rgba(255,255,255,0.78)`, `backdrop-filter: blur(14px)`, subtle border/shadow) matching the treatment already used on `marble_chamber_results`'s report card, so the panel reads as the primary document and the architecture reads as a frame around it rather than a competing hero image. Added vertical margin so the panel doesn't touch the viewport edges.

Mobile: the three panels previously stacked with only a `border-bottom` line between them (`data-mobile-composition-profile` was seated as `exchange_composition`, but the actual rendering was a mechanical, undifferentiated scroll). Gave each of the three stacked panels its own margined, rounded, bordered card, so the sequence reads as three deliberate sections.

CAR acknowledgment logic (open/confirm) and the payment-continuation button's disabled/enabled state were not touched — verified by re-confirming all seven acknowledgments and clicking through to `marble_chamber_C2_agreement` successfully during QA.

**Evidence:** `02_marble_c2_compact_after_desktop.png`, `02_marble_c2_compact_after_mobile.png`, vs. the prior OAR's `08_marble_c2_compact_desktop.png` / `_mobile.png`.

### marble_chamber_C2_agreement — visual/content anchor

**File:** `src/measures_registry/encounter_renderer/styles/encounters/marble.css`.

Root cause, found by comparing computed styles against sibling marble surfaces: `[data-surface="marble_chamber_C2_agreement"]` never had the light-marble token overrides (`--registry-brand-primary-text`, `--registry-brand-accent`, etc.) that its siblings `marble_chamber_orientation` and `map_integrity_governance` already carry. Without them, it fell through to a same-specificity `[data-material-family="marble"]` rule in `index.css` (explicitly commented as being for two other, unrelated surfaces) that sets a near-black text color and a **blue** accent — producing exactly the observed symptom: low-contrast title text and an off-palette blue "Continue to Payment" button, directly on the light marble-hall background. Added the matching token overrides, combining both `[data-material-family="marble"][data-surface="marble_chamber_C2_agreement"]` attribute selectors so the fix wins regardless of stylesheet import order (rather than relying on source-order luck, which is what left this broken). Also added the same translucent grounding panel as the other two corrected marble surfaces, styled the existing "Selected pathway: …" line as a bordered badge instead of plain floating text, and enlarged the title.

**Content gap, reported as instructed rather than invented:** `marble_chamber_C2_agreement`'s `content_profile` in the encounter_def only supplies `title`, `cta_label`, `email_label`, and similar labels — no price, deliverables, or summary copy like the sibling MAP-compact screen shows. Per OAR2 §3 ("if content is insufficient, improve spacing/composition only and report content gap"), no new copy was invented and no additional data (e.g. the pathway card's price/deliverables from `map_integrity_governance`) was piped into this surface — doing so would have required changing what `__mreg_c2_pending` carries between screens, which touches MAP data flow and is out of this OAR's boundary. The composition is now correctly anchored and on-palette; the underlying thinness (no price/deliverables shown at the point of payment) remains a content gap for a future OAR to close deliberately.

**Evidence:** `03_marble_c2_agreement_before_desktop.png` (original, blue button, washed-out text) → `03_marble_c2_agreement_after_desktop.png` (token fix applied, still blue — first attempt only fixed `primary-text`, not `accent`, because the two attribute selectors were still tied in specificity with the offending index.css rule) → `03_marble_c2_agreement_after_desktop_v2.png` (after combining both attribute selectors, correct gold accent) → `03_marble_c2_agreement_after_mobile.png`.

## 3. Regression Check — One Matched Surface Per Material Family

Re-screenshotted one `render_status: matched` surface per material family after all four corrections landed, and compared against the corresponding screenshot from the first OAR1 in this sequence:

| material | surface | result |
| --- | --- | --- |
| crystal | `crystal_seat_encounter` (`/about`) | `05_crystal_encounter_regression_check.png` — pixel-identical layout to the original evidence. `layout_profile`/`composition_profile` attributes present, `render_status="matched"`. |
| obsidian | `obsidian_chamber_encounter_surface` (`/ai-operations-assessment`) | `06_obsidian_assessment_regression_check_v2.png` — identical to original (this is the surface whose data-attribute gap was closed in §1; visual output unchanged). |
| marble | `marble_chamber_orientation` | `08_marble_orientation_regression_check.png` — identical to original; confirms the C2_agreement-specific token fix did not leak onto this sibling surface. |
| lapis | `lapis_chamber_encounter` (`/undrifted`) | `07_lapis_regression_check.png` — identical to original. |

No unintended visual change was found on any of the four.

## 4. Method Note

All QA in this OAR was run against a local Vite dev server (unmodified source otherwise, same production Supabase project) rather than production, to avoid deploying CSS/JS changes before this OAR1 confirms them and to avoid writing real capture data to production tables unnecessarily. Reaching `marble_chamber_results` → `marble_chamber_C2_compact` → `marble_chamber_C2_agreement` required walking the live assessment → contact-capture flow with tagged test data (`"OAR2 QA Test Institution — DELETE ME 2"` / `"...3"`, `oar2-qa-test-2@` / `-3@measuresregistry.com`) twice. Both test rows were deleted from `measures_iis_eval_gate1_capture` immediately after evidence capture; a follow-up `count(*)` confirmed zero remain. The MAP payment step itself was never actually invoked (no Stripe call was made).

## Validation Query Output

```sql
select
  surface_key,
  metadata->>'layout_profile' as layout_profile,
  metadata->>'mobile_layout_profile' as mobile_layout_profile,
  metadata->>'composition_profile' as composition_profile,
  metadata->>'mobile_composition_profile' as mobile_composition_profile,
  metadata->>'render_status' as render_status,
  metadata->>'render_intent' as render_intent,
  metadata->>'render_drift_note' as render_drift_note
from public.measures_encounter_surface_assignment
where surface_key in (
  'crystal_seat_intro', 'crystal_seat_threshold', 'crystal_seat_orientation', 'crystal_seat_encounter',
  'obsidian_chamber_orientation', 'obsidian_chamber_encounter_surface', 'obsidian_chamber_C1_compact',
  'marble_chamber_orientation', 'marble_chamber_results', 'marble_chamber_encounter',
  'marble_chamber_C2_compact', 'marble_chamber_C2_agreement', 'marble_chamber_C2_resolution',
  'lapis_chamber_encounter'
)
order by surface_key;
```

| surface_key | render_status | render_intent | render_drift_note | changed this OAR? |
| --- | --- | --- | --- | --- |
| crystal_seat_intro | matched | preserve | null | no (already matched) |
| crystal_seat_threshold | matched | preserve | null | **yes** — was drift_detected/transform |
| crystal_seat_orientation | matched | preserve | null | no |
| crystal_seat_encounter | matched | preserve | null | no |
| obsidian_chamber_orientation | matched | preserve | null | no |
| obsidian_chamber_encounter_surface | matched | preserve | null | no (data attributes fixed, status unchanged) |
| obsidian_chamber_C1_compact | matched | preserve | null | no |
| marble_chamber_orientation | matched | preserve | null | no |
| marble_chamber_results | matched | preserve | null | **yes** — was drift_detected/resolve |
| marble_chamber_encounter | unavailable | hold | legacy alias forwards to marble_chamber_results and renders no visible DOM | no (untouched, still correctly held) |
| marble_chamber_C2_compact | matched | preserve | null | **yes** — was drift_detected/resolve |
| marble_chamber_C2_agreement | matched | preserve | null | **yes** — was drift_detected/resolve |
| marble_chamber_C2_resolution | matched | preserve | null | no |
| lapis_chamber_encounter | matched | preserve | null | no |

No `null`/`held`/`unavailable` values remain among the 13 real surfaces except the one already-justified hold on `marble_chamber_encounter` (unchanged, no visible DOM).

## Boundary Preservation

- No new style/layout/composition/render vocabulary was created — only the seven fields and their existing allowed values (per the prior two OARs) were consumed and, for the four drift points, re-verified and re-seated.
- No CAR acknowledgment, payment-continuation, assessment, MAP, release, or routing logic was changed — confirmed by walking the full flow through to `marble_chamber_C2_agreement` successfully during QA.
- `publication_dispatch` was not touched.
- No historical record was deleted.
- Matched surfaces received no intentional visual change; the one incidental gap closed (`obsidian_chamber_encounter_surface`'s missing data attributes) was a data-attribute-only fix with a verified pixel-identical render, not a style change.

## Closeout

Renderer and CSS now consume the registered layout/composition/render-intent authority instead of only `style_profile`. All four named drift points are corrected, verified in-browser at both viewports, and reflected in DB standing. One additional gap (missing data attributes on the assessment-form render root) was found and closed as a natural consequence of doing this properly. One pre-existing, unrelated misclassification (`obsidian_chamber_encounter_surface`'s `watermark_treatment`) and one content gap (`marble_chamber_C2_agreement`'s thin payment-screen copy) were found and are reported, not fixed, per this OAR's boundary.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implemented the four corrections and verified them in-browser.
src renders the seated authority.
CSS executes the registered correction.
