---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Apply Footer Contract to Registered Runtime Downstream Surfaces
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_css_parity_for_registered_runtime_downstream_surfaces_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_runtime_one_step_late_url_history_sync_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - footer-contract
  - sitewide-runtime-contract
  - registered-runtime
  - downstream-surfaces
  - visual-governance
  - codex-first
---

# OAR2 — Apply Footer Contract to Registered Runtime Downstream Surfaces

## OBSERVED

Operator visual QA confirms the registered runtime flow works through contact capture, and downstream CSS class coverage has been added.

However, the sitewide footer/copyright contract is not visibly operating across downstream registered surfaces.

Clarified footer visibility rule:

    Surface 1: ai_isnt_broken_intro
        -> no footer / no copyright

    Surface 2: intro threshold / direct path-choice entry
        -> no footer / no copyright

    All downstream registered surfaces
        -> footer / copyright should appear unless explicitly hidden by contract

The read-only styling audit flagged:

    mrssc_v1_footer_contract
        -> copyright_hardcoded_in_jsx

This indicates footer behavior is not yet governed as a shared registered runtime contract.

Current classification:

    runtime flow = accepted
    CSS class coverage = improved
    sitewide footer contract application = not accepted
    visual governance = not accepted

## ALIGNED

This is a sitewide runtime contract application correction.

Do not change routing.

Do not change assessment scoring.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not alter the accepted first two public surfaces except to explicitly preserve their no-footer standing.

Frontend must render seated contract behavior only.

## ROUTED

### 1. Inspect sitewide footer contract

Inspect the seated sitewide footer contract from:

    measures_registry_sitewide_style_contract

Read back the footer/copyright contract fields from concordance relation:

    mrssc_v1_footer_contract

Return:

- footer visibility rules
- footer copy authority
- copyright text authority
- system linkage rules
- any surface exclusions
- whether copyright text is seated in DB/metadata
- whether current renderer hardcodes footer text

If footer copy is not seated, report missing contract field.

Do not invent new legal/copyright wording outside existing contract.

### 2. Inspect current footer implementation

Inspect the clean registered runtime shell:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

and relevant renderers.

Determine:

- where footer/copyright currently renders
- whether it exists only in intro/threshold components
- whether it is hardcoded in JSX
- whether downstream surfaces inherit a shared footer wrapper
- whether any renderer suppresses footer by omission
- whether footer is absent because the shell lacks a sitewide frame

Return exact source.

### 3. Apply footer to downstream surfaces only

Footer/copyright must appear on downstream registered surfaces:

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

Footer/copyright must remain hidden on:

- ai_isnt_broken_intro
- intro threshold / accepted path-choice entry behavior

If `evaluate_structure_path` remains accessible as a direct-link registered path-choice surface, treat it as an entry/threshold surface and keep footer hidden unless DB explicitly says otherwise.

### 4. Use shared registered runtime wrapper if possible

Preferred implementation:

- one shared footer component or render helper in the clean registered runtime
- centralized footer visibility decision based on active registered surface
- no repeated footer markup scattered across individual renderers

Allowed:

    shouldRenderFooter(activeSurface)

Example visible set:

    eval_passage
    structure_passage
    measures_assessment
    structured_eval
    connect_src
    measures_eval_email_contract
    measures_phases_reveal
    about_measures_registry
    structural_drift_dispatches
    reserve_seat
    phase_payment

Example hidden set:

    intro
    path_choice

Do not hardcode semantic copy if DB seats the copy.

If no footer copy is seated, use existing legacy footer copy only as a temporary fallback and report it as a DB contract gap.

### 5. Preserve accepted first two surfaces

Do not visually alter:

- ai_isnt_broken_intro
- intro threshold cards / accepted entry behavior

No footer should appear there.

No layout shift should be introduced there.

### 6. Footer visual styling

Footer should feel governed, not visually loud.

Required:

- restrained placement
- bottom-aligned or post-content aligned as contract allows
- readable but secondary
- does not overlap media or form controls
- does not cause uncontrolled scroll where single_screen contract applies
- respects obsidian and marble material tokens
- does not obscure CTAs

Use scoped CSS classes.

Do not use broad global resets.

Recommended class:

    .registry-runtime-footer

Optional sub-classes:

    .registry-runtime-footer-copy
    .registry-runtime-footer-links

### 7. Validate downstream surfaces

Browser visual QA required.

Validate footer hidden:

    ?surface=ai_isnt_broken_intro
    ?surface=evaluate_structure_path

Validate footer visible:

    ?surface=eval_passage
    ?surface=structure_passage
    ?surface=measures_assessment
    ?surface=structured_eval
    ?surface=connect_src
    ?surface=measures_eval_email_contract
    ?surface=measures_phases_reveal
    ?surface=about_measures_registry
    ?surface=structural_drift_publication
    ?surface=reserve_seat
    ?surface=phase_payment

### 8. Validate full branch

Validate at least one full branch:

    intro
        -> eval_passage
        -> measures_assessment
        -> connect_src
        -> measures_eval_email_contract
        -> measures_phases_reveal
        -> about_measures_registry

Confirm:

- footer absent on intro
- footer appears starting at eval_passage
- footer persists downstream
- no route regression
- no scoring regression
- no contact/email regression

### 9. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- modify DB rows unless footer contract field correction is explicitly required and bounded
- invent copyright/legal copy
- edit old MeasuresRegistryRuntime.tsx
- change routing
- change scoring
- change assessment questions
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- hardcode media URLs
- alter accepted first two surfaces visually
- broaden into passage/contact visual redesign
- accept build-only validation

## VALIDATION REQUIRED

Return:

- footer contract readback
- current footer implementation source
- files modified
- CSS classes added/modified
- DB rows modified, if any
- footer hidden result for intro
- footer hidden result for evaluate_structure_path
- footer visible result for all downstream surfaces
- full branch visual QA result
- build result
- confirmation no routing changes
- confirmation no scoring changes
- confirmation no contact/email behavior changes
- confirmation old runtime not edited
- confirmation first two public surfaces remain footer-hidden

## SUCCESS CONDITION

Footer/copyright behavior is governed by the sitewide runtime contract.

The first two entry/threshold surfaces remain footer-hidden.

All downstream registered surfaces render the footer/copyright unless explicitly hidden by seated contract.

Build remains clean and browser visual QA confirms footer visibility boundaries.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_apply_footer_contract_to_registered_runtime_downstream_surfaces_v1.meta.md

## CLOSE

Entry stays immersive.

Downstream becomes governed.
