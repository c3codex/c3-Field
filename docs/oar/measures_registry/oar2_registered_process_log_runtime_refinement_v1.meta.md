---
document_type: oar2
title: OAR2 — Registered Process Log Runtime Refinement
version: v1
status: ready_for_cody
system: measures_registry
execution_type:
  - frontend_runtime
  - presentation_refinement
  - process_visibility
execution_mode:
  - presentation_only
canonical_keys:
  encounter_key: registered_process_log
  registry_key: registered_process_log
  data_source: public.registered_process_log
deploy: requires_confirmation
fallback_policy: report_only_no_invention
do_not_touch:
  - public.registered_process_log_schema
  - measures_of_inanna
  - structural_drift_dispatches
  - educate_eval_encounter
  - landing_epigraph
  - iis_eval_gate1
  - cohort_conversion_encounter
  - production_env_vars
validation:
  requires_db_connection: true
  requires_build: true
  requires_deploy: false
---

# OAR2 — Registered Process Log Runtime Refinement

## Observed

registered_process_log is now seated and rendered as a governed process visibility surface.

The runtime reads from:

public.registered_process_log

The surface now needs presentation refinement so it functions as a clear proof surface, not a raw process list.

No DB schema change is authorized.

## Aligned

The surface must visually express:

define
→ execute
→ prove
→ validate
→ authorize
→ reveal

It should make visible:

- execution standing
- validation standing
- deploy standing
- seeded standing
- role separation
- process provenance

It must not collapse these into a generic done status.

## Routed

### Runtime Layout

Required layout:

1. Surface masthead
2. Registered pattern line
3. Process standing summary
4. Process log cards/table
5. Status legend
6. Footer

### Masthead

Registered Process Log

Governed execution visibility for Measures Registry.

### Pattern Line

Define → Execute → Prove → Validate → Authorize → Reveal

### Process Standing Summary

Render compact counts from seated records:

- total records
- executed
- validated
- requires deploy confirmation
- deployed
- seeded
- transferred
- held

If counts are unavailable, report absence honestly.

### Process Record Display

Each process record should clearly show:

- process_key
- process_type
- execution_status
- validation_status
- deploy_status
- seeded_status
- executor
- validator
- operator
- oar2_reference
- oar1_reference
- created_at
- validated_at
- deployed_at
- closeout_state

Missing fields should render as:

- not recorded
- pending
- not required

Only if that is the actual seated state.

### Visual Direction

The surface should feel like:

- institutional ledger
- execution provenance surface
- governed systems registry

Not:

- analytics dashboard
- activity feed
- task board
- generic admin UI

## Frontend Must

- preserve DB-first process state
- preserve standing distinctions
- preserve role separation
- render missing values honestly
- improve readability
- improve status hierarchy
- keep newest records first

## Frontend Must Not

- modify DB schema
- insert process records
- invent status values
- collapse statuses into one badge
- hardcode rows
- modify execution workflow
- modify deploy behavior
- touch protected surfaces
- deploy automatically

## Validation

Cody must confirm:

- DB connection active
- registered_process_log records still read from DB
- no schema changes performed
- no records inserted or modified
- standing distinctions still visible
- role distinctions visible
- build succeeds
- no deploy performed

Build command:

npm.cmd run build:registry

## Success Condition

registered_process_log renders as a clear governed execution proof surface where process provenance, validation state, deploy standing, seeded standing, and role separation are readable without frontend-authored operational truth.