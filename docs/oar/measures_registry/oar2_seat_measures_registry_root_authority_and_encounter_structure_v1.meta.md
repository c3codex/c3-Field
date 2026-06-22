---
document_type: oar2
authority_level: working
document_scope: root_authority_and_encounter_structure
title: OAR2 — Seat Measures Registry Root Authority and Encounter Structure
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: seat_measures_registry_root_authority_and_encounter_structure
source_oar1:
  - docs/oar/measures_registry/oar1_root_authority_isolation_failure_audit_v1.meta.md
  - docs/oar/measures_registry/oar1_seat_root_route_authority_before_seat_launch_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
tags:
  - oar2
  - measures-registry
  - root-authority
  - seat-folder
  - encounter-structure
  - undrifted
  - assessment
  - payment
  - about-measures-registry
---

# OAR2 — Seat Measures Registry Root Authority and Encounter Structure v1

## OBSERVED

Root authority is currently held because no active registry record governs `/`.

Prior audit confirmed:

- root_authority_rows: 0
- root manifest or route binding: missing
- renderer owns root choice through source fallback
- SEAT launch unauthorized until explicit root authority exists

The live encounter structure is now clarified and must be seated as registry authority before SEAT launch.

## ALIGNED

Seat the current Measures Registry encounter structure.

Do not preserve renderer-owned root truth.

Do not create fallback route truth.

Do not redesign MAP or payment.

Do not change MAP pricing, payment terms, or checkout logic.

Do not create SEAL, certification, DAO standing, c3 Key, SRC binding, or conversion standing.

Preserve approved live assessment-to-MAP-to-payment continuation.

Authority order:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Runtime

Frontend renders seated state only.

## ROUTED

### 1. Seat root authority

Create or update one explicit active root registry authority record.

Required standing:

- route_path: /
- route_authority: registry
- frontend_role: renderer
- runtime_surface: intro_hook
- root route resolves from registry state
- no renderer-owned root default
- no client-side root preference
- no hardcoded redirect as authority

If schema requires registry_key, use stable key:

measures_registry_root

### 2. Root encounter sequence

Seat root sequence:

/ -> intro_hook -> path_choice

intro_hook:

- headline: AI isn't broken. Systems are.
- media: intro_hook.mp4
- storage: L2
- controls: audio, continue
- next: path_choice

path_choice:

Left:

- label: Assess the Environment
- motion_media: left_hero_fracture_motion.mp4
- poster_media: left_hero_fracture.webp
- next: structural_coherence_explainer

Right:

- label: Understand the Environment
- motion_media: right_measured_hero_motion_graphic.mp4
- poster_media: right_measured_hero.webp
- next: measures_structured_environments

### 3. Left path sequence

Seat left path:

Assess the Environment
-> structural_coherence_explainer
-> assessment
-> contact_capture
-> result
-> MAP continuation
-> payment
-> confirmation email
-> separate login email notice

Media:

- structural_coherence_explainer_45s.mp4

Preserve existing assessment, scoring, MAP continuation, payment, and checkout logic.

No separate assessment landing page.

Assessment occurs before contact capture.

Payment confirmation email must include notice:

Login details will arrive in a separate email.

### 4. Right path sequence

Seat right path:

Understand the Environment
-> measures_structured_environments
-> about_measures_registry

Media:

- measures_structured_environments.mp4

Content may be shortened from current screenshot copy but must preserve meaning:

- systems are broken
- institutions govern those systems
- AI deployed into broken systems scales broken systems
- the goal is governable environments

Final passage line:

The goal is governable environments.

### 5. About Measures Registry

Seat About Measures Registry as public encounter.

Route / encounter key:

about_measures_registry

Media:

- about_measures_registry.mp4
- storage: L2

Seal:

- official_codexstone_seal
- storage: Supabase

Content:

Title:
About Measures Registry

Intro:
Shared systems governance for institutions deploying AI.

Objective eyebrow:
Objective

Objective:
Preserve institutional accountability.

Action eyebrow:
Action

Action:
Establish shared systems governance.

Result eyebrow:
Result

Result:
Institutions remain accountable for the systems they govern, the AI they deploy, and the people they serve.

Seal copy:
Measures Registry
A governed system of record.
The stone remembers.

### 6. c3 Field / Our Story access

Seat c3 Field / Our Story as gated or intentional access only.

Entry points:

- /undrifted Leadership callout
- footer link text: Registered Branch of c3 Field

Do not place c3 Field / Our Story in the default root right-path sequence.

Do not expose protected internal architecture.

### 7. Undrifted

Seat /undrifted as public publication / encounter selector.

Hero media:

- questions_ungoverned_systems_cannot_answer

Featured articles only:

- Agents With Keys
- Fables and Myths

Behavior:

- article selections open on top of page / overlay
- do not navigate away from /undrifted unless current runtime requires external Paragraph behavior
- use available bucket media for Agents With Keys if article remains unpublished

Remove / do not show:

- Measures Registry article card
- Structural Drift article card
- Agents of Chaos article card

Add institutional teaser:

- About Measures Registry teaser
- link to about_measures_registry

Add leadership callout:

- link to c3 Field / Our Story

### 8. Renderer repair

Update renderer so `/` resolves from seated registry root authority.

Remove or neutralize initialSurface root authority.

Renderer must not own root encounter selection.

If root registry authority cannot resolve, render neutral held / missing authority state.

Do not fall back to intro, path_choice, /undrifted, or any hardcoded surface.

### 9. Validation

Return evidence for:

- root registry record exists
- `/` resolves from registry authority
- initialSurface no longer owns root
- intro_hook resolves from registry
- path_choice resolves from registry
- left path order is assessment before contact_capture
- right path continues through measures_structured_environments then about_measures_registry
- /undrifted article set contains only Agents With Keys and Fables and Myths
- About teaser links to about_measures_registry
- leadership callout and footer link access c3 Field / Our Story
- MAP/payment continuation remains live and unchanged
- confirmation email includes separate login email notice

## CODY ROLE

Cody may:

- seat missing root registry authority
- add or update required registry route/encounter records
- bind media mappings
- bind public content records
- update renderer to read root authority from registry
- preserve existing live MAP/payment flow
- return validation evidence

Cody may not:

- invent fallback truth
- hardcode root authority
- redesign pages beyond required seating
- change MAP/payment pricing or terms
- expose private SEAT pricing
- create SEAL claim
- create certification standing
- create DAO standing
- create c3 Key
- create SRC binding
- create conversion standing
- bypass registry authority

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md

## CLOSE

After OAR1 confirms root authority and encounter structure are seated, verify SEAT launch from live runtime.
