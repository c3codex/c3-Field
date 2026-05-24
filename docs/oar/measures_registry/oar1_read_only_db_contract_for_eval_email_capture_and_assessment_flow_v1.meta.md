---
document_type: oar1
authority_level: working
document_scope: measures_registry_db_contract_read
title: OAR1 — Read Only DB Contract for Eval Email Capture and Assessment Flow
status: executor_complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_read_only_db_contract_for_eval_email_capture_and_assessment_flow_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - read-only
  - db-contract
  - eval-email-contract
  - assessment-flow
  - codex-first
---

# OAR1 — Read Only DB Contract for Eval Email Capture and Assessment Flow

## STATUS

Executor complete. Read-only inspection. No DB rows modified. No source files modified. No CSS modified.

---

## INSPECTION SCRIPT

`docs/oar/measures_registry/inspect-eval-email-contract-db-v1.cjs`

Tables read:
- `measures_encounter_def`
- `measures_media_map`

---

## ENCOUNTER READBACK — SUMMARY TABLE

| Encounter | display_title | is_active | function_layer | state_expression | renderer |
|---|---|---|---|---|---|
| `measures_eval_email_contract` | Measures Evaluation Email Contract | true | intake | public_measures_eval_email_contract | measures_eval_email_contract |
| `measures_assessment` | MEASURES AI OPERATIONAL EVALUATION | true | diagnostic_capture | public_measures_assessment | measures_registry_evaluation_chamber |
| `structured_eval` | Structured Evaluation | true | diagnostic_capture | public_structured_eval | measures_registry_evaluation_chamber |
| `measures_phases_reveal` | Measures Phases | true | orientation | public_measures_phases_reveal | measures_phases_reveal |
| `evaluate_structure_path` | AI isn't broken. Systems are. | true | choice | public_evaluate_structure_path | measures_registry_path_choice |
| `eval_passage` | Educational Diagnostic Passage | true | education_diagnostic | public_eval_passage | diagnostic_explainer_passage |
| `structure_passage` | Structure Passage | true | education_diagnostic | public_structure_passage | diagnostic_explainer_passage |

All 7 target encounters found and active.

---

## MEASURES_EVAL_EMAIL_CONTRACT — FULL CONTRACT READBACK

### metadata keys present

```
renderer, function_layer, contract_status, layout_contract, renderer_purpose,
state_expression, styling_contract, intended_renderer, route_after_capture,
transition_contract, reconciliation_source, email_delivery_contract,
renderer_contract_status, source_sitewide_contract, encounter_isolation_contract
```

### metadata keys ABSENT

```
title, eyebrow, subtitle, fields, form_fields, soft_src_fields, delivery_fields,
capture, assessment_package, result_display, report_display, actions
```

**No `assessment_package`, `result_display`, or `report_display` field exists in the DB contract for `measures_eval_email_contract`.**

### Operational fields

| Field | Value |
|---|---|
| `renderer` | `measures_eval_email_contract` |
| `function_layer` | `intake` |
| `route_after_capture` | `measures_phases_reveal` |
| `layout_contract.layout_mode` | `delivery_contract` |
| `layout_contract.surface_mode` (in styling) | `delivery_confirmation` |
| `layout_contract.cta_placement` | `below_confirmation_content` |
| `layout_contract.viewport_fit` | `single_screen` |
| `renderer_purpose.purpose` | `assessment_delivery_email_contract` |
| `renderer_purpose.routes_toward` | `reserve_seat` |
| `renderer_purpose.governs` | `what_gets_sent, recipient_confirmation, consent_acknowledgment_path` |

### email_delivery_contract (what gets sent in email)

```json
{
  "contract_type": "assessment_package_delivery",
  "includes": ["recommended_structural_response"],
  "excludes": ["phase_reveal"],
  "requires": ["completed_assessment", "recipient_email", "recommended_structural_response_generated", "reserve_seat_route_available"],
  "stores": ["delivery_timestamp", "recipient_email", "assessment_reference", "recommended_response_reference", "reserve_seat_route", "delivery_status"],
  "implementation_note": "Email dispatch is not implemented — contract marker and structure only. Do not implement sending.",
  "dispatch_implementation": "deferred"
}
```

The `email_delivery_contract` governs what gets sent in the email delivery — not what renders on screen before form submit.

### transition_contract

```json
{
  "route_expectation": "measures_eval_email_contract -> reserve_seat",
  "exit_transition": "dissolve_out",
  "entry_transition": "fade_in",
  "transition_style": "dissolve"
}
```

### encounter_isolation_contract

- `boundary`: `encounter_isolated`
- `content_authority`: `measures_encounter_def.metadata`
- `frontend_hardcode_allowed`: `false`

---

## MEASURES_ASSESSMENT — ROUTE AND COMPLETION CONTRACT READBACK

### Route after final question

`measures_assessment` metadata has **no `route_after_capture`** field and no action that routes to `measures_eval_email_contract` or `measures_phases_reveal`. The only action is:

```
action_key=back_landing_root | behavior=route_surface | target=landing_root
```

Route after final question is implemented in the runtime (`submitIisEvaluation` → `navigate("measures_eval_email_contract")`), not contracted via DB action.

### assessment_completion contract

The `assessment_completion` and `returned_assessment_contract` fields define the result display content — title, result label, findings, clarification body, positioning tone, etc. These are contractually defined.

**Critical: `assessment_completion` is seated on `measures_assessment` — it is a contract for the result display that belongs to the assessment chamber, not to `measures_eval_email_contract`.**

The `assessment_completion.continue_prompt` is `"Continue to Recommended Operating Protocol"` — suggesting the result is shown and then the user continues, not that the result is hidden until after delivery capture.

### assessment_interpretation

Present — omitted for brevity. Powers the `resolveEnvironmentalReport()` function in the runtime.

---

## STRUCTURED_EVAL — ROUTE AND CONTRACT READBACK

### metadata keys present

```
renderer, function_layer, contract_status, layout_contract, state_expression,
styling_contract, branding_contract, intended_renderer, transition_contract,
reconciliation_source, media_behavior_contract, renderer_contract_status,
source_sitewide_contract, assessment_mechanics_note, encounter_isolation_contract,
shared_assessment_mechanics_contract
```

### No assessment mechanics seated directly

`structured_eval` metadata has **no `assessment_mechanics`** or `assessment_interpretation` — the `shared_assessment_mechanics_contract` note confirms it shares mechanics from `measures_assessment`.

### transition_contract — route_expectation

```json
{
  "route_expectation": "structured_eval -> measures_phases_reveal",
  "surface_note": "chamber internal transitions governed by shared assessment mechanics; encounter-level dissolve governs entry/exit"
}
```

**The DB contract for `structured_eval` says it routes directly to `measures_phases_reveal`, skipping `measures_eval_email_contract`.**

---

## TRANSITION RULES — ALL TARGET ENCOUNTERS

| Source | action_key | behavior | Target |
|---|---|---|---|
| `measures_eval_email_contract` | — | — | (no actions) |
| `measures_assessment` | `back_landing_root` | `route_surface` | `landing_root` |
| `structured_eval` | — | — | (no actions) |
| `measures_phases_reveal` | — | — | (no actions) |
| `evaluate_structure_path` | `route_eval_passage` | `route_surface` | `eval_passage` |
| `evaluate_structure_path` | `route_structure_passage` | `route_surface` | `structure_passage` |
| `eval_passage` | `continue_to_evaluation` | `route_surface` | `measures_assessment` |
| `structure_passage` | — | — | (no actions) |

---

## PASSAGE MEDIA ROLES READBACK

### eval_passage

| Field | Value |
|---|---|
| `metadata.media_roles` | `["explainer_video"]` |
| `explainer_video` in DB | **active** — `structural_coherence_explainer_45s.mp4` (video/mp4, `measures-media` bucket) |
| Runtime REGISTERED_MEDIA_ROLES | `"explainer_video"` added in prior OAR1 |
| `passageVideoUrl` | `explainerVideoUrl` — wired in prior OAR1 |

### structure_passage

| Field | Value |
|---|---|
| `metadata.media_roles` | `[{role: "passage_media", media_key: "measures_structured_enviroments"}]` |
| `structured_environment_passage_video` in DB | **active** — `measures_structured_enviroments.mp4` (video/mp4) |
| `measures_structured_enviroments` in DB | **active** — `measures_structured_enviroments.mp4` (video/mp4, same file) |
| Runtime `REGISTERED_MEDIA_ROLES` | both `"structured_environment_passage_video"` and `"measures_structured_enviroments"` present |
| `structuredEnvironmentPassageVideoUrl` | resolves from `structured_environment_passage_video` with `measures_structured_enviroments` as fallback |

### evaluate_structure_path — passage media

| Role | DB state | Used for |
|---|---|---|
| `left_hero_fracture` | **active** — `left_hero_fracture.webp` | Left path plaque image |
| `right_measured_hero` | **active** — `right_measured_hero.webp` | Right path plaque image |
| `path_choice_background` | **held** — `more_vs_coherence_path.webp` absent | Background — resolves null |
| `left_hero_fracture_motion` | **active** — `left_hero_fracture_motion.mp4` | Not consumed by current renderer |
| `measured_hero_motion_graphic` | **active** — `right_measured_hero_motion_graphic.mp4` | Not consumed by current renderer |

---

## DB VS BROWSER MISMATCH TABLE

| Surface | DB Contract Says | Browser Shows | Classification |
|---|---|---|---|
| `measures_eval_email_contract` — primary function | Delivery capture: capture contact fields, confirm where package gets sent | Report block (title, result, findings, interpretation, recommended response) + delivery form | **Renderer-invented** — report block has no DB contract on this surface |
| `measures_eval_email_contract` — report/findings visible before submit | Not seated — no `assessment_package`, `result_display`, `report_display` fields | Full `evalReport` rendered above delivery form | **Renderer-invented** — no DB authority for pre-submit report display |
| `measures_eval_email_contract` — delivery fields | 4 fields implied by `email_delivery_contract.requires` (recipient_email) and matching `measures_assessment.src_intake_contract.visible_fields` | 4 fields: institution_name, institution_type, contact_name, contact_email | **Contract-valid** |
| `measures_eval_email_contract` — route after capture | `route_after_capture: "measures_phases_reveal"` | Routes to `measures_phases_reveal` | **Contract-valid** (operational field matches) |
| `measures_eval_email_contract` — title | No `metadata.title` seated | "Measures Evaluation Email Contract" (from `display_title`) | **Contract-neutral** — `display_title` fallback, no specific title conflict |
| `measures_eval_email_contract` — renderer_purpose.routes_toward | `reserve_seat` | `measures_phases_reveal` | **Legacy conflict** — `routes_toward` field predates `route_after_capture` update; `route_after_capture` is the operational authority |
| `measures_eval_email_contract` — transition_contract.route_expectation | `measures_eval_email_contract -> reserve_seat` | Routes to `measures_phases_reveal` | **Legacy conflict** — same as above |
| `structured_eval` — route after final question | `transition_contract.route_expectation: "structured_eval -> measures_phases_reveal"` (skips email capture) | Routes to `measures_eval_email_contract` | **Contract conflict** — DB says skip email capture for structured_eval; runtime routes through it |
| `eval_passage` — video | `metadata.media_roles: ["explainer_video"]`, active in DB | Video renders (corrected in prior OAR1) | **Contract-valid** |
| `structure_passage` — video | `metadata.media_roles: [{media_key: "measures_structured_enviroments"}]`, active in DB | Video renders | **Contract-valid** |
| `measures_assessment` — assessment result display | `assessment_completion` contract fully seated with result title, findings, clarification | Assessment result rendered as `MeasuresAssessmentResult` — now suppressed before email capture (prior OAR1 fix) | **State: per prior OAR1, result state is held until after email capture** |

---

## MEASURES_EVAL_EMAIL_CONTRACT — REPORT BLOCK AUTHORITY FINDING

The current `RegisteredEvalEmailContract` renderer renders `evalReport` unconditionally when non-null:

```tsx
{evalReport ? (
  <div className="registry-email-assessment-package" aria-label="Assessment package">
    <article className="registry-email-section">
      <span>{evalReport.assessment_title}</span>
      <h2>{evalReport.assessment_result}</h2>
      ...
    </article>
    ...
  </div>
) : null}
```

**DB contract for `measures_eval_email_contract` does not seat this block.** The `email_delivery_contract` describes what gets sent in the email, not what renders on screen. There is no `result_display`, `report_display`, or `assessment_package` metadata field on this encounter.

**Classification: renderer-invented** — the report block is not contracted by Codex/DB.

---

## ASSESSMENT_COMPLETION CONTRACT — WHERE SHOULD RESULT DISPLAY?

The `measures_assessment.assessment_completion` contract is fully seated (version v2) with:
- `assessment_completion.title`: "Operational Risk Standing"
- `assessment_completion.assessment_result`: "Structural Drift Detected"
- `assessment_completion.findings`: 4 items
- `assessment_completion.continue_prompt`: "Continue to Recommended Operating Protocol"
- `assessment_completion.progression_threshold_cta`: "Review Recommended Progression Pathway"
- `assessment_completion.clarification_title`: "The issue is not AI itself."

The `assessment_completion` contract is seated on `measures_assessment`, not on `measures_eval_email_contract`. The `continue_prompt: "Continue to Recommended Operating Protocol"` implies the result is displayed and then the user continues forward — consistent with the result belonging to the assessment chamber's completion phase.

**The assessment result is contracted to display as part of the assessment completion phase on `measures_assessment`, not on `measures_eval_email_contract`.**

---

## STRUCTURED_EVAL — TRANSITION CONFLICT FINDING

`structured_eval.transition_contract.route_expectation: "structured_eval -> measures_phases_reveal"`

This DB contract says `structured_eval` routes directly to `measures_phases_reveal`, bypassing `measures_eval_email_contract`. The runtime currently routes `structured_eval` final question through `measures_eval_email_contract` (same flow as `measures_assessment`).

This is a DB contract conflict requiring resolution. The contract either:
1. Was authored before the email capture surface was added to the flow, or
2. Intends structured_eval to bypass email capture (different path)

**This conflict cannot be resolved by the executor without operator direction. Flagged for operator decision.**

---

## CORRECTION RECOMMENDATION

**Clean-shell renderer correction required.**

The `measures_eval_email_contract` surface should not display the assessment report block before form submit. The `evalReport` block in `RegisteredEvalEmailContract` is renderer-invented — it has no DB authority.

**What the surface should express per DB contract:**
- Title / instruction from `emailCopy.title` / `emailCopy.subtitle` (or `display_title` fallback)
- Delivery form with 4 fields: institution_name, institution_type, contact_name, contact_email
- Submit CTA
- On submit: resolving interstitial → `measures_phases_reveal`

**What it should NOT display before submit:**
- Assessment result title / label
- Findings
- Operational exposure summary
- Recommended structured action / response

**Report display location per DB contract:**
The `assessment_completion` contract belongs to `measures_assessment`. If the assessment result should be visible to the user, it is contracted to appear within the assessment chamber completion phase — not on the email delivery surface. Where exactly the result surfaces post-delivery is a separate routing/display question for the operator to direct.

**Flagged secondary issue:**
The `structured_eval.transition_contract.route_expectation` says `structured_eval -> measures_phases_reveal` (skips email contract). This conflicts with the current runtime routing both assessment paths through `measures_eval_email_contract`. Operator must decide whether structured_eval should also go through email capture before this can be fully resolved.

---

## MEDIA ROLES — ALL ACTIVE

| Role | Type | Path |
|---|---|---|
| `assessment_background` | image/webp | obsidian_background.webp |
| `background` | image/webp | lapis_background.webp |
| `c3_field_video` | video/mp4 | c3_field.mp4 |
| `epigraph_video` | video/mp4 | registry_epigraph_fracture_to_alignment_15s.mp4 |
| `evaluation_reference_image` | image/webp | evaluation_chamber_reference.webp |
| `explainer_video` | video/mp4 | structural_coherence_explainer_45s.mp4 |
| `hero_poster` | image/webp | measures_registry_poster.webp |
| `installation_tone_marble` | audio/x-wav | marble_tone_rise_return_5min.wav |
| `installation_tone_marble_rise_return_v1` | audio/x-wav | marble_tone_rise_return_5min.wav |
| `lapis_background` | image/webp | lapis_background.webp |
| `left_hero_fracture` | image/webp | left_hero_fracture.webp |
| `left_hero_fracture_motion` | video/mp4 | left_hero_fracture_motion.mp4 |
| `marble_accent_reference` | image/webp | marble_chamber_codexstone.webp |
| `marble_tone` | audio/x-wav | marble_tone_rise_return_5min.wav |
| `measured_hero_motion_graphic` | video/mp4 | right_measured_hero_motion_graphic.mp4 |
| `measures_structured_enviroments` | video/mp4 | measures_structured_enviroments.mp4 |
| `paragraph_agents_of_chaos` | image/png | paragraph_agents_of_chaos.png |
| `question_chamber_background` | image/webp | evaluation_chamber_reference.webp |
| `registry_mark` | image/webp | measures_registry_mark.webp |
| `registry_watermark` | image/webp | measures_registry_emblem_watermark_preview_lapis.webp |
| `right_measured_hero` | image/webp | right_measured_hero.webp |
| `structural_drift_featured_image` | image/webp | structural_drift.webp |
| `structured_environment_passage_video` | video/mp4 | measures_structured_enviroments.mp4 |
| `transition_or_pause` | image/webp | return_antechamber.webp |
| `watermark` | image/webp | measures_registry_emblem_watermark_preview_lapis.webp |

Held roles: `hero_image`, `hero_measured_image`, `hero_video`, `paragraph_cover`, `path_choice_background`, `registry_banner`, `social_card`.

---

## DB TABLES INSPECTED

- `measures_encounter_def` — 7 rows read
- `measures_media_map` — all rows for campaign `agents_of_chaos_integrity_governance`

---

## CONFIRMATIONS

| Check | Result |
|---|---|
| DB rows modified | None |
| Source files modified | None |
| CSS modified | None |
| Inspection script used | `docs/oar/measures_registry/inspect-eval-email-contract-db-v1.cjs` |
| Read-only operation | Confirmed |
