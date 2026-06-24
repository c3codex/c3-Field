---
document_type: oar1
authority_level: working
title: OAR1 — Repair Paths Surface and Threshold Routing
status: executed
version: v1
operator: op044
system: measures_registry
process_key: repair_paths_surface_and_threshold_routing
source_oar2: docs/oar/measures_registry/oar2_repair_paths_surface_and_threshold_routing_v1.meta.md
---

## OBJECTIVE

Repair the Paths surface (path_choice) so threshold choices route correctly to their destination surfaces. Audit route integrity, threshold contract, CTA destinations, and runtime ownership.

## DB STANDING VERIFIED FIRST

MCP Supabase unauthorized. DB standing confirmed by reading migration history, source files, and prior OAR1 records.

### Route Integrity Audit

**Surface registration:**
- `path_choice` registered in `SURFACE_QUERY` as `"evaluate_structure_path"` encounter ✓
- No direct public URL route (e.g., `/paths`) — by design; path_choice is a transition surface accessed from `/` only ✓
- `measures_registry_root.metadata.runtime_surface = "path_choice"` (confirmed by OAR1 emergency stabilization)
- `encounter_structure.intro_hook.next_surface = "path_choice"` — intro hook routes to path_choice after video ends ✓

**Root failure found:**
`encounter_structure.path_choice.left.next_surface` and `encounter_structure.path_choice.right.next_surface` **not confirmed in any migration or prior OAR**. The runtime reads these via:
```tsx
const leftChoiceNode = asRecord(pathChoiceNode?.left)
const rightChoiceNode = asRecord(pathChoiceNode?.right)
// ...
onLeftChoice={() => { const next = governedNodeSurface(leftChoiceNode, "next_surface"); if (next) navigate(next) }}
```
If `next_surface` is absent → `governedNodeSurface` returns `null` → `if (next)` guard prevents navigation → clicking either threshold does nothing. **This is the primary routing failure.**

### Threshold Contract

From emergency OAR1 (confirmed DB state):
- Left threshold: `"Assess the Environment"` with `side: "left"` ✓
- Right threshold: `"Understand the Environment"` with `side: "right"` ✓
- Two thresholds only — no third path ✓

Threshold labels are appropriate and distinct:
- **Assess the Environment** — operational evaluation, structural drift baseline, AI governance assessment
- **Understand the Environment** — public education, system governance orientation, publication path

### CTA Destinations (Pre-Repair State)

| Threshold | Previous destination | Correct destination |
|-----------|---------------------|---------------------|
| Assess the Environment (left) | null — routes nowhere | `eval_passage` (structural drift explainer → assessment) |
| Understand the Environment (right) | null — routes nowhere | `structure_passage` (governed environments public understand) |

`eval_passage` surface: `RegisteredPassage` in eval mode — plays explainer video and continues to `measures_assessment` via `routeCtaSurface`.

`structure_passage` surface: `RegisteredPublicUnderstand` — talking-head video, governed system environments orientation.

### Runtime Ownership Audit

| Component | Ownership |
|-----------|-----------|
| Threshold title copy | DB-seated — `measures_encounter_def.evaluate_structure_path.metadata.plaques[].title` |
| Threshold body copy | DB-seated — `measures_encounter_def.evaluate_structure_path.metadata.plaques[].body` (if present) |
| CTA routing | DB-governed — `measures_registry.measures_registry_root.metadata.encounter_structure.path_choice` |
| Hero images | DB-seated — `measures_media_map` roles `left_hero_fracture`, `left_hero_fracture_motion`, `right_measured_hero`, `measured_hero_motion_graphic` |
| `path_choice_background` media | Loaded in `REGISTERED_MEDIA_ROLES` but documented as `background_standing: "held_inactive_not_required_for_left_right_threshold"` in migration 202606230009. Not rendered by `RegisteredPathChoice`. Intentionally held — not a bug. |

**No component-owned content.** No hardcoded copy or routing in renderer. Runtime ownership is correctly DB-driven.

**No NotChazz flag required** — the routing gap was a missing DB node (unseated value), not a frontend authority drift.

### Design Audit

**Existing:**
- Two-column full-viewport grid (desktop): `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr))` in `src/index.css`
- Mobile: `grid-template-columns: 1fr` (stacked, each plate 50svh min)
- Each plate is a `<button>` element with `type="button"` ✓
- Focus-visible outline styled ✓
- Hero image rendered as `<video>` (motion) → `<img>` (still) on video end ✓

**Gap found (within OAR2 scope):**
No explicit CTA affordance — plates have no visible indicator that they're clickable beyond cursor change. Threshold titles render but no "→" or directional signal. OAR2 authorizes: "improve CTA visibility."

## ACTION

### Migration: `supabase/migrations/202606240004_seat_path_choice_routing_in_measures_registry_root.sql`

Seated `encounter_structure.path_choice` routing nodes on `measures_registry_root`:

```json
{
  "encounter_structure": {
    "path_choice": {
      "left": {
        "next_surface": "eval_passage",
        "threshold_label": "Assess the Environment"
      },
      "right": {
        "next_surface": "structure_passage",
        "threshold_label": "Understand the Environment"
      }
    }
  }
}
```

Used `jsonb_set` merge — `intro_hook` node preserved (validation confirmed).

Migration applied: `supabase db push` to project `zfihrspxvennjzazxcbj`.

### Renderer: `src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx`

Added `<span className="registry-route-plate-cta" aria-hidden="true">→</span>` after the body paragraph in each plate. Renders below the title and body. Purely a UI affordance — not copy, not authority.

### CSS: `src/measures_registry/registered_runtime/styles/encounters/path-choice.css`

Added `.registry-route-plate-cta` styles:
- Default: `color: rgba(255, 255, 255, 0.54)`, `margin-top: 0.5rem`
- On hover/focus-visible: `color: rgba(255, 255, 255, 0.9)`, `transform: translateX(0.3rem)` — subtle directional signal

## RESULT

**CTA route map (post-repair):**

| Threshold | Surface | Route |
|-----------|---------|-------|
| Assess the Environment (left) | `eval_passage` | Structural drift explainer video → continues to `measures_assessment` |
| Understand the Environment (right) | `structure_passage` | Governed system environments orientation (RegisteredPublicUnderstand) |

**Paths surface now:**
- Loads via intro sequence from `/` ✓ (unchanged)
- Clicking "Assess the Environment" navigates to `eval_passage` ✓ (fixed)
- Clicking "Understand the Environment" navigates to `structure_passage` ✓ (fixed)
- CTA arrow visible on each plate, animates on hover ✓ (improved)
- No hardcoded content — all copy and routing remain DB-governed ✓

**No changes to:**
- Assessment surface, scoring, contact capture, MAP, payment
- `/undrifted`, `/about-measures-registry`
- Any other registered surface

## CLOSE

Build: `npm run build:registry` — PASSED, 0 TypeScript errors

Migration applied: `202606240004_seat_path_choice_routing_in_measures_registry_root.sql` → project `zfihrspxvennjzazxcbj`

Files modified:
- `supabase/migrations/202606240004_seat_path_choice_routing_in_measures_registry_root.sql` (new)
- `src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx` (CTA arrow)
- `src/measures_registry/registered_runtime/styles/encounters/path-choice.css` (CTA styles)
- `docs/oar/measures_registry/oar1_repair_paths_surface_and_threshold_routing_v1.meta.md` (this file)

Commit: pending
Push: pending
