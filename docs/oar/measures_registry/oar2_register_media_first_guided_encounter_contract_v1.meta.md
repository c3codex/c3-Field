---
document_type: oar2
authority_level: urgent
document_scope: encounter_contract_registration
title: OAR2 — Register Media-First Guided Encounter Contract
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: register_media_first_guided_encounter_contract
---

# OAR2 — Register Media-First Guided Encounter Contract v1

## OBSERVED

Measures Registry runtime has drifted toward normal website behavior.

The approved structure is not a content-first website.

Measures Registry is a media-first guided encounter.

Media carries the encounter.
Content orients the visitor.
Actions advance state.

## ALIGNED

Register the approved encounter contract as runtime authority.

No generic website assumptions.
No header/nav tabs.
Footer only.
No hardcoded truth.
No stale campaign authority.
No deprecated Crystal Chamber runtime authority.

All surfaces must resolve as one of:

- encounter
- passage
- assessment
- result
- publication cover

If a rendered surface cannot be classified, it is not seated.

## APPROVED CONTRACT

### Root

Route: /

Behavior:

- headline: AI Isn't Broken. Systems Are.
- media first
- media autoload
- continue action
- next: path_choice
- eyebrow max: 1 line
- paragraph max: 3 sentences

### Path Choice

Behavior:

- both left/right media visible
- left label: Assess the Environment
- right label: Understand the Environment
- headline required
- short paragraph optional

### Left Path

Order:

1. passage media autoload
2. eyebrow + short paragraph
3. assessment at /ai-operations-assessment
4. one question at a time
5. contact capture required before result
6. results passage media + short orientation content
7. results
8. MAP AI Environment
9. c3 7s acknowledgment required before payment
10. payment

### Right Path

Order:

1. talking-head encounter autoload
2. eyebrow + short position paragraph
3. About Measures Registry at /about-measures-registry
4. About video present but not autoplay
5. supporting content if it fits frame
6. footer c3 Field link to https://c3field.online

### /undrifted

Type: publication cover.

It is not part of the main encounter sequence.

Purpose:

Measures Registry launch publication cover and dispatch surface.

Must include:

- questions_ungoverned_systems_cannot_answer media
- eyebrow max 1 line
- paragraph max 3 sentences
- two article cards
- Assess Your AI Environment callout
- Leadership callout
- X, Instagram, LinkedIn if seated
- Facebook absent

Dispatch:

- article click opens overlay or seated Paragraph route
- assessment click routes to /ai-operations-assessment
- about click routes to /about-measures-registry
- leadership click routes to https://c3field.online

## FRAME CONTRACT

Viewport:

- root scroll: false
- encounter scroll: false
- left path scroll: false
- right path scroll: false
- publication cover scroll: allowed if required

Layout:

- laptop fit required
- mobile fit required
- clamp sizing required
- split overlong content into additional surfaces
- content must not be forced into scroll inside encounter surfaces

Style:

- header: false
- footer: true
- branded backgrounds
- media priority: primary
- text priority: orientation only

## ROUTED

### 1. Register encounter contract

Create or update registry contract record for this approved map.

Return:

- registry key
- sequence map
- route map
- surface classifications

### 2. Reconcile runtime

Update runtime so the approved contract controls:

- root encounter
- path choice
- left path
- right path
- /undrifted publication cover
- /about-measures-registry route
- /c3field external redirect

### 3. Reconcile /undrifted

Replace publication-index-only rendering with publication cover dispatch.

Do not place /undrifted inside the encounter sequence.

### 4. Reconcile /ai-operations-assessment

Ensure /ai-operations-assessment opens assessment encounter behavior.

The assessment renders one question at a time.

If approved Q1-Q7 content is missing in DB, return missing authority and do not hardcode.

### 5. Reconcile /about-measures-registry

Seat /about-measures-registry as right-path About page.

Video must be present but not autoplay.

### 6. Preserve c3 Field boundary

/c3field remains external redirect to:

https://c3field.online

Do not create internal c3 Field renderer in Measures Registry.

### 7. Build and deploy

Build registry runtime.

Commit.

Push to measures branch.

### 8. Browser QA

Required proof:

- / root intro media loads
- path choice displays both media choices
- left path passage autoloads
- assessment renders one question at a time
- contact capture follows assessment
- results passage renders
- right path talking-head autoloads
- /about-measures-registry renders and video does not autoplay
- /undrifted renders as publication cover
- /undrifted dispatch links work
- /c3field redirects externally
- no Facebook
- laptop screenshot
- mobile screenshot if available
- console/network findings

No browser proof = no verified launch.

## VALIDATION

Return:

- DB contract evidence
- route map before/after
- sequence map before/after
- media map evidence
- deployed commit
- production verification
- screenshots if available
- remaining held authority
- final SEAT standing

## EXPECTED OAR1

docs/oar/measures_registry/oar1_register_media_first_guided_encounter_contract_v1.meta.md

## CLOSE

Measures Registry is a media-first guided encounter.

Content orients.
Media carries.
Actions advance.

Runtime must render that contract or remain held.
