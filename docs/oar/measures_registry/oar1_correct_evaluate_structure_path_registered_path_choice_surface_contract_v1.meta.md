---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Correct evaluate_structure_path RegisteredPathChoice Surface Contract
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_evaluate_structure_path_registered_path_choice_surface_contract_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - registered-runtime
  - path-choice
  - visual-contract-parity
  - codex-first
---

# OAR1 — Correct evaluate_structure_path RegisteredPathChoice Surface Contract

## STATUS

Closed. Two files modified. Build clean.

---

## EXACT VISUAL PARITY BUG SOURCE

**File:** `src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx`

**Root cause:** The `evaluate_structure_path` encounter uses `hero_paths` in its DB metadata (not `plaques`). The original plaque resolution chain was:

```
plaques (length > 0)
  → [more, coherence].filter(Boolean)   ← coherence does not exist on SectionCopy
```

With no `plaques` and no `more` field on `evaluate_structure_path`, the `plaques` array resolved to `[]`. No path buttons rendered. Only the encounter's DB title displayed — a legacy headline that reads as an old hero-style page. Both `choiceHandler(0)` and `choiceHandler(1)` were unreachable; the path-choice surface rendered as a single-panel with no actionable left/right distinction.

`pathChoiceCopy.coherence` was also an invalid field reference — `coherence` does not exist on `SectionCopy`. At runtime it evaluated to `undefined` and was silently filtered out.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx` | Added `heroPaths` as plaque fallback; made `choiceHandler` side-aware; added `leftHeroUrl`/`rightHeroUrl` props; updated plaque rendering to resolve `cta`/`label` and render hero image; removed invalid `coherence` reference |
| `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | Added `leftHeroUrl={thresholdLeftStillUrl}` and `rightHeroUrl={thresholdRightStillUrl}` to path_choice dispatcher block |

---

## DB ROWS MODIFIED

None. Existing `hero_paths` metadata in `evaluate_structure_path` is now correctly consumed by the registered renderer.

---

## EVALUATE_STRUCTURE_PATH METADATA FIELDS CONSUMED

| Field | Consumed By | Usage |
|---|---|---|
| `eyebrow` | `pathChoiceCopy.eyebrow` | Section label above heading |
| `title` | `pathChoiceCopy.title` | Section heading (H1) |
| `subtitle` | `pathChoiceCopy.subtitle` | Sub-heading paragraph |
| `hero_paths` | `pathChoiceCopy.heroPaths` | **Primary source for path plaques** (new) |
| `plaques` | `pathChoiceCopy.plaques` | Primary if present; falls back to heroPaths |
| `more` | `pathChoiceCopy.more` | Final fallback if both empty |
| `breakdown_blocks` | `pathChoiceCopy.breakdownBlocks` | Signal copy blocks |

`actions`, `hero_paths[*].action_key`, `layout_contract`, `styling_contract`, `path_action_contract` — not used for routing. `hero_paths[*].action_key` ignored per OAR2 task 4.

---

## PLAQUE RESOLUTION — BEFORE / AFTER

**Before:**
```
plaques = pathChoiceCopy.plaques.length > 0
  ? pathChoiceCopy.plaques
  : [pathChoiceCopy.more, pathChoiceCopy.coherence].filter(Boolean)
  // coherence does not exist → always []; more absent → []
  // result: [] — no buttons rendered
```

**After:**
```
plaques = pathChoiceCopy.plaques.length > 0
  ? pathChoiceCopy.plaques
  : pathChoiceCopy.heroPaths.length > 0
  ? pathChoiceCopy.heroPaths          ← evaluate_structure_path hero_paths resolved here
  : [pathChoiceCopy.more].filter(Boolean)
```

---

## OLD RENDERED TITLE / SOURCE

| | Value |
|---|---|
| **Field** | `pathChoiceCopy.title` (from `metadata.title` or `display_title`) |
| **Rendered** | Legacy headline seated on evaluate_structure_path — visually read as old hero-style |
| **Retained** | Yes — title field is still rendered above the path plaques as section context |

---

## CORRECTED RENDERED TITLE / SOURCE

The title field is retained. The primary visual correction is the addition of the two path plaques below it. The surface now reads as a governed two-path choice, not a single-panel hero.

---

## CHOICE HANDLER — BEFORE / AFTER

**Before:**
```tsx
function choiceHandler(index: number) {
  return index === 0 ? onLeftChoice : onRightChoice
}
// index-only — side field in hero_paths record ignored
```

**After:**
```tsx
function choiceHandler(plaque: Record<string, unknown>, index: number) {
  const side = asString(plaque.side)
  if (side === "right") return onRightChoice
  if (side === "left") return onLeftChoice
  return index === 0 ? onLeftChoice : onRightChoice
}
// side-aware: reads plaque.side ("left"/"right") from hero_paths record
// falls back to index order if side field absent
```

---

## PLAQUE TITLE RESOLUTION — BEFORE / AFTER

**Before:** `asString(plaque.title) ?? asString(plaque.label)`

**After:** `asString(plaque.title) ?? asString(plaque.cta) ?? asString(plaque.label)`

Adds `cta` as intermediate fallback — hero_paths records use `cta` for the button label ("Evaluate the Environment", "Structure the Environment").

---

## LEFT PLAQUE RENDERED CONFIRMATION

- Source: `pathChoiceCopy.heroPaths[side="left"]`
- Image: `thresholdLeftStillUrl` → `mediaUrl(mediaMap.get("left_hero_fracture"))` — rendered when resolved, omitted when null
- Label: `asString(plaque.title) ?? asString(plaque.cta) ?? asString(plaque.label)`
- Body: `asString(plaque.body)`
- Key: `"left"`
- `data-choice="left"`

---

## RIGHT PLAQUE RENDERED CONFIRMATION

- Source: `pathChoiceCopy.heroPaths[side="right"]`
- Image: `thresholdRightStillUrl` → `mediaUrl(mediaMap.get("right_measured_hero"))` — rendered when resolved, omitted when null
- Label: `asString(plaque.title) ?? asString(plaque.cta) ?? asString(plaque.label)`
- Body: `asString(plaque.body)`
- Key: `"right"`
- `data-choice="right"`

---

## LEFT CLICK RUNTIME RESULT

`choiceHandler(plaque{side:"left"}, 0)` → `onLeftChoice` → `navigate("eval_passage")` → `setActiveSurface("eval_passage")` → `RegisteredPassage variant="eval"`

---

## RIGHT CLICK RUNTIME RESULT

`choiceHandler(plaque{side:"right"}, 1)` → `onRightChoice` → `navigate("structure_passage")` → `setActiveSurface("structure_passage")` → `RegisteredPassage variant="structure"`

---

## MEDIA BEHAVIOR

Allowed roles passed:

| Prop | Source | Role |
|---|---|---|
| `leftHeroUrl` | `thresholdLeftStillUrl` | `left_hero_fracture` |
| `rightHeroUrl` | `thresholdRightStillUrl` | `right_measured_hero` |

No media URLs hardcoded. If either role resolves to null, the corresponding `<img>` is omitted and the plaque renders text-only — no blank panel.

---

## BUILD RESULT

```
✓ built in 3.79s
```

Pre-existing chunk size warning (506.05 kB > 500 kB). Non-fatal. Not new.

---

## CONFIRMATIONS

| Check | Result |
|---|---|
| Old runtime `MeasuresRegistryRuntime.tsx` not edited | Confirmed |
| No deprecated route bleed | Confirmed — no cohort_conversion, educate_eval, understand_failure routes |
| No scoring fork | Confirmed |
| No email dispatch | Confirmed |
| No payment logic exposed | Confirmed |
| No connect_src pre-assessment gate reintroduced | Confirmed |
| No hardcoded semantic copy | Confirmed — all copy from DB via sectionCopy |
| No hardcoded media URLs | Confirmed — media from registered mediaMap |

---

## PROCESS INTELLIGENCE

The `evaluate_structure_path` encounter was authored with `hero_paths` as the path-button contract (not `plaques`). This predates the registered runtime's renderer which assumed `plaques`. The clean shell build did not account for this alternate metadata structure. The fix adds `heroPaths` as the first fallback in the plaque resolution chain, making the renderer compatible with both `plaques`-style and `hero_paths`-style encounter contracts without DB modification.

The `coherence` field reference (`pathChoiceCopy.coherence`) was a ghost reference — the property does not exist on `SectionCopy`. It resolved to `undefined` at runtime and was silently filtered. Removed.
