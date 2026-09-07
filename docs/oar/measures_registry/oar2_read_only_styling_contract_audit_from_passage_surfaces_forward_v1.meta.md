---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Read Only Styling Contract Audit From Passage Surfaces Forward
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_runtime_one_step_late_url_history_sync_v1.meta.md
  - docs/oar/measures_registry/oar1_seat_partial_src_contact_capture_and_assessment_scoring_contract_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - read-only
  - styling-contract
  - registered-runtime
  - visual-qa
  - contract-audit
  - codex-first
---

# OAR2 — Read Only Styling Contract Audit From Passage Surfaces Forward

## OBSERVED

Operator visual QA confirms the registered runtime flow now loads through contact capture after evaluation.

Accepted flow standing:

    intro
        -> eval_passage / structure_passage
        -> assessment questions
        -> connect_src contact capture

The first two public surfaces are accepted and must not be disturbed:

- ai_isnt_broken_intro
- intro threshold / accepted path-choice entry behavior

Remaining issue is styling contract parity beginning with the passage video pages and continuing downstream.

Styling should not be patched from visual frustration.

Before any code or CSS correction, existing DB styling/layout contracts must be read and compared to current renderer/CSS behavior.

## ALIGNED

This is a read-only styling contract audit.

Do not modify DB.

Do not modify source files.

Do not edit CSS.

Do not change routing.

Do not change assessment scoring.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not edit old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Frontend must continue rendering seated Codex state only.

## ROUTED

### 1. Scope boundary

Do not inspect for correction or alter:

- ai_isnt_broken_intro
- accepted intro threshold cards
- active routing logic
- scoring logic
- contact capture logic
- email package contract logic

Audit begins at:

    eval_passage
    structure_passage

and continues downstream.

### 2. Target surfaces for styling audit

Inspect existing contracts and renderer/CSS usage for:

- eval_passage
- structure_passage
- measures_assessment
- structured_eval
- connect_src
- measures_eval_email_contract
- measures_phases_reveal
- about_measures_registry
- structural_drift_publication
- reserve_seat
- phase_payment

### 3. DB contract readback required

For each target encounter, read back:

- encounter_key
- display_title
- function_layer
- state_expression
- metadata.renderer
- metadata.layout_contract
- metadata.styling_contract
- metadata.media_behavior_contract
- metadata.branding_contract if present
- metadata.source_sitewide_contract
- metadata.encounter_isolation_contract
- metadata.material_family if present
- metadata.material_tone if present
- metadata.viewport_fit if present
- metadata.surface_mode if present
- metadata.cta_placement if present
- metadata.media_roles if present
- full metadata keys present

Return raw seated values where practical.

Do not summarize away contract fields needed for styling correction.

### 3a. Sitewide style contract readback required

Before reading encounter contracts, read back the governing sitewide authority layer.

Tables:

- `concordance_document` — filter on `document_key = 'measures_registry_sitewide_style_contract'`
- `concordance_version` — filter on `version_key = 'measures_registry_sitewide_style_contract_v1'`
- `concordance_relation` — filter on `version_key = 'measures_registry_sitewide_style_contract_v1'`, return all 11 relations

Return for each relation:

- `relation_key`
- `relation_label`
- `metadata.contract_domain`
- `metadata.governs` (full array)
- `metadata.audit_finding` if present

Expected relation keys and their governing domains:

| Relation Key | Domain |
|---|---|
| mrssc_v1_intelligence_binding | intelligence_binding |
| mrssc_v1_typography_contract | typography |
| mrssc_v1_color_material_contract | color_material |
| mrssc_v1_button_icon_contract | button_icon |
| mrssc_v1_media_behavior_contract | media_behavior |
| mrssc_v1_marble_tone_contract | marble_tone |
| mrssc_v1_viewport_containment_contract | viewport_containment |
| mrssc_v1_branding_contract | branding |
| mrssc_v1_footer_contract | footer |
| mrssc_v1_transition_contract | transition |
| mrssc_v1_preserved_runtime_assets | preserved_runtime_assets |

Known audit findings seated in the sitewide contract (carry forward into mismatch classification):

- `mrssc_v1_media_behavior_contract`: `passageMuted_is_session_global`
- `mrssc_v1_marble_tone_contract`: `marble_tone_persists_across_surfaces_unscoped`
- `mrssc_v1_footer_contract`: `copyright_hardcoded_in_jsx`
- `mrssc_v1_transition_contract`: `orphaned_transition_contract_unrealized`

Use the seated sitewide contract clauses as the authority layer when classifying mismatches in section 5.

Do not invent or infer sitewide style authority from renderer code or visual inspection alone.

### 4. Renderer and CSS readback required

For each target surface, inspect the clean-shell renderer and CSS usage.

Likely renderer files:

- src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredConnectSrc.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredReserveSeat.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredPhasePayment.tsx

Inspect:

- root class names
- data-surface attributes
- section/card/container classes
- video/media classes
- form classes
- CTA/button classes
- layout wrappers
- CSS rules currently applied in src/index.css or related CSS file
- whether renderer consumes styling_contract or ignores it
- whether renderer hardcodes visual structure outside contract

### 5. Visual mismatch classification

For each target surface, classify one of:

- contract exists + renderer ignores it
- contract exists + CSS missing parity
- contract exists + renderer class mapping incomplete
- contract incomplete / DB needs styling clarification
- renderer inventing style
- no correction needed

Return a correction map. Each row must cite which sitewide contract clause governs the mismatch (from the `mrssc_v1_*` relation keys read in section 3a). Where a mismatch touches a known sitewide `audit_finding`, flag it.

| Surface | Sitewide Contract Clause | DB Contract Standing | Renderer/CSS Standing | Classification | Recommended Correction |
|---|---|---|---|---|---|

### 6. Specific visual areas to assess

Assess these styling areas without changing them:

#### Passage pages

- video sizing
- video placement
- text hierarchy
- CTA placement
- background/material tone
- viewport containment
- desktop browser fit
- mobile risk if obvious

#### Assessment pages

- question card scale
- answer option styling
- form/control readability
- viewport containment
- background layering
- bottom peek-through risk
- desktop browser fit

#### connect_src

- partial SRC contact capture styling
- field layout
- label/input treatment
- CTA placement
- page size/viewport fit
- Measures Registry material tone

#### measures_eval_email_contract

- email package confirmation visual hierarchy
- absence of report dump
- CTA styling
- package summary styling
- viewport fit

#### downstream pages

- measures_phases_reveal hierarchy
- about page hierarchy
- structural_drift_publication card/article layout
- reserve_seat form styling
- phase_payment commitment surface styling

### 7. No correction in this OAR

Do not implement the recommended correction.

Do not update DB.

Do not update CSS.

Do not update renderer files.

The output must be an audit/readback and correction plan only.

### 8. Required recommendation

Return recommended next OAR classification:

- DB styling contract correction required
- CSS parity correction required
- renderer-class correction required
- combined DB + CSS correction required
- combined renderer + CSS correction required
- no correction needed

If multiple surfaces require different correction types, group by correction class.

## DO NOT

- modify DB
- modify source files
- edit CSS
- patch renderers
- change routing
- change scoring
- change assessment questions
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- edit old MeasuresRegistryRuntime.tsx
- accept build-only validation
- infer styling authority from preference alone

## VALIDATION REQUIRED

Return:

- scripts/queries used for read-only inspection
- DB tables inspected
- sitewide style contract readback: `concordance_document`, `concordance_version`, and all 11 `concordance_relation` rows for `measures_registry_sitewide_style_contract_v1` with full `governs` arrays and any `audit_finding` values
- target encounter rows inspected
- exact styling/layout contract readback by surface
- renderer files inspected
- CSS classes/rules inspected
- mismatch classification table (with sitewide contract clause column)
- recommended correction map
- confirmation no DB rows modified
- confirmation no source files modified
- confirmation no CSS modified
- confirmation first two public surfaces were not touched

## SUCCESS CONDITION

Existing styling and layout contracts are known from DB state.

Current clean-shell renderer/CSS behavior is mapped against those contracts.

The next correction can be routed from seated contract evidence instead of visual guessing.

No mutation occurs in this audit.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md

## CLOSE

Read the styling contracts first.

Fix from seated state.
