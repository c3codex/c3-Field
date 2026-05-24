---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_rebuild
title: OAR2 — Build Clean Contract-Native Measures Registry Runtime Shell
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_implement_registered_13_runtime_renderer_alignment_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
  - docs/oar/measures_registry/oar1_audit_registered_runtime_for_legacy_residue_after_renderer_alignment_v1.meta.md
  - docs/oar/measures_registry/oar1_reposition_contact_capture_to_eval_email_contract_and_remove_header_bleed_v1.meta.md
  - docs/oar/measures_registry/oar1_resequence_assessment_capture_and_resolving_interstitial_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-rebuild
  - contract-native-runtime
  - registered-13
  - drift-containment
  - codex-first
---

# OAR2 — Build Clean Contract-Native Measures Registry Runtime Shell

## OBSERVED

Repeated runtime QA has exposed persistent drift inside the existing monolithic runtime file:

    src/measures_registry/MeasuresRegistryRuntime.tsx

The file predates the fully seated registered 13 contract body and continues to express legacy / precontract residue through:

- stale hardwired handlers
- deprecated aliases
- precontract surfaces
- old route targets
- dead media roles
- legacy global header behavior
- hidden assessment flow states
- correction patches layered over correction patches

Recent OARs corrected multiple seams, but the runtime continues to produce drift because the existing file is not contract-native.

Operator assessment:

    We are creating drift by trying to fix drift.

The correction should not be another patch inside the old runtime file unless narrowly required for recovery.

The correct next move is to build a clean contract-native Measures Registry runtime shell from the seated DB contracts, then recover only verified required logic from the old runtime.

## ALIGNED

This OAR2 initiates a clean registered runtime shell.

The old runtime is no longer treated as authority.

The old runtime may be used only as a recovery source for verified logic.

Authority remains:

    Codex -> Field -> Measures -> Chazz -> Cody -> src

Frontend does not author truth.

The new runtime must render only seated registered state.

No legacy surface should be callable from the registered public flow unless explicitly mapped, documented, and approved.

## ROUTED

### 1. Freeze the existing runtime as legacy recovery source

Treat:

    src/measures_registry/MeasuresRegistryRuntime.tsx

as:

    legacy_precontract_runtime_source

Do not continue broad patching inside this file.

Allowed use:

- recover verified assessment mechanics
- recover verified media URL resolution usage
- recover verified seated copy access patterns
- recover verified form state patterns
- recover verified result generation logic

Not allowed:

- preserve legacy aliases as default behavior
- preserve deprecated route fallbacks
- preserve precontract SRC capture
- preserve cohort/offering route bleed
- preserve global c3 Field / Contact header bleed
- preserve dead media role behavior as active runtime logic

### 2. Create clean runtime shell

Create a new registered runtime file.

Recommended path:

    src/measures_registry/MeasuresRegistryRuntimeRegistered.tsx

This file must be contract-native and bounded to the registered 13 public runtime.

It must read seated DB state and render registered encounters only.

It must not contain deprecated public surface dispatch branches.

### 3. Define registered 13 only

The clean runtime must resolve only the registered public body:

1. ai_isnt_broken_intro
2. evaluate_structure_path
3. eval_passage
4. connect_src
5. measures_assessment
6. structure_passage
7. structured_eval
8. measures_phases_reveal
9. about_measures_registry
10. structural_drift_publication
11. measures_eval_email_contract
12. reserve_seat
13. phase_payment

Important:

- connect_src is retained as a registered encounter but is currently held from public flow.
- connect_src must not be used as a pre-assessment gate.
- connect_src may remain direct-url visible only if current DB standing allows, but not from active flow.

### 4. Registered flow contract

The clean runtime must express this active flow:

Entry:

    ai_isnt_broken_intro
        -> evaluate_structure_path

Left branch:

    evaluate_structure_path
        -> eval_passage
        -> measures_assessment
        -> measures_eval_email_contract
        -> resolving interstitial minimum 4 seconds after delivery submit
        -> measures_phases_reveal

Right branch:

    evaluate_structure_path
        -> structure_passage
        -> structured_eval
        -> measures_eval_email_contract
        -> resolving interstitial minimum 4 seconds after delivery submit
        -> measures_phases_reveal

Converged branch:

    measures_phases_reveal
        -> about_measures_registry
        -> structural_drift_publication
        -> reserve_seat
        -> phase_payment

Do not route active public flow to:

- connect_src before assessment
- cohort_conversion_encounter
- educate_eval_encounter
- iis_eval_gate1
- understand_failure
- foundation_offering
- systems_offering
- foundation_seat_hold
- systems_seat_hold
- c3_field

### 5. Build small registered renderer units

Do not rebuild as another giant monolith.

Create bounded renderer units or local components for:

- RegisteredIntro
- RegisteredPathChoice
- RegisteredPassage
- RegisteredAssessment
- RegisteredEvalEmailContract
- RegisteredResolvingInterstitial
- RegisteredPhaseReveal
- RegisteredAbout
- RegisteredStructuralDrift
- RegisteredReserveSeat
- RegisteredPhasePayment

Renderer units may live in one folder.

Recommended folder:

    src/measures_registry/registered_runtime/

Suggested structure:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredEvalEmailContract.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredResolvingInterstitial.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredReserveSeat.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPhasePayment.tsx

If fewer files are more practical, keep separation by renderer function at minimum.

### 6. Recover only verified required logic

Recover from the old runtime only what is required and already verified:

Allowed recovery:

- Supabase section/encounter query logic
- measures_media_map query logic
- runtimeMediaUrl usage
- registry token/style variables where contract-bound
- assessment question engine
- assessment scoring / interpretation logic
- structured_eval shared mechanics
- eval report generation
- delivery/contact form state
- reserve seat hold API only if already working and bounded
- R2/Supabase media role consumption

Not allowed recovery:

- deprecated route dispatch
- deprecated action fallbacks
- precontract SRC capture
- old c3 Field authority page
- global Contact nav
- cohort conversion surface
- legacy offering surfaces
- direct old evaluation chamber aliases
- dead hero_video active behavior

### 7. Data and contract reads

The clean runtime must read from DB/metadata where currently supported.

Required authority surfaces:

- measures_encounter_def
- measures_media_map
- relevant metadata contracts
- sitewide style contract reference where available
- registered 13 sequence / action targets where available

Do not invent missing authority.

If a required DB contract field is absent, report it.

Do not hardcode semantic copy except minimal fallback labels required for development safety and explicitly reported.

### 8. Assessment flow requirement

The assessment must start at question 1.

Direct URLs:

    ?surface=measures_assessment
    ?surface=structured_eval

must open directly to the first evaluation question or the valid first question state.

They must not render:

- Environment Identity pre-capture
- Institutional Contact pre-capture
- Resolving environmental standing before delivery capture

After final question:

    measures_assessment -> measures_eval_email_contract
    structured_eval -> measures_eval_email_contract

Delivery submit:

    measures_eval_email_contract -> resolving interstitial for >= 4 seconds -> measures_phases_reveal

### 9. Header and branding requirement

The clean runtime header must show only Measures Registry branding unless an encounter contract explicitly seats additional navigation.

Do not render:

- c3 Field nav
- Contact nav
- c3 Field title
- global parent-site links

unless routed by a future explicit contract.

### 10. Media requirement

Use contract-supported media roles only.

Current known media standing:

- epigraph_video -> registry_epigraph_fracture_to_alignment_15s.mp4
- left_hero_fracture
- left_hero_fracture_motion
- right_measured_hero
- measured_hero_motion_graphic
- structured_environment_passage_video / measures_structured_enviroments where seated
- installation tone roles where seated

Do not activate dead hero_video behavior.

If path-choice left/right media requires renderer support, implement support only from seated roles and report any missing role/path.

No hardcoded media URLs.

### 11. Runtime switching plan

Do not delete the old runtime.

Add the new clean runtime shell behind a controlled import/switch.

Preferred:

- keep current route entry stable
- replace Measures Registry route import to new registered shell only after build passes
- preserve old file as legacy backup during validation

Return the exact switch made.

### 12. Validation required

Validate:

Left branch:

    intro -> path choice -> eval_passage -> measures_assessment -> questions -> measures_eval_email_contract -> resolving >=4s -> measures_phases_reveal -> about -> structural_drift -> reserve_seat -> phase_payment

Right branch:

    intro -> path choice -> structure_passage -> structured_eval -> questions -> measures_eval_email_contract -> resolving >=4s -> measures_phases_reveal

Direct URLs:

    ?surface=measures_assessment
    ?surface=structured_eval
    ?surface=measures_eval_email_contract
    ?surface=phase_payment

Confirm no deprecated/precontract surface appears.

### 13. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- delete old runtime file
- delete deprecated DB rows
- create new DB tables
- hardcode semantic copy as authority
- hardcode media URLs
- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- reintroduce connect_src as pre-assessment gate
- preserve global c3 Field / Contact nav
- expose cohort/offering legacy flow in registered runtime
- conduct broad visual redesign beyond containment needed for shell correctness

## VALIDATION REQUIRED

Return:

- new files created
- old files modified
- runtime switch location
- recovered logic list
- rejected legacy logic list
- registered 13 dispatcher list
- left branch result
- right branch result
- direct URL result
- media role consumption result
- assessment start behavior
- post-final-question route behavior
- delivery submit interstitial timing
- build result
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed
- confirmation no deprecated route bleed
- confirmation old runtime retained as legacy source only

## SUCCESS CONDITION

A clean contract-native Measures Registry runtime shell exists and renders the registered 13 public body without relying on the precontract monolithic runtime structure.

The old runtime remains available only as legacy recovery source.

The registered public flow no longer expresses precontract drift.

Build remains clean.

## PROCESS INTELLIGENCE TO CAPTURE

Seat this lesson in OAR1 closeout:

    If a runtime predates the registered contract body, repeated patch correction may create correction drift.

    After contracts are seated, the system must decide whether to refactor the legacy runtime or build a clean contract-native runtime shell and migrate only verified behavior.

    Legacy runtime recovery is allowed only while bounded. Repeated drift after contract seating requires clean-shell routing.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md`

## CLOSE

Stop patching drift city.

Build from the registered body.
