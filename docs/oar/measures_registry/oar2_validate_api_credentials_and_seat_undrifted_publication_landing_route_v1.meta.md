---
document_type: oar2
authority_level: working
document_scope: measures_registry_api_validation_and_undrifted_route
title: OAR2 — Validate API Credentials and Seat unDrifted Publication Landing Route v1
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_seat_buffer_scheduler_backed_social_publishing_automation_v1.meta.md
  - docs/oar/measures_registry/oar1_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: api_route_executor
  buffer: scheduler_layer
  paragraph: external_publication_surface
  src: renderer
tags:
  - oar2
  - measures-registry
  - undrifted
  - api-validation
  - buffer
  - paragraph
  - route-registration
  - publication-landing
  - structural-drift
  - codex-first
---

# OAR2 — Validate API Credentials and Seat unDrifted Publication Landing Route v1

## OBSERVED

Buffer scheduler-backed automation is seated, but Buffer submission was held because `BUFFER` capability was unavailable at execution time.

Paragraph API publishing contract is seated, but API publishing was held because `PARAGRAPH` capability was unavailable at execution time.

Operator has now confirmed local environment secrets exist in `.env.local` under actual names:

    BUFFER_SOCIAL_KEY
    PARAGRAPH_SECRET_KEY

These replace prior placeholder names:

    BUFFER_API_KEY
    PARAGRAPH_API_KEY

Operator also wants the publication landing route changed so unDrifted has its own Measures Registry route:

    /undrifted

Current route standing:

    /structural-drift

currently carries publication/dispatch support but should now be reclassified as the Structural Drift series route, not the umbrella publication landing.

Correct hierarchy:

    Measures Registry
      -> unDrifted
          -> Structural Drift
              -> Structural Drift
              -> Agents of Chaos

Correct route architecture:

    /undrifted
      = primary unDrifted publication landing

    /structural-drift
      = Structural Drift diagnostic series route / legacy discovery route

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src / Buffer / Paragraph

Secrets present does not authorize publishing.

Secrets present authorizes capability validation only.

The API keys must remain environment-secret only.

No key may be stored in:

- repo
- Supabase DB
- OAR files
- SQL files
- markdown docs
- logs
- screenshots
- browser runtime
- chat

unDrifted is the publication.

Structural Drift is the diagnostic series.

Paragraph distributes articles.

Buffer schedules social posts.

Measures Registry governs.

Frontend renders governed route standing.

No route may create or imply:

- assessment completion
- c3 MAP completion
- payment standing
- wallet standing
- c3 Key issuance
- temp c3 Key issuance
- SRC binding
- Measures Conversion
- Registry Certification
- DAO standing
- permission standing
- recognition standing
- distribution standing
- Marble readiness

## ROUTED

### 1. Validate environment secret presence

Cody must validate that `.env.local` contains non-empty values for:

    BUFFER_SOCIAL_KEY
    PARAGRAPH_SECRET_KEY

Validation must not print, log, expose, echo, or store secret values.

Allowed output:

    BUFFER_SOCIAL_KEY present: true/false
    PARAGRAPH_SECRET_KEY present: true/false

### 2. Confirm `.env.local` protection

Cody must confirm `.env.local` is ignored by Git.

Required `.gitignore` standing:

    .env
    .env.local
    .env.*.local

If `.env.local` is not ignored, Cody must add the ignore rule before any further API testing.

### 3. Validate Buffer capability without posting

Cody may use `BUFFER_SOCIAL_KEY` only for safe capability validation.

Allowed Buffer tests:

    authenticate / token validity check
    list connected profiles/channels if supported
    confirm access to:
      - X @measures_c3
      - Instagram measures_registry
      - LinkedIn profile measures-registry
    confirm draft/schedule capability if endpoint supports read-only or non-posting validation

Not authorized:

    create draft
    schedule post
    publish post
    modify account settings
    connect/disconnect channels
    scrape followers
    send DMs
    auto-reply
    engagement automation

If Buffer API validation fails, record failure reason with secrets redacted.

### 4. Validate Paragraph capability without drafting/publishing

Cody may use `PARAGRAPH_SECRET_KEY` only for safe capability validation.

Allowed Paragraph tests:

    authenticate / token validity check
    confirm publication access to @undrifted if endpoint supports
    list publication/post metadata if supported
    confirm create/update/publish endpoint availability without using it

Not authorized:

    create draft
    update article
    publish article
    overwrite body
    delete article
    browser automation
    raw password handling

If Paragraph API validation fails, record failure reason with secrets redacted.

### 5. Update capability standing

If Buffer validation succeeds, update governed metadata:

    buffer_api_available: true
    buffer_secret_name: BUFFER_SOCIAL_KEY
    credential_storage: environment_secret_only
    direct_posting_authorized: false
    approval_required: true

If Paragraph validation succeeds, update governed metadata:

    paragraph_api_available: true
    paragraph_secret_name: PARAGRAPH_SECRET_KEY
    credential_storage: environment_secret_only
    direct_publish_authorized: false_by_default
    approval_required: true

If validation fails, keep capability held and record:

    capability_state: failed_validation
    failure_reason: redacted

### 6. Seat `/undrifted` as governed publication landing route

Create or update governed route standing for:

    route_path: /undrifted
    route_role: primary_publication_landing
    publication_key: undrifted
    parent_authority: measures_registry
    release_state: released
    access_state: visible
    claims_boundary: education_only
    style_contract: undrifted_publication_style_v1
    runtime_surface: structural_drift_publication or undrifted_publication if existing standing supports
    canonical_url: https://measuresregistry.com/undrifted

Preferred public metadata:

    title: unDrifted | Measures Registry
    description: Structural drift is detectable. Collapse is not the default.
    canonical: https://measuresregistry.com/undrifted
    og:type: website
    og:title: unDrifted | Measures Registry
    og:description: Structural drift is detectable. Collapse is not the default.
    og:url: https://measuresregistry.com/undrifted
    twitter:card: summary_large_image
    twitter:title: unDrifted | Measures Registry
    twitter:description: Structural drift is detectable. Collapse is not the default.

Renderer must read governed route/publication records.

No hardcoded article truth may be introduced.

### 7. Reclassify `/structural-drift` route

Preserve `/structural-drift`.

Do not delete it.

Reclassify it as:

    route_role: diagnostic_series_route
    series_key: structural_drift
    umbrella_publication_key: undrifted
    legacy_inbound_supported: true
    release_state: released
    access_state: visible
    claims_boundary: education_only
    canonical_url: https://measuresregistry.com/structural-drift

Preferred metadata:

    title: Structural Drift | unDrifted
    description: Structural Drift is the diagnostic series inside unDrifted, naming the seams where AI operations lose alignment.
    canonical: https://measuresregistry.com/structural-drift
    og:type: website
    og:title: Structural Drift | unDrifted
    og:description: Structural Drift is the diagnostic series inside unDrifted, naming the seams where AI operations lose alignment.
    og:url: https://measuresregistry.com/structural-drift
    twitter:card: summary_large_image

Allowed behavior:

    render Structural Drift series-filtered view under unDrifted branding

Do not redirect unless operator separately approves redirect behavior.

### 8. Preserve current landing and publication behavior

Must preserve:

    /ai-operations-assessment
    /structural-drift
    existing unDrifted publication record
    existing Structural Drift series standing
    existing Paragraph URLs
    existing R2 media standing
    existing social/media queue standing
    no-claims boundary

### 9. Route-head generation

If route-head generation exists, Cody must regenerate crawler-visible static route heads for:

    /undrifted
    /structural-drift
    /ai-operations-assessment

Required tags:

- title
- description
- canonical
- og:title
- og:description
- og:type
- og:url
- og:image where available
- twitter:card
- twitter:title
- twitter:description
- twitter:image where available

### 10. No publishing / no scheduling boundary

This OAR2 does not authorize:

    Buffer draft creation
    Buffer scheduling
    Buffer publishing
    Paragraph draft creation
    Paragraph publishing
    article body sync
    social posting
    direct platform posting

This OAR2 only authorizes:

    credential capability validation
    route registration
    route metadata update
    crawler-visible route-head generation
    governed route rendering update if needed

### 11. DB mutation boundary

This OAR2 authorizes DB mutation only for:

    Buffer capability metadata
    Paragraph capability metadata
    environment secret name metadata
    `/undrifted` route registry standing
    `/undrifted` route metadata
    `/structural-drift` route reclassification metadata
    route-head metadata
    no-claims validation metadata

This OAR2 does not authorize mutation of:

    assessment questions
    scoring logic
    contact gate
    result gate
    article bodies
    dispatch truth
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

- validate presence of `BUFFER_SOCIAL_KEY`
- validate presence of `PARAGRAPH_SECRET_KEY`
- confirm `.env.local` is ignored
- run safe API capability checks without publishing/scheduling/drafting
- update capability metadata
- seat `/undrifted` as governed publication landing route
- reclassify `/structural-drift` as Structural Drift series route
- regenerate route heads if applicable
- update route renderer if needed
- write OAR1 closeout

Cody may not:

- print secrets
- store secrets
- publish to Buffer
- schedule to Buffer
- create Paragraph draft
- publish Paragraph article
- overwrite article truth
- invent URLs
- mutate unrelated DB state
- handle raw passwords
- run browser automation
- create payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
- route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. `BUFFER_SOCIAL_KEY` presence is checked without exposing value.
2. `PARAGRAPH_SECRET_KEY` presence is checked without exposing value.
3. `.env.local` is confirmed gitignored.
4. Buffer capability is recorded as available or failed with redacted reason.
5. Paragraph capability is recorded as available or failed with redacted reason.
6. No secret value is printed, logged, stored, or committed.
7. `/undrifted` exists as governed publication landing route.
8. `/undrifted` metadata is seated.
9. `/structural-drift` remains available.
10. `/structural-drift` is reclassified as Structural Drift series route.
11. unDrifted remains the publication umbrella.
12. Structural Drift remains the diagnostic series.
13. No article body is mutated.
14. No external URL is invented.
15. No Buffer draft is created.
16. No Buffer post is scheduled.
17. No social post is published.
18. No Paragraph draft is created.
19. No Paragraph post is published.
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
30. TypeScript validation passes if code changes.
31. Registry build passes if code changes.
32. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_validate_api_credentials_and_seat_undrifted_publication_landing_route_v1.meta.md

OAR1 must include:

- env secret name standing
- `.env.local` gitignore standing
- Buffer capability standing
- Paragraph capability standing
- secret exposure confirmation
- DB/schema surfaces inspected
- records inserted or updated
- exact table names
- `/undrifted` route standing
- `/structural-drift` route standing
- route-head validation
- route runtime validation
- no-publishing confirmation
- no-scheduling confirmation
- no-claims confirmation
- files changed if any
- build result if applicable
- TypeScript result if applicable
- git status standing

## CLOSE

Keys are capability.

They are not permission.

unDrifted gets the front door.

Structural Drift keeps the series path.

Measures Registry governs.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody validates.
src renders.
