---
document_type: oar2
authority_level: working
document_scope: measures_registry_process_language
title: OAR2 — Clarify Seated vs Registered Standing in Measures Registry Workflow v1
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: process_language_executor
  src: renderer
tags:
  - oar2
  - measures-registry
  - process-language
  - seated
  - registered
  - oar2
  - oar1
  - db-readback
  - codex-first
---

# OAR2 — Clarify Seated vs Registered Standing in Measures Registry Workflow v1

## OBSERVED

Current Measures Registry development uses the sequence:

    thread -> OAR2 -> Cody execution -> DB mutation/readback -> src render -> validation -> OAR1 closeout -> operator close

Language drift has appeared around the terms:

    seated
    registered

The term "seated" has sometimes been used to mean:

- approved in OAR2
- written into DB
- available in runtime
- completed by OAR1

This creates ambiguity.

Operator clarified:

    Seated is not registered.

Operator also clarified that SRC/envKey/envURLs are native background architecture and should not be inserted into the current Measures Registry development flow for public landing, SEO, publication, social, and API contracts.

For this current build, the active distinction must be simple:

    OAR2 seats.
    DB registers.
    OAR1 proves.

This OAR2 clarifies terminology only.

It does not change the active workflow.

## ALIGNED

Authority order remains:

    Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Codex holds authority.

Field structures relation.

Measures registers sequence, access, and reveal.

OAR2 routes executable scope.

Chazz validates and routes.

Cody executes only from OAR2.

src renders registered state only.

OAR1 proves execution closeout.

This aligns with existing OAR lifecycle standing:

    Cody executes from OAR2 only.
    No OAR1 means process is not complete.

It also aligns with the native stack:

    Codex holds.
    Field structures.
    Measures registers.
    Chazz executes.

## ROUTED

### 1. Clarify lifecycle terms

Adopt the following working definitions for Measures Registry development:

    Proposed:
      Thread-only shaping or discussion.
      No file-forming transfer.
      No executable route.

    Seated:
      OAR2-confirmed executable route, contract, scope, or intended asset standing.
      Approved for Cody execution.
      Not DB state by itself.

    Registered:
      Written into governed DB / Measures registry.
      Confirmed by DB readback.
      Operational standing exists only after readback confirms it.

    Rendered:
      src/frontend reads registered state and expresses it.

    Verified:
      DB, build, runtime, browser, route-head, or API validation confirms behavior.

    Proven:
      OAR1 closeout records what happened, what changed, what validated, and what remained held.

    Closed:
      Operator reviews OAR1, accepts standing, and commits/continues.

### 2. Adopt official shorthand

Use the following shorthand in future OARs and closeouts:

    Thread proposes.
    OAR2 seats.
    Cody executes.
    DB registers.
    src renders.
    Validation verifies.
    OAR1 proves.
    Operator closes.

### 3. Prohibit ambiguous use

Do not use "registered" unless DB / Measures readback confirms the record exists.

Do not use "rendered" unless src/runtime/browser validation confirms expression.

Do not use "complete" unless OAR1 exists.

Do not use "seated" as a synonym for DB registration.

Do not treat OAR2 as proof of DB state.

Do not treat committed docs as seeded/registered unless incorporation standing is confirmed.

### 4. Greenfield vs conversion distinction

For current Measures Registry greenfield build:

    New surfaces are created through OAR2.
    OAR2 seats executable scope.
    DB registration proves operational standing.
    OAR1 closes execution.

For future client conversion:

    Existing surfaces may already exist.
    They are discovered, mapped, governed, and registered.
    SRC/envKey/envURLs may become relevant in that conversion context.
    They are not added to the current landing/SEO/publication/social dev flow.

### 5. Required OAR language going forward

Every OAR2 involving DB or registry mutation should state:

    registration_authorized: true | false

If true, OAR2 must define:

    - target DB surface
    - mutation boundary
    - readback requirement
    - validation requirement
    - OAR1 proof requirement

If false, OAR2 seats only and does not authorize DB mutation.

### 6. No workflow change

This OAR2 does not add a new process stage.

This OAR2 does not introduce SRC into current Measures Registry public-site work.

This OAR2 does not alter landing page, SEO, social, Paragraph, Buffer, assessment, or publication behavior.

This OAR2 clarifies terms only.

## CODY ROLE

Cody may:

- update process documentation or operative notes if a process surface exists
- add the seated vs registered distinction to relevant OAR/process references
- preserve current flow
- report where terminology is ambiguous
- write OAR1 closeout

Cody may not:

- mutate public route behavior
- mutate article bodies
- create Paragraph draft
- publish Paragraph article
- schedule Buffer post
- publish social post
- introduce SRC/envKey/envURLs into current dev flow
- create a new lifecycle layer
- mutate DB operational records unless this clarification is stored as process metadata only
- change assessment, scoring, contact gate, result gate, payment, wallet, c3 Key, SRC, certification, conversion, DAO, permission, recognition, distribution, or Marble readiness

## VALIDATION

Execution is valid only when:

1. "Seated" is defined as OAR2-confirmed executable scope.
2. "Registered" is defined as DB/Measures readback-confirmed operational standing.
3. "Seated" is not used as a synonym for registered.
4. "Registered" is not claimed without DB readback.
5. "Complete" is not claimed without OAR1.
6. Current Measures Registry dev flow remains unchanged.
7. SRC/envKey/envURLs are not inserted into the active public-site dev seam.
8. Future conversion distinction is preserved.
9. No route behavior changes.
10. No article body mutation occurs.
11. No Paragraph draft or publish occurs.
12. No Buffer schedule or post occurs.
13. No social post occurs.
14. No payment/c3 Key/SRC/certification/conversion/DAO/permission/recognition/distribution/Marble standing is created.
15. OAR1 is written beside this OAR2.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_clarify_seated_vs_registered_standing_in_measures_registry_workflow_v1.meta.md

OAR1 must include:

- process surface inspected
- docs or metadata updated, if any
- exact files changed, if any
- whether DB mutation occurred
- confirmation that workflow did not change
- confirmation that SRC was not added to active dev flow
- confirmation that seated does not mean registered
- no-publish confirmation
- no-schedule confirmation
- no-claims confirmation
- git status standing

## CLOSE

No new layer.

No workflow change.

Seated means approved executable scope.

Registered means DB-held and readback-confirmed.

Thread proposes.
OAR2 seats.
Cody executes.
DB registers.
src renders.
Validation verifies.
OAR1 proves.
Operator closes.
