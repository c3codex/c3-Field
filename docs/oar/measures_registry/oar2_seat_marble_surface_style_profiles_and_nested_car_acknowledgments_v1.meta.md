---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seat Marble Surface Style Profiles and Nested CAR Acknowledgments
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat Marble Surface Style Profiles and Nested CAR Acknowledgments

## OBJECTIVE

Seat Marble Chamber surface style profiles for:

- Marble Orientation
- Assessment Results
- MAP the Environment
- Payment
- Confirmation

Use textless Supabase background surfaces.

Style overlays live DB content on top of surface assets.

## OBSERVED

Current Marble render drift includes:

- stale `/map-integrity-governance` page
- black text on white page
- document-style layout
- pricing exposed in stale structure
- MAP presentation not aligned to Marble encounter
- authority presentation broken
- background assets generated with embedded text must not be used as content authority

Uploaded/available Supabase assets:

- `marble_orientation_surface.webp`
- `marble_results_surface.webp`
- `map_surface.webp`

Bucket:

- `measures-registry`

## ALIGNED

Marble sequence:

    marble_chamber_orientation
        ↓
    marble_chamber_results
        ↓
    marble_chamber_C2_compact
        ↓
    marble_chamber_C2_agreement
        ↓
    marble_chamber_C2_resolution

Recommendation model:

- Everyone receives: `MAP the Environment`
- Assessment determines:
  - deployment status
  - operational scoring
  - highest observed conditions
  - MAP review pathway
  - exchange amount

Pricing tiers remain:

- MAP Foundational Review — $333
- MAP Optimization Review — $777
- MAP Remediation Review — $999

No `contract` terminology.

Use:

- assessment_findings_standing
- map_pathway_standing
- map_exchange_standing
- nested CAR acknowledgments

Native order:

Codex holds.
Systems align.
Measures governs.
Field arranges.
Roles authorize.
Optics prove.

## SURFACE ASSET MAP

Seat or verify media locators:

### Marble Orientation

media_role:

    marble_orientation_surface

storage_bucket:

    measures-registry

storage_path:

    marble_orientation_surface.webp

surface:

    marble_chamber_orientation

### Marble Results

media_role:

    marble_results_surface

storage_bucket:

    measures-registry

storage_path:

    marble_results_surface.webp

surface:

    marble_chamber_results

### Marble MAP

media_role:

    marble_map_surface

storage_bucket:

    measures-registry

storage_path:

    map_surface.webp

surface:

    marble_chamber_C2_compact

## STYLE PROFILE 1 - MARBLE ORIENTATION

style_profile_key:

    marble_orientation_surface_profile

surface:

    marble_chamber_orientation

background:

    marble_orientation_surface

layout:

    contained_media_panel
    copy_below_media
    centered_cta

tone:

    ceremonial_transition
    warm_white_gold
    marble

Required copy source:

    DB-held content profile only

Content intent:

    ASSESSMENT COMPLETE

    Environmental conditions have been identified.

    Remain on this page while your findings
    and recommendations are prepared.

    Generating Environmental Risk Report
    & Operations Review.

CTA:

    Continue

Route:

    marble_chamber_results

Rules:

- media must not fill the whole page
- surface background remains visible
- no black-on-white default page
- no fake text embedded from image
- no report content on this surface

## STYLE PROFILE 2 - MARBLE RESULTS

style_profile_key:

    marble_results_surface_profile

surface:

    marble_chamber_results

background:

    marble_results_surface

layout:

    findings_report_panel
    conditions_left
    environment_summary_right
    recommendation_bottom

tone:

    institutional_briefing
    warm_white_gold
    marble

Content authority:

    assessment_findings_standing

Required dynamic outputs:

- highest observed conditions
- deployment status
- operational standing
- recommendation: MAP the Environment
- selected MAP pathway
- exchange tier

Rules:

- pull top risk conditions from scoring output
- do not invent conditions
- do not expose stale MAP page
- do not show payment as the primary action
- CTA routes to MAP the Environment

CTA:

    Continue to MAP

## STYLE PROFILE 3 - MAP THE ENVIRONMENT

style_profile_key:

    marble_map_surface_profile

surface:

    marble_chamber_C2_compact

background:

    marble_map_surface

layout:

    three_panel_map

left_panel:

    nested_car_acknowledgments

center_panel:

    map_recommendation

right_panel:

    map_summary_exchange

tone:

    governed_review
    formal_marble
    warm_white_gold

## MAP LEFT PANEL - NESTED CAR ACKNOWLEDGMENTS

Use seven expandable CAR units.

Parent key:

    c3_7_acknowledgment

Interaction:

    open
    read
    confirm
    collapse
    show confirmed state

Items:

1. parties
2. scope
3. access_boundary
4. review_method
5. delivered_findings
6. payment_of_scope
7. receipt_and_access

Completion rule:

    all seven child CAR confirmations required before continue_to_payment is enabled

Rules:

- each CAR opens separately
- each CAR confirms separately
- parent completion cannot be manually bypassed
- confirmation state should be session-held or DB-held according to current capture standing
- no single giant checkbox as substitute

## MAP CENTER PANEL

Content:

    MAP the Environment

    Measure • Audit • Prepare

Dynamic:

- recommendation: MAP the Environment
- highest observed conditions
- selected review pathway
- review description

Keep or restore marble sphere/plinth visual if available from existing assets or CSS.

Do not embed text inside image.

## MAP RIGHT PANEL

Content source:

    map_pathway_standing
    map_exchange_standing

Dynamic fields:

- review type
- delivered findings
- review scope
- method
- exchange amount

Tier mapping:

    MAP Foundational Review  -> $333
    MAP Optimization Review  -> $777
    MAP Remediation Review   -> $999

CTA:

    Continue to Payment

Enable condition:

    c3_7_acknowledgment.complete = true

## STYLE PROFILE 4 - PAYMENT

style_profile_key:

    marble_payment_surface_profile

surface:

    marble_chamber_C2_agreement

background:

    reuse marble_map_surface unless distinct payment surface exists

layout:

    centered_exchange_card

Content:

- selected review pathway
- exchange amount
- payment-of-scope notice
- no SEAT claim
- no certification claim
- no c3 Key claim
- no DAO claim

CTA:

    Continue to Payment

## STYLE PROFILE 5 - CONFIRMATION

style_profile_key:

    marble_confirmation_surface_profile

surface:

    marble_chamber_C2_resolution

background:

    reuse marble_orientation_surface unless distinct confirmation surface exists

layout:

    receipt_access_confirmation

Content:

- payment received
- receipt issued
- survey/access next step
- confirmation standing

CTA:

    Finish

## DEPRECATE ACTIVE STALE SURFACE

The active `/map-integrity-governance` standalone page is stale.

Cody must:

- identify route source
- remove from active public flow
- keep only as legacy alias if needed
- prevent it from rendering black text on white page as active MAP authority
- ensure active MAP is rendered through Marble C2 compact

Allowed status if retained:

    legacy_route_alias
    deprecated_reference
    audit_trace

Not allowed:

    active MAP encounter surface

## DB HELD REQUIREMENTS

Seat or verify DB-held records for:

- style_profile keys
- surface background media locators
- content profile assignment
- assessment_findings_standing
- map_pathway_standing
- map_exchange_standing
- nested CAR acknowledgment metadata
- CTA enable conditions

No frontend-owned truth.

No CSS-owned content authority.

No image-owned content authority.

## CODY ROUTE

Cody must:

1. Verify Supabase media rows for the three surface assets.
2. Add missing media rows if needed.
3. Seat style profiles in DB metadata.
4. Update Marble renderer to consume profile-driven layout.
5. Create/repair `marble_chamber_results` surface if missing.
6. Remove stale active `/map-integrity-governance` flow.
7. Implement nested CAR behavior on MAP surface.
8. Ensure all live text is rendered from DB content profiles.
9. Ensure MAP CTA is locked until all seven CAR units are confirmed.
10. Run TypeScript/build validation.
11. Write OAR1 with screenshots and route evidence.

## DO NOT TOUCH

This OAR does not authorize:

- scoring mutation
- pricing mutation
- Stripe mutation
- assessment question changes
- report copy rewrite beyond DB profile seating
- SEAT activation
- c3 Key activation
- DAO activation
- certification language
- concordance update
- public navigation restructure outside stale MAP route removal

## REQUIRED OAR1 TABLE

OAR1 must include:

- surface
- style_profile_key
- media_role
- storage_path
- DB source
- renderer action
- route result
- validation result
- remaining gap

Minimum rows:

- marble_chamber_orientation
- marble_chamber_results
- marble_chamber_C2_compact
- marble_chamber_C2_agreement
- marble_chamber_C2_resolution
- nested CAR acknowledgment
- stale `/map-integrity-governance` route

## VALIDATION

Validation succeeds when:

- Marble Orientation uses `marble_orientation_surface.webp`
- media is contained, not fullscreen
- Assessment Results uses `marble_results_surface.webp`
- MAP uses `map_surface.webp`
- MAP layout has left / center / right sections
- MAP text is rendered from DB, not image
- nested CARs open/read/confirm separately
- Continue to Payment is locked until all seven CARs confirm
- pricing tiers remain $333 / $777 / $999
- everyone receives MAP the Environment recommendation
- selected review pathway/exchange is determined by assessment standing
- stale `/map-integrity-governance` no longer appears as active authority
- no certification/SEAT/c3 Key/DAO claim is introduced
- TypeScript/build passes or exact failure is reported

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1.meta.md

## CLOSE

Marble does not sell.

Marble confirms findings.
Marble presents MAP.
Marble governs acknowledgment.
Marble routes exchange.

Codex holds.
Systems align.
Measures governs.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
