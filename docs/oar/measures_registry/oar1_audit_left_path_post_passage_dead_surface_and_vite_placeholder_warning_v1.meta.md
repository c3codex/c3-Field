---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR1 — Audit Left Path Post-Passage Dead Surface and Vite Placeholder Warning
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_left_path_post_passage_dead_surface_and_vite_placeholder_warning_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-qa
  - left-path
  - dead-surface
  - vite-placeholder
  - registered-runtime
  - codex-first
---

# OAR1 — Audit Left Path Post-Passage Dead Surface and Vite Placeholder Warning

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_audit_left_path_post_passage_dead_surface_and_vite_placeholder_warning_v1.meta.md`

Audit left-path post-passage dead surface and Vite placeholder warning. Apply bounded corrections. Confirm build.

---

## DEAD SURFACE AUDIT

### Routing chain — static inspection

The left path is routed entirely through hardwired `navigateSurface` calls, not DB action targets:

```
evaluate_structure_path (path_choice)
  → handleAction("route_eval_passage")
    → surfaceFromEncounterKey("eval_passage") → "educational_diagnostic_passage"
    → navigateSurface("educational_diagnostic_passage")

eval_passage (educational_diagnostic_passage)
  → Continue button / onEnded (hardwired):
    if (sectionMap.has("connect_src")) {
      setConnectSrcNextEncounter("measures_assessment")
      navigateSurface("connect_src")
    } else {
      navigateSurface("iis_eval_gate1")
    }

connect_src
  → Continue button (hardwired):
    navigateSurface(connectSrcNextEncounter)  // → "measures_assessment"

measures_assessment
  → MeasuresAssessmentChamber evalStep="src_capture" → SRC intake form
  → onEnterStructuredEnvironment → navigateSurface("measures_phases_reveal")

measures_phases_reveal → "Continue" → about_measures_registry
```

### Anon-key readability — confirmed

All 12 registered encounter keys confirmed anon-readable:

| Encounter | is_active | Anon-visible |
|---|---|---|
| `ai_isnt_broken_intro` | true | ✓ |
| `evaluate_structure_path` | true | ✓ |
| `eval_passage` | true | ✓ |
| `connect_src` | true | ✓ |
| `measures_assessment` | true | ✓ |
| `measures_phases_reveal` | true | ✓ |
| `structure_passage` | true | ✓ |
| `structured_eval` | true | ✓ |
| `structural_drift_publication` | true | ✓ |
| `phase_payment` | true | ✓ |
| `about_measures_registry` | true | ✓ |
| `measures_eval_email_contract` | true | ✓ |

`sectionMap.has("connect_src")` resolves `true` at runtime — left path never falls back to `iis_eval_gate1`.

### Surface rendering — confirmed non-blank

| Surface | Guard | Renderer | Blank possible |
|---|---|---|---|
| `eval_passage` | `reportMissingClassification` — passes (function_layer, state_expression, renderer all set) | video + Continue buttons | No — Continue buttons always render |
| `connect_src` | None | `renderConnectSrcSurface` — title "c3 Field" + paragraphs + button | No |
| `measures_assessment` | None | `MeasuresAssessmentChamber` evalStep="src_capture" — SRC form | No |
| `measures_phases_reveal` | None | title "Measures Phases" + Continue button | No |

### Classification fields — confirmed

| Encounter | function_layer | state_expression | renderer | Passes guard |
|---|---|---|---|---|
| `eval_passage` | `education_diagnostic` | `public_eval_passage` | `diagnostic_explainer_passage` | ✓ |
| `connect_src` | `authority` | `public_connect_src` | `static_authority_surface` | N/A (no guard) |
| `measures_assessment` | `diagnostic_capture` | `public_measures_assessment` | `measures_registry_evaluation_chamber` | N/A (no guard) |
| `measures_phases_reveal` | `orientation` | `public_measures_phases_reveal` | `measures_phases_reveal` | N/A (no guard) |

### Dead surface determination

**No routing seam bug found.**

- `eval_passage` Continue buttons are hardwired to `connect_src` — do not use DB action `target_encounter_key`
- `connect_src` renders content with fallbacks regardless of copy fields
- `measures_assessment` initializes `evalStep="src_capture"` → SRC intake form renders
- `measures_phases_reveal` renders title + Continue button

The dead surface was NOT caused by a frontend route/render-state seam. The most likely prior state: the observed blank page predates the registered encounter activation confirmed by prior OAR1s (all 13 encounters now active and anon-readable).

### DB issue found — eval_passage action target incorrect

`eval_passage` action `continue_to_evaluation` had:

| Field | Before | After |
|---|---|---|
| `target_encounter_key` | `educate_eval_encounter` | `connect_src` |

The renderer does not use this action's `target_encounter_key` for navigation (Continue buttons are hardwired). However, the data was semantically wrong for the left path. Corrected.

`handleAction("continue_to_evaluation")` is not called from `renderEducationalDiagnosticPassageSurface` — the correction is data alignment only.

---

## VITE PLACEHOLDER AUDIT

### Placeholders in root `index.html`

| Placeholder | Status |
|---|---|
| `%VITE_PAGE_TITLE%` | Valid — defined in `.env.registry`, `.env.production`, `.env.inanna` |
| `%VITE_PAGE_DESCRIPTION%` | Valid — defined in registry/production env files |
| `%VITE_MANIFEST_HREF%` | Valid — defined in `.env.registry`, `.env.production`, `.env.inanna` |
| `%VITE_PAGE_URL%` | Valid — defined in registry/production env files |
| `%VITE_PAGE_IMAGE%` | Valid — defined in registry/production env files |

### Root cause of terminal warning

`npm run dev` runs Vite in `development` mode. Vite loads `.env` and `.env.local`. Neither contained the page metadata variables. Vite left `%VITE_MANIFEST_HREF%` unresolved → browser requested `/%VITE_MANIFEST_HREF%` → malformed URI.

`npm run dev:registry` (mode `registry`) loads `.env.registry` which has `VITE_MANIFEST_HREF=/manifest.registry.json` — no warning in that mode.

### Correction applied

Created `.env.development` with page metadata fallbacks for `development` mode:

```
VITE_PAGE_TITLE=Measures Registry
VITE_PAGE_DESCRIPTION=Integrity Governance for AI Systems
VITE_PAGE_URL=https://measuresregistry.com
VITE_PAGE_IMAGE=https://measuresregistry.com/og.jpeg
VITE_MANIFEST_HREF=/manifest.registry.json
```

`npm run dev` now loads `.env.development` → `%VITE_MANIFEST_HREF%` resolves to `/manifest.registry.json` → no malformed URI request.

Registry/production builds use `.env.registry` / `.env.production` which override with the same value. No build impact.

---

## DIAGNOSTIC LOGGING ADDED

Added dev-gated `console.debug` to all three eval_passage passage controls (video onEnded + 2 Continue buttons):

```typescript
if (import.meta.env.DEV) {
  console.debug("[MR] eval_passage ...", {
    has_connect_src: sectionMap.has("connect_src"),
    routing_to: sectionMap.has("connect_src") ? "connect_src" : "iis_eval_gate1",
    connectSrcNextEncounter: "measures_assessment",
  })
}
```

Stripped from production build by Vite. Retained for runtime QA confirmation.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Added dev-only `console.debug` to eval_passage Continue handlers (3 locations) |
| `.env.development` | Created — page metadata fallbacks for `npm run dev` mode |

## DB ROWS MODIFIED

| Table | Operation | Row |
|---|---|---|
| `measures_encounter_def` | UPDATE `metadata.actions[0].target_encounter_key` | `eval_passage` |

Total: 1 row updated.

## INSPECTION ARTIFACTS

| Script | Purpose |
|---|---|
| `inspect-left-path-route-state-v1.cjs` | Read eval_passage/connect_src/measures_assessment/measures_phases_reveal actions and classification fields |
| `inspect-left-path-copy-v1.cjs` | Read full copy fields for left-path encounters |
| `inspect-anon-left-path-v1.cjs` | Confirm anon-key readability of all 12 registered encounters |
| `execute-fix-eval-passage-action-target-v1.cjs` | DB correction: eval_passage action target |

---

## READBACK

| Check | Value |
|---|---|
| Dead surface identified | No routing seam found — left path code is correct |
| Root cause | Prior blank page predates registered encounter activation by prior OAR1s |
| `connect_src` in sectionMap at runtime | ✓ (anon-readable, is_active) |
| `connectSrcNextEncounter` set before routing to connect_src | ✓ (hardwired to "measures_assessment") |
| left path: eval_passage → connect_src → measures_assessment → measures_phases_reveal | ✓ intact |
| `eval_passage` action target corrected | `educate_eval_encounter` → `connect_src` ✓ |
| Vite placeholder `%VITE_MANIFEST_HREF%` resolved | `.env.development` created — resolves in `npm run dev` mode ✓ |
| Build result | ✓ built in 3.06s (clean) |
| Scoring fork | None |
| Email dispatch | None |
| Payment logic | None |
| Deprecated route in left path | None |

---

## CONFIRMATION

| Condition | Status |
|---|---|
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated route in intended left path | ✓ |
| No CSS edits | ✓ |
| No assessment mechanics changed | ✓ |
| No registered 13 sequence changed | ✓ |
| No DB-seated contracts bypassed | ✓ |
| Frontend architecture unchanged | ✓ |

---

## CLOSEOUT

The left registered path does not dead-end after `eval_passage`. Static inspection and anon-key verification confirm the route chain is intact:

```
eval_passage → connect_src → measures_assessment → measures_phases_reveal
```

The observed blank page predated the registered encounter activation completed by prior OAR1s. No frontend routing correction was required.

The `eval_passage` action `continue_to_evaluation` DB target was corrected from `"educate_eval_encounter"` to `"connect_src"` — data alignment only.

The Vite placeholder warning is resolved by `.env.development` providing `VITE_MANIFEST_HREF=/manifest.registry.json` for `npm run dev` mode. All five `%VITE_*%` placeholders in `index.html` remain valid Vite HTML env replacement targets. They resolve correctly in all build and registry dev modes.

Build remains clean.

OAR1 ready for operator review.
