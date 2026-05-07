---
document_type: oar2
title: OAR2 — Structural Drift Field Guide Surface
version: v1
status: ready_for_cody
system: measures_registry
execution_type:
  - frontend_runtime
  - publication_surface
  - article_registry
  - footer_surface
execution_mode:
  - full
canonical_keys:
  encounter_key: structural_drift_field_guide
  parent_surface: educate_eval_encounter
  media_roles:
    - structural_drift_featured_image
  action_keys:
    - route_structural_drift_article
    - begin_structural_evaluation
deploy: requires_confirmation
fallback_policy: report_only_no_invention
do_not_touch:
  - measures_of_inanna
  - landing_epigraph
  - cohort_conversion_encounter
  - iis_eval_gate1
  - production_env_vars
validation:
  requires_db_connection: true
  requires_build: true
  requires_storage_check: true
  requires_deploy: false
---

# OAR2 — Structural Drift Field Guide Surface

## Observed

The evaluation encounter currently includes publication material, but the presentation does not yet resolve as a native editorial dispatch surface.

Structural Drift now contains multiple published articles and is expected to expand into an ongoing institutional analysis publication.

Paragraph remains a distribution surface, not the primary authority surface.

Frontend must render Structural Drift natively from seated publication state.

## Aligned

Publication identity:

Structural Drift  
Dispatches from the Measures Registry

Structural Drift must render as:

- native branded editorial surface
- registered observation surface
- institutional dispatch layer
- diagnostic registry analysis surface

It must not render as:

- generic blog
- plain list of links
- marketing feed
- social article list
- CMS template
- embedded external publication page

## Routed

### Surface Role

The field guide sits within the educate/evaluate progression.

Flow:

recognition passage
→ educate_eval_encounter
→ structural_drift_field_guide
→ begin_structural_evaluation

Purpose:

- institutional recognition
- environmental diagnosis
- structural pattern visibility
- governance awareness before evaluation

## Publication Identity

Registry marker:

MEASURES REGISTRY ANALYSIS SURFACE

Title:

Structural Drift

Subtitle:

Dispatches from the Measures Registry

Purpose copy:

Structural Drift documents recurring implementation failures, governance gaps, authority fragmentation, and environmental instability observed across AI-accelerated systems.

## Layout Structure

Required layout order:

1. registry marker
2. publication masthead
3. featured dispatch
4. dispatch index
5. evaluation CTA
6. footer

## Featured Dispatch Surface

The newest or designated featured article must render prominently as a large editorial dispatch card.

Initial seeded dispatches:

- ISSUE 001 — Agents of Chaos
- ISSUE 002 — Structural Drift

Frontend must render article metadata from seated publication records.

Frontend must not hardcode article cards.

## Dispatch Card Pattern

Each dispatch card must support:

- issue number
- dispatch type
- title
- diagnostic thesis
- article route
- optional image / texture / signal treatment

Example:

ISSUE 001  
FIELD NOTE  
Agents of Chaos

Behavior that is not registered cannot be governed.

Read dispatch →

Example:

ISSUE 002  
FIELD NOTE  
Structural Drift

When structure fails, intelligence amplifies instability.

Read dispatch →

## Visual Direction

The field guide must visually resolve as:

- dark editorial magazine
- registry field notes
- institutional dispatch surface
- obsidian/lapis surface
- thin silver dividers
- compact issue metadata
- strong typography
- restrained signal treatment

Hover behavior may use:

- subtle blue signal line
- restrained border shift
- low-opacity edge highlight

Do not use generic blog-grid styling.

Do not fill space with placeholder cards.

Two seated dispatches should render intentionally.

## Article Source Rule

Paragraph is distribution only.

Authority order remains:

Codex
→ Field
→ Measures
→ Chazz
→ frontend render
→ Paragraph distribution

Frontend must not depend on Paragraph embed rendering as primary display logic.

## Evaluation CTA

CTA placement occurs after article visibility.

CTA:

Begin Structural Evaluation

Action key:

begin_structural_evaluation

Purpose:

Allow institutions to move from recognition into structured diagnostic intake.

## Footer Surface

Footer required.

Footer copy:

© 2026 c3 Community Partners DAO, LLC

Measures Registry is a registered c3 Field system.

Only link:

c3 Field

Temporary route target:

/about

Do not link the formal business name yet.

## Future Expansion

The surface must support ongoing expansion of:

- dispatches
- field notes
- registry analysis
- governance observations
- implementation failures
- conversion education

Frontend must support article growth without redesign.

## Frontend Must

- render publication from seated article state
- render Structural Drift as a native branded editorial surface
- render issue-style dispatch cards
- preserve institutional editorial tone
- render featured dispatch hierarchy
- preserve evaluation progression hierarchy
- render footer consistently
- report missing article state honestly

## Frontend Must Not

- embed Paragraph as primary layout
- render plain article links as the primary surface
- hardcode article count
- simulate missing articles
- render generic blog styling
- collapse publication into marketing
- invent publication metadata
- modify evaluation capture flow
- modify cohort conversion encounter
- touch iis_eval_gate1 capture

## Validation

Cody must run:

select encounter_key, metadata
from public.measures_encounter_def
where encounter_key = 'structural_drift_field_guide';

Cody must confirm:

- DB connection active
- structural_drift_field_guide exists or exact absence reported
- article registry resolves or exact missing state reported
- featured dispatch role resolves correctly
- issue numbering renders from seated metadata or exact absence is reported
- footer renders correctly
- begin_structural_evaluation action resolves
- build succeeds
- no deploy performed

## Success Condition

structural_drift_field_guide renders as a native institutional dispatch surface that supports ongoing registry analysis, diagnostic recognition, and evaluation progression without collapsing into generic publication behavior.

Codex defines.
Field structures.
Measures registers.
Chazz routes.
Cody executes.
Frontend renders.