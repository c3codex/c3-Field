---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_browser_qa_style_authority
title: OAR1 - Browser QA and Seat Held Encounter Style Fields
status: resolved
version: v2
source_oar2: docs/oar/measures_registry/oar2_browser_qa_seat_held_encounter_style_fields_v1.meta.md
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
  - browser-qa
  - encounter-style
  - held-fields
  - db-seating-resolved
  - visual-governance
---

# OAR1 - Browser QA and Seat Held Encounter Style Fields

## Result

RESOLVED.

This run superseded the prior `status: held_browser_capability_blocked` (v1) result recorded below the `## Superseded Prior Run` heading. Browser capability was available in this thread via the Playwright MCP browser tools. All 14 active Measures Registry encounter surfaces were walked in a real browser against a local Vite dev server (`npm run dev`, `http://localhost:5173`, unmodified production code) at desktop (1440×900) and mobile portrait (390×844) viewports. Evidence (screenshots, computed layout rects, DOM/data attributes) was recorded before any DB seating occurred, per the OAR2 gate.

Why a local dev server instead of `measuresregistry.com`: the app is a single client-rendered React runtime (`src/app/App.tsx` renders the same `MeasuresRegistryOrchestrator` on any hostname that isn't `measuresregistry.com`/`measuresofinanna.com`/`c3field.online`), so `localhost:5173` renders byte-identical source against the same production Supabase project (`zfihrspxvennjzazxcbj`). This avoided submitting QA/test data through the live production capture endpoints and Stripe checkout while still observing real rendered behavior of real code.

## Browser QA Evidence

Desktop (1440×900) and mobile portrait (390×844) screenshots for every surface are saved beside this OAR1 in:

`docs/oar/measures_registry/oar1_browser_qa_seat_held_encounter_style_fields_v1_evidence/`

| surface_key | route / navigation path used | viewport(s) | screenshot(s) | observed DOM/CSS basis |
| --- | --- | --- | --- | --- |
| crystal_seat_intro | `/` (default initial surface) | desktop, mobile | `01_crystal_intro_desktop.png`, `01_crystal_intro_mobile.png` | `<section class="registry-crystal-intro">` full-viewport video, `data-layout-contract="crystal_intro"`; headline bottom-left, `.registry-crystal-intro-audio` floating button; no header/footer rendered |
| crystal_seat_threshold | click-through from intro (video `onEnded`/click advances) | desktop, mobile | `02_crystal_threshold_desktop.png`, `02_crystal_threshold_mobile.png` | `.registry-threshold-hero` = CSS grid, two `.registry-threshold-seat` panels each exactly 50% width at both viewports (720/720 @1440; 195/195 @390); `.undrifted-persistent-mark` present, rect spans full width near bottom |
| crystal_seat_orientation | threshold right seat ("Understand the Environment") | desktop, mobile | `12_crystal_orientation_desktop.png`, `12_crystal_orientation_mobile.png` | media zone (394px) + `.registry-crystal-orientation-content` (532px) span x=228–1212 of 1440 (68%); `.registry-crystal-orientation-cta` left-aligned at column start; mobile stacks video above copy |
| crystal_seat_encounter | `/about` (direct route) | desktop, mobile | `11_crystal_encounter_about_desktop.png`, `11_crystal_encounter_about_mobile.png` | multi-section page, orientation/connect columns measured at 984/1440 (68%); `.undrifted-persistent-mark` present; `.registry-about-connect-submit` in right-hand form column; mobile stacks all sections to one column |
| obsidian_chamber_orientation | threshold left seat ("Assess the Environment") | desktop, mobile | `03_obsidian_orientation_desktop.png`, `03_obsidian_orientation_mobile.png` | `.registry-obsidian-orientation-lower` 984/1440 (68%); `.registry-obsidian-orientation-cta` at x=744 (right half); no watermark element; mobile stacks video → review sections → CTA |
| obsidian_chamber_encounter_surface | `/ai-operations-assessment` (direct route) | desktop, mobile | `04_obsidian_assessment_desktop.png`, `04_obsidian_assessment_mobile.png`, `04b_obsidian_srccapture_full.png` | `.registry-iis-eval` card 1088/1440 (75.5%); `Continue` button at x=955 (right); `MeasuresAssessmentBrandLayer` renders `.registry-assessment-watermark` — confirmed via `src/index.css:5034` (`opacity: .1`, `width: min(76vw, 46rem)`) and DB (`registry_watermark` media role active) — a large, low-opacity background mark, i.e. subtle, not hidden; mobile stacks to single column |
| obsidian_chamber_C1_compact | submitted 7-question assessment with test answers, then contact form | desktop, mobile | `05_obsidian_c1_compact_desktop.png`, `05_obsidian_c1_compact_mobile.png` | form 990.9/1440 (69%); submit button at x=978 (right); `data-release-standing="public_contact_gated"`; renders a distinct held sub-state (`held_missing_session`) when `__mreg_c1_pending` sessionStorage is absent — content is dependent on completing the assessment in the same session |
| marble_chamber_orientation | reached automatically after C1 submit | desktop, mobile | `06_marble_orientation_desktop.png`, `06_marble_orientation_mobile.png` | `.registry-marble-orientation-card` 768/1440 (53%), centered (x=336, card center = viewport center); CTA spans full card width, centered; `data-release-standing="public"` unconditional; mobile preserves the same centered-card composition, just narrower |
| marble_chamber_results | `Continue` from marble_chamber_orientation | desktop, mobile | `07_marble_results_desktop.png`, `07_marble_results_mobile.png` | white document-style card over marble background (soft overlay for readability); CTA `MAP the Environment` bottom-right of card; renders "Assessment report is not ready" held fallback when `__mreg_pending_report` is absent — dependent on the assessment session; mobile: card collapses to full width, sections stack |
| marble_chamber_encounter | never independently observable | n/a — see note | none | `MarbleChamberRenderer.tsx` line 70-74: `if (surface === "marble_chamber_encounter") { props.onNavigate("marble_chamber_results"); return null }` — the component returns `null` and immediately forwards. Confirmed empirically: walking the live transition graph from `obsidian_chamber_C1_compact` → `marble_chamber_orientation` → `marble_chamber_results` never produced a distinct `marble_chamber_encounter` paint. `encounter_structure` in DB also marks it `"standing":"legacy_alias_for_marble_chamber_results"`. No visual instance exists to observe. |
| marble_chamber_C2_compact | `Continue to Payment` from marble_chamber_results → `/map-integrity-governance` | desktop, mobile | `08_marble_c2_compact_desktop.png`, `08_marble_c2_compact_mobile.png` | `.registry-marble-map-layout` 1400/1440 (97%, edge-to-edge three-panel); CAR panel / center panel / exchange panel side by side; `Continue to Payment` in right exchange panel; mobile stacks the three panels into one column in the same top-to-bottom order |
| marble_chamber_C2_agreement | confirmed all CAR acknowledgments, `Continue to Payment` | desktop, mobile | `09_marble_c2_agreement_desktop.png`, `09_marble_c2_agreement_mobile.png` | `.registry-marble-payment-agreement` panel 576/1440 (40%), centered; CTA spans full panel width, centered; renders `held_missing_session` fallback when `__mreg_c2_pending` is absent — dependent on completing the MAP acknowledgment step; mobile preserves the same centered single-panel composition |
| marble_chamber_C2_resolution | direct navigation to `/map-integrity-governance?payment=success` (documented `initialSurface()` branch in `MeasuresRegistryOrchestrator.tsx`, the same query param Stripe's `success_url` uses) | desktop, mobile | `10_marble_c2_resolution_desktop.png`, `10_marble_c2_resolution_mobile.png` | centered confirmation panel (~924/1440, 64%) over full-bleed marble hall background; `Finish` button centered; terminal surface, only reachable via the `?payment=success` redirect param in the live app — dependent on completing checkout; mobile preserves the same centered composition |
| lapis_chamber_encounter | `/undrifted` (direct route) | desktop, mobile | `13_lapis_encounter_desktop.png`, `13_lapis_encounter_mobile.png` | magazine/editorial grid, content span ~1150/1440 (80%); hero feature panel uses a dark gradient treatment over a cinematic image for text legibility; `ASSESS THE ENVIRONMENT` CTA in top-right sidebar card; mobile collapses the grid to a single stacked column |

Anomaly noted, not corrected (out of OAR2 boundary — no CSS/renderer changes made): on `crystal_seat_encounter` (`/about`) desktop, a codexstone caption ("APPROVALS,") renders visually overlapping the bottom of the boxed video rather than beneath it. Flagged for a future OAR; not touched here.

## Resolved Six Held Fields

Seated as sibling keys on the existing `measures_encounter_surface_assignment.metadata` object for each surface — no second style authority surface was created, and no previously-seated non-held fields were altered.

| surface_key | content_width | button_position | overlay_treatment | watermark_treatment | mobile_behavior | release_state_behavior |
| --- | --- | --- | --- | --- | --- | --- |
| crystal_seat_intro | full_bleed_measure | floating_cta | soft_overlay | hidden_mark | preserve_frame | visible_state |
| crystal_seat_threshold | full_bleed_measure | left_cta | soft_overlay | persistent_mark | preserve_frame | visible_state |
| crystal_seat_orientation | institutional_measure | left_cta | none_overlay | hidden_mark | stack_content | visible_state |
| crystal_seat_encounter | institutional_measure | right_cta | none_overlay | persistent_mark | stack_content | visible_state |
| obsidian_chamber_orientation | institutional_measure | right_cta | none_overlay | hidden_mark | stack_content | visible_state |
| obsidian_chamber_encounter_surface | institutional_measure | right_cta | none_overlay | subtle_mark | stack_content | visible_state |
| obsidian_chamber_C1_compact | institutional_measure | right_cta | none_overlay | hidden_mark | stack_content | dependent_state |
| marble_chamber_orientation | reading_measure | center_cta | none_overlay | hidden_mark | preserve_frame | visible_state |
| marble_chamber_results | reading_measure | right_cta | soft_overlay | hidden_mark | stack_content | dependent_state |
| marble_chamber_encounter | null (held) | null (held) | null (held) | null (held) | null (held) | unavailable_state |
| marble_chamber_C2_compact | full_bleed_measure | right_cta | soft_overlay | hidden_mark | stack_content | visible_state |
| marble_chamber_C2_agreement | narrow_measure | center_cta | soft_overlay | hidden_mark | preserve_frame | dependent_state |
| marble_chamber_C2_resolution | institutional_measure | center_cta | soft_overlay | hidden_mark | preserve_frame | dependent_state |
| lapis_chamber_encounter | immersive_measure | right_cta | cinematic_overlay | hidden_mark | stack_content | visible_state |

Held field and reason:

- `marble_chamber_encounter` — five fields left `null`. This surface is a legacy alias whose renderer forwards immediately to `marble_chamber_results` and returns `null` without painting any DOM (`MarbleChamberRenderer.tsx:70-74`), and the DB's own `encounter_structure` marks it `"legacy_alias_for_marble_chamber_results"`. No browser-visible instance of this surface exists to source content_width/button_position/overlay_treatment/watermark_treatment/mobile_behavior from, so per the OAR2 rule those five fields remain `null` rather than inferred. `release_state_behavior` was seated as `unavailable_state` because that classification is itself directly supported by the observed absence of any render path.

`release_state_behavior` classification basis: `visible_state` was used where the surface's `data-release-standing` is unconditionally `"public"` in source and no gating fallback UI exists. `dependent_state` was used where the renderer has a distinct, observed fallback ("held_missing_session" / "Assessment report is not ready") that renders instead of the full surface when a same-session prerequisite (sessionStorage state from a prior step, or the Stripe `?payment=success` redirect param) is absent — i.e., the rendered content is dependent on that prior step. `unavailable_state` was used only for `marble_chamber_encounter`, per above.

## Validation Query Output

```sql
select
  surface_key,
  metadata->>'style_profile' as style_profile,
  metadata->>'material_family' as material_family,
  metadata->>'frame_profile' as frame_profile,
  metadata->>'space_profile' as space_profile,
  metadata->>'content_anchor' as content_anchor,
  metadata->>'typography_profile' as typography_profile,
  metadata->>'motion_profile' as motion_profile,
  metadata->>'surface_density' as surface_density,
  metadata->>'visual_tension' as visual_tension,
  metadata->>'media_ratio' as media_ratio,
  metadata->>'content_width' as content_width,
  metadata->>'button_position' as button_position,
  metadata->>'overlay_treatment' as overlay_treatment,
  metadata->>'watermark_treatment' as watermark_treatment,
  metadata->>'audio_control_treatment' as audio_control_treatment,
  metadata->>'mobile_behavior' as mobile_behavior,
  metadata->>'release_state_behavior' as release_state_behavior
from public.measures_encounter_surface_assignment
where surface_key in (
  'crystal_seat_intro', 'crystal_seat_threshold', 'crystal_seat_orientation', 'crystal_seat_encounter',
  'obsidian_chamber_orientation', 'obsidian_chamber_encounter_surface', 'obsidian_chamber_C1_compact',
  'marble_chamber_orientation', 'marble_chamber_results', 'marble_chamber_encounter',
  'marble_chamber_C2_compact', 'marble_chamber_C2_agreement', 'marble_chamber_C2_resolution',
  'lapis_chamber_encounter', 'publication_dispatch'
)
order by surface_key;
```

| surface_key | style_profile | content_width | button_position | overlay_treatment | watermark_treatment | audio_control_treatment | mobile_behavior | release_state_behavior |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| crystal_seat_encounter | public_about_encounter | institutional_measure | right_cta | none_overlay | persistent_mark | null | stack_content | visible_state |
| crystal_seat_intro | media_intro_full_bleed | full_bleed_measure | floating_cta | soft_overlay | hidden_mark | always_visible_audio | preserve_frame | visible_state |
| crystal_seat_orientation | talking_head_orientation | institutional_measure | left_cta | none_overlay | hidden_mark | always_visible_audio | stack_content | visible_state |
| crystal_seat_threshold | split_threshold_motion_still | full_bleed_measure | left_cta | soft_overlay | persistent_mark | null | preserve_frame | visible_state |
| lapis_chamber_encounter | publication_index_promoted | immersive_measure | right_cta | cinematic_overlay | hidden_mark | null | stack_content | visible_state |
| marble_chamber_C2_agreement | marble_payment_surface_profile | narrow_measure | center_cta | soft_overlay | hidden_mark | null | preserve_frame | dependent_state |
| marble_chamber_C2_compact | marble_map_surface_profile | full_bleed_measure | right_cta | soft_overlay | hidden_mark | null | stack_content | visible_state |
| marble_chamber_C2_resolution | marble_confirmation_surface_profile | institutional_measure | center_cta | soft_overlay | hidden_mark | null | preserve_frame | dependent_state |
| marble_chamber_encounter | assessment_findings_report | null | null | null | null | null | null | unavailable_state |
| marble_chamber_orientation | marble_orientation_surface_profile | reading_measure | center_cta | none_overlay | hidden_mark | always_visible_audio | preserve_frame | visible_state |
| marble_chamber_results | marble_results_surface_profile | reading_measure | right_cta | soft_overlay | hidden_mark | null | stack_content | dependent_state |
| obsidian_chamber_C1_compact | compact_contact_capture | institutional_measure | right_cta | none_overlay | hidden_mark | null | stack_content | dependent_state |
| obsidian_chamber_encounter_surface | assessment_form_surface | institutional_measure | right_cta | none_overlay | subtle_mark | null | stack_content | visible_state |
| obsidian_chamber_orientation | media_orientation_full_bleed | institutional_measure | right_cta | none_overlay | hidden_mark | always_visible_audio | stack_content | visible_state |
| publication_dispatch | null | null | null | null | null | null | null | null |

No held/null values remain among the six OAR2 fields for the 14 active surfaces except the five documented, justified holds on `marble_chamber_encounter`.

## Publication Dispatch Gap

`publication_dispatch` current assignment state (re-checked, unchanged):

- `surface_key`: `publication_dispatch`
- `registry_key` / `encounter_key`: `undrifted`
- `public_routes`: `/publication/structural_drift`
- `metadata.style_profile`: `null`

Standing:

- no `style_profile` binding exists on `publication_dispatch`
- per OAR2 boundary, no encounter style authority was seated for `publication_dispatch` — none of the 17 style authority fields were touched
- content model remains a separate publication dispatch surface and still requires a later resolver/style-profile binding decision before any style authority can apply

Recommended follow-up: unchanged from the prior run — decide and seat a `style_profile` binding key for `publication_dispatch` in a later OAR before its style authority can be resolved.

## Boundary Preservation

- No CSS was rewritten.
- No renderer files were changed.
- `resolveEncounterStyleProfile()` was not altered.
- No renderer data attributes were wired to the newly-seated fields.
- Flow, assessment logic, MAP logic, payment logic, release state, routing, and public claims were not changed.
- `publication_dispatch` was not seated.
- No second style authority surface was created — all seating landed as sibling keys on the existing `measures_encounter_surface_assignment.metadata` object.
- Previously-seated non-held fields (`style_profile`, `material_family`, `frame_profile`, etc.) were left untouched — verified in the validation query above.

## QA Side Effects and Cleanup

Walking the live assessment → contact → MAP flow against the real Supabase project (there is no staging project) necessarily invoked real write paths:

- One test row was inserted into `public.measures_iis_eval_gate1_capture` (institution name tagged `"OAR2 QA Test Institution — DELETE ME"`, email `oar2-qa-test@measuresregistry.com`) to progress past the contact-capture gate. This row was deleted after evidence capture; a follow-up `count(*)` query confirmed zero matching rows remain.
- The MAP payment step (`marble_chamber_C2_agreement` → Stripe checkout) was observed but not completed — `Continue to Payment` was not clicked, since `/api/map/create-checkout-session` is a serverless function not present on the local dev server and clicking it would have attempted a real Stripe session. `marble_chamber_C2_resolution` was instead reached directly via the app's own documented `?payment=success` query-param branch in `MeasuresRegistryOrchestrator.initialSurface()`, which is the same mechanism Stripe's `success_url` redirect uses — no payment record was created.
- No other tables were written to.

## Closeout

This run resolved the OAR2 gate: browser-visible evidence was gathered for all 14 active surfaces via a real browser (Playwright) against unmodified source, the six previously-held style fields were seated from that evidence, `publication_dispatch` remains honestly unseated pending a style_profile binding decision, and no CSS, renderer, or flow logic was changed.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody observed via browser and seated the six fields from evidence.
src was not changed.

---

## Superseded Prior Run (v1, 2026-07-05)

The following is preserved for record. It reflects a prior thread in which browser capability repeatedly failed to bootstrap (`codex/sandbox-state-meta: missing field 'sandboxPolicy'`) before any navigation, DOM, or screenshot evidence could be collected, so the six fields were left held. This thread had working browser tooling (Playwright MCP) and resolved the gate; the prior HELD result no longer reflects current DB state.

> ## Result
>
> HELD.
>
> The OAR2 requires browser observation before DB seating:
>
> - browser inspection
> - viewport screenshots
> - computed styles
> - DOM review
>
> The current thread could not establish Browser capability. Browser bootstrap failed before any page inspection with:
>
> ```text
> codex/sandbox-state-meta: missing field `sandboxPolicy`
> ```
>
> (Repeated retry notes across four subsequent resume attempts, all failing at the same in-app Browser bootstrap step with the same error, are omitted here for length — see git history for the full v1 text.)
>
> Because visual evidence was unavailable, Cody did not seat the six held style fields. No style values were inferred from source, taste, profile names, or prior registry terms.
