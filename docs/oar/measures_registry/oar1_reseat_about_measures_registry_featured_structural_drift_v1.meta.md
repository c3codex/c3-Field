---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Reseat about_measures_registry Featured Structural Drift Contract
status: open
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_reseat_about_measures_registry_featured_structural_drift_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - about-measures-registry
  - structural-drift
  - featured-field-note
  - lapis
  - db-seated-content
  - codex-first
---

# OAR1 — Reseat about_measures_registry Featured Structural Drift Contract

## EXECUTION SUMMARY

Reseated `about_measures_registry` as the lapis featured split surface with structural drift feature card.

DB mutations: 1 row updated (`about_measures_registry`).

Runtime changes: `RegisteredAbout.tsx` (full rewrite), `MeasuresRegistryRuntimeRegistered.tsx` (add media role, derive URL, update about block). CSS changes: `about.css` created, imported in `registry.runtime.css`.

Media mapping for `structural_drift_feature_image` not currently seated in DB — reported below. Featured image will not render until mapped.

No routing changes. No scoring changes. No assessment changes. No contact capture changes. Old runtime not edited. `src/index.css` not expanded. Payment not exposed.

Browser spot check pending operator confirmation.

## DB ROW INSPECTED (before mutation)

### about_measures_registry (before)

| field | value |
|---|---|
| styling_contract.material_family | marble |
| layout_contract.layout_mode | authority_surface |
| eyebrow | undefined |
| title | undefined |
| content_contract | undefined |
| route_cards | undefined |

## DB ROW MODIFIED

### about_measures_registry — contract seating

```json
{
  "eyebrow": "ABOUT MEASURES REGISTRY",
  "title": "Integrity Governance for AI-Accelerated Systems",
  "subtitle": "Measures Registry is a c3 Field system registered by c3 Community Partners DAO, LLC, a legally formed member-managed DAO, to help institutions evaluate and structure the environments where AI-generated output begins influencing decisions.",
  "styling_contract": {
    "material_family": "lapis",
    "foundation_material": "lapis",
    "surface_mode": "about_registry_featured_explainer",
    "background_mode": "measures_registry_lapis_field",
    "material_texture_visibility": true,
    "disallow_background_roles": ["codexstone_chamber", "marble_chamber"]
  },
  "layout_contract": {
    "layout_mode": "about_registry_featured_split",
    "viewport_fit": "single_screen_initial_view",
    "content_layout": "side_by_side",
    "primary_panel": "about_explainer",
    "secondary_panel": "featured_structural_drift",
    "footer_visibility": "visible",
    "mobile_layout": "single_column_scroll_allowed"
  },
  "content_contract": {
    "about_sections": [
      { "title": "What Measures Registry Does", "body": "Measures Registry evaluates the operating environment around AI use..." },
      { "title": "How c3 Community Partners Supports the Work", "body": "c3 Community Partners DAO, LLC, a legally formed member-managed DAO..." },
      { "title": "Contact", "body": "For questions, institutional inquiries, or guided conversion interest, contact connect@measuresregistry.com." }
    ],
    "featured": {
      "eyebrow": "FEATURED FIELD NOTE",
      "title": "Structural Drift",
      "body": "Structural Drift documents recurring implementation failures, governance gaps, authority fragmentation, and environmental instability observed across AI-accelerated systems.",
      "image_role": "structural_drift_feature_image",
      "cta_label": "Read Structural Drift",
      "route": "structural_drift_publication"
    }
  },
  "route_cards": [
    { "title": "Reserve a Seat", "route": "reserve_seat", "body": "...", "priority": "primary" },
    { "title": "Read Structural Drift", "route": "structural_drift_publication", "body": "...", "priority": "support" }
  ]
}
```

All existing fields preserved via spread.

## DB READBACK CONFIRMED

| field | after |
|---|---|
| styling_contract.material_family | lapis ✓ |
| styling_contract.surface_mode | about_registry_featured_explainer ✓ |
| layout_contract.layout_mode | about_registry_featured_split ✓ |
| layout_contract.content_layout | side_by_side ✓ |
| eyebrow | ABOUT MEASURES REGISTRY ✓ |
| title | Integrity Governance for AI-Accelerated Systems ✓ |
| content_contract.about_sections count | 3 ✓ |
| content_contract.about_sections[0].title | What Measures Registry Does ✓ |
| content_contract.about_sections[1].title | How c3 Community Partners Supports the Work ✓ |
| content_contract.about_sections[2].title | Contact ✓ |
| content_contract.featured.title | Structural Drift ✓ |
| content_contract.featured.image_role | structural_drift_feature_image ✓ |
| content_contract.featured.cta_label | Read Structural Drift ✓ |
| content_contract.featured.route | structural_drift_publication ✓ |
| route_cards count | 2 ✓ |
| route_cards | reserve_seat [primary], structural_drift_publication [support] ✓ |

## MEDIA MAPPING — MISSING

`structural_drift_feature_image` is not currently seated in the `REGISTERED_MEDIA_ROLES` media table for this campaign.

Added `"structural_drift_feature_image"` to `REGISTERED_MEDIA_ROLES` in `MeasuresRegistryRuntimeRegistered.tsx` so the runtime will resolve it once seated.

`structuralDriftFeatureImageUrl` will be `null` until a media row with `media_role = "structural_drift_feature_image"` is inserted.

The featured card renders without the image until the media row is seated. No hardcoded image URL.

No Codexstone chamber or marble chamber background used. ✓

## SCRIPT CREATED

- `docs/oar/measures_registry/update-about-measures-registry-featured-structural-drift-v1.cjs` — DB update (about_measures_registry)

## RUNTIME FILES MODIFIED

### `src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx`

Full rewrite. Changes:

- Props: replaced `marbleAccentReferenceUrl: string | null` + `onContinue: () => void` with `structuralDriftFeatureImageUrl: string | null` + `onNavigateRoute: (route: string) => void`
- `materialFamily` reads from `aboutCopy.stylingContract?.material_family` with fallback `"lapis"`
- `aboutSections` reads from `content_contract.about_sections` via `asRecordArray(asRecord(aboutCopy.contentContract)?.about_sections)`
- `featured` reads from `content_contract.featured` via `asRecord(asRecord(aboutCopy.contentContract)?.featured)`
- `routeCards` split into `primaryCards` + `supportCards` by `priority` field
- Layout: `.registry-about-split` grid → `.registry-about-primary` (left) + `.registry-about-featured` aside (right)
- Left: headline block, about sections (h3 title + p body), primary CTA + support CTA buttons
- Right: featured eyebrow, optional image (only if `structuralDriftFeatureImageUrl`), featured title, body, featured CTA button
- No hardcoded copy. No hardcoded routes. No hardcoded media URLs.

### `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

Changes:

- Added `"structural_drift_feature_image"` to `REGISTERED_MEDIA_ROLES`
- Added `const structuralDriftFeatureImageUrl = mediaUrl(mediaMap.get("structural_drift_feature_image"))`
- Updated `about_measures_registry` render block:
  - `marbleAccentReferenceUrl` prop removed
  - `structuralDriftFeatureImageUrl` prop added
  - `onContinue` removed; replaced with `onNavigateRoute` + route map (`reserve_seat` → `reserve_seat`, `structural_drift_publication` → `structural_drift_dispatches`)

## CSS FILES CREATED

### `src/measures_registry/registered_runtime/styles/encounters/about.css` (new)

- Scoped to `[data-surface="about_measures_registry"]` throughout
- Split layout: `grid-template-columns: 1fr 1fr`, header-cleared padding, 70rem max-width
- Left panel: flex column, headline (eyebrow/h1/p), sections (border-top separator, h3/p), actions row (primary + support buttons)
- Right panel: `position: sticky; top: header + 1.5rem`, bordered card, featured eyebrow, image (16:9 cover), title (Cormorant), body, featured CTA button
- Primary CTA: `border: 1px solid primary-text`, hover fill 8%
- Support CTA: `border: 1px solid brand-border`, hover elevates to primary-text
- Mobile ≤768px: single column, featured panel position: static, min-height auto

Imported in `registry.runtime.css`.

## ROUTE SURFACE MAPPING

| DB route_card.route | RegisteredSurface | notes |
|---|---|---|
| reserve_seat | reserve_seat | direct match, primary priority |
| structural_drift_publication | structural_drift_dispatches | alias — DB key differs from surface key, support priority |
| featured.route: structural_drift_publication | structural_drift_dispatches | same alias, featured card CTA |

## BUILD RESULT

```
✓ 104 modules transformed
✓ built in 4.89s
```

No TypeScript errors. No CSS errors. Chunk size warning pre-existing and unrelated.

## CONFIRMATIONS

- `src/index.css` — not rewritten, not deleted ✓
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — not touched ✓
- Routing — not changed ✓
- Assessment scoring — unchanged ✓
- Assessment questions — unchanged ✓
- Contact capture — unchanged ✓
- Payment not exposed from about_measures_registry ✓
- No hardcoded copy in renderer ✓
- No hardcoded featured Structural Drift card in renderer ✓
- No hardcoded route-card copy in renderer ✓
- No hardcoded media URLs ✓
- No Codexstone chamber or marble chamber background ✓
- `registeredRuntimeUtils.ts` — not modified ✓

## CLOSE CONDITION

Open pending operator browser spot check on:

- `?surface=about_measures_registry` — lapis material, ABOUT MEASURES REGISTRY eyebrow, "Integrity Governance for AI-Accelerated Systems" title, 3 about sections visible (What Measures Registry Does / How c3 Community Partners Supports the Work / Contact with connect@measuresregistry.com), side-by-side layout on desktop, Reserve a Seat primary CTA (elevated border), Read Structural Drift support CTA (muted border), right panel featured Structural Drift card (eyebrow FEATURED FIELD NOTE, title, body, Read Structural Drift CTA), footer visible
- Featured image: not visible until `structural_drift_feature_image` media row is seated — confirm no broken img element displayed
- Mobile: single column, featured panel below about sections
- Route: Reserve a Seat → reserve_seat ✓
- Route: Read Structural Drift → structural_drift_dispatches ✓
- Featured CTA: Read Structural Drift → structural_drift_dispatches ✓

Close this OAR1 when spot check passes and operator confirms.
