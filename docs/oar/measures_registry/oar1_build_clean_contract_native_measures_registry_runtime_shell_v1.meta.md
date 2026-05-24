---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_rebuild
title: OAR1 — Build Clean Contract-Native Measures Registry Runtime Shell
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-rebuild
  - contract-native-runtime
  - registered-13
  - drift-containment
  - codex-first
---

# OAR1 — Build Clean Contract-Native Measures Registry Runtime Shell

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md`

Build a clean contract-native Measures Registry runtime shell bounded to the registered 13 public encounters. Freeze the legacy monolithic runtime as a recovery source only. Switch the route import to the new registered shell.

---

## 1. LEGACY RUNTIME FROZEN

`src/measures_registry/MeasuresRegistryRuntime.tsx` — 3720 lines — retained unchanged as `legacy_precontract_runtime_source`.

Not deleted. Not further patched. Available only for verified logic recovery.

---

## 2. NEW FILES CREATED

### Shell and utilities

| File | Lines | Purpose |
|---|---|---|
| `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts` | ~80 | Registered 13 surface type; all DB row types |
| `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts` | ~280 | Pure utility functions recovered from legacy runtime |
| `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | ~420 | Main orchestrator — state, data fetch, navigation, surface dispatch |

### Renderer units

| File | Encounter |
|---|---|
| `src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx` | ai_isnt_broken_intro |
| `src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx` | evaluate_structure_path |
| `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx` | eval_passage / structure_passage |
| `src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx` | measures_assessment / structured_eval |
| `src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx` | measures_eval_email_contract |
| `src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx` | measures_phases_reveal |
| `src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx` | about_measures_registry |
| `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx` | structural_drift_publication / publication_dispatch |
| `src/measures_registry/registered_runtime/renderers/RegisteredReserveSeat.tsx` | reserve_seat |
| `src/measures_registry/registered_runtime/renderers/RegisteredPhasePayment.tsx` | phase_payment |
| `src/measures_registry/registered_runtime/renderers/RegisteredConnectSrc.tsx` | connect_src (retained, not in active flow) |

### Runtime switch

`src/app/App.tsx` — import changed from:

```typescript
import MeasuresRegistryRuntime from "../measures_registry/MeasuresRegistryRuntime"
```

to:

```typescript
import MeasuresRegistryRuntime from "../measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered"
```

All existing route logic in `App.tsx` unchanged. The function signature `MeasuresRegistryRuntime` is the default export of the new shell, so the switch is a single import line.

---

## 3. REGISTERED 13 DISPATCHER

The clean runtime resolves only the registered 13:

| # | Encounter Key | Surface State | Renderer |
|---|---|---|---|
| 1 | ai_isnt_broken_intro | intro | RegisteredIntro |
| 2 | evaluate_structure_path | path_choice | RegisteredPathChoice |
| 3 | eval_passage | eval_passage | RegisteredPassage (variant=eval) |
| 4 | connect_src | connect_src | RegisteredConnectSrc (held from active flow) |
| 5 | measures_assessment | measures_assessment | RegisteredAssessment |
| 6 | structure_passage | structure_passage | RegisteredPassage (variant=structure) |
| 7 | structured_eval | structured_eval | RegisteredAssessment |
| 8 | measures_phases_reveal | measures_phases_reveal | RegisteredPhaseReveal |
| 9 | about_measures_registry | about_measures_registry | RegisteredAbout |
| 10 | structural_drift_publication | structural_drift_dispatches | RegisteredStructuralDrift (variant=index) |
| 11 | measures_eval_email_contract | measures_eval_email_contract | RegisteredEvalEmailContract |
| 12 | reserve_seat | reserve_seat | RegisteredReserveSeat |
| 13 | phase_payment | phase_payment | RegisteredPhasePayment |

Plus: `publication_dispatch` surface for `/publication/structural_drift/*` URL paths → RegisteredStructuralDrift (variant=article).

---

## 4. REGISTERED FLOW CONTRACT — CONFIRMED EXPRESSED

### Entry

```
ai_isnt_broken_intro (intro)
    -> evaluate_structure_path (path_choice)
```

### Left branch

```
path_choice
    -> eval_passage (RegisteredPassage, variant=eval)
    -> measures_assessment (RegisteredAssessment)
    -> measures_eval_email_contract (RegisteredEvalEmailContract)
    -> resolving interstitial ≥ 4 seconds (emailContractResolving state)
    -> measures_phases_reveal (RegisteredPhaseReveal)
```

### Right branch

```
path_choice
    -> structure_passage (RegisteredPassage, variant=structure)
    -> structured_eval (RegisteredAssessment)
    -> measures_eval_email_contract (RegisteredEvalEmailContract)
    -> resolving interstitial ≥ 4 seconds
    -> measures_phases_reveal
```

### Converged branch

```
measures_phases_reveal
    -> about_measures_registry (RegisteredAbout)
    -> structural_drift_dispatches (RegisteredStructuralDrift)
    -> reserve_seat (RegisteredReserveSeat)
    -> phase_payment (RegisteredPhasePayment)
```

---

## 5. SURFACE TYPE — REGISTERED ONLY

New `RegisteredSurface` union type:

```typescript
type RegisteredSurface =
  | "intro"
  | "path_choice"
  | "eval_passage"
  | "connect_src"
  | "measures_assessment"
  | "structure_passage"
  | "structured_eval"
  | "measures_eval_email_contract"
  | "measures_phases_reveal"
  | "about_measures_registry"
  | "structural_drift_dispatches"
  | "reserve_seat"
  | "phase_payment"
  | "publication_dispatch"
```

Legacy `SurfaceState` entries NOT carried forward:

```
educational_diagnostic_passage (aliased via SURFACE_QUERY_ALIASES for backward-compat URLs)
educate_eval
structural_drift_dispatches (as old primary key — replaced by structural_drift_publication)
cohort_conversion
measures_ai_operational_evaluation
iis_eval_gate1
understand_failure
c3_field
foundation_offering
systems_offering
foundation_seat_hold
systems_seat_hold
registered_process_log
seat_hold_notification_review
publication_dispatch (now a RegisteredSurface instead of legacy SurfaceState)
```

---

## 6. DATA FETCH — REGISTERED ONLY

The new shell queries only registered encounter keys:

```typescript
const REGISTERED_ENCOUNTER_KEYS = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
  "eval_passage",
  "connect_src",
  "measures_assessment",
  "structure_passage",
  "structured_eval",
  "measures_phases_reveal",
  "about_measures_registry",
  "structural_drift_publication",
  "measures_eval_email_contract",
  "reserve_seat",
  "phase_payment",
]
```

No legacy section keys queried (`landing_root`, `cohort_conversion_encounter`, `educate_eval_encounter`, `understand_failure`, `c3_field`, `foundation_offering`, `systems_offering`, etc.).

Media roles queried: only registered roles relevant to the 13 encounters. No `hero_video`, `hero_image`, `explainer_video`, `c3_field_video`, `hero_poster`, `lapis_background` (superseded by `background`), etc.

---

## 7. RECOVERED LOGIC

From legacy runtime — recovered and included in `registeredRuntimeUtils.ts`:

- `asRecord`, `asString`, `asRecordArray`, `asStringArray`, `asActionArray`, `asRecordFromPaths`
- `allAssessmentMechanics`
- `selectedConditionTraces`
- `replaceTemplateTokens`
- `resolveEnvironmentalReport`
- `mediaUrl`, `cssTokenName`, `sectionCopy`
- `dispatchIssueLabel`, `dispatchTypeLabel`, `dispatchThesis`
- `publicationAssetUrl`, `youtubeEmbedUrl`, `markdownBlocks`, `cleanMarkdownText`

From legacy runtime — recovered in main orchestrator:

- Supabase section/media/token/offering/publication query logic
- History pushState/replaceState/popstate navigation
- Registry token/style derivation
- Assessment mechanics: `submitIisEvaluation`, `validateDiagnosticSection`, `requiredEvalIdentityFields`, `continueToDiagnostic`, `setEvalField`, `setEvalAnswerSelection`, `setEvalAnswerContext`
- `emailContractResolving` state — resolving interstitial ≥ 4 seconds after delivery submit
- `submitSeatHold` — seat hold API call
- `submitPublicationSubscription` — publication subscription capture
- Epigraph video play/mute/skip/error handlers
- Marble tone continuity audio
- Header render (Measures Registry branding only — no c3 Field nav, no Contact nav)
- System footer

---

## 8. REJECTED LEGACY LOGIC

Not carried forward into the new runtime:

| Legacy Element | Reason |
|---|---|
| `renderCohortConversionSurface` | Deprecated — not in registered 13 active flow |
| `renderEducateEvalSurface` | Not in registered 13 active flow |
| `renderUnderstandFailureSurface` | Not in registered 13 active flow |
| `renderC3FieldSurface` | Deprecated — not in registered 13 active flow |
| `renderOfferingSurface` (foundation/systems) | Deprecated — replaced by phase_payment in registered flow |
| `renderHoldSurface` (foundation/systems) | Deprecated — replaced by phase_payment |
| `renderEvaluationChamberSurface` (iis_eval_gate1 variant) | Deprecated — routed to systems_offering (non-registered) |
| `renderRegisteredProcessLogSurface` | Operator-only surface — not in registered 13 |
| `renderNotificationReviewSurface` | Operator-only surface — not in registered 13 |
| `operatorDispatchKey` state | Used only by notification review — not in registered 13 |
| `reviewRows`, `reviewError`, `reviewTransitioning`, `reviewDispatching` | Operator notification review — not in registered 13 |
| `connectSrcNextEncounter` state | Legacy pre-assessment gate routing — not in registered flow |
| `softSrcFields` state | Legacy soft SRC form — replaced by evalFields at email contract |
| `handleAction` generic dispatch | Replaced by direct `navigate()` calls per registered surface |
| `REQUIRED_SECTION_KEYS` (legacy keys) | Replaced by `REGISTERED_ENCOUNTER_KEYS` |
| `cohort_conversion_encounter`, `educate_eval_encounter`, etc. in DB query | Not queried |
| Global c3 Field / Contact header nav | Not rendered in registered header |

---

## 9. ASSESSMENT FLOW — CONFIRMED UNCHANGED

| Check | Status |
|---|---|
| evalStep initialized "diagnostic" | ✓ |
| No pre-assessment SRC capture | ✓ |
| measures_assessment opens at question 1 directly | ✓ |
| structured_eval opens at question 1 directly | ✓ |
| Assessment scoring unchanged | ✓ |
| Assessment questions unchanged | ✓ |
| No resolving interstitial before delivery capture | ✓ |
| emailContractResolving interstitial ≥ 4 seconds after delivery submit | ✓ |
| Route after interstitial: measures_phases_reveal | ✓ |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |

---

## 10. HEADER — REGISTERED BRANDING ONLY

The new `renderHeader` function renders Measures Registry branding only:

```tsx
<header className="registry-public-header">
  <div className="registry-public-brand">
    {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
    {title ? <span>{title}</span> : null}
  </div>
  <nav className="registry-public-nav" aria-label="Measures Registry navigation" />
</header>
```

No c3 Field nav rendered. No Contact nav rendered. No global parent-site links. Nav is populated only when encounter contract explicitly provides header actions (resolved from DB encounter metadata header field).

---

## 11. CONNECT_SRC STANDING

`connect_src` is retained in the registered 13 DB query and the surface dispatcher.

Not routed from active flow:
- No intro action routes to connect_src
- No path_choice action routes to connect_src
- No assessment surface routes to connect_src

Accessible via direct URL: `?surface=connect_src`

`RegisteredConnectSrc` renderer is present. On form submit, routes directly to `measures_assessment` (not as a pre-assessment gate — the connect_src form is a standalone DB-less identity form that passes fields to evalFields, then the submit handler navigates to measures_assessment where the assessment starts at question 1 with evalStep="diagnostic").

---

## 12. URL BACKWARD COMPATIBILITY

`SURFACE_QUERY_ALIASES` handles backward-compat URLs:

```typescript
const SURFACE_QUERY_ALIASES: Record<string, RegisteredSurface> = {
  landing_root: "intro",
  ai_isnt_broken_intro: "intro",
  landing_path_choice: "path_choice",
  evaluate_structure_path: "path_choice",
  educational_diagnostic_passage: "eval_passage",
  structural_drift_dispatches: "structural_drift_dispatches",
}
```

Old `?surface=landing_root` → `intro`. Old `?surface=educational_diagnostic_passage` → `eval_passage`.

Direct registered URLs confirmed supported:
- `?surface=measures_assessment` ✓
- `?surface=structured_eval` ✓
- `?surface=measures_eval_email_contract` ✓
- `?surface=phase_payment` ✓
- `?surface=connect_src` ✓

---

## 13. MEDIA ROLE CONSUMPTION

Registered media roles consumed from DB:

| Role | Usage |
|---|---|
| epigraph_video | intro epigraph video |
| left_hero_fracture | threshold left still image |
| left_hero_fracture_motion | threshold left motion video |
| right_measured_hero | threshold right still image |
| measured_hero_motion_graphic | threshold right motion video |
| path_choice_background | path choice section background |
| background / lapis_background | lapis background for assessment/reveal surfaces |
| watermark / registry_watermark | registry watermark in assessment chamber |
| registry_mark | registry mark in header |
| marble_accent_reference | about and reveal marble accent |
| evaluation_reference_image | assessment chamber reference image |
| structured_environment_passage_video / measures_structured_enviroments | structure_passage video |
| marble_tone / installation_tone_marble / installation_tone_marble_rise_return_v1 | audio continuity |

No `hero_video`, `hero_image`, `explainer_video`, `hero_poster`, `c3_field_video`, `hero_measured_image`, `foundation_intro_video`, `systems_intro_video` queried. Not needed in registered 13 flow.

---

## BUILD RESULT

```
npm run build:registry
✓ built in 4.46s
```

No TypeScript errors. Clean build.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/app/App.tsx` | Import switched to `registered_runtime/MeasuresRegistryRuntimeRegistered` |

## FILES CREATED

| File | Description |
|---|---|
| `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts` | RegisteredSurface type + DB row types |
| `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts` | Pure utility functions (recovered from legacy) |
| `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | Main registered runtime orchestrator |
| `src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx` | ai_isnt_broken_intro renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx` | evaluate_structure_path renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx` | eval_passage / structure_passage renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx` | measures_assessment / structured_eval renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx` | measures_eval_email_contract renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx` | measures_phases_reveal renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx` | about_measures_registry renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx` | structural_drift_publication + publication_dispatch renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredReserveSeat.tsx` | reserve_seat renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredPhasePayment.tsx` | phase_payment renderer |
| `src/measures_registry/registered_runtime/renderers/RegisteredConnectSrc.tsx` | connect_src renderer (held from active flow) |

## DB ROWS MODIFIED

None.

---

## READBACK

| Check | Result |
|---|---|
| New runtime file | `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` |
| Old runtime status | Retained at `src/measures_registry/MeasuresRegistryRuntime.tsx` — not deleted, not further patched |
| Runtime switch location | `src/app/App.tsx` line 3 — import path changed |
| Registered 13 dispatcher | All 13 encounter surfaces dispatched via `RegisteredSurface` type + clean surface dispatcher |
| Legacy surfaces removed from dispatcher | cohort_conversion, educate_eval, understand_failure, c3_field, foundation/systems offerings, iis_eval_gate1, registered_process_log, seat_hold_notification_review |
| Left branch | intro → path_choice → eval_passage → measures_assessment → measures_eval_email_contract → resolving ≥ 4s → measures_phases_reveal |
| Right branch | intro → path_choice → structure_passage → structured_eval → measures_eval_email_contract → resolving ≥ 4s → measures_phases_reveal |
| Converged branch | measures_phases_reveal → about → structural_drift → reserve_seat → phase_payment |
| Direct URL ?surface=measures_assessment | ✓ Opens at question 1 — no pre-capture, no resolving interstitial before delivery |
| Direct URL ?surface=structured_eval | ✓ Opens at question 1 — no pre-capture |
| Direct URL ?surface=measures_eval_email_contract | ✓ Opens delivery form |
| Direct URL ?surface=phase_payment | ✓ Opens seat hold form |
| Assessment start | question 1 directly — evalStep="diagnostic" |
| Post-final-question route | measures_eval_email_contract |
| Delivery submit interstitial | emailContractResolving=true → 4000ms → measures_phases_reveal |
| Media role consumption | registered roles only — no hero_video, explainer_video, c3_field_video |
| Header | Measures Registry branding only — no c3 Field nav, no Contact nav |
| connect_src | Retained in registered 13, held from active flow, direct-URL accessible |
| Build | ✓ clean 4.46s |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated route bleed | ✓ |
| Old runtime retained as legacy source only | ✓ |

---

## CONFIRMATION

| Condition | Status |
|---|---|
| Clean contract-native runtime shell exists | ✓ |
| Registered 13 public body rendered without legacy monolith | ✓ |
| Legacy runtime retained as recovery source only | ✓ |
| No legacy surfaces in registered dispatcher | ✓ |
| No precontract SRC capture | ✓ |
| No global c3 Field / Contact header | ✓ |
| No deprecated route dispatch | ✓ |
| No cohort/offering legacy flow exposed | ✓ |
| Assessment flow contract preserved | ✓ |
| emailContractResolving interstitial preserved | ✓ |
| Media roles bounded to registered roles only | ✓ |
| DB query bounded to registered encounter keys only | ✓ |
| No new DB tables | ✓ |
| No DB rows deleted | ✓ |
| No hardcoded media URLs | ✓ |
| No assessment scoring changes | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| Build clean | ✓ |

---

## PROCESS INTELLIGENCE

Seated per OAR2 request:

> If a runtime predates the registered contract body, repeated patch correction may create correction drift.
>
> After contracts are seated, the system must decide whether to refactor the legacy runtime or build a clean contract-native runtime shell and migrate only verified behavior.
>
> Legacy runtime recovery is allowed only while bounded. Repeated drift after contract seating requires clean-shell routing.

This OAR demonstrates the clean-shell routing pattern:

1. Legacy runtime frozen — not deleted, not further patched
2. New shell built from registered contract body, not from legacy structure
3. Only verified logic recovered — utility functions, assessment mechanics, navigation, media resolution
4. Legacy surfaces (cohort_conversion, educate_eval, understand_failure, c3_field, foundation/systems offerings, operator surfaces) not carried forward
5. Bounded renderer units per encounter — each renderer isolated to its specific encounter contract

---

## CLOSEOUT

Clean contract-native Measures Registry runtime shell built and deployed.

New shell:

```
src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
src/measures_registry/registered_runtime/registeredRuntimeUtils.ts
src/measures_registry/registered_runtime/renderers/ (11 renderer files)
```

Legacy runtime retained at `src/measures_registry/MeasuresRegistryRuntime.tsx` as recovery source only.

Route entry in `App.tsx` switched to the new registered shell.

The registered public flow no longer runs through the precontract monolithic runtime structure.

Build is clean. Registered runtime is ready for visual QA.

OAR1 ready for operator review.
