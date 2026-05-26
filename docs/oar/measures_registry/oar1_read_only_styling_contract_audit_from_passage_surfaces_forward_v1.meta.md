---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Read Only Styling Contract Audit From Passage Surfaces Forward
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - read-only
  - styling-contract
  - registered-runtime
  - visual-qa
  - contract-audit
  - codex-first
---

# OAR1 — Read Only Styling Contract Audit From Passage Surfaces Forward

## EXECUTION SUMMARY

Read-only audit of all styling and layout contracts from `eval_passage` forward.

No DB rows modified. No source files modified. No CSS modified.

First two public surfaces (`ai_isnt_broken_intro`, intro threshold / path-choice entry) were not inspected or touched.

---

## SITEWIDE STYLE CONTRACT READBACK

**DB tables inspected:** `concordance_document`, `concordance_version`, `concordance_relation`

**`concordance_document`**
```
document_key:       measures_registry_sitewide_style_contract
title:              Measures Registry Sitewide Runtime/Style Contract
document_scope:     sitewide_style_contract
authority_standing: active
visibility_standing: internal
metadata.status:    seeded
metadata.authority_level: system
metadata.implementation_order:
  sitewide_runtime_contract → encounter_contracts → renderer_behavior → runtime_state
```

**`concordance_version`**
```
version_key:        measures_registry_sitewide_style_contract_v1
version_standing:   active
visibility_standing: internal
metadata.status:    seeded
```

**`concordance_relation` — all 11 active**

| Relation Key | Domain | Governs | Audit Finding |
|---|---|---|---|
| mrssc_v1_intelligence_binding | intelligence_binding | — | — |
| mrssc_v1_typography_contract | typography | heading_font_authority, body_font_authority, hierarchy_scaling, desktop_mobile_typography | — |
| mrssc_v1_color_material_contract | color_material | obsidian, lapis, crystal, marble, semantic_usage_boundaries, interaction_states | — |
| mrssc_v1_button_icon_contract | button_icon | primary_cta, secondary_cta, passage_controls, icon_rendering_authority, hover_focus_behavior, mobile_scaling | — |
| mrssc_v1_media_behavior_contract | media_behavior | autoplay_rules, mute_unmute_behavior, interaction_unlock_rules, media_persistence_boundaries, encounter_scoped_media_behavior | **passageMuted_is_session_global** |
| mrssc_v1_marble_tone_contract | marble_tone | low_volume_baseline, encounter_scoped_playback_rules, continuity_rules, mute_relationship_rules | **marble_tone_persists_across_surfaces_unscoped** |
| mrssc_v1_viewport_containment_contract | viewport_containment | desktop_containment, mobile_containment, single_screen_encounter_fit, overflow_behavior, encounter_viewport_boundaries | — |
| mrssc_v1_branding_contract | branding | registry_mark_usage, mark_placement_classes, mark_opacity_rules, institutional_identity_boundaries | — |
| mrssc_v1_footer_contract | footer | copyright_authority, footer_visibility_rules, footer_copy_authority, system_linkage_rules | **copyright_hardcoded_in_jsx** |
| mrssc_v1_transition_contract | transition | encounter_transition_behavior, dissolve_fade_authority, state_isolation_expectations | **orphaned_transition_contract_unrealized** |
| mrssc_v1_preserved_runtime_assets | preserved_runtime_assets | MeasuresAssessmentChamber, MeasuresAssessmentResult, sectionCopy(), resolveEnvironmentalReport(), token_pipeline, media_resolution, navigation_history, obsidian_material_contract | — |

---

## ENCOUNTER CONTRACT READBACK BY SURFACE

**DB table:** `measures_encounter_def`

All 11 target encounters found. All have `contract_status: contracted` and `source_sitewide_contract` bound to `measures_registry_sitewide_style_contract_v1`.

### eval_passage

```
display_title:    Educational Diagnostic Passage
is_active:        true
function_layer:   education_diagnostic
state_expression: public_eval_passage
renderer:         diagnostic_explainer_passage
contract_status:  contracted

styling_contract:
  material_family:   obsidian
  foundation_material: obsidian
  passage_mode:      educational_diagnostic
  heading_style:     institutional_serif
  body_style:        operational_sans
  heading_tone:      measured_authoritative
  body_tone:         operational_clarity
  transition_style:  dissolve
  atmospheric_motion: restrained
  interaction_motion: minimal

layout_contract:
  layout_mode:    passage_explainer
  viewport_fit:   single_screen
  cta_placement:  below_passage_copy
  copy_density:   measured
  heading_scale:  passage_heading
  mobile_layout:  single_column_scroll_allowed

media_behavior_contract:
  autoplay:              deferred_to_renderer
  mute_state:            muted_on_entry
  encounter_scoped:      true
  persistence_boundary:  encounter
  interaction_unlock:    user_initiated_unmute
  inherits_from:         mrssc_v1_media_behavior_contract

media_roles: [explainer_video]
source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
encounter_isolation_contract.frontend_hardcode_allowed: false
```

### structure_passage

```
display_title:    Structure Passage
is_active:        true
function_layer:   education_diagnostic
state_expression: public_structure_passage
renderer:         diagnostic_explainer_passage
contract_status:  contracted

styling_contract:
  material_family:    obsidian
  surface_mode:       structure_threshold
  passage_mode:       structure_orientation
  (same typography/tone as eval_passage)

layout_contract: identical to eval_passage

media_behavior_contract:
  autoplay:              deferred_to_renderer
  mute_state:            muted_on_entry
  encounter_scoped:      true
  persistence_boundary:  encounter
  media_key_reference:   measures_structured_enviroments

media_roles: [{role: passage_media, media_key: measures_structured_enviroments}]
source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### measures_assessment

```
display_title:    MEASURES AI OPERATIONAL EVALUATION
is_active:        true
function_layer:   diagnostic_capture
renderer:         measures_registry_evaluation_chamber
contract_status:  contracted

styling_contract: v3
  material_family:         obsidian
  foundation_material:     obsidian
  structural_material:     marble
  atmospheric_material:    lapis
  theme_key:               evaluation_chamber_lapis_marble_v1
  watermark_contract:      low_opacity, behind_content_only, giant scale
  lapis_contract:          mineral / dimensional / architectural
  marble_contract:         institutional / engraved / calm

layout_contract: v2
  viewport_fit:            single_screen_initial_view
  scroll_policy:           avoid_initial_copy_scroll_desktop
  src_capture_layout:      minimal_two_column_identity_grid

branding_contract:
  placement: watermark_behind_content
  opacity_rule: low_opacity_watermark
  frontend_hardcode_allowed: false

media_behavior_contract:
  autoplay: allowed_muted
  encounter_scoped: true
  media_roles_governed: [background, watermark, question_chamber_background,
    assessment_background, transition_or_pause, marble_accent_reference]

source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### structured_eval

```
display_title:    Structured Evaluation
is_active:        true
function_layer:   diagnostic_capture
renderer:         measures_registry_evaluation_chamber
contract_status:  contracted

styling_contract: v1
  material_family: obsidian
  surface_mode:    evaluation_chamber
  path_framing:    structure_path

layout_contract: v1 (under-specified relative to measures_assessment v2)
  viewport_fit:   single_screen  ← not single_screen_initial_view
  copy_density:   chamber        ← not compact
  heading_scale:  chamber_heading ← not restrained_evaluation_heading

branding_contract: watermark_behind_content, low_opacity_watermark ✓
media_behavior_contract: encounter_scoped, autoplay: allowed_muted ✓
source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### connect_src

```
display_title:    c3 Field
is_active:        true
function_layer:   intake
renderer:         soft_src_intake_surface
contract_status:  contracted

styling_contract:
  material_family: obsidian
  surface_type:    static_authority
  frontend_hardcode_allowed: false (also in encounter metadata root)

layout_contract:
  layout_mode:   authority_surface
  viewport_fit:  single_screen
  cta_placement: centered_or_below_authority_copy

branding_contract:
  placement: authority_surface_mark
  opacity_rule: restrained

soft_src_fields: [institution_name, institution_type, contact_name, contact_email]
route_after_capture: measures_eval_email_contract
source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
encounter_isolation_contract.frontend_hardcode_allowed: false
```

### measures_eval_email_contract

```
display_title:    Measures Evaluation Email Contract
is_active:        true
function_layer:   intake
renderer:         measures_eval_email_contract
contract_status:  contracted

styling_contract:
  material_family: obsidian
  surface_mode:    delivery_confirmation
  body_tone:       governed_clarity

layout_contract:
  layout_mode:   delivery_contract
  viewport_fit:  single_screen
  cta_placement: below_confirmation_content
  heading_scale: confirmation_heading

route_after_capture: measures_phases_reveal
transition_contract.route_expectation: measures_eval_email_contract -> reserve_seat
  ← INCONSISTENCY: route_after_capture vs transition_contract route_expectation differ

email_delivery_contract: dispatch_implementation: deferred (do not implement sending)
source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### measures_phases_reveal

```
display_title:    Measures Phases
is_active:        true
function_layer:   orientation
renderer:         measures_phases_reveal
contract_status:  contracted

styling_contract:
  material_family:   marble
  foundation_material: marble
  accent_material:   lapis
  surface_mode:      convergence_reveal

layout_contract:
  layout_mode:   reveal
  viewport_fit:  single_screen
  cta_placement: below_reveal_content

media_behavior_contract:
  autoplay:         deferred_to_renderer
  encounter_scoped: true

transition_contract.route_expectation: measures_phases_reveal -> about_measures_registry
source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### about_measures_registry

```
display_title:    About Measures Registry
is_active:        true
function_layer:   authority
renderer:         about_measures_registry
contract_status:  contracted

styling_contract:
  material_family:   marble
  foundation_material: marble
  accent_material:   lapis
  surface_mode:      institutional_authority
  body_tone:         institutional_clarity
  heading_tone:      authoritative

layout_contract:
  viewport_fit:  single_screen_or_short_scroll
  cta_placement: below_support_points

branding_contract: restrained_registry_mark, restrained opacity
footer_contract: present in metadata keys
transition_contract.route_expectation: about_measures_registry -> structural_drift_publication
source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### structural_drift_publication

```
display_title:    Structural Drift
is_active:        true
function_layer:   publication_surface
renderer:         structural_drift_dispatches
contract_status:  contracted

styling_contract:
  material_family: obsidian
  surface_type:    publication

layout_contract:
  viewport_fit: scrollable
  layout_mode:  publication

source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### reserve_seat

```
display_title:    BUILD COHERENCE
is_active:        true
function_layer:   intake
renderer:         reserve_seat_selector
contract_status:  contracted

styling_contract:
  material_family: obsidian
  surface_type:    intake_commitment

layout_contract:
  viewport_fit: single_screen

source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

### phase_payment

```
display_title:    Phase Payment
is_active:        true
function_layer:   intake
renderer:         hold_surface
contract_status:  contracted

styling_contract:
  material_family: obsidian
  surface_type:    commitment_surface

layout_contract:
  viewport_fit: single_screen

source_sitewide_contract: measures_registry_sitewide_style_contract_v1 ✓
```

---

## RENDERER AND CSS READBACK

**Renderer files inspected:**

- [RegisteredPassage.tsx](src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx)
- [RegisteredAssessment.tsx](src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx)
- [RegisteredConnectSrc.tsx](src/measures_registry/registered_runtime/renderers/RegisteredConnectSrc.tsx)
- [RegisteredEvalEmailContract.tsx](src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx)
- [RegisteredPhaseReveal.tsx](src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx)
- [RegisteredAbout.tsx](src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx)
- [RegisteredStructuralDrift.tsx](src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx)
- [RegisteredReserveSeat.tsx](src/measures_registry/registered_runtime/renderers/RegisteredReserveSeat.tsx)
- [RegisteredPhasePayment.tsx](src/measures_registry/registered_runtime/renderers/RegisteredPhasePayment.tsx)

**CSS files inspected:** [src/index.css](src/index.css)

### CSS class coverage by surface

| Renderer Class | CSS Exists | Surface |
|---|---|---|
| `.measures-registry-runtime` | ✓ | all |
| `.registry-diagnostic-passage` | ✓ | eval_passage, structure_passage |
| `.registry-diagnostic-passage video` | ✓ | passage |
| `.registry-diagnostic-passage-controls` | ✓ | passage |
| `.registry-diagnostic-passage > div` | ✓ | passage |
| `.registry-diagnostic-passage span/h1/p/button` | ✓ | passage |
| `.registry-connect-src` | **MISSING** | connect_src |
| `.registry-iis-eval-form` | ✓ | connect_src (also chamber) |
| `.registry-eval-error` | **MISSING** | connect_src |
| `.registry-eval-email-contract` | **MISSING** | measures_eval_email_contract |
| `.registry-email-package-summary` | **MISSING** | measures_eval_email_contract |
| `.registry-email-section` | **MISSING** | measures_eval_email_contract |
| `.registry-email-package-includes` | **MISSING** | measures_eval_email_contract |
| `.registry-email-dispatch-note` | **MISSING** | measures_eval_email_contract |
| `.registry-phases-reveal` | **MISSING** | measures_phases_reveal |
| `.registry-phases-background` | **MISSING** | measures_phases_reveal |
| `.registry-phases-standing` | **MISSING** | measures_phases_reveal |
| `.registry-phases-sections` | **MISSING** | measures_phases_reveal |
| `.registry-about-authority` | **MISSING** | about_measures_registry |
| `.registry-about-marble` | **MISSING** | about_measures_registry |
| `.registry-encounter-entry` | ✓ | connect_src, email, phases, about |
| `.registry-encounter-actions` | ✓ | all CTA wrappers |
| `.registry-field-guide` + sub-classes | ✓ | structural_drift (index) |
| `.registry-publication-dispatch` + sub-classes | ✓ | structural_drift (article) |
| `.registry-publication-subscribe-capture` | ✓ | structural_drift (article) |
| `.registry-reserve-selector` | ✓ | reserve_seat |
| `.registry-reserve-options` / `.registry-reserve-option` | ✓ | reserve_seat |
| `.registry-offering-core` / `.registry-path-signal` | ✓ | reserve_seat |
| `.registry-hold-surface` / `.registry-hold-form` | ✓ | phase_payment |
| `.reserve-seat-success` / `.reserve-seat-error` | ✓ | phase_payment |

**Total missing CSS classes: 11**

connect_src (2): `.registry-connect-src`, `.registry-eval-error`
measures_eval_email_contract (5): `.registry-eval-email-contract`, `.registry-email-package-summary`, `.registry-email-section`, `.registry-email-package-includes`, `.registry-email-dispatch-note`
measures_phases_reveal (4): `.registry-phases-reveal`, `.registry-phases-background`, `.registry-phases-standing`, `.registry-phases-sections`
about_measures_registry (2): `.registry-about-authority`, `.registry-about-marble`

### Renderer contract consumption notes

**RegisteredPassage** — reads `passageCopy.stylingContract?.material_family` for `data-material-family` ✓. Has two CTA buttons: one inside `.registry-diagnostic-passage-controls` (at top) and one plain `<button>` at bottom (outside `.registry-encounter-actions`). Layout contract says `cta_placement: below_passage_copy` — bottom button matches intent; top controls div creates a secondary entry above the video.

**RegisteredAssessment** — delegates to `MeasuresAssessmentChamber`, passes `stylingContract`, `layoutContract`, `srcIntakeContract` from `encounterCopy`. Correct consumption pattern.

**RegisteredConnectSrc** — `SRC_FIELDS` and `SRC_LABELS` are hardcoded constants. DB `soft_src_fields` = `[institution_name, institution_type, contact_name, contact_email]` matches the hardcoded list, but `frontend_hardcode_allowed: false` — should read from `encounterCopy`.

**RegisteredEvalEmailContract** — reads title/subtitle/eyebrow/ctaPrimary from `emailCopy` (DB authority) ✓. Package includes list is hardcoded: `["Completed assessment standing", "Primary operational finding", "Recommended structural response", "Reserve seat pathway"]` — no DB field for these; `frontend_hardcode_allowed: false`. Section classes all missing CSS.

**RegisteredPhaseReveal** — `data-material-family="marble"` hardcoded literal in JSX — does not read from `phaseRevealCopy.stylingContract?.material_family`. `frontend_hardcode_allowed: false`. Section classes all missing CSS.

**RegisteredAbout** — `data-material-family="marble"` hardcoded. Eyebrow fallback `<span>ABOUT MEASURES REGISTRY</span>` hardcoded. Section classes all missing CSS.

**RegisteredStructuralDrift** — strong CSS coverage for both index and article variants. `data-surface` uses `structural_drift_dispatches` (index) and `publication_dispatch` (article) — neither matches the encounter_key `structural_drift_publication`. Functional but inconsistent with encounter isolation contract.

**RegisteredReserveSeat** — reads options from `seatOfferings` (DB-sourced) ✓. Reads `reserveSeatCopy` from DB ✓. Full CSS coverage.

**RegisteredPhasePayment** — reads `phasePaymentCopy.fields` for email field lookup ✓. Has `backHeaderAction` object defined as local constant but never used (dead variable). Full CSS coverage.

---

## MISMATCH CLASSIFICATION TABLE

| Surface | Sitewide Contract Clause | DB Contract Standing | Renderer/CSS Standing | Classification | Recommended Correction |
|---|---|---|---|---|---|
| eval_passage | mrssc_v1_media_behavior_contract ⚠️ passageMuted_is_session_global | encounter_scoped: true, persistence_boundary: encounter | `passageMuted` is session-global state, not reset at encounter boundary | contract exists + renderer class mapping incomplete | Reset `passageMuted` on encounter exit — encounter-scope the mute state |
| eval_passage | mrssc_v1_transition_contract ⚠️ orphaned | dissolve / fade_in / dissolve_out contracted | no CSS transitions, no renderer animation — unrealized | contract exists + CSS missing parity | CSS dissolve transition correction OAR |
| structure_passage | mrssc_v1_media_behavior_contract ⚠️ passageMuted_is_session_global | encounter_scoped: true | same passageMuted session-global issue | contract exists + renderer class mapping incomplete | Same as eval_passage — same passageMuted state shared |
| structure_passage | mrssc_v1_transition_contract ⚠️ orphaned | contracted | no implementation | contract exists + CSS missing parity | Same as eval_passage |
| measures_assessment | mrssc_v1_transition_contract ⚠️ orphaned | contracted | no implementation | contract exists + CSS missing parity | Grouped with transition correction |
| structured_eval | mrssc_v1_viewport_containment_contract | layout_contract v1: `single_screen`, `chamber_heading` — under-specified relative to measures_assessment v2 | shares `MeasuresAssessmentChamber` with measures_assessment — chamber uses v2 contract | contract incomplete / DB needs styling clarification | Upgrade structured_eval layout_contract to v2 spec (`single_screen_initial_view`, `restrained_evaluation_heading`, compact density) |
| connect_src | mrssc_v1_viewport_containment_contract, mrssc_v1_color_material_contract | contracted, obsidian, single_screen | `.registry-connect-src` section class: no CSS rules | contract exists + CSS missing parity | Add `.registry-connect-src` CSS (min-height, layout, spacing) |
| connect_src | mrssc_v1_color_material_contract | `frontend_hardcode_allowed: false`, `soft_src_fields` seated in DB | `SRC_FIELDS` / `SRC_LABELS` hardcoded constants in renderer | contract exists + renderer class mapping incomplete | Read field list from `encounterCopy` / DB `soft_src_fields` |
| connect_src | mrssc_v1_button_icon_contract | contracted | `.registry-eval-error` class: no CSS rules | contract exists + CSS missing parity | Add `.registry-eval-error` CSS |
| measures_eval_email_contract | mrssc_v1_viewport_containment_contract, mrssc_v1_color_material_contract, mrssc_v1_typography_contract | contracted, obsidian, delivery_confirmation | 5 renderer classes missing CSS: `.registry-eval-email-contract`, `.registry-email-package-summary`, `.registry-email-section`, `.registry-email-package-includes`, `.registry-email-dispatch-note` | contract exists + CSS missing parity | Add CSS for all 5 missing classes |
| measures_eval_email_contract | mrssc_v1_viewport_containment_contract | `route_after_capture: measures_phases_reveal` vs `transition_contract.route_expectation: -> reserve_seat` | routing field inconsistency in DB | contract incomplete / DB needs styling clarification | Reconcile route fields — confirm which is authoritative |
| measures_phases_reveal | mrssc_v1_color_material_contract, mrssc_v1_viewport_containment_contract | contracted, marble, single_screen | 4 renderer classes missing CSS: `.registry-phases-reveal`, `.registry-phases-background`, `.registry-phases-standing`, `.registry-phases-sections` | contract exists + CSS missing parity | Add CSS for all 4 missing classes (marble material surface) |
| measures_phases_reveal | mrssc_v1_color_material_contract | `frontend_hardcode_allowed: false` | `data-material-family="marble"` literal in JSX, not read from `stylingContract` | contract exists + renderer class mapping incomplete | Read `material_family` from `phaseRevealCopy.stylingContract` |
| about_measures_registry | mrssc_v1_color_material_contract, mrssc_v1_viewport_containment_contract | contracted, marble, single_screen_or_short_scroll | 2 renderer classes missing CSS: `.registry-about-authority`, `.registry-about-marble` | contract exists + CSS missing parity | Add CSS for both missing classes (marble material surface) |
| about_measures_registry | mrssc_v1_color_material_contract | `frontend_hardcode_allowed: false` | `data-material-family="marble"` literal in JSX | renderer inventing style | Read `material_family` from `aboutCopy.stylingContract` |
| about_measures_registry | mrssc_v1_typography_contract | `frontend_hardcode_allowed: false` | eyebrow fallback `"ABOUT MEASURES REGISTRY"` hardcoded | renderer inventing style | Remove hardcoded fallback or read from DB copy field |
| structural_drift_publication | mrssc_v1_transition_contract ⚠️ orphaned | contracted | no implementation | contract exists + CSS missing parity | Grouped with transition correction |
| reserve_seat | mrssc_v1_transition_contract ⚠️ orphaned | contracted | no implementation | contract exists + CSS missing parity | Grouped with transition correction |
| phase_payment | mrssc_v1_transition_contract ⚠️ orphaned | contracted | no implementation | contract exists + CSS missing parity | Grouped with transition correction |

---

## CORRECTION MAP — GROUPED BY CLASS

### Group A: CSS parity correction required (highest priority)

**connect_src (2 classes missing)**
- `.registry-connect-src` — section wrapper, needs min-height 100svh, layout grid, padding, obsidian background inheritance
- `.registry-eval-error` — error state, needs error text color, margin, alert role styling

**measures_eval_email_contract (5 classes missing)**
- `.registry-eval-email-contract` — section wrapper, single_screen viewport, delivery_confirmation obsidian surface
- `.registry-email-package-summary` — package content container, restrained layout
- `.registry-email-section` — assessment result article, institutional typography
- `.registry-email-package-includes` — package list, unstyled list reset, operational_sans
- `.registry-email-dispatch-note` — muted delivery note, secondary text tone

**measures_phases_reveal (4 classes missing)**
- `.registry-phases-reveal` — section wrapper, single_screen, marble material surface
- `.registry-phases-background` — lapis accent image, positioned behind content, encounter-scoped
- `.registry-phases-standing` — assessment result display, institutional typography hierarchy
- `.registry-phases-sections` — phase sections grid/stack

**about_measures_registry (2 classes missing)**
- `.registry-about-authority` — section wrapper, marble surface, single_screen_or_short_scroll
- `.registry-about-marble` — marble accent image, positioned as atmospheric accent

**All surfaces (transition CSS missing)**
- Dissolve/fade_in/dissolve_out CSS transitions unrealized across all surfaces (mrssc_v1_transition_contract)

### Group B: Combined renderer + CSS correction required

**measures_phases_reveal**
- `data-material-family="marble"` hardcoded in RegisteredPhaseReveal → read from `phaseRevealCopy.stylingContract?.material_family`
- CSS for marble surface wrapper missing — corrections are interdependent

**about_measures_registry**
- `data-material-family="marble"` hardcoded in RegisteredAbout → read from `aboutCopy.stylingContract?.material_family`
- Eyebrow fallback hardcoded → suppress or read from DB
- CSS for marble surface wrapper missing

### Group C: Renderer-class correction required

**eval_passage + structure_passage**
- `passageMuted` is session-global state (mrssc_v1_media_behavior_contract: `passageMuted_is_session_global`)
- Contract requires `persistence_boundary: encounter` — mute state must reset at encounter exit
- Fix: encounter-scope passageMuted, reset on unmounting eval_passage and structure_passage

**connect_src**
- `SRC_FIELDS` / `SRC_LABELS` hardcoded — `frontend_hardcode_allowed: false`
- DB `soft_src_fields` is seated and matches hardcoded list
- Fix: read field list from `encounterCopy` (through `registeredRuntimeUtils.sectionCopy()`)

### Group D: DB styling contract correction required

**structured_eval**
- `layout_contract` v1 is under-specified: `viewport_fit: single_screen`, `heading_scale: chamber_heading`
- `MeasuresAssessmentChamber` is shared with `measures_assessment` which has layout_contract v2: `viewport_fit: single_screen_initial_view`, `heading_scale: restrained_evaluation_heading`
- Shared chamber renders per v2 spec regardless of structured_eval's v1 declaration
- Fix: upgrade structured_eval layout_contract to v2 parity (DB update required)

**measures_eval_email_contract**
- `route_after_capture: measures_phases_reveal` vs `transition_contract.route_expectation: measures_eval_email_contract -> reserve_seat`
- These conflict — route_after_capture governs actual navigation; transition_contract expectation is stale
- Fix: reconcile transition_contract.route_expectation to match `measures_phases_reveal` (DB update required)

---

## RECOMMENDED NEXT OAR CLASSIFICATION

| Correction Class | Surfaces Affected | OAR Recommendation |
|---|---|---|
| CSS parity — new surface wrappers | connect_src, measures_eval_email_contract, measures_phases_reveal, about_measures_registry | CSS parity correction OAR — 13 missing classes |
| CSS parity — transition animations | all surfaces | Transition CSS correction OAR (may be deferred / separate) |
| Renderer-class correction | eval_passage, structure_passage, connect_src | renderer-class correction OAR |
| Combined renderer + CSS | measures_phases_reveal, about_measures_registry | combined renderer + CSS correction OAR |
| DB contract correction | structured_eval (layout_contract), measures_eval_email_contract (route reconciliation) | DB styling contract correction OAR |

**Primary routing recommendation:** CSS parity correction OAR first (most surfaces blocked on missing classes), then combined renderer + CSS correction (marble surfaces), then renderer-class correction (mute state, field hardcoding), then DB contract correction.

---

## CONFIRMATIONS

- No DB rows modified ✓
- No source files modified ✓
- No CSS modified ✓
- No routing changed ✓
- No assessment scoring changed ✓
- No contact capture behavior changed ✓
- No email contract behavior changed ✓
- First two public surfaces (`ai_isnt_broken_intro`, intro threshold / path-choice entry) not touched ✓

## SUCCESS CONDITION MET

Styling and layout contracts are now known from DB state.

Current clean-shell renderer and CSS behavior is mapped against those contracts.

The next correction can be routed from seated contract evidence.

## SCRIPT USED

`docs/oar/measures_registry/inspect-styling-contract-audit-from-passage-forward-v1.cjs`
