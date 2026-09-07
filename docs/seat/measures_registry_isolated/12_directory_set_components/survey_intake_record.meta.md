---
document_type: directory_set_component_record
system_scope: measures_registry
component: survey_intake
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Survey Intake Record

```yaml
survey_intake_record:
  status: component_seated
  component: survey_intake

  survey_purpose:
    public_copy: This survey is intended to identify operational, system, and environmental risk factors in your current AI operations context. It does not diagnose AI behavior. Your responses will be reviewed and used to provide an AI Operations Assessment recommendation.

  survey_CAR:
    constraint: The survey is intended to identify system and environment risk factors in the organization current AI operations context.
    agreement: The Organization Representative agrees that the survey does not diagnose AI behavior and that submitted answers will be reviewed within the MAP scope.
    resolution: Survey completion provides the reviewed intake basis for a structured MAP recommendation.

  survey_questions_or_provider_boundary:
    standing: pending
    allowed_options:
      - native_survey_surface
      - governed_external_provider
    provider_authority: not_Codex

  intake_trace:
    required: true
    standing: pending_schema_or_provider_mapping

  MAP_review_readiness_condition:
    requires:
      - survey_completed
      - intake_trace_exists
      - contact_scope_permits_MAP_delivery
      - payment_of_scope_confirmed_if_payment_required

  does_not_equal:
    - Environmental_Risk_Report_and_Operations_Review
    - ERROR
    - SEAL
    - Registry Standing
```
