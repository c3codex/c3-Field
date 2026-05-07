---
document_type: oar2
title: OAR2 — Educate Eval + Structural Drift Editorial Refinement
version: v1
status: ready_for_cody
system: measures_registry
execution_type:
  - frontend_runtime
  - editorial_refinement
  - interaction_refinement
execution_mode:
  - presentation_only
canonical_keys:
  encounter_keys:
    - educational_diagnostic_passage
    - educate_eval_encounter
    - structural_drift_dispatches
deploy: requires_confirmation
fallback_policy: report_only_no_invention
do_not_touch:
  - measures_publication_dispatch
  - iis_eval_gate1
  - cohort_conversion_encounter
  - landing_epigraph
  - measures_of_inanna
  - production_env_vars
validation:
  requires_build: true
  requires_deploy: false
---

# OAR2 — Educate Eval + Structural Drift Editorial Refinement

## Observed

The evaluation flow is now structurally coherent and deployed:

recognition passage
→ educate_eval_encounter
→ structural_drift_dispatches
→ evaluation intake

However:

- recognition passage video cuts copy visibility on some laptop screens
- educate_eval_encounter hierarchy feels visually unresolved
- Structural Drift preview still reads too close to a generic publication block
- footer system line has not yet been added
- CTA hierarchy is not yet visually resolved

No DB authority problems were identified.

This OAR is presentation refinement only.

## Aligned

The evaluation path must visually resolve as:

recognition
→ explanation
→ observed institutional analysis
→ evaluation action

The system should feel:

- institutional
- measured
- editorial
- restrained
- coherent
- progressive

It must not feel:

- like a startup landing page
- like a generic blog
- like stacked unrelated sections
- visually oversized or vertically drifting

## Routed

### 1. Recognition Passage Refinement

Surface:

educational_diagnostic_passage

Required changes:

- add subtle skip button
- preserve muted/unmuted control
- reduce excessive video height on laptops
- preserve visibility of recognition copy
- maintain cinematic presentation

Recommended constraints:

max-height: 58vh desktop
max-height: 48vh lower-height laptops
object-fit: contain

The page should preserve visibility of:

- recognition label
- headline
- subcopy
- skip action

without requiring immediate scroll.

### 2. educate_eval_encounter Hierarchy Refinement

Surface:

educate_eval_encounter

Required changes:

- reduce oversized empty vertical spacing
- tighten masthead rhythm
- improve diagnostic recognition readability
- create stronger sectional transitions
- establish clear reading progression

The page must visually guide the visitor through:

diagnostic recognition
→ Structural Drift dispatches
→ evaluation action

### 3. Structural Drift Preview Refinement

The Structural Drift section on the evaluation surface must render as:

native editorial dispatch preview

not:

generic Paragraph article block

Required render structure:

STRUCTURAL DRIFT
Dispatches from the Measures Registry

Then:

dispatch preview cards

using seated dispatches from:

public.measures_publication_dispatch

If seated:

- ISSUE 001 — Agents of Chaos
- ISSUE 002 — Structural Drift

Cards must visually resemble:

editorial dispatch plates

not:

simple hyperlinks

### 4. CTA Hierarchy

Primary CTA:

Begin Structural Evaluation

Secondary CTA:

Read Dispatches

Hierarchy must visually prioritize evaluation progression.

### 5. Footer System Surface

Footer required on:

- educate_eval_encounter
- structural_drift_dispatches

Footer copy:

© 2026 c3 Community Partners DAO, LLC

Measures Registry is a registered c3 Field system.

Only linked text:

c3 Field

Temporary route target:

/about

Footer styling:

- restrained
- small
- low-contrast
- institutional

No oversized branding treatment.

## Frontend Must

- preserve existing DB authority
- preserve seated dispatch rendering
- preserve dispatch order
- preserve evaluation routing
- improve editorial hierarchy
- improve visual rhythm
- improve responsive behavior
- render footer consistently

## Frontend Must Not

- modify DB schema
- modify dispatch records
- modify iis_eval_gate1 capture
- modify cohort_conversion_encounter
- modify landing epigraph logic
- invent dispatch content
- replace dispatches with embeds
- deploy without confirmation

## Validation

Cody must confirm:

- recognition passage copy remains visible on laptop viewport
- skip button renders correctly
- educate_eval_encounter spacing resolves coherently
- Structural Drift preview renders from seated dispatches
- footer renders on required surfaces
- build succeeds
- no DB changes performed
- no deploy performed

Build command:

npm.cmd run build:registry

## Success Condition

The educate/evaluate path resolves visually as a coherent institutional progression:

recognition
→ diagnostic explanation
→ registered dispatches
→ structural evaluation

without modifying authority surfaces, dispatch seating, or evaluation contracts.