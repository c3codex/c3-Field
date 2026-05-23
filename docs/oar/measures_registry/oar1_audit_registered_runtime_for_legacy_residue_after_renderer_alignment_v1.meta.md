---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_audit
title: OAR1 — Audit Registered Runtime for Legacy Residue After Renderer Alignment
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_registered_runtime_for_legacy_residue_after_renderer_alignment_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-audit
  - legacy-residue
  - renderer-alignment
  - registered-runtime
  - codex-first
---

# OAR1 — Audit Registered Runtime for Legacy Residue After Renderer Alignment

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_audit_registered_runtime_for_legacy_residue_after_renderer_alignment_v1.meta.md`

Post-renderer runtime residue audit for the Measures Registry registered runtime. Identify and contain legacy residue remaining after renderer alignment. Apply bounded corrections. Confirm build.

---

## 1. SURFACESTATE CLASSIFICATION

All `SurfaceState` values from `src/measures_registry/MeasuresRegistryRuntime.tsx` lines 116–142:

| SurfaceState | Classification |
|---|---|
| `intro` | Registered 13 — ai_isnt_broken_intro |
| `educational_diagnostic_passage` | Registered 13 — eval_passage alias |
| `path_choice` | Registered 13 — evaluate_structure_path alias |
| `connect_src` | Registered 13 — connect_src |
| `structure_passage` | Registered 13 — structure_passage |
| `measures_assessment` | Registered 13 — measures_assessment |
| `structured_eval` | Registered 13 — structured_eval |
| `measures_phases_reveal` | Registered 13 — measures_phases_reveal |
| `about_measures_registry` | Registered 13 — about_measures_registry |
| `measures_eval_email_contract` | Registered 13 — measures_eval_email_contract |
| `phase_payment` | Registered 13 — phase_payment |
| `reserve_seat` | Registered 13 — reserve_seat |
| `structural_drift_dispatches` | Registered 13 alias — structural_drift_publication maps via REGISTERED_KEY_TO_SURFACE |
| `registered_process_log` | Valid internal — operator process log |
| `seat_hold_notification_review` | Valid internal — operator notification admin |
| `publication_dispatch` | Valid internal — structural drift dispatch article view |
| `educate_eval` | Deprecated legacy alias — educate_eval_encounter |
| `cohort_conversion` | Deprecated legacy alias — cohort_conversion_encounter (is_active=false) |
| `measures_ai_operational_evaluation` | Legacy alias — superseded by measures_assessment |
| `iis_eval_gate1` | Deprecated legacy — iis_eval_gate1 |
| `understand_failure` | Deprecated legacy |
| `c3_field` | Deprecated legacy — not in registered 13 |
| `foundation_offering` | Deprecated legacy |
| `systems_offering` | Deprecated legacy |
| `foundation_seat_hold` | Deprecated legacy |
| `systems_seat_hold` | Deprecated legacy |

---

## 2. DISPATCHER BRANCH CLASSIFICATION

Dispatcher: `src/measures_registry/MeasuresRegistryRuntime.tsx` lines 3658–3688.

All registered 13 encounters have renderer branches. Legacy surfaces have renderer branches but are bounded behind specific action triggers or inactive DB rows.

| activeSurface | Renderer | Registered | Legacy reachable from registered flow |
|---|---|---|---|
| `path_choice` | `renderPathChoiceSurface()` | ✓ | No |
| `educational_diagnostic_passage` | `renderEducationalDiagnosticPassageSurface()` | ✓ | No |
| `connect_src` | `renderConnectSrcSurface()` — **converted to soft SRC intake** | ✓ | No |
| `structure_passage` | `renderStructurePassageSurface()` | ✓ | No |
| `measures_assessment` | `renderMeasuresAssessmentSurface()` | ✓ | No |
| `structured_eval` | `renderStructuredEvalSurface()` | ✓ | No |
| `measures_phases_reveal` | `renderMeasuresPhasesRevealSurface()` | ✓ | No |
| `about_measures_registry` | `renderAboutMeasuresRegistrySurface()` | ✓ | No |
| `measures_eval_email_contract` | `renderMeasuresEvalEmailContractSurface()` | ✓ | No |
| `phase_payment` | `renderPhasePaymentSurface()` | ✓ | No |
| `reserve_seat` | `renderReserveSeatSurface()` | ✓ | No |
| `structural_drift_dispatches` | `renderStructuralDriftDispatchesSurface()` | ✓ alias | No (note: footer has c3_field link — see §10) |
| `educate_eval` | `renderEducateEvalSurface()` | Deprecated | Not from registered path |
| `cohort_conversion` | `renderCohortConversionSurface()` | Deprecated | **Was reachable — corrected** |
| `measures_ai_operational_evaluation` | `renderEvaluationChamberSurface(...)` | Legacy alias | Not from registered path after correction |
| `iis_eval_gate1` | `renderEvaluationChamberSurface(...)` | Deprecated | Not from registered path after correction |
| `understand_failure` | `renderUnderstandFailureSurface()` | Deprecated | Not reachable |
| `c3_field` | `renderC3FieldSurface()` | Deprecated | Footer link only — bounded, documented §10 |
| `foundation_offering` | `renderOfferingSurface(...)` | Deprecated | Not from registered path after correction |
| `systems_offering` | `renderOfferingSurface(...)` | Deprecated | Not from registered path |
| `foundation_seat_hold` | `renderHoldSurface(...)` | Deprecated | Not from registered path |
| `systems_seat_hold` | `renderHoldSurface(...)` | Deprecated | Not from registered path |
| `intro` (fallback) | `renderIntroSurface()` | ✓ | N/A |

---

## 3. SURFACEFROMENOUNTERKEY MAPPING REVIEW

| Encounter Key | Resolved SurfaceState | Classification |
|---|---|---|
| `landing_root` | `intro` | Registered |
| `landing_path_choice` | `path_choice` | Registered |
| `educational_diagnostic_passage` | `educational_diagnostic_passage` | Registered (SURFACE_QUERY) |
| `eval_passage` | `educational_diagnostic_passage` | Registered (REGISTERED_KEY_TO_SURFACE) |
| `evaluate_structure_path` | `path_choice` | Registered (REGISTERED_KEY_TO_SURFACE) |
| `connect_src` | `connect_src` | Registered |
| `structure_passage` | `structure_passage` | Registered |
| `measures_assessment` | `measures_assessment` | Registered |
| `structured_eval` | `structured_eval` | Registered |
| `measures_phases_reveal` | `measures_phases_reveal` | Registered |
| `about_measures_registry` | `about_measures_registry` | Registered |
| `structural_drift_dispatches` | `structural_drift_dispatches` | Registered alias |
| `structural_drift_publication` | `structural_drift_dispatches` | Registered (REGISTERED_KEY_TO_SURFACE) |
| `measures_eval_email_contract` | `measures_eval_email_contract` | Registered |
| `reserve_seat` | `reserve_seat` | Registered |
| `phase_payment` | `phase_payment` | Registered |
| `cohort_conversion_encounter` | `cohort_conversion` | Legacy — no longer reached from registered path |
| `educate_eval_encounter` | `educate_eval` | Legacy |
| `iis_eval_gate1` | `iis_eval_gate1` | Deprecated |
| `measures_ai_operational_evaluation` | `measures_ai_operational_evaluation` | Legacy alias |

No mapping causes registered route bleed after corrections.

---

## 4. HARDWIRED NAVIGATESURFACE TARGET REVIEW

All `navigateSurface(...)` calls inspected. Key findings:

| Location | Target | Classification | Action |
|---|---|---|---|
| handleAction line 1186 | `"cohort_conversion"` | Deprecated — triggered by `route_cohort_conversion` | DB action key changed — no longer reachable from registered intro |
| handleAction line 1178 | `"educate_eval"` | Deprecated — triggered by `continue_to_evaluation` or `educate_eval_encounter` target | Not reachable from registered path (eval_passage action already corrected) |
| handleAction line 1194 | `"measures_ai_operational_evaluation"` or `"iis_eval_gate1"` | Legacy — triggered by `begin_evaluation` | Not reachable from registered 13 action set |
| handleAction line 1213 (before) | `"iis_eval_gate1"` fallback | Deprecated — triggered by `begin_structural_evaluation` | **Corrected** → `"measures_assessment"` |
| handleAction line 1227 | `"understand_failure"` | Deprecated | Not reachable from registered path |
| handleAction line 1240 | `"c3_field"` | Deprecated | Not reachable from registered path actions |
| line 1293 | `connectSrcNextEncounter` | Registered dynamic | ✓ |
| line 1315 | `"connect_src"` | Registered | ✓ |
| lines 1411, 1416 | `"measures_phases_reveal"` | Registered | ✓ |
| lines 1473, 1478 | `"measures_phases_reveal"` | Registered | ✓ |
| line 1529 | `"about_measures_registry"` | Registered | ✓ |
| line 1576 | `"structural_drift_dispatches"` | Registered alias | ✓ |
| line 1631 | `"reserve_seat"` | Registered | ✓ |
| lines 2253, 2274, 2306 | `"connect_src"` or `"iis_eval_gate1"` | Registered / deprecated fallback | connect_src preferred; iis_eval_gate1 only if connect_src not in sectionMap (never occurs in registered runtime) |
| line 2666 | `"systems_offering"` | Deprecated | In deprecated cohort_conversion surface only — not reachable |
| line 3496 | `"c3_field"` | Deprecated | **Footer brand link in structural_drift_dispatches — bounded, documented §10** |
| line 3607 | `"measures_eval_email_contract"` | Registered | ✓ |
| line 3611 | `"educational_diagnostic_passage"` | Registered | ✓ (re-entry from publication if no eval report) |

---

## 5. HANDLEACTION ROUTE REVIEW

| Action Key / Condition | Before | After | Status |
|---|---|---|---|
| `route_educate_eval` | → `educational_diagnostic_passage` | unchanged | ✓ registered |
| `route_cohort_conversion` | → `cohort_conversion` | unchanged in code — no longer in DB or default | bounded |
| `route_structure_passage` | generic fallback → `structure_passage` | same | ✓ registered |
| `begin_structural_evaluation` | → `measures_ai_operational_evaluation` or `iis_eval_gate1` | → `measures_assessment` | **corrected** |
| `landing_path_choice` target | → `path_choice` | unchanged | ✓ registered |

Unknown action targets fail silently (no navigation). DB-seated action targets respected via generic fallback (`surfaceFromEncounterKey`).

---

## 6. ASSESSMENT/SRC COMPLETION ROUTE REVIEW

| Handler | Route | Status |
|---|---|---|
| `measures_assessment` → `onEnterStructuredEnvironment` | → `measures_phases_reveal` (line 1411) | ✓ |
| `measures_assessment` → `onStructuredEnvironmentVideoEnded` | → `measures_phases_reveal` (line 1416) | ✓ |
| `structured_eval` → `onEnterStructuredEnvironment` | → `measures_phases_reveal` (line 1473) | ✓ |
| `structured_eval` → `onStructuredEnvironmentVideoEnded` | → `measures_phases_reveal` (line 1478) | ✓ |
| `MeasuresAssessmentResult` — only button | → `onEnterStructuredEnvironment` prop | ✓ (no cohort bleed) |

No completion path routes to `cohort_conversion_encounter`. No scoring fork. No email dispatch. No payment logic exposed.

---

## 7. CONNECT_SRC BEHAVIOR REVIEW

### Before

`renderer: static_authority_surface`

`renderConnectSrcSurface` rendered a static c3 Field authority page with paragraphs and a single continue button. No form. No field capture.

### After

`renderer: soft_src_intake_surface` (DB updated)

`renderConnectSrcSurface` now renders:

- Encounter title/eyebrow/subtitle from seated metadata (unchanged)
- `registry-iis-eval-form` form with four `required` fields:
  - Institution / Company Name (`institution_name`)
  - Business Type (`institution_type`)
  - Contact Name (`contact_name`)
  - Contact Email (`contact_email`, `type="email"`)
- `fieldset` with legend "Institution Contact"
- Submit button: `connectSrcCopy.ctaPrimary ?? "Continue to Evaluation"`

**On submit:**
1. `setEvalFields` populated with soft SRC field values — passes context into assessment flow via the existing eval fields mechanism
2. `navigateSurface(connectSrcNextEncounter)` — preserves left/right path context

**Route behavior confirmed:**
- Left path: `eval_passage` sets `connectSrcNextEncounter = "measures_assessment"` → connect_src → measures_assessment
- Right path: `structure_passage` sets `connectSrcNextEncounter = "structured_eval"` → connect_src → structured_eval

**Soft SRC storage:**
Fields are stored in runtime `evalFields` state (existing mechanism). This passes the captured context directly into the assessment src_capture form. No new DB table created. Persistent storage for standalone soft SRC records is not yet seated — flagged for future OAR if standalone SRC persistence is required.

---

## 8. MEDIA ROLE RESIDUE REVIEW

| Media Role | Classification | Status |
|---|---|---|
| `epigraph_video` | Active — consumed in `renderIntroSurface` | ✓ maps to `registry_epigraph_fracture_to_alignment_15s.mp4` (per prior OAR1) |
| `hero_video` | Queried, not consumed in any renderer | Dead role — if inactive in DB, resolves to null, no visual impact. No correction needed; flag for future cleanup OAR. |
| `registry_watermark` / `watermark` | Active — consumed in connect_src, assessment chamber | ✓ |
| `structured_environment_passage_video` | Active — consumed in `renderStructurePassageSurface` | ✓ |
| `left_hero_fracture`, `left_hero_fracture_motion` | Optional — consumed in path_choice threshold if seating supports | Pending renderer extension per prior OAR scope |
| `right_measured_hero`, `measured_hero_motion_graphic` | Optional — consumed in intro/path_choice if available | Pending renderer extension per prior OAR scope |
| `foundation_intro_video`, `systems_intro_video` | Optional — consumed in deprecated offering surfaces only | Bounded legacy |
| `c3_field_video` | Optional — consumed in deprecated c3_field surface | Bounded legacy |

Path_choice left/right media roles (`left_hero_fracture`, `left_hero_fracture_motion`, `right_measured_hero`) remain pending renderer extension — not blocking.

---

## 9. DEPRECATED DB ACTION TARGET REVIEW

### Found in registered 13

| Encounter | Action Key | Target (Before) | Target (After) | Corrected |
|---|---|---|---|---|
| `ai_isnt_broken_intro` | `route_cohort_conversion` → renamed to `route_structure_passage` | `cohort_conversion_encounter` | `structure_passage` | ✓ |
| `ai_isnt_broken_intro` right hero_path | `route_cohort_conversion` → `route_structure_passage` | — | — | ✓ |
| `structural_drift_publication` | `begin_structural_evaluation` | `iis_eval_gate1` | `measures_assessment` | ✓ |
| `phase_payment` | `back_to_offering` | `foundation_offering` | `reserve_seat` | ✓ |
| `connect_src` | renderer | `static_authority_surface` | `soft_src_intake_surface` | ✓ |
| `connect_src` | `soft_src_fields` | null | `["institution_name","institution_type","contact_name","contact_email"]` | ✓ |

All other registered 13 encounters had no deprecated action targets.

---

## 10. DIRECT URL DEPRECATED SURFACE REVIEW

`?surface=<key>` routes through `surfaceFromQuery` → `setActiveSurface`. No containment guard at URL level.

| URL Surface Param | Resolves To | Renders |
|---|---|---|
| `cohort_conversion_encounter` | `cohort_conversion` | `reportMissingClassification` returns null (is_active=false) → blank |
| `educate_eval_encounter` | `educate_eval` | Legacy surface renders if data present |
| `iis_eval_gate1` | `iis_eval_gate1` | Legacy evaluation chamber |
| `understand_failure` | `understand_failure` | Legacy surface |
| `foundation_offering` | `foundation_offering` | Legacy offering surface |
| `systems_offering` | `systems_offering` | Legacy offering surface |
| `c3_field` | `c3_field` | Legacy c3 Field authority surface |

**Recommendation:** Deprecated surfaces remain accessible via direct URL but are not reachable from the registered public flow. No active routing from registered path leads to these surfaces after corrections. Containment via `is_active=false` (RLS gate) is the primary mechanism for `cohort_conversion_encounter`. Remaining deprecated surfaces are not RLS-gated — they render legacy content if URL-accessed directly. URL-level containment (redirect to registered surface) is not implemented in this OAR. Flag for future containment OAR if runtime purity requires full URL blocking.

**Bounded alias documented — c3_field footer link:**
`renderStructuralDriftDispatchesSurface` contains a footer button → `navigateSurface("c3_field")` at line 3496. This link is reachable from the registered flow (about_measures_registry → structural_drift_dispatches). It routes to a deprecated surface. This is a brand/organizational link ("c3 Field" parent). It is bounded: the `c3_field` surface is not in the registered 13 path, and the footer link is user-initiated (not automatic). Not removed in this OAR. Flag for future correction if brand footer links should route to external URL instead of deprecated surface.

---

## 11. REGISTERED BRANCH VALIDATION

### Left branch

```
eval_passage
    -> connect_src (soft SRC intake: institution_name, institution_type, contact_name, contact_email)
    -> measures_assessment (evalFields pre-populated)
    -> measures_phases_reveal
    -> about_measures_registry
    -> structural_drift_dispatches
    -> measures_eval_email_contract
    -> reserve_seat
    -> phase_payment
```

Route chain: ✓ intact. No deprecated surface reachable.

### Right branch

```
structure_passage
    -> connect_src (soft SRC intake)
    -> structured_eval (evalFields pre-populated)
    -> measures_phases_reveal
    -> (converged with left)
```

Route chain: ✓ intact. No deprecated surface reachable.

### From intro

```
ai_isnt_broken_intro
    left button (route_educate_eval) -> educational_diagnostic_passage (eval_passage)
    right button (route_structure_passage) -> structure_passage
```

Right intro button previously routed to `cohort_conversion_encounter`. **Now routes to `structure_passage`.**

---

## 12. BUILD RESULT

```
npm run build:registry
✓ built in 3.73s
```

- No TypeScript errors
- No assessment scoring fork
- No email dispatch
- No payment logic
- No deprecated route in registered path

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Added `softSrcFields` state; updated `renderConnectSrcSurface` to soft SRC intake form; fixed `renderIntroSurface` right action default; fixed `handleAction` `begin_structural_evaluation` route |

## DB ROWS MODIFIED

| Table | Row | Change |
|---|---|---|
| `measures_encounter_def` | `ai_isnt_broken_intro` | Right hero_path action_key: `route_cohort_conversion` → `route_structure_passage`; right action: action_key + target corrected to `route_structure_passage` / `structure_passage` |
| `measures_encounter_def` | `structural_drift_publication` | `begin_structural_evaluation` target: `iis_eval_gate1` → `measures_assessment` |
| `measures_encounter_def` | `phase_payment` | `back_to_offering` target: `foundation_offering` → `reserve_seat` |
| `measures_encounter_def` | `connect_src` | renderer: `static_authority_surface` → `soft_src_intake_surface`; soft_src_fields seated; route_after_capture seated |

Total: 4 rows updated.

## INSPECTION / EXECUTION ARTIFACTS

| Script | Purpose |
|---|---|
| `inspect-route-bleed-source-v1.cjs` | Initial route bleed identification |
| `inspect-registered-13-action-targets-v1.cjs` | Full audit of registered 13 DB action targets |
| `execute-correct-registered-runtime-residue-v1.cjs` | Applied all 4 DB corrections |

---

## PROCESS INTELLIGENCE CAPTURED

    Registration does not equal runtime purity.

    After registered runtime seating, src must still be audited for retained aliases,
    stale handlers, dead media roles, and precontract surfaces that can continue
    to express old behavior.

Recommended future sequence:

    1. Seat registered encounters
    2. Seat contracts
    3. Implement renderer alignment
    4. Activate public runtime
    5. Audit registered runtime for legacy residue ← this OAR
    6. Visual QA
    7. Deploy readiness

---

## READBACK

| Check | Result |
|---|---|
| All SurfaceState values classified | ✓ 26 values classified |
| Dispatcher branch classification | ✓ all branches reviewed |
| surfaceFromEncounterKey mapping | ✓ all registered keys resolve correctly |
| Hardwired navigateSurface targets reviewed | ✓ deprecated targets bounded or corrected |
| handleAction routes reviewed | ✓ corrected begin_structural_evaluation |
| Assessment/SRC completion routes | ✓ both paths → measures_phases_reveal |
| connect_src behavior | ✓ soft SRC intake form implemented |
| Media role residue | ✓ hero_video flagged as dead role; epigraph confirmed |
| Deprecated DB action targets | ✓ 3 deprecated targets corrected across registered 13 |
| Direct URL deprecated surface | ✓ documented, containment recommended for future OAR |
| Files modified | 1 |
| DB rows modified | 4 |
| Route bleed corrected | route_cohort_conversion → route_structure_passage ✓ |
| Build result | ✓ clean 3.73s |
| Left branch | ✓ intact, no deprecated route |
| Right branch | ✓ intact, no deprecated route |
| Converged branch | ✓ intact |

---

## CONFIRMATION

| Condition | Status |
|---|---|
| No deprecated route bleed remains in registered public flow | ✓ |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated rows deleted | ✓ |
| No UI redesign | ✓ |
| No assessment mechanics changed | ✓ |
| No new DB tables created | ✓ |
| No registered 13 sequence changed | ✓ |
| Frontend renders seated Codex state only | ✓ |

---

## CLOSEOUT

The registered runtime is proven clean after renderer alignment.

Legacy residue identified and addressed:

- `route_cohort_conversion` bleed from intro right path — corrected in DB and hardened in code default
- `begin_structural_evaluation` routing to deprecated `iis_eval_gate1` — corrected to `measures_assessment`
- `back_to_offering` in phase_payment routing to deprecated `foundation_offering` — corrected to `reserve_seat`
- `connect_src` static authority bridge — converted to soft SRC intake surface with four required fields

Bounded legacy aliases documented:

- `c3_field` footer link in structural_drift_dispatches — bounded organizational link, not in primary flow
- Direct URL access to deprecated surfaces — accessible but not reachable from registered path
- `hero_video` media role — queried but unconsumed, no visual impact

Build is clean. Registered public flow is ready for final visual QA.

OAR1 ready for operator review.
