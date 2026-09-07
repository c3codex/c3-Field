---
document_type: oar2
authority_level: working
document_scope: measures_registry_undrifted_publication_architecture
title: OAR2 — Deprecate Structural Drift Section Standing and Seat unDrifted-Only Publication Architecture v1
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: route_registry_executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - undrifted
  - structural-drift
  - section-deprecation
  - publication-architecture
  - landing-pages
  - codex-first
---

# OAR2 — Deprecate Structural Drift Section Standing and Seat unDrifted-Only Publication Architecture v1

## OBSERVED

unDrifted has been seated and deployed as the governed Measures Registry publication route:

    /undrifted

Structural Drift remains available as:

    /structural-drift

The latest closeout confirms `/undrifted` and `/structural-drift` both return HTTP 200 after deployment, with `/undrifted` seated as the publication landing route and `/structural-drift` reclassified as a diagnostic series route.

Operator live QA then observed that the public runtime/UX still risks confusing Structural Drift as a publication authority.

Operator has determined:

- unDrifted is the publication brand
- Structural Drift should not remain a visible section authority
- sections are premature
- Structural Drift may remain as diagnostic concept/tag/legacy trace
- `/structural-drift` must not compete with `/undrifted`

Current priority:

- simplify publication architecture
- make `/undrifted` the only publication landing authority
- deprecate Structural Drift section standing
- preserve historical and inbound trace
- do not continue `Agents with Keys` dispatch execution until route/publication architecture is clean

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

unDrifted is the publication.

Structural Drift is not the publication.

Structural Drift is not a public section authority at this stage.

Structural Drift may remain as:

- diagnostic concept
- article tag
- historical trace
- legacy inbound route
- metadata lineage

Structural Drift may not remain as:

- umbrella publication
- independent landing authority
- competing route authority
- visible section requirement
- publication brand substitute

Landing page architecture:

    /undrifted
      = primary public publication landing

    /ai-operations-assessment
      = public assessment landing / entry route

    /structural-drift
      = legacy inbound route only, not independent landing authority

No article body mutation is authorized.

No Paragraph draft/publish is authorized.

No Buffer scheduling/publishing is authorized.

No `Agents with Keys` execution continues until this OAR closes.

## ROUTED

### 1. Deprecate Structural Drift section standing

Cody must update governed metadata so Structural Drift no longer acts as a visible publication section.

Required standing:

    structural_drift:
      publication_role: deprecated_diagnostic_section
      replacement_publication_key: undrifted
      use_as_public_section: false
      use_as_tag: true
      use_as_diagnostic_concept: true
      historical_trace_preserved: true

If current schema uses `measures_publication_registry` for `structural_drift`, update metadata only.

Do not delete the row.

Do not erase historical trace.

### 2. Update dispatch/article relationship

Existing dispatches should belong directly to `undrifted`.

Affected existing dispatches:

    structural_drift_dispatch_v1
    agents_of_chaos_dispatch_v1

Required standing:

    publication_key: undrifted
    visible_section: null or false
    section_key: null unless required for historical trace
    tags include:
      - structural_drift

If `series_key = structural_drift` must remain for compatibility, mark it as:

    series_visibility: hidden
    series_role: diagnostic_tag_or_legacy_trace
    public_section: false

Do not mutate article bodies.

Do not rewrite published Paragraph content.

### 3. Seat `/undrifted` as only publication landing authority

`/undrifted` must be the only public publication landing route.

Required standing:

    route_path: /undrifted
    route_role: primary_publication_landing
    publication_key: undrifted
    public_authority: true
    release_state: released
    access_state: visible
    claims_boundary: education_only
    canonical_url: https://measuresregistry.com/undrifted

`/undrifted` visible runtime must render:

    unDrifted
    Structural drift is detectable.
    Collapse is not the default.

It may show article cards / dispatches.

It must not require sections to render.

### 4. Reclassify `/structural-drift` as legacy inbound route

Do not delete `/structural-drift`.

Update standing:

    route_path: /structural-drift
    route_role: legacy_inbound_route
    replacement_route: /undrifted
    legacy_inbound_supported: true
    public_authority: false
    publication_key: undrifted
    diagnostic_tag: structural_drift
    release_state: released or legacy_visible
    claims_boundary: education_only

Allowed behavior:

    Option A:
      redirect to /undrifted if operator approves redirect

    Option B:
      render a legacy note under unDrifted branding:
        "Structural Drift is now part of unDrifted."
        CTA: Continue to unDrifted

Preferred for this OAR:

    Option B unless operator separately approves redirect.

Disallowed behavior:

    Structural Drift as publication heading
    Structural Drift as umbrella brand
    Structural Drift as section landing page
    Structural Drift as independent CTA authority

### 5. Seat actual landing page shells

Cody must ensure these public routes render as actual public landing pages, not fragile direct aliases into intro/home runtime:

    /undrifted
    /ai-operations-assessment

Required behavior:

    /undrifted:
      opens directly to unDrifted publication landing
      no home intro fallback
      no surface param required
      routes to dispatches/articles/Paragraph as appropriate

    /ai-operations-assessment:
      opens directly to assessment landing page
      no home intro fallback
      no surface param required
      CTA routes into registered assessment encounter/runtime

The landing page shell may render DB-governed content and route into registered runtime.

Landing page owns layout.

Codex owns content.

Registry owns routing.

Encounter owns experience.

### 6. Update route-heads

Regenerate crawler-visible static route heads for:

    /undrifted
    /ai-operations-assessment
    /structural-drift

Required `/undrifted` metadata:

    title: unDrifted | Measures Registry
    description: Structural drift is detectable. Collapse is not the default.
    canonical: https://measuresregistry.com/undrifted
    og:type: website
    og:title: unDrifted | Measures Registry
    og:description: Structural drift is detectable. Collapse is not the default.
    og:url: https://measuresregistry.com/undrifted
    twitter:card: summary_large_image

Required `/structural-drift` metadata:

    title: Structural Drift | unDrifted
    description: Structural Drift is now a diagnostic concept within unDrifted, the Measures Registry publication on structural drift and governed AI operations.
    canonical: https://measuresregistry.com/undrifted
    og:type: website
    og:title: Structural Drift | unDrifted
    og:description: Continue to unDrifted, the Measures Registry publication where Structural Drift is documented as a diagnostic concept.
    og:url: https://measuresregistry.com/structural-drift
    twitter:card: summary_large_image

Do not create a second canonical publication authority for Structural Drift.

### 7. Preserve active systems

Must preserve:

    /undrifted
    /ai-operations-assessment
    unDrifted publication record
    Paragraph @undrifted standing
    existing Paragraph URLs
    R2 media standing
    Buffer/Paragraph read-only capability standing
    social/media queue standing
    no-claims boundary

Must hold:

    Agents with Keys dispatch registration
    Agents with Keys Paragraph draft
    Buffer scheduling
    Paragraph publishing

### 8. DB mutation boundary

This OAR2 authorizes DB mutation only for:

    Structural Drift section deprecation metadata
    publication architecture metadata
    dispatch section/tag metadata
    /undrifted route standing
    /structural-drift legacy route standing
    /ai-operations-assessment landing route standing if required
    route-head metadata
    no-claims metadata

This OAR2 does not authorize mutation of:

    article bodies
    Paragraph publishing state
    Paragraph drafts
    Buffer schedules
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
- deprecate Structural Drift section standing
- preserve Structural Drift as tag/diagnostic trace
- make `/undrifted` the only publication landing authority
- reclassify `/structural-drift` as legacy inbound route
- create true landing shells for `/undrifted` and `/ai-operations-assessment`
- regenerate route heads
- validate browser-visible runtime behavior
- write OAR1 closeout

Cody may not:

- delete Structural Drift history
- create a second publication authority
- mutate article bodies
- create Paragraph draft
- publish Paragraph article
- schedule Buffer post
- publish social post
- invent URLs
- mutate unrelated DB state
- create payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
- route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. unDrifted remains the only publication landing authority.
2. `/undrifted` opens directly to a public landing page.
3. `/undrifted` does not fall back to home/intro.
4. `/undrifted` renders unDrifted brand and canonical line.
5. `/undrifted` does not require a surface param.
6. `/ai-operations-assessment` opens directly to an assessment landing page.
7. `/ai-operations-assessment` does not fall back to home/intro.
8. `/ai-operations-assessment` CTA routes into registered assessment encounter.
9. Structural Drift is deprecated as visible section.
10. Structural Drift remains as tag/diagnostic trace.
11. `/structural-drift` does not render Structural Drift as publication authority.
12. `/structural-drift` either renders legacy unDrifted note or approved route behavior.
13. Existing Paragraph URLs are preserved.
14. Existing dispatch bodies are not mutated.
15. No Agents with Keys dispatch registration occurs in this OAR.
16. No Paragraph draft is created.
17. No Paragraph post is published.
18. No Buffer draft is created.
19. No Buffer post is scheduled.
20. No social post is published.
21. No external URL is invented.
22. No pricing appears.
23. No payment appears.
24. No wallet claim appears.
25. No c3 Key issuance appears.
26. No SRC claim appears.
27. No certification claim appears.
28. No conversion claim appears.
29. No DAO claim appears.
30. No permission, recognition, or distribution claim appears.
31. No Marble readiness claim appears.
32. TypeScript validation passes if code changes.
33. Registry build passes if code changes.
34. Live browser-visible validation is performed after deploy.
35. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_deprecate_structural_drift_section_and_seat_undrifted_only_publication_architecture_v1.meta.md

OAR1 must include:

- DB/schema surfaces inspected
- records inserted or updated
- exact table names
- Structural Drift deprecation standing
- unDrifted-only publication standing
- `/undrifted` landing page standing
- `/ai-operations-assessment` landing page standing
- `/structural-drift` legacy route standing
- route-head validation
- browser-visible runtime validation
- no-draft confirmation
- no-publish confirmation
- no-schedule confirmation
- no-claims confirmation
- files changed if any
- build result
- TypeScript result
- deploy standing if deployed
- git status standing

## CLOSE

unDrifted carries the publication.

Structural Drift remains a diagnostic trace.

Sections are held.

Landing pages route.

Encounters govern experience.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes.
src renders.
