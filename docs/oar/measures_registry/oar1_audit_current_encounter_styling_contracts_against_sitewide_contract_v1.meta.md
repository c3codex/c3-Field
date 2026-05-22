---
document_type: oar1
authority_level: working
document_scope: measures_registry_encounter_contracts
title: OAR1 — Audit Current Encounter Styling Contracts Against Sitewide Contract
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_current_encounter_styling_contracts_against_sitewide_contract_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - encounter-contracts
  - styling-contract
  - sitewide-contract
  - audit
  - codex-first
---

# OAR1 — Audit Current Encounter Styling Contracts Against Sitewide Contract

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_audit_current_encounter_styling_contracts_against_sitewide_contract_v1.meta.md`

Audit current Measures Registry encounter-level styling contracts against the seated sitewide style contract (`measures_registry_sitewide_style_contract`). No DB writes. No renderer edits. Codex-first contract comparison only.

---

## INSPECTION SCOPE

**DB table:** `measures_encounter_def` — columns `encounter_key`, `metadata`

**Contract fields inspected per encounter:**
- `styling_contract`, `layout_contract`, `media_behavior_contract`, `branding_contract`, `footer_contract`, `transition_contract`

**Runtime fields inspected per encounter:**
- `renderer`, `function_layer`, `state_expression`, `media_roles`, `actions`, `release`, `access`

**Sitewide contract authority:** `measures_registry_sitewide_style_contract` — 9 clauses: typography, color/material, button/icon, media behavior, marble tone, viewport/containment, branding, footer, transition

---

## ENCOUNTER INVENTORY

| # | encounter_key | DB | renderer | function_layer | state_expression |
|---|---|---|---|---|---|
| 1 | `landing_root` | ✓ | `epigraph_split_hero` | `entry` | `public_landing_root` |
| 2 | `landing_path_choice` | ✓ | `measures_registry_path_choice` | `choice` | `public_binary_path_choice` |
| 3 | `educational_diagnostic_passage` | ✓ | `diagnostic_explainer_passage` | `education_diagnostic` | `public_educational_diagnostic_passage` |
| 4 | `educate_eval_encounter` | ✓ | `diagnostic_explainer_resource_evaluation_entry` | `education_diagnostic` | `public_educational_diagnostic_threshold` |
| 5 | `iis_eval_gate1` | ✓ | `db_bound_evaluation_capture` | `diagnostic_capture` | `public_iis_eval_gate1` |
| 6 | `measures_ai_operational_evaluation` | ✓ | `measures_registry_evaluation_chamber` | `diagnostic_capture` | `public_iis_eval_gate1` |
| 7 | `evaluation_result` | ✗ | — | — | — |
| 8 | `cohort_conversion_encounter` | ✓ | `cohort_conversion_orientation` | `institutional_conversion` | `public_cohort_conversion_encounter` |
| 9 | `understand_failure` | ✓ | `generic_media_encounter` | `encounter` | `public_system_encounter` |
| 10 | `c3_field` | ✓ | `static_authority_surface` | `authority` | `public_authority_surface` |
| 11 | `reserve_seat` | ✓ | `reserve_seat_selector` | `intake` | `public_learning_reserve_seat` |
| 12 | `foundation_offering` | ✓ | `offering_surface` | `orientation` | `public_offering_surface` |
| 13 | `systems_offering` | ✓ | `offering_surface` | `orientation` | `public_offering_surface` |
| 14 | `foundation_seat_hold` | ✓ | `hold_surface` | `intake` | `public_hold_surface` |
| 15 | `systems_seat_hold` | ✓ | `hold_surface` | `intake` | `public_hold_surface` |
| 16 | `structural_drift_dispatches` | ✓ | `structural_drift_dispatches` | `publication_surface` | `native_structural_drift_dispatches` |
| 17 | `publication_dispatch` | ✗ | — | — | — |
| 18 | `registered_process_log` | ✓ | `registered_process_log` | `process_visibility` | `registered_operational_log` |
| 19 | `seat_hold_notification_review` | ✓ | `notification_review_surface` | `orientation` | `operator_review_surface` |

**DB total:** 17 present, 2 missing (`evaluation_result`, `publication_dispatch`)

---

## CONTRACT STATE PER ENCOUNTER

### `iis_eval_gate1` — best contracted

```
styling_contract: v3
  material_family: obsidian
  atmospheric_material: lapis
  structural_material: marble
  heading_style: institutional_serif
  body_style: operational_sans
  transition_style: dissolve
  watermark_contract: {layer: behind_content_only, opacity: low, scale: giant, foreground_branding: false}
  lapis_contract: {must_feel: [mineral, dimensional, architectural, coherent]}
  marble_contract: {must_feel: [institutional, engraved, calm, structural, lightly illuminated]}
  disallowed_patterns: [dashboard_cards, startup_saas_ui, neon_glow, ...]

layout_contract: v2
  viewport_fit: single_screen_initial_view
  mobile_layout: single_column_compact_scroll_allowed
  scroll_policy: avoid_initial_copy_scroll_desktop
  src_capture_layout: minimal_two_column_identity_grid

media_behavior_contract: null
branding_contract: null
footer_contract: null
transition_contract: null
```

### `measures_ai_operational_evaluation` — identical to iis_eval_gate1

Styling contract v3 and layout contract v2 are byte-for-byte identical to `iis_eval_gate1`. Different renderer (`measures_registry_evaluation_chamber` vs `db_bound_evaluation_capture`).

**Isolation flag:** Both encounters share `state_expression: "public_iis_eval_gate1"` — same state expression across two distinct encounter keys. Encounter isolation boundary is ambiguous.

### `educational_diagnostic_passage` — stub only

```
styling_contract: {material_family: "obsidian"}
layout_contract: null
media_behavior_contract: null
branding_contract: null
footer_contract: null
transition_contract: null
```

Single field only. Not a substantive contract.

### All remaining 14 encounters — no contracts

`landing_root`, `landing_path_choice`, `educate_eval_encounter`, `cohort_conversion_encounter`, `understand_failure`, `c3_field`, `reserve_seat`, `foundation_offering`, `systems_offering`, `foundation_seat_hold`, `systems_seat_hold`, `structural_drift_dispatches`, `registered_process_log`, `seat_hold_notification_review` — all contract fields null.

---

## COMPLIANCE CLASSIFICATION TABLE

| encounter_key | Classification | Notes |
|---|---|---|
| `iis_eval_gate1` | **Partially compliant** | Best contracted. Missing: media_behavior, branding, footer, transition contracts |
| `measures_ai_operational_evaluation` | **Partially compliant** | Identical contract to iis_eval_gate1. Shared state_expression is isolation concern |
| `educational_diagnostic_passage` | **Needs amendment** | Stub styling_contract (material_family only); no substantive contract |
| `landing_root` | **Missing contract / renderer-only styling** | No DB contract. Entry point. epigraph_split_hero renderer handles styling |
| `landing_path_choice` | **Missing contract / renderer-only styling** | No DB contract. Binary choice surface |
| `educate_eval_encounter` | **Missing contract / renderer-only styling** | No DB contract. Known hardcoded JSX drift surface |
| `cohort_conversion_encounter` | **Missing contract / renderer-only styling** | No DB contract. Conversion orientation surface |
| `understand_failure` | **Missing contract / renderer-only styling** | No DB contract. Media-heavy generic renderer |
| `c3_field` | **Missing contract / renderer-only styling** | No DB contract. Authority surface |
| `reserve_seat` | **Missing contract / renderer-only styling** | No DB contract. Intake selector |
| `foundation_offering` | **Missing contract / renderer-only styling** | No DB contract. Shared `offering_surface` renderer |
| `systems_offering` | **Missing contract / renderer-only styling** | No DB contract. Shared `offering_surface` renderer |
| `foundation_seat_hold` | **Missing contract / renderer-only styling** | No DB contract. Shared `hold_surface` renderer |
| `systems_seat_hold` | **Missing contract / renderer-only styling** | No DB contract. Shared `hold_surface` renderer |
| `structural_drift_dispatches` | **Missing contract / renderer-only styling** | No DB contract. Publication surface |
| `registered_process_log` | **Missing contract / renderer-only styling** | No DB contract. Operator-facing process log |
| `seat_hold_notification_review` | **Missing contract / renderer-only styling** | No DB contract. Operator review surface |
| `evaluation_result` | **Needs new encounter row** | Missing from DB entirely. Prior audit Priority 1 |
| `publication_dispatch` | **Needs new encounter row** | Missing from DB entirely |

---

## SITEWIDE CLAUSE COVERAGE MAP

Coverage assessed across all seated encounters against the 9 sitewide contract clauses.

| Sitewide clause | Covered | Partial | Absent |
|---|---|---|---|
| Typography | 0 | 2 (heading_style/body_style in eval chamber) | 17 |
| Color / material | 2 (eval chamber) | 1 (passage: material_family stub) | 16 |
| Button / icon | 0 | 0 | 19 |
| Media behavior | 0 | 0 | 19 |
| Marble tone (playback) | 0 | 0 | 19 |
| Viewport / containment | 2 (eval chamber layout_contract) | 0 | 17 |
| Branding | 0 | 2 (eval chamber watermark_contract in styling) | 17 |
| Footer / copyright | 0 | 0 | 19 |
| Transitions | 0 | 2 (eval chamber transition_style: dissolve) | 17 |
| Encounter isolation | 0 | 0 | 19 |

**No encounter has:** button/icon contract, media behavior contract, marble tone governance, footer contract, or encounter isolation contract.

**All 19 encounters:** footer and copyright authority entirely absent from DB contracts.

---

## MISSING CONTRACT LIST

All 14 encounters with zero contract fields:

```
landing_root
landing_path_choice
educate_eval_encounter
cohort_conversion_encounter
understand_failure
c3_field
reserve_seat
foundation_offering
systems_offering
foundation_seat_hold
systems_seat_hold
structural_drift_dispatches
registered_process_log
seat_hold_notification_review
```

Plus 2 encounters missing DB rows entirely:
```
evaluation_result
publication_dispatch
```

---

## CONFLICTING CONTRACT LIST

No direct conflicts with sitewide clauses found. The evaluation chamber contracts (styling_contract v3) are directionally aligned with the sitewide material family (obsidian/lapis/marble) but predate the formal sitewide contract seat and use different field naming conventions.

**Notable structural concern:** `iis_eval_gate1` and `measures_ai_operational_evaluation` share identical styling contracts and share `state_expression: "public_iis_eval_gate1"`. This is not a conflict with the sitewide contract but is an encounter isolation inconsistency — two distinct encounter keys cannot share the same state expression without ambiguity in routing and isolation.

---

## RENDERER-ONLY STYLING LIST

All encounters with `null` contract fields and an active renderer are presumed to carry styling authority within renderer code (JSX/CSS) rather than Codex-contracted metadata.

Known drift cases from prior audit intelligence:
- `educate_eval_encounter` — hardcoded JSX strings confirmed (audit finding `mrs_intel_v1_drift_hardcoded_jsx_result`)
- `landing_root` — copyright hardcoded in JSX (audit finding `mrs_intel_v1_drift_hardcoded_copyright`)
- Unconditional `ASSESSMENT_SUB_SUPPORT_LINE` render in result renderer (audit finding `mrs_intel_v1_drift_unconditional_sub_support_line`)

Renderer-only styling confirmed from DB absence across 14 encounters. Renderer src inspection not required to classify — absence of contract field is sufficient under Codex-first governance.

---

## ORPHANED CONTRACT LIST

No orphaned contracts detected. The evaluation chamber styling contract (v3) and layout contract (v2) are the only seated contracts, and both are referenced by active encounters (`iis_eval_gate1`, `measures_ai_operational_evaluation`).

The orphaned authority surfaces from prior audit (`icon_contract`, `transition_contract` stated but not implemented) are renderer-level orphans, not encounter-level orphaned contracts.

---

## SHARED RENDERER GROUPS

Two renderer groupings require coordinated contract authoring — contract changes should apply to both encounters in each group:

| Renderer | Encounters |
|---|---|
| `offering_surface` | `foundation_offering`, `systems_offering` |
| `hold_surface` | `foundation_seat_hold`, `systems_seat_hold` |
| Evaluation chamber | `iis_eval_gate1`, `measures_ai_operational_evaluation` |

---

## RECOMMENDED AMENDMENT ORDER

Priority determined by: traffic weight, existing contract state, prior audit Priority 1 findings, implementation sequencing.

### Priority 1 — Evaluation chamber amendment

**`iis_eval_gate1`** + **`measures_ai_operational_evaluation`**

Best existing contracts in the system. Amendment adds the 4 missing sitewide clauses:
- `media_behavior_contract` — autoplay, mute/unmute, encounter-scoped media rules
- `transition_contract` — formalize `transition_style: dissolve` into proper contract field
- `branding_contract` — formalize watermark_contract into proper branding_contract field
- `footer_contract` — copyright authority, footer visibility for evaluation context

Resolve shared `state_expression: "public_iis_eval_gate1"` — one or both encounter keys requires distinct state expression.

### Priority 2 — evaluation_result encounter row

Create the missing `evaluation_result` encounter row and seat full contract. Prior audit Priority 1. Result renders in-place without surface transition — isolation contract required.

### Priority 3 — Passage and educate encounters

**`educational_diagnostic_passage`** — amend from stub to full contract
**`educate_eval_encounter`** — author full contract; address known JSX drift in renderer

These are the education/diagnostic path leading into evaluation. Contract before renderer corrections.

### Priority 4 — Entry surfaces

**`landing_root`** — entry point, epigraph/hero surface. Typography, media, branding, footer contracts required.
**`landing_path_choice`** — binary choice. Button/icon contract, typography, minimal material contract.

### Priority 5 — Conversion surface

**`cohort_conversion_encounter`** — conversion orientation. Material, typography, button, viewport contracts.

### Priority 6 — Exploration surface

**`understand_failure`** — generic media encounter. Media behavior, viewport/containment, typography.

### Priority 7 — Authority and intake surfaces

**`c3_field`**, **`reserve_seat`** — authority and selector surfaces. Minimal contract scope.

### Priority 8 — Offering and hold pairs

**`foundation_offering`** + **`systems_offering`** — shared renderer, author once.
**`foundation_seat_hold`** + **`systems_seat_hold`** — shared renderer, author once.

### Priority 9 — Publication and operator surfaces

**`structural_drift_dispatches`** — publication surface, footer/copyright contract critical.
**`registered_process_log`**, **`seat_hold_notification_review`** — operator-facing, lower priority.

### Priority 10 — publication_dispatch

Create missing encounter row. Determine renderer and function_layer first.

---

## RECOMMENDED NEXT OAR2

**OAR2:** Amend evaluation chamber encounter contracts against sitewide style contract.

Target encounters: `iis_eval_gate1`, `measures_ai_operational_evaluation`

Scope:
- Add `media_behavior_contract` — encounter-scoped media rules aligned to sitewide clause
- Add `transition_contract` — formalize dissolve authority, state isolation expectations
- Add `branding_contract` — formalize watermark rules into sitewide branding clause structure
- Add `footer_contract` — copyright authority, footer visibility for evaluation context
- Resolve shared `state_expression` — assign distinct state expressions per encounter key
- Preserve: `styling_contract` v3, `layout_contract` v2 unchanged

These are the only encounters already contractually grounded. Completing their sitewide alignment before authoring contracts for the 14 uncontracted encounters establishes the amendment pattern.

---

## AUDIT SUMMARY

| Category | Count |
|---|---|
| Encounters found in DB | 17 |
| Encounters missing from DB | 2 |
| Partially compliant (have contracts, missing clauses) | 2 |
| Needs amendment (stub contract) | 1 |
| Missing contract / renderer-only styling | 14 |
| Conflicting contracts | 0 |
| Orphaned encounter contracts | 0 |
| Sitewide clauses with zero coverage | 5 (button/icon, media behavior, marble tone playback, footer, encounter isolation) |
| Sitewide clauses with partial coverage | 5 (typography, color/material, branding, viewport, transitions — eval chamber only) |

**Conclusion:** 14 of 17 present encounters have no styling contracts. 2 encounters are missing from the DB entirely. The evaluation chamber is the only contracted surface and covers 5 of 9 sitewide clauses partially. No encounter in the system has a button/icon, media behavior, marble tone playback, footer, or encounter isolation contract seated.

---

## CLOSEOUT

Encounter audit complete. No DB writes. No renderer edits. No contract modifications.

Complete map of current encounter-level styling/runtime contracts against the seated sitewide style contract is established. Amendment sequencing recommended. Evaluation chamber amendment identified as next OAR2.

OAR1 ready for operator review.
