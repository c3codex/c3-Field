---
document_type: directory_set_component_record
system_scope: measures_registry
component: assessment_logic
status: component_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_missing_measures_registry_launch_components_required_for_directory_set_v1.meta.md
---

# Assessment Logic Record

```yaml
assessment_logic_record:
  status: component_seated
  component: assessment_logic

  assessment_questions:
    Q1_organization_scope:
      function:
        - scope_modifier
        - pricing_complexity
      answers:
        A: Solo, micro, or small team
        B: Mid-size, multi-team, or departmental organization
        C: Large, multi-department, federated, or multi-environment organization

    Q2_operational_ownership:
      function: risk_factor
      answers:
        A: A named role or team is responsible.
        B: Responsibility is shared but not clearly documented.
        C: AI use happens across teams without a clear owner.

    Q3_process_consistency:
      function: risk_factor
      answers:
        A: We follow a documented and repeatable process.
        B: Some teams have a process, but it is not consistent.
        C: AI use varies by person, team, or situation.

    Q4_authority_boundaries:
      function: risk_factor
      answers:
        A: Changes are reviewed before they are adopted.
        B: Changes are sometimes reviewed, depending on the team.
        C: People can add or change AI use without a clear approval path.

    Q5_tool_integration_visibility:
      function: risk_factor
      answers:
        A: We can identify and account for them clearly.
        B: We know most of them, but not all connections or uses are visible.
        C: We do not have a reliable view of what is being used or connected.

    Q6_observed_AI_behavior:
      function: risk_signal_only
      answers:
        A: No, we have not observed concerning behavior.
        B: Yes, occasionally, but it has not been formally reviewed.
        C: Yes, and it is affecting trust, decisions, operations, or outcomes.

    Q7_current_AI_operations_state:
      function: C2_circuit_determination
      answers:
        A: We are preparing to deploy AI.
        B: AI is already in use, and behavior issues or operational concerns are visible.
        C: AI is already in use, and we want to improve structure, consistency, or oversight.

  answer_weights:
    A: 0
    B: 1
    C: 2

  risk_factor_selection:
    score_questions:
      - Q2_operational_ownership
      - Q3_process_consistency
      - Q4_authority_boundaries
      - Q5_tool_integration_visibility
      - Q6_observed_AI_behavior
    select: top_3_highest_risk_answers
    tie_break_order:
      - Q4_authority_boundaries
      - Q5_tool_integration_visibility
      - Q2_operational_ownership
      - Q3_process_consistency
      - Q6_observed_AI_behavior

  result_boundary:
    assessment_result_is_preliminary: true
    assessment_does_not_produce_ERROR: true
    assessment_does_not_diagnose_AI_behavior: true
```
