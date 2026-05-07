---
document_type: oar2
title: OAR2 — Structural Drift Dispatches Rename + ISSUE 002 Seating
version: v1
status: ready_for_cody
system: measures_registry
execution_type:
  - db_seating
  - frontend_runtime
  - publication_surface
execution_mode:
  - full
canonical_keys:
  prior_encounter_key: structural_drift_field_guide
  encounter_key: structural_drift_dispatches
  publication_key: structural_drift
  dispatch_key: structural_drift_dispatch_v1
  issue_number: ISSUE 002
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
  requires_deploy: false
---

# OAR2 — Structural Drift Dispatches Rename + ISSUE 002 Seating

## Observed

Structural Drift has been seated under the prior encounter key:

structural_drift_field_guide

That wording no longer matches the registered publication identity.

Correct identity:

Structural Drift
Dispatches from the Measures Registry

The prior OAR has not deployed, so the encounter key may be corrected before public release.

Current dispatch state contains ISSUE 001 only:

agents_of_chaos_dispatch_v1

Missing dispatch:

ISSUE 002 — Structural Drift

## Aligned

Rename or replace the encounter to:

structural_drift_dispatches

The surface must render as:

native editorial dispatch surface

not:

field guide

Paragraph remains distribution only.

Codex / DB remains authority.

## Routed

### DB MUST SEAT / MIGRATE

If structural_drift_field_guide exists:

migrate or replace cleanly as structural_drift_dispatches

Cody must ensure:

no duplicate active Structural Drift encounter surfaces

Expected current key:

structural_drift_dispatches

Prior key:

structural_drift_field_guide

Prior key may be deprecated, inactive, removed, or redirected only if consistent with current DB conventions.

### Publication Identity

title: Structural Drift

subtitle: Dispatches from the Measures Registry

registry_marker: MEASURES REGISTRY ANALYSIS SURFACE

publication_key: structural_drift

### DB MUST SEAT ISSUE 002

publication_key: structural_drift
dispatch_key: structural_drift_dispatch_v1
issue_number: ISSUE 002
dispatch_type: FIELD NOTE
title: Structural Drift
diagnostic_thesis: When structure fails, intelligence amplifies instability.
article_url: https://paragraph.com/@measures-registry/structural-drift
capture_source: structural_drift_dispatch
status: published

### Editorial Refinement

Refine only presentation hierarchy:

- masthead spacing
- featured dispatch visual hierarchy
- issue number styling
- dispatch card rhythm
- restrained hover state
- footer spacing

No layout reinvention.

## Frontend Must

- render Structural Drift as Dispatches from the Measures Registry
- use encounter_key structural_drift_dispatches
- render ISSUE 001 and ISSUE 002 dynamically from dispatch table
- preserve issue order
- preserve Paragraph as distribution URL only
- report missing metadata honestly

## Frontend Must Not

- hardcode ISSUE 002 card
- invent article content
- leave duplicate active field-guide surface if migration is performed
- modify evaluation capture
- modify cohort conversion
- modify landing epigraph
- deploy without confirmation

## Validation

Cody must run:

select registry_key, release_state
from public.measures_registry
where registry_key in (
  'structural_drift_field_guide',
  'structural_drift_dispatches'
);

select encounter_key, metadata
from public.measures_encounter_def
where encounter_key in (
  'structural_drift_field_guide',
  'structural_drift_dispatches'
);

select publication_key, dispatch_key, issue_number, title, article_url, status
from public.measures_publication_dispatch
where publication_key = 'structural_drift'
order by issue_number;

Expected:

- active encounter: structural_drift_dispatches
- no duplicate active structural_drift_field_guide surface
- ISSUE 001 — Agents of Chaos
- ISSUE 002 — Structural Drift

Build must pass.

No deploy.

## Success Condition

Structural Drift renders as:

Structural Drift
Dispatches from the Measures Registry

through the structural_drift_dispatches encounter, with ISSUE 001 and ISSUE 002 seated from DB state and no frontend-authored publication truth.