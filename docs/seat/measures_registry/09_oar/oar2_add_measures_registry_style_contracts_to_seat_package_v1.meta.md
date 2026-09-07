---
document_type: oar2
authority_level: working
document_scope: seat_confirmation_package
title: OAR2 — Add Measures Registry Style Contracts to SEAT Package v1
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
  - style-contracts
  - visual-system
  - no-visual-drift
  - runtime-style
---

# OAR2 — Add Measures Registry Style Contracts to SEAT Package v1

## OBSERVED

Measures Registry now has a bounded SEAT confirmation package.

Cody has completed the first SEAT packaging pass.

The next required containment surface is style contracts.

Observed standing:

- Visual drift has repeatedly caused runtime confusion.
- Buttons, media framing, metadata bleed, headers, footers, laptop containment, and generic layouts have previously drifted.
- Epigraph has been hardened as landed-signal routing behavior, not its own encounter runtime.
- Landing surfaces emit landing_signal.
- Encounters own runtime.
- Chamber directories govern encounter visibility and runtime-surface permission.
- Generated visuals may be valid source references, but cannot govern implementation directly.
- If it can be generated, it can be coded, but only through a registered style contract.

Risk:

- Without style contracts, Cody may interpret visuals ad hoc.
- Without style contracts, generated media and UI references may become component-owned truth.
- Without style contracts, chamber style may hardcode into frontend components.
- Without style contracts, visual drift can re-enter SEAT confirmation.

## ALIGNED

Create a bounded style-contract layer inside the Measures Registry SEAT package.

Target folder:

docs/seat/measures_registry/11_style_contracts/

Style contracts are review surfaces only.

They do not mutate frontend behavior by themselves.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Style implementation rule:

Generated visual -> style contract -> token map -> component implementation -> visual validation

Not:

Generated visual -> Cody guesses CSS

## ROUTED

Create the following style-contract files:

docs/seat/measures_registry/11_style_contracts/sitewide_visual_system_contract.meta.md
docs/seat/measures_registry/11_style_contracts/epigraph_landing_signal_style_contract.meta.md
docs/seat/measures_registry/11_style_contracts/lapis_encounter_style_contract.meta.md
docs/seat/measures_registry/11_style_contracts/obsidian_assessment_style_contract.meta.md
docs/seat/measures_registry/11_style_contracts/undrifted_publication_style_contract.meta.md
docs/seat/measures_registry/11_style_contracts/media_surface_style_contract.meta.md
docs/seat/measures_registry/11_style_contracts/button_cta_style_contract.meta.md
docs/seat/measures_registry/11_style_contracts/responsive_containment_style_contract.meta.md
docs/seat/measures_registry/11_style_contracts/no_visual_drift_validation.meta.md

Required style contract fields:

- style_contract_key
- system
- surface_scope
- chamber_authority
- encounter_key
- visual_role
- layout_rules
- media_rules
- typography_rules
- button_rules
- responsive_rules
- forbidden_patterns
- validation_rules

## CORE STYLE RULES

Style contracts must preserve:

- institutional tone
- cinematic restraint
- registry-driven rendering
- no generic marketing UI
- no component-owned chamber styling
- no hardcoded per-page visual exceptions
- no metadata bleed
- no title-token bleed
- no layout outside viewport
- no unregistered media swap
- no CTA/button drift
- no header/footer on intro or landing-signal surfaces unless explicitly allowed

## CODING BOUNDARY

This OAR2 creates and registers style contracts only.

Cody may:

- create the 11_style_contracts folder
- create listed style contract files
- normalize current style rules into those files
- mark unknown values as pending_verification
- update SEAT package index to include style contracts
- update validation checklist to include style-contract review
- write OAR1 evidence

Cody may not:

- mutate database
- change frontend CSS
- change runtime behavior
- change media assets
- publish to Paragraph
- post to social media
- change routing
- activate held states
- infer missing visual truth
- hardcode style into components

## VALIDATION

Cody must return:

1. created folder list
2. created style contract file list
3. updated SEAT index status
4. updated validation status
5. confirmation no DB mutation occurred
6. confirmation no frontend behavior changed
7. confirmation no CSS/runtime mutation occurred
8. OAR1 path

Expected OAR1:

docs/seat/measures_registry/09_oar/oar1_add_measures_registry_style_contracts_to_seat_package_v1.meta.md

## CLOSE

This OAR2 succeeds when Measures Registry has a bounded style-contract layer in the SEAT package.

Generated visual may serve as source reference.

Style contract governs implementation.

Code follows contract.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody packages.
src renders only seated state.
