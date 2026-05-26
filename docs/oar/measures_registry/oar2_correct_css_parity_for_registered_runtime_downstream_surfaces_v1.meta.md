---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Correct CSS Parity for Registered Runtime Downstream Surfaces
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
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
  - css-parity
  - styling-contract
  - registered-runtime
  - downstream-surfaces
  - visual-qa
  - codex-first
---

# OAR2 — Correct CSS Parity for Registered Runtime Downstream Surfaces

## OBSERVED

Read-only styling contract audit confirmed the registered runtime flow loads through contact capture, but downstream surface styling is incomplete because multiple renderer classes have no CSS coverage.

The first two public surfaces are accepted and must not be touched:

- `ai_isnt_broken_intro`
- intro threshold / accepted path-choice entry behavior

Audit identified missing CSS class coverage beginning downstream, primarily at:

- `connect_src`
- `measures_eval_email_contract`
- `measures_phases_reveal`
- `about_measures_registry`

This OAR corrects CSS parity only.

## ALIGNED

This is a CSS parity correction.

Do not modify DB.

Do not change routing.

Do not change assessment scoring.

Do not change assessment questions.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not edit old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not touch the accepted first two public surfaces.

Frontend must continue rendering seated Codex state only.

## ROUTED

### 1. Use the styling audit as source

Use:

    docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md

as the source for missing CSS class coverage.

Do not invent new surface scope.

Do not broaden into routing, renderer refactor, DB contract changes, or assessment logic.

### 2. Add CSS coverage for connect_src

Add CSS in `src/index.css` for:

    .registry-connect-src
    .registry-eval-error

Required contract expression:

- obsidian material surface
- single-screen fit where possible
- compact post-assessment contact capture
- polished form containment
- readable labels and fields
- CTA placement aligned to existing `.registry-encounter-actions`
- error state visibly clear but not visually dominant

Do not change field behavior.

Do not change contact capture submit logic.

### 3. Add CSS coverage for measures_eval_email_contract

Add CSS in `src/index.css` for:

    .registry-eval-email-contract
    .registry-email-package-summary
    .registry-email-section
    .registry-email-package-includes
    .registry-email-dispatch-note

Required contract expression:

- obsidian delivery confirmation surface
- single-screen layout where practical
- no report dump styling reintroduced
- package confirmation visual hierarchy
- clear “what will be sent” presentation
- restrained institutional typography
- CTA below confirmation content
- dispatch-deferred note visually secondary

Do not re-add delivery form.

Do not re-add resolving interstitial.

Do not implement email dispatch.

### 4. Add CSS coverage for measures_phases_reveal

Add CSS in `src/index.css` for:

    .registry-phases-reveal
    .registry-phases-background
    .registry-phases-standing
    .registry-phases-sections

Required contract expression:

- marble material surface
- lapis accent support where image/background exists
- single-screen reveal layout where practical
- clean assessment standing hierarchy
- phase sections readable and balanced
- no bottom peek-through
- no visual collapse on desktop viewport

Do not change route behavior.

Do not change assessment result logic.

### 5. Add CSS coverage for about_measures_registry

Add CSS in `src/index.css` for:

    .registry-about-authority
    .registry-about-marble

Required contract expression:

- marble authority surface
- single-screen-or-short-scroll behavior
- restrained registry mark / marble accent behavior
- clean institutional hierarchy
- readable support points
- no oversized uncontrolled layout

Do not change copy.

Do not change renderer logic in this OAR.

### 6. Preserve already-covered surfaces

Do not alter unless required by cascade containment:

- `.registry-diagnostic-passage`
- `.registry-field-guide`
- `.registry-publication-dispatch`
- `.registry-reserve-selector`
- `.registry-hold-surface`
- accepted intro/threshold CSS

If cascade adjustments are required, report exactly why.

### 7. Containment rules

All added CSS must respect:

- desktop browser viewport
- mobile/short viewport tolerance where obvious
- no underlying media/background peek-through
- no uncontrolled overflow from cards or forms
- no massive form/card scale
- no hardcoded media URLs
- no new global resets

Prefer scoped class selectors over broad global selectors.

### 8. Build validation

Run:

    npm run build:registry

Return clean build result.

### 9. Browser visual QA required

Validate:

    ?surface=connect_src
    ?surface=measures_eval_email_contract
    ?surface=measures_phases_reveal
    ?surface=about_measures_registry

Then validate at least one full branch:

    intro
        -> eval_passage
        -> measures_assessment
        -> connect_src
        -> measures_eval_email_contract
        -> measures_phases_reveal
        -> about_measures_registry

Visual acceptance requires:

- contact capture is compact and polished
- email package confirmation is readable and governed
- phases reveal has marble/lapis visual hierarchy
- about page has institutional authority styling
- no route regression
- no scoring regression
- no first-two-surface regression

## DO NOT

- modify DB rows
- edit old MeasuresRegistryRuntime.tsx
- change routing
- change scoring
- change assessment questions
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- hardcode media URLs
- broaden into transition animation implementation
- broaden into renderer-field hardcoding correction
- alter accepted intro or threshold surfaces

## VALIDATION REQUIRED

Return:

- CSS file(s) modified
- exact classes added
- any existing CSS touched and why
- DB rows modified, if any
- source files modified outside CSS, if any
- connect_src visual QA result
- measures_eval_email_contract visual QA result
- measures_phases_reveal visual QA result
- about_measures_registry visual QA result
- branch visual QA result
- build result
- confirmation no routing changes
- confirmation no scoring changes
- confirmation no contact/email behavior changes
- confirmation first two public surfaces untouched
- confirmation old runtime not edited

## SUCCESS CONDITION

All downstream renderer classes identified as missing in the styling audit have CSS coverage.

The registered runtime downstream surfaces visually express their seated styling contracts without changing routing, scoring, contact capture, email contract behavior, or accepted entry surfaces.

Build remains clean and browser visual QA passes.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_correct_css_parity_for_registered_runtime_downstream_surfaces_v1.meta.md

## CLOSE

Style the seated surfaces.

Do not move the system.
