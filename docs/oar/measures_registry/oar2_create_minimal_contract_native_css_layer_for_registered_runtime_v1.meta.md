---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Create Minimal Contract-Native CSS Layer for Registered Runtime
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_read_only_sitewide_style_contract_and_runtime_token_seating_audit_v1.meta.md
  - docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_css_parity_for_registered_runtime_downstream_surfaces_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - css-architecture
  - contract-native-css
  - registered-runtime
  - visual-governance
  - drift-containment
  - codex-first
---

# OAR2 — Create Minimal Contract-Native CSS Layer for Registered Runtime

## OBSERVED

The registered runtime flow is now functionally accepted through contact capture, but visual QA confirms downstream surfaces still look ungoverned.

Read-only sitewide style audit confirms:

- DB design token pipeline works for palette, spacing, and scale
- `src/index.css` has become a large accumulated global style surface
- fonts are hardcoded in CSS rather than seated as DB tokens
- marble values are hardcoded in CSS rather than seated as DB tokens
- passage pages are missing header-height offset
- button hover/focus states are missing
- passage media state is session-global
- transition contract is not implemented
- multiple visual corrections were patched into `src/index.css`

Operator assessment:

    index.css is drift city.

Conclusion:

Continuing to patch `src/index.css` top-down risks recreating the same drift pattern that occurred in the old monolithic runtime file.

The correction should now create a minimal contract-native CSS layer for the clean registered runtime.

## ALIGNED

This OAR2 does not redesign the whole site.

This OAR2 creates an isolated registered-runtime styling layer that can be built bottom-up from seated contracts.

Existing `src/index.css` remains as legacy/global fallback.

Do not delete `src/index.css`.

Do not remove existing styling.

Do not touch accepted intro/threshold surfaces.

Do not change routing.

Do not change assessment scoring.

Do not change contact capture behavior.

Do not change email contract behavior.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Frontend must continue rendering seated Codex state only.

## ROUTED

### 1. Create isolated registered-runtime style folder

Create:

    src/measures_registry/registered_runtime/styles/

Recommended files:

    src/measures_registry/registered_runtime/styles/registry.runtime.css
    src/measures_registry/registered_runtime/styles/registry.tokens.css
    src/measures_registry/registered_runtime/styles/registry.materials.css
    src/measures_registry/registered_runtime/styles/registry.layout.css
    src/measures_registry/registered_runtime/styles/registry.buttons.css
    src/measures_registry/registered_runtime/styles/registry.media.css
    src/measures_registry/registered_runtime/styles/registry.footer.css
    src/measures_registry/registered_runtime/styles/encounters/passage.css

If fewer files are safer for initial implementation, create a single entry file:

    registry.runtime.css

with clearly marked sections.

The preferred direction is modular, but do not overbuild.

### 2. Import the registered-runtime CSS only from the clean shell

Import the new CSS layer from:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

or from a registered-runtime-local entry file.

Do not import it globally in a way that affects unrelated app surfaces.

Do not alter accepted intro/threshold styling unless caused by unavoidable shared wrapper behavior, and report if so.

### 3. Preserve `src/index.css` as legacy fallback

Do not delete or rewrite `src/index.css`.

Do not attempt broad cleanup.

Do not move old CSS yet.

The new CSS layer should override only registered-runtime scoped classes where required.

Use scoped selectors under:

    .measures-registry-runtime

Avoid broad global selectors.

### 4. Establish minimal token bridge

Create a minimal token bridge that consumes already-injected DB CSS variables.

Do not invent a new token system.

Use existing variables such as:

- `--registry-background-obsidian`
- `--registry-brand-obsidian`
- `--registry-brand-lapis-night`
- `--registry-brand-deep-lapis`
- `--registry-brand-silver-frame`
- `--registry-brand-marble-accent`
- `--registry-brand-crystal-star`
- `--registry-text-primary`
- `--registry-text-secondary`
- `--registry-text-muted`
- `--registry-border-subtle`
- `--registry-body-active`
- `--registry-entry-headline-active`
- `--registry-page-padding-active`
- `--registry-section-spacing-active`
- `--registry-header-height`
- `--registry-content-max-width`
- `--registry-text-max-width`

Add local aliases only if needed for readability.

If font variables are introduced, they must be temporary CSS variables with current loaded fonts:

    --registry-font-heading: "Cormorant Garamond", Georgia, serif;
    --registry-font-body: Inter, system-ui, sans-serif;

Report that DB font-token seating remains future work.

Do not add new DB tokens in this OAR.

### 5. Define minimal runtime frame

Define a minimal governed frame for downstream registered surfaces.

Required:

- correct header offset
- controlled width
- contained background
- no bottom peek-through
- no uncontrolled card sprawl
- readable typography hierarchy
- stable CTA placement
- desktop viewport fit where practical
- mobile tolerance where obvious

Do not globally restyle intro/threshold.

### 6. Define buttons / focus states

Add governed baseline button behavior for registered downstream surfaces.

Required:

- hover state
- focus-visible state
- disabled/loading state if already used
- primary/secondary distinction if existing renderer classes allow it
- no behavior changes

Minimum target:

    .measures-registry-runtime .registry-encounter-actions button

Add:

- hover visual response
- focus-visible outline
- active/pressed response if safe
- disabled state if present

Do not alter button click behavior.

### 7. Build first encounter style: passage surfaces

The first encounter correction target is:

    eval_passage

The same passage contract may apply to:

    structure_passage

Style:

    .registry-diagnostic-passage

Required visual governance:

- passage content must not sit under fixed header
- video must be constrained and centered
- video should read as part of one governed encounter, not raw full-width media
- copy must sit in a controlled content measure
- CTA placement must be intentional
- duplicate CTAs should not visually compete
- obsidian material tone should remain
- passage layout should fit desktop browser cleanly

Do not change the video asset.

Do not change passage routing.

Do not remove controls unless there is a clearly duplicated progression control and removal is scoped to presentation only; if behavior changes would be required, do not do it in this OAR.

### 8. Do not style all downstream encounters yet

Do not attempt to finish all surfaces in this OAR.

This OAR establishes the clean CSS layer and styles the first downstream encounter family:

- eval_passage
- structure_passage if shared passage CSS applies safely

Do not fully restyle:

- measures_assessment
- structured_eval
- connect_src
- measures_eval_email_contract
- measures_phases_reveal
- about_measures_registry
- reserve_seat
- phase_payment

unless required by the new base/button/frame layer and explicitly reported.

### 9. Preserve accepted surfaces

Do not visually change:

- ai_isnt_broken_intro
- accepted intro threshold behavior

If the imported CSS affects them unintentionally, stop and correct scoping.

### 10. Build validation

Run:

    npm run build:registry

Return clean build result.

### 11. Browser visual QA required

Validate:

    ?surface=eval_passage
    ?surface=structure_passage

Expected:

- URL remains correct
- video visible
- video constrained
- copy readable
- CTA visible
- no header overlap
- no bottom peek-through
- governed obsidian visual tone

Validate accepted surfaces remain visually unchanged:

    ?surface=ai_isnt_broken_intro
    ?surface=evaluate_structure_path

Validate one branch still advances:

    intro
        -> eval_passage
        -> measures_assessment

No route regression.

## DO NOT

- delete or rewrite `src/index.css`
- edit old `MeasuresRegistryRuntime.tsx`
- modify DB rows
- change routing
- change scoring
- change assessment questions
- change contact capture behavior
- change email contract behavior
- implement email dispatch
- expose payment logic
- hardcode media URLs
- broaden into full downstream redesign
- touch accepted first two surfaces
- accept build-only validation

## VALIDATION REQUIRED

Return:

- new CSS files created
- imports added
- existing CSS files modified, if any
- source files modified, if any
- DB rows modified, if any
- token bridge summary
- scoped selectors used
- passage CSS summary
- button/focus state summary
- eval_passage visual QA result
- structure_passage visual QA result
- accepted intro/path-choice regression check
- branch advancement check
- build result
- confirmation `src/index.css` was not rewritten
- confirmation old runtime was not edited
- confirmation no routing/scoring/contact/email behavior changed

## SUCCESS CONDITION

A minimal contract-native CSS layer exists for the clean registered runtime.

The layer consumes existing DB-injected CSS variables instead of expanding global CSS drift.

The first downstream encounter family, passage surfaces, is governed visually without disturbing accepted entry surfaces or runtime behavior.

Build remains clean and browser visual QA passes.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_create_minimal_contract_native_css_layer_for_registered_runtime_v1.meta.md

## CLOSE

Stop feeding the giant CSS file.

Build the governed layer bottom-up.
