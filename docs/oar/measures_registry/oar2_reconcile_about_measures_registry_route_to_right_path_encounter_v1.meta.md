---
document_type: oar2
authority_level: urgent
document_scope: about_measures_registry_route_reconciliation
title: OAR2 — Reconcile About Measures Registry Route to Right-Path Encounter
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: reconcile_about_measures_registry_route_to_right_path_encounter
---

# OAR2 — Reconcile About Measures Registry Route to Right-Path Encounter v1

## OBSERVED

`/about-measures-registry` is rendering a stale/plain white support page.

Media is now loading elsewhere, but this route is visually and structurally misaligned.

The correct About surface already exists in the right-path encounter flow, but the public route does not resolve to that styled encounter state.

## ALIGNED

`/about-measures-registry` must render as the right-path About encounter surface.

It is not a plain content page.

It is part of the Understand the Environment path.

Content remains short and oriented.

Media carries the encounter.

No hardcoded media URLs.

No change to `/undrifted`.

No change to assessment logic.

No change to MAP/payment.

No header/nav tabs.

Footer only.

## ROUTED

### 1. Replace stale About route render

Update `/about-measures-registry` so it renders the styled right-path About encounter surface.

Required first state:

- dark branded Measures Registry background
- Measures Registry mark
- eyebrow: Our Approach
- headline: About Measures Registry
- short position paragraph
- talking-head video present
- video may autoload
- Audio button
- Continue button

### 2. Continue behavior

Continue advances to the next styled About/supporting state.

The next state may include longer support copy, but it must remain styled within the Measures Registry visual system.

No plain white page.

No stale fallback page.

### 3. Add unDrifted bridge block

Add a styled card/block after the About encounter/supporting state:

- eyebrow: Publication
- headline: Read unDrifted
- paragraph: Dispatches from Measures Registry on structural drift, AI operations, and governed environments.
- CTA: Open unDrifted
- route: /undrifted

### 4. Add Connect block

Add a styled card/block:

- eyebrow: Connect
- headline: Connect with Measures Registry
- email: connect@measuresregistry.com
- CTA: Email Measures Registry
- route behavior: mailto:connect@measuresregistry.com

No contact form unless already seated.

### 5. Style contract

Apply the Measures Registry dark visual system:

- dark branded background
- card-based supporting sections
- serif headline
- clean body copy
- cyan/blue accents
- no plain white page
- laptop/mobile fit
- no header nav
- footer only
- media + short orientation copy
- no hardcoded media URLs
- seated media map only

### 6. Scope limits

Do not alter:

- `/undrifted` layout or media work
- root encounter sequence
- assessment questions
- assessment scoring
- contact capture
- MAP/payment
- c3 Field redirect

## CODY ROLE

Cody may update the route renderer and style bindings required for `/about-measures-registry`.

Cody may reuse existing styled right-path components if available.

Cody may add route-specific composition only if it consumes seated runtime/media state.

Cody may not invent DB authority, hardcode media URLs, alter `/undrifted`, or mutate assessment/payment logic.

## VALIDATION

Return proof that:

- `/about-measures-registry` loads styled dark About encounter
- video is present
- video may autoload
- Continue advances to styled supporting content
- unDrifted block routes to `/undrifted`
- Connect block shows `connect@measuresregistry.com`
- mailto CTA works
- no stale white page remains
- laptop screenshot returned
- mobile screenshot if available
- console/network findings returned

## EXPECTED OAR1

docs/oar/measures_registry/oar1_reconcile_about_measures_registry_route_to_right_path_encounter_v1.meta.md

## CLOSE

This OAR reconciles `/about-measures-registry` to the approved right-path encounter model.
