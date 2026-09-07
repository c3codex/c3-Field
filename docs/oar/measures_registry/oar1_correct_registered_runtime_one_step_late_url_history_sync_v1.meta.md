---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Correct Registered Runtime One-Step-Late URL History Sync
status: executor_complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_registered_runtime_one_step_late_url_history_sync_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - registered-runtime
  - url-sync
  - history-state
  - clean-shell
  - codex-first
---

# OAR1 — Correct Registered Runtime One-Step-Late URL History Sync

## EXECUTION RECORD

### URL sync bug source

Two compounding issues in the original navigation code:

**Issue 1 — stale closure in URL sync useEffect.**
The `useEffect([])` ran once on mount and captured `activeSurface` from the initial render in its closure. If `writeHistory("replaceState", activeSurface)` was called via this effect after a navigate had already pushed a new URL, the closure value would be stale. Because the deps were `[]`, the effect did not re-run on surface changes — making this a latent correctness risk rather than the primary cause.

**Issue 2 — `navigationSourceRef` guard silently suppressing URL writes.**
`navigate` called `writeHistory("pushState", surface)` conditionally:
```ts
if (navigationSourceRef.current === "app") writeHistory("pushState", surface)
```
The ref was reset to "app" via `window.setTimeout(() => { navigationSourceRef.current = "app" }, 0)` inside the popstate handler — an async reset with no guaranteed timing relative to subsequent user interactions. If any navigation call occurred while the ref was still "history" (e.g., rapid interaction after browser back, or environment where setTimeout 0 is delayed), the `writeHistory` call would be silently skipped while `setActiveSurface` still ran — advancing the visible surface without updating the URL. On the next navigation, the URL would write the current surface (which is now one step behind). This produces the systematic one-step-late pattern.

### Old navigate/writeHistory behavior

```ts
// historyUrl and writeHistory defined inside component body
// navigate: conditionally wrote URL before state update
function navigate(surface: RegisteredSurface) {
  if (navigationSourceRef.current === "app") writeHistory("pushState", surface)
  setActiveSurface(surface)
}

// useEffect([]) — ran once on mount — included initial URL sync + popstate listener
useEffect(() => {
  const currentState = window.history.state
  if (currentState?.source !== HISTORY_SOURCE || currentState.surface !== activeSurface) {
    writeHistory("replaceState", activeSurface)  // stale closure on activeSurface
  }
  function handlePopState(event) {
    // ...
    navigationSourceRef.current = "history"
    setActiveSurface(event.state.surface)
    window.setTimeout(() => { navigationSourceRef.current = "app" }, 0)  // async reset — race condition
  }
  window.addEventListener("popstate", handlePopState)
  return () => window.removeEventListener("popstate", handlePopState)
}, [])
```

### New navigate/writeHistory behavior

`historyUrl` and `writeHistory` moved to module scope (no component state captured — no stale closure possible).

`navigate` is now purely state-based:
```ts
function navigate(surface: RegisteredSurface) {
  navigationSourceRef.current = "app"
  setActiveSurface(surface)
}
```

URL sync moved to `useEffect([activeSurface])` — runs after every surface change, always with current state:
```ts
useEffect(() => {
  if (navigationSourceRef.current === "history") {
    // Popstate: browser already updated URL; reset ref and return
    navigationSourceRef.current = "app"
    return
  }
  const state = window.history.state
  if (state?.source === HISTORY_SOURCE && state.surface === activeSurface) return
  const method = state?.source === HISTORY_SOURCE ? "pushState" : "replaceState"
  writeHistory(method, activeSurface)
}, [activeSurface])
```

Popstate listener isolated to its own `useEffect([])`:
```ts
useEffect(() => {
  function handlePopState(event) {
    if (event.state?.source !== HISTORY_SOURCE || !event.state.surface) return
    navigationSourceRef.current = "history"
    setActiveSurface(event.state.surface)
    // No setTimeout — ref reset happens in the activeSurface effect after render
  }
  window.addEventListener("popstate", handlePopState)
  return () => window.removeEventListener("popstate", handlePopState)
}, [])
```

The ref is now reset synchronously inside the URL sync effect after each render, eliminating the setTimeout race condition entirely.

### Surface-to-query serialization map

```
intro                          -> ai_isnt_broken_intro
path_choice                    -> evaluate_structure_path
eval_passage                   -> eval_passage
structure_passage              -> structure_passage
connect_src                    -> connect_src
measures_assessment            -> measures_assessment
structured_eval                -> structured_eval
measures_eval_email_contract   -> measures_eval_email_contract
measures_phases_reveal         -> measures_phases_reveal
about_measures_registry        -> about_measures_registry
structural_drift_dispatches    -> structural_drift_publication
reserve_seat                   -> reserve_seat
phase_payment                  -> phase_payment
publication_dispatch           -> publication_dispatch
```

### Inbound alias map retained

```
landing_root                   -> intro
ai_isnt_broken_intro           -> intro
landing_path_choice            -> path_choice
evaluate_structure_path        -> path_choice
educational_diagnostic_passage -> eval_passage
structural_drift_dispatches    -> structural_drift_dispatches
```

### Intro threshold routing correction

Operator inspection identified a compounding issue: both `onLeftChoice` and `onRightChoice` in the `RegisteredIntro` dispatcher were wired to `navigate("path_choice")` regardless of which side was clicked.

This produced a redundant double path-choice sequence:

    intro threshold cards (left / right visual)
        -> path_choice surface (RegisteredPathChoice — a second left/right choice screen)
        -> eval_passage / structure_passage

The intro already presents and captures directional intent. The intermediate `path_choice` surface added an extra navigation stop and an extra history entry without conveying new information.

**Before:**
```ts
onLeftChoice={() => navigate("path_choice")}
onRightChoice={() => navigate("path_choice")}
```

**After:**
```ts
onLeftChoice={() => navigate("eval_passage")}
onRightChoice={() => navigate("structure_passage")}
```

The `path_choice` surface remains registered and responds to `?surface=evaluate_structure_path` as a direct-link entry point. It is no longer part of the forward flow from intro.

Corrected forward flow:

    intro (left) -> eval_passage -> measures_assessment -> connect_src -> measures_eval_email_contract -> measures_phases_reveal
    intro (right) -> structure_passage -> structured_eval -> connect_src -> measures_eval_email_contract -> measures_phases_reveal

### Files modified

- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
  — `historyUrl` and `writeHistory` moved from component body to module scope
  — `navigate` simplified: sets ref to "app", calls setActiveSurface only
  — `useEffect([])` split into two: url-sync effect on `[activeSurface]`, popstate listener on `[]`
  — `window.setTimeout` reset of navigationSourceRef removed; ref now reset in activeSurface effect
  — Intro `onLeftChoice` → `navigate("eval_passage")` (was `navigate("path_choice")`)
  — Intro `onRightChoice` → `navigate("structure_passage")` (was `navigate("path_choice")`)

### DB rows modified

None.

### Renderer / content changes

None.

### Scoring / contact / email contract changes

None.

### Build result

npm run build:registry: clean — 104 modules, no TS errors.

## CONFIRMATIONS

- Old runtime (src/measures_registry/MeasuresRegistryRuntime.tsx): NOT edited
- DB rows: NOT modified
- Renderer copy: NOT changed
- Path-choice content: NOT changed
- Assessment questions: NOT changed
- Assessment scoring: NOT changed
- Contact capture behavior: NOT changed
- Email contract behavior: NOT changed
- Email dispatch: NOT implemented
- Payment logic: NOT exposed
- Media URLs: NOT hardcoded

## BROWSER QA

Required by OAR2 §6. To be performed by operator.

Expected URL behavior after fix:

| Visible surface | Expected URL query |
|---|---|
| intro video / threshold cards | ?surface=ai_isnt_broken_intro |
| eval passage (left choice from intro) | ?surface=eval_passage |
| structure passage (right choice from intro) | ?surface=structure_passage |
| measures_assessment | ?surface=measures_assessment |
| structured_eval | ?surface=structured_eval |
| connect_src | ?surface=connect_src |
| measures_eval_email_contract | ?surface=measures_eval_email_contract |
| measures_phases_reveal | ?surface=measures_phases_reveal |

`path_choice` (`?surface=evaluate_structure_path`) is accessible as a direct link only — not reachable via the forward flow from intro.

No surface may display while URL points to the previous surface.

Browser back/forward should restore the correct surface and URL without creating duplicate history entries.

## SUCCESS CONDITION MET

URL sync bug source identified and removed.

`navigate` is now state-only — no conditional URL write.

URL writes happen in `useEffect([activeSurface])` — always current, never skipped, no setTimeout race.

Build is clean.

## CLOSE

OAR2 executor_complete.
