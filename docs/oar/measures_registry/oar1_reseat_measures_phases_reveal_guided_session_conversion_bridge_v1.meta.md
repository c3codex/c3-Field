---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Reseat measures_phases_reveal Guided Session Conversion Bridge
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_reseat_measures_phases_reveal_guided_session_conversion_bridge_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - measures-phases-reveal
  - guided-sessions
  - retained-assets
  - lapis
  - db-seated-content
  - codex-first
---

# OAR1 — Reseat measures_phases_reveal Guided Session Conversion Bridge

## EXECUTION SUMMARY

Reseated `measures_phases_reveal` as the post-assessment guided session conversion bridge.

DB mutations: 1 row updated (`measures_phases_reveal`).

Runtime changes: `RegisteredPhaseReveal.tsx` (rewritten to consume guided_sessions, primary/support route card split). CSS changes: `phases_reveal.css` rewritten with session cards, retained assets list, primary CTA, support link grid.

No routing changes. No scoring changes. No assessment changes. No contact capture changes. Old runtime not edited. `src/index.css` not expanded. Payment not exposed.

Browser spot check pending operator confirmation.

## DB ROW INSPECTED (before mutation)

### measures_phases_reveal (before)

| field | value |
|---|---|
| styling_contract.material_family | lapis |
| layout_contract.layout_mode | structural_requirements_bridge |
| eyebrow | STRUCTURAL REQUIREMENTS |
| title | Three Requirements for Governable AI |
| content_contract keys | requirements |
| route_cards count | 3 |

## DB ROW MODIFIED

### measures_phases_reveal — contract reseating

```json
{
  "eyebrow": "FOUNDATIONAL CONVERSION PATHWAY",
  "title": "Three Guided Sessions. Six Retained Assets.",
  "subtitle": "Measures Registry begins with a structured review of your AI operating environment, then converts that review into retained governance assets your organization can use.",
  "styling_contract": {
    "material_family": "lapis",
    "foundation_material": "lapis",
    "surface_mode": "guided_conversion_bridge",
    "background_mode": "codexstone_lapis_field",
    "material_texture_visibility": true
  },
  "layout_contract": {
    "layout_mode": "guided_session_conversion_bridge",
    "viewport_fit": "single_screen_initial_view",
    "session_layout": "three_session_grid",
    "asset_count": 6,
    "primary_cta_route": "reserve_seat",
    "support_links_visible": true,
    "footer_visibility": "visible",
    "mobile_layout": "single_column_scroll_allowed"
  },
  "content_contract": {
    "asset_total": 6,
    "video_candidate": { "enabled": false, "role": "phase_reveal_explainer", "standing": "future_candidate" },
    "guided_sessions": [
      {
        "session_number": "01",
        "title": "Name the Operating Environment",
        "body": "Identify the systems, tools, automations, decision points, and authority gaps currently shaping AI output.",
        "retained_assets": ["Operating Environment Map", "Authority + Runtime Surface Inventory"]
      },
      {
        "session_number": "02",
        "title": "Register Behavior and Review Pathways",
        "body": "Document how AI-generated output enters decisions, where review occurs, and where responsibility currently fragments.",
        "retained_assets": ["AI Behavior Pathway Register", "Review + Approval Pathway Map"]
      },
      {
        "session_number": "03",
        "title": "Structure the Response",
        "body": "Define the operational standard, role boundaries, and next-step governance pathway needed to support safe acceleration.",
        "retained_assets": ["Structural Drift Assessment", "Recommended Response Framework"]
      }
    ]
  },
  "route_cards": [
    { "title": "Reserve a Seat", "route": "reserve_seat", "body": "Begin the structured conversion pathway for your organization.", "priority": "primary" },
    { "title": "About Measures Registry", "route": "about_measures_registry", "body": "Understand the registry framework for governable AI environments.", "priority": "support" },
    { "title": "Read Structural Drift", "route": "structural_drift_publication", "body": "Review the field note on recurring implementation failures and authority fragmentation.", "priority": "support" }
  ]
}
```

All existing fields preserved via spread.

## DB READBACK CONFIRMED

| field | after |
|---|---|
| styling_contract.material_family | lapis ✓ |
| styling_contract.surface_mode | guided_conversion_bridge ✓ |
| styling_contract.background_mode | codexstone_lapis_field ✓ |
| layout_contract.layout_mode | guided_session_conversion_bridge ✓ |
| layout_contract.viewport_fit | single_screen_initial_view ✓ |
| layout_contract.asset_count | 6 ✓ |
| layout_contract.primary_cta_route | reserve_seat ✓ |
| eyebrow | FOUNDATIONAL CONVERSION PATHWAY ✓ |
| title | Three Guided Sessions. Six Retained Assets. ✓ |
| content_contract.asset_total | 6 ✓ |
| content_contract.guided_sessions count | 3 ✓ |
| content_contract.guided_sessions[0].title | Name the Operating Environment ✓ |
| content_contract.guided_sessions[0].retained_assets | Operating Environment Map, Authority + Runtime Surface Inventory ✓ |
| content_contract.guided_sessions[1].title | Register Behavior and Review Pathways ✓ |
| content_contract.guided_sessions[2].title | Structure the Response ✓ |
| route_cards count | 3 ✓ |
| route_cards | reserve_seat [primary], about_measures_registry [support], structural_drift_publication [support] ✓ |
| content_contract.video_candidate.enabled | false ✓ |

## SCRIPT CREATED

- `docs/oar/measures_registry/update-measures-phases-reveal-guided-session-bridge-v1.cjs` — DB update (measures_phases_reveal)

## RUNTIME FILES MODIFIED

### `src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx`

Full rewrite. Changes:

- Replaced `requirements` read from `content_contract.requirements` with `guidedSessions` from `content_contract.guided_sessions`
- Added `asStringArray` import for retained_assets
- Route cards split into `primaryCards` (priority==="primary") and `supportCards` (priority!=="primary")
- Session cards render: session_number span, h3 title, p body, `<ul class="registry-session-assets">` with 2 asset `<li>` items
- Primary cards render in `registry-phases-primary-cta` div with `registry-route-card--primary` class
- Support cards render in `registry-phases-support-links` nav with `registry-route-card--support` class
- No hardcoded copy. No hardcoded sessions. No hardcoded route-card content.

Props unchanged: `registryTokenStyle`, `phaseRevealCopy`, `lapisBackgroundUrl`, `renderHeader`, `renderSystemFooter`, `onNavigateRoute`.

No changes to `MeasuresRegistryRuntimeRegistered.tsx` — prop interface unchanged, route map unchanged.

### `src/measures_registry/registered_runtime/styles/encounters/phases_reveal.css`

Full rewrite. Changes:

- `.registry-phases-requirements` / `.registry-requirement-card` replaced with `.registry-phases-sessions` / `.registry-session-card`
- Session card: number span (muted, small, tracking), h3 title, p body, `.registry-session-assets` ul (dash-prefixed li items, border-top separator, `margin-top: auto` for alignment)
- `.registry-phases-route-cards` replaced with two separate zones:
  - `.registry-phases-primary-cta` — flex row, left-aligned, single button
  - `.registry-phases-support-links` — two-column grid
- `.registry-route-card--primary` — border-color primary-text (elevated), min-width 14rem
- `.registry-route-card--support` — border-color brand-border (muted), hover elevates to primary-text
- Mobile ≤768px: sessions + support-links → single column, primary CTA → full width, min-height auto

## ROUTE SURFACE MAPPING

| DB route_card.route | RegisteredSurface | notes |
|---|---|---|
| reserve_seat | reserve_seat | direct match, primary priority |
| about_measures_registry | about_measures_registry | direct match, support priority |
| structural_drift_publication | structural_drift_dispatches | alias — encounter_key differs from surface key, support priority |

Route map in `MeasuresRegistryRuntimeRegistered.tsx` unchanged (already handles the alias).

## BUILD RESULT

```
✓ 104 modules transformed
✓ built in 4.28s
```

No TypeScript errors. No CSS errors. Chunk size warning pre-existing and unrelated.

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted ✓
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched ✓
- Routing — not changed ✓
- Assessment scoring — unchanged ✓
- Assessment questions — unchanged ✓
- Contact capture — unchanged ✓
- Payment not exposed from phases_reveal ✓
- No hardcoded copy in renderer ✓
- No hardcoded sessions in renderer ✓
- No hardcoded route-card copy in renderer ✓
- No hardcoded media URLs ✓
- `registeredRuntimeUtils.ts` — not modified (contentContract and routeCards already seated in prior OAR) ✓
- `MeasuresRegistryRuntimeRegistered.tsx` — not modified (prop interface and route map unchanged) ✓

## CLOSE CONDITION

Open pending operator browser spot check on:

- `?surface=measures_phases_reveal` — lapis material, FOUNDATIONAL CONVERSION PATHWAY eyebrow, "Three Guided Sessions. Six Retained Assets." title, three session cards (01/02/03) each showing 2 retained assets, Reserve a Seat primary CTA (elevated border), About + Structural Drift support links (muted grid), footer visible, no blank placeholder, no payment CTA
- Flow: connect_src → measures_phases_reveal ✓
- Primary CTA: Reserve a Seat → reserve_seat ✓
- Support: About Measures Registry → about_measures_registry ✓
- Support: Read Structural Drift → structural_drift_dispatches ✓

Close this OAR1 when spot check passes and operator confirms.
