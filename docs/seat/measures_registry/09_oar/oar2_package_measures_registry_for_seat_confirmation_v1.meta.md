---
document_type: oar2
authority_level: working
document_scope: seat_confirmation_package
title: OAR2 — Package Measures Registry for SEAT Confirmation v1
status: confirmed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor
tags:
  - oar2
  - measures-registry
  - seat-confirmation
  - package
  - contracts
  - encounters
  - integrations
  - automation
  - mrm
  - memory
---

# OAR2 — Package Measures Registry for SEAT Confirmation v1

## OBSERVED

Measures Registry needs a bounded SEAT confirmation package before it can be reviewed as a registered system candidate.

Current standing:

- Measures Registry is active as a launch system surface.
- Epigraph has been hardened as a landed-signal route, not its own runtime.
- Landing pages emit landing_signal.
- Epigraph routes landed signal to the current valid encounter.
- unDrifted is currently both a landing-signal surface and Lapis encounter surface.
- unDrifted requires:
  - integrated Paragraph surface contract
  - integrated social media campaign contract
  - C1 commerce contact-consent exchange
  - MRM continuity governed by Memory-aligned governance, not chamber authority
- unDrifted may call Obsidian for ai_operations_assessment.
- Chamber directories govern encounter placement, runtime permission, and visibility.
- Chamber directories do not govern MRM, registered contacts, relationship continuity, signal truth, conversion, or certification.
- Paragraph environment variables already exist.
- Remaining requirement is registered integration/automation, not credential setup.

Current risk:

- Contracts, encounters, integrations, runtime surfaces, media references, and validation surfaces are not yet contained in one SEAT review package.
- Without containment, Cody may execute from scattered thread memory or source fragments.
- Without containment, SEAT confirmation could accidentally imply registration, Marble activation, MAP activation, c3 Key assignment, payment, conversion, certification, or field access.

## ALIGNED

Create a bounded SEAT confirmation package at:

docs/seat/measures_registry/

This package is a review and evidence surface only.

It does not replace Codex authority.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

The package must preserve these distinctions:

- Epigraph = landed-signal routing behavior
- Landing = visible signal-capture surface
- Encounter = runtime-owned surface
- Chamber directory = encounter placement authority
- surface_key = post-execution asset placement evidence
- MRM = registered relationship continuity
- MRM governance = Memory-aligned governance
- C1 commerce = value-for-contact-consent
- Payment = inactive
- c3 Key = inactive
- Field access = inactive
- Marble = inactive
- MAP = inactive
- SEAT registration = not yet granted
- Conversion/certification = inactive

## ROUTED

Create the following folder structure:

docs/seat/measures_registry/
  00_index/
  01_contracts/
  02_encounters/
  03_chamber_directories/
  04_integrations/
  05_automation/
  06_runtime_surfaces/
  07_media_assets/
  08_mrm_contact_memory/
  09_oar/
  10_validation/
  seat_manifest.meta.md

Create the package files listed in this OAR2.

Cody must create or normalize the following files:

00_index:
- measures_registry_seat_index.meta.md
- surface_inventory.meta.md
- dependency_map.meta.md

01_contracts:
- epigraph_landed_signal_route_contract.meta.md
- undrifted_lapis_encounter_contract.meta.md
- paragraph_integrated_surface_contract.meta.md
- social_media_campaign_contract.meta.md
- mrm_memory_governance_contract.meta.md

02_encounters:
- undrifted_encounter.meta.md
- ai_operations_assessment_encounter.meta.md
- landing_signal_to_encounter.meta.md

03_chamber_directories:
- lapis_directory.meta.md
- obsidian_directory.meta.md
- marble_directory_held.meta.md
- crystal_seat_held.meta.md

04_integrations:
- paragraph_undrifted_integration.meta.md
- x_social_surface.meta.md
- facebook_social_surface.meta.md
- instagram_social_surface.meta.md
- cloudflare_r2_media_surface.meta.md
- supabase_media_surface.meta.md

05_automation:
- undrifted_publish_automation.meta.md
- undrifted_social_campaign_automation.meta.md
- campaign_replacement_rule.meta.md

06_runtime_surfaces:
- landing_signal_runtime.meta.md
- undrifted_runtime_surface.meta.md
- assessment_runtime_surface.meta.md
- cody_runtime_execution_contract.meta.md

07_media_assets:
- undrifted_media_manifest.meta.md
- r2_asset_map.meta.md
- supabase_asset_map.meta.md

08_mrm_contact_memory:
- contact_consent_exchange.meta.md
- mrm_memory_governance.meta.md
- registered_contact_trace.meta.md

09_oar:
- oar2_package_measures_registry_for_seat_confirmation_v1.meta.md
- oar1_package_measures_registry_for_seat_confirmation_v1.meta.md after execution

10_validation:
- seat_preflight_checklist.meta.md
- registered_surface_validation.meta.md
- integration_validation.meta.md
- runtime_no_hardcode_validation.meta.md

## CODY ROLE

Cody may:

- create the SEAT package folder structure
- create the listed .meta.md files
- copy or normalize existing seated thread contracts into the package
- mark unknowns as pending_verification
- mark held states explicitly
- produce a file manifest
- produce validation checklist
- return OAR1 evidence

Cody may not:

- mutate the database
- change frontend behavior
- publish to Paragraph
- post to social media
- move media assets
- create credentials
- activate payment
- activate c3 Key
- activate MAP
- activate SEAT registration
- activate Marble
- activate conversion
- activate certification
- infer missing truth
- execute from thread instructions outside this OAR2

## VALIDATION

Cody must return:

1. created folder list
2. created file list
3. missing or pending source items
4. held state confirmation
5. validation checklist result
6. confirmation that no DB mutation occurred
7. confirmation that no frontend behavior changed
8. confirmation that no publishing/social/media movement occurred
9. OAR1 path

Expected OAR1:

docs/seat/measures_registry/09_oar/oar1_package_measures_registry_for_seat_confirmation_v1.meta.md

## CLOSE

This OAR2 succeeds when Measures Registry has a bounded SEAT confirmation package containing contracts, encounters, chamber directories, integrations, automation, runtime surfaces, media manifests, MRM/contact-memory governance, OAR trace, and validation surfaces.

The package is not registration.

The package is SEAT review readiness.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody packages.
src renders only seated state.
