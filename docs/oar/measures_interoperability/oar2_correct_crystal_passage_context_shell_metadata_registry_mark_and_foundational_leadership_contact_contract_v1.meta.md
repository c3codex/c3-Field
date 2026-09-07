---
document_type: oar2
authority_level: working
document_scope: crystal_passage_context_shell_metadata_registry_mark_foundational_leadership_contact
title: OAR2 — Correct Crystal Passage Context, Public Shell Metadata, Registry Mark, and Foundational Leadership Contact Contract
status: proposed
version: v1
operator: op044
system: measures_registry
session_scope: measures_interoperability
working_folder: docs/oar/measures_interoperability/
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-registry
  - crystal-chamber
  - understand-environment
  - passage-video
  - metadata-bleed
  - public-shell
  - registry-mark
  - foundational-leadership
  - contact-contract
  - no-commerce
  - no-pricing
  - no-payment
  - no-deployment
source_alignment:
  - OAR1 Hold Marble Chamber Pending c3 Key and Payment Readiness
  - OAR1 Seat Obsidian-to-Marble Passage Video and Marble Pathway Reveal Boundary
  - OAR1 Seat Measures Assessment Evaluation Report Content and Obsidian Styling Contract
  - Measures Registry Operative Concordance Update
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Correct Crystal Passage Context, Public Shell Metadata, Registry Mark, and Foundational Leadership Contact Contract v1

## OBSERVED

Crystal Chamber is the internal education/orientation chamber for the public `Understand the Environment` path.

Live visual review of the Crystal passage route shows:

`/?surface=structure_passage`

Visible issues:

1. Public page displays metadata copy: `video-first education passage`.
2. Video has no sufficient public context copy.
3. Passage surface appears to lack clear audio/mute and next/CTA controls.
4. The Measures Registry mark renders at favicon scale and does not function as an intentional brand anchor.
5. Browser shell exposes unresolved placeholder text: `%VITE_PAGE_TITLE%`.

This is a public-runtime bleed condition.

The Marble Chamber is correctly held. The latest Marble hold OAR1 confirms no Marble reveal content was seated, no pricing was revealed, no payment route rendered, no c3 Key/temp c3 Key mechanics activated, and no deployment occurred.

Marble remains held until IRS/business readiness, crypto/wallet readiness, c3 Key NFT contract readiness, temp c3 Key policy, key issuance/visibility boundary, pricing contract, payment provider route, and no-payment-without-key gate are confirmed.

The operative concordance defines `Understand the Environment` as public education/orientation only. It is not a scored assessment, payment route, c3 Key assignment, SRC binding, governed commerce, permission standing, recognition standing, conversion standing, or certification standing.

The Seed Concordance confirms the native order:

Codex → Field → Measures → Chazz

and preserves that Codex holds authority, Field structures relation, Measures registers sequence/access/reveal, and Chazz renders/routes/validates/executes within role.

The OAR Lifecycle requires Cody to execute from OAR2 only and produce OAR1 before work is complete.

## ALIGNED

This OAR2 corrects Crystal Chamber public rendering and contact invitation handling.

It seats or corrects:

- Crystal passage public context copy
- metadata bleed prohibition
- unresolved browser shell title placeholder
- Understand passage video controls
- Begin Understanding CTA fallback
- sitewide Measures Registry mark sizing/placement contract
- Foundational Leadership contact/message contract
- Foundational Leadership consent and public-safe boundary copy

This OAR2 does not authorize deployment.

It does not seat pricing.

It does not render payment.

It does not activate c3 Key or temp c3 Key mechanics.

It does not activate governed commerce, permission, recognition, conversion, certification, DAO standing, or distribution standing.

Crystal remains:

education + orientation + invitation

Clean chamber boundary:

Crystal educates and invites.
Obsidian evaluates.
Passage carries.
Marble waits.

## ROUTED

### 1. Correct public shell metadata bleed

Correct unresolved browser/page title placeholder.

Visible string:

`%VITE_PAGE_TITLE%`

must not render in browser chrome, document title, HTML shell, or built output.

Preferred correction:

<title>Measures Registry</title>

Cody may use a Vite env title only if it is fully resolved in local dev and built output.

Validation required:

- browser tab title = Measures Registry
- built index.html contains no `%VITE_*%` tokens
- runtime contains no visible `%VITE_PAGE_TITLE%`

Classification:

public shell metadata bleed

This is a shell/title-layer correction, not a DB authority correction.

### 2. Remove Crystal passage metadata bleed

Visible metadata phrase:

`video-first education passage`

must not render publicly.

Add/seat public copy contract:

crystal_passage_public_copy_contract:
  metadata_bleed_disallowed: true
  prohibited_visible_phrases:
    - video-first education passage
    - structure_passage
    - Crystal Chamber
    - material family
  title: Understand the Environment
  context_body: >
    AI systems do not operate in isolation. They interact with workflows,
    roles, approvals, data, outputs, and decisions. This passage explains
    why the operating environment matters before an institution evaluates,
    maps, or restructures AI-facing systems.
  cta_label: Begin Understanding

Public render should be:

Understand the Environment

AI systems do not operate in isolation. They interact with workflows, roles, approvals, data, outputs, and decisions. This passage explains why the operating environment matters before an institution evaluates, maps, or restructures AI-facing systems.

[video]

Begin Understanding

Do not render raw metadata labels as public copy.

### 3. Correct Understand passage video controls

Update the Crystal / Understand passage video contract so the talking-head passage cannot dead-end.

Required behavior:

- video renders from seated media mapping
- audio / mute control renders
- skip / next control renders
- auto-advance is allowed where seated
- CTA fallback renders if auto-advance does not execute
- public visitor can reach the next Understand surface without manual browser navigation

Preferred CTA label:

`Begin Understanding`

Do not use:

- Continue
- Buy now
- Reserve seat
- Proceed to payment

Seat or update scoped metadata:

video_control_contract:
  audio_control_required: true
  mute_control_required: true
  skip_control_required: true
  auto_advance_allowed: true
  cta_fallback_required: true
  cta_label: Begin Understanding
  no_dead_end_surface: true

### 4. Preserve Crystal passage boundary

The Crystal passage video may explain the Understand path and orient the visitor.

It may not render:

- assessment result
- pricing
- payment
- c3 Key
- temp c3 Key
- wallet
- NFT
- C1
- C2
- C3
- commerce circuit
- SRC active
- permission standing
- conversion standing
- certification standing
- DAO standing
- distribution standing

### 5. Seat sitewide Measures Registry mark contract

The current mark is visually too small and reads like an incidental favicon.

Seat sitewide mark styling contract:

sitewide_registry_mark_contract_v1:
  mark_required: true
  size_must_be_intentional: true
  tiny_favicon_scale_disallowed: true
  role: brand_anchor
  public_label_visible: false
  applies_to:
    - threshold
    - crystal
    - obsidian
    - passage
    - held_surfaces
  placement:
    desktop: upper_left
    mobile: upper_left
  desktop_size:
    width_px: 44
    min_width_px: 40
  mobile_size:
    width_px: 34
    min_width_px: 30
  opacity:
    default: 0.72
    hover: 1

Validation required:

- mark no longer renders at tiny/favicon scale
- mark appears intentional on Crystal passage
- mark does not overpower page hierarchy
- mark remains consistent on Crystal, Obsidian, passage, and held surfaces where present

### 6. Seat Foundational Leadership contact contract

Foundational Leadership is a non-commerce leadership invitation surface.

Seat or update:

`foundational_leadership_contact_contract_v1`

Contract body:

contract_key: foundational_leadership_contact_contract_v1
contract_type: public_contact_message
public_label: Request a Foundational Leadership Conversation
commerce_entry: false
pricing_allowed: false
payment_allowed: false
key_mechanics_allowed: false
internal_route_visible: false
public_runtime_allowed: true
message_delivery_required: true
consent_required: true

### 7. Define Foundational Leadership contact fields

Required fields:

required_fields:
  - field_key: institution_name
    public_label: Institution / Organization Name
    type: text
    required: true

  - field_key: contact_name
    public_label: Contact Name
    type: text
    required: true

  - field_key: contact_email
    public_label: Email
    type: email
    required: true

  - field_key: role_title
    public_label: Your Role / Title
    type: text
    required: true

  - field_key: message
    public_label: Message
    type: textarea
    required: true

Optional fields:

optional_fields:
  - field_key: website
    public_label: Website
    type: url
    required: false

  - field_key: measures_registry_updates_opt_in
    public_label: I would like to receive future Measures Registry updates.
    type: checkbox
    required: false

### 8. Seat required consent and boundary acknowledgment

Required checkbox:

consent_fields:
  - field_key: foundational_leadership_contact_consent
    public_label: I agree to be contacted about a Foundational Leadership conversation.
    type: checkbox
    required: true

Public-safe boundary acknowledgment:

boundary_acknowledgment:
  field_key: foundational_leadership_boundary_acknowledgment
  public_label: I understand this request begins a conversation only. It does not create approval, enrollment, implementation, or verified registry status.
  type: checkbox
  required: true

Public helper copy:

Request a Foundational Leadership conversation with Measures Registry.

Boundary note:

This request begins a conversation only. It does not create approval, enrollment, implementation, or verified registry status.

Do not use:

- permission standing
- DAO standing
- payment standing
- c3 Key standing
- conversion standing
- certification standing
- commerce circuit
- C1
- C2
- C3

### 9. Message delivery boundary

The contact contract may prepare a message/request for Measures Registry.

Message delivery may use the seated contact/email provider in a later implementation route.

If implemented in this route, Cody must validate:

- no payment is triggered
- no key mechanics are triggered
- no standing is granted
- no Marble route is opened
- message delivery state is recorded or safely reported

If message delivery cannot be safely implemented:

seat the contract and render held-safe submission copy

### 10. Preserve Foundational Leadership non-commerce standing

Foundational Leadership remains:

commerce_entry: false
public_pathway: Foundational Leadership
internal_route: leadership_invitation
pricing_allowed: false
payment_allowed: false
key_mechanics_allowed: false

Foundational Leadership is an invitation surface, not a commerce route.

### 11. Runtime validation requirements

After seating, Cody must validate locally:

- browser tab title does not show `%VITE_PAGE_TITLE%`
- built index.html contains no unresolved `%VITE_*%` tokens
- Understand passage page does not show `video-first education passage`
- Understand passage page does not show raw route/metadata labels
- Understand passage has public context copy
- Understand passage video renders
- audio / mute control renders
- skip / next control renders
- CTA fallback renders
- CTA label is Begin Understanding
- passage is not a dead-end
- Measures Registry mark is intentionally sized
- Foundational Leadership contact form renders
- required contact fields render
- required consent fields render
- optional updates opt-in renders
- no pricing renders
- no payment renders
- no key mechanics render
- no C1/C2/C3 renders
- no commerce circuit renders
- no permission/conversion/certification/DAO/distribution standing renders

### 12. Produce OAR1

OAR1 must include:

- execution summary
- DB mutation summary
- public shell metadata correction standing
- Crystal passage metadata bleed correction standing
- Crystal passage public context copy standing
- Crystal passage video control standing
- audio / mute control standing
- CTA fallback standing
- sitewide registry mark contract standing
- Foundational Leadership contact contract standing
- contact field standing
- consent / acknowledgment standing
- message delivery boundary standing
- public/internal boundary verification
- runtime validation result
- build validation result
- deployment standing
- recommended next route

## CODY ROLE

Cody may:

- correct browser title / shell metadata bleed
- remove public metadata bleed from Crystal passage
- add public context copy
- correct Crystal passage video control contract
- add audio / mute control
- add skip / next control
- add Begin Understanding CTA fallback
- seat sitewide registry mark sizing/placement contract
- seat Foundational Leadership contact/message contract
- seat contact fields
- seat required consent and boundary acknowledgment
- preserve non-commerce Foundational Leadership standing
- validate local runtime
- produce OAR1

Cody may not:

- deploy
- seat pricing
- render payment
- activate c3 Key/temp c3 Key mechanics
- expose C1/C2/C3 publicly
- expose commerce circuit publicly
- expose SRC active mechanics publicly
- activate MAP execution
- activate guided asset creation
- activate governed commerce
- activate payment/permission/conversion/certification/DAO/distribution standing
- mutate Seed Concordance
- mutate The 21 of Coherence
- skip OAR1

## VALIDATION

This OAR2 resolves successfully when:

1. Browser title no longer shows `%VITE_PAGE_TITLE%`.
2. Built output contains no unresolved `%VITE_*%` placeholders.
3. Crystal passage no longer renders `video-first education passage`.
4. Crystal passage renders public context copy.
5. Crystal passage video has audio / mute control.
6. Crystal passage video has skip / next control.
7. Crystal passage video has CTA fallback.
8. CTA label is Begin Understanding.
9. Passage no longer dead-ends.
10. Measures Registry mark is intentionally sized and governed by sitewide contract.
11. Foundational Leadership contact contract is seated.
12. Required contact fields are seated.
13. Required contact consent is seated.
14. Public-safe boundary acknowledgment is seated.
15. Foundational Leadership remains non-commerce.
16. No pricing, payment, c3 Key/temp c3 Key mechanics, C1/C2/C3, commerce circuit, SRC active mechanics, permission, conversion, certification, DAO, or distribution standing renders publicly.
17. No deployment occurs.
18. OAR1 is produced.

## EXPECTED OAR1

docs/oar/measures_interoperability/oar1_correct_crystal_passage_context_shell_metadata_registry_mark_and_foundational_leadership_contact_contract_v1.meta.md

## CLOSE

Crystal educates.

Crystal invites.

Crystal does not sell.

Crystal does not key.

Crystal does not grant standing.

No metadata bleed.

No unresolved shell tokens.

The mark becomes intentional.

Obsidian evaluates.

Passage carries.

Marble waits.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody executes from OAR2 only.
src renders seated state only.
