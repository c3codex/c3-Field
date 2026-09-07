---
document_type: oar2
authority_level: working
document_scope: measures_registry_buffer_scheduler_publishing
title: OAR2 — Seat Buffer Scheduler-Backed Social Publishing Automation v1
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
  cody: scheduler_executor
  buffer: scheduler_layer
  src: renderer
tags:
  - oar2
  - measures-registry
  - buffer
  - scheduler
  - social-publishing
  - undrifted
  - x
  - instagram
  - linkedin
  - approval-before-post
  - codex-first
---

# OAR2 — Seat Buffer Scheduler-Backed Social Publishing Automation v1

## OBSERVED

The Measures Registry social/media distribution automation contract is seated as draft-preparation only.

Current seated standing includes:

- `approval_required`: true
- `approval_before_post`: true
- `direct_posting_authorized`: false
- `api_posting_dependency`: false
- `recurring_automation_activated`: false

Current governed social accounts:

- X: `@measures_c3`
- Instagram: `measures_registry`
- LinkedIn: `www.linkedin.com/in/measures-registry`
- Paragraph: `@undrifted`

Operator has confirmed Buffer is set up with three connected accounts on the free plan:

- X: `@measures_c3`
- Instagram: `measures_registry`
- LinkedIn: `measures-registry`

LinkedIn standing:

- current surface is a LinkedIn profile, not a company page
- copy must use executive/profile-appropriate language
- do not imply a company-page publisher surface

Current governed publication standing:

- Measures Registry governs
- unDrifted publishes
- Structural Drift is a diagnostic series
- Paragraph distributes article source surfaces
- X, Instagram, and LinkedIn distribute signal

This OAR2 upgrades the existing draft-prep queue into a Buffer-backed scheduler workflow.

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> Buffer -> social platforms

Buffer is a scheduler/publishing layer.

Buffer is not authority.

Social platforms are not authority.

Paragraph remains the article source publication surface.

Measures Registry remains parent authority.

unDrifted remains publication brand.

No social post may create or imply:

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

This OAR2 authorizes scheduler-backed posting only after operator approval.

No raw platform passwords may be handled.

No platform credentials may be committed to repo, written into OAR files, stored in Supabase metadata, or exposed in logs.

## ROUTED

### 1. Seat Buffer scheduler standing

Seat or prepare governed metadata:

    scheduler_platform: buffer
    scheduler_role: approved_social_publishing_layer
    scheduler_status: active_operator_confirmed
    connected_channels:
      - x:@measures_c3
      - instagram:measures_registry
      - linkedin_profile:measures-registry
    channel_count: 3
    plan_boundary: free_three_channel_standing_operator_confirmed
    authority: scheduler_only
    direct_platform_credentials: prohibited

### 2. Update automation standing

Move from:

    contract_status: draft_preparation_only

To:

    contract_status: approved_buffer_scheduler_preparation

Allowed states:

    prepared
    operator_review_required
    approved_for_buffer
    sent_to_buffer_draft
    scheduled_in_buffer
    posted_by_buffer
    failed_buffer_submission
    held_for_revision

Default state:

    operator_review_required

### 3. Approval-before-schedule rule

Buffer scheduling may occur only after operator approval.

Approval may be recorded as:

    approve_post_key
    approve_batch_key
    approve_platform_subset
    approve_schedule_window

No post may be sent to Buffer unless approval standing is true.

No recurring autoposting is authorized.

### 4. Buffer action boundary

Allowed Buffer actions:

    create Buffer draft
    create Buffer scheduled post after approval
    attach approved media where supported
    assign connected channel
    assign scheduled date/time
    update queue item status
    record Buffer post identifier if returned
    record failure response if submission fails

Not authorized:

    publish immediately without approval
    auto-reply
    DM
    scrape followers
    growth automation
    engagement automation
    delete posts without operator approval
    modify account settings
    connect or disconnect channels
    change Buffer billing or plan
    store Buffer API key in repo or DB metadata

### 5. Credential boundary

If Buffer API access is used:

    token_storage: environment_secret_only
    repo_storage: prohibited
    db_storage: prohibited
    oar_storage: prohibited
    log_storage: redacted_only

If no Buffer API key is available:

    Cody must generate Buffer-ready draft package and stop.
    Operator may import or paste manually into Buffer.
    No browser automation is authorized unless separately confirmed.

### 6. Platform copy rules

X:

    role: fast thesis distribution
    tone: sharp, clear, field-defining
    hashtags_max: 4
    links: Paragraph or Measures Registry
    thread_allowed: true

Instagram:

    role: media signal surface
    preferred formats:
      - reels
      - quote cards
      - carousel summaries
      - article cover cards
    captions:
      - short
      - brand-forward
      - no internal system jargon
    note:
      - Instagram bio/link behavior may limit clickable URLs

LinkedIn profile:

    role: executive / founder-facing distribution
    surface_type: personal_profile
    tone:
      - executive
      - clear
      - non-alarmist
      - not company-page boilerplate
    avoid:
      - “we at our company page”
      - corporate press-release language
      - over-formal compliance framing

### 7. First Buffer batch

Prepare Batch 001 from existing governed media-backed queue.

Batch key:

    buffer_batch_001_undrifted_launch

Posts:

    post_001:
      platforms: instagram, x, linkedin
      media: left_hero_fracture_motion_video
      copy_theme: unDrifted launch
      link: https://paragraph.com/@undrifted/undrifted
      approval: required

    post_002:
      platforms: linkedin, x
      media: integrity_governance_intro_video
      copy_theme: Measures Registry executive summary
      link: https://paragraph.com/@undrifted/measures-registry
      approval: required

    post_003:
      platforms: instagram, x
      media: questions_ungoverned_systems_cannot_answer_video
      copy_theme: ungoverned systems cannot answer
      link: https://paragraph.com/@undrifted/agents-of-chaos
      approval: required

    post_004:
      platforms: instagram, linkedin
      media: right_measured_hero_motion_graphic_video
      copy_theme: Detect Measure Correct Govern
      cta: Assess the Environment
      link: https://measuresregistry.com/ai-operations-assessment
      approval: required

### 8. Scheduling recommendation

Initial Buffer schedule recommendation:

    Day 1:
      post_001 Instagram
      post_001 X
      post_002 LinkedIn

    Day 2:
      post_003 Instagram
      post_003 X

    Day 3:
      post_004 Instagram
      post_004 LinkedIn

    Day 4:
      post_002 X variant or repost variant

Scheduling is recommendation only until operator approves.

### 9. Buffer status tracking

Each queue item should track:

    post_key
    batch_key
    platform
    media_key
    dispatch_key or route_key
    copy_variant
    approval_status
    buffer_status
    scheduled_at
    posted_at
    buffer_post_id
    failure_reason
    claim_boundary_validation
    operator_notes

### 10. No-claims validation

Before Buffer submission, each post must be checked for prohibited claims:

    Buy
    Pay
    Mint
    Certify
    Convert
    Claim c3 Key
    Join DAO
    Get Recognized
    Enter Marble
    Reserve certification

Also blocked:

    certification claim
    conversion claim
    payment claim
    wallet claim
    c3 Key claim
    DAO claim
    recognition claim
    distribution claim
    Marble readiness claim

### 11. DB mutation boundary

This OAR2 authorizes DB mutation only for:

    Buffer scheduler metadata
    Buffer queue state
    Buffer batch status
    post approval status
    scheduled/post status
    Buffer post identifier if returned
    failure logs with credentials redacted

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

If Cody cannot access Buffer API safely:

    stop before posting
    report missing capability
    output Buffer-ready batch package
    do not attempt browser automation
    do not request raw passwords

If Buffer accepts API scheduling safely:

    use environment-secret token only
    create drafts first unless operator explicitly approves scheduled creation
    record returned Buffer IDs
    write OAR1 closeout

## CODY ROLE

Cody may:

- inspect existing social/media distribution metadata
- seat Buffer scheduler metadata
- prepare Buffer-ready post batches
- create Buffer drafts if API access is safely available
- create scheduled Buffer posts only after operator approval
- update queue status
- record Buffer IDs
- record failures
- validate no-claims boundary
- write OAR1 closeout

Cody may not:

- handle raw platform passwords
- store Buffer API keys in repo, DB, or OAR files
- publish without approval
- auto-reply
- send DMs
- scrape followers
- run engagement automation
- mutate unrelated DB state
- create payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
- route into Marble Chamber

## VALIDATION

Execution is valid only when:

1. Buffer scheduler standing is seated or missing capability is reported.
2. Connected channels are recorded as X, Instagram, and LinkedIn profile.
3. LinkedIn is marked as profile surface, not company page.
4. Batch 001 is prepared from governed queue.
5. Approval-before-schedule rule is seated.
6. Direct platform credential handling remains prohibited.
7. No raw credentials are stored.
8. No direct publishing occurs without approval.
9. Buffer drafts or scheduled posts are created only if capability is available and approval is recorded.
10. Buffer IDs are recorded if returned.
11. Failed submissions record failure reason without credentials.
12. No external URL is invented.
13. No article truth is invented.
14. No pricing appears.
15. No payment appears.
16. No wallet claim appears.
17. No c3 Key issuance appears.
18. No SRC claim appears.
19. No certification claim appears.
20. No conversion claim appears.
21. No DAO claim appears.
22. No permission, recognition, or distribution claim appears.
23. No Marble readiness claim appears.
24. TypeScript validation passes if code changes.
25. Registry build passes if code changes.
26. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_buffer_scheduler_backed_social_publishing_automation_v1.meta.md

OAR1 must include:

- DB/schema surfaces inspected
- Buffer capability standing
- connected channel standing
- LinkedIn profile standing
- records inserted or updated
- exact table names
- Batch 001 standing
- approval standing
- Buffer draft/scheduled standing
- Buffer post IDs if created
- failure reasons if any
- credential handling confirmation
- no-claims confirmation
- files changed if any
- build result if applicable
- TypeScript result if applicable
- git status standing

## CLOSE

Measures Registry governs.

unDrifted publishes.

Buffer schedules.

Social platforms distribute.

Automation prepares and schedules only after approval.

Operator remains the gate.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes.
Buffer schedules.
