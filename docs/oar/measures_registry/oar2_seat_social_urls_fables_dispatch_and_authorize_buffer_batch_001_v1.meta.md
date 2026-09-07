---
document_type: oar2
authority_level: working
document_scope: social_campaign_launch_authority
title: OAR2 — Seat Social URLs, Fables Dispatch, and Authorize Buffer Batch 001
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: seat_social_urls_fables_dispatch_and_authorize_buffer_batch_001
source_oar1:
  - docs/oar/measures_registry/oar1_verify_social_campaign_activation_standing_v1.meta.md
  - docs/oar/measures_registry/oar1_verify_paragraph_publishing_access_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
tags:
  - oar2
  - social-campaign
  - buffer
  - paragraph
  - undrifted
  - fables-and-myths
  - launch
---

# OAR2 — Seat Social URLs, Fables Dispatch, and Authorize Buffer Batch 001 v1

## OBSERVED

Buffer access is confirmed.

Connected launch channels are confirmed:

- X: https://twitter.com/measures_c3
- Instagram: https://instagram.com/measures_registry
- LinkedIn: https://www.linkedin.com/in/measures-registry

Paragraph publishing access is confirmed for unDrifted.

Fables and Myths is confirmed published:

- https://paragraph.com/@undrifted/fables-and-myths

Agents With Keys remains unpublished and must stay held.

Facebook is not connected and is not in launch scope.

## ALIGNED

Seat only confirmed public targets.

Authorize Buffer Batch 001 scheduling only for confirmed connected channels.

Do not publish to Paragraph.

Do not create Agents With Keys.

Do not add Facebook.

Do not mutate root authority, encounter sequence, MAP/payment, About Measures Registry, SEAL, certification, DAO, SRC, c3 Key, or conversion standing.

## ROUTED

### 1. Seat social URLs

Update `/undrifted` social manifest from held to active for:

- X: https://twitter.com/measures_c3
- Instagram: https://instagram.com/measures_registry
- LinkedIn: https://www.linkedin.com/in/measures-registry

Remove or keep Facebook held/absent according to current schema, but do not display Facebook as active.

### 2. Seat Fables and Myths dispatch authority

Create or update publication dispatch authority for:

- publication_key: undrifted
- dispatch_key: fables_and_myths
- title: Fables and Myths
- status: published
- article_url: https://paragraph.com/@undrifted/fables-and-myths
- internal_route: fables-and-myths
- overlay_behavior: open_on_top_of_undrifted

If onsite body content is required and absent, use Paragraph URL as confirmed external article authority and keep body as external_link_only. Do not invent body content.

### 3. Preserve Agents With Keys held state

Agents With Keys remains:

- unpublished
- media available
- no article route
- no Paragraph URL
- no publication access

### 4. Authorize Buffer Batch 001 scheduling

Authorize scheduling of existing Buffer Batch 001 launch-ready package only.

Channels:

- X
- Instagram
- LinkedIn

CTA route:

- https://measuresregistry.com/undrifted

Do not post immediately unless the existing batch explicitly schedules future times.

Do not alter copy unless URLs require replacement.

Do not schedule Facebook.

Do not publish Paragraph articles.

### 5. Validation

Return evidence for:

- social URLs seated and active
- Facebook not active
- Fables dispatch seated with confirmed Paragraph URL
- Agents With Keys remains held
- Buffer Batch 001 scheduled or held with reason
- connected channels used
- scheduled times
- post IDs returned by Buffer if scheduled
- no Paragraph publish occurred
- no MAP/payment/root authority mutation occurred

## CODY ROLE

Cody may:

- update seated social URL records
- update Fables dispatch authority
- schedule existing Buffer Batch 001 if all required channel/CTA data is valid
- return validation evidence

Cody may not:

- invent URLs
- create Facebook standing
- publish Paragraph content
- create Agents With Keys
- change launch copy beyond required URL binding
- mutate root authority
- mutate MAP/payment
- expose credentials

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_social_urls_fables_dispatch_and_authorize_buffer_batch_001_v1.meta.md

## CLOSE

After OAR1 confirms social URL seating, Fables dispatch, and Buffer scheduling, proceed to deployment/live verification.
