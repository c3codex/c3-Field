---
document_type: oar2
authority_level: working
document_scope: measures_registry_public_landing_page_design_contracts
title: OAR2 — Seat Public Landing Page Design Contracts for unDrifted and AI Operations Assessment v1
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: landing_page_executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - undrifted
  - ai-operations-assessment
  - landing-pages
  - design-contract
  - public-routes
  - codex-first
---

# OAR2 — Seat Public Landing Page Design Contracts for unDrifted and AI Operations Assessment v1

## OBSERVED

The previous OAR1 corrected the route/runtime seam.

Confirmed current standing:

- `/undrifted` opens as a direct hydrated route shell.
- `/ai-operations-assessment` opens as a direct hydrated route shell.
- `/structural-drift` is preserved only as a legacy inbound route under unDrifted branding.
- Structural Drift is no longer public section authority.
- unDrifted is the only public publication landing authority.
- No article bodies, Paragraph drafts, Buffer schedules, social posts, assessment logic, payment, c3 Key, SRC, certification, conversion, DAO, recognition, distribution, or Marble readiness behavior were changed.

However, the landing-page design seam remains.

The current route shells validate technically, but public landing pages still require intentional design/copy contracts so they do not behave like thin runtime surfaces.

This OAR2 seats landing-page design contracts for:

    /undrifted
    /ai-operations-assessment

This OAR2 does not seat Structural Drift as a landing page.

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

unDrifted is the publication.

AI Operations Assessment is the public evaluation entry.

Structural Drift remains a diagnostic trace/tag/legacy inbound route only.

Landing pages may own layout.

Landing pages may not own truth.

All public copy, metadata, CTA routing, media mapping, release state, and claim boundaries must resolve from governed DB/registry standing or explicitly seated metadata.

No component-owned article truth.

No hardcoded publication authority.

No new Structural Drift section authority.

No direct Paragraph draft/publish.

No Buffer scheduling/publishing.

No Agents with Keys registration in this OAR.

## ROUTED

### 1. Seat `/undrifted` landing page design contract

Create or update governed landing design metadata:

    route_path: /undrifted
    route_role: primary_publication_landing
    landing_contract_key: undrifted_publication_landing_v1
    style_contract_key: undrifted_publication_style_v1
    publication_key: undrifted
    public_authority: true
    claims_boundary: education_only

Required visible hierarchy:

    Brand:
    unDrifted

    Canonical line:
    Structural drift is detectable.
    Collapse is not the default.

    Parent authority:
    Measures Registry

    Function:
    dispatches on AI operations, governed environments, and structural correction

Required page sections:

    hero:
      - unDrifted wordmark / title
      - canonical brand line
      - short publication description
      - primary CTA: Read the Dispatches
      - secondary CTA: Assess the Environment

    principles:
      - Detect drift
      - Measure condition
      - Correct authority path
      - Govern continuity

    dispatches:
      - render published unDrifted dispatch cards from governed records
      - no hardcoded article list as authority
      - no visible Structural Drift section rail

    about:
      - brief Measures Registry relationship
      - no compliance-cosplay language
      - no conversion/certification/payment language

    CTA footer:
      - Assess the Environment
      - Begin where drift becomes visible

Allowed visual direction:

    dark editorial
    obsidian / graphite field
    restrained lapis-cyan signal
    subtle fracture/lattice texture
    article cards
    clean institutional edge
    no blog wall
    no compliance beige
    no cyber dashboard clutter
    no crypto/NFT cues

### 2. Seat `/ai-operations-assessment` landing page design contract

Create or update governed landing design metadata:

    route_path: /ai-operations-assessment
    route_role: public_assessment_landing
    landing_contract_key: ai_operations_assessment_landing_v1
    style_contract_key: assessment_public_landing_v1 or existing obsidian/eval style if seated
    claims_boundary: assessment_entry_only
    runtime_target: eval_passage / measures_assessment governed encounter flow

Required visible hierarchy:

    Page title:
    AI Operations Assessment

    Supporting line:
    Identify structural drift before collapse becomes visible.

    Public explanation:
    Measures Registry evaluates the environment around AI operations: authority, roles, automation, runtime surfaces, review pathways, and traceable action.

Required page sections:

    hero:
      - title
      - short explanation
      - CTA: Assess the Environment

    what it evaluates:
      - authority clarity
      - role boundaries
      - runtime behavior
      - automation exposure
      - review pathway standing
      - traceability

    what it is not:
      - not certification
      - not conversion
      - not c3 MAP completion
      - not payment
      - not c3 Key issuance

    CTA:
      - Assess the Environment
      - routes into registered encounter/runtime
      - no direct scoring shortcut
      - no bypass of contact/result gate

Allowed visual direction:

    obsidian evaluation surface
    restrained institutional copy
    compact public-facing layout
    no overexplaining
    no internal phrase “assessment-first path”
    no payment/certification/conversion language

### 3. Preserve `/structural-drift` as legacy only

Do not create or style `/structural-drift` as a landing-page authority.

Allowed behavior:

    legacy inbound route
    unDrifted-branded legacy note
    CTA: Continue to unDrifted

Disallowed behavior:

    Structural Drift as publication brand
    Structural Drift as visible section rail
    Structural Drift as separate landing page
    Structural Drift as separate public authority

### 4. Dispatch card contract

For `/undrifted`, each dispatch card must read from governed records.

Required card fields:

    dispatch_key
    title
    subtitle_or_excerpt
    tags
    article_url or internal route
    publish_state
    media_key if available
    claim_boundary
    cta_label

Allowed CTA labels:

    Read the Dispatch
    Assess the Environment
    Continue to unDrifted

Disallowed CTA labels:

    Buy
    Pay
    Mint
    Certify
    Convert
    Claim c3 Key
    Join DAO
    Get Recognized
    Enter Marble

### 5. Media contract

Landing pages may use existing governed brand/media assets only.

Allowed:

    unDrifted logo/brand asset
    existing governed R2 media
    governed Supabase media mappings

Not allowed:

    hardcoded random asset paths
    unregistered uploaded media
    new media authority surface

If an asset is missing, render a designed missing-state, not a fallback invented asset.

### 6. Route-heads and metadata

Regenerate crawler-visible static route heads for:

    /undrifted
    /ai-operations-assessment
    /structural-drift

`/undrifted` required metadata:

    title: unDrifted | Measures Registry
    description: Structural drift is detectable. Collapse is not the default.
    canonical: https://measuresregistry.com/undrifted

`/ai-operations-assessment` required metadata:

    title: AI Operations Assessment | Measures Registry
    description: Identify structural drift in AI operations and begin where drift becomes visible.
    canonical: https://measuresregistry.com/ai-operations-assessment

`/structural-drift` required metadata:

    canonical: https://measuresregistry.com/undrifted
    preserve legacy og:url if already seated

### 7. Validation requirements

Validation must be browser-visible after hydration.

Do not accept route-head-only validation.

Required visual checks:

    /undrifted:
      - opens directly to landing page
      - h1 or primary title reads unDrifted
      - canonical line visible
      - dispatch cards visible or honest no-dispatch state
      - Structural Drift not shown as publication/section authority
      - no home intro fallback
      - no ?surface= mutation

    /ai-operations-assessment:
      - opens directly to public assessment landing page
      - assessment title visible
      - public explanation visible
      - CTA routes into registered assessment encounter
      - no home intro fallback
      - no ?surface= mutation

    /structural-drift:
      - does not render independent landing authority
      - legacy note or approved legacy behavior visible
      - unDrifted branding preserved

### 8. DB mutation boundary

This OAR2 authorizes DB mutation only for:

    landing design metadata
    landing copy metadata
    landing CTA metadata
    dispatch card metadata if needed
    route-head metadata
    public route rendering metadata
    no-claims metadata

This OAR2 does not authorize mutation of:

    article bodies
    Agents with Keys dispatch
    Paragraph drafts
    Paragraph publishing
    Buffer scheduling
    Buffer posting
    assessment questions
    scoring logic
    contact gate
    result gate
    payment
    wallet
    c3 Key
    temp c3 Key
    SRC
    certification
    conversion
    DAO
    permission
    recognition
    distribution
    Marble readiness

## CODY ROLE

Cody may:

- inspect current route/publication metadata
- seat landing page design contracts
- reuse `undrifted_publication_style_v1`
- create/update public landing components
- render dispatch cards from governed records
- create assessment landing shell
- route assessment CTA into registered encounter
- regenerate route heads
- validate hydrated browser behavior
- write OAR1 closeout

Cody may not:

- create a new Structural Drift landing authority
- mutate article bodies
- register Agents with Keys
- create Paragraph draft
- publish Paragraph article
- schedule Buffer post
- publish social post
- invent media paths
- invent article truth
- mutate unrelated DB state
- create payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
- route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. `/undrifted` has a governed landing design contract.
2. `/undrifted` renders as a true public landing page.
3. `/undrifted` shows unDrifted brand and canonical line.
4. `/undrifted` renders dispatch cards from governed records.
5. `/undrifted` does not show Structural Drift as section/publication authority.
6. `/ai-operations-assessment` has a governed landing design contract.
7. `/ai-operations-assessment` renders as a true public landing page.
8. `/ai-operations-assessment` CTA routes into registered assessment encounter.
9. `/structural-drift` remains legacy only.
10. No route falls back to home/intro.
11. No public route requires `?surface=`.
12. No article body is mutated.
13. No Agents with Keys registration occurs.
14. No Paragraph draft is created.
15. No Paragraph post is published.
16. No Buffer draft is created.
17. No Buffer post is scheduled.
18. No social post is published.
19. No external URL is invented.
20. No pricing appears.
21. No payment appears.
22. No wallet claim appears.
23. No c3 Key issuance appears.
24. No SRC claim appears.
25. No certification claim appears.
26. No conversion claim appears.
27. No DAO claim appears.
28. No permission, recognition, or distribution claim appears.
29. No Marble readiness claim appears.
30. TypeScript validation passes.
31. Registry build passes.
32. Hydrated browser validation passes.
33. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_public_landing_page_design_contracts_for_undrifted_and_ai_operations_assessment_v1.meta.md

OAR1 must include:

- DB/schema surfaces inspected
- records inserted or updated
- exact table names
- `/undrifted` landing design standing
- `/ai-operations-assessment` landing design standing
- `/structural-drift` legacy standing
- files changed
- route-head validation
- hydrated browser validation
- CTA validation
- no-draft confirmation
- no-publish confirmation
- no-schedule confirmation
- no-claims confirmation
- build result
- TypeScript result
- deploy standing if deployed
- git status standing

## CLOSE

Routes are not enough.

Landing pages carry the public doorway.

unDrifted carries the publication.

Assessment carries the evaluation entry.

Structural Drift remains trace.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes.
src renders.
