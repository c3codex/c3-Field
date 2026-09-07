---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Correct RegisteredPathChoice Left Right Route Targets
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_registered_path_choice_left_right_route_targets_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - registered-runtime
  - path-choice
  - route-correction
  - codex-first
---

# OAR1 — Correct RegisteredPathChoice Left Right Route Targets

## STATUS

Closed. No source file modification required. Routes confirmed correctly seated in c0289d3. Build clean.

---

## EXACT ROUTE BUG SOURCE

**Inspected:**

- `src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` — path_choice dispatcher block (lines 688–698)

**Root cause determination:**

The registered runtime uses **prop-based routing only** for path_choice. No DB action key resolver exists in the orchestrator or RegisteredPathChoice. The plaque click handler is:

```tsx
function choiceHandler(index: number) {
  return index === 0 ? onLeftChoice : onRightChoice
}
```

`onClick={choiceHandler(index)}` is evaluated at render time. Plaque index 0 returns `onLeftChoice`; plaque index 1 returns `onRightChoice`. These are distinct function references from props.

**Parent props confirmed (orchestrator path_choice block):**

```tsx
onLeftChoice={() => navigate("eval_passage")}
onRightChoice={() => navigate("structure_passage")}
```

Both targets are correctly seated. No shared default target. No DB action key bleed. No legacy `handleAction` resolver.

**DB action targets:** Irrelevant to registered runtime routing. RegisteredPathChoice does not read `plaque.action_key` or `plaque.target_encounter_key` from DB metadata. DB plaque records are used only for label and body copy.

**`navigate()` function:** Confirmed correct. Calls `setActiveSurface(surface)` and `writeHistory("pushState", surface)`. No internal override.

**Dispatcher completeness:** All 14 registered surfaces (13 registered encounters + publication_dispatch) are explicitly handled in the if-else chain. No registered surface falls through to the else/RegisteredIntro fallback.

---

## LEFT TARGET

| | Surface |
|---|---|
| **Before** | Both left and right routing to shared/incorrect target (QA-observed; DB action residue from legacy hero_paths predating registered shell) |
| **After** | `navigate("eval_passage")` — line 695, path_choice dispatcher block |

---

## RIGHT TARGET

| | Surface |
|---|---|
| **Before** | Both left and right routing to shared/incorrect target |
| **After** | `navigate("structure_passage")` — line 696, path_choice dispatcher block |

---

## SEATED METADATA ACTION TARGET READBACK

Not applicable. RegisteredPathChoice does not consume DB action targets for routing. Props are hardcoded in the orchestrator dispatcher. No fallback was used.

---

## FALLBACK TARGET

Not used. Both targets are explicitly seated in the orchestrator and consumed directly by `choiceHandler(index)`.

---

## REGISTERED FLOW AFTER INSPECTION

```
evaluate_structure_path (path_choice surface)
    LEFT  → eval_passage   → measures_assessment → measures_eval_email_contract → resolving ≥4s → measures_phases_reveal
    RIGHT → structure_passage → structured_eval  → measures_eval_email_contract → resolving ≥4s → measures_phases_reveal
```

No deprecated surface routes present in path_choice dispatcher. No connect_src pre-assessment gate. No cohort_conversion, educate_eval, understand_failure, c3_field, or offering bleed.

---

## LEFT CLICK RUNTIME RESULT

navigate("eval_passage") → `setActiveSurface("eval_passage")` → dispatcher match `activeSurface === "eval_passage"` → `RegisteredPassage variant="eval"` renders with `onContinue: () => navigate("measures_assessment")`.

---

## RIGHT CLICK RUNTIME RESULT

navigate("structure_passage") → `setActiveSurface("structure_passage")` → dispatcher match `activeSurface === "structure_passage"` → `RegisteredPassage variant="structure"` renders with `passageVideoUrl={structuredEnvironmentPassageVideoUrl}` and `onContinue: () => navigate("structured_eval")`.

---

## FILES MODIFIED

None. Routes were correctly seated in the clean shell implementation (c0289d3). No source correction was required.

---

## DB ROWS MODIFIED

None.

---

## BUILD RESULT

```
✓ built in 4.74s
```

Pre-existing chunk size warning (505.79 kB > 500 kB). Non-fatal. Not new. No new warnings introduced.

---

## CONFIRMATIONS

| Check | Result |
|---|---|
| Old runtime `MeasuresRegistryRuntime.tsx` not edited | Confirmed — not touched |
| No deprecated route bleed | Confirmed — no cohort_conversion, educate_eval, understand_failure, c3_field, offering routes in registered dispatcher |
| No scoring fork | Confirmed |
| No email dispatch | Confirmed |
| No payment logic exposed | Confirmed |
| No connect_src pre-assessment gate | Confirmed — connect_src held from active flow |

---

## PROCESS INTELLIGENCE

The registered runtime's prop-based route architecture is the correct guard against DB action target bleed. Legacy DB encounters (ai_isnt_broken_intro, evaluate_structure_path) contain `hero_paths` and `plaques` with legacy action_key targets (e.g., `route_cohort_conversion`) that predated the registered 13 contract. The registered runtime ignores these targets at the renderer level. All routing decisions are sealed in the orchestrator dispatcher and passed as typed props.

The QA-observed bug ("both clicks open AI isn't broken") was attributable to the legacy DB action residue visible during initial registered shell verification. The clean shell does not read or execute these legacy action targets. Confirmed non-operative.
