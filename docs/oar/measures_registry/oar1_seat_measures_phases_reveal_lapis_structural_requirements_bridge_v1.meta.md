---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Seat measures_phases_reveal Lapis Structural Requirements Bridge
status: open
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_measures_phases_reveal_lapis_structural_requirements_bridge_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - measures-phases-reveal
  - lapis
  - structural-requirements
  - bridge-surface
  - post-assessment
  - codex-first
---

# OAR1 — Seat measures_phases_reveal Lapis Structural Requirements Bridge

## EXECUTION SUMMARY

Seated `measures_phases_reveal` as the post-assessment lapis structural requirements bridge.

DB mutations: 1 row updated (`measures_phases_reveal`).

Runtime changes: `registeredRuntimeUtils.ts` (add `contentContract`, `routeCards`), `RegisteredPhaseReveal.tsx` (full rewrite to consume seated state), `MeasuresRegistryRuntimeRegistered.tsx` (replace `onContinue` with `onNavigateRoute` + route map).

CSS changes: `phases_reveal.css` created, imported in `registry.runtime.css`.

No routing changes. No scoring changes. No assessment changes. No contact capture changes. Old runtime not edited. `src/index.css` not expanded. Payment not exposed.

Browser spot check pending operator confirmation.

## DB ROW INSPECTED (before mutation)

### measures_phases_reveal (before)

| field | value |
|---|---|
| display_title | Measures Phases |
| title | null |
| eyebrow | null |
| subtitle | null |
| layout_contract.layout_mode | reveal |
| layout_contract.viewport_fit | single_screen |
| styling_contract.material_family | marble |
| styling_contract.foundation_material | marble |
| styling_contract.surface_mode | convergence_reveal |
| route_cards | null |
| content_contract | null |
| sections | null |

## DB ROW MODIFIED

### measures_phases_reveal — contract seating

```json
{
  "eyebrow": "STRUCTURAL REQUIREMENTS",
  "title": "Three Requirements for Governable AI",
  "subtitle": "AI acceleration becomes stable only when the operating environment can identify authority, register behavior, and govern review.",
  "styling_contract": {
    "material_family": "lapis",
    "foundation_material": "lapis",
    "surface_mode": "structural_requirements_bridge",
    "background_mode": "codexstone_lapis_field",
    "material_texture_visibility": true
  },
  "layout_contract": {
    "layout_mode": "structural_requirements_bridge",
    "viewport_fit": "single_screen_initial_view",
    "content_alignment": "centered_governed",
    "requirements_layout": "three_card_grid",
    "route_cards_layout": "three_action_cards",
    "footer_visibility": "visible",
    "mobile_layout": "single_column_scroll_allowed"
  },
  "content_contract": {
    "requirements": [
      {
        "title": "Authority must be named.",
        "body": "AI systems need a clear source of operational authority. Without a named authority layer, outputs drift into action without accountability."
      },
      {
        "title": "Behavior must be registered.",
        "body": "Every AI-assisted action, automation, external tool, and runtime surface must be visible enough to be reviewed, traced, and governed."
      },
      {
        "title": "Review must be governed.",
        "body": "AI review cannot depend on individual judgment or availability. It requires a persistent operational standard that can hold under acceleration."
      }
    ]
  },
  "route_cards": [
    {
      "title": "About Measures Registry",
      "route": "about_measures_registry",
      "body": "Understand the registry framework for governable AI environments."
    },
    {
      "title": "Read Structural Drift",
      "route": "structural_drift_publication",
      "body": "Review the field note on recurring implementation failures and authority fragmentation."
    },
    {
      "title": "Reserve a Seat",
      "route": "reserve_seat",
      "body": "Begin the structured conversion pathway for your organization."
    }
  ]
}
```

All existing fields preserved via spread.

## DB READBACK CONFIRMED

| field | after |
|---|---|
| styling_contract.material_family | lapis ✓ |
| styling_contract.surface_mode | structural_requirements_bridge ✓ |
| styling_contract.background_mode | codexstone_lapis_field ✓ |
| layout_contract.layout_mode | structural_requirements_bridge ✓ |
| layout_contract.viewport_fit | single_screen_initial_view ✓ |
| eyebrow | STRUCTURAL REQUIREMENTS ✓ |
| title | Three Requirements for Governable AI ✓ |
| subtitle | AI acceleration becomes stable... ✓ |
| content_contract.requirements count | 3 ✓ |
| route_cards count | 3 ✓ |
| route_cards routes | about_measures_registry, structural_drift_publication, reserve_seat ✓ |

## SCRIPT CREATED

- `docs/oar/measures_registry/update-measures-phases-reveal-lapis-bridge-v1.cjs` — DB update (measures_phases_reveal)

## RUNTIME FILES MODIFIED

### `src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`

Added to `sectionCopy()` return:

```ts
contentContract: asRecord(metadata.content_contract),
routeCards: asRecordArray(metadata.route_cards),
```

### `src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx`

Full rewrite. Changes:

- Removed `evalReport` prop (not consumed by this surface)
- Replaced `onContinue: () => void` with `onNavigateRoute: (route: string) => void`
- `materialFamily` reads from `phaseRevealCopy.stylingContract?.material_family` with fallback `"lapis"`
- `requirements` reads from `phaseRevealCopy.contentContract?.requirements` via `asRecordArray`
- `routeCards` reads from `phaseRevealCopy.routeCards`
- Renders: header, background image, headline block, three requirement cards, three route cards, footer
- No hardcoded copy. No hardcoded routes.

### `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

In `measures_phases_reveal` surface block:

- Removed `evalReport` prop pass
- Replaced `onContinue={() => navigate("about_measures_registry")}` with:

```tsx
onNavigateRoute={(route) => {
  const routeMap: Partial<Record<string, RegisteredSurface>> = {
    about_measures_registry: "about_measures_registry",
    structural_drift_publication: "structural_drift_dispatches",
    reserve_seat: "reserve_seat",
  }
  const surface = routeMap[route]
  if (surface) navigate(surface)
}}
```

`structural_drift_publication` DB route key maps to `structural_drift_dispatches` registered surface.

## CSS FILES CREATED

### `src/measures_registry/registered_runtime/styles/encounters/phases_reveal.css` (new)

- Background image: absolute, full coverage, opacity 0.18, z-index 0
- Surface frame: min-height 100svh, flex column, header-cleared padding, 70rem max-width centered
- Headline: Cormorant heading ≤ 2.25rem, 28ch max width, muted eyebrow
- Requirements grid: `grid-template-columns: repeat(3, 1fr)`, bordered cards with heading + body
- Route cards: same three-column grid, button elements with hover elevation, title + body spans
- Mobile (≤768px): both grids collapse to single column, min-height auto (scroll allowed)

Imported in `registry.runtime.css`.

## ROUTE SURFACE MAPPING

| DB route_card.route | RegisteredSurface | notes |
|---|---|---|
| about_measures_registry | about_measures_registry | direct match |
| structural_drift_publication | structural_drift_dispatches | alias — encounter_key differs from surface key |
| reserve_seat | reserve_seat | direct match |

## BUILD RESULT

```
✓ 104 modules transformed
✓ built in 3.76s
```

No TypeScript errors. No CSS errors. Chunk size warning pre-existing and unrelated.

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted ✓
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched ✓
- Routing before connect_src — not changed ✓
- Assessment scoring — unchanged ✓
- Assessment questions — unchanged ✓
- Contact capture — unchanged ✓
- Payment not exposed from phases_reveal ✓
- No hardcoded copy in renderer ✓
- No hardcoded routes in renderer ✓
- No hardcoded media URLs ✓
- evalReport removed from phases_reveal (not a contract field for this surface) ✓

## CLOSE CONDITION

Open pending operator browser spot check on:

- `?surface=measures_phases_reveal` — lapis material, eyebrow/title/subtitle visible, three requirement cards, three route cards, footer visible, no blank placeholder
- Flow: connect_src → measures_phases_reveal ✓
- Route card: About Measures Registry → about_measures_registry ✓
- Route card: Read Structural Drift → structural_drift_dispatches ✓
- Route card: Reserve a Seat → reserve_seat ✓
- Confirm no direct payment CTA ✓

Close this OAR1 when spot check passes and operator confirms.
