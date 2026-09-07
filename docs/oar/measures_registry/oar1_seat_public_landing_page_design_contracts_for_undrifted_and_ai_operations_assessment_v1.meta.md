---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_public_landing_page_design_contracts
title: OAR1 - Seat Public Landing Page Design Contracts for unDrifted and AI Operations Assessment v1
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_public_landing_page_design_contracts_for_undrifted_and_ai_operations_assessment_v1.meta.md
execution_artifact: docs/oar/measures_registry/seat-public-landing-page-design-contracts-for-undrifted-and-ai-operations-assessment-v1.sql
completed_at: 2026-06-06
tags:
  - oar1
  - measures-registry
  - undrifted
  - ai-operations-assessment
  - landing-pages
  - design-contract
  - hydrated-runtime-validation
---

# OAR1 - Seat Public Landing Page Design Contracts for unDrifted and AI Operations Assessment v1

## Standing

Completed.

This closeout seats governed public landing-page design contracts for:

    /undrifted
    /ai-operations-assessment

`/structural-drift` remains a legacy inbound route only.

## Execution

The governed SQL artifact was executed through the repo's live Supabase `exec_sql` path using the c3 execution credential:

    docs/oar/measures_registry/seat-public-landing-page-design-contracts-for-undrifted-and-ai-operations-assessment-v1.sql

Execution standing:

    { "ok": true }

The first attempt with the public anon key was rejected by `exec_sql` permission. The mutation was then executed through `SUPABASE_C3_SECRET`, which returned a successful envelope.

## DB Surfaces

Inspected and updated:

    public.measures_registry.metadata
    public.measures_publication_dispatch.metadata

No article body columns were mutated.

No assessment mechanics, scoring, contact gate, result gate, payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble readiness state was mutated.

## Landing Contract Readback

Live readback confirmed `/undrifted`:

    registry_key: undrifted_publication_landing
    route_role: primary_publication_landing
    landing_contract_key: undrifted_publication_landing_v1
    style_contract_key: undrifted_publication_style_v1
    runtime_surface: structural_drift_dispatches
    cta_surface: ai_operations_assessment_landing
    public_authority: true
    claims_boundary: education_only
    secondary_cta_route: /ai-operations-assessment
    canonical_url: https://measuresregistry.com/undrifted
    og_url: https://measuresregistry.com/undrifted
    description: Structural drift is detectable. Collapse is not the default.

Live readback confirmed `/ai-operations-assessment`:

    registry_key: ai_operations_assessment_landing
    route_role: public_assessment_landing
    landing_contract_key: ai_operations_assessment_landing_v1
    style_contract_key: assessment_public_landing_v1
    runtime_surface: ai_operations_assessment_landing
    cta_surface: eval_passage
    claims_boundary: assessment_entry_only
    title: AI Operations Assessment
    canonical_url: https://measuresregistry.com/ai-operations-assessment
    og_url: https://measuresregistry.com/ai-operations-assessment
    description: Identify structural drift in AI operations and begin where drift becomes visible.

Live readback confirmed `/structural-drift`:

    registry_key: structural_drift_landing
    route_role: legacy_inbound_route
    runtime_surface: structural_drift_dispatches
    cta_surface: null
    public_authority: false
    claims_boundary: education_only
    canonical_url: https://measuresregistry.com/undrifted
    og_url: https://measuresregistry.com/structural-drift

## Dispatch Card Contract

Live readback confirmed published unDrifted dispatches carry landing-card boundaries:

    agents_of_chaos_dispatch_v1:
      claim_boundary: education_only
      cta_label: Read the Dispatch
      payment_claim_allowed: false
      certification_claim_allowed: false
      conversion_claim_allowed: false
      c3_key_claim_allowed: false
      dao_claim_allowed: false
      marble_readiness_claim_allowed: false

    structural_drift_dispatch_v1:
      claim_boundary: education_only
      cta_label: Read the Dispatch
      payment_claim_allowed: false
      certification_claim_allowed: false
      conversion_claim_allowed: false
      c3_key_claim_allowed: false
      dao_claim_allowed: false
      marble_readiness_claim_allowed: false

## Renderer Changes

Added a registered public assessment landing surface:

    ai_operations_assessment_landing

Direct `/ai-operations-assessment` now renders a landing page first, not the eval passage itself. Its CTA routes into the registered `eval_passage` encounter flow without bypassing assessment gates.

Updated unDrifted publication rendering to consume the seated `/undrifted` landing design contract:

    data-landing-contract: undrifted_publication_landing_v1
    data-style-contract: undrifted_publication_style_v1

unDrifted dispatch cards render from governed `measures_publication_dispatch` records and expose:

    data-dispatch-key
    data-publish-state
    data-claim-boundary
    data-media-key when available

The unDrifted assessment CTA now uses the governed route target:

    /ai-operations-assessment

`/structural-drift` was not made into a landing authority.

## Route-Head Validation

`npm.cmd run build:registry` regenerated route heads for:

    /undrifted
    /ai-operations-assessment
    /structural-drift

Built route-head validation confirmed:

    /undrifted:
      title: unDrifted | Measures Registry
      description: Structural drift is detectable. Collapse is not the default.
      canonical: https://measuresregistry.com/undrifted
      og:url: https://measuresregistry.com/undrifted

    /ai-operations-assessment:
      title: AI Operations Assessment | Measures Registry
      description: Identify structural drift in AI operations and begin where drift becomes visible.
      canonical: https://measuresregistry.com/ai-operations-assessment
      og:url: https://measuresregistry.com/ai-operations-assessment

    /structural-drift:
      title: Structural Drift | unDrifted
      canonical: https://measuresregistry.com/undrifted
      og:url: https://measuresregistry.com/structural-drift

## Hydrated Browser Validation

Browser-visible validation was performed against `dist-registry` through a temporary local static server and headless Chrome DevTools Protocol. Validation waited for hydrated runtime state, not only static route-head HTML.

Result:

    ok: true
    failures: []

Hydrated `/undrifted` confirmed:

    href: http://127.0.0.1:4186/undrifted
    surface: structural_drift_dispatches
    layout: undrifted_publication
    routeShell: undrifted_publication_landing
    landingContract: undrifted_publication_landing_v1
    styleContract: undrifted_publication_style_v1
    h1: unDrifted
    canonical line visible: true
    dispatch cards visible: 3
    assessment CTA href: /ai-operations-assessment
    intro fallback visible: false
    Structural Drift series rail visible: false
    direct route query mutation: false

Hydrated `/ai-operations-assessment` confirmed:

    href: http://127.0.0.1:4186/ai-operations-assessment
    surface: ai_operations_assessment_landing
    layout: assessment_public_landing
    routeShell: ai_operations_assessment_landing
    styleContract: assessment_public_landing_v1
    h1: AI Operations Assessment
    public explanation visible: true
    assessment CTA visible: true
    intro fallback visible: false
    direct route query mutation: false

CTA validation confirmed:

    after CTA click:
      href: http://127.0.0.1:4186/ai-operations-assessment?surface=eval_passage
      surface: eval_passage
      layout: passage
      routeShell: ai_operations_assessment_landing

Hydrated `/structural-drift` strict legacy validation confirmed:

    href: http://127.0.0.1:4188/structural-drift
    surface: structural_drift_dispatches
    routeShell: structural_drift_legacy_inbound
    styleContract: undrifted_publication_style_v1
    landingContract: undrifted_publication_landing_v1
    h1: unDrifted
    canonical: https://measuresregistry.com/undrifted
    ogUrl: https://measuresregistry.com/structural-drift
    legacy note visible: true
    canonical line visible: true
    intro fallback visible: false
    Structural Drift series rail visible: false

No forbidden CTA labels were observed:

    Buy
    Pay
    Mint
    Certify
    Convert
    Claim c3 Key
    Join DAO
    Get Recognized
    Enter Marble

## Validation Commands

Passed:

    npx.cmd tsc --noEmit
    npm.cmd run build:registry
    git diff --check

`npm.cmd run build:registry` emitted only the existing Vite chunk-size warning.

## Boundaries Preserved

No article body mutation.

No Agents with Keys registration.

No Paragraph draft.

No Paragraph publish.

No Buffer draft.

No Buffer schedule.

No Buffer post.

No social post.

No external URL invention.

No pricing.

No payment.

No wallet claim.

No c3 Key issuance.

No SRC claim.

No certification claim.

No conversion claim.

No DAO claim.

No permission, recognition, or distribution claim.

No Marble readiness claim.

## Git Standing

Working tree contains this OAR package plus the prior unDrifted/public-route package changes. No commit or push was performed in this closeout.

## Closeout

Routes are now backed by governed landing-page design contracts.

`/undrifted` carries the public publication doorway.

`/ai-operations-assessment` carries the public evaluation entry.

`/structural-drift` remains trace.
