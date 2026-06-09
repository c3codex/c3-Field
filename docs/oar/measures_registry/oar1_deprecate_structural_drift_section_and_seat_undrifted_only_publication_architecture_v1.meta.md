---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_undrifted_publication_architecture
title: OAR1 - Deprecate Structural Drift Section Standing and Seat unDrifted-Only Publication Architecture v1
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md
execution_artifact: docs/oar/measures_registry/deprecate-structural-drift-section-and-seat-undrifted-only-publication-architecture-v1.sql
completed_at: 2026-06-06
tags:
  - oar1
  - measures-registry
  - undrifted
  - structural-drift
  - section-deprecation
  - publication-architecture
  - landing-pages
  - hydrated-runtime-validation
---

# OAR1 - Deprecate Structural Drift Section Standing and Seat unDrifted-Only Publication Architecture v1

## Standing

Completed.

This closeout seats unDrifted as the only public publication landing authority and deprecates Structural Drift from public section standing while preserving its historical, diagnostic, tag, and legacy inbound-route trace.

## Execution

The governed SQL artifact was executed against live Supabase state:

    docs/oar/measures_registry/deprecate-structural-drift-section-and-seat-undrifted-only-publication-architecture-v1.sql

Execution standing:

    { "ok": true }

Two implementation notes were resolved before successful execution:

- `measures_publication_dispatch.tags` is `jsonb`; tag preservation was implemented with `jsonb_array_elements_text(...)` and `jsonb_agg(distinct ...)`.
- `measures_registry` release-state constraints do not accept `legacy_visible` as the top-level checked release state; the route remains released while legacy standing is carried in governed route metadata.

## Registry Readback

Live readback confirmed `measures_publication_registry.structural_drift`:

    publication_role: deprecated_diagnostic_section
    replacement_publication_key: undrifted
    use_as_public_section: false
    use_as_tag: true
    use_as_diagnostic_concept: true

Live readback confirmed `measures_publication_registry.undrifted`:

    only_publication_landing_authority: true
    style_contract_key: undrifted_publication_style_v1
    subtitle_lines:
      - Structural drift is detectable.
      - Collapse is not the default.
    hierarchy.series count: 0

Live readback confirmed dispatch seating:

    agents_of_chaos_dispatch_v1:
      publication_key: undrifted
      tags include: structural_drift
      visible_section: false
      public_section: false
      section_key: null
      series_visibility: hidden
      series_role: diagnostic_tag_or_legacy_trace
      diagnostic_tag: structural_drift
      paragraph_publish_state: published_external_operator_confirmed
      article_url preserved: https://paragraph.com/@undrifted/agents-of-chaos

    structural_drift_dispatch_v1:
      publication_key: undrifted
      tags include: structural_drift
      visible_section: false
      public_section: false
      section_key: null
      series_visibility: hidden
      series_role: diagnostic_tag_or_legacy_trace
      diagnostic_tag: structural_drift
      paragraph_publish_state: published_external_operator_confirmed
      article_url preserved: https://paragraph.com/@undrifted/structural-drift

Live readback confirmed route seating:

    undrifted_publication_landing:
      route_path: /undrifted
      route_role: primary_publication_landing
      publication_key: undrifted
      public_authority: true
      runtime_surface: structural_drift_dispatches
      canonical_url: https://measuresregistry.com/undrifted
      og_url: https://measuresregistry.com/undrifted

    structural_drift_landing:
      route_path: /structural-drift
      route_role: legacy_inbound_route
      publication_key: undrifted
      public_authority: false
      replacement_route: /undrifted
      diagnostic_tag: structural_drift
      legacy_behavior: render_legacy_note_under_undrifted_branding
      runtime_surface: structural_drift_dispatches
      canonical_url: https://measuresregistry.com/undrifted
      og_url: https://measuresregistry.com/structural-drift

    ai_operations_assessment_landing:
      route_path: /ai-operations-assessment
      runtime_surface: eval_passage
      canonical_url: https://measuresregistry.com/ai-operations-assessment
      og_url: https://measuresregistry.com/ai-operations-assessment

## Renderer Changes

The registered runtime now renders public publication dispatches from `publication_key = undrifted`.

The public unDrifted renderer continues to reuse the governed `undrifted_publication_style_v1` contract. No new visual style was created.

The public Structural Drift series rail was removed from the publication landing renderer. Structural Drift remains present only as diagnostic tag, legacy trace, and inbound route standing.

Direct public route shells were added for browser-visible hydration validation:

    /undrifted:
      data-route-shell: undrifted_publication_landing
      data-surface: structural_drift_dispatches
      data-layout-contract: undrifted_publication
      data-style-contract: undrifted_publication_style_v1

    /structural-drift:
      data-route-shell: structural_drift_legacy_inbound
      data-surface: structural_drift_dispatches
      data-layout-contract: undrifted_publication
      data-style-contract: undrifted_publication_style_v1

    /ai-operations-assessment:
      data-route-shell: ai_operations_assessment_landing
      data-surface: eval_passage
      data-layout-contract: passage

Runtime URL synchronization was updated so governed direct routes do not hydrate into `?surface=` URLs when their active surface already matches the route's governed default surface.

Hydrated metadata application now preserves separate canonical and Open Graph URLs. This keeps `/structural-drift` canonicalized to `/undrifted` while preserving `og:url` as `/structural-drift`.

## Static Route-Head Validation

`npm.cmd run build:registry` regenerated governed route heads for:

    /ai-operations-assessment
    /structural-drift
    /undrifted

Built route-head validation confirmed:

    /undrifted:
      title: unDrifted | Measures Registry
      description: Structural drift is detectable. Collapse is not the default.
      canonical: https://measuresregistry.com/undrifted
      og:url: https://measuresregistry.com/undrifted

    /structural-drift:
      title: Structural Drift | unDrifted
      description: Structural Drift is now a diagnostic concept within unDrifted, the Measures Registry publication on structural drift and governed AI operations.
      canonical: https://measuresregistry.com/undrifted
      og:url: https://measuresregistry.com/structural-drift
      twitter description: Continue to unDrifted, the Measures Registry publication where Structural Drift is documented as a diagnostic concept.

    /ai-operations-assessment:
      title: AI Operations Assessment | Measures Registry
      description: Identify structural drift in AI operations and route into a governed assessment-first pathway.
      canonical: https://measuresregistry.com/ai-operations-assessment
      og:url: https://measuresregistry.com/ai-operations-assessment

## Hydrated Browser Validation

Browser-visible validation was performed against `dist-registry` through a temporary local static server and headless Chrome DevTools Protocol. Validation waited for hydrated runtime state, not just route-head HTML.

Result:

    ok: true
    failures: []

Hydrated `/undrifted` confirmed:

    href: http://127.0.0.1:4185/undrifted
    surface: structural_drift_dispatches
    layout: undrifted_publication
    routeShell: undrifted_publication_landing
    styleContract: undrifted_publication_style_v1
    releaseStanding: published
    canonical line visible: true
    intro fallback visible: false
    series rail visible: false
    query surface mutation: false

Hydrated `/structural-drift` confirmed:

    href: http://127.0.0.1:4185/structural-drift
    surface: structural_drift_dispatches
    layout: undrifted_publication
    routeShell: structural_drift_legacy_inbound
    styleContract: undrifted_publication_style_v1
    canonical: https://measuresregistry.com/undrifted
    ogUrl: https://measuresregistry.com/structural-drift
    legacy note visible: true
    canonical line visible: true
    intro fallback visible: false
    series rail visible: false
    query surface mutation: false

Hydrated `/ai-operations-assessment` confirmed:

    href: http://127.0.0.1:4185/ai-operations-assessment
    surface: eval_passage
    layout: passage
    routeShell: ai_operations_assessment_landing
    releaseStanding: public
    assessment text visible: true
    intro fallback visible: false
    query surface mutation: false

## Validation Commands

Passed:

    npx.cmd tsc --noEmit
    npm.cmd run build:registry
    git diff --check

`npm.cmd run build:registry` emitted only the existing Vite chunk-size warning.

## Boundaries Preserved

No article bodies were mutated.

No Paragraph draft or publish action was performed.

No Buffer schedule or post action was performed.

No assessment questions were changed.

No scoring logic was changed.

No contact gate, result gate, payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble readiness behavior was changed.

No new public style was created.

## Closeout

unDrifted is the public publication landing authority.

Structural Drift is no longer public section authority.

`/structural-drift` remains supported as a legacy inbound route under unDrifted branding.

`/undrifted` and `/ai-operations-assessment` now validate as direct browser-visible hydrated route shells without `?surface=` and without intro/home runtime fallback.
