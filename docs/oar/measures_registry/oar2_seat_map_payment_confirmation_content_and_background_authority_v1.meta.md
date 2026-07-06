---
document_type: oar2
authority_level: working
document_scope: measures_registry_map_payment_content_background
title: OAR2 — Seat MAP Payment Confirmation Content and Background Authority
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
  cody: browser_visible_executor
  src: encounter_renderer
tags:
  - oar2
  - measures-registry
  - map
  - payment
  - content-model
  - background-authority
  - marble-chamber
  - exchange-composition
---

# OAR2 — Seat MAP Payment Confirmation Content and Background Authority

## OBSERVED

`marble_chamber_C2_agreement` now has corrected exchange composition, but the surface remains content-thin.

The operator has uploaded a governed background asset to Supabase bucket:

- `payment_mapa-background_webp`

The operator also uploaded:

- `official_codexstone_seal.webp`

The payment page should use a governed background, but the payment card must remain the visual authority.

## ALIGNED

What is not registered cannot be governed.

A payment surface must clearly show:

- selected pathway
- exchange amount
- scope
- deliverables
- payment confirmation meaning
- what happens next

The background must support exchange authority.

The background may not compete with the payment confirmation card.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

Seat and render MAP payment confirmation content and background authority for:

- `surface_key: marble_chamber_C2_agreement`

### 1. Seat payment content model

Create or update governed content profile:

- `map_payment_confirmation`

Required fields:

payment_confirmation:
  selected_pathway:
  pathway_name:
  pathway_price:
  pathway_scope_summary:
  pathway_deliverables:
  exchange_statement:
  payment_confirmation_statement:
  post_payment_expectation:

Do not duplicate pricing authority.

Pathway name, price, and deliverables must resolve from existing MAP pathway authority where available.

### 2. Seat background authority

Seat background authority on `marble_chamber_C2_agreement`.

Required metadata:

background_authority:
  background_media_key: payment_mapa-background_webp
  background_treatment: ceremonial_exchange_background
  background_overlay: soft_overlay
  seal_media_key: official_codexstone_seal.webp

Rule:

The payment confirmation surface must retain a governed marble background, but the payment card remains the visual authority. Background supports exchange; it does not compete with exchange.

### 3. Renderer behavior

Renderer may:

- render the governed background asset
- render the official codexstone seal if available
- render payment confirmation content
- show selected pathway and exchange summary
- show deliverables and next steps

Renderer may not:

- invent price
- invent deliverables
- invent certification or conversion claims
- alter Stripe logic
- alter MAP flow
- alter assessment flow

### 4. CSS / composition boundary

CSS may be adjusted only to support the seated background and content model.

Allowed:

- background image placement
- soft overlay
- readable centered payment card
- card section rhythm
- responsive mobile stacking

Not allowed:

- redesign unrelated Marble surfaces
- change C2 compact
- change C2 resolution
- change assessment/report flow

### 5. Browser QA

Validate:

- desktop
- mobile portrait

Required checks:

- background displays
- card remains primary
- text remains readable
- pathway/price/deliverables resolve from authority
- payment button remains functional
- no Stripe logic change
- no unrelated Marble surface visual regression

## CODY ROLE

Cody may:

- inspect existing MAP pathway content authority
- seat payment confirmation content fields
- seat background authority metadata
- wire renderer consumption
- apply scoped CSS for this surface only
- run browser QA
- write OAR1 with evidence

Cody may not:

- invent pricing
- invent deliverables
- create a second payment surface
- change Stripe/payment logic
- alter MAP flow
- alter assessment flow
- alter public claims
- touch unrelated surfaces

## VALIDATION

This OAR resolves when:

- payment confirmation content model is seated
- background authority is seated
- `payment_mapa-background_webp` is used as governed background
- `official_codexstone_seal.webp` is used where appropriate
- renderer displays governed exchange content
- desktop/mobile QA passes
- no payment logic changes occur
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_map_payment_confirmation_content_and_background_authority_v1.meta.md

## CLOSE

The composition now holds.

The remaining payment gap is content and background authority.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.
