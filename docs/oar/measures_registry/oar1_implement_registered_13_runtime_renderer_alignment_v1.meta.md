---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_implementation
title: OAR1 — Implement Registered 13 Runtime Renderer Alignment
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_implement_registered_13_runtime_renderer_alignment_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - renderer-implementation
  - registered-runtime
  - encounter-contracts
  - codex-first
---

# OAR1 — Implement Registered 13 Runtime Renderer Alignment

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_implement_registered_13_runtime_renderer_alignment_v1.meta.md`

Align Measures Registry frontend runtime to the registered 13 encounter architecture. Implement new contracted renderer surfaces. Preserve existing contracted renderers. No DB state changes. No assessment scoring fork. No CSS edits. No hardcoded copy.

---

## EXECUTE PACKAGE

| File | Role |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Frontend runtime — surface states, routing, render functions |
| `docs/oar/measures_registry/execute-implement-registered-13-runtime-renderer-alignment-v1.cjs` | Prerequisite verification script — reads DB state, no writes |

---

## BUILD RESULT

```
npm run build:registry → ✓ built in 4.39s (clean, no TypeScript errors)
```

---

## PREREQUISITE VERIFICATION

All checks from execute script:

| Check | Result |
|---|---|
| DB connection | ok |
| registered_13_present | ok (13 of 13 found) |
| all_contracted | ok |
| all_sitewide_bound | ok |
| stub_renderers_assigned | ok (5 of 5) |
| structured_eval_no_fork | ok (fork_status: not_forked) |
| about_approved_content | ok (approved_content_contract seated) |
| email_excludes_phase_reveal | ok |

---

## DB STATE CHANGE

None. This OAR was frontend-only. `measures_encounter_def` was read for verification. No rows updated, inserted, or deleted.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Runtime alignment — see below |

---

## RUNTIME CHANGES

### Constants Added

```typescript
const REGISTERED_ENCOUNTER_KEYS = [
  "ai_isnt_broken_intro", "evaluate_structure_path", "eval_passage",
  "connect_src", "measures_assessment", "structural_drift_publication",
  "phase_payment", "structure_passage", "structured_eval",
  "measures_phases_reveal", "about_measures_registry", "measures_eval_email_contract",
] as const

const REGISTERED_KEY_TO_SURFACE: Partial<Record<string, SurfaceState>> = {
  ai_isnt_broken_intro: "intro",
  evaluate_structure_path: "path_choice",
  eval_passage: "educational_diagnostic_passage",
  structural_drift_publication: "structural_drift_dispatches",
  reserve_seat: "reserve_seat",
}
```

### SurfaceState Extended

7 new states added:

```typescript
| "connect_src"
| "measures_assessment"
| "structure_passage"
| "structured_eval"
| "measures_phases_reveal"
| "about_measures_registry"
| "measures_eval_email_contract"
```

### SURFACE_QUERY Extended

7 new entries mapped to encounter keys of the same name.

### surfaceFromEncounterKey Updated

Extended to check `REGISTERED_KEY_TO_SURFACE` as fallback after direct SURFACE_QUERY match. Enables generic `handleAction` routing to resolve registered encounter key targets automatically.

### Section Query Extended

`measures_encounter_def` section fetch now includes `[...QUERY_SECTION_KEYS, ...REGISTERED_ENCOUNTER_KEYS]`. Active registered rows (`is_active: true`) returned by anon key. Inactive stub rows (`is_active: false`) queried but empty due to RLS — handled gracefully.

### Section Copy Lookups Updated

Legacy lookups now prefer registered keys with fallback:

| Copy variable | Registered key (primary) | Legacy key (fallback) |
|---|---|---|
| `landingRootCopy` | `ai_isnt_broken_intro` | `landing_root` |
| `educationalDiagnosticPassageCopy` | `eval_passage` | `educational_diagnostic_passage` |
| `pathChoiceCopy` | `evaluate_structure_path` | `landing_path_choice` |
| `evaluationChamberCopy` | `measures_assessment` | `measures_ai_operational_evaluation` |
| `structuralDriftDispatchesCopy` | `structural_drift_publication` | `structural_drift_dispatches` |

### State Added

```typescript
const [connectSrcNextEncounter, setConnectSrcNextEncounter] = useState<"measures_assessment" | "structured_eval">("measures_assessment")
```

Tracks which encounter follows `connect_src` based on which path the user entered from.

### Eval Passage Navigation Updated

`renderEducationalDiagnosticPassageSurface` now routes to `connect_src` (with `connectSrcNextEncounter = "measures_assessment"`) when `connect_src` is present in `sectionMap`. Falls back to `iis_eval_gate1` if absent (backward compat).

### activeEvaluationEncounterKey Extended

Now resolves to `"measures_ai_operational_evaluation"` for `activeSurface === "measures_assessment"` and `activeSurface === "structured_eval"`, ensuring `requiredEvalIdentityFields` and validation functions work correctly for both new surfaces.

---

## NEW RENDERER FUNCTIONS (7)

| Function | Encounter | Renderer contract |
|---|---|---|
| `renderConnectSrcSurface` | `connect_src` | `static_authority_surface` — institutional SRC intake |
| `renderStructurePassageSurface` | `structure_passage` | `diagnostic_explainer_passage` — structure orientation passage |
| `renderMeasuresAssessmentSurface` | `measures_assessment` | `measures_registry_evaluation_chamber` — routes to `measures_phases_reveal` |
| `renderStructuredEvalSurface` | `structured_eval` | `measures_registry_evaluation_chamber` — shared mechanics, routes to `measures_phases_reveal` |
| `renderMeasuresPhasesRevealSurface` | `measures_phases_reveal` | `measures_phases_reveal` — marble/lapis convergence |
| `renderAboutMeasuresRegistrySurface` | `about_measures_registry` | `about_measures_registry` — institutional authority, approved content |
| `renderMeasuresEvalEmailContractSurface` | `measures_eval_email_contract` | `measures_eval_email_contract` — assessment package delivery |

---

## REUSED RENDERER PATHS

| Encounter | Renderer | Reuse pattern |
|---|---|---|
| `structure_passage` | `diagnostic_explainer_passage` | Mirrors `eval_passage` render pattern |
| `measures_assessment` | `measures_registry_evaluation_chamber` | Shared `MeasuresAssessmentChamber` component |
| `structured_eval` | `measures_registry_evaluation_chamber` | Shared `MeasuresAssessmentChamber` — mechanics from `evaluationChamberCopy` as fallback |

---

## TRANSITION ROUTING

Registered runtime sequence implemented:

```
ai_isnt_broken_intro
    ↓
evaluate_structure_path
    ├─ eval_passage
    │      ↓ (connect_src present)
    │   connect_src [connectSrcNextEncounter = "measures_assessment"]
    │      ↓
    │   measures_assessment → measures_phases_reveal
    │
    └─ structure_passage
           ↓
        connect_src [connectSrcNextEncounter = "structured_eval"]
           ↓
        structured_eval → measures_phases_reveal

measures_phases_reveal
    ↓
about_measures_registry
    ↓
structural_drift_dispatches (structural_drift_publication)
    ↓ (evalReport present)
measures_eval_email_contract
    ↓
reserve_seat
    ↓
phase_payment (via offering → hold surface)
```

### Post-assessment routing update

For `renderMeasuresAssessmentSurface` and `renderStructuredEvalSurface`:
- `onEnterStructuredEnvironment` → `navigateSurface("measures_phases_reveal")`
- `onStructuredEnvironmentVideoEnded` → `navigateSurface("measures_phases_reveal")`

Legacy surfaces (`measures_ai_operational_evaluation`, `iis_eval_gate1`) keep existing routing to `systems_offering` for backward compat.

---

## LEGACY ALIASES RETAINED

Deprecated encounter keys reachable via legacy surface states but not exposed as active registered routes:

| Legacy surface | Encounter key | Status |
|---|---|---|
| `educate_eval` | `educate_eval_encounter` | Retained, not in registered 13 |
| `cohort_conversion` | `cohort_conversion_encounter` | Retained, not in registered 13 |
| `iis_eval_gate1` | `iis_eval_gate1` | Retained, not in registered 13 |
| `understand_failure` | `understand_failure` | Retained, not in registered 13 |
| `c3_field` | `c3_field` | Retained, not in registered 13 |
| `foundation_offering` | `foundation_offering` | Retained, not in registered 13 |
| `systems_offering` | `systems_offering` | Retained, not in registered 13 |
| `foundation_seat_hold` | `foundation_seat_hold` | Retained, not in registered 13 |
| `systems_seat_hold` | `systems_seat_hold` | Retained, not in registered 13 |

---

## CONTENT AUTHORITY

All new renderer functions read from seated metadata:

| Encounter | Copy source |
|---|---|
| `about_measures_registry` | `metadata.approved_content_contract` (eyebrow, title, subtitle, primary_statement, support_points, cta_label) |
| `structure_passage` | `metadata.approved_copy_pending_contract` (eyebrow, title, subtitle) with `sectionCopy()` fallback |
| `measures_eval_email_contract` | `metadata.email_delivery_contract.email_structure` (subject, preheader) |
| All others | `sectionCopy()` from registered encounter row |

`frontend_hardcode_allowed: false` honored. No semantic copy hardcoded in JSX.

---

## VALIDATION CONFIRMATIONS

| Check | Result |
|---|---|
| DB state changed | No |
| Assessment scoring fork introduced | No |
| Email dispatch implemented | No |
| Phase reveal included in email package | No |
| Copy hardcoded in JSX | No |
| CSS files modified | No |
| Renderer files outside MeasuresRegistryRuntime.tsx modified | No |
| Build result | ✓ clean |
| TypeScript errors | None |

---

## VALIDATION QUERY

```sql
-- All 13 registered encounters: contract standing and renderer
select
  encounter_key,
  is_active,
  metadata->>'contract_status' as contract_status,
  metadata->>'renderer' as renderer,
  metadata->'source_sitewide_contract'->>'document_key' as sitewide_contract,
  (metadata ? 'transition_contract') as has_transition,
  (metadata ? 'encounter_isolation_contract') as has_isolation
from public.measures_encounter_def
where encounter_key in (
  'ai_isnt_broken_intro', 'evaluate_structure_path', 'eval_passage', 'connect_src',
  'measures_assessment', 'structure_passage', 'structured_eval', 'measures_phases_reveal',
  'about_measures_registry', 'structural_drift_publication', 'measures_eval_email_contract',
  'reserve_seat', 'phase_payment'
)
order by encounter_key;

-- structured_eval fork guard
select
  encounter_key,
  metadata->'shared_assessment_mechanics_contract'->>'fork_status' as fork_status,
  metadata->'shared_assessment_mechanics_contract'->>'fork_authorization' as fork_authorization
from public.measures_encounter_def
where encounter_key = 'structured_eval';

-- about_measures_registry content authority
select
  encounter_key,
  metadata->'approved_content_contract'->>'eyebrow' as eyebrow,
  metadata->'approved_content_contract'->>'title' as title,
  metadata->'approved_content_contract'->>'cta_label' as cta_label,
  (metadata->'approved_content_contract' ? 'support_points') as has_support_points
from public.measures_encounter_def
where encounter_key = 'about_measures_registry';
```

---

## READBACK (from execute script)

```
db_connection: ok
registered_13_present: true
all_contracted: true
all_sitewide_bound: true
db_state_changed: false
assessment_scoring_fork: false
email_dispatch_implemented: false
phase_reveal_in_email: false
copy_in_jsx_hardcode: false
build_result: "success — npm run build:registry clean"
```

All 13 readback rows: `contract_status: "contracted"`, `source_sitewide_contract: "measures_registry_sitewide_style_contract"`, `has_transition_contract: true`, `has_encounter_isolation: true`.

---

## CLOSEOUT

The Measures Registry frontend runtime resolves the registered 13 encounter architecture from seated Codex contracts. Seven new surface renderer functions implemented. All 5 previously stubbed encounters now have renderer support. Registered key preferences established throughout section query and copy resolution. Legacy surfaces retained as aliases. Build clean. DB unchanged.

OAR1 ready for operator review.
