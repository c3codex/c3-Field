# Email Confirmation / Passage Rule Reference

status: reference_input_only
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_package_reviewed_measures_registry_launch_structure_reference_inputs_v1.meta.md
runtime_mutation_authorized: false
db_mutation_authorized: false
frontend_mutation_authorized: false
email_provider_mutation_authorized: false

## Rule

After contact submit, passage media loads immediately.

The user remains on the passage page while the review loads.

Email confirmation is required for personalized report delivery.

The user should not be forced to leave the site to continue passage.

If the user confirms through an email link, the link must return them to the passage page.

## Return State

Return state must preserve:

- assessment state
- contact state
- SRC1/OAR1 trace
- passage media state
- risk-factor carrythrough
- recommended MAP path

## Suggested Passage Copy

Your AI Environment Assessment Review is being prepared.

Remain on this page while the review loads.

Confirm your email to receive your personalized report.

## Boundary

This reference input does not configure an email provider, generate confirmation links, mutate passage state, or change frontend behavior.
