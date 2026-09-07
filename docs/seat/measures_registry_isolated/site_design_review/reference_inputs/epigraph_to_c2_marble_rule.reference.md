# Epigraph to C2 Marble Rule Reference

status: reference_input_only
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_package_reviewed_measures_registry_launch_structure_reference_inputs_v1.meta.md
runtime_mutation_authorized: false
db_mutation_authorized: false
frontend_mutation_authorized: false

## Rule

Epigraph is the carrythrough decision surface.

Epigraph displays:

- AI Environment Findings
- three high-risk assessment answers
- review responses
- current environment state
- review determination

Epigraph does not rescore assessment.

Epigraph CTA loads correct C2 Marble encounter.

## Determination Mapping

- pre_deploy -> Environmental Alignment Prior to Deployment -> Pre-Deploy MAP encounter
- deployed_with_AI_behavior_detected -> Environmental Remediation -> Remediation MAP encounter
- deployed_no_behavior_detected -> Optimize Environment -> Optimization MAP encounter

## Boundary

C2 remains internal only unless separately authorized.

This reference input does not mutate assessment scoring, epigraph behavior, routing, or Marble encounter runtime.
