---
document_type: oar2
authority_level: working
document_scope: measures_registry_paragraph_api_publishing
title: OAR2 — Seat Paragraph API Publishing Contract for DB-Governed Articles v1
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_seat_measures_registry_social_and_media_distribution_automation_contract_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: api_executor
  paragraph: external_publication_surface
  src: renderer
tags:
  - oar2
  - measures-registry
  - undrifted
  - paragraph
  - api
  - publishing
  - db-governed-articles
  - dispatches
  - approval-before-publish
  - codex-first
---

# OAR2 — Seat Paragraph API Publishing Contract for DB-Governed Articles v1

## OBSERVED

Measures Registry currently governs unDrifted publication standing.

unDrifted is the active publication brand.

Structural Drift is a diagnostic series/category under unDrifted.

Paragraph `@undrifted` is seated as the source publication distribution surface.

Four Paragraph article URLs are already seated:

- `https://paragraph.com/@undrifted/undrifted`
- `https://paragraph.com/@undrifted/measures-registry`
- `https://paragraph.com/@undrifted/structural-drift`
- `https://paragraph.com/@undrifted/agents-of-chaos`

The current social/media distribution contract is draft-preparation only.

No direct posting, credential handling, or API dependency has been activated.

Operator now wants future articles to be registered in DB and published to Paragraph from DB-governed state.

Paragraph API/SDK support exists, but API standing is alpha/rate-limited and may require an API key generated from Paragraph publication settings.

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> Paragraph API -> Paragraph

Codex / DB is article authority.

Paragraph is an external publication surface.

Paragraph API is a publishing bridge.

Paragraph does not own article truth.

Returned Paragraph URLs must be written back to governed DB records.

No API key may be stored in repo, DB rows, OAR files, logs, or public runtime.

No article may publish unless DB standing and operator approval both exist.

## ROUTED

### 1. Seat Paragraph API capability standing

Cody must inspect current capability and record:

    platform: paragraph
    handle: @undrifted
    publication_key: undrifted
    api_capability_state: unverified | available | unavailable
    api_status: alpha
    rate_limit_state: acknowledged
    api_key_required: true_if_endpoint_requires
    token_storage: environment_secret_only
    direct_publish_allowed: false_by_default

If no API key is available, Cody must stop before API publishing and produce a DB-to-Paragraph export package only.

### 2. Seat DB-governed article lifecycle

Required lifecycle states:

    drafted_in_db
    operator_review_required
    approved_for_paragraph_draft
    paragraph_draft_created
    approved_for_paragraph_publish
    published_to_paragraph
    failed_paragraph_submission
    held_for_revision
    deprecated
    archived

Default new article state:

    drafted_in_db

No article may move to `approved_for_paragraph_publish` without operator approval.

### 3. Seat article authority fields

Each article/dispatch must resolve from DB fields or metadata equivalent:

    dispatch_key
    publication_key: undrifted
    series_key
    title
    subtitle
    slug
    excerpt
    body_markdown
    body_html_if_required
    author_display
    publish_state
    approval_state
    canonical_url
    paragraph_url
    paragraph_post_id
    paragraph_draft_id
    tags
    section
    cta_label
    cta_url
    claim_boundary
    social_preview_title
    social_preview_description
    social_preview_image
    created_at
    updated_at
    published_at

If current tables do not support these fields directly, use existing metadata JSON only if it preserves queryable standing and does not create a second authority.

No new schema is authorized unless current surfaces cannot support the contract and operator confirms schema expansion.

### 4. Seat Paragraph publishing workflow

Allowed workflow:

    DB article record exists
    article passes claim-boundary validation
    operator approves for Paragraph draft
    Cody creates Paragraph draft through API if API capability exists
    Paragraph draft ID returned
    DB record updated with draft ID and draft standing
    operator reviews draft
    operator approves publish
    Cody publishes through API if publish endpoint is confirmed
    Paragraph post ID and URL returned
    DB record updated with published standing, URL, timestamp, and API response summary

If Paragraph API supports draft creation but not publish action:

    create draft only
    operator publishes manually
    Cody records final Paragraph URL after operator confirmation

If Paragraph API is unavailable:

    generate Paragraph-ready markdown/package
    operator publishes manually
    Cody records URL after confirmation

### 5. Seat approval boundary

Approval requirements:

    approved_for_paragraph_draft: operator required
    approved_for_paragraph_publish: operator required

No automatic publish from `drafted_in_db`.

No recurring publishing automation.

No agent-owned publishing decision.

### 6. Seat credential boundary

If API key is used:

    allowed_storage:
      - local environment variable
      - deployment secret manager
      - CI secret if future CI workflow is seated

    prohibited_storage:
      - GitHub repo
      - Supabase DB
      - OAR files
      - markdown docs
      - browser runtime
      - logs
      - screenshots
      - social/media metadata

All logs must redact API key values.

### 7. Seat claim-boundary validation

Before draft or publish, article content must be scanned for prohibited claims:

    pricing claim
    payment claim
    wallet claim
    c3 Key issuance claim
    temp c3 Key claim
    SRC binding claim
    certification claim
    conversion claim
    DAO claim
    permission claim
    recognition claim
    distribution claim
    Marble readiness claim

Allowed public posture:

    education_only
    orientation
    dispatch
    field note
    assessment CTA
    governed environment framing

### 8. Seat canonical CTA behavior

Allowed CTAs:

    Read the Dispatch
    Assess the Environment
    Continue to Structural Evaluation
    Understand the Environment
    View Field Notes

Primary CTA:

    Assess the Environment
    https://measuresregistry.com/ai-operations-assessment

Publication CTA:

    Read unDrifted
    https://paragraph.com/@undrifted

Do not use internal phrase:

    assessment-first path

Public support line:

    Begin where drift becomes visible.

### 9. Seat migration handling for existing 4 articles

Existing articles are already published externally.

Cody must not overwrite them through API.

Instead, seat current records as:

    paragraph_publish_state: published_external_operator_confirmed
    paragraph_url: existing URL
    paragraph_api_managed: false_until_matched
    db_body_state: external_url_standing_or_body_pending

For each:

    undrifted_dispatch_v1
    measures_registry_dispatch_v1
    structural_drift_dispatch_v1
    agents_of_chaos_dispatch_v1

Future OAR may backfill article bodies into DB.

This OAR does not authorize body rewrite or destructive sync.

### 10. Seat API sync direction

Default sync direction:

    DB -> Paragraph

Allowed readback:

    Paragraph -> DB metadata confirmation
    Paragraph URL
    Paragraph post ID
    Paragraph status
    published timestamp

Not allowed by default:

    Paragraph body overwrites DB body
    Paragraph title overwrites DB title
    Paragraph tags overwrite DB tags
    Paragraph becomes article authority

### 11. DB mutation boundary

This OAR2 authorizes DB mutation only for:

    Paragraph API capability metadata
    article lifecycle metadata
    Paragraph draft/post ID fields or metadata
    Paragraph URL standing
    approval state
    publish state
    API response summary with secrets redacted
    external URL standing for existing published articles

This OAR2 does not authorize mutation of:

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

### 12. Missing capability rule

If Cody cannot safely use Paragraph API:

    stop before API mutation
    report missing capability
    generate Paragraph-ready export package
    do not request raw password
    do not store API key
    do not attempt browser automation unless separately authorized

## CODY ROLE

Cody may:

- inspect existing publication/dispatch metadata surfaces
- inspect Paragraph API docs and capability
- seat Paragraph API publishing contract metadata
- prepare article lifecycle metadata
- prepare Paragraph-ready exports
- create Paragraph drafts if API key and endpoint are safely available
- publish only after operator approval and confirmed endpoint support
- write returned Paragraph IDs/URLs back to DB
- redact secrets in logs
- write OAR1 closeout

Cody may not:

- store API keys in repo, DB, docs, or logs
- publish without operator approval
- overwrite DB article truth from Paragraph
- rewrite existing published article bodies
- invent external URLs
- create payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
- route into Marble Chamber
- handle raw passwords
- run browser automation unless separately authorized

## VALIDATION

Execution is valid only when:

1. Paragraph API capability is recorded.
2. API key requirement is recorded.
3. token storage boundary is seated.
4. article lifecycle states are seated.
5. approval-before-draft is seated.
6. approval-before-publish is seated.
7. DB -> Paragraph is seated as default sync direction.
8. Paragraph does not become authority.
9. existing 4 articles are preserved as already-published external records.
10. no existing article body is overwritten.
11. no external URL is invented.
12. no API key is stored in repo, DB, OAR, docs, or logs.
13. no raw password is handled.
14. no direct publish occurs without approval.
15. no pricing appears.
16. no payment appears.
17. no wallet claim appears.
18. no c3 Key issuance appears.
19. no SRC claim appears.
20. no certification claim appears.
21. no conversion claim appears.
22. no DAO claim appears.
23. no permission, recognition, or distribution claim appears.
24. no Marble readiness claim appears.
25. TypeScript validation passes if code changes.
26. registry build passes if code changes.
27. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_paragraph_api_publishing_contract_for_db_governed_articles_v1.meta.md

OAR1 must include:

- DB/schema surfaces inspected
- Paragraph API capability standing
- API key requirement standing
- credential boundary standing
- records inserted or updated
- exact table names
- article lifecycle standing
- existing 4 article standing
- DB -> Paragraph sync standing
- approval boundary standing
- API draft/publish result if attempted
- Paragraph IDs/URLs if returned
- export package standing if API unavailable
- no-claims confirmation
- files changed if any
- build result if applicable
- TypeScript result if applicable
- git status standing

## CLOSE

DB governs.

Paragraph publishes.

API bridges.

Operator approves.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes.
Paragraph receives.
