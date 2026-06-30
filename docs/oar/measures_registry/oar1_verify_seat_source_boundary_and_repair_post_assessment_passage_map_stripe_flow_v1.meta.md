---
document_type: oar1
authority_level: launch_repair
document_scope: seat_boundary_post_assessment_flow
title: OAR1 - Verify SEAT Source Boundary and Repair Post Assessment Passage MAP Stripe Flow
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_verify_seat_source_boundary_and_repair_post_assessment_passage_map_stripe_flow_v1
---

# OAR1 - Verify SEAT Source Boundary and Repair Post Assessment Passage MAP Stripe Flow

## REPAIRS APPLIED

### 1. Sequence order corrected

`ObsidianChamberRenderer.tsx` — `handleSubmitEvaluation`:

Before fix: after capture, called `onNavigate(next)` → navigated to passage video, bypassing report.

After fix: calls `setEvalSubmitted(true)` after sessionStorage write → report renders first. "Begin Pathway Review" button calls `onBeginPathwayReview → onNavigate(next)` → passage video → MAP.

`ObsidianChamberRenderer.tsx` — `ObsidianToMarblePassage`:

Removed: `PendingReport` type, `pendingReport` state, `passageComplete` state, after-video report render block.

Result: passage video plays, continue advances to MAP. No report re-render in passage.

Removed unused `PublicAssessmentResult` import.

### 2. Type check and build

- `tsc --noEmit`: 0 errors
- `npm run build`: success (8.89s, chunk size warning only — cosmetic)

---

## SECTION 1: ACTIVE SOURCE BOUNDARY

`src/app/App.tsx` line 5:

```tsx
import MeasuresRegistryRuntime from "../measures_registry/encounter_renderer/MeasuresRegistryOrchestrator"
```

FREE orchestrator (`MeasuresRegistryOrchestrator`) is the only active import. `MeasuresRegistryRuntimeRegistered` is NOT imported.

Pipeline confirmed active:

- `MeasuresRegistryOrchestrator` → active (App.tsx route authority)
- `EncounterEntry` → active (imported by Orchestrator)
- `EncounterBoundary` → active (imported by EncounterEntry)
- `ChamberRouter` → active (imported by EncounterBoundary)

---

## SECTION 2: REGISTERED_RUNTIME STANDING

| File / Import | Classification | Notes |
|---|---|---|
| `MeasuresRegistryRuntimeRegistered.tsx` | rollback_only | Not imported by App.tsx or any FREE component. No active route authority. Safe to retain as audit trace. |
| `registered_runtime/registeredRuntimeUtils.ts` | still_imported / safe_to_move | Imported by all 4 chamber renderers + Orchestrator. Provides shared utilities (asRecord, asString, allAssessmentMechanics, resolveEnvironmentalReportByScore, etc.). Not the monolith renderer. |
| `registered_runtime/styles/registry.encounter.css` | still_imported / safe_to_move | Imported by Orchestrator for shared encounter styles. |
| `registered_runtime/renderers/RegisteredPrivacy.tsx` | still_imported / active_usage_by_free | Rendered by Orchestrator for `/privacy` route. |
| `registered_runtime/renderers/RegisteredTerms.tsx` | still_imported / active_usage_by_free | Rendered by Orchestrator for `/terms` route. |

Monolith claim: `MeasuresRegistryRuntimeRegistered` is NOT active route authority. SEAT/FREE boundary is the sole production authority.

Do not claim monolith fully toppled while `registeredRuntimeUtils`, CSS, and legal renderers remain in `registered_runtime/`. These are shared utilities in place — moving them is a separate OAR.

---

## SECTION 3: POST-ASSESSMENT TRANSITION ORDER (AFTER REPAIR)

Authority: `handleSubmitEvaluation` in `ObsidianChamberRenderer.tsx` + transition nodes in `measures_encounter_def` metadata.

| Step | Trigger | Source | DB Authority |
|---|---|---|---|
| contact capture render | `evalStep = "contact_capture"` | `PublicAssessmentSurface.tsx` | `assessment_contact_capture_oar1_binding_contract_v1` in encounter def metadata |
| contact capture submit | form `onSubmit → handleSubmitEvaluation` | `ObsidianChamberRenderer.tsx` | `measures_iis_eval_gate1_capture` table insert |
| report render | `setEvalSubmitted(true)` | `PublicAssessmentSurface.tsx` → `PublicAssessmentResult.tsx` | `assessment_evaluation_report_contract_v1` + `assessment_interpretation` in encounter def |
| passage media render | `onBeginPathwayReview → onNavigate("obsidian_to_marble_passage_video")` | `ObsidianToMarblePassage` in `ObsidianChamberRenderer.tsx` | `measures_encounter_def` + `measures_registry` for `obsidian_to_marble_passage_video` |
| MAP encounter render | `handleContinue → onNavigate(next)` where next = `map_integrity_governance` | `MapIntegrityGovernance` in `MarbleChamberRenderer.tsx` | transition node `obsidian_to_marble_passage_video.next_surface = "map_integrity_governance"` |
| payment CTA render | pathway cards from encounter def metadata | `MarbleChamberRenderer.tsx` lines 210–287 | `pathway_cards` in `map_integrity_governance` encounter def (migration 008) |

Order is now: assessment → contact capture → report → passage media → MAP encounter → Stripe payment.

---

## SECTION 4: PASSAGE MEDIA

- `obsidian_to_marble_passage_video` surface: ✓ seated and released (migration `202606240009_seat_encounter_surface_assignment.sql` line 53)
- Route/surface assignment: ✓ obsidian chamber, `ObsidianChamberRenderer`, `release_state = released`, `access_level = public`
- Transition node in: ✓ `measures_assessment.next_surface = "obsidian_to_marble_passage_video"` (migration `202606270002`)
- Transition node out: ✓ `obsidian_to_marble_passage_video.next_surface = "map_integrity_governance"` (migration `202606270002`)
- `continue` advances to MAP: ✓ `ObsidianToMarblePassage.handleContinue → onNavigate(next)` where next resolves to `map_integrity_governance`
- Media row (`before_the_pathway_obsidian_to_marble_passage_video` in `measures_media_map`): **NOT FOUND IN MIGRATIONS** — no migration seeds this row. Live seating status unknown. If unseated, renderer shows "Pathway passage video is not seated." placeholder. Continue button still advances to MAP.

Blocker classification: media row gap — video upload + `measures_media_map` row insert required. Not a code blocker. Flow advances to MAP regardless.

---

## SECTION 5: REPORT WORDING

Report copy is DB-seated, not hardcoded. Source path:

- `resolveEnvironmentalReportByScore` (in `registeredRuntimeUtils.ts`) reads `assessment_interpretation` from encounter def metadata to compute `report.environmental_standing`, `standing_key`, `continuation_pathway`
- `PublicAssessmentResult.tsx` reads `reportTemplates[report.standing_key]` from `assessment_evaluation_report_contract_v1` in encounter def metadata for section headers and copy
- `assessmentCompletion.measures_registry_standing_title/body` from `assessment_completion` in encounter def metadata

Source table: `measures_encounter_def`, encounter key `measures_ai_operational_evaluation` (or `measures_assessment`)
Source keys: `metadata.assessment_interpretation`, `metadata.assessment_evaluation_report_contract_v1`, `metadata.assessment_completion`

Initial seating: migration `202606080002_obsidian_contract_seating.sql` (lines 206, 265)

Report copy was not rewritten in this OAR. OAR2 §5 requires DB-seated approved replacement to exist before any rewrite. Status: pending separate OAR if copy correction is needed.

---

## SECTION 6: MAP ENCOUNTER

- `map_integrity_governance` surface: ✓ marble chamber, `MarbleChamberRenderer`, released, public (migration `202606240009`)
- Transition from passage: ✓ `obsidian_to_marble_passage_video.next_surface = "map_integrity_governance"` (migration `202606270002`)
- Three pathway cards: ✓ foundational $333, optimization $777, remediation $999 (migration `202606290008`)
- `applicable_standing_keys`: eval_result_01 → foundational; eval_result_02 → optimization; eval_result_03/04 → remediation
- "MAP the Environment" label: ✓ shown below price on each card (`MarbleChamberRenderer.tsx` line 242)
- CTA: ✓ per-card payment button calls `handlePayment(cardMapPathway) → onInitiateMapPayment`
- `onInitiateMapPayment`: ✓ wired from Orchestrator through EncounterEntry → EncounterBoundary → ChamberRouter → MarbleChamberRenderer
- Standing key read from sessionStorage: ✓ `MapIntegrityGovernance` reads `__mreg_pending_report` on mount
- No SEAT public pricing: ✓
- No c3 Key issuance: ✓
- No certification claim: ✓

---

## SECTION 7: STRIPE PAYMENT BEHAVIOR

Classification: **wired, standing indeterminate — Cloudflare env binding values not accessible**

- Function: `functions/api/map/create-checkout-session.ts` — Cloudflare Pages Function
- Required env bindings: `STRIPE_SECRET_KEY`, `STRIPE_MAP_FOUNDATIONAL_PRICE_ID`, `STRIPE_MAP_OPTIMIZATION_PRICE_ID`, `STRIPE_MAP_REMEDIATION_PRICE_ID`
- DB price IDs (migration 008): foundational `price_1Tg87rP9heJD6LYqW8JkxRJw`, optimization `price_1Tg8CgP9heJD6LYqZoVQmH7H`, remediation `price_1Tg8IaP9heJD6LYq3y6CQHX5`
- `map_c2_circuit` release_state: all three circuits `active` (migration 008)
- Function resolves price from env binding (overrides DB value) — final price depends on Cloudflare binding values
- Test vs live: indeterminate — `STRIPE_SECRET_KEY` prefix (`sk_test_` vs `sk_live_`) not inspectable without Cloudflare dashboard
- Code path verified: button → `handlePayment` → `onInitiateMapPayment` → `fetch("/api/map/create-checkout-session")` → Stripe checkout session → `window.location.href = data.checkout_url`
- No SEAT checkout: ✓
- No certification claim: ✓
- No c3 Key issuance: ✓

---

## VALIDATION CHECKLIST (OAR2 §VALIDATION)

1. Active source boundary classified: ✓ FREE orchestrator confirmed active; `MeasuresRegistryRuntimeRegistered` confirmed not imported
2. registered_runtime standing classified: ✓ `registeredRuntimeUtils`, CSS, legal renderers = still_imported/shared; monolith renderer = rollback_only
3. SEAT/FREE boundary confirmed: ✓ sole production authority is FREE pipeline; shared utilities in `registered_runtime/` are not route authority
4. Actual post-assessment flow traced: ✓ (pre-fix: was assessment → contact capture → passage → report → MAP; wrong)
5. Expected post-assessment flow defined from authority: ✓ (OAR2: assessment → contact capture → report → passage → MAP → Stripe)
6. Passage media restored or blocker identified: media row not found in migrations — gap identified; flow advances to MAP via continue regardless
7. Report wording source traced: ✓ DB-seated via encounter def metadata; not rewritten
8. MAP encounter restored or blocker identified: ✓ MAP encounter present, wired, payment chain complete
9. Stripe behavior classified: wired; test vs live indeterminate without Cloudflare dashboard
10. No SEAT checkout exposed: ✓
11. No certification claim: ✓
12. No c3 Key issuance claim: ✓
13. Build passes: ✓ (tsc clean, vite build success)
14. Browser QA evidence: not yet returned — deploy required; Cloudflare Pages build triggered on push

## HELD

- Report copy rewrite: no approved replacement in this OAR
- Stripe test/live classification: requires Cloudflare env binding inspection
- Passage video media row: requires video upload + measures_media_map insert
- `registered_runtime` folder reorganization: separate OAR
- Deleting `MeasuresRegistryRuntimeRegistered.tsx`: separate OAR, currently safe as rollback trace
